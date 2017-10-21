//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    imagetest:[]
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
    
  },

  showImages:function() {
    var that = this
    wx.request({
      url: 'http://118.190.208.121/tcsystem/API/item/getjson/3035009481018179', //仅为示例，并非真实的接口地址
      method:'GET',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({imagetest:res.data.data.imgs})
        //that.setData({imagetest:res.data.imgs})
        console.log(res.data.data)
      }
    })
  }
})
