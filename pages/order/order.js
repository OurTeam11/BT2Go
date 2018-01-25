var app = getApp();
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');
var payment = require('../../utils/lib/payment');
var util = require('../../utils/util');

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待付款", "待发货", "待收货", "已完成", "全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    orderpage: 1,
    ordertype: 0, // 0-待付款，1-待发货， 2-待收货，3-已完成，4-已取消，5-退款中， -1 - 全部

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
      this.setData({activeIndex: 0});
      this.setData({ordertype: 0});
      console.log("liufeng, undefined typeid", options.typeid);
    } else {
      console.log("liufeng, not undefined typeid", options.typeid);
      this.setData({activeIndex: parseInt(options.typeid)});
      if (this.data.activeIndex == 4) {
        this.setData({ordertype: -1});
      } else {
          this.setData({ordertype: parseInt(options.typeid) });
      }
    }
    wx.getSystemInfo({
      success: function (res) {
        sliderWidth = res.windowWidth / 5;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.setData({ orderpage: 1, show_no_order: false});
    this.getOrderList({
      getOrderListSuccess: function (result) {
        let tmplist = result.list;
        if (tmplist.length === 0) {
          that.setData({ show_no_order: true });
          that.setData({ orderlist: [] });
          return;
        }
        if (tmplist.length === 20) {
          that.setData({ footerText: '下拉加载更多的订单' });
          that.setData({ footer_hint: true });
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
    var price = e.currentTarget.dataset.price;
    console.log("toPayOrder:",orderid);
    var that = this;
    payment.doOrderPayment(orderid, {
      doOrderPaymentSuccess: function (result) {
        console.log("doOrderPaymentSuccess:", result);
        wx.navigateTo({
          url: './paymentStatus/paystatus?orderprice=' + price + '&orderno=' + orderid,
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
          url: './paymentStatus/payerror?orderprice=' + price + '&orderno=' + orderid,
        });
      }
    })
  },

  reflashOrderList:function(ordertype) {
    var that = this;
    that.restoreDefaultStatus();
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

  //订单取消
  toCancelOrder:function(e) {
    var orderid = e.currentTarget.dataset.orderno;
    console.log("toCancelOrder:", orderid);
    var that = this;
    var digtitle = '';
    var digcontent = '';

    if (that.data.activeIndex == 0) {
       digtitle = '取消订单';
       digcontent='未支付订单取消，是否直接取消？';
    } else if (that.data.activeIndex == 1) {
      digtitle = '取消订单';
      digcontent = '已支付，未发货订单取消，取消后留意退款通知';
    } else {
      digtitle = '取消订单';
      digcontent = '已发货订单，请联系商家';
    }
    wx.showModal({
      title: digtitle,
      content: digcontent,
      success: function (res) {
        if (res.confirm) {
          wx.hideToast();
          api.request({
            // 要请求的地址
            url: config.server.cancelOrder,
            data: { session: Session.Session.get(), order: orderid },
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: 'POST',
            success(result) {
              console.log("cancelOrder request success.", result.data);
              if (result.data.status == 200) {
                if (that.data.activeIndex == 1) showtoast.showSuccess("退款成功");
                that.reflashOrderList(that.data.activeIndex);
              } else {
                console.log("取消订单失败，返回值不是200", result.data.status);
                return;
              }
            },
            fail(error) {
              showtoast.showModel('请求失败', error);
              console.log('request fail', error);
              return;
            },
          });
        } else if (res.cancel) {
          return;
        }
      }
    });
  },
  toConfirmReceived:function(e) {
     //确认收货
    var orderid = e.currentTarget.dataset.orderno;
    console.log("toConfirmReceived:", orderid);
    var that = this;

    wx.showModal({
      title: '确认收货',
      content: '确认收货吗？收货后订单变为已完成',
      success: function (res) {
        if (res.confirm) {
          api.request({
            // 要请求的地址
            url: config.server.confirmOrder,
            data: { session: Session.Session.get(), order: orderid },
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: 'POST',
            success(result) {
              console.log("cancelOrder request success.", result.data);
              if (result.data.status == 200) {
                that.reflashOrderList(that.data.activeIndex);
              } else {
                console.log("取消订单失败，返回值不是200")
                showtoast.showModel("取消失败", "取消订单失败，返回值:" + result.data.status)
                return;
              }
            },
            fail(error) {
              showtoast.showModel('请求失败', error);
              console.log('request fail', error);
              return;
            },
          });
        } else if (res.cancel) {
          return;
        }
      }
    });
  },

  restoreDefaultStatus:function() {
    this.setData({ orderpage: 1 });
    this.setData({ footer_hint: false });
    this.setData({ show_no_order: false });
    this.setData({ footerText: ''});
  },

  changeTap:function(e) {
    const index = parseInt(e.currentTarget.id);
    if (index == parseInt(this.data.activeIndex)) {
      console.log("click the same tab");
      this.setData({ activeIndex: index });
      return;
    }
    this.restoreDefaultStatus();
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (this.data.activeIndex == 4) {
      this.setData({ordertype : -1});
    } else {
        this.setData({ordertype:parseInt(index)});
    }
    //request网络去获取对应的订单状态。
    var that = this;
    this.getOrderList({
      getOrderListSuccess:function(result) {
         //给图片添加前缀。
         let tmplist = result.list;
         if (tmplist.length === 0) {
           that.setData({ show_no_order: true, footer_hint:false});
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
    if (that.data.ordertype === -1) {
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
    if (this.data.show_no_order) return;

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
    that.setData({ show_no_order: false });
    this.getOrderList({
      getOrderListSuccess: function (result) {
        //给图片添加前缀。
        let tmplist = result.list;
        if (tmplist.length === 0) {
          that.setData({footerText:'已经加载了全部订单'});
          that.setData({footer_hint:true});
          that.setData({ show_no_order: false });
          return;
        }
        if (tmplist.length === 20) {
           that.setData({footerText:'下拉加载更多的订单'});
           that.setData({footer_hint:true});
           that.setData({ show_no_order: false });
         } else {
           that.setData({footerText:'已经加载了全部订单'});
           that.setData({footer_hint:true});
           that.setData({ show_no_order: false });
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