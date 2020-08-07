// pages/myAssets/transferYici/transferYici.js
var app = getApp();
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		numberList: [
			{ num: 50, select: false, index: '0' },
			{ num: 80, select: false, index: '1' },
			{ num: 100, select: false, index: '2' },
			{ num: 200, select: false, index: '3' },
			{ num: 400, select: false, index: '4' },
			{ num: 600, select: false, index: '5' },
			{ num: 800, select: false, index: '6' },
			{ num: 1000, select: false, index: '7' },
			{ num: 1500, select: false, index: '8' },
		],
		maximum: 500,
		eject: false,
		amount: '',
		brokerage: '',
		yici_record_info:[],
		hide:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var _this = this
		_this.stepOne()
	},
	// 选择
	selectCli: function (e) {
		var _this = this
		var index = e.currentTarget.dataset.index
		var num = e.currentTarget.dataset.num
		for (let i in _this.data.numberList) {
			_this.data.numberList[i].select = false
		}
		_this.setData({ numberList: _this.data.numberList })
		for (let i in _this.data.numberList) {
			if (_this.data.numberList[i].index == index) {
				if (_this.data.account_available_num < num) {
					wx.showToast({
						title: '余额不足请重新选择',
						icon: 'none',
						duration: 1500
					})
					_this.setData({
						amount: "",
						brokerage: ''
					})
					return;
				} else {
					_this.data.numberList[i].select = true
					_this.setData({
						brokerage: (e.currentTarget.dataset.num * _this.data.yici_service_charge1).toFixed(4),
						numberList: _this.data.numberList,
						amount: e.currentTarget.dataset.num
					})
				}

			}
		}
	},
	// 打开弹出
	subdata: function () {
		var that = this
		if (that.data.amount != '') {
			that.setData({
				eject: true
			})
		} else {
			wx.showToast({
				title: '请选择转出金额',
				icon: 'none',
				duration: 1500
			})
		}
	},
	// 关闭弹出
	exhibition: function () {
		var that = this
		that.setData({
			eject: false
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
	// 加载最大提现
	stepOne: function () {
		let _this = this
		let parms = {
			key: wx.getStorageSync('key')
			// key: '48387a9c9c1d14806edf1d951cadbd76',
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustYici/applyRolloutStep1', parms,
			(res) => {
				_this.setData({
					account_available_num: res.datas.account_available_num,
					yici_charge_address: res.datas.yici_charge_address,
					yici_service_charge: res.datas.yici_service_charge * 100,
					yici_service_charge1: res.datas.yici_service_charge,
					hide:true
				})
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	// 确认转出
	transferOutTwo: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			// key: '48387a9c9c1d14806edf1d951cadbd76',
			rollout_num: that.data.amount,
			brokerage: that.data.brokerage,
			yici_charge_address: that.data.yici_charge_address
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustYici/applyRolloutStep2', parms,
			(res) => {
				// wx.showToast({
				// 	title: '请等待审核',
				// 	icon: 'success',
				// 	duration: 1500
				// })
				that.setData({
					eject: false,
					hide:true
				})
				// setTimeout(wx.navigateBack({
				// 	delta: 1,
				// }),1500);
				that.yiciNum()
			},
			(err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	// 列表
	yiciNum: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			page: that.data.page,
			rows: that.data.rows
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustYici/Index', parms,
			(res) => {
				that.data.yici_record_info.push(res.datas.yici_record_info[0])
				var account = that.data.yici_record_info[0].account
				var admin_verify_state = that.data.yici_record_info[0].admin_verify_state
				var operator_time = that.data.yici_record_info[0].operator_time
				var remark = that.data.yici_record_info[0].remark
				var rollout_id = that.data.yici_record_info[0].rollout_id
				var rollout_sn = that.data.yici_record_info[0].rollout_sn
				var should_send_num = that.data.yici_record_info[0].should_send_num
				var yici_receive_id = that.data.yici_record_info[0].yici_receive_id
				var yici_receive_name = that.data.yici_record_info[0].yici_receive_name
				var yici_receive_type = that.data.yici_record_info[0].yici_receive_type
				var products_name = that.data.yici_record_info[0].products_name
				var order_sn = that.data.yici_record_info[0].order_sn
				console.log(that.data.yici_record_info)
				wx.redirectTo({
					url: '../detailed/detailed?account=' + account + '&admin_verify_state=' + admin_verify_state + "&operator_time=" + operator_time + "&remark=" + remark + "&rollout_id=" + rollout_id + '&rollout_sn=' + rollout_sn + '&should_send_num=' + should_send_num + '&yici_receive_id=' + yici_receive_id + '&yici_receive_name=' + yici_receive_name + "&yici_receive_type=" + yici_receive_type + '&products_name=' + products_name + "&order_sn=" + order_sn
				})
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 2000
				})
			})
	},
})