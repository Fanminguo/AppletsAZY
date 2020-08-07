// pages/myAssets/introduction/introduction.js
var app = getApp();
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hide: false,
		page: 1,
		list: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		that.Introduction()
	},
	// 查看详情
	goLanding: function (e) {
		var that = this
		var article_id = e.currentTarget.dataset.article_id
		if(article_id== 256){
			navigateTo('/pages/myAssets/introduction/blockchain/blockchain')
		}else if(article_id == 257){
			navigateTo('/pages/myAssets/introduction/giftCard/giftCard')
		}else if(article_id == 255){
			navigateTo('/pages/myAssets/introduction/spokesman/spokesman')
		}else{
			navigateTo('../yPorcelain/landingPage/landingPage?article_id=' + article_id + '&bjFalse=' + 1)
		}
	},
	Introduction: function (receive_type) {
		var that = this
		let parms = {
			key: wx.getStorageSync('key'),
			page: that.data.page,
			rows: 10
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustAssets/moneyStrategy', parms,
			(res) => {
				for (let i in res.datas.article_info) {
					that.data.list.push(res.datas.article_info[i])
				}
				wx.hideLoading()
				that.setData({
					hide: true,
					list: that.data.list
				})
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
		// var that = this
		// that.data.page += 1
		// that.setData({
		// 	page: that.data.page
		// })
		// if (that.data.) {

		// }
		// that.Introduction()
	},

	/**
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function () {

	// }
})