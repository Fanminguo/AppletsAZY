// pages/set/setAccount/setAccount.js
const app = getApp()
import navigateTo from "../../../utils/navigateRoute.js"
var http = require('../../../utils/httputils.js')
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
		var that = this
		that.setType()
	},
	// 支付宝
	goZfb:function(){
		if(this.data.isBoundAlipay==null){
			navigateTo('./zfb/zfb')
		}
	},
	// 钱包地址
	tofeedback:function(){
		var that = this
		if(that.data.isExtract!=null){
			navigateTo('./modifyWallet/modifyWallet?address=' + that.data.isExtract)
		}else{
			navigateTo('./wallet/wallet')

		}
	},
	setType: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustConfig/extractSetting', parms,
			(res) => {
				that.setData({
					isBoundAlipay:res.datas.isBoundAlipay,
					isBoundWx:res.datas.isBoundWx,
					isExtract:res.datas.isExtract,
				})
			}, (err) => {

			}
		)
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.setData({
			hide: true
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var that = this
		that.setType()
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