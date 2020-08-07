// pages/edit_mobile1/edit_mobile1.js
var  mobile;
const app = getApp()
var http = require('../../../../utils/httputils.js');
import navigateTo from "../../../../utils/navigateRoute.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // codeSrc:"https://bj.aizhiyi.com/captcha",
    disabled: false,
    code: '获取验证码',
    tel_code:"",//手机验证码
    mobile:""//手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	 this.queryData();
	 this.setData({
		 address:options.address
	 })
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
//   验证码
  goGetCode:function(){
    var that = this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        "cookie": wx.getStorageSync('sessionid'),
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl+'/cli/CustYici/BindWalletStep2',
      method: "POST",
      data: {
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
// 钱包地址
tel_address:function(e){
	this.setData({
		tel_address: e.detail.value
	  })
},
//  验证码
  tel_code:function(e){
    this.setData({
      tel_code: e.detail.value
    })
  },
//   去绑定
editBtn:function(){
this.editBtnHttp()
},
editBtnHttp:function(){
	var that = this;
	let parms = {
		key:wx.getStorageSync('key'),
		auth_code:that.data.tel_code,
		yici_charge_address:that.data.tel_address,
		cust_mobile:that.data.mobile
	}
	http.postRequest( app.globalData.apiUrl+'/cli/CustYici/BindWalletStep3',parms,
	(res)=>{
		wx.navigateBack({
			delta: 1,
		});
	},(err)=>{
		wx.showToast({
		  title: err.datas.error,
		  icon:'none',
		  duration:1500
		})
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
//   onShareAppMessage: function () {

//   }
})