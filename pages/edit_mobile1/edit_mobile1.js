// pages/edit_mobile1/edit_mobile1.js
var  mobile;
const app = getApp()
var http = require('../../utils/httputils.js');
import navigateTo from "../../utils/navigateRoute.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // codeSrc:"https://bj.aizhiyi.com/captcha",
    disabled: false,
    code: '获取验证码',
    tu_num: "", //图形验证码
    tel_code:"",//手机验证码
    mobile:""//手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.queryData();
  },
  queryData:function(){
    wx.showLoading({
      title: '请稍后...',
    });
    var that=this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
        // "cookie": wx.getStorageSync('sessionid'),
      },
      url: app.globalData.apiUrl+'/cli/CustAccount/getMobileInfo',
      method: "GET",
      data: {
         key: wx.getStorageSync('key'),
      },
      success: function (res) {
        //
        
        that.getsrc()
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
           mobile: res.data.datas.mobile
         })
          mobile = res.data.datas.mobile
        }else{
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
  goGetCode:function(){
    var that = this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        "cookie": wx.getStorageSync('sessionid'),
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl+'/cli/CustAccount/bindMobileStep1',
      method: "POST",
      data: {
        captcha: this.data.tu_num,
        key: wx.getStorageSync('key'),
        mobile:this.data.mobile,
      },
      success: function (res) {
        if (res.data.code == 200){
         
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
        }else{
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
  tomobile2: function () {
    var that = this;
    if(this.data.tel_code==""){
      wx.showToast({
        icon: "none",
        title: "请输入图形验证码",
        duration: 1000
      })
      return;
    }
   let parms = {
    auth_code: this.data.tel_code,
    key: wx.getStorageSync('key'),
    mobile: this.data.mobile,
   }
   http.postRequest(app.globalData.apiUrl+'/cli/CustAccount/bindMobileStep2',parms,
   (res)=>{
    navigateTo('../edit_mobile2/edit_mobile2?oldmobile=' + mobile)
   },(err)=>{
    wx.showToast({
      icon: "none",
      title: err.datas.error,
      duration: 1000
    })
   })
   
  },
  tu_code:function(e){
    this.setData({
      tu_num: e.detail.value
    })
  },
  tel_code:function(e){
    this.setData({
      tel_code: e.detail.value
    })
  },
  //图形验证码图片
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
      url: app.globalData.apiUrl+'/captcha',
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
    // var that=this;
    // that.setData({
    // codeSrc: "https://bj.aizhiyi.com/captcha?t=" + Date.parse(new Date())
    // })
  },
  // getsrc:function(){
  //   var that=this
  //   const wxreq = wx.request({
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
  //     },
  //     url: 'https://bj.aizhiyi.com/captcha',
  //     method: "GET",
  //     data: {
  //       auth_code: this.data.tel_code,
  //       key: key,
  //       mobile: this.data.mobile,
  //     },
  //     success: function (res) {
  //       that.setData({
  //         codeSrc: "",
  //       })
  //       console.log(res)
  //     },
  //     fail: function (res) {

  //     }
  //   })
  //   // var that=this;
  //   // that.setData({
  //   //   codeSrc: "https://bj.aizhiyi.com/captcha?t=" + Date.parse(new Date())
  //   // })
  // },
  // tomobile2: function () {
  //   // wx.navigateTo({
  //   //   url: '../edit_mobile2/edit_mobile2'
  //   // })
  // },
  tomobilebind:function(){
    
    // wx.navigateTo({
    //   url: '../edit_mobilebind/edit_mobilebind'
    // })
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
  onShareAppMessage: function () {

  }
})