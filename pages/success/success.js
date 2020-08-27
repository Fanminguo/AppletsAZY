// pages/success/success.js
var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js');
import navigateTo from "../../utils/navigateRoute.js"
Page({
    /**
     * 页面的初始数据
     */
    data: {
        allProject: [],
        show: false,
        hide: false,
    },
    // 跳转视频
    goData: function (e) {
        var products_commonid = e.currentTarget.dataset.id
        var products_id = e.currentTarget.dataset.index
        var index = e.currentTarget.dataset.key
        navigateTo('/pages/video_detail/video_detail?products_commonid=' + products_commonid + "&products_id=" + products_id + "&index=" + index + "&type=shopHome&list=" + encodeURIComponent(JSON.stringify(this.data.allProject)))
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        console.log(options)
        mythis.setData({
            key: wx.getStorageSync('key'),
            storeId: options.store_id,
            products_id: options.products_id,
            pay_sn: options.pay_sn,
            pay_amount: options.pay_amount,
            order:options.order,
            order_id:options.order_id
        })
        if(mythis.data.order !=1){
            successOrder(mythis.data.key, mythis.data.pay_sn, mythis)
            wx.setNavigationBarTitle({
                title: '支付成功' 
              })
        }else{
            commList(mythis.data.key, mythis.data.storeId, mythis)
            wx.setNavigationBarTitle({
                title: '确认收货成功' 
            })
        }
    },
     // 去评论
     goComment: function(e) {
        var rec_id = e.currentTarget.dataset.id
        var paySn = e.currentTarget.dataset.pay_sn
        var order_id = e.currentTarget.dataset.order_id
        navigateTo("/pages/evaluation/evaluation?pay_sn=" + paySn + "&key=" + this.data.key + "&order_id=" + order_id)
    },
    seeList: function () {
        wx.redirectTo({
            url: '../order/order?index=' + 2,
        })
    },
    goodThings: function () {
        wx.redirectTo({
            url: '../index/index'

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
    onShareAppMessage: function () {

    },
    // 跳转详情页
    // goData: function (e) {
    //     var products_id = e.currentTarget.dataset.id
    //     wx.redirectTo({
    //         url: '/pages/commodity/commodity?products_id=' + products_id
    //     })
    // },
    gotIt: function () {
        
            navigateTo( '/pages/myAssets/yPorcelain/yPorcelain')
            this.setData({
                show: false
            })
        // navigateTo('')
    },
    exhibition: function () {
        this.setData({
            show: false
        })
    }
})

function successOrder(key, pay_sn, mythis) {
    let parms = {
        key: wx.getStorageSync('key'),
        pay_sn: pay_sn
    }
    http.postRequest(app.globalData.apiUrl + '/cli/Index/shouldYici', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            if (res.datas.yici_amount > 0) {
                mythis.setData({
                    show: true,
                    yici_amount: (res.datas.yici_amount).toFixed(4)
                })
            }
            mythis.setData({
                listData: mythis.data.allProject,
                hide: true
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 2000
            })
        })

}
function commList(key, store_id, mythis) {
    let parms = {
        key: wx.getStorageSync('key'),
        store_id:store_id
    }
    http.postRequest(app.globalData.apiUrl + '/cli/Index/recommendProducts', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            mythis.setData({
                listData: mythis.data.allProject,
                hide: true
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 2000
            })
        })

}
