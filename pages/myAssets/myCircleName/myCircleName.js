// pages/myAssets/myCircleName/myCircleName.js
const app = getApp()
var http = require('../../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.pc_label_id) {
      this.setData({
        pc_label_id: options.pc_label_id,
      })
    } else {
      this.setData({
        codeM: options.codeM
      })
    }

  },
  //获取用户输入的用户名
  circleName: function (e) {
    this.setData({
      circleName: e.detail.value
    })
  },
  nameBtn: function () {
    var that = this
    //修改名字
    if (that.data.codeM) {
      let parms = {
        key: wx.getStorageSync('key'),
        momentsName: that.data.circleName,
        codeM: that.data.codeM

      }
      if (that.data.circleName == "") {
        wx.showToast({
          icon: "none",
          title: "请输入圈子昵称",
          duration: 1000
        })
        return;
      }
      http.postRequest(app.globalData.apiUrl + '/cli/custMoment/modifyMomentsName', parms,
        (res) => {
          // wx.redirectTo({
          //   url: '../myCircle/myCircle',
          // })
          var pages = getCurrentPages()
          var beforePage = pages[pages.length - 2];
          beforePage.queryData();
          wx.navigateBack({
                delta: 1,
          });
          // var pages = getCurrentPages(); // 当前页面
          // var beforePage = pages[pages.length - 1]; // 前一个页面
          // var bbeforePage = pages[pages.length - 2];
          // // beforePage.queryData(); // 执行前一个页面的onLoad方法
          // bbeforePage.setData({
          //   momentsList: [],
          //   page: 1
          // })
          // bbeforePage.queryData()
          // setTimeout(function () {
          //   wx.navigateBack({
          //     delta: 1,
          //   });
          // }, 400)

        }, (err) => {
          wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1000
          })
        })
    } else {
      //创建朋友圈
      let parms = {
        key: wx.getStorageSync('key'),
        momentsName: that.data.circleName,
        pc_label_id: that.data.pc_label_id,
      }
      if (that.data.circleName == "") {
        wx.showToast({
          icon: "none",
          title: "请输入圈子昵称",
          duration: 1000
        })
        return;
      }
      http.postRequest(app.globalData.apiUrl + '/cli/custMoment/getMomentsQrcodeUrl', parms,
        (res) => {
          // var pages = getCurrentPages(); // 当前页面
          // var beforePage = pages[pages.length - 2]; // 前一个页面
          // beforePage.setData({
          //   momentsList: [],
          //   page: 1
          // })
          // beforePage.onLoad(); // 执行前一个页面的onLoad方法
          // wx.navigateBack({
          //   delta: 2,
          // });
          wx.redirectTo({
            url: '../myCircle/myCircle',
          })
        }, (err) => {
          wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1000
          })
        })
    }

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