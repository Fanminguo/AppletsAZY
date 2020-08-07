// pages/myAssets/introduction/spokesman/spokesman.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		listImg: [
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/ec38ae90f50567627a5b72ddc3fad786.jpg' },
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/3f55c5df4f9c8765f2d6b6e812398bfa.jpg' },
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/8e295f77ed318cd09aea23c585af2f30.jpg' },
			{ img: 'https://res.aizhiyi.com/uploadfile/mall/article/20200804/1d9660e7c53b5b16fc685ac16fbcda71.jpg' }
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	
	goCircle:()=>{
		wx.navigateTo({
			url: '/pages/myAssets/myCircleType/myCircleType',
		})
	},
	goIndex: () => {
		wx.reLaunch({
			url: '/pages/index/index',
		})
	},
	goCarry: () => {
		wx.navigateTo({
			url: '/pages/myAssets/yPorcelain/yPorcelain',
		})
	},
	 // 分享朋友圈
	 onShareTimeline: function (res) {
        return {
            title:'千万补贴，等你来拿',
            query: {
            },
            imageUrl: '',
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