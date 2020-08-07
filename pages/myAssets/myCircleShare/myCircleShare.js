// pages/endorsement/share/share.js
const app = getApp()
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
import QRCode from '../../../utils/weapp-qrcode.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hide: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;

		that.queryData(options.codeM)
	},
	//   生成二维码
	code: function () {
		var that = this
		new QRCode('myQrcode', {
			text: that.data.data.url,
			width: 77,
			height: 77,
			padding: 1, // 生成二维码四周自动留边宽度，不传入默认为0
			// correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
			callback: (res) => {
				that.setData({
					hide: true
				})
				// 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
			}
		})
	},
	queryData: function (codeM) {
		var that = this;
		let parms = {
			key: wx.getStorageSync('key'),
			codeM: codeM

		}
		http.postRequest(app.globalData.apiUrl + '/cli/custMoment/getMomentsQrcodeUrl', parms,
			(res) => {
				that.setData({
					data: res.datas,
					
				})
				that.code()
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1000
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
	// onShareAppMessage: function () {

	// }
})