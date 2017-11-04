const app = getApp();

//商品编号。
var itemcode = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressinfo:{"costumername" : "刘峰", "phonenumber" : "13811060120", "addr" : "北京市，海淀区联想大厦5楼"},
    itemname:"",
    itempicurl:"",
    itemprice: 0.1,
    itemcount : 2,
    freight:10,
    sumcount:0,
    userDataInfo:{}


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("generator order" + options.code);
    itemcode = options.code;

    console.log("generator order" + options.count);
    this.setData({itemcount:options.count});
    this.setData({
      userInfo: app.globalData.userInfo
    });

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