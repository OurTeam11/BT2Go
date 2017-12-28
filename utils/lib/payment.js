var constants = require('./constants');
var util = require('../util');
var Session = require('./session');
var login = require('./login');


function doOrderPayment(orderid,callback) {
    console.log("deleteOrder:",orderid);
    var that =this;
    //confirmPay
     api.request({
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
          that.doWXRequestPayment(payParams,{
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
          // wx.redirectTo({
          //   url: '../paymentStatus/paystatus?paystatus=支付失败',
          //   success: function (res) {
          //     // success
          //     console.log("toPayOrder 显示结果界面，成功")
          //   },
          // });
        }
      },
      fail(error) {
        showtoast.showModel('支付失败，toPayOrder 请求失败', error);
        callback.doOrderPaymentFailed(error);
      },
    });
};

function doWXRequestPayment(payparams, callback) {
	var that = this;
    console.log("doWXRequestPayment----param:", payparams);

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
  doPayment: doPayment,
};