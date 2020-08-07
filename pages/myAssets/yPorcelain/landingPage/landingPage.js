// pages/myAssets/yPorcelain/landingPage/landingPage.js
var app = getApp();
var http = require('../../../../utils/httputils.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hide: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		that.setData({
			article_id: options.article_id,
			bjFalse:options.bjFalse
		})
		that.landingPage()
	},
	landingPage: function () {
		var that = this
		let parms = {
			article_id: that.data.article_id,
			key: wx.getStorageSync('key'),
			// key: '48387a9c9c1d14806edf1d951cadbd76',
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustYici/yiciDetail', parms,
			(res) => {
				console.log(res)
				that.setData({
					hide:true,
					// article_content:res.datas.article_content
				})
				var article = res.datas.article_content;
				WxParse.wxParse('article', 'html', article, that,5);
			}, (err) => {

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

})