// pages/banner/exchange/exchange.js
import navigateTo from "../../../utils/navigateRoute.js"
var http = require('../../../utils/httputils.js');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		address_id: '',
		hide: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			products_gift_bag_id: options.products_gift_bag_id
		})
		this.queryData()

	},
	//   编辑
	toaddress: function () {
		navigateTo('../../addressList/addressList?home=2')
	},
	//   新增
	address: function () {

		navigateTo('../../addressList/address/address?home=2')
	},
	//地址
	queryData: function () {
		let that = this
		let parms = {
			key: wx.getStorageSync('key'),
			// address_id: 12159,
			products_gift_bag_id: that.data.products_gift_bag_id,
			address_id: that.data.address_id
		}
		http.postRequest(app.globalData.apiUrl + '/cli/ProductsGift/buy_step', parms,
			(res) => {
				that.setData({
					data: res.datas.address_info,
					offpay_hash: res.datas.offpay_hash,
					offpay_hash_batch: res.datas.offpay_hash_batch,
					vat_hash: res.datas.vat_hash,
					hide: true
				})
				if (res.datas.address_info != null) {
					that.setData({
						address_id:res.datas.address_info.address_id
					})
				}
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 2000
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
		// this.queryData()
	},
	bindKeyInput: function (e) {
		let that = this
		that.setData({
			gift_card_code: e.detail.value
		})
	},
	// 提交
	formBtn: function () {
		let that = this
		that.code()
	},
	code: function () {
		let that = this
		let parms = {
			key: wx.getStorageSync('key'),
			pay_name: 'online',
			offpay_hash: that.data.offpay_hash,
			offpay_hash_batch: that.data.offpay_hash_batch,
			vat_hash: that.data.vat_hash,
			address_id: that.data.address_id,
			products_gift_bag_id: that.data.products_gift_bag_id,
			gift_card_code: that.data.gift_card_code
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustCodeBuy/buy_step2', parms,
			(res) => {
				navigateTo('../success/success')
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 2000
				})
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})