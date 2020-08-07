// pages/live/report/report.js
const app = getApp()
import navigateTo from "../../../utils/navigateRoute.js"
var store_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide: false,
    is_showDialog:true,//图片上传弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData()
    store_id=options.store_id;
  },
  return:function(){
    wx.navigateBack({
        delta: 1,
    });
},
imgDialogHIde:function(){
    var that =this;
    that.setData({
        is_showDialog:false
    });
},
  godetail:function(e){
    var id = e.currentTarget.dataset.id;
	  var inner = e.currentTarget.dataset.inner;
    navigateTo('../report_detail/report_detail?id='+id+"&inner="+inner+"&store_id="+store_id)
  },
  queryData: function (e) {
    var that = this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + "/cli/LiveMyAnchor/report_reason_list",
      method: "POST",
      data: {
        key: wx.getStorageSync('key'),
      },
      success: function (res) {
        that.setData({
          list: res.data.datas.report_reason_list,
        })
      },
      complete:function(){
        that.setData({
					hide: true
				})
      },
      fail: function (res) {
        
      }
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
  // onShareAppMessage: function () {

  // }
})