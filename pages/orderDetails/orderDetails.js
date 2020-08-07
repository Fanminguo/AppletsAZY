// pages/orderDetails/orderDetails.js
const app = getApp();
const key = wx.getStorageSync('key')
const util = require('../../utils/util.js')
import navigateTo from "../../utils/navigateRoute.js"
var  http = require('../../utils/httputils.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products_list: [],
        recId: [],
    },
    // 加入购物车
    addCart: util.throttle(function(e) {
        var mythis = this;
        var productsId = e.currentTarget.dataset.id
        addCust(mythis.data.key, productsId, mythis)
    }, 1000),
    // 跳转详情
    jumpDeta: function(e) {
        var id = e.currentTarget.dataset.id
        wx.redirectTo({
            url: '/pages/commodity/commodity?products_id=' + id,
        })
    },
	// 跳转退单号
	cancellation:function(e){
		wx.redirectTo({
			url: "",
		})
	},
    // 跳转店铺详情
    goShopHome: function(e) {
        var storeId = e.currentTarget.dataset.id
        wx.redirectTo({
            url: '/pages/shopHome/shopHome?store_id=' + storeId,
        })
    },
    // 申请退款
    allRefund: function(e) {
        var allId = e.currentTarget.dataset.id
        navigateTo( '/pages/refundAll/refundAll?order_id=' + allId + "&currentTab=" + 0,)
    },
	// 查看物流
	goLogistics: function (e) {
		var order_id = e.currentTarget.dataset.id
		navigateTo('/pages/logistics/logistics?order_id=' + order_id)
	},
    // 申请退货
    allReturn: function(e) {
        var allId = e.currentTarget.dataset.id
        navigateTo('/pages/refundAll/refundAll?order_id=' + allId + '&rec_id=' + this.data.recId + '&type=all_return&currentTab=' + 1,)
    },
    // 取消退款1
    cancelRefundOne: function(e) {
        var mythis = this
        var refundId = e.currentTarget.dataset.num
        var orderId = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '您将撤销本次申请，如果问题未解决，您还可以再次发起',
            success: function(sm) {
                if (sm.confirm) {
                    // 用户点击了确定 可以调用删除方法了
                    oneCancel(mythis.data.key, refundId, orderId)
                    // orderForm(mythis.data.key, orderId, mythis)
                    wx.redirectTo({
                        url: '/pages/order/order?index=' + 0,
                    })
                    mythis.onReady()
                } else if (sm.cancel) {
                }
            }
        })
    },
    // 取消退款 2
    cancelRefundTwo: function(e) {
        var mythis = this
        var refundId = e.currentTarget.dataset.num
        var orderId = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '您将撤销本次申请，如还有问题 请在保障期内发起申请售后。',
            success: function(sm) {
                if (sm.confirm) {
                    // 用户点击了确定 可以调用删除方法了
                    oneCancel(mythis.data.key, refundId, orderId)
                    mythis.onReady()
                } else if (sm.cancel) {
                }
            }
        })
    },
    // 确认收货
    confirMation: function(e) {
        const id = e.currentTarget.dataset.id
        const pay_sn = e.currentTarget.dataset.pay_sn
        var mythis = this
        mythis.setData({
            store_id:e.currentTarget.dataset.store_id
        })
        wx.showModal({
            title: '提示',
            content: '确定要签收商品吗？',
            success: function(sm) {
                if (sm.confirm) {
                    confirOrder(mythis.data.key, id, pay_sn, mythis)
                    // mythis.onReady()
                } else if (sm.cancel) {
                }
            }
        })
    },
    // 再次购买
    addCartList: function() {},
    // 提醒发货
    deliver: function(e) {
        const id = e.currentTarget.dataset.id
        var mythis = this
        deliverOrders(mythis.data.key, id, mythis)
        mythis.onReady()
    },
    // 去评论
    goComment: function(e) {
        var rec_id = e.currentTarget.dataset.id
        var paySn = e.currentTarget.dataset.num
        var order_id = e.currentTarget.dataset.index
        navigateTo("/pages/evaluation/evaluation?pay_sn=" + paySn + "&key=" + this.data.key + "&order_id=" + order_id)
    },
    goCommentTow: (e)=>{
        var paySn = e.currentTarget.dataset.num
        var order_id = e.currentTarget.dataset.index
        navigateTo("/pages/evaluationTow/evaluationTow?pay_sn=" + paySn +  "&order_id=" + order_id)
    },
    // 跳转好友
    goFriend: function() {
        navigateTo('/pages/follow/follow?type=1')
    },
    // 宝贝
    goBaby: function() {
        navigateTo('/pages/follow/follow?type=2')
    },
    // 店铺
    goShop: function() {
        navigateTo('/pages/follow/follow?type=3')
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
            key: wx.getStorageSync('key'),
            orderId: options.order_id,
        })
        // listData(mythis.data.key, mythis.data.storeId, mythis.data.productsId, mythis)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        var mythis = this;
        orderForm(mythis.data.key, mythis.data.orderId, mythis)
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

    // },


})
// 取消退款

function oneCancel(key, refundId, orderId) {
    let parms = {
        key: key,
            refund_id: refundId,
            order_id: orderId
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_refund_cancel',parms,
    (res)=>{

    },
    (err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duration:1000
        })
    })
  
}

// 详情
function orderForm(key, orderId, mythis) {
    let parms = {
        key: key,
        order_id: orderId
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustOrder/order_info',parms,
    (res)=>{
        var newData = res.datas.order_info
        var listData = newData.products_list
        var storeId = res.datas.order_info.store_id
        var productsId = res.datas.order_info.products_list[0].products_id
        mythis.setData({
            listData: res.datas.order_info.products_list,
            newData: res.datas.order_info,
            yici_send_num:(res.datas.order_info.yici_send_num).toFixed(4),
            storeId: res.datas.order_info.store_id,
            productsId: res.datas.order_info.products_list[0].products_id,
            hide: true
        })
        // 申请退货
        for (var i = 0; i < res.datas.order_info.products_list.length; i++) {
            mythis.data.recId.push(res.datas.order_info.products_list[i].rec_id)
        }
    },(err)=>{
        wx.showToast({
            title: res.datas.error,
            icon: 'none',
            duration: 2000,
            mask: true,
            success: function() {
                setTimeout(function() {
                    //要延时执行的代码
                    wx.navigateBack({
                        delta: 1,
                    });//
                
                }, 2000) //延迟时间
            },
        })
    })
  
}

// 加入购物车
function addCust(key, productsId, quantity, mythis) {
    let parms = {
        key: key,
        products_id: productsId,
        quantity: 1
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustCart/cart_add',parms,
    (res)=>{
        wx.showToast({
            title: "添加成功",
            icon: 'success',
            duration: 800,
            mask: true
        });
    },(err)=>{
        wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1000
        });
    })
  
}
// 提醒发货
function deliverOrders(key, id, mythis) {
    let parms = {
        key: key,
        order_id: id
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustOrder/delivery_remind',parms,
    (res)=>{},(err)=>{})
  
}
// 确认收货
function confirOrder(key, id, pay_sn, mythis) {
    let parms = {
        key: key,
        order_id: id,
        pay_sn: pay_sn
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_receive',parms,
    (res)=>{
        if (res.datas == 1) {
            // navigateTo('/pages/order/order?index=' + 4)
            wx.redirectTo({
                url: '../success/success?order_id=' + id + "&pay_sn=" + pay_sn + "&order=1"  + '&store_id=' + mythis.data.store_id,
              })
        }
    },(err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duartion:1000
        })
    })
  
}