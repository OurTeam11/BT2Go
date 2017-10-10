//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  //登陆View的click事件，调用全局app变量的getUserInfo方法。
  getUserInfo: function () {
    var that = this
    app.getUserInfo(function(user_info) {
      that.setData({
        userInfo: user_info,
        hasUserInfo: true
      })
    })
    
  }
})
