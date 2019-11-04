Page({
    data: {

    },
    onLoad: function (options) {
        console.log("options:", options)

        wx.showLoading({
            title: '加载中...',
        })

        this.setData({
            wxpayURL: options.wxpayurl,
            zfbpayURL: options.zfbpayurl,
        });

        wx.hideLoading();
    },
    onReady: function () {
        // 页面渲染完成

    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭

    },
})