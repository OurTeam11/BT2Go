var index = 0;
var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({
  data: {
    list: [{id:0, addr:'', contact:'', consignee:'', zipcode:'', status:0}],
    path:"none",
    ifSelectToOrder: false,
    ifShowFooter:true
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

    this.setData({path:flag});
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

  changeDefaultAddr:function(aid) {
    var that =this;
    api.request({
      url: config.server.changeDefault,
      data: { session: Session.Session.get(), aid:parseInt(aid)},
      method: 'POST',
      success(result) {
        var data = result.data;
        console.log("change default success..");
        if (data.status === 200) {
          that.reflashAddrList();
        } else {
          console.log("change default failed..");
        }
      },
      fail(error) {
        console.log("change default failed..");
      },
    });

  },
  
  toSelectAddr: function (e) {
    console.log("changeDefault: ", e);
    //如果是生成订单过来的，选择default后，返回，如果不是就不返回任何界面。
    let aid = e.currentTarget.dataset.id;
    this.changeDefaultAddr(aid);
    if (this.data.path == 'generateorder') {
      // back to order.
      // 在C页面内 navigateBack，将返回A页面
      wx.navigateBack({
        delta: 1
      }); 
    } else if (this.data.path == 'myinfo') {
      
    }
  },
  
  reflashAddrList:function() {
    var that = this;

    that.setData({list:[]});
    api.request({
      url: config.server.getAddresList,
      data: { session: Session.Session.get() },
      method: 'GET',
      success(result) {
        var data = result.data;
        if (data.status === 200) {
          if (data.list.length >0) {
            // 赋值给list。
            that.setData({ list: data.list });
          }else{
            let addresslist = Session.AddressInfo.get() || [];
            that.setData({list:addresslist});
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
  },

  onShow:function(){
    if (this.data.path == 'myinfo') {
      console.log("myinfo")
      this.setData({ ifShowFooter: true });
    } else if (this.data.path == 'generateorder'){
      console.log("generateorder")
      this.setData({ ifShowFooter: false });
    } else if (this.data.path == 'undefined'){
      console.log("addr change or create")
    } else {

    }
    
    this.reflashAddrList();
  },

 

  submitOrder:function() {
    console.log("submitOrder")
  }
})