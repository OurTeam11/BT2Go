var app = getApp();
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeid: 0,
    curIndex:0,
    orderpage: 1,
    ordertype: 0, // 0-待付款，1-待发货， 2-待收货，3-订单完成，4-订单取消

    orderlist:[{id:'', total: 0, status:0, trackingNu:'', createTime:'', products:[]}],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("options",options);
    if (options.typeid == 'undefined') {
      this.setData({curIndex: 0});
      this.setData({ordertype: 0});
      console.log("liufeng, undefined typeid", options.typeid);
    } else {
      this.setData({typeid:options.typeid});
      console.log("liufeng, not undefined typeid", options.typeid);
      this.setData({curIndex: parseInt(options.typeid)});
      this.setData({ordertype: parseInt(options.typeid)});
    }
    
    this.getOrderList({
      getOrderListSuccess:function(result) {
         //给图片添加前缀。
         let tmplist = result.list;
         for (var i =0 ;i < tmplist.length; i++) {
           for (var j = 0; j < tmplist[i].products.length; j++) {
             tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
           }
         }
        that.setData({orderlist: tmplist});
      },
      getOrderListFailed:function(result) {
        
      }
    })
  },
  
  getOrderList:function(callback) {
    var that = this;
    api.request({
      // 要请求的地址
      url: config.server.getOrderList,
      data: { session: Session.Session.get(), page:parseInt(that.data.orderpage), type: parseInt(that.data.ordertype)},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        console.log("getOrderList", result.data);
        if (result.data.status === 200) {
          callback.getOrderListSuccess(result.data);
        } else {
          console.log("获取订单列表失败，返回值不是200")
          callback.getOrderListFailed(result.data.status);
        }

      },
      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
        callback.getOrderListFailed("获取订单列表失败");
      },
    });
  },

  toOrderDetail:function(e) {
     var orderid = e.currentTarget.dataset.orderno;
     console.log("ordernumber:",orderid);
     wx.navigateTo({
        url: './orderDetail/orderdetail?oid=' + orderid,
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {

        }
      })
  },

  //由于任何原因第一次没有支付成功，或者未支付
  //再次支付的时候会调用这个接口
  toPayOrder:function(e) {

    var orderid = e.currentTarget.dataset.orderno;
    console.log("toPayOrder:",orderid);
    var that =this;
    //confirmPay
     api.request({
      // 要请求的地址
      url: config.server.confirmPay,
      data: {session: Session.Session.get(), order: orderid},
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(result) {
        console.log("toPayOrder doPayment ok ----  ", result);
        if (result.data.status === 200) {
          let data = result.data.data;
          let payParams = {trade_no: data.out_trade_no, nonce:data.nonceStr,package:data.package,
                          timeStamp: data.timeStamp, paySign: data.paySign};
          that.setData({order_no:data.out_trade_no});// 服务器生成的订单。
          that.doWXRequestPayment(payParams);
          //支付成功后，刷新订单状态。

        } else {
          console.log("服务器返回失败。可能保存成未支付的订单");
          wx.redirectTo({
            url: '../paymentStatus/paystatus?paystatus=支付失败',
            success: function (res) {
              // success
              console.log("toPayOrder 显示结果界面，成功")
            },
          });
        }
      },
      fail(error) {
        showtoast.showModel('支付失败，toPayOrder 请求失败', error);
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
        wx.navigateTo({
          url: './paymentStatus/paystatus?paystatus=支付成功&orderno=' + order_no,
          success: function (res) {
            // success
            console.log("显示结果界面，成功")
          },
        });
      },
      'fail': function (res) {
        console.log("微信支付失败",res);
        wx.navigateTo({
          url: './paymentStatus/paystatus?paystatus=支付失败&orderno=' + order_no,
          success: function (res) {
            // success
            console.log("显示结果界面，失败。")
          },
        });
      }
    })
  },

  deleteOrder: function(e) {
    var orderid = e.currentTarget.dataset.orderno;
    console.log("deleteOrder:",orderid);
  },

  toTrackingStatus:function(e) {
    var trackingid = e.currentTarget.dataset.trackingid;
    console.log("toTrackingStatus:tid: ", trackingid);
    wx.navigateTo({
      url: './trackStatus/tracking?tid=' + trackingid,
      success: function (res) {
        // success
        console.log("显示结果界面，成功。")
      },
    });
  },

  toCancelOrder:function(e) {
    var orderid = e.currentTarget.dataset.orderno;
    console.log("toCancelOrder:",orderid);
  },
  toConfirmReceived:function(e) {
     //确认收货
  },

  bindTap:function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    console.log("liufeng", this.data.typeid);
    this.setData({curIndex: index});
    this.setData({ordertype:parseInt(index)});
    //request网络去获取对应的订单状态。
    var that = this;
    this.getOrderList({
      getOrderListSuccess:function(result) {
         //给图片添加前缀。
         let tmplist = result.list;
         for (var i =0 ;i < tmplist.length; i++) {
           for (var j = 0; j < tmplist[i].products.length; j++) {
             tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
           }
         }
        that.setData({orderlist: tmplist});
        
      },
      getOrderListFailed:function(result) {
        
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})