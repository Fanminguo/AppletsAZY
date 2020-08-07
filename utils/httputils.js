/**
 * 请求头
 */
var header = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
  userid:wx.getStorageSync('openid'),
}

/**
 * 供外部post请求调用  
 */
function post(url, params, onSuccess, onFailed) {
  // console.log("请求方式：", "POST")
  request(url, params, "POST", onSuccess, onFailed);

}

/**
 * 供外部get请求调用
 */
function get(url, params, onSuccess, onFailed) {
  // console.log("请求方式：", "GET")
  request(url, params, "GET", onSuccess, onFailed);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

function request(url, params, method, onSuccess, onFailed) {
  // wx.showLoading({
  //   title: "正在加载中...",
  // })
  wx.request({
    url: url,
    data: dealParams(params),
    method: method,
    header:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
      userid:wx.getStorageSync('openid'),
    },
    success: function (res) {
      // wx.hideLoading();
      // console.log('响应：', res.data);
      /** start 根据需求 接口的返回状态码进行处理 */
      if (res.data.code == 200) {
        onSuccess(res.data); //request success
      } else {
        onFailed(res.data); //request failed
      }
    },
    complete: function (res) {
      // wx.hideLoading();
    },
    fail: function (error) {
      onFailed(""); //failure for other reasons
    }
  })
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  // console.log("请求参数:", params)
  return params;
}


// 1.通过module.exports方式提供给外部调用
module.exports = {
  postRequest: post,
  getRequest: get,
}
