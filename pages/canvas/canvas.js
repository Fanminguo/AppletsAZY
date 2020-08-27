const app = getApp()
import QRCode from '../../utils/weapp-qrcode.js';
let rpx = 1;
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		imgUrl: "",//banner
		storeAvator: '',//店铺
		posterLiveIcon: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zc45.png",//海报正在直播icon
		posterLogo: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zc46.png",//爱之依-直播icon
		noticeLogo: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zb_bq2@2x0000.png",//直播预告
		playbackLogo: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/zb_bq2@2x.png",//直播回放
		serviceCodeUrl: '',//客服二维码地址
		posetrCodeUrl: "",
		text: '',
		azyLogo:'https://bj.aizhiyi.com/wap/images/me_icon/name62.png'
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 画canvas所需要的数据
		// posetrCodeUrl页面二维码
		// type=1   回放 2=预告
		// kf_qr_img  客服二维码
		// notice_image   海报banner
		// store_name 店铺名称
		// store_avatar 店铺头像
		// store_collect  粉丝数量
		// title 标题
		// cust_nickname 分享人
		// cust_avatar 分享人头像
		// fans 观看人数
		// item 开播时间
	
		adaptation: function (serviceCodeUrl, type, kf_qr_img, notice_image, store_name, store_avatar, store_collect, title, cust_nickname, cust_avatar, fans, item) {
			this.videoContext = wx.createVideoContext('videoplayer', this);
			this.setData({
				updateState: true,
				topHeight: wx.getMenuButtonBoundingClientRect().top
			})
			wx.showLoading({
				title: '生成中',
			})
			var that = this
			that.setData({
				posetrCodeUrl: serviceCodeUrl,
				type: type,
				serviceCodeUrl: kf_qr_img,
				imgUrl: notice_image,
				store_name: store_name,
				storeAvator: store_avatar,
				store_collect: store_collect,
				text: title,
				cust_nickname: cust_nickname,
				avatar: cust_avatar,
				fans: fans,
				item: item
			})
			this.load()
			wx.getSystemInfo({
				success(res) {
					rpx = res.windowWidth / 375;   //适配手机
				},
			})
			setTimeout(function () {
				that.getcanvas()
			}, 2000)
		},

		// 更新图片
		load: function () {
				// 二维码
				wx.getImageInfo({
					src: this.data.posetrCodeUrl,
					success: (res) => {
						this.setData({
							posetrCodeUrl: res.path
						})
					}
				})
			// 头像
			wx.getImageInfo({
				src: this.data.azyLogo,
				success: (res) => {
					this.setData({
						azyLogo: res.path
					})
				}
			})
			// 头像
			wx.getImageInfo({
				src: this.data.avatar,
				success: (res) => {
					this.setData({
						avatar: res.path
					})
				}
			})
			// 客服
			wx.getImageInfo({
				src: this.data.serviceCodeUrl,
				success: (res) => {
					this.setData({
						serviceCodeUrl: res.path
					})
				}
			})
			// 直播预告
			wx.getImageInfo({
				src: this.data.noticeLogo,
				success: (res) => {
					this.setData({
						noticeLogo: res.path
					})
				}
			})
			//   直播回放
			wx.getImageInfo({
				src: this.data.playbackLogo,
				success: (res) => {
					this.setData({
						playbackLogo: res.path
					})
				}
			})
			//   店铺头像
			wx.getImageInfo({
				src: this.data.storeAvator,
				success: (res) => {
					this.setData({
						storeAvator: res.path
					})
					
				}
			})
			//把网络图片转成在本地
			//   正在直播icon
			wx.getImageInfo({
				src: this.data.posterLiveIcon,
				success: (res) => {
					this.setData({
						posterLiveIcon: res.path
					})
				}
			})
			//   banner
			wx.getImageInfo({
				src: this.data.imgUrl,
				success: (res) => {
					this.setData({
						imgUrl: res.path
					})
				}
			})
			//   爱之依logo
			wx.getImageInfo({
				src: this.data.posterLogo,
				success: (res) => {
					this.setData({
						posterLogo: res.path
					})
				}
			})
		},

		//   生成canvas
		getcanvas() {
			let ctx = wx.createCanvasContext('canvas-demo', this)
			let metrics = ctx.measureText('作者')    //获取字体的宽度
			let name = ctx.measureText('CWL')        //获取字体的宽度
			var temp = "";
			var row = [];
			console.log(ctx)
			//* 绘制圆角矩形
			//* @param { Object } ctx - canvas组件的绘图上下文
			//* @param { Number } x - 矩形的x坐标
			//* @param { Number } y - 矩形的y坐标
			//* @param { Number } w - 矩形的宽度
			//* @param { Number } h - 矩形的高度
			//* @param { Number } r - 矩形的圆角半径
			//* @param { String } [c = 'transparent'] - 矩形的填充色
			//* /
			this.roundRect(ctx, 0, 0, 257 * rpx, 449 * rpx, 10, "#fff")

			//开始画海报
			// 图片的x坐标
			let bg_x = 16 * rpx
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
			ctx.arc(bg_x + bg_r, bg_y + bg_r, bg_r, Math.PI, Math.PI * 1.5)
			ctx.arc(bg_x + bg_w - bg_r, bg_y + bg_r, bg_r, Math.PI * 1.5, Math.PI * 2)
			ctx.arc(bg_x + bg_w - bg_r, bg_y + bg_h - bg_r, bg_r, 0, Math.PI * 0.5)
			ctx.arc(bg_x + bg_r, bg_y + bg_h - bg_r, bg_r, Math.PI * 0.5, Math.PI)
			ctx.clip()
			ctx.drawImage(this.data.imgUrl, bg_x, bg_y, bg_w, bg_h)
			// 恢复之前保存的绘图上下文
			ctx.restore()
			//店铺头像
			// ctx.clearRect(16 * rpx, 16 * rpx, 32 * rpx, 32 * rpx);
			
			// ctx.drawImage(this.data.storeAvator, 16, 20, 32 * rpx, 32 * rpx)
			//正在直播icon
			if (this.data.type == 1) {
				ctx.drawImage(this.data.playbackLogo, 192 * rpx, 0, 50 * rpx, 42 * rpx)
			} else if (this.data.type == 2) {
				ctx.drawImage(this.data.noticeLogo, 192 * rpx, 0, 50 * rpx, 42 * rpx)
			} else if (this.data.type == 3) {
				ctx.drawImage(this.data.posterLiveIcon, 192 * rpx, 0, 50 * rpx, 42 * rpx)

			}
		
			//店铺名字
			ctx.setFillStyle("#343438")
			ctx.setFontSize(12 * rpx)
			ctx.fillText(this.data.store_name, 50 * rpx, 25 * rpx)
			//粉丝
			ctx.setFontSize(10 * rpx)
			ctx.setFillStyle("#888585")
			ctx.fillText(this.data.store_collect + '粉丝', 50 * rpx, 42 * rpx)

			if (this.data.type == 3) {
				var fans =  this.data.fans+'人观看'
				var width = ctx.measureText(fans).width
				this.roundRect(ctx, 30 * rpx, 70 * rpx, width * rpx +20, 17 * rpx,5, "red");
				//在线人数
				ctx.setFillStyle("#FFFFFF")
				ctx.fillText(fans, 40 * rpx, 82 * rpx)
			} else if (this.data.type == 2) {
				var text = '●' + this.data.item
				var width = ctx.measureText(text).width
				this.roundRect(ctx, 30 * rpx, 70 * rpx, width * rpx +20, 17 * rpx,5, "#CA493A");
				//直播预告
				ctx.setFillStyle("#FFFFFF")
				ctx.fillText(text, 40 * rpx, 82 * rpx)

			}

			//直播标题
			ctx.setFillStyle("#343438")
				
			// ctx.fillText(this.data.text, 16 * rpx , 275 * rpx)
			// this.drawText(ctx,this.data.text,16*rpx, 255*rpx, 10*rpx,200*rpx) // 自动换行  但是不显示...
			// this.setData({
			// 	text:'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd'
			// })
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
				ctx.fillText(row[b], 16 * rpx, 305 * rpx + b * 20 * rpx, 230 * rpx);
			}


			//虚线
			ctx.beginPath();
			ctx.lineWidth = 0.5;
			// 设置间距（参数为无限数组，虚线的样式会随数组循环）
			ctx.setLineDash([3, 5]);
			// 移动画笔至坐标 x20 y20 的位置
			ctx.moveTo(16 * rpx, 335 * rpx)
			// 绘制到坐标 x70, y100 的位置
			ctx.lineTo(245 * rpx, 335 * rpx)
			// 填充颜色
			ctx.strokeStyle = "#000000";
			// 开始填充
			ctx.stroke();
			ctx.closePath();
			//头像
			// ctx.clearRect(16 * rpx, 320 * rpx, 26 * rpx, 26 * rpx);
			//开始路径画圆,剪切处理
		
			if(wx.getStorageSync('key')){
				ctx.save();
				ctx.beginPath();
				ctx.arc(26 * rpx, 367 * rpx, 12 * rpx, 0, Math.PI * 2, false);
				ctx.clip(); //剪切路径
				ctx.drawImage(this.data.avatar, 13 * rpx, 355 * rpx, 26 * rpx, 26 * rpx);
			}else{
				ctx.drawImage(this.data.azyLogo, 13 * rpx, 355	 * rpx, 26 * rpx, 26 * rpx);
			}
			ctx.restore();
			//昵称
			ctx.setFontSize(12 * rpx)
			ctx.setFillStyle("#343438")

			
			if(wx.getStorageSync('key')){
				ctx.fillText(this.data.cust_nickname + '邀您观看', 45 * rpx, 365 * rpx)
			}else{
				ctx.fillText( '邀您观看', 45 * rpx, 365 * rpx)
			}
			//中国文化直播之旅
			ctx.setFontSize(10 * rpx)
			ctx.setFillStyle("#888585")
			ctx.fillText('中国文化直播之旅', 45 * rpx, 380 * rpx)
			//底部logo
			ctx.drawImage(this.data.posterLogo, 16, 400 * rpx, 94 * rpx, 15 * rpx)//正在直播icon
			if (this.data.serviceCodeUrl != "") {
				//	客服二维码
				ctx.drawImage(this.data.serviceCodeUrl, 155 * rpx, 345 * rpx, 40 * rpx, 40 * rpx)
				ctx.fillText('长按添加', 155 * rpx, 400 * rpx)
				ctx.fillText('微信群聊', 155 * rpx, 415 * rpx)
				// 二维码
				ctx.drawImage(this.data.posetrCodeUrl, 205 * rpx, 345 * rpx, 40 * rpx, 40 * rpx)
				ctx.fillText('长按查看', 205 * rpx, 400 * rpx)
				ctx.fillText('直播详情', 205 * rpx, 415 * rpx)
			} else {
				// 如果只有一个二维码
				ctx.drawImage(this.data.posetrCodeUrl, 175 * rpx, 340 * rpx, 60 * rpx, 60 * rpx)
				console.log(this.data.posetrCodeUrl)
				ctx.fillText('长按扫码查看', 175 * rpx, 415 * rpx)
			}
			ctx.setFillStyle('#fff')
			//开始路径画圆,剪切处理
			ctx.save();
			ctx.beginPath();
			ctx.arc(25 * rpx, 28 * rpx, 15 * rpx, 0, Math.PI * 2, false);
			ctx.clip(); //剪切路径
			ctx.drawImage(this.data.storeAvator, 9 * rpx, 12 * rpx, 32 * rpx, 32 * rpx);
			ctx.restore();
			ctx.draw()
			
			console.log(12333333)
			wx.hideLoading()

		},
		//   保存
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
							wx.hideLoading();
							wx.showToast({
								title: '保存成功',
							})
						}
					}, this)
				}
			}, this);
		},
	
		//   **
		//  * 绘制圆角矩形
		//* @param { Object } ctx - canvas组件的绘图上下文
		//* @param { Number } x - 矩形的x坐标
		//* @param { Number } y - 矩形的y坐标
		//* @param { Number } w - 矩形的宽度
		//* @param { Number } h - 矩形的高度
		//* @param { Number } r - 矩形的圆角半径
		//* @param { String } [c = 'transparent'] - 矩形的填充色
		//* /
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

	},


})

