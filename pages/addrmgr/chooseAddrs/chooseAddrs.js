var index = 0;
var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({
  data: {
    list: [],
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

  onLoad: function (options) {
    var sign = 0//判断从修改页面中的保存还是删除按钮过来，保存为1，删除为2
    var flag = options.flag;
    sign = options.sign;


    if (flag == 'newAddress') {
      this.setData({ list: JSON.parse(options.addresslist)});
    } else if (flag == 'myinfo') {
      console.log("my info entry")
      let addresslist = Session.AddressInfo.get() || [];
      this.setData({ list: addresslist});
    } else if (flag == 'generateorder') {
      console.log("generateorder entry")
      let addresslist = Session.AddressInfo.get() || [];
      this.setData({list: addresslist});
      this.setData({ifSelectToOrder:true});
      this.setData({ifShowFooter:false});
    } else if (flag == 'carts2order') {
      console.log("carts2order entry");
      let addresslist = Session.AddressInfo.get() || [];
      this.setData({list: addresslist});
    } else if (flag == 'changeAddr') {
      this.setData({ list: JSON.parse(options.addresslist) });
    }
  },

  submitOrder:function() {
    console.log("submitOrder")
  }
})