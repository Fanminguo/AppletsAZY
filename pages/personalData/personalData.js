// pages/personalData/personalData.js
var app = getApp();
var key = wx.getStorageSync('key')
// var area = require('../../utils/area.js')
var areaInfo = []; //所有省市区县数据
var provinces = []; //省
var citys = []; //城市
var countys = []; //区县
var index = [0, 0, 0];
var cellId;
var t = 0;
var show = false;
var moveY = 200;
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');   //相对路径
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hide: false,
        array: ['请选择','男', '女'],
        index: 0,
        cust_sex: 0,
        avatar: '',
        nickname: '',
        cust_birthday: '',
        multiArray: [], //	
        multiIndex: [0, 0], // 行业数组下标
        custText: '', //默认
        addressItems: [],
        addressValue: [0, 0, 0], //  当前选择的省市区对应的下标value
        addresSelect: [], // 确定选择的省市区name/id
        itemsName: "",
        area: []


    },
    goInterest: function () {
        // 我感兴趣的
        var mythis = this;
        navigateTo('interest/interest?label=' + mythis.data.label)
    },
    //滑动事件
    bindChange: function (e) {
        var val = e.detail.value
        var address = this.data.addressItems;
        this.setData({
            citys: address[val[0]].children,
            countys: address[val[0]].children[val[1]].children,
            addressValue: val
        })
    },



    bindMultiPickerChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value);
        var secondList = this.data.secondList;
        var select_key = e.detail.value[1]; //去二维数组中第二项的下标取出来，也就是二级下拉菜单的下标值
        this.setData({
            industryTwoId: secondList[select_key]['id']　　　　　　 //  拿到下标值对应的id值就是我们要用的id
        })

        this.setData({
            multiIndex: e.detail.value
        });
        // 通过triggerEvent绑定的myEvent方法，把一级下拉的id和二级下拉的id拿出来
        this.triggerEvent('myEvent', {
            industryOneId: this.data.industryOneId,
            industryTwoId: this.data.industryTwoId
        })
        //  console.log(this.data.industryTwoId)
        industry(this.data.industryTwoId, this)
    },
    bindMultiPickerColumnChange: function (e) {
        var that = this;
        let industryOneId_session = that.data.industryOneId; //  先将滚动前的一级菜单id存下来，便于之后做对比
        switch (e.detail.column) {
            case 0:
                let firstList = that.data.firstList;
                var firstId = firstList[e.detail.value]['id'];
                if (industryOneId_session != firstId) { //每次滚动的时候都去和上一个做一次对比
                    that.searchClassInfo(firstId); // 只要不一样，就去执行上面searchClassInfo()这个方法
                }
                that.data.multiIndex[1] = 0;
                break;
        }
    },
    getData(e) {
        let data = e.detail;
        this.setData({
            industryOneId: data.industryOneId,
            industryTwoId: data.industryTwoId
        });
        // console.log(this.data.industryOneId);
        //console.log(this.data.industryTwoId);
    },
    /**
     * 组件的方法列表
     */
    // 获取行业分类checkCorp.industry
    getIndustry() {
        let that = this;
        let temporary = { //--------------因为接口数据返回的是从第一项开始的，这里加一个请选择选项放入数据的开头
            occupation_name: that.data.custText,
            id: "0",
            children: [{
                occupation_name: '',
                id: '0'
            }]
        }
        let firstList = that.data.multiArrayNum; //---------------------将一级分类数组放入新的变量里便于操作
        firstList.unshift(temporary);
        // console.log(firstList);
        let industryName = firstList.map(m => {
            return m.occupation_name //------------------------获取一级下拉列表的名称
        });
        that.setData({
            multiArray: [industryName, []], //----------- 将一级列表的名称存入二维数组的第一项
            firstList, // ------------一级的完整数据 先存着后面有用
            industryName //---------------一级的名称 先存着后面有用
        });
        let industryOneId = firstList[0]['id']; //  一级菜单默认的id
        if (industryOneId) {
            that.searchClassInfo(industryOneId); //如果存在，去掉取相应数组下的list
        }
    },

    searchClassInfo(id) {
        let that = this;
        if (id) {
            that.setData({
                industryOneId: id //这个是一级列表中用户选中的id
            });
            that.data.firstList.map(m => { //firstList是一级分类的数组，上方代码里有
                if (m.id == id) { //通过比对查出id对应的这一列
                    that.setData({
                        secondList: m.child //用户选中的一级分类中的children就是第二列的列表
                    })
                }
            });
            // console.log(that.data.secondList);
            if (that.data.secondList) {
                let industryTwoName = that.data.secondList.map(m => {
                    return m.occupation_name //再遍历secondList把所有的label取出来放入industryTwoName 中用于二级列表的展示
                });
                // console.log(industryTwoName);
                let industryName = that.data.industryName;
                that.setData({
                    multiArray: [industryName, industryTwoName], //这就是一个完整的二级联动展示了
                    industryTwoName,
                })
            }

        }
    },

    // 我的二维码页面
    meCode: function () {
        wx.navigateTo('meCode/meCode')
    },
    upShopLogo: function () {
        var that = this;
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
                //console.log(res)
                that.data.avatar = res.tempFilePaths[0],
                    that.upload_file(app.globalData.apiUrl + '/cli/CustInformation/upload', res.tempFilePaths[0])
                var avatar = res.tempFilePaths[0];
                that.setData({
                    avatar: avatar
                })
            }
        })
    },
    upload_file: function (url, filePath) {
        var that = this;
        wx.uploadFile({
            url: app.globalData.apiUrl + "/cli/CustInformation/upload", //后台处理接口
            filePath: filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            formData: { //需要的参数
                'key': that.data.key
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
                var data = JSON.parse(res.data);
                that.setData({
                    avatar: data.path,
                });
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1500
                })


                nameData(that.data.key, that)
            },
            fail: function (res) { }
        })
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
            itemsName: ""
        })

        nameData(mythis.data.key, mythis)
        // wx.getUserInfo({
        // 	success: function (res) {
        // 		console.log(res);
        // 		var avatarUrl = 'userInfo.avatarUrl';
        // 		var nickName = 'userInfo.nickName';
        // 		mythis.setData({
        // 			[avatarUrl]: res.userInfo.avatarUrl,
        // 			[nickName]: res.userInfo.nickName,
        // 		})
        // 	}
        // })
        areaData(mythis)
        //获取省市区县数据
        // var values = this.data.addressValue;
        // var items = [{
        //         name: area.result[values[0]].name,
        //         id: area.result[values[0]].id,
        //     },
        //     {
        //         name: area.result[values[0]].city[values[1]].name,
        //         id: area.result[values[0]].city[values[1]].id,
        //     },
        //     {
        //         name: area.result[values[0]].city[values[1]].area[values[2]].name,
        //         id: area.result[values[0]].city[values[1]].area[values[2]].id,
        //     }
        // ];
        // for (var i = 0; i < items.length; i++) {
        //     mythis.data.itemsName += items[i].name
        // }
        // this.setData({

        //     addressItems: area.result,
        //     addresSelect: mythis.data.itemsName,
        //     citys: area.result[values[0]].city,
        //     countys: area.result[values[0]].city[values[1]].area
        // })
        //console.log(mythis.data.addresSelect)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 0,
            timingFunction: "ease",
            delay: 0
        })
        this.animation.translateY(200 + 'vh').step();
        this.setData({
            animation: this.animation.export(),
            show: show
        })
    },
    //移动按钮点击事件
    translate: function (e) {
        if (t == 0) {
            moveY = 0;
            show = true;
            t = 1;
        } else {
            moveY = 200;
            show = false;
            t = 0;
        }
        animationEvents(this, moveY, show);

    },
    // 弹出框取消隐藏
    hiddenFloatView(e) {
        moveY = 200;
        show = true;
        t = 0;
        animationEvents(this, moveY, show);
    },
    //弹出框确定
    citySure(e) {
        var mythis = this;
        var values = this.data.addressValue;
        var items = [{
            name: mythis.data.area[values[0]].text,
            id: mythis.data.area[values[0]].value,
        },
        {
            name: mythis.data.area[values[0]].children[values[1]].text,
            id: mythis.data.area[values[0]].children[values[1]].value,
        },
        {
            name: mythis.data.area[values[0]].children[values[1]].children[values[2]].text,
            id: mythis.data.area[values[0]].children[values[1]].children[values[2]].value,
        }
        ];
        moveY = 200;
        show = false;
        t = 0;
        animationEvents(this, moveY, show);
        this.setData({
            address: [],
            addresSelect: items,
            // show: true
        })
        //console.log(this.data.addresSelect)

        //请求接口

        for (var i = 0; i < this.data.addresSelect.length; i++) {
            // 地址
            this.data.address += this.data.addresSelect[i].name
            // 城市id
            this.data.city_id = this.data.addresSelect[1].id
            // 区域id
            this.data.area_id = this.data.addresSelect[2].id
        }
        this.setData({
            address: [],
            addresSelect: this.data.address,
            area_id: this.data.area_id,
            city_id: this.data.city_id
        })
        homeTown(mythis.data.city_id, mythis.data.area_id, mythis.data.addresSelect, mythis)

        //console.log(this.data.addresSelect)

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var mythis = this;
        nameData(mythis.data.key, mythis)
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

    // },



    // 用户名
    // verifyName: function (e) {
    //     var mythis = this;
    //     //console.log(this); //控制台显示为undefined
    //     if (e.detail.value != "" && e.detail.value.length < 16) {
    //         //console.log('验证通过');
    //         var cust_nickname = e.detail.value;
    //         userName(cust_nickname, mythis.data.key, mythis)
    //         wx.showToast({
    //             title: '保存成功',
    //             icon: 'success',
    //             duration: 2000
    //         })
    //     } else {
    //         //console.log('请输入正确的姓名');
    //         wx.showToast({
    //             title: '长度必须为0-16个字符',
    //             icon: 'none',
    //             duration: 2000
    //         })
    //     }
    // },
    // 性别
    bindPickerChange: function (e) {
        //console.log('picker发送选择改变，携带值为', e.detail.value)
        var mythis = this;
        if (e.detail.value == 1) {
            mythis.setData({
                cust_sex: 1
            })
        } else if(e.detail.value==2){
            mythis.setData({
                cust_sex: 2
            })
        }else{
            wx.showToast({
              title: '请选择性别',
              icon:'none',
              duration:2000
            })
        }
        this.setData({
            index: e.detail.value
        })
        // console.log(mythis.data.cust_sex)
        modification(mythis.data.cust_sex, mythis.data.key, mythis)
    },
    // 选择生日
    bindDateChange: function (e) {
        var mythis = this;
        //console.log('picker发送选择改变，携带值为', e.detail.value)
        mythis.setData({
            cust_birthday: e.detail.value
        })
        birthday(mythis.data.cust_birthday, mythis.data.key, mythis)
    },
})

