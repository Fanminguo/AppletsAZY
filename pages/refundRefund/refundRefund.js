// pages/refundRefund/refundRefund.js
var app = getApp();
var key = wx.getStorageSync('key')
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        navbar: ['退款', '退货'],
        // 默认选中菜单
        // currentTab: 0,
        index: 0,
        list: [],
        page: 1,
        rows: 15,
        state: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var mythis = this;
        mythis.setData({
            key: wx.getStorageSync('key'),
        })
			refundList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
    },
    goNumber: function(e) {
        var mythis = this;
        var refund_id = e.currentTarget.dataset.id
        console.log
        navigateTo('./returnNumber/returnNumber?refund_id=' + refund_id)
    },
    // navbarTap: function(e) {
    //     var mythis = this;
    //     this.setData({
    //         currentTab: e.currentTarget.dataset.idx,
    //         list: [],
    //         listData: [],
    //         page: 1,
    //         hasmore: true,
    //         state: 1
    //     })
    //     if (this.data.currentTab == 0) {
    //         if (mythis.data.hasmore) {
    //             refundList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
    //         }
    //     }
    //     if (this.data.currentTab == 1) {
    //         if (mythis.data.hasmore) {
    //             returnList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
    //         }
    //     }

    // },
    // 跳转详情
    goOrderDeta: function(e) {
        const refund_id = e.currentTarget.dataset.id
        navigateTo('./refundOrder/refundOrder?refund='+refund_id)
        // navigateTo('../refundOrder/refundOrder?refund_id=' + refund_id)
    },
    // 删除订单
    deleteOrders: function(e) {
        const id = e.currentTarget.dataset.id
        var mythis = this
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function(sm) {
                if (sm.confirm) {
                    // 用户点击了确定 可以调用删除方法了
                    deleteOrders(mythis.data.key, id, mythis)
                } else if (sm.cancel) {}
            }
        })
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
        var mythis = this;
        wx.showLoading({
            title: '玩命加载中...',
        });
        mythis.data.page = mythis.data.page + 1;
            if (mythis.data.hasmore) {
                refundList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
            }
       
        wx.hideLoading();
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // }
})
// 删除
function deleteOrders(key, id, mythis) {
    let parms = {
        key: key,
        order_id: id
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_delete',parms,
        (res)=>{
            mythis.onLoad()
        },(err)=>{
            wx.showToast({
              title: err.datas.error,
              icon:'none',
              duration:1000
            })
        })
}
// 退款
function refundList(key, page, rows, mythis) {


    let parms = {
        key: key,
            page: page,
            rows: rows,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustRefund/get_refund_list',parms,
        (res)=>{
            for (var i = 0; i < res.datas.refund_list.length; i++) {
                mythis.data.list.push(res.datas.refund_list[i]);
            }
            mythis.setData({
                listData: mythis.data.list,
                hasmore: res.hasmore,
                state: 1,
                hide:true
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
        },(err)=>{
            wx.showToast({
              title: err.datas.error,
              icon:'none',
              duration:1000
            })
        })
}