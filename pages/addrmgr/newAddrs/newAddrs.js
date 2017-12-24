const app = getApp();
var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');
var model = require('../../../templates/citypicker/citypicker.js')
var show = false;
var item = {};
Page({
  data: {
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    addreindex: 0,
    addreRange: ['选择地址', '北京市海淀区', '北京市东城区', '北京市西城区', '北京市朝阳区', '北京市丰台区', '北京市石景山区'],
    door: "街道门牌信息",
    addrLabelindex: 0,
    addrLabelRange: ['选择标签', '家', '工作单位', '学校', '其他地点'],
    displayLocation: false,
    displayItem:false,
    //AddrList
    addrList:[],
    index:-1,
    item: {      
    	show: show    
    },
    location:{
      province:{},
      city:{},
      county:{}
    }
  },

  onLoad: function (options) {
    if (options.addr){
      let addr = JSON.parse(options.addr);
      console.log("change addr:", addr);
      if (addr) {
        wx.setNavigationBarTitle({ title: '修改收货地址' })
        this.setData({ name: addr.name });
        this.setData({ tel: addr.phonenumber });
        this.setData({ door: addr.door });
        this.setData({
          displayLocation: true,
          displayItem:true,
          location: {
            province: addr.location.province,
            city: addr.location.city,
            county: addr.location.county
          }
        });
        for (var i = 0; i < this.data.addrLabelRange.length; i++) {
          if (this.data.addrLabelRange[i] == addr.label) {
            this.setData({ addrLabelindex: i });
          }
        }

        this.setData({ index: addr.index })
        console.log("index,,",this.data.index)
        this.setData({ ifdefault: addr.default });
      }
    }
    else{
      wx.setNavigationBarTitle({ title: '新建收货地址' })
      this.setData({
        displayLocation: false
      }); 
    }
  },

  onReady: function (e) {
  	var that = this;   
	model.updateAreaData(that, 0, e);
  },

  translate: function (e) {
  	model.animationEvents(this, 0, true,400);    
  },

  hiddenFloatView: function (e) {    
  	model.animationEvents(this, 200, false,400);  
  },

  hiddenFloatViewWithYes: function (e) {
    item = this.data.item;
    location = this.data.location;
    model.animationEvents(this, 200, false, 400);
    this.setData({ 
      displayLocation: true,
      location:{
        province: item.provinces[item.value[0]].name,
        city: item.citys[item.value[1]].name,
        county: item.countys[item.value[2]].name
      }
    });
  },

  bindChange: function (e) {    
  	model.updateAreaData(this, 1, e);     
  },
  
  addrePickerBindchange: function (e) {
    console.log("e.detail.value:", e.detail.value);
    this.setData({
      addreindex: e.detail.value
    })
  },
  addrLabelPickerBindchange: function (e) {
    this.setData({
      addrLabelindex: e.detail.value
    })
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
    } else if (e.detail.value.addre == '0') {
      warn = "请选择您的所在区域";
    } else if (e.detail.value.door == "") {
      warn = "请输入您的具体地址";
    } else {
      flag = true;
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      //首先保存服务器成功后，需要保存再本地。然后再跳转到选择地址界面。
      //地址格式 address['name': 'liufeng', 'phonenumber': '13811060120',
      //                  'location': '北京市东城区', 'door': 北京市朝阳区慧忠里B区，
      //                  'label':'家', 'default':true]
      var oneAddr = {name: e.detail.value.name, phonenumber:e.detail.value.tel,
                     location: that.data.location, door:e.detail.value.door,
                     label: that.data.addrLabelRange[that.data.addrLabelindex], default: false};

      that.data.addrList = Session.AddressInfo.get() || [];
      if (that.data.index !== -1){
        that.data.addrList[that.data.index] = oneAddr;
      }else{
        that.data.addrList.push(oneAddr);
      }
      Session.AddressInfo.set(that.data.addrList);

      var allAddress = JSON.stringify(that.data.addrList);
      if (that.data.index !== -1) {
        wx.navigateBack ({
          url: '../chooseAddrs/chooseAddrs?addresslist=' + allAddress + '&flag=changeAddr',
        });
      }else{
        wx.navigateBack ({
          url: '../chooseAddrs/chooseAddrs?addresslist=' + allAddress + '&flag=newAddress',
          //？后面跟的是需要传递到下一个页面的参数
        });
      }
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
})