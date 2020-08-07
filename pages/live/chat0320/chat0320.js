// pages/live/chat0320/chat0320.js
// pages/live/chat3/chat3.js
const App = getApp()
var util = require('../../../utils/util.js')
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logmsg: '',
    isCont: false,
    sendFun:null,
    byeFun:null

  },
  logger: function (msg) {

    this.setData({

      logmsg: util.formatTime(new Date()) + '\n' + msg + '\n\n' + this.data.logmsg,
    })
  },
  contBtn: function () {
    let openid = '6477A8C8-13CF-42EE-B6D0-840698266D02'
    let roomid = '0001'
    let sign = 'c2119598d44088ff3c4fa796affac2a8'
    this.AzyConnectSocket(openid, roomid, sign)
  },
  sendBtn: function () {
    this.data.sendFun("测试消息[" + Math.random() + "")

  },
  byeBtn: function () {
     this.data.byeFun()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },

  AzyConnectSocket: function (openid, roomid, sign) {
    var logger=this.logger;
    var context=this;
    var Stomp = require('../../../utils/stomp.min.js').Stomp;
    // socket是否连接
    var socketConnected = false;
    // 待发送的消息队列
    var messageQueue = [];
   


    // 发送消息
    function sendSocketMessage(msg) {
      // 如果socket已连接则发送消息
      if (socketConnected) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        // socket没有连接将消息放入队列中
        messageQueue.push(msg);
      }
    }

    // 关闭连接
    function close() {
      if (socketConnected) {
        wx.closeSocket()
      }
    }

    // 符合WebSocket定义的对象
    var ws = {
      send: sendSocketMessage,
      close: close
    }

    // 创建一个 WebSocket 连接
    function connect() {
      wx.connectSocket({
        //userid 用openid ,尾部是否需要websocket 测试看看
        header: {
          'content-type': 'application/json',
          room: roomid,
          sign: sign,
          userid: openid,
        },
        url: 'wss://chat.aizhiyi.com:19123/servPoint191225/' + openid + '/websocket'
      })
    }
    connect();
    // 监听 WebSocket 连接打开事件
    wx.onSocketOpen(function (res) {
      console.log("WebSocket 连接成功")
      socketConnected = true;
      ws.onopen();
      // 连接成功后，将队列中的消息发送出去
      let queueLength = messageQueue.length
      for (let i = 0; i < queueLength; i++) {
        const messageQueueElement = messageQueue.shift();
        wx.sendSocketMessage({
          data: messageQueueElement
        })
      }
    })

    // 监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function (res) {
      ws.onmessage(res);
    })

    // 监听 WebSocket 错误事件
    wx.onSocketError(function (res) {
      console.log("WebSocket 错误事件")
    })

    // 监听 WebSocket 连接关闭事件
    wx.onSocketClose(function (res) {
      console.log("WebSocket 连接关闭")
      socketConnected = false;
       
    })
     logger("建立socket")

  //这里实际应用中 castid,msgtype,nickmsg请根据业务真实传递
    context.data.sendFun= function (msg) {
      if (!socketConnected) {
        this.logger("未连接状态，不能发送消息")
        return
      }
      stompClient.send("/app/chat", {}, JSON.stringify({
        'msg': '{"castid":"864690025448997","msg":' + msg + ',"msgtype":"userinfo","nickname":"Xiaomi","tm":1578291215540}'
      }));

    }

    context.data.byeFun = function () {
      socketConnected = false
      
      stompClient.disconnect()
      wx.closeSocket()
      logger("断开连接")
    }

    Stomp.setInterval = function (interval, f) {
      return setInterval(f, interval);
    };
    // 结束定时器的循环调用
    Stomp.clearInterval = function (id) {
      return clearInterval(id);
    };
    var stompClient = Stomp.over(ws);
    

    logger(openid + "," + roomid + "," + sign)
    logger("STOMP成功建立后>>>> 就发送进房间的消息 msgtype必须为000000，是为了通知房间其他用户你进来了")
    stompClient.connect({
      room: roomid,
      sign: sign,
      userid: openid
    }, function (callback) {

      console.log("connected ballback")
      logger('/live/azy' + roomid)
      //注册房间消息
      stompClient.subscribe('/live/azy' + roomid, function (body, headers) {
        console.log('房间消息<<<<', body);
        logger("房间消息<<<"+body)
      });

      // 注册openid的消息
      stompClient.subscribe('/live/azy' + roomid + '/' + openid, function (message, headers) {
        wx.vibrateLong()
        console.log('用户级openid的<<<<:', message);
        logger("用户单一消息<<<" + message)
        // 通知服务端收到消息
        message.ack();
      });
      
      // 向服务端发送消息
      console.log("发送进入消息.......")
       stompClient.send("/app/chat", {}, JSON.stringify({
         'msg': '{"castid":"864690025448997","msg":"这是测试","msgtype":"000000","nickname":"Xiaomi","tm":' + Date.parse(new Date())+'}'
      }));

      socketConnected=true
    }
    )

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

  }
});