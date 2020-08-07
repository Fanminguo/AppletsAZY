// pages/addressList/addressList.js
var app = getApp();
import navigateTo from "../../utils/navigateRoute.js"
var key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
		hide:false,
        userName: '',
        Phone: '',
        Address: '',
        showAddress: true,
    },
    // 编辑地址
    goModify: function(e) {
        var addressId = e.currentTarget.dataset.id
        wx.redirectTo({
            url:"../addressList/address/address?address_id=" + addressId +'&home=' + this.data.home
        })
    },
    // 跳转订单
    goSubm: function(e) {
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面
        beforePage.setData({
                address_id: e.currentTarget.dataset.id,
            }),
            wx.navigateBack({
                success: function() {
                    beforePage.queryData(); // 执行前一个页面的onLoad方法
                }
            });
           
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let mythis = this;
		if (!wx.getStorageSync('key')) {
			app.login();
		}
		mythis.setData({
            key: wx.getStorageSync('key'),
            home:options.home
		})
        returnAll(mythis.data.key, mythis)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
		// this.onLoad()
    },	

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
		
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    // 添加收货地址
    getAddress: function() {
        wx.redirectTo({
          url: '/pages/addressList/address/address?home=' + this.data.home
        })
    },

})
// 地址列表
function returnAll(key, mythis) {
	let parms = {
        key :  wx.getStorageSync('key')
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustAddress/address_list',parms,
    function(res){
        var ressList = res.datas.address_list
        mythis.setData({
            ressList: res.datas.address_list,
            hide:true
        })
    },function(err){
        wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1500
          })
    })
   
}