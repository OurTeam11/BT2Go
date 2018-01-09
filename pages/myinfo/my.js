//index.js
var app = getApp();
//获取应用实例
var api = require('../../utils/api');
var showtoast = require('../../utils/commontoast');
var config = require('../../config');

Page({
  data: {
    userInfo: {},
    hasUserInfo:false,
    
    // orderItems
    orderItems: [
      {typeId: 0,name: '待付款', imageurl: '../../images/order/waitforpay.png',},
      {typeId: 1,name: '待发货', imageurl: '../../images/order/waitforsend.png',},
      {typeId: 2,name: '待收货', imageurl: '../../images/order/waitforrecieve.png'},
      {typeId: 3,name: '已完成', imageurl: '../../images/order/waitforcomment.png'}
    ],
  },

  onLoad: function () {
    var that = this;
    console.log("userinfo:", app.globalData.userInfo);
    if (app.globalData.hasUserInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  getUserInfo:function() {
     var that = this
     if (app.globalData.hasUserInfo) {
       that.setData({
         userInfo: app.globalData.userInfo,
         hasUserInfo:true
       })
       return;
    }

    //TODO
    //如果没有授权，需要先进入授权界面。

    showtoast.showBusy('正在登录');
    api.setLoginUrl(config.server.loginUrl);
    api.login({
      success(result) {
        showtoast.showSuccess('登录成功');
        console.log('登录成功', result);
        that.setData({
          userInfo: result,
          hasUserInfo:true
        })
        app.globalData.userInfo = result;
        app.globalData.hasUserInfo =true;
      },

      fail(error) {
        showtoast.showModel('登录失败', error);
        console.log('登录失败', error);
        that.setData({
          userInfo: error,
          hasUserInfo:false
        })
        app.globalData.userInfo = null;
        app.globalData.hasUserInfo =false;
      }
    });
  },

  toOrder: function (e) {
    console.log(e);
    var typeid = e.currentTarget.dataset.typeid;
    
    wx.navigateTo({
      url: '../order/order?typeid=' + typeid,
    })
  },
});
