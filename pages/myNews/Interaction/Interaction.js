var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        page: 1,
        rows: 10,
        state: 1,
        action: [],

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
        action(mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
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
    // 查看评论
    goVideoPing:(e)=>{
        console.log(e)
        let comment_content = e.currentTarget.dataset.comment_content
        let comment_custimage = e.currentTarget.dataset.comment_custimage
        let comment_custname = e.currentTarget.dataset.comment_custname
        let products_commonid = e.currentTarget.dataset.products_commonid
        let products_id = e.currentTarget.dataset.products_id
        let Eject  = true
      wx.navigateTo({
        url: '../../video_detail/video_detail?products_id=' + products_id + '&products_commonid='+products_commonid + '&comment_custname='+comment_custname + '&comment_custimage=' +comment_custimage + '&comment_content=' +comment_content + '&Eject=' +Eject,
      })
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
            action(mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
        }

        wx.hideLoading();
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },


})
function action(page, rows, key, mythis) {
    let parms = {
        page: page,
        rows: rows,
        key: key,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustMobileMessage/interactionMessage', parms,
        (res) => {
            for (var i = 0; i < res.datas.tourist_review_list.length; i++) {
                mythis.data.action.push(res.datas.tourist_review_list[i]);

            }
            mythis.setData({
                action: mythis.data.action,
                hasmore: res.datas.hasmore,
                state: 1,
                hide: true
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                });
            }
        },
        (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
            })
        })
}
