var index = 0;
var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({
  data: {
    list: [],
    ifSubmitOrder: false
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
       url: '../changeAddrs/changeAddrs?addr=' + JSON.stringify(oneaddr),
     });
  },

toSelectAddr: function (e) {
  console.log("toSelectAddr", e);
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
      this.setData({ list: JSON.parse(options.addresslist) });
    } else if (flag == 'myinfo') {
      console.log("my info entry")
      let addresslist = Session.AddressInfo.get() || [];
      this.setData({ list: addresslist});
      this.setData({ifSubmitOrder:false});
    } else if (flag == 'buydirect') {
      console.log("itemDetails entry")
      // url: '../addrmgr/chooseAddrs/chooseAddrs?plist=' + productlist + '&producttypenum=1&flag=buydirect',
      let addresslist = Session.AddressInfo.get() || [];
      this.setData({list: addresslist});
      this.setData({ifSubmitOrder:true});
    } else if (flag == 'carts2order') {
      console.log("carts2order entry");
      let addresslist = Session.AddressInfo.get() || [];
      this.setData({list: addresslist});
      this.setData({ifSubmitOrder:true});
    } else if (flag == 'changeAddr') {
      this.setData({ list: JSON.parse(options.addresslist) });
    }
  },

  submitOrder:function() {
    console.log("submitOrder")
  }
})