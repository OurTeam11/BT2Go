'use strict';

var Session = require('./session');
var constants = require('./constants');
var util = require('../util');
var config = require('../../config');

/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();

/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(callback) {
  wx.login({
    success: function (loginResult) {
      wx.getUserInfo({
        success: function (userResult) {
          console.log("getUser结果", userResult);
          callback(null, {
            code: loginResult.code,
            encryptedData: userResult.encryptedData,
            iv: userResult.iv,
            rawData: userResult.rawData,
            signature: userResult.signature,
            userInfo: userResult.userInfo,
          });
        },

        fail: function (userError) {
          var error = new LoginError(constants.ERR_WX_GET_USER_INFO, '获取微信用户信息失败，请检查网络状态');
          error.detail = userError;
          callback(error, null);
        },
      });
    },

    fail: function (loginError) {
      var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    },
  });
};


var noop = function noop() { };
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  loginUrl: null,
};

/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息

 接口调用method：get
 输入参数：code (String类型)
 返回数据：{status:200, registered: 0, session: '6c99d100-d325-11e7-aced-75c291307ed4'} (Json格式数据，status表示接口调用状态，registered表示是否需要进行用户注册，session为我们自己后台生成的session ID)
 */
var login = function login(options) {
  options = util.extend({}, defaultOptions, options);
  //console.log('options', options);
  if (!defaultOptions.loginUrl) {
    options.fail(new LoginError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
    return;
  }
  
  //liufeng test TODO.
  /*if (true) {
    getWxLoginResult(function (wxLoginError, wxLoginResult) {
      console.log("liufeng, test", wxLoginResult);
      options.success(wxLoginResult.userInfo);
      return;
    });
    return;
  }*/

  var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }

    var userInfo = wxLoginResult.userInfo;
    
    // 构造请求头，包含 code、encryptedData 和 iv
    var code = wxLoginResult.code;
    var encryptedData = wxLoginResult.encryptedData;
    var iv = wxLoginResult.iv;
    var header = {};

    var rawData = wxLoginResult.rawData;
    var signature = wxLoginResult.signature;

    header[constants.WX_HEADER_CODE] = code;
    header[constants.WX_HEADER_ENCRYPTED_DATA] = encryptedData;
    header[constants.WX_HEADER_IV] = iv;

    // code 放在data里面。
    options.data = { 'code': code };
    console.log("options.data,", options.data);
    // 请求服务器登录地址，获得会话信息
    wx.request({
      url: options.loginUrl,
      header: header,
      data: options.data,
      success: function (result) {
        var data = result.data;
        console.log("liufeng", result)
        // 成功地响应会话信息
        if (data && data.status == 200 && data.session) {
          if (data.registered == 1) {
            //只有这一个地方是真正的登录成功。并且是注册成功.
            console.log("登录成功,注册成功：", data)
            if (userInfo) {
              Session.Session.set(data.session);
              //Session.Userinfo.set(userInfo);
              Session.Userinfo.set(util.extend({}, { rawData: rawData, signature: signature }, userInfo));
              options.success(userInfo);
            } else {
              var errorMessage = '登录失败(' + data.error + ')：' + (data.message || '未知错误，可能UserInfo不存在.');
              var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
              options.fail(noSessionError);
            }
          } else if (data.registered == 0) {
            console.log("登录成功,还没有注册：", data);
            userInfoRegister(data.session, rawData, {
              registerSuccess: function (result) {
                //注册成功。
                console.log("注册成功", result);
                if (userInfo && result.status == 200 && result.msg == "ok") {
                  Session.Session.set(data.session);
                  //Session.Userinfo.set(userInfo);
                  Session.Userinfo.set(util.extend({}, { 'rawData': rawData, 'signature': signature }, userInfo));
                  options.success(userInfo);
                } else {
                  var errorMessage = '注册失败(' + data.error + ')：' + (data.message || '未知错误，可能UserInfo不存在.');
                  var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
                  options.fail(noSessionError);
                }
              },
              registerFail: function (error) {
                console.log("注册失败", error);
                Session.Session.clear();
                Session.Userinfo.clear();
                var errorMessage = '注册失败(' + data.error + ')：' + (result || data.message || '未知错误，可能服务器错误.');
                var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
                options.fail(noSessionError);
              },
              serverError: function (error) {
                var error = new LoginError(constants.ERR_LOGIN_FAILED, '注册失败，可能是网络错误或者服务器发生异常');
                options.fail(error);
              }
            });
            //调用注册接口. TODO. 1. 注册成功，返回用户信息，注册失败。删除用户信息。
          } else {
            var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, JSON.stringify(data));
            options.fail(noSessionError);
          }
          // 没有正确响应会话信息
        } else {
          var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, JSON.stringify(data));
          options.fail(noSessionError);
        }
      },

      // 响应错误
      fail: function (loginResponseError) {
        var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
      },
    });
  });

  //首先调用wx接口，checkSession。
  wx.checkSession({
    success: function () {
      var session = Session.Session.get();
      if (session) {
        console.log("check local session success, then check server session.");
        // check Server session.TODO
        var curUserinfo = Session.Userinfo.get();
        if (curUserinfo) {
          var rawd = curUserinfo.rawData;
          var sig = curUserinfo.signature;
          console.log("123", session, rawd, sig);
          //调用服务器checkSession接口。
          checkServerSession(session, rawd, sig, {
            checkSessionSuccess: function (result) {
              console.log("server check Success!!!");
              options.success(Session.Userinfo.get());
            },
            //返回非200的状态，check Session失败。
            checkSessionFail: function (result) {
              console.log("check Session fail:", result);
              if (result.status != 200) {
                Session.Session.clear();
                Session.Userinfo.clear();
                doLogin();
              }
            },
            serverError: function (result) {
              console.log("server Error:", result);
              var error = new LoginError(constants.ERR_LOGIN_FAILED, '检查Session失败，可能是网络错误或者服务器发生异常');
              options.fail(error);
            }
          });
        }
      } else {
        doLogin();
      }
    },
    fail: function () {
      Session.Session.clear();
      Session.Userinfo.clear();
      doLogin();
    },
  });
};

