// pages/evaluation/evaluation.js
var app = getApp();
var key = wx.getStorageSync('key')
var http = require('../../utils/httputils.js');   //相对路径
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
        describe_1: 0, // 描述相符   选中
        describe_2: 5, //描述相符
        service_1: 0, // 服务态度  选中
        service_2: 5, // 服务态度
        speed_1: 0, //发货速度  选中
        speed_2: 5, //发货速度
        dataText: [],
        productsId: [],
        hide:false

    },
    // 描述相符
    in_xin: function (e) {
        var mythis = this;
        var in_xin = e.currentTarget.dataset.in;
        var twoId = e.currentTarget.dataset.id;
        var describe_1;
        if (in_xin === 'use_sc2') {
            describe_1 = Number(e.currentTarget.id);

        } else {
            describe_1 = Number(e.currentTarget.id) + this.data.describe_1;
        }
        this.setData({
            describe_1: describe_1,
            describe_2: 5 - describe_1
        })


        // for (var g = 0; g < mythis.data.comList.length; g++) {
        //     if (in_xin === 'use_sc2') {
        //         mythis.data.comList[g].describe_1 = Number(e.currentTarget.id);
        //         mythis.data.comList[g].describe_2 = 5 - mythis.data.comList[g].describe_1
        //         describe_1 = Number(e.currentTarget.id);
        //         this.setData({
        //             describe_1: mythis.data.comList[g].describe_1,
        //             comList: mythis.data.comList
        //         })
        //     } else if (in_xin === 'use_sc2') {
        //         describe_1 = Number(e.currentTarget.id) + this.data.describe_1;
        //         mythis.data.comList[g].describe_1 = Number(e.currentTarget.id) + mythis.data.describe_1;
        //         mythis.data.comList[g].describe_2 = 5 - mythis.data.comList[g].describe_1
        //         this.setData({
        //             describe_1: mythis.data.comList[g].describe_1,
        //             comList: mythis.data.comList
        //         })
        //     }
        // }
    },
    // 服务态度
    service: function (e) {
        var mythis = this;
        var in_xin = e.currentTarget.dataset.in;
        var oneId = e.currentTarget.dataset.id;
        var service_1;
        if (in_xin === 'use_sc2') {
            service_1 = Number(e.currentTarget.id);

        } else {
            service_1 = Number(e.currentTarget.id) + this.data.service_1;
        }
        this.setData({
            service_1: service_1,
            service_2: 5 - service_1
        })

        // for (var j = 0; j < mythis.data.comList.length; j++) {
        //     if (in_xin === 'use_sc2' && mythis.data.comList[j].products_id == oneId) {
        //         mythis.data.comList[j].service_1 = Number(e.currentTarget.id);
        //         mythis.data.comList[j].service_2 = 5 - mythis.data.comList[j].service_1
        //         service_1 = Number(e.currentTarget.id);
        //         this.setData({
        //             service_1: mythis.data.comList[j].service_1,
        //             comList: mythis.data.comList
        //         })
        //     } else if (in_xin === 'use_sc2' && mythis.data.comList[j].products_id == oneId) {
        //         service_1 = Number(e.currentTarget.id) + this.data.service_1;
        //         mythis.data.comList[j].service_1 = Number(e.currentTarget.id) + mythis.data.service_1;
        //         mythis.data.comList[j].service_2 = 5 - mythis.data.comList[j].service_1
        //         this.setData({
        //             service_1: mythis.data.comList[j].service_1,
        //             comList: mythis.data.comList
        //         })
        //     }
        // }


        // console.log(service_1)
    },

    // 发货速度
    speed: function (e) {
        var mythis = this;
        var in_xin = e.currentTarget.dataset.in;
        var in_Id = e.currentTarget.dataset.id;
        var speed_1;

        if (in_xin === 'use_sc2') {
            speed_1 = Number(e.currentTarget.id);

        } else {
            speed_1 = Number(e.currentTarget.id) + this.data.speed_1;
        }
        this.setData({
            speed_1: speed_1,
            speed_2: 5 - speed_1
        })
        // mythis.setData({
        //     addId: e.currentTarget.dataset.index
        // })
        // for (var k = 0; k < mythis.data.comList.length; k++) {
        //     if (in_xin === 'use_sc2' && mythis.data.comList[k].products_id == in_Id) {
        //         mythis.data.comList[k].speed_1 = Number(e.currentTarget.id);
        //         mythis.data.comList[k].speed_2 = 5 - mythis.data.comList[k].speed_1
        //         speed_1 = Number(e.currentTarget.id);
        //         mythis.setData({
        //             speed_1: mythis.data.comList[k].speed_1,
        //             comList: mythis.data.comList
        //         })
        //         console.log(mythis.data.comList)
        //     } else if (in_xin === 'use_sc' && mythis.data.comList[k].products_id == in_Id) {
        //         mythis.data.comList[k].speed_1 = Number(e.currentTarget.id) + mythis.data.speed_1;
        //         mythis.data.comList[k].speed_2 = 5 - mythis.data.comList[k].speed_1
        //         speed_1 = Number(e.currentTarget.id) + mythis.data.speed_1;
        //         mythis.setData({
        //             speed_1: mythis.data.comList[k].speed_1,
        //             comList: mythis.data.comList
        //         })
        //         console.log(mythis.data.comList)
        //     }
        // }
        // mythis.setData({
        //     speed_1: speed_1,
        //     speed_2: 5 - speed_1,
        // })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mythis = this;
        if (!wx.getStorageSync('key')) {
            app.login()
        }
        mythis.setData({
            key: wx.getStorageSync('key'),
            id: options.rec_id,
            pay_sn: options.pay_sn,
            order_id: options.order_id
        })

        confirOrder(mythis.data.key, mythis.data.id, mythis.data.pay_sn, mythis.data.order_id, mythis)
    },
    // 发布评论
    suComment: function (e) {
        var mythis = this;
        mythis.setData({
            order_id: e.currentTarget.dataset.id
        })


        // submOrder()
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
                        // console.log(that.data.avatar)
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

                // console.log(that.data.evaluate_image)

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
        http.postRequest(app.globalData.apiUrl + '/cli/CustEvaluate/add', parms,
            (res) => {
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 1500
                })
                wx.redirectTo({
                    url: '/pages/orderDetails/orderDetails?order_id=' + mythis.data.order_id,
                })
            }, (err) => {
                wx.showToast({
                    title: err.datas.error,
                    icon: 'none',
                    duration: 1000
                })
            })

    },

})
//渲染评论列表
function confirOrder(key, id, pay_sn, order_id, mythis) {
    // wx.showLoading({
    //     title: '加载中...',
    // })
    let parms = {
        key: wx.getStorageSync('key'),
        rec_id: id,
        pay_sn: pay_sn,
        order_id: order_id
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustEvaluate/index', parms,
        (res) => {
            var comList = res.datas.order_products
            for (var i in comList) {
                comList[i].speed_1 = 5
                comList[i].speed_2 = 5 - comList[i].speed_1
                comList[i].service_1 = 5
                comList[i].service_2 = 5 - comList[i].speed_1
                comList[i].describe_1 = 5
                comList[i].describe_2 = 5 - comList[i].describe_1
            }
            mythis.setData({
                productsId: mythis.data.productsId,
                comList: comList,
                rec_id: res.datas.order_products[0].rec_id,
                hide:true
            })

            // wx.hideLoading()
        }, (err) => {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1000

            })
        })

}