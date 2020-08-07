const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');   //相对路径
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hide1: false,
    inpuVal: "", //input框内值
    listarr: [], //创建数组
    SearchText: '搜索', //按钮变动值
    keydown_number: 0, //检测input框内是否有内容
    input_value: "", //value值
    hostarr: [], //热门搜索接收请求存储数组  
    name_focus: false, //获取焦点
    hide: false, //模糊搜索
    inputVal: '',
  },
  wxSearchConfirm: function(e) {
    this.search()
    console.info(12);
    console.info('form发生了submit事件，携带数据为：', e.detail.value)
},
  // 跳转热搜榜
  // goSearchList: function () {
  //     navigateTo('/pages/ranking/ranking?type=1')
  // },
  // popularity: function () {
  //     navigateTo('/pages/ranking/ranking?type=2')
  // },
  // recom: function () {
  //     navigateTo('/pages/ranking/ranking?type=3')
  // },
  /**
   * 搜索  请求接口传参
   */
  //取值input判断输入框内容修改按钮
  inputvalue: function (e) {
    let that = this;
    this.setData({
      inputVal: e.detail.value
    })
    if (e.detail.cursor != 0) {
      this.setData({
        SearchText: "搜索",
        keydown_number: 1,
        hide: true,

      })
      if (e.detail.value.length > 0) {
        that.setData({
          hide: true,
        });
        let parms = {
          term: e.detail.value,
            search_type: 2
        }
        http.getRequest(app.globalData.apiUrl + '/cli/Products/autoComplete',parms,
        (res)=>{
          that.listDataCopy = res.datas.list;
          that.setData({
            listDataCopy: res.datas.list
          })
        },(err)=>{
          wx.showToast({
            title: err.datas.error,
            icon:'none',
            duration:1000
          })
        })
      }
    } else {
      this.setData({
        hide: false,
      })
    }
  },

  //搜索方法
  search: function (e) {
    // 获取input的最后的值
    var a = this.data.inputVal
    console.log(a)
    if (a != undefined) {
      if (a) {
        this.setData({
          a: this.data.inputVal
        })
      } else {
        this.setData({
          a: ""
        })

      }
      wx.redirectTo({
        url:'/pages/prodlist/prodlist?keyword=' + this.data.a
      })
      // navigateTo('/pages/prodlist/prodlist?keyword=' + this.data.a)
      if (this.data.keydown_number == 1) {
        let This = this;
        //把获取的input值插入数组里面
        let arr = this.data.listarr;
        //判断取值是手动输入还是点击赋值
        if (this.data.input_value == "") {
          // 判断数组中是否已存在
          let arrnum = arr.indexOf(this.data.inputVal);
          if (arrnum != -1) {
            // 删除已存在后重新插入至数组
            arr.splice(arrnum, 1)
            arr.unshift(this.data.inputVal);

          } else {
            arr.unshift(this.data.inputVal);
          }

        } else {
          let arr_num = arr.indexOf(this.data.input_value);
          if (arr_num != -1) {
            arr.splice(arr_num, 1)
            arr.unshift(this.data.input_value);
          } else {
            arr.unshift(this.data.input_value);
          }

        }

        //存储搜索记录
        wx.setStorage({
          key: "list_arr",
          data: arr
        })


        //取出搜索记录
        wx.getStorage({
          key: 'list_arr',
          success: function (res) {
            This.setData({
              listarr: res.data
            })
          }
        })
        this.setData({
          input_value: '',
        })
      } else {}
    } else {

      wx.showToast({
        title: '请输入关键字',
        icon: 'none',
        duration: 1500

      })
    }

  },
  //清除搜索记录
  delete_list: function () {
    var mythis = this;
    wx.showModal({
      title: '提示',
      content: '是否删除搜索记录',
      success: function (res) {
        if (res.confirm) {
          //清除当前数据
          mythis.setData({
            listarr: [],
          });
          //清除缓存数据
          wx.removeStorage({
            key: 'list_arr'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //点击赋值到input框
  this_value: function (e) {
    this.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    this.setData({
      input_value: value,
      SearchText: "搜索",
      keydown_number: 1
    })
    // 获取input的最后的值
    var a = value
    wx.redirectTo({
      url:'/pages/prodlist/prodlist?keyword=' + a
    })
    // navigateTo('/pages/prodlist/prodlist?keyword=' + a)
  },
  onShow: function () {
    let This = this;
    // searchHome(This)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let This = this;
    // searchHome(This)
    //设置当前页标题
    This.Popular()
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    //读取缓存历史搜索记录
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        This.setData({
          listarr: res.data
        })
      }
    })
  },
  Popular: function () {
    var mythis = this;
    let parms = {}
    http.getRequest(app.globalData.apiUrl + '/cli/Index/search_key_list',parms,
    (res)=>{
      mythis.setData({
        popularList: res.datas.list,
        hide1: true
      })
    },(err)=>{
      wx.showToast({
        title: err.datas.error,
        icon:'none',
        duration:1000
      })
    })
   
  },
  // 跳转视频
  // goVideo: function (e) {
  //     var products_commonid = e.currentTarget.dataset.id
  //     var products_id = e.currentTarget.dataset.index
  //     navigateTo('/pages/video_detail/video_detail?products_commonid=' + products_commonid + "&products_id=" + products_id)
  // },
  // // 跳转店铺
  // goShop: function (e) {
  //     var store_id = e.currentTarget.dataset.id
  //     navigateTo('/pages/shopHome/shopHome?store_id=' + store_id)
  // }
})

// function searchHome(This) {
//     wx.request({
//         url: app.globalData.apiUrl + '/cli/Search/index',
//         data: {},
//         header: {
//             'content-type': 'application/x-www-form-urlencoded',
//             "key": wx.getStorageSync('key'),
//         },
//         method: 'GET',
//         success: function (res) {
//             // 商品热搜索
//             var hotSearch = res.data.datas.search_list.products_list;
//             This.setData({
//                 hotSearch: res.data.datas.search_list.products_list
//             })
//             // 店铺人气榜
//             var popularityList = res.data.datas.search_list.store_list;
//             This.setData({
//                 popularityList: res.data.datas.search_list.store_list
//             })
//             // 推荐榜
//             var recommend = res.data.datas.search_list.recommended_video_list;
//             This.setData({
//                 recommend: res.data.datas.search_list.recommended_video_list
//             })
//         },
//         fail: function (res) { },
//         complete: function (res) { This.setData({ hide1: true }) },
//     })
// }
