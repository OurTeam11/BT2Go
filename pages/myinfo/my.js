//index.js
var app = getApp();
//获取应用实例
var api = require('../../utils/api');
var showtoast = require('../../utils/commontoast');

Page({
  data: {
    userInfo: {},
    hasUserInfo:false,
    
    // orderItems
    orderItems: [
      {
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png',
      },
      {
        typeId: 1,
        name: '待发货',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png',
      },
      {
        typeId: 2,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png'
      },
      {
        typeId: 3,
        name: '待评价',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png'
      }
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
    showtoast.showBusy('正在登录');
    api.login({
      success(result) {
        showtoast.showSuccess('登录成功');
        console.log('登录成功', result);
        that.setData({
          userInfo: {},
          hasUserInfo:true
        })
      },

      fail(error) {
        showtoast.showModel('登录失败', error);
        console.log('登录失败', error);
        that.setData({
          userInfo: error,
          hasUserInfo:false
       })
      }
    });
  },

  toOrder: function (e) {
    var typeid = e.currentTarget.dataset.typeid;
    console.log(typeid);
    wx.navigateTo({
      url: '../order/order?typeid=' + typeid,
    })
  },
});
