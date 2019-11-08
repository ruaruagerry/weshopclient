var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {
        loading: false,
        typeId: 0,
        collectList: []
    },
    getCollectList () {
        let that = this;
        that.loading = true
        util.request(api.ShopCollectList).then(function (res) {
            console.log(res.collectlist);
            that.setData({
                collectList: res.collectlist
            });
        });
        that.loading = false
    },
    onLoad: function () {
        this.getCollectList();
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    onPullDownRefresh () {
        // 上拉刷新
        if (!this.loading) {
            this.getCollectList();
            wx.stopPullDownRefresh()
        }
    },
    openGoods (event) {

        let that = this;
        let good = this.data.collectList[event.currentTarget.dataset.index];

        //触摸时间距离页面打开的毫秒数
        var touchTime = that.data.touch_end - that.data.touch_start;
        console.log(touchTime);
        //如果按下时间大于350为长按
        if (touchTime > 350) {
            wx.showModal({
                title: '',
                content: '确定删除吗？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.ShopCollectDelete, { goodid: good.goodid }, 'POST').then(function () {
                            var collectList = that.data.collectList.filter(function (element) {
                                if (element.goodid != good.goodid) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });

                            that.setData({
                                collectList: collectList
                            });

                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 2000
                            });
                        });
                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '/pages/goods/goods?good=' + encodeURIComponent(JSON.stringify(good)),
            });
        }
    },
    //按下事件开始
    touchStart: function (e) {
        let that = this;
        that.setData({
            touch_start: e.timeStamp
        })
        console.log(e.timeStamp + '- touch-start')
    },
    //按下事件结束
    touchEnd: function (e) {
        let that = this;
        that.setData({
            touch_end: e.timeStamp
        })
        console.log(e.timeStamp + '- touch-end')
    },
})