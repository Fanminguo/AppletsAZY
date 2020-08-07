// pages/myAssets/introduction/giftCard/giftCard.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		listImg:[
			{img:'https://res.aizhiyi.com/uploadfile/mall/article/20200804/85558c0ec52d3577e77f15f4e5c5bd36.jpg'},
			{img:'https://res.aizhiyi.com/uploadfile/mall/article/20200804/dfd0b5f8f4f339a29bca868b944eaaaa.jpg'},
			{img:'https://res.aizhiyi.com/uploadfile/mall/article/20200804/26a9e6daef22b560f445c6ca88f04a5f.jpg'},
			{img:'https://res.aizhiyi.com/uploadfile/mall/article/20200804/9dbe93c0241c3fc73fad188ed3541c41.jpg'},
			{img:'https://res.aizhiyi.com/uploadfile/mall/article/20200804/b004a6397a85b345d9a8ea06a46fdcf1.jpg'},
			{img:'https://res.aizhiyi.com/uploadfile/mall/article/20200804/591a4beb4a5aba38eddf0d588e78c8d2.jpg'}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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
 // 分享朋友圈
 onShareTimeline: function (res) {
	return {
		title:'如何使用礼品卡',
		query: {
		},
		imageUrl: '',
	}
},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})