/**
 通过storage获取session和userinfo。
*/
var cons = require('./constants');
var SESSION_KEY = 'app-sessionkey-' + cons.TMP_SESSION_ID;
var USER_INFO_KEY = 'app-userinfokey-' + cons.TMP_USER_INFO;

var Session = {
	get : function() {
		return wx.getStorageSync(SESSION_KEY) || null;
	},

	set : function(session_value) {
		wx.setStorageSync(SESSION_KEY, session_value);
	},

	clear : function() {
		wx.removeStorageSync(SESSION_KEY);
	}
}

var Userinfo = {
  get: function () {
    return wx.getStorageSync(USER_INFO_KEY) || null;
  },

  set: function (userinfo_value) {
    wx.setStorageSync(USER_INFO_KEY, userinfo_value);
  },

  clear: function () {
    wx.removeStorageSync(USER_INFO_KEY);
  }
}

module.exports = {
	Session:Session,
	Userinfo:Userinfo
}