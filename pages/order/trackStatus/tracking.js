var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company:'',
    trackinfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var trackingid = options.tid;
    this.getTrackingStatus(trackingid);
  },

  getTrackingStatus:function(tid) {
    var that = this;
    console.log(config.server.queryOrderTracking,tid);
    api.request({
      url: config.server.queryOrderTracking,
      data: { session: Session.Session.get(), tracking_no: tid},
      method: 'GET',
      success(result) {
        var data = result.data;
        console.log("tracking detail:", data);
        if (data.status === 200) {
          that.setData({ company: data.data.company });
          that.setData({ trackinfo: data.data.list.reverse() });
        } else {
          that.setData({orderresult: '获取物流信息失败'});
        }
      },
      fail(error) {
        that.setData({orderresult: '获取物流失败'});
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