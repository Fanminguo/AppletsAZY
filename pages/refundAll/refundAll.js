var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js');
const utilclick = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nameList: [], //退款原因text
        valueList: [], //退款原因value
        refund: 0,
        receiv: 0,
        reason: 0,
        avatar: '',
        avatarTow: "",
        avatarthree: "",
        refundArray: ['请选择', '我要退款(无需退货)', '我要退货'],
        receivArray: ['请选择', '已收到货', '未收到货'],
        buyer_message: "", //退款原因
        refund_type: "", //退款类型
        return_type: "", //收货状态
        refund_pic: [],
        orderList: [],

    },
    // 上传图片
    upShopLogo: function (e) {
        var that = this;
        var dataId = e.currentTarget.dataset.id
        that.setData({
            dataId: e.currentTarget.dataset.id
        })
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#f7982a",
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImageShop('album'); //从相册中选择
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImageShop('camera'); //手机拍照
                    }
                }
            }
        })
    },
    chooseWxImageShop: function (type) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function (res) {
                if (that.data.dataId == 1) {
                    that.data.avatar = res.tempFilePaths[0]
                    that.setData({
                        avatar: res.tempFilePaths[0]
                    });
                } else if (that.data.dataId == 2) {
                    that.data.avatarTow = res.tempFilePaths[0]
                    that.setData({
                        avatarTow: res.tempFilePaths[0]
                    });
                } else if (that.data.dataId == 3) {
                    that.data.avatarthree = res.tempFilePaths[0]
                    that.setData({
                        avatarthree: res.tempFilePaths[0]
                    });
                }
             
                that.upload_file(app.globalData.loadUrl + '/cli/CustRefund/upload_pic', res.tempFilePaths[0])


            }
        })
    },
    upload_file: function (url, filePath) {
        console.log(filePath)
        var that = this;
        wx.uploadFile({
            url: url, //后台处理接口
            filePath: filePath,
            name: 'file',
            header: {// 设置请求的 header
                'Content-Type': 'multipart/form-data',
                key: wx.getStorageSync('key')
            }, 
            formData: {
              },
            success: function (res) {
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1500
                })
                console.log(res)
                var data = JSON.parse(res.data);
                that.data.refund_pic.push(data.datas.pic)
            },
            fail: function (res) { }
        })
    },
    // 退款原因 text
    bindTextAreaBlur: function (e) {
        var mythis = this
        mythis.setData({
            buyer_message: e.detail.value
        })
    },
    // 退款类型
    bindPickerChange: function (e) {
        this.setData({
            refund: e.detail.value,
            refund_type: e.detail.value
        })
    },
    // 收货状态
    receivingType: function (e) {
        this.setData({
            receiv: e.detail.value,
            return_type: e.detail.value
        })

    },
    // 退款原因
    reasonList: function (e) {
        this.setData({
            reason: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let mythis = this
        // 获取上页面参数
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        mythis.setData({
            key: wx.getStorageSync('key'),
            orderId: options.order_id,
            order_products_id: options.rec_id,
            orderType: options.type
        })
        if (options.type == "all_return") {
            // 退货
            returnAll(mythis.data.key, mythis.data.orderId, mythis.data.order_products_id, mythis)
            console.log('退货')
        } else {
            // 退款
            refundAll(mythis.data.key, mythis.data.orderId, mythis)
            console.log('退款')
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

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    submiSsion: utilclick.throttle(function () {
        var mythis = this
        var refund_pic1, refund_pic2, refund_pic3
        refund_pic1 = mythis.data.refund_pic[0] == undefined?'':mythis.data.refund_pic[0]
        refund_pic2 = mythis.data.refund_pic[1] == undefined?'':mythis.data.refund_pic[1]
        refund_pic3 = mythis.data.refund_pic[2] == undefined?'':mythis.data.refund_pic[2]
       
        if (mythis.data.refund != 0 && mythis.data.receiv != 0) {
            if (mythis.data.orderType == "all_return") {
                orderReturn(mythis.data.key, mythis.data.buyer_message, mythis.data.refund_type, mythis.data.return_type, mythis.data.orderId, refund_pic1, refund_pic2, refund_pic3, mythis)
            } else {
                orderRefund(mythis.data.key, mythis.data.buyer_message, mythis.data.refund_type, mythis.data.return_type, mythis.data.orderId, refund_pic1, refund_pic2, refund_pic3, mythis)
            }

        } else {
            wx.showToast({
                title: '请完善申请信息',
                icon: 'none',
                duration: 1000
            })
        }
    }, 1500),
})
// 提交退款
function orderRefund(key, buyer_message, refund_type, return_type, orderId, refund_pic1, refund_pic2, refund_pic3, mythis) {
    let parms = {
        key: key,
        buyer_message: buyer_message,
        refund_type: refund_type,
        return_type: return_type,
        order_id: orderId,
        'refund_pic[0]': refund_pic1,
        'refund_pic[1]': refund_pic2,
        'refund_pic[2]': refund_pic3
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustRefund/refund_all_post', parms,
        (res) => {
            wx.redirectTo({
                url: '/pages/refundRefund/refundRefund',
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}
// 退款详情
function refundAll(key, orderId, mythis) {
    let parms = {
        key: key,
        order_id: orderId
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustRefund/refund_all_form', parms,
        (res) => {
            var reasonList = res.datas.reason_list
            for (var i = 0; i < reasonList.length; i++) {
                if (i == 0) {
                    mythis.data.nameList.push({ value: '', text: "请选择" })
                } else {
                    mythis.data.nameList.push(reasonList[i])
                }
            }
            var orderList = res.datas.products_list
            for (var k = 0; k < orderList.length; k++) {
                mythis.data.orderList.push(orderList[k])
            }
            mythis.setData({
                orderList: mythis.data.orderList,
                array: mythis.data.nameList,
            })
            // 退款金额
            var numMoney = res.datas.order.allow_refund_amount
            mythis.setData({
                numMoney: res.datas.order.allow_refund_amount
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}



// 退货
function orderReturn(key, buyer_message, refund_type, return_type, orderId, refund_pic1,refund_pic2,refund_pic3, mythis) {

    let parms = {
        key: key,
        buyer_message: buyer_message,
        refund_type: refund_type,
        return_type: return_type,
        order_id: orderId,
        'refund_pic[0]': refund_pic1,
        'refund_pic[1]': refund_pic2,
        'refund_pic[2]': refund_pic3
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustReturn/return_all_post', parms,
        (res) => {
            wx.redirectTo({
                url: '/pages/refundRefund/refundRefund',
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}
// 退货详情   
function returnAll(key, orderId, order_products_id, mythis) {

    let parms = {
        key: key,
        order_id: orderId,
        order_products_id,
        order_products_id
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustReturn/return_all_form', parms,
        (res) => {
            var reasonList = res.datas.reason_list
            for (var i = 0; i < reasonList.length; i++) {
                if (i == 0) {
                    mythis.data.nameList.push({ value: '', text: "请选择" })
                } else {
                    mythis.data.nameList.push(reasonList[i])
                }
            }
            var orderList = res.datas.products
            for (var k = 0; k < orderList.length; k++) {
                mythis.data.orderList.push(orderList[k])
            }
            mythis.setData({
                orderList: mythis.data.orderList,
                array: mythis.data.nameList,
            })
            // 退款金额
            var numMoney = res.datas.order.allow_refund_amount
            mythis.setData({
                numMoney: res.datas.order.allow_refund_amount
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })
}