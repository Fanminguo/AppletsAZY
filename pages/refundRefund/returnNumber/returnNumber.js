// pages/refundRefund/returnNumber/returnNumber.js
var app = getApp();
var http = require('../../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        index: 0,
        arrayNum: "",
    },
    // 实时获取input输入
    bindKeyInput: function (e) {
        var mythis = this
        mythis.setData({
            inputValue: e.detail.value
        })
    },
    // 提交
    formData: function (e) {
        var mythis = this;
        
        if (mythis.data.arrayValue == undefined) {
            wx.showToast({
                title: '请选择物流公司',
                icon: 'none',
                duration: 1500
            })
            return false;
        }
        if (mythis.data.inputValue == undefined) {
            wx.showToast({
                title: '请填写快递单号',
                icon: 'none',
                duration: 1500
            })
            return false;
        }

        formReturn(mythis.data.return_id, mythis.data.arrayValue, mythis.data.inputValue, mythis.data)

    },
    // 选择快递
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var mythis = this;
        for (var i in mythis.data.array) {
            if (e.detail.value == i) {
                console.log(mythis.data.array[i].text)
                console.log(mythis.data.array[i].value)
                mythis.setData({
                    arrayNum: mythis.data.array[i].text,
                    arrayValue: mythis.data.array[i].value
                })
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (mythis.data.arrayNum == "") {
            mythis.setData({
                arrayNum: '请选择相应的物流公司名称',
            })
        }
        mythis.setData({
            return_id: options.refund_id
        })
        refundList(mythis.data.return_id, mythis)
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

function refundList(return_id, mythis) {
    let parms = { return_id: return_id ,key: wx.getStorageSync('key')}
    http.getRequest(app.globalData.apiUrl + '/cli/CustReturn/ship_form', parms,
        (res) => {
            var orderData = res.datas.products_info;
            var array = res.datas.express_list
            mythis.setData({
                orderData: orderData,
                array: array
            })
            mythis.setData({
                hide: true
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })
}
function formReturn(return_id, express_id, invoice_no, mythis) {
    var mythis = this;
    let parms = {
        return_id: return_id,
        express_id: express_id,
        invoice_no: invoice_no,
        key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustReturn/ship_post', parms,
        (res) => {
            wx.showToast({
                title: '提交成功',
                icon: 'none',
                duration: 1500
            })
            wx.redirectTo({
                url: "/pages/refundRefund/refundRefund?currentTab=" + 1
            })
        }, (err) => {
            wx.showToast({
              title: err.datas.error,
              icon:'none',
              duration:1000
            })
        })
   
  
}