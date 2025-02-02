var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
    data: {
        loading: false,
        addressList: [],
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.getAddressList();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示

    },
    onPullDownRefresh () {
        // 上拉刷新
        if (!this.loading) {
            this.getAddressList();
            wx.stopPullDownRefresh()
        }
    },
    getAddressList () {
        let that = this;
        that.loading = true
        util.request(api.ShopAddressList).then(function (res) {
            that.setData({
                addressList: res.addresslist
            });
        });
        that.loading = false
    },
    addressAddOrUpdate (event) {
        console.log(event)
        wx.navigateTo({
            url: '/pages/ucenter/addressAdd/addressAdd?address=' + JSON.stringify(event.currentTarget.dataset.address)
        })
    },
    deleteAddress (event) {
        let that = this;
        wx.showModal({
            title: '',
            content: '确定要删除地址？',
            success: function (res) {
                if (res.confirm) {
                    let addressId = event.target.dataset.addressId;
                    util.request(api.ShopAddressDelete, { addressid: addressId }, 'POST').then(function () {
                        var addressList = that.data.addressList.filter(function (element) {
                            if (element.addressid != addressId) {
                                return true;
                            } else {
                                return false;
                            }
                        });

                        that.setData({
                            addressList: addressList
                        });
                    });
                    console.log('用户点击确定')
                }
            }
        })
        return false;
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})