// pages/endorsement/share/share.js
const app = getApp()
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
import QRCode from '../../../utils/weapp-qrcode.js'
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750 / W;
// 300rpx 在6s上为 150px
var  qrcode_w = 300 /rate;
var qrcode
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// qrcode_w: qrcode_w,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		that.setData({
		// 	avatar: wx.getStorageSync('avatar'),
		// 	cust_nickname: wx.getStorageSync('cust_nickname'),
			level: options.level
		})
		that.nameCode()
	},
	code: function () {
		var that = this
		console.log(qrcode_w)
		if(qrcode_w > 165){
			that.setData({
				qrcode_w:84
			})
			qrcode = 81
		}else{
			that.setData({
				qrcode_w:75
			})
			qrcode = 72
		}
		new QRCode('myQrcode', {
            text:  that.data.url,
            width: qrcode,
            height: qrcode,
            colorDark: "#000",
			colorLight: "white",
			// padding: 1,
			// correctLevel: QRCode.CorrectLevel.H,
			callback: (res) => {
				that.setData({
					hide: true
				})
				// 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
			}
        });
		// new QRCode('myQrcode', {
		// 	text: that.data.url,
		// 	width: 70,
		// 	height: 70,
		// 	padding: 1, // 生成二维码四周自动留边宽度，不传入默认为0
		// 	correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
		// 	callback: (res) => {
		// 		that.setData({
		// 			hide: true
		// 		})
		// 		// 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
		// 	}
		// })
	},
	
	goIndex: function () {
		wx.navigateTo({
			url: '/pages/index/index',
		})
	},
	nameCode: function () {
		let that = this
		let parms = {
			key:wx.getStorageSync('key')
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustIndex/getCustAvatarCode', parms,
		(res)=>{
			that.setData({
				avatar:res.datas.custInfo.custAvatar,
				cust_nickname:res.datas.custInfo.custName,
				url:res.datas.qrcodeUrl
			})
			that.code()
		},(err)=>{

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