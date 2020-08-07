// pages/myAssets/yPorcelain/yPorcelain.js
var app = getApp();
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
const utilclick = require('../../../utils/util.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		btns: ["明细", "动态", "任务"],
		active: 0,//控制当前显示盒子 
		asterisk: '****',  //星号
		eye: true,//眼睛  true时候为睁眼
		eye1: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/icon_yjcopy@2x.png',//睁眼
		eye2: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/yanjing_2.png',//闭眼
		yici_record_info: [],
		page: 1,
		rows: 10,
		hide: false,
		yiciRule: false,
		article_info: [],
		hideCode: false,
	},
	loadApp: function () {
		this.setData({
			hideCode: true
		})
	},
	// 关闭二维码
	guanbi1: function () {
		this.setData({
			hideCode: false
		})
	},
	// tab切换
	// toggle: function (e) {
	// 	var that = this
	// 	wx.showLoading({
	// 		title: '加载中...'
	// 	})
	// 	that.setData({
	// 		//设置active的值为用户点击按钮的索引值
	// 		active: e.currentTarget.dataset.index,
	// 		page: 1,
	// 		yici_record_info:[],
	// 		article_info:[],
	// 	})
	// 	if (that.data.active == 1) {
	// 		that.dynamic()
	// 	} else if (that.data.active == 2) {
	// 		that.yCtask()
	// 	} else {
	// 		that.yiciNum()
	// 	}
	// },
	switchNav: utilclick.throttle(function (e) {
		var mythis = this;
		mythis.setData({
			yici_record_info: [],
			article_info: [],
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
		console.log(screenIndex)
		if (screenIndex == 0) {
			wx.showLoading({
				title: '加载中...'
			})
			mythis.yiciNum()

		} else if (screenIndex == 1) {
			wx.showLoading({
				title: '加载中...'
			})
			mythis.dynamic()
		} else {
			wx.showLoading({
				title: '加载中...'
			})
			mythis.yCtask()

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

	goData: function () {
		navigateTo('../../personalData/personalData')
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
	// 跳转订单
	goOrderList: function () {
		wx.showModal({
			title: '小提示',
			content: '订单确认收货15天后，易瓷币立即到账',
			confirmText: "我知道了",
			showCancel: false,
			success: function (res) {
				if (res.confirm) {
					navigateTo('../../order/order?index=' + 2)
				} else if (res.cancel) {
				}
			}
		})
	},
	// 转入
	transfer: function () {
		navigateTo('../transfer/transfer')
	},
	// 转出
	transferYici: function () {
		let that = this
		console.log(that.data.yici_charge_address)
		if (that.data.yici_charge_address != '') {
			navigateTo('../transferYici/transferYici')
		} else {
			navigateTo('../../set/setAccount/wallet/wallet')
		}
	},

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
	// 跳转详情
	goOrder: function (e) {
		var account = e.currentTarget.dataset.account
		var admin_verify_state = e.currentTarget.dataset.admin_verify_state
		var operator_time = e.currentTarget.dataset.operator_time
		var remark = e.currentTarget.dataset.remark
		var rollout_id = e.currentTarget.dataset.rollout_id
		var rollout_sn = e.currentTarget.dataset.rollout_sn
		var should_send_num = e.currentTarget.dataset.should_send_num
		var yici_receive_id = e.currentTarget.dataset.yici_receive_id
		var yici_receive_name = e.currentTarget.dataset.yici_receive_name
		var yici_receive_type = e.currentTarget.dataset.yici_receive_type
		var products_name = e.currentTarget.dataset.products_name
		var order_sn = e.currentTarget.dataset.order_sn
		var order_id = e.currentTarget.dataset.order_id
		navigateTo('../detailed/detailed?account=' + account + '&admin_verify_state=' + admin_verify_state + "&operator_time=" + operator_time + "&remark=" + remark + "&rollout_id=" + rollout_id + '&rollout_sn=' + rollout_sn + '&should_send_num=' + should_send_num + '&yici_receive_id=' + yici_receive_id + '&yici_receive_name=' + yici_receive_name + "&yici_receive_type=" + yici_receive_type + '&products_name=' + products_name + "&order_sn=" + order_sn + '&order_id='+order_id)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		that.yiciNum()
	},

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
		this.yiciNum()
		if (this.data.active == 2) {
			this.yCtask()
		}
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
		wx.showLoading({
			thtle: '加载中...'
		})
		var that = this;
		that.data.page += 1
		that.setData({
			page: that.data.page,

		})
		if (that.data.active == 1) {

			that.dynamic()
		} else if (that.data.active == 2) {

			that.yCtask()
		} else {

			if (that.data.hasmore) {
				that.yiciNum()
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
	yiciNum: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			page: that.data.page,
			rows: that.data.rows
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustYici/Index', parms,
			(res) => {
				that.setData({
					yici_record_info:[]
				})
				for (var i in res.datas.yici_record_info) {
					that.data.yici_record_info.push(res.datas.yici_record_info[i])
				}
				that.setData({
					yici_info: res.datas.yici_info,//金额等
					yici_record_info: that.data.yici_record_info,
					hasmore: res.datas.hasmore,
					hide: true,
					yici_charge_address: res.datas.yici_info.yici_charge_address
				})
				wx.hideLoading()
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 2000
				})
			})
	},
	dynamic: function () {
		var that = this
		let parms = {
			page: that.data.page,
			rows: 10,
			key: wx.getStorageSync('key'),
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustYici/yiciNotice', parms,
			(res) => {
				for (var i in res.datas.article_info) {
					that.data.article_info.push(res.datas.article_info[i])
				}
				wx.hideLoading()
				that.setData({
					article_info: that.data.article_info
				})
			}, (err) => {

			})
	},
	goIndex: function () {
		navigateTo('../../index/index')
	},
	// 查看动态
	goLanding: function (e) {
		var that = this
		var article_id = e.currentTarget.dataset.article_id
		navigateTo('./landingPage/landingPage?article_id=' + article_id)
	},
	// 任务
	yCtask: function () {
		var that = this;
		let parms = {
			key: wx.getStorageSync('key'),
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustYici/YiciTask', parms,
			(res) => {
				that.setData({
					app_status: res.datas.app_status,
					data_status: res.datas.data_status,
					gzh_status: res.datas.gzh_status,
					weixin_login: res.datas.weixin_login,
				})
				wx.hideLoading()
			}, (err) => {

			})
	},
	goGongzhong: function () {
		navigateTo('./gongzhonghao/gongzhonghao')
	},
	lingqu: function (e) {
		var that = this
		var receive_type = e.currentTarget.dataset.receive_type
		that.lingquPost(receive_type)
	},
	// 待领取
	lingquPost: function (receive_type) {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			receive_type: receive_type
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustYici/yiciTaskReceive', parms,
			(res) => {
				// if(that.data.app_status == 2){	//app
				// 	that.setData({
				// 		app_status:3
				// 	})
				// }else if(that.data.data_status ==2){
				// 	that.setData({
				// 		data_status:3
				// 	})
				// }else if(that.data.gzh_status == 2){
				// 	that.setData({
				// 		gzh_status:3x
				// 	})
				// }
				that.yiciNum()
				that.yCtask()
				wx.hideLoading()
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	}
})