//index.js
//获取应用实例
import * as event from '../../utils/event.js'
const app = getApp()
const windowHeight = wx.getSystemInfoSync().windowHeight;
var startX, endX;
var startY, endY;
var moveFlag = true; // 判断执行滑动事件


var videopage = 0;
var up;
var down;


const util = require('../../utils/util.js')
import navigateTo from "../../utils/navigateRoute.js"
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
		showTips:false,
		keyFalse:true

	},
	onLoad: function (options) {
		var mythis = this;
		// wx.hideShareMenu()
		let isIphoneX = app.globalData.isIphoneX;
		if(!wx.getStorageSync('key')){
			this.setData({
				keyFalse:false
			})
		}
		this.setData({
			isIphoneX: isIphoneX,
			indexFalse: "",
			topHeight: app.globalData.headerBtnPosi,
			share_id: options.products_commonid,
			// topHeight:50

		})

		this.getCartNum();
		// 滑动
		this.queryData1(this.data.share_id);
		// this.videoChange = throttle(this.touchEndHandler, 200)
		// // 绑定updateVideoIndex事件，更新当前播放视频index
		// event.on('updateVideoIndex', this, function (index) {
		// 	if (this.data.videos.length - 1 == index) {
		// 		this.queryData2();
		// 	}
		// 	setTimeout(() => {
		// 		this.setData({
		// 			animationShow: false,
		// 			playState: true
		// 		}, () => {
		// 			// 切换src后，video不能立即播放，settimeout一下
		// 			setTimeout(() => {
		// 				this.vvideo.play()
		// 			}, 100)
		// 		})
		// 	}, 500)
		// })
	},
	goLive:function(e){
		var store_id = e.currentTarget.dataset.store_id
		if (wx.getStorageSync('key')) {
			navigateTo('../live/live/live?store_id=' + store_id)
		}else{
			navigateTo('../getUserInfo/getUserInfo')
		}
	},
	golivexinren:function(e){
			navigateTo('../getUserInfo/getUserInfo')
	},
	guanbi:function () {
		this.setData({
			keyFalse:true
		})
	},
	preventTouchMove: function () { },
	// 购物车数量
	getCartNum: function () {
		var that = this
		wx.request({
			url: app.globalData.apiUrl + '/cli/CustCart/cart_count',
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
	queryData2: function () {
		var that = this;
		wx.request({
			url: app.globalData.apiUrl + '/cli/Home/headTest',
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
		var products_commonid;
		if (id) {
			products_commonid = id
		} else {
			products_commonid = ""
		}
		var that = this;

		wx.request({
			url: app.globalData.apiUrl + '/cli/Home/headTest',
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
				key: wx.getStorageSync('key'),
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
						is_show5: res.data.is_show5,
					})
					if (that.data.videoIndex < 0) {
						that.setData({
							videoIndex: 0,
						})
					}
					var text = that.data.videos[that.data.videoIndex].products_jingle.replace(/\s/g, '')
					var length = text.length * that.data.size * 3;//文字长度

					var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度                   
					that.setData({
						length: length,
						windowWidth: windowWidth,
						marquee2_margin: length < windowWidth ? windowWidth - length : that.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
					});
					that.run2();// 第一个字消失后立即从右边出现
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
							//localStorage.setItem('cknewmark22', cktime);
							wx.setStorageSync('cknewmark22', cktime);
							that.postVoucher()
							that.setData({
								showVoucher: true,
								newVoucher: true,
								voucherTime: that.data.qualified.new_end_time,
							})
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
					
					if(wx.getStorageSync('showTips')==true){
						
					}else{
						wx.setStorageSync('showTips',true)
						that.setData({
							showTips: true,
						})
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
		// that.onLoad()
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
		}else{
			navigateTo('../getUserInfo/getUserInfo')
		}
		
	},
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
		}else{
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
		if(wx.getStorageSync('key')){
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
		}else{
			navigateTo('../getUserInfo/getUserInfo')
		}
		
	},
	//跳转看相似
	gosimlar: function (e) {
		var that = this
		var pc_id = e.currentTarget.dataset.pcid
		var products_id = e.currentTarget.dataset.productid
		that.changePlayStatus2();
		navigateTo('../products_similar/products_similar?pc_id=' + pc_id + "&products_id=" + products_id)
	},
	gocart: function () {
		
		if (wx.getStorageSync('key')) {
			this.changePlayStatus2()
			navigateTo('../cart/cart')
		}else{
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
		}else{
			navigateTo("../getUserInfo/getUserInfo")
		}

	},
	//我的
	tomy: function () {
		if (wx.getStorageSync('key')) {
			wx.redirectTo({
				url: '../myModule/myModule'
			})
		}else{
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
		navigateTo('../hot/hot')

	},
	toload: function () {
		this.changePlayStatus2()
		navigateTo('../load_app/load_app?link=' + encodeURIComponent("https://www.aizhiyi.com/wap/app_load.html"))
	},
	bindplay() {
		this.setData({
			waiting: false
		})
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
	
	// touchMove(e) {
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
	// },
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
					that.changePlayStatus();
					// wx.showModal({
					//   title: '提示',
					//   content: '单击事件被触发',
					//   showCancel: false
					// })
				}, 300);
			}
		}
	},
	onShow: function () {
		
		this.setData({
			topHeight: wx.getMenuButtonBoundingClientRect().top,
		})
		var mythis = this
		if(wx.getStorageSync('key')){
			mythis.setData({
				keyFalse:true
			})
		}
		mythis.userCoupon()
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
userCoupon(){
	let that = this;
	wx.request({
		url: app.globalData.apiUrl + "/cli/Home/headTest",
		method: "POST",
		data: {
			key:wx.getStorageSync('key')
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
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
						wx.setStorageSync('cknewmark22', cktime);
						that.postVoucher()
						that.setData({
							showVoucher: true,
							newVoucher: true,
							voucherTime: that.data.qualified.new_end_time,
						})
					} else if (cknew == "2" && cktime != cknewmark2 && (cktime > timestamp)) { //七天未登录
						wx.setStorageSync('cknewmark22', cktime);
						
					}
					//代金券弹窗结束
				}
			
			}

		},
	})
},
  touchStart(e) {
    var that = this;
    that.touchStartTime = e.timeStamp
    //console.log(e.touches[0].clientY)
    that.setData({
      touchstartY: e.touches[0].clientY,
      touchstartX: e.touches[0].clientX
    })
    this.data.touchstartY = e.touches[0].clientY;
    this.data.touchstartX = e.touches[0].clientX;
    up = false;
    down = false;
	},
   //触摸移动事件
   touchMove: function (e) {
    // console.log(e)    
    let touchendY = e.touches[0].clientY;
    let touchstartY = this.data.touchstartY;
    let touchendX = e.touches[0].clientX;
    let touchstartX = this.data.touchstartX;
    //向上滑动
    if (touchendY - touchstartY <= -40) {
      // console.log("向上滑动");
      up = true;
      down = false;
    }
    //向下滑动
    if (touchendY - touchstartY >= 40) {
      // console.log("向下滑动");
      up = false;
      down = true;
		}
		if (moveFlag) {
			if (touchstartX - touchendX > 50 && Math.abs(touchendY - touchstartY) < 70) {
			 	moveFlag = false;
				this.changePlayStatus2();
				navigateTo('../commodity/commodity?products_id=' + this.data.videos[this.data.videoIndex].products_id)
				return;
	    }
		}
    
  },


  //触摸结束事件
  touchEnd: function (e) {
    
    var that = this;
    var videoList = that.data.videos;
		that.touchEndTime = e.timeStamp
		moveFlag=true
    // 向上滑动（下滑）
    if (up === true) {
      if (videopage >= videoList.length - 2) {
				videopage++;
        that.queryData2();
        // if (that.isEnd) { //如果已经结束了
        //   if (videoList.length <z= 0) {
        //     wx.showToast({
        //       title: that.noDataTip,
        //       icon: 'none',
        //       duration: 2000
        //     });
        //     return;
        //   } else {
        //     videopage = 0;
        //   }
        // } else { //如果还没有结束，加载下一个
        //   // videopage++;
        //   // that.queryVideoList();
        //   return;
        // }
      } else {
        videopage++;
      }
      that.animate(videopage, down, up);
    }

    // 向下滑动（上滑）
    if (down === true) {
      if (videopage == 0) {
        if (videoList.length > 0) {
          // videopage = videoList.length - 1;
          wx.showToast({
            title: "已经是第一个了",
            icon: 'none',
            duration: 1000
          })
          return;
        }
      } else {
        videopage--;
      }
      that.animate(videopage, down, up);
    }


    if (up === true || down === true) {
      let curVideo = that.data.videos[videopage];

      console.info("当前视频", curVideo);
      that.setData({
        curVideo: curVideo,
        // videoIndex: videopage,
      });
      
      up = false;
      down = false;
      // that.playVideo();
    }
  },


  //动画效果
  animate: function (videopage, down, up) {
    var that = this;
    var videopage = videopage;
    var videoList = that.data.videos;
    var down = down;
    var up = up;
		var prevCoverImg, nextCoverImg, curCoverImg;
		var videoIn=videopage
    
    // start 上下滑动画
    if (up)
      videopage = (videopage + videoList.length - 1) % videoList.length;
    if (down)
      videopage = videopage + 1;

    var preIndex = (videopage + videoList.length - 1) % videoList.length;
    var nextIndex = (videopage + 1) % videoList.length;

    console.info("当前页", videopage, "上一页", preIndex, "下一个", nextIndex);

    prevCoverImg = videoList[preIndex].video_thum;
    curCoverImg = videoList[videopage].video_thum;
    nextCoverImg = videoList[nextIndex].video_thum;

    console.info("上一个封面", prevCoverImg)
    console.info("当前的封面", curCoverImg)
    console.info("下一个封面", nextCoverImg)
    that.setData({
      prevCoverImg: prevCoverImg,
      nextCoverImg: nextCoverImg,
			curCoverImg: curCoverImg,
			
			playState: true,
    })
    if ((!prevCoverImg && (up === true)) || (!nextCoverImg && (down === true))) {

    } else {
      if (up === true) {
        that.setData({
          nextCoverStatus: 'up',
          curCoverStatus: 'up',
					videoStatus: 'up',
					videoIndex: videoIn,
        })
      } else if (down === true) {
        that.setData({
          prevCoverStatus: 'down',
          curCoverStatus: 'down',
					videoStatus: 'down',
					videoIndex: videoIn,
        })
			}
      setTimeout(function () {
				that.setData({
					nextCoverStatus: '',
					prevCoverStatus: '',
					curCoverStatus: '',
					videoStatus: 'now',
				});
      }, 1000)
      // that.playVideo();
    }
    //end 上下滑动画
  },
	hideVoucher: function () {
		this.setData({
			showVoucher: false
		})
	},
	hideTips: function () {
		this.setData({
			showTips: false
		})
	},
	// 点击评论显示
	pinglun: function (e) {
		var mythis = this;
		mythis.setData({
			products_commonid: e.currentTarget.dataset.id,
			// isHide: false,
			page: 1,
		})
		comment(mythis.data.products_commonid, mythis.data.page, 10, wx.getStorageSync('key'), mythis)

	},
	// 点击隐藏评论
	quxiao: function () {
		this.setData({
			isHide: true,
			newName: '',
			mentList: [],
			page: 1,
			products_commonid: '',
			mentListThree: []
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
	commentConfirm: function (e) {
		var mythis = this;
	
		if (wx.getStorageSync('key')) {
			// 评论内容
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
		}else{
			navigateTo('../getUserInfo/getUserInfo')
		}

	},
	daimaiClick: function (e) {
		var mythis = this;
		var index = e.currentTarget.dataset.curindex;
		
		if (wx.getStorageSync('key')) {
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
			}
		}else{
			navigateTo('../getUserInfo/getUserInfo')
		}
	},
	onReachBottom: function () { },
	// 加载更多
	moreList: function () {
		var mythis = this;
		mythis.data.page = mythis.data.page + 1
		if (mythis.data.hideHasmore) {
			comment(mythis.data.products_commonid, mythis.data.page, 10, wx.getStorageSync('key'), mythis)
		} else {
			wx.showToast({
				title: '没有更多了',
				icon: 'none',
				duration: 1000
			})
		}
	},

    /**
     * 用户点击右上角分享
     */
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			var url = 'pages/index/index?is_share=yes&products_commonid=' + res.target.dataset.id
		} else {
			var url = 'pages/index/index?is_share=yes&products_commonid=' + this.data.videos[this.data.videoIndex].products_commonid
		}
		return {
			title: this.data.videos[this.data.videoIndex].products_name,
			path: url,
			imageUrl: this.data.videos[this.data.videoIndex].products_img,
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
// 发布评论
function release(parent_respond_commentid, commentText, products_commonid, respond_to_comments, respond_comment_id, cust_id, key, comments_type, mythis) {
	if (!commentText) {
		wx.showToast({
			icon: "none",
			title: '请输入要评论的内容！',
			duration: 1000
		})
		return false;
	}
	wx.request({
		url: app.globalData.apiUrl + "/cli/Comment/addComment",
		method: "POST",
		data: {
			parent_respond_commentid: parent_respond_commentid,
			comment_content: commentText,
			products_commonid: products_commonid,
			respond_to_comments: respond_to_comments,
			respond_comment_id: respond_comment_id,
			cust_id: cust_id,
			key: key,
			comments_type: comments_type
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
			"key": wx.getStorageSync('key'),
		},
		success: function (res) {
			if (res.data.code == 200) {
				wx.showToast({
					title: '评论成功！',
					icon: 'success',
					duration: 2000
				})
				mythis.setData({
					mentList: [],
					mentListThree: [],
					commentText: '',
					respond_comment_id: '',
					cust_id: '',
					newName: false
				})
				comment(mythis.data.products_commonid, mythis.data.page, wx.getStorageSync('key'), "10", mythis)
				mythis.getCommentNum();
			}

		},
	})

}
// 评论 列表
function comment(products_commonid, page, rows, key, mythis) {
	wx.request({
		url: app.globalData.apiUrl + '/cli/CommentList/index',
		data: {
			products_commonid: products_commonid,
			page: page,
			rows: "10",
			key: wx.getStorageSync('key'),
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			"key": wx.getStorageSync('key'),
		},
		method: 'POST',
		success: function (res) {
			if (res.data.code == 200) {
				var mentListOne = res.data.datas.comment_list;
				for (var i in mentListOne) {
					mentListOne[i].exhibi = false;
				}
				for (var j = 0; j < mentListOne.length; j++) {
					mythis.data.mentListThree.push(mentListOne[j])
				}
				var percentage = res.data.datas
				var hideHasmore = res.data.datas.hasmore
				mythis.setData({
					mentList: mythis.data.mentListThree,
					percentage: res.data.datas,
					hideHasmore: res.data.datas.hasmore,
					isHide: false,

				});

			}

		},
		fail: function (res) { },
		complete: function (res) { },
	})
}
// 取消点赞
function cancelheart(comment_id, key, comments_type, products_commonid, mythis) {
	wx.request({
		url: app.globalData.apiUrl + "/cli/Comment/delCustComment",
		method: "POST",
		data: {
			comment_id: comment_id,
			key: key,
			comments_type: comments_type,
			products_commonid: products_commonid
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
			"key": wx.getStorageSync('key'),
		},
		success: function (res) {

		},
	})
}
//点赞  
function redheart(comment_id, key, comments_type, products_commonid, mythis) {
	wx.request({
		url: app.globalData.apiUrl + "/cli/Comment/addCustComment",
		method: "POST",
		data: {
			comment_id: comment_id,
			key: key,
			comments_type: comments_type,
			products_commonid: products_commonid
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
			"key": wx.getStorageSync('key'),
		},
		success: function (res) {

		},
	})
}
// 追加评论列表
function addReview(comment_id, key, page, rows, mythis) {
	wx.request({
		url: app.globalData.apiUrl + "/cli/CommentList/respond_to_comments",
		method: "GET",
		data: {
			comment_id: comment_id,
			key: key,
			page: page,
			rows: rows
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
			"key": wx.getStorageSync('key'),
		},
		success: function (res) {

			var contentOne = res.data.datas.respond_to_comments_list
			for (var i = 0; i < contentOne.length; i++) {
				mythis.data.contentThree.push(contentOne[i])
			}
			mythis.setData({
				content: mythis.data.contentThree,
				addReviewHasmore: res.data.datas.hasmore
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
		},
	})
}

