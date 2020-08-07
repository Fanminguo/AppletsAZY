// pages/notice/notice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    num:"1"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData()
  },
  //请求数据
  queryData: function () {
    var that = this;
    if (!wx.getStorageSync('key')) {
      app.login2(that.queryData1)
    } else{
      wx.request({
        url: app.globalData.apiUrl+'/cli/PromotionGuide/Index',
        method: "POST",
        header: {
          'content-type': 'application/json',
        },
        data: {

        },
        success: function (res) {
          if (res.statusCode == 200) {
            that.setData({
              data: res.data.datas
            })
          }
        }, complete: function () {

        }
      });
    }
    
  },
  tab:function(e){
    var that=this
    that.setData({
      num: e.currentTarget.dataset.num
    })
  },
  tolimit:function(){
    wx.navigateTo({
      url: '../limit/limit'
    })
  },
  togroup: function () {
    wx.navigateTo({
      url: '../groupOrder/groupOrder'
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