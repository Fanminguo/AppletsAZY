var app = getApp();
var http = require('../../utils/httputils.js');
import navigateTo from "../../utils/navigateRoute.js"
const utilclick = require('../../utils/util.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		scrollLeft: 0,
		btns: ["明细", "粉丝", "贡献榜单"],
		hide: false,
		eye1: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/icon_yjcopy@2x.png',//睁眼
		eye2: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/yanjing_2.png',//闭眼
		eye: true,//眼睛  true时候为睁眼
		page: 1,
		rows: 10,
		active: 0,
		listData: [],
		listData1: [],
		yiciRule: false,
		carry: false,
		asterisk: '****',  //星号
	},

	// 获取滚动条当前位置
	onPageScroll: function (e) {
		// 顶部tab  一直置顶
		if (e.scrollTop > this.data.tabScrollTop) {
			this.setData({
				tabFixed: true
			})
		} else {
			this.setData({
				tabFixed: false
			})
		}
	},
	// switchNav: utilclick.throttle(function (e) {
	// 	var mythis = this;
	// 	wx.showLoading({
	// 		title: '加载中...'
	// 	})
	// 	mythis.setData({
	// 		listData: [],
	// 		page: 1,
	// 		hasmore: true,
	// 	})
	// 	const {
	// 		offsetLeft
	// 	} = e.currentTarget;
	// 	const {
	// 		id,
	// 		index
	// 	} = e.currentTarget.dataset;
	// 	var clientX = e.detail.x;
	// 	var screenIndex = e.currentTarget.dataset.index
	// 	console.log(screenIndex)
	// 	if (screenIndex == 0) {
	// 		mythis.endorsement()

	// 	} else if (screenIndex == 1) {
	// 		mythis.fansList()
	// 	} else {
	// 		mythis.contributionList()

	// 	}
	// 	if (clientX < 60) {
	// 		this.setData({
	// 			scrollLeft: offsetLeft - 60
	// 		});
	// 	} else if (clientX > 330) {
	// 		this.setData({
	// 			scrollLeft: offsetLeft
	// 		});
	// 	}
	// 	this.setData({
	// 		active: index
	// 	});
	// }, 800),

	//   眼睛
	switch: function () {
		var that = this;
		if (that.data.eye) {
			that.setData({
				eye: false
			})
		} else {
			that.setData({
				eye: true
			})
		}

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		that.setData({
			level: options.level
		})
		that.endorsement()
	},
	// 取消提现至
	carryType: function () {
		var that = this
		that.setData({
			carry: false
		})
	},
	// 选择提现
	withDrawal: function () {
		var that = this
		that.setData({
			carry: true
		})
	},
	// 提现微信
	carryWx: function () {
		var that = this
		if (that.data.boundInfo.isBoundWx) {		//已经绑定了
			if (that.data.nowMoney > 0) {
				wx.showModal({
					title: '提示',
					content: '确认提现到微信',
					success: function (res) {
						if (res.confirm) {
							that.setData({
								extractType: 2
							})
							that.MoneyApply()
							that.setData({
								carry: false
							})
						} else if (res.cancel) {
						}
					}
				})

			} else {
				wx.showToast({
					title: '可用金额必须大于1元',
					icon: 'none',
					duration: 1500
				})
				that.setData({
					carry: false
				})
			}
		} else {	//没有绑定
			that.setData({
				carry: false
			})
			navigateTo('../set/setAccount/setAccount')
		}

	},
	// 提现支付宝
	carryZfb: function () {
		var that = this
		if (that.data.boundInfo.isBoundAlipay) {		//已经绑定了
			if (that.data.nowMoney > 0) {

				wx.showModal({
					title: '提示',
					content: '确认提现到支付宝',
					success: function (res) {
						if (res.confirm) {
							that.setData({
								extractType: 1
							})
							that.MoneyApply()
							that.setData({
								carry: false
							})
						} else if (res.cancel) {
						}
					}
				})

			} else {
				that.setData({
					carry: false
				})
				wx.showToast({
					title: '可用金额必须大于1元',
					icon: 'none',
					duration: 1500
				})
			}
		} else {	//没有绑定
			that.setData({
				carry: false
			})
			navigateTo('../set/setAccount/zfb/zfb')
		}
	},
	// 提现
	MoneyApply: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			extractType: that.data.extractType
		}
		http.postRequest(app.globalData.apiUrl + "/cli/CustIndex/extractMoneyApply", parms,
			(res) => {
				wx.showToast({
					title: '请等待审核...',
					icon: 'success',
					duration: 1000
				})
				// wx.showLoading({ title: '加载中…' })
				that.setData({
					listData:[]
				})
				that.endorsement1()
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	endorsement1: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			page:1,
			rows: that.data.rows
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustAssets/getAgentInfo', parms,
			(res) => {
				that.data.listData1.push(res.datas.custOrderList[0])
				var custname = that.data.listData1[0].custName
				var money = that.data.listData1[0].money
				var extractType = that.data.listData1[0].extractType
				var ordertime = that.data.listData1[0].orderTime
				var extract_sn = that.data.listData1[0].extract_sn
				var phone = that.data.listData1[0].phone
				var status = that.data.listData1[0].status
				var ident = that.data.listData1[0].ident
					// 一下没有字段
				var isextract = that.data.listData1[0].isextract
				var ordertime2 = that.data.listData1[0].ordertime2
				var paysn = that.data.listData1[0].paysn
				var sn = that.data.listData1[0].sn
				var isRefund = that.data.listData1[0].isrefund
				for (var i in res.datas.custOrderList) {
					that.data.listData.push(res.datas.custOrderList[i])
				}
				that.setData({
					listData: that.data.listData,
					hasmore: res.hasmore,
					receiveMoney: res.datas.receiveMoney.toFixed(2), //可以提现金额
					totalMoney: res.datas.totalMoney.toFixed(2),//总收益
					nowMoney: res.datas.nowMoney.toFixed(2), //当前金额
					extractMoney: res.datas.extractMoney.toFixed(2),//已提现金额
					frozen: res.datas.frozen.toFixed(2),//冻结金额
				})
				setTimeout(function () {
					
					navigateTo('./endorOrder/endorOrder?custname=' + custname + "&isextract=" + isextract + '&money=' + money + '&ordertime=' + ordertime + '&ordertime2=' + ordertime2 + '&paysn=' + paysn + '&sn=' + sn + "&extractType=" + extractType + "&extract_sn=" + extract_sn + "&ident=" + ident + '&phone=' + phone + "&status=" + status + "&isRefund=" + isRefund)
				   }, 500) 
				wx.hideLoading()
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	// 明细
	goOrder: function (e) {
		var that = this
		var custname = e.currentTarget.dataset.custname
		var money = e.currentTarget.dataset.money
		var ordertime = e.currentTarget.dataset.ordertime
		var extractType = e.currentTarget.dataset.extracttype
		var extract_sn = e.currentTarget.dataset.extract_sn
		var ident = e.currentTarget.dataset.ident
		var status = e.currentTarget.dataset.status

		// 一下没有字段
		var isextract = e.currentTarget.dataset.isextract
		var ordertime2 = e.currentTarget.dataset.ordertime2
		var paysn = e.currentTarget.dataset.paysn
		var sn = e.currentTarget.dataset.sn
		var phone = e.currentTarget.dataset.phone
		var isRefund = e.currentTarget.dataset.isrefund

		navigateTo('./endorOrder/endorOrder?custname=' + custname + "&isextract=" + isextract + '&money=' + money + '&ordertime=' + ordertime + '&ordertime2=' + ordertime2 + '&paysn=' + paysn + '&sn=' + sn + "&extractType=" + extractType + "&extract_sn=" + extract_sn + "&ident=" + ident + '&phone=' + phone + "&status=" + status + "&isRefund=" + isRefund)
	},
	// 去赚钱
	makeMoney: function () {
		navigateTo('./share/share?level=' + this.data.level)
	},


	switchNav: utilclick.throttle(function (e) {
		var mythis = this;
		wx.showLoading({
			title: '加载中...'
		})
		mythis.setData({
			page: 1,
			listData: [],
			page: 1,
			hasmore: true,
		})
		const {
			offsetLeft
		} = e.currentTarget;
		const {
			id,
			index
		} = e.currentTarget.dataset;
		var clientX = e.detail.x;
		var screenIndex = e.currentTarget.dataset.index
		if (screenIndex == 0) {
			mythis.endorsement()

		} else if (screenIndex == 1) {
			mythis.fansList()
		} else {
			mythis.contributionList()

		}
		if (clientX < 60) {
			this.setData({
				scrollLeft: offsetLeft - 60
			});
		} else if (clientX > 330) {
			this.setData({
				scrollLeft: offsetLeft
			});
		}
		this.setData({
			active: index
		});


	}, 800),
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		// 顶部tab  一直置顶
		var that = this;
		var query = wx.createSelectorQuery()
		query.select('#tab-con').boundingClientRect(function (res) {
			that.setData({
				tabScrollTop: res.top + 100 //根据实际需求加减值
			})
		}).exec()
		// 筛选
		this.animation = wx.createAnimation()
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var that = this
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
	// 贡献榜单
	contributionList: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			page: that.data.page,
			rows: 10
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustAssets/getDownlinList', parms,
			(res) => {
				for (var i in res.datas.custList) {
					that.data.listData.push(res.datas.custList[i])
				}
				that.setData({
					listData: that.data.listData,
					hasmore: res.hasmore

				})
				wx.hideLoading()
			},
			(err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	// 关注粉丝
	followFans: function (e) {
		var that = this
		var follow = e.currentTarget.dataset.follow
		var id = e.currentTarget.dataset.id
		if (!follow) {
			// 关注
			that.follow(id)
		} else {
			// 取关
			that.takefollow(id)
		}

	},

	// follow  true为已关注  false为未关注
	// 取消关注
	takefollow: function (id) {
		var that = this
		let parms = {
			friendId: id,
			key: wx.getStorageSync('key'),
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustIndex/cancelFollow', parms,
			(res) => {
				for (let i in that.data.listData) {
					if (id == that.data.listData[i].id) {
						if (that.data.listData[i].follow) {
							that.data.listData[i].follow = false
						} else {
							that.data.listData[i].follow = true
						}
					}
				}
				that.setData({
					listData: that.data.listData
				})
				wx.showToast({
					title: '取消关注成功',
					icon: 'none',
					duration: 1500
				})
			},
			(err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	// 关注
	follow: function (id) {
		var that = this
		let parms = {
			friendId: id,
			key: wx.getStorageSync('key'),
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustIndex/follow', parms,
			(res) => {
				for (let i in that.data.listData) {
					if (id == that.data.listData[i].id) {
						if (that.data.listData[i].follow) {
							that.data.listData[i].follow = false
						} else {
							that.data.listData[i].follow = true
						}
					}
				}
				that.setData({
					listData: that.data.listData
				})
				wx.showToast({
					title: '关注成功',
					icon: 'none',
					duration: 1500
				})
			},
			(err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		wx.showLoading({
			title: '加载中...'
		})
		var that = this;
		that.data.page += 1
		that.setData({
			page: that.data.page
		})
		if (that.data.active == 0) {
			if (that.data.hasmore) {
				that.endorsement()
			} else {
				wx.hideLoading()
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1500
				})
			}

		} else if (that.data.active == 1) {
			if (that.data.hasmore) {
				that.fansList()
			} else {
				wx.hideLoading()
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1500
				})
			}
		} else if (that.data.active == 2) {
			if (that.data.hasmore) {
				that.contributionList()
			} else {
				wx.hideLoading()
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1500
				})
			}
		}
	},
	// 展示弹出框
	exhibition: function () {
		var that = this;
		if (this.data.yiciRule) {
			that.setData({
				yiciRule: false
			})
		} else {
			that.setData({
				yiciRule: true
			})
		}
	},
	// 代言费
	endorsement: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			page: that.data.page,
			rows: that.data.rows
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustAssets/getAgentInfo', parms,
			(res) => {
				for (var i in res.datas.custOrderList) {
					that.data.listData.push(res.datas.custOrderList[i])
				}
				that.setData({
					listData: that.data.listData,
					hasmore: res.hasmore,
					receiveMoney: res.datas.receiveMoney.toFixed(2), //可以提现金额
					totalMoney: res.datas.totalMoney.toFixed(2),//总收益
					nowMoney: res.datas.nowMoney.toFixed(2), //当前金额
					extractMoney: res.datas.extractMoney.toFixed(2),//已提现金额
					frozen: res.datas.frozen.toFixed(2),//冻结金额
					boundInfo: res.datas.boundInfo,		//是否绑定支付宝微信等
					hide: true
				})
				wx.hideLoading()
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	//粉 丝
	fansList: function () {
		var that = this;
		let parms = {
			key: wx.getStorageSync('key'),
			page: that.data.page,
			rows: that.data.rows
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustAssets/getAgentList', parms,
			(res) => {
				// follow  true为已关注  false为未关注
				for (var i in res.datas.friendList) {
					if (res.datas.friendList[i].isAttention == 1) {
						res.datas.friendList[i].follow = true
					} else {
						res.datas.friendList[i].follow = false
					}
					that.data.listData.push(res.datas.friendList[i])

				}
				that.setData({
					listData: that.data.listData,
					hasmore: res.datas.hasmore
				})
				wx.hideLoading()
			}, (err) => {

			})
	},
	goOrderList: function () {
		wx.showToast({
			title: '好友订单收货15天后到账',
			icon: 'none',
			duration: 2000
		})
	}
	/**
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function () {

	// }
})