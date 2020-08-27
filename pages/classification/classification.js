// pages/test/test.js
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
        scrollLeft: 0,
        id: "",
        num: "",
        //用于标识是否还有更多的状态
        state: 1,
        //用于数组的追加和暂存
        allProject: [],
        // 分页
        //每页显示的行数：
        page: 1,
        //页码（从1开始）：
        rows: 10,

    },
    // top点击请求不同接口
    listTop: function (e) {
        var mythis = this;
        var pc_label = e.currentTarget.dataset.num
        mythis.setData({
            num: pc_label //根据实际需求加减值
        })
        mythis.setData({
            listData: [],
            allProject: [],
            id: "",
            page: 1,
            hasmore: true
        });
        topList(mythis.data.num, mythis.data.page, mythis.data.rows, mythis)
    },
    quanbu: function () {
        var mythis = this;
        mythis.setData({
            listData: [],
            allProject: [],
            id: "",
            page: 1,
            hasmore: true
        });
        topList(mythis.data.num, mythis.data.page, mythis.data.rows, mythis)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login();
        }
        mythis.setData({
            num: options.num,
            key: wx.getStorageSync('key'),
            listData: [],
            allProject: [],
            id: "",
            page: 1,
            hasmore: true
        })
        topList(mythis.data.num, mythis.data.page, mythis.data.rows, mythis)
    },
    goBanner:function(){
        if(this.data.bannerImg.banner_title == "代言人"){
            navigateTo("/pages/myAssets/introduction/spokesman/spokesman")
        }else if(this.data.bannerImg.banner_title == "区块链+电商"){
            navigateTo("/pages/myAssets/introduction/blockchain/blockchain")
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this;
        var query = wx.createSelectorQuery()
        query.select('#tab-con').boundingClientRect(function (res) {
            that.setData({
                tabScrollTop: res.top + 100 //根据实际需求加减值
            })
        }).exec()
    },
    onPageScroll: function (e) { // 获取滚动条当前位置
        if (e.scrollTop > this.data.tabScrollTop) {
            this.setData({
                tabFixed: true
            })
        } else {
            this.setData({
                tabFixed: false
            })
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
        // 加载
        var mythis = this;
        wx.showLoading({
            title: '玩命加载中...',
        });
        mythis.data.page = mythis.data.page + 1;
        if (mythis.data.hasmore) {
            topList(mythis.data.num, mythis.data.page, mythis.data.rows, mythis)
        } else {
            wx.hideLoading();
        }

    },
    /**
     * 点击加载更多时触发
     */
    loadMore: function () {
        var mythis = this;
        wx.showLoading({
            title: '玩命加载中...',
        });

        if (mythis.data.hasmore) {
            mythis.data.page = mythis.data.datas.products_list + 1;
            topList(mythis.data.num, mythis.data.page, mythis.data.rows, mythis)
        } else {
            wx.hideLoading();
        }

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    translate: function () {
        navigateTo('/pages/search/search')
    },
    // 跳转详情
    gocommod: function (e) {
        var products_commonid = e.currentTarget.id
        var products_id = e.currentTarget.dataset.index
        var index = e.currentTarget.dataset.key
        navigateTo('/pages/video_detail/video_detail?products_commonid=' + products_commonid + "&index=" + index + '&products_id=' + products_id + '&type=classification' + '&list=' + encodeURIComponent(JSON.stringify(this.data.listData)))
    },
    // 跳转推荐
    goHome: function () {
        wx.navigateBack({
            dalta: 1
        })
    },
    goFriend: function () {
        navigateTo('/pages/follows/follows?type=1')
    },

    //切换产品类别 (小)
    switchNav: function (e) {
        var mythis = this;
        const {
            offsetLeft
        } = e.currentTarget;
        const {
            id,
            index
        } = e.currentTarget.dataset;
        var clientX = e.detail.x;
        if (this.data.id == e.currentTarget.dataset.id) {
            return false;
        }
        if (clientX < 60) {
            this.setData({
                scrollLeft: offsetLeft - 60
            });
        } else if (clientX > 330) {
            this.setData({
                scrollLeft: offsetLeft
            });
        }
        this.setData({
            id: id
        });
        var pc_label_2 = this.data.id
        mythis.setData({
            listData: [],
            allProject: [],
            page: 1,
            hasmore: true
        });

        twoList(mythis.data.page, mythis.data.rows, pc_label_2, mythis)
    },

})
// 二级导航
function twoList(page, rows, pc_label_2, mythis) {
    let parms = {
        page: page,
        rows: rows,
        pc_label_2: pc_label_2
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Classify/pcLabelInfo', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            mythis.setData({
                listData: mythis.data.allProject,
                hasmore: res.datas.hasmore,
                state: 1,
                bannerImg: res.datas.banner,
                hide: true
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
            wx.hideLoading();
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}

// 一级导航
function topList(pc_label, page, rows, mythis) {
    let parms = {
        pc_label: pc_label,
        page: page,
        rows: rows,
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Classify/pcLabelInfo',parms,
    (res)=>{
        for (var i = 0; i < res.datas.products_list.length; i++) {
            mythis.data.allProject.push(res.datas.products_list[i]);
        }
        mythis.setData({
            listData: mythis.data.allProject,
            hasmore: res.datas.hasmore,
            smallList: res.datas.pc_info,
            state: 1,
            bannerImg: res.datas.banner,
            hide: true
        });
        if (!mythis.data.hasmore) {
            mythis.setData({
                state: 0
            })
        }
        wx.hideLoading();
    },(err)=>{
        wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1000
        })
    })

}
