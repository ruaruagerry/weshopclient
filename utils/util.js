var api = require('../config/api.js')
var app = getApp();

function formatTime (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function base64_decode (input) { // 解码，配合decodeURIComponent使用
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = base64EncodeChars.indexOf(input.charAt(i++));
        enc2 = base64EncodeChars.indexOf(input.charAt(i++));
        enc3 = base64EncodeChars.indexOf(input.charAt(i++));
        enc4 = base64EncodeChars.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    return utf8_decode(output);
}

function utf8_decode (utftext) { // utf-8解码
    var string = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c1 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utftext.charCodeAt(i + 1);
            c2 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return string;
}

/**
 * 封封微信的的request
 */
function request (url, data = {}, method = "GET") {
    return new Promise(function (resolve, reject) {
        if (url != api.AuthLogin && !app.globalData.token) {
            wx.switchTab({
                url: '/pages/ucenter/index/index'
            });
            showErrorToast("请先登录")
            return
        }

        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'Session': app.globalData.token,
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    // server logic
                    if (res.data.result != 0) {
                        // token过期
                        if (res.data.result == 11) {
                            app.globalData.token = ""
                            app.globalData.userinfo = {
                                nickname: '',
                                avatarurl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
                            }
                            wx.switchTab({
                                url: '/pages/ucenter/index/index'
                            });
                            showErrorToast("请重新登录")
                            return
                        }

                        showErrorToast("result:" + res.data.result + ", msg:" + res.data.msg)
                        reject(res.data.msg)
                    }
                    var jsondata = new Object()
                    if (res.data.data != undefined) {
                        res.data.data = base64_decode(res.data.data)
                        jsondata = JSON.parse(res.data.data)
                    }
                    resolve(jsondata)
                } else {
                    reject(res.errMsg);
                }
            },
            fail: function (err) {
                reject(err)
                console.log("failed")
            }
        })
    })
}

function get (url, data = {}) {
    return request(url, data, 'GET')
}

function post (url, data = {}) {
    return request(url, data, 'POST')
}

/**
 * 检查微信会话是否过期
 */
function checkSession () {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * 调用微信登录
 */
function login () {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    resolve(res.code);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}

function getUserInfo () {
    return new Promise(function (resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                if (res.errMsg === 'getUserInfo:ok') {
                    resolve(res);
                } else {
                    reject(res)
                }
            },
            fail: function (err) {
                reject(err);
            }
        })
    });
}

function redirect (url) {
    //判断页面是否需要登录
    if (false) {
        wx.redirectTo({
            url: '/pages/auth/login/login'
        });
        return false;
    } else {
        wx.redirectTo({
            url: url
        });
    }
}

function showErrorToast (msg) {
    wx.showToast({
        title: msg,
        image: '/static/images/icon_error.png',
        duration: 2000,
    })
}

module.exports = {
    formatTime,
    request,
    get,
    post,
    redirect,
    showErrorToast,
    checkSession,
    login,
    getUserInfo,
}


