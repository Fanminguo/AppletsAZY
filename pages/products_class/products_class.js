// pages/products_class/products_class.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
var once;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products_class: [],
    hot_list: [],
    all_list:[],
    id:"",
    height:"",
    type:"1",
    hide:false,
    default:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
     var that=this;
     once=true
     this.queryData();
     this.setHei();
     this.news();
     
  }, 
  gocart: function () {
    navigateTo('../cart/cart')
  },
  //跳转首页
  toindex: function () {
    navigateTo('../index/index')
  },
  //跳转关注
  tofollow: function () {
    navigateTo('../follow/follow')
  },
  // 跳转我的
  tomy: function () {
    navigateTo('../myModule/myModule')
  },
  //设置左侧高度
  setHei:function(){
    var hei = wx.getSystemInfoSync().windowHeight-40;
    this.setData({
      height: hei
    })
  },
  //点击切换
  listClick(e) {
    var that=this;
    this.setData({
      id: e.target.dataset.index,
      default:false
    });
    this.queryChildrenData();
  },
  //请求数据
  queryData: function () {
    var that = this;
    let prams = {
      key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/Brand/store_recommend_list', prams,
      (res)=>{
        that.setData({
          products_class: res.products_class,
          // hot_list: res.datas.new_store,
          hot_list: res.datas.store_online,
          all_list: res.datas.store_list,
          id: that.data.products_class,
          type:"1",
          default:true,
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
    // wx.request({
    //   url: app.globalData.apiUrl+'/cli/Brand/store_recommend_list',
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json',
    //     key: wx.getStorageSync('key')
    //   },
    //   data: {
    //   },
    //   success: function (res) {
    //     if (res.statusCode == 200) {
    //       that.setData({
    //         products_class: res.data.products_class,
    //         hot_list: res.data.datas.new_store,
    //         all_list: res.data.datas.store_list,
    //         id: that.data.products_class,
    //         type:"1",
    //         default:true,
    //       })
    //     }
    //   }, complete: function () {
    //     that.setData({
    //       hide: true
    //     })
    //   }
    // });
  },
  queryChildrenData: function () {
    var that = this;
    wx.showLoading({
      title: '请稍后...',
      mask:true
    });
    let prams = {
      key: wx.getStorageSync('key'),
      pc_id:that.data.id,
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Classify/get_child_all', prams,
      (res)=>{
        that.setData({
          hot_list: !res.datas.hot_list ? null : res.datas.hot_list,
          all_list: res.datas.class_list,
          type:"2",
        })
        wx.hideLoading();
      },
      (err)=> {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })
    // wx.request({
    //   url: app.globalData.apiUrl+'/cli/Classify/get_child_all',
    //   method: "get",
    //   header: {
    //     'content-type': 'application/json',
    //     key: wx.getStorageSync('key')
    //   },
    //   data: {
    //     pc_id:that.data.id,
    //   },
    //   success: function (res) {
    //     wx.showLoading({
    //       title: '请稍后...',
    //       mask:true
    //     });
    //     if (res.statusCode == 200) {
    //       that.setData({
    //         hot_list: !res.data.datas.hot_list ? null : res.data.datas.hot_list,
    //         all_list: res.data.datas.class_list,
    //         type:"2",
           
    //       })
          
    //     }
    //   }, complete: function () {
    //     wx.hideLoading();
    //   }
    // });
  },
  news: function () {
    var that = this;
    if(!wx.getStorageSync('key')){
      return false
    }
    let prams = {
      key: wx.getStorageSync('key')
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustMobileMessage/myMessage', prams,
      (res)=>{
        that.setData({
          news: res.datas.message_count
        })
      },
      (err)=> {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })
    // wx.request({
    //   url: app.globalData.apiUrl + '/cli/CustMobileMessage/myMessage',
    //   method: "get",
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
    //      key: wx.getStorageSync('key')
    //   },
    //   data: {
    //     key: wx.getStorageSync('key')
    //   },
    //   success: function (res) {
    //     if (res.statusCode == 200) {
    //       that.setData({
    //         news: res.data.datas.message_count
    //       })

    //     }
    //   }, complete: function () {
    //     wx.hideLoading();
    //   }
    // });
  },
  go:function(e){
    navigateTo('../prodlist/prodlist?pc_id=' + e.currentTarget.dataset.link + "&keyword=" + e.currentTarget.dataset.keyword)
  },
  tonews:function(){
	  navigateTo('../myNews/newHome/newHome')
  },
  gostore:function(e){
    navigateTo('../shopHome/shopHome?store_id=' + e.currentTarget.dataset.store_id)
  },
  focus:function(){
    navigateTo('../search/search')
  },
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  var that = this;
    if(that.data.hot_list && !once){
      this.queryData()
    }
    if(!once){
      this.news();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    once=false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    once=false
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