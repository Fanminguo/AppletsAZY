// pages/shopHome/shopHome.js
var app = getApp();
var key = wx.getStorageSync('key')
var productsId;
import navigateTo from "../../utils/navigateRoute.js"
const util = require('../../utils/util.js')
var http = require('../../utils/httputils.js');
const utilclick = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        exhibi: false,
        isHide: true, //评论弹出框
        moreHide: false, //更多评论
        id: '0',
        scrollLeft: 0,
        hiddenText: true, //点赞数
        daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png", //点赞图片
        heartsrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/1802ccdda4bce736aee0ea161263a7f.png", //点赞图片 
        SearchText: '关注', //按钮变动值
        currentTab: 0, // tab切换  
        allProject: [], //全部商品
        allpinglun: [],
        contentThree: [],
        page: 1,
        rows: 10,
        num: 4,
        comment_false: false,
        huifangList: [],
        addReviewText: "一更多评论",
        addReviewHasmore: true,
        mentListThree: [],
        state: 1,
        typeList: [{
            categoryId: 1,
            categoryName: "店铺动态"
        }, {
            categoryId: 2,
            categoryName: "直播回放"
        },],
        commentText: '',
        userInfo: {
            avatarUrl: "", //用户头像
            nickName: "", //用户昵称
        },
        an: "", //商品列表弹窗
        an1: "", //商品规格弹窗
        num: 1, // 数量初始化1
        products_map_spec: [], //规格
        chooseText: "默认", //已选择文案
        yugaoList: [], //直播预告
        controls: false,
        fullscreen: false,
        parent_respond_commentid: ''
    },
    // 显示追评
    display: function (e) {
        var mythis = this;
        mythis.setData({
            comment_id: e.currentTarget.dataset.id,
            content: [],
            contentThree: [],
            page: 1
        })
        for (var j = 0; j < mythis.data.mentList.length; j++) {
            mythis.data.mentList[j].exhibi = false;
            if (mythis.data.comment_id == mythis.data.mentList[j].comment_id) {
                mythis.data.mentList[j].exhibi = true;
            }
        }
        mythis.setData({
            mentList: mythis.data.mentList,
        })
        var rows = 3
        addReview(mythis.data.comment_id, mythis.data.key, mythis.data.page, rows, mythis)
    },
    // 更多追评
    addReview: function (e) {
        var mythis = this;
        if (!mythis.data.addReviewHasmore) {
            mythis.setData({
                comment_id: e.currentTarget.dataset.id,
            })
            for (var j = 0; j < mythis.data.mentList.length; j++) {
                if (mythis.data.comment_id == mythis.data.mentList[j].comment_id) {
                    mythis.data.mentList[j].exhibi = false;
                }
            }
            mythis.setData({
                addReviewText: "一收起",
                mentList: mythis.data.mentList
            })
        } else {
            mythis.setData({
                addReviewText: "一更多评论"
            })
            mythis.data.page = mythis.data.page + 1;
            addReview(mythis.data.comment_id, mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
        }
    },
    // 写评论时，输入框内输入内容有变化时触发
    setCommentText: function (val) {
        this.setData({
            commentText: val.detail.value
        })
    },
    // 追评
    longPress: function (e) {
        var mythis = this;
        if (e.currentTarget.dataset.numid) {
            mythis.setData({
                parent_respond_commentid: e.currentTarget.dataset.numid
            })

        }
        mythis.setData({
            cust_id: e.currentTarget.dataset.num,
            respond_comment_id: e.currentTarget.dataset.id,
            newName: e.currentTarget.dataset.name,
            comments_type: e.currentTarget.dataset.index,

        })
    },
    // 提交评论，点击输入键盘的完成按钮时触发
    commentConfirm: utilclick.throttle(function (e) {
        var mythis = this;

        if (wx.getStorageSync('key')) {
            // 追评
            if (mythis.data.respond_comment_id) {
                mythis.setData({
                    respond_to_comments: 1,
                })
                release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, mythis.data.key, mythis.data.comments_type, mythis)
            } else {
                // 评论
                mythis.setData({
                    respond_to_comments: 0,
                })
                release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, mythis.data.key, mythis.data.comments_type, mythis)
                mythis.setData({
                    comment_id: ''
                })
            }
        } else {
            navigateTo('../getUserInfo/getUserInfo')
        }
    }, 500),

    // 跳转视频
    goData: function (e) {
        var products_commonid = e.currentTarget.dataset.id
        var products_id = e.currentTarget.dataset.index
        var index = e.currentTarget.dataset.key
        navigateTo('/pages/video_detail/video_detail?products_commonid=' + products_commonid + "&products_id=" + products_id + "&index=" + index + "&type=shopHome&list=" + encodeURIComponent(JSON.stringify(this.data.allProject)))
    },
    govideo: function (e) {
        var products_commonid = e.currentTarget.dataset.products_commonid;
        var products_id = e.currentTarget.dataset.products_id;
        var index = e.currentTarget.dataset.index;
        if (e.currentTarget.dataset.products_video) {
            navigateTo('../video_detail/video_detail?products_commonid=' + products_commonid + '&products_id=' + products_id + "&index=" + index + "&type=shopHome2&list=" + encodeURIComponent(JSON.stringify(this.data.dynamicData)))
        } else {
            navigateTo('../commodity/commodity?products_id=' + e.currentTarget.dataset.products_id)
        }
    },
    // 点击隐藏评论
    quxiao: function () {
        this.setData({
            isHide: true,
            newName: '',
            mentList: [],
            page: 1,
            products_commonid: '',
            mentListThree: [],
            comment_text: '',
            comment_false: false
        })
    },
    // 加载更多
    moreList: function () {
        var mythis = this;
        mythis.data.page = mythis.data.page + 1
        if (mythis.data.hideHasmore) {
            comment(mythis.data.products_commonid, mythis.data.page, mythis.data.rows, mythis.data.key, mythis)
        } else {
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 1000
            })
        }
    },
    // 点击评论显示
    pinglun: function (e) {
        var mythis = this;
        mythis.setData({
            products_commonid: e.currentTarget.dataset.id,
            isHide: false,
            page: 1,
        })
        comment(mythis.data.products_commonid, mythis.data.page, mythis.data.rows, mythis.data.key, mythis)

    },

    // tab切换
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current,
            })
        }
    },
    //切换调用接口
    switchNav: function (e) {
        const {
            offsetLeft
        } = e.currentTarget;
        const {
            id,
            index
        } = e.currentTarget.dataset;
        var clientX = e.detail.x;
        //tab切换时停止视频播放
        var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex);
        videoContextPrev.stop();
        //将当前播放视频、音频的index设置为空
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
        var mythis = this;
        mythis.setData({
            listData: [],
            allProject: [],
            huifangList: [],
            page: 1,
            hasmore: true,
            musicIndex: null,
            videoIndex: null,
        });
        if (id == '0') {
            if (mythis.data.hasmore) {
                commList(mythis.data.key, mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
            }
        }
        if (id == '1') {
            if (mythis.data.hasmore) {
                dynamic(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
            }
        }
        if (id == '2') {
            if (mythis.data.hasmore) {
                huifang(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
            }
        }
    },
    goCust: function (e) {
        app.join_cart(e.currentTarget.dataset.id, 1)
    },
    // 弹出商品列表
    shoplist: function (e) {
        var that = this;
        that.setData({
            page: '1'
        })
        var store_id = that.data.store_id
        var notice_id = e.currentTarget.dataset.notice_id
        that.queryGoodsList(store_id, notice_id)
        that.setData({
            an: "up",
        })
    },
    // 关闭商品列表
    clsoelist: function () {
        var that = this;
        that.setData({
            an: "down"
        })
    },
    queryGoodsList: function (store_id, notice_id) {
        wx.showLoading({
            title: '请稍后...',
            mask: true
        });
        var that = this;
        let parms = {
            key: wx.getStorageSync('key'),
            store_id: store_id,
            notice_id: notice_id,
            page: that.data.page,
            rows: 20,

        }
        http.getRequest(app.globalData.apiUrl + "/cli/Products/products_basket_list", parms,
            (res) => {
                wx.hideLoading()
                that.setData({
                    goodsList: res.datas
                })
            }, (err) => {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 1000
                })
            })

    },
    //   加入购物车
    getgoods: function (e) {
        var that = this;
        var products_id = e.currentTarget.dataset.products_id;
        that.choosegoods(products_id);
        productsId = products_id;
        that.setData({
            an1: "up"
        })
    },
    //关闭背景
    closebj: function () {
        if (this.data.an1 == "up") {
            this.setData({
                an1: "down"
            })
        } else {
            this.setData({
                an: "down"
            })
        }
    },
    //弹出规格e
    getgoods: function (e) {
        var that = this;
        var products_id = e.currentTarget.dataset.products_id;
        that.choosegoods(products_id);
        productsId = products_id;
        that.setData({
            an1: "up"
        })
    },
    choosegoods: function (products_id) {
        wx.showLoading({
            title: '请稍后...',
            mask: true
        });
        var that = this; //把this对象复制到临时变量that
        let parms = {
            products_id: products_id,
            num: 3,
            key: wx.getStorageSync('key')
        }
        http.getRequest(app.globalData.apiUrl + '/cli/Products/products_detail', parms,
            (res) => {
                var data = res.datas;
                if (!data.products_info.spec_name.default) {
                    var products_map_spec = {};
                    for (var i in data.products_info.spec_name) {
                        var products_specs = {};
                        products_specs["products_spec_id"] = i;
                        products_specs['products_spec_name'] = data.products_info.spec_name[i];
                        if (data.products_info.spec_value) {
                            for (var vi in data.products_info.spec_value) {
                                if (i == vi) {
                                    var specs_value = [];
                                    for (var vvi in data.products_info.spec_value[vi]) {
                                        var value = {};
                                        value["specs_value_id"] = vvi;
                                        value["specs_value_name"] = data.products_info.spec_value[vi][vvi];
                                        if (data.products_info.products_spec.hasOwnProperty(vvi)) {
                                            value["isClick"] = 1;
                                        } else {
                                            value["isClick"] = 0;
                                        }
                                        specs_value.push(value);
                                    };
                                    products_specs['products_spec_value'] = specs_value; //问题在这

                                }
                            };
                        } else {
                            data.products_info.spec_value = [];
                        }
                        products_map_spec[i] = products_specs;
                    }

                    // 对象转成数组开始
                    var b = products_map_spec;
                    var goods_spec = []
                    for (let i in b) {
                        goods_spec.push(b[i]);
                    }
                    var text = "";
                    var curSpec = [];
                    for (let i = 0; i < goods_spec.length; i++) {
                        for (let j = 0; j < goods_spec[i].products_spec_value.length; j++) {
                            if (goods_spec[i].products_spec_value[j].isClick == "1") {
                                text += goods_spec[i].products_spec_value[j].specs_value_name + ",";
                            }
                        }
                    }

                    that.setData({
                        chooseText: text,
                    })
                    // 对象转成数组结束
                    that.setData({
                        products_map_spec: goods_spec,

                    })
                } else {
                    data.products_map_spec = [];
                }
                that.setData({
                    products_id: products_id,
                    imgUrls: res.datas.products_image.split(","),
                    goods_price: res.datas.products_info.products_price,
                    goods_detail: res.datas
                })
                wx.hideLoading()
            },
            (err) => {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 1000
                })
            })
    },
    selectGuige(e) {
        let that = this,
            // 获取第一个循环的index
            fuindex = e.currentTarget.dataset.fuindex,
            // 获取第二个循环的index
            chindex = e.currentTarget.dataset.chindex,
            guilists = {},
            // 对象转成数组方式一
            a = that.data.products_map_spec;
        var goods_spec = []
        for (let i in a) {
            goods_spec.push(a[i]);
        }
        // 通过循环来判断点击了哪一个规格，根据数据结构来；
        // goods_spec[fuindex]根据fuindex来判断点击了哪一种类型的规格

        for (let i = 0; i < goods_spec[fuindex].products_spec_value.length; i++) {
            // 当i等于当前点击的规格时，设置isClick=1
            if (i == chindex) {
                goods_spec[fuindex].products_spec_value[i].isClick = 1;
            }
            // 否则设置其他的isClick=0
            else {
                goods_spec[fuindex].products_spec_value[i].isClick = 0;
            }
            that.setData({
                products_map_spec: goods_spec,
            })
        }
        var text = "";
        var curSpec = [];
        for (let i = 0; i < goods_spec.length; i++) {
            for (let j = 0; j < goods_spec[i].products_spec_value.length; j++) {
                if (goods_spec[i].products_spec_value[j].isClick == "1") {
                    curSpec.push(goods_spec[i].products_spec_value[j].specs_value_id);
                    text += goods_spec[i].products_spec_value[j].specs_value_name + ",";
                }
            }
        }
        that.setData({
            chooseText: text,
        })
        //多规格回去商品id
        var myData = {};
        myData["spec_list"] = that.data.goods_detail.spec_list;
        var spec_string = curSpec.sort(function (a, b) {
            return a - b;
        }).join("|");
        //获取商品ID
        var products_id = myData.spec_list[spec_string];
        this.choosegoods(products_id)
        productsId = products_id;
    },
    // 动态点赞
    daiClick: function (e) {
        var mythis = this;
        var index = e.currentTarget.dataset.curindex;
        if (wx.getStorageSync('key')) {
            if (this.data.dynamicData[index]) {
                var is_follw = this.data.dynamicData[index].is_favorate_products
                var products_id = e.currentTarget.dataset.id
                if (!is_follw) { //关注
                    var onum = this.data.dynamicData[index].products_collect
                    this.data.dynamicData[index].is_favorate_products = true;
                    this.data.dynamicData[index].products_collect = (onum + 1);
                    dongtaiGz(products_id, mythis.data.key, mythis)

                } else { //取消关注
                    var onum = this.data.dynamicData[index].products_collect
                    this.data.dynamicData[index].is_favorate_products = false;
                    this.data.dynamicData[index].products_collect = (onum - 1);
                    quxiaoGz(products_id, mythis.data.key, mythis)

                }
                this.setData({
                    dynamicData: this.data.dynamicData,

                })
            }
        } else {
            navigateTo('../getUserInfo/getUserInfo')
        }
    },

    // 评论列表点赞
    daimaiClick: function (e) {
        var mythis = this;
        var index = e.currentTarget.dataset.curindex;
        if (wx.getStorageSync('key')) {
            if (this.data.mentList[index]) {
                var hasChange = this.data.mentList[index].is_likes
                var comment_id = e.currentTarget.dataset.id;
                var comments_type = e.currentTarget.dataset.type;
                var products_commonid = e.currentTarget.dataset.video;
                if (hasChange == '0') {
                    var onum = this.data.mentList[index].like_num
                    this.data.mentList[index].like_num = (onum + 1);
                    this.data.mentList[index].is_likes = 1;
                    redheart(comment_id, mythis.data.key, comments_type, products_commonid, mythis)
                } else {
                    var onum = this.data.mentList[index].like_num
                    this.data.mentList[index].like_num = (onum - 1);
                    this.data.mentList[index].is_likes = 0;
                    cancelheart(comment_id, mythis.data.key, comments_type, products_commonid, mythis)
                }
                this.setData({
                    mentList: this.data.mentList,
                })
            } else {

                var hasChange = this.data.comment_text.is_likes
                var comment_id = e.currentTarget.dataset.id;
                var comments_type = e.currentTarget.dataset.type;
                var products_commonid = e.currentTarget.dataset.video;
                if (hasChange == '0') {
                    var onum = this.data.comment_text.like_num
                    this.data.comment_text.like_num = (onum + 1);
                    this.data.comment_text.is_likes = 1;
                    redheart(comment_id, mythis.data.key, comments_type, products_commonid, mythis)
                } else {
                    var onum = this.data.comment_text.like_num
                    this.data.comment_text.like_num = (onum - 1);
                    this.data.comment_text.is_likes = 0;
                    cancelheart(comment_id, mythis.data.key, comments_type, products_commonid, mythis)
                }
                this.setData({
                    comment_text: this.data.comment_text,
                })
            }
        } else {
            navigateTo('../getUserInfo/getUserInfo')
        }
    },
    swiperChange: function (e) {
        this.setData({
            currentTab: e.detail.current,
        })
    },
    /*** 生命周期函数--监听页面加载*/
    onLoad: function (options) {
        var mythis = this;

        if (!wx.getStorageSync('key')) {
            app.login()
        }
        let isIphoneX = app.globalData.isIphoneX;
        mythis.setData({
            isIphoneX: isIphoneX,
            id: options.id,
            key: wx.getStorageSync('key'),
            store_id: options.store_id,
            agent_code: options.agent_code,
            is_back: options.is_back
        })
        if (mythis.data.agent_code) {
            mythis.getFriend(this.data.agent_code);
        }
        shopName(mythis.data.store_id, mythis.data.key, mythis)
        if (mythis.data.id == 1) {
            dynamic(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)

        } else if (mythis.data.id == 2) {
            huifang(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
        } else {
            mythis.setData({
                id: 0
            })
            commList(mythis.data.key, mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
        }
        wx.getNetworkType({
            success: function (res) {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                mythis.setData({
                    networkType: res.networkType
                })
            }
        })
    },
    getAddInfo(e) {
        var mythis = this
        wx.getNetworkType({
            success: function (res) {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                mythis.setData({
                    networkType: res.networkType
                })
            }
        })
        console.log(e.detail)//{title:'测试',money:8,category:'吃饭'} 
        console.log(this.data.id)
        // this.onLoad()
        shopName(mythis.data.store_id, mythis.data.key, mythis)
        if (mythis.data.id == 1) {
            dynamic(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)

        } else if (mythis.data.id == 2) {
            huifang(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
        } else {
            mythis.setData({
                id: 0
            })
            commList(mythis.data.key, mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
        }
    },
    //关联好友
    getFriend: function (agent_code) {
        var mythis = this
        let prams = {
            agent_code: mythis.data.agent_code,
            share_style: "share_common",
            key: wx.getStorageSync('key')

        }
        http.getRequest(app.globalData.apiUrl + '/cli/Index/share2', prams,
            (res) => {

            },
            (err) => {

            })
    },
    // 直播
    goList: function () {
        var that = this;
        // if (wx.getStorageSync('key')) {
        if (that.data.is_back) {
            wx.navigateBack({
                delta: 1,
            });
        } else {
            navigateTo('../live/live/live?store_id=' + this.data.store_id)
        }

        // } else {
        // navigateTo('../getUserInfo/getUserInfo')
        // }
    },

    // 获取滚动条当前位置
    onPageScroll: function (e) {
        var mythis = this;
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
    // 滑动
    scrollView: function (event) {
        var mythis = this;
        wx.showLoading({
            title: '玩命加载中...',
        });
        mythis.data.page = mythis.data.page + 1;
        if (mythis.data.id == 0) {
            if (mythis.data.hasmore) {
                commList(mythis.data.key, mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
            } else {
                wx.hideLoading();
            }

        } else if (mythis.data.id == 1) {
            if (mythis.data.hasmore) {
                dynamic(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
            } else {
                wx.hideLoading();
            }
        } else if (mythis.data.id == 2) {
            if (mythis.data.hasmore) {
                huifang(mythis.data.store_id, mythis.data.page, mythis.data.rows, mythis)
            } else {
                wx.hideLoading();
            }
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (index) {
        var mythis = this;
        shopName(mythis.data.store_id, key, mythis)
        mythis.getFriend(mythis.data.agent_code)
    },
    gobuy: util.throttle(function (e) {
        navigateTo('../buy/buy?products_id=' + productsId + '&buynum=' + this.data.num + "&gdID=" + productsId)
    }, 3000),
    /*点击加号*/
    bindPlus: function () {
        var num = this.data.num;
        num++;
        var minusStatus = num > 1 ? 'normal' : 'disable';
        this.setData({
            num: num,
            minusStatus: minusStatus
        })
    },
    /*点击减号*/
    bindMinus: function () {
        var num = this.data.num;
        if (num > 1) {
            num--;
        }
        var minusStatus = num > 1 ? 'normal' : 'disable';
        this.setData({
            num: num,
            minusStatus: minusStatus
        })
    },

    joincart: function () {
        app.join_cart(this.data.products_id, 1);
        this.setData({
            an1: "down",
        })
    },
    // 跳转全屏视频
    goHome: function (e) {
        var uri = e.currentTarget.dataset.uri
        var notice_id = e.currentTarget.dataset.notice_id
        var img = []
        img.push(e.currentTarget.dataset.img)
        if (uri) {
            navigateTo('./videoWhole/videoWhole?store_id=' + this.data.store_id + '&agent_code=' + wx.getStorageSync('agent_code') + '&notice_id=' + notice_id + '&home=' + 1)

        } else {
            wx.previewImage({
                // current: img, // 当前显示图片的http链接
                urls: img // 需要预览的图片http链接列表
            })
        }

    },
    // 跳转直播预告
    goNotice: function (e) {
        var store_id = e.currentTarget.dataset.store_id
        var notice_id = e.currentTarget.dataset.notice_id
        navigateTo('./videoNotice/videoNotice?store_id=' + store_id + '&notice_id=' + notice_id + "&home=" + 1)
    },

    // 收起关闭
    upDown(event) {
        var index = event.currentTarget.dataset['index'];
        this.data.huifangList[index].upStatus = !this.data.huifangList[index].upStatus;
        this.setData({
            huifangList: this.data.huifangList
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },
    // 分享朋友圈
    onShareTimeline: function (res) {
        return {
            title:this.data.shopName.store_brief_intro,
            query: {
                agent_code: this.data.agent_code,
            },
            imageUrl: this.data.shopName.store_avatar,
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () { },
    /**
     * 页面上拉触底事件的处理函数
     */
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        var mythis = this;
        if (e.from == 'button' && e.target.dataset.type != "store-share") {
            var url = 'pages/index/index?products_commonid=' + e.target.dataset.id + "&agent_code=" + wx.getStorageSync('agent_code')
            var title = e.target.dataset.num
            var imageUrl = e.target.dataset.index
        } else {
            var url = 'pages/shopHome/shopHome?store_id=' + mythis.data.store_id + "&agent_code=" + wx.getStorageSync('agent_code')
            var title = mythis.data.shopName.store_name
            var imageUrl = mythis.data.shopName.mb_title_img
        }

        return {
            title: title,
            path: url,
            imageUrl: imageUrl
        }

    },
    // 关注
    menuClick: function (e) {
        var mythis = this;
        if (wx.getStorageSync('key')) {
            if (mythis.data.follow) {
                this.setData({
                    follow: false,
                    SearchText: "已关注",
                })
                wx.setStorage({
                    key: 'shopHome',
                    data: mythis.data.store_id //及接收储图片或文件地址的变量
                })
                wx.setStorage({
                    key: 'HomeId',
                    data: false //及接收储图片或文件地址的变量
                })
                cancelhops(mythis.data.store_id, mythis.data.key, mythis)
                // 关注接口
            } else {
                this.setData({
                    follow: true,
                    SearchText: "关注",
                    // 取关接口
                })
                wx.setStorage({
                    key: 'shopHome',
                    data: mythis.data.store_id //及接收储图片或文件地址的变量
                })
                wx.setStorage({
                    key: 'HomeId',
                    data: true //及接收储图片或文件地址的变量
                })
                payashops(mythis.data.store_id, mythis.data.key, mythis)

            }
        } else {
            navigateTo("../getUserInfo/getUserInfo")
        }
    },

})

// 精彩回放

function huifang(store_id, page, rows, mythis) {
    let parms = {
        store_id: store_id,
        page: page,
        rows: rows,
        key: wx.getStorageSync('key'),
        type: 'playback'
    }
    http.postRequest(app.globalData.apiUrl + '/cli/Store/AnchorVideoList', parms,
        (res) => {
            for (var i = 0; i < res.datas.video_list.length; i++) {
                mythis.data.huifangList.push(res.datas.video_list[i]);
            }
            mythis.setData({
                store_name: res.datas.store_info.store_name,
                store_avatar: res.datas.store_info.store_avatar,
                store_intro: res.datas.store_info.store_intro,
                huifangList: mythis.data.huifangList,
                hasmore: res.datas.hasmore
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
// 追加评论列表
function addReview(comment_id, key, page, rows, mythis) {
    let parms = {
        comment_id: comment_id,
        key: key,
        page: page,
        rows: rows
    }
    http.getRequest(app.globalData.apiUrl + "/cli/CommentList/respond_to_comments", parms,
        (res) => {
            var contentOne = res.datas.respond_to_comments_list
            for (var i = 0; i < contentOne.length; i++) {
                mythis.data.contentThree.push(contentOne[i])
            }
            mythis.setData({
                content: mythis.data.contentThree,
                addReviewHasmore: res.datas.hasmore
            })
            if (!mythis.data.addReviewHasmore) {
                mythis.setData({
                    addReviewText: "一收起"
                })
            } else {
                mythis.setData({
                    addReviewText: "一更多评论"
                })
            }
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duartion: 1000
            })
        })

}

//店铺动态
function dynamic(store_id, page, rows, mythis) {
    let parms = {
        store_id: store_id,
        page: page,
        rows: rows,
        key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/Store/storeDynamic', parms,
        (res) => {
            for (var i = 0; i < res.datas.follow_info.data.length; i++) {
                mythis.data.allProject.push(res.datas.follow_info.data[i]);
            }
            var hasmore = res.datas.hasmore
            if (res.datas.anchor_info.news_type != undefined) {
                var yugaoList = []
                yugaoList.push(res.datas.anchor_info)
                mythis.setData({
                    yugaoList: yugaoList
                })
            }

            mythis.setData({
                yugaoJianman: res.datas.anchor_info,
                dynamicData: mythis.data.allProject,
                hasmore: res.datas.hasmore,
            });
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0
                })
            }
            // 倒计时
            function grouptime() {
                var day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0;
                var nowTime = Date.parse(new Date()) / 1000
                var endTime = mythis.data.yugaoTiem
                var intDiff = endTime - nowTime;
                if (intDiff > 0) { //转换时间
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

                    if (hour <= 9) hour = '0' + hour;
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    intDiff--;
                    var str = day + '天' + hour + '时' + minute + '分' + second + '秒'
                    mythis.setData({
                        groupTime: str
                    })
                } else {
                    var str = "00:00:00";
                    mythis.setData({
                        groupTime: str
                    })
                    clearInterval(timer);
                }
            }
            if (res.datas.anchor_info != null) {
                mythis.setData({
                    yugaoTiem: res.datas.anchor_info.notice_start_time
                })
            }
            grouptime();
            var timer = setInterval(grouptime, 1000);
            wx.hideLoading();
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}
// 关注店铺
function payashops(store_id, key, mythis) {
    let parms = {
        store_id: store_id,
        key: key,
    }
    http.postRequest(app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_add", parms,
        (res) => {
            mythis.data.shopName.store_collect += 1;
            mythis.setData({
                shopName: mythis.data.shopName
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}
// 动态取消点赞
function quxiaoGz(products_id, key, mythis) {
    let parms = {
        fav_id: products_id,
        key: key
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustFavorites/favorites_del', parms,
        (res) => {
            wx.showToast({
                icon: "none",
                title: "取消关注成功",
                duration: 1000
            })
        }, (err) => {
            wx.showToast({
                icon: "none",
                title: err.datas.error,
                duration: 1000
            })
        })

}
// 动态点赞
function dongtaiGz(products_id, key, mythis) {
    let parms = {
        products_id: products_id,
        key: key
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustFavorites/favorites_add', parms, (res) => {
        wx.showToast({
            icon: "none",
            title: "关注成功",
            duration: 1000
        })
    }, (err) => {
        wx.showToast({
            icon: "none",
            title: err.datas.error,
            duration: 1000
        })
    })
}
// 取消店铺
function cancelhops(store_id, key, mythis) {
    let parms = {
        store_id: store_id,
        key: key,
    }
    http.postRequest(app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_del", parms, (res) => {
        mythis.data.shopName.store_collect -= 1;
        mythis.setData({
            shopName: mythis.data.shopName
        })
    }, (err) => {
        wx.showToast({
            icon: "none",
            title: err.datas.error,
            duration: 1000
        })
    })

}
// 取消点赞
function cancelheart(comment_id, key, comments_type, products_commonid, mythis) {
    let parms = {
        comment_id: comment_id,
        key: key,
        comments_type: comments_type,
        products_commonid: products_commonid
    }
    http.postRequest(app.globalData.apiUrl + "/cli/Comment/delCustComment", parms,
        (res) => {

        }, (err) => {
            wx.showToast({
                icon: "none",
                title: err.datas.error,
                duration: 1000
            })
        })


}
//点赞  
function redheart(comment_id, key, comments_type, products_commonid, mythis) {
    let parms = {
        comment_id: comment_id,
        key: key,
        comments_type: comments_type,
        products_commonid: products_commonid
    }
    http.postRequest(app.globalData.apiUrl + "/cli/Comment/addCustComment", parms,
        (res) => { }, (err) => { })

}

// 发布评论
function release(parent_respond_commentid, commentText, products_commonid, respond_to_comments, respond_comment_id, cust_id, key, comments_type, mythis) {
    let parms = {
        parent_respond_commentid: parent_respond_commentid,
        comment_content: commentText,
        products_commonid: products_commonid,
        respond_to_comments: respond_to_comments,
        respond_comment_id: respond_comment_id,
        cust_id: cust_id,
        key: wx.getStorageSync('key'),
        comments_type: comments_type
    }
    http.postRequest(app.globalData.apiUrl + "/cli/Comment/addComment", parms,
        (res) => {
            wx.showToast({
                title: '评论成功！',
                icon: 'success',
                duration: 2000
            })
            if (!mythis.data.respond_comment_id) {
                mythis.setData({
                    avatar: wx.getStorageSync('avatar'),
                    comment_text: res.datas.comment_info,
                    comment_false: true,
                    commentText: ''
                })
            } else {
                mythis.setData({
                    mentList: [],
                    mentListThree: [],
                    commentText: '',
                    respond_comment_id: '',
                    cust_id: '',
                    newName: false,
                    page: 1,
                    comment_false: false,
                    comment_text: ''
                })
            }
            comment(mythis.data.products_commonid, mythis.data.page, mythis.data.rows, mythis.data.key, mythis)

        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })


}
// 评论 列表
function comment(products_commonid, page, rows, key, mythis) {
    let parms = {
        products_commonid: products_commonid,
        page: page,
        rows: rows,
        key: wx.getStorageSync('key'),
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CommentList/index', parms,
        (res) => {
            if (mythis.data.comment_false) {
                mythis.setData({
                    percentage: res.datas,
                })
            } else {
                var mentListOne = res.datas.comment_list;
                for (var i in mentListOne) {
                    mentListOne[i].exhibi = false;
                }
                for (var j = 0; j < mentListOne.length; j++) {
                    mythis.data.mentListThree.push(mentListOne[j])
                }
                var percentage = res.datas
                var hideHasmore = res.datas.hasmore
                mythis.setData({
                    mentList: mythis.data.mentListThree,
                    percentage: res.datas,
                    hideHasmore: res.datas.hasmore
                });
            }
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000,
            })


        }
    )
}

// 店铺信息
function shopName(store_id, key, mythis) {
    let parms = {
        store_id: store_id,
        key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/store/store_info', parms,
        (res) => {
            var shopName = res.datas.store_info;
            mythis.setData({
                shopName: res.datas.store_info,
                follow: res.datas.store_info.is_favorate,
                hide: true,
                store_collect: res.datas.store_info.store_collect
            });
            if (res.invitationCode) {
                wx.setStorageSync('agent_code', res.invitationCode);
            }
            wx.hideLoading();
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 2000,
                mask: true,
                success: function () {
                    setTimeout(function () {
                        //要延时执行的代码
                        wx.navigateBack({
                            delta: 1,
                        }); //

                    }, 2000) //延迟时间
                },
            })
        })

}
// 列表 全部商品
function commList(key, store_id, page, rows, mythis) {
    let parms = {
        key: wx.getStorageSync('key'),
        store_id: store_id,
        page: page,
        rows: rows
    }
    http.postRequest(app.globalData.apiUrl + '/cli/store/store_products', parms,
        (res) => {
            for (var i = 0; i < res.datas.products_list.length; i++) {
                mythis.data.allProject.push(res.datas.products_list[i]);
            }
            mythis.setData({
                listData: mythis.data.allProject,
                hasmore: res.hasmore,
                state: 1,
                hide: true
            });
            wx.hideLoading();
            if (!mythis.data.hasmore) {
                mythis.setData({
                    state: 0,
                })
            }
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000,
            })
        })

}
