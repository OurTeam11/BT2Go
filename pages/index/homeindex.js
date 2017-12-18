//首页。
var WxSearch = require('../../wxSearch/wxSearch.js');
var app = getApp();
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //description, id, name, price, thumbnail.
    productitem: [],

    //swiper的一些变量控制
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    images:['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'],

    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,//“没有数据”的变量，默认false，隐藏

    page: 1, //请求页面。

    canRequestMore: false

  },

  //swiper切换函数
  swiperchange: function () {

  },

  
  doRequestRecommend:function() {
    var that = this;
    that.setData({canRequestMore:false});
    // api.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
    api.request({
      // 要请求的地址
      url: config.server.requestRecommendItem,
      data: {session:Session.Session.get(), page:that.data.page},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        showtoast.showSuccess('请求成功完成');
        if (result.data.list.length >= 20) {
          that.setData({canRequestMore:true});
        } else {
          that.setData({canRequestMore:false});
          that.setData({searchLoadingComplete : true});
        }
        for (var i = 0; i < result.data.list.length; i++) {
          //拼接humbnail的完整路径名字。
          result.data.list[i].thumbnail = 'http://localhost/image/' + result.data.list[i].thumbnail;
        }
        that.setData({
          productitem: result.data.list
        })
      },

      fail(error) {
        showtoast.showModel('请求失败', error);
      },

      complete() {
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log("onLoad,homeindex");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
    if (Session.Session.get() && Session.Userinfo.get()) {
      this.doRequestRecommend();
    } else {
      showtoast.showModel('登录失败', '您需要正常登陆才能够访问服务器');
    }
  },

  goToSearchPage:function() {
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");
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
    console.log("onPullDownRefresh");
    this.setData({page:1});
    this.setData({searchLoading : false});
    this.setData({searchLoadingComplete : false});
    this.doRequestRecommend();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.canRequestMore) {
      console.log("onReachBottom");
      this.setData({searchLoading : true});
      this.setData({searchLoadingComplete : false});
      //触发搜索，分页请求。
      this.data.page++;
      //请求服务器更多的数据
      this.doRequestRecommend();
    } else {
      this.setData({searchLoading : false});
      this.setData({searchLoadingComplete : true});
    }

  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



})