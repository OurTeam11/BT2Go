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
    ifNoAddress: false,//如果没有地址，提示用户要选择地址。

    orderTotalPrice:0, // 订单的总价格。用于显示。

    //地址信息, addr, consignee, contact, zipcode, status,
    addressInfo: {},

    //订单商品信息, 从购物车，或者订单详情界面进入后的商品列表。
    orderproducts: [],

    //订单号，服务器创建订单成功，会生成一个订单号。
    order_no: '',

    //是否购物车来的。如果购物车来的，生成订单后会删除购物车信息。
    ifCartCome:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    if (type == 'cart2order') {
      //从购物车过来的
      this.setData({orderproducts: JSON.parse(options.plist)});
      this.setData({ifCartCome:true});
    } else if (type == 'detail2order') {
      //从购物车过来的
      this.setData({ orderproducts: JSON.parse(options.plist) });
      this.setData({ifCartCome:false});
    }
    console.log('generateorder,onload.要生成订单的商品列表:',
      this.data.orderproducts);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //prepare订单接口需要这个参数，pid列表数组。
    let productids = [];
    for (var i in that.data.orderproducts) {
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
          for (var i = 0; i < addrs.length; i++) {
            if (addrs[i].status === 2) {
              console.log("地址赋值", addrs[i]);
              that.setData({ addressInfo: addrs[i] });
              break;
            } else {
              that.setData({ addressInfo: addrs[0] });
            }
          }
        }
        //设置价格。
        var prices = result.data.prices;
        console.log("服务器返回商品价格：" , prices);
        if (!prices || prices.length === 0) {
          console.log("获取价格失败");
        } else {
          //获取价格成功后，需要和orderproducts中的价格比较。最后算出一个总价。
          //{}
          var totalPrice = 0;
          var tmpproducts = that.data.orderproducts;

          for (var i = 0; i < prices.length; i++) {
            var id = prices[i].id;
            for (var j =0;j  < tmpproducts.length; j++) {
              if (id == tmpproducts[j].id) {
                tmpproducts[j].price = prices[i].price;
              }
            }
          }
          for (var i = 0; i < tmpproducts.length; i++) {
            totalPrice += tmpproducts[i].price * tmpproducts[i].count;
          }
          console.log("liufeng:",tmpproducts , totalPrice);
          that.setData({orderproducts:tmpproducts});
          that.setData({orderTotalPrice: totalPrice});
        }
      },
      failedPrepareOrder: function (result) {
        console.log(result);
      }
    });
  },

  //prepare， 进入订单界面需要调用这个接口。
  // 1， 返回地址，2 返回商品金额。用于显示。
  prepareOrder: function (productids, callback) {
    if (productids == 'undefined' || productids == []) {
      console.log("商品id列表为空或者undefined。:",productids);
      return;
    }

    var that = this;
    api.request({
      // 要请求的地址
      url: config.server.prepareOrder,
      data: {session: Session.Session.get(), pids: JSON.stringify(productids)},
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(result) {
        console.log("prepareOrder，response ---", result);
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
    //首先检查地址和商品是否为空。条件都满足了才能发起订单支付。
    if (this.data.ifNoAddress) {
      console.log('地址不能为空');
      return;
    }
    if (this.data.orderTotalPrice === 0) {
      console.log('订单数据获取失败，不能为空');
      return;
    }
    //首先保存成订单--代付款状态.
    var that = this;
    //创建order对象，用于给服务器传递order信息。
    let order = [];
    let totalPrice = that.data.orderTotalPrice;
    for (var i = 0; i < that.data.orderproducts.length; i++) {
      let toorder = {pid:that.data.orderproducts[i].id, amount:parseInt(that.data.orderproducts[i].count),
                      price:parseInt(that.data.orderproducts[i].price)};
      order.push(toorder);
    }

    console.log("order:", order, " total:", parseInt(totalPrice), "delivery:", that.data.addressInfo);

    api.request({
      // 要请求的地址
      url: config.server.createAndPay,
      data: {
        session: Session.Session.get(), order: JSON.stringify(order), delivery: JSON.stringify(that.data.addressInfo),
        total: parseInt(totalPrice)},
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
    wx.requestPayment({
      'timeStamp': payparams.timeStamp,
      'nonceStr': payparams.nonce,
      'package': payparams.package,
      'signType': 'MD5',
      'paySign': payparams.paySign,
      'success': function (res) {
        console.log("微信支付成功",res);
        wx.redirectTo({
          url: '../paymentStatus/paystatus?paystatus=支付成功&orderno=' + that.data.order_no,
          success: function (res) {
            // success
            console.log("显示结果界面，成功")
          },
        });
      },
      'fail': function (res) {
        console.log("微信支付失败",res);
        wx.redirectTo({
          url: '../paymentStatus/paystatus?paystatus=支付失败&orderno=' + that.data.order_no,
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