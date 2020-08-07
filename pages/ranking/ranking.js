// pages/ranking/ranking.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide:false,
    list:[],
    type:"2",
    date:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      date:   M + '月' + D + '日'
    })
    this.queryData();
  },
  queryData: function (e) {
    var that = this;
    var param;
    if(that.data.type=="1"){//商品排行
      param = app.globalData.apiUrl+"/cli/Search/PopularProductsList";
    } else if (that.data.type == "2"){//店铺排行
      param = app.globalData.apiUrl+"/cli/Search/PopularityStoreList";
    }else{//推荐
      param = app.globalData.apiUrl+"/cli/Search/VideoRecommendationList";
    }

    let parms = {
      key: wx.getStorageSync('key')
    }
    http.getRequest(param,parms,
      (res)=>{
        that.setData({
          list:res.datas,
          hide: true
       })
      },(err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duration:1000
        })
      })
  
  },
  gostore:function(e){
    var id = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '../shopHome/shopHome?store_id=' + id
    // })
	  navigateTo('../shopHome/shopHome?store_id=' + id)
  },
  govideo: function (e) {
    var products_commonid = e.currentTarget.dataset.products_commonid
	  var products_id = e.currentTarget.dataset.products_id
    var index = e.currentTarget.dataset.index
    var list;
    if(this.data.list.popular_products_list){
        list=this.data.list.popular_products_list
    }else{
        list=this.data.list.recommended_video_list
    }
	  navigateTo('../video_detail/video_detail?products_commonid=' + products_commonid + "&products_id=" + products_id+"&index="+index+"&type=ranking&list="+encodeURIComponent(JSON.stringify(list)))
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