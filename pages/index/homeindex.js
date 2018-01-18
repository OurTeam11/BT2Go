'use strict';
//首页。
var WxSearch = require('../../wxSearch/wxSearch.js');
var app = getApp();
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');
var logger = require('../../utils/logger');

var showmsg = require('../../utils/commontoast');

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
    images:['http://118.190.208.121/image/1-1513659439954.png',
      'http://118.190.208.121/image/2-1513659444691.png',
      'http://118.190.208.121/image/3-1513659448845.png',
      'http://118.190.208.121/image/4-1513659453228.png'],

    showText: false, //"上拉加载"的变量，默认false，隐藏
    textHint:'',

    page: 1, //请求页面。
    showAllItems:false,

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
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        if (result.data.list.length === 0) {
          that.setData({ showText: true });
          that.setData({ showAllItems: true });
          that.setData({ textHint: "已经加载全部商品" });
          return;
        }
        if (result.data.list.length === 20) {
            that.setData({ showText:true});
            that.setData({ textHint: "下拉加载更多商品" });
        } else {
          that.setData({ showText: true });
          that.setData({ showAllItems:true});
          that.setData({ textHint: "已经加载全部商品" });
        }
        for (var i = 0; i < result.data.list.length; i++) {
          //拼接humbnail的完整路径名字。
          result.data.list[i].thumbnail = config.imgUrlPrefix + result.data.list[i].thumbnail;
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
    var that = this;
   //TODO:未来登陆放在这里里面。
       //1. 首先获取用户授权情况。
    wx.getSetting({
      success(res) {
        logger.log('res.authSetting', res.authSetting['scope.userInfo']);
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用getUserInfo功能，后续调用 wx.getUserInfo 接口不会弹窗询问
              logger.log('授权成功！！！！');
              that.userlogin();
            },
            fail() {
              logger.log('没有授权成功。');
              //TODO:之后可以弹出一个界面提示用户授权。
              wx.showModal({
                title: '没有授权',
                content: '之前用户没有授权，请点击确定进入授权界面',
                success: function (res) {
                  if (res.confirm) {
                    wx.hideToast();
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.userInfo']) {
                          that.userlogin();
                        } else {
                          wx.showModal({
                            title: '没有授权',
                            content: '您需要授权获取用户信息，图片，才能正常登陆，请下一次授权，或者在‘我的设置’中设置',
                            showCancel: false
                          });
                        }
                        // res.authSetting = {
                        //   "scope.userInfo": true
                        //  };
                        logger.log('res.authSetting', res.authSetting['scope.userInfo']);
                      }
                    });
                  } else if (res.cancel) {
                    wx.showModal({
                      title: '没有授权',
                      content: '您需要授权获取用户信息，图片，才能正常登陆，请下一次授权，或者在‘我的设置’中设置',
                      showCancel: false
                    });
                  }
                }
              });
            }
          })
        } else {
          that.userlogin();
        }
      }
    });
  },

  //获取用户setting成功后，需要调用login接口。
  userlogin: function () {
    //2. 调用登录接口。
    var that = this;
    api.setLoginUrl(config.server.loginUrl);
    api.login({
      success(result) {
        app.globalData.userInfo = result;
        app.globalData.hasUserInfo = true;
        console.log('登录成功', app.globalData.userInfo, app.globalData.hasUserInfo);
        //d登陆成功，调用推荐接口。
        if (Session.Session.get() && Session.Userinfo.get()) {
          that.doRequestRecommend();
        }
      },

      fail(error) {
        console.log('登录失败', error);
        app.globalData.userInfo = null;
        app.globalData.hasUserInfo = false;
        showmsg.showModel('登录失败', error);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
    // 
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
    this.setData({ showText: false });
    this.setData({ textHint: "" });
    this.setData({ showAllItems:false});
    this.doRequestRecommend();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.showAllItems) {
      console.log("已经加载了所有商品。");
      return;
    }
    this.setData({ showText: true });
    this.setData({ textHint: "正在加载更多商品..." });
    //触发搜索，分页请求。
    this.data.page++;
    //请求服务器更多的数据
    this.doRequestRecommend();
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



})