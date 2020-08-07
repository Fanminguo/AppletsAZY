// pages/personalData/interest/interest.js
var app = getApp();
var http = require('../../../utils/httputils.js');   //相对路径
var store_id
var is_live = false
Page({

    /**
     * 页面的初始数据
     */
    data: {
        click_select: [], //小数组选中标识
        label_id: [],
        hide:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        var string = options.label
        var strId = string.split(",")
        store_id = options.store_id
        if(options.is_live == 'true'){
            is_live = options.is_live
        }else{
            is_live = false
        }
        mythis.setData({
            info: options.info
        })
        if (strId == "") {
            mythis.setData({
                labelId: []
            })
        } else {
            mythis.setData({
                labelId: strId
            })
        }
        shopName(mythis)
        for (var i in mythis.data.labelId) {
            mythis.data.label_id.push(mythis.data.labelId[i])
        }

    },
    // 提交
    okFome: function () {
        var mythis = this;
        if (mythis.data.label_id.length <= 0) {
            wx.showToast({
                title: '请选择你感兴趣内容哦！',
                icon: 'none',
                duration: 2000
            })
        } else {
            mythis.formGo()
        }
    },
    // 取消
    cancel:function(){
        if (is_live) {
            console.log(is_live)
            if (wx.getStorageSync('cust_mobile')) {
                wx.redirectTo({
                    url: '../live/live/live?store_id=' + store_id + "&is_share=yes&notice_id=" + wx.getStorageSync('notice_id')
                })
            } else {
                wx.redirectTo({
                    url: '../../bind_mobile/bind_mobile?&is_live='+is_live +'&store_id=' + store_id
                })

            }
        }else if(!wx.getStorageSync('cust_mobile')){
            wx.redirectTo({
                url: '../../bind_mobile/bind_mobile?&is_live='+is_live +'&store_id=' + store_id
            })
        }else{
            wx.navigateBack({
                delta: 1,
            });
        }
    },
    // 删除方法
    remove: function (array, val) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == val) {
                array.splice(i, 1);

            }
        }
        return -1;
    },
    // 多选
    selection: function (id) {
        var mythis = this;
        var thisId = id.currentTarget.dataset.id //标签ID
        var select = id.currentTarget.dataset.select //是否选中
        var index = id.currentTarget.dataset.index //标签对应数组下标
        var click_select = mythis.data.click_select;
        for (var i in mythis.data.pc_label) { //最外层  查看点击的是那个数组内的值
            for (var j in mythis.data.pc_label[i].pc_label_2) { //内层小数组  查看内部的id是否有匹配当前点击的id
                if (mythis.data.pc_label[i].pc_label_2[j].pc_label_id == thisId) { //选中的id是否等于当前点击标签ID
                    if (select) { //已经选中改为falss      选中状态
                        mythis.data.pc_label[i].pc_label_2[j].isSelect = false; //取消选中
                        click_select[index] = click_select[index] - 1;          //对应计数减一
                        // 调用删除方法，删除对应的id
                        mythis.remove(mythis.data.label_id, thisId)  //删除对应id


                    } else {
                        if (click_select[index] < 3) {
                            click_select[index] = click_select[index] + 1;
                            mythis.data.pc_label[i].pc_label_2[j].isSelect = true;
                            mythis.data.label_id.push(mythis.data.pc_label[i].pc_label_2[j].pc_label_id)
                        } else {
                            wx.showToast({
                                title: '每个类别最多3个标签',
                                icon: 'none',
                                duration: 1500
                            })
                        }
                    }

                }
            }
        }
        mythis.setData({
            click_select: click_select,
            label_id: mythis.data.label_id,
            pc_label: mythis.data.pc_label

        })
        console.log(mythis.data.label_id)
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

    // }
    // 提交接口
    formGo: function () {
        var mythis = this
        let parms = {
            label_id: mythis.data.label_id,
            key: wx.getStorageSync('key')
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustMoment/chooseLabel', parms,
            function (res) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1500
                })
                if (mythis.data.info == 'yes') {
                    if (wx.getStorageSync('key')) {
                        console.log(is_live)
                        if (is_live) {
                            console.log(is_live)
                            if (wx.getStorageSync('cust_mobile')) {
                                wx.redirectTo({
                                    url: '../live/live/live?store_id=' + store_id + "&is_share=yes&notice_id=" + wx.getStorageSync('notice_id')
                                })
                            } else {
                                wx.redirectTo({
                                    url: '../../bind_mobile/bind_mobile?&is_live='+is_live+'&store_id=' + store_id
                                })

                            }
                        } else {
                            if (wx.getStorageSync('cust_mobile')) {
                                wx.navigateBack({
                                    delta: 1,
                                });
                            } else {

                                wx.redirectTo({
                                    url: '../../bind_mobile/bind_mobile'
                                })
                            }

                        }
                    }
                } else {
                    var pages = getCurrentPages(); //页面指针数组 
                    var prepage = pages[pages.length - 1]; //上一页面指针 
                    wx.navigateBack({
                        delta: 1,
                    }); //返回上一页面
                }

            }, function (err) {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 1500
                })
            })

    }
})

// 显示全部标签
function shopName(mythis) {
    var click_select = mythis.data.click_select;
    let parms = { key: wx.getStorageSync('key'), }
    http.postRequest(app.globalData.apiUrl + '/cli/custMoment/pcLabelList', parms,
        function (res) {
            var label = res.datas
            var pc_label = [];
            var k = 0;
            for (var i = 0; i < label.length; i++) {
                label[i].index = i
                click_select.push(0);
                for (var j in label[i].pc_label_2) {
                    label[i].pc_label_2[j].isSelect = false;
                    if (mythis.data.labelId[k] == label[i].pc_label_2[j].pc_label_id) {
                        label[i].pc_label_2[j].isSelect = true;
                        k++
                        var index = label[i].index
                        click_select[index] = click_select[index] + 1;
                    }
                }
                pc_label.push(label[i])
            }

            mythis.setData({
                click_select: click_select,
                pc_label: pc_label,
                hide: true
            })
        }, function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
            })
        })
}