// 获取地址
function areaData(mythis) {
        let parms = {
            area_id: 0
        }
        http.postRequest(app.globalData.apiUrl + '/cli/Area/area_data',parms,
        (res)=>{
            var area_list = [];
            for (var i in res.datas.area_list) {
                area_list.push(res.datas.area_list[i])
            }
            mythis.setData({
                area: area_list
            })
            var values = mythis.data.addressValue;
            var items = [{
                name: mythis.data.area[values[0]].text,
                id: mythis.data.area[values[0]].value,
            },
            {
                name: mythis.data.area[values[0]].children[values[1]].text,
                id: mythis.data.area[values[0]].children[values[1]].value,
            },
            {
                name: mythis.data.area[values[0]].children[values[1]].children[values[2]].text,
                id: mythis.data.area[values[0]].children[values[1]].children[values[2]].value,
            }
            ];
            for (var i = 0; i < items.length; i++) {
                mythis.data.itemsName += items[i].name
            }
            mythis.setData({
                addressItems: mythis.data.area,
                addresSelect: mythis.data.itemsName,
                citys: mythis.data.area[values[0]].children,
                countys: mythis.data.area[values[0]].children[values[1]].children
            })

        },(err)=>{

        })
   
}
// 行业
function industry(cust_occupation, mythis) {
    let parms = { cust_occupation: cust_occupation, key: wx.getStorageSync('key') }
    http.postRequest(app.globalData.apiUrl + '/cli/CustInformation/index', parms,
        function (res) {
            mythis.setData({
                custText: res.datas.cust_info.cust_occupation
            })
            if (mythis.data.custText == "") {
                mythis.setData({
                    custText: ""
                })
            }
            wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
            })
        },
        function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 2000
            })
        })
    
}
// ---------------- 分割线 ----------------
//动画事件
function animationEvents(that, moveY, show) {
    //console.log("moveY:" + moveY + "\nshow:" + show);
    that.animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 400,
        timingFunction: "ease",
        delay: 0
    })
    that.animation.translateY(moveY + 'vh').step()

    that.setData({
        animation: that.animation.export(),
        show: show
    })

}


