// pages/myAssets/myCircleInfo/myCircleInfo.js
const app = getApp()
var http = require('../../../utils/httputils.js');
import navigateTo from "../../../utils/navigateRoute.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      
      that.setData({
        codeM:options.code
      })
  },
  queryData:function(code){
    var that=this;
    let parms = {
      key: wx.getStorageSync('key'),
      codeM:code,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/custMoment/momentsDetail', parms,
      (res)=>{
          that.setData({
            data: res.datas,
            hide:true
          })
          // wx.setNavigationBarTitle({
          //   title: that.data.data.momentsName//页面标题为路由参数
          // })
      },(err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duration:1000
        })
      })
  },
  gomore:function(){
    navigateTo('../myCircleAll/myCircleAll?codeM='+this.data.codeM)
  },
  goInfo:function(){
    navigateTo('../myCircleShare/myCircleShare?codeM='+this.data.codeM)
  },
  editName:function(){
    navigateTo('../myCircleName/myCircleName?codeM='+this.data.codeM)
  },
  exit:function(){
    var that=this
    wx.showModal({
      title: '',
      content: '是否确定退出圈子呢？',
      success (res) {
        if (res.confirm) {
          let prams = {
            key: wx.getStorageSync('key'),
            codeM:that.data.codeM,
          }
          http.postRequest(app.globalData.apiUrl + '/cli/CustMoment/exitMoments', prams,
            (res)=>{
              var pages = getCurrentPages(); // 当前页面
              var beforePage = pages[pages.length - 2]; // 前一个页面
              beforePage.setData({
                momentsList: [],
                page:1
              }),
              beforePage.queryData()
              wx.navigateBack({
                delta: 1,
              });
            },
            (err)=> {
              wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
              })
            })
        }
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
    var that=this
    that.queryData(that.data.codeM)
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