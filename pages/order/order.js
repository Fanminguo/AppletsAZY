// pages/order/order.js
//JS
var app = getApp();
var key = wx.getStorageSync('key')
var util = require('../../utils/sign.js');
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
Page({
    data: {
        hide: false,
        page: 1,
        rows: 10,
        state_type: 'state_all',
        // 顶部菜单切换
        navbar: ['全部', '待付款', "待发货", "待收货", "待评论"],
        // 默认选中菜单
        currentTab: 0,
        index: 0,
        pick_name: "",
        state: 1,
        // list数据
        list: [],
    },
   
    // 显示
    quxao: function (e) {
        var mythis = this;
        mythis.setData({
            show: true,
            pay_sn: e.currentTarget.dataset.id
        })
        wx.showModal({
			title: '',
			content: '删除订单后不可恢复，是否确定删除订单',
			success: function(res) {
				if (res.confirm) {
                    cancellation(mythis.data.key, mythis.data.pay_sn, mythis)
				} else if (res.cancel) {
				}
			}
		})
    },
       
    goComment: function(e) {
        var rec_id = e.currentTarget.dataset.id
        var paySn = e.currentTarget.dataset.num
        var order_id = e.currentTarget.dataset.id
        navigateTo("/pages/evaluation/evaluation?pay_sn=" + paySn + "&key=" + this.data.key + "&order_id=" + order_id)
    },
    // 再想想
    thinkAgain: function () {
        var mythis = this;
        mythis.setData({
            show: false,
            pay_sn: ""
        })
    },

    // 支付
    pay: function (e) {
        var that = this;
        that.setData({
            pay_sn: e.currentTarget.dataset.id,
            products_id: e.currentTarget.dataset.index,
            store_id: e.currentTarget.dataset.num,
        })
        let parms = {
            key: that.data.key,
                pay_sn: that.data.pay_sn,
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustBuy/pay',parms,
        (res)=>{
            that.setData({
                pay_sn: res.datas.pay_info.pay_sn,
                pay_amount: res.datas.pay_info.pay_amount
            })
            that.payNow(that.data.pay_sn, that.data.products_id, that.data.store_id, that.data.pay_amount);
            wx.hideLoading()
        },(err)=>{
            wx.showToast({
                icon: "none",
                title: res.datas.error,
                duration: 1000
            })
        })
      
    },
    // 客服
    kefu: function () {
        navigateTo('../load_app/load_app?link=' + encodeURIComponent("https://www.echatsoft.com/visitor/mobile/chat.html?companyId=566"))
      },
    payNow: function (pay_sn, products_id, store_id, pay_amount) {
        var that = this
        wx.request({
            url: app.globalData.apiUrl + '/cli/custPayment/wxMiNiRequest',
            method: "POST",
            header: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
            },
            data: {
                key: that.data.key,
                openid: app.getopenid(),
                time: util.getTimestamp(),
                pay_sn: pay_sn,
                payment_code: "wx_mini",
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.code == 200) {
                        that.wxpay(res.data.datas, that.data.pay_sn, that.data.store_id, that.data.products_id, that.data.pay_amount);
                    } else {
                        wx.showToast({
                            title: "支付失败",
                            icon: 'none',
                        })
                    }
                } else {
                    wx.showToast({
                        title: "支付失败",
                        icon: 'none',
                    })
                    return false;
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },
    wxpay: function (data, pay_sn, store_id, products_id, pay_amount) {
        wx.requestPayment({
            'timeStamp': data.timeStamp + "",
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
                wx.redirectTo({
                    url: '/pages/success/success?pay_sn=' + pay_sn + "&store_id=" + store_id + "&products_id=" + products_id + "&pay_amount=" + pay_amount
                })
            },
            'fail': function (res) {
                // wx.redirectTo({
                //     url: '../order/order?index=' + 1,
                // })
            },
            'complete': function (res) { }
        })

    },

    // 查看物流
    goLogistics: function (e) {
        var order_id = e.currentTarget.dataset.id
        navigateTo('/pages/logistics/logistics?order_id=' + order_id)
    },
    // 已提醒
    reminded: function () {
        wx.showToast({
            title: '客服妹子已经在为您安排发货喽～',
            icon: 'none',//当icon：'none'时，没有图标 只有文字
            duration: 2000
        })
    },
    // 初始化加载
    onLoad: function (options) {
        var mythis = this;
        if (options != undefined) {
            mythis.setData({
                index: options.index
            })
        } else {
            mythis.setData({
                index: mythis.data.index
            })
        }

        var numBer = parseInt(mythis.data.index)
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        mythis.setData({
            key: wx.getStorageSync('key'),
            currentTab: numBer,
            list: [],
            listData: [],
            page: 1,
        })

        if (mythis.data.currentTab == 0) {
            mythis.setData({
                state_type: 'state_all'
            })
            orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
        }
        if (mythis.data.currentTab == 1) {
            mythis.setData({
                state_type: 'state_new'
            })
            orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
        }
        if (mythis.data.currentTab == 2) {
            mythis.setData({
                state_type: 'state_notakes'
            })
            orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
        }
        if (mythis.data.currentTab == 3) {
            mythis.setData({
                state_type: 'state_send'
            })
            orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
        }
        if (mythis.data.currentTab == 4) {
            mythis.setData({
                state_type: 'state_noeval'
            })
            orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
        }
        mythis.navbarTap
    },


    //顶部tab切换
    navbarTap: function (e) {
        var mythis = this;
        this.setData({
            currentTab: e.currentTarget.dataset.idx,
            list: [],
            listData: [],
            page: 1,
            hasmore: true
        })
        if (this.data.currentTab == 0) {
            this.setData({
                state_type: 'state_all'
            })
            if (mythis.data.hasmore) {
                orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
            }
        }
        if (this.data.currentTab == 1) {
            this.setData({
                state_type: 'state_new'
            })
            if (mythis.data.hasmore) {
                orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
            }
        }
        if (this.data.currentTab == 2) {
            this.setData({
                state_type: 'state_notakes'
            })
            if (mythis.data.hasmore) {
                orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
            }
        }
        if (this.data.currentTab == 3) {
            this.setData({
                state_type: 'state_send'
            })
            if (mythis.data.hasmore) {
                orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
            }
        }
        if (this.data.currentTab == 4) {
            this.setData({
                state_type: 'state_noeval'
            })
            if (mythis.data.hasmore) {
                orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
            }
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var mythis = this;
        // 获取上个页面传来的参数
        // const keyword = this.options.keyword

    },
    // 跳转详情
    goOrderDeta: function (e) {
        const id = e.currentTarget.dataset.id
        navigateTo('/pages/orderDetails/orderDetails?order_id=' + id)
    },
    // 跳转店铺详情
    goShopHome: function (e) {
        var storeId = e.currentTarget.dataset.id
        navigateTo('/pages/shopHome/shopHome?store_id=' + storeId)
    },
    // 确认收货
    confirMation: function (e) {
        const id = e.currentTarget.dataset.id
        const pay_sn = e.currentTarget.dataset.num
        var mythis = this
        mythis.setData({
            store_id:e.currentTarget.dataset.store_id
        })
        wx.showModal({
            title: '提示',
            content: '确定要签收商品吗？',
            success: function (sm) {
                if (sm.confirm) {
                    // 用户点击了确定 可以调用删除方法了
                    confirOrder(mythis.data.key, id, pay_sn, mythis)
                    // mythis.setData({
                    //     list: [],
                    //     listData: [],
                    //     page: 1,
                    //     state_type: 'state_noeval'
                    // })
                    // orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)

                } else if (sm.cancel) {
                }
            }
        })

    },
    // 提现发货
    deliver: function (e) {
        const id = e.currentTarget.dataset.id
        var mythis = this
        deliverOrders(mythis.data.key, id, mythis)
        for (var i in mythis.data.listData) {
            for (var k in mythis.data.listData[i].order_list)
                if (id == mythis.data.listData[i].order_list[k].order_id) {
                    mythis.data.listData[i].order_list[k].if_delivery_remind = true
                }
        }
        mythis.setData({
            listData: mythis.data.listData
        })

    },
    // 删除订单
    deleteOrders: function (e) {
        const id = e.currentTarget.dataset.id
        var mythis = this
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function (sm) {
                if (sm.confirm) {
                    // 用户点击了确定 可以调用删除方法了
                    deleteOrders(mythis.data.key, id, mythis)
                    mythis.setData({
                        list: [],
                        listData: [],
                        page: 1
                    })

                } else if (sm.cancel) {
                }
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var mythis = this;

        if (mythis.data.hasmore) {
            wx.showLoading({
                title: '玩命加载中...',
                duration: 1000
            });
            mythis.data.page = mythis.data.page + 1;
            orderList(mythis.data.key, mythis.data.page, mythis.data.rows, mythis.data.state_type, mythis)
        } else {
            wx.hideLoading();
        }

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
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
   

})
// 确认收货
function confirOrder(key, id, pay_sn, mythis) {
    let parms = {
        key: key,
            order_id: id,
            pay_sn: pay_sn
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_receive',parms,
    (res)=>{
        if (res.code == 200) {
            // navigateTo('/pages/order/order?index=' + 4)
            wx.redirectTo({
              url: '../success/success?order_id=' + id + "&pay_sn=" + pay_sn + "&order=1" + '&store_id=' + mythis.data.store_id,
              
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
// 提醒发货
function deliverOrders(key, id, mythis) {
    let parms = {
        key: key,
        order_id: id
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustOrder/delivery_remind',parms,
    (res)=>{
        if (res.datas.result) {
            wx.showToast({
                title: '提醒成功',
                icon: 'success',
                duration: 2000
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
// 删除订单
function deleteOrders(key, id, mythis) {
    let parms = {
        key: key,
        order_id: id
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_delete',parms,
    (res)=>{
        if (res.datas == 1) {
            //pages 获取到当前页码数   然后执行当前页的onLoad
            const pages = getCurrentPages()
            const perpage = pages[pages.length - 1]
            perpage.onLoad()
        }
    },(err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duration:1000
        })
    })
}
//列表
function orderList(key, page, rows, state_type, mythis) {
    let parms = {
        key: key,
        page: page,
        rows: rows,
        state_type: state_type
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_list', parms,
        (res) => {
            for (var i = 0; i < res.datas.order_group_list.length; i++) {
                mythis.data.list.push(res.datas.order_group_list[i]);
            }
            mythis.setData({
                listData: mythis.data.list,
                hasmore: res.hasmore,
                state: 1,
                hide: true
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
            var payment = res.datas.order_state
            mythis.setData({
                payment: res.datas.order_state
            })
            wx.hideLoading();
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}
// 取消订单
function cancellation(key, pay_sn, mythis) {
    let parms = {
        key: wx.getStorageSync('key'),
        pay_sn: pay_sn,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_cancel_all', parms,
        (res) => {
            const pages = getCurrentPages()
            const perpage = pages[pages.length - 1]
            perpage.onLoad()
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}