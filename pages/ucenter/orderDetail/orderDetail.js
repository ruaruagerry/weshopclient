var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {
        orderInfo: {},
        orderGoods: [],
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            orderId: options.orderid
        });
        this.getOrderDetail();
    },
    getOrderDetail () {
        let that = this;
        util.request(api.ShopOrderDetail, { orderId: that.data.orderId }, "POST").then(function (res) {
            console.log(res);
            // change time
            res.order.time = util.formatTime(new Date(res.order.time * 1000))

            that.setData({
                order: res.order,
                orderGoods: res.ordergoods,
                address: res.address
            });
        });
    },
    cancelOrder () {
        let that = this;
        util.request(api.ShopOrderCancel, { orderId: that.data.orderId }, "POST").then(function () {
            wx.navigateBack({
                delta: 1
            })
        });
    },
    payOrder () {
        let that = this;
        util.request(api.PayPrepayId, {
            orderId: that.data.orderId || 15
        }).then(function (res) {
            if (res.errno === 0) {
                const payParam = res.data;
                wx.requestPayment({
                    'timeStamp': payParam.timeStamp,
                    'nonceStr': payParam.nonceStr,
                    'package': payParam.package,
                    'signType': payParam.signType,
                    'paySign': payParam.paySign,
                    'success': function (res) {
                        console.log(res)
                    },
                    'fail': function (res) {
                        console.log(res)
                    }
                });
            }
        });
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