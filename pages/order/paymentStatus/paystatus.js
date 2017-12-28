var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    payStatus:'',
    ordernumber:'',
    payResult:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({payStatus: options.paystatus});
    this.setData({ordernumber: options.orderno});
    var that = this;
    if (this.data.payStatus == '支付成功') {
      //查看订单状态。
      this.getPaymentStatus(that.data.ordernumber, {
        getPaymentSuccess:function(result) {
          that.setData({payResult:'支付成功'});
          console.log("查询结果成功，微信支付成功");
        },
        getPaymentFailed:function(error) {
          that.setData({payResult:'支付失败'});
        }
      });

    } else if (this.data.payStatus == '支付失败') {
      that.setData({payResult:'支付失败'});
    } else {

    }
  },

  getPaymentStatus:function(orderno, callback) {
    api.request({
      // 要请求的地址
      url: config.server.queryOrderStatus + orderno,
      data: { session: Session.Session.get(), oid: orderno},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        if (result.data.status === 200) {
          callback.getPaymentSuccess(result.data);
        } else {
          console.log("查询订单状态失败，返回值不是200")
          callback.getPaymentFailed(result.data.status);
        }

      },
      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
        callback.getPaymentFailed("查询订单状态失败");
      },
    });
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
    //c查看订单状态。
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