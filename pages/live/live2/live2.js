// pages/live/live/live.js
const app = getApp()
import navigateTo from "../../../utils/navigateRoute.js"
const util = require('../../../utils/util.js')
const RongIMLib = require('../../../utils/RongIMLib-3.0.3-dev.js');
var utilMd5 = require('../../../utils/sign.js');
var http = require('../../../utils/httputils.js');
var productsId;
var custId;
var nickname;//昵称
var wsUrl;//聊天室接口
var room_id;
var signNew;//接口返的sign
var newTime//接口返的时间戳
var is_connect;
var loginNum=0
var flowNum=0
var socketConnected;
var bey=false
var gohide=false
var config = {
  appkey: '82hegw5u8vijx',
};
var im = RongIMLib.init(config);
var chatRoom = im.ChatRoom.get({
  id: '0123'
});

//连接

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hide: false,
    goodsList: [],
    page: "1",
    hasmore: true,
    rows: "20",
    an: "",//商品列表弹窗
    an1: "",//商品规格弹窗
    an2: "",//店铺信息弹窗
    num: 1,// 数量初始化1
    products_map_spec: [],//规格
    chooseText: "默认",//已选择文案
    //聊天室
    logmsg: '',
    isCont: false,
    sendFun: null,
    byeFun: null,
    chatText: "",
    Audience: "0",//观看数量
    flowerNum: 0,//鲜花数量
    is_showEnd: false,//直播是否结束
    store_id: "123",
    inputText: "跟主播聊点什么",
    newList: [{ content:{"nickname": "公告", "castid": "", "msg": "欢迎来到直播间！主播推荐的产品只可在爱之依平台交易，请勿私下交易更不要相信其他交易方式（如直接转账）谨防上当受骗！", },messageType:"RCChatroomUserMessage"}],
    hideCode: false,
    voucherText: "关注并领取",//关注文案
    showVoucher: false, //是否展示代金券
    list_voucher: false,//商品栏显示代金券
    isOnline:true,
    floSend:false,
    hideConnect:true,
    useonline:false,
    lastTapTime:0
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.login();
    app.loginName();
    // ====================================================================================================
    // that.initSDK();
    
    // im 来自 RongIMLib.init 返回的实例，例如：var im = RongIMLib.init({ appkey: 'kj29cjn0l1myd' });
    
    

    
    // =====================================================================================================
    if (options.store_id) {
      that.setData({
        store_id: options.store_id,
        is_share: options.is_share, 
        agent_code:options.agent_code,
        notice_id:options.notice_id,
        isNew:true
      })
    }
    if(that.data.agent_code){
      if(!wx.getStorageSync('key')){
        wx.setStorageSync('friends_agent_code',that.data.agent_code);
      }else{
        that.getFriend(that.data.agent_code);
      }		
    }else{
      if(wx.getStorageSync('friends_agent_code') && wx.getStorageSync('key')){
        that.getFriend(wx.getStorageSync('friends_agent_code'));
        wx.setStorageSync('friends_agent_code', "");
      }
    }
    
     if(that.data.is_share){
      that.isLive();
     }
    
    that.quertStore();
    
    is_connect = true;
    that.setData({
      is_followDialog: true,
      // linkUrl: "https://bj.aizhiyi.com/wap/live2.html"
    })
    setTimeout(function () {
      that.setData({
        is_followDialog: false
      })
    }, 8000);
  },
  // 重播
  retry:function(){
    wx.closeSocket();
    var that=this
    that.quertStore();
    that.queryGoodsList()
  },
  isLive: function(){
    var that=this
    if(wx.getStorageSync('openid')){
      wx.request({
        url: app.globalData.apiUrl + '/cli/Live/storeIsOnline',
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
          key: wx.getStorageSync('key'),
          userid:wx.getStorageSync('openid'),
        },
        data: {
          store_id: this.data.store_id,
          notice_id:this.data.notice_id,
          
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if(!res.data.datas.is_online){
              that.setData({
                is_showEnd:true,
                Audience:res.data.datas.res_anchor.watch_number?res.data.datas.res_anchor.watch_number:0,
                flowerNum:res.data.datas.res_anchor.get_flower?res.data.datas.res_anchor.get_flower:0,
                isOnline:false,
                hideCode:false
              })

            }
  
          }
        },
        complete: function () {
  
        }
      });
    }
		
	},
  getFriend: function(agent_code){
		let prams = {
			agent_code: agent_code,
      share_style:"share_common",
      key: wx.getStorageSync('key')
    }
    http.getRequest(app.globalData.apiUrl + '/cli/Index/share2', prams,
      (res)=>{
      },
      (err)=> {
        
      })
  },
  gocart:function(){
    navigateTo('../../cart/cart')
  },
  loadApp: function () {
    this.setData({
      hideCode: true
    })
  },
  // 关闭二维码
  guanbi: function () {
    this.setData({
      hideCode: false
    })
  },
  // 聊天室开始
  // 第三方聊天室开始========================
  // 加入聊天室
  joinRoom:function(){
    var that=this;
     chatRoom.join({
      count: 10 // 进入后, 自动拉取 20 条聊天室最新消息
    }).then(function() {
      console.log('加入聊天室成功');
      that.sendBtn("欢迎 笨笨 进去直播间", "RCChatroomWelcome");
      var ziji={"castid": custId, "msg":"欢迎 笨笨 进去直播间", "msgtype": "000000", "nickname":"笨笨", "streamName":"", "tm":"" }
      that.setData({
        buyList: ziji,
      })
    });
  },
  //  发送普通消息
  sendBtn:function(msg, msgtype){
        chatRoom.send({
          messageType: msgtype, // 填写开发者定义的 messageType
          content: { // 填写开发者定义的消息内容
            nickname: nickname,
            castid: custId,
            msg:msg

          },
          isPersited: true,// 是否存储在服务端,默认为 true
          isCounted: true,  // 是否计数. 计数消息接收接收端接收后未读数加 1，默认为 true
          pushContent:'user 发送了一条消息',  // Push 显示内容
          pushData: 'Push 通知时附加信息',  // Push 通知时附加信息, 可不填
          isStatusMessage: false  // 设置为 true 后 isPersited 和 isCounted 属性失效
        }).then(function(message){
           console.log('发送 自定义 消息成功'+msgtype, message);
        });
  },
  sendNews:function(){
    var that=this;
    if (that.data.chatText != "") {
      var ziji={content:{"castid": custId, "msg":that.data.chatText,"nickname":nickname}, "messageType": "RCChatroomUserMessage" }
      console.log(ziji)
      var length = this.data.newList.length+1;
      that.setData({
        newList: this.data.newList.concat(ziji),
        scrolltop: 100 * length,
      })
      that.sendBtn(that.data.chatText, "RCChatroomUserMessage");
      that.setData({
        chatText: "",
      })
    }
  },
  // 关闭连接
  closeConnect:function(){
    im.disconnect().then(function() {
      console.log('断开链接成功');
    });
  },
  // 第三方聊天室结束========================
  //获取用户输入的用户名
  chatText: function (e) {
    this.setData({
      chatText: e.detail.value
    })

  },
  logger: function (msg, type) {
    if (type == 1) {
      for (var i = 0; i < msg.length; i++) {
        if(msg[i].msgtype != "111222"){
          msg[i].nickname=util.baseDecode(msg[i].nickname)
          msg[i].msg=util.baseDecode(msg[i].msg)
        }
        
        if (msg[i].msgtype == "333331" || msg[i].msgtype == "000000" || msg[i].msgtype == "333332") {//聊天室上面
          if(msg[i].castid !=custId){
            this.setData({
              buyList: msg[i],
              // Audience:msg.lineCount,
            })
          }
            
            
        } else if (msg[i].msgtype == "getFlowerNum") {//接花
          this.setData({
            // flowerNum: parseInt(msg[i].msg),
            Audience: msg[i].msg.match(/,(.*)/)[1]
          })
          if(this.data.flowerNum ==0){
            this.setData({
              flowerNum: parseInt(msg[i].msg),
            })
          }
        } else if (msg[i].msgtype == "777777") {//商品链接
          // var goodsmsg = util.baseDecode(msg[i].msg)
          var goodsmsg = msg[i].msg
          msg[i].msg = JSON.parse(goodsmsg)
          this.setData({
            newList: this.data.newList.concat(msg[i]),
          })
        } else if (msg[i].msgtype == "333334" || msg[i].msgtype == "666666") {//直播关闭直播
          this.setData({
            is_showEnd: true
          })
        } else if (msg[i].msgtype == "111222") {//送花
          if(msg[i].castid !=custId){
            this.setData({
              flowerNum: parseInt(msg[i].msg) +this.data.flowerNum,
            })
          }
        } else if (msg[i].msgtype == "333333") {//观众退出

        } else if (msg[i].msgtype == "333112") {//禁言
          this.setData({
            Forbidden: true,
            inputText: "您已经被禁言",
          })
        } else if (msg[i].msgtype == "333111") {//踢出
          var that = this;
          that.byeReturn();
        }
        else if (msg[i].msgtype == "999999") {//断开重连
          var that = this
          that.byeBtn();
          setTimeout(function () {
            that.quertStore();
            that.queryGoodsList()
          }, 1000)
        } else if(msg[i].msgtype == "333335") {//聊天室
          if(msg[i].castid !=custId){
            this.setData({
              newList: this.data.newList.concat(msg[i]),
            })
          }
        }else{
          this.setData({
            newList: this.data.newList.concat(msg[i]),
          })
        }
        var length = this.data.newList.length;
        this.setData({
          scrolltop: 100 * length,
        })
        var that=this
        if(!this.data.useonline && this.data.Audience==0){
         
          this.setData({
            useonline:true,
          })
          setTimeout( function(){
            if(that.data.Audience==0){
              console.log("主播断开")
              that.setData({
                Audience:msg[0].lineCount,
              })
              if(msg[0].flowerCount){
                that.setData({
                  flowerNum:msg[0].flowerCount,
                })
              }
              
            }
            
          },5000)
        }
      }

    } else {
      this.setData({
        logmsg: util.formatTime(new Date()) + '\n' + msg + '\n\n' + this.data.logmsg,
      })
    }


  },
  contBtn: function () {
    
  },
  // sendBtn: function (msg, msgtype) {
  //   this.data.sendFun(msg, msgtype)
  // },
  // byeBtn: function () {
  //   this.data.byeFun()
  // },
  byeReturn: function () {
    var that = this;
    that.closeConnect();
    if (that.data.is_share == "yes") {
      wx.redirectTo({
        url: '../../shopHome/shopHome?store_id='+that.data.store_id
      })
    } else {
      setTimeout(function () {
        wx.navigateBack({
          delta: 1,
        });
      }, 500)
    }
    

  },


  //聊天室结束
  bindblur: function () {
    var that = this
    that.setData({
      is_hideBottom: false,
      chatText: ""
    })
  },
  showInput: function () {
    var that = this;
    if (!wx.getStorageSync('key')) {
      // that.byeBtn();
      setTimeout(function () {
        wx.redirectTo({
          url: '../../getUserInfo/getUserInfo?is_live=true&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        })
      }, 500)
      return;
    }
    if (!that.data.Forbidden) {
      that.setData({
        is_hideBottom: true,
      })
    }

  },
  showReport: function () {
    var that = this;
    if (!wx.getStorageSync('key')) {
      // that.byeBtn();
      setTimeout(function () {
        wx.redirectTo({
          url: '../../getUserInfo/getUserInfo?is_live=true&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        })
      }, 500)
      return;
    }
    if (that.data.is_showReport) {
      that.setData({
        is_showReport: false,
      })
    } else {
      that.setData({
        is_showReport: true,
      })
    }

  },
  delGoods: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < that.data.newList.length; i++) {
      if (that.data.newList[index] == that.data.newList[i]) {
        that.data.newList.splice(index, 1);
      }
    }
    that.setData({
      newList: that.data.newList
    })
  },
  goGoods: function (e) {
    var products_id = e.currentTarget.dataset.products_id;
    navigateTo('../../commodity/commodity?products_id=' + products_id+"&is_back=yes")
  },
  gostore: function () {
    var that = this
    navigateTo('../../shopHome/shopHome?store_id=' + this.data.store_id+"&is_back=yes")
  },
  // 关注店铺
  followStore: function () {
    var that = this;
    if (!wx.getStorageSync('key')) {
      // that.byeBtn();
      setTimeout(function () {
        wx.redirectTo({
          url: '../../getUserInfo/getUserInfo?is_live=true&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        })
      }, 500)
      return;
    }
    if (that.data.is_followStore) {
      cancelhops(that.data.store_id, that)
    } else {
      payashops(that.data.store_id, that)
    }
  },
  //店铺信息
  quertStore: function () {
    var that = this;
    if (!wx.getStorageSync('key')) {
     
      loginNum+=1
      if(loginNum==1){
        app.login2(that.quertStore)
        return
      }
      
    }
      wx.request({
        url: app.globalData.apiUrl + '/cli/store/store_info',
        data: {
          store_id: that.data.store_id,
          key: wx.getStorageSync('key')
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "key": wx.getStorageSync('key'),
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 200) {
            if(res.data.invitationCode){
              wx.setStorageSync('agent_code', res.data.invitationCode);
            }
            custId = res.data.datas.free_groupbuy_qualified.custId
            that.queryData(custId);
            that.setData({
              storeInfo: res.data.datas.store_info,
              is_followStore: res.data.datas.store_info.is_favorate,
              store_id: res.data.datas.store_info.store_id,
              // linkUrl: "https://bj.aizhiyi.com/wap/live2.html"
            });
            if (that.data.is_followStore) {
              that.setData({
                voucherText: "立即领取"
              })
            } else {
              that.setData({
                voucherText: "关注并领取"
              })
            }
  
          } else {
            wx.showToast({
              title: res.data.datas.error,
              icon: 'none',
              duration: 2000,
              mask: true,
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                  });
                }, 2000)
              },
            })
          }
        },
        fail: function (res) { },
  
      })
    
  },
  // 播流地址
  queryData: function (custId) {
    var that = this;
    if (!wx.getStorageSync('openid')) {
      app.login2(that.queryData)
      return
    }

    var param = {}
    param.userid = wx.getStorageSync('openid')
    param.store_id = that.data.store_id
    if (custId) {
      param.cust_id = custId
    }

    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + "/cli/Live/getIntoLive",
      method: "POST",
      data: param,
      success: function (res) {
        // if(res.data.datas.cust_nickname){

        // }else{
        //   nickname=res.data.datas.cust_nickname
        // }
        nickname = res.data.datas.cust_nickname
        wsUrl = res.data.datas.ws,
        signNew = res.data.datas.sign
        room_id = res.data.datas.streamname;
        newTime = res.data.datas.tm;
        if(!that.data.is_share){
            that.setData({
              notice_id:res.data.datas.notice_id
            })
            if(wx.getStorageSync('openid')){
              that.isLive();
            } 
        }
        // ==================================================
        var user = {
          token: res.data.datas.token
        };
        im.connect(user).then(function(user) {
          console.log('链接成功, 链接用户 id 为: ', user);
          //监听
          var conversationList = []; // 当前已存在的会话列表
          im.watch({
            conversation: function(event){
              var updatedConversationList = event.updatedConversationList; // 更新的会话列表
              console.log('更新会话汇总:', updatedConversationList);
              console.log('最新会话列表:', im.Conversation.merge({
                conversationList,
                updatedConversationList
              }));
            },
            message: function(event){
              var message = event.message;
              console.log('收到新消息:', message);
              if(message.messageType == "RCChatroomAnchorMessage" || message.messageType == "RCChatroomUserMessage") {//聊天室主播和观众
                var length = that.data.newList.length+1;
                that.setData({
                  newList: that.data.newList.concat(message),
                  scrolltop: 100 * length,
                })
              }else if(message.messageType == "RCChatroomUserBuy" ||message.messageType == "RCChatroomWelcome" || message.messageType == "RCChatroomFollow") {// 购买  进入 关注
                that.setData({
                  buyList: message,
                  // Audience:msg.lineCount,
                })
              }else if(message.messageType == "RCChatroomLike"){//送花
                if(message.content.castid !=custId){
                  that.setData({
                    flowerNum: parseInt(message.content.msg)+that.data.flowerNum,
                  })
                }
              }else if(message.messageType == "RCChatroomGetFLowers"){//在线人数和花
                this.setData({
                  Audience: message.content.msg.match(/,(.*)/)[1]
                })
                if(that.data.flowerNum ==0){
                  that.setData({
                    flowerNum: parseInt(message.content.msg),
                  })
                }
              }else if(message.messageType=="RCChatroomUserBlock"){//踢出
                that.byeReturn();
              }else if(message.messageType=="RCChatroomUserBan"){//禁言
                tht.setData({
                  Forbidden: true,
                  inputText: "您已经被禁言",
                })
              }
            },
            status: function(event){
              var status = event.status;
              console.log('连接状态码:', status);
            }
          });
          that.joinRoom()
          // that.historyNews()
        }).catch(function(error) {
          console.log('链接失败: ', error.code, error.msg);
        });
        // ===========================================
        that.setData({
          hide: true,
          showVoucher: res.data.datas.is_popup,
          voucher_t_price: res.data.datas.voucher_t_price,
          voucher_t_limit: res.data.datas.voucher_t_limit,
          notice_address: res.data.datas.notice_address?res.data.datas.notice_address:"火星",
           liveSrc:res.data.datas.flvurl,
           isSHow:res.data.is_show,
           notice_title:res.data.datas.notice_title,
           isError:false,
           shareImg:res.data.datas.transverse_notice_image
          
        })
        if(!that.data.liveSrc){
          that.setData({
            liveSrc:res.data.datas.flvurl
          })
        }
        that.queryGoodsList();
      },
      complete: function () {
        // wx.hideLoading();
      },
      fail: function (res) {

      }
    })
  },
  

