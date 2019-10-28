var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()

Page({
    data: {
        // text:"这是一个页面"
        goodsList: [],
        currentCategory: {},
        scrollLeft: 0,
        scrollHeight: 0,
        page: 1,
        size: 10000
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        if (options.id) {
            that.setData({
                id: parseInt(options.id),
                catagoryid: options.catagoryid,
            });
        }

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });

        this.getGoodsList();
    },
    getGoodsList: function () {
        let that = this;
        util.request(api.GoodsList, { catagoryid: this.data.catagoryid }, "POST")
            .then(function (res) {
                that.setData({
                    navList: app.navList,
                    navListIndex: app.navListIndex,
                    goodsList: res.goodslist
                });

                let navListCount = app.navList.length;
                if (app.navListIndex > navListCount / 2 && navListCount > 5) {
                    that.setData({
                        scrollLeft: app.navListIndex * 60
                    });
                }
            });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        console.log(1);
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    switchCate: function (event) {
        if (this.data.id == event.currentTarget.dataset.id) {
            return false;
        }

        var that = this;
        var clientX = event.detail.x;
        var currentTarget = event.currentTarget;
        if (clientX < 60) {
            that.setData({
                scrollLeft: currentTarget.offsetLeft - 60
            });
        } else if (clientX > 330) {
            that.setData({
                scrollLeft: currentTarget.offsetLeft
            });
        }

        app.navListIndex = event.currentTarget.dataset.index
        this.setData({
            navListIndex: event.currentTarget.dataset.index,
            id: event.currentTarget.dataset.id
        });

        this.getCategoryInfo();
    }
})