// pages/detaCollage/detaCollage.js
const app = getApp();
const util = require('../../utils/util.js')
const key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js');
import navigateTo from "../../utils/navigateRoute.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        chooseSize: false, //是否显示选规格弹窗
        chooseSizeGroup: false, //是否显示团购选规格弹窗
        animationData: {},
        showVoucher: false,
        animationDataGroup: {},
        data: [],
        products_map_spec: [], //规格
        chooseText: "默认", //已选择文案
        userInfo: {
            avatarUrl: "", //用户头像
            nickName: "", //用户昵称
        },
        listData:[]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            navigateTo('../getUserInfo/getUserInfo')
        }
        mythis.setData({
            key: wx.getStorageSync('key')
        })
        let queryAll = decodeURIComponent(options.q);
        let id = gup('store_id', queryAll);
    
        if(gup('products_id', queryAll)){//扫码进来
            
            mythis.setData({
                order_id: gup('order_id', queryAll),
                products_id: gup('products_id', queryAll),
                groupbuy_hug: gup('groupbuy_hug', queryAll),
                order_sn:gup('order_sn', queryAll),
                groupbuy_request_type: gup('groupbuy_request_type', queryAll),
                groupbuy_hug_temp: gup('groupbuy_hug_temp', queryAll),
                agent_code: gup('store_id', queryAll),
                is_groupbuy_pay: gup('is_groupbuy_pay', queryAll),
            })
        }else{
            mythis.setData({
                order_id: options.order_id,
                products_id: options.products_id,
                groupbuy_hug: options.groupbuy_hug,
                order_sn: options.order_sn,
                groupbuy_request_type: options.groupbuy_request_type,
                groupbuy_hug_temp: options.groupbuy_hug_temp,
                agent_code: options.agent_code,
                is_groupbuy_pay:options.is_groupbuy_pay
            })
        }
       
        if (this.data.agent_code) {
            this.getFriend(this.data.agent_code);
        }
        if(mythis.data.is_groupbuy_pay != 'true'){
            mythis.setData({
                is_groupbuy_pay:''
            })
        }

        detailsColl(mythis.data.key, mythis.data.products_id, mythis.data.groupbuy_hug, mythis.data.groupbuy_request_type, mythis.data.groupbuy_hug_temp, mythis.data.is_groupbuy_pay, mythis.data.order_sn, mythis)

    },
    onshow: function () {
        if (this.data.agent_code) {
            this.getFriend(this.data.agent_code);
        }
        setTimeout(function () {
            if (!wx.getStorageSync('cust_mobile') && wx.getStorageSync('key')) {
                navigateTo('../bind_mobile/bind_mobile')
            }
        }, 500)
        if (this.data.agent_code) {
            this.getFriend(this.data.agent_code);
        }
    },
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
    hideVoucher: function () {
        this.setData({
            showVoucher: false
        })
    },

    // 分享
    onShareAppMessage: function (res) {
        if (res.from === 'button') { }
        return {
            title: "【拼团】还差" +this.data.groupbuy_detail.surplus_number+ "人成团,和我一起拼团抢购吧！",
            path: 'pages/detaCollage/detaCollage?products_id=' + this.data.products_id + "&groupbuy_hug=" + this.data.groupbuy_hug + "&order_sn=" + this.data.order_sn + "&groupbuy_request_type=" + this.data.groupbuy_request_type + "&groupbuy_hug_temp=" + this.data.groupbuy_hug_temp + "&order_id=" + this.data.order_id + "&agent_code=" + wx.getStorageSync('agent_code'),
            imageUrl: this.data.products[0],
            success: function (res) { }
        }
      
    },
    postvoucher_five: function () {
        let parms = {
            key: wx.getStorageSync('key'),
        }
        http.getRequest(app.globalData.apiUrl + '/cli/FreeGroupbuy/groupbuy_send_five_qualified', parms,
            (res) => {
            }, (err) => {
                wx.showToast({
                    icon: "none",
                    title: err.datas.error,
                    duration: 1000
                })
            })
    },
    goData:function(e){
        var video_name = e.currentTarget.dataset.name
        var products_id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.key
        //   var index = 
        if (video_name != null) {
            var products_commonid = e.currentTarget.dataset.index
            navigateTo('/pages/video_detail/video_detail?products_commonid=' + products_commonid + '&products_id=' + products_id + '&type=prodList' + "&index=" + index + "&list=" + encodeURIComponent(JSON.stringify(this.data.listData)))
        } else {
            navigateTo('/pages/commodity/commodity?products_id=' + products_id)
        }
    },
   
    //跳转支付页面前的执行接口
    gobefore: function () {
        var that = this;
        var parms = {};
        if (that.data.data.isgroupbuy) {
            parms.groupbuy_number = that.data.choose_num;
        }
        parms.groupbuy_type = 'participation';
        parms.cart_id = that.data.products_id + "|" + 1;
        parms.key = wx.getStorageSync('key');
        parms.groupbuy_number = that.data.groupbuy_detail.group_type;
        parms.groupbuy_hug = that.data.groupbuy_detail.groupbuy_hug;
        parms.gdID = that.data.products_id
        http.postRequest(app.globalData.apiUrl + '/cli/CustBuy/order_confirm',parms,
        (res)=>{
            navigateTo('../buy/buy?products_id=' + that.data.products_id + '&buynum=' + 1 + "&gdID=" + that.data.products_id)
        },(err)=>{
            wx.showToast({
                icon: "none",
                title: err.datas.error,
                duration: 1000
            })
        })
        
    },
    // 购买
    gobuy: util.throttle(function (e) {
        this.gobefore()
    }, 3000),
    // 拼团选择弹窗人数
    chooseGroup: function (e) {
        if (wx.getStorageSync('key')) {
            // 用that取代this，防止不必要的情况发生
            var that = this;
            // 创建一个动画实例
            var animation = wx.createAnimation({
                // 动画持续时间
                duration: 800,
                // 定义动画效果，当前是匀速
                timingFunction: 'linear'
            })
            // 将该变量赋值给当前动画
            that.animation = animation
            // 先在y轴偏移，然后用step()完成一个动画
            animation.translateY(800).step()
            // 用setData改变当前动画
            that.setData({
                // 通过export()方法导出数据
                animationDataGroup: animation.export(),
                // 改变view里面的Wx：if
                chooseSize: true,
                groupbuy: true

            })
            // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
            setTimeout(function () {
                animation.translateY(0).step()
                that.setData({
                    animationDataGroup: animation.export()
                })
            }, 200)
        } else {
            navigateTo('../getUserInfo/getUserInfo')
        }
    },



    // 隐藏
    hideModal: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 800,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(800).step()
        that.setData({
            animationData: animation.export(),
            animationDataGroup: animation.export()

        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export(),
                animationDataGroup: animation.export(),
                chooseSize: false,
                chooseSizeGroup: false
            })
        }, 200)
    },
    // 规格切换
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
        myData["spec_list"] = that.data.data.spec_list;
        var spec_string = curSpec.sort(function (a, b) {
            return a - b;
        }).join("|");
        //获取商品ID
        var products_id = myData.spec_list[spec_string];
        this.setData({
            products_id: products_id
        })
        detailsColl(this.data.key, this.data.products_id, this.data.groupbuy_hug, this.data.groupbuy_request_type, this.data.groupbuy_hug_temp, this.data.is_groupbuy_pay, this.data.order_sn, this)
    },

    goList: function (e) {
        var mythis = this;
        navigateTo("/pages/groupOrder/groupOrder")
    },
    // 更多拼团
    goListOrder: function () {
        navigateTo("/pages/groupOrder/groupList/groupList")
    },
    // goVideo: function () {
    //     var mythis = this;
    //     navigateTo("/pages/video_detail/video_detail?products_commonid=" + mythis.data.products_commonid2 + "&products_id=" + mythis.data.products_id)
    // }
})

