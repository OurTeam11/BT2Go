const app = getApp();
//商品编码,查询商品的唯一信息。
var pcode = "";

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
    imgUrls: [
      "http://mz.djmall.xmisp.cn/files/product/20161201/148057921620_middle.jpg",
      "http://mz.djmall.xmisp.cn/files/product/20161201/148057922659_middle.jpg"
    ],

    // 商品详情介绍
    detailImg: [
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_1.jpg",
      "http://7xnmrr.com1.z0.glb.clouddn.com/detail_2.jpg"
    ],

    //商品价格
    itemprice: 300,
    // input默认是1
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    //库存
    stock: 100,
    //商品编码
    productcode:"",
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

  addCar:function() {
     console.log("addCar");
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
    // wx.showToast({
    //   title: '购买成功',
    //   icon: 'success',
    //   duration: 2000
    // });
    var that = this;
    if (app.globalData.userInfo) {
      var productlist = JSON.stringify([{pcode: this.pcode, price: this.data.itemprice*this.data.num}]);
      console.log(productlist);
      wx.navigateTo({
        url: '../order/generateorder?plist=' + productlist + '&producttypenum=1',
      })
    } else {
      wx.showToast({
       title: '需要先登录，才可以购买',
       icon: 'success',
       duration: 2000
     });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.pcode = options.code;
    console.log(" pcode:" + this.pcode);
    this.setData({productcode:options.code});

    wx.request({
      url: 'http://huanqiuxiaozhen.com/wemall/slider/list',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          images: res.data
        })
      }
    })
    this.setData({
      curIndex: 0
    })

  },

  bindTap:function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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