// pages/groupOrder/groupList/groupList.js
var app = getApp();
import navigateTo from "../../../utils/navigateRoute.js"
var http = require('../../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        rows: 10,
        state: 1,
        clusterList: [],
        hide: false,
        userInfo: {
            avatarUrl: "", //用户头像
            nickName: "", //用户昵称
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        mythis.setData({
            key: wx.getStorageSync('key')
        })
        commoList(mythis.data.page, mythis.data.rows, mythis)
    },

    // 跳转详情
    goDetails: function (e) {
        var products_id = e.currentTarget.dataset.id
        var products_commonid2 = e.currentTarget.dataset.products_commonid2
        var index = e.currentTarget.dataset.key
        if (wx.getStorageSync('key')) {
            navigateTo('/pages/video_detail/video_detail?products_id=' + products_id + "&products_commonid=" + products_commonid2 + '&list=' + encodeURIComponent(JSON.stringify(this.data.commoData)) + "&index=" + index)
        } else {
            navigateTo('../../getUserInfo/getUserInfo')
        }

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
        mythis.data.page = mythis.data.page + 1;
        if (mythis.data.hasmore) {
            commoList(mythis.data.page, mythis.data.rows, mythis)
        } else {
            wx.hideLoading();
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // }
})

// 拼团商城列表
function commoList(page, rows, mythis) {
    let parms = {
        page: page,
        rows: rows
    }
    http.getRequest(app.globalData.apiUrl + '/cli/GroupBuy/group_buy_hug', parms,
        function (res) {
            for (var i = 0; i < res.datas.group_list.length; i++) {
                mythis.data.clusterList.push(res.datas.group_list[i]);
            }
            mythis.setData({
                commoData: mythis.data.clusterList,
                hasmore: res.datas.hasmore,
                banner: res.datas.banner_image.banner_image,
                state: 1,
                hide: true
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
        }, function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
            })
        })
}

