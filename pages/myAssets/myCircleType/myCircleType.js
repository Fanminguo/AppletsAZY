// pages/myAssets/myCircleType/myCircleType.js
var app = getApp();
var http = require('../../../utils/httputils.js');   //相对路径
import navigateTo from "../../../utils/navigateRoute.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    click_select: [], //小数组选中标识
    label_id: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mythis = this;
    shopName(mythis)
    for (var i in mythis.data.labelId) {
        mythis.data.label_id.push(mythis.data.labelId[i])
    }
    
},
// 提交
  selection:function(e){
    var pc_label_id=e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../myCircleName/myCircleName?pc_label_id='+pc_label_id
    })
    // navigateTo('../myCircleName/myCircleName?pc_label_id='+pc_label_id)
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
  // onShareAppMessage: function () {

  // }
})
// 显示全部标签
function shopName(mythis) {
  var click_select = mythis.data.click_select;
  let parms = { key: wx.getStorageSync('key'), }
  http.postRequest(app.globalData.apiUrl + '/cli/custMoment/pcLabelList', parms,
      function (res) {
          
          mythis.setData({
              list:res.datas
          })
      }, function (err) {
          wx.showToast({
              title: err.datas.error,
              icon: 'none',
              duration: 1500
          })
      })
}