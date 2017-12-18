var oneobj = require('./orderobject');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeid: 0,
    curIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options",options);
    if (options.typeid == 'undefined') {
      this.setData({curIndex: 0});
      console.log("liufeng, undefined typeid", options.typeid);
    } else {
      this.setData({typeid:options.typeid});
      console.log("liufeng, not undefined typeid", options.typeid);
      this.setData({curIndex: parseInt(options.typeid)});
    }
    
    // var tt = oneobj.doSum(1, 3, function(sum){
    //      console.log("callback:" , sum);
    // });
    // console.log("tt:" , tt);

    // var test = oneobj.doTest(-1,
    //     {success:function(callback) {
    //      console.log("success:" , callback);
    //     },
    //     fail:function(callback) {
    //       console.log("fail:" , callback);
    //     }}
    //   );
  },

 bindTap:function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    console.log("liufeng", this.data.typeid);
    this.setData({curIndex: index});
    //request网络去获取对应的订单状态。
    
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