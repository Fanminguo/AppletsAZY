// pages/myAssets/myCircle/myCircle.js
const app = getApp()
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:"1",
    hasmore:true,
    rows:"10",
    momentsList:[],
    hasmore:false,
    hide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.queryData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    

  },
  queryData:function(){
    var that=this;
    let parms = {
      key: wx.getStorageSync('key'),
      page:that.data.page,
      rows: that.data.rows,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/custMoment/getMomentsList', parms,
      (res)=>{
          that.setData({
            momentsList: that.data.momentsList.concat(res.datas.momentsList),
            hasmore: res.datas.hasmore,
            hide:true
          })
          
      },(err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duration:1000
        })
      })
  },
  getName:function(){
    wx.redirectTo({
      url:'../myCircleType/myCircleType'
    })
    // navigateTo('../myCircleType/myCircleType')
  },
  goInfo:function(e){
    var code = e.currentTarget.dataset.code
    navigateTo('../myCircleInfo/myCircleInfo?code='+code)
    // wx.redirectTo({
    //   url:'../myCircleInfo/myCircleInfo?code='+code
    // })
  },
  queryList:function(){

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
    var that = this;
    if (that.data.hasmore){
      that.setData({
        page: Number(that.data.page) + 1,
      })
      that.queryData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})