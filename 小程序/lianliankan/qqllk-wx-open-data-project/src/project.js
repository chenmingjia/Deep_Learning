window.__require = function e(t, r, i) {
    function n(a, s) {
        if (!r[a]) {
            if (!t[a]) {
                var c = a.split("/");
                if (c = c[c.length - 1], !t[c]) {
                    var l = "function" == typeof __require && __require;
                    if (!s && l) return l(c, !0);
                    if (o) return o(c, !0);
                    throw new Error("Cannot find module '" + a + "'");
                }
            }
            var h = r[a] = {
                exports: {}
            };
            t[a][0].call(h.exports, function(e) {
                return n(t[a][1][e] || e);
            }, h, h.exports, e, t, r, i);
        }
        return r[a].exports;
    }
    for (var o = "function" == typeof __require && __require, a = 0; a < i.length; a++) n(i[a]);
    return n;
}({
    GlobalControl: [ function(e, t, r) {
        "use strict";
        cc._RF.push(t, "912f6xei7JF0r2rbITzmsn6", "GlobalControl"), Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {
                this.registered = !1, this.currentScore = 0, this.currentUser = null, this.isFetchingUserInfo = !1, 
                this.maxScore = 0, this.isFetchingMaxScore = !1, this.isMaxScoreSync = !1, this.rankData = null, 
                this.isRankDataDirty = !1, this.userInfoGotListener = [], this.scoreChangedListener = [], 
                this.support = cc.sys.platform === cc.sys.WECHAT_GAME && window.wx && "function" == typeof wx.onMessage && "function" == typeof wx.getUserCloudStorage && "function" == typeof wx.setUserCloudStorage && "function" == typeof wx.getFriendCloudStorage;
            }
            return e.getInstance = function() {
                return e.sInstance;
            }, e.prototype.registerWxListener = function() {
                var e = this;
                if (this.support) {
                    if (this.registered) return;
                    this.registered = !0, wx.onMessage(function(t) {
                        if (console.debug("收到主域发来的指令", t), "showRank" === t.command) console.debug("this.isRankDataDirty:", e.isRankDataDirty), 
                        ("Rank" !== cc.director.getScene().name || e.isRankDataDirty) && (console.debug("this.isRankDataDirty:", e.isRankDataDirty), 
                        cc.director.loadScene("Rank")); else if ("showCompare" === t.command) "Compare" !== cc.director.getScene().name && cc.director.loadScene("Compare"); else if ("updateScore" === t.command) {
                            e.currentScore = t.score;
                            var r = void 0;
                            t.score > e.maxScore ? (e.maxScore = t.score, e.isMaxScoreSync && e.uploadWxScore(t.score), 
                            e.setRankDataDirty(), r = {
                                current: e.currentScore,
                                max: e.maxScore
                            }) : r = {
                                current: e.currentScore
                            };
                            for (var i = 0; i < e.scoreChangedListener.length; i++) try {
                                e.scoreChangedListener[i].callback.call(e.scoreChangedListener[i].target, r);
                            } catch (e) {
                                console.error("回调分数改变失败", e);
                            }
                        }
                    });
                }
            }, e.prototype.uploadWxScore = function(e) {
                console.debug("上报分数到微信", e), wx.setUserCloudStorage({
                    KVDataList: [ {
                        key: "max_score",
                        value: JSON.stringify({
                            wxgame: {
                                score: e,
                                update_time: Math.floor(Date.now() / 1e3)
                            }
                        })
                    } ],
                    success: function(t) {
                        console.debug("子域更新数据成功", e, t);
                    },
                    fail: function(t) {
                        console.error("子域更新数据失败", e, t);
                    }
                });
            }, e.prototype.initMaxScoreIfNeeded = function() {
                var e = this;
                !this.support || this.isMaxScoreSync || this.isFetchingMaxScore || (console.debug("初始化历史最高分"), 
                this.isFetchingMaxScore = !0, wx.getUserCloudStorage({
                    keyList: [ "max_score" ],
                    success: function(t) {
                        if (e.isFetchingMaxScore = !1, e.isMaxScoreSync = !0, t && Array.isArray(t.KVDataList) && t.KVDataList.length > 0) {
                            for (var r = 0; r < t.KVDataList.length; r++) if ("max_score" === t.KVDataList[r].key) {
                                try {
                                    var i = JSON.parse(t.KVDataList[r].value).wxgame.score;
                                    if (i >= e.maxScore) {
                                        e.maxScore = i, console.debug("更新历史最高分", i);
                                        for (var n = 0; n < e.scoreChangedListener.length; n++) try {
                                            e.scoreChangedListener[n].callback.call(e.scoreChangedListener[n].target, {
                                                max: e.maxScore
                                            });
                                        } catch (e) {
                                            console.error("回调分数改变失败", e);
                                        }
                                    } else console.debug("获取到历史数据（" + i + "），但比现在（" + e.maxScore + "）还低，不更新。");
                                } catch (e) {
                                    console.error("解析用户分数失败", e);
                                }
                                break;
                            }
                        } else console.debug("无用户历史最高分，按未玩过处理");
                    },
                    fail: function(t) {
                        e.isFetchingMaxScore = !1, console.error("获取最高分数据失败", t);
                    }
                }));
            }, e.prototype.initUserInfoIfNeeded = function() {
                var e = this;
                !this.support || this.currentUser || this.isFetchingUserInfo || (console.debug("开始用户信息获取"), 
                this.isFetchingUserInfo = !0, wx.getUserInfo({
                    openIdList: [ "selfOpenId" ],
                    lang: "zh_CN",
                    success: function(t) {
                        if (console.debug("获取当前用户信息成功", t), t && t.data && t.data.length > 0) {
                            e.currentUser = t.data[0], console.debug("获取到用户信息", t.data[0]), e.isFetchingUserInfo = !1;
                            for (var r = 0; r < e.userInfoGotListener.length; r++) try {
                                e.userInfoGotListener[r].callback.call(e.userInfoGotListener[r].target, __assign({}, t.data[0]));
                            } catch (e) {
                                console.error("回调用户信息获取失败", e);
                            }
                            e.userInfoGotListener = [];
                        } else console.error("获取当前用户信息返回无效数据", t);
                    },
                    fail: function(t) {
                        console.error("获取当前用户信息失败", t), e.isFetchingUserInfo = !1;
                    }
                }));
            }, e.prototype.setRankDataDirty = function() {
                this.isRankDataDirty = !0;
            }, e.prototype.getRankData = function(e) {
                var t = this;
                this.support ? (this.initUserInfoIfNeeded(), this.initMaxScoreIfNeeded(), !this.rankData || this.isRankDataDirty ? wx.getFriendCloudStorage({
                    keyList: [ "max_score" ],
                    success: function(r) {
                        r && Array.isArray(r.data) ? (console.debug("获取好友数据成功", r), t.isRankDataDirty = !1, 
                        t.rankData = r.data.map(function(e) {
                            var t = 0;
                            if (Array.isArray(e.KVDataList) && e.KVDataList.length > 0) for (var r = 0; r < e.KVDataList.length; r++) if ("max_score" === e.KVDataList[r].key) {
                                try {
                                    t = JSON.parse(e.KVDataList[r].value).wxgame.score;
                                } catch (e) {
                                    console.error("解析好友分数失败", e);
                                }
                                break;
                            }
                            return {
                                avatarUrl: e.avatarUrl,
                                nickName: e.nickname,
                                openId: e.openid,
                                score: t
                            };
                        }).sort(function(e, t) {
                            return e.score > t.score ? -1 : e.score === t.score ? e.nickName > t.nickName ? 1 : -1 : 1;
                        }).map(function(e, t) {
                            return __assign({}, e, {
                                ranking: t
                            });
                        }), e.success(t.rankData.slice())) : (console.error("获取好友数据成功但数据无效", r), e.fail());
                    },
                    fail: function(t) {
                        console.error("获取好友数据失败", t), e.fail(t);
                    }
                }) : e.success(this.rankData.slice())) : e.fail("非微信环境");
            }, e.prototype.getUserInfo = function() {
                return this.currentUser;
            }, e.prototype.onUserInfoGot = function(e, t) {
                var r = this;
                if (e) if (this.currentUser) setTimeout(function() {
                    e.call(t, r.currentUser);
                }, 0); else {
                    for (var i = 0; i < this.userInfoGotListener.length; i++) if (e === this.userInfoGotListener[i].callback) return;
                    this.userInfoGotListener.push({
                        callback: e,
                        target: t
                    }), this.initUserInfoIfNeeded();
                }
            }, e.prototype.offUserInfoGot = function(e) {
                if (e) for (var t = 0; t < this.userInfoGotListener.length; t++) if (e === this.userInfoGotListener[t].callback) return void this.userInfoGotListener.splice(t, 1);
            }, e.prototype.onScoreChanged = function(e, t) {
                var r = this;
                if (e) {
                    this.isMaxScoreSync ? setTimeout(function() {
                        e.call(t, {
                            max: r.maxScore
                        });
                    }, 0) : this.initMaxScoreIfNeeded();
                    for (var i = 0; i < this.scoreChangedListener.length; i++) if (e === this.scoreChangedListener[i].callback) return;
                    this.scoreChangedListener.push({
                        callback: e,
                        target: t
                    });
                }
            }, e.prototype.offScoreChanged = function(e) {
                if (e) for (var t = 0; t < this.scoreChangedListener.length; t++) if (e === this.scoreChangedListener[t].callback) return void this.scoreChangedListener.splice(t, 1);
            }, e.sInstance = new e(), e;
        }();
        r.default = i, cc._RF.pop();
    }, {} ],
    ListItem: [ function(e, t, r) {
        "use strict";
        cc._RF.push(t, "74200behb5AQKZahS1nC7cy", "ListItem"), Object.defineProperty(r, "__esModule", {
            value: !0
        }), cc._RF.pop();
    }, {} ],
    ListView: [ function(e, t, r) {
        "use strict";
        cc._RF.push(t, "eb08835Z0dE4bvQhb6jipvu", "ListView"), Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var i = cc._decorator, n = i.ccclass, o = i.property, a = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.scrollView = null, t.visibleRect = null, t.vertical = !0, t.paddingStart = 0, 
                t.paddingEnd = 0, t.spacing = 0, t.template = null, t.templateSizeInScroll = 50, 
                t.templateComponentName = "", t.content = null, t.updateInterval = .2, t.lastContentPos = 0, 
                t.items = [], t;
            }
            return __extends(t, e), t.prototype.onLoad = function() {
                this.content = this.scrollView.content, this.bufferZone = this.vertical ? this.visibleRect.height : this.visibleRect.width, 
                this.maxRenderItemSize = Math.ceil(2 * this.bufferZone / (this.templateSizeInScroll + this.spacing)) + 2;
            }, t.prototype.initialize = function(e) {
                this.content.height = e.length * (this.templateSizeInScroll + this.spacing) - this.spacing + this.paddingStart + this.paddingEnd;
                for (var t = Math.min(this.maxRenderItemSize, e.length), r = 0; r < t; r++) {
                    var i = cc.instantiate(this.template);
                    this.content.addChild(i), this.vertical ? i.setPosition(0, -this.paddingStart - (i.height + this.spacing) * r - .5 * i.height) : i.setPosition(this.paddingStart + (i.height + this.spacing) * r + .5 * i.height, 0), 
                    this.items.push(i), i.getComponent(this.templateComponentName).updateItem(r, e[r]);
                }
            }, t.prototype.getPositionInView = function(e) {
                var t = e.parent.convertToWorldSpaceAR(e.position);
                return this.scrollView.node.convertToNodeSpaceAR(t);
            }, t.prototype.update = function(e) {
                if (this.updateTimer += e, !(this.updateTimer < this.updateInterval)) {
                    this.updateTimer = 0;
                    var t = this.items, r = this.items.length, i = this.bufferZone, n = (this.templateSizeInScroll + this.spacing) * r;
                    if (this.vertical) {
                        for (var o = this.content.y < this.lastContentPos, a = 0; a < r; a++) {
                            var s = this.getPositionInView(t[a]);
                            if (o) {
                                if (s.y < -i && t[a].y + n <= .5 * -this.templateSizeInScroll - this.paddingStart) {
                                    t[a].y = t[a].y + n;
                                    var c = (l = t[a].getComponent(this.templateComponentName)).getIndex() - r;
                                    l.updateItem(c, this.getItemData(c));
                                }
                            } else if (s.y > i && t[a].y - n >= -(this.content.height - .5 * this.templateSizeInScroll - this.paddingEnd)) {
                                t[a].y = t[a].y - n;
                                c = (l = t[a].getComponent(this.templateComponentName)).getIndex() + r;
                                l.updateItem(c, this.getItemData(c));
                            }
                        }
                        this.lastContentPos = this.content.y;
                    } else {
                        for (o = this.content.x > this.lastContentPos, a = 0; a < r; a++) {
                            s = this.getPositionInView(t[a]);
                            if (o) {
                                if (s.x > i && t[a].x - n >= .5 * this.templateSizeInScroll + this.paddingStart) {
                                    t[a].x = t[a].x - n;
                                    c = (l = t[a].getComponent(this.templateComponentName)).getIndex() - r;
                                    l.updateItem(c, this.getItemData(c));
                                }
                            } else if (s.x < i && t[a].x + n <= this.content.height - .5 * this.templateSizeInScroll - this.paddingEnd) {
                                t[a].x = t[a].x + n;
                                var l;
                                c = (l = t[a].getComponent(this.templateComponentName)).getIndex() + r;
                                l.updateItem(c, this.getItemData(c));
                            }
                        }
                        this.lastContentPos = this.content.x;
                    }
                }
            }, __decorate([ o(cc.ScrollView) ], t.prototype, "scrollView", void 0), __decorate([ o(cc.Node) ], t.prototype, "visibleRect", void 0), 
            __decorate([ o({
                displayName: "垂直列表"
            }) ], t.prototype, "vertical", void 0), __decorate([ o({
                displayName: "首元素距顶部距离"
            }) ], t.prototype, "paddingStart", void 0), __decorate([ o({
                displayName: "尾元素距底部距离"
            }) ], t.prototype, "paddingEnd", void 0), __decorate([ o({
                displayName: "间距"
            }) ], t.prototype, "spacing", void 0), __decorate([ o({
                type: cc.Prefab,
                displayName: "列表项模板"
            }) ], t.prototype, "template", void 0), __decorate([ o({
                displayName: "列表项尺寸"
            }) ], t.prototype, "templateSizeInScroll", void 0), __decorate([ o({
                displayName: "列表项组件名"
            }) ], t.prototype, "templateComponentName", void 0), t = __decorate([ n ], t);
        }(cc.Component);
        r.default = a, cc._RF.pop();
    }, {} ],
    RankItem: [ function(e, t, r) {
        "use strict";
        cc._RF.push(t, "168e8ACUydBspIzbFUXWxhL", "RankItem"), Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var i = e("../TextUtils"), n = cc._decorator, o = n.ccclass, a = n.property, s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.avatarDefault = null, t.medalImages = [], t.userName = null, t.userScore = null, 
                t.rankingMedal = null, t.rankingNum = null, t.avatar = null, t;
            }
            return __extends(t, e), t.prototype.getIndex = function() {
                return this.index;
            }, t.prototype.updateItem = function(e, t) {
                var r = this;
                this.index = e;
                var n = t.ranking, o = t.avatarUrl, a = t.nickName, s = t.score;
                if (n < 0 ? (this.rankingMedal.node.active = !1, this.rankingNum.node.active = !1) : n < this.medalImages.length ? (this.rankingMedal.node.active = !0, 
                this.rankingNum.node.active = !1, this.rankingMedal.spriteFrame = this.medalImages[Math.floor(n)]) : (this.rankingMedal.node.active = !1, 
                this.rankingNum.node.active = !0, this.rankingNum.string = "" + Math.floor(n + 1)), 
                this.avatarUrl = o, o) try {
                    cc.loader.load({
                        url: o,
                        type: "png"
                    }, function(e, t) {
                        e ? console.error("头像加载失败", o, e) : r.avatarUrl === o && (r.avatar.spriteFrame = new cc.SpriteFrame(t));
                    });
                } catch (e) {
                    console.error("加载头像失败", e);
                } else this.avatar.spriteFrame = this.avatarDefault;
                this.userName.string = i.convertTextWithEllipsis(a, 11), this.userScore.string = s + "分";
            }, __decorate([ a(cc.SpriteFrame) ], t.prototype, "avatarDefault", void 0), __decorate([ a(cc.SpriteFrame) ], t.prototype, "medalImages", void 0), 
            __decorate([ a(cc.Label) ], t.prototype, "userName", void 0), __decorate([ a(cc.Label) ], t.prototype, "userScore", void 0), 
            __decorate([ a(cc.Sprite) ], t.prototype, "rankingMedal", void 0), __decorate([ a(cc.Label) ], t.prototype, "rankingNum", void 0), 
            __decorate([ a(cc.Sprite) ], t.prototype, "avatar", void 0), t = __decorate([ o ], t);
        }(cc.Component);
        r.default = s, cc._RF.pop();
    }, {
        "../TextUtils": "TextUtils"
    } ],
    Rank: [ function(e, t, r) {
        "use strict";
        cc._RF.push(t, "14e44JnYXNGmowdqtFOOzzG", "Rank"), Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var i = e("../GlobalControl"), n = e("./ListView"), o = cc._decorator, a = o.ccclass, s = (o.property, 
        function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this;
            }
            return __extends(t, e), t.prototype.onLoad = function() {
                var t = this;
                e.prototype.onLoad.call(this), i.default.getInstance().registerWxListener(), i.default.getInstance().getRankData({
                    success: function(e) {
                        t.isValid && (t.randListData = e, t.initialize(e));
                    },
                    fail: function() {
                        t.isValid && window.wx && wx.showToast({
                            title: "获取榜单数据失败",
                            icon: "none"
                        });
                    }
                });
            }, t.prototype.getItemData = function(e) {
                var t = this.randListData ? this.randListData.length : 0;
                if (e < 0 || e >= t) throw new Error("选项数组越界，当前总容量 " + t + "，索引 " + e);
                return this.randListData[e];
            }, t = __decorate([ a ], t);
        }(n.default));
        r.default = s, cc._RF.pop();
    }, {
        "../GlobalControl": "GlobalControl",
        "./ListView": "ListView"
    } ],
    TextUtils: [ function(e, t, r) {
        "use strict";
        function i(e) {
            return e >= 0 && e <= 128 ? 1 : 2;
        }
        function n(e) {
            for (var t = 0, r = 0; r < e.length; r++) {
                t += i(e.charCodeAt(r));
            }
            return t;
        }
        cc._RF.push(t, "4eb06INLwdEQrEgon8rdE6h", "TextUtils"), Object.defineProperty(r, "__esModule", {
            value: !0
        }), r.getTextLength = n;
        var o = "...", a = o.length;
        r.convertTextWithEllipsis = function(e, t) {
            if (n(e) > t) {
                for (var r = 0, s = "", c = 0; c < e.length; c++) {
                    var l = i(e.charCodeAt(c));
                    if (!((r += l) <= t)) {
                        r -= l, r += a;
                        for (var h = s.length, d = 0, u = h - 1; u >= 0 && (d++, !((r -= i(s.charCodeAt(u))) <= t)); u--) ;
                        s = s.slice(0, h - d) + o;
                        break;
                    }
                    s += e.charAt(c);
                }
                return s;
            }
            return e;
        }, cc._RF.pop();
    }, {} ]
}, {}, [ "GlobalControl", "ListItem", "ListView", "Rank", "RankItem", "TextUtils" ]);