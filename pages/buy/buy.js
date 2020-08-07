// pages/buy/buy.js
var key = wx.getStorageSync('key')
const app = getApp()
import navigateTo from "../../utils/navigateRoute.js"
var rcg_account_pay=0
const utilclick = require('../../utils/util.js')
var util = require('../../utils/sign.js');
var sc_store_id;
var sc_pr_id;
var p_sn;
var order_amount//总金额
var infofoFreight_totals; //总运费
var buy_message=""
var http = require('../../utils/httputils.js');   //相对路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //param:"8639|3,8637|1",
    //param:"103784|1",
    hide:true,
    data:[],
    store_cart_list:[],//商品列表
    productsBum:"",//总共商品数
    // address:"黑龙江 佳木斯市 汤原县黑龙江省汤原县鹤立镇永发乡红泉村",//当前地址提示,
    totalPrice:0,//总价
    yiciPrice:0,//易瓷币金额
    giftPrice:0,//礼品卡金额
    voucherPrice:0,//代金券金额
    an:"",//易瓷币弹窗开始
    an2: "",//添加礼品卡弹窗开始
    an3: "",//输入礼品卡金额弹窗开始
    isChooseVoucher:false,//是否选择代金券
    isChooseGift: false,//是否选择礼品卡
    isChooseYici:false,
    ifcart:"",//是否购物车,
    isYi:false,
    useVoucher:0,
    payName:"提交订单",
    yici_show:false,
    gift_show:false,
    model:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    order_amount=0;//总金额
    infofoFreight_totals = 0; //总运费
    if (this.data.address_id){
      this.queryData();
    }else{
      this.setData({
        cart_id: options.cart_id,
        ifcart: options.ifcart == undefined ? "" : options.ifcart,
        products_id: options.products_id,
		gdID: options.gdID,
      });
      // 总商品数量
      if (this.data.ifcart == 1) {
        var cart_id = this.data.cart_id;
        if (cart_id.indexOf("%7C") > 0) {
          cart_id = cart_id.replace(/\%7C/g, "|");
        }
      } else {
        var cart_id = options.products_id + '|' + options.buynum;
        
      }
      var cartIdArr = new Array();
      cartIdArr = cart_id.split(",");
      var totalproductsCount = 0;
      if (cartIdArr.length > 0) {
        for (var i = 0; i < cartIdArr.length; i++) {
          var productsArr = cartIdArr[i].split("|")
          totalproductsCount += parseInt(productsArr[1]);
        }
      }
      this.setData({
        productsBum: totalproductsCount,
        cart_id: cart_id
      })
      // 总商品数量结束
      this.queryData();
    }
    
    
  },
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    this.data.model[name] = e.detail.value;
    this.setData({ model: this.data.model })
  },
  queryData:function(e){
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    var that=this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl+'/cli/CustBuy/order_confirm',
      method: "POST",
      data: {
        cart_id: that.data.cart_id,
        //cart_id:"10419|1",
        key: wx.getStorageSync('key'),
        ifcart: that.data.ifcart,
		gdID: that.data.gdID,
        address_id: that.data.address_id
       
      },
      success: function (res) {
        if(res.data.code==400){
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 2000
          })
          setTimeout( function(){
            wx.navigateBack(function () {
              delta: 1
            })
          },1000)
         
          return
        }
        wx.hideLoading()
        //店铺商品数量
        for (var k in res.data.datas.store_cart_list) {
          var storeproductsCount = 0;
          var aa = k;
          for (var i = 0; i < res.data.datas.store_cart_list[k].products_list.length; i++) {
            storeproductsCount += parseInt(res.data.datas.store_cart_list[k].products_list[i].products_num);
            sc_store_id=res.data.datas.store_cart_list[k].products_list[i].store_id;
            sc_pr_id = res.data.datas.store_cart_list[k].products_list[i].products_id;
          }
          res.data.datas.store_cart_list[k].storePrice = res.data.datas.store_final_total_list[k]
          res.data.datas.store_cart_list[k].storeproductsCount = storeproductsCount;
        }
        that.setData({
          addressshow:Object.keys(res.data.datas.address_info).length,
          store_cart_list: res.data.datas.store_cart_list,
          data: res.data.datas,
        })
       
        infofoFreight_totals = 0; //总运费
        for (var k in that.data.data.address_api.content) {
          infofoFreight_totals += parseFloat(that.data.data.address_api.content[k]);
        }
        order_amount=0;
        for (var k in that.data.data.store_final_total_list) {
          order_amount += parseFloat(that.data.data.store_final_total_list[k]);
        }
        that.setData({
          infofoFreight_totals: infofoFreight_totals.toFixed(2),
          totalPrice: parseFloat(order_amount - that.data.yiciPrice - that.data.giftPrice - that.data.voucherPrice).toFixed(2),
          order_amount: parseFloat(order_amount).toFixed(2),
          isYi:true,
          allPrice: (order_amount - infofoFreight_totals).toFixed(2),
        })
        if (that.data.data.isFree && that.data.data.isFree == 1 ){
          that.setData({
            totalPrice: "0.00",
            payName:"0元拼单",
          })
        }
      },
      complete:function(){
       
        // that.setData({
        //   hide: true
        // })
      },
      fail: function (res) {

      }
    })
  },
  //使用易瓷按钮
  yiciCheck:function(e){
    var that = this;
    let parms = {
      yici_num: that.data.yici_num,
      remaining_amounts:that.data.totalPrice,
      key: wx.getStorageSync('key'),
    }
    http.postRequest(app.globalData.apiUrl+'/cli/CustYici/yiciCheck',parms,
    (res)=>{
      that.setData({
        an: "down",
        yiciPrice: parseFloat(that.data.yici_num).toFixed(2),//易瓷币金额
        isYi: false
      })
      that.chooseYici();
    },(err)=>{
      wx.showToast({
        icon: "none",
        title: err.datas.error,
        duration: 1000
      })
    })
   
  },