function detailsColl(key, products_id, groupbuy_hug, groupbuy_request_type, groupbuy_hug_temp, is_groupbuy_pay, order_sn, mythis) {
    let parms = {
        key: key,
        products_id: products_id,
        groupbuy_hug: groupbuy_hug,
        groupbuy_request_type: groupbuy_request_type,
        groupbuy_hug_temp: groupbuy_hug_temp,
        is_groupbuy_pay: is_groupbuy_pay,
        order_sn: order_sn
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/groupbuy_detail_info', parms,
        (res) => {
            // 商品信息  img
            var color_id = parseInt(res.datas.products_info.color_id)
            var products = res.datas.products_image.split(",");
            mythis.setData({
                groupbuy_hug: res.datas.groupbuy_detail.groupbuy_hug,
                products: products, //图片
                products_info: res.datas.products_info, //商品信息
                // products_commonid2: res.datas.products_info.groupbuy_hug_info.products_commonid2, //视频id
                // products_spec: res.datas.products_info.products_spec[color_id], //规格
                groupbuy_detail: res.datas.groupbuy_detail,
                goodsList: res.datas.groupbuy_detail.end_time, //时间戳
                cust_avatar: res.datas.groupbuy_detail.cust_avatar, //头像图片
                cust_name: res.datas.groupbuy_detail.cust_name, //头像名称
                surplus_number: res.datas.groupbuy_detail.surplus_number,
                member_state: res.datas.groupbuy_detail.cust_groupbuy_state,
                is_new: res.datas.is_new,
                data: res.datas,
                qualified: res.datas.free_groupbuy_qualified,
            })
            var data = res.datas;
            if (data.products_info.products_spec) {
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
                                    // ============
                                    if (data.products_info.products_spec.hasOwnProperty(vvi)) {
                                        value["isClick"] = 1;
                                    } else {
                                        value["isClick"] = 0;
                                    }
                                    // =============
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
                // data.products_map_spec = products_map_spec;

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

                mythis.setData({
                    chooseText: text,
                })
                // 对象转成数组结束
                mythis.setData({
                    products_map_spec: goods_spec,

                })

            } else {
                data.products_map_spec = [];
            }
            if (mythis.data.qualified) {
                //代金券弹窗开始
                var cknewmark2 = wx.getStorageSync('cknewmark22')
                var cknew = mythis.data.qualified.qualified_type;
                var cktime = mythis.data.qualified.qualified_time;
                var timestamp = parseInt(new Date().valueOf() / 1000);
                if (mythis.data.qualified.five_send_voucher) { //5元代金券
                    var five_send_voucher = mythis.data.qualified.five_send_voucher;
                } else {
                    var five_send_voucher = false;
                }

                if (five_send_voucher) { //五元代金券
                    mythis.postvoucher_five()
                    mythis.setData({
                        showVoucher: true,
                        fiveVOucher: true,
                        voucherTime: mythis.data.qualified.five_end_time,
                    })
                }

                //代金券弹窗结束
            }

            function grouptime() {
                var day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0;
                var nowTime = Date.parse(new Date()) / 1000
                var endTime = mythis.data.goodsList
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
                    var str = hour + ':' + minute + ':' + second
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
            grouptime();
            var timer = setInterval(grouptime, 1000);
            mythis.setData({
                hide: true
            })
            for(var i=0; i < res.datas.group_list.length;i++){
                    mythis.data.listData.push(res.datas.group_list[i])
            }
            mythis.setData({
                listData:mythis.data.listData
            })
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                iocn: 'none',
                duartion: 1000
            })
        })

}
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  }