// 获取区县数据
function getCountyInfo(column0, column1, that) {
    var c;
    countys = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
            countys[num] = c;
            num++;
        }
    }
    if (countys.length == 0) {
        countys[0] = {
            name: ''
        };
    }
    that.setData({
        county: "",
        countys: countys,
        value: [column0, column1, 0]
    })
}
//获取省份数据
function getProvinceData(that) {
    var s;
    provinces = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        s = areaInfo[i];
        if (s.di == "00" && s.xian == "00") {
            provinces[num] = s;
            num++;
        }
    }
    that.setData({
        provinces: provinces
    })

    //初始化调一次可更改
    getCityArr(0, that);
    getCountyInfo(0, 0, that);
    that.setData({
        province: "北京市",
        city: "市辖区",
        county: "东城区",
    })

}
// 获取地级市数据
function getCityArr(count, that) {
    var c;
    citys = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
            citys[num] = c;
            num++;
        }
    }
    if (citys.length == 0) {
        citys[0] = {
            name: ''
        };
    }

    that.setData({
        city: "",
        citys: citys,
        value: [count, 0, 0]
    })
}

// 选择生日
function birthday(cust_birthday, key, mythis) {
    let parms = { cust_birthday: cust_birthday, key: key }
    http.postRequest(app.globalData.apiUrl + '/cli/CustInformation/index', parms,
        function (res) {
            wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
            })
        }, function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 2000
            })
        })
}
// 修改性别
function modification(cust_sex, key, mythis) {
    let prams = {
        cust_sex: cust_sex,
        key: key,
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustInformation/index', prams,
        function (res) {
            wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
            })
        }, function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 2000
            })
        })

}
// 修改用户名
// function userName(cust_nickname, key, mythis) {
// let prams = {
//     cust_nickname:cust_nickname,
//     key:key
// }
//     http.postRequest(app.globalData.apiUrl + '/cli/CustInformation/index',prams,
//     function(res){

