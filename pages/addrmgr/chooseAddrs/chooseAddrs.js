var index = 0;
var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({
  data: {
    list: [],
    path:"none",
    ifSelectToOrder: false,
    ifShowFooter:true
  },
  addAddre: function (e) {
    wx.navigateTo({
      url: '../newAddrs/newAddrs'
    })
  },

  toModifyAddre: function (e) {
    console.log(e.currentTarget);
    console.log("选中的dataset：", e.currentTarget.dataset);
    let oneaddr = e.currentTarget.dataset;
     wx.navigateTo({
       url: '../newAddrs/newAddrs?addr=' + JSON.stringify(oneaddr),
     });
  },

toSelectAddr: function (e) {
  console.log("toSelectAddr", e);
  if (this.data.ifSelectToOrder) {
    // back to order.
    // 在C页面内 navigateBack，将返回A页面
    wx.navigateBack({
      delta: 1
    });
  }
    let li = this.data.list;
    for (var i = 0; i < this.data.list.length; i++) {

      if (i == e.currentTarget.dataset.index) {
        li[e.currentTarget.dataset.index].default = true;
      } else {
        li[i].default = false;
      }
    }
    this.setData({list:li});
    Session.AddressInfo.set(this.data.list);
  },

  onShow:function(){
    if (this.data.path == 'myinfo'){
      console.log("myinfo")
    } else if (this.data.pat == 'generateorder'){
      console.log("generateorder")
      this.setData({ ifSelectToOrder: true });
      this.setData({ ifShowFooter: false });
    } else if (this.data.pat == 'carts2order'){
      console.log("carts2order")
    } else{
      console.log("addr change or create")
    }
    let addresslist = Session.AddressInfo.get() || [];
    this.setData({ list: addresslist });
    this.setData({ path: 'none' });
  },
  onLoad: function (options) {
    var sign = 0//判断从修改页面中的保存还是删除按钮过来，保存为1，删除为2
    var flag = options.flag;
    sign = options.sign;

    if (flag == 'myinfo') {
      this.setData({ path: 'myinfo'});
    } else if (flag == 'generateorder') {
      this.setData({ path: 'generateorder' });
    } else if (flag == 'carts2order') {
      this.setData({ path: 'carts2order' });
    } 
  },

  submitOrder:function() {
    console.log("submitOrder")
  }
})