const app = getApp();
var oneobj = require('./orderobject');

//商品编号。
var pcode = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单信息对象。
    orderobj:{},

    //一个订单可能包含多个商品，商品列表。
    productlist:[],
    producttypenumber:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({producttypenumber:options.producttypenum});
     var pnum = options.producttypenum;
     this.setData({productlist:JSON.parse(options.plist)});
      for (var i=0 ; i < pnum; i++) {
        oneobj.orderObj.orderprice += this.data.productlist[i].price;
      }
     oneobj.orderObj.orderAddress = "北京市朝阳区。";
     oneobj.orderObj.productlist = this.data.productlist;
     console.log(oneobj.orderObj);
     //绑定UI
     this.setData({orderobj:oneobj.orderObj});

  },

  onPay : function() {
    var that = this;
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
        console.log(res)
      },
      'fail': function (res) {
        console.log(res)
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