//     },
//     function(err){

//     })

// }
// 全部资料
function nameData(key, mythis) {
    let prams = {
        key: wx.getStorageSync('key'),
    }
    http.getRequest(app.globalData.apiUrl + '/cli/CustInformation/index', prams,
        function (res) {
            var dataName = res.datas.cust_info;
            var sexId = res.datas.cust_info.cust_sex;
            var label = [];
            for (var i in res.datas.cust_info.label) {
                label.push(res.datas.cust_info.label[i].pl_id)
            }
            mythis.setData({
                label: label,
                dataName: res.datas.cust_info,
                cust_birthday: res.datas.cust_info.cust_birthday,
                cust_sex: sexId,
                multiArrayNum: res.datas.occupation_list,
                custText: res.datas.cust_info.cust_occupation,
                addresSelect: res.datas.cust_info.area_info,
                hide: true
            })
            if (mythis.data.custText == "") {
                mythis.setData({
                    custText: ""
                })
            }
            if (mythis.data.cust_birthday == "") {
                cust_birthday: '出生年月日'

            }
            if (res.datas.cust_info.cust_sex !="") {
                mythis.setData({
                    index: res.datas.cust_info.cust_sex
                })
            } else{
                mythis.setData({
                    index: 0
                })
            }
            mythis.getIndustry();
        },
        function (err) {

        })
}
// 家乡
function homeTown(city_id, area_id, addresSelect, mythis) {
    let prams = {
        city_id: city_id, //城市id
        area_id: area_id, //地区ID
        area_info: addresSelect, //详细地址
        key: wx.getStorageSync('key')
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustInformation/index', prams,
        function (res) {
            wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
            })
        },
        function (err) {
            wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 2000
            })
        })
}

