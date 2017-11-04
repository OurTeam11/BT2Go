//index.js
//获取应用实例
const app = getApp()

//判断是否已经登录了。

var __is_login = false;

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
    if (app.globalData.userInfo) {
      __is_login = true;
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  //登陆View的click事件，调用全局app变量的getUserInfo方法。
  getUserInfo: function () {
    var that = this
    app.getUserInfo(function (user_info) {
      __is_login = true;
      that.setData({
        userInfo: user_info,
        hasUserInfo: true
      })
    })
  },

  toOrder: function (e) {
    var that = this;

   
    console.log("是否登录"+ that.data.hasUserInfo);
    if (!that.data.hasUserInfo) {
      wx.showToast({
        title: '需要先登录才能购买',
        icon: 'failed',
        duration: 2000
      });
      return;
    }
    var typeid = e.currentTarget.dataset.typeid;
    console.log(typeid);
    wx.navigateTo({
      url: '../order/order',
    })
  },

  showImages: function () {
    var that = this
    wx.request({
      url: 'http://118.190.208.121/tcsystem/API/item/getjson/3035009481018179', //仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({ imagetest: res.data.data.imgs })
        //that.setData({imagetest:res.data.imgs})
        console.log(res.data.data)
      }
    })
  }
})
