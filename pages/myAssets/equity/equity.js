// pages/myAssets/equity/equity.js
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
		that.setData({
			level: options.level
		})
	},
	// 首页
	goIndex: function () {
		wx.reLaunch({
			url: '../../index/index',
		})
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		var mythis = this
		var url = 'pages/index/index?&agent_code=' + wx.getStorageSync('agent_code')
		var title = '精选中国精品好物，尽在爱之依-精品中国'
		var imageUrl = 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/cd33.png'
		return {
			title: title,
			path: url,
			imageUrl: imageUrl
		}
	}
})