// pages/myNews/newsInform/newsInform.js
var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../../utils/httputils.js');   //相对路径
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hide: false,
		page: 1,
		rows: 10,
		state: 1,
		inform: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var mythis = this;
		if (!wx.getStorageSync('key')) {
			app.login()
		}
		mythis.setData({
			key: wx.getStorageSync('key')
		})
		inform(mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
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
		var mythis = this;
		wx.showLoading({
			title: '玩命加载中...',
		});
		if (mythis.data.hasmore) {
			mythis.data.page = mythis.data.page + 1;
			inform(mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
		} else {
			wx.hideLoading();
		}


	},

	/**
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function () {

	// },
	// 物流详情
	goDetails: function (e) {
		// 查看详情
		console.log('查看详情' + e)
		var order_id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/orderDetails/orderDetails?order_id=' + order_id,
		})
	},
	// 订单详情
	goOrder: function (e) {
		var order_id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/orderDetails/orderDetails?order_id=' + order_id,
		})
	}
})
function inform(page, rows, key, mythis) {
	let parms = {
		page: page,
		rows: rows,
		key: key,
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/deliver_list', parms,
		(res) => {
			for (var i = 0; i < res.datas.transaction_list.length; i++) {
				mythis.data.inform.push(res.datas.transaction_list[i]);
			}
			mythis.setData({
				inform: mythis.data.inform,
				hasmore: res.hasmore,
				state: 1,
				hide: true
			});
			wx.hideLoading();
			if (!mythis.data.hasmore) {
				mythis.setData({
					state: 0
				})
			}
		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 1500
			})
		})
}