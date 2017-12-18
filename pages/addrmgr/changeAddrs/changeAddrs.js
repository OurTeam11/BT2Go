var api = require('../../../utils/api');
var config = require('../../../config');
var showtoast = require('../../../utils/commontoast');
var Session = require('../../../utils/lib/session');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    addreindex: 0,
    addreRange: ['选择地址', '北京市海淀区', '北京市东城区', '北京市西城区', '北京市朝阳区', '北京市丰台区', '北京市石景山区'],
    door: "街道门牌信息",
    addrLabelindex: 0,
    addrLabelRange: ['选择标签', '家', '工作单位', '学校', '其他地点'],
    ifdefault:false,
    //AddrList
    addrList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let addr = JSON.parse(options.addr);
    console.log("change addr:", addr);
    if (addr) {
      this.setData({name:addr.name});
      this.setData({tel:addr.phonenumber});
      this.setData({door:addr.door});
      for (var i=0; i< this.data.addreRange.length; i++) {
        if (this.data.addreRange[i] == addr.addre) {
          this.setData({addreindex:i});
        }
      }
      for (var i=0; i< this.data.addrLabelRange.length; i++) {
        if (this.data.addrLabelRange[i] == addr.label) {
          this.setData({addrLabelindex:i});
        }
      }
      
      this.setData({index:addr.index});
      this.setData({ifdefault:addr.default});
    }
  },


  formSubmit: function (e) {
    console.log("change addr:", e);
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
      //                  'addre': '北京市东城区', 'door': 北京市朝阳区慧忠里B区，
      //                  'label':'家', 'default':true]
      var newAddr = {name: e.detail.value.name, phonenumber:e.detail.value.tel,
                     addre: that.data.addreRange[that.data.addreindex], door:e.detail.value.door,
                     label: that.data.addrLabelRange[that.data.addrLabelindex], default: that.data.ifdefault};
      that.data.addrList = Session.AddressInfo.get() || [];
      //替换第index个地址元素。
      that.data.addrList[that.data.index] = newAddr;
      //TODO：同步到网路服务器

      //同步到本地
      Session.AddressInfo.set(that.data.addrList);

      var allAddress = JSON.stringify(that.data.addrList);
      wx.redirectTo({
        url: '../chooseAddrs/chooseAddrs?addresslist=' + allAddress + '&flag=changeAddr',
        //？后面跟的是需要传递到下一个页面的参数

      });
      console.log("传过去的地址下标是多少？地址区域" + e.detail.value.addre)
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

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