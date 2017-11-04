const API = 'http://118.190.208.121/tcsystem/api/item/';

// get 方法。ES6写法也ok
//const get = (cmd, params, callback) => {
var getReq = function(cmd, params, callback) {
  params.token = wx.getStorageSync('tokenid') || '';
  wx.showToast({
    title: '数据加载中...',
    icon: 'loading',
    duration: 4000
  });
  wx.request({
    url: API + cmd,
    data: params,
    header: {
      'Accept': 'application/json'
    },
    success: function (res) {
      wx.hideToast();
      console.log(res.data);
      if (res.statusCode != 200) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: 'rgb(251,93,93)',
          content: res.statusCode + ',' + res.errMsg,
          success: (res) => {
            callback('getReq error!')
          }
        })
        return
      }
      var data = res.data;
      if (typeof (callback) == 'function')
        callback(data)
    },
    fail:function (res) {

    }
  })
}

//const post = (cmd, params, callback) => {
var postReq = function(cmd, params, ischecktoken, callback) {
  //params.token = wx.getStorageSync('tokenid') || '';
  if (ischecktoken) {
    params.tokenid = wx.getStorageSync('tokenid') || '';
  }
  wx.showToast({
    title: '数据加载中...',
    icon: 'loading',
    duration: 4000
  });
  wx.request({
    url: API + cmd,
    data:params,
    method: 'POST',
    header: {
      'Accept': 'application/json'
    },
    success: (res) => {
      wx.hideToast();
      const data = res.data
      if (res.statusCode != 200) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: 'rgb(251,93,93)',
          content: res.statusCode + ',' + res.errMsg,
          success: (res) => {
            callback('postReq error!')
          }
        })
        return
      }
      if (typeof (callback) == 'function')
        callback(data.data)
    }
  })
}

//ES6写法。
 export default {
   //get: get,
   //post: post
 }
module.exports = {
  getReq: getReq,
  postReq: postReq
}