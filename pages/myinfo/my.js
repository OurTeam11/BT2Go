//index.js
//获取应用实例
var api = require('../../utils/api');
var showtoast = require('../../utils/commontoast');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    imagetest: [],

    //判断是否已经登录了。
    hasUserInfo:false,
    // orderItems
    orderItems: [
      {
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png',
      },
      {
        typeId: 1,
        name: '待发货',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png',
      },
      {
        typeId: 2,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png'
      },
      {
        typeId: 3,
        name: '待评价',
        url: 'bill',
        imageurl: '../../images/itemdetail/cart.png'
      }
    ],
  },

  onLoad: function () {
    
  },

  //登陆View的click事件，调用全局app变量的getUserInfo方法。
  getUserInfo:function() {
    // var that = this
    // app.getUserInfo(function (user_info) {
    //   __is_login = true;
    //   that.setData({
    //     userInfo: user_info,
    //     hasUserInfo: true
    //   })
    // })
    showtoast.showBusy('正在登录');
    api.login({
      success(result) {
        showtoast.showSuccess('登录成功');
        console.log('登录成功', result);
      },

      fail(error) {
        //showModel('登录失败', error);
        console.log('登录失败', error);
      }
    });
  },

  toOrder: function (e) {
    var typeid = e.currentTarget.dataset.typeid;
    console.log(typeid);
    wx.navigateTo({
      url: '../order/order',
    })
  },
});
