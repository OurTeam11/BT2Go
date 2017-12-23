const app = getApp();
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品详情的swiper list
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,

    //点赞
    isLike: false,

    //数量选择的 Dialog.
    showDialog: false,

    // swiper list 图片。
    imgUrls: [],

    // 商品详情介绍
    detailImg: [],

    //商品价格
    itemprice: 0,
    // input默认是1
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    //库存
    stock: 100,
    //商品编码
    productid:"",

    //商品title
    productname:"",
    //商品描述
    productdescription:"",
  },

  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  // 收藏
  addLike: function() {
    this.setData({
      isLike: !this.data.isLike
    });
  },

  toggleDialog:function() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },

  closeDialog:function() {
     this.setData({
       showDialog:false
     })
  },

  // 添加购物车方法。
  // 接口调用method：post
  // 输入参数：session (String类型), productId (String类型), amount (int类型，商品的数量，不传就默认为1)
  // 返回数据：{status:200, msg:"ok"}
  addToCar:function() {
     api.request({
      // 要请求的地址
      url: config.server.addToCart,
      data: {session:Session.Session.get(), productId:this.data.productid, amount: this.data.num},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      method: 'POST',
      success(result) {
        var data = result.data;
        if (data.status === 200 && data.msg == 'ok') {
            showtoast.showSuccess('添加购物车完成');
        } else {
          showtoast.showModel('添加购物车失败', '服务器返回代码' + data.status + '服务器返回信息：' + data.msg);
        }
      },

      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
      },
    });
  },
  // 跳到购物车
  toCar: function() {
    console.log("toCar");
    wx.switchTab({
      url: '../shoppingcart/cart'
    })
  },

  // 立即购买
  immeBuy:function() {
    var that = this;
    if (app.globalData.userInfo) {
      //id, img, name, price, count, selected.
      var productlist = JSON.stringify([{id: that.data.productid, img: that.data.imgUrls[0],
                                         price: that.data.itemprice*that.data.num,
                                         name: that.data.productname, count: that.data.num}]);
      console.log(productlist);
       wx.navigateTo({
         url: '../order/generateOrder/generateorder?plist=' + productlist + '&type=detail2order',
       })
      // wx.navigateTo({
      //   url: '../addrmgr/chooseAddrs/chooseAddrs?plist=' + productlist + '&producttypenum=1&flag=buydirect',
      // })
    } else {
      wx.showToast({
       title: '需要先登录，才可以购买',
       icon: 'success',
       duration: 2000
     });
    }
  },

  bindTap:function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({productid:options.code});
    this.setData({
      curIndex: 0
    });
    console.log("productid:",this.data.productid);


  },

  //获取单一商品的方法。
  doRequestOneItem: function() {
    var that = this;
    // api.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
    api.request({
      // 要请求的地址
      url: config.server.requestOneDetailItem + that.data.productid,
      data: {session:Session.Session.get()},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        showtoast.showSuccess('请求成功完成');
        console.log('getOneItem:', result.data);
        var data = result.data;
        if (data.status === 200) {
          for (var i = 0; i < data.product.details.length; i++) {
            //拼接details图片的完整路径名字。
            data.product.details[i] = config.imgUrlPrefix + data.product.details[i];
          }
          that.setData({detailImg:data.product.details});
          
          for (var i = 0; i < data.product.pictures.length; i++) {
            //拼接details图片的完整路径名字。
            data.product.pictures[i] = config.imgUrlPrefix + data.product.pictures[i];
          }
          that.setData({imgUrls:data.product.pictures});

          that.setData({productname:data.product.name});
          that.setData({itemprice: data.product.price});
          that.setData({productdescription:data.product.description});

        } else {
          //返回值错误，非200. 

        }
      },

      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.userInfo && this.data.productid) {
      this.doRequestOneItem();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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