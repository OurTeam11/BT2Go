var app = getApp();
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');
var payment = require('../../utils/lib/payment');
var util = require('../../utils/util');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeid: 0,
    curIndex:0,
    orderpage: 1,
    ordertype: 0, // 0-待付款，1-待发货， 2-待收货，3-已完成，4-全部

    orderlist:[{id:'', total: 0, status:0, trackingNu:'', createTime:'', products:[]}],

    footerText:'',
    footer_hint:false,

    show_no_order:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("options",options);
    if (options.typeid == 'undefined') {
      this.setData({curIndex: 0});
      this.setData({ordertype: 0});
      console.log("liufeng, undefined typeid", options.typeid);
    } else {
      this.setData({typeid:options.typeid});
      console.log("liufeng, not undefined typeid", options.typeid);
      this.setData({curIndex: parseInt(options.typeid)});
      this.setData({ordertype: parseInt(options.typeid)});
    }

    this.getOrderList({
      getOrderListSuccess:function(result) {
         let tmplist = result.list;
         if (tmplist.length === 0) {
           that.setData({ show_no_order: true });
           that.setData({orderlist: []});
           return;
         }
         if (tmplist.length === 20) {
           that.setData({footerText:'下拉加载更多的订单'});
           that.setData({footer_hint:true});
         }
         //给图片添加前缀。
         for (var i =0 ;i < tmplist.length; i++) {
           for (var j = 0; j < tmplist[i].products.length; j++) {
             tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
           }
           tmplist[i].createTime = util.formatTime2(tmplist[i].createTime);
         }
        that.setData({orderlist: tmplist});
      },
      getOrderListFailed:function(result) {
        console.log("获取订单列表失败");
      }
    })
  },

  toOrderDetail:function(e) {
     var orderid = e.currentTarget.dataset.orderno;
     console.log("ordernumber:",orderid);
     wx.navigateTo({
        url: './orderDetail/orderdetail?oid=' + orderid,
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {

        }
      })
  },

  //由于任何原因第一次没有支付成功，或者未支付
  //再次支付的时候会调用这个接口
  toPayOrder:function(e) {
    var orderid = e.currentTarget.dataset.orderno;
    console.log("toPayOrder:",orderid);
    var that = this;
    payment.doOrderPayment(orderid, {
      doOrderPaymentSuccess: function (result) {
        console.log("doOrderPaymentSuccess:", result);
        wx.navigateTo({
          url: './paymentStatus/paystatus?paystatus=支付成功&orderno=' + orderid,
          success: function (res) {
            //跳转到支付成功界面
            that.setData({orderlist: []});
            that.reflashOrderList(0);
          },
        });
      },
      doOrderPaymentFailed: function (result) {
        console.log("服务器返回失败。可能保存成未支付的订单", result);
        wx.navigateTo({
          url: './paymentStatus/paystatus?paystatus=支付失败&orderno=' + orderid,
        });
      }
    })
  },

  reflashOrderList:function(ordertype) {
    var that = this;
    api.request({
      // 要请求的地址
      url: config.server.getOrderList,
      data: { session: Session.Session.get(), page: parseInt(that.data.orderpage), type: parseInt(ordertype) },
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        console.log("getOrderList", result.data);
        if (result.data.status === 200) {
          //给图片添加前缀。
          let tmplist = result.data.list;
          if (tmplist.length === 0) {
            that.setData({ show_no_order:true});
            that.setData({
              orderlist:[]});
              return;
          }
          if (tmplist.length === 20) {
           that.setData({footerText:'下拉加载更多的订单'});
           that.setData({footer_hint:true});
          }
          for (var i = 0; i < tmplist.length; i++) {
            for (var j = 0; j < tmplist[i].products.length; j++) {
              tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
            }
            tmplist[i].createTime = util.formatTime2(tmplist[i].createTime);
          }
          that.setData({ orderlist: tmplist });
        } else {
          console.log("获取订单列表失败，返回值不是200")
          that.setData({ orderlist: [] });
        }

      },
      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
        that.setData({ orderlist: [] });
      },
    });
  },

  toTrackingStatus:function(e) {
    var trackingid = e.currentTarget.dataset.trackingid;
    console.log("toTrackingStatus:tid: ", trackingid);
    wx.navigateTo({
      url: './trackStatus/tracking?tid=' + trackingid,
      success: function (res) {
        // success
        console.log("显示结果界面，成功。")
      },
    });
  },

  toCancelOrder:function(e) {
    var orderid = e.currentTarget.dataset.orderno;
    console.log("toCancelOrder:",orderid);
  },
  toConfirmReceived:function(e) {
     //确认收货
  },

  changeTap:function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (index === parseInt(this.data.curIndex)) {
      console.log("click the same tab");
      this.setData({ curIndex: index });
      return;
    }
    this.setData({orderpage: 1});
    this.setData({curIndex: index});
    this.setData({ordertype:parseInt(index)});
    this.setData({footer_hint:false});
    //request网络去获取对应的订单状态。
    var that = this;
    this.getOrderList({
      getOrderListSuccess:function(result) {
         //给图片添加前缀。
         let tmplist = result.list;
         if (tmplist.length === 0) {
           that.setData({ show_no_order: true });
           that.setData({
             orderlist: []
           });
           return;
         }
         if (tmplist.length === 20) {
           that.setData({footerText:'下拉加载更多的订单'});
           that.setData({footer_hint:true});
         }
         for (var i =0 ;i < tmplist.length; i++) {
           for (var j = 0; j < tmplist[i].products.length; j++) {
             tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
           }
           tmplist[i].createTime = util.formatTime2(tmplist[i].createTime);
         }
        that.setData({orderlist: tmplist});
        
      },
      getOrderListFailed:function(result) {
        if (tmplist.length === 20) {
           that.setData({footerText:''});
           that.setData({footer_hint:false});
         }
      }
    })
  },

  getOrderList: function (callback) {
    var that = this;
    var data = {};
    if (that.data.ordertype === 4) {
      data = { session: Session.Session.get(), page: parseInt(that.data.orderpage) };
    } else {
      data = { session: Session.Session.get(), page: parseInt(that.data.orderpage), type: parseInt(that.data.ordertype) };
    }
    api.request({
      // 要请求的地址
      url: config.server.getOrderList,
      data: data,
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(result) {
        console.log("getOrderList", result.data);
        if (result.data.status === 200) {
          callback.getOrderListSuccess(result.data);
        } else {
          console.log("获取订单列表失败，返回值不是200")
          callback.getOrderListFailed(result.data.status);
        }

      },
      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
        callback.getOrderListFailed("获取订单列表失败");
      },

    });
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
    this.data.orderpage = 1;
    var that = this;
    that.setData({footerText:'正在加载订单...'});
    that.setData({footer_hint:true});
    this.getOrderList({
      getOrderListSuccess: function (result) {
        let tmplist = result.list;
        if (tmplist.length === 0) {
          that.setData({ show_no_order: true });
          that.setData({
            orderlist: []
          });
          return;
        }
        if (tmplist.length === 20) {
           that.setData({footerText:'下拉加载更多的订单'});
           that.setData({footer_hint:true});
         }
        //给图片添加前缀。
        for (var i = 0; i < tmplist.length; i++) {
          for (var j = 0; j < tmplist[i].products.length; j++) {
            tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
          }
          tmplist[i].createTime = util.formatTime2(tmplist[i].createTime);
        }
        that.setData({ orderlist: tmplist });

      },
      getOrderListFailed: function (result) {

      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("reach the bottom");
    this.data.orderpage ++ ;
    var that = this;
    that.setData({footerText:'正在加载订单...'});
    that.setData({footer_hint:true});
    this.getOrderList({
      getOrderListSuccess: function (result) {
        //给图片添加前缀。
        let tmplist = result.list;
        if (tmplist.length === 0) {
          that.setData({footerText:'已经加载了全部订单'});
          that.setData({footer_hint:true});
          return;
        }
        if (tmplist.length === 20) {
           that.setData({footerText:'下拉加载更多的订单'});
           that.setData({footer_hint:true});
         } else {
           that.setData({footerText:'已经加载了全部订单'});
           that.setData({footer_hint:true});
         }
        for (var i = 0; i < tmplist.length; i++) {
          for (var j = 0; j < tmplist[i].products.length; j++) {
            tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
          }
          tmplist[i].createTime = util.formatTime2(tmplist[i].createTime);
        }
        that.setData({ orderlist: tmplist });

      },
      getOrderListFailed: function (result) {
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})