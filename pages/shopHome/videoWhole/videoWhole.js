
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
    loop: true,
    hide: false,
    playState: true,
    chooseText: "默认", //已选择文案
    an: "", //商品列表弹窗
    an1: "", //商品规格弹窗
    num: 1, // 数量初始化1
    products_map_spec: [], //规格
    video_info: '',
    home: 0,
    number: -1,
    choose_num: "5",
    gesture: false,
    hideCanvas: false,
    shareHide: false,
    posetrCodeUrl: "",//二维码

  },
  doubleClick: function (e) {
    let diffTouch = this.touchEndTime - this.touchStartTime;
    let curTime = e.timeStamp;
    let lastTime = this.lastTapDiffTime;
    this.lastTapDiffTime = curTime;
    //两次点击间隔小于300ms, 认为是双击
    let diff = curTime - lastTime;
    if (diff < 300) {
      // clearTimeout(this.lastTapTimeoutFunc); // 成功触发双击事件时，取消单击事件的执行
      // wx.showModal({
      //   title: '提示',
      //   content: '双击事件被触发',
      //   showCancel: false
      // })
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
      this.changePlayStatus()
    }

  },
  /// 拼团
  getgroup: function (e) {
    var that = this
    var products_id = e.currentTarget.dataset.products_id;
    that.choosegoods(products_id);
    that.setData({
      anGroup: "up"
    })
  },
  closeGroup: function () {
    this.setData({
      anGroup: "down"
    })
  },
  chooseNum: function (e) {
    this.setData({
      choose_num: e.currentTarget.dataset.num,
      choose_price: e.currentTarget.dataset.price
    })
  },
  // 暂停
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
        posetrCodeUrl: 'https://bj.aizhiyi.com/playback/?store_id=' + store_id + '&agent_code=' + agent_code + '&notice_id=' + notice_id
      })
      console.log(1)
    } else {
      this.setData({
        store_id: options.store_id,
        notice_id: options.notice_id,
        agent_code: options.agent_code,
        home: options.home,
        posetrCodeUrl: 'https://bj.aizhiyi.com/playback/?store_id=' + options.store_id + '&agent_code=' + options.agent_code + '&notice_id=' + options.notice_id
      })
    }
    if (this.data.agent_code) {
      this.getFriend(this.data.agent_code);
    }
    this.noticeData()
    this.code()
  },
  // 精彩回放
  noticeData: function () {
    let that = this
    let parms = {
      store_id: that.data.store_id,
      notice_id: that.data.notice_id,
      cust_id: wx.getStorageSync('cust_id')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/Live/getPlayback', parms,
      (res) => {
        that.setData({
          hide: true,
          video_info: res.datas.video_info
        })
      }, (err) => {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../shopHome?store_id=' + that.data.store_id,
          })
        }, 1500) //延迟时间 这里是1秒

      })
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
  byeReturn: function () {
    var that = this;
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
  // 生成二维码   店铺
  code: function (e) {
    var that = this
    new QRCode('myQrcode', {
      text: that.data.posetrCodeUrl,
      // text:'https://bj.aizhiyi.com/notice/?store_id=331&agent_code=CUU1Q0L&notice_id=828',
      width: 77,
      height: 77,
      padding: 1, // 生成二维码四周自动留边宽度，不传入默认为0
      // correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res)
        that.setData({
          hide: true,
          posetrCodeUrl: res.path
        })
        console.log(this.data.posetrCodeUrl)
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
    // type=1   回放 2= 预告 3 = 直播
    // kf_qr_img  客服二维码
    // transverse_notice_image   海报banner
    // store_name店铺名称
    // store_avatar 店铺头像
    // store_collect  粉丝数量
    // notice_title 标题
    // fans 观看人数
    // item 开播时间
    this.canvas.adaptation(this.data.posetrCodeUrl, 1, this.data.video_info.kf_qr_img, this.data.video_info.transverse_notice_image, this.data.video_info.store_name, this.data.video_info.store_avatar, this.data.video_info.store_collect, this.data.video_info.notice_title, this.data.video_info.cust_nickname, this.data.video_info.cust_avatar, '', '');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCartNum()
    this.getFriend(this.data.agent_code)
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
  // 立即购买
  gobefore: function () {
    var that = this;
    if (that.data.data.isgroupbuy && that.data.num > 1) {
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
    param.groupbuy_number = that.data.choose_num;
    param.groupbuy_type = 'originate'
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
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
          return
        } else {

          navigateTo('../../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num + "&gdID=" + that.data.products_id)
          that.setData({
            num: 1
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  gobuy: util.throttle(function (e) {
    var that = this;
    if (that.data.isgroupbuy) {
      that.gobefore()
      return;
    }
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });

    var param = {};
    param.groupbuy_type = null
    param.cart_id = productsId + "|" + that.data.num;
    param.key = wx.getStorageSync('key');
    param.gdID = productsId;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + '/cli/CustBuy/order_confirm',
      method: "POST",
      data: param,
      success: function (res) {
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
          return
        } else {
          navigateTo('../../buy/buy?products_id=' + productsId + '&buynum=' + that.data.num + "&gdID=" + productsId)
          that.setData({
            num: 1
          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })

  }, 3000),
  // 加入购物车
  joincart: function () {
    app.join_cart(this.data.products_id, this.data.num);
    this.setData({
      an1: "down",
    })
    this.getCartNum()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var url = 'pages/shopHome/videoWhole/videoWhole?store_id=' + this.data.store_id + "&notice_id=" + this.data.notice_id + "&agent_code=" + wx.getStorageSync('agent_code')
    var title = this.data.video_info.notice_title
    var imageUrl = this.data.video_info.transverse_notice_image
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
    if (wx.getStorageSync('key')) {
      var store_id = e.currentTarget.dataset.store_id
      var notice_id = that.data.notice_id
      that.queryGoodsList(store_id, notice_id)
      that.setData({
        an: "up"
      })
    } else {
      navigateTo("../../getUserInfo/getUserInfo")
    }

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
      page: 1,
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
  gocart: function (e) {
    var num = e.currentTarget.dataset.id
    if (wx.getStorageSync('key')) {
      if (num >= 1) {
        navigateTo('../../cart/cart')
      } else {
        wx.showToast({
          title: '购物车暂无商品哦~',
          icon: "none",
          duration: 1500
        })
      }
    } else {
      navigateTo("../../getUserInfo/getUserInfo")
    }
  }, //购物车数量
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
            num: 1
          });
        }
      },
      complete: function () {

      }
    });
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
    that.setData({
      products_map_spec: [],
      chooseText: '默认'
    })
    const wxreq = wx.request({
      url: app.globalData.apiUrl + '/cli/Products/products_detail',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        key: wx.getStorageSync('key')
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
                    products_specs['products_spec_value'] = specs_value;//问题在这

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
          data: res.data.datas,
          products_id: products_id,
          imgUrls: res.data.datas.products_image.split(","),
          goods_price: res.data.datas.products_info.products_price,
          products_promotion_price: res.data.datas.products_info.products_promotion_price,
          products_price: res.data.datas.products_info.products_price,
          products_promotion_type: res.data.datas.products_info.products_promotion_type,
          goods_detail: res.data.datas,
          isgroupbuy: res.data.datas.isgroupbuy,
        })
        if (that.data.isgroupbuy) {
          that.setData({
            choose_price: res.data.datas.groupbuy_commonInfo.groupbuy_price5
          })
        }
      }, complete: function () {
        wx.hideLoading()
      },
      fail: function (res) {
        this.userData = "数据获取失败";
      }
    })
  },
  govideo: function (e) {
    var products_commonid = e.currentTarget.dataset.products_commonid;
    var products_id = e.currentTarget.dataset.products_id;
    navigateTo('../../commodity/commodity?products_commonid=' + products_commonid + '&products_id=' + products_id + "&is_back=yes")
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
function decodeUnicode(str) {
  var ret = '';
  var splits = str.split(';');
  for (let i = 0; i < splits.length; i++) {
    ret += spliteDecode(splits[i]);
  }
  return ret;
}
function gup(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  return results == null ? null : results[1];
}