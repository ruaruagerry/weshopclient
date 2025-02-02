var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()

Page({
    data: {
        loading: false,
        // text:"这是一个页面"
        goodsList: [],
        currentCategory: {},
        scrollLeft: 0,
        scrollHeight: 0,
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        if (options.id) {
            that.setData({
                id: parseInt(options.id),
                categoryid: options.categoryid,
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
    onPullDownRefresh () {
        // 上拉刷新
        if (!this.loading) {
            this.getGoodsList()
            wx.stopPullDownRefresh()
        }
    },
    getGoodsList: function () {
        let that = this;
        that.loading = true
        util.request(api.GoodsList, { categoryid: this.data.categoryid }, "POST")
            .then(function (res) {
                // category index
                var curindex = 0
                for (let i = 0; i < app.categoryList.length; i++) {
                    if (app.categoryList[i].categoryid == that.data.categoryid) {
                        curindex = i
                        break
                    }
                }

                that.setData({
                    categoryList: app.categoryList,
                    categoryIndex: curindex,
                    goodsList: res.goodslist
                });

                let categoryCount = app.categoryList.length;
                if (app.categoryList > categoryCount / 2 && categoryCount > 5) {
                    that.setData({
                        scrollLeft: curindex * 60
                    });
                }
            });
        that.loading = false
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
        if (this.data.categoryid == event.currentTarget.dataset.categoryid) {
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

        this.setData({
            categoryid: event.currentTarget.dataset.categoryid
        });

        this.getGoodsList();

        // 设置全局变量
    },
    toGoods: function (event) {
        wx.navigateTo({
            url: "/pages/goods/goods?good=" + encodeURIComponent(JSON.stringify(event.currentTarget.dataset.good)),
        })
    }
})