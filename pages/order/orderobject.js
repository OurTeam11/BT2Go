var session = require('../../utils/lib/session')

var orderObj = {
  costumername: "liufeng",
  orderstatus: "等待付款",
  orderprice: 0,
  ordercode:"",
  freight:0,
  orderAddress: "",
  phoneNumber: "",
  productlist:[],

  getSessionKey: function () {
    return session.Session.get();
  }

}

var doSum = function(a,b, callback) {
    var sum = a + b;
    callback(sum);
    return 55;
  }

  var doTest = function(a, callback) {
    if (a > 0) {
      callback.success("liufeng");
    } else {
      callback.fail("zhoujie");
    }
  }

var productObj = {
	productcode:"",
	productname:"",
	productimageurl:"",
	productprice:0,
}
module.exports = {
  orderObj: orderObj,
  productObj: productObj,
  doSum:doSum,
  doTest:doTest
} 