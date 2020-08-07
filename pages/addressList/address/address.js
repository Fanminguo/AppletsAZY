var area;
var areaInfo = []; //所有省市区县数据
var provinces = []; //省
var citys = []; //城市
var countys = []; //区县
var index = [0, 0, 0];
var cellId;
var t = 0;
var show = false;
var moveY = 200;
var key = wx.getStorageSync('key')
var app = getApp();
var http = require('../../../utils/httputils.js');
const util = require('../../../utils/util.js')
Page({
	data: {
		hide: false,
		show: show,
		addressItems: [],
		addressValue: [0, 0, 0], //  当前选择的省市区对应的下标value
		addresSelect: [], // 确定选择的省市区name/id
		provinces: provinces,
		citys: [],
		countys: [],
		value: [0, 0, 0],
		id: 0,
		address: "", // 地址
		true_name: '', //收货人
		mob_phone: '', //手机号
		area_info: '', //详细地址
		itemsName: "",
		btnTwo: false,
		area: []


	},
	/**
	* 生命周期函数--监听页面显示
	*/
	onShow: function () {
		if (this.data.addressId == undefined) {
			this.setData({
				hide: true,
				addresSelect: "",
			})
		}


	},
	// 默认地址
	circular: function (e) {
		var mythis = this;
		if (e.currentTarget.dataset.id == 0) {
			mythis.setData({
				id: 1
			})
		} else if (e.currentTarget.dataset.id == 1) {
			mythis.setData({
				id: 0
			})
		}
	},
	detailed: function (e) {
		this.setData({
			area_info: e.detail.value
		})
	},

	//滑动事件
	bindChange: function (e) {
		var val = e.detail.value
		var address = this.data.addressItems;
		if (address[val[0]].children.length < val[1]) {
			val[1] = 0
		}
		if (address[val[0]].children[val[1]].children == undefined) {
			this.setData({
				countys: []

			})
		}
		this.setData({
			citys: address[val[0]].children,
			countys: address[val[0]].children[val[1]].children,
			addressValue: val
		})
	},
	onLoad: function (options) {
		cellId = options.cellId;
		var that = this;
		areaData(that)
		that.setData({
			key: wx.getStorageSync('key'),
			home: options.home
		})
		if (that.data.city_id == undefined) {
			that.setData({
				addresSelect: '请输入省、市、县区'
			})
		}
		var date = new Date()
		that.setData({
			itemsName: "",
			type_num: options.type_num

		})

		// 编辑
		var addressId = options.address_id
		if (addressId != undefined) {
			that.setData({
				btnTwo: true,
				addressId: options.address_id
			})
			editRess(that.data.key, that.data.addressId, that)
		}
		//获取省市区县数据;


	},
	//编辑保存
	btnEdit: util.throttle(function () {
		var mythis = this;
		editPrese(mythis.data.addressId, mythis.data.key, mythis.data.true_name, mythis.data.mob_phone, mythis.data.area_info, mythis.data.city_id, mythis.data.area_id, mythis.data.addresSelect, mythis.data.id, mythis)
	}, 800),
	// 删除收货地址
	btnDelete: function () {
		var mythis = this;
		wx.showModal({
			title: '提示',
			content: '是否确认删除',
			success(res) {
				if (res.confirm) {
					romoveRess(mythis.data.key, mythis.data.addressId, mythis)
				} else if (res.cancel) {
				}
			}
		})
	},
	// ------------------- 分割线 --------------------
	onReady: function () {
		this.animation = wx.createAnimation({
			transformOrigin: "50% 50%",
			duration: 0,
			timingFunction: "ease",
			delay: 0
		})
		this.animation.translateY(200 + 'vh').step();
		this.setData({
			animation: this.animation.export(),
			show: show
		})
	},
	//移动按钮点击事件
	translate: function (e) {
		if (t == 0) {
			moveY = 0;
			show = true;
			t = 1;
		} else {
			moveY = 200;
			show = false;
			t = 0;
		}
		animationEvents(this, moveY, show);



	},
	// 弹出框取消隐藏
	hiddenFloatView(e) {
		moveY = 200;
		show = true;
		t = 0;
		animationEvents(this, moveY, show);
	},
	//弹出框确定
	citySure(e) {
		var mythis = this;
		var values = mythis.data.addressValue;
		if (mythis.data.area[values[0]].children[values[1]].children == undefined) {
			var therrName = ''
			var therrId = ''

		} else {
			var therrName = mythis.data.area[values[0]].children[values[1]].children[values[2]].text
			var therrId = mythis.data.area[values[0]].children[values[1]].children[values[2]].value
		}
		var items = [{
			name: mythis.data.area[values[0]].text,
			id: mythis.data.area[values[0]].value,
		},
		{
			name: mythis.data.area[values[0]].children[values[1]].text,
			id: mythis.data.area[values[0]].children[values[1]].value,
		},
		{
			name: therrName,
			id: therrId
		}
		];
		moveY = 200;
		show = false;
		t = 0;
		animationEvents(mythis, moveY, show);
		mythis.setData({
			address: [],
			addresSelect: items,
			// show: true
		})
		//请求接口

		for (var i = 0; i < this.data.addresSelect.length; i++) {
			// 地址
			this.data.address += this.data.addresSelect[i].name
			// 城市id
			this.data.city_id = this.data.addresSelect[1].id
			// 区域id
			this.data.area_id = this.data.addresSelect[2].id
		}
		this.setData({
			address: [],
			addresSelect: this.data.address,
			area_id: this.data.area_id,
			city_id: this.data.city_id
		})

	},
	//页面滑至底部事件
	onReachBottom: function () {
		// Do something when page reach bottom.
	},
	// 提交
	btnPreservation: util.throttle(function () {
		var mythis = this;
		if (mythis.data.true_name != "" && mythis.data.mob_phone != "" && mythis.data.addresSelect != "" && mythis.data.area_info != "") {
			if (mythis.data.city_id != undefined) {
				addRess(mythis.data.key, mythis.data.true_name, mythis.data.mob_phone, mythis.data.area_info, mythis.data.city_id, mythis.data.area_id, mythis.data.addresSelect, mythis.data.id, mythis)
			} else {
				wx.showToast({
					title: "请重新选择所在地区",
					icon: 'none',
					duration: 1500,
					mask: true
				});
			}
		} else {
			wx.showToast({
				title: "请完善收货地址信息",
				icon: 'none',
				duration: 800,
				mask: true
			});
		}


	}, 800),
	// 收货人姓名
	verifyName: function (e) {
		const testName = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
		if (testName.test(e.detail.value)) {
			this.setData({
				true_name: e.detail.value
			})
		} else {
			wx.showToast({
				title: '请输入正确的姓名',
				icon: 'none',
				duration: 2000
			})
		}
	},
	// 手机号码
	mobileInput: function (e) {
		const number = /^1[3456789]\d{9}$/;
		if (number.test(e.detail.value)) {
			this.setData({
				mob_phone: e.detail.value
			})
		} else {
			if (!number.test(e.detail.value) && e.detail.cursor == 11) {
				wx.showToast({
					title: '请输入正确的手机号',
					icon: 'none',
					duration: 2000
				})

			}
		}
	},
	btnclick: function () {
		var userName = this.data.userName;
		var mobile = this.data.mobile;
		var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		var name = /^[u4E00-u9FA5]+$/;
		if (userName == '') {
			wx.showToast({
				title: '请输入用户名',
				icon: 'succes',
				duration: 1000,
				mask: true
			})

			return false
		} else if (mobile == '') {
			wx.showToast({
				title: '手机号不能为空',
			})

			return false
		} else if (mobile.length != 11) {
			wx.showToast({
				title: '手机号长度有误！',
				icon: 'success',
				duration: 1500
			})
			return false;
		}

		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (!myreg.test(mobile)) {
			wx.showToast({
				title: '手机号有误！',
				icon: 'success',
				duration: 1500
			})
			return false;
		}
		return true;


	},
})
// 获取地址
function areaData(mythis) {
	let parms = {}
	http.postRequest(app.globalData.apiUrl + '/cli/Area/area_data', parms,
		(res) => {
			var area_list = [];
			for (var i in res.datas.area_list) {
				area_list.push(res.datas.area_list[i])
			}
			mythis.setData({
				area: area_list
			})
			var values = mythis.data.addressValue;
			var items = [{
				name: mythis.data.area[values[0]].text,
				id: mythis.data.area[values[0]].value,
			},
			{
				name: mythis.data.area[values[0]].children[values[1]].text,
				id: mythis.data.area[values[0]].children[values[1]].value,
			},
			{
				name: mythis.data.area[values[0]].children[values[1]].children[values[2]].text,
				id: mythis.data.area[values[0]].children[values[1]].children[values[2]].value,
			}
			];
			for (var i = 0; i < items.length; i++) {
				mythis.data.itemsName += items[i].name
			}
			mythis.setData({
				addressItems: mythis.data.area,
				addresSelect: mythis.data.itemsName,
				citys: mythis.data.area[values[0]].children,
				countys: mythis.data.area[values[0]].children[values[1]].children
			})
			if (mythis.data.city_id == undefined) {
				mythis.setData({
					addresSelect: '请输入省、市、县区'
				})
			}
		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 150
			})
		})

}


