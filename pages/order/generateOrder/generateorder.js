const app = getApp();
var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单信息对象，用于后台返回的prepare订单。addres, productTotalPrice,
    orderData: {},

    ifNoAddress: false,

    //地址信息, addr, consignee, contact, zipcode, status,
    addressInfo: {},

    //订单商品信息, 从购物车，或者订单详情界面进入后的商品列表。
    orderproducts: [],

    //订单号，服务器创建订单成功，会生成一个订单号。
    order_no: '',

    //是否购物车来的。
    ifCartCome:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("prepare and create.")
    var that = this;
    var type = options.type;
    if (type == 'cart2order') {
      //从购物车过来的
      that.setData({ orderproducts: JSON.parse(options.plist) });
      console.log('generator:', that.data.orderproducts);
      that.setData({ifCartCome:true});
    } else if (type == 'detail2order') {
      //从购物车过来的
      that.setData({ orderproducts: JSON.parse(options.plist) });
      console.log('detail2order:', that.data.orderproducts);
      that.setData({ifCartCome:false});
    }
  },

  //prepare， 进入订单界面需要调用这个接口。
  // 1， 返回地址，2 返回商品金额。用于显示。
  prepareOrder: function (productids, callback) {
    var that = this;
    console.log("prepare ids:", productids);
    api.request({
      // 要请求的地址
      url: config.server.prepareOrder,
      data: { session: Session.Session.get(), pids: JSON.stringify(productids) },
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(result) {
        console.log("data,response---", result);
        var data = result.data;
        if (data.status === 200) {
          callback.getDefaultAddressAndPrice(data);
        } else if (data.status === 403 && data.msg == 'No address found') {
          // 没有地址。
          that.setData({ ifNoAddress: true });
          console.log("地址为空, 请新建地址");
          callback.failedPrepareOrder(data.status);
        } else {
          console.log("获取地址列表失败，返回值不是200")
          callback.failedPrepareOrder(data.status);
        }

      },
      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
        callback.failedGetAddress("获取地址失败");
      },
    });
  },

  addressClick: function () {
    var that = this;
    if (that.data.ifNoAddress) {
      //没有地址
      wx.navigateTo({
        url: '../../addrmgr/newAddrs/newAddrs?flag=generateorder',
        success: function (res) {
          // success
          that.setData({addressInfo:{}});
          console.log("back......")
        },
        fail: function () {
          // fail
        },
        complete: function () {

        }
      })
    } else {
      wx.navigateTo({
        url: '../../addrmgr/chooseAddrs/chooseAddrs?flag=generateorder',
        success: function (res) {
          // success
          that.setData({ addressInfo: {} });
          console.log("back......")
        },
      })
    }
    
  },

  //微信付款函数调用。调用后台服务器付款接口。createAndPay
  doPayment: function () {
    //首先保存成订单--代付款状态。
    var that = this;
    let order = [{pid:'', amount:0, price:0}];
    for (var i = 0; i < that.data.orderproducts.length; i++) {
      console.log("orderproducts:", that.data.orderproducts[i].id);
      let toorder = {pid:that.data.orderproducts[i].id, amount:parseInt(that.data.orderproducts[i].count),
                      price:parseInt(that.data.orderproducts[i].price)};
      order.push(toorder);
    }

    let total = that.data.orderData.productTotalPrice;
    console.log("order:", order, " total:", total, "delivery:", that.data.addressInfo);

    api.request({
      // 要请求的地址
      url: config.server.createAndPay,
      data: {
        session: Session.Session.get(), order: JSON.stringify(order), delivery: JSON.stringify(that.data.addressInfo),
        total:total},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(result) {
        console.log("doPayment ok ----  ", result);
        if (result.data.status === 200) {
          let data = result.data.data;
          let payParams = {trade_no: data.out_trade_no, nonce:data.nonceStr,package:data.package,
                          timeStamp: data.timeStamp, paySign: data.paySign};
          that.setData({order_no:data.out_trade_no});// 服务器生成的订单。
          that.doWXRequestPayment(payParams);
          //TODO无论支付是否成功，都要删除 购物车物品。
          //orderproducts
          if (that.data.ifCartCome) {
            api.request({
              // 要请求的地址
              url: config.server.deleteFromCart,
              data: {session:Session.Session.get(), productId: that.data.orderproducts[0].id},
              // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
              header: {
                'content-type': 'application/json' // 默认值
              },
              method: 'POST',
              success(result) {
                var data = result.data;
                if (data.status === 200 && data.msg == 'ok') {
                  console.log('删除购物车物品成功');
                } else {
                  console.log('删除购物车物品失败');
                }
              },
              fail(error) {
                showtoast.showModel('请求失败', error);
                console.log('request fail', error);
              },
            });
          }
        } else {
          console.log("服务器返回失败。可能保存成未支付的订单");
          wx.redirectTo({
            url: '../paymentStatus/paystatus?paystatus=支付失败',
            success: function (res) {
              // success
              console.log("显示结果界面，成功")
            },
          });
        }
      },
      fail(error) {
        console.log("服务器返回失败。可能保存成未支付的订单。pay", error)
      },
    });
  },

  doWXRequestPayment: function (payparams) {
    var that = this;
    console.log("doWXRequestPayment----param:", payparams);
    let order_no = that.data.order_no;
    wx.requestPayment({
      'timeStamp': payparams.timeStamp,
      'nonceStr': payparams.nonce,
      'package': payparams.package,
      'signType': 'MD5',
      'paySign': payparams.paySign,
      'success': function (res) {
        console.log("微信支付成功",res);
        wx.redirectTo({
          url: '../paymentStatus/paystatus?paystatus=支付成功&orderno=' + order_no,
          success: function (res) {
            // success
            console.log("显示结果界面，成功")
          },
        });
      },
      'fail': function (res) {
        console.log("微信支付失败",res);
        wx.redirectTo({
          url: '../paymentStatus/paystatus?paystatus=支付失败&orderno=' + + order_no,
          success: function (res) {
            // success
            console.log("显示结果界面，失败。")
          },
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady..")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow..", );
    var that = this;
    let productids = [];
    for (var i = 0; i < that.data.orderproducts.length; i++) {
      productids[i] = that.data.orderproducts[i].id;
    }
    that.prepareOrder(productids, {
      //成功的，肯定是返回200，并且带地址和价格的。
      getDefaultAddressAndPrice: function (result) {
        console.log("prepareOrder,response:", result);
        var addrs = result.data.address;
        console.log(addrs);
        if (!addrs || addrs.length === 0) {
          that.setData({ ifNoAddress: true });
          console.log("地址为空");
        } else {
          for (var j = 0; j < addrs.length; j++) {
            if (addrs[j].status === 2) {
              console.log("地址赋值", addrs[j]);
              that.setData({ addressInfo: addrs[j] });
              break;
            } else {
              that.setData({ addressInfo: addrs[0] });
            }
          }
        }
        //设置价格。
        var prices = result.data.prices;
        if (!prices || prices.length === 0) {
          console.log("获取价格失败");
        } else {
          var totalPrice = 0;
          for (var p = 0; p < prices.length; p++) {
            totalPrice += prices[p].price;
          }
        }
        let orderdata = {
          status: 1, productTotalPrice: totalPrice,
          productCoupon: 0, productTotalFreight: 10, address: addrs
        };
        that.setData({ orderData: orderdata });
      },
      failedPrepareOrder: function (result) {
        console.log(result);
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})