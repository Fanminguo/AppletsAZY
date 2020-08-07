// pages/document/document.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var http = require('../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
	data: {
		hide: false,
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {
		var mythis = this;
		agreement(mythis)
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

function agreement(mythis) {
	let parms = {}
	http.getRequest(app.globalData.apiUrl + '/cli/document/agreement',parms,
	(res)=>{
		var text = res.datas.doc_content
		WxParse.wxParse('text', 'html', text, mythis, 5);
		mythis.setData({
			hide: true
		})
	},(err)=>{
		wx.showToast({
		  title: err.datas.error,
		  icon:'none',
		  duration:1000
		})
	})

}