//   编辑
  toaddress:function(){
    // wx.navigateTo({
    //   url: '../addressList/addressList?key=' + wx.getStorageSync('key')
    // })
    navigateTo('../addressList/addressList?key=' + wx.getStorageSync('key')+"&type_num=1")
  },
//   新增
	address:function(){
		// wx.navigateTo({
    //   url: '../addressList/address/address?key=' + wx.getStorageSync('key') +"&type_num=1"
    // })
    navigateTo('../addressList/address/address?key=' + wx.getStorageSync('key') +"&type_num=1")
	},
  //获取用户输入的用户名
  yici_num: function (e) {
    this.setData({
      yici_num: e.detail.value
    })
  },
  //获取添加礼品卡号码
  gift_num: function (e) {
    this.setData({
      recharge_code: e.detail.value
    })
  },
  setAnim:function(){
    if (this.data.data.first_use_yici == "1") {
      wx.showToast({
        icon: "none",
        title: "易瓷币，满50易瓷币才可用",
        duration: 1000
      })
      return false
    }
    if (this.data.an == "" || this.data.an == "down"){
      if (this.data.totalPrice == 0) {
        wx.showToast({
          icon: "none",
          title: "不可使用易瓷币",
          duration: 1000
        })
        return
      }
      this.setData({
        an: "up",
      })
    }else{
      this.setData({
        an: "down",
      })
    }
  },
  setAnim2: function () {
    if (this.data.data.account_amounts > 0 && this.data.data.account_amounts){
      if (this.data.an2 == "" || this.data.an2 == "down") {
        this.setData({
          an2: "up",
          an3: "down",
        })
      } else {
        this.setData({
          an2: "down",
          an3: "up",
        })
      }
    }else{
      if (this.data.an2 == "" || this.data.an2 == "down") {
        this.setData({
          an2: "up",
        })
      } else {
        this.setData({
          an2: "down",
        })
      }
    }
    
  },
  //跳转商品详情
  goGoods:function(e){
    var products_id = e.currentTarget.dataset.id
		navigateTo('../commodity/commodity?products_id=' + products_id)
  },
  setAnim2Close:function(){
    if (this.data.an2 == "" || this.data.an2 == "down") {
      this.setData({
        an2: "up",
      })
    } else {
      this.setData({
        an2: "down",
      })
    }
  },
  setAnim3: function () {
    if (this.data.data.account_amounts > 0 && this.data.data.account_amounts){
      if (this.data.an3 == "" || this.data.an3 == "down") {
        this.setData({
          an3: "up",
        })
      } else {
        this.setData({
          an3: "down",
        })
      }
    }else{
      this.setAnim2();
    }
    
  },
