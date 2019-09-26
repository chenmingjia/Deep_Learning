// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var r = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", i = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx";

function n(e) {
    void 0 === e && (e = r);
    var t = "";
    return t || (t = e.replace(/[xy]/g, function(e) {
        var t = 16 * Math.random() | 0;
        return ("x" == e ? t : 3 & t | 8).toString(16);
    })), t;
}

export.uuid = n, 
export.uuidNoSeperator = function() {
            return n(i);
};

export.compareVersion = function(e, t) {
    for (var o = e.split("."), r = t.split("."), i = Math.max(o.length, r.length); e.length < i; ) o.push("0");
    for (;t.length < i; ) r.push("0");
    for (var n = 0; n < i; n++) {
        var a = parseInt(e[n]), s = parseInt(t[n]);
        if (a > s) return 1;
        if (a < s) return -1;
    }
    return 0;
};

var a = function() {
    function e() {}
    return e.setStorage = function(t) {
        setTimeout(function() {
            try {
                e.setStorageSync(t.key, t.data), t.success && t.success();
            } catch (e) {
                t.fail && t.fail(e);
            } finally {
                t.complete && t.complete();
            }
        }, 1);
    }, e.getStorage = function(t) {
        setTimeout(function() {
            try {
                var o = e.getStorageSync(t.key);
                t.success && t.success(o);
            } catch (e) {
                t.fail && t.fail(e);
            } finally {
                t.complete && t.complete();
            }
        }, 1);
    }, e.setStorageSync = function(e, t) {
        localStorage.setItem(e, JSON.stringify({
            realData: t
        }));
    }, e.getStorageSync = function(e) {
        var t = localStorage.getItem(e);
        return "string" == typeof t && t.indexOf("realData") >= 0 ? JSON.parse(t).realData : t;
    }, e;
}();

export.StorageAdapter = a;