doubleClick: function (e) {
  var curTime = e.timeStamp
  var lastTime = e.currentTarget.dataset.time  // 通过e.currentTarget.dataset.time 访问到绑定到该组件的自定义数据
  if (curTime - lastTime > 0) {
    if (curTime - lastTime < 300) {//是双击事件
      if(this.data.double){
        this.setData({
          double:false
        })
      }else{
        this.setData({
          double:true
        })
      }
      
    }
    
  }
  this.setData({
    lastTapTime: curTime
  })
},
  // 送花发消息
  sendFlowers: function () {
    var that = this;
    if (!wx.getStorageSync('key')) {
      setTimeout(function () {
        wx.redirectTo({
          url: '../../getUserInfo/getUserInfo?is_live=true&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        })
      }, 500)
      return;
    }
    that.setData({
      flowerNum: parseInt(this.data.flowerNum) + 1,
    })
    flowNum+=1;
    if(!that.data.floSend){
      that.setData({
        floSend:true
      })
      setTimeout( function(){
        that.setData({
          floSend:false
        })
        console.log(flowNum)
        that.sendBtn(flowNum, "RCChatroomLike");
        flowNum=0;
      },5000)
    }
    
  },
  return: function () {
    wx.navigateBack({
      delta: 1,
    });
  },
  // 弹出商品列表
  shoplist: function () {
    
    var that = this;
    if (!wx.getStorageSync('key')) {
      // that.byeBtn();
      setTimeout(function () {
        wx.redirectTo({
          url: '../../getUserInfo/getUserInfo?is_live=true&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        })
      }, 500)
      return;
    }
    // var ziji={content:{"castid": custId, "msg":"正在购买","nickname":nickname}, "messageType": "RCChatroomUserBuy" }
    that.sendBtn("正在购买", "RCChatroomUserBuy")
    that.setData({
      an: "up",
      // buyList: ziji
    })
    that.queryGoodsList()
  },
  queryGoodsList: function (e) {
    var that = this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + "/cli/Products/products_basket_list",
      method: "GET",
      data: {
        key: wx.getStorageSync('key'),
        store_id: that.data.store_id,
        page: that.data.page,
        rows: that.data.rows,
        notice_id:that.data.notice_id
      },
      success: function (res) {
        // wx.hideLoading()
        if (Object.keys(res.data.datas.store_voucher).length !=0) {
          that.setData({
            list_voucher: true
          })
          console.log(Object.keys(that.data.list_voucher).length)
        }
        that.setData({
          goodsList: res.data.datas
        })
      },
      complete: function () {
        // wx.hideLoading();
      },
      fail: function (res) {

      }
    })
  },
  
  govideo: function (e) {
    var products_commonid = e.currentTarget.dataset.products_commonid;
    var products_id = e.currentTarget.dataset.products_id;
    navigateTo('../../commodity/commodity?products_commonid=' + products_commonid + '&products_id=' + products_id+"&is_back=yes")
  },
  gobuy: util.throttle(function (e) {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    var that = this;
    var param = {};
    param.groupbuy_type = null
    param.cart_id = productsId + "|" + that.data.num;
    param.key = wx.getStorageSync('key');
    param.gdID = productsId;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + '/cli/CustBuy/order_confirm',
      method: "POST",
      data: param,
      success: function (res) {
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
          return
        } else {
          navigateTo('../../buy/buy?products_id=' + productsId + '&buynum=' + that.data.num + "&gdID=" + productsId)
        }
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })
    
  }, 3000),
  goreport: function () {
    navigateTo('../report/report?store_id=' + this.data.store_id)
  },
  //关闭背景
  closebj: function () {
    if (this.data.an1 == "up") {
      this.setData({
        an1: "down"
      })
    } else {
      this.setData({
        an: "down"
      })
    }
  },
  //店铺信息
  storeInfo: function () {
    if (!wx.getStorageSync('key')) {
      // this.byeBtn();
      setTimeout(function () {
        wx.redirectTo({
          url: '../../getUserInfo/getUserInfo?is_live=true&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        })
      }, 500)
      return;
    }
    this.setData({
      an2: "up"
    })
  },
  closeStoreTc: function () {
    this.setData({
      an2: "down"
    })
  },
  //弹出规格e
  getgoods: function (e) {
    var that = this;
    var products_id = e.currentTarget.dataset.products_id;
    that.choosegoods(products_id);
    productsId = products_id;
    that.setData({
      an1: "up"
    })
  },
  /*点击减号*/
  bindMinus: function () {
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  joincart:function(){
    app.join_cart(this.data.products_id, 1);
    this.setData({
      an1: "down",
    })
  },
  choosegoods: function (products_id) {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    var that = this; //把this对象复制到临时变量that
    const wxreq = wx.request({
      url: app.globalData.apiUrl + '/cli/Products/products_detail',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        key: wx.getStorageSync('key')
      },
      data: {
        products_id: products_id,
        num: 3,
        key: wx.getStorageSync('key')
      },
      success: function (res) {
        if (res.data.code == 200) {

          //商品规格格式化数据
          var data = res.data.datas;
          if (!data.products_info.spec_name.default) {
            var products_map_spec = {};
            for (var i in data.products_info.spec_name) {
              var products_specs = {};
              products_specs["products_spec_id"] = i;
              products_specs['products_spec_name'] = data.products_info.spec_name[i];
              if (data.products_info.spec_value) {
                for (var vi in data.products_info.spec_value) {
                  if (i == vi) {
                    var specs_value = [];
                    for (var vvi in data.products_info.spec_value[vi]) {
                      var value = {};
                      value["specs_value_id"] = vvi;
                      value["specs_value_name"] = data.products_info.spec_value[vi][vvi];
                      if (data.products_info.products_spec.hasOwnProperty(vvi)) {
                        value["isClick"] = 1;
                      } else {
                        value["isClick"] = 0;
                      }
                      specs_value.push(value);
                    };
                    products_specs['products_spec_value'] = specs_value;//问题在这

                  }
                };
              } else {
                data.products_info.spec_value = [];
              }
              products_map_spec[i] = products_specs;
            }

            // 对象转成数组开始
            var b = products_map_spec;
            var goods_spec = []
            for (let i in b) {
              goods_spec.push(b[i]);
            }
            var text = "";
            var curSpec = [];
            for (let i = 0; i < goods_spec.length; i++) {
              for (let j = 0; j < goods_spec[i].products_spec_value.length; j++) {
                if (goods_spec[i].products_spec_value[j].isClick == "1") {
                  text += goods_spec[i].products_spec_value[j].specs_value_name + ",";
                }
              }
            }
            that.setData({
              chooseText: text,
            })
            // 对象转成数组结束
            that.setData({
              products_map_spec: goods_spec,

            })
          } else {
            data.products_map_spec = [];
          }
        }
        that.setData({
          products_id: products_id,
          imgUrls: res.data.datas.products_image.split(","),
          goods_price: res.data.datas.products_info.products_price,
          goods_detail: res.data.datas
        })
      }, complete: function () {
        wx.hideLoading()
      },
      fail: function (res) {
        this.userData = "数据获取失败";
      }
    })
  },
  selectGuige(e) {
    let that = this,
      // 获取第一个循环的index
      fuindex = e.currentTarget.dataset.fuindex,
      // 获取第二个循环的index
      chindex = e.currentTarget.dataset.chindex,
      guilists = {},
      // 对象转成数组方式一
      a = that.data.products_map_spec;
    var goods_spec = []
    for (let i in a) {
      goods_spec.push(a[i]);
    }
    // 通过循环来判断点击了哪一个规格，根据数据结构来；
    // goods_spec[fuindex]根据fuindex来判断点击了哪一种类型的规格

    for (let i = 0; i < goods_spec[fuindex].products_spec_value.length; i++) {
      // 当i等于当前点击的规格时，设置isClick=1
      if (i == chindex) {
        goods_spec[fuindex].products_spec_value[i].isClick = 1;
      }
      // 否则设置其他的isClick=0
      else {
        goods_spec[fuindex].products_spec_value[i].isClick = 0;
      }
      that.setData({
        products_map_spec: goods_spec,
      })
    }
    var text = "";
    var curSpec = [];
    for (let i = 0; i < goods_spec.length; i++) {
      for (let j = 0; j < goods_spec[i].products_spec_value.length; j++) {
        if (goods_spec[i].products_spec_value[j].isClick == "1") {
          curSpec.push(goods_spec[i].products_spec_value[j].specs_value_id);
          text += goods_spec[i].products_spec_value[j].specs_value_name + ",";
        }
      }
    }
    that.setData({
      chooseText: text,
    })
    //多规格回去商品id
    var myData = {};
    myData["spec_list"] = that.data.goods_detail.spec_list;
    var spec_string = curSpec.sort(function (a, b) { return a - b; }).join("|");
    //获取商品ID
    var products_id = myData.spec_list[spec_string];
    this.choosegoods(products_id)
    productsId = products_id;
  },

  // 关闭商品列表
  clsoelist: function () {
    var that = this;

    that.setData({
      an: "down"
    })
  },
  //代金券关闭
  closeVoucher: function () {
    var that = this
    that.setData({
      showVoucher: false,
    })
  },
  //领取代金券
  getVoucher: function () {
    var that = this
    if(!wx.getStorageSync('key')){
      wx.redirectTo({
        url: '../../getUserInfo/getUserInfo?is_live=true&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
      })
      return;
    }
   
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + "/cli/StoreVoucher/reciveStoreVoucher",
      method: "POST",
      data: {
        key: wx.getStorageSync('key'),
        store_id: that.data.store_id,
      },
      success: function (res) {
        if (res.data.code == 200) {
          if(!that.data.is_followStore){
            that.followStore();
          }
          that.setData({
            showVoucher: false,
          })
          wx.showToast({
            icon: "none",
            title: "卡券已到手，快去下单吧!请在我的-卡券中查看",
            duration: 1000
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        }

      },
      complete: function () {

      },
      fail: function (res) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
			topHeight: wx.getMenuButtonBoundingClientRect().top
		})
  },
  statechange(e) {
    var that=this
    console.log('live-player code:', e.detail.code)
    if(e.detail.code=="-2301"){
      that.setData({
        isError:true
      })
    }
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      is_showReport:false 
    })
    if (that.data.isReportSuccess) {
      wx.showToast({
        title: '非常感谢，我们会尽快处理',
        icon: 'none',
        duration: 3000
      })
      that.setData({
        isReportSuccess: false,
        is_showReport: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.setData({
      an1: "",
      an:""
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //wx.closeSocket()
    var that = this;
    that.byeBtn();

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
    var that = this
    return {
      title:that.data.notice_title,
      path: 'pages/live/live/live?store_id=' + that.data.store_id + "&is_share=yes"+"&agent_code="+wx.getStorageSync('agent_code')+"&notice_id="+that.data.notice_id,
      imageUrl: that.data.shareImg

    }
  }
})

// 取消店铺
function cancelhops(store_id, that) {
  wx.request({
    url: app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_del",
    method: "POST",
    data: {
      store_id: store_id,
      key: wx.getStorageSync('key'),
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "key": wx.getStorageSync('key'),
    },
    success: function (res) {
      that.setData({
        is_followStore: false,
        voucherText: "关注并领取",
      })

    },
  })
}
// 关注店铺
function payashops(store_id, that) {
  wx.request({
    url: app.globalData.apiUrl + "/cli/CustFavoritesStore/favorites_add",
    method: "POST",
    data: {
      store_id: store_id,
      key: wx.getStorageSync('key'),
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "key": wx.getStorageSync('key'),
    },
    success: function (res) {
      var ziji={content:{"castid": custId, "msg":"关注了主播","nickname":nickname}, "messageType": "RCChatroomFollow" }
      that.setData({
        is_followStore: true,
        voucherText: "立即领取",
        buyList: ziji,
      })
      that.sendBtn("关注了主播", "RCChatroomFollow");
    },
  })
}
