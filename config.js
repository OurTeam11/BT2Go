/**
 * 小程序配置文件,接口URL.
 */

var server_host = "http://192.168.0.107/opsystem/api";

var config = {
  imgUrlPrefix: "http://192.168.0.107/image/",
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
  }
}

module.exports = config;