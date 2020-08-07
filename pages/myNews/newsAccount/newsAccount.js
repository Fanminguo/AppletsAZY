// pages/myNews/newsAccount/newsAccount.js
var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../../utils/httputils.js');   //相对路径
import navigateTo from "../../../utils/navigateRoute.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        page: 1,
        rows: 10,
        state: 1,
        account: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        mythis.setData({
            key: wx.getStorageSync('key'),
            type: options.type
        })

        account(mythis.data.page, mythis.data.rows, mythis.data.key, mythis.data.type, mythis)
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
        var mythis = this;
        wx.showLoading({
            title: '玩命加载中...',
        });
        if (mythis.data.hasmore) {
            mythis.data.page = mythis.data.page + 1;
            account(mythis.data.page, mythis.data.rows, mythis.data.key, mythis.data.type, mythis)
        }
        wx.hideLoading();
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    goAccount: function (e) {
        console.log('点击查看详情')
        console.log(e.currentTarget.dataset.id)
    },
    // 易瓷币明细
    goPorcelain:function(){
        navigateTo("../../myAssets/yPorcelain/yPorcelain")
    },
    // 代言费
    goEndorsement:function(){
        navigateTo("../../endorsement/endorsement")
    },
     // 礼品卡
     goCardCoupon:function(){
        navigateTo("../../cardCoupon/cardCoupon?newNum=" + 1)
    }
})

function account(page, rows, key, type, mythis) {
    let parms = {
        page: page,
        rows: rows,
        key: wx.getStorageSync('key'),
        type: type
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustMobileMessage/messageMobileList', parms,
        (res) => {
            for (var i = 0; i < res.datas.message_list.length; i++) {
                mythis.data.account.push(res.datas.message_list[i]);
            }
            mythis.setData({
                account: mythis.data.account,
                hasmore: res.hasmore,
                state: 1,
                hide: true
            })
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
            })
        })

}