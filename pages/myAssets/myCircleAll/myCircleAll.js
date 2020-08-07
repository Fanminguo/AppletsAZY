// pages/myAssets/myCircleAll/myCircleAll.js
const app = getApp()
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    rows:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.queryData(options.codeM);
  },
  queryData:function(codeM){
    var that=this;
    let parms = {
      key: wx.getStorageSync('key'),
      page:that.data.page,
      rows:that.data.rows,
      codeM:codeM,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/custMoment/getAllCustByMoments	', parms,
      (res)=>{
          that.setData({
            data: res.datas,
          })
      },(err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duration:1000
        })
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