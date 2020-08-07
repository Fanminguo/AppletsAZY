// pages/logistics/logistics.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    hide:false,
    is_showNull:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id,
    })
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
  //关注好友请求数据
  queryData: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl+'/cli/CustOrder/deliver',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        order_id: that.data.order_id,
        key: wx.getStorageSync('key'),
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code==200){
            that.setData({
              data: res.data.datas.deliver_list[0],
            })
            console.log(res.data.datas.deliver_list[0])
          }else{
            that.setData({
              is_showNull: false,
            })
          }
          
        }else{
          that.setData({
            is_showNull: false,
          })
        }
      }, complete: function () {
        that.setData({
          hide: true
        })

      }
    });
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