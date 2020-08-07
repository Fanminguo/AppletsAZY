// pages/groupOrder/groupOrder.js
var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
		hide:false,
        is_groupbuy: '1',
        page: 1,
        rows: 10,
        //用于标识是否还有更多的状态
        state: 1,
        //订单列表
        clusterList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        mythis.setData({
            key: wx.getStorageSync('key')
        })
		if (options.id){
			mythis.setData({
				id:options.id
			})
		}
        setTimeout(function() {
            wx.hideLoading()
        }, 2000)
        ouderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.is_groupbuy, mythis)
    },
	goGroupList:function(e){
		var mythis = this;
		wx.navigateTo({
			url: '/pages/groupOrder/groupList/groupList'
		})
	},
    // 订单详情
    goOrder: function(e) {
        var mythis = this;
        var order_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/orderDetails/orderDetails?order_id=' + order_id,
        })
    },
    goGroup: function(e) {
        var products_id = e.currentTarget.dataset.id
        var groupbuy_hug = e.currentTarget.dataset.num
        var order_sn = e.currentTarget.dataset.index
        var order_id = e.currentTarget.dataset.name
        wx.navigateTo({
            url: "/pages/detaCollage/detaCollage?products_id=" + products_id + "&groupbuy_hug=" + groupbuy_hug + "&order_sn=" + order_sn + "&order_id=" + order_id
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
    // 跳转详情
    goDetails: function(e) {
        var products_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/commodity/commodity?products_id=' + products_id,
        })
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
                ouderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.is_groupbuy, mythis)
            }else{
				wx.hideLoading();
			}
        
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    switchClick: function(e) {
        var mythis = this;
        mythis.setData({
            id: e.currentTarget.dataset.id
        })
        mythis.setData({
            clusterList: [],
            listData: [],
            page: 1,
            hasmore: true
        })
       
            ouderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.is_groupbuy, mythis)
    }
})

function ouderList(key, page, rows, is_groupbuy, mythis) {
    let parms = {
        key:key,
        page:page,
        rows:rows,
        is_groupbuy:is_groupbuy
    }
    http.getRequest(app.globalData.apiUrl+'/cli/CustOrder/order_list',parms,
    function(res){
        for (var i = 0; i < res.datas.order_group_list.length; i++) {
            mythis.data.clusterList.push(res.datas.order_group_list[i]);
        }
        mythis.setData({
            listData: mythis.data.clusterList,
            hasmore: res.hasmore,
            state: 1,
            hide: true
        });
        if (!mythis.data.hasmore) {
            mythis.setData({
                state: 0
            });
        }
    },
    function(err){
        wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1500
          })
    })
   
}
