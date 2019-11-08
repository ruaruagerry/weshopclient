var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()

Page({
    data: {
        loading: false,
        isEditCart: false,
        checkedAllStatus: true
    },
    onLoad: function () {

    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        this.getCartList();
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
            this.getCartList()
            wx.stopPullDownRefresh()
        }
    },
    getCartList: function () {
        let that = this;
        that.loading = true
        util.request(api.CartList).then(function (res) {
            that.setData({
                cartGoods: res.cartlist,
                cartTotal: res.carttotal
            });

            that.setData({
                checkedAllStatus: that.isCheckedAll()
            });

            that.loading = false
        });
    },
    isCheckedAll: function () {
        //判断购物车商品已全选
        return this.data.cartGoods.every(function (element) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });
    },
    checkedItem: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        let that = this;

        if (!this.data.isEditCart) {
            util.request(api.CartChecked, { index: itemIndex, checked: that.data.cartGoods[itemIndex].checked ? false : true }, 'POST').then(function () {
                that.data.cartGoods[itemIndex].checked = !that.data.cartGoods[itemIndex].checked
                if (that.data.cartGoods[itemIndex].checked) {
                    that.data.cartTotal.checkedcount++
                    that.data.cartTotal.checkedprice += that.data.cartGoods[itemIndex].price * that.data.cartGoods[itemIndex].num
                } else {
                    that.data.cartTotal.checkedcount--
                    that.data.cartTotal.checkedprice -= that.data.cartGoods[itemIndex].price * that.data.cartGoods[itemIndex].num
                }

                that.setData({
                    cartGoods: that.data.cartGoods,
                    cartTotal: that.data.cartTotal
                });

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        } else {
            //编辑状态
            let tmpCartData = this.data.cartGoods.map(function (element, index) {
                if (index == itemIndex) {
                    element.checked = !element.checked;
                }

                return element;
            });

            that.setData({
                cartGoods: tmpCartData,
                checkedAllStatus: that.isCheckedAll(),
                'cartTotal.checkedcount': that.getCheckedCount()
            });
        }
    },
    getCheckedCount: function () {
        let checkedcount = 0;
        this.data.cartGoods.forEach(function (v) {
            if (v.checked === true) {
                checkedcount++;
            }
        });
        return checkedcount;
    },
    checkedAll: function () {
        let that = this;
        var ischeckedall = !this.isCheckedAll()

        if (!this.data.isEditCart) {
            util.request(api.CartCheckedAll, { checkedall: ischeckedall }, "POST").then(function () {
                if (ischeckedall) {
                    for (var i = 0; i < that.data.cartGoods.length; i++) {
                        that.data.cartGoods[i].checked = true
                        that.data.cartTotal.checkedcount++
                        that.data.cartTotal.checkedprice += that.data.cartGoods[i].price * that.data.cartGoods[i].num
                    }
                } else {
                    for (var i = 0; i < that.data.cartGoods.length; i++) {
                        that.data.cartGoods[i].checked = false
                        that.data.cartTotal.checkedcount = 0
                        that.data.cartTotal.checkedprice = 0
                    }
                }

                that.setData({
                    cartGoods: that.data.cartGoods,
                    cartTotal: that.data.cartTotal
                });

                that.setData({
                    checkedAllStatus: ischeckedall
                });
            });
        } else {
            //编辑状态
            let tmpCartData = this.data.cartGoods.map(function (v) {
                v.checked = ischeckedall;
                return v;
            });

            var checkedcount = 0
            if (ischeckedall) {
                checkedcount = that.data.cartGoods.length
            }

            that.setData({
                cartGoods: tmpCartData,
                checkedAllStatus: ischeckedall,
                'cartTotal.checkedcount': checkedcount,
            });
        }
    },
    editCart: function () {
        var that = this;
        if (this.data.isEditCart) {
            // 返回购物车界面
            this.getCartList();
            this.setData({
                isEditCart: !this.data.isEditCart
            });
        } else {
            //编辑状态
            let tmpCartList = this.data.cartGoods.map(function (v) {
                v.checked = false;
                return v;
            });

            this.setData({
                cartGoods: tmpCartList,
                isEditCart: !this.data.isEditCart,
                checkedAllStatus: that.isCheckedAll(),
            });
        }
    },
    updateCart: function (index, deltanum) {
        let that = this;

        util.request(api.CartUpdate, { index: index, deltanum: deltanum }, 'POST').then(function () {
            let cartItem = that.data.cartGoods[index];
            cartItem.num = (cartItem.num + deltanum > 1) ? cartItem.num + deltanum : 1;
            that.setData({
                cartGoods: that.data.cartGoods,
                checkedAllStatus: that.isCheckedAll()
            });
        });
    },
    cutNumber: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        this.updateCart(itemIndex, -1);
    },
    addNumber: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        this.updateCart(itemIndex, 1);
    },
    checkoutOrder: function () {
        //获取已选择的商品
        let that = this;

        var checkedGoods = that.data.cartGoods.filter(function (element) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });

        if (checkedGoods.length <= 0) {
            return false;
        }

        app.checkedgoods = JSON.stringify(checkedGoods)

        wx.navigateTo({
            url: '../shopping/checkout/checkout'
        })
    },
    deleteCart: function () {
        //获取已选择的商品
        let that = this;
        var indexarray = new Array();
        for (var i = 0; i < that.data.cartGoods.length; i++) {
            if (that.data.cartGoods[i].checked) {
                indexarray.push(i)
            }
        }

        util.request(api.CartDelete, { indexs: indexarray }, 'POST').then(function () {
            let cartList = that.data.cartGoods.filter(function (element) {
                if (!element.checked) {
                    return element
                }
            });

            console.log("cartList:", cartList)

            let cartTotal = { "checkedcount": 0, "checkedprice": 0 }

            that.setData({
                cartGoods: cartList,
                cartTotal: cartTotal,
                checkedAllStatus: that.isCheckedAll()
            });
        });
    }
})