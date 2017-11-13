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
  }
})