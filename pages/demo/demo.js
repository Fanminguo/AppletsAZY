// pages/prize/prize.js
const app = getApp()
import QRCode from '../../utils/weapp-qrcode.js';
let rpx = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/0@2x.png",//banner
    storeAvator: 'https://bj.aizhiyi.com/wap/images/me_icon/z202.jpg',//店铺
    posterLiveIcon: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zc45.png",//海报正在直播icon
    posterLogo: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zc46.png",//爱之依-直播icon
    noticeLogo: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zb_bq2@2x0000.png",//直播预告
    playbackLogo: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zb_bq2@2x.png",//直播回放
    serviceCodeUrl: '',//客服二维码地址
    posetrCodeUrl: "https://bj.aizhiyi.com/live?store_id=123&agent_code=1UU1PVL&notice_id=250",
    text: '治安室打开链接发生治安室打开链接发生卡的加了kg啊撒圣诞节了卡的加了kg啊撒治安室打开链接发生卡的加了kg啊撒圣诞节了圣诞节治安室打开链接发生卡的加了kg啊撒圣诞节了了'
  },
  //获取输入框的值

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getImageInfo({
      src: this.data.noticeLogo,
      success: (res) => {
        this.setData({
          noticeLogo: res.path
        })
      }
    })
    wx.getImageInfo({
      src: this.data.playbackLogo,
      success: (res) => {
        this.setData({
          playbackLogo: res.path
        })
      }
    })
    wx.getImageInfo({
      src: this.data.storeAvator,
      success: (res) => {
        this.setData({
          storeAvator: res.path
        })
      }
    })
    //把网络图片转成在本地
    wx.getImageInfo({
      src: this.data.posterLiveIcon,
      success: (res) => {
        this.setData({
          posterLiveIcon: res.path
        })
      }
    })
    wx.getImageInfo({
      src: this.data.imgUrl,
      success: (res) => {
        this.setData({
          imgUrl: res.path
        })
      }
    })
    wx.getImageInfo({
      src: this.data.posterLogo,
      success: (res) => {
        this.setData({
          posterLogo: res.path
        })
      }
    })
  },
  //   生成二维码
  code: function () {
    var that = this
    new QRCode('myQrcode', {
      text: that.data.posetrCodeUrl,
      width: 77,
      height: 77,
      padding: 1, // 生成二维码四周自动留边宽度，不传入默认为0
      // correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        that.setData({
          hide: true,
          posetrCodeUrl: res.path
        })
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
      }
    })
  },
  
  getcanvas() {
    console.log(rpx + "rpx")
    let ctx = wx.createCanvasContext('canvas-demo')
    let metrics = ctx.measureText('作者')    //获取字体的宽度
    let name = ctx.measureText('CWL')        //获取字体的宽度
    var temp = "";
    var row = [];

    //填充白色背景
    // ctx.setFillStyle('#fff')
    // ctx.arc(20 * rpx)
      //   **
  //* 绘制圆角矩形
  //* @param { Object } ctx - canvas组件的绘图上下文
  //* @param { Number } x - 矩形的x坐标
  //* @param { Number } y - 矩形的y坐标
  //* @param { Number } w - 矩形的宽度
  //* @param { Number } h - 矩形的高度
  //* @param { Number } r - 矩形的圆角半径
  //* @param { String } [c = 'transparent'] - 矩形的填充色
  //* /
    this.roundRect(ctx, 0, 0, 257*rpx, 449*rpx, 10, "red")

    // ctx.fillRect(0, 0, 500, 1000)
    //开始画海报
// 图片的x坐标
let bg_x =  16 * rpx
// 图片的y坐标
let bg_y = 55 * rpx
// 图片宽度
let bg_w = 225 * rpx
// 图片高度
let bg_h = 225 * rpx
// 图片圆角
let bg_r = 4
// 绘制海报背景图片圆角
ctx.save()
ctx.beginPath()
ctx.arc(bg_x + bg_r, bg_y + bg_r, bg_r, Math.PI, Math.PI*1.5)
ctx.arc(bg_x + bg_w - bg_r, bg_y + bg_r, bg_r, Math.PI * 1.5, Math.PI * 2)
ctx.arc(bg_x + bg_w - bg_r, bg_y + bg_h - bg_r, bg_r, 0, Math.PI * 0.5)
ctx.arc(bg_x + bg_r, bg_y + bg_h - bg_r, bg_r, Math.PI * 0.5, Math.PI)
ctx.clip()
ctx.drawImage(this.data.imgUrl, bg_x, bg_y, bg_w, bg_h)

// 恢复之前保存的绘图上下文
ctx.restore()

    
    // ctx.drawImage(this.data.imgUrl, 16 * rpx, 55 * rpx, 225 * rpx, 225 * rpx)//banner
    //店铺头像
    // ctx.clearRect(16 * rpx, 16 * rpx, 32 * rpx, 32 * rpx);
    //开始路径画圆,剪切处理
    ctx.save();
    ctx.beginPath();
    ctx.arc(32 * rpx, 28 * rpx, 15 * rpx, 0, Math.PI * 2, false);
    ctx.clip(); //剪切路径
    ctx.drawImage(this.data.storeAvator, 16 * rpx, 12 * rpx, 32 * rpx, 32 * rpx);
    ctx.restore();
    // ctx.drawImage(this.data.storeAvator, 16, 20, 32 * rpx, 32 * rpx)
    //正在直播icon
    ctx.drawImage(this.data.posterLiveIcon, 192 * rpx, 0, 50 * rpx, 42 * rpx)
    //店铺名字
    ctx.setFillStyle("#343438")
    ctx.setFontSize(12 * rpx)
    ctx.fillText('专馆店铺', 50 * rpx, 25 * rpx)
    //粉丝
    ctx.setFontSize(10 * rpx)
    ctx.setFillStyle("#888585")
    ctx.fillText('32141粉丝', 50 * rpx, 42 * rpx)
    //在线人数红背景
    // ctx.moveTo(16 * rpx,55 * rpx);           // 创建开始点
    // ctx.lineTo(225 * rpx,55 * rpx);          // 创建水平线
    // ctx.arcTo(16 * rpx,226 * rpx,60 * rpx,225* rpx,20* rpx); // 创建弧
    // ctx.lineTo(660* rpx,868* rpx);         // 创建垂直线
    // ctx.arcTo(660* rpx,878* rpx,650* rpx,878*rpx,20*rpx); // 创建弧
    // ctx.lineTo(40*rpx,878*rpx);         // 创建水平线
    // ctx.arcTo(30*rpx,878*rpx,30*rpx,868*rpx,20*rpx); // 创建弧
    // ctx.lineTo(30*rpx,256*rpx);         // 创建垂直线
    // ctx.arcTo(30*rpx,246*rpx,40*rpx,246*rpx,20*rpx); // 创建弧
    // ctx.closePath()
    // ctx.clip();
    // ctx.stroke();
    // ctx.restore();


    // ctx.fillStyle = "#FF0000";
    // ctx.fillRect(30 * rpx, 70 * rpx, 65 * rpx, 17 * rpx);
    roundRectColor(ctx,30 * rpx, 70 * rpx, 65 * rpx, 17 * rpx,5);

    //在线人数
    ctx.setFillStyle("#FFFFFF")
    ctx.fillText('234人观看', 40 * rpx, 82 * rpx)
  
    //直播标题
    ctx.setFillStyle("#343438")
    // ctx.fillText(this.data.text, 16 * rpx , 275 * rpx)
    // this.drawText(ctx,this.data.text,16*rpx, 255*rpx, 10*rpx,200*rpx) // 自动换行  但是不显示...
    for (var a = 0; a < this.data.text.length; a++) {
      if (ctx.measureText(temp).width < 220) {
        temp += this.data.text[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < 220) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 16 * rpx, 300 * rpx + b * 20 * rpx, 250 * rpx);
    }


    //虚线
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    // 设置间距（参数为无限数组，虚线的样式会随数组循环）
    ctx.setLineDash([3, 5]);
    // 移动画笔至坐标 x20 y20 的位置
    ctx.moveTo(16 * rpx, 340 * rpx)
    // 绘制到坐标 x70, y100 的位置
    ctx.lineTo(285 * rpx, 340 * rpx)
    // 填充颜色
    ctx.strokeStyle = "#000000";
    // 开始填充
    ctx.stroke();
    ctx.closePath();
    //头像
    // ctx.clearRect(16 * rpx, 320 * rpx, 26 * rpx, 26 * rpx);
    //开始路径画圆,剪切处理
    ctx.save();
    ctx.beginPath();
    ctx.arc(26 * rpx, 362 * rpx, 12 * rpx, 0, Math.PI * 2, false);
    ctx.clip(); //剪切路径
    ctx.drawImage(this.data.imgUrl, 13 * rpx, 350 * rpx, 26 * rpx, 26 * rpx);
    ctx.restore();
    // ctx.drawImage(this.data.imgUrl, 16* rpx, 320* rpx, 26* rpx, 26 * rpx)
    //昵称
    ctx.setFontSize(12 * rpx)
    ctx.setFillStyle("#343438")
    ctx.fillText('笨笨 邀您观看', 50 * rpx, 360 * rpx)
    //中国文化直播之旅
    ctx.setFontSize(10 * rpx)
    ctx.setFillStyle("#888585")
    ctx.fillText('中国文化直播之旅', 50 * rpx, 375 * rpx)
    //底部logo
    ctx.drawImage(this.data.posterLogo, 16, 400 * rpx, 94 * rpx, 15 * rpx)//正在直播icon
    // //直播二维码
    // ctx.drawImage(this.data.posetrCodeUrl, 140 * rpx, 345 * rpx, 40 * rpx, 40 * rpx)
    // ctx.fillText('长按查看', 140 * rpx, 400 * rpx)
    // ctx.fillText('直播详情', 140 * rpx, 415 * rpx)
    // // 客服二维码
    // ctx.drawImage(this.data.posetrCodeUrl, 190 * rpx, 345 * rpx, 40 * rpx, 40 * rpx)
    // console.log(this.data.posetrCodeUrl)
    // ctx.fillText('长按查看', 190 * rpx, 400 * rpx)
    // ctx.fillText('直播详情', 190 * rpx, 415 * rpx)
    // 如果只有一个二维码
    ctx.drawImage(this.data.posetrCodeUrl, 170 * rpx, 340 * rpx, 60 * rpx, 60 * rpx)
    ctx.fillText('长按扫码查看', 170 * rpx, 415 * rpx)

    ctx.setFillStyle("#888585")
    ctx.setFillStyle('#fff')
    ctx.draw()


  },

  saveimg() {
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    wx.canvasToTempFilePath({
      canvasId: 'canvas-demo',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            setTimeout(function () {
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
              })
            }, 2000)
          }
        })


      }
    });
  },
  
  //   **
  //  * 绘制圆角矩形
  //   * @param { Object } ctx - canvas组件的绘图上下文
  //     * @param { Number } x - 矩形的x坐标
  //       * @param { Number } y - 矩形的y坐标
  //         * @param { Number } w - 矩形的宽度
  //           * @param { Number } h - 矩形的高度
  //             * @param { Number } r - 矩形的圆角半径
  //               * @param { String } [c = 'transparent'] - 矩形的填充色
  //                 * /
  roundRect(ctx, x, y, w, h, r, c = '#fff') {
    if (w < 2 * r) { r = w / 2; }
    if (h < 2 * r) { r = h / 2; }

    ctx.beginPath();
    ctx.fillStyle = c;

    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);

    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);

    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);

    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    ctx.fill();
    ctx.closePath();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.code()
    wx.getSystemInfo({
      success(res) {
        rpx = res.windowWidth / 375;   //适配手机
      },
    })
    setTimeout(function () {
      that.getcanvas()
    }, 2000)

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
  onShareAppMessage: function (res) {
    return {
      title: "这个是我分享出来的东西",
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})

function roundRectColor(context, x, y, w, h, r) {  //绘制圆角矩形（纯色填充）
  context.save();
  context.setFillStyle("#CA493A"); 
  context.setStrokeStyle('#CA493A')
  context.setLineJoin('round');  //交点设置成圆角
  context.setLineWidth(r);
  context.strokeRect(x + r/2, y + r/2, w - r , h - r );
  context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
  context.stroke();
  context.closePath();
}