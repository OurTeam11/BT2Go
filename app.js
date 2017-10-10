//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },

  //用户登陆方法
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session'
          //   +'?appid=wxd9ffe176e5321152'
          //   +'&secret=8275759e10274ccb6957b315dd07a071'
          //   +'&js_code='+res.code
          //   +'&grant_type=authorization_code', //换取openId,...

          //   method:'POST',
          //   success: function (res) {
          //     getApp().globalData.useropenid=res.data.openid
          //     getApp().globalData.usersession_key=res.data.session_key
          //     console.log(res)
          //     console.log(getApp().globalData.useropenid)
          //     console.log(getApp().globalData.usersession_key)
          //   }
          // })
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res.userInfo)
              this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    useropenid: null,
    usersession_key: null
  }
})