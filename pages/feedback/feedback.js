// pages/feedback/feedback.js
const app = getApp()
var http = require('../../utils/httputils.js');   //相对路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteMaxLen: 60,         //详细地址的字数限制
    currentNoteLen: 0,          //输入的字数
    type: "1",
    texareatNum: '',//输入框内容
    tel: "",//获取手机号

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  submit: function () {
    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.texareatNum == "") {
      wx.showToast({
        title: '请输入您的宝贵建议',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!myreg.test(that.data.tel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    wx.showLoading({
      title: '请稍后...',
    });
    let parms = {
      feedback: that.data.texareatNum,
      feedback_stype: that.data.type,
      member_connect: that.data.tel,
      key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustFeedback/feedback_add', parms,
      (res) => {
        wx.navigateTo({
          url: '../set/set'
        })
        wx.hideLoading();
      }, (err) => {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1000
        })
      })
  },
  bindtype: function (e) {
    var that = this;
    var type = e.target.dataset.type;
    this.setData({
      type: type,
    });
  },
  //手机号
  getTel: function (e) {
    this.setData({
      tel: e.detail.value
    });
  },
  //字数限制    
  inputs: function (e) {
    // 获取输入框的内容  
    var value = e.detail.value;
    // 获取输入框内容的长度  
    var len = parseInt(value.length);
    //最多字数限制  
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行  
    this.setData({
      currentWordNumber: len, //当前字数    
      texareatNum: e.detail.value
    });
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


})