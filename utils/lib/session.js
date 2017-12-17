/**
 通过storage获取session和userinfo。
*/
var cons = require('./constants');
var SESSION_KEY = 'app-sessionkey-' + cons.TMP_SESSION_ID;
var USER_INFO_KEY = 'app-userinfokey-' + cons.TMP_USER_INFO;
var ADDRESS_INFO = 'app-useraddrkey-' + cons.LOCAL_ADDRESS_ALL;

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

var AddressInfo = {
  get: function () {
    return wx.getStorageSync(ADDRESS_INFO) || null;
  },

  set: function (address_info) {
    wx.setStorageSync(ADDRESS_INFO, address_info);
  },

  clear: function () {
    wx.removeStorageSync(ADDRESS_INFO);
  }
}

module.exports = {
	Session:Session,
	Userinfo:Userinfo,
	AddressInfo:AddressInfo
}