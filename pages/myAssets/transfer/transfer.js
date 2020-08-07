// pages/myAssets/transfer/transfer.js
var app = getApp();
var http = require('../../../utils/httputils.js');
import QRCode from '../../../utils/weapp-qrcode.js'

import navigateTo from "../../../utils/navigateRoute.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		yici_address: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		that.changeInto()
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
	// 复制
	copyText: function (e) {
		console.log(e)
		wx.setClipboardData({
			data: e.currentTarget.dataset.text,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: '复制成功'
						})
					}
				})
			}
		})
	},
	//   生成二维码
	code: function () {
		var that = this
		new QRCode('myQrcode', {
			text: that.data.yici_address,
			width: 160,
			height: 160,
			padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
			correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
			callback: (res) => {
				console.log(res.path)
				// 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
			}
		})
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
	changeInto: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key')
			// key: '48387a9c9c1d14806edf1d951cadbd76',
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustYici/YiciWalletRecharge', parms,
			(res) => {
				that.setData({
					yici_address: res.datas.yici_recharge_address
				})
				that.code()
			}, (err) => {
				wx.showToast({
				  title: err.datas.error,
				  icon:'none',
				  duration:1500
				})
			})
	}
	/**
	 * 用户点击右上角分享
	 */
	// 	onShareAppMessage: function () {

	// 	}
})