//输入礼品卡号
gift_add: function () {
  var that = this;
  let parms = {
    recharge_code: that.data.recharge_code,
    key: wx.getStorageSync('key'),
  }
  http.postRequest(app.globalData.apiUrl + '/cli/CustRecharge/band_recharge_card',parms,
  (res)=>{
    that.setData({
      isChooseGift: false,
      an2: "down",
      giftPrice: 0,
      totalPrice: 0,
      isYi: true,
      yiciPrice: 0,
      isChooseYici: false,
      isChooseVoucher: false,
      voucherPrice: "0",
      order_amount: 0,
      hide: false,
      useVoucher: 0,
      useYici: 0,
      // totalPrice:
    })
    rcg_account_pay = 0;
    that.queryData();
  },(err)=>{
    that.setData({
      gift_error: err.datas.error,
    })
  })

},
  //选择代金券
  chooseVoucher:function(){
    if (this.data.isChooseVoucher){
      var giftPrice=0;
      if (this.data.isChooseGift){
        giftPrice = this.data.order_amount - this.data.yiciPrice;
        if (this.totalPrice == 0) {
          if (giftPrice > this.data.data.account_amounts) {//全部礼品卡都用了
            giftPrice = this.data.data.account_amounts;
          }
        }
      }
      
      this.setData({
        giftPrice: (giftPrice).toFixed(2),
        voucherPrice: 0,
        useVoucher:0,
        isChooseVoucher: !this.data.isChooseVoucher,
        totalPrice: (this.data.order_amount - giftPrice - this.data.yiciPrice).toFixed(2),
      })
    }else{
      if (this.data.totalPrice == 0 || parseFloat(this.data.data.voucher_info.voucher_price) > parseFloat(this.data.totalPrice)) {
        wx.showToast({
          icon: "none",
          title: "抵现金额小于合计金额，不能使用",
          duration: 1000
        })
        return
      }
      this.setData({
        voucherPrice:(this.data.data.voucher_info.voucher_price).toFixed(2),
        isChooseVoucher: !this.data.isChooseVoucher,
        totalPrice: (this.data.order_amount - this.data.giftPrice - this.data.yiciPrice - this.data.data.voucher_info.voucher_price).toFixed(2),
        useVoucher:1,
      })
    }
  },
  //添加礼品卡确定按钮
  chooseGift:function(e){
    if(this.data.isChooseGift && e.currentTarget.dataset['index']!="1"){
      this.setData({
        an3:"down"
     })
     return;
    }
    if (this.data.isChooseGift) {
      rcg_account_pay = 0
      this.setData({
        giftPrice: 0,
        isChooseGift: !this.data.isChooseGift,
        totalPrice: (this.data.order_amount - this.data.voucherPrice - this.data.yiciPrice).toFixed(2)
      })
    } else {
      rcg_account_pay=1
      if (this.data.data.account_amounts == 0) {//添加an2
        this.setData({
          an2: "up",
        })
        return false;
      }
      if (this.data.totalPrice == 0) {
        wx.showToast({
          icon: "none",
          title: "不可使用礼品卡",
          duration: 1000
        })
        return
      }
      var giftPrice = 0;
      var needPrice = (this.data.order_amount - this.data.voucherPrice - this.data.yiciPrice).toFixed(2);
      if (needPrice > 0) {//可用礼品卡
        if (parseFloat(needPrice) > parseFloat(this.data.data.account_amounts)) {//支付钱
          giftPrice = this.data.data.account_amounts
          needPrice = this.data.data.account_amounts
        } else {//0元
          giftPrice = needPrice
        }
      } else {//不可用礼品卡

      }
      var totalPrice = (this.data.order_amount - this.data.voucherPrice - this.data.yiciPrice - needPrice).toFixed(2);
      this.setData({
        giftPrice: giftPrice,
        isChooseGift: !this.data.isChooseGift,
        totalPrice: totalPrice,
        //an3:"down"
      })
    }
  },
  //添加易瓷确定按钮
  chooseYici: function () {
    var yiciPrice = 0;
    var needPrice = (this.data.order_amount - this.data.voucherPrice - this.data.giftPrice).toFixed(2);
    if (needPrice > 0) {//可用易瓷币
    } else {//不可用易瓷币
      wx.showToast({
        icon: "none",
        title: "不可使用易瓷币",
        duration: 1000
      })
    }
    var totalPrice = (this.data.order_amount - this.data.voucherPrice - this.data.yiciPrice - this.data.giftPrice).toFixed(2);
    this.setData({
      // yiciPrice: needPrice,
      isChooseYici:true,
      totalPrice: totalPrice
    })
  },
  //添加易瓷确定按钮
  chooseYici2: function () {
    if (this.data.data.first_use_yici =="1" ){
      wx.showToast({
        icon: "none",
        title: "易瓷币，满50易瓷币才可用",
        duration: 1000
      })
      return false
    }
    if (this.data.isChooseYici) {
      // this.chooseYici()
      if (this.data.isChooseYici) {
        var giftPrice = 0
        if (this.data.isChooseGift) {
          giftPrice = this.data.order_amount - this.data.voucherPrice;
          if (this.totalPrice == 0) {
            if (giftPrice > this.data.data.account_amounts) {//全部礼品卡都用了
              giftPrice = this.data.data.account_amounts;
            }
          }
        }
        this.setData({
          giftPrice: (giftPrice).toFixed(2),
          yiciPrice: 0,
          isChooseYici: !this.data.isChooseYici,
          totalPrice: (this.data.order_amount - this.data.voucherPrice - giftPrice).toFixed(2)
        })
      } else {
        var yiciPrice = 0;
        var needPrice = (this.data.order_amount - this.data.voucherPrice - this.data.giftPrice).toFixed(2);
        if (needPrice > 0) {//可用易瓷币
        } else {//不可用易瓷币
          wx.showToast({
            icon: "none",
            title: "不可使用易瓷币",
            duration: 1000
          })
        }
        var totalPrice = (this.data.order_amount - this.data.voucherPrice - this.data.yiciPrice).toFixed(2);
        this.setData({
          // yiciPrice: needPrice,
          isChooseYici: !this.data.isChooseYici,
          totalPrice: totalPrice
        })
      }
    }else{
      if (this.data.totalPrice == 0) {
        wx.showToast({
          icon: "none",
          title: "不可使用易瓷币",
          duration: 1000
        })
        return
      }
      this.setData({
        an: "up",
      })
    }
   
  },
  yicimore:function(){
    var that = this;
    this.setData({
      yici_show: true,
    })
  },
  yiciClose:function(){
    var that = this;
    this.setData({
      yici_show: false,
    })
  },
  giftmore:function(){
    var that = this;
    this.setData({
      gift_show: true,
    })
  },
  giftClose:function(){
    var that = this;
    this.setData({
      gift_show: false,
    })
  },
  pay: utilclick.throttle(function (e) {
    if(!wx.getStorageSync('cust_mobile') && wx.getStorageSync('key')){
      navigateTo('../bind_mobile/bind_mobile');
      return
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true
    });
    var that=this;
    var address_id;
    // if(!that.data.address_id){
    //   address_id = that.data.data.address_info.address_id;
    // }else{
    //   address_id = that.data.address_id;
    // }
    address_id = that.data.data.address_info.address_id;
    var pay_message = '';
    for (var k in that.data.model) {
      pay_message += k + '|' + that.data.model[k] + ',';
    }
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl+'/cli/CustBuy/order_creation',
      method: "POST",
      data: {
         cart_id: that.data.cart_id,
        //cart_id:"108245|1",
        key: wx.getStorageSync('key'),
        ifcart: that.data.ifcart,
        address_id: address_id,
        vat_hash: that.data.data.vat_hash,
        offpay_hash: that.data.data.address_api.offpay_hash,
        offpay_hash_batch: that.data.data.address_api.offpay_hash_batch,
        pay_name:"online",
        invoice_id:0,
        voucher:"",
        useYici:that.data.yiciPrice,
        pd_pay:0,
        rcb_pay:0,
        payment_code: "wxpay",
        pay_message:pay_message, 
        useVoucher: that.data.useVoucher,
        rcg_account_pay: rcg_account_pay,
        gdID: "",
        blId:"",
        gift_card_code:"",

      },
      success: function (res) {
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
          return
        }else{
          p_sn = res.data.datas.pay_sn;
          if (res.data.datas.groupbuy_info != null && typeof (res.data.datas.groupbuy_info) != "undefined" && res.data.datas.groupbuy_info.is_groupbuy == true){
            if (res.data.datas.groupbuy_info.isFree && res.data.datas.groupbuy_info.isFree == 1) {
              that.payGroup(res)
            }else if(res.data.datas.groupbuy_info.is_groupbuy){
              if(res.data.datas.is_zero_pay){
                that.payZero(res.data.datas.pay_sn,res.data.datas.groupbuy_info)
              }else{
                that.payNow(res.data.datas.pay_sn,res.data.datas.groupbuy_info);
              }
            }else if (res.data.datas.is_giftbuy) {
              that.payZero(res.data.datas.pay_sn)
            } else if (that.data.totalPrice == 0) {
              that.payZero(res.data.datas.pay_sn)
            } else {
              that.payNow(res.data.datas.pay_sn);
            }
          }else{
            if (res.data.datas.is_giftbuy) {    
              that.payZero(res.data.datas.pay_sn)
            } else if (that.data.totalPrice == 0) {
              that.payZero(res.data.datas.pay_sn)
            } else {
              that.payNow(res.data.datas.pay_sn);
            }
          }
          // if (res.data.datas.groupbuy_info.isFree && res.data.datas.groupbuy_info.isFree == 1) {
          //   that.payGroup(res)
          // }else if (result.datas.is_giftbuy) {
          //   that.payZero()
          // }else if(that.data.totalPrice==0){
          //   that.payZero()
          // }else{
          //   that.payNow(res.data.datas.pay_sn);
          // }
         
        }
        wx.hideLoading()
      },
      fail: function (res) {

      }
    })
  }, 2000),
  payGroup: function (res) {//拼团付款
    var that = this
    wx.showLoading({
      title: '请稍候...',
    });
    wx.request({
      url: app.globalData.apiUrl + '/cli/CustPayment/pay_new',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        pay_sn: res.data.datas.pay_sn,
        password: "",
        rcb_pay: "0",
        pd_pay: "0",
        is_groupbuy: res.data.datas.groupbuy_info.is_groupbuy,
        products_id: res.data.datas.groupbuy_info.products_id,
        groupbuy_hug: res.data.datas.groupbuy_info.groupbuy_hug,
        groupbuy_hug_temp: res.data.datas.groupbuy_info.groupbuy_hug_temp,
        payment_code: "wx_mini",
      },
      success: function (result) {
        if (result.statusCode == 200) {
          if (result.data.code == 200) {
            wx.redirectTo({
              //url: '../groupOrder/groupOrder',
              // url:'../detaCollage/detaCollage?products_id='+result.data.datas.groupbuy_info.products_id+'&groupbuy_hug='+ result.data.datas.groupbuy_info.groupbuy_hug +'&order_sn=2000000004609201%2C1000000000000000&order_id=31772'
              url:'../detaCollage/detaCollage?products_id='+res.data.datas.groupbuy_info.products_id+'&groupbuy_hug='+ res.data.datas.groupbuy_info.groupbuy_hug +'&groupbuy_hug_temp='+ res.data.datas.groupbuy_info.groupbuy_hug_temp +'&groupbuy_request_type='+res.data.datas.groupbuy_info.group_request_type+"&is_groupbuy_pay=true"
            })

          } else {
            
            wx.showToast({
              title: "支付失败",
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: "支付失败",
            icon: 'none',
          })
          return false;
        }
      }, complete: function () {
        wx.hideLoading();
      }
    });
  },
  payZero: function (pay_sn,groupbuy_info){//0元支付
    var that = this
    wx.showLoading({
      title: '请稍候...',
    });
    wx.request({
      url: app.globalData.apiUrl + '/cli/CustPayment/pay_new',
      method: "post",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        pay_sn: pay_sn,
        password:"",
        rcb_pay:"0",
        pd_pay:"0",
        payment_code: "wx_mini",
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            if(groupbuy_info){
              // wx.redirectTo({
              //   url:'../detaCollage/detaCollage?products_id='+groupbuy_info.products_id+'&groupbuy_hug='+groupbuy_info.groupbuy_hug +'&groupbuy_hug_temp='+groupbuy_info.groupbuy_hug_temp +'&groupbuy_request_type='+groupbuy_info.group_request_type
              // })
              wx.redirectTo({
                url:'../detaCollage/detaCollage?products_id='+groupbuy_info.products_id+'&groupbuy_hug='+groupbuy_info.groupbuy_hug +'&groupbuy_hug_temp='+groupbuy_info.groupbuy_hug_temp +'&groupbuy_request_type='+groupbuy_info.group_request_type+"&is_groupbuy_pay=true"
              })
             
            }else{
              wx.redirectTo({
                url: '/pages/success/success?pay_sn=' + pay_sn + "&store_id=" + sc_store_id + "&products_id=" + sc_pr_id + "&pay_amount=" + that.data.totalPrice
              })
           
            }
            
          } else {
            wx.showToast({
              title: "支付失败",
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: "支付失败",
            icon: 'none',
          })
          return false;
        }
      }, complete: function () {
        wx.hideLoading();
      }
    });
  },
  payNow: function (pay_sn,groupbuy_info) {
    var that = this
    wx.showLoading({
      title: '请稍候...',
    });
    wx.request({
      url: app.globalData.apiUrl+'/cli/custPayment/wxMiNiRequest',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      data: {
        key: wx.getStorageSync('key'),
        openid: app.getopenid(),
        time: util.getTimestamp(),
        pay_sn: pay_sn,
        payment_code:"wx_mini",
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if(res.data.code==200){
            that.wxpay(res.data.datas,pay_sn,groupbuy_info);
          }else{
            wx.showToast({
              title: "支付失败",
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: "支付失败",
            icon: 'none',
          })
          return false;
        }
      }, complete: function () {
        wx.hideLoading();
      }
    });
  },
  wxpay: function (data,pay_sn,groupbuy_info) {
    var that=this;
    wx.requestPayment(
      {
        'timeStamp': data.timeStamp + "",
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        'success': function (res) {
          if(!groupbuy_info){
            wx.redirectTo({
              url: '/pages/success/success?pay_sn=' + pay_sn + "&store_id=" + sc_store_id + "&products_id=" + sc_pr_id + "&pay_amount=" + that.data.totalPrice
            })
          }else{
            wx.redirectTo({
              url:'../detaCollage/detaCollage?products_id='+groupbuy_info.products_id+'&groupbuy_hug='+groupbuy_info.groupbuy_hug +'&groupbuy_hug_temp='+groupbuy_info.groupbuy_hug_temp +'&groupbuy_request_type='+groupbuy_info.group_request_type+"&is_groupbuy_pay=true"
            })
          }
          
        },
        'fail': function (res) {
          if(!groupbuy_info){
            wx.redirectTo({
              url: '../order/order?index=1',
            })
            // wx.redirectTo({
            //   url: '/pages/success/success?pay_sn=' + pay_sn + "&store_id=" + sc_store_id + "&products_id=" + sc_pr_id + "&pay_amount=" + that.data.totalPrice
            // })
          }else{
            wx.navigateBack({
              delta: 1,
              
            })
          }
         
        },
        'complete': function (res) {
        }
      })

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