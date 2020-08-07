// pages/myNews/newsWaiter/newsWaiter.js
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
        waiTer: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        mythis.setData({
            key: wx.getStorageSync('key'),
            type: options.type
        })
        waiTer(mythis.data.page, mythis.data.rows, mythis.data.key, mythis.data.type, mythis)
    },
    // 代金券
    // gocashCoupon: function () {
    //     navigateTo('../../cardCoupon/cardCoupon')
    // },
    
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
            waiTer(mythis.data.page, mythis.data.rows, mythis.data.key, mythis.data.type, mythis)
        }
        wx.hideLoading();
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // }
})

function waiTer(page, rows, key, type, mythis) {
    let parms = {
        page: page,
        rows: rows,
        key: key,
        type: type
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustMobileMessage/messageMobileList', parms,
        (res) => {
            for (var i = 0; i < res.datas.message_list.length; i++) {
                mythis.data.waiTer.push(res.datas.message_list[i]);
            }
            mythis.setData({
                waiTer: mythis.data.waiTer,
                hasmore: res.hasmore,
                state: 1,
                hide: true
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'node',
                duration: 1500
            })
        })

}