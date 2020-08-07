// pages/myAssets/myAssets.js
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		spellList: [{
			spellImg: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/01@2x.png',
			spellName: '我的二维码',
			click: 'nameCode'
		}, {
			spellImg: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/02@2x.png',
			spellName: '我的好友圈子',
			click: 'myCircle'
		}, {
			spellImg: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/03@2x.png',
			spellName: '赚钱攻略',
			click: 'goIntroduction'
		}
		],
		setInter: '',
		num: 0,
		hide: false,
		closeShow:false,
		// isClass:false
	},
	// 我的二维码
	nameCode: function () {
		navigateTo('../endorsement/share/share?level=' + this.data.level)
	},
	// 赚钱攻略
	goIntroduction:function(){
		navigateTo('./introduction/introduction')
	},
	 // 好友
	 myCircle:function(){
		navigateTo('./myCircle/myCircle')
	  },
	// 排行榜
	rankingList: function (e) {
		var now_year_totalMoney = e.currentTarget.dataset.id
		navigateTo('./rankingList/rankingList?now_year_totalMoney=' + now_year_totalMoney)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var mythis = this;
		mythis.assetsHome()
		mythis.gundong()
	},
	goData:function(){
		navigateTo('../personalData/personalData')
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
		this.assetsHome()
	},
	
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},
	// 权益
	goequity: function () {
		var that = this;
		navigateTo('./equity/equity?level=' + that.data.level)

	},
	// 易瓷币
	goYici: function () {
		var that = this;
		navigateTo('./yPorcelain/yPorcelain')
	},
	// 代言费
	goEndorsement: function () {
		var that = this;
		if(that.data.assets.level>0){
			navigateTo('../endorsement/endorsement?level=' + that.data.level)
		}else{
			that.setData({
				closeShow:true
			})
		}
	},
	// 关闭
	close:function(){
		var that = this
		that.setData({
			closeShow:false
		})
	},
	// 落地页
	goWeb:function(){
		navigateTo('../load_app/load_app?link=' + encodeURIComponent("https://bj.aizhiyi.com/wap/banner/assets.html"))
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
	// onShareAppMessage: function () {

	// },
	// 资产首页
	assetsHome: function () {
		var mythis = this
		let parms = {
			key: wx.getStorageSync('key')
		}
		http.postRequest(app.globalData.apiUrl + '/cli/CustAssets/index', parms,
			(res) => {
				if (res.invitationCode) {
					wx.setStorageSync('agent_code', res.invitationCode);
				}
				mythis.setData({
					assets: res.datas.cust_info,
					level: res.datas.cust_info.level,
					hide: true,
					now_year_totalMoney:parseFloat(res.datas.cust_info.now_year_totalMoney).toFixed(4)
				})
				wx.setStorageSync('avatar', res.datas.cust_info.avatar);
				wx.setStorageSync('cust_nickname', res.datas.cust_info.cust_nickname);
				if (res.datas.cust_info.money_percentage >= 93 && res.datas.cust_info.money_percentage != 100) {		//93
					mythis.setData({
						money_percentage: 91
					})
				} else if (res.datas.cust_info.money_percentage >= 80 && res.datas.cust_info.money_percentage < 90) {
					mythis.setData({
						money_percentage: 70
					})
				} else if (res.datas.cust_info.money_percentage == 100) {
					mythis.setData({
						money_percentage: 93
					})
				} else {
					mythis.setData({
						money_percentage: res.datas.cust_info.money_percentage
					})
				}
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	},
	// 资产首页
	gundong: function () {
		var mythis = this
		let parms = {
			key: wx.getStorageSync('key')
		}
		http.postRequest(app.globalData.apiUrl + '/cli/Push/cust_profit_info', parms,
			(res) => {
				mythis.setData({
					gundong: res.datas.cust_profit_list,
					hide: true,
					isClass:true
				})
			}, (err) => {
				wx.showToast({
					title: err.datas.error,
					icon: 'none',
					duration: 1500
				})
			})
	}
})