// pages/myNews/index/index.js
const time = require('../../../utils/util.js');
var app = getApp();
var key = wx.getStorageSync('key')
import navigateTo from "../../../utils/navigateRoute.js"
var http = require('../../../utils/httputils.js');   //相对路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide: false
  },
  // 物流
  logistics: function () {
    navigateTo('/pages/myNews/newsInform/newsInform')
  },
  //账户消息
  account: function () {
    navigateTo('/pages/myNews/newsAccount/newsAccount?type=1')
  },
  // 服务通知
  service: function () {
    navigateTo('/pages/myNews/newsWaiter/newsWaiter?type=2')
  },
  // 互动通知
  interaction: function () {
    navigateTo('/pages/myNews/Interaction/Interaction')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mythis = this;
    mythis.setData({
      key: wx.getStorageSync('key')
    })
    myNews(mythis.data.key, mythis)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var mythis = this;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var mythis = this
    myNews(mythis.data.key, mythis)
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})

function myNews(key, mythis) {
  let parms = {
    key: key
  }
  http.postRequest(app.globalData.apiUrl + '/cli/CustMobileMessage/myMessage', parms,
    (res) => {
      // deliver_message 交易物流
      var article = res.datas.deliver_message.shipping_time;
      var deliver = res.datas.deliver_message.order_logistics;
      if (article != undefined) {
        article = time.formatTimeTwo(article, 'Y-M-D')
      } else {
        article = ''
      }
      if (deliver != undefined) {
        deliver: deliver
      }
      else {
        deliver = '暂无消息'

      }
      mythis.setData({
        tiem: article,
        deliver: deliver
      })
      // account_message   账号通知
      var notify = res.datas.account_message.message_time;
      var notifyMessage = res.datas.account_message.message_body;
      if (notify != undefined) {
        notify = time.formatTimeTwo(notify, 'Y-M-D')
      } else {
        notify = ''
      }
      if (notifyMessage != undefined) {
        notifyMessage: notifyMessage
      }
      else {
        notifyMessage = '暂无消息'

      }
      mythis.setData({
        notify: notify,
        notifyMessage: notifyMessage
      })
      //service_message   服务通知
      var service = res.datas.service_message.message_time
      var serviceMessage = res.datas.service_message.message_body
      if (service != undefined) {
        service = time.formatTimeTwo(service, 'Y-M-D')
      } else {
        service = ''
      }
      if (serviceMessage != undefined) {
        serviceMessage: serviceMessage
      }
      else {
        serviceMessage = '暂无消息'

      }
      mythis.setData({
        service: service,
        serviceMessage: serviceMessage
      })
      //tourist_review  互动消息
      var tourist = res.datas.tourist_review.geval_addtime
      var touristReview = res.datas.tourist_review.comment_content
      if (tourist != undefined) {
        tourist = time.formatTimeTwo(tourist, 'Y-M-D')
      } else {
        tourist = ''
      }
      if (touristReview != undefined) {
        touristReview: touristReview
      }
      else {
        touristReview = '暂无消息'

      }
      mythis.setData({
        tourist: tourist,
        touristReview: touristReview
      })

      mythis.setData({
        // deliver_count物流消息未读数量
        deliver_count: res.datas.cust_last_message.deliver_count,
        // account_count账户消息未读数量
        account_count: res.datas.cust_last_message.account_count,
        // service_count服务消息未读数量
        service_count: res.datas.cust_last_message.service_count,
        //tourist_review_count互动消息未读数量
        tourist_review_count: res.datas.cust_last_message.tourist_review_count,
        hide: true
      })
    },
    (err) => {
      wx.showToast({
        title: err.datas.error,
      })
    })
  
}