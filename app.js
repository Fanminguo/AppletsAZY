//app.js
var util = require('./utils/sign.js');
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		var rps = "";
		wx.setStorageSync('logs', logs);
		this.login();
		this.loginName()
		// 获取用户信息
	},
	loginName: function () {
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							wx.setStorageSync('encryptedData', res.encryptedData);
							wx.setStorageSync('iv', res.iv);
							wx.setStorageSync('session_key', res.session_key);
							// 可以将 res 发送给后台解码出 unionid
							this.globalData.userInfo = res.userInfo;
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	},
	Sign(time) {
		return util.Sign(time);
	}, getTimestamp() {
		return util.getTimestamp();
	},
	getopenid: function () {
		// wx.getStorageSync('token');
		try {
			var value = wx.getStorageSync('openid')
			if (value) {
				return value;
				// Do something with return value
			}
		} catch (e) {
			// Do something when catch error
			return "";
		}
	},
	//尾部公用结束
	login2: function (cb) {
		// 登录
		//调用微信登录接口  
		var t1 = this.getTimestamp();
		var sign1 = this.Sign(t1);
		var rps1 = "";
		try {
			rps1 = wx.getSystemInfoSync();

		} catch (e) {
			// Do something when catch error
		}
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionid
				if (res.code) {
					wx.request({
						// url: 'https://bj.aizhiyi.com/cli/WxLogin/wxLogin',
						url: this.globalData.apiUrl + "/cli/WxLogin/wxLogin",
						data: {
							code: res.code,
							t: t1,
							sign: sign1,
							rps: rps1,
						}, success(res) {
							try {
								if (res.data.code == 200) {
									wx.setStorageSync('openid', res.data.datas.accessInfo.data.openid);
									wx.setStorageSync('key', res.data.datas.key);
									wx.setStorageSync('cust_mobile', res.data.datas.cust_mobile);
									wx.setStorageSync('unionid', res.data.datas.accessInfo.data.unionid);
									wx.setStorageSync('session_key', res.data.datas.accessInfo.data.session_key);
									if (typeof cb == "function") {
										cb()
									} else {

									}


								} else {
									wx.setStorageSync('unionid', "");
								}

							} catch (e) {
							
							}
						}
					})
				} else {
				}
			}
		})
	},
	//尾部公用结束
	login: function () {
		// 登录
		//调用微信登录接口  
		var t1 = this.getTimestamp();
		var sign1 = this.Sign(t1);
		var rps1 = "";
		try {
			rps1 = wx.getSystemInfoSync();

		} catch (e) {
			// Do something when catch error
		}
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionid
				if (res.code) {
					wx.request({
						// url: 'https://bj.aizhiyi.com/cli/WxLogin/wxLogin',
						url: this.globalData.apiUrl + "/cli/WxLogin/wxLogin",
						data: {
							code: res.code,
							t: t1,
							sign: sign1,
							rps: rps1,
							// unionid:wx.getStorageSync('unionid')
						}, success(res) {
							try {
								if (res.data.code == 200) {
									wx.setStorageSync('openid', res.data.datas.accessInfo.data.openid);
									wx.setStorageSync('key', res.data.datas.key);
									wx.setStorageSync('cust_mobile', res.data.datas.cust_mobile);
									wx.setStorageSync('unionid', res.data.datas.accessInfo.data.unionid);
									wx.setStorageSync('session_key', res.data.datas.accessInfo.data.session_key);
								} else {
									wx.setStorageSync('unionid', res.data.datas.accessInfo.data.unionid);
								}

							} catch (e) {
							
							}
						}
					})
				} else {
				}
			}
		})
	},
	// getkey:function(){
	//  return wx.getStorageSync('key')
	// }, 
	saveUserinfo(res) {

		var that = this;
		wx.setStorage({
			key: 'userinfo',
			data: res,
		});
		wx.request({
			url: 'https://mszb.360751.com/api/req/userinfo',
			method: "POST",
			header: {
				'content-type': 'application/json',
			},
			data: {

				userinfo: JSON.stringify(res),

				token: that.gettoken(),
				openid: that.getopenid()

			},
			success: function (res) {

			}
		});
	}
	, getUserInfo: function () {
		return wx.getStorageSync("userinfo");
		// return JSON.stringify(wx.getStorageSync("userinfo"));
	}
	,
	gettoken: function () {
		// wx.getStorageSync('token');
		try {
			var value = wx.getStorageSync('key')
			if (value) {
				return value;
				// Do something with return value
			}
		} catch (e) {
			// Do something when catch error
			return "";
		}
	},
	join_cart: function (products_id, quantity) {
		const wxreq = wx.request({
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
			},
			url: this.globalData.apiUrl + "/cli/CustCart/cart_add",
			method: "POST",
			data: {
				products_id: products_id,
				quantity: quantity,
				key: wx.getStorageSync('key'),
			},
			success: function (res) {
				if (res.data.code == 400) {
					wx.showToast({
						icon: "none",
						title: res.data.datas.error,
						duration: 1000
					})
				} else {
					wx.showToast({
						icon: "none",
						title: "加入购物车成功",
						duration: 1000
					})
				}

			},
			fail: function (res) {

			}
		})
	},
	onShow: function () {
		let that = this;
		wx.getSystemInfo({
			success: res => {
				this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect().top
				let modelmes = res.model;
				if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone 11') != -1) {
					that.globalData.isIphoneX = true
				}

			}
		})

	},


	globalData: {
		userInfo: null,
		acceler: 150,
		// apiUrl:"http://192.168.200.231:8000",
		// apiUrl:"https://azyapi.aizhiyi.com",
		apiUrl: "https://bj.aizhiyi.com",
		loadUrl:'https://dms.aizhiyi.com',
		isIphoneX: false,
		isYes: true,
		headerBtnPosi: {}
	},
	"networkTimeout": {
		"request": 30000,
		"connectSocket": 30000,
	},
	"mszbTime": 2000
})
