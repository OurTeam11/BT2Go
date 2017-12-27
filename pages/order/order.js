var oneobj = require('./orderobject');
var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeid: 0,
    curIndex:0,
    orderpage: 1,
    ordertype: 0, // 0-待付款，1-待发货， 2-待收货，3-订单完成，4-订单取消

    orderlist:[{id:'', total: 0, status:0, trackingNu:'', createTime:'', products:[]}],
    
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
         //给图片添加前缀。
         let tmplist = result.list;
         for (var i =0 ;i < tmplist.length; i++) {
           for (var j = 0; j < tmplist[i].products.length; j++) {
             tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
           }
         }
        that.setData({orderlist: tmplist});
        
      },
      getOrderListFailed:function(result) {
        
      }
    })
    // var tt = oneobj.doSum(1, 3, function(sum){
    //      console.log("callback:" , sum);
    // });
    // console.log("tt:" , tt);

    // var test = oneobj.doTest(-1,
    //     {success:function(callback) {
    //      console.log("success:" , callback);
    //     },
    //     fail:function(callback) {
    //       console.log("fail:" , callback);
    //     }}
    //   );
  },
  
  getOrderList:function(callback) {
    var that = this;
    api.request({
      // 要请求的地址
      url: config.server.getOrderList,
      data: { session: Session.Session.get(), page:parseInt(that.data.orderpage), type: parseInt(that.data.ordertype)},
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

  toOrderDetail:function(e) {
     var orderid = e.currentTarget.dataset.orderno;
     console.log("ordernumber:",orderid);
     wx.redirectTo({
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
  
  deleteOrder: function(e) {
    var orderid = e.currentTarget.dataset.orderno;
    console.log("deleteOrder:",orderid);
  },

  toTrackingStatus:function(e) {
    var orderid = e.currentTarget.dataset.orderno;
    console.log("toTrackingStatus:",orderid);
  },

  bindTap:function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    console.log("liufeng", this.data.typeid);
    this.setData({curIndex: index});
    this.setData({ordertype:parseInt(index)});
    //request网络去获取对应的订单状态。
    var that = this;
    this.getOrderList({
      getOrderListSuccess:function(result) {
         //给图片添加前缀。
         let tmplist = result.list;
         for (var i =0 ;i < tmplist.length; i++) {
           for (var j = 0; j < tmplist[i].products.length; j++) {
             tmplist[i].products[j].img = config.imgUrlPrefix + tmplist[i].products[j].img;
           }
         }
        that.setData({orderlist: tmplist});
        
      },
      getOrderListFailed:function(result) {
        
      }
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