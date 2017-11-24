//首页。
var WxSearch = require('../../wxSearch/wxSearch.js');
var app = getApp();
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productitem: [
      {
        "code": "", //商品编码
        "name": "", //商品名称
        "imgs": [], //商品图片
        "price": "", //商品价格
      }
    ],
    //swiper的一些变量控制
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
  },

  //swiper切换函数
  swiperchange: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //sliderList
    var that = this
    api.request({
      url: "http://huanqiuxiaozhen.com/wemall/slider/list",
      login: false,
      success(result) {
        //showtoast.showSuccess('请求成功完成');
        console.log('request success', result);
        that.setData({
          images: result.data
        });
      },
      fail(error) {
        //showtoast.showModel('请求失败', error);
        console.log('request fail', error);
      },
      complete() {
        console.log('request complete');
      }
    });

    // api.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
    api.request({
      // 要请求的地址
      url: /*this.data.requestUrl*/"http://118.190.208.121/tcsystem/api/item/list?page=1",
      data:{X : 123, Y  : 456},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      login: false,
      method: 'GET',
      success(result) {
        showtoast.showSuccess('请求成功完成');
        console.log('request success', result);
        that.setData({
          productitem: result.data.list
        })
      },

      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    });
  },

  wxSerchFocus: function (e) {
    var that = this
    //WxSearch.wxSearchFocus(e, that);
    wx.navigateTo({
      url: '../searchpage/searchpage',
      success: function (res) {
        console.log("success" + res)
      },
      fail: function (res) { "fail" + console.log(res) },
      complete: function (res) { "complete" + console.log(res) },
    })
  },
  wxSearchBlur: function (e) {
    console.log("liufeng,wxSearchBlur");
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

  },

})