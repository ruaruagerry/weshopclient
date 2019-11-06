var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()

Page({
    data: {
        navListIndex: 0,
        categoryIndex: 0,
    },
    onLoad: function () {

    },
    getCatalog: function () {
        //CatalogList
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.CatalogList).then(function (res) {
            app.categoryList = res.categorylist

            that.setData({
                navList: res.navlist,
                categoryList: res.categorylist
            });
            wx.hideLoading();
        });
        util.request(api.GoodsCount).then(function (res) {
            that.setData({
                goodsCount: res.goodscount
            });
        });
    },
    getCurrentCategory: function (id) {
        let that = this;
        let param = { id: id }
        util.request(api.CatalogCurrent, param, "POST")
            .then(function (res) {
                that.setData({
                    categoryList: res.categorylist
                });
            });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        this.getCatalog();
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    switchCate: function (event) {
        if (this.data.categoryList.id == event.currentTarget.dataset.id) {
            return false;
        }

        this.setData({
            navListIndex: event.currentTarget.dataset.index,
        })

        this.getCurrentCategory(event.currentTarget.dataset.id);
    }
})