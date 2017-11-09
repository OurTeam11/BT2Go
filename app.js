//app.js

var api = require('./utils/api');
var config = require('./config');


App({
  onLaunch: function () {
      api.setLoginUrl(config.server.loginUrl);
  },

  onShow: function () {
    console.log('App Show')
  },

  onHide: function () {
    console.log('App Hide')
  },

/**
     * 点击「登录」按钮，测试登录功能
     */
    doLogin () {
      var that = this;
        //showBusy('正在登录');

        // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
        that.api.login({
            success(result) {
                showSuccess('登录成功');
                console.log('登录成功', result);
            },

            fail(error) {
                showModel('登录失败', error);
                console.log('登录失败', error);
            }
        });
    },
    
  globalData: {
    userInfo: null,
    useropenid: null,
    usersession_key: null
  }
})