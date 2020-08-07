// pages/evaluation/evaluation.js
var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        max: 100, //最多字数 
        avatar: "",
        avatarTow: "",
        avatarthree: "",
        evaluate_image: [],

        dataText: [],
        productsId: []

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        mythis.setData({
            key: wx.getStorageSync('key'),
            pay_sn: options.pay_sn,
            order_id: options.order_id
        })
        mythis.zhuiping(mythis)
    },
    zhuiping: (mythis) => {
        let parms = {
            key:wx.getStorageSync('key'),
            order_id:mythis.data.order_id,
            pay_sn:mythis.data.pay_sn
        }
        http.getRequest(app.globalData.apiUrl + '/cli/CustEvaluate/again_mobile', parms,
            (res) => {
                mythis.setData({
                    comList:res.datas.evaluate_products
                })
               
            }, (err) => {
                wx.showToast({
                  title: err.datas.error,
                  icon:'none',
                  duration:1000
                })
            })
    },
    // 发布评论
    suComment: function (e) {
        var mythis = this;
        mythis.setData({
            order_id: e.currentTarget.dataset.id
        })


    },
    // 评论内容
    bindTextAreaBlur: function (e) {
        var mythis = this
        // 获取输入框的内容
        var value = e.detail.value;
        // 获取输入框内容的长度
        var len = parseInt(value.length);
        mythis.setData({
            buyer_message: e.detail.value
        })
        if (len > this.data.max) {
            wx.showToast({
                title: '最多不能多于100个字符',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
        mythis.setData({
            currentWordNumber: len //当前字数  
        });

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
    onShareAppMessage: function () {

    },

    // 上传图片
    upShopLogo: function (e) {
        var that = this;
        that.setData({
            dataId: e.currentTarget.dataset.name,
            dataRec: e.currentTarget.dataset.id,
        })
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#f7982a",
            success: function (res) {
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
    chooseWxImageShop: function (type) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function (res) {
                var comList = that.data.comList;
                for (var i in comList) {
                    if (that.data.dataId == 1 && comList[i].rec_id == that.data.dataRec) {
                        comList[i].avatar = res.tempFilePaths[0]
                        that.setData({
                            comList: comList
                        });
                    } else if (that.data.dataId == 2 && comList[i].rec_id == that.data.dataRec) {
                        comList[i].avatarTow = res.tempFilePaths[0]
                        that.setData({
                            comList: comList
                        });
                    } else if (that.data.dataId == 3 && comList[i].rec_id == that.data.dataRec) {
                        comList[i].avatarthree = res.tempFilePaths[0]
                        that.setData({
                            comList: comList
                        });
                    }
                }
                that.upload_file(app.globalData.loadUrl + '/cli/SnsAlbum/file_upload', res.tempFilePaths[0])
            }
        })
    },
    upload_file: function (url, filePath) {
        var that = this;
        wx.uploadFile({
            url: app.globalData.loadUrl + "/cli/SnsAlbum/file_upload", //后台处理接口
            filePath: filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            formData: { //需要的参数
                'key': that.data.key
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
                var comList = that.data.comList;
                var data = JSON.parse(res.data);
                for (var k in comList) {
                    if (that.data.dataId == 1 && comList[k].rec_id == that.data.dataRec) {
                        comList[k].evaluate_image1 = data.datas.file_name
                        that.setData({
                            comList: comList
                        })
                    } else if (that.data.dataId == 2 && comList[k].rec_id == that.data.dataRec) {
                        comList[k].evaluate_image2 = data.datas.file_name
                        that.setData({
                            comList: comList
                        })
                    } else if (that.data.dataId == 3 && comList[k].rec_id == that.data.dataRec) {
                        comList[k].evaluate_image3 = data.datas.file_name
                        that.setData({
                            comList: comList
                        })
                    }
                }
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1500
                })
            },
            fail: function (res) { }
        })
    },
    formSubmit: function (e) {
        var listData = JSON.stringify(e.detail.value)
        var mythis = this;
        let parms = {
            key: mythis.data.key,
                order_id: mythis.data.order_id,
                data: listData
        }
        http.postRequest(app.globalData.apiUrl + '/cli/CustEvaluate/add_again',parms,
        (res)=>{
            wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 1500
            })
            wx.redirectTo({
                url: '/pages/orderDetails/orderDetails?order_id=' + mythis.data.order_id,
            })
        },(err)=>{
            wx.showToast({
              title: err.datas.error,
              icon:'none',
              duration: 1500
            })
        })
       
    },

})
