/**
 * 小程序配置文件,接口URL.
 */

var server_host = "http://localhost:3100/api";

 var config = {
 	server: {

 		//登陆地址
      loginUrl: `${server_host}/onLogin`,

 		//请求商品列表地址。
 		requestProductList: `${server_host}/api/item`,

        //
        requestPaymentServer: `${server_host}/payment`,
 	}
 }

 module.exports = config;