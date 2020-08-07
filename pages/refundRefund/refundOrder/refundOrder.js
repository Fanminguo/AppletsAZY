// pages/refundRefund/refundOrder/refundOrder.js
const app = getApp()
var http = require('../../../utils/httputils.js');   //相对路径
import navigateTo from "../../../utils/navigateRoute.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        seller_title: '',    //卖家是否同意提示字段
        seller_text: '',     // 买家申请状态
        seller_tishi: '',    //商城提示信息
        seller_tishi2: '',
        seller_tishi3: '',
        hide:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            refund_id: options.refund
        })
        that.queryData()
    },
    // 物流单号
    goNumber: (e) => {
        let refund_id = e.currentTarget.dataset.refund_id
        navigateTo('../returnNumber/returnNumber?refund_id=' + refund_id)
    },
    // 客服
    kefu: function () {
        navigateTo('../../load_app/load_app?link=' + encodeURIComponent("https://www.echatsoft.com/visitor/mobile/chat.html?companyId=566"))
      },
    // 撤销
    revoke: function (e) {
        var that = this;
        wx.showModal({
            content: '您将撤销本次申请，如果问题未解决，可以再次发起申请哦！',
            success(res) {
                if (res.confirm) {
                    console.log(1)
                    that.setData({
                        refund_id: e.currentTarget.dataset.refund_id
                    })
                    that.revokePost()
                }
            }
        })
    },
    // 撤销申请
    revokePost:function (e){
        var that = this
        let parms = {
            refund_id: that.data.refund_id,
            key: wx.getStorageSync('key')
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustOrder/order_refund_cancel"', parms,
            (res) => {
                console.log(res)
                that.setData({
                    hide:true
                })
                that.queryData()
            }, (err) => {
                wx.showToast({
                    icon: "none",
                    title: err.datas.error,
                    duration: 1000
                })
            })
    },
    // 详情
    queryData: function () {
        var that = this;
        let parms = {
            key: wx.getStorageSync('key'),
            refund_id: that.data.refund_id
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustRefund/get_refund_info', parms,
            (res) => {
                that.setData({
                    detail_array: res.datas.detail_array,
                    refund_info: res.datas.refund_info,
                    hide:true
                });

                // seller_state：1  admin_state：1 等待商家处理
                // seller_state：2  admin_state：1 退款中
                // seller_state：2  admin_state：2 退款中
                // seller_state：2  admin_state：3 退款退货成功
                // seller_state：3  admin_state：1 退款失败
                // seller_state：4  admin_state：4 退款关闭
                // 除seller_state：2时需判断admin_state外其他只判断seller_state即可
                //  卖家处理状态:1为待审核,2为同意,3为不同意,4为取消,默认为1

                if (that.data.refund_info.refund_type == 1) {      //退款
                    if (that.data.refund_info.seller_state == 1) {
                        that.setData({
                            seller_title: ' 等待商家处理',
                            seller_text: '您已经发起退款申请，请耐心等候商家处理',
                            seller_tishi: '如果商家拒绝，您可以联系客服，或再次发起，商家会重新处理',
                        })
                    } else if (that.data.refund_info.seller_state == 2) {
                        that.setData({
                            seller_title: ' 退款中',
                            seller_text: '商家已审核通过，3-5个工作日原路退回支付账户',
                            seller_tishi: '',

                        })
                    } else if (that.data.refund_info.seller_state == 3) {
                        that.setData({
                            seller_title: '退款成功',
                            seller_text: '您发起的退款申请已结束',
                            seller_tishi: '',
                        })
                    } else if (that.data.refund_info.seller_state == 4) {
                        that.setData({
                            seller_title: '退款关闭',
                            seller_text: '您撤销退款申请，退款关闭',
                            seller_tishi: '',
                        })
                    }
                } else if (that.data.refund_info.refund_type == 2) {    //退货
                    if (that.data.refund_info.seller_state == 1) {
                        that.setData({
                            seller_title: ' 等待商家处理',
                            seller_text: '您已经发起退款申请，请耐心等候商家处理',
                            seller_tishi: '如果商家拒绝，您可以联系客服，或再次发起，商家会重新处理',
                        })
                    } else if (that.data.refund_info.seller_state == 2) {
                        if (that.data.refund_info.admin_state == 1) {
                            that.setData({
                                seller_title: ' 商家已同意',
                                seller_text: '商家已同意申请退款退货申请，请尽早退货',
                                seller_tishi: '·商家同意后，请按照商家的退货地址发货，并记录退货运单号',
                                seller_tishi2: '·如果商家拒绝，在保障其内，你可以重新申请',
                                seller_tishi3: '·主动撤销申请后，在保障其内，可以重新申请',
                            })
                        } else if (that.data.refund_info.admin_state == 2) {
                            that.setData({
                                seller_title: ' 退款中',
                                seller_text: '商家已审核通过，3-5个工作日原路退回支付账户',
                                seller_tishi: '',
                            })
                        } else if (that.data.refund_info.admin_state == 3) {
                            that.setData({
                                seller_title: ' 退款成功',
                                seller_text: '您发起的退款申请已结束',
                                seller_tishi: '',
                            })
                        }
                    } else if (that.data.refund_info.seller_state == 3) {
                        that.setData({
                            seller_title: '退款退货失败',    //卖家是否同意提示字段
                            seller_text: '·商家拒绝了您的退款退货申请货',     // 买家申请状态
                            seller_tishi: '·商家同意后，请按照商家的退货地址发货，并记录退货运单号', //商城提示信息
                            seller_tishi2: '·如果商家拒绝，在保障其内，你可以重新申请',
                            seller_tishi3: '·主动撤销申请后，在保障其内，可以重新申请'
                        })
                    } else if (that.data.refund_info.seller_state == 4) {
                        that.setData({
                            seller_title: '退款关闭',    //卖家是否同意提示字段
                            seller_text: '您撤销了退款申请，退货退款关闭',     // 买家申请状态
                            seller_tishi: '·商家同意后，请按照商家的退货地址发货，并记录退货运单号',    //商城提示信息
                            seller_tishi2: '·如果商家拒绝，在保障其内，你可以重新申请',
                            seller_tishi3: '·主动撤销申请后，在保障其内，可以重新申请'
                        })
                    }
                }


            }, (err) => {
                wx.showToast({
                    icon: "none",
                    title: err.datas.error,
                    duration: 1000
                })
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

    }
})