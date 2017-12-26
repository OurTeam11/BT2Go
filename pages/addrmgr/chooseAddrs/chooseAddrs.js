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
    var that = this;
    api.request({
      url: config.server.getAddresList,
      data: { session: Session.Session.get() },
      method: 'GET',
      success(result) {
        var data = result.data;
        if (data.status === 200) {
          console.log('获取地址列表成功');
          if (data.list.length >0){
            let li = [];
            for (var i = 0; i < data.list.length; i++) {
              var oneAddr = { index: data.list[i].id,
                              door: data.list[i].addr,
                              zipcode: data.list[i].zipcode,
                              name: data.list[i].consignee,
                              phonenumber: data.list[i].contact};
              li.push(oneAddr);
            }
            that.setData({ list: li });
          }else{
            let addresslist = Session.AddressInfo.get() || [];
            that.setData({ list: addresslist });
          }
        } else {
          showtoast.showModel('获取地址列表失败', '服务器返回代码' + data.status);
          let addresslist = Session.AddressInfo.get() || [];
          that.setData({ list: addresslist });
        }
      },

      fail(error) {
        var that = this; 
        showtoast.showModel('请求失败', error);
        console.log('request fail', error);
        let addresslist = Session.AddressInfo.get() || [];
        that.setData({ list: addresslist });
      },
    });
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