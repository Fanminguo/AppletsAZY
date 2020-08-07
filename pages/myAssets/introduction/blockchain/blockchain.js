// pages/myAssets/introduction/blockchain/blockchain.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		listImg: [
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/128e10be3bd84c095fbbd22369277161.jpg' },
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/897de1ef5ae8c026112454a73ec0bb66.jpg' },
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/68049d2c78e5cf24a777dc952a353e95.jpg' },
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/1438ab5a3782fc9ade05b63009ec24ac.jpg' },
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/43f6b84b50d8f8f9fa3c5c463129ef82.jpg' }
		]
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	 // 分享朋友圈
	 onShareTimeline: function (res) {
        return {
            title:'区块链电商',
            query: {
            },
            imageUrl: '',
        }
    },
	goIndex: () => {
		wx.reLaunch({
			url: '/pages/index/index',
		})
	},
	goCarry: () => {
		wx.navigateTo({
			url: '/pages/myAssets/yPorcelain/yPorcelain'
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
	onShareAppMessage: function () {

	}
})