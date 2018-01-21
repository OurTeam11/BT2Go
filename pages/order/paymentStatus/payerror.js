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
    this.setData({ orderprice: options.orderprice });
    this.setData({ ordernumber: options.orderno });
  },
  toCheckOrder: function (e) {
    var ordertype = e.currentTarget.dataset.index;
    wx.redirectTo({
      url: '../order?typeid=' + ordertype,
      success: function (res) {
        // success
        console.log("显示订单结果界面，成功");
      },
    });
  },

  toGoShopping: function () {
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