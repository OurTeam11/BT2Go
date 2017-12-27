var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',
    orderStatus:'',
    orderresult:'',
    orderinfo:{address:'', ct:'', id:'', status:0, total:0, tracking_no:'', products:[]},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var oid = options.oid;
    this.setData({orderid:oid});
    this.getOrderDetail(oid);
  },
  
  getOrderDetail:function(oid) {
    var that = this;
    console.log(config.server.getOrderDetail + oid);
    api.request({
      url: config.server.getOrderDetail+oid,
      data: { session: Session.Session.get()},
      method: 'GET',
      success(result) {
        var data = result.data;
        console.log("order detail:", data);  
        if (data.status === 200) {
          that.setData({orderinfo:data.data});
          that.setData({orderresult:'获取订单成功'});
          console.log('获取订单详情',that.data.orderinfo);
        } else {
          that.setData({ orderresult: '获取订单失败' });
        }
      },
      fail(error) {
        that.setData({ orderresult: '获取订单失败' });
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