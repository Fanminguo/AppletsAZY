function navigateTo(url) {
	//判断当前页面栈的长度
	if (getCurrentPages().length >= 10) {
		// 超过十层的时候跳转销毁当前页面
		wx.redirectTo({
			url: url,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	} else {

		wx.navigateTo({
			url: url,
		})
	}
}
module.exports = navigateTo
