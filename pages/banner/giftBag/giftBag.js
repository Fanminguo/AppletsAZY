// pages/banner/giftBag/giftBag.js
import navigateTo from "../../../utils/navigateRoute.js"
var http = require('../../../utils/httputils.js');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hide:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	},
	// 立即兑换
	goCode: function () {
		if(wx.getStorageSync('cust_mobile')){
			navigateTo('../exchange/exchange?products_gift_bag_id=' + 18)
		}else{
			if(wx.getStorageSync('key')){
				navigateTo('../../bind_mobile/bind_mobile')
			}else{
				navigateTo('../../getUserInfo/getUserInfo')
			}
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.setData({
			hide:true
		})
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