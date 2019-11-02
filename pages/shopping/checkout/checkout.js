var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
    data: {
        checkedAddress: {},
        addressId: 0,
        couponId: 0
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId) {
                this.setData({
                    'addressId': addressId
                });
            }
        } catch (e) {
            // Do something when catch error
        }
    },
    getCheckoutInfo: function () {
        let that = this;

        util.request(api.ShopCheckout).then(function (res) {
            var goodstotalprice = 0
            for (var i = 0; i < that.data.checkedGoodsList.length; i++) {
                goodstotalprice = that.data.checkedGoodsList[i].num * that.data.checkedGoodsList[i].price
            }

            console.log("address:", res.address)
            that.setData({
                checkedAddress: res.address,
                actualPrice: goodstotalprice + res.freightprice,
                freightPrice: res.freightprice,
                goodsTotalPrice: goodstotalprice,
            });

            wx.hideLoading();
        });
    },
    selectAddress () {
        wx.navigateTo({
            url: '/pages/shopping/address/address',
        })
    },
    addAddress () {
        wx.navigateTo({
            url: '/pages/shopping/addressAdd/addressAdd',
        })
    },
    onReady: function () {
        // 页面渲染完成

    },
    onShow: function () {
        // 页面显示
        wx.showLoading({
            title: '加载中...',
        })

        this.setData({
            checkedGoodsList: JSON.parse(app.checkedgoods)
        });

        this.getCheckoutInfo();
    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭

    },
    submitOrder: function () {
        if (this.data.addressId <= 0) {
            util.showErrorToast('请选择收货地址');
            return false;
        }
        util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
            if (res.errno === 0) {
                const orderId = res.data.orderInfo.id;
                pay.payOrder(parseInt(orderId)).then(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                    });
                }).catch(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                    });
                });
            } else {
                util.showErrorToast('下单失败');
            }
        });
    }
})