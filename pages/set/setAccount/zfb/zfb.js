// pages/set/setAccount/zfb/zfb.js
const app = getApp()
import navigateTo from "../../../../utils/navigateRoute.js"
var http = require('../../../../utils/httputils.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	// 名称
	bindKeyInputName: function (e) {
		this.setData({
			inputValueName: e.detail.value
		})
		console.log(this.data.inputValueName)
	},
	//   账号
	bindKeyInputNumber: function (e) {
		this.setData({
			inputValueNumber: e.detail.value
		})
		console.log(this.data.inputValueNumber)
	},
	//   手机号

	bindKeyInput: function (e) {
		const number = /^1[3456789]\d{9}$/;
		if (number.test(e.detail.value)) {
			this.setData({
				mob_phone: e.detail.value
			})
			console.log(this.data.mob_phone)
		} else {
			if (e.detail.value.length == 11) {
				wx.showToast({
					title: '请输入正确的手机号',
					icon: 'none',
					duration: 2000
				})
			}
		}
	},
	//   提交
	tijiao: function () {
		let that = this;
		if (that.data.mob_phone == undefined && that.data.inputValueName == undefined && that.data.inputValueNumber == undefined) {
			wx.showToast({
				title: '请完善支付宝信息',
				icon: 'none',
				duration: 1500
			})
		} else {
			that.binding()
			
		}
	},
	binding: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			alipayLoginId: that.data.inputValueNumber,
			alipayName: that.data.inputValueName,
			mobile: that.data.mob_phone
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustConfig/extractBinding', parms,
			(res) => {
				console.log(res)
				 wx.navigateBack({
                            delta: 1,
                        });
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})