// pages/follow/follow.js
const app = getApp()
const util = require('../../utils/util.js')
import navigateTo from "../../utils/navigateRoute.js"
var commType;
var commIndex;
var productsId;
var http = require('../../utils/httputils.js');
const utilclick = require('../../utils/util.js')
var timer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    followStore: [], //店铺列表
    store_follow: [], //店铺轮播列表
    followFriend: [],
    cust_follow: [], //好友轮播
    followProducts: [], //商品列表
    pro_follow: [], //商品轮播
    hasmore: true,
    page: "1",
    status: "", //为空状态
    isHide: true, //评论弹出框
    mentListThree: [],
    daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png", //点赞图片
    heartsrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/1802ccdda4bce736aee0ea161263a7f.png", //点赞图片 
    moreHide: false, //更多评论
    addReviewText: "一更多评论一",
    page: 1,
    rows: 10,
    num: 4,
    hide: false,
    exhibi: false,
    isHide: true, //评论弹出框
    moreHide: false, //更多评论
    id: '0',
    scrollLeft: 0,
    hiddenText: true, //点赞数
    an: "", //商品列表弹窗
    an1: "", //商品规格弹窗
    num: 1, // 数量初始化1
    products_map_spec: [], //规格
    chooseText: "默认", //已选择文案
    comment_false: false,
    parent_respond_commentid: ''
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
  // 收起关闭
  upDown(event) {
    var index = event.currentTarget.dataset['index'];
    this.data.followStore[index].upStatus = !this.data.followStore[index].upStatus;
    this.setData({
      followStore: this.data.followStore
    })
  },
  goLive: function (e) {
    var store_id = e.currentTarget.dataset.store_id
    navigateTo('../live/live/live?store_id=' + store_id)
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
    const wxreq = wx.request({
      url: app.globalData.apiUrl + '/cli/Products/products_detail',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        key: wx.getStorageSync('key'),
        userid: wx.getStorageSync('openid'),
      },
      data: {
        products_id: products_id,
        num: 3,
        key: wx.getStorageSync('key')
      },
      success: function (res) {
        if (res.data.code == 200) {

          //商品规格格式化数据
          var data = res.data.datas;
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
        }
        that.setData({
          products_id: products_id,
          imgUrls: res.data.datas.products_image.split(","),
          goods_price: res.data.datas.products_info.products_price,
          goods_detail: res.data.datas
        })
      },
      complete: function () {
        wx.hideLoading()
      },
      fail: function (res) {
        this.userData = "数据获取失败";
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let isIphoneX = app.globalData.isIphoneX;
    that.setData({
      index: options.type,
      isIphoneX: isIphoneX
    })
    if (that.data.index == 1) {
      that.queryStrore();
      that.queryLbStrore();

    } else if (that.data.index == 2) {
      that.queryFriend();
      that.queryLbFriend();
    } else {
      that.queryLbProducts();
      that.queryProducts();
    }


    // that.queryStrore();
    // that.queryLbStrore();
    // that.queryFriend();
    // that.queryLbFriend();
    // that.queryLbProducts();
    // that.queryProducts();
  },
  //tab
  getlist: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    this.setData({
      index: index,
      followStore: [], //店铺列表
      store_follow: [], //店铺轮播列表
      followFriend: [],
      cust_follow: [], //好友轮播
      followProducts: [], //商品列表
      pro_follow: [], //商品轮播
      hasmore: true,
      page: "1",
      hide: false

    });
    if (index == 1) {
      clearInterval(timer)
      that.queryStrore();
      that.queryLbStrore();

    } else if (index == 2) {
      that.queryFriend();
      that.queryLbFriend();
    } else {
      that.queryLbProducts();
      that.queryProducts();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 跳转全屏视频
  goHome: function (e) {
    var description = e.currentTarget.dataset.description
    var name = e.currentTarget.dataset.name
    var title = e.currentTarget.dataset.title
    var uri = e.currentTarget.dataset.uri
    var img = []
    img.push(e.currentTarget.dataset.img)
    if (uri) {
      navigateTo('../shopHome/videoWhole/videoWhole?store_id=' + this.data.store_id + "&description= " + description + "&name=" + name + "&title=" + title + "&uri=" + uri)
    } else {
      wx.previewImage({
        // current: img, // 当前显示图片的http链接
        urls: img // 需要预览的图片http链接列表
      })
    }

  },
  //跳转首页
  toindex: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  //关注商品请求数据
  queryLbStrore: function () {
    var that = this;
    let parms = {
      key: wx.getStorageSync('key'),
      page: that.data.page,
      rows: 10
    }
    http.postRequest(app.globalData.apiUrl + '/cli/MyFollow/recommendStore', parms,
      (res) => {
        for (var i = 0; i < res.datas.store_follow.length; i++) {
          res.datas.store_follow[i].follow = false;
          res.datas.store_follow[i].SearchText = '关注'

        }
        that.setData({
          store_follow: res.datas.store_follow,
          online_num: res.datas.favorites.is_online_num,
          is_favorate_store: res.datas.favorites.is_favorate_store,
          hide: true
        })
      }, (err) => {
        wx.showToast({
          icon: "none",
          title: err.datas.error,
          duration: 1000
        })
      })
  },
  queryStrore: function () {
    var that = this;
    let parms = {
      key: wx.getStorageSync('key'),
      page: that.data.page,
      rows: 10
    }
    http.postRequest(app.globalData.apiUrl + '/cli/MyFollow/followStore', parms,
      (res) => {
        if (res.invitationCode) {
          wx.setStorageSync('agent_code', res.invitationCode);
        }
        if (!res.datas.products_data) {
          that.setData({
            followStore: null,
            hasmore: res.datas.hasmore,
            status: res.datas.status,
            already_see_store: "0",
            already_see_pro: res.datas.already_see_pro,
            already_see_fri: res.datas.already_see_fri,
          })
        } else {
          that.setData({
            followStore: that.data.followStore.concat(res.datas.products_data),
            man: res.datas.products_data[0].voucher_t_limit,
            jian: res.datas.products_data[0].voucher_t_price,
          })
          for (var i = 0; i < that.data.followStore.length; i++) {
            that.data.followStore[i].follow = true;
            that.data.followStore[i].SearchText = '已关注'
            that.data.followStore[i].timer = that.data.followStore[i].notice_start_time
          }
          that.setData({
            followStore: that.data.followStore,
            hasmore: res.datas.hasmore,
            status: res.datas.status,
            already_see_store: "0",
            already_see_pro: res.datas.already_see_pro,
            already_see_fri: res.datas.already_see_fri,
            //status: 2
            // notice_start_time:res.datas.products_data[0].notice_start_time
          })
          // let that = this;
          if (that.data.followStore) {
            var dates = that.data.followStore
          } else {
            var dates = []
          }


          let len = dates.length;//时间数据长度  
          function nowTime() {//时间函数
            for (var i = 0; i < len; i++) {
              var endTime = dates[i].timer;//获取数据中的时间戳
              var notice_start_time = dates[i].notice_start_time
              var nowTime = Date.parse(new Date()) / 1000
              var intDiff = endTime - nowTime;
              var day = 0, hour = 0, minute = 0, second = 0;
              if (intDiff > 0) {//转换时间
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                if (hour <= 9) hour = '0' + hour;
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                dates[i].timer-1;
                var str =day +"天"+ hour + '小时' + minute + '分' + second + '秒'
              } else {
                var str = "已结束！";

                //clearInterval(timer);
              }
              dates[i].notice_start_time = str;//在数据中添加difftime参数名，把时间放进去
            }
            that.setData({
              followStore: dates
            })
          }
          nowTime();
          timer = setInterval(nowTime, 1000);
        }
        wx.hideLoading()
      }, (err) => {
        wx.showToast({
          icon: "none",
          title: err.datas.error,
          duration: 1000
        })
      })
    
  },

  // 跳转直播预告
  goNotice: function (e) {
    var store_id = e.currentTarget.dataset.store_id
    var notice_id = e.currentTarget.dataset.notice_id
    navigateTo('../shopHome/videoNotice/videoNotice?store_id=' + store_id + '&notice_id=' + notice_id + '&home=' + 1)
  },
  //   更新点赞数量
  getCommentNum: function (type, id, index) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/cli/Comment/getCommentNum',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        products_commonid: id,
        key: wx.getStorageSync('key')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (type == "store") {
            var list = that.data.followStore;
            list[index].common_count = res.data.datas.comment_num;
            that.setData({
              followStore: list,
            })
          } else {
            var list = that.data.followFriend;
            list[index].common_count = res.data.datas.comment_num;
            that.setData({
              followFriend: list,
            })
          }
        }
      },
      complete: function () {

      }
    });
  },
  // 关注好友
  queryFriend: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/cli/MyFollow/followFriend',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        page: that.data.page,
        rows: 10
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.invitationCode) {
            wx.setStorageSync('agent_code', res.data.invitationCode);
          }
          if (res.data.datas.follow_info) {
            that.setData({
              followFriend: that.data.followFriend.concat(res.data.datas.follow_info.data),
              status: res.data.datas.status
            })
            for (var i = 0; i < that.data.followFriend.length; i++) {
              that.data.followFriend[i].follow = true;
              that.data.followFriend[i].SearchText = '已关注'
            }
            that.setData({
              followFriend: that.data.followFriend,
              hasmore: res.data.datas.hasmore,
              status: res.data.datas.status,
              already_see_store: res.data.datas.already_see_store,
              already_see_pro: res.data.datas.already_see_pro,
              already_see_fri: "0",


              //status: 2
            })

          } else {
            that.setData({
              followFriend: null,
              hasmore: res.data.datas.hasmore,
              status: res.data.datas.status,
            })
          }
          wx.hideLoading()
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        }
      },
      complete: function () {
        that.setData({
          hide: true
        })
      }
    });
  },
  // 关注店铺
  followStoreBtn: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      if (that.data.store_follow[index]) {
        var follow = that.data.store_follow[index].follow
        var store_id = e.currentTarget.dataset.store_id
        if (!follow) { //关注
          that.okFollowStore(store_id, index, that.data.store_follow)
        } else { //取消关注
          //that.canalguanzhuFollowStore(store_id, index, that.data.store_follow)
          that.canalFollowStore(store_id, index, that.data.store_follow)
          //canalFollowStore
        }
      }
    } else if (type == 2) {
      if (that.data.followStore[index]) {
        var follow = that.data.followStore[index].follow
        var store_id = e.currentTarget.dataset.store_id
        if (!follow) { //关注
          that.okFollowStore(store_id, index, that.data.followStore)
        } else { //取消关注
          //that.canalFollowStore(store_id, index, that.data.followStore)
          that.canalFollowStore(store_id, index, that.data.followStore)
        }
      }
    }
  },
  canalFollowStore: function (store_id, index, cb) {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/cli/CustFavoritesStore/favorites_del',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        store_id: store_id,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            cb[index].follow = false;
            cb[index].SearchText = '关注';
          } else {
            wx.showToast({
              icon: "none",
              title: res.data.datas.error,
              duration: 1000
            })
          }
          that.setData({
            store_follow: that.data.store_follow,
            followStore: that.data.followStore,
          })
        }
      },
      complete: function () {

      }
    });
  },
  okFollowStore: function (store_id, index, cb) {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/cli/CustFavoritesStore/favorites_add',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        store_id: store_id,
      },
      success: function (res) {
        if (res.data.code == 200) {
          cb[index].follow = true;
          cb[index].SearchText = '已关注';
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        }
        that.setData({
          store_follow: that.data.store_follow,
          followStore: that.data.followStore,
        })
      },
      complete: function () {

      }
    });
  },
  //关注好友请求数据
  queryLbFriend: function () {
    var that = this;
    let parms = {
      key: wx.getStorageSync('key'),
      page: that.data.page,
      rows: 10
    }
    http.postRequest(app.globalData.apiUrl + '/cli/MyFollow/recommendFriend', parms,
      (res) => {
        for (var i = 0; i < res.datas.cust_follow.length; i++) {
          res.datas.cust_follow[i].follow = false;
          res.datas.cust_follow[i].SearchText = '关注'
        }
        that.setData({
          cust_follow: res.datas.cust_follow,
        })
      }, (err) => {
        wx.showToast({
          icon: "none",
          title: err.datas.error,
          duration: 1000
        })
      })

  },
  // 关注好友
  followFriendBtn: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      if (that.data.cust_follow[index]) {
        var follow = that.data.cust_follow[index].follow
        var friendId = e.currentTarget.dataset.friendid
        if (!follow) { //关注
          that.okFollowFriend(friendId, index, that.data.cust_follow)
        } else { //取消关注
          that.canalFollowFriend(friendId, index, that.data.cust_follow)
        }
      }
    } else if (type == 2) {
      if (that.data.followFriend[index]) {
        var follow = that.data.followFriend[index].follow
        var friendId = e.currentTarget.dataset.friendid
        if (!follow) { //关注
          that.okFollowFriend(friendId, index, that.data.followFriend)
        } else { //取消关注
          that.canalFollowFriend(friendId, index, that.data.followFriend)
        }
      }
    }
  },
  canalFollowFriend: function (friendId, index, cb) {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/cli/MyFollow/cancelFollowFriend',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        friendId: friendId,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            cb[index].follow = false;
            cb[index].SearchText = '关注';
          } else {
            wx.showToast({
              icon: "none",
              title: res.data.datas.error,
              duration: 1000
            })
          }
          that.setData({
            cust_follow: that.data.cust_follow,
            followFriend: that.data.followFriend,
          })
        }
      },
      complete: function () {

      }
    });
  },
  okFollowFriend: function (friendId, index, cb) {
    var that = this
    wx.request({
      url: app.globalData.apiUrl + '/cli/MyFollow/addFollowFriend',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        friendId: friendId,
      },
      success: function (res) {
        if (res.data.code == 200) {
          cb[index].follow = true;
          cb[index].SearchText = '已关注';
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        }
        that.setData({
          cust_follow: that.data.cust_follow,
          followFriend: that.data.followFriend,
        })
      },
      complete: function () {

      }
    });
  },
  //关注商品请求数据
  queryLbProducts: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + '/cli/MyFollow/recommendProducts',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key'),
        userid: wx.getStorageSync('openid'),
      },
      data: {
        key: wx.getStorageSync('key'),
        page: that.data.page,
        rows: 10
      },
      success: function (res) {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.datas.pro_follow.length; i++) {
            res.data.datas.pro_follow[i].is_favorate_products = false;
            res.data.datas.pro_follow[i].SearchText = '关注'
          }
          that.setData({
            pro_follow: res.data.datas.pro_follow,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        }
      },
      complete: function () { }
    });
  },
  //关注商品请求数据
  queryProducts: function () {
    var that = this;

    wx.request({
      url: app.globalData.apiUrl + '/cli/MyFollow/followProducts',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key'),
        userid: wx.getStorageSync('openid'),
      },
      data: {
        key: wx.getStorageSync('key'),
        page: that.data.page,
        rows: 10
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.invitationCode) {
            wx.setStorageSync('agent_code', res.data.invitationCode);
          }
          if (!res.data.datas.follow_info) {
            that.setData({
              productsInfo: res.data.datas.cust_info,
              followProducts: null,
              hasmore: res.data.datas.hasmore,
              status: res.data.datas.status,
              already_see_store: res.data.datas.already_see_store,
              already_see_pro: "0",
              already_see_fri: res.data.datas.already_see_fri,

            })
          } else {
            that.setData({
              productsInfo: res.data.datas.cust_info,
              followProducts: that.data.followProducts.concat(res.data.datas.follow_info.data),
              hasmore: res.data.datas.hasmore,
              status: res.data.datas.status,
              already_see_store: res.data.datas.already_see_store,
              already_see_pro: "0",
              already_see_fri: res.data.datas.already_see_fri,

              //status:1
            })
          }
          wx.hideLoading()
        }
      },
      complete: function () {
        that.setData({
          hide: true
        })
      }
    });
  },
  // 跳转链接
  gostore: function (e) {
    var store_id = e.currentTarget.dataset.store_id;
    navigateTo('../shopHome/shopHome?store_id=' + store_id)
  },
  gostoreTab: function (e) {
    var store_id = e.currentTarget.dataset.id;
    navigateTo('../shopHome/shopHome?store_id=' + store_id + "&id=1")
  },
  // 跳转链接
  gofollowstore: function (e) {
    navigateTo('../recomShop/recomShop')
  },
  gofollowFriends: function (e) {
    navigateTo('../recomGood/recomGood')
  },
  gofollowProducts: function (e) {
    navigateTo('../recomComm/recomComm')
  },
  govideo: function (e) {
    var products_commonid = e.currentTarget.dataset.products_commonid;
    var products_id = e.currentTarget.dataset.products_id;
    var index = e.currentTarget.dataset.index;
    var list;
    if (this.data.index == 1) {
      list = this.data.followStore
      var arr = [];
      var num = 0
      for (var i = 0; i < list.length; i++) {
        if (list[i].news_type != 1) {
          arr.push(list[i])
        } else {
          num += 1;
        }

      }
      list = arr;
      index = index - num
    } else if (this.data.index == 2) {
      list = this.data.followFriend
    } else {
      list = this.data.followProducts
    }
    if (e.currentTarget.dataset.products_video) {
      navigateTo('../video_detail/video_detail?products_commonid=' + products_commonid + '&products_id=' + products_id )
    } else {
      navigateTo('../commodity/commodity?products_id=' + e.currentTarget.dataset.products_id)
    }
  },
  joincart: function (e) {
    app.join_cart(this.data.products_id, this.data.num);
    this.setData({
      an1: "down",
      num: 1
    })

  },
  // 点赞
  daimaiClick: function (e) {
    var that = this
    var products_id = e.currentTarget.dataset.products_id;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == "followStore") {
      var list1 = that.data.followStore;
    } else if (type == "followFriend") {
      var list1 = that.data.followFriend;
    } else if (type == "pro_follow") {
      var list1 = that.data.pro_follow;
    }
    var index;
    if (list1[index].is_favorate_products) { //取消点赞
      const wxreq = wx.request({
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
          key: wx.getStorageSync('key')
        },
        url: app.globalData.apiUrl + '/cli/CustFavorites/favorites_del',
        method: "POST",
        data: {
          fav_id: products_id,
          key: wx.getStorageSync('key'),
        },
        success: function (res) {
          if (res.data.code == 200) {
            list1[index].is_favorate_products = false;
            list1[index].products_collect = Number(list1[index].products_collect) - 1;
            //list1[index].SearchText = '关注'
            if (type == "followStore") {
              that.setData({
                followStore: list1,
              })
            } else if (type == "followFriend") {
              that.setData({
                followFriend: list1,
              })

            } else if (type == "pro_follow") {
              that.setData({
                pro_follow: list1,
              })
            }

            wx.showToast({
              icon: "none",
              title: "取消关注成功",
              duration: 1000
            })
            return
          } else {
            wx.showToast({
              icon: "none",
              title: res.data.datas.error,
              duration: 1000
            })
          }

        },
        fail: function (res) {

        }
      })
    } else { //点赞
      const wxreq = wx.request({
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
          key: wx.getStorageSync('key')
        },
        url: app.globalData.apiUrl + '/cli/CustFavorites/favorites_add',
        method: "POST",
        data: {
          products_id: products_id,
          key: wx.getStorageSync('key')
        },
        success: function (res) {
          if (res.data.code == 200) {
            list1[index].is_favorate_products = true;
            list1[index].products_collect = Number(list1[index].products_collect) + 1;
            //list1[index].SearchText = '已关注'
            if (type == "followStore") {
              that.setData({
                followStore: list1,
              })
            } else if (type == "followFriend") {
              that.setData({
                followFriend: list1,
              })
            } else if (type == "pro_follow") {
              that.setData({
                pro_follow: list1,
              })
            }
            wx.showToast({
              icon: "none",
              title: "关注成功",
              duration: 1000,

            })
            return
          } else {
            wx.showToast({
              icon: "none",
              title: res.data.datas.error,
              duration: 1000
            })
          }
        },
        fail: function (res) { }
      })
    }
    // } 
    // }
  },
  // 关注店铺
  homeClick: function (e) {
    var index = e.currentTarget.dataset.index
    if (this.data.followFriend[index]) {
      var is_follw = this.data.followFriend[index].is_favorate_store
      var store_id = e.currentTarget.dataset.store_id
      if (!is_follw) { //关注
        var onum = this.data.followFriend[index].store_collect
        this.data.followFriend[index].is_favorate_store = true;
        this.data.followFriend[index].store_collect = (onum + 1);
        this.addHome(store_id)
      } else { //取消关注
        var onum = this.data.followFriend[index].store_collect
        this.data.followFriend[index].is_favorate_store = false;
        this.data.followFriend[index].store_collect = (onum - 1);
        this.takeHome(store_id)
      }
      this.setData({
        followFriend: this.data.followFriend,
      })
    }
  },
  // 关注店铺
  addHome: function (store_id) {
    let parms = {
      store_id: store_id,
      key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustFavoritesStore/favorites_add', parms,
      (res) => {
        wx.showToast({
          icon: "none",
          title: "关注成功",
          duration: 1000
        })
      }, (err) => {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 2000
        })
      })
  },
  // 取关店铺
  takeHome: function (store_id) {
    let parms = {
      store_id: store_id,
      key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustFavoritesStore/favorites_del', parms,
      (res) => {
        wx.showToast({
          icon: "none",
          title: "取消关注成功",
          duration: 1000
        })
      }, (err) => {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 2000
        })
      })
  },
  //删除店铺
  delstore: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < that.data.store_follow.length; i++) {
      if (that.data.store_follow[index] == that.data.store_follow[i]) {
        that.data.store_follow.splice(index, 1);
      }
    }
    that.setData({
      store_follow: that.data.store_follow
    })

    if (that.data.store_follow.length == 0) {
      that.setData({
        hide: false
      })
      that.queryStrore();
      that.queryLbStrore();
    }
  },
  //删除好友
  delfriend: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < that.data.cust_follow.length; i++) {
      if (that.data.cust_follow[index] == that.data.cust_follow[i]) {
        that.data.cust_follow.splice(index, 1);
      }
    }
    that.setData({
      cust_follow: that.data.cust_follow
    })
    if (that.data.cust_follow.length == 0) {
      that.setData({
        hide: false
      })
      that.queryFriend();
      that.queryLbFriend();
    }

  },
  goList: function (e) {
    var store_id = e.currentTarget.dataset.store_id
    navigateTo('../live/live/live?store_id=' + store_id)
  },
  delproducts: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < that.data.pro_follow.length; i++) {
      if (that.data.pro_follow[index] == that.data.pro_follow[i]) {
        that.data.pro_follow.splice(index, 1);
      }
    }
    that.setData({
      pro_follow: that.data.pro_follow
    })
    if (that.data.pro_follow.length == 0) {
      that.setData({
        hide: false
      })
      that.queryLbProducts();
      that.queryProducts();
    }
  },
  delfollowproducts: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var products_id = e.currentTarget.dataset.products_id;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + '/cli/CustFavorites/favorites_del',
      method: "POST",
      data: {
        fav_id: products_id,
        key: wx.getStorageSync('key'),
      },
      success: function (res) {
        // if (res.data.code == 200) {
        for (var i = 0; i < that.data.followProducts.length; i++) {
          if (that.data.followProducts[index] == that.data.followProducts[i]) {
            that.data.followProducts.splice(index, 1);

          }
        }
        that.setData({
          followProducts: that.data.followProducts
        })
        // }


      },
      fail: function (res) {

      }
    })

  },
  // 点击评论显示
  pinglun: function (e) {
    var mythis = this;
    commType = e.currentTarget.dataset.type;
    commIndex = e.currentTarget.dataset.index;
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
    // 评论内容
    if (mythis.data.respond_comment_id) {
      mythis.setData({
        respond_to_comments: 1
      })
      release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, wx.getStorageSync('key'), mythis.data.comments_type, mythis)
    } else {
      // 评论
      mythis.setData({
        respond_to_comments: 0
      })
      release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, wx.getStorageSync('key'), mythis.data.comments_type, mythis)
      mythis.setData({
        comment_id: ''
      })
    }
  },500),
  // 滑动
  scrollView: function (event) {
    var that = this;
    if(!that.data.hasmore){
      return
    }
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    if (that.data.hasmore) {
      that.setData({
        page: Number(that.data.page) + 1,
      })
      if (that.data.index == "1" && that.data.hasmore) {
        that.queryStrore();
      } else if (that.data.index == "2" && that.data.hasmore) {
        setTimeout(function () {
          that.queryFriend();
        }, 500)
      } else if (that.data.index == "3" && that.data.hasmore) {
        that.queryProducts();
      }
    } else {
      wx.hideLoading()
      return;
    }


  },
  goHome: function (e) {
    var store_id = e.currentTarget.dataset.id;
    navigateTo('../shopHome/shopHome?store_id=' + store_id)
  },
  commentdaimaiClick: function (e) {
    var mythis = this;
    var index = e.currentTarget.dataset.curindex;
    if (mythis.data.mentList[index]) {
      var hasChange = mythis.data.mentList[index].is_likes
      var comment_id = e.currentTarget.dataset.id;
      var comments_type = e.currentTarget.dataset.type;
      var products_commonid = e.currentTarget.dataset.video;
      if (hasChange == '0') {
        var onum = mythis.data.mentList[index].like_num
        mythis.data.mentList[index].like_num = (onum + 1);
        mythis.data.mentList[index].is_likes = 1;
        redheart(comment_id, wx.getStorageSync('key'), comments_type, products_commonid, mythis)
      } else {
        var onum = mythis.data.mentList[index].like_num
        mythis.data.mentList[index].like_num = (onum - 1);
        mythis.data.mentList[index].is_likes = 0;
        cancelheart(comment_id, wx.getStorageSync('key'), comments_type, products_commonid, mythis)
      }
      mythis.setData({
        mentList: mythis.data.mentList,

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
    clearInterval(timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    if (that.data.hasmore) {
      that.setData({
        page: Number(that.data.page) + 1,
      })
      if (that.data.index == "1" && that.data.hasmore) {
        this.queryStrore();
      } else if (that.data.index == "2" && that.data.hasmore) {
        this.queryFriend();
      } else if (that.data.index == "3" && that.data.hasmore) {
        this.queryProducts();
      }
    } else {
      wx.hideLoading()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var follow_type = res.target.dataset.follow_type;
      if (follow_type == 11) {
        var store_id = res.target.dataset.store_id;
        var image =  res.target.dataset.store_img;
        var url = 'pages/shopHome/shopHome?store_id=' + store_id + "&agent_code=" + wx.getStorageSync('agent_code')
      } else {
        var image = res.target.dataset.image;
        var products_commonid = res.target.dataset.products_commonid;
        if (res.target.dataset.products_video) {
          var url = 'pages/index/index?products_commonid=' + products_commonid + "&agent_code=" + wx.getStorageSync('agent_code')
        } else {
          var url = 'pages/commodity/commodity?products_id=' + res.target.dataset.products_id + "&agent_code=" + wx.getStorageSync('agent_code')
        }
      }
    } else {
      var image = 'https://bj.aizhiyi.com/wap/test/wap/xcxImg/fenxiang1.png'
      var url = 'pages/index/index'
    }
    return {
      title: '爱之依精品中国',
      path: url,
      imageUrl: image
    }
  },
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
    key: key,
    comments_type: comments_type
  }
  http.postRequest(app.globalData.apiUrl + "/cli/Comment/addComment", parms,
    (res) => {
      mythis.getCommentNum(commType, products_commonid, commIndex)
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
          hideHasmore: res.datas.hasmore,
          isHide: false,

        });
      }
    },
    (err) => {
      wx.showToast({
        title: err.datas.error,
        icon: 'none',
        duration: 1000
      })
    })

}
// 取消点赞
function cancelheart(comment_id, key, comments_type, products_commonid, mythis) {
  let parms = {
    comment_id: comment_id,
    key: wx.getStorageSync('key'),
    comments_type: comments_type,
    products_commonid: products_commonid
  }
  http.postRequest(app.globalData.apiUrl + "/cli/Comment/delCustComment", parms,
    (res) => { }, (err) => {
      wx.showToast({
        title: err.datas.error,
        icon: 'none',
        duration: 1000
      })
    })
}
//点赞  
function redheart(comment_id, key, comments_type, products_commonid, mythis) {
  let parms = {
    comment_id: comment_id,
    key: wx.getStorageSync('key'),
    comments_type: comments_type,
    products_commonid: products_commonid
  }
  http.postRequest(app.globalData.apiUrl + "/cli/Comment/addCustComment", parms,
    (res) => {

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
    key: wx.getStorageSync('key'),
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
          addReviewText: "一收起一"
        })
      } else {
        mythis.setData({
          addReviewText: "一更多评论一"
        })
      }
    }, (err) => {
      wx.showToast({
        title: err.datas.error,
        icon: 'none',
        duration: 1000
      })
    })

}