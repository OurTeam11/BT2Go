const app = getApp();
var oneobj = require('../orderobject');
var Session = require('../../../utils/lib/session');

//商品编号。
var pcode = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单信息对象。
    orderobj:{},

    //地址信息
    addressInfo: {},

    //订单商品信息
    orderproducts: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("generate order onload.")
    var type = options.type;
    if (type == 'cart2order') {
      //从购物车过来的
      this.setData({orderproducts:JSON.parse(options.plist)});
      console.log('generator:', this.data.orderproducts);

    } else if (type == 'detail2order') {
      //从购物车过来的
      this.setData({orderproducts:JSON.parse(options.plist)});
      console.log('detail2order:', this.data.orderproducts);
    }

  },
  
  addressClick: function() {
    wx.navigateTo({
      url: '../../addrmgr/chooseAddrs/chooseAddrs?flag=generateorder',
    })
  },

  onPay : function() {
    var that = this;
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
        console.log(res)
      },
      'fail': function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady..")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow..")
    var addres = Session.AddressInfo.get();
    for (var i=0; i < addres.length; i++) {
      if (addres[i].default) {
        this.setData({addressInfo: addres[i]});
        return;
      }
    }
    this.setData({addressInfo:Session.AddressInfo.get()[0]});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})