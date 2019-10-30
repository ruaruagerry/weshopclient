var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
    data: {
        cartGoodsCount: 0,
        userHasCollect: 0,
        number: 1,
        checkedSpecText: '请选择规格数量',
        openAttr: false,
        noCollectImage: "/static/images/icon_collect.png",
        hasCollectImage: "/static/images/icon_collect_checked.png",
        collectBackImage: "/static/images/icon_collect.png",
        selectValues: [],
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            good: JSON.parse(decodeURIComponent(options.good)),
        });

        var that = this;
        util.request(api.CartCount).then(function (res) {
            that.setData({
                cartGoodsCount: res.carttotal
            });
        });

        this.getGoodsInfo();
    },
    getGoodsInfo: function () {
        let that = this;
        util.request(api.GoodsDetail, { goodid: that.data.good.goodid }, "POST")
            .then(function (res) {
                that.setData({
                    gallery: res.gallery,
                    attribute: res.attribute,
                    issueList: res.issue,
                    brand: res.brand,
                    specificationList: res.specification,
                    userHasCollect: 1
                });

                if (that.data.userHasCollect == 1) {
                    that.setData({
                        'collectBackImage': that.data.hasCollectImage
                    });
                } else {
                    that.setData({
                        'collectBackImage': that.data.noCollectImage
                    });
                }

                WxParse.wxParse('goodsDetail', 'html', that.data.good.describe, that);
            });
    },
    clickSkuValue: function (event) {
        let specSpecificationid = event.currentTarget.dataset.specificationId;
        let specValueDetailid = event.currentTarget.dataset.valueDetailid;

        //判断是否可以点击

        //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
        let _specificationList = this.data.specificationList;
        for (let i = 0; i < _specificationList.length; i++) {
            if (_specificationList[i].specificationid == specSpecificationid) {
                for (let j = 0; j < _specificationList[i].valuelist.length; j++) {
                    if (_specificationList[i].valuelist[j].detailid == specValueDetailid) {
                        //如果已经选中，则反选
                        if (_specificationList[i].valuelist[j].checked) {
                            _specificationList[i].valuelist[j].checked = false;
                        } else {
                            _specificationList[i].valuelist[j].checked = true;
                        }
                    } else {
                        _specificationList[i].valuelist[j].checked = false;
                    }
                }
            }
        }
        this.setData({
            'specificationList': _specificationList
        });
        //重新计算spec改变后的信息
        this.changeSpecInfo();

        //重新计算哪些值不可以点击
    },

    //获取选中的规格信息
    getCheckedSpecValue: function () {
        let checkedValues = []
        let _specificationList = this.data.specificationList;
        for (let i = 0; i < _specificationList.length; i++) {
            let _checkedObj = {
                specificationId: _specificationList[i].specificationid,
                valueDetailid: 0,
                valueText: ''
            };

            for (let j = 0; j < _specificationList[i].valuelist.length; j++) {
                if (_specificationList[i].valuelist[j].checked) {
                    _checkedObj.valueDetailid = _specificationList[i].valuelist[j].detailid;
                    _checkedObj.valueText = _specificationList[i].valuelist[j].value;
                }
            }

            checkedValues.push(_checkedObj);
        }

        this.data.selectValues = checkedValues

        return checkedValues;

    },
    //根据已选的值，计算其它值的状态
    setSpecValueStatus: function () {

    },
    //判断规格是否选择完整
    isCheckedAllSpec: function () {
        return !this.getCheckedSpecValue().some(function (v) {
            if (v.valueDetailid == 0) {
                return true;
            }
        });
    },
    changeSpecInfo: function () {
        let checkedNameValue = this.getCheckedSpecValue();

        //设置选择的信息
        let checkedValue = checkedNameValue.filter(function (v) {
            if (v.valueDetailid != 0) {
                return true;
            } else {
                return false;
            }
        }).map(function (v) {
            return v.valueText;
        });
        if (checkedValue.length > 0) {
            this.setData({
                'checkedSpecText': checkedValue.join('　')
            });
        } else {
            this.setData({
                'checkedSpecText': '请选择规格数量'
            });
        }

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
    switchAttrPop: function () {
        if (this.data.openAttr == false) {
            this.setData({
                openAttr: !this.data.openAttr
            });
        }
    },
    closeAttr: function () {
        this.setData({
            openAttr: false,
        });
    },
    addCannelCollect: function () {
        let that = this;
        //添加或是取消收藏
        util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
            .then(function (res) {
                let _res = res;
                if (_res.errno == 0) {
                    if (_res.data.type == 'add') {
                        that.setData({
                            'collectBackImage': that.data.hasCollectImage
                        });
                    } else {
                        that.setData({
                            'collectBackImage': that.data.noCollectImage
                        });
                    }

                } else {
                    wx.showToast({
                        image: '/static/images/icon_error.png',
                        title: _res.errmsg,
                        mask: true
                    });
                }
            });
    },
    openCartPage: function () {
        wx.switchTab({
            url: '/pages/cart/cart',
        });
    },
    addToCart: function () {
        var that = this;
        if (this.data.openAttr === false) {
            //打开规格选择窗口
            this.setData({
                openAttr: !this.data.openAttr
            });
        } else {
            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: '请选择规格',
                    mask: true
                });
                return false;
            }

            let goodinfo = {
                goodid: this.data.good.goodid,
                num: this.data.number,
                specification: this.data.selectValues,
            }

            console.log("goodinfo:", goodinfo)

            //添加到购物车
            util.request(api.CartAdd, { goodinfo: JSON.stringify(goodinfo) }, "POST")
                .then(function (res) {
                    that.setData({
                        openAttr: !that.data.openAttr,
                        cartGoodsCount: res.carttotal
                    });
                });
        }
    },
    cutNumber: function () {
        this.setData({
            number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
        });
    },
    addNumber: function () {
        this.setData({
            number: this.data.number + 1
        });
    }
})