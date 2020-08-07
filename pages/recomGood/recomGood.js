const app = getApp();
var http = require('../../utils/httputils.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        allProject: [],
        okShow: false,
		page:1,
		rows:10
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        mythis.setData({
            key: wx.getStorageSync('key'),
        })
        recomShop(mythis.data.key,mythis.data.page,mythis.data.rows, mythis)
    },
    // 关注好友
    followShop: function(e) {
        var mythis = this;
        var index = e.currentTarget.dataset.index;
        var follow = mythis.data.listData[index].follow
        if (mythis.data.listData[index]) {
            mythis.setData({
                follow: mythis.data.listData[index].follow,
                index: e.currentTarget.dataset.index,
				friendId: e.currentTarget.dataset.id
            })
            if (!mythis.data.follow) { //关注
                payashops(mythis.data.friendId, mythis.data.key, mythis)

            } else { //取消关注
                cancelhops(mythis.data.friendId, mythis.data.key, mythis)
            }
        }
    },

    // 删除
    deleteOrder: function(e) {
        var mythis = this;
        var index = e.currentTarget.dataset.index;
        var listData = mythis.data.listData
        for (var i = 0; i < listData.length; i++) {
            if (mythis.data.listData[index] == listData[i]) {
                listData.splice(index, 1);
            }
        }
        mythis.setData({
            listData: listData
        })
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
		var mythis = this;
		if(mythis.data.hasmore){
			wx.showLoading({
				title: '玩命加载中...',
			});
			mythis.data.page = mythis.data.page + 1;
			recomShop(mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
		}
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
// 推荐好友
function recomShop(key,page,rows, mythis) {
    let parms = {
        key: wx.getStorageSync('key'),
        page: page,
        rows:rows
    }
    http.postRequest(app.globalData.apiUrl + '/cli/MyFollow/recommendFriend',parms,
    (res)=>{
        for (var i = 0; i < res.datas.cust_follow.length; i++) {
            res.datas.cust_follow[i].follow = false;
            res.datas.cust_follow[i].SearchText = '关注';
            mythis.data.allProject.push(res.datas.cust_follow[i]);
        }
        mythis.setData({
            listData: mythis.data.allProject,
            hasmore: res.datas.hasmore,
            hide: true
        });
        wx.hideLoading();
    },(err)=>{
        wx.showToast({
          title: err.datas.error,
          icon:'none',
          duration:1000
        })
    })
   
}
// 关注好友
function payashops(friendId, key, mythis) {
    let parms = {
        friendId: friendId,
            key: wx.getStorageSync('key'),
    }
    http.postRequest(app.globalData.apiUrl + "/cli/MyFollow/addFollowFriend",parms,
    (res)=>{
        mythis.data.listData[mythis.data.index].follow = true;
        mythis.data.listData[mythis.data.index].SearchText = '已关注';
        mythis.setData({
            listData: mythis.data.listData,
        })
    },(err)=>{
        wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration:1000
        })
    })
    
}

// 取关好友
function cancelhops(friendId, key, mythis) {
    let parms = {
        friendId: friendId,
        key:  wx.getStorageSync('key'),
    }
    http.postRequest(app.globalData.apiUrl + "/cli/MyFollow/cancelFollowFriend",parms,
    (res)=>{
        mythis.data.listData[mythis.data.index].follow = false;
        mythis.data.listData[mythis.data.index].SearchText = '关注';
        mythis.setData({
            listData: mythis.data.listData,
        })
    },(err)=>{
        wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration:1000
        })
    })
   
}