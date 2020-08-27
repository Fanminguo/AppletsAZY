//index.js
//获取应用实例
import * as event from '../../utils/event.js'
const app = getApp()
const windowHeight = wx.getSystemInfoSync().windowHeight;
var startX, endX;
var startY, endY;
var moveFlag = true; // 判断执行滑动事件
const util = require('../../utils/util.js')
import navigateTo from "../../utils/navigateRoute.js"
var http = require('../../utils/httputils.js');
var loginNum = 0
const utilclick = require('../../utils/util.js')
var timer
var videoTime
Page({
	data: {
		hide: false,
		caetNum: "",//评论数
		daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png", //点赞图片路径
		pointratio: "", //点赞数
		percent: 1,
		autoplay: true,
		controls: false,
		showFullscreenBtn: false,
		showPlayBtn: false,
		showFullscreenBtn: false,
		showCenterPlayBtn: false,
		enableProgressGesture: false,
		showProgress: false,
		playState: true,
		animationShow: false,
		currentTranslateY: 0,
		touchStartingY: 0,
		videos: [],
		hiddenText: true, //点赞数
		hiddenokText: false, //点赞后的数字
		animation: {}, //看相似图片旋转a
		videoIndex: 0,
		objectFit: "contain",
		waiting: true,
		showVoucher: false, //代金券弹窗
		// 触摸开始时间
		touchStartTime: 0,
		// 触摸结束时间
		touchEndTime: 0,
		// 最后一次单击事件点击发生时间
		lastTapTime: 0,
		// 单击事件点击后要触发的函数
		lastTapTimeoutFunc: null,
		navShow: true,
		isHide: true, //评论弹出框
		moreHide: false, //更多评论
		mentListThree: [],
		daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png", //点赞图片
		heartsrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/1802ccdda4bce736aee0ea161263a7f.png", //点赞图片 
		addReviewText: "一更多评论一",
		/**
5      * 走马灯
6      */
		text: '',
		marqueePace: 1,//滚动速度
		marqueeDistance: 0,//初始滚动距离
		marqueeDistance2: 0,
		marquee2copy_status: false,
		marquee2_margin: 10,
		size: 14,
		orientation: 'left',//滚动方向
		interval: 100, // 时间间隔
		userInfo: {
			avatarUrl: "",//用户头像
			nickName: "",//用户昵称
		},
		showTips: false,
		show_coll: false,
		keyFalse: true,
		comment_false: false,
		parent_respond_commentid: '',
		systemInfo: {},
		closeData: false,
		advContActive: "",
		advShow: "",
		isShare: "0", //1是2否分享

	},
	onLoad: function (options) {
		var mythis = this;
		mythis.getSystem()
		// wx.hideShareMenu()
		let isIphoneX = app.globalData.isIphoneX;
		console.log(app.globalData.isYes)
			
		setTimeout( function(){
			if (!wx.getStorageSync('key') && app.globalData.isYes==true) {
				getApp().globalData.isYes=false 
				mythis.setData({
					loadApp: true
				})
			}
		},2000)
		

		
		
		this.setData({
			isIphoneX: isIphoneX,
			indexFalse: "",
			topHeight: app.globalData.headerBtnPosi,
			share_id: options.products_commonid,
			agent_code: options.agent_code,
			// topHeight:50
		})
		
		
		wx.getNetworkType({
			success: function (res) {
				// 返回网络类型, 有效值：
				// wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
				console.log(res)
				mythis.setData({
					networkType: res.networkType
				})
			}
		})
	
		// if(mythis.data.agent_code){
		// 	if(!wx.getStorageSync('key')){
		// 	  wx.setStorageSync('friends_agent_code',mythis.data.agent_code);
		// 	}else{
		// 	  mythis.getFriend(mythis.data.agent_code);
		// 	}		
		//   }else{
		// 	if(wx.getStorageSync('friends_agent_code') && wx.getStorageSync('key')){
		// 	  mythis.getFriend(wx.getStorageSync('friends_agent_code'));
		// 	  wx.setStorageSync('friends_agent_code', "");
		// 	}
		//   }
		// if(this.data.agent_code){
		// 	if(wx.getStorageSync('key')){
		// 		this.getFriend(this.data.agent_code);	
		// 	}

		// }

		this.getCartNum();
		// 滑动
		this.queryData1(this.data.share_id);

		this.videoChange = throttle(this.touchEndHandler, 200)
		// 绑定updateVideoIndex事件，更新当前播放视频index
		event.on('updateVideoIndex', this, function (index) {
			videoTime = 0
			// 计时器
			timer = setInterval(function () {
				videoTime++
			}, 1000)
			this.advAn();
			this.setData({
				advShow: false,
				advActive: "",
				advContActive: "",
				closeData: false
			})

			if (this.data.videos.length - 1 == index) {
				this.queryData2();
			}
			if (this.data.systemInfo == "ios" || this.data.systemInfo == "devtools") {
				setTimeout(() => {
					this.setData({
						animationShow: false,
						playState: true,

					}, () => {
						//切换src后，video不能立即播放，settimeout一下
						setTimeout(() => {
							this.vvideo.play()
						}, 100)
					})
				}, 500)
			}
			setTimeout(() => {
				this.setData({
					// animationShow: false,
					// playState: true
				}, () => {
					// 切换src后，video不能立即播放，settimeout一下
					// setTimeout(() => {
					// 	this.vvideo.play()
					// }, 100)
				})
			}, 500)
		})
		this.advAn();

	},
	getAddInfo(e) {
		var mythis = this
		wx.showToast({
		  title: '加载中...',
		  icon:'none',
		  duration:1500
		})
		wx.getNetworkType({
			success: function (res) {
				// 返回网络类型, 有效值：
				// wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
				mythis.setData({
					networkType: res.networkType
				})
				if(mythis.data.networkType!='none' && mythis.data.networkType !='unknown'){
					var options ={}
					options.products_commonid = mythis.data.share_id
					options.agent_code = mythis.data.agent_code
					mythis.onLoad(options)
				}
				
			}
		})
	},
	advAn: function () {
		var that = this;
		setTimeout(function () {
			that.setData({
				advActive: "active",
				advContActive: "active",
			})
		}, 3000)
	},
	closeAdv: function () {
		var that = this;
		that.setData({
			closeData: true,
			advActive: "",
			advContActive: "active reactive remove",
		})
		// that.advAn();
	},
	replay: function () {
		var that = this;
		that.vvideo.play()
		that.setData({
			advActive: '',
			advShow: false,
			advContActive: "",
			closeData: false
		})
		that.advAn();
	},
	bindended2: function (e) {
		if (this.data.videos[this.data.videoIndex].ad_id) {
			var that = this;
			that.setData({
				advShow: true,
			})
			that.vvideo.pause()
		}

	},
	getSystem: function () {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					systemInfo: res.platform,
				})
				//         if(res.platform == "devtools"){
				//             PC
				//         }else if(res.platform == "ios"){
				//             IOS
				//         }else if(res.platform == "android"){
				//             android
				//         }
			}
		})
	},
	//向后台传递用户行为
	getBehavior: function (index) {
		var that = this
		wx.request({
			url: app.globalData.apiUrl + '/cli/Index/NewActionData',
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key')
			},
			data: {
				key: wx.getStorageSync('key'),
				v_stay_time: videoTime,
				is_share: that.data.isShare,
				products_commonid: that.data.videos[that.data.videoIndex].products_commonid
			},
		});

		clearInterval(timer)

		var that = this
		this.setData({
			isShare: "0",
		})
	},

	getFriend: function (agent_code) {
		let prams = {
			agent_code: agent_code,
			share_style: "share_common",
			key: wx.getStorageSync('key')
		}
		http.getRequest(app.globalData.apiUrl + '/cli/Index/share2', prams,
			(res) => {
			},
			(err) => {

			})
	},
	goLive: function (e) {
		var store_id = e.currentTarget.dataset.store_id
		// if (wx.getStorageSync('key')) {
		navigateTo('../live/live/live?store_id=' + store_id)
		// } else {
		// navigateTo('../getUserInfo/getUserInfo')
		// }
	},
	// 关闭app
	guanbiLoad:function(){
		var that=this
		  if(that.data.isTips){
				this.setData({
					showTips:true,
				})
			}
      this.setData({
				
				keyFalse:true,
				loadApp:false
			})
	},
	golivexinren: function (e) {
		this.setData({
			loadApp:true,
			keyFalse:true
		})
		// app.login()
		// if (!wx.getStorageSync('key')) {
		// 	navigateTo('../getUserInfo/getUserInfo')
		// } else {
		// 	this.setData({
		// 		keyFalse: true
		// 	})
		// 	if (wx.getStorageSync('showTips') == true) {

		// 	} else {
		// 		if (this.data.keyFalse) {
		// 			wx.setStorageSync('showTips', true)
		// 			this.setData({
		// 				showTips: true,
		// 			})
		// 		}

		// 	}
		// }
	},
	guanbi: function () {
		this.setData({
			keyFalse: true
		})
		if (wx.getStorageSync('showTips') == true) {

		} else {
			if (this.data.keyFalse) {
				wx.setStorageSync('showTips', true)
				this.setData({
					showTips: true,
				})
			}

		}
	},
	preventTouchMove: function () { },
	// 购物车数量
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
	// 查看详情
	adStore: function () {
		wx.showToast({
			icon: "none",
			title: "广告视频暂不支持该功能",
			duration: 1000
		})
	},
	ad_xiangqing: function (e) {

		var url = e.currentTarget.dataset.url
		navigateTo('../load_app/load_app?link=' + encodeURIComponent(url))
	},
	getCommentNum: function () {
		var that = this;
		var list = that.data.videos;
		wx.request({
			url: app.globalData.apiUrl + '/cli/Comment/getCommentNum',
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key')
			},
			data: {
				products_commonid: that.data.videos[this.data.videoIndex].products_commonid,
				key: wx.getStorageSync('key')
			},
			success: function (res) {
				if (res.statusCode == 200) {
					list[that.data.videoIndex].common_count = res.data.datas.comment_num;
					that.setData({
						videos: list,
					});
				}
			},
			complete: function () {

			}
		});
	},

	// 广告实时评论数
	getCommentAdNum: function () {
		var that = this;
		var list = that.data.videos;
		var percentage = that.data.percentage

		wx.request({
			url: app.globalData.apiUrl + '/cli/Comment/getCommentAdNum',
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key')
			},
			data: {
				ad_id: that.data.videos[this.data.videoIndex].ad_id,
				key: wx.getStorageSync('key')
			},
			success: function (res) {
				if (res.statusCode == 200) {
					list[that.data.videoIndex].common_ad_count = res.data.datas.comment_num;
					percentage.comments_count = res.data.datas.comment_num

					that.setData({
						videos: list,
						percentage: percentage
					});
				}
			},
			complete: function () {

			}
		})
	},
	queryData2: function () {
		var that = this;
		wx.request({
			url: app.globalData.apiUrl + '/cli/Home/headTest',
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key'),
				userid: wx.getStorageSync('openid'),

			},
			data: {
				key: wx.getStorageSync('key'),
			},
			success: function (res) {
				if (res.statusCode == 200) {
					that.setData({
						videos: that.data.videos.concat(res.data.datas)
					})
				}
			},
			complete: function () {
				that.setData({
					hide: true
				})
			}
		});
	},
	queryData1: function (id) {
		var that = this;
		if (!wx.getStorageSync('openid')) {
			loginNum += 1
			if (loginNum == 1) {
				app.login2(that.queryData1)
				return
			}
		}
		var products_commonid;
		if (id) {
			products_commonid = id
		} else {
			products_commonid = ""
		}


		wx.request({
			url: app.globalData.apiUrl + '/cli/Home/headTest',
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				userid: wx.getStorageSync('openid'),
			},
			data: {
				key: wx.getStorageSync('key'),
				products_commonid: products_commonid,
			},
			success: function (res) {
				if (res.statusCode == 200) {
					that.setData({
						videos: res.data.datas,
						qualified: res.data.free_groupbuy_qualified,
						is_show7: res.data.is_show7,
					})
					// that.getBehavior()

					videoTime = 0
					// 计时器
					timer = setInterval(function () {
						videoTime++
					}, 1000)
					if (res.data.invitationCode) {
						wx.setStorageSync('agent_code', res.data.invitationCode);
					}
					if (that.data.videoIndex < 0) {
						that.setData({
							videoIndex: 0,
						})
					}



					if (that.data.qualified) {
						//代金券弹窗开始
						//var cknewmark2 = localStorage.getItem('cknewmark22');
						var cknewmark2 = wx.getStorageSync('cknewmark22')
						var cknew = that.data.qualified.qualified_type;
						var cktime = that.data.qualified.qualified_time;
						var timestamp = parseInt(new Date().valueOf() / 1000);
						if (that.data.qualified.five_send_voucher) { //5元代金券
							var five_send_voucher = that.data.qualified.five_send_voucher;
						} else {
							var five_send_voucher = false;
						}
						if (that.data.qualified.is_group_cust) { //新人0元开团代金券
							var is_group_cust = that.data.qualified.is_group_cust;
						} else {
							var is_group_cust = false;
						}
						if (five_send_voucher) { //五元代金券
							that.postvoucher_five()
							that.setData({
								showVoucher: true,
								fiveVOucher: true,
								voucherTime: that.data.qualified.five_end_time,
							})
						}
						if ((is_group_cust == "2" || cknew == "1") && (cktime > timestamp)) { //新人代金券
							if(app.globalData.isYes==true){
								getApp().globalData.isYes=false 
								that.setData({
									loadApp: true
								})
							}
							
							//localStorage.setItem('cknewmark22', cktime);
							//wx.setStorageSync('cknewmark22', cktime);
							// that.postVoucher()
							// that.setData({
							// 	showVoucher: true,
							// 	newVoucher: true,
							// 	voucherTime: that.data.qualified.new_end_time,
							// })
						} else if (cknew == "2" && cktime != cknewmark2 && (cktime > timestamp)) { //七天未登录
							wx.setStorageSync('cknewmark22', cktime);
							// that.postVoucher()
							// that.setData({
							//   showVoucher: true,
							//   sevenVoucher:true,
							//   voucherTime: that.data.qualified.old_end_time,
							// })
						}
						//代金券弹窗结束
					}
					//第一次弹窗
					if (wx.getStorageSync('showTips') == true) {
              
					} else {
						that.setData({
							isTips:true,
						})
						wx.setStorageSync('showTips', true)//第一次登录true
            
					}
					for (var i = 0; i < that.data.videos.length; i++) {

						if (!that.data.videos[i].ad_id) {
							var text = that.data.videos[i].products_jingle.replace(/\s/g, '')
							var length = text.length * that.data.size * 3;//文字长度

							var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度                   
							that.setData({
								length: length,
								windowWidth: windowWidth,
								marquee2_margin: length < windowWidth ? windowWidth - length : that.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
							});
							that.run2();// 第一个字消失后立即从右边出现
							return;
						}
					}

				}
			},
			complete: function () {
				that.setData({
					hide: true
				})

			}
		});
		// }

	},
	postVoucher: function () {
		var that = this;
		wx.request({
			url: app.globalData.apiUrl + '/cli/FreeGroupbuy/freeCode',
			method: "GET",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key')
			},
			data: {
				key: wx.getStorageSync('key'),
			},
			success: function (res) {
				wx.request({
					url: app.globalData.apiUrl + '/cli/FreeGroupbuy/receiveQualification',
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
						key: wx.getStorageSync('key')
					},
					data: {
						key: wx.getStorageSync('key'),
						freeCode: res.data.datas.freeCode,
						freeCode2: res.data.datas.freeCode2,
					},
					success: function (res) {
						if (res.data.code == 200) {
							that.setData({
								showVoucher: true,
								newVoucher: true,
								voucherTime: that.data.qualified.new_end_time,
							})
						} else {
							wx.showToast({
								icon: "none",
								title: res.data.datas.error,
								duration: 1000
							})
						}
					}
				});
			}
		});
	},
	postvoucher_five: function () {
		wx.request({
			url: app.globalData.apiUrl + '/cli/FreeGroupbuy/groupbuy_send_five_qualified',
			method: "GET",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key')
			},
			data: {
				key: wx.getStorageSync('key'),
			},
			success: function (res) {
				if (res.data.datas.error) {
					wx.showToast({
						icon: "none",
						title: res.data.datas.error,
						duration: 1000
					})
				}
			}

		});
	},
	//点击推荐刷新当前页面
	refresh: function () {
		var that = this;
		that.setData({
			playState: true,
			hide: false
		})
		that.queryData1();
	},
	joincart: function (e) {
		if (wx.getStorageSync('key')) {
			var that = this;
			const wxreq = wx.request({
				header: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
				},
				url: app.globalData.apiUrl + "/cli/CustCart/cart_add",
				method: "POST",
				data: {
					products_id: e.currentTarget.dataset.productid,
					quantity: 1,
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
						that.getCartNum();
					}

				},
				fail: function (res) {

				}
			})
		} else {
			navigateTo('../getUserInfo/getUserInfo')
		}

	},
	// 广告点赞
	advertisement: util.throttle(function (e) {
		var that = this
		var ad_id = e.currentTarget.dataset.ad_id;
		var list1 = that.data.videos;
		var index;
		if (wx.getStorageSync('key')) {
			for (var i = 0; i < list1.length; i++) {
				if (list1[i].ad_id == ad_id) {
					index = i;
					if (list1[i].is_favorate_ad) { //取消点赞
						let parms = {
							ad_id: ad_id,
							key: wx.getStorageSync('key'),
						}
						http.postRequest(app.globalData.apiUrl + '/cli/CustFavoritesAd/favorites_del', parms,
							(res) => {
								list1[index].is_favorate_ad = false;
								list1[index].ad_collect = Number(list1[index].ad_collect) - 1;
								that.setData({
									videos: list1,
								});

							}, (err) => {
								wx.showToast({
									icon: "none",
									title: err.datas.error,
									duration: 1000
								})
							})
						return
					} else { //点赞
						let parms = {
							ad_id: ad_id,
							key: wx.getStorageSync('key')
						}
						http.postRequest(app.globalData.apiUrl + '/cli/CustFavoritesAd/favorites_add', parms,
							(res) => {
								list1[index].is_favorate_ad = true;
								list1[index].ad_collect = Number(list1[index].ad_collect) + 1;
								that.setData({
									videos: list1,
								});

							}, (err) => {
								wx.showToast({
									icon: "none",
									title: err.datas.error,
									duration: 1000
								})
							})
						return
					}
				} else {

				}
			}
		} else {
			navigateTo('../getUserInfo/getUserInfo')
		}
	}, 800),
	// 点赞
	daimaiClick2: util.throttle(function (e) {
		var that = this
		var products_id = e.currentTarget.dataset.products_id;
		var list1 = that.data.videos;
		var index;


		if (wx.getStorageSync('key')) {

			for (var i = 0; i < list1.length; i++) {
				if (list1[i].products_id == products_id) {
					index = i;
					if (list1[i].is_favorate_products) { //取消点赞
						const wxreq = wx.request({
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
								key: wx.getStorageSync('key')
							},
							url: app.globalData.apiUrl + '/cli/CustFavorites/favorites_del',
							method: "POST",
							data: {
								fav_id: products_id,
								key: wx.getStorageSync('key'),
							},
							success: function (res) {
								if (res.data.code == 200) {
									list1[index].is_favorate_products = false;
									list1[index].products_collect = Number(list1[index].products_collect) - 1;
									that.setData({
										videos: list1,
										indexFalse: false
									});

									// wx.showToast({
									//   icon: "none",
									//   title: "取消关注成功",
									//   duration: 1000
									// })
									return
								} else {
									wx.showToast({
										icon: "none",
										title: res.data.datas.error,
										duration: 1000
									})
								}

							},
							fail: function (res) {

							}
						})
					} else { //点赞
						const wxreq = wx.request({
							header: {
								'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
								key: wx.getStorageSync('key')
							},
							url: app.globalData.apiUrl + '/cli/CustFavorites/favorites_add',
							method: "POST",
							data: {
								products_id: products_id,
								key: wx.getStorageSync('key')
							},
							success: function (res) {
								if (res.data.code == 200) {
									list1[index].is_favorate_products = true;
									list1[index].products_collect = Number(list1[index].products_collect) + 1;
									that.setData({
										videos: list1,
										indexFalse: false
									});
									// wx.showToast({
									//   icon: "none",
									//   title: "点赞成功",
									//   duration: 1000
									// })
									return
								} else {
									wx.showToast({
										icon: "none",
										title: res.data.datas.error,
										duration: 1000
									})
								}
							},
							fail: function (res) { }
						})
					}
				} else {

				}
			}
		} else {
			navigateTo('../getUserInfo/getUserInfo')
		}
	}, 800),
	// 关注店铺
	tofollowStore: function (e) {
		var that = this
		var store_id = e.currentTarget.dataset.store_id;
		var list1 = that.data.videos;
		var index;
		var othreindex = false
		if (wx.getStorageSync('key')) {
			for (var i = 0; i < list1.length; i++) {
				if (list1[i].store_id == store_id) {
					index = i;
					if (list1[i].is_favorate_store == false) {
						if (othreindex == false) {
							const wxreq = wx.request({
								header: {
									'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
									key: wx.getStorageSync('key')
								},
								url: app.globalData.apiUrl + '/cli/CustFavoritesStore/favorites_add',
								method: "POST",
								data: {
									store_id: store_id,
									key: wx.getStorageSync('key')
								},
								success: function (res) {
									if (res.data.code == 200) {
										othreindex = true;
										list1[index].is_favorate_store = true;
										that.setData({
											videos: list1,
										});
										return
									} else {
										wx.showToast({
											icon: "none",
											title: res.data.datas.error,
											duration: 1000
										})
									}
								},
								fail: function (res) { }
							})
						} else {

							list1[index].is_favorate_store = true;
							that.setData({
								videos: list1,
							});
						}

					}
				} else {

				}
			}
		} else {
			navigateTo('../getUserInfo/getUserInfo')
		}

	},
	//跳转看相似
	gosimlar: function (e) {
		var that = this
		var pc_id = e.currentTarget.dataset.pcid
		var products_id = e.currentTarget.dataset.productid
		if (that.data.videos[that.data.videoIndex].ad_id) {
			wx.showToast({
				icon: "none",
				title: "广告视频暂不支持该功能",
				duration: 1000
			})
		} else {
			that.changePlayStatus2();
			navigateTo('../products_similar/products_similar?pc_id=' + pc_id + "&products_id=" + products_id)
		}

	},
	gocart: function () {

		if (wx.getStorageSync('key')) {
			this.changePlayStatus2()
			navigateTo('../cart/cart')
		} else {
			navigateTo('../getUserInfo/getUserInfo')
		}
	},
	go_assets: function () {
		this.changePlayStatus2()
		navigateTo('../assets/assets')
	},
	//跳转文创
	goclass: function (e) {
		var num = e.currentTarget.dataset.num
		this.changePlayStatus2();
		navigateTo('../classification/classification?num=' + num)
	},
	//跳转详情
	godetik: function (e) {
		var products_id = e.currentTarget.dataset.productid
		this.changePlayStatus2()
		navigateTo('../commodity/commodity?products_id=' + products_id)

	},
	//跳转店铺
	tostore: function (e) {
		var storeid = e.currentTarget.dataset.storeid
		wx.setStorage({
			key: 'shopHome',
			data: "" //及接收储图片或文件地址的变量
		})
		wx.setStorage({
			key: 'HomeId',
			data: "" //及接收储图片或文件地址的变量
		})
		this.changePlayStatus2();
		navigateTo('../shopHome/shopHome?store_id=' + storeid)

	},
	//跳转关注
	tofollow: function () {
		if (wx.getStorageSync('key')) {
			this.changePlayStatus2();
			navigateTo('../follows/follows?type=1')
		} else {
			navigateTo("../getUserInfo/getUserInfo")
		}

	},
	//我的
	tomy: function () {
		if (wx.getStorageSync('key')) {
			wx.redirectTo({
				url: '../myModule/myModule'
			})
		} else {
			navigateTo("../getUserInfo/getUserInfo")
		}
	},
	//跳转搜索
	tosearch: function () {
		this.changePlayStatus2()
		navigateTo('../search/search')
	},
	//跳转分类
	goproduct_class: function () {
		this.changePlayStatus2()
		navigateTo('../products_class/products_class')
	},
	// 跳转活动
	goactivity: function () {
		this.changePlayStatus2()
		// navigateTo('../hot/hot')
		if (wx.getStorageSync('key')) {
			navigateTo('../myAssets/myAssets')
		} else {
			navigateTo("../getUserInfo/getUserInfo")
		}

	},
	toload: function () {
		this.changePlayStatus2()
		navigateTo('../load_app/load_app?link=' + encodeURIComponent("https://www.aizhiyi.com/wap/app_load.html"))
	},
	bindplay() {
		// this.setData({
		// 	waiting: false
		// })
		var that = this
		setTimeout(function () {
			that.setData({
				waiting: false,
				animationShow: false,
				playState: true
			})
		}, 500)
	},
	binderror(err) {
	},
	bindtimeupdate(e) {
		let percent = (e.detail.currentTime / e.detail.duration) * 100
		this.setData({
			percent: percent.toFixed(2)
		})

	},
	bindwaiting: function () {
		this.setData({
			waiting: true
		})
	},
	onReady: function () {
		// 
		this.vvideo = wx.createVideoContext("kdvideo", this)
		this.animation = wx.createAnimation({
			duration: 500,
			transformOrigin: '0 0 0'
		})
		this.setData({
			topHeight: wx.getMenuButtonBoundingClientRect().top
		})

	},
	changePlayStatus() {
		let playState = !this.data.playState
		if (!this.data.waiting) {
			if (playState) {
				this.vvideo.play()
			} else {
				this.vvideo.pause()
			}
			this.setData({
				playState: playState
			})
		}

	},

	changePlayStatus2() {
		let playState = !this.data.playState
		if (!this.data.waiting) {
			if (!playState) {
				this.vvideo.pause()
				this.setData({
					playState: playState
				})
			}

		}

	},
	touchStart(e) {
		let touchStartingY = this.data.touchStartingY
		touchStartingY = e.touches[0].clientY;
		this.touchStartTime = e.timeStamp
		this.setData({
			touchStartingY: touchStartingY
		})
		startX = e.touches[0].pageX; // 获取触摸时的原点
		startY = e.touches[0].pageY;

		moveFlag = true;
	},
	touchMove(e) {
		// this.videoChange(e)
		// endX = e.touches[0].pageX; // 获取触摸时的原点
		// endY = e.touches[0].pageY; 

		// if (moveFlag) {

		//   if (startX - endX> 50 && Math.abs(endY - startY) < 50) {

		//     moveFlag = false;
		//     wx.navigateTo({
		//       url: '../commodity/commodity?products_id=' + this.data.videos[this.data.videoIndex].products_id
		//     })
		//   }
		// }
	},
	run2: function () {
		var vm = this;
		var interval = setInterval(function () {
			if (-vm.data.marqueeDistance2 < vm.data.length) {
				// 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
				vm.setData({
					marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
					marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
				});
			} else {
				if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
					vm.setData({
						marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
						//marquee2copy_status:false
					});
					clearInterval(interval);
					vm.run2();
				} else {
					clearInterval(interval);
					vm.setData({
						marqueeDistance2: -vm.data.windowWidth
					});
					vm.run2();
				}
			}
		}, vm.data.interval);
	},
	aaa: function () {
		return;
	},
	/// 单击、双击
	multipleTap: function (e) {
		var that = this
		// 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
		if (that.touchEndTime - that.touchStartTime < 350) {
			// 当前点击的时间
			var currentTime = e.timeStamp
			var lastTapTime = that.lastTapTime
			// 更新最后一次点击时间
			that.lastTapTime = currentTime

			// 如果两次点击时间在300毫秒内，则认为是双击事件
			if (currentTime - lastTapTime < 300) {
				// 成功触发双击事件时，取消单击事件的执行
				clearTimeout(that.lastTapTimeoutFunc);
				that.setData({
					navShow: !that.data.navShow
				})
				// wx.showModal({
				//   title: '提示',
				//   content: '双击事件被触发',
				//   showCancel: false
				// })
			} else {
				// 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
				that.lastTapTimeoutFunc = setTimeout(function () {
					if (!that.data.advShow || that.data.advContActive != "active reactive remove") {
						if (that.data.advContActive == "active reactive remove") {
							that.setData({
								advContActive: "active reactive remove aa"
							})
						} else {
							that.changePlayStatus();
						}

					}

				}, 300);
			}
		}
	},
	onShow: function () {
		// setTimeout( function(){
		// 	if(!wx.getStorageSync('cust_mobile') && wx.getStorageSync('key')){
		// 		navigateTo('../bind_mobile/bind_mobile')
		// 	}
		// },500)
		// app.login()
		if (this.data.agent_code) {
			if (wx.getStorageSync('key')) {
				this.getFriend(this.data.agent_code);
			}

		}
		this.setData({
			topHeight: wx.getMenuButtonBoundingClientRect().top,
		})
		custIndex(wx.getStorageSync('key'),this)
		var mythis = this
		// if (wx.getStorageSync('key')) {
		// 	mythis.setData({
		// 		keyFalse: true
		// 	})
		// 	if (wx.getStorageSync('showTips') == true) {

		// 	} else {
		// 		if (this.data.keyFalse) {
		// 			wx.setStorageSync('showTips', true)
		// 			this.setData({
		// 				showTips: true,
		// 			})
		// 		}

		// 	}
		// }
		setTimeout(() => {
			mythis.userCoupon()
		}, 2000);

		mythis.getCartNum();
		wx.getStorage({
			key: 'HomeId', //对应存储的key名
			success: function (res) {
				//成功之后的操作，建议还是先打印res找到需要的东西
				mythis.setData({
					homeId: res.data
				})
			}
		})
		//   店铺
		wx.getStorage({
			key: 'shopHome', //对应存储的key名
			success: function (res) {
				//成功之后的操作，建议还是先打印res找到需要的东西
				for (var i in mythis.data.videos) {
					if (mythis.data.videos[i].store_id == Number(res.data)) {
						mythis.data.videos[i].is_favorate_store = mythis.data.homeId
					}
					mythis.setData({
						videos: mythis.data.videos
					})
				}
			}
		})

		//   点赞
		wx.getStorage({
			key: 'indexFalse', //对应存储的key名
			success: function (res) {
				//成功之后的操作，建议还是先打印res找到需要的东西
				mythis.setData({
					indexFalse: res.data,
				})

			}
		})
		wx.getStorage({
			key: 'indexId', //对应存储的key名
			success: function (res) {
				//成功之后的操作，建议还是先打印res找到需要的东西
				for (var i in mythis.data.videos) {
					if (mythis.data.videos[i].products_id == Number(res.data)) {
						mythis.data.videos[i].is_favorate_products = mythis.data.indexFalse
						if (!mythis.data.indexFalse) {
							mythis.data.videos[i].products_collect = Number(mythis.data.videos[i].products_collect) - 1
						} else {
							mythis.data.videos[i].products_collect = Number(mythis.data.videos[i].products_collect) + 1
						}
					}
					mythis.setData({
						videos: mythis.data.videos
					})
				}

			}
		})

	},
	// 新用户注册代金券
	userCoupon() {
		let that = this;
		wx.request({
			url: app.globalData.apiUrl + "/cli/Home/headTest",
			method: "POST",
			data: {
				key: wx.getStorageSync('key')
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded",
				userid: wx.getStorageSync('openid'),
			},
			success: function (res) {
				if (res.data.code == 200) {
					that.setData({
						qualified: res.data.free_groupbuy_qualified,
					})
					if (that.data.qualified) {
						//代金券弹窗开始
						//var cknewmark2 = localStorage.getItem('cknewmark22');
						var cknewmark2 = wx.getStorageSync('cknewmark22')
						var cknew = that.data.qualified.qualified_type;
						var cktime = that.data.qualified.qualified_time;
						var timestamp = parseInt(new Date().valueOf() / 1000);
						if (that.data.qualified.five_send_voucher) { //5元代金券
							var five_send_voucher = that.data.qualified.five_send_voucher;
						} else {
							var five_send_voucher = false;
						}
						if (that.data.qualified.is_group_cust) { //新人0元开团代金券
							var is_group_cust = that.data.qualified.is_group_cust;
						} else {
							var is_group_cust = false;
						}
						if (five_send_voucher) { //五元代金券
							that.postvoucher_five()
							that.setData({
								showVoucher: true,
								fiveVOucher: true,
								voucherTime: that.data.qualified.five_end_time,
							})
						}
						if ((is_group_cust == "2" || cknew == "1") && (cktime > timestamp)) { //新人代金券
							// wx.setStorageSync('cknewmark22', cktime);
							// that.postVoucher()
							if(app.globalData.isYes==true){
								getApp().globalData.isYes=false 
								that.setData({
									loadApp: false
								})
							}

						} else if (cknew == "2" && cktime != cknewmark2 && (cktime > timestamp)) { //七天未登录
							wx.setStorageSync('cknewmark22', cktime);

						}
						//代金券弹窗结束
					}

				}

			},
		})
	},


	//旋转
	touchEndHandler(e) {
		let touchStartingY = this.data.touchStartingY
		let deltaY = e.changedTouches[0].clientY - touchStartingY
		endX = e.changedTouches[0].clientX; // 获取触摸时的原点
		endY = e.changedTouches[0].clientY;
		wx.setStorage({
			key: 'indexFalse',
			data: false //及接收储图片或文件地址的变量
		})
		wx.setStorage({
			key: 'indexId',
			data: ""
		})
		wx.setStorage({
			key: 'shopHome',
			data: false
		})
		this.setData({
			indexFalse: false,
			indexId: ""
		})
		if (moveFlag) {
			if (startX - endX > 50 && Math.abs(endY - startY) < 70) {
				moveFlag = false;
				if (!this.data.videos[this.data.videoIndex].ad_id) {
					this.changePlayStatus2();
					navigateTo('../commodity/commodity?products_id=' + this.data.videos[this.data.videoIndex].products_id)
				}

			} else if (endX - startX > 50 && Math.abs(endY - startY) < 70) {
				navigateTo('../hot/hot')
			}
		}
		let index = this.data.videoIndex
		if (deltaY > 30 && index == 0) {

			this.setData({
				animationShow: true,
				videoIndex: 0,
				hide: false
			}, () => {
				this.queryData1();
				this.createAnimation(-1, index).then((res) => {
					this.setData({
						animation: this.animation.export(),
						videoIndex: res.index,
						currentTranslateY: res.currentTranslateY,
						percent: 1,
						hiddenText: true,
						hiddenokText: false,
						daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png",
					}, () => {
						event.emit('updateVideoIndex', res.index)
					})
				})
			})
		}
		if (deltaY > 30 && index !== 0) {
			// 更早地设置 animationShow
			this.setData({
				animationShow: true
			}, () => {
				this.createAnimation(-1, index).then((res) => {
					this.setData({
						animation: this.animation.export(),
						videoIndex: res.index,
						currentTranslateY: res.currentTranslateY,
						percent: 1,
						hiddenText: true,
						hiddenokText: false,
						daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png",
					}, () => {
						event.emit('updateVideoIndex', res.index)
					})
				})
			})
		} else if (deltaY < -30 && index !== (this.data.videos.length - 1)) {
			this.setData({
				animationShow: true
			}, () => {
				this.createAnimation(1, index).then((res) => {
					this.setData({
						animation: this.animation.export(),
						videoIndex: res.index,
						currentTranslateY: res.currentTranslateY,
						percent: 1,
						hiddenText: true,
						hiddenokText: false,
						daimaisrc: "https://bj.aizhiyi.com/wap/test/wap/xcxImg/62b6ac2430787ebebfc674f84d2aa9e.png",
					}, () => {
						event.emit('updateVideoIndex', res.index)
					})
				})
			})
		}
	},
	touchEnd(e) {
		this.videoChange(e);
		this.getBehavior()
		this.touchEndTime = e.timeStamp
	},
	touchCancel(e) {
	},
	createAnimation(direction, index) {
		// direction为-1，向上滑动，animationImage1为(index)的poster，animationImage2为(index+1)的poster
		// direction为1，向下滑动，animationImage1为(index-1)的poster，animationImage2为(index)的poster
		let videos = this.data.videos
		let currentTranslateY = this.data.currentTranslateY

		// 更新 videoIndex
		index += direction
		currentTranslateY += -direction * windowHeight
		this.animation.translateY(currentTranslateY).step()

		return Promise.resolve({
			index: index,
			currentTranslateY: currentTranslateY
		})
	},
	hideVoucher: function () {
		this.setData({
			showVoucher: false
		})
	},
	hideTips: function () {
		this.setData({
			showTips: false,
			show_coll: true
		})
		var that = this
		setTimeout(function () {
			that.setData({
				show_coll: false,
			})
		}, 3000)
	},
	hideColl: function () {
		this.setData({
			show_coll: false,
		})
	},
	// 点击评论显示
	pinglun: function (e) {
		var mythis = this;
		mythis.setData({
			products_commonid: e.currentTarget.dataset.id,
			page: 1,
			ad_id: "",
		})
		comment(mythis.data.products_commonid, mythis.data.page, 10, wx.getStorageSync('key'), mythis)
	},
	// 广告评论
	review: function (e) {
		var mythis = this;
		mythis.setData({
			ad_id: e.currentTarget.dataset.id,
			page: 1,
		})
		reviewComment(mythis.data.ad_id, mythis.data.page, 10, wx.getStorageSync('key'), mythis)
	},
	// 点击隐藏评论
	quxiao: function () {
		this.setData({
			isHide: true,
			newName: '',
			mentList: [],
			page: 1,
			products_commonid: '',
			mentListThree: [],
			comment_text: '',
			comment_false: false,
			ad_id: ''
		})
	},
	// 显示追评
	display: function (e) {
		var mythis = this;
		mythis.setData({
			comment_id: e.currentTarget.dataset.id,
			content: [],
			contentThree: [],
			page: 1
		})
		for (var j = 0; j < mythis.data.mentList.length; j++) {
			mythis.data.mentList[j].exhibi = false;
			if (mythis.data.comment_id == mythis.data.mentList[j].comment_id) {
				mythis.data.mentList[j].exhibi = true;
			}
		}
		mythis.setData({
			mentList: mythis.data.mentList,
		})
		var rows = 3
		addReview(mythis.data.comment_id, wx.getStorageSync('key'), mythis.data.page, 10, mythis)
	},
	// 更多追评
	addReview: function (e) {
		var mythis = this;
		if (!mythis.data.addReviewHasmore) {
			mythis.setData({
				comment_id: e.currentTarget.dataset.id,
			})
			for (var j = 0; j < mythis.data.mentList.length; j++) {
				if (mythis.data.comment_id == mythis.data.mentList[j].comment_id) {
					mythis.data.mentList[j].exhibi = false;
				}
			}
			mythis.setData({
				addReviewText: "一收起一",
				mentList: mythis.data.mentList
			})
		} else {
			mythis.setData({
				addReviewText: "一更多评论一"
			})
			mythis.data.page = mythis.data.page + 1;
			addReview(mythis.data.comment_id, mythis.data.key, mythis.data.page, mythis.data.rows, mythis)
		}
	},
	// 写评论时，输入框内输入内容有变化时触发
	setCommentText: function (val) {
		this.setData({
			commentText: val.detail.value
		})
	},
	// 追评
	longPress: function (e) {
		var mythis = this;
		if (e.currentTarget.dataset.numid) {
			mythis.setData({
				parent_respond_commentid: e.currentTarget.dataset.numid
			})

		}
		mythis.setData({
			cust_id: e.currentTarget.dataset.num,
			respond_comment_id: e.currentTarget.dataset.id,
			newName: e.currentTarget.dataset.name,
			comments_type: e.currentTarget.dataset.index,

		})
	},
	// 提交评论，点击输入键盘的完成按钮时触发
	commentConfirm: utilclick.throttle(function (e) {
		var mythis = this;

		if (wx.getStorageSync('key')) {
			if (mythis.data.ad_id == "") {
				if (mythis.data.respond_comment_id) {
					mythis.setData({
						respond_to_comments: 1
					})
					release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, mythis.data.key, mythis.data.comments_type, mythis)
				} else {
					// 评论
					mythis.setData({
						respond_to_comments: 0
					})
					release(mythis.data.parent_respond_commentid, mythis.data.commentText, mythis.data.products_commonid, mythis.data.respond_to_comments, mythis.data.respond_comment_id, mythis.data.cust_id, mythis.data.key, mythis.data.comments_type, mythis)
					mythis.setData({
						comment_id: ''
					})
				}
			} else {
				// 评论广告
				reviewRelease(mythis.data.commentText, mythis.data.key, mythis.data.ad_id, mythis)
			}
			// 评论内容

		} else {
			navigateTo('../getUserInfo/getUserInfo')
		}

	}, 500),
	// 商品评论点赞
	daimaiClick: function (e) {
		var mythis = this;
		var index = e.currentTarget.dataset.curindex;

		if (wx.getStorageSync('key')) {
			if (mythis.data.ad_id == '') {
				if (this.data.mentList[index]) {
					var hasChange = this.data.mentList[index].is_likes
					var comment_id = e.currentTarget.dataset.id;
					var comments_type = e.currentTarget.dataset.type;
					var products_commonid = e.currentTarget.dataset.video;
					if (hasChange == '0') {
						var onum = this.data.mentList[index].like_num
						this.data.mentList[index].like_num = (onum + 1);
						this.data.mentList[index].is_likes = 1;
						redheart(comment_id, wx.getStorageSync('key'), comments_type, products_commonid, mythis)
					} else {
						var onum = this.data.mentList[index].like_num
						this.data.mentList[index].like_num = (onum - 1);
						this.data.mentList[index].is_likes = 0;
						cancelheart(comment_id, wx.getStorageSync('key'), comments_type, products_commonid, mythis)
					}
					this.setData({
						mentList: this.data.mentList,

					})
				} else {
					var hasChange = this.data.comment_text.is_likes
					var comment_id = e.currentTarget.dataset.id;
					var comments_type = e.currentTarget.dataset.type;
					var products_commonid = e.currentTarget.dataset.video;
					if (hasChange == '0') {
						var onum = this.data.comment_text.like_num
						this.data.comment_text.like_num = (onum + 1);
						this.data.comment_text.is_likes = 1;
						redheart(comment_id, mythis.data.key, comments_type, products_commonid, mythis)
					} else {
						var onum = this.data.comment_text.like_num
						this.data.comment_text.like_num = (onum - 1);
						this.data.comment_text.is_likes = 0;
						cancelheart(comment_id, mythis.data.key, comments_type, products_commonid, mythis)
					}
					this.setData({
						comment_text: this.data.comment_text,
					})
				}
			} else {
				if (this.data.mentList[index]) {
					var hasChange = this.data.mentList[index].is_likes
					var comment_id = e.currentTarget.dataset.id;
					var ad_id = e.currentTarget.dataset.ad_id;
					if (hasChange == '0') {
						var onum = this.data.mentList[index].like_num
						this.data.mentList[index].like_num = (onum + 1);
						this.data.mentList[index].is_likes = 1;
						reviewRedheart(comment_id, wx.getStorageSync('key'), ad_id, mythis)
					} else {
						var onum = this.data.mentList[index].like_num
						this.data.mentList[index].like_num = (onum - 1);
						this.data.mentList[index].is_likes = 0;
						reviewCancelheart(comment_id, wx.getStorageSync('key'), ad_id, mythis)
					}
					this.setData({
						mentList: this.data.mentList,
					})
				} else {
					var hasChange = this.data.comment_text.is_likes
					var comment_id = e.currentTarget.dataset.id;
					var ad_id = e.currentTarget.dataset.video;
					if (hasChange == '0') {
						var onum = this.data.comment_text.like_num
						this.data.comment_text.like_num = (onum + 1);
						this.data.comment_text.is_likes = 1;
						reviewRedheart(comment_id, mythis.data.key, ad_id, mythis)
					} else {
						var onum = this.data.comment_text.like_num
						this.data.comment_text.like_num = (onum - 1);
						this.data.comment_text.is_likes = 0;
						reviewCancelheart(comment_id, mythis.data.key, ad_id, mythis)
					}
					this.setData({
						comment_text: this.data.comment_text,
					})
				}
			}

		} else {
			navigateTo('../getUserInfo/getUserInfo')
		}
	},
	// // 广告评论点赞
	// reviewDaimaiClick: function (e) {
	// 	var mythis = this;
	// 	var index = e.currentTarget.dataset.curindex;
	// 	if (wx.getStorageSync('key')) {

	// 	} else {
	// 		navigateTo('../getUserInfo/getUserInfo')
	// 	}
	// },
	onReachBottom: function () { },
	// 加载更多
	moreList: function () {
		var mythis = this;
		if (mythis.data.ad_id == "") {
			if (mythis.data.hideHasmore) {
				mythis.data.page = mythis.data.page + 1
				comment(mythis.data.products_commonid, mythis.data.page, 10, wx.getStorageSync('key'), mythis)
			} else {
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1000
				})
			}
		} else {
			if (mythis.data.hideHasmore) {
				mythis.data.page = mythis.data.page + 1
				reviewComment(mythis.data.ad_id, mythis.data.page, 10, wx.getStorageSync('key'), mythis)
			} else {
				wx.showToast({
					title: '没有更多了',
					icon: 'none',
					duration: 1000
				})
			}
		}

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		this.setData({
			closeData: true,
			isShare: 1
		})
		if (res.from === 'button') {
			if (this.data.videos[this.data.videoIndex].ad_id == undefined) {
				var url = 'pages/index/index?is_share=yes&products_commonid=' + res.target.dataset.id + "&agent_code=" + wx.getStorageSync('agent_code')
				var title = this.data.videos[this.data.videoIndex].products_name
				var imageUrl = this.data.videos[this.data.videoIndex].products_img
			} else {
				var title = this.data.videos[this.data.videoIndex].ad_title
				var imageUrl = this.data.videos[this.data.videoIndex].ad_image
				var url = '/pages/load_app/load_app?link=' + encodeURIComponent(this.data.videos[this.data.videoIndex].jump_url)
			}
		} else {
			if (this.data.videos[this.data.videoIndex].ad_id == undefined) {
				var url = 'pages/index/index?is_share=yes&products_commonid=' + this.data.videos[this.data.videoIndex].products_commonid + "&agent_code=" + wx.getStorageSync('agent_code')
				var title = this.data.videos[this.data.videoIndex].products_name
				var imageUrl = this.data.videos[this.data.videoIndex].products_img
			} else {
				var title = this.data.videos[this.data.videoIndex].ad_title
				var imageUrl = this.data.videos[this.data.videoIndex].ad_image
				var url = '/pages/load_app/load_app?link=' + encodeURIComponent(this.data.videos[this.data.videoIndex].jump_url)
			}
		}




		return {
			title: title,
			path: url,
			imageUrl: imageUrl,
		}
	}
})