//liufeng, 服务器checkSession函数.
/*接口调用 method: post
  输入参数：session (String类型) ,
            rawData (String类型，由Json类型转化成String类型，getUserInfo里面的rawData字段中的数据),
            signature (String类型，getUserInfo里面的signature字段中的数据)
  返回数据：{status:200, msg: "ok"} (有可能返回其他非200的code,并给出错误信息)
*/
var checkServerSession = function (localSess, rawData, sig, callback) {
  var postData = { session: localSess, rawData: rawData, signature: sig};
  console.log("checkServerSession:", postData);
  wx.request({
    url: config.server.checkSession,
    data: postData,
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (result) {
      console.log('checksession,result', result.data.status);
      if (result.data.status == 200 && result.data.msg == 'ok') {
        callback.checkSessionSuccess(result.data.status);
      } else {
        callback.checkSessionFail(result.data);
      }
    },
    // 响应错误
    fail: function (error) {
      callback.serverError(error);
    },
  });
}

/* 3.http://localhost:3100/api/register
           接口调用method: post
           输入参数：session (String类型), userInfo (String类型，由Json类型转化成String类型，getUserInfo里面的userInfo字段中的数据)
           返回数据：{status:200, msg: "ok"} (有可能返回其他类型的信息，有包括错误说明)
           */
//注册接口。
var userInfoRegister = function (localSess, userInfo, callback) {
  var postData = { session: localSess, userInfo: userInfo};
  console.log("register postData:", postData);
  wx.request({
    url: config.server.register,
    data: postData,
    method: 'POST',
    header: {
      'content-type': 'application/json' //默认值
    },
    success: function (result) {
      console.log('register,result', result);
      var data = result.data;
      if (data.status == 200 && data.msg == 'ok') {
        callback.registerSuccess(data);
      } else {
        callback.registerFail(data);
      }
    },
    // 响应错误
    fail: function (error) {
      callback.serverError(error);
    },
  });
}

var setLoginUrl = function (loginUrl) {
  defaultOptions.loginUrl = loginUrl;
};

module.exports = {
  LoginError: LoginError,
  login: login,
  setLoginUrl: setLoginUrl,
};