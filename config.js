/**
 * 小程序配置文件,接口URL.
 */

var server_host = "https://www.xjbt2go.com/opsystem/api";

var config = {
  imgUrlPrefix: "https://www.xjbt2go.com/image/",
  server: {
  	//登陆login地址
    loginUrl: `${server_host}/onLogin`,
    // checkSession接口.
    checkSession: `${server_host}/checkSession`,
    // register地址接口
    register: `${server_host}/register`,

    //请求推荐商品列表地址。  url: http://localhost:3100/opsystem/api/product/recommend
 	  requestRecommendItem: `${server_host}/product/recommend`,
    //商品单页显示，          url: http://localhost:3100/opsystem/api/product/{productId}
    requestOneDetailItem: `${server_host}/product/`,
    //商品搜索，url: http://localhost:3100/opsystem/api/product/search
    requestSearchItem: `${server_host}/product/search`,

    //购物车列表url: http://localhost:3100/opsystem/api/cart/list
    requestCartList: `${server_host}/cart/list`,
    //添加购物车接口，url: http://localhost:3100/opsystem/api/cart/add
    addToCart: `${server_host}/cart/add`,
    //删除购物车接口，一次删除一个。 url: http://localhost:3100/opsystem/api/cart/delete
    deleteFromCart:`${server_host}/cart/delete`,
    //修改商品数量， url: http://localhost:3100/opsystem/api/cart/{productId}/quantity
    modifyItemCount: `${server_host}/cart/`,

    //地址管理
    addAddres: `${server_host}/address/add`,
    getAddresList: `${server_host}/address/list`,
    modifyAddres: `${server_host}/address/update`,
    changeDefault: `${server_host}/address/changeDefault`,
    deleteAddres: `${server_host}/address/delete`,

    //订单管理
    prepareOrder: `${server_host}/order/prepare`,
    createAndPay: `${server_host}/order/createAndPay`,
    getOrderList: `${server_host}/order/list`,
    getOrderDetail: `${server_host}/order/`,//{订单编号}
    confirmPay:    `${server_host}/order/pay`,
    queryOrderStatus: `${server_host}/order/queryStatus`,
    queryOrderTracking:`${server_host}/order/tracking`,
  }
}

module.exports = config;