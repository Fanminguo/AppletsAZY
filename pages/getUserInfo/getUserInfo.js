const app = getApp();
var is_live = false
var store_id;
var http = require('../../utils/httputils.js');
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hide: false,
    },
    onLoad: function (options) {
        var that = this;
        
        store_id = options.store_id
        if(options.is_live == 'true'){
            is_live = options.is_live
        }else{
            is_live = false
        }
        if(options.notice_id){
            wx.setStorageSync('notice_id',options.notice_id);
        }else{
            wx.removeStorageSync('notice_id');
        }
        app.loginName()
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            //用户已经授权过
                            app.loginName()
                            app.login()
                        }
                    });
                }
            }
        })
    },


    // 手机号授权
    getPhoneNumber: function (e) {
        var that = this;
        if (e.detail.errMsg == "getPhoneNumber:ok") {
            let parms = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                sessionKey: wx.getStorageSync('session_key'),
            }
            http.postRequest(app.globalData.apiUrl + '/cli/WxLogin/getPhoneNumber', parms,
                (res) => {
                },
                (err) => {
                })

        }
    },



    onShow: function () {
        this.setData({
            hide: true
        })
    },

    bindGetUserInfo: function (e) {
        var mythis = this;
        wx.setStorageSync('iv', e.detail.iv);
        wx.setStorageSync('encryptedData', e.detail.encryptedData);
        if (e.detail.userInfo) {
            mythis.setData({
                hide: false,
            })
            mythis.loadName()
        }
    },

    loadName: function () {
        var mythis = this;
        if (!wx.getStorageSync('key') && wx.getStorageSync('unionid')) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
                success: function (res) {
                    var avatarUrl = 'userInfo.avatarUrl';
                    var nickName = 'userInfo.nickName';
                    mythis.setData({
                        [avatarUrl]: res.userInfo.avatarUrl,
                        [nickName]: res.userInfo.nickName,
                    })
                    var nickName = res.userInfo.nickName
                    var avatarUrl = res.userInfo.avatarUrl
                    var unionid = wx.getStorageSync('unionid')
                    mythis.setData({
                        nickName1: res.userInfo.nickName,
                        avatarUrl1: res.userInfo.avatarUrl,
                        unionid: wx.getStorageSync('unionid')
                    })
                    // app.loginName();
                    loadDengl(avatarUrl, nickName, unionid, mythis)

                }
            })
        } else {
            mythis.loginUid()
        }
    },
    // 没有key和unionid
    loginUid: function () {
        var mythis = this;
        let parms = {
            session_key:wx.getStorageSync('session_key'),
            iv:wx.getStorageSync('iv'),
            encryptedData:wx.getStorageSync('encryptedData')
        }
        http.postRequest(app.globalData.apiUrl + '/cli/WxLogin/getWxUnionid', parms,
            (res) => {
                wx.setStorageSync('unionid', res.datas.wxData.unionId);
                // mythis.unionid()
                mythis.loadName()
            }, (err) => {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 1000
                })
            })

    },
})

function loadDengl(avatarUrl, nickName, unionid, mythis) {
    let parms = {
        headimgurl: avatarUrl,
        nickname: nickName,
        unionid: unionid
    }
    http.postRequest(app.globalData.apiUrl + '/cli/WxLogin/getWxKey', parms,
        (res) => {
            wx.setStorageSync('key', res.datas);
            wx.navigateBack({
                delta: 1,
            });
            // wx.redirectTo({
            //     url: "../personalData/interest/interest?store_id=" + store_id + '&info=yes' + "&label=" + "&is_live=" + is_live
            // })

            // if (wx.getStorageSync('key')) {
            //     if (is_live) {
            //         if (wx.getStorageSync('cust_mobile')) {
            //             wx.redirectTo({
            //                 url: '../live/live/live?store_id=' + store_id+"&is_share=yes&notice_id="+wx.getStorageSync('notice_id')
            //             })
            //         } else {
            //             wx.redirectTo({
            //                 url: '../bind_mobile/bind_mobile?&is_live=true&store_id=' + store_id
            //             })
                       
            //         }
            //     } else {
            //         if (wx.getStorageSync('cust_mobile')) {
            //             wx.navigateBack({
            //                 delta: 1,
            //             });
            //         } else {
                      
            //             wx.redirectTo({
            //                 url: '../bind_mobile/bind_mobile'
            //             })
            //         }

            //     }
            // }
            mythis.setData({
                hide:true
            })
        }, (err) => {
            wx.showToast({
              title: err.datas.error,
              icon:'none',
              duration:1000
            })
        })
   
}