// pages/cardCoupon/cardCoupon.js
var app = getApp();
var key = wx.getStorageSync('key')
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        // tab
        num: 0,
        page: 1, //首页
        rows: 10, //条数
        state: 1, //底部
        appList: [], //数据
        lipinka:[],
        tabList: [{
            name: '代金券',
            index: '0',
        },
        {
            name: '礼品卡',
            index: '1',
        }
        ]
    },
    tabSwitch: function (e) {
        var mythis = this;
        var index = e.target.dataset.index;
        mythis.setData({
            num: index,
            page: 1,
            state: 1,
            lipinka:[],
            appList:[]

        })

        if (mythis.data.num == 0) {
            orderList(mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
        } else if (mythis.data.num == 1) {
            giftCard(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
        }
    },
    // 使用代金券
    voucherId: function (e) {
        var store_id =  e.currentTarget.dataset.id
        var type = e.currentTarget.dataset.index
        var voucherId = e.currentTarget.dataset.voucherid
        if(type == '全场通用'){
            navigateTo('/pages/prodlist/prodlist?voucherId=' + voucherId)
        }else{
            navigateTo('/pages/shopHome/shopHome?store_id=' +store_id)
        }
        // navigateTo('/pages/prodlist/prodlist')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login();
        }
        if(options.newNum ==1){
            mythis.setData({
                num:options.newNum
            })
        }else{
            mythis.setData({
                num:0
            })
        }
        mythis.setData({
            key: wx.getStorageSync('key')
        })
        if (mythis.data.num == 0) {
            orderList(mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
        } else if (mythis.data.num == 1) {
            giftCard(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
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
        if (mythis.data.num == 0) {
            if (mythis.data.hasmore) {
                orderList(mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
            } else {
                wx.hideLoading();
            }

        } else if (mythis.data.num == 1) {
            if (mythis.data.hasmore ) {
                giftCard(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
            } else {
                wx.hideLoading();
            }
        }


    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    // 交易详情
    goDetail: function (e) {
        let mythis = this;
        mythis.setData({
            recode_id: e.currentTarget.dataset.id,
            pay_sn: e.currentTarget.dataset.index,
            all_recharge_amount: e.currentTarget.dataset.num,
        })
        navigateTo('/pages/cardCoupon/gift_detail/gift_detail?recode_id=' + mythis.data.recode_id + "&pay_sn=" + mythis.data.pay_sn + "&all_recharge_amount=" + mythis.data.all_recharge_amount)
    },
    //显示对话框
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    // 跳转待支付
    goTobepaid: function () {
        var mythis = this;
        wx.showModal({
            title: '小提示',
            content: "您有订单待支付，快去支付吧",
            success: function (res) {
                if (res.confirm) {
                    navigateTo('/pages/order/order?index=' + 1)
                } else if (res.cancel) {
                }
            }
        })
    },
    bindKeyInput: function (e) {
        this.setData({
            recharge_code: e.detail.value
        })
    },
    binding: function () {
        var mythis = this
        mythis.setData({
            lipinka:[]
        })
        recharge(mythis.data.key, mythis.data.recharge_code, mythis)
    }
})
// 绑定礼品卡
function recharge(key, recharge_code, mythis) {
    let parms = {
        key: wx.getStorageSync('key'),
        recharge_code: recharge_code,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustRecharge/band_recharge_card', parms,
        function (res) {
            wx.showToast({
                title: '绑定成功',
                icon: 'success',
                duration: 2000
            })
            mythis.setData({
                showModalStatus: false
            })
            giftCard(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
        }, function (res) {
            mythis.setData({
                errorOne: res.datas.error
            })
        })

}
// 礼品卡
function giftCard(key, page, rows, mythis) {
    let parms = {
        key: wx.getStorageSync('key'),
        page: page,
        rows: rows
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustRecharge/recharge_available_balance', parms,
        function (res) {
            for (var i = 0; i < res.datas.recharge_change_record_info.length; i++) {
                mythis.data.lipinka.push(res.datas.recharge_change_record_info[i]);
            }
            mythis.setData({
                money: res.datas.recharge_account_info,
                lipinka: mythis.data.lipinka, //列表
                state: 1,
                number: res.datas.order_nopay_count,
                hasmore: res.datas.hasmore,
                hide: true
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
            // wx.hideLoading();
        }, function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
            })
        })

}
// 代金券
function orderList(page, rows, key, mythis) {
    let parms = {
        page: page,
        rows: rows,
        key: wx.getStorageSync('key')
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustVoucher/voucher_list', parms,
        function (res) {
            for (var i = 0; i < res.datas.voucher_list.length; i++) {
                mythis.data.appList.push(res.datas.voucher_list[i]);
            }
            mythis.setData({
                hasmore: res.datas.hasmore,
                appList: mythis.data.appList,
                state: 1,
                hide: true
            });
            wx.hideLoading()
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
        },
        function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
            })
        })


}