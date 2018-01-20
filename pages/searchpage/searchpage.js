var app = getApp();

var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //description, id, name, price, thumbnail.
    productitem: [],

    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,//“没有数据”的变量，默认false，隐藏

    noproduct: false, //没有找到商品，noproduct=true

    page: 1, //请求页面。

    canReachButtom:false,

    inputShowed: false,
    thisKeyWord: "",
  },

  showInput: function () {
    console.log("shwoInput");
    this.setData({
      thisKeyWord: "",
      inputShowed: true
    });
  },
  
  //搜索商品
  searchItems: function () {
    console.log("searchItems");
    //查询网络
    this.doRequestSearch();

  },

  clearInput: function () {
    console.log("clearInput");
    this.setData({
      thisKeyWord: ""
    });
  },

  inputTyping: function (e) {
    console.log("inputTyping", e);
    this.setData({ thisKeyWord: e.detail.value });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showInput();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    this.setData({ page: 1 });
    this.setData({ searchLoading: false });
    this.setData({ searchLoadingComplete: false });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
    if (this.data.canReachButtom) {
      this.setData({ searchLoading: true });
      this.setData({ searchLoadingComplete: false });
      //触发搜索，分页请求。
      this.data.page++;
      //请求服务器更多的数据
      this.doRequestSearch();
    }
    // showtoast.showSuccess('搜索请求成功完成');
  },

  doRequestSearch: function () {
    //请求网络接口，search接口。
    var that = this;
    var keyword = that.data.thisKeyWord;
    console.log("wxSearchFn,keyword:", keyword);
    // api.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
    api.request({
      // 要请求的地址
      url: config.server.requestSearchItem,
      data: { session: Session.Session.get(), keyword: keyword, page: that.data.page },
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        console.log("search, result:", result.data);
        if (result.data.list.lenght >= 20) {
          that.setData({canReachButtom: true});
        } else {
           that.setData({canReachButtom: false});
        }
        if (result.data.list.length != 0) {
          for (var i = 0; i < result.data.list.length; i++) {
            //拼接humbnail的完整路径名字。
            result.data.list[i].thumbnail = config.imgUrlPrefix + result.data.list[i].thumbnail;
          }
          that.setData({
            productitem: result.data.list,
            noproduct: false
          });
          that.setData({ searchLoading: false });
          that.setData({ searchLoadingComplete: true });
        } else {
          that.setData({
            productitem: [],
            noproduct: true
          });
          that.setData({ searchLoading: false });
          that.setData({ searchLoadingComplete: false });
        }
      },

      fail(error) {
        showtoast.showModel('请求失败', error);
      },

      complete() {
      }
    });
  }
})