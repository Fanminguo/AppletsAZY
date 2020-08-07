// pages/myAssets/rankingList/rankingList.js
var http = require('../../../utils/httputils.js');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		rankingList: [],
		yiciRule: false,
		hide:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		that.rankingList()
		that.setData({
			now_year_totalMoney: options.now_year_totalMoney
		})
	},
	rankingList: function () {
		var that = this
		let parms = {
			key: wx.getStorageSync('key')
		}
		http.getRequest(app.globalData.apiUrl + '/cli/CustAssets/totalRevenueList', parms,
			(res) => {
				console.log(res)
				for (let i in res.datas.custAssetsList) {
					that.data.rankingList.push(res.datas.custAssetsList[i])
				}
				that.setData({
					rankingList: that.data.rankingList,
					ranking: res.datas.ranking,
					cust_assets_info: res.datas.cust_assets_info,
					cust_nickname: wx.getStorageSync('cust_nickname'),
					avatar: wx.getStorageSync('avatar'),
					hide:true
				})
			},
			(err) => {

			})
	},
	// 展示弹出框
	showRule: function () {
		var that = this;
		if (this.data.yiciRule) {
			that.setData({
				yiciRule: false
			})
		} else {
			that.setData({
				yiciRule: true
			})
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
			var url = 'pages/index/index'
		  return {
			title: '我发现了一家专卖“中国精品好物”的平台，既可购物，也可赚钱，赶快来看看',
			path: url,
			imageUrl: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/75.png',
		  }
	}
})