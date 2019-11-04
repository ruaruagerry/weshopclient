var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {

    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        this.getAddressList();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示

    },
    getAddressList () {
        let that = this;
        util.request(api.ShopAddressList).then(function (res) {
            that.setData({
                addressList: res.addresslist
            });
        });
    },
    addressAddOrUpdate (event) {
        console.log(event)
        wx.navigateTo({
            url: '/pages/shopping/addressAdd/addressAdd?address=' + JSON.stringify(event.currentTarget.dataset.address)
        })
    },
    selectAddress (event) {
        console.log(event.currentTarget.dataset.addressId);

        try {
            wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
        } catch (e) {

        }

        //选择该收货地址
        wx.redirectTo({
            url: '/pages/shopping/checkout/checkout'
        })
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})