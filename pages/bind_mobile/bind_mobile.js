// pages/edit_mobile1/edit_mobile1.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');   //相对路径
var is_live = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // codeSrc:"https://bj.aizhiyi.com/captcha",
    disabled: false,
    code: '获取验证码',
    tu_num: "", //图形验证码
    tel_code: "",//手机验证码
    mobile: ""//手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.is_live == 'true'){
      is_live = options.is_live
  }else{
      is_live = false
  }
    this.setData({
      store_id:options.store_id
    })
    this.queryData();
  },
  queryData: function () {
    wx.showLoading({
      title: '请稍后...',
    });
    var that = this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
        // "cookie": wx.getStorageSync('sessionid'),
      },
      url: app.globalData.apiUrl + '/cli/CustAccount/getMobileInfo',
      method: "GET",
      data: {
        key: wx.getStorageSync('key'),
      },
      success: function (res) {
        that.getsrc()
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            mobile: res.data.datas.mobile
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 2000
          })
        }

      },
      fail: function (res) {

      }
    })
  },
  goGetCode: function () {
    app.login()
    var that = this;
    const number = /^1[3456789]\d{9}$/;
    if (!number.test(this.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        "cookie": wx.getStorageSync('sessionid'),
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + '/cli/custAccount/bindMobileNewStep1',
      method: "POST",
      data: {
        captcha: this.data.tu_num,
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
            duration: 2000
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  tomobile2: function () {
    var that = this
    if (that.data.tel_code == "") {
      wx.showToast({
        icon: "none",
        title: "请输入图形验证码",
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '请稍后...',
    });
    let parms = {
      sms_captcha: that.data.tel_code,
      key: wx.getStorageSync('key'),
      mobile: that.data.mobile,
      login_type:3,
      unionid:wx.getStorageSync('unionid'),
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustAccount/bind_phone_new1',parms,
    (res)=>{
      wx.hideLoading()
      if(res.datas.state){  //当前手机号没有绑定账号
        
        app.login()
        wx.setStorageSync('cust_mobile', that.data.mobile);
        if(is_live){
          // wx.redirectTo({
          //     url: '../live/live/live?store_id=' + that.data.store_id+"&is_share=yes&notice_id="+wx.getStorageSync('notice_id')
          // })
          wx.navigateBack({
            delta:1
           })
        }else{
        //   wx.redirectTo({
        //     url: '/pages/index/index'
        // })
        wx.navigateBack({
         delta:1
        })
        }
      }else{    //当前手机号多个绑定账号
      
        if(is_live){
          var cust_ids = res.datas.cust_data.cust_ids
          wx.redirectTo({
            url: '../conflict/conflict?cust_ids=' + cust_ids + '&mobile=' + that.data.mobile+'&store_id=' + that.data.store_id+'&is_share=yes'
          })
        }else{
          var cust_ids = res.datas.cust_data.cust_ids
          wx.redirectTo({
            url: '../conflict/conflict?cust_ids=' + cust_ids + '&mobile=' + that.data.mobile
          })
        }
        
      }
      
    },
    (err)=>{
      wx.showToast({
        icon: "none",
        title: err.datas.error,
        duration: 2000
      })
    })
    
  },
  tu_code: function (e) {
    this.setData({
      tu_num: e.detail.value
    })
  },
  tel_code: function (e) {
    this.setData({
      tel_code: e.detail.value
    })
  },
  get_mobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //图形验证码图片
  getsrc: function () {
    var that = this
    that.goGetCode()
    const wxreq = wx.request({
      header: {
        'content-type': 'image/png; charset=utf-8',
        'accept': 'image/webp,image/*,*/*;q=0.8',
        key: wx.getStorageSync('key')
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
  },

  tomobilebind: function () {
    navigateTo('../edit_mobilebind/edit_mobilebind')
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