//动画事件
function animationEvents(that, moveY, show) {
	that.animation = wx.createAnimation({
		transformOrigin: "50% 50%",
		duration: 400,
		timingFunction: "ease",
		delay: 0
	})
	that.animation.translateY(moveY + 'vh').step()

	that.setData({
		animation: that.animation.export(),
		show: show
	})

}

// ---------------- 分割线 ----------------

//获取省份数据
function getProvinceData(that) {
	var s;
	provinces = [];
	var num = 0;
	for (var i = 0; i < areaInfo.length; i++) {
		s = areaInfo[i];
		if (s.di == "00" && s.xian == "00") {
			provinces[num] = s;
			num++;
		}
	}
	that.setData({
		provinces: provinces
	})

	//初始化调一次可更改
	getCityArr(0, that);
	getCountyInfo(0, 0, that);
	that.setData({
		province: "北京市",
		city: "市辖区",
		county: "东城区",
	})

}

// 获取地级市数据
function getCityArr(count, that) {
	var c;
	citys = [];
	var num = 0;
	for (var i = 0; i < areaInfo.length; i++) {
		c = areaInfo[i];
		if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
			citys[num] = c;
			num++;
		}
	}
	if (citys.length == 0) {
		citys[0] = {
			name: ''
		};
	}

	that.setData({
		city: "",
		citys: citys,
		value: [count, 0, 0]
	})
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
	var c;
	countys = [];
	var num = 0;
	for (var i = 0; i < areaInfo.length; i++) {
		c = areaInfo[i];
		if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
			countys[num] = c;
			num++;
		}
	}
	if (countys.length == 0) {
		countys[0] = {
			name: ''
		};
	}
	that.setData({
		county: "",
		countys: countys,
		value: [column0, column1, 0]
	})
}

