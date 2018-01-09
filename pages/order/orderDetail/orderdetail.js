var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');
var util = require('../../../utils/util')
var payment = require('../../../utils/lib/payment');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',
    orderStatus:'',
    orderresult:'',
    orderinfo:{address:'', ct:'', id:'', status:0, total:0, tracking_no:'', products:[]},

    showToPayButton:false,
    showCancelButton:false,
    showTrackingButton:false,
    showAlarmButton:false,
    showConfirmButton:false,
    showCommentButton:false,

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
        console.log("order detail:", data, util.formatTime(new Date()));  
        if (data.status === 200) {
          data.data.ct = util.formatTime2(data.data.ct);
          that.setData({orderinfo:data.data});
          that.updateOrderStatusString(parseInt(that.data.orderinfo.status));
          that.setData({orderresult:'获取订单成功'});
          console.log('获取订单详情',that.data.orderinfo);
          that.updateButtons(parseInt(that.data.orderinfo.status));
        } else {
          that.setData({ orderresult: '获取订单失败' });
        }
      },
      fail(error) {
        that.setData({ orderresult: '获取订单失败' });
      },
    });
  },

  updateButtons:function(type) {
    if (type === 0) {
      this.setData({ showToPayButton: true, showCancelButton:true});
    } else if (type === 1) {
      this.setData({ showAlarmButton: true, showCancelButton:true});
    } else if (type === 2) {
      this.setData({ showTrackingButton: true, showConfirmButton:true});
    } else if (type === 3) {
      this.setData({ showTrackingButton: true, showCommentButton: true });
    } else if (type ===4) {
      this.setData({
        showTrackingButton: true});
    }
  },
  updateOrderStatusString:function(type) {
    if (type === 0) {
      this.setData({ orderStatus:'待付款'});
    } else if (type === 1) {
      this.setData({ orderStatus: '待发货' });
    } else if (type === 2) {
      this.setData({ orderStatus: '待收货' });
    } else if (type === 3) {
      this.setData({ orderStatus: '已完成' });
    } else if (type === 4) {
      this.setData({ orderStatus: '全部' });
    }
  },
  //调用payment api.
  toPayOrder:function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    console.log("Order, DetailtoPayOrder:", orderid);
    var that = this;
    payment.doOrderPayment(orderid, {
      doOrderPaymentSuccess:function(result) {
        console.log("doOrderPaymentSuccess:",result);
        wx.redirectTo({
          url: '../paymentStatus/paystatus?paystatus=支付成功&orderno=' + orderid,
          success: function (res) {
            // success
            console.log("显示结果界面，成功")
          },
        });
      },
      doOrderPaymentFailed:function(result) {
        console.log("服务器返回失败。可能保存成未支付的订单", result);
        wx.redirectTo({
          url: '../paymentStatus/paystatus?paystatus=支付失败&orderno=' + orderid,
        });
      }
    })
  },
 
  toCancelOrder: function (e) {

  },
  toTrackInfo: function (e) {
    var trackingid = e.currentTarget.dataset.trackingid;
    console.log("toTrackingStatus:tid: ", trackingid);
    wx.navigateTo({
      url: '../trackStatus/tracking?tid=' + trackingid,
      success: function (res) {
        // success
        console.log("显示结果界面，成功。")
      },
    });
  },
  toAlarm: function (e) {

  },
  toConfirm: function (e) {

  },
  toAddComments: function (e) {

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