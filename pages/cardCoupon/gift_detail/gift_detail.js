// pages/cardCoupon/gift_detail/gift_detail.js
var app = getApp();
var key = wx.getStorageSync('key')
import navigateTo from "../../../utils/navigateRoute.js"
var http = require('../../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
    },
    // 跳转详情
    goOrder: function (e) {
        var order_id = e.currentTarget.dataset.id
        navigateTo('/pages/orderDetails/orderDetails?order_id=' + order_id)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login();
        }
        mythis.setData({
            key: wx.getStorageSync('key')
        })
        orderDetail(mythis.data.key, options.recode_id, options.pay_sn, options.all_recharge_amount, mythis)
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
    // onShareAppMessage: function() {

    // }
})
//详情
function orderDetail(key, recode_id, pay_sn, all_recharge_amount, mythis) {
    let parms = {
        key: key,
        recode_id: recode_id,
        pay_sn: pay_sn,
        all_recharge_amount: all_recharge_amount
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustRecharge/recharge_use_record_detail', parms,
        (res) => {
            mythis.setData({
                information: res.datas.recharge_change_record_info,
                hide: true
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })


}