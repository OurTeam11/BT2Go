var WxSearch = require('../../wxSearch/wxSearch.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false,  // loading
    venuesItems:{}
  },
 swiperchange:function() {

 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //sliderList
    var that = this

    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/slider/list',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          images: res.data
        })
      }
    })

    //venuesList
    wx.request({
      url: 'http://118.190.208.121/tcsystem/api/item/list?page=1',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          venuesItems: res.data.list
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
      }
    })
  },

  wxSerchFocus: function (e) {
    var that = this
    //WxSearch.wxSearchFocus(e, that);
    wx.navigateTo({
      url: '../searchpage/searchpage',
      success: function (res) { console.log("success" + res)},
      fail: function (res) { "fail" + console.log(res)},
      complete: function (res) { "complete" + console.log(res)},
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