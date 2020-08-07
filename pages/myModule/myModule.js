// pages/myModule/myModule.js
var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js');   //相对路径
//引用
import navigateTo from "../../utils/navigateRoute.js"
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.login()
    var mythis = this;
    let isIphoneX = app.globalData.isIphoneX;
    if(!wx.getStorageSync('key')){
      navigateTo('../getUserInfo/getUserInfo')
		}
    mythis.setData({
      isIphoneX: isIphoneX
    })
    mythis.getCartNum()
    mythis.setData({
      key: wx.getStorageSync('key')
    })
    var mythis = this;
      custIndex(mythis.data.key, mythis)
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        mythis.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })

  },
  /**
   * 页面的初始数据
   */
  data: {
    hide: false,
    userName: '',
    Phone: '',
    Address: '',
    address_id: "",
    //用户个人信息
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },

    stateList: [{
      imgName:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/dingdan_1@2x11.png',
      text: '待付款',
      order: 'stateNew',
    },
    {
      imgName:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/dingdan_2@2x.png',
      text: '待发货',
      order: 'notakes',
    },
    {
      imgName:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/dingdan_3@2x11.png',
      text: '待收货',
      order: 'stateSend',
    },
    {
      imgName:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/dingdan_4@211x.png',
      text: '待评论',
      order: 'stateNoeval',
    },
    {
      imgName:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/dingdan_5@222x.png',
      text: '退/换货',
      order: 'refund',
    },
    ],
    spellList: [{
      spellImg:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/gongneng_1@2x11.png',
      spellName: '拼团',
      click: 'assemble'
    }, {
      spellImg:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/gongneng_2@2x01.png',
      spellName: '卡劵',
      click: 'cardCoupon'
    }, {
      spellImg:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/gongneng_3@2x01.png',
      spellName: '地址',
      click: 'getAddress'
    }, {
      spellImg:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/gongneng_4.png',
      spellName: '消息',
      click: 'news'
    },
    //  {
    //     spellImg:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/gongneng_5@2x.png',
    //     spellName: '客服',
    //     click: 'service'
    // },
    {
      spellImg:  app.globalData.apiUrl + '/wap/test/wap/xcxImg/gongneng_6@2x111.png',
      spellName: '设置',
      click: 'setUp',
      workSword1: "workSword1"
    },
    ]
  },
  // 购物车数量
  getCartNum: function () {
    var that = this
    let parms = {
      key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustCart/cart_count1',parms,
    (res)=>{
      that.setData({
        caetNum: res.datas.cart_count,
      });
    },
    (err)=>{
      wx.showToast({
        title: err.datas.error,
        icon:'none',
        duration:1000
      })
    })
   
  },
  goFriend: function () {
    // 好友
    navigateTo('/pages/follows/follows?type=2')
  },
  goBaby: function () {
    // 宝贝
    navigateTo('/pages/follows/follows?type=3')
  },
  goShop: function () {
    // 店铺
    navigateTo('/pages/follows/follows?type=1')
  },
 
  // 跳转活动
  goactivity: function () {
  //  navigateTo('../hot/hot')
   navigateTo('../myAssets/myAssets')
  },
  // 个人资料
  personalData: function () {
    var mythis = this;
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        mythis.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })

    navigateTo('/pages/personalData/personalData')

  },
  // 跳转地址
  getAddress: function () {
    navigateTo('../addressList/addressList?home=2')

  },
  // 购物车
  tofollow: function () {
    navigateTo('../cart/cart')

  },
  go_assets: function () {
    navigateTo('../assets/assets')
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
    this.onLoad()
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

  // 我的订单，全部
  orderLogin: function () {
    navigateTo('/pages/order/order?index=' + 0)
  },
  // 代付款
  stateNew: function () {
    navigateTo('/pages/order/order?index=' + 1)
  },
  // 待发货
  notakes: function () {
    navigateTo('/pages/order/order?index=' + 2)
  },

  // 待收货
  stateSend: function () {
    navigateTo('/pages/order/order?index=' + 3)
  },
  // 待评论
  stateNoeval: function () {
    navigateTo('/pages/order/order?index=' + 4)
  },
  // 退/货款
  refund: function () {
    navigateTo('/pages/refundRefund/refundRefund')
  },
  // 拼团
  assemble: function () {
    navigateTo('/pages/groupOrder/groupOrder')
  },
  // 卡卷
  cardCoupon: function () {
    navigateTo('/pages/cardCoupon/cardCoupon')
  },
  // 消息
  news: function () {
    navigateTo('/pages/myNews/newHome/newHome')
  },
  // 设置
  setUp: function () {
    navigateTo('/pages/set/set')
  },
  // 首页
  toindex: function () {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  goproduct_class: function () {
    navigateTo('/pages/products_class/products_class')
  }
})
// 个人资料
function custIndex(key, mythis) {
  let prams = {
    key: wx.getStorageSync('key')
  }
  http.postRequest(app.globalData.apiUrl + '/cli/CustIndex/index', prams,
    function (res) {
      var custName = res.datas.cust_info;
      wx.setStorageSync('avatar', res.datas.cust_info.avatar);
      mythis.setData({
        custName: res.datas.cust_info,
        order_noeval_count: res.datas.cust_info.order_noeval_count,
        order_nopay_count: res.datas.cust_info.order_nopay_count,
        order_noreceipt_count: res.datas.cust_info.order_noreceipt_count,
        order_notakes_count: res.datas.cust_info.order_notakes_count,
        order_return: res.datas.cust_info.return,
        hide: true
      })

    },
    function (err) {
      wx.showToast({
        title: err.datas.error,
        icon: 'none',
        duration: 1500
      })
    })
}
