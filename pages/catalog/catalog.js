var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()

Page({
    data: {
        navListIndex: 0,
    },
    onLoad: function () {
        this.getCatalog();
    },
    getCatalog: function () {
        //CatalogList
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.CatalogList).then(function (res) {
            app.navList = res.navlist
            app.navListIndex = res.curnavindex

            console.log("catagorylist:", res.catagorylist)
            that.setData({
                navList: res.navlist,
                categoryList: res.catagorylist
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
                    categoryList: res.catagorylist
                });
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
    },
    switchCate: function (event) {
        app.navListIndex = event.currentTarget.dataset.index

        this.setData({
            navListIndex: event.currentTarget.dataset.index,
        })

        if (this.data.categoryList.id == event.currentTarget.dataset.id) {
            return false;
        }

        this.getCurrentCategory(event.currentTarget.dataset.id);
    }
})