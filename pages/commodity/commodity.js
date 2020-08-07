// pages/commodity/commodity.js
var WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js')
var key = wx.getStorageSync('key')
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
const utilclick = require('../../utils/util.js')
var http = require('../../utils/httputils.js');
Page({
  data: {
    indexFalse: false,
    swiperCurrent: 0,
    hide: false,
    chooseSize: false, //是否显示选规格弹窗
    chooseSizeGroup: false, //是否显示团购选规格弹窗
    animationData: {},
    animationDataGroup: {},
    data: [],
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    circular: true, // 是否采用衔接滑动
    interval: 3000, // 自动切换时间间隔
    duration: 1000, // 滑动动画时长
    article: "", // 富文本编辑器显示
    imgUrls: "",
    priceName: "",
    products_map_spec: [], //规格
    select: "",
    chooseText: "默认", //已选择文案
    products_id: "", //近详情传的id
    num: 1, // 数量初始化1
    minusStatus: 'disable', //数量不让点击
    group_dia: false, //团购规则弹窗
    group_list: [], //团购列表
    buy_text: "立即购买",
    choose_num: "5",
    limTime: "", //限时购倒计时
    groupTime: "", //点击去拼团弹窗倒计时
    joingroup: [], //点击去拼团弹窗数据
    groupTime_dia: false, //点击去拼团弹窗
    is_follow: false, //是否关注
    teamName: "立即开团",
    is_nav: false, //是否关注
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null,
    navShow: true,
    isHide: true, //评论弹出框
    mentListThree: [],
    daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png", //点赞图片
    heartsrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/1802ccdda4bce736aee0ea161263a7f.png", //点赞图片 
    moreHide: false, //更多评论
    addReviewText: "一更多评论一",
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
    comment_false: false,
    parent_respond_commentid: ''
  },
  xq: function (products_id) {
    var that = this; //把this对象复制到临时变量that
    const wxreq = wx.request({
      url: app.globalData.apiUrl + '/cli/Products/products_detail',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        key: wx.getStorageSync('key'),
        userid:wx.getStorageSync('openid'),
      },
      data: {
        products_id: products_id,
        num: 3,
        key: wx.getStorageSync('key')
      },
      // 109508
      success: function (res) {
        if (res.data.code == 200) {
          if(res.data.invitationCode){
						wx.setStorageSync('agent_code', res.data.invitationCode);
					}
          that.setData({
            online:res.data.datas.online,
            products_id: products_id,
            store_is_favorate: res.data.datas.store_info.is_favorate,
            common_count: res.data.datas.products_info.common_count,
            Vertical:res.data.datas.store_voucher_price,//直播代金券
            

          })
          if(res.data.datas.free_groupbuy_qualified){
            that.setData({
              newcust:res.data.datas.free_groupbuy_qualified.new_voucher,//是否新人
              new_cust_price:res.data.datas.new_cust_price,//新人专属价钱
              // newcustPrice:res.data.datas.newcust,//是否显示新人专属价钱
            })
          }else{
            that.setData({
              newcust:true,//是否新人
              new_cust_price:res.data.datas.new_cust_price,//新人专属价钱
              newcustPrice:true,//是否显示新人专属价钱
            })
          }
          //商品规格格式化数据
          var data = res.data.datas;
          var buy_text = res.data.datas.isgroupbuy;
          if (res.data.datas.isgroupbuy) {
            that.setData({
              choose_price: res.data.datas.groupbuy_commonInfo.groupbuy_price5
            })
          }
          if (data.is_favorate) {
            that.setData({
              is_follow: true,
            })
          } else {
            that.setData({
              is_follow: false,
            })
          }
          // if (Object.keys(data.products_info.spec_value).length >= 1){
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

          /** 轮播 */
          that.setData({
            data: res.data.datas,
            group_list: res.data.datas.group_buy_list,
            imgUrls: res.data.datas.products_image.split(",")
          })
          that.ressName = res.data.datas.products_hair_info
          that.speci = res.data.datas.products_info.spec_value
          that.specName = res.data.datas.products_info.spec_name
          /** 商品信息 */
          that.setData({
            priceName: res.data.datas.products_info,
            speci: res.data.datas.products_info.spec_value,
            collect: res.data.datas.products_info.products_collect,
            collectF: res.data.datas.products_info.products_collect,
            ressName: res.data.datas.products_hair_info,
            speci: res.data.datas.products_info.spec_name
          })
          // let that = this;
          if (res.data.datas.group_buy_list) {
            var dates = that.data.group_list
          } else {
            var dates = []
          }

          let len = dates.length; //时间数据长度
          function nowTime() { //时间函数
            for (var i = 0; i < len; i++) {
              // 剩余时间
              var nowTime = Date.parse(new Date()) / 1000
              var endTime = dates[i].end_time;
              var intDiff = endTime - nowTime;
              dates[i].dat = intDiff
              var day = 0,
                hour = 0,
                minute = 0,
                second = 0;
              if (intDiff > 0) { //转换时间
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                if (hour <= 9) hour = '0' + hour;
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                dates[i].dat--;
                var str = hour + '小时' + minute + '分' + second + '秒'
              } else {
                var str = "已结束！";
                clearInterval(timer);
              }
              dates[i].difftime = str; //在数据中添加difftime参数名，把时间放进去
            }
            that.setData({
              group_list: dates
            })
          }
          nowTime();
          var timer = setInterval(nowTime, 1000);
          //限时购倒计时
          function limtime() {
            var day = 0,
              hour = 0,
              minute = 0,
              second = 0;
            var nowTime = Date.parse(new Date()) / 1000
            var endTime = that.data.data.products_info.promotion_endtime

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
              var str = day + ':' + hour + ':' + minute + ':' + second
              that.setData({
                limTime: str
              })
            } else {
              var str = "已结束！";
              clearInterval(timer);
            }
          }
          if (that.data.data.products_info.promotion_endtime) {
            limtime();
            var timer = setInterval(limtime, 1000);
            //团购倒计时
          }

        }
      },
      complete: function () {
        that.setData({
          hide: true
        })
        wx.hideLoading();
      },
      fail: function (res) {
        this.userData = "数据获取失败";
      }
    })
  },
  // 弹窗下载app
  goLoad:function(){
     this.setData({
      loadTc:true
     })
  },
  // 关闭弹窗
  closeLoad:function(){
    this.setData({
      loadTc:false
     })
  },
   // 直播
   goList: function (e) {
    var that=this;
    var store_id = e.currentTarget.dataset.store_id;
    // if (wx.getStorageSync('key')) {
      if(that.data.is_back){
        wx.navigateBack({
            delta: 1,
          });
    }else{
      navigateTo('../live/live/live?store_id=' + store_id)
    }
    
    // }else{
        // navigateTo('../getUserInfo/getUserInfo')
    // }
},
  select: function (e) {
    var that = this;
    that.setData({
      select: e.target.dataset.specs_value_id
    })
  },
  swiperChange: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        swiperCurrent: e.detail.current
      })
    }
    // this.setData({
    //   swiperCurrent: e.detail.current
    // })
  },
  getCommentNum: function () {
    var that = this;
    let prams = {
      key: wx.getStorageSync('key'),
      products_commonid: that.data.data.products_commonid,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/Comment/getCommentNum', prams,
      (res)=>{
        that.setData({
            common_count: res.datas.comment_num
        });
      },
      (err)=> {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })
  },
  // 详情
  spxq: function (products_id) {
    var that = this; //把this对象复制到临时变量that
    let prams = {
      key: wx.getStorageSync('key'),
      products_id: products_id
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/products_body', prams,
      (res)=>{
        var article = res.datas.products_info;
        WxParse.wxParse('article', 'md', article, that, 5);
      },
      (err)=> {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })
  },
  selectGuige(e) {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
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
    this.xq(products_id);
    this.spxq(products_id);
  },
  /**
   * 页面的初始数据
   */


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

  // 立即购买显示弹出框
  chooseSezi: function (e) {
    if (wx.getStorageSync('key')) {
      var that = this;
      if (e.target.dataset.type == "join") {
        that.setData({
          join_cart: true
        })
      } else {
        that.setData({
          join_cart: false
        })
      }
      // 创建一个动画实例
      var animation = wx.createAnimation({
        // 动画持续时间
        duration: 400,
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
        animationData: animation.export(),
        // 改变view里面的Wx：if
        chooseSize: true,
        num:1,

      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          chooseSizeGroup: false,
          animationDataGroup: animation.export(),
        })
      }, 10)

    } else {
      navigateTo('../getUserInfo/getUserInfo')
    }
    // 用that取代this，防止不必要的情况发生

  },
  // 拼团选择弹窗人数
  chooseGroup: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 400,
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
      chooseSizeGroup: true,
      groupbuy: true

    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationDataGroup: animation.export()
      })
    }, 10)
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
  /*输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  // 关注
  follow: util.throttle(function (e) {
    if (wx.getStorageSync('key')) {
      var that = this;
      var is_follw = that.data.is_follow;
      if (!is_follw) { //关注
        let prams = {
          key: wx.getStorageSync('key'),
          products_id: that.data.products_id,
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustFavorites/favorites_add', prams,
          (res)=>{
            that.setData({
              is_follow: true,
              indexFalse: true,
              indexId: that.data.products_id,
              collect: Number(that.data.collect) + 1
            })
          },
          (err)=> {
            wx.showToast({
              title: err.datas.error,
              icon: 'none',
              duration: 1500
            })
          })

      } else { //取消关注
        let prams = {
          key: wx.getStorageSync('key'),
          fav_id: that.data.products_id,
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustFavorites/favorites_del', prams,
          (res)=>{
            that.setData({
              is_follow: false,
              indexFalse: false,
              indexId: that.data.products_id,
              collect: Number(that.data.collect) - 1
            })
          },
          (err)=> {
            wx.showToast({
              title: err.datas.error,
              icon: 'none',
              duration: 1500
            })
          })
      }

    } else {
      navigateTo('../getUserInfo/getUserInfo')
    }


  }, 800),
  chooseNum: function (e) {
    this.setData({
      choose_num: e.currentTarget.dataset.num,
      choose_price: e.currentTarget.dataset.price

    })
  },
  groupDia: function () {
    this.setData({
      group_dia: !this.data.group_dia,
    })
  },
  hidegroupTIme: function () {
    this.setData({
      groupTime_dia: false
    })
  },
  groupJoin: function (e) {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    var that = this;
    let parms = {
      products_id: that.data.products_id,
      groupbuy_hug: e.target.dataset.groupbuy_hug
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Products/groupbuy_detail_info',parms,
    (res)=>{
      that.setData({
        joingroup: res.datas,
        groupTime_dia: true,
        groupbuy_hug: e.target.dataset.groupbuy_hug,
      })
      //团购倒计时
      function grouptime() {
        var day = 0,
          hour = 0,
          minute = 0,
          second = 0;
        var nowTime = Date.parse(new Date()) / 1000
        var endTime = that.data.joingroup.groupbuy_detail.end_time;
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
          that.setData({
            groupTime: str
          })
        } else {
          var str = "已结束！";
          clearInterval(timer);
        }
      }
      //chooseSezi()
      grouptime();
      var timer = setInterval(grouptime, 1000);
      wx.hideLoading();
      //团购倒计时
    },(err)=>{
      wx.showToast({
        title: err.datas.error,
        icon:'none',
        duration:1000
      })
    })
  
  },
  gobefore1: function () {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    var that = this;
    var param = {};
    param.groupbuy_type = "other";
    param.cart_id = that.data.products_id + "|" + that.data.num;
    param.key = wx.getStorageSync('key');
    param.gdID = that.data.products_id;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + '/cli/CustBuy/order_confirm',
      method: "POST",
      data: param,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
          return
        } else {
          // wx.navigateTo({
          //   url: '../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num
          // })
          navigateTo('../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num + "&gdID=" + that.data.products_id)
        }
      },
      complete: function (res) {
       
      },
    })
  },
  //跳转支付页面前的执行接口
  gobefore: function () {
    var that = this;
    if(that.data.data.isgroupbuy && that.data.num>1){
      wx.showToast({
        icon: "none",
        title: "您购买的数量超过上限",
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
   
    var param = {};
    if (that.data.data.isgroupbuy) {
      param.groupbuy_number = that.data.choose_num;
    }
    if (that.data.data.isgroupbuy) {
      param.groupbuy_type = 'originate'
    } else {
      param.groupbuy_type = null;
    }
    param.cart_id = that.data.products_id + "|" + that.data.num;
    param.key = wx.getStorageSync('key');
    param.gdID = that.data.products_id;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')

      },
      url: app.globalData.apiUrl + '/cli/CustBuy/order_confirm',
      method: "POST",
      data: param,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
          return
        } else {
          // wx.navigateTo({
          //   url: '../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num
          // })
          navigateTo('../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num + "&gdID=" + that.data.products_id)
        }
      },
      complete: function (res) {
       
      },
    })
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  //双击
  doubleTap: function (e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        that.setData({
          navShow: !that.data.navShow
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '双击事件被触发',
        //   showCancel: false
        // })
      }
    }
  },
  //跳转看相似
  gosimlar: function (e) {
    var that = this
    var pc_id = e.currentTarget.dataset.pcid
    // wx.navigateTo({
    //   url: '../products_similar/products_similar?pc_id=' + pc_id + "&products_id=" + this.data.products_id
    // })
    navigateTo('../products_similar/products_similar?pc_id=' + pc_id + "&products_id=" + this.data.products_id)
  },
  //跳转店铺
  tostore: function (e) {
    var storeid = e.currentTarget.dataset.storeid
    
    navigateTo('../shopHome/shopHome?store_id=' + storeid)
  },
  //参团弹窗
  gogroup: function () {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    var that = this;
    var parms = {};
    parms.groupbuy_number = "5";
    parms.groupbuy_type = "participation";
    parms.cart_id = that.data.products_id + "|" + that.data.num;
    parms.key = wx.getStorageSync('key');
    parms.groupbuy_hug = that.data.groupbuy_hug;
    parms.gdID = that.data.products_id;
   
    http.postRequest(app.globalData.apiUrl + '/cli/CustBuy/order_confirm',parms,
    (res)=>{
      wx.hideLoading();
      navigateTo('../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num + "&gdID=" + that.data.products_id)
    },
    (err)=>{
      wx.showToast({
        icon: "none",
        title: err.datas.error,
        duration: 1000
      })
    })
  },
  gobuy: util.throttle(function (e) {
    var that=this
    if (this.data.join_cart) { //加入购物车
      if(this.data.data.isgroupbuy){
        this.gobefore1();
      }else{
        app.join_cart(this.data.products_id, this.data.num);
        setTimeout( function(){
          that.getCartNum();
        },500)
        
        this.hideModal();
      }
      
    } else { //立即购买
      this.gobefore()
    }
  }, 3000),
  gobuy1:util.throttle(function(e){
    this.gobefore1()
  }),
  shownav: function () {
    this.setData({
      is_nav: !this.data.is_nav
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
  // 跳转购物车
  gocart: function () {
    if (wx.getStorageSync('key')) {
      navigateTo('../cart/cart')

    } else {
      navigateTo('../getUserInfo/getUserInfo')
    }
  },
  // 跳转首页
  goindex: function () {
    // wx.navigateTo({
    //   url: '../index/index'
    // })
    navigateTo('../index/index')
  },
  // 跳转我的
  gomy: function () {
    // wx.navigateTo({
    //   url: '../myModule/myModule'
    // })
    navigateTo('../myModule/myModule')
  },
  // 跳转消息
  gonews: function () {
    // wx.navigateTo({
    //   url: '../newHome/newHome'
    // })
    navigateTo('../newHome/newHome')
  },
  //客服
  kefu: function () {
    // wx.navigateTo({
    //   url: '../load_app/load_app?link=' + encodeURIComponent("https://www.echatsoft.com/visitor/mobile/chat.html?companyId=566"),
    // })
    navigateTo('../load_app/load_app?link=' + encodeURIComponent("https://www.echatsoft.com/visitor/mobile/chat.html?companyId=566"))
  },
  // 跳转活动
  goactivity: function () {
    // wx.navigateTo({
    //   url: '../hot/hot'
    // })
    navigateTo('../hot/hot')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      products_id: options.products_id,
      isIphoneX: isIphoneX,
      is_back:options.is_back
    });
    //console.log(this.data.products_id)
    // this.xq(this.data.products_id);
    // this.spxq(this.data.products_id);
    //110642  多规格  普通
    //103612  拼团
    //107183  限时购
    // this.xq(103752)
    this.xq(this.data.products_id);
    this.spxq(this.data.products_id);
    var mythis = this;
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
    var that = this;
    that.getCartNum()
    wx.getStorage({
      key: 'HomeId', //对应存储的key名
      success: function (res) {
        //成功之后的操作，建议还是先打印res找到需要的东西
        that.setData({
          homeId: res.data
        })
      }
    })
    //   店铺
    wx.getStorage({

      key: 'shopHome', //对应存储的key名
      success: function (res) {
        that.setData({
          store_is_favorate: that.data.homeId,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     var that=this;
     that.hideModal()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.collect == this.data.collectF) {
      console.log("改变")
    } else {
      console.log("未改变")
      wx.setStorage({
        key: 'indexFalse',
        data: this.data.indexFalse, //及接收储图片或文件地址的变量
      })
      wx.setStorage({
        key: 'indexId',
        data: this.data.indexId, //及接收储图片或文件地址的变量
      })
    }

    console.log(this.data.products_id)
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
  // 点击评论显示
  pinglun: function (e) {
    var mythis = this;
    mythis.setData({
      products_commonid: e.currentTarget.dataset.id,
      // isHide: false,
      page: 1,
    })
    comment(mythis.data.products_commonid, mythis.data.page, 10, wx.getStorageSync('key'), mythis)

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
    addReview(mythis.data.comment_id, wx.getStorageSync('key'), mythis.data.page, 10, mythis)
  },
  // 更多追评
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
        addReviewText: "一收起一",
        mentList: mythis.data.mentList
      })
    } else {
      mythis.setData({
        addReviewText: "一更多评论一"
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
  commentConfirm:utilclick.throttle( function (e) {
    if (wx.getStorageSync('key')) {
      var mythis = this;
      // 评论内容
      if (mythis.data.respond_comment_id) {
        mythis.setData({
          respond_to_comments: 1
        })
        release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, mythis.data.key, mythis.data.comments_type, mythis)
      } else {
        // 评论
        mythis.setData({
          respond_to_comments: 0
        })
        release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, mythis.data.key, mythis.data.comments_type, mythis)
        mythis.setData({
          comment_id: ''
        })
      }
    } else {
      navigateTo('../getUserInfo/getUserInfo')
    }


  },500),
  daimaiClick: function (e) {
    if (wx.getStorageSync('key')) {
      var mythis = this;
      var index = e.currentTarget.dataset.curindex;
      if (this.data.mentList[index]) {
        var hasChange = this.data.mentList[index].is_likes
        var comment_id = e.currentTarget.dataset.id;
        var comments_type = e.currentTarget.dataset.type;
        var products_commonid = e.currentTarget.dataset.video;
        if (hasChange == '0') {
          var onum = this.data.mentList[index].like_num
          this.data.mentList[index].like_num = (onum + 1);
          this.data.mentList[index].is_likes = 1;
          redheart(comment_id, wx.getStorageSync('key'), comments_type, products_commonid, mythis)
        } else {
          var onum = this.data.mentList[index].like_num
          this.data.mentList[index].like_num = (onum - 1);
          this.data.mentList[index].is_likes = 0;
          cancelheart(comment_id, wx.getStorageSync('key'), comments_type, products_commonid, mythis)
        }
        this.setData({
          mentList: this.data.mentList,

        })
      }else{
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
  // 加载更多
  moreList: function () {
    var mythis = this;
    mythis.data.page = mythis.data.page + 1
    if (mythis.data.hideHasmore) {
      comment(mythis.data.products_commonid, mythis.data.page, 10, wx.getStorageSync('key'), mythis)
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 关注店铺
  tofollowStore: function (e) {
    var that = this
    var store_id = e.currentTarget.dataset.store_id;
    if (wx.getStorageSync('key')) {
      let parms = {
        store_id: store_id,
        key: wx.getStorageSync('key')
      }
      http.postRequest(app.globalData.apiUrl + '/cli/CustFavoritesStore/favorites_add',parms,
      (res)=>{
        that.setData({
          store_is_favorate: true,
        });
        wx.setStorage({
          key: 'shopHome',
          data: that.data.data.store_info.store_id //及接收储图片或文件地址的变量
        })
        wx.setStorage({
          key: 'HomeId',
          data: true //及接收储图片或文件地址的变量
        })
      },
      (err)=>{
        wx.showToast({
          icon: "none",
          title: err.datas.error,
          duration: 1000
        })
      })
    
    } else {
      navigateTo('../getUserInfo/getUserInfo')
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var url = 'pages/index/index?is_share=yes&products_commonid=' + this.data.data.products_commonid+"&agent_code="+wx.getStorageSync('agent_code');
    // if (res.from === 'button') {
    //   var url = 'pages/video_detail/video_detail?products_commonid=' + res.target.dataset.id
    // }else{
    //   var url = 'pages/video_detail/video_detail?products_commonid=' + this.data.videos[this.data.videoIndex].products_commonid
    // }
    var shareTitle;
    if(this.data.data.isgroupbuy){
      shareTitle="【拼团】超级优惠，和我一起拼团抢购吧！"
    }else if(this.data.data.products_info.promotion_endtime){
      shareTitle="【限时秒杀】超级钜惠，快来和我一起抢购吧～"
    }else{
      shareTitle=this.data.priceName.products_name
    }
    return {
      title: shareTitle,
      path: url,
      imageUrl: this.data.imgUrls[0],
    }
  }
})

// 发布评论
function release(parent_respond_commentid, commentText, products_commonid, respond_to_comments, respond_comment_id, cust_id, key, comments_type, mythis) {
  if (!commentText) {
    wx.showToast({
      icon: "none",
      title: '请输入要评论的内容！',
      duration: 1000
    })
    return false;
  }
  let parms = {
    parent_respond_commentid: parent_respond_commentid,
      comment_content: commentText,
      products_commonid: products_commonid,
      respond_to_comments: respond_to_comments,
      respond_comment_id: respond_comment_id,
      cust_id: cust_id,
      key:wx.getStorageSync('key') ,
      comments_type: comments_type
  }
  http.postRequest(app.globalData.apiUrl + "/cli/Comment/addComment",parms,
  (res)=>{
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
        console.log(mythis.data.comment_text)
				console.log(res.datas.comment_info)
    }else{
      mythis.setData({
          mentList: [],
          mentListThree: [],
          commentText: '',
          respond_comment_id: '',
          cust_id: '',
          newName: false,
          page: 1,
          comment_false: false,
          comment_text:''
      })
    }
    comment(mythis.data.products_commonid, mythis.data.page, 10, wx.getStorageSync('key'), mythis)
    // mythis.getCommentNum();
  },
  (err)=>{
    wx.showToast({
      title: err.datas.error,
      icon:'none',
      duration:2000
    })
  })


}
// 评论 列表
function comment(products_commonid, page, rows, key, mythis) {
  let parms = {
    products_commonid: products_commonid,
    page: page,
    rows: rows,
    key: key,
  }
  http.postRequest(app.globalData.apiUrl + '/cli/CommentList/index',parms,
  (res)=>{
    
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
        hideHasmore: res.datas.hasmore,
        isHide: false,
      });
    }
  },(err)=>{
    wx.showToast({
      title: err.datas.error,
      icon:'none',
      duration:1000
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
  http.postRequest(app.globalData.apiUrl + "/cli/Comment/delCustComment",parms,
  (res)=>{

  },
  (err)=>{
    wx.showToast({
      title: err.datas.error,
      icon:'none',
      duration:1000
    })
  })
 
}
//点赞  
function redheart(comment_id, key, comments_type, products_commonid, mythis) {
  let parms ={
    comment_id: comment_id,
    key: wx.getStorageSync('key'),
    comments_type: comments_type,
    products_commonid: products_commonid
  }
  http.postRequest(app.globalData.apiUrl + "/cli/Comment/addCustComment",parms,
  (res)=>{

  },(err)=>{
    wx.showToast({
      title: err.datas.error,
      icon:'none',
      duration:1000
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
  http.getRequest(app.globalData.apiUrl + "/cli/CommentList/respond_to_comments",parms,
  (res)=>{
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
        addReviewText: "一收起一"
      })
    } else {
      mythis.setData({
        addReviewText: "一更多评论一"
      })
    }
  },(err)=>{
    wx.showToast({
      title: err.datas.error,
      icon:'none',
      duration:1000
    })
  })
}