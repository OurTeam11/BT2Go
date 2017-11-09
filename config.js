/**
 * 小程序配置文件
 */

 var server_host = "http://118.190.208.121/tcsystem/api/item";

 var config = {
 	server: {

 		//登陆地址
 		loginUrl:`${server_host}/login`,

 		//请求商品列表地址。
 		requestProductList: `${server_host}/api/item`,

        //
        requestPaymentServer: `${server_host}/payment`,
 	}
 }

 module.exports = config;