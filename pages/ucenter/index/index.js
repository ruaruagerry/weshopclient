const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp();

Page({
    data: {
        userInfo: {},
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        if (!app.globalData.token) {
            util.getUserInfo().then((res) => {
                var e = { "detail": res }
                this.onWechatLogin(e)
            });
        }
    },
    onReady: function () {

    },
    onShow: function () {
        this.setData({
            userInfo: app.globalData.userinfo,
        });
    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    onDialogBody () {
        // 阻止冒泡
    },

    onWechatLogin (e) {
        if (e.detail.errMsg !== 'getUserInfo:ok') {
            if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
                return false
            }
            wx.showToast({
                title: '微信登录失败',
            })
            return false
        }
        util.login().then((res) => {
            return util.request(api.AuthLogin, {
                code: res,
                encrypteddata: e.detail.encryptedData,
                iv: e.detail.iv
            }, 'POST');
        }).then((res) => {
            // 设置用户信息
            this.setData({
                userInfo: res.userinfo,
            });

            app.globalData.token = res.token
            app.globalData.userinfo = res.userinfo

        }).catch((err) => {
            console.log(err)
        })
    },
    // TODO 移到个人信息页面
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    app.globalData.token = ""
                    app.globalData.userinfo = {}
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
})