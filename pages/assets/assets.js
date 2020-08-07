// pages/assets/assets.js
const app = getApp()
const windowHeight = wx.getSystemInfoSync().windowHeight
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX,
      topHeight: app.globalData.headerBtnPosi
    })
  },
  tomy: function () {
    wx.redirectTo({
      url: '../myModule/myModule'
    })
  },
  gocart: function () {
    wx.navigateTo({
      url: '../cart/cart'
    })
  },
  goindex: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  //跳转分类
  goproduct_class: function () {
    wx.navigateTo({
      url: '../products_class/products_class'
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var url = 'pages/assets/assets'
    } else {
      var url = 'pages/assets/assets'
    }
    return {
      title: '我发现了一家专卖“中国精品好物”的平台，既可购物，也可赚钱，赶快来看看',
      path: url,
      imageUrl: 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/75.png',
    }
  }
})