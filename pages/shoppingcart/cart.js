const app = getApp();

var api = require('../../utils/api');
var config = require('../../config');
var showtoast = require('../../utils/commontoast');
var Session = require('../../utils/lib/session');

Page({
  data: {
    //id, img, name, price, count, selected.
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:false,    // 全选状态，默认全选

    emptyCartText:'您的购物车为空哦',
  },

  onLoad: function() {
   
  },

  onShow : function() {
    this.loadItems();
    
  },

  // load 购物车中的商品。
  loadItems: function() {
    var that = this;
    if (app.globalData.userInfo) {
      // api.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
      api.request({
        // 要请求的地址
        url: config.server.requestCartList,
        data: {session:Session.Session.get()},
        // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'GET',
        success(result) {
          var data = result.data;
          if (data.status === 200) {
            console.log('data:', data);
            //给图片加上http前缀。
            for (var i = 0; i < data.list.length; i ++) {
              data.list[i].img = 'http://localhost/image/' + data.list[i].img;
              data.list[i].count = parseInt(data.list[i].count);
            }
            that.setData({carts: data.list, hasList: true});
            that.getTotalPrice();
          } else {
            showtoast.showModel('加载购物车失败', '返回值:' + data.status);
          }
        },

        fail(error) {
          showtoast.showModel('请求失败', error);
          console.log('request fail', error);
        },
      });
    } else {
      that.showEmptyCart();
    }
  },

  showEmptyCart:function() {
    this.setData({emptyCartText:'您的购物车为空哦'});
  },

  /**
   * 当前商品选中事件
   */
  selectList : function(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts; //保存一下购物车。
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList : function(e) {
    const index = e.currentTarget.dataset.index;
    console.log("delete..." + index);
    let carts = this.data.carts;
    let itemcount = carts[index].count;
    if (itemcount > 1) {
      showtoast.showModel('不能删除', '目前版本，您需要先把此商品数量减成1，才能删除');
      return;
    }
    //请求网络，同步到服务器。
    var that = this;
    //api.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
    api.request({
      // 要请求的地址
      url: config.server.deleteFromCart,
      data: {session:Session.Session.get(), productId: that.data.carts[index].id},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(result) {
        var data = result.data;
        if (data.status === 200 && data.msg == 'ok') {
          //删除服务器购物车列表成功后，同步到本地。
          carts.splice(index,1);
          that.setData({
            carts: carts
          });
          if(!carts.length){
            that.setData({
              hasList: false
            });
          }else{
            that.getTotalPrice();
          }
        } else {
          showtoast.showModel('删除失败', '删除购物车失败，status：' + data.status + ' .msg：' + data.msg);
        }
      },
      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
      },
    });
  },

  changeItemCount:function(e, count, carts) {
    const index = e.currentTarget.dataset.index;
    var that = this;
    console.log("changeItemcount, url:" + config.server.modifyItemCount + that.data.carts[index].id + '/quantity');
    //api.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
    api.request({
      // 要请求的地址, http://localhost:3100/opsystem/api/cart/{productId}/quantity
      url: config.server.modifyItemCount + that.data.carts[index].id + '/quantity',
      data: {session:Session.Session.get(), productId: that.data.carts[index].id, amount:count},
      // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(result) {
        var data = result.data;
        console.log("changeItemCount..response." , data);
        if (data.status === 200 && data.msg == 'ok') {
          //删除服务器购物车列表成功后，同步到本地
          carts[index].count = count;
          that.setData({carts: carts});
          that.getTotalPrice();
        } else {
          showtoast.showModel('删除数量失败', '修改数量，status：' + data.status + ' .msg：' + data.msg);
        }
      },
      fail(error) {
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
      },
    });
  },
  /**
   * 购物车全选事件
   */
  selectAll : function(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount : function(e) {
    const index = e.currentTarget.dataset.index;
    let tmpCarts = this.data.carts;
    this.changeItemCount(e, tmpCarts[index].count + 1, tmpCarts);
  },

  /**
   * 绑定减数量事件
   */
  minusCount : function(e) {
    const index = e.currentTarget.dataset.index;
    let tmpCarts = this.data.carts;
    if(tmpCarts[index].count <= 1){
      return false;
    }
    this.changeItemCount(e, tmpCarts[index].count - 1, tmpCarts);
  },

  /**
   * 计算总价
   */
  getTotalPrice : function() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].count * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  //结算
  checkout:function(e) {
    if (this.data.carts) {
      var cartslist = JSON.stringify(this.data.carts);
      console.log(cartslist);
      // wx.navigateTo({
      //   url: '../order/generateorder?plist=' + productlist + '&producttypenum=1',
      // })
      wx.navigateTo({
        url: '../addrmgr/chooseAddrs/chooseAddrs?cartslist=' + cartslist + '&flag=carts2order',
      })
    } else {

    }
  }

})