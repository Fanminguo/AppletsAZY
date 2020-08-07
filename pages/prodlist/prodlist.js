// pages/prodlist/prodlist.js
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');   //相对路径
Page({
    data: {

        hide: false,
        inputVal: "", //input框内值
        listarr: [], //创建数组
        SearchText: '搜索', //按钮变动值
        keydown_number: 0, //检测input框内是否有内容
        hostarr: [], //热门搜索接收请求存储数组  
        name_focus: false, //获取焦点
        scrollLeft: 0,
        min_price: '最低价',
        max_price: '最高价',
        id: "0",
        page: 1,
        rows: 10,
        paixu: 'viewcount',
        order: 'desc',
        state: 1,
        allProject: [],
        screen: 0,
        sort: "",
        // keywordValue: '请输入搜索内容',
        typeList: [{
            categoryId: 1,
            categoryName: "上新"
        },
        {
            categoryId: 2,
            categoryName: "关注"
        },
        ]
    },
    inputvalue: function (e) {
        let that = this;
        this.setData({
            inputVal: e.detail.value
        })
        if (e.detail.cursor != 0) {
            this.setData({
                SearchText: "搜索",
                keydown_number: 1
            })
        } else {
            this.setData({
                SearchText: "搜索",
                keydown_number: 0
            })
        }
    },
    search: function (keyword) {
        // 获取input的最后的值
        var mythis = this
        // mythis.data.allProject = []
        // 调用接口，需要把数组提前清空，在调用接口，
        mythis.setData({
            listData: [],
            allProject: [],
            page: 1
        });
        var keyword = this.data.inputVal
        if (keyword) {
            mythis.setData({
                keyword: this.data.inputVal
            })
        } else {
            mythis.setData({
                keyword: mythis.data.keyword
            })
        }
        listNum(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis)
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        // 获取上个页面传来的参数
        const keyword = this.options.keyword
        if (keyword) {
            mythis.setData({
                keyword: this.options.keyword,
                voucherId: options.voucherId,
                voucher: this.options.voucher,
            })
        } else {
            mythis.setData({
                keyword: '',
                // keywordValue: '请输入搜索内容',
                voucherId: options.voucherId,
                voucher: this.options.voucher,
            })

        }
        if (mythis.data.voucherId == undefined) {
            mythis.setData({
                voucherId: ''
            })
        }
        if (this.options.pc_id) {
            mythis.setData({
                search_type: 1,
                pc_id: options.pc_id
            })
        } else {
            mythis.setData({
                pc_id: "",
                search_type: 2
            })
        }
        listNum(mythis.data.page, mythis.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis.data.voucherId, mythis)

    },
    // 跳转详情页
    goData: function (e) {
        var video_name = e.currentTarget.dataset.name
        var products_id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.key
        //   var index = 
        if (video_name != null) {
            var products_commonid = e.currentTarget.dataset.index
            navigateTo('/pages/video_detail/video_detail?products_commonid=' + products_commonid + '&products_id=' + products_id + '&type=prodList' + "&index=" + index + "&list=" + encodeURIComponent(JSON.stringify(this.data.allProject)))
        } else {
            navigateTo('/pages/commodity/commodity?products_id=' + products_id)
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // 顶部tab  一直置顶
        var that = this;
        var query = wx.createSelectorQuery()
        query.select('#tab-con').boundingClientRect(function (res) {
            that.setData({
                tabScrollTop: res.top + 100 //根据实际需求加减值
            })
        }).exec()
        // 筛选
        this.animation = wx.createAnimation()
    },
    // 筛选函数
    translate: function () {
        this.setData({
            isRuleTrue: true
        })
        this.animation.translate(-245, 0).step()
        this.setData({
            animation: this.animation.export()
        })
    },
    // 筛选分类
    gotoresult: function (e) {
        var pc_id = e.target.dataset.num;
        var items = this.data.pcList;
        for (let i = 0; i < items.length; i++) {
            if (items[i].pc_id == pc_id) {
                items[i]['select'] = !items[i]['select']
            }
        }
        this.setData({
            pcList: items
        })
    },

    // 获取最低价
    lowPrice: function (e) {
        this.setData({
            min_price: e.detail.value
        })
    },
    // 获取最高价
    highPrice: function (e) {
        this.setData({
            max_price: e.detail.value

        })
    },
    // 点击完成隐藏  并调用接口
    successHide: function () {
        // 最大值    			最小值
        if (Number(this.data.max_price) < Number(this.data.min_price)) {
            this.setData({
                max_price: this.data.min_price,
                min_price: this.data.max_price
            })
        }
        this.setData({
            isRuleTrue: false,
            id: 4,
            hide: false
        })
        this.animation.translate(0, 0).step()
        this.setData({
            animation: this.animation.export()
        })
        var items = this.data.pcList;
        var selectItems = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i]['select']) {
                selectItems.push(items[i].pc_id)
            }
        }
        var mythis = this;
        mythis.setData({
            selectItems: selectItems,
            listData: [],
            allProject: [],
            page: 1
        });
        screenDate(this.data.page, this.data.rows, mythis.data.keyword, selectItems.join('|'), this.data.min_price, this.data.max_price, mythis)
    },
    // 点击给取消隐藏
    succHide: function () {
        this.setData({
            isRuleTrue: false
        })
        var items = this.data.pcList
        for (let j in items) {
            items[j]['select'] = false
        }
        this.setData({
            pcList: items,
            min_price: '最低价',
            max_price: '最高价'
        })
        this.animation.translate(0, 0).step()
        this.setData({
            animation: this.animation.export()
        })
    },
    tryDriver: function () {
        this.setData({
            background: "#89dcf8"
        })
    },
    // 获取滚动条当前位置
    onPageScroll: function (e) {
        // 顶部tab  一直置顶
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

    //切换产品类别
    switchNav: function (e) {
        var mythis = this;
        mythis.setData({
            listData: [],
            allProject: [],
            page: 1,
            hasmore: true,
            hide: false,
            voucherId: '',
        })
        const {
            offsetLeft
        } = e.currentTarget;
        const {
            id,
            index
        } = e.currentTarget.dataset;
        var clientX = e.detail.x;
        var screenIndex = e.currentTarget.dataset.index
        if (this.data.id == '3' && e.currentTarget.dataset.id == '3') {
            if (screenIndex == 0) {
                this.setData({
                    screen: 2,
                    sort: "1"
                })
                priceDate(mythis.data.page, mythis.data.rows, mythis.data.keyword, mythis.data.sort, mythis.data.pc_id, mythis.data.search_type, mythis.data.min_price, mythis.data.max_price, mythis)
            } else
                if (screenIndex == 1) {
                    this.setData({
                        screen: 0,
                        sort: "",
                    })
                    priceDate(mythis.data.page, mythis.data.rows, mythis.data.keyword, mythis.data.sort, mythis.data.pc_id, mythis.data.search_type, mythis.data.min_price, mythis.data.max_price, mythis)
                } else if (screenIndex == 2) {

                    this.setData({
                        screen: 1,
                        sort: ""
                    })
                    priceDate(mythis.data.page, mythis.data.rows, mythis.data.keyword, mythis.data.sort, mythis.data.pc_id, mythis.data.search_type, mythis.data.min_price, mythis.data.max_price, mythis)
                }

        } else if (mythis.data.id != e.currentTarget.dataset.id && id == 3) {

            priceDate(mythis.data.page, mythis.data.rows, mythis.data.keyword, mythis.data.sort, mythis.data.pc_id, mythis.data.search_type, mythis.data.min_price, mythis.data.max_price, mythis)
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

        if (id == 0) {
            listNum(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis.data.voucherId, mythis)
        }
        // 上新
        if (id == 1) {

            uptoDate(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis)
        }
        // 关注
        if (id == 2) {

            followDate(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis)
        }
        // 价格
        // if (id == 3 ) {
        //     priceDate(this.data.page, this.data.rows, mythis.data.keyword, this.data.sort, mythis.data.pc_id, mythis.data.search_type, mythis)
        // }

    },

    /**
     * 页面上拉触底事件的处理函数
     * 与点击加载更多做同样的操作
     */

    onReachBottom: function () {
        // 加载
        var mythis = this;
        wx.showLoading({
            title: '玩命加载中...',
        });
        mythis.data.page = mythis.data.page + 1;
        // 综合
        if (mythis.data.id == 0) {
            if (mythis.data.hasmore) {
                listNum(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis.data.voucherId, mythis);
            } else {
                mythis.setData({
                    state: 0
                })
                wx.hideLoading();
            }
        }
        // 上新
        if (mythis.data.id == 1) {
            if (mythis.data.hasmore) {
                uptoDate(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis)
            } else {
                mythis.setData({
                    state: 0
                })
                wx.hideLoading();

            }
        }
        // 关注
        if (mythis.data.id == 2) {
            if (mythis.data.hasmore) {
                followDate(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.pc_id, mythis.data.search_type, mythis)
            } else {
                mythis.setData({
                    state: 0
                })
                wx.hideLoading();
            }
        }
        // 价格
        if (mythis.data.id == 3) {
            if (mythis.data.hasmore) {
                priceDate(this.data.page, this.data.rows, mythis.data.keyword, mythis.data.sort, mythis.data.pc_id, mythis.data.search_type, mythis.data.min_price, mythis.data.max_price, mythis)
            } else {
                mythis.setData({
                    state: 0
                })
                wx.hideLoading();
            }
        }
        if (mythis.data.id == 4) {
            if (mythis.data.hasmore) {
                screenDate(mythis.data.page, mythis.data.rows, mythis.data.keyword, mythis.data.selectItems.join('|'), mythis.data.min_price, mythis.data.max_price, mythis)

            } else {
                mythis.setData({
                    state: 0
                })
                wx.hideLoading();
            }
        }


    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 用户点击右上角分享朋友圈
    onShareTimeline: function (res) {
        return {
            title: '',
            query: {
            },
            imageUrl: ''
        }
    }
})


//   综合
function listNum(page, rows, keyword, pc_id, search_type, voucherId, mythis) {
    let parms = {
        page: page,
        rows: rows,
        keyword: keyword,
        pc_id: pc_id,
        search_type: search_type,
        voucherId: voucherId
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/products_list', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            mythis.setData({
                listData: mythis.data.allProject,
            });
            var pcList = res.datas.pc_list
            for (let i = 0; i < pcList.length; i++) {
                pcList[i]['select'] = false;
            }
            mythis.setData({
                pcList: res.datas.pc_list,
                pcList1: res.datas.pc_list
            });
            var hasmore = res.datas.hasmore
            mythis.setData({
                hasmore: res.datas.hasmore,
                hide: true,
            })
            wx.hideLoading();

        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duartion: 1000
            })
        })

}
// 上新
function uptoDate(page, rows, keyword, pc_id, search_type, mythis) {
    let parms = {
        page: page,
        rows: rows,
        keyword: keyword,
        pc_id: pc_id,
        search_type: search_type,
        order: 3,
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/products_list', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            mythis.setData({
                listData: mythis.data.allProject,
                hasmore: res.datas.hasmore,
                state: 1,
                hide: true,
            });
            wx.hideLoading();
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duartion: 1000
            })
        })

}
// 关注
function followDate(page, rows, keyword, pc_id, search_type, mythis) {
    let parms = {
        page: page,
        rows: rows,
        keyword: keyword,
        pc_id: pc_id,
        search_type: search_type,
        order: 2,
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/products_list', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            mythis.setData({
                listData: mythis.data.allProject,
                hasmore: res.datas.hasmore,
                state: 1,
                hide: true,
            })
            wx.hideLoading();

        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duartion: 1000
            })
        })

}
// 价格
function priceDate(page, rows, keyword, sort, pc_id, search_type, min_price, max_price, mythis) {
    let parms = {
        page: page,
        rows: rows,
        keyword: keyword,
        sort: sort,
        pc_id: pc_id,
        search_type: search_type,
        min_price: min_price,
        max_price: max_price,
        order: 4,
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/products_list', parms, (res) => {
        for (var i = 0; i < res.datas.products_list.length; i++) {
            mythis.data.allProject.push(res.datas.products_list[i]);
        }
        mythis.setData({
            listData: mythis.data.allProject,
            hasmore: res.datas.hasmore,
            state: 1,
            hide: true,
        });
        wx.hideLoading();

    }, (err) => {
        wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duartion: 1000
        })
    })

}
// 筛选
function screenDate(page, rows, keyword, _num, min_price, max_price, mythis) {
    let parms = {
        page: page,
        rows: rows,
        keyword: keyword,
        // 最低价
        pc_id: _num,
        min_price: min_price,
        // 最高价格
        max_price: max_price,
        search_type: 2
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/products_list', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            mythis.setData({
                listData: mythis.data.allProject,
                hasmore: res.datas.hasmore,
                state: 1,
                hide: true,
            })
            wx.hideLoading();
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duartion: 1000
            })
        })

}