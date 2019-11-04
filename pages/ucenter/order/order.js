var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {
        orderList: []
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        this.getOrderList();
    },
    getOrderList () {
        let that = this;
        util.request(api.OrderList).then(function (res) {
            console.log(res.orderlist);
            that.setData({
                orderList: res.orderlist
            });
        });
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
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})