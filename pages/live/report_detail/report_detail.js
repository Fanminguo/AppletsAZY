var app = getApp();
var key = wx.getStorageSync('key')
var store_id;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        report_describe: "", //举报原因
        report_image: [],
        min: 0, //最少字数
        max:300, //最多字数 ,
        id:"",//举报理由
        
    },
    return:function(){
        wx.navigateBack({
            delta: 1,
        });
    },
    imgDialogHIde:function(){
        var that =this;
        that.setData({
            is_showDialog:false
        });
    },
    // 输入框
    bindTextAreaBlur: function (e) {
        // 获取输入框的内容
        var value = e.detail.value;
        // 获取输入框内容的长度
        var len = parseInt(value.length);
        //最多字数限制
        if (len > this.data.max) return;
        // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
        this.setData({
        currentWordNumber: len, //当前字数
        report_describe:value
        });
    },
    // 上传图片
    upShopLogo: function(e) {
        var that = this;
        var dataId = e.currentTarget.dataset.id
        that.setData({
            dataId: e.currentTarget.dataset.id
        })
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#f7982a",
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImageShop('album'); //从相册中选择
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImageShop('camera'); //手机拍照
                    }
                }
            }
        })
    },
    chooseWxImageShop: function(type) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function(res) {
                if (that.data.dataId == 1) {
                    that.data.avatar = res.tempFilePaths[0]
                    that.setData({
                        avatar: res.tempFilePaths[0]
                    });
                } else if (that.data.dataId == 2) {
                    that.data.avatarTow = res.tempFilePaths[0]
                    that.setData({
                        avatarTow: res.tempFilePaths[0]
                    });
                } else if (that.data.dataId == 3) {
                    that.data.avatarthree = res.tempFilePaths[0]
                    that.setData({
                        avatarthree: res.tempFilePaths[0]
                    });
                }
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1500
                })
                that.upload_file(app.globalData.apiUrl+'/cli/CustRefund/upload_pic', res.tempFilePaths[0])


            }
        })
    },
    upload_file: function(url, filePath) {
        var that = this;
        wx.uploadFile({
            url: app.globalData.apiUrl+"/cli/CustRefund/upload_pic", //后台处理接口
            filePath: filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            formData: { //需要的参数
                'key': wx.getStorageSync('key')
            }, // HTTP 请求中其他额外的 form data
            success: function(res) {
                var data = JSON.parse(res.data);
                that.data.report_image.push(data.datas.file_name)
            },
            fail: function(res) {}
        })
    },
   
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let mythis = this
        store_id=options.store_id;
        // 获取上页面参数
        mythis.setData({
			id: options.id,
            inner: options.inner,
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

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    submiSsion: function() {
        var that = this
        if (that.data.report_describe !="" && that.data.report_image.length !=0) {
            orderReturn(that.data.id,that.data.report_describe,that.data.report_image)
        } else {
            wx.showToast({
                title: '请完善举报信息',
                icon: 'none',
                duration: 1000
            })
        }
    }
})



// 提交
function orderReturn(id,report_describe,report_image) {
    wx.showLoading({
        title: '请稍后...',
        mask: true
      });
    wx.request({
        url: app.globalData.apiUrl+'/cli/LiveMyAnchor/report',
        data: {
            key: wx.getStorageSync('key'),
            report_reason:id,
            report_describe: report_describe,
            report_image: report_image,
            store_id:store_id
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded',
			"key": wx.getStorageSync('key'),
        },
        method: "POST",
        success: function(res) {
            if (res.data.code == 200) {
                let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
                let prevPage = pages[ pages.length - 3 ]; 
                prevPage.setData({  
                    is_showReport:false,
                    isReportSuccess:true,
                })
                wx.navigateBack({
                    delta: 2,
                });
            }
            
        },
        fail: function(res) {},
        complete: function(res) { wx.hideLoading()},
    })
}