var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {
        loading: false,
        orderList: []
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
    },
    onPullDownRefresh () {
        // 上拉刷新
        if (!this.loading) {
            this.getOrderList();
            wx.stopPullDownRefresh()
        }
    },
    getOrderList () {
        let that = this;
        that.loading = true
        util.request(api.ShopOrderList).then(function (res) {
            console.log(res.orderlist);
            that.setData({
                orderList: res.orderlist
            });
        });
        that.loading = false
    },
    payOrder () {
        wx.redirectTo({
            url: '/pages/pay/pay',
        })
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        this.getOrderList();
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})