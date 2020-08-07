// pages/set/set.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');   //相对路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  queryData: function () {
    var that = this;
    let parms = {
      key: wx.getStorageSync('key'),
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustAccount/getMobileInfo',parms,
    (res)=>{
      that.setData({
        hide: true,
        bind_phone: res.datas.bind_phone
      })
    },(err)=>{
      wx.showToast({
        icon: "none",
        title: err.datas.error,
        duration: 1000
      })
    })
   
  },
  // 提现账户
  goSet:function(){
    navigateTo('./setAccount/setAccount')
  },
  toabout:function(){
    navigateTo('../about/about')
  },
  tofeedback: function () {
    navigateTo('../feedback/feedback')
  },
  toedit: function () {
    var that=this
    if (that.data.bind_phone==0){
      navigateTo('../edit_mobile1/edit_mobile1')
    }else{
      navigateTo('../bind_mobile/bind_mobile')
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData();
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