function throttle(fn, delay) {
	var timer = null;
	return function () {
		var context = this,
			args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	}
}
// 发布评论
// 发布普通评论
function release(parent_respond_commentid, commentText, products_commonid, respond_to_comments, respond_comment_id, cust_id, key, comments_type, mythis) {
	if (!commentText) {
		wx.showToast({
			icon: "none",
			title: '请输入要评论的内容！',
			duration: 1000
		})
		return false;
	}
	let parms = {
		parent_respond_commentid: parent_respond_commentid,
		comment_content: commentText,
		products_commonid: products_commonid,
		respond_to_comments: respond_to_comments,
		respond_comment_id: respond_comment_id,
		cust_id: cust_id,
		key: wx.getStorageSync('key'),
		comments_type: comments_type
	}
	http.postRequest(app.globalData.apiUrl + "/cli/Comment/addComment", parms,
		(res) => {
			wx.showToast({
				title: '评论成功！',
				icon: 'success',
				duration: 2000
			})
			if (!mythis.data.respond_comment_id) {
				mythis.setData({
					avatar: wx.getStorageSync('avatar'),
					comment_text: res.datas.comment_info,
					comment_false: true,
					commentText: ''
				})
			} else {
				mythis.setData({
					mentList: [],
					mentListThree: [],
					commentText: '',
					respond_comment_id: '',
					cust_id: '',
					newName: false,
					page: 1,
					comment_false: false,
					comment_text: ''
				})
			}
			comment(mythis.data.products_commonid, mythis.data.page, wx.getStorageSync('key'), "10", mythis)
			// mythis.getCommentNum();
		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 1500
			})
		})
}
// 广告评论
function reviewRelease(commentText, key, ad_id, mythis) {
	if (!commentText) {
		wx.showToast({
			icon: "none",
			title: '请输入要评论的内容！',
			duration: 1000
		})
		return false;
	}
	let parms = {
		comment_content: commentText,
		key: wx.getStorageSync('key'),
		ad_id: ad_id
	}
	http.postRequest(app.globalData.apiUrl + "/cli/Comment/addCommentAdvert", parms,
		(res) => {
			wx.showToast({
				title: '评论成功！',
				icon: 'success',
				duration: 2000
			})
			mythis.setData({
				avatar: wx.getStorageSync('avatar'),
				comment_text: res.datas.comment_ad_info,
				comment_false: true,
				commentText: ''
			})
			mythis.getCommentAdNum();
		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 1500
			})
		})
}
// 评论 列表
function comment(products_commonid, page, rows, key, mythis) {
	let parms = {
		products_commonid: products_commonid,
		page: page,
		rows: "10",
		key: wx.getStorageSync('key'),
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CommentList/index', parms,
		(res) => {
			if (mythis.data.comment_false) {
				mythis.setData({
					percentage: res.datas,
				})
			} else {
				var mentListOne = res.datas.comment_list;
				for (var i in mentListOne) {
					mentListOne[i].exhibi = false;
				}
				for (var j = 0; j < mentListOne.length; j++) {
					mythis.data.mentListThree.push(mentListOne[j])
				}
				var hideHasmore = res.datas.hasmore
				mythis.setData({
					mentList: mythis.data.mentListThree,
					percentage: res.datas,
					hideHasmore: res.datas.hasmore,
					isHide: false,
				});
			}
		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 2000
			})
		})

}
// 广告评论 列表
function reviewComment(ad_id, page, rows, key, mythis) {
	let parms = {
		ad_id: ad_id,
		page: page,
		rows: "10",
		key: wx.getStorageSync('key'),
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CommentList/commentAdList', parms,
		(res) => {
			var mentListOne = res.datas.comment_list;
			for (var i in mentListOne) {
				mentListOne[i].exhibi = false;
			}
			for (var j = 0; j < mentListOne.length; j++) {
				mythis.data.mentListThree.push(mentListOne[j])
			}
			var percentage = res.datas
			var hideHasmore = res.datas.hasmore
			mythis.setData({
				mentList: mythis.data.mentListThree,
				percentage: res.datas,
				hideHasmore: res.datas.hasmore,
				isHide: false,
			});

		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 2000
			})
		})

}
// 取消商品评论点赞
function cancelheart(comment_id, key, comments_type, products_commonid, mythis) {
	let parms = {
		comment_id: comment_id,
		key: wx.getStorageSync('key'),
		comments_type: comments_type,
		products_commonid: products_commonid
	}
	http.postRequest(app.globalData.apiUrl + "/cli/Comment/delCustComment", parms,
		(res) => {

		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 2000
			})
		})
}
// 取消广告评论点赞
function reviewCancelheart(comment_id, key, ad_id, mythis) {
	let parms = {
		comment_id: comment_id,
		key: wx.getStorageSync('key'),
		ad_id: ad_id
	}
	http.postRequest(app.globalData.apiUrl + "/cli/Comment/delCustCommentAd", parms,
		(res) => {

		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 2000
			})
		})
}
//商品评论列表点赞  
function redheart(comment_id, key, comments_type, products_commonid, mythis) {
	let parms = {
		comment_id: comment_id,
		key: wx.getStorageSync('key'),
		comments_type: comments_type,
		products_commonid: products_commonid
	}
	http.postRequest(app.globalData.apiUrl + "/cli/Comment/addCustComment", parms,
		(res) => {

		},
		(err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 2000
			})
		})

}
//广告评论列表点赞  
function reviewRedheart(comment_id, key, ad_id, mythis) {
	let parms = {
		comment_id: comment_id,
		key: wx.getStorageSync('key'),
		ad_id: ad_id
	}
	http.postRequest(app.globalData.apiUrl + "/cli/Comment/addCustCommentAdvert", parms,
		(res) => {

		},
		(err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 2000
			})
		})

}
// 追加评论列表
function addReview(comment_id, key, page, rows, mythis) {
	let parms = {
		comment_id: comment_id,
		key: wx.getStorageSync('key'),
		page: page,
		rows: rows
	}
	http.getRequest(app.globalData.apiUrl + "/cli/CommentList/respond_to_comments", parms,
		(res) => {
			var contentOne = res.datas.respond_to_comments_list
			for (var i = 0; i < contentOne.length; i++) {
				mythis.data.contentThree.push(contentOne[i])
			}
			mythis.setData({
				content: mythis.data.contentThree,
				addReviewHasmore: res.datas.hasmore
			})
			if (!mythis.data.addReviewHasmore) {
				mythis.setData({
					addReviewText: "一收起一"
				})
			} else {
				mythis.setData({
					addReviewText: "一更多评论一"
				})
			}
		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 2000
			})
		})

}


// 个人资料
function custIndex(key, mythis) {
	let prams = {
	  key: wx.getStorageSync('key')
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CustIndex/index', prams,
	  function (res) {
		wx.setStorageSync('cust_id', res.datas.cust_info.cust_id);
	  },
	)
  }
  