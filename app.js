//app.js

var api = require('./utils/api');
var config = require('./config');
var showmsg = require('./utils/commontoast');
var logger = require('./utils/logger');

App({
  onLaunch: function () {
    var that = this;
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

  onShow: function () {
    console.log('App Show')
  },

  onHide: function () {
    console.log('App Hide')
  },

  //获取用户setting成功后，需要调用login接口。
  userlogin: function () {
    //2. 调用登录接口。
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

  globalData: {
    userInfo: null,
    hasUserInfo: false,
  }
})