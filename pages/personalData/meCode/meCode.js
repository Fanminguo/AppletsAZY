// pages/personalData/meCode/meCode.js
var app = getApp();
var http = require('../../../utils/httputils.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        var mythis = this;
        code()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // }
})
// 二维码
function code() {
    let parms = {
        key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/custMoment/getMomentsQrcodeUrl',parms,
    (res)=>{

    },(err)=>{
        wx.showToast({
            title: res.datas.error,
            icon: 'none',//当icon：'none'时，没有图标 只有文字
            duration: 2000
        })
    })
  
}