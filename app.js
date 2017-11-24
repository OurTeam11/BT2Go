//app.js

var api = require('./utils/api');
var config = require('./config');
var showmsg = require('./utils/commontoast');

App({
  onLaunch: function () {
     var that = this;
      api.setLoginUrl(config.server.loginUrl);
      api.login({
        success(result) {
          console.log('登录成功', result);
          that.globalData.userInfo = result;
          that.globalData.hasUserInfo = true;
        },

        fail(error) {
          console.log('登录失败', error);
          that.globalData.userInfo = null;
          that.globalData.hasUserInfo = false;
          showmsg.showModel('登录失败', error);
        }
      });
  },

  onShow: function () {
    console.log('App Show')
  },

  onHide: function () {
    console.log('App Hide')
  },

  globalData: {
    userInfo: null,
    hasUserInfo:false
  }
})