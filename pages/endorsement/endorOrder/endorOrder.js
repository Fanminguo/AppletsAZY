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
      custname:options.custname,
      isextract:options.isextract,
      money:options.money,
      ordertime:options.ordertime,
      ordertime2:options.ordertime2,
      paysn:options.paysn,
      sn:options.sn,
      extractType:options.extractType,
      extract_sn:options.extract_sn,
      ident:options.ident,
      phone:options.phone,
      status:options.status,
      isRefund:options.isRefund,
      cust_nickname:wx.getStorageSync('cust_nickname')
    })
  },
  goKefu: function () {
    navigateTo('../../load_app/load_app?link=' + encodeURIComponent("https://www.echatsoft.com/visitor/mobile/chat.html?companyId=566"))
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
	//  */
  // onReachBottom: function () {

  // },


})