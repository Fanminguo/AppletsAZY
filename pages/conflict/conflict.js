// pages/conflict/conflict.js
var http = require('../../utils/httputils.js');   //相对路径
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
const utilclick = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: false,
        cust_ids: '',
        custList: [],
        wancheng:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        app.login()
        that.setData({
            cust_ids: options.cust_ids,
            cust_mobile: options.mobile,
            is_share:options.is_share,
            store_id:options.store_id
        })
        that.conflict()
    },
    // 选择框
    // radioChange: function (e) {
    //     var mythis = this
    //     console.log(e)
    //     mythis.setData({
    //         cust_id: e.detail.value
    //     })
    //     console.log(mythis.data.cust_id)
    // },
    solve_genghuan: function () {
        wx.redirectTo({
            url: '../bind_mobile/bind_mobile',
        })
        // navigateTo('../bind_mobile/bind_mobile')
    },
    // 注销冲突
    solve_number: function () {
        var mythis = this
        console.log(mythis.data.cust_id)
        wx.showModal({
            title: '谨慎操作',
            content: '注销后账号将永久删除，不能找回，请确您在注销账号前已经充分了解注销后的后果。',
            success(res) {
                if (res.confirm) {
                    let parms = {
                        cust_id: mythis.data.cust_id,
                        key: wx.getStorageSync('key')
                    }
                    http.postRequest(app.globalData.apiUrl + '/cli/CustAccount/killCustById', parms,
                        (res) => {
                            console.log(res)
                            if (res.datas.state == 200) {
                                app.login()
                                // wx.navigateBack({
                                //     delta: 2,
                                //   });
                                // wx.redirectTo({
                                //     url: '../bind_mobile/bind_mobile'
                                // })
                                // mythis.complete()
                                mythis.setData({
                                    wancheng:true
                                })
                            }
                        },
                        (err) => {
                            wx.showToast({
                                title: err.datas.error,
                                icon: 'none',
                                duration: 1000
                            })
                        })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })




    },
    ok: utilclick.throttle(function (e) {
        this.complete()
    },6000),
    // ok:function(){
    //     this.complete()
    // },
    // 完成自动登录
    complete: function () {
        var mythis = this
        let parms = {
            cust_id: mythis.data.ok_cust_id,
            cust_mobile: mythis.data.cust_mobile,
            client:'wap'
        }
        http.postRequest(app.globalData.apiUrl + '/cli/login/bindPhone', parms,
            (res) => {
                  wx.setStorageSync('cust_mobile',mythis.data.cust_mobile);
                console.log(mythis.data.is_share)
                if(mythis.data.is_share!='yes'){
                    wx.navigateBack({
                        delta: 2,
                    });
                }else{
                    wx.navigateBack({
                        delta: 2,
                    });
                    // wx.redirectTo({
                    //     url: '../live/live/live?store_id=' + mythis.data.store_id+"&notice_id="+wx.getStorageSync('notice_id') +"&is_share=yes"
                    // })
                    // console.log('../live/live/live?store_id=' + mythis.data.store_id+"&notice_id="+wx.getStorageSync('notice_id'))

                }
               
            }, (err) => {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 2000
                })
            })
    },
    // 列表
    conflict: function () {
        app.login()
        var that = this
        let parms = {
            cust_ids: that.data.cust_ids,
            cust_mobile: that.data.cust_mobile,
            key: wx.getStorageSync('key')
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustAccount/getClashInfo', parms,
            (res) => {
                console.log(res)
                for (var i in res.datas.cust_info) {
                    that.data.custList.push(res.datas.cust_info[i])
                    if (res.datas.cust_info[i].now == '冲突账号') {
                        that.setData({
                            cust_id: res.datas.cust_info[i].cust_id
                        })
                    }
                     if (res.datas.cust_info[i].now == '当前账号') {
                        that.setData({
                            ok_cust_id: res.datas.cust_info[i].cust_id
                        })
                    }
                }
                that.setData({
                    mobile: res.datas.cust_mobile,
                    custList: that.data.custList
                })
            },
            (err) => {
                console.log(err)
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
    // onShareAppMessage: function () {

    // }
})