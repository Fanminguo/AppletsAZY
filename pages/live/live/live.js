// pages/live/live/live.js
const app = getApp()
import navigateTo from "../../../utils/navigateRoute.js"
const util = require('../../../utils/util.js')
const RongIMLib = require('../../../utils/RongIMLib-3.0.3-dev.js');
// const RongIMEmoji = require('../../../utils/RongEmoji-2.2.7.js');
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
var bey=false
var gohide=false
var avater;
var token;
var newsTimeStamp;//历史消息时间错
var flotime = 8;
var config = {
  appkey: 'e0x9wycfepi1q',
};
const RongEmoji = require('../../../utils/RongIMEmoji-2.2.6.js');
RongEmoji.init();

var im = RongIMLib.init(config);
// var Emoji=RongIMLib.RongIMEmoji.init();
// console.log(Emoji)
var chatRoom;
var scHright=0
var scHrightNew=0
var is_bottom =true//是否在底部
var newsNum=0
var scrbig=0;
var level;
var flowOnce=false;
var errIime;//重复消息

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
    store_id: "331",
    inputText: "跟主播聊点什么",
    newList: [{ content:{"nickname": "公告", "castid": "", "msg": "欢迎来到直播间！主播推荐的产品只可在爱之依平台交易，请勿私下交易更不要相信其他交易方式（如直接转账）谨防上当受骗！",level:3 },messageType:"RCChatroomUserMessage"}],
    hideCode: false,
    voucherText: "关注并领取",//关注文案
    showVoucher: false, //是否展示代金券
    list_voucher: false,//商品栏显示代金券
    isOnline:true,
    floSend:false,
    hideConnect:true,
    useonline:false,
    lastTapTime:0,
    list: ['1', '2', '3','4','5','6','7','8','9','10','11','12','13','14'],
    number: -1,
    choose_num: "5",
    playerS:true,
    closeApp:true,
    isKefuCOde:false,//显示客服二维码
   
    
  },
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
        break;
      default:
        return 0;
        break;
    }
  },
  translate() {
    // 随机数
    let randomNum = this.randomNum(-30, 30)
    // number是控制active的
    this.setData({
      number: this.data.number + 1
    }, () => {
      if (this.data.number > 13) {
        this.setData({
          number: 0
        })
      }
    })
    // .active 是选择器
    this.animate('.active6', [{
        opacity: 1,
        translateY: 0
      },
      {
        opacity: 0,
        translate: [randomNum, -200]
      },
    ], 1500, function () {
      // this.translate()
  //动画完成后的回调函数
    }.bind(this))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    wx.getNetworkType({
      success: function(res) {
        that.setData({
          netWorkType:res.networkType
        })
        // console.log(res.networkType)
      }
    })
    let isIphoneX = app.globalData.isIphoneX;    
    is_connect=true
    app.login();
    app.loginName();
    let queryAll = decodeURIComponent(options.q);
    let id = gup('store_id', queryAll);
   
    if(gup('store_id', queryAll)){//扫码进来
      // wx.showToast({
      //   icon: "none",
      //   title:"扫码进来store_id="+ gup('store_id', queryAll)+"is_share="+ gup('is_share', queryAll)+"agent_code="+gup('agent_code', queryAll)+"notice_id="+gup('notice_id', queryAll),
      //   duration: 10000
      // })
      that.setData({
        store_id: gup('store_id', queryAll),
        is_share: gup('is_share', queryAll), 
        agent_code:gup('agent_code', queryAll), 
        notice_id:gup('notice_id', queryAll), 
      })
    }else{//其余进来
      if (options.store_id) {
        that.setData({
          store_id: options.store_id,
          is_share: options.is_share, 
          agent_code:options.agent_code,
          notice_id:options.notice_id,
        })
      }
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
    
    //  if(that.data.is_share){
    //   that.isLive();
    //  }
    if(wx.getStorageSync('key')){
      that.getCartNum();
    }
    that.quertStore();
    that.setData({
      is_followDialog: true,
      isIphoneX: isIphoneX,
    })
    setTimeout(function () {
      that.setData({
        is_followDialog: false
      })
    }, 8000);
  },
  // 重播
  retry:function(){
    // wx.closeSocket();
    // is_connect=false
    wx.showLoading({
      title: '重连中...',
      mask: true
    });
    var that=this
    // that.closeConnect()
    that.setData({
      isError:false,
      liveSrc:"",
    })
    that.quertStore();
    // that.queryData();
    // that.queryGoodsList()
  },
  goPlayBack:function(){
    if(this.data.liveTime=="点击查看直播回放>"){
      // navigateTo('../../shopHome/videoWhole/videoWhole?notice_id='+this.data.notice_id+"&store_id="+this.data.store_id)
      wx.redirectTo({
        url: '../../shopHome/videoWhole/videoWhole?notice_id='+this.data.notice_id+"&store_id="+this.data.store_id,
      })
    }
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
              wx.hideLoading();
              that.setData({
                is_showEnd:true,
                Audience:res.data.datas.res_anchor.watch_number?res.data.datas.res_anchor.watch_number:0,
                flowerNum:res.data.datas.res_anchor.get_flower?res.data.datas.res_anchor.get_flower:0,
                isOnline:false,
                hideCode:false
              })
              function nowTime(time) { //时间函数
                // 剩余时间
                var nowTime = Date.parse(new Date())/1000
                var endTime =res.data.datas.res_anchor.end_time+300;
                var intDiff = endTime - nowTime;
                // console.log(intDiff+"===intDiff")
                var day = 0,
                  hour = 0,
                  minute = 0,
                  second = 0;
                  if (intDiff > 0) { //转换时间
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                    if (hour <= 9) hour = '0' + hour;
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    intDiff--;
                    var str = minute + ':' + second
                    that.setData({
                      liveTime: "5分钟后查看精彩回放>"
                    })
                  } else {
                    that.setData({
                      liveTime: "点击查看直播回放>",
                    })
                    clearInterval(timer);
                  }
             }
              nowTime();
              var timer = setInterval(nowTime, 1000);
            }else{
              if(that.data.netWorkType != "wifi"){
                  wx.showToast({
                    icon: "none",
                    title: "当前非wifi模式，注意流量消耗",
                    duration: 3000
                  })
                } 
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
    if(this.data.caetNum>=1){
      navigateTo('../../cart/cart')
    }else{
      wx.showToast({
        icon: "none",
        title: "购物车内没有商品哦",
        duration: 2000
      })
    }
    
  },
  loadApp: function () {
    this.setData({
      hideCode: true
    })
  },
  closeApp:function(){
    this.setData({
      closeApp:false
    })
  },
  kefuCode:function(){
    this.setData({
        isKefuCOde:true
    })
  },
  closeKefuCode:function(){
    this.setData({
      isKefuCOde:false
    })
  },
  // 关闭二维码
  guanbi: function () {
    this.setData({
      hideCode: false
    })
  },
  //购物车数量
  getCartNum: function () {
		var that = this
		wx.request({
			url: app.globalData.apiUrl + '/cli/CustCart/cart_count1',
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key')
			},
			data: {
				key: wx.getStorageSync('key')
			},
			success: function (res) {
				if (res.statusCode == 200) {
					that.setData({
						caetNum: res.data.datas.cart_count,
					});
				}
			},
			complete: function () {

			}
		});
	},
  // 聊天室开始
  // 第三方聊天室开始========================
  return:function(){
    console.log("==")
    return false
  },
  bindscroll:function(e){
    //  var that=this
    //  scHrightNew=e.detail.scrollTop;
    // //  console.log(scHrightNew+"==========新距离")
    // //  console.log(scrbig+"==========最大距离")
    //  console.log(is_bottom)
    //  if(scHrightNew>=scrbig-150 && scrbig !=0){//到底
    //     // console.log("到底====")
    //     // scHrightNew=scrbig;
    //     is_bottom=true
        
    //  }else{
    //     // scHrightNew=scrbig
    //     // console.log("没到底======")
    //     is_bottom=false
    //  }
  },
  scrollBot:function(){
      //  var that=this;
      //  newsNum=0
      //  that.setData({
      //   newsNum:0
      //  })
      // that.gobottom()
      //  scrbig=scHrightNew
      //  is_bottom=true
      //  console.log("到底"+scrbig)
  },
  gobottom:function(){
    var that=this
    var length = this.data.newList.length+1;
    that.setData({
      scrolltop: 200 * length,
    })
  },
  // 监听消息
  watchNews:function(){
    var that=this;
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
        // if(OffLineMessage && isOffLineMessage){
        //   console.log("不需要的信息")
        //   return
        // }
        // console.log("接收",event.message)
        
        
        
        if(newsTimeStamp > message.sentTime && (message.messageType =="RCChatroomAnchorMessage" || message.messageType  == "RCChatroomUserMessage" || message.messageType =="RCChatroomProMessage" || message.messageType =="RCChatroomGetFLowers")){
          
        }else if(newsTimeStamp < message.sentTime){
          // console.log(message.sentTime)

          // if(errIime==message.sentTime){
          //   // console.log("重复消息")
          //   errIime=message.sentTime;
          //   return false;
          // }else{
          //   console.log("没重复")
          //   errIime=message.sentTime;
          // }
        }else{
          return;
        }
        if(message.messageType == "RCChatroomAnchorMessage" || message.messageType == "RCChatroomUserMessage") {//聊天室主播和观众
          

          
          var goodsmsg = message.content.msg
          message.content.msg=RongEmoji.symbolToEmoji(RongEmoji.emojiToSymbol(goodsmsg))
          // that.setData({
          //   newList: that.data.newList.concat(message),
          // })
          var length = that.data.newList.length;
          if(length>40){
            //  var list=that.data.newList.splice(0, 1)
            //  console.log(list)
             that.setData({
              newList:that.data.newList.splice(1).concat(message),
             })
            //  console.log( that.data.newList.length+"]]]")
          }else{
            that.setData({             
              ['newList[' + that.data.newList.length + ']']: message           
           });
          }
          // console.log(that.data.newsList.indexOf(message))
          if(is_bottom){
            //  that.gobottom()
            var length = that.data.newList.length+1;
            that.setData({
              scrolltop: 200 * length,
            })
            
          }else if(!message.isOffLineMessage){
            if(newsTimeStamp < message.sentTime){
              newsNum+=1;
              that.setData({
               newsNum:newsNum
              })
            }
             
          }
        }else if(message.messageType == "RCChatroomUserBuy" ||message.messageType == "RCChatroomWelcome" || message.messageType == "RCChatroomFollow" || message.messageType == "RCChatroomVoucher") {// 购买  进入 关注
          that.setData({
            buyList: message,
          })
        }else if(message.messageType == "RCChatroomLike"){//送花
          if(message.content.castid !=custId && flowOnce){
            // console.log("接花============"+flowOnce)
            that.setData({
              flowerNum: parseInt(message.content.msg)+that.data.flowerNum,
            })
            if(flotime==8){
              var fltimer = setInterval(floAn, 300);
            }
            function floAn(){
                if(flotime>0){
                  flotime--
                  that.translate();
                }else{
                  flotime=8
                  clearInterval(fltimer);
                }
            }
          }
        }else if(message.messageType == "RCChatroomGetFLowers"){//在线人数和花
          // console.log("---------",message)
          that.setData({
            Audience: message.content.msg.match(/,(.*)/)[1]
          })
          // console.log(that.data.Audience)
          if(that.data.flowerNum ==0 || that.data.flowerNum < parseInt(message.content.msg)){
            that.setData({
              flowerNum: parseInt(message.content.msg),
            })
            // console.log("开始============="+parseInt(message.content.msg))
            flowOnce=true
          }
        }else if(message.messageType=="RCChatroomUserBlock" && message.content.msg==custId){//踢出
          that.byeReturn();
        }else if(message.messageType=="RCChatroomUserBan" && message.content.msg==custId){//禁言
          that.setData({
            Forbidden: true,
            inputText: "您已经被禁言",
          })
        }else if(message.messageType=="RCChatroomProMessage"){//商品信息
          that.setData({
              goodsInfo:message,
              goodsAn:"active"
          })
         clearTimeout(Interval);
         var Interval = setTimeout( function(){
            that.setData({
              goodsInfo:"",
              goodsAn:""
            })
          },30000)
          // var goodsmsg = message.content.msg
          // message.content.msg = JSON.parse(goodsmsg)
          // console.log(message.content.msg)
        //   var length = that.data.newList.length;
        //   that.setData({
        //     newList: that.data.newList.concat(message),
        //   })
        //   if(is_bottom){
        //     that.setData({
        //      scrolltop: 200 * length,
        //     })
        //  }else{
        //     newsNum+=1;
        //     that.setData({
        //      newsNum:newsNum
        //     })
        //  }
        }else if(message.messageType=="RCChatroomUserQuit" && message.content.msgType=="1"){//直播结束
          that.setData({
            is_showEnd: true,
            an1: "",
            an:"",
          })
          wx.hideLoading();          
          var time = 300;
          var Interval = setInterval(function () {
            time--;
            if (time > 0) {
              that.setData({
                liveTime: "5分钟后查看精彩回放",
                isFIve:true
              })
            } else {
              clearInterval(Interval);
              that.setData({
                liveTime: '点击查看直播回放>',
                isFIve:false
              })

            }
          }, 1000)
        }
      },
      status: function(event){
        var status = event.status;
        console.log('连接状态码:', status);
        if(status==0){
          newsTimeStamp=Date.parse(new Date())
        }
        if(status==6){
          console.log("被挤掉");
         
          that.byeReturn();
        }
      }
    });
  },
  // 加入聊天室
  joinRoom:function(num){
    if(num==0){
      var that=this;
      chatRoom.join({
          // count: 0 // 进入后, 自动拉取 20 条聊天室最新消息
      }).then(function() {
        that.sendBtn("", "RCChatroomWelcome2");
        // console.log('加入聊天室成功');
      });
    }else{
      var that=this;
      chatRoom.join({
          count: 50 // 进入后, 自动拉取 20 条聊天室最新消息
      }).then(function() {
        // console.log('加入聊天室成功');
        

          that.sendBtn("欢迎"+nickname+"进去直播间", "RCChatroomWelcome");
          var ziji={content:{"castid": custId, "msg":that.data.chatText,"nickname":nickname,level:level}, "messageType": "RCChatroomWelcome" }
          that.setData({
            buyList: ziji
          }) 
        
        
      });
    }
    
  },
  historyNews:function(){
    var option = {
      timestrap: +new Date(),
      count: 20
    };
    chatRoom.getMessages(option).then(function(result){
      var list = result.list; // 历史消息列表
      var hasMore = result.hasMore; // 是否还有历史消息可以获取
      console.log('获取聊天室历史消息成功', list, hasMore);
    });
  },
  //  发送普通消息
  sendBtn:function(msg, msgtype){
        var that=this;
        
        //  if(msgtype == "RCChatroomAnchorMessage" || msgtype == "RCChatroomUserMessage"){
        //     msg=util.baseEncode(msg)
        //  }
        if(msgtype!="RCChatroomLike"){
          msg=RongEmoji.symbolToEmoji(msg)
        }
        chatRoom.send({
          messageType: msgtype, // 填写开发者定义的 messageType
          content: { // 填写开发者定义的消息内容
            nickname: nickname,
            castid: custId,
            msg:msg,
            user_avaer:avater,
            msgType:"0",
            level:level
          },
          isPersited: true,// 是否存储在服务端,默认为 true
          isCounted: true,  // 是否计数. 计数消息接收接收端接收后未读数加 1，默认为 true
          pushContent:'user 发送了一条消息',  // Push 显示内容
          pushData: 'Push 通知时附加信息',  // Push 通知时附加信息, 可不填
          isStatusMessage: false  // 设置为 true 后 isPersited 和 isCounted 属性失效
        }).then(function(message){
          console.log('发送 自定义 消息成功'+msgtype, message);
           if(msgtype=="RCChatroomWelcome"){
            setTimeout( function(){
              var length = that.data.newList.length;
              that.setData({
                scrolltop: 200 * length,
              })
            },1000)
           }
        });
  },
  sendNews:function(){
    var that=this;
    var word=that.data.chatText
    // console.log(that.data.chatText.replace(/\s+/g, '').length)
    if (word.replace(/\s+/g, '').length>0) {
      const wxreq = wx.request({
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
        },
        url: app.globalData.apiUrl + "/cli/Index/msgSecCheck",
        method: "GET",
        data: {
          content: word,
        },
        success: function (res) {
          if(res.data.datas.errcode !=0){
            wx.showToast({
              title: "内容含有违法违规内容",
              icon: 'none',
              duration: 2000,
              mask: true,
            })
            return
          }
          var ziji={content:{"castid": custId, "msg":word,"nickname":nickname,"level":level}, "messageType": "RCChatroomUserMessage" }
          // console.log(ziji)
          var length = that.data.newList.length+1;
          newsNum=0
          that.setData({
            // newList: that.data.newList.concat(ziji),
            ['newList[' + that.data.newList.length + ']']:ziji ,
            scrolltop: 100 * length,
            newsNum:0
          })
          console.log(word)
          that.sendBtn(word, "RCChatroomUserMessage");
          that.setData({
            chatText: "",
          })
        },
        fail: function (res) {
  
        }
      })
      
    }
  },
  // 关闭连接
  closeConnect:function(){
    this.sendBtn("退出", "RCChatroomUserQuit");
    chatRoom.quit().then(function() {
      console.log('退出聊天室成功');
      im.disconnect().then(function() {
        // im.unwatch();
        console.log('断开链接成功');
      });
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
          that.setData({
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
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]
    if (that.data.is_share == "yes" && !beforePage ) {
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
        // wx.redirectTo({
        //   url: '../../getUserInfo/getUserInfo?is_live='+true+'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        // })
        navigateTo('../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id)
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
        // wx.redirectTo({
        //   url: '../../getUserInfo/getUserInfo?is_live='+true+'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        // })
        navigateTo('../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id)
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
    that.setData({
      goodsInfo:"",
      goodsAn:""
    })
    // var index = e.currentTarget.dataset.index;
    // for (var i = 0; i < that.data.newList.length; i++) {
    //   if (that.data.newList[index] == that.data.newList[i]) {
    //     that.data.newList.splice(index, 1);
    //   }
    // }
    // that.setData({
    //   newList: that.data.newList
    // })
  },
  goGoods: function (e) {
    // var products_id = e.currentTarget.dataset.products_id;
    var products_id = this.data.goodsInfo.content.products_id;
    console.log(this.data.goodsInfo.content.products_id)
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
        // wx.redirectTo({
        //   url: '../../getUserInfo/getUserInfo?is_live='+true+'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        // })
        navigateTo('../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id)
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
        fail: function (res) { 
           
        },
           
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
        key: wx.getStorageSync('key'),
        userid:wx.getStorageSync('openid')
      },
      url: app.globalData.apiUrl + "/cli/Live/getIntoLive",
      method: "POST",
      data: param,
      success: function (res) {
        if(res.data.datas.error){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.datas.error,
            success (res) {
              if (res.confirm) {
                that.byeReturn();
              }
            }
          })
          // that.setData({
          //   hide:true
          // })
          return;
        }
        // if(res.data.datas.cust_nickname){

        // }else{
        //   nickname=res.data.datas.cust_nickname
        // }
        nickname = res.data.datas.cust_nickname
        wsUrl = res.data.datas.ws,
        signNew = res.data.datas.sign
        room_id = res.data.datas.streamname;
        newTime = res.data.datas.tm;
        avater = res.data.datas.avatar;
        token=res.data.datas.token;
        
        // level=2;
        level=res.data.datas.level;
        that.setData({
          kefuUrl:res.data.datas.kf_qr_img
        })
        if(!that.data.notice_id){
            that.setData({
              notice_id:res.data.datas.notice_id
            })
            // if(wx.getStorageSync('openid')){
            //   that.isLive();
            // }
        }

        //========================================
        // chatRoom = im.ChatRoom.get({
        //   id:room_id+that.data.notice_id
        // });
        // // console.log(that.data.notice_id)
        // var user = {
        //   token: token
        // };
        // im.connect(user).then(function(user) {
        //   console.log('链接成功, 链接用户 id 为: ', user);
        //   //监听
         
        //   that.joinRoom(50)
        //   // that.historyNews()
        // }).catch(function(error) {
        //   console.log('链接失败: ', error.code, error.msg);
        // });
        // ==================================================
        wx.request({
          url: app.globalData.apiUrl + '/cli/Live/storeIsOnline',
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
            key: wx.getStorageSync('key'),
            userid:wx.getStorageSync('openid'),
          },
          data: {
            store_id:that.data.store_id,
            notice_id:that.data.notice_id
          },
          success: function (res) {
            if (res.statusCode == 200) {
              if(!res.data.datas.is_online){
                wx.hideLoading();
                that.setData({
                  is_showEnd:true,
                  Audience:res.data.datas.res_anchor.watch_number?res.data.datas.res_anchor.watch_number:0,
                  flowerNum:res.data.datas.res_anchor.get_flower?res.data.datas.res_anchor.get_flower:0,
                  isOnline:false,
                  hideCode:false
                })
                function nowTime(time) { //时间函数
                  // 剩余时间
                  var nowTime = Date.parse(new Date())/1000
                  var endTime =res.data.datas.res_anchor.end_time+300;
                  var intDiff = endTime - nowTime;
                  // console.log(intDiff+"===intDiff")
                  var day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0;
                    if (intDiff > 0) { //转换时间
                      day = Math.floor(intDiff / (60 * 60 * 24));
                      hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                      minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                      second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                      if (hour <= 9) hour = '0' + hour;
                      if (minute <= 9) minute = '0' + minute;
                      if (second <= 9) second = '0' + second;
                      intDiff--;
                      var str = minute + ':' + second
                      that.setData({
                        liveTime: "5分钟后查看精彩回放",
                        isFIve:true
                      })
                    } else {
                      that.setData({
                        liveTime: "点击查看直播回放>",
                        isFIve:false
                      })
                      clearInterval(timer);
                    }
               }
                nowTime();
                var timer = setInterval(nowTime, 1000);
              }else{
                chatRoom = im.ChatRoom.get({
                  id:room_id+that.data.notice_id
                });
                // console.log(that.data.notice_id)
                var user = {
                  token: token
                };
                im.connect(user).then(function(user) {
                  console.log('链接成功, 链接用户 id 为: ', user);
                  //监听
                 
                  that.joinRoom(50)
                  // that.historyNews()
                }).catch(function(error) {
                  console.log('链接失败: ', error.code, error.msg);
                });

                // if(that.data.netWorkType != "wifi"){
                //     wx.showToast({
                //       icon: "none",
                //       title: "当前非wifi模式，注意流量消耗",
                //       duration: 3000
                //     })
                //   } 
              }
            }
          },
          complete: function () {
    
          }
        });

        //===================================================
       
        
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
            // wx.getImageInfo({
            //   src: res.data.datas.transverse_notice_image,
            //   success(res) {
            //     console.log(res.path);
            //     that.setData({
            //       shareImg:res.path
            //     })
            //     // that.createNewImg();
            //     // context.draw();
            //   }
            // })  
        // if(!that.data.liveSrc){
        //   that.setData({
        //     liveSrc:res.data.datas.flvurl
        //   })
        // }
        that.queryGoodsList();
      },
      complete: function () {
        
      },
      fail: function (res) {
        
        wx.showToast({
          icon: "none",
          title: "网络超时，请稍后再试",
          duration: 3000
        })
        setTimeout( function(){
          that.byeReturn();
        },3000)
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
        navigateTo('../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id)
        // wx.redirectTo({
        //   url: '../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        // })
      }, 500)
      return;
    }
    function floAn(){
        if(flotime>0){
          flotime--
          that.translate();
        }else{
          flotime=8
          clearInterval(fltimer);
        }
        console.log(flotime+"---------")
    }
    // clearInterval(timer);
    var mathNum=Math.floor(Math.random()*2+3)
    that.setData({
      flowerNum: parseInt(this.data.flowerNum) + 1,
    })
   
    flowNum+=mathNum;
    if(!that.data.floSend){
      if(flotime=8){
        var fltimer = setInterval(floAn, 300);
      }
      that.setData({
        floSend:true
      })
      setTimeout( function(){
        that.setData({
          floSend:false
        })
        console.log(flowNum+"送出")
        that.sendBtn(flowNum, "RCChatroomLike");
        flowNum=0;
      },1000)
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
        // wx.redirectTo({
        //   url: '../../getUserInfo/getUserInfo?is_live='+true+'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        // })
        navigateTo('../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id)
      }, 500)
      return;
    }
    // var ziji={content:{"castid": custId, "msg":"正在购买","nickname":nickname}, "messageType": "RCChatroomUserBuy" }
    if(level!=1 && that.data.goodsList.products_basket_count !=0){
      that.sendBtn("正在购买", "RCChatroomUserBuy")
    }
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
            list_voucher: res.data.datas.store_voucher
          })
          // console.log(Object.keys(that.data.list_voucher).length)
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
  gobefore: function () {
    var that = this;
    if(that.data.data.isgroupbuy && that.data.num>1){
      wx.showToast({
        icon: "none",
        title: "您购买的数量超过上限",
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
   
    var param = {};
    param.groupbuy_number = that.data.choose_num;
    param.groupbuy_type = 'originate'
    param.cart_id = that.data.products_id + "|" + that.data.num;
    param.key = wx.getStorageSync('key');
    param.gdID = that.data.products_id;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        key: wx.getStorageSync('key')
      },
      url: app.globalData.apiUrl + '/cli/CustBuy/order_confirm',
      method: "POST",
      data: param,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
          return
        } else {
          console.log('../../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num + "&gdID=" + that.data.products_id)
          navigateTo('../../buy/buy?products_id=' + that.data.products_id + '&buynum=' + that.data.num + "&gdID=" + that.data.products_id)
        }
      },
      complete: function (res) {
        // wx.hideLoading();
      },
    })
  },
  gobuy: util.throttle(function (e) {
    var that = this;
    if(that.data.isgroupbuy){
       that.gobefore()
       return;
    }
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    
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
        wx.hideLoading();
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
        // wx.hideLoading();
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
        // wx.redirectTo({
        //   url: '../../getUserInfo/getUserInfo?is_live='+true+'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
        // })
        navigateTo('../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id)
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
    if(e.currentTarget.dataset.products_id){
      var products_id = e.currentTarget.dataset.products_id;
      that.choosegoods(products_id);
      productsId = products_id;
    }
    
    that.setData({
      an1: "up",
      num:1
     
    })
    if(that.data.anGroup=="up"){
       that.setData({
        anGroup: "down"
       })
    }
  },
  // 拼团
  getgroup:function(e){
    var that=this
    var products_id = e.currentTarget.dataset.products_id;
    that.choosegoods(products_id);
    that.setData({
      anGroup: "up",
      choose_num:5,
      num:1
    })
  },
  closeGroup:function(){
    this.setData({
      anGroup: "down"
    })
  },
  chooseNum: function (e) {
    this.setData({
      choose_num: e.currentTarget.dataset.num,
      choose_price: e.currentTarget.dataset.price
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
  // joincart:function(){
  //   var that=this;
  //   app.join_cart(this.data.products_id, this.data.num);
  //   setTimeout( function(){
  //     that.getCartNum()
  //   },500)
  //   this.setData({
  //     an1: "down",
  //   })
  // },
  joincart:function(){
    var that = this;
    const wxreq = wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
      },
      url: app.globalData.apiUrl + "/cli/CustCart/cart_add",
      method: "POST",
      data: {
        products_id: that.data.products_id,
        quantity: that.data.num,
        key: wx.getStorageSync('key'),
      },
      success: function (res) {
        if (res.data.code == 400) {
          wx.showToast({
            icon: "none",
            title: res.data.datas.error,
            duration: 1000
          })
        } else {
          wx.showToast({
            icon: "none",
            title: "加入购物车成功",
            duration: 1000
          })
          that.setData({
              an1: "down",
          })
          that.getCartNum();
        }

      },
      fail: function (res) {

      }
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
          that.setData({
            products_map_spec:[],
            chooseText:"默认"
          })
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
          data: res.data.datas,
          products_id: products_id,
          imgUrls: res.data.datas.products_image.split(","),
          goods_price: res.data.datas.products_info.products_price,
          products_promotion_price: res.data.datas.products_info.products_promotion_price,
          products_promotion_type:res.data.datas.products_info.products_promotion_type,
          goods_detail: res.data.datas,
          isgroupbuy:res.data.datas.isgroupbuy,
        })
        if(that.data.isgroupbuy){
          that.setData({
            choose_price: res.data.datas.groupbuy_commonInfo.groupbuy_price5
          })
        }
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
      // wx.redirectTo({
      //   url: '../../getUserInfo/getUserInfo?is_live='+true+'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id
      // })
      navigateTo('../../getUserInfo/getUserInfo?is_live='+ true +'&store_id=' + that.data.store_id+"&notice_id="+that.data.notice_id)
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
          that.sendBtn("领取了红包", "RCChatroomVoucher");
          var ziji={content:{"castid": custId, "msg":"领取了红包","nickname":nickname}, "messageType": "RCChatroomVoucher" }
          that.setData({
            showVoucher: false,
            buyList: ziji
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
      wx.hideLoading()
      // wx.showLoading({
      //   title: '连接中...',
       
      // });
      that.setData({
        isError:true
      })
    }else if(e.detail.code=="2003"){
      wx.hideLoading()
    }else if(e.detail.code=="2007"){
      if(!that.data.is_showEnd){
        wx.showLoading({
          title: '连接中...',
        });
      }
    }else if(e.detail.code=="2004"){
      wx.hideLoading()
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
    //重新渲染关注
    im.unwatch();
    that.watchNews();


    if(!is_connect){
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
            that.setData({
              is_followStore: res.data.datas.store_info.is_favorate,
            });
            custId = res.data.datas.free_groupbuy_qualified.custId
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
                nickname = res.data.datas.cust_nickname
                that.setData({
                  liveSrc:"",
               })
                that.setData({
                   liveSrc:res.data.datas.flvurl,
                   playerS:true
                })
                if(wx.getStorageSync('friends_agent_code') && wx.getStorageSync('key')){
                  that.getFriend(wx.getStorageSync('friends_agent_code'));
                  wx.setStorageSync('friends_agent_code', "");
                }
              },
              
              fail: function (res) {
                
              }
      
            })
          } 
        },
        fail: function (res) { },
  
      })
      that.getCartNum();
      // that.quertStore();
     
      // 重新连接
      // var user = {
      //   token: token
      // };
      // im.connect(user).then(function(user) {
      //   console.log('链接成功, 链接用户 id 为: ', user);
      //   //监听
      //   // that.watchNews();
      //   that.joinRoom(0)
      //   // that.historyNews()
      // }).catch(function(error) {
      //   console.log('链接失败: ', error.code, error.msg);
      // });
      im.reconnect().then(function(user) {
        console.log('重新链接成功, 链接用户 id 为: ', user.id);
        that.joinRoom(0)
      }).catch(function(error) {
        console.log('链接失败: ', error.code, error.msg);
      });
    }
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
    is_connect=false
    that.closeConnect()
    that.setData({
      an1: "",
      an:"",
      liveSrc:""
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    is_connect=false
    that.closeConnect()

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
    // that.createNewImg();
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
      that.setData({
        is_followStore: true,
        voucherText: "立即领取",
      })
      if(level!=1){
        var ziji={content:{"castid": custId, "msg":"关注了主播","nickname":nickname}, "messageType": "RCChatroomFollow" }
        that.setData({
          buyList: ziji,
        })
        that.sendBtn("关注了主播", "RCChatroomFollow");
      }
     
    },
  })
}

function decodeUnicode(str) {
  var ret = '';
  var splits = str.split(';');
  for (let i = 0; i < splits.length; i++) {
    ret += spliteDecode(splits[i]);
  }
  return ret;
}
 
 
/**
 * 解析单个unidecode字符
 */
function spliteDecode(value) {
  var target = value.match(/\\u\d+/g);
  if (target && target.length > 0) {
    target = target[0];
    var temp = value.replace(target, '{{@}}');
    target = target.replace('\\u', '');
    target = String.fromCharCode(parseInt(target));
    return temp.replace("{{@}}", target);
  } else {
    // value = value.replace( '\\u', '' );
    // return String.fromCharCode( parseInt( value, '10' ) )
    return value;
  }
}
function gup(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  return results == null ? null : results[1];
}
