// pages/myAssets/detailed/detailed.js
import navigateTo from "../../../utils/navigateRoute.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hide: false,
		yici: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		var that = this;
		that.setData({
			account: options.account,
			admin_verify_state: options.admin_verify_state,
			operator_time: options.operator_time,
			remark: options.remark,
			rollout_id: options.rollout_id,
			rollout_sn: options.rollout_sn,
			should_send_num: options.should_send_num,
			yici_receive_id: options.yici_receive_id,
			yici_receive_name: options.yici_receive_name,
			yici_receive_type: options.yici_receive_type,
			products_name: options.products_name,
			order_sn: options.order_sn,
			order_id:options.order_id
		})
		console.log(this.data.order_id)
	},
	goKefu: function () {
		if(this.data.order_id != undefined){
			navigateTo('../../orderDetails/orderDetails?order_id=' + this.data.order_id)
		}else{
			navigateTo('../../load_app/load_app?link=' + encodeURIComponent("https://www.echatsoft.com/visitor/mobile/chat.html?companyId=566"))

		}
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