// pages/edit_mobile1/edit_mobile1.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    code: '获取验证码',
    mobile:"",
    tel_code:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       oldmobile: options.oldmobile
     })
  },
  getMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  tel_code: function (e) {
    this.setData({
      tel_code: e.detail.value
    })
  },
  goGetCode: function () {
    var that = this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        "cookie": "PHPSESSID=bdkb2kq8t2pkju9lvj2fgughpn",
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl+'/cli/CustAccount/bindMobileGetCaptcha',
      method: "POST",
      data: {
        key: wx.getStorageSync('key'),
        mobile: this.data.mobile,
      },
      success: function (res) {
        if (res.data.code == 200) {
          
          var time = 60;
          that.setData({
            code: '60秒后重发',
            disabled: true
          })
          var Interval = setInterval(function () {
            time--;
            if (time > 0) {
              that.setData({
                code: time + '秒后重发'
              })
            } else {
              clearInterval(Interval);
              that.setData({
                code: '获取验证码',
                disabled: false
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  edit: function () {
    if (this.data.tel_code == "") {
      wx.showToast({
        icon: "none",
        title: "请输入图形验证码",
        duration: 1000
      })
      return;
    }
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl+'/cli/CustAccount/bindMobileStep2',
      method: "POST",
      data: {
        auth_code: this.data.tel_code,
        key: wx.getStorageSync('key'),
        mobile: this.data.mobile,
        Oldmobile: this.data.oldmobile
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            icon: "none",
            title:"修改成功",
            duration: 1000
          })
          // wx.navigateTo({
          //   url: '../set/set'
          // })
          navigateTo( '../set/set')
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        }
      },
      fail: function (res) {

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