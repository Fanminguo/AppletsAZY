// pages/a/a.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products_detail: [],
    products_list: [],
    page:"1",
    hasmore:true,
    rows:"10",
    pc_id:"",
    products_id:"",
    hide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      pc_id: options.pc_id,
      products_id: options.products_id,
    });
    
    this.queryData();
  },
  //请求数据
  queryData: function () {
    var that = this;
    let prams = {
      page:that.data.page,
      rows: that.data.rows,
      // pc_id: that.data.pc_id,
      products_id: that.data.products_id,
    }
    http.getRequest(app.globalData.apiUrl + '/cli/products/similar_products', prams,
      function (res) {
          that.setData({
            products_detail: res.datas.products_detail,
            hasmore: res.datas.hasmore,
            products_list: that.data.products_list.concat(res.datas.products_list),
            hide: true
          })
          wx.hideLoading()
      },
      function (err) {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })
  },
  govideo:function(e){
    var products_commonid = e.currentTarget.dataset.products_commonid;
	  var products_id = e.currentTarget.dataset.products_id;
	  var index = e.currentTarget.dataset.index;
    if (e.currentTarget.dataset.products_video){
		navigateTo('../video_detail/video_detail?products_commonid=' + products_commonid + '&products_id=' + products_id+"&index="+index+"&type=similar&list="+encodeURIComponent(JSON.stringify(this.data.products_list)))
    }else{
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
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.hasmore){
      that.setData({
        page: Number(that.data.page) + 1,
      })
      this.queryData()
    }else{

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})