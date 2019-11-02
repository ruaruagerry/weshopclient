var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
    data: {
        address: {
            id: 0,
            address: '',
            name: '',
            mobile: '',
            is_default: 0
        },
        addressId: 0,
    },
    bindinputMobile (event) {
        let address = this.data.address;
        address.mobile = event.detail.value;
        this.setData({
            address: address
        });
    },
    bindinputName (event) {
        let address = this.data.address;
        address.name = event.detail.value;
        this.setData({
            address: address
        });
    },
    bindinputAddress (event) {
        let address = this.data.address;
        address.address = event.detail.value;
        this.setData({
            address: address
        });
    },
    bindIsDefault () {
        let address = this.data.address;
        address.is_default = !address.is_default;
        this.setData({
            address: address
        });
    },
    getAddressDetail () {
        let that = this;
        util.request(api.AddressDetail, { id: that.data.addressId }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    address: res.data
                });
            }
        });
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        console.log(options)
        if (options.id) {
            this.setData({
                addressId: options.id
            });
            this.getAddressDetail();
        }
    },
    onReady: function () {

    },
    cancelAddress () {
        wx.reLaunch({
            url: '/pages/shopping/address/address',
        })
    },
    saveAddress () {
        let address = this.data.address;

        if (address.name == '') {
            util.showErrorToast('请输入姓名');

            return false;
        }

        if (address.mobile == '') {
            util.showErrorToast('请输入手机号码');
            return false;
        }


        if (address.district_id == 0) {
            util.showErrorToast('请输入省市区');
            return false;
        }

        if (address.address == '') {
            util.showErrorToast('请输入详细地址');
            return false;
        }

        console.log("address:", address)

        util.request(api.AddressSave, {
            id: address.id,
            name: address.name,
            mobile: address.mobile,
            province_id: address.province_id,
            city_id: address.city_id,
            district_id: address.district_id,
            address: address.address,
            is_default: address.is_default,
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                wx.reLaunch({
                    url: '/pages/shopping/address/address',
                })
            }
        });

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