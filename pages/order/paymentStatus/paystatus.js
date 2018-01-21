var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordernumber:'',
    orderprice:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({orderprice: options.orderprice});
    this.setData({ordernumber: options.orderno});
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

  toCheckOrder:function(e) {
    var ordertype = e.currentTarget.dataset.index;
    wx.redirectTo({
      url: '../order?typeid=' + ordertype,
      success: function (res) {
        // success
        console.log("显示订单结果界面，成功");
      },
    });
  },

  toGoShopping:function() {
    wx.switchTo({
      url: '../../index/homeindex',
      success: function (res) {
        // success
        console.log("显示购物主页界面，成功");
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