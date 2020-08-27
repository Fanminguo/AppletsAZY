// pages/shopHome/videoWhole/videoWhole.js
var app = getApp();
var productsId;
import navigateTo from "../../../utils/navigateRoute.js"
const util = require('../../../utils/util.js')
var http = require('../../../utils/httputils.js');
import QRCode from '../../../utils/weapp-qrcode.js';
Page({


    /**
     * 页面的初始数据
     */
    data: {
        windowHeight: 0,
        screenHeight: 0,
        fullscreen: true,
        lastTapTime: 0,
        addClasee: false,
        play: false,
        sliderValue: 0, //控制进度条slider的值，
        updateState: false, //防止视频播放过程中导致的拖拽失效
        controls: false,
        playState: true,
        animationShow: false,
        page: 1,
        an: "", //商品列表弹窗
        an1: "", //商品规格弹窗
        num: 1, // 数量初始化1
        products_map_spec: [], //规格
        chooseText: "默认", //已选择文案
        live: false,
        hide: false,
        loop: true,
        home: 0,
        follow: false,
        // status:2
        SearchText: '订阅直播',
        hideCanvas: false,
        shareHide: false,
        posetrCodeUrl: "",//二维码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.q) {
            let queryAll = decodeURIComponent(options.q);
            let store_id = gup('store_id', queryAll);
            let notice_id = gup('notice_id', queryAll);
            let agent_code = gup('agent_code', queryAll);
            this.setData({
                store_id: store_id,
                notice_id: notice_id,
                agent_code: agent_code,
                posetrCodeUrl: 'https://bj.aizhiyi.com/notice/?store_id=' + store_id + '&agent_code=' + agent_code + '&notice_id=' + notice_id
            })
            console.log(1)
        } else {
            console.log(2)
            this.setData({
                store_id: options.store_id,
                notice_id: options.notice_id,
                agent_code: options.agent_code,
                home: options.home,
                posetrCodeUrl: 'https://bj.aizhiyi.com/notice/?store_id=' + options.store_id + '&agent_code=' + options.agent_code + '&notice_id=' + options.notice_id
            })
        }
        // 关联好友
        if (this.data.agent_code) {
            this.getFriend(this.data.agent_code);
        }
        // 购物车数量
        this.noticeData()
        this.shopName()
        this.code()
    },
    // 店铺
    goHome: function () {
        wx.redirectTo({
            url: '../shopHome?store_id=' + this.data.store_id
        })
    },
    // 店铺信息
    shopName: function () {
        var that = this
        let parms = {
            store_id: that.data.store_id,
            key: wx.getStorageSync('key')
        }
        http.postRequest(app.globalData.apiUrl + '/cli/store/store_info', parms,
            (res) => {
                that.setData({
                    follow: res.datas.store_info.is_favorate,
                });
                if (that.data.follow) {
                    that.setData({
                        SearchText: '已订阅'
                    })
                } else {
                    that.setData({
                        SearchText: '订阅直播'
                    })
                }
                if (res.invitationCode) {
                    wx.setStorageSync('agent_code', res.invitationCode);
                }
                wx.hideLoading();
            }, (err) => {

            })

    },
    // goLive: function () {
    //     var that = this
    //     navigateTo('../../live/live/live?store_id='+that.data.store_info.store_id+'&is_share=yes'+"&notice_id="+that.data.anchornotice_info.notice_id)
    // },
    //预告
    noticeData: function () {
        let that = this
        let parms = {
            store_id: that.data.store_id,
            notice_id: that.data.notice_id,
            cust_id: wx.getStorageSync('cust_id')
        }
        http.postRequest(app.globalData.apiUrl + '/cli/Products/live_data', parms,
            (res) => {
                that.setData({
                    anchornotice_time: res.datas.anchornotice_info.anchornotice_info,
                    anchornotice_info: res.datas.anchornotice_info,
                    store_info: res.datas.store_info,
                    products_basket_count: res.datas.products_basket_count,
                    status: res.datas.anchornotice_info.status,
                    formatTwo:util.formatTimeTwo( res.datas.anchornotice_info.notice_start_time, ' M月'+'D日 h:m 开播')
                })
                // let sjc = this.data.anchornotice_info.notice_start_time
                // console.log(util.formatTimeTwo(this.data.anchornotice_info.notice_start_time, 'M月'+'D日 h点:m 开播');
                // console.log(util.formatTime(this.data.anchornotice_info.notice_start_time, 'h:m'));
                if (res.datas.is_online) {
                    that.setData({
                        hide: false,
                    })
                } else {
                    that.setData({
                        hide: true,
                    })
                }
                if (res.datas.is_online) {
                    wx.redirectTo({
                        url: '../../live/live/live?store_id=' + that.data.store_info.store_id + '&is_share=yes' + "&notice_id=" + that.data.anchornotice_info.notice_id
                    })
                } else if (that.data.status == 2) {
                    wx.redirectTo({
                        url: '../videoWhole/videoWhole?store_id=' + that.data.store_info.store_id + "&notice_id=" + that.data.anchornotice_info.notice_id + '&home=' + 2
                    })
                }
                else if (that.data.status == 3) {
                    wx.redirectTo({
                        url: '../shopHome/shopHome?store_id=' + that.data.store_info.store_id + "&id=2" + '&home=' + 2
                    })
                }

                // 倒计时
                function grouptime() {
                    var day = 0,
                        hour = 0,
                        minute = 0,
                        second = 0;
                    var nowTime = Date.parse(new Date()) / 1000
                    var endTime = that.data.anchornotice_info.notice_start_time
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
                        that.setData({
                            anchornotice_time: str
                        })
                    } else {
                        var str = "已结束,去看精彩回放";
                        that.setData({
                            anchornotice_time: str
                        })
                        clearInterval(timer);
                    }
                }
                grouptime();
                var timer = setInterval(grouptime, 1000);
                // 扫描二维码  并且已经开播

            }, (err) => {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 1500
                })
            })
    },

    gocart: function () {
        navigateTo('../../cart/cart')
    },
    // 加入购物车
    joincart: function () {
        app.join_cart(this.data.products_id, this.data.num);
        this.setData({
            an1: "down",
        })
        this.getCartNum()
    },
    // 立即购买
    gobuy: util.throttle(function (e) {
        navigateTo('../../buy/buy?products_id=' + productsId + '&buynum=' + this.data.num + "&gdID=" + productsId)
    }, 3000),
    // 暂停
    doubleClick: function (e) {
        let diffTouch = this.touchEndTime - this.touchStartTime;
        let curTime = e.timeStamp;
        let lastTime = this.lastTapDiffTime;
        this.lastTapDiffTime = curTime;

        //两次点击间隔小于300ms, 认为是双击
        let diff = curTime - lastTime;
        if (diff < 300) {
            if (!this.data.addClasee) {
                this.setData({
                    addClasee: true
                })
            } else {
                this.setData({
                    addClasee: false
                })
            }

        } else {
            this.changePlayStatus();
        }
    },
    changePlayStatus() {
        let playState = !this.data.playState
        if (!this.data.waiting) {
            if (playState) {
                this.videoContext.play()
            } else {
                this.videoContext.pause()
            }
            this.setData({
                playState: playState
            })
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.videoContext = wx.createVideoContext('videoplayer', this);
        this.setData({
            updateState: true,
            topHeight: wx.getMenuButtonBoundingClientRect().top
        })
    },
  
    //购物车数量
    getCartNum: function () {
        var that = this
        wx.request({
            url: app.globalData.apiUrl + '/cli/CustCart/cart_count1',
            method: "POST",
            header: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
                key: wx.getStorageSync('key')
            },
            data: {
                key: wx.getStorageSync('key')
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    that.setData({
                        caetNum: res.data.datas.cart_count,
                    });
                }
            },
            complete: function () {

            }
        });
    },
    //播放条时间改表触发
    videoUpdate(e) {
        if (this.data.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
            let sliderValue = e.detail.currentTime / e.detail.duration * 100;
            this.setData({
                sliderValue: sliderValue,
                duration: e.detail.duration
            })
        }
    },
    sliderChanging(e) {
        this.videoContext.pause()
        wx.showLoading({
            title: '加载中...'
        })
        this.setData({
            updateState: false //拖拽过程中，不允许更新进度条
        })
    },
    //拖动进度条触发事件
    sliderChange(e) {
        if (this.data.duration) {
            this.videoContext.seek(e.detail.value / 100 * this.data.duration); //完成拖动后，计算对应时间并跳转到指定位置
            this.setData({
                sliderValue: e.detail.value,
                updateState: true //完成拖动后允许更新滚动条
            })
            this.videoContext.play()
        }
    },
    bindplay: function () {
        setTimeout(function () {
            wx.hideLoading()
        }, 600)


    },
    bindwaiting: function () {
        this.videoContext.play()
    },
      // 引入海报banner
    // 生成二维码   店铺
    code: function (e) {
        var that = this
        console.log(that.data.posetrCodeUrl)
        new QRCode('myQrcode', {
            text: that.data.posetrCodeUrl,
            // text:'https://bj.aizhiyi.com/notice/?store_id=331&agent_code=CUU1Q0L&notice_id=828',
            width: 77,
            height: 77,
            padding: 1, // 生成二维码四周自动留边宽度，不传入默认为0
            // correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
            callback: (res) => {
                that.setData({
                    hide: true,
                    posetrCodeUrl: res.path
                })
                
                console.log(res.path)
            }
        })
    },
    // 保存海报
    saveimg: function () {
        this.canvas = this.selectComponent("#canvas-demo"); //组件的id
        this.saveimg()
    },
    // 保存海报
    saveimg() {
        this.canvas.saveimg(); //
        this.setData({
            hideCanvas: false,
            shareHide: false
          })
    },
    // 关闭
    shareturn: function () {
        this.setData({
            hideCanvas: false,
            shareHide: false
        })
        wx.hideLoading()
    },
    // 展示海报
    shareShow: function () {
        this.setData({
            hideCanvas: true,
            shareHide: true
        })
        this.canvas = this.selectComponent("#canvas-demo"); //组件的id
        this.adaptation()
    },
    // 适配
    adaptation() {
        // 画canvas所需要的数据
        // posetrCodeUrl页面二维码
        // type= 1回放 2= 预告 3 = 直播
        // kf_qr_img  客服二维码
        // transverse_notice_image   海报banner
        // store_name店铺名称
        // store_avatar 店铺头像
        // store_collect  粉丝数量
        // notice_title 标题
        // cust_nickname分享人
        // cust_avatar  分享人头像
        // fans 观看人数
        // item 开播时间

        this.canvas.adaptation(this.data.posetrCodeUrl, 2, this.data.anchornotice_info.kf_qr_img, this.data.anchornotice_info.transverse_notice_image, this.data.store_info.store_name, this.data.store_info.store_avatar, this.data.store_info.store_collect, this.data.anchornotice_info.notice_title, this.data.anchornotice_info.cust_nickname, this.data.anchornotice_info.cust_avatar, '', this.data.formatTwo);
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
    gostatus: function () {
        var that = this
        if (that.data.status == 1) {
            that.gostatus1()
        }
    },
    gostatus1: function () {
        var that = this
        wx.showModal({
            title: '',
            content: '直播结束',
            cancelText: '取消',
            confirmText: '进店逛逛',
            success(res) {
                if (res.cancel) {

                } else if (res.confirm) {
                    wx.redirectTo({
                        url: '../shopHome?store_id=' + that.data.store_info.store_id + "&id=" + 2
                    })
                }
            }
        })
    },

    // 关注店铺
    menuClick: function () {
        var that = this;
        if (wx.getStorageSync('key')) {
            if (that.data.follow) {
                this.setData({
                    follow: false,
                    SearchText: "订阅直播",
                })
                that.cancelhops()
                // 关注接口
            } else {
                this.setData({
                    follow: true,
                    SearchText: "已订阅",
                    // 取关接口
                })
                that.payashops()

            }
        } else {
            navigateTo("../../getUserInfo/getUserInfo")
        }


    },
    // 取消关注店铺
    cancelhops() {
        var that = this
        let parms = {
            store_id: that.data.store_id,
            key: wx.getStorageSync('key'),
        }
        http.postRequest(app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_del", parms, (res) => {
            wx.showModal({
                title: '',
                content: '取消后，将不能收到直播提醒',
                confirmText: "知道了",
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }, (err) => {
            wx.showToast({
                icon: "none",
                title: err.datas.error,
                duration: 1000
            })
        })

    },
    // 关注店铺
    payashops() {
        var that = this
        let parms = {
            store_id: that.data.store_id,
            key: wx.getStorageSync('key'),
        }
        http.postRequest(app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_add", parms,
            (res) => {
                wx.showModal({
                    title: '',
                    content: '订阅成功，一定要来看哦~',
                    confirmText: "知道了",
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                })

            }, (err) => {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 1000
                })
            })

    },
    //关联好友
    getFriend: function (agent_code) {
        let prams = {
            agent_code: agent_code,
            share_style: "share_common",
            key: wx.getStorageSync('key')
        }
        http.getRequest(app.globalData.apiUrl + '/cli/Index/share2', prams,
            (res) => {

            },
            (err) => {

            })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // var url = 'pages/shopHome/videoWhole/videoWhole?uri=' + this.data.vedioUrl + "&name=" + this.data.name + "&agent_code=" + wx.getStorageSync('agent_code')
        var url = 'pages/shopHome/videoNotice/videoNotice?notice_id=' + this.data.anchornotice_info.notice_id + '&store_id=' + this.data.store_info.store_id + "&agent_code=" + wx.getStorageSync('agent_code')
        var title = this.data.anchornotice_info.notice_title
        var imageUrl = this.data.anchornotice_info.transverse_notice_image
        this.setData({
            hideCanvas: false,
            shareHide: false
          })
        return {
            title: title,
            path: url,
            imageUrl: imageUrl
        }
    },
    // 弹出商品列表
    shoplist: function (e) {
        var that = this;
        var store_id = e.currentTarget.dataset.store_id
        var notice_id = e.currentTarget.dataset.notice_id
        that.queryGoodsList(store_id, notice_id)
        that.setData({
            an: "up"
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
    // 退出
    byeReturn: function () {
        var that = this;
        // if (that.data.live) {
        //     wx.redirectTo({
        //         url: '../shopHome?store_id=' + that.data.store_id
        //     })
        // } else {
        // setTimeout(function () {
        //     wx.navigateBack({
        //         delta: 1, 
        //     });
        // }, 500)
        if (that.data.home == 1) {
            wx.navigateBack({
                delta: 1,
            });
        } else {
            wx.redirectTo({
                url: '../shopHome?store_id=' + that.data.store_id
            })
        }

        // }
    },
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
            }, (err) => {
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

})
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
// 取消关注
function cancelhops(store_id, key, that) {
    let parms = {
        store_id: store_id,
        key: key,
    }
    http.postRequest(app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_del", parms, (res) => {


    }, (err) => {
        wx.showToast({
            icon: "none",
            title: err.datas.error,
            duration: 1000
        })
    })

}
// 关注店铺
function payashops(store_id, key, that) {
    let parms = {
        store_id: store_id,
        key: key,
    }
    http.postRequest(app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_add", parms,
        (res) => {

        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000
            })
        })

}
