var constants = require('./constants');
var util = require('../util');
var Session = require('./session');
var login = require('./login');

var noop = function noop() { };

var buildAuthHeader = function buildAuthHeader(session) {
  var header = {};

  if (session) {
    header[constants.WX_HEADER_SKEY] = session;
  }

  return header;
};

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
  function RequestError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;

  return RequestError;
})();

/**
*@method
 * 
 * 网络request方法
 * @param {Object} options 登录配置
 * @param {bool} requireLogin true：需要处理登陆验证 ,  false: 不需要处理。
 * @param {string} [options.header] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.success(response) 调用成功后的回调函数，response应该是一个json对象。
 * @param {Function} options.fail(error) 调用失败后的回调函数，参数 error 错误信息
*/
function request(options) {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(constants.ERR_INVALID_PARAMS, message);
  }

  var requireLogin = options.login;
  var success = options.success || noop;
  var fail = options.fail || noop;
  var complete = options.complete || noop;
  var originHeader = options.header || {};

  // 成功回调
  var callSuccess = function () {
    success.apply(null, arguments);
    complete.apply(null, arguments);
  };

  // 失败回调
  var callFail = function (error) {
    fail.call(null, error);
    complete.call(null, error);
  };

  // 是否已经进行过重试
  var hasRetried = false;

  if (requireLogin) {
    doRequestWithLogin();
  } else {
    doRequest();
  }

  // 登录后再请求
  function doRequestWithLogin() {
    login.login({ success: doRequest, fail: callFail });
  }

  // 实际进行请求的方法
  //每次请求网络都需要带上session_key.
  options.data = util.extend({}, { 'session': Session.Session.get() }, options.data);
  //util.extend({}, defaultOptions, options);
  console.log("options.data:", options.data);
  function doRequest() {
    var authHeader = buildAuthHeader(Session.Session.get());

    wx.request(util.extend({}, options, {
      header: util.extend({}, originHeader, authHeader),

      success: function (response) {
        var data = response.data;

        var error, message;
        if (data && data.code === -1) {
          Session.Session.clear();
          Session.Userinfo.clear();
          // 如果是登录态无效，并且还没重试过，会尝试登录后刷新凭据重新请求
          if (!hasRetried) {
            hasRetried = true;
            doRequestWithLogin();
            return;
          }

          message = '登录态已过期';
          error = new RequestError(data.error, message);

          callFail(error);
          return;
        } else {
          callSuccess.apply(null, arguments);
        }
      },

      fail: callFail,
      complete: noop,
    }));
  };

};

module.exports = {
  RequestError: RequestError,
  request: request,
};