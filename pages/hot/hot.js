// pages/hot/hot.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   data:[],
   hide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData()
  },
  queryData: function (e) {
    var that = this;
    let prams = {
      key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/promotionGuide/activity', prams,
      function (res) {
        wx.hideLoading()
        that.setData({
          data: res.datas,
          hide: true
        })
      },
      function (err) {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })
  },
  tolimit: function () {
    navigateTo('../limit/limit')
  },
  togroup: function () {
    navigateTo('/pages/groupOrder/groupList/groupList')
  },
  govideo: function (e) {
    var products_commonid = e.currentTarget.dataset.products_commonid
	  var products_id = e.currentTarget.dataset.products_id
    if (e.currentTarget.dataset.video_name) {
		navigateTo('../video_detail/video_detail?products_commonid=' + products_commonid + "&products_id=" + products_id)
    } else {
      navigateTo('../commodity/commodity?products_id=' + e.currentTarget.dataset.products_id)
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
	  this.queryData()
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
  // onShareAppMessage: function () {

  // }
})