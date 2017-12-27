const app = getApp();
var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({
  data: {
    newAddr:{id:0, addr:'', contact:'', consignee:'', zipcode:'', status:0},
    ifChangeAddr:false,
    displayItem:false,
  },

  onLoad: function (options) {
    if (options.addr){
      let addr = JSON.parse(options.addr);
      console.log("change addr:", addr);
      if (addr) {
        this.setData({newAddr: addr, ifChangeAddr:true, displayItem:true})
      }
      wx.setNavigationBarTitle({ title: '修改收货地址' })
    }
    else{
      wx.setNavigationBarTitle({ title: '新建收货地址' })
    }
  },

  onReady: function (e) {
  	var that = this;   
  },

  createAddrToServer:function(addrparams) {
    api.request({
          url: config.server.addAddres,
          data: addrparams,
          method: 'POST',
          success(result) {
            var data = result.data;
            if (data.status === 200) {
              showtoast.showSuccess('添加地址完成');
            } else {
              showtoast.showModel('添加地址失败', '服务器返回代码' + data.status + '服务器返回信息：' + data.msg);
            }
          },

          fail(error) {
            showtoast.showModel('添加地址请求失败', error);
            console.log('add addres request fail', error);
          },
        });
  },
  changeAddrToServer:function(addrparams) {
     api.request({
          url: config.server.modifyAddres,
          data: addrparams,
          method: 'POST',
          success(result) {
            var data = result.data;
            if (data.status === 200) {
              showtoast.showSuccess('修改地址完成');

            } else {
              showtoast.showModel('修改地址失败', '服务器返回代码' + data.status + '服务器返回信息：' + data.msg);
            }
          },

          fail(error) {
            showtoast.showModel('修改地址失败请求失败', error);
            console.log('modify addres request fail', error);
          },
        });
  },

  formSubmit: function (e) {
    var warn = "";
    var that = this;
    var flag = false;
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.door == "") {
      warn = "请输入您的具体地址";
    } else if (!(/^[1-9][0-9]{5}$/.test(e.detail.value.zipcode))){
      warn = "请输入正确的邮政编码";
    } else {
      flag = true;
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      //首先保存服务器成功后，需要保存再本地。然后再跳转到选择地址界面。
      if (that.data.ifChangeAddr) {
        var oneAddr = {session:Session.Session.get(),consignee: e.detail.value.name, contact:e.detail.value.tel,
                     addr:e.detail.value.door, zipcode: e.detail.value.zipcode, aid:parseInt(that.data.newAddr.id),
                     status: that.data.newAddr.status};
        this.changeAddrToServer(oneAddr);

      } else {
        //新建地址。
         var oneAddr = {session:Session.Session.get(),consignee: e.detail.value.name, contact:e.detail.value.tel,
                     addr:e.detail.value.door, zipcode: e.detail.value.zipcode};
        this.createAddrToServer(oneAddr);
      }

      wx.navigateBack({
        url: '../chooseAddrs/chooseAddrs',
      });
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
})