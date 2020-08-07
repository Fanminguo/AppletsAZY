// pages/cart/cart.js
var key = wx.getStorageSync('key')
const app = getApp();
import navigateTo from "../../utils/navigateRoute.js"
const util = require('../../utils/util.js')
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide:false,
    cartList:[],
    checkeedAll: false,
    checkedAll: false,
    index: 0,
    state: 0,
    totalPrice:0,//总钱数
    totalNum:0,//总商品数
    isEdit:false,
    editText:"管理",
  },
  checkall: function (e) {
    var index = e.target.dataset.index;
    var list = this.data.cartList[index].products; //
    var status = this.data.cartList[index].checkeedAll; 
    for (var i = 0; i < list.length; i++) {
      list[i].checked = !status; 
    };
    var dataIndex = 'cartList[' + index + '].products';
    var dataStatus = 'cartList[' + index + '].checkeedAll';
    this.setData({
      [dataIndex]: list,
      [dataStatus]: !status,
    });
    this.getTotalPrice();
  },

  //点击课程上的 checkbox

  Checks1: function (e) {
    var id = e.target.dataset.id;;
    var list1 = this.data.cartList;
    for (var i = 0; i < list1.length; i++) {
      var list2 = this.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        if (list2[a].cart_id == id){
          if (list2[a].checked){
            list2[a].checked=false
           }else{
            list2[a].checked = true
           }
        }
      }
    }
    var index = e.target.dataset.index;
    var list = this.data.cartList[index].products;
    var checkedList = e.detail.value; 
    var dataStatus = 'cartList[' + index + '].checkeedAll'; 
    var status = list.length == checkedList.length ? true : false;
    this.setData({
      [dataStatus]: status,
    });
    this.getTotalPrice();
  },
  //点击全选
  AllTap:function (e) {
    var checkedAll = this.data.checkedAll;
    var list1 = this.data.cartList;
    for (var i = 0; i < list1.length; i++) {
      list1[i].checkeedAll = !checkedAll;
      var list2 = this.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        list2[a].checked = !checkedAll;
      }
    }
    this.setData({
      checkedAll: (!checkedAll),
      cartList: list1,
    });
    this.getTotalPrice();
  },
  getTotalPrice() {
    var total = 0;
    var totalNum=0;
    var list1 = this.data.cartList;
    for (var i = 0; i < list1.length; i++) {
      var list2 = this.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        if (list2[a].checked){
          total += list2[a].products_num * list2[a].products_price;
          totalNum += list2[a].products_num 
        }
      }
    }
    this.setData({
      totalPrice: total.toFixed(2),
      totalNum: totalNum
    })
  },
  queryData:function(){
    var that=this;
    if (!wx.getStorageSync('key')) {
      app.login2(that.queryData)
    } else {
      let prams = {
        key: wx.getStorageSync('key')
      }
      http.postRequest(app.globalData.apiUrl + '/cli/CustCart/cart_list', prams,
        (res)=>{
          that.setData({
            cartList: res.datas.cart_list
          });
          var list1 = that.data.cartList;
          for (var i = 0; i < list1.length; i++) {
            list1[i].checkeedAll = false;
            var list2 = that.data.cartList[i].products;
            for (var a = 0; a < list2.length; a++) {
              list2[a].checked = false;
            }
          }
          that.setData({
            cartList: list1,
            hide: true,
          });
          that.getTotalPrice()
        },
        (err)=> {
          wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1500
          })
        })

      // wx.request({
      //   url: app.globalData.apiUrl+'/cli/CustCart/cart_list',
      //   method: "post",
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded',
      //     key: wx.getStorageSync('key')
      //   },
      //   data: {
      //     key: wx.getStorageSync('key'),
      //   },
      //   success: function (res) {
      //     if (res.data.code == 200) {
      //       that.setData({
      //         cartList: res.data.datas.cart_list
      //       });
      //       var list1 = that.data.cartList;
      //       for (var i = 0; i < list1.length; i++) {
      //         list1[i].checkeedAll = false;
      //         var list2 = that.data.cartList[i].products;
      //         for (var a = 0; a < list2.length; a++) {
      //           list2[a].checked = false;
      //         }
      //       }
      //       that.setData({
      //         cartList: list1
      //       });
      //       that.getTotalPrice()
      //     }
      //   }, complete: function () {
      //     that.setData({
      //       hide: true
      //     })
      //   }
      // });
    }
    
  },
  edit_cart:function(){//点击编辑
    var that=this;
    var cart_id_arr = {};
    var list1 = that.data.cartList;
    for (var i = 0; i < list1.length; i++) {
      // list1[i].checkeedAll = false;
      var list2 = that.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        cart_id_arr[list2[a].cart_id] = list2[a].products_num
      }
    }
    if(that.data.isEdit){
      let prams = {
        key: wx.getStorageSync('key'),
        cart_id_arr:JSON.stringify(cart_id_arr),
      }
      http.postRequest(app.globalData.apiUrl + '/cli/CustCart/cart_edit_quantity', prams,
        (res)=>{
          that.onLoad(); 
          that.setData({
            cartList: list1,
            totalNum: 0,
            checkedAll: false
          });
          that.getTotalPrice();
          that.setData({
            isEdit: false,
            editText:"管理",
          });
        },
        (err)=> {
          wx.showToast({
            title: err.datas.error,
            icon: 'none',
            duration: 1500
          })
        })
    }else{
      that.setData({
        isEdit: true,
        editText: "完成",
      });
    }
  },
  bindedit: util.throttle(function (id, num) {
    var that = this;
    var cart_id_arr = {};
    var list1 = that.data.cartList;
    cart_id_arr[id] = num
    let prams = {
      key: wx.getStorageSync('key'),
      cart_id_arr: JSON.stringify(cart_id_arr),
    }
    http.postRequest(app.globalData.apiUrl + '/cli/CustCart/cart_edit_quantity', prams,
      (res)=>{
        for (var i = 0; i < list1.length; i++) {
          var list2 = that.data.cartList[i].products;
          for (var a = 0; a < list2.length; a++) {
            if (list2[a].cart_id == id) {
              list2[a].products_num = res.datas.cart_count;
            }
          }
        }
        that.setData({
          cartList: list1,
        });
        that.getTotalPrice();
      },
      (err)=> {
        wx.showToast({
          title: err.datas.error,
          icon: 'none',
          duration: 1500
        })
      })

  }, 500),
  bindadd:function(e){//数量增加事件
    var id = e.target.dataset.id;
    var list1 = this.data.cartList;
    var num;
    for (var i = 0; i < list1.length; i++) {
      var list2 = this.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        if (list2[a].cart_id == id) {
          list2[a].products_num += 1;
          num = list2[a].products_num;
        }
      }
    }
    if (!this.data.isEdit){
      this.bindedit(id,num);
    }else{
      this.setData({
        cartList: list1
      });
      this.getTotalPrice();
    }
    
  },
  bindreduce: function (e) {//数量增加事件
    var id = e.target.dataset.id;
    var list1 = this.data.cartList;
    var num;
    for (var i = 0; i < list1.length; i++) {
      var list2 = this.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        if (list2[a].cart_id == id) {
          if (list2[a].products_num >=2){
            list2[a].products_num -= 1;
            num = list2[a].products_num;
          }else{
            return false;
          }
         
         
        }
      }
    }
    if (!this.data.isEdit) {
      this.bindedit(id, num);
    } else {
      this.setData({
        cartList: list1
      });
      this.getTotalPrice();
    }
  },
  del_product:function(e){//删除单个商品
    var that = this;
    var id = e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除这件商品吗？',
      success (res) {
        if (res.confirm) {
          let prams = {
            key: wx.getStorageSync('key'),
            cart_id: id,
          }
          http.postRequest(app.globalData.apiUrl + '/cli/CustCart/cart_del', prams,
            (res)=>{
              that.onLoad();
                that.setData({
                  totalPrice:0,
                  totalNum:0,
                  checkedAll:false,
				          scroll0:"0"
                });
            },
            (err)=> {
              wx.showToast({
                title: err.datas.error,
                icon: 'none',
                duration: 1500
              })
            })
        }
      }
    })
  },
  gobuy:function(){
    var cartIdArr = [];
    var list1 = this.data.cartList;
    for (var i = 0; i < list1.length; i++) {
      var list2 = this.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        if (list2[a].checked) {
          var cartIdNum = list2[a].cart_id + "|" + list2[a].products_num
          cartIdArr.push(cartIdNum)
        }
      }
    }
    var cart_id = cartIdArr.toString();
    if (cart_id==""){
      wx.showToast({
        icon: "none",
        title: "请选择要购买的商品",
        duration: 1000
      })
      return
    }else{
		// wx.navigateTo({
    //     url: '../buy/buy?ifcart=1&cart_id=' + cart_id
    //   })
    }
    navigateTo( '../buy/buy?ifcart=1&cart_id=' + cart_id)
  },
  goindex:function(){
	  wx.reLaunch({
      url: '../index/index'
    })
  },
  gostore:function(e){
    var store_id = e.currentTarget.dataset.store_id;
    // wx.navigateTo({
    //   url: '../shopHome/shopHome?store_id=' + store_id
    // })
    navigateTo('../shopHome/shopHome?store_id=' + store_id)
  },
  delBtn:function(){
    var that = this;
    var cartIdArr = [];
    var list1 = this.data.cartList;
    for (var i = 0; i < list1.length; i++) {
      var list2 = this.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        if (list2[a].checked) {
          var cartIdNum = list2[a].cart_id + "|" + list2[a].products_num
          cartIdArr.push(cartIdNum)
        }
      }
    }
    var cart_id = cartIdArr.toString();
    if (cart_id==""){
      wx.showToast({
        icon: "none",
        title: "请选择要删除的商品",
        duration: 1000
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除这'+that.data.totalNum+'件商品吗？',
      success (res) {
        if (res.confirm) {
          that.allDel();
        } else if (res.cancel) {
          
        }
      }
    })
  },
  allDel:function(){
    var that = this;
    var cart_id_arr = "";
    var list1 = that.data.cartList;
    for (var i = 0; i < list1.length; i++) {
      list1[i].checkeedAll = false;
      var list2 = that.data.cartList[i].products;
      for (var a = 0; a < list2.length; a++) {
        if (list2[a].checked) {
          cart_id_arr += list2[a].cart_id + ","
        }
       
        // cart_id_arr[list2[a].cart_id] = list2[a].products_num
      }
    }
    if (true) {
      wx.request({
        url: app.globalData.apiUrl+'/cli/CustCart/cart_del',
        method: "post",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          key: wx.getStorageSync('key')
        },
        data: {
          cart_id: cart_id_arr,
          key: wx.getStorageSync('key')
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.onLoad();
            that.setData({
              totalPrice: 0,
              totalNum: 0,
              checkedAll: false
            });
            wx.showToast({
              icon: "none",
              title: "删除成功",
              duration: 1000
            })
          } else {
            wx.showToast({
              icon: "none",
              title: res.data.datas.error,
              duration: 1000
            })
            return
          }
        }, complete: function () {
          wx.hideLoading();
        }
      });
    } 
  },
  govideo: function (e) {
	 
    var products_commonid = e.currentTarget.dataset.products_commonid;
	var products_id = e.currentTarget.dataset.products_id;
    if (e.currentTarget.dataset.products_video) {
      // wx.navigateTo({
      //   url: '../video_detail/video_detail?products_commonid=' + products_commonid
      // })
		navigateTo('../video_detail/video_detail?products_commonid=' + products_commonid + "&products_id=" + products_id)
    } else {
      // wx.navigateTo({
      //   url: '../commodity/commodity?products_id=' + e.currentTarget.dataset.products_id
      // })
      navigateTo('../commodity/commodity?products_id=' + e.currentTarget.dataset.products_id)
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData();
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