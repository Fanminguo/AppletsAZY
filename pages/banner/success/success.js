// pages/banner/success/success.js
import navigateTo from "../../../utils/navigateRoute.js"
var http = require('../../../utils/httputils.js');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		listData: [],
		hide:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		that.codeList()
	},
	// 列表
	codeList: function () {
		let parms = {
			key: wx.getStorageSync('key'),
		}
		let that = this;
		http.postRequest(app.globalData.apiUrl + '/cli/ProductsGift/store_products', parms,
			(res) => {
				for (let i in res.datas.products_list) {
					that.data.listData.push(res.datas.products_list[i])
				}
				that.setData({
					listData: that.data.listData,
					hide:true
				})
			}, (err) => {

			})
	},
	seeList: function () {
		navigateTo('../../index/index')
	},
	goodThings:function(){
		navigateTo('../../order/order?index=2' )
	},
	// 跳转详情页
    goData: function (e) {
        var products_commonid = e.currentTarget.dataset.products_commonid
	  var products_id = e.currentTarget.dataset.products_id
    if (e.currentTarget.dataset.video_name) {
		navigateTo('../../video_detail/video_detail?products_commonid=' + products_commonid + "&products_id=" + products_id)
    } else {
      navigateTo('../../commodity/commodity?products_id=' + e.currentTarget.dataset.products_id)
    }
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