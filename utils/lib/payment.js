var constants = require('./constants');
var util = require('../util');
var Session = require('./session');
var config = require('../../config');
var request = require('./request');

function doOrderPayment(orderid,callback) {
    //confirmPay
    request.request({
      // 要请求的地址
      url: config.server.confirmPay,
      data: {session: Session.Session.get(), order: orderid},
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(result) {
        console.log("toPayOrder doPayment ok ----  ", result);
        if (result.data.status === 200) {
          let data = result.data.data;
          let payParams = {trade_no: data.out_trade_no, nonce:data.nonceStr,package:data.package,
                          timeStamp: data.timeStamp, paySign: data.paySign};
          console.log("服务器返回的订单号：", data.out_trade_no);
          doWXRequestPayment(payParams,{
          	wxpaymentSuccess:function (res) {
              callback.doOrderPaymentSuccess(res);
          	},
          	wxpaymentFailed:function(res) {
              callback.doOrderPaymentFailed(res);
          	}
          });

        } else {
          console.log("服务器返回失败。可能保存成未支付的订单");
          callback.doOrderPaymentFailed("服务器返回失败。可能保存成未支付的订单");
        }
      },
      fail(error) {
        console.log('支付失败，toPayOrder 请求失败', error);
        callback.doOrderPaymentFailed(error);
      },
    });
};

function doWXRequestPayment(payparams, callback) {
    console.log("调用微信支付接口, requestPayment----param:", payparams);
    wx.requestPayment({
      'timeStamp': payparams.timeStamp,
      'nonceStr': payparams.nonce,
      'package': payparams.package,
      'signType': 'MD5',
      'paySign': payparams.paySign,
      'success': function (res) {
        console.log("微信支付成功",res);
        callback.wxpaymentSuccess(res);
      },
      'fail': function (res) {
        console.log("微信支付失败",res);
        callback.wxpaymentFailed(res);
      }
    })
};

module.exports = {
  doOrderPayment: doOrderPayment,
};