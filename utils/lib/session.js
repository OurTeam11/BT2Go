var cons = require('./constants');
var SESSION_KEY = 'app-sessionkey-' + cons.TMP_SESSION_ID;

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

module.exports = Session;