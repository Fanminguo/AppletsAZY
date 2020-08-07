// pages/limit/limit.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    products_lsit:[],
    id:"",
    type:"",
    hide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData();
  },
  todetail:function(e){
    var products_commonid = e.currentTarget.dataset.products_commonid
    var products_id = e.currentTarget.dataset.productid
    var index = e.currentTarget.dataset.index
    navigateTo('/pages/video_detail/video_detail?products_id=' + products_id+"&products_commonid="+products_commonid + '&list='+encodeURIComponent(JSON.stringify(this.data.products_lsit)) + "&index=" + index)
  },
  queryData: function (e) {
    var that = this;
    let prams = {
      key: wx.getStorageSync('key')
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Promotion/index', prams,
      (res)=>{
        that.setData({
          list: res.datas,
          products_lsit: res.datas.products_list,
          id: res.datas.products_list,
          type:"beginning",
          banner_image:res.datas.banner_image,
          hide: true
        })
      },
      (err)=> {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })

  },
  godet:function(){

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