// 收货地址 //新增
function addRess(key, true_name, mob_phone, address, city_id, area_id, area_info, id, mythis) {
	let parms = {
		key: key,
		true_name: true_name, //用户名
		mob_phone: mob_phone, //电话
		address: address, //详细地址
		city_id: city_id, //城市id
		area_id: area_id, //地区ID
		area_info: area_info, //市区地址
		is_default: id //是否默认
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CustAddress/address_add', parms,
		(res) => {
			if (mythis.data.type_num == "1") {
				var pages = getCurrentPages(); // 当前页面
				var beforePage = pages[pages.length - 2]; // 前一个页面
				beforePage.setData({
					address_id: res.datas.address_id
				}),
					wx.navigateBack({
						success: function () {
							beforePage.queryData(); // 执行前一个页面的onLoad方法
						}
					});
			} else {
				wx.redirectTo({
					url: '/pages/addressList/addressList?home=' + mythis.data.home,
				})
			}
		}, (err) => {

		})

}

// 编辑收货地址  
function editRess(key, id, mythis) {
	let parms = {
		key: key,
		address_id: id
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CustAddress/address_info', parms,
		(res) => {
			mythis.setData({
				// 详细地址
				addresSelect: res.datas.address_info.area_info,
				// 姓名
				true_name: res.datas.address_info.true_name,
				// 电话
				mob_phone: res.datas.address_info.mob_phone,
				// 市区地址
				area_info: res.datas.address_info.address,
				// 是否默认
				id: res.datas.address_info.is_default,
				city_id: res.datas.address_info.city_id,
				area_id: res.datas.address_info.area_id,
				hide: true
			})
		}, (err) => {
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 1500
			})
		})

}

// 收货地址 //修改
function editPrese(address_id, key, true_name, mob_phone, address, city_id, area_id, area_info, id, mythis) {
	let parms = {
		address_id: address_id,
		key: key,
		true_name: true_name, //用户名
		mob_phone: mob_phone, //电话
		address: address, //地址
		city_id: city_id, //城市id
		area_id: area_id, //地区ID
		area_info: area_info, //详细地址
		is_default: id //是否默认
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CustAddress/address_edit', parms,
		(res) => {
			if (mythis.data.home == 2) {
				wx.redirectTo({
					url: '/pages/addressList/addressList?home=' + mythis.data.home
				})
			} else {
				var pages = getCurrentPages(); // 当前页面
				var beforePage = pages[pages.length - 2]; // 前一个页面
				beforePage.setData({
					address_id: 'underfind'
				}),
					beforePage.queryData(); // 执行前一个页面的onLoad方法
				wx.redirectTo({
					url: '/pages/addressList/addressList'
				})
			}

		}, (err) => {
			wx.showToast({
				title: err.dats.error,
				icon: 'none',
				duration: 1500
			})
		})

}
// 删除收货地址
function romoveRess(key, id, mythis) {
	let parms = {
		key: key,
		address_id: id
	}
	http.postRequest(app.globalData.apiUrl + '/cli/CustAddress/address_del', parms,
		function (res) {
			if (res.datas == "1") {
				if (mythis.data.home == 2) {
					wx.redirectTo({
						url: "../addressList?home=" + mythis.data.home
					})
				} else {
					var pages = getCurrentPages(); // 当前页面
					var beforePage = pages[pages.length - 2]; // 前一个页面
					beforePage.setData({
						address_id: 'underfind'
					}),
						beforePage.queryData(); // 执行前一个页面的onLoad方法
					wx.redirectTo({
						url: "../addressList"
					})
				}
			}
		}, function (err) {
			showToast
			wx.showToast({
				title: err.datas.error,
				icon: 'none',
				duration: 1500
			})
		})

}

