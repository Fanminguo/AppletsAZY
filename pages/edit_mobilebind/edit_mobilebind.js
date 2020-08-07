const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeSrc: app.globalData.apiUrl+"/captcha",
    disabled: false,
    code: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  this.getsrc()
  },
  goGetCode: function () {
    var that = this;
	const number = /^1[345678]\d{9}$/;
	if (!number.test(this.data.old_mobile)) {
		wx.showToast({
			title: '请输入正确的原手机号',
			icon: 'none',
			duration: 2000
		})
		return false;
	}
	  if (!number.test(this.data.new_mobile)) {
		  wx.showToast({
			  title: '请输入正确的新手机号',
			  icon: 'none',
			  duration: 2000
		  })
		  return false;
    }
    let parms = {
      captcha: this.data.tu_code,
        key: wx.getStorageSync('key'),
        mobile: this.data.new_mobile,
        Oldmobile: this.data.old_mobile
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustAccount/bindMobileStep1',parms,
    (res)=>{
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
    },(err)=>{
      wx.showToast({
        icon: "none",
        title: err.datas.error,
        duration: 1000
      })
    })
   
  },
  getsrc: function () {
	  var that = this
	  const wxreq = wx.request({
		  header: {
			  // 'Content-Type': 'image/png'
			  'content-type': 'image/png; charset=utf-8',
			  'accept': 'image/webp,image/*,*/*;q=0.8',
			  key: wx.getStorageSync('key')
			  // "cookie": wx.getStorageSync('sessionid'),
		  },
		  url: app.globalData.apiUrl + '/captcha',
		  method: "GET",
		  responseType: 'arraybuffer',
		  success: function (res) {
			  let base64Data
			  base64Data = wx.arrayBufferToBase64(res.data);
			  base64Data = "data:image/png;base64," + base64Data;
			  that.setData({
				  /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
				  codeSrc: base64Data,
			  })
			  var a = res.header["Set-Cookie"];
			  var b = a.split(';');
			  for (var i = 0; i < b.length; i++) {
				  if (b[i].indexOf("PHPSESSID") > -1) {
					  wx.setStorageSync("sessionid", b[i])
				  }
			  }
		  },
		  fail: function (res) {

		  }
	  })
    // var that = this;
    // that.setData({
    //   codeSrc: app.globalData.apiUrl+"/captcha?t=" + Date.parse(new Date())
    // })
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
      url: app.globalData.apiUrl + '/cli/CustAccount/bindMobileStep2',
      method: "POST",
      data: {
        captcha: this.data.tu_code,
        auth_code: this.data.tel_code,
        key: wx.getStorageSync('key'),
        mobile: this.data.new_mobile,
        Oldmobile: this.data.old_mobile
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            icon: "none",
            title: "修改成功",
            duration: 1000
          })
          // wx.navigateTo({
          //   url: '../set/set'
          // })
          navigateTo('../set/set')
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
  tu_code: function (e) {
    this.setData({
      tu_code: e.detail.value
    })
  },
  tel_code: function (e) {
    this.setData({
      tel_code: e.detail.value
    })
  },
  new_mobile: function (e) {
    this.setData({
      new_mobile: e.detail.value
    })
  },
  old_mobile: function (e) {
    this.setData({
      old_mobile: e.detail.value
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