window.__require = function e(t, o, r) {
    function i(a, s) {
        if (!o[a]) {
            if (!t[a]) {
                var c = a.split("/");
                if (c = c[c.length - 1], !t[c]) {
                    var u = "function" == typeof __require && __require;
                    if (!s && u) return u(c, !0);
                    if (n) return n(c, !0);
                    throw new Error("Cannot find module '" + a + "'");
                }
            }
            var l = o[a] = {
                exports: {}
            };
            t[a][0].call(l.exports, function(e) {
                return i(t[a][1][e] || e);
            }, l, l.exports, e, t, o, r);
        }
        return o[a].exports;
    }
    for (var n = "function" == typeof __require && __require, a = 0; a < r.length; a++) i(r[a]);
    return i;
}({
    AdUtils: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "23b2aHqXStKTLsrpX6cCfrx", "AdUtils"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../Libs/babybus/network/systemInfo"), i = e("../Libs/babybus/dataAnalysis/reporter"), n = e("../Libs/babybus/babybusUtils"), a = e("./Config/DataAnalysisConfig"), s = function() {
            function e() {
                this.canWeUse = !1, this.bannerAds = [], this.isVideoAdAvailable = !1, this.videoAdAttemptTime = 0, 
                this.canWeUse = cc.sys.platform === cc.sys.WECHAT_GAME && n.compareVersion(r.default.getInstance().SDKVersion, "2.0.4") >= 0;
            }
            return e.getInstance = function() {
                return e.INSTANCE || (e.INSTANCE = new e()), this.INSTANCE;
            }, e.prototype.createRewardedVideoAd = function(e) {
                var t = this;
                if (this.canWeUse) {
                    if (!e) throw new Error("需提供视频广告id");
                    this.rewardedVideoAd || (this.rewardedVideoAdUnitId = e, this.rewardedVideoAd = wx.createRewardedVideoAd({
                        adUnitId: e
                    }), this.rewardedVideoAd.onError(function(e) {
                        var o;
                        if (t.isVideoAdAvailable = !1, console.error("[AD] 视频广告异常", e), e && void 0 !== e.errCode) switch (i.default.getInstance().reportAnalytics(a.default.eventNames.VIDEO_AD_ERROR, {
                            err_code: e.errCode,
                            err_msg: e.errMsg ? e.errMsg : JSON.stringify(e),
                            ad_unit_id: t.rewardedVideoAdUnitId
                        }), e.errCode) {
                          case 1001:
                          case 1002:
                          case 1006:
                          case 1007:
                          case 1008:
                            o = -1;
                            break;

                          case 1005:
                            o = 36e5;
                            break;

                          default:
                            o = 1e4;
                        } else i.default.getInstance().reportAnalytics(a.default.eventNames.VIDEO_AD_ERROR, {
                            err_code: "None",
                            err_msg: e && e.errMsg ? e.errMsg : JSON.stringify(e),
                            ad_unit_id: t.rewardedVideoAdUnitId
                        }), o = 1e4;
                        t.videoAdAttemptTime >= 3 ? i.default.getInstance().reportAnalytics(a.default.eventNames.VIDEO_AD_LOAD_MAX) : o > 0 && setTimeout(function() {
                            t.isVideoAdAvailable || t.loadVideoAd();
                        }, o);
                    }), this.rewardedVideoAd.onLoad(function() {
                        t.isVideoAdAvailable = !0, t.videoAdAttemptTime = 0, console.debug("[AD] 拉取视频广告完毕");
                    }), this.loadVideoAd());
                }
            }, e.prototype.loadVideoAd = function() {
                console.debug("[AD] 尝试拉取视频广告"), this.videoAdAttemptTime++, this.rewardedVideoAd.load().catch(function(e) {
                    console.error("[AD] 拉取视频广告失败", e), i.default.getInstance().reportAnalytics(a.default.eventNames.VIDEO_AD_LOAD_FAIL, {
                        err_msg: JSON.stringify(e)
                    });
                });
            }, e.prototype.isRewardedVideoAdAvailable = function() {
                return this.isVideoAdAvailable;
            }, e.prototype.showRewardedVideoAd = function(e, t) {
                var o = this;
                if (!this.rewardedVideoAd) throw new Error("未初始化就想播放视频广告");
                if (!this.isVideoAdAvailable) return console.warn("[AD] 尝试播放视频广告，但是广告目前不可用"), e.fail(), 
                void (e.completed && e.completed());
                console.debug("[AD] 尝试播放视频广告"), this.rewardedVideoAd.onClose(function(r) {
                    console.debug("[AD] 播放视频广告完毕", r), o.rewardedVideoAd.offClose(), r && r.isEnded || void 0 === r ? (i.default.getInstance().reportAnalytics(a.default.eventNames.VIDEO_AD_RESULT, {
                        type: "finished"
                    }), t.isValid && e.finished()) : (i.default.getInstance().reportAnalytics(a.default.eventNames.VIDEO_AD_RESULT, {
                        type: "unfinished"
                    }), t.isValid && e.unfinished()), t.isValid && e.completed && e.completed();
                }), this.rewardedVideoAd.show().then(function() {
                    console.debug("[AD] 播放视频广告调用成功");
                }).catch(function(r) {
                    console.error("[AD] 播放视频广告调用失败", r), o.rewardedVideoAd.offClose(), i.default.getInstance().reportAnalytics(a.default.eventNames.VIDEO_AD_SHOW_FAIL, {
                        err_msg: JSON.stringify(r)
                    }), t.isValid && (e.fail(), e.completed && e.completed());
                });
            }, e.prototype.createBannerAd = function(e, t) {
                if (void 0 === t && (t = !0), this.canWeUse) {
                    if (!e) throw new Error("广告id无效");
                    var o = this.getBannerAd(e);
                    if (o) t && o.show().catch(function(e) {
                        console.error("[AD] 广告show失败", e);
                    }); else {
                        var n = cc.view.getFrameSize(), s = n.width;
                        if (cc.winSize.height / cc.winSize.width < 1.7) {
                            var c = cc.view.getDesignResolutionSize();
                            s = cc.view.getFrameSize().height * c.width / c.height, s = Math.min(s, 300);
                        }
                        var u = 220 * (s = Math.max(220 * s / 273, 300)) / 750;
                        console.debug("[AD] 请求广告，宽度 " + s + "，高度 " + u), (o = wx.createBannerAd({
                            adUnitId: e,
                            style: {
                                left: (n.width - s) / 2,
                                top: 0,
                                width: s,
                                height: u
                            }
                        })).onResize(function() {
                            console.debug("[AD] 实际广告，宽度 " + o.style.realWidth + "，高度 " + o.style.realHeight), 
                            o.style.left = (n.width - o.style.realWidth) / 2, o.style.top = n.height - o.style.realHeight, 
                            r.default.getInstance().isIphoneX() && (o.style.top = o.style.top - 54);
                        }), o.onError(function(t) {
                            console.error("[AD] Banner广告异常", t), t && t.errCode ? i.default.getInstance().reportAnalytics(a.default.eventNames.BANNER_AD_ERROR, {
                                err_code: t.errCode,
                                err_msg: t.errMsg ? t.errMsg : JSON.stringify(t),
                                ad_unit_id: e
                            }) : i.default.getInstance().reportAnalytics(a.default.eventNames.BANNER_AD_ERROR, {
                                err_code: "None",
                                err_msg: t && t.errMsg ? t.errMsg : JSON.stringify(t),
                                ad_unit_id: e
                            });
                        }), t && o.show().catch(function(e) {
                            console.error("[AD] 广告show失败", e);
                        }), this.bannerAds.push({
                            id: e,
                            ad: o
                        });
                    }
                }
            }, e.prototype.showBannerAd = function(e) {
                if (this.canWeUse) {
                    var t = this.getBannerAd(e);
                    if (!t) throw new Error("未创建广告时显示");
                    t.show().catch(function(e) {
                        console.error("[AD] 广告show失败", e);
                    });
                }
            }, e.prototype.hideBannerAd = function(e) {
                if (this.canWeUse) {
                    var t = this.getBannerAd(e);
                    if (!t) throw new Error("未创建广告时隐藏");
                    t.hide();
                }
            }, e.prototype.getBannerAd = function(e) {
                for (var t = 0; t < this.bannerAds.length; t++) {
                    var o = this.bannerAds[t];
                    if (o && o.id === e) return o.ad;
                }
            }, e;
        }();
        o.default = s, cc._RF.pop();
    }, {
        "../Libs/babybus/babybusUtils": "babybusUtils",
        "../Libs/babybus/dataAnalysis/reporter": "reporter",
        "../Libs/babybus/network/systemInfo": "systemInfo",
        "./Config/DataAnalysisConfig": "DataAnalysisConfig"
    } ],
    AddTomine: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "bc704IjFvxOMaT/VeQ/+m8H", "AddTomine"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../../Libs/babybus/dataAnalysis/reporter"), i = e("../../Libs/babybus/network/systemInfo"), n = e("../Config/DataAnalysisConfig"), a = cc._decorator, s = a.ccclass, c = (a.property, 
        n.default.eventNames), u = function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this;
            }
            return __extends(t, e), t.prototype.start = function() {
                if (this.node.active = !1, cc.sys.platform === cc.sys.WECHAT_GAME) {
                    var e = i.default.getInstance(), t = cc.winSize.width / e.windowWidth;
                    r.default.getInstance().reportAnalytics(c.WECHAT_VERSION, {
                        version: e.version,
                        sdk_version: e.SDKVersion
                    });
                    try {
                        var o = void 0;
                        "function" == typeof wx.getMenuButtonBoundingClientRect && (o = wx.getMenuButtonBoundingClientRect());
                        var n = void 0;
                        n = o && 0 !== o.left && 0 !== o.top ? {
                            width: o.width * t,
                            height: o.height * t,
                            right: cc.winSize.width - o.right * t,
                            top: o.top * t
                        } : "android" === e.platform.toLocaleLowerCase() ? {
                            width: 96 * t,
                            height: 32 * t,
                            right: 19 * t,
                            top: (16 + (e.statusBarHeight >= 40 ? e.statusBarHeight : 0)) * t
                        } : {
                            width: 87 * t,
                            height: 32 * t,
                            right: 10 * t,
                            top: (10 + (e.statusBarHeight >= 40 ? e.statusBarHeight : 0)) * t
                        };
                        var a = this.node.getComponent(cc.Widget);
                        a.top = n.top + (n.height - this.node.height) / 2, a.right = n.right + n.width, 
                        this.node.active = !0;
                    } catch (t) {
                        r.default.getInstance().reportAnalytics(c.GET_MENU_POSITION_FAILED, {
                            error: JSON.stringify(t),
                            sdk_version: e.SDKVersion,
                            wx_version: e.version,
                            system: e.system,
                            model: e.model
                        });
                    }
                    "6.6.7" !== e.version && "6.7.0" !== e.version || r.default.getInstance().reportAnalytics(c.SPECIAL_VERSION_SUCCESS, {
                        version: e.version,
                        sdk_version: e.SDKVersion,
                        model: e.model
                    });
                }
            }, t = __decorate([ s ], t);
        }(cc.Component);
        o.default = u, cc._RF.pop();
    }, {
        "../../Libs/babybus/dataAnalysis/reporter": "reporter",
        "../../Libs/babybus/network/systemInfo": "systemInfo",
        "../Config/DataAnalysisConfig": "DataAnalysisConfig"
    } ],
    AppConfig: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "1ad25ssXZJJj7Y4CdnN98z/", "AppConfig"), Object.defineProperty(o, "__esModule", {
            value: !0
        }), o.default = {
            appName: "奇奇连连看",
            wxAppId: "wxe677cbe5639a8212",
            versionName: "1.1.12",
            versionCode: 22,
            whiteList: [ "wxde9ed62a5d2ffe71", "wxc7d26d9137c2e4cc", "wxe4d7f3d8239da7e4", "wx8b42a0aba1ea0372", "wxd82dccd6d6c14c1f", "wx2fc2a7f09d2acb64", "wxbfccfb390a67b775", "wxd162f36f255dbf50", "wxd94a8a624064687d", "wx73aee6b7cfe31a8b" ],
            adId: ""
        }, cc._RF.pop();
    }, {} ],
    App: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "28b83R6vANEEL6dF68zb7LQ", "App"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../Libs/babybus/dataAnalysis/reporter"), i = e("./Config/DataAnalysisConfig"), n = function() {
            function e() {}
            return e.init = function() {
                if (console.log("App.sHasInit:", e.sHasInit), !e.sHasInit) {
                    e.sHasInit = !0, console.debug("应用初始化");
                    var t = r.default.getInstance();
                    i.default.tdConfig && cc.sys.platform === cc.sys.WECHAT_GAME && window.GameGlobal && (console.debug("[APP] 需要上报到TD"), 
                    t.addDelegator(new r.TalkingDataAdapter())), cc.sys.platform === cc.sys.WECHAT_GAME && wx && (console.log("运行wx"), 
                    wx.setKeepScreenOn({
                        keepScreenOn: !0
                    }), "function" == typeof wx.setInnerAudioOption && wx.setInnerAudioOption({
                        obeyMuteSwitch: !1
                    }), "function" == typeof wx.onAudioInterruptionEnd && (wx.onAudioInterruptionBegin(function() {
                        console.debug("音频中断开始"), wx.showToast({
                            title: "音频被系统中断",
                            icon: "none"
                        });
                    }), wx.onAudioInterruptionEnd(function() {
                        console.debug("音频中断结束"), cc.audioEngine.pauseMusic(), cc.audioEngine.resumeMusic();
                    })), cc.game.on(cc.game.EVENT_SHOW, function() {
                        console.debug("切前台，恢复音频"), cc.audioEngine.pauseMusic(), cc.audioEngine.resumeMusic();
                    }, this));
                }
            }, e.sHasInit = !1, e;
        }();
        o.default = n, cc._RF.pop();
    }, {
        "../Libs/babybus/dataAnalysis/reporter": "reporter",
        "./Config/DataAnalysisConfig": "DataAnalysisConfig"
    } ],
    Audio: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "efae3Cs/qhJb69dv3tDTCsY", "Audio"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = r.property, a = e("./GameData"), s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.commonClick = null, t.fail = null, t.success = null, t.bg = null, t.refresh = null, 
                t.disappear = null, t.bomb = null, t;
            }
            return __extends(t, e), t.prototype.onLoad = function() {
                cc.game.addPersistRootNode(this.node);
            }, t.prototype.playSuccess = function() {
                a.default.isOpenEffect && cc.audioEngine.playEffect(this.success, !1);
            }, t.prototype.playCommonClick = function() {
                a.default.isOpenEffect && cc.audioEngine.playEffect(this.commonClick, !1);
            }, t.prototype.playFail = function() {
                a.default.isOpenEffect && cc.audioEngine.playEffect(this.fail, !1);
            }, t.prototype.playDisappear = function() {
                a.default.isOpenEffect && cc.audioEngine.playEffect(this.disappear, !1);
            }, t.prototype.playRefresh = function() {
                a.default.isOpenEffect && cc.audioEngine.playEffect(this.refresh, !1);
            }, t.prototype.playBomb = function() {
                a.default.isOpenEffect && cc.audioEngine.playEffect(this.bomb, !1);
            }, t.prototype.playBg = function() {
                console.log(a.default.bgAudioID), null == a.default.bgAudioID && (a.default.bgAudioID = cc.audioEngine.playMusic(this.bg, !0));
            }, t.prototype.stopBg = function() {
                cc.audioEngine.stopMusic(), a.default.bgAudioID = null;
            }, t.prototype.resumeBg = function() {
                console.log("resumeMusic"), cc.audioEngine.resumeMusic();
            }, t.prototype.pauseBg = function() {
                console.log("暂停"), cc.audioEngine.pauseMusic();
            }, t.prototype.setBgVolume = function(e) {
                cc.audioEngine.setMusicVolume(e), console.log("设置背景音乐声音", cc.audioEngine.getMusicVolume());
            }, t.prototype.setEffectsVolume = function(e) {}, __decorate([ n({
                type: cc.AudioClip
            }) ], t.prototype, "commonClick", void 0), __decorate([ n({
                type: cc.AudioClip
            }) ], t.prototype, "fail", void 0), __decorate([ n({
                type: cc.AudioClip
            }) ], t.prototype, "success", void 0), __decorate([ n({
                type: cc.AudioClip
            }) ], t.prototype, "bg", void 0), __decorate([ n({
                type: cc.AudioClip
            }) ], t.prototype, "refresh", void 0), __decorate([ n({
                type: cc.AudioClip
            }) ], t.prototype, "disappear", void 0), __decorate([ n({
                type: cc.AudioClip
            }) ], t.prototype, "bomb", void 0), t = __decorate([ i ], t);
        }(cc.Component);
        o.default = s, cc._RF.pop();
    }, {
        "./GameData": "GameData"
    } ],
    AutoScrollHelper: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "6803fTy9glFa7ocKEtRg6vg", "AutoScrollHelper"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = r.property, a = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.scrollView = null, t.speed = 50, t.delay = 3, t.support = !1, t.prevPosition = 0, 
                t.scrollToEnd = !0, t.autoScrollAction = null, t;
            }
            return __extends(t, e), t.prototype.onLoad = function() {
                if ((this.scrollView.vertical || this.scrollView.horizontal) && (this.support = this.scrollView.vertical !== this.scrollView.horizontal, 
                this.support)) {
                    var e = new cc.Component.EventHandler();
                    e.target = this.node, e.component = "AutoScrollHelper", e.handler = "processScrollEvent", 
                    this.scrollView.scrollEvents.push(e);
                }
            }, t.prototype.startAutoScrolling = function() {
                var e = this;
                if (this.support && !this.autoScrollAction) {
                    var t, o, r, i, n, a = this.scrollView, s = this.scrollView.getMaxScrollOffset();
                    if (a.horizontal ? (t = s.x, o = t / this.speed, r = -a.getScrollOffset().x, i = cc.callFunc(function() {
                        console.debug("[AutoScrollHelper] 往右走，时长", o), a.scrollToRight(o, !1);
                    }), n = cc.callFunc(function() {
                        console.debug("[AutoScrollHelper] 往左走，时长", o), a.scrollToLeft(o, !1);
                    })) : (t = s.y, o = t / this.speed, r = a.getScrollOffset().y, i = cc.callFunc(function() {
                        console.debug("[AutoScrollHelper] 往下走，时长", o), a.scrollToBottom(o, !1);
                    }), n = cc.callFunc(function() {
                        console.debug("[AutoScrollHelper] 往上走，时长", o), a.scrollToTop(o, !1);
                    })), console.debug("[AutoScrollHelper] 当前位置", r, "最大位置", t), this.scrollToEnd) {
                        console.debug("[AutoScrollHelper] 开始自动滚动，往大了先走"), (u = []).push(cc.delayTime(this.delay));
                        var c = (t - r) / this.speed;
                        if (c > 0) {
                            d = a.horizontal ? cc.callFunc(function() {
                                console.debug("[AutoScrollHelper] 先往右走，时长", c), a.scrollToRight(c, !1);
                            }) : cc.callFunc(function() {
                                console.debug("[AutoScrollHelper] 先往下走，时长", c), a.scrollToBottom(c, !1);
                            });
                            u.push(d, cc.delayTime(c));
                        } else console.debug("[AutoScrollHelper] 到边缘，直接开始正常循环");
                        u.push(cc.callFunc(function() {
                            if (e.autoScrollAction) {
                                if (!e.autoScrollAction.isDone()) return void console.error("[AutoScrollHelper] 循环开始准备时动作未结束，不启动");
                                console.debug("[AutoScrollHelper] 正常循环开始"), e.autoScrollAction = a.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(e.delay), n, cc.delayTime(o + e.delay), i, cc.delayTime(o))));
                            } else console.debug("[AutoScrollHelper] 开始正常循环时动作已无效");
                        })), this.autoScrollAction = a.node.runAction(cc.sequence(u));
                    } else {
                        var u;
                        console.debug("[AutoScrollHelper] 开始自动滚动，往小了先走"), (u = []).push(cc.delayTime(this.delay));
                        var l = r / this.speed;
                        if (l > 0) {
                            var d = a.horizontal ? cc.callFunc(function() {
                                console.debug("[AutoScrollHelper] 先往左走，时长", l), a.scrollToLeft(l, !1);
                            }) : cc.callFunc(function() {
                                console.debug("[AutoScrollHelper] 先往上走，时长", l), a.scrollToTop(l, !1);
                            });
                            u.push(d, cc.delayTime(l));
                        } else console.debug("[AutoScrollHelper] 到边缘，直接开始正常循环");
                        u.push(cc.callFunc(function() {
                            if (e.autoScrollAction) {
                                if (!e.autoScrollAction.isDone()) return void console.error("[AutoScrollHelper] 循环开始准备时动作未结束，不启动");
                                console.debug("[AutoScrollHelper] 正常循环开始"), e.autoScrollAction = a.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(e.delay), i, cc.delayTime(o + e.delay), n, cc.delayTime(o))));
                            } else console.debug("[AutoScrollHelper] 开始正常循环时动作已无效");
                        })), this.autoScrollAction = a.node.runAction(cc.sequence(u));
                    }
                } else console.debug("[AutoScrollHelper] 不支持开始");
            }, t.prototype.stopAutoScrolling = function() {
                this.support && (this.autoScrollAction ? (console.debug("[AutoScrollHelper] 停止自动滚动"), 
                this.scrollView.node.stopAction(this.autoScrollAction), this.autoScrollAction = null) : console.debug("[AutoScrollHelper] 不支持结束"));
            }, t.prototype.processScrollEvent = function(e, t) {
                if (this.support) {
                    var o = this.scrollView.horizontal ? -this.scrollView.getScrollOffset().x : this.scrollView.getScrollOffset().y;
                    switch (this.prevPosition !== o && (this.scrollToEnd = this.prevPosition < o, this.prevPosition = o), 
                    t) {
                      case cc.ScrollView.EventType.SCROLLING:
                        break;

                      case cc.ScrollView.EventType.SCROLL_ENDED:
                        this.autoScrollAction ? console.debug("[AutoScrollHelper] 滚动结束，仍处于自动滚动中，不处理") : (console.debug("[AutoScrollHelper] 滚动结束，启动自动滚动"), 
                        this.startAutoScrolling());
                        break;

                      case cc.ScrollView.EventType.SCROLL_BEGAN:
                        this.autoScrollAction ? (console.debug("[AutoScrollHelper] 滚动开始，处于自动滚动过程中"), this.stopAutoScrolling()) : console.debug("[AutoScrollHelper] 滚动开始，不在自动滚动过程中");
                    }
                }
            }, __decorate([ n(cc.ScrollView) ], t.prototype, "scrollView", void 0), __decorate([ n({
                displayName: "每秒移动像素数",
                min: 1
            }) ], t.prototype, "speed", void 0), __decorate([ n({
                displayName: "自动滚动触发延迟（秒）",
                min: 0
            }) ], t.prototype, "delay", void 0), t = __decorate([ i ], t);
        }(cc.Component);
        o.default = a, cc._RF.pop();
    }, {} ],
    BabybusNavigator: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "74036mLpiNPareKodNa9FAz", "BabybusNavigator"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../../Libs/babybus/babybusUtils"), i = e("../../Libs/babybus/dataAnalysis/reporter"), n = e("../../Libs/babybus/network/ajax"), a = e("../../Libs/babybus/network/signature"), s = e("../../Libs/babybus/network/userAgent"), c = e("../../Script/Config/AppConfig"), u = cc._decorator, l = u.ccclass, d = u.property, p = "babybus_navigator_unique_key", f = "nav_result", h = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.clickAudio = null, t.adId = void 0, t;
            }
            var o;
            return __extends(t, e), o = t, t.getAjax = function() {
                if (!o.sAjax) {
                    var e = c.default.productId || 3642, t = c.default.signKey || "VR1BtITxk1oNSh4nQUVdlKUgJTg4sQOp", r = c.default.xxTeaKey || "TVYo5XPpl7ckK4MfCmCkCsR88hqilrDG", i = c.default.versionCode || 1, u = c.default.versionName || 1, l = new a.default(t, r), d = new s.default({
                        ProductID: e,
                        VerID: i,
                        VerCode: u,
                        ProjectID: 15
                    });
                    o.sAjax = new n.default(l, d);
                }
                return o.sAjax;
            }, t.supportNavigate = function() {
                return cc.sys.platform === cc.sys.WECHAT_GAME && "function" == typeof wx.navigateToMiniProgram;
            }, t.prototype.onLoad = function() {
                o.sUuid || (o.sUuid = r.StorageAdapter.getStorageSync(p), o.sUuid || (o.sUuid = r.uuid(), 
                r.StorageAdapter.setStorage({
                    key: p,
                    data: o.sUuid
                })));
            }, t.prototype.init = function(e, t, o, r, i, n, a) {
                void 0 === r && (r = 0), void 0 === i && (i = !1), void 0 === n && (n = !1), void 0 === a && (a = void 0), 
                this.targetAppId = e, this.path = t, this.position = o, this.index = r, this.reportToThird = i, 
                this.needCallbackEvent = n, this.adId = a;
            }, t.prototype.onClick = function(e) {
                var t = this;
                this.targetAppId ? (this.playAudio(), window.wx ? "function" == typeof wx.navigateToMiniProgram ? wx.navigateToMiniProgram({
                    appId: this.targetAppId,
                    path: this.path,
                    success: function() {
                        if (console.debug("[BN] 跳转成功", t.targetAppId), e && e.success) try {
                            e.success({
                                targetAppId: t.targetAppId
                            });
                        } catch (e) {
                            console.error("[BN] 跳转成功回调执行异常");
                        } else if (t.needCallbackEvent) {
                            var o = new cc.Event.EventCustom("navigate-success", !0);
                            o.detail = {
                                targetAppId: t.targetAppId
                            }, t.node.dispatchEvent(o);
                        }
                        t.report(!0);
                    },
                    fail: function(o) {
                        if (console.error("[BN] 跳转失败", t.targetAppId, o), e && e.fail) try {
                            e.fail({
                                targetAppId: t.targetAppId,
                                error: o
                            });
                        } catch (e) {
                            console.error("[BN] 跳转失败回调执行异常");
                        } else if (t.needCallbackEvent) {
                            var r = new cc.Event.EventCustom("navigate-fail", !0);
                            r.detail = {
                                targetAppId: t.targetAppId,
                                error: o
                            }, t.node.dispatchEvent(r);
                        }
                        t.report(!1);
                    },
                    complete: function() {
                        if (console.debug("[BN] 跳转调用完毕", t.targetAppId), e && e.complete) try {
                            e.complete({
                                targetAppId: t.targetAppId
                            });
                        } catch (e) {
                            console.error("[BN] 跳转完毕回调执行异常");
                        } else if (t.needCallbackEvent) {
                            var o = new cc.Event.EventCustom("navigate-complete", !0);
                            o.detail = {
                                targetAppId: t.targetAppId
                            }, t.node.dispatchEvent(o);
                        }
                    }
                }) : (console.warn("微信版本太低，不支持跳转"), "function" == typeof wx.showToast && wx.showToast({
                    title: "您的微信版本太低，无法跳转，请升级到最新版",
                    icon: "none"
                })) : console.warn("非微信平台，不支持跳转")) : console.error("[BN] 无有效目标AppId，不跳转");
            }, t.prototype.playAudio = function() {
                this.clickAudio && cc.audioEngine.playEffect(this.clickAudio, !1);
            }, t.prototype.report = function(e) {
                if (this.targetAppId) {
                    var t = {
                        OpenID: o.sUuid,
                        FromAppID: c.default.wxAppId,
                        TargetAppID: this.targetAppId,
                        TargetPage: this.path,
                        ReprotIndex: this.position,
                        ContentIndex: this.index > 0 ? this.index : void 0,
                        CreateStamp: Math.floor(Date.now() / 1e3),
                        TargetStatus: e ? 1 : 0,
                        ADID: this.adId
                    };
                    o.getAjax().post("https://spg.kidvideo.cn/Record/Index/FlowStat", t).then(function() {
                        console.debug("[BN] 跳转上报成功", t);
                    }).catch(function(e) {
                        console.error("[BN] 跳转上报失败", t, e);
                    }), this.reportToThird && i.default.getInstance().reportAnalytics(f, {
                        target: t.TargetAppID,
                        container: t.ReprotIndex,
                        index: t.ContentIndex,
                        success: t.TargetStatus
                    });
                } else console.warn("[BN] 无有效目标AppId，不上报");
            }, __decorate([ d({
                type: cc.AudioClip,
                displayName: "点击音效"
            }) ], t.prototype, "clickAudio", void 0), t = o = __decorate([ l ], t);
        }(cc.Component);
        o.default = h, cc._RF.pop();
    }, {
        "../../Libs/babybus/babybusUtils": "babybusUtils",
        "../../Libs/babybus/dataAnalysis/reporter": "reporter",
        "../../Libs/babybus/network/ajax": "ajax",
        "../../Libs/babybus/network/signature": "signature",
        "../../Libs/babybus/network/userAgent": "userAgent",
        "../../Script/Config/AppConfig": "AppConfig"
    } ],
    Back: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "7a049NHVMNJ7pMFWXOdqlwy", "Back"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = (r.property, function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this;
            }
            return __extends(t, e), t.prototype.backToWelcome = function() {
                cc.director.loadScene("Welcome");
            }, t = __decorate([ i ], t);
        }(cc.Component));
        o.default = n, cc._RF.pop();
    }, {} ],
    BgMusic: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "7784dCpP2NKhYjEE5ukoCJo", "BgMusic"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../Game/GameData"), i = cc._decorator, n = i.ccclass, a = i.property, s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.BgMusicImg = [], t;
            }
            return __extends(t, e), t.prototype.start = function() {
                this.setBgMusicImg();
            }, t.prototype.setBgMusicImg = function() {
                r.default.isOpenBgMusic ? this.node.getComponent(cc.Sprite).spriteFrame = this.BgMusicImg[0] : this.node.getComponent(cc.Sprite).spriteFrame = this.BgMusicImg[1];
            }, t.prototype.controlEffect = function() {
                console.log("GameData.isOpenBgMusic:", r.default.isOpenBgMusic), r.default.isOpenBgMusic ? (r.default.isOpenBgMusic = !1, 
                this.setBgMusicImg(), this.node.getComponent("Audio").stopBg()) : (r.default.isOpenBgMusic = !0, 
                this.setBgMusicImg(), this.node.getComponent("Audio").playBg());
            }, __decorate([ a(cc.SpriteFrame) ], t.prototype, "BgMusicImg", void 0), t = __decorate([ n ], t);
        }(cc.Component);
        o.default = s, cc._RF.pop();
    }, {
        "../Game/GameData": "GameData"
    } ],
    Comb: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "ff6caXsR+REGJjkLDmsTcME", "Comb"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = r.property, a = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.numImg = [], t.bigNumNode = null, t.smallNumNode = null, t.bigNum = 0, 
                t.smallNum = 0, t.num = 0, t;
            }
            return __extends(t, e), t.prototype.start = function() {
                this.addThisNode(), this.node.opacity = 0;
            }, t.prototype.addThisNode = function() {
                this.node.scale = .8;
                var e = cc.scaleTo(.2, .5);
                this.node.runAction(e);
            }, t.prototype.setNum = function(e) {
                var t = cc.sequence(cc.scaleTo(.05, 1.5), cc.scaleTo(.05, 1)), o = cc.sequence(cc.scaleTo(.05, 1.5), cc.scaleTo(.05, 1)), r = cc.sequence(cc.delayTime(1.4), cc.fadeTo(.5, 0));
                this.node.stopAllActions(), this.node.opacity = 255, this.bigNum != Math.floor(e / 10) && (this.bigNum = Math.floor(e / 10), 
                this.bigNumNode.scale = .3, this.bigNumNode.getComponent(cc.Sprite).spriteFrame = this.numImg[Math.floor(e / 10)], 
                this.bigNumNode.runAction(o)), this.smallNum != e % 10 && (this.smallNum = e % 10, 
                this.smallNumNode.scale = .3, this.smallNumNode.getComponent(cc.Sprite).spriteFrame = this.numImg[Math.floor(e % 10)], 
                this.smallNumNode.runAction(t)), this.node.runAction(r);
            }, t.prototype.addNum = function() {
                this.num = this.num + 1, this.setNum(this.num);
            }, __decorate([ n({
                type: cc.SpriteFrame,
                displayName: "数字图片"
            }) ], t.prototype, "numImg", void 0), __decorate([ n({
                type: cc.Node,
                displayName: "十位数字"
            }) ], t.prototype, "bigNumNode", void 0), __decorate([ n({
                type: cc.Node,
                displayName: "个位数字"
            }) ], t.prototype, "smallNumNode", void 0), t = __decorate([ i ], t);
        }(cc.Component);
        o.default = a, cc._RF.pop();
    }, {} ],
    CommonNav: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "3d328JMF61C/p9PiPMViYNg", "CommonNav"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../../Libs/babybus/network/systemInfo"), i = e("../navigator/BabybusNavigator"), n = e("../Navigator/NavService"), a = e("./AutoScrollHelper"), s = cc._decorator, c = s.ccclass, u = s.property, l = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.content = null, t.navigatorPrefab = null, t.hotIcon = null, t.newIcon = null, 
                t.spacing = 0, t.widthSet = !1, t.textures = [], t;
            }
            return __extends(t, e), t.prototype.onLoad = function() {
                r.default.getInstance().isIphoneX() && (this.node.getComponent(cc.Widget).bottom = 54), 
                this.requestNavData();
            }, t.prototype.requestNavData = function() {
                var e = this;
                n.default.getInstance().getNavData(n.FlowType.IndexBottom).then(function(t) {
                    e.isValid && e.processNavResult(t);
                }).catch(function(e) {
                    console.error("[CommonNav] 获取导航配置失败", e);
                });
            }, t.prototype.processNavResult = function(e) {
                var t = this;
                console.debug("[CommonNav] 开始处理导航配置数据"), Array.isArray(e) && e.length > 0 ? ((e = e.filter(function(e) {
                    return e.animLogo && e.animLogo.length > 0;
                })).forEach(function(o, r) {
                    var s = [], c = [];
                    o.animLogo.forEach(function(u, l) {
                        cc.loader.load(u, function(u, d) {
                            if (u) console.error("[CommonNav] 图片加载失败", o.logo, u); else {
                                if (!(d instanceof cc.Texture2D)) return console.error("[CommonNav] 图片加载失败，类型错误", typeof d, o.logo), 
                                void cc.loader.release(d);
                                if (!t.isValid) return console.error("[CommonNav] 图片加载完毕，但组件已销毁"), void cc.loader.release(d);
                                if (s[l] = d, c[l] = new cc.SpriteFrame(d), s.length === o.animLogo.length) {
                                    for (var p = 0; p < s.length; p++) if (!s[p]) return;
                                    console.debug("[CommonNav] 图片加载完毕", o.name);
                                    var f = cc.instantiate(t.navigatorPrefab);
                                    f.getComponent(i.default).init(o.appId, o.path, n.FlowType.IndexBottom, r + 1, !0, !1);
                                    var h = f.getChildByName("mask").getChildByName("icon").getComponent(cc.Sprite);
                                    if (h.spriteFrame = c[0], o.animLogo.length > 1 && (console.debug("需要切换", o.name, JSON.stringify(o.animLogo)), 
                                    h.schedule(function() {
                                        var e = t.textures[r];
                                        if (t.isValid && h.isValid) {
                                            var i = (e.imageIndex + 1) % e.spriteFrames.length;
                                            s[i] && (h.spriteFrame = c[i], e.imageIndex = i, console.debug("切换", o.name, i));
                                        } else console.debug("已销毁", o.name);
                                    }, 1)), o.isNew) (g = f.getChildByName("badge")).active = !0, g.getComponent(cc.Sprite).spriteFrame = t.newIcon; else if (o.isHot) {
                                        var g;
                                        (g = f.getChildByName("badge")).active = !0, g.getComponent(cc.Sprite).spriteFrame = t.hotIcon;
                                    }
                                    if (f.setPosition(t.spacing * (r + 1) + f.width * (.5 + r), 0), t.content.addChild(f), 
                                    !t.widthSet) {
                                        t.content.width = e.length * (f.width + t.spacing) + t.spacing, t.widthSet = !0, 
                                        console.debug("[CommonNav] 导航容器宽度", t.content.width);
                                        var m = t.node.getComponent(a.default);
                                        m ? m.startAutoScrolling() : console.warn("[CommonNav] 未配置自动滚动辅助类");
                                    }
                                }
                            }
                        });
                    }), t.textures[r] = {
                        imageIndex: 0,
                        textures: s,
                        spriteFrames: c
                    };
                }), console.debug("[CommonNav] 导航配置数据处理完毕")) : console.error("[CommonNav] 服务端没数据返回");
            }, t.prototype.onDestroy = function() {
                console.debug("[CommonNav] 销毁");
                for (var e = 0; e < this.textures.length; e++) {
                    var t = this.textures[e].textures;
                    if (t && t.length > 0) for (var o = 0; o < t.length; o++) t[o] && cc.loader.releaseAsset(t[o]), 
                    t[o] = void 0;
                }
            }, __decorate([ u(cc.Node) ], t.prototype, "content", void 0), __decorate([ u(cc.Prefab) ], t.prototype, "navigatorPrefab", void 0), 
            __decorate([ u({
                type: cc.SpriteFrame,
                displayName: "热门图标"
            }) ], t.prototype, "hotIcon", void 0), __decorate([ u({
                type: cc.SpriteFrame,
                displayName: "新品图标"
            }) ], t.prototype, "newIcon", void 0), __decorate([ u({
                displayName: "水平间距"
            }) ], t.prototype, "spacing", void 0), t = __decorate([ c ], t);
        }(cc.Component);
        o.default = l, cc._RF.pop();
    }, {
        "../../Libs/babybus/network/systemInfo": "systemInfo",
        "../Navigator/NavService": "NavService",
        "../navigator/BabybusNavigator": "BabybusNavigator",
        "./AutoScrollHelper": "AutoScrollHelper"
    } ],
    CookieStore: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "657b4plmhFKt7Bn/7oGZYvn", "CookieStore"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./Cookie"), i = e("./set-cookie"), n = e("./util"), a = function() {
            function e() {
                this.data = {};
            }
            return e.prototype.has = function(e) {
                return e in this.data;
            }, e.prototype.get = function(e) {
                return this.data[e];
            }, e.prototype.set = function(e, t) {
                this.data[e] = t;
            }, e.prototype.delete = function(e) {
                return !!this.has(e) && (delete this.data[e], !0);
            }, e.prototype.clear = function() {
                this.data = {};
            }, e.prototype.keys = function() {
                return Object.keys(this.data);
            }, e.prototype.values = function() {
                var e = [];
                for (var t in this.data) this.data.hasOwnProperty(t) && e.push(this.data[t]);
                return e;
            }, e;
        }(), s = function() {
            function e() {
                this.__storageKey = "__cookie_store__", this.__cookiesMap = this.__readFromStorage();
            }
            return e.prototype.has = function(e, t, o) {
                return void 0 !== this.getCookie(e, t, o);
            }, e.prototype.get = function(e, t, o) {
                void 0 === e && (e = ""), void 0 === t && (t = ""), void 0 === o && (o = "/");
                var r = this.getCookie(e, t, o);
                return r ? r.value : void 0;
            }, e.prototype.set = function(e, t, o) {
                void 0 === e && (e = ""), void 0 === t && (t = ""), void 0 === o && (o = {});
                var i = o.domain;
                if (!i || !e) throw new Error("name 和 options.domain 值不正确！");
                var n = new r.default(Object.assign(o, {
                    name: e,
                    value: t
                })), s = this.__cookiesMap.get(i) || new a();
                return s.set(e, n), this.__cookiesMap.set(i, s), this.__saveToStorage(), n;
            }, e.prototype.dir = function() {
                var e = this, t = {};
                return this.__cookiesMap.keys().forEach(function(o) {
                    t[o] = e.getCookies(o);
                }), t;
            }, e.prototype.remove = function(e, t) {
                if (void 0 === e && (e = ""), void 0 === t && (t = ""), t) {
                    var o = this.__cookiesMap.get(t);
                    o && o.delete(e);
                } else this.__cookiesMap.values().forEach(function(t) {
                    t.delete(e);
                });
                return this.__saveToStorage(), !0;
            }, e.prototype.getCookie = function(e, t, o) {
                var r;
                void 0 === e && (e = ""), void 0 === t && (t = ""), void 0 === o && (o = "/");
                for (var i = n.default.getCookieScopeDomain(t), a = this.__cookiesMap.keys(), s = 0; s < a.length; s++) {
                    var c = a[s], u = this.__cookiesMap.get(c);
                    if (!(t && i.indexOf(c) < 0)) {
                        if ((r = u.get(e)) && r.isInPath(o) && !r.isExpired()) break;
                        r = void 0;
                    }
                }
                return r;
            }, e.prototype.getCookies = function(e, t) {
                var o = {};
                return this.getCookiesArray(e, t).forEach(function(e) {
                    o[e.name] = e.value;
                }), o;
            }, e.prototype.getCookiesArray = function(e, t) {
                void 0 === e && (e = ""), void 0 === t && (t = "/");
                for (var o = [], r = n.default.getCookieScopeDomain(e), i = this.__cookiesMap.keys(), a = 0; a < i.length; a++) {
                    var s = i[a], c = this.__cookiesMap.get(s);
                    e && r.indexOf(s) < 0 || c.values().forEach(function(e) {
                        e.isInPath(t) && !e.isExpired() && o.push(e);
                    });
                }
                return o;
            }, e.prototype.setCookiesArray = function(e) {
                var t = this;
                return void 0 === e && (e = []), this.__cookiesMap = this.__cookiesMap || new a(), 
                e.forEach(function(e) {
                    var o = t.__cookiesMap.get(e.domain);
                    o || (o = new a(), t.__cookiesMap.set(e.domain, o)), o.set(e.name, e);
                }), this.__saveToStorage(), this.__cookiesMap;
            }, e.prototype.clearCookies = function(e) {
                if (e) {
                    var t = this.__cookiesMap.get(e);
                    t && t.clear();
                } else this.__cookiesMap.clear();
                return this.__saveToStorage(), !0;
            }, e.prototype.getRequestCookies = function(e, t) {
                var o = this.getCookiesArray(e, t);
                return this.stringify(o);
            }, e.prototype.setResponseCookies = function(e, t) {
                var o = this.parse(e, t);
                return this.setCookiesArray(o);
            }, e.prototype.parse = function(e, t) {
                return void 0 === e && (e = ""), i.default.parse(i.default.splitCookiesString(e)).map(function(e) {
                    return e.domain || (e.domain = t), new r.default(e);
                });
            }, e.prototype.stringify = function(e) {
                return e.map(function(e) {
                    return e.toString();
                }).join("; ");
            }, e.prototype.__saveToStorage = function() {
                var e = [];
                this.__cookiesMap.values().forEach(function(t) {
                    t.values().forEach(function(o) {
                        o.isExpired() ? t.delete(o.name) : o.isPersistence() && e.push(o);
                    });
                }), localStorage.setItem(this.__storageKey, JSON.stringify(e));
            }, e.prototype.__readFromStorage = function() {
                var e = JSON.parse(localStorage.getItem(this.__storageKey) || "[]");
                return e = e.map(function(e) {
                    return new r.default(e);
                }), this.setCookiesArray(e);
            }, e;
        }();
        o.default = s, cc._RF.pop();
    }, {
        "./Cookie": "Cookie",
        "./set-cookie": "set-cookie",
        "./util": "util"
    } ],
    Cookie: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "473d7tKGWBO+qnxM4iRnl21", "Cookie"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./set-cookie"), i = e("./util"), n = function() {
            function e(e) {
                this.name = e.name || "", this.value = e.value || "", this.domain = e.domain || "", 
                this.path = e.path || "/", this.expires = e.expires ? new Date(e.expires) : null, 
                this.maxAge = e.maxAge ? parseInt(e.maxAge) : null, this.httpOnly = !!e.httpOnly, 
                this.dateTime = e.dateTime ? new Date(e.dateTime) : new Date();
            }
            return e.prototype.set = function(e) {
                void 0 === e && (e = "");
                var t = r.default.parse(e)[0];
                return t && (Object.assign(this, t), this.dateTime = new Date()), this;
            }, e.prototype.isExpired = function() {
                return 0 === this.maxAge || (this.maxAge > 0 ? (Date.now() - this.dateTime.getTime()) / 1e3 > this.maxAge : !!(this.expires && this.expires < new Date()));
            }, e.prototype.isPersistence = function() {
                return !this.maxAge || this.maxAge > 0;
            }, e.prototype.isInDomain = function(e) {
                return i.default.getCookieScopeDomain(e).indexOf(this.domain) >= 0;
            }, e.prototype.isInPath = function(e) {
                return 0 === e.indexOf(this.path) || this.path.replace(/\/$/, "") === e;
            }, e.prototype.toString = function() {
                return [ this.name, this.value ].join("=");
            }, e;
        }();
        o.default = n, cc._RF.pop();
    }, {
        "./set-cookie": "set-cookie",
        "./util": "util"
    } ],
    DataAnalysisConfig: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "7ea58psG4hPs6IU9JA7E8FH", "DataAnalysisConfig"), Object.defineProperty(o, "__esModule", {
            value: !0
        }), o.default = {
            tdConfig: {
                appkey: "024393431B82499DB69CB3755D150E6C"
            },
            eventNames: {
                GET_MENU_POSITION_FAILED: "get_menu_position_failed",
                BANNER_AD_ERROR: "banner_ad_error",
                BANNER_AD_LOAD_FAIL: "banner_ad_load_fail",
                VIDEO_AD_ERROR: "video_ad_error",
                VIDEO_AD_LOAD_MAX: "video_ad_load_max",
                VIDEO_AD_LOAD_FAIL: "video_ad_load_fail",
                VIDEO_AD_SHOW_FAIL: "video_ad_show_fail",
                VIDEO_AD_RESULT: "video_ad_result",
                SHARE_RESULT: "share_result",
                AUDIO_DATA_STAT: "audio_data_stat",
                WECHAT_VERSION: "wechat_version",
                SPECIAL_VERSION_SUCCESS: "special_version_success",
                WELCOME_LOADED: "welcome_loaded",
                CLICK_BEGIN: "click_begin",
                SHOW_STORAGE_CHOOSE: "show_storage_choose",
                RESTART_GAME: "again_game",
                RESTORE_GAME: "go_on_game",
                DIRECT_ENTER: "direct_enter",
                GOTO_GAME_FROM_WELCOME: "goto_game_from_welcome",
                GAME_LOADED: "game_loaded",
                GAME_BACK: "game_back",
                USE_ITEMS: "use_items",
                CANCEL_USE_ITEMS: "cancel_items",
                GET_ITEMS_SHADOW_SHOW: "get_items_shadowshow",
                GET_ITEMS_SHARE: "get_items_share",
                GET_ITEMS_WATCH: "get_items_watch",
                GET_ITEMS_SHARE_AFTER_WATCH_FAIL: "get_items_share_after_watch_fail",
                GET_ITEMS_SUCCESS: "get_items_success",
                GET_ITEMS_ABORT: "get_items_abort",
                PASS_GAME: "pass_game",
                PASS_DIRECT_GET: "pass_direct_get",
                PASS_SHARE_GET: "pass_share_get",
                PASS_WATCH_GET: "pass_watch_get",
                PASS_SHARE_AFTER_WATCH_FAIL: "pass_share_after_watch_fail",
                PASS_GOT: "pass_got",
                PASS_DO_NOT_WANT: "pass_do_not_want",
                PASS_SUCCESS: "pass_success",
                FAIL_GAME: "fail_game",
                FAIL_SHARE_REVIVE: "fail_share_revive",
                FAIL_WATCH_REVIVE: "fail_watch_revive",
                FAIL_SHARE_AFTER_WATCH_FAIL: "fail_share_after_watch_fail",
                REVIVE: "revive",
                FAIL_AND_REPLAY: "fail_and_replay",
                FAIL_AND_GO: "fail_and_go"
            }
        }, cc._RF.pop();
    }, {} ],
    DrawLine: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "d67394au7JMdJS/wqrg4O2j", "DrawLine"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = function() {
            function e(e, t, o, r, i) {
                this.SizeX = e, this.SizeY = t, this.spaceX = o, this.spaceY = r, this.linePref = i;
            }
            return e.prototype.midPoint = function(e, t) {
                return cc.v2((e.x + t.x + 1) / 2 - 1, (e.y + t.y + 1) / 2 - 1);
            }, e.prototype.countDistance = function(e, t) {
                return e.x == t.x ? cc.v2(1, (this.SizeY + this.spaceY) * Math.floor(e.y - t.y) / 2) : e.y == t.y ? cc.v2((this.SizeX + this.spaceX) * Math.floor(e.x - t.x) / 2, 1) : void 0;
            }, e.prototype.drawLine = function(e) {
                if (e.length < 2) throw new Error("传入的点数组有问题");
                for (var t = [], o = 0; o < e.length - 1; o++) {
                    var r = e[o], i = e[o + 1], n = cc.instantiate(this.linePref), a = this.midPoint(r, i);
                    n.position = cc.v2(a.x * (this.SizeX + this.spaceX), a.y * (this.SizeY + this.spaceY)), 
                    n.getComponent(cc.ParticleSystem).duration = .3, n.getComponent(cc.ParticleSystem).posVar = this.countDistance(r, i), 
                    t.push(n);
                }
                return t;
            }, e;
        }();
        o.default = r, cc._RF.pop();
    }, {} ],
    Effect: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "88366CtHI5H7JbOIDgJM4rL", "Effect"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../Game/GameData"), i = cc._decorator, n = i.ccclass, a = i.property, s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.effectImg = [], t;
            }
            return __extends(t, e), t.prototype.start = function() {
                this.setEffectImg();
            }, t.prototype.setEffectImg = function() {
                r.default.isOpenEffect ? this.node.getComponent(cc.Sprite).spriteFrame = this.effectImg[0] : this.node.getComponent(cc.Sprite).spriteFrame = this.effectImg[1];
            }, t.prototype.controlEffect = function() {
                r.default.isOpenEffect ? (r.default.isOpenEffect = !1, this.setEffectImg()) : (r.default.isOpenEffect = !0, 
                this.setEffectImg());
            }, __decorate([ a(cc.SpriteFrame) ], t.prototype, "effectImg", void 0), t = __decorate([ n ], t);
        }(cc.Component);
        o.default = s, cc._RF.pop();
    }, {
        "../Game/GameData": "GameData"
    } ],
    GameConfig: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "1dc0eLOsZ9K2oNKyZgfximg", "GameConfig"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./GameData"), i = function() {
            function e() {
                this.per = .75, this.config = [];
                this.mapConfig1 = {
                    col: 8,
                    row: 8,
                    types: 20,
                    sizeX: 103,
                    sizeY: 108,
                    spaceX: -2,
                    spaceY: -6,
                    per: 1
                }, this.mapConfig2 = {
                    col: 12,
                    row: 11,
                    types: 20,
                    sizeX: 103 * this.per,
                    sizeY: 103 * this.per,
                    spaceX: -12 * this.per,
                    spaceY: -8 * this.per,
                    per: this.per
                }, this.mapConfigEndless = {
                    gridType: 2,
                    col: 12,
                    row: 11,
                    types: 10,
                    sizeX: 103 * this.per,
                    sizeY: 103 * this.per,
                    spaceX: -12 * this.per,
                    spaceY: -8 * this.per,
                    per: this.per,
                    grid: [ [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ] ]
                };
            }
            return e.getInstance = function() {
                return e.INSTANCE || (e.INSTANCE = new e(), e.INSTANCE.init()), e.INSTANCE.update(), 
                e.INSTANCE;
            }, e.prototype.init = function() {
                this.config = [ {
                    pass: 1,
                    grid: "[[1,0,0,0,0,1],[0,1,0,0,1,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,1,0,0,1,0],[1,0,0,0,0,1]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 2,
                    grid: "[[1,0,0,0,0,1],[0,1,0,0,1,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,1,0,0,1,0],[1,0,0,0,0,1]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 3,
                    grid: "[[0,1,1,0,1,0],[0,1,1,1,0,1],[1,0,1,0,1,0],[0,1,1,0,1,0],[1,0,1,1,0,1],[0,1,0,1,0,1]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 4,
                    grid: "[[0,1,1,0,1,0],[0,1,1,1,0,1],[1,0,1,0,1,0],[0,1,1,0,1,0],[1,0,1,1,0,1],[0,1,0,1,0,1]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 5,
                    grid: "[[0,0,1,1,0,0],[0,0,1,1,0,0],[1,1,0,0,1,1],[1,1,0,0,1,1],[0,0,1,1,0,0],[0,0,1,1,0,0]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 6,
                    grid: "[[0,0,1,1,0,0],[0,0,1,1,0,0],[1,1,0,0,1,1],[1,1,0,0,1,1],[0,0,1,1,0,0],[0,0,1,1,0,0]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 7,
                    grid: "[[1,1,0,0,1,1],[1,1,0,0,1,1],[0,0,1,1,0,0],[0,0,1,1,0,0],[1,1,0,0,1,1],[1,1,0,0,1,1]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 8,
                    grid: "[[1,1,0,0,1,1],[1,1,0,0,1,1],[0,0,1,1,0,0],[0,0,1,1,0,0],[1,1,0,0,1,1],[1,1,0,0,1,1]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 9,
                    grid: "[[1,1,1,1,1,1],[0,1,0,0,1,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,1,0,0,1,0],[1,1,1,1,1,1]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 10,
                    grid: "[[1,1,1,1,1,1],[0,1,0,0,1,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,1,0,0,1,0],[1,1,1,1,1,1]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 11,
                    grid: "[[1,1,1,0,0,0],[0,1,1,1,0,0],[0,0,1,1,1,1],[0,0,1,1,1,1],[0,1,1,1,0,0],[1,1,1,0,0,0]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 12,
                    grid: "[[1,1,1,0,0,0],[0,1,1,1,0,0],[0,0,1,1,1,1],[0,0,1,1,1,1],[0,1,1,1,0,0],[1,1,1,0,0,0]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 13,
                    grid: "[[1,0,1,1,0,1],[0,1,1,1,1,0],[0,0,1,1,0,0],[1,1,1,1,1,1],[0,1,1,1,1,0],[1,0,1,1,0,1]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 14,
                    grid: "[[1,0,1,1,0,1],[0,1,1,1,1,0],[0,0,1,1,0,0],[1,1,1,1,1,1],[0,1,1,1,1,0],[1,0,1,1,0,1]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 15,
                    grid: "[[1,1,1,0,1,1],[1,0,0,0,0,0],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,0,0,0,0,0],[1,1,1,0,1,1]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 16,
                    grid: "[[1,1,1,0,1,1],[1,0,0,0,0,0],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,0,0,0,0,0],[1,1,1,0,1,1]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 17,
                    grid: "[[0,0,1,1,0,0],[0,1,1,1,1,0],[1,1,1,1,1,1],[1,1,1,1,1,1],[0,1,1,1,1,0],[0,0,1,1,0,0]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 18,
                    grid: "[[0,0,1,1,0,0],[0,1,1,1,1,0],[1,1,1,1,1,1],[1,1,1,1,1,1],[0,1,1,1,1,0],[0,0,1,1,0,0]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 19,
                    grid: "[[0,1,1,1,1,0],[0,1,1,1,1,0],[1,1,1,1,1,1],[1,1,1,1,1,1],[0,1,1,1,1,0],[0,1,1,1,1,0]]",
                    gridType: 1,
                    moveType: null
                }, {
                    pass: 20,
                    grid: "[[0,1,1,1,1,0],[0,1,1,1,1,0],[1,1,1,1,1,1],[1,1,1,1,1,1],[0,1,1,1,1,0],[0,1,1,1,1,0]]",
                    gridType: 1,
                    moveType: "toRight"
                }, {
                    pass: 21,
                    grid: "[[0,1,0,0,0,0,0,1,0],[1,1,1,0,0,0,1,1,1],[0,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,1,1,1],[0,1,0,0,0,0,0,1,0]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 22,
                    grid: "[[0,1,0,0,0,0,0,1,0],[1,1,1,0,0,0,1,1,1],[0,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,1,1,1],[0,1,0,0,0,0,0,1,0]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 23,
                    grid: "[[1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,0],[0,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 24,
                    grid: "[[1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,0],[0,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 25,
                    grid: "[[1,1,1,1,1,1,1,1,1],[0,1,0,0,1,0,0,1,0],[0,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,0,0,0],[1,1,0,0,1,0,0,1,1],[1,1,0,0,1,0,0,1,1],[0,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,1,0,0,1,0,0,1,0],[1,1,1,1,1,1,1,1,1]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 26,
                    grid: "[[1,1,1,1,1,1,1,1,1],[0,1,0,0,1,0,0,1,0],[0,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,0,0,0],[1,1,0,0,1,0,0,1,1],[1,1,0,0,1,0,0,1,1],[0,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,1,0,0,1,0,0,1,0],[1,1,1,1,1,1,1,1,1]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 27,
                    grid: "[[0,0,0,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[0,0,0,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 28,
                    grid: "[[0,0,0,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[0,0,0,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 29,
                    grid: "[[1,0,1,1,1,1,1,0,1],[0,1,1,1,1,1,1,1,0],[1,0,1,1,1,1,1,0,1],[0,0,0,0,1,0,0,0,0],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[0,1,1,1,1,1,1,1,0],[1,0,1,1,1,1,1,0,1]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 30,
                    grid: "[[1,0,1,1,1,1,1,0,1],[0,1,1,1,1,1,1,1,0],[1,0,1,1,1,1,1,0,1],[0,0,0,0,1,0,0,0,0],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[1,1,1,0,1,0,1,1,1],[0,1,1,1,1,1,1,1,0],[1,0,1,1,1,1,1,0,1]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 31,
                    grid: "[[1,1,0,0,1,0,0,1,1],[1,1,0,0,1,0,0,1,1],[1,1,0,0,1,0,0,1,1],[0,1,1,0,1,0,1,1,0],[0,0,1,1,0,1,1,0,0],[0,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,1,0,1,1,0,0],[0,1,1,0,1,0,1,1,0],[1,1,0,0,1,0,0,1,1]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 32,
                    grid: "[[1,1,0,0,1,0,0,1,1],[1,1,0,0,1,0,0,1,1],[1,1,0,0,1,0,0,1,1],[0,1,1,0,1,0,1,1,0],[0,0,1,1,0,1,1,0,0],[0,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,1,0,1,1,0,0],[0,1,1,0,1,0,1,1,0],[1,1,0,0,1,0,0,1,1]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 33,
                    grid: "[[1,0,1,0,1,0,0,0,1],[0,1,0,0,1,0,0,1,0],[0,0,1,1,0,1,1,0,0],[1,0,1,0,1,0,1,0,1],[0,0,1,1,0,1,1,0,0],[0,1,0,0,1,0,0,1,0],[1,0,1,1,1,1,1,0,1],[0,1,1,1,1,1,1,1,0],[1,0,1,0,1,0,1,0,1],[1,0,0,1,0,1,0,1,0]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 34,
                    grid: "[[1,0,1,0,1,0,0,0,1],[0,1,0,0,1,0,0,1,0],[0,0,1,1,0,1,1,0,0],[1,0,1,0,1,0,1,0,1],[0,0,1,1,0,1,1,0,0],[0,1,0,0,1,0,0,1,0],[1,0,1,1,1,1,1,0,1],[0,1,1,1,1,1,1,1,0],[1,0,1,0,1,0,1,0,1],[1,0,0,1,0,1,0,1,0]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 35,
                    grid: "[[1,0,1,1,1,0,1,0,1],[0,1,0,0,1,1,0,1,0],[0,1,1,0,1,0,1,1,1],[0,1,0,1,1,1,0,1,0],[1,1,1,1,1,1,1,1,1],[0,1,0,1,1,1,0,1,1],[1,1,1,0,1,0,1,1,0],[0,1,0,1,1,1,1,1,0],[1,0,1,0,1,0,1,1,1],[0,1,0,1,1,0,0,1,0]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 36,
                    grid: "[[1,0,1,1,1,0,1,0,1],[0,1,0,0,1,1,0,1,0],[0,1,1,0,1,0,1,1,1],[0,1,0,1,1,1,0,1,0],[1,1,1,1,1,1,1,1,1],[0,1,0,1,1,1,0,1,1],[1,1,1,0,1,0,1,1,0],[0,1,0,1,1,1,1,1,0],[1,0,1,0,1,0,1,1,1],[0,1,0,1,1,0,0,1,0]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 37,
                    grid: "[[1,0,0,1,0,1,0,1,1],[1,1,1,1,1,1,1,1,1],[1,1,0,1,0,1,0,0,1],[1,1,0,1,1,1,1,1,1],[1,1,1,1,0,1,0,0,1],[1,1,0,1,0,1,1,1,1],[1,1,0,1,1,1,0,0,1],[1,1,1,1,0,1,1,1,1],[1,1,0,1,0,1,0,0,0],[1,1,0,1,1,1,1,1,1]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 38,
                    grid: "[[1,0,0,1,0,1,0,1,1],[1,1,1,1,1,1,1,1,1],[1,1,0,1,0,1,0,0,1],[1,1,0,1,1,1,1,1,1],[1,1,1,1,0,1,0,0,1],[1,1,0,1,0,1,1,1,1],[1,1,0,1,1,1,0,0,1],[1,1,1,1,0,1,1,1,1],[1,1,0,1,0,1,0,0,0],[1,1,0,1,1,1,1,1,1]]",
                    gridType: 2,
                    moveType: "toRight"
                }, {
                    pass: 39,
                    grid: "[[0,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,0,1],[0,1,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,0,1],[0,1,0,1,1,1,1,0,0]]",
                    gridType: 2,
                    moveType: null
                }, {
                    pass: 40,
                    grid: "[[0,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,0,1],[0,1,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1],[1,1,0,1,1,1,1,0,1],[0,1,0,1,1,1,1,0,0]]",
                    gridType: 2,
                    moveType: "toRight"
                } ];
                for (var e = 0; e < this.config.length; e++) this.config[e].locked = !0, this.config[e].star = 0, 
                this.config[e].maxScore = 0, this.config[e].mapConfig = {}, 0 == e && (this.config[e].locked = !1);
            }, e.prototype.update = function() {
                for (var e in r.default.passConfig) for (var t in this.config) this.config[t].pass == r.default.passConfig[e].pass && (this.config[t] = Object.assign({}, this.config[t], r.default.passConfig[e]));
            }, e.prototype.transform = function(e) {
                console.log(e.grid);
                for (var t = JSON.parse(e.grid), o = new Array(t[0].length), r = [], i = 0; i < t[0].length; i++) o[i] = new Array(t.length), 
                r = new Array(t.length + 2);
                for (i = 0; i < r.length; i++) r[i] = -1;
                for (i = 0; i < t.length; i++) for (var n = 0; n < t[0].length; n++) o[n][i] = t[i][n], 
                o[n][i] = 1 === o[n][i] ? -2 : -1;
                for (i = 0; i < t[0].length; i++) o[i].push(-1), o[i].unshift(-1);
                return o.push(r), o.unshift(r), e.mapConfig = 1 == e.gridType ? this.mapConfig1 : this.mapConfig2, 
                e.mapConfig.moveType = e.moveType, e.mapConfig.grid = o, e.mapConfig.gridType = e.gridType, 
                e.mapConfig;
            }, e;
        }();
        o.default = i, cc._RF.pop();
    }, {
        "./GameData": "GameData"
    } ],
    GameData: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "82cdeSpcyZPc7PWej6byswe", "GameData"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./Point"), i = JSON.parse(localStorage.getItem("items") || JSON.stringify({
            clue: 5,
            refresh: 5,
            bomb: 5
        }));
        console.log(i);
        var n = JSON.parse(localStorage.getItem("endless") || JSON.stringify({
            maxScore: 0
        })), a = JSON.parse(localStorage.getItem("passConfig") || JSON.stringify([]));
        o.default = {
            isFirstTime: "0",
            isOpenBgMusic: !0,
            isOpenEffect: !0,
            bgAudioID: null,
            randomTwoNode: function(e) {
                for (var t = [], o = 1; o < e.row - 1; o++) for (var i = 1; i < e.col - 1; i++) -1 == this.starMatrix[o][i] && t.push(new r.default(o, i));
                if (t.length < 2) return [];
                for (var n = Math.floor(Math.random() * t.length); ;) {
                    var a = Math.floor(Math.random() * t.length);
                    if (a != n) break;
                }
                return [ t[n], t[a] ];
            },
            passConfig: a,
            recordPassConfig: function(e) {
                for (var t in console.log("传入的保存数据:", e), a) if (a[t].pass == e.pass) return e.star && (a[t].star = a[t].star > e.star ? a[t].star : e.star), 
                e.maxScore && (a[t].maxScore = a[t].maxScore > e.maxScore ? a[t].maxScore : e.maxScore), 
                void (a[t].locked = !1);
                a.push(e), localStorage.setItem("passConfig", JSON.stringify(a));
            },
            recordEndless: function(e) {
                e > n.maxScore && (n.maxScore = e, localStorage.setItem("endless", JSON.stringify(n)));
            },
            endless: n,
            recordGameItems: function(e) {
                i.clue = e.clue, i.refresh = e.refresh, i.bomb = e.bomb, localStorage.setItem("items", JSON.stringify(i));
            },
            items: i,
            nowPass: 0,
            Init: function(e) {
                for (var t = [], o = 0; o < e.row; o++) {
                    t[o] = new Array();
                    for (var r = 0; r < e.col; r++) t[o][r] = e.grid[o][r];
                }
                if (t.length != e.row) throw new Error("列数错误this.mapConfig.row:" + e.row + t.length);
                if (t[1].length != e.col) throw new Error("行数错误this.mapConfig.col:" + e.col + t[1].length);
                var i = 0;
                for (o = 0; o < t.length; o++) for (r = 0; r < t[o].length; r++) -2 == t[o][r] && i++;
                if (i % 2 != 0) throw new Error("配置的格子不是偶数，数量为" + i);
                var n = new Array(i);
                for (o = 0; o < i; o++) n[o] = -1;
                var a = 0;
                for (o = 0; o < i; o++) if (-1 == n[o]) {
                    var s = a++ % e.types;
                    for (n[o] = s; ;) {
                        var c = Math.floor(Math.random() * (i - o)) + o;
                        if (-1 == n[c]) {
                            n[c] = s;
                            break;
                        }
                    }
                }
                var u = 0;
                for (o = 1; o < e.row - 1; o++) for (r = 1; r < e.col - 1; r++) -2 == t[o][r] && (t[o][r] = n[u++]);
                return t;
            },
            starNodeArr: [],
            cleanStarData: function(e) {
                var t = this;
                e.forEach(function(e, o, r) {
                    t.starMatrix[e.x][e.y] = -1, t.starNodeArr[e.x][e.y] = null;
                });
            },
            starMatrix: []
        }, cc._RF.pop();
    }, {
        "./Point": "Point"
    } ],
    GameHeart: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "7da75tUXRdFCqsOdaceZ8WI", "GameHeart"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./Game"), i = cc._decorator, n = i.ccclass, a = i.property, s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.heartImg = [], t.heartNum = 3, t.game = null, t;
            }
            return __extends(t, e), t.prototype.onload = function() {}, t.prototype.start = function() {}, 
            t.prototype.reduceHeart = function() {
                this.heartNum = this.heartNum - 1, this.heartNum < 0 ? "pass" == this.game.gameType ? this.game.showFailShadow() : this.game.showEndlessShadow() : (this.game.refreshStar(), 
                this.node.getComponent(cc.Sprite).spriteFrame = this.heartImg[this.heartNum]);
            }, __decorate([ a(cc.SpriteFrame) ], t.prototype, "heartImg", void 0), __decorate([ a(r.default) ], t.prototype, "game", void 0), 
            t = __decorate([ n ], t);
        }(cc.Component);
        o.default = s, cc._RF.pop();
    }, {
        "./Game": "Game"
    } ],
    GameUtils: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "1b493YjF+dFdp1hJdD8cALv", "GameUtils"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./StarConfig"), i = function(e) {
            return e[Math.floor(Math.random() * e.length)];
        };
        var n = .65;
        o.default = {
            comboNum: function(e) {
                return 5 == e ? 0 : 6 == e || 7 == e ? 1 : 8 == e || 9 == e ? 2 : e >= 10 ? 3 : void 0;
            },
            randomColorByArray: i,
            remainStarScore: function(e) {
                if (e > 9) return 0;
                var t = void 0;
                switch (e) {
                  case 0:
                    t = 2e3;
                    break;

                  case 1:
                    t = 1980;
                    break;

                  case 2:
                    t = 1920;
                    break;

                  case 3:
                    t = 1820;
                    break;

                  case 4:
                    t = 1680;
                    break;

                  case 5:
                    t = 1500;
                    break;

                  case 6:
                    t = 1280;
                    break;

                  case 7:
                    t = 1020;
                    break;

                  case 8:
                    t = 720;
                    break;

                  case 9:
                    t = 380;
                }
                return Math.floor(t * n);
            },
            GetPassScore: function(e) {
                return 500 * e - 200 + 100 * Math.floor((800 * Math.pow(Math.floor(e / 5), 1.5) + 1e3 * Math.pow(Math.floor(e / 10), 1.5)) / 100);
            },
            getStarScore: function(e) {
                return 10 * e - 5;
            },
            gameOver: function(e) {
                for (var t = 0; t < r.default.matrixRow; t++) for (var o = 0; o < r.default.matrixCol; o++) {
                    var i = e[t][o];
                    if (i >= 0) {
                        var n = cc.v2(t, o);
                        if (n.y - 1 >= 0 && i == e[n.x][n.y - 1]) return !1;
                        if (n.y + 1 < r.default.matrixCol && i == e[n.x][n.y + 1]) return !1;
                        if (n.x - 1 >= 0 && i == e[n.x - 1][n.y]) return !1;
                        if (n.x + 1 < r.default.matrixRow && i == e[n.x + 1][n.y]) return !1;
                    }
                }
                return !0;
            },
            needCheckCols: function(e) {
                var t = [];
                return e.forEach(function(e, o, r) {
                    -1 == t.indexOf(e.y) && t.push(e.y);
                }), t.sort(function(e, t) {
                    return t - e;
                }), t;
            },
            getOneScore: function(e) {
                return 10 + 5 * (e - 1);
            },
            getScore: function(e) {
                for (var t = 0, o = 0; o < e; o++) t += this.getOneScore(o);
                return t;
            },
            indexOfV2: function(e, t) {
                return e.some(function(e, o, r) {
                    return e.x == t.x && e.y == t.y;
                });
            },
            needRemoveList: function(e, t) {
                var o = [], i = [];
                i.push(t);
                var n = e[t.x][t.y];
                do {
                    var a = i.pop();
                    if (a.y - 1 >= 0 && n == e[a.x][a.y - 1]) {
                        var s = cc.v2(a.x, a.y - 1);
                        this.indexOfV2(o, s) || this.indexOfV2(i, s) || i.push(s);
                    }
                    a.y + 1 < r.default.matrixCol && n == e[a.x][a.y + 1] && (s = cc.v2(a.x, a.y + 1), 
                    this.indexOfV2(o, s) || this.indexOfV2(i, s) || i.push(s)), a.x - 1 >= 0 && n == e[a.x - 1][a.y] && (s = cc.v2(a.x - 1, a.y), 
                    this.indexOfV2(o, s) || this.indexOfV2(i, s) || i.push(s)), a.x + 1 < r.default.matrixRow && n == e[a.x + 1][a.y] && (s = cc.v2(a.x + 1, a.y), 
                    this.indexOfV2(o, s) || this.indexOfV2(i, s) || i.push(s)), o.push(a);
                } while (i.length > 0);
                return o = o.sort(function(e, t) {
                    return -(10 * (e.x - t.x) + (t.y - e.y));
                });
            },
            indexValue: function(e, t) {
                return e * r.default.matrixCol + t;
            },
            grid2Pos: function(e, t) {
                var o = r.default.cellSize * t + 4, i = r.default.cellSize * e + 4;
                return cc.v2(o, i);
            },
            pos2Grid: function(e, t) {
                var o = (t - .5 * r.default.cellSize) / (r.default.cellSize + 2), i = (e - .5 * r.default.cellSize) / (r.default.cellSize + 2);
                return cc.v2(Math.round(o), Math.round(i));
            },
            initMatrixDataPortraitRandom: function() {
                for (var e = new Array(r.default.matrixRow), t = 0; t < r.default.matrixRow; t++) {
                    e[t] = new Array(r.default.matrixCol);
                    for (var o = 0; o < r.default.matrixCol; o++) e[t][o] = i(r.default.totalColors);
                }
                return e;
            }
        }, cc._RF.pop();
    }, {
        "./StarConfig": "StarConfig"
    } ],
    Game: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "78231vxFHhJK68hcJZxn+2j", "Game"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./Match"), i = e("./Point"), n = e("./GameData"), a = e("./DrawLine"), s = e("../../Libs/babybus/dataAnalysis/reporter"), c = e("./transfrom/rightMove"), u = e("../Utils"), l = e("./GameConfig"), d = e("./GameHeart"), p = e("./Comb"), f = e("./Progress"), h = e("./ItemShadow"), g = e("../ShareUtils"), m = e("../SubContextHelper"), y = e("../Config/DataAnalysisConfig"), v = e("../AdUtils"), _ = cc._decorator, b = _.ccclass, C = _.property, A = y.default.eventNames, S = "adunit-45c4e9c2cddeeb86", w = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.starPrefab = null, t.line = null, t.effect_btn = null, t.bgmusic_btn = null, 
                t.backBtn = null, t.bombPrefab = null, t.nowScoreLabel = null, t.heart = null, t.failShadow = null, 
                t.successShadow = null, t.pauseShadow = null, t.useBomb = null, t.success_bg = null, 
                t.success_bg_img = [], t.progress = null, t.itemShadow = null, t.clueString = null, 
                t.refreshString = null, t.bombString = null, t.audio = null, t.comb = null, t.starClickStatus = "start", 
                t._starPool = null, t._bombPool = null, t._clickPoint = {}, t.canClick = !0, t.mapConfig = null, 
                t.hitTime = 0, t.comboNum = 0, t.score = 0, t.historyScore = 0, t.isUseBomb = !1, 
                t.items = {}, t.gameType = "pass", t.lineObj = null, t;
            }
            return __extends(t, e), t.prototype.onLoad = function() {
                window.wx && wx.triggerGC(), n.default.nowPass = 0 == n.default.nowPass ? -1 : n.default.nowPass, 
                n.default.nowPass > 0 ? (this.mapConfig = l.default.getInstance().transform(l.default.getInstance().config[n.default.nowPass - 1]), 
                console.log("this.mapConfig", this.mapConfig)) : (this.gameType = "endless", cc.find("/Canvas/item_bg/middle").active = !1, 
                cc.find("/Canvas/item_bg/right").active = !1, cc.find("/Canvas/item_bg/progress_container").active = !0, 
                this.mapConfig = l.default.getInstance().mapConfigEndless, this.setEndless()), console.log("this.mapConfig ", this.mapConfig), 
                2 == this.mapConfig.gridType && (cc.find("/Canvas/container").setPosition(cc.v2(cc.find("/Canvas/container").x, -420)), 
                console.log(cc.find("/Canvas/container"))), cc.find("/Canvas/container").width = this.mapConfig.sizeX * (this.mapConfig.row - 2) + this.mapConfig.spaceX * (this.mapConfig.row - 3), 
                this.audio = cc.find("Audio").getComponent("Audio");
            }, t.prototype.setAutoRelease = function() {
                cc.loader.setAutoReleaseRecursively(this.effect_btn, !1), cc.loader.setAutoReleaseRecursively(this.bgmusic_btn, !1), 
                cc.loader.setAutoReleaseRecursively(this.backBtn.getComponent(cc.Sprite).spriteFrame, !1);
            }, t.prototype.start = function() {
                for (this.initPool(), "pass" == this.gameType && this.loadPassConfig(), n.default.starMatrix = n.default.Init(this.mapConfig), 
                this.initMatrix(), this.getItem(), this.lineObj = new a.default(this.mapConfig.sizeX, this.mapConfig.sizeY, this.mapConfig.spaceX, this.mapConfig.spaceY, this.line); !this.isCanPlay(); ) this.refreshStar();
                v.default.getInstance().createBannerAd(S);
            }, t.prototype.onDestroy = function() {
                "endless" == this.gameType && (n.default.recordEndless(this.score), m.default.getInstance().updateScore(this.score)), 
                v.default.getInstance().hideBannerAd(S);
            }, t.prototype.loadPassConfig = function() {
                var e = l.default.getInstance().config[n.default.nowPass - 1];
                console.log("读取关卡配置:", e), cc.find("/Canvas/item_bg/middle/passLabel").getComponent(cc.Label).string = "第" + n.default.nowPass + "关", 
                cc.find("/Canvas/item_bg/right/bg/score").getComponent(cc.Label).string = e.maxScore + "";
            }, t.prototype.initPool = function() {
                var e = this;
                this._starPool = new cc.NodePool(), this._bombPool = new cc.NodePool();
                for (var t = 0; t <= (this.mapConfig.row - 1) * (this.mapConfig.col - 1); ++t) {
                    var o = cc.instantiate(this.starPrefab);
                    this._starPool.put(o);
                }
                var r = function(t) {
                    var o = cc.instantiate(i.bombPrefab);
                    o.scale = i.mapConfig.per, o.getComponent(cc.Animation).on("finished", function() {
                        e.node.isValid && e._bombPool.put(o);
                    }, i), i._bombPool.put(o);
                }, i = this;
                for (t = 0; t < 5; t++) r();
            }, t.prototype.setEndless = function() {
                cc.find("/Canvas/item_bg/middle").active = !1, cc.find("/Canvas/item_bg/right").active = !1;
            }, t.prototype.createStar = function(e, t, o) {
                var r = null;
                if (this._starPool.size() > 0) {
                    (r = this._starPool.get()).scale = 0;
                    var i = cc.scaleTo(.3, this.mapConfig.per);
                    r.runAction(i);
                } else console.log("new star"), r = cc.instantiate(this.starPrefab);
                return r.setPosition(this.setStarV2(this.mapConfig, t, o)), cc.find("/Canvas/container").addChild(r), 
                r.getComponent("starCtr").initStar(e, t, o), r;
            }, t.prototype.createTwoNode = function() {
                var e = n.default.randomTwoNode(this.mapConfig);
                if (!(e.length < 2)) {
                    var t = Math.floor(Math.random() * this.mapConfig.types);
                    n.default.starMatrix[e[0].x][e[0].y] = t, n.default.starMatrix[e[1].x][e[1].y] = t;
                    var o = this.createStar(t, e[0].x, e[0].y);
                    n.default.starNodeArr[e[0].x][e[0].y] = o;
                    var r = this.createStar(t, e[1].x, e[1].y);
                    n.default.starNodeArr[e[1].x][e[1].y] = r;
                }
            }, t.prototype.createBomb = function(e) {
                console.log(e.x, e.y, this._bombPool.size());
                var t = null;
                this._bombPool.size() > 0 && (t = this._bombPool.get(), console.log("get"), t.getComponent(cc.Animation).resume(), 
                t.position = cc.v2(e.x + this.mapConfig.sizeX / 2, e.y + this.mapConfig.sizeY / 2), 
                t.getComponent(cc.Animation).play(), cc.find("/Canvas/container").addChild(t));
            }, t.prototype.setStarV2 = function(e, t, o) {
                return cc.v2((e.sizeX + e.spaceX) * (t - .5), (e.sizeY + e.spaceY) * (o - .5));
            }, t.prototype.initMatrix = function() {
                for (var e = 0; e < n.default.starMatrix.length; e++) {
                    var t = n.default.starMatrix[e];
                    n.default.starNodeArr[e] = new Array();
                    for (var o = t.length - 1; o >= 0; o--) {
                        var r = n.default.starMatrix[e][o];
                        if (r > -1) {
                            var i = this.createStar(r, e, o);
                            n.default.starNodeArr[e][o] = i;
                        } else n.default.starNodeArr[e][o] = null;
                    }
                }
            }, t.prototype.judgeRemove = function(e) {
                var t = this;
                void 0 === e && (e = !1);
                var o = this._clickPoint;
                if (o.start !== o.end) if (o.start.type === o.end.type) {
                    var a = new i.default(o.start.x, o.start.y), s = new i.default(o.end.x, o.end.y);
                    console.log("start", a.x, a.y, "end", s.x, s.y);
                    var u = r.default.MatchBolckTwo(n.default.starMatrix, a, s);
                    if (u) {
                        this.audio.playDisappear(), n.default.starNodeArr[o.end.x][o.end.y].getComponent("starCtr").lightBg(), 
                        this.createBomb(o.end.node.position), this.createBomb(o.start.node.position);
                        for (var l = this.lineObj.drawLine(u), d = 0; d < l.length; d++) cc.find("/Canvas/container").addChild(l[d]);
                        if (this._starPool.put(o.start.node), this._starPool.put(o.end.node), this.clearClickPoint(), 
                        n.default.cleanStarData([ a, s ]), this.addScore(), this.isGameOver()) return void this.scheduleOnce(function() {
                            t.OverEvent();
                        }, .3);
                        "endless" == this.gameType && this.progress.addTime(), !e && this.mapConfig.moveType ? this.scheduleOnce(function() {
                            t.canClick = !1, new c.default(t.mapConfig).transform(function() {
                                t.hitTime = new Date().getTime(), t.canClick = !0, t.isCanPlay() || t.heart.reduceHeart();
                            });
                        }, .3) : (this.hitTime = new Date().getTime(), this.isCanPlay() || this.heart.reduceHeart());
                    } else console.debug("消之前的 点亮之后的"), n.default.starNodeArr[o.start.x][o.start.y].getComponent("starCtr").darkBg(), 
                    n.default.starNodeArr[o.end.x][o.end.y].getComponent("starCtr").startFun();
                } else console.debug("消之前的 点亮之后的"), n.default.starNodeArr[o.start.x][o.start.y].getComponent("starCtr").darkBg(), 
                n.default.starNodeArr[o.end.x][o.end.y].getComponent("starCtr").startFun();
            }, t.prototype.goNext = function() {
                if (this.audio.playCommonClick(), n.default.nowPass = n.default.nowPass + 1, n.default.nowPass > l.default.getInstance().config.length) return console.log(n.default.nowPass, l.default.getInstance().config.length), 
                void cc.director.loadScene("Choose");
                cc.director.loadScene("Game");
            }, t.prototype.clearClickPoint = function() {
                this._clickPoint.start && this._clickPoint.start.x && this._clickPoint.start.darkBg(), 
                this._clickPoint.end && this._clickPoint.end.x && this._clickPoint.end.getComponent("starCtr").darkBg(), 
                this._clickPoint = {};
            }, t.prototype.isGameOver = function() {
                for (var e = 0; e < this.mapConfig.row; e++) for (var t = 0; t < this.mapConfig.col; t++) if (n.default.starMatrix[e][t] > -1) return !1;
                return !0;
            }, t.prototype.removeTwain = function() {
                var e = this.isCanPlay();
                console.log("消除一对PointObj:", e), this.clearClickPoint(), e && (this._clickPoint.start = n.default.starNodeArr[e.startPoint.x][e.startPoint.y].getComponent("starCtr"), 
                this._clickPoint.end = n.default.starNodeArr[e.endPoint.x][e.endPoint.y].getComponent("starCtr"), 
                this.judgeRemove(!0));
            }, t.prototype.removeOneTypePoint = function(e) {
                this.audio.playBomb(), this.isUseBomb = !1;
                for (var t = 0; t < this.mapConfig.row; t++) for (var o = 0; o < this.mapConfig.col; o++) n.default.starMatrix[t][o] == e && (console.log(new i.default(t, o)), 
                n.default.starMatrix[t][o] = -1, this.createBomb(n.default.starNodeArr[t][o].position), 
                this._starPool.put(n.default.starNodeArr[t][o]), n.default.starNodeArr[t][o] = null);
                this.isGameOver() ? this.OverEvent() : this.isCanPlay() || this.heart.reduceHeart();
            }, t.prototype.OverEvent = function() {
                if ("pass" == this.gameType) {
                    var e = {
                        pass: n.default.nowPass,
                        star: this.heart.heartNum,
                        maxScore: this.score
                    };
                    n.default.recordPassConfig(e), n.default.recordPassConfig({
                        pass: n.default.nowPass + 1,
                        locked: !1
                    }), this.showSuccessShadow();
                } else this.endlessRefresh();
            }, t.prototype.getItem = function() {
                this.items = n.default.items, console.log("GameData.items", n.default.items), this.clueString.string = this.items.clue > 0 ? this.items.clue : "+", 
                this.refreshString.string = this.items.refresh > 0 ? this.items.refresh : "+", this.bombString.string = this.items.bomb > 0 ? this.items.bomb : "+";
            }, t.prototype.useItem = function(e, t) {
                this.canClick ? this.isUseBomb ? cc.sys.platform === cc.sys.WECHAT_GAME && wx.showToast({
                    title: "正在使用炸弹道具...",
                    icon: "none",
                    duration: 2e3
                }) : (this.audio.playCommonClick(), this.clearClickPoint(), 1 == t && this.items.clue > 0 ? (this.items.clue = this.items.clue - 1, 
                this.removeTwain()) : 2 == t && this.items.refresh > 0 ? (this.items.refresh = this.items.refresh - 1, 
                this.refreshStar()) : 3 == t && this.items.bomb > 0 ? (this.showUseBomb(), this.isUseBomb = !0) : this.itemShadow.showItemShadow(t), 
                n.default.recordGameItems(this.items), this.getItem()) : console.debug("此时不能点击");
            }, t.prototype.changeItem = function(e, t) {
                void 0 === t && (t = 1), 1 == e ? this.items.clue = this.items.clue + t : 2 == e ? this.items.refresh = this.items.refresh + t : 3 == e && (this.items.bomb = this.items.bomb + t), 
                n.default.recordGameItems(this.items), this.getItem();
            }, t.prototype.isCanPlay = function() {
                for (var e = new Array(this.mapConfig.types), t = 0; t < e.length; t++) e[t] = new Array();
                for (t = 0; t < this.mapConfig.row; t++) for (var o = 0; o < this.mapConfig.col; o++) if (-1 != n.default.starMatrix[t][o]) {
                    var a = n.default.starMatrix[t][o], s = new i.default(t, o);
                    e[a].push(s);
                }
                for (t = 0; t < e.length; t++) for (o = 0; o < e[t].length; o++) for (var c = o + 1; c < e[t].length; c++) {
                    if (r.default.MatchBolckTwo(n.default.starMatrix, e[t][o], e[t][c])) return {
                        startPoint: e[t][o],
                        endPoint: e[t][c]
                    };
                }
                return !1;
            }, t.prototype.refreshStar = function() {
                var e = this;
                this.audio.playRefresh(), this.canClick = !1, console.debug("refreshStar", n.default.starMatrix, n.default.starNodeArr), 
                this.clearClickPoint();
                for (var t = [], o = 0; o < this.mapConfig.row; o++) for (var r = 0; r < this.mapConfig.col; r++) n.default.starMatrix[o][r] >= 0 && t.push(new i.default(o, r));
                t = u.default.shuffle(t), console.log("sortArr:", t);
                for (var a = new Array(this.mapConfig.row), s = new Array(this.mapConfig.row), c = 0; c < s.length; c++) s[c] = new Array(this.mapConfig.col), 
                a[c] = new Array(this.mapConfig.col);
                for (o = 0; o < this.mapConfig.row; o++) for (r = 0; r < this.mapConfig.col; r++) if (n.default.starMatrix[o][r] >= 0) {
                    var l = t.shift();
                    a[l.x][l.y] = n.default.starMatrix[o][r];
                    var d = n.default.starNodeArr[o][r];
                    s[l.x][l.y] = d, d.getComponent("starCtr").move(this.setStarV2(this.mapConfig, l.x, l.y), l.x, l.y, .5);
                } else s[o][r] = null, a[o][r] = -1;
                this.scheduleOnce(function() {
                    n.default.starNodeArr = s, n.default.starMatrix = a, e.canClick = !0, e.isCanPlay() || e.refreshStar();
                }, .6);
            }, t.prototype.back = function() {
                this.audio.playCommonClick(), "pass" == this.gameType ? cc.director.loadScene("Choose") : cc.director.loadScene("Welcome");
            }, t.prototype.addScore = function() {
                new Date().getTime() - this.hitTime < 2e3 ? (this.comboNum += 1, this.comb.setNum(this.comboNum), 
                this.score += 100 + 10 * this.comboNum, this.nowScoreLabel.string = this.score + "") : (this.comboNum = 0, 
                this.score += 100, this.nowScoreLabel.string = this.score + "");
            }, t.prototype.Restart = function() {
                this.audio.playCommonClick(), cc.director.loadScene("Game");
            }, t.prototype.endlessRefresh = function() {
                for (var e = n.default.Init(this.mapConfig), t = 0; t < this.mapConfig.row; t++) for (var o = 0; o < this.mapConfig.col; o++) n.default.starMatrix[t][o] = e[t][o];
                this.initMatrix();
            }, t.prototype.showEndlessShadow = function() {
                this.progress.offTimer(), this.success_bg.spriteFrame = this.success_bg_img[0], 
                cc.find("/Canvas/success_shadow/container/btn/endless_refresh").active = !0, cc.find("/Canvas/success_shadow/container/btn/go_next").active = !1, 
                cc.find("/Canvas/success_shadow/container/success_bg/pass_bg/pass").getComponent(cc.Label).string = "无尽模式", 
                m.default.getInstance().updateScore(this.score), this.score > n.default.endless.maxScore ? (n.default.recordEndless(this.score), 
                this.historyScore = this.score) : this.historyScore = n.default.endless.maxScore, 
                this.showSuccessShadow();
            }, t.prototype.showFailShadow = function() {
                this.audio.playFail(), this.failShadow.active = !0, cc.find("/Canvas/fail_shadow/container/fail_bg").scale = 0, 
                cc.find("/Canvas/fail_shadow/container/btn").opacity = 0;
                var e = cc.scaleTo(.3, 1), t = cc.sequence(cc.delayTime(.3), cc.fadeTo(.3, 255));
                cc.find("/Canvas/fail_shadow/container/fail_bg").runAction(e), cc.find("/Canvas/fail_shadow/container/btn").runAction(t);
            }, t.prototype.showSuccessShadow = function() {
                this.audio.playSuccess(), this.successShadow.active = !0, cc.find("/Canvas/success_shadow/container/success_bg/score").getComponent(cc.Label).string = this.score, 
                "pass" == this.gameType && (cc.find("/Canvas/success_shadow/container/success_bg/pass_bg/pass").getComponent(cc.Label).string = "第" + n.default.nowPass + "关", 
                s.default.getInstance().reportAnalytics(A.PASS_SUCCESS, {
                    "关卡": n.default.nowPass
                }), this.success_bg.spriteFrame = this.success_bg_img[this.heart.heartNum + 1], 
                this.historyScore = l.default.getInstance().config[n.default.nowPass - 1].maxScore), 
                cc.find("/Canvas/success_shadow/container/success_bg/maxHistoryScore_bg/max_score").getComponent(cc.Label).string = "历史最高分:" + this.historyScore, 
                cc.find("/Canvas/success_shadow/container/success_bg").scale = 0, cc.find("/Canvas/success_shadow/container/light_bg").scale = 0, 
                cc.find("/Canvas/success_shadow/container/btn").opacity = 0;
                var e = cc.scaleTo(.3, 1), t = cc.scaleTo(.3, 1), o = cc.sequence(cc.delayTime(.3), cc.fadeTo(.3, 255));
                cc.find("/Canvas/success_shadow/container/light_bg").runAction(t), cc.find("/Canvas/success_shadow/container/success_bg").runAction(e), 
                cc.find("/Canvas/success_shadow/container/btn").runAction(o);
            }, t.prototype.showPauseShadow = function() {
                this.audio.playCommonClick(), cc.find("/Canvas/pause_shadow").active = !0, "endless" == this.gameType && this.progress.offTimer(), 
                cc.find("/Canvas/pause_shadow/pause_bg").scale = 0;
                var e = cc.scaleTo(.3, 1);
                cc.find("/Canvas/pause_shadow/pause_bg").runAction(e);
            }, t.prototype.closePauseShadow = function() {
                this.audio.playCommonClick(), cc.find("/Canvas/pause_shadow").active = !1, "endless" == this.gameType && this.progress.onTimer();
            }, t.prototype.share = function() {
                this.audio.playCommonClick(), cc.sys.platform === cc.sys.WECHAT_GAME && g.default.getInstance().share({
                    success: function() {},
                    fail: function() {
                        wx.showToast({
                            title: "分享失败...",
                            icon: "none",
                            duration: 2e3
                        });
                    }
                });
            }, t.prototype.showUseBomb = function() {
                this.useBomb.active = !0, v.default.getInstance().hideBannerAd(S);
            }, t.prototype.closeUseBomb = function() {
                v.default.getInstance().showBannerAd(S), this.audio.playCommonClick(), this.isUseBomb = !1, 
                this.useBomb.active = !1;
            }, __decorate([ C(cc.Prefab) ], t.prototype, "starPrefab", void 0), __decorate([ C(cc.Prefab) ], t.prototype, "line", void 0), 
            __decorate([ C(cc.Prefab) ], t.prototype, "effect_btn", void 0), __decorate([ C(cc.Prefab) ], t.prototype, "bgmusic_btn", void 0), 
            __decorate([ C(cc.Node) ], t.prototype, "backBtn", void 0), __decorate([ C(cc.Prefab) ], t.prototype, "bombPrefab", void 0), 
            __decorate([ C(cc.Label) ], t.prototype, "nowScoreLabel", void 0), __decorate([ C(d.default) ], t.prototype, "heart", void 0), 
            __decorate([ C(cc.Node) ], t.prototype, "failShadow", void 0), __decorate([ C(cc.Node) ], t.prototype, "successShadow", void 0), 
            __decorate([ C(cc.Node) ], t.prototype, "pauseShadow", void 0), __decorate([ C(cc.Node) ], t.prototype, "useBomb", void 0), 
            __decorate([ C({
                type: cc.Sprite,
                displayName: "游戏通关弹框背景"
            }) ], t.prototype, "success_bg", void 0), __decorate([ C({
                type: cc.SpriteFrame,
                displayName: "游戏通关弹框背景图"
            }) ], t.prototype, "success_bg_img", void 0), __decorate([ C(f.default) ], t.prototype, "progress", void 0), 
            __decorate([ C(h.default) ], t.prototype, "itemShadow", void 0), __decorate([ C(cc.Label) ], t.prototype, "clueString", void 0), 
            __decorate([ C(cc.Label) ], t.prototype, "refreshString", void 0), __decorate([ C(cc.Label) ], t.prototype, "bombString", void 0), 
            __decorate([ C(p.default) ], t.prototype, "comb", void 0), t = __decorate([ b ], t);
        }(cc.Component);
        o.default = w, cc._RF.pop();
    }, {
        "../../Libs/babybus/dataAnalysis/reporter": "reporter",
        "../AdUtils": "AdUtils",
        "../Config/DataAnalysisConfig": "DataAnalysisConfig",
        "../ShareUtils": "ShareUtils",
        "../SubContextHelper": "SubContextHelper",
        "../Utils": "Utils",
        "./Comb": "Comb",
        "./DrawLine": "DrawLine",
        "./GameConfig": "GameConfig",
        "./GameData": "GameData",
        "./GameHeart": "GameHeart",
        "./ItemShadow": "ItemShadow",
        "./Match": "Match",
        "./Point": "Point",
        "./Progress": "Progress",
        "./transfrom/rightMove": "rightMove"
    } ],
    ItemShadow: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "54a26Q5LQZD3b4f9GcGxLfd", "ItemShadow"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../ShareUtils"), i = cc._decorator, n = i.ccclass, a = i.property, s = e("../AdUtils"), c = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.item_img = [], t.boxAnimPrefab = null, t.itemType = 0, t.audio = null, 
                t.getType = "videoGet", t.getItemBtn = null, t.getItemBtnImages = [], t;
            }
            return __extends(t, e), t.prototype.start = function() {
                this.audio = cc.find("Audio").getComponent("Audio"), s.default.getInstance().createRewardedVideoAd("adunit-9e1b8a11138b4c28");
            }, t.prototype.onLoad = function() {}, t.prototype.showItemShadow = function(e) {
                this.setGetType(), this.itemType = e, this.node.active = !0, cc.find("/Canvas/get_items_shadow/container/item_bg/item_bling/item").getComponent(cc.Sprite).spriteFrame = this.item_img[this.itemType - 1], 
                this.closeCanClick(), cc.find("/Canvas/get_items_shadow/container").scale = 0;
                var t = cc.scaleTo(.3, 1);
                cc.find("/Canvas/get_items_shadow/container").runAction(t);
            }, t.prototype.closeItemShadow = function() {
                this.node.getComponent("Audio").playCommonClick(), this.node.active = !1, this.openCanClick();
            }, t.prototype.closeCanClick = function() {
                cc.find("/Canvas").getComponent("Game").canClick = !1;
            }, t.prototype.openCanClick = function() {
                cc.find("/Canvas").getComponent("Game").canClick = !0;
            }, t.prototype.setGetType = function() {
                if (console.log("设置类型"), cc.sys.platform === cc.sys.WECHAT_GAME) {
                    var e = Math.random();
                    s.default.getInstance().isRewardedVideoAdAvailable() && e <= .7 ? (this.getType = "videoGet", 
                    this.getItemBtn.getComponent(cc.Sprite).spriteFrame = this.getItemBtnImages[0]) : (this.getType = "shareGet", 
                    this.getItemBtn.getComponent(cc.Sprite).spriteFrame = this.getItemBtnImages[1]);
                } else this.getType = "directGet", this.getItemBtn.getComponent(cc.Sprite).spriteFrame = this.getItemBtnImages[1];
            }, t.prototype.share = function() {
                var e = this;
                "directGet" == this.getType ? this.playGiftAni() : "videoGet" == this.getType ? (this.audio.pauseBg(), 
                s.default.getInstance().showRewardedVideoAd({
                    fail: function() {
                        wx.showToast({
                            title: "展示视频失败...",
                            icon: "none",
                            duration: 2e3
                        });
                    },
                    finished: function() {
                        e.playGiftAni();
                    },
                    unfinished: function() {},
                    completed: function() {
                        console.log("completed"), e.audio.resumeBg();
                    }
                }, this)) : r.default.getInstance().share({
                    success: this.playGiftAni.bind(this),
                    fail: function() {
                        wx.showToast({
                            title: "分享失败...",
                            icon: "none",
                            duration: 2e3
                        });
                    }
                });
            }, t.prototype.playGiftAni = function() {
                var e = this;
                this.node.active = !1;
                var t = cc.instantiate(this.boxAnimPrefab);
                cc.find("/Canvas").addChild(t), cc.find("/Canvas/box_anim/box").getComponent(cc.Animation).on("finished", function() {
                    var o = cc.fadeTo(1, 0);
                    cc.find("/Canvas/box_anim/box").runAction(o), cc.find("/Canvas/box_anim/item/itemImg").getComponent(cc.Sprite).spriteFrame = e.item_img[e.itemType - 1], 
                    cc.find("/Canvas/box_anim/item").active = !0;
                    var r = cc.sequence(cc.moveBy(1.5, cc.v2(0, 250)), cc.callFunc(function() {
                        cc.find("/Canvas").getComponent("Game").changeItem(e.itemType), e.openCanClick(), 
                        t.removeFromParent();
                    }));
                    cc.find("/Canvas/box_anim/item").runAction(r);
                }, this);
            }, __decorate([ a({
                type: cc.SpriteFrame,
                displayName: "道具图片"
            }) ], t.prototype, "item_img", void 0), __decorate([ a(cc.Prefab) ], t.prototype, "boxAnimPrefab", void 0), 
            __decorate([ a(cc.Node) ], t.prototype, "getItemBtn", void 0), __decorate([ a(cc.SpriteFrame) ], t.prototype, "getItemBtnImages", void 0), 
            t = __decorate([ n ], t);
        }(cc.Component);
        o.default = c, cc._RF.pop();
    }, {
        "../AdUtils": "AdUtils",
        "../ShareUtils": "ShareUtils"
    } ],
    Main: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "95720NhU9hJ3J84ocVRva8I", "Main"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = r.property, a = e("../Game/GameConfig"), s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.pass_one = null, t.pass_container = null, t.pageView = null, t.leftArrow = null, 
                t.rightArrow = null, t.arrowSpriteFrames = [], t.audio = null, t.pageIndex = 0, 
                t.maxPageIndex = 0, t.time = 0, t;
            }
            return __extends(t, e), t.prototype.start = function() {
                cc.director.preloadScene("Game", function() {});
            }, t.prototype.onLoad = function() {
                window.wx && wx.triggerGC(), this.init(), this.judgeArrow(), this.audio = cc.find("Audio").getComponent("Audio");
            }, t.prototype.back = function() {
                this.audio.playCommonClick(), cc.director.loadScene("Welcome");
            }, t.prototype.update = function() {}, t.prototype.init = function() {
                var e = [], t = cc.find("/Canvas/PageView/view/content");
                this.maxPageIndex = Math.ceil(a.default.getInstance().config.length / 20);
                for (var o = a.default.getInstance().config.slice(), r = 0; r < this.maxPageIndex; r++) {
                    var i = cc.instantiate(this.pass_container);
                    e[r] = o.splice(0, 20), console.log(e);
                    for (var n = 0; n < e[r].length; n++) {
                        var s = cc.instantiate(this.pass_one);
                        s.getComponent("Pass").init(e[r][n].pass, e[r][n].star, e[r][n].locked), i.addChild(s);
                    }
                    console.log(t), t.addChild(i);
                }
            }, t.prototype.onPageEvent = function(e, t) {
                t === cc.PageView.EventType.PAGE_TURNING && (console.log("当前所在的页面索引:" + e.getCurrentPageIndex()), 
                this.pageIndex = e.getCurrentPageIndex(), this.judgeArrow());
            }, t.prototype.judgeArrow = function() {
                this.pageIndex === this.maxPageIndex - 1 ? this.rightArrow.spriteFrame = this.arrowSpriteFrames[0] : this.pageIndex < this.maxPageIndex - 1 && (this.rightArrow.spriteFrame = this.arrowSpriteFrames[1]), 
                0 === this.pageIndex ? this.leftArrow.spriteFrame = this.arrowSpriteFrames[0] : this.pageIndex > 0 && (this.leftArrow.spriteFrame = this.arrowSpriteFrames[1]);
            }, t.prototype.turnPage = function(e, t) {
                t = Number(t), new Date().getTime() - this.time < 300 || 0 === this.pageIndex && -1 == t || this.pageIndex === this.maxPageIndex - 1 && 1 == t || (this.audio.playCommonClick(), 
                this.time = new Date().getTime(), console.log(this.pageIndex + t), this.pageView.setCurrentPageIndex(this.pageIndex + t));
            }, __decorate([ n(cc.Prefab) ], t.prototype, "pass_one", void 0), __decorate([ n(cc.Prefab) ], t.prototype, "pass_container", void 0), 
            __decorate([ n(cc.PageView) ], t.prototype, "pageView", void 0), __decorate([ n(cc.Sprite) ], t.prototype, "leftArrow", void 0), 
            __decorate([ n(cc.Sprite) ], t.prototype, "rightArrow", void 0), __decorate([ n(cc.SpriteFrame) ], t.prototype, "arrowSpriteFrames", void 0), 
            t = __decorate([ i ], t);
        }(cc.Component);
        o.default = s, cc._RF.pop();
    }, {
        "../Game/GameConfig": "GameConfig"
    } ],
    Match: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "16a03q1uzxP5bGXJiLjbep5", "Match"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./Point"), i = function() {
            function e() {}
            return e.MatchBolckZero = function(e, t, o) {
                if (t.x != o.x && t.y != o.y) return !1;
                var r, i;
                if (t.x == o.x) {
                    for (r = t.y < o.y ? t.y : o.y, i = t.y > o.y ? t.y : o.y, r++; r < i; r++) if (-1 != e[t.x][r]) return !1;
                } else for (r = t.x < o.x ? t.x : o.x, i = t.x > o.x ? t.x : o.x, r++; r < i; r++) if (-1 != e[r][t.y]) return !1;
                return !0;
            }, e.MatchBolckOne = function(e, t, o) {
                if (t.x == o.x || t.y == o.y) return !1;
                var i = new r.default(t.x, o.y);
                return -1 == e[i.x][i.y] && this.MatchBolckZero(e, t, i) && this.MatchBolckZero(e, i, o) ? i : !(-1 != e[(i = new r.default(o.x, t.y)).x][i.y] || !this.MatchBolckZero(e, t, i) || !this.MatchBolckZero(e, i, o)) && i;
            }, e.MatchBolckTwo = function(e, t, o) {
                if (!e || 0 == e.length) return !1;
                if (t.x < 0 || t.x > e.length) return !1;
                if (t.y < 0 || t.y > e[0].length) return !1;
                if (o.x < 0 || o.x > e.length) return !1;
                if (o.y < 0 || o.y > e[0].length) return !1;
                if (this.MatchBolckZero(e, t, o)) return console.debug("0折"), [ t, o ];
                var i;
                if (i = this.MatchBolckOne(e, t, o)) return console.debug("一折"), [ t, i, o ];
                if (t.x != o.x) {
                    for (var n = t.y + 1; n < e[t.x].length && -1 == e[t.x][n]; n++) {
                        var a = new r.default(t.x, n);
                        if (s = this.MatchBolckOne(e, a, o)) return [ t, a, s, o ];
                    }
                    for (n = t.y - 1; n > -1 && -1 == e[t.x][n]; n--) {
                        a = new r.default(t.x, n);
                        if (s = this.MatchBolckOne(e, a, o)) return [ t, a, s, o ];
                    }
                }
                if (t.y != o.y) {
                    for (n = t.x + 1; n < e.length && -1 == e[n][t.y]; n++) {
                        a = new r.default(n, t.y);
                        if (s = this.MatchBolckOne(e, a, o)) return [ t, a, s, o ];
                    }
                    for (n = t.x - 1; n > -1 && -1 == e[n][t.y]; n--) {
                        var s;
                        a = new r.default(n, t.y);
                        if (s = this.MatchBolckOne(e, a, o)) return [ t, a, s, o ];
                    }
                    return !1;
                }
            }, e;
        }();
        o.default = i, cc._RF.pop();
    }, {
        "./Point": "Point"
    } ],
    MoveFather: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "96fabUXAKZGaa3YP1ib2D3O", "MoveFather"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = function() {
            return function(e) {
                this.mapConfig = null, this.moveTime = .3, this.starMatrix = new Array(e.row), this.starNodeArr = new Array(e.row), 
                this.mapConfig = e;
                for (var t = 0; t < e.row; t++) {
                    this.starNodeArr[t] = new Array(e.col), this.starMatrix[t] = new Array(e.col);
                    for (var o = 0; o < e.col; o++) this.starMatrix[t][o] = -1, this.starNodeArr[t][o] = null;
                }
            };
        }();
        o.default = r, cc._RF.pop();
    }, {} ],
    NavService: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "127ff/oF2FGx5T5CtjMAFHJ", "NavService"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../../Libs/babybus/network/ajax"), i = e("../../Libs/babybus/network/signature"), n = e("../../Libs/babybus/network/systemInfo"), a = e("../../Libs/babybus/network/userAgent"), s = e("../../Script/Config/AppConfig"), c = 15, u = 3642, l = "VR1BtITxk1oNSh4nQUVdlKUgJTg4sQOp", d = "TVYo5XPpl7ckK4MfCmCkCsR88hqilrDG", p = "ios" === n.default.getInstance().platform.toLocaleLowerCase();
        (function(e) {
            e[e.Box = 1] = "Box", e[e.IndexBottom = 2] = "IndexBottom", e[e.SideBar = 3] = "SideBar", 
            e[e.Back = 4] = "Back", e[e.Self = 5] = "Self", e[e.Bus = 6] = "Bus", e[e.StateClear = 7] = "StateClear", 
            e[e.VideoFloat = 8] = "VideoFloat", e[e.Ad = 9] = "Ad", e[e.IndexBanner = 10] = "IndexBanner", 
            e[e.RecommendBanner = 11] = "RecommendBanner", e[e.RecommendTiled = 12] = "RecommendTiled", 
            e[e.Reserve1 = 13] = "Reserve1", e[e.Reserve2 = 14] = "Reserve2", e[e.Reserve3 = 15] = "Reserve3", 
            e[e.BbLearnBanner = 16] = "BbLearnBanner", e[e.BbLearnSchool = 17] = "BbLearnSchool", 
            e[e.BbLearnChosen = 18] = "BbLearnChosen", e[e.LandScape = 19] = "LandScape";
        })(o.FlowType || (o.FlowType = {}));
        var f = function() {
            return function() {};
        }();
        o.NavItem = f;
        var h = function() {
            function e() {
                this.navData = void 0;
                var e = s.default.projectId || c, t = s.default.productId || u, o = s.default.signKey || l, n = s.default.xxTeaKey || d, p = new i.default(o, n), f = new a.default({
                    ProductID: t,
                    ProjectID: e
                });
                this.ajax = new r.default(p, f);
            }
            return e.getInstance = function() {
                return e.sInstance || (e.sInstance = new e()), e.sInstance;
            }, e.prototype.getNavData = function(e) {
                var t = this;
                if (void 0 !== this.navData) return new Promise(function(o) {
                    t.navData[e] ? o(t.navData[e]) : o([]);
                });
                if (!Array.isArray(s.default.whiteList) || 0 === s.default.whiteList.length) throw new Error("没有配白名单");
                return this.ajax.post("https://spg.babybus.com/Record/Index/GetWhiteList", {
                    AppID: s.default.wxAppId
                }).then(function(o) {
                    var r = [];
                    return o.forEach(function(e) {
                        r[e.flowType] = e.flowRefViewModelList.map(function(e) {
                            var t = !0;
                            if (e.supportOsType) {
                                var o = e.supportOsType.split(",").filter(function(e) {
                                    return !!e;
                                }).map(function(e) {
                                    return e.trim();
                                });
                                t = p ? o.indexOf("1") >= 0 : o.indexOf("2") >= 0;
                            }
                            var r = {
                                appId: e.appID,
                                path: e.defaultUrl,
                                logo: e.logo,
                                mediumPic: e.midPic,
                                largePic: e.maxPic,
                                animLogo: Array.isArray(e.logoList) && e.logoList.length > 0 ? e.logoList : void 0,
                                qrCode: e.qrCodePic,
                                name: e.programName,
                                description: e.description,
                                support: t,
                                isHot: 1 === e.isHot,
                                isNew: 1 === e.isNew
                            };
                            return r.logo.indexOf(".gif") >= 0 && (e.staticLogo ? r.logo = e.staticLogo : e.roundedLogo ? r.logo = e.roundedLogo : r.logo = void 0), 
                            r;
                        }).filter(function(e) {
                            return e.support;
                        });
                    }), t.navData = r, r[e];
                });
            }, e;
        }();
        o.default = h, cc._RF.pop();
    }, {
        "../../Libs/babybus/network/ajax": "ajax",
        "../../Libs/babybus/network/signature": "signature",
        "../../Libs/babybus/network/systemInfo": "systemInfo",
        "../../Libs/babybus/network/userAgent": "userAgent",
        "../../Script/Config/AppConfig": "AppConfig"
    } ],
    ParticleCtrl: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "406c760Te9IuKOAtimlwh2j", "ParticleCtrl"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = r.property, a = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.particle = null, t.starSpriteFrames = [], t;
            }
            return __extends(t, e), t.prototype.init = function(e) {
                this.particle.spriteFrame = this.starSpriteFrames[e], this.particle.resetSystem();
            }, __decorate([ n(cc.ParticleSystem) ], t.prototype, "particle", void 0), __decorate([ n(cc.SpriteFrame) ], t.prototype, "starSpriteFrames", void 0), 
            t = __decorate([ i ], t);
        }(cc.Component);
        o.default = a, cc._RF.pop();
    }, {} ],
    Pass: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "23f1aA+J35B9aiJjh/JDQJp", "Pass"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../Game/GameData"), i = e("../Game/Audio"), n = cc._decorator, a = n.ccclass, s = n.property, c = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.label = null, t.starsImg = [], t.star = null, t.shadow = null, t.audio = null, 
                t.pass_label = 0, t.showShadow = !0, t;
            }
            return __extends(t, e), t.prototype.start = function() {}, t.prototype.init = function(e, t, o) {
                void 0 === t && (t = 0), void 0 === o && (o = !1), this.pass_label = e, this.showShadow = o, 
                this.label.getComponent(cc.Label).string = e, this.star.getComponent(cc.Sprite).spriteFrame = this.starsImg[t], 
                o && (this.label.active = !1), this.shadow.active = o;
            }, t.prototype.gotoGame = function() {
                this.showShadow ? console.debug("地图未开启，无法跳转") : (this.audio.playCommonClick(), r.default.nowPass = this.pass_label, 
                cc.director.loadScene("Game"));
            }, __decorate([ s(cc.Node) ], t.prototype, "label", void 0), __decorate([ s(cc.SpriteFrame) ], t.prototype, "starsImg", void 0), 
            __decorate([ s(cc.Node) ], t.prototype, "star", void 0), __decorate([ s(cc.Node) ], t.prototype, "shadow", void 0), 
            __decorate([ s(i.default) ], t.prototype, "audio", void 0), t = __decorate([ a ], t);
        }(cc.Component);
        o.default = c, cc._RF.pop();
    }, {
        "../Game/Audio": "Audio",
        "../Game/GameData": "GameData"
    } ],
    Point: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "cc1efe9Y3ZDLrA4piih+VqH", "Point"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = function() {
            return function(e, t) {
                this.x = e, this.y = t;
            };
        }();
        o.default = r, cc._RF.pop();
    }, {} ],
    Progress: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "34403uzbD9AYJeKVBZkBKtV", "Progress"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./Game"), i = cc._decorator, n = i.ccclass, a = i.property, s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.progress = 1, t.game = null, t.initialUnitTime = .01, t.unitTime = 0, t;
            }
            return __extends(t, e), t.prototype.start = function() {}, t.prototype.onLoad = function() {
                this.onTimer();
            }, t.prototype.onDestroy = function() {
                this.offTimer();
            }, t.prototype.setProgress = function() {
                this.progress = this.progress >= 1 ? 1 : this.progress, this.progress = this.progress <= 0 ? 0 : this.progress, 
                0 == this.progress && (this.unscheduleAllCallbacks(), this.game.showEndlessShadow()), 
                this.node.x = -this.node.width + this.node.width * this.progress / 1;
            }, t.prototype.timerBegin = function() {
                this.game.canClick && (this.changeUnitTime(), console.debug("进度页持续变化"), this.progress = this.progress - this.unitTime, 
                this.setProgress());
            }, t.prototype.changeUnitTime = function() {
                this.unitTime = this.initialUnitTime + .001 * Math.floor(this.game.score / 2e3);
            }, t.prototype.createTwoNode = function() {
                this.game.canClick && this.game.createTwoNode();
            }, t.prototype.addTime = function() {
                this.progress = this.progress + .02, this.setProgress();
            }, t.prototype.offTimer = function() {
                this.unscheduleAllCallbacks();
            }, t.prototype.onTimer = function() {
                this.schedule(this.timerBegin, 1), this.schedule(this.createTwoNode, 5);
            }, __decorate([ a(r.default) ], t.prototype, "game", void 0), t = __decorate([ n ], t);
        }(cc.Component);
        o.default = s, cc._RF.pop();
    }, {
        "./Game": "Game"
    } ],
    ShareUtils: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "159866klr1D+7EnngXwXphR", "ShareUtils"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../Libs/babybus/dataAnalysis/reporter"), i = e("./Config/DataAnalysisConfig"), n = [ "[有人@你]这个游戏有毒，我只玩了999次", "这个游戏我不太会玩，你看下能过几关？", "你想静静，我只想连连连！", "安排好了！ 只管来玩！", "我的小宝贝在吗？一起玩游戏吗？" ], a = [ "https://wx-xcx-tools.amijiaoyu.com/MiniGame/qqllk/share/1.png" ], s = function() {
            function e() {
                this.hasInit = !1, this.shareTimeStamp = 0, this.reporter = null, this.reporter = r.default.getInstance();
            }
            return e.getInstance = function() {
                return e.INSTANCE || (e.INSTANCE = new e()), this.INSTANCE;
            }, e.prototype.getShareInfo = function(e) {
                var t = Math.floor(Math.random() * n.length), o = Math.floor(Math.random() * a.length);
                return {
                    title: n[t],
                    imageUrl: a[o],
                    query: "TDChannelId=" + e + "&SharePic=" + (o + 1)
                };
            }, e.prototype.init = function() {
                var e = this;
                cc.sys.platform !== cc.sys.WECHAT_GAME || this.hasInit || (this.hasInit = !0, wx.showShareMenu({
                    success: function() {
                        console.debug("配置分享菜单"), wx.onShareAppMessage(function() {
                            var t = e.getShareInfo("menu");
                            return r.default.getInstance().reportShare(t.title, "share"), t;
                        });
                    },
                    fail: function(e) {
                        console.error("显示分享菜单失败", e);
                    }
                }), wx.onShow(function() {
                    if (e.shareTimeStamp) {
                        var t = Date.now() - e.shareTimeStamp;
                        if (e.shareTimeStamp = 0, t >= 1500) {
                            if (e.successCb) try {
                                e.reporter.reportAnalytics(i.default.eventNames.SHARE_RESULT, {
                                    type: "success"
                                }), e.successCb();
                            } catch (e) {
                                console.error("分享成功回调报错", e);
                            } finally {
                                e.successCb = void 0;
                            }
                        } else if (e.failCb) try {
                            e.reporter.reportAnalytics(i.default.eventNames.SHARE_RESULT, {
                                type: "fail"
                            }), e.failCb();
                        } catch (e) {
                            console.error("分享失败回调报错", e);
                        } finally {
                            e.failCb = void 0;
                        }
                    }
                }));
            }, e.prototype.share = function(e) {
                if (void 0 === e && (e = {
                    title: "",
                    imageUrl: "",
                    query: "",
                    path: "",
                    channel: "",
                    success: void 0,
                    fail: void 0
                }), cc.sys.platform == cc.sys.WECHAT_GAME) {
                    var t = e.title ? {
                        title: e.title,
                        imageUrl: e.imageUrl,
                        query: e.query
                    } : this.getShareInfo(e.channel || "active");
                    r.default.getInstance().reportShare(t.title, e.path || "share-active"), this.successCb = e.success, 
                    this.failCb = e.fail, this.shareTimeStamp = Date.now(), wx.shareAppMessage(t);
                }
            }, e;
        }();
        o.default = s, cc._RF.pop();
    }, {
        "../Libs/babybus/dataAnalysis/reporter": "reporter",
        "./Config/DataAnalysisConfig": "DataAnalysisConfig"
    } ],
    StarConfig: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "8a4e704nSVNe7/h4lKQDB87", "StarConfig"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        o.default = {
            starScoreCellSize: 45,
            cellSize: 85,
            matrixRow: 8,
            matrixCol: 8,
            totalColors: [ 0, 1, 2, 3, 4 ]
        }, cc._RF.pop();
    }, {} ],
    SubContextHelper: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "03db8tCe15MrLNAPmKAIvK9", "SubContextHelper"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = function() {
            function e() {
                cc.sys.platform === cc.sys.WECHAT_GAME && window.wx && "function" == typeof wx.getOpenDataContext ? this.context = wx.getOpenDataContext() : console.error("不支持与微信子域通信");
            }
            return e.getInstance = function() {
                return e.sInstance;
            }, e.prototype.onWelcomeLoaded = function() {
                this.context && this.context.postMessage({
                    command: "showRank"
                });
            }, e.prototype.updateScore = function(e) {
                if (this.context) {
                    if ("number" != typeof e || e < 0) throw new Error("分数无效，" + e);
                    this.context.postMessage({
                        command: "updateScore",
                        score: e
                    });
                }
            }, e.sInstance = new e(), e;
        }();
        o.default = r, cc._RF.pop();
    }, {} ],
    Transformer: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "d2e31H9WM5Lrp5PbbnFzgx2", "Transformer"), Object.defineProperty(o, "__esModule", {
            value: !0
        }), cc._RF.pop();
    }, {} ],
    Utils: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "0af58A16z9EFpIwdoqyKNxX", "Utils"), Object.defineProperty(o, "__esModule", {
            value: !0
        }), o.default = {
            shuffle: function(e) {
                for (var t, o, r = e.length; r; ) o = e[t = Math.floor(Math.random() * r--)], e[t] = e[r], 
                e[r] = o;
                return e;
            }
        }, cc._RF.pop();
    }, {} ],
    Welcome: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "b5cffR5sKNLw7mYIWwLzC2R", "Welcome"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../Game/GameData"), i = e("../ShareUtils"), n = e("../SubContextHelper"), a = e("../Game/Audio"), s = e("../App"), c = cc._decorator, u = c.ccclass, l = c.property, d = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.rankShadow = null, t.audio = null, t;
            }
            return __extends(t, e), t.prototype.onLoad = function() {
                console.log("初始化APP"), s.default.init(), window.wx && wx.triggerGC(), i.default.getInstance().init(), 
                n.default.getInstance().onWelcomeLoaded(), this.audio.playBg();
            }, t.prototype.start = function() {
                cc.director.preloadScene("Game", function() {}), cc.director.preloadScene("Choose", function() {});
            }, t.prototype.onDestroy = function() {}, t.prototype.GotoSelect = function() {
                this.audio.playCommonClick(), cc.director.loadScene("Choose");
            }, t.prototype.GotoEndless = function() {
                this.audio.playCommonClick(), r.default.nowPass = -1, cc.director.loadScene("Game");
            }, t.prototype.showRanking = function() {
                this.audio.playCommonClick(), this.rankShadow.active = !0;
            }, t.prototype.hideRanking = function() {
                this.audio.playCommonClick(), this.rankShadow.active = !1;
            }, t.prototype.inviteFriend = function() {
                this.audio.playCommonClick(), i.default.getInstance().share();
            }, t.prototype.setBgImg = function() {}, __decorate([ l(cc.Node) ], t.prototype, "rankShadow", void 0), 
            __decorate([ l(a.default) ], t.prototype, "audio", void 0), t = __decorate([ u ], t);
        }(cc.Component);
        o.default = d, cc._RF.pop();
    }, {
        "../App": "App",
        "../Game/Audio": "Audio",
        "../Game/GameData": "GameData",
        "../ShareUtils": "ShareUtils",
        "../SubContextHelper": "SubContextHelper"
    } ],
    ajax: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "498deAdS7NP/Iy3yk4iK28Y", "ajax"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../babybusUtils"), i = e("../dataAnalysis/reporter"), n = e("./cookieHelper"), a = e("./systemInfo"), s = function() {
            function e(e, t, o) {
                void 0 === o && (o = !0), this.reportFail = !0, this.signature = e, this.userAgent = t, 
                this.reportFail = o;
            }
            return e.prototype.get = function(e, t) {
                var o = this;
                return void 0 === t && (t = {}), this.systemInfo || (this.systemInfo = a.default.getInstance()), 
                new Promise(function(r, i) {
                    if (!o.systemInfo.isConnected()) return console.debug("网络已断开，" + e + " 无需请求"), void i(new Error("当前网络已断开，请检查网络设置！"));
                    o.request(o.signature, o.userAgent, e, t, "GET", "json", r, i);
                });
            }, e.prototype.post = function(e, t) {
                var o = this;
                return void 0 === t && (t = {}), this.systemInfo || (this.systemInfo = a.default.getInstance()), 
                new Promise(function(r, i) {
                    if (!o.systemInfo.isConnected()) return console.debug("网络已断开，" + e + " 无需请求"), void i(new Error("当前网络已断开，请检查网络设置！"));
                    o.request(o.signature, o.userAgent, e, t, "POST", "json", r, i);
                });
            }, e.prototype.request = function(e, t, o, i, a, s, u, l) {
                var d = this;
                void 0 === s && (s = "json"), console.debug("#### " + o + " 开始请求...", i);
                try {
                    var p = +new Date(), f = function(e, t, o, i) {
                        var a = e.concatSortParams(t.getUserAgent()), s = e.encryptXxTea(a), c = e.signMd5(s, !1), u = (+new Date()).toString(), l = "", d = "";
                        if (i) {
                            var p = JSON.stringify(i, function(e, t) {
                                return null === t ? void 0 : t;
                            });
                            d = e.encryptXxTea(p), l = e.signMd5(d, !1);
                        }
                        var f = {
                            ProductID: t.getProductId(),
                            HeaderMD5: c,
                            SignatureStamp: u,
                            EncryptType: 1,
                            AccessToken: r.uuidNoSeperator(),
                            ContentMD5: l
                        }, h = e.concatSortParams(f), g = e.signMd5(h.toLocaleLowerCase(), !0);
                        f.SignatureMD5 = g;
                        var m = e.concatSortParams(f), y = {
                            ClientHeaderInfo: s,
                            "Content-Type": "application/octet-stream"
                        }, v = n.addCookiesToHeader(o);
                        v.extraHeader && (y = __assign({}, y, v.extraHeader));
                        return {
                            url: o + (o.indexOf("?") > -1 ? "&" : "?") + m,
                            data: d,
                            header: y,
                            domain: v.domain
                        };
                    }(e, t, o, i), h = new XMLHttpRequest();
                    h.onreadystatechange = function() {
                        4 === h.readyState && (h.status >= 200 && h.status < 400 ? d.decrypyResponse(e, h, u, l, o, i, f.domain) : (console.error("#### " + o + " 请求失败：", h.status, h.responseText), 
                        d.systemInfo.isConnected() && d.reportFail && c("request_failed", {
                            url: o,
                            data: JSON.stringify(i),
                            fail_type: "请求失败状态回调",
                            info: h.responseText
                        }), l && l(new Error("网络不给力，请检查网络设置！"))));
                    };
                    var g = function() {
                        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                        console.error("#### " + o + " 请求失败：", e), d.systemInfo.isConnected() && d.reportFail && c("request_failed", {
                            url: o,
                            data: JSON.stringify(i),
                            fail_type: "请求失败网络异常",
                            info: JSON.stringify(e)
                        }), l && l(new Error("网络不给力，请检查网络设置！"));
                    }, m = function() {
                        console.debug("#### " + o + " 请求完成！"), console.debug("#### " + o + " 本次请求耗时：", +new Date() - p, "ms"), 
                        h.removeEventListener("error", g), h.removeEventListener("loadend", m);
                    };
                    for (var y in h.addEventListener("error", g), h.addEventListener("loadend", m), 
                    h.open(a, f.url, !0), f.header) h.setRequestHeader(y, f.header[y]), console.debug("#### " + o + " header " + y + ": " + f.header[y]);
                    h.send(f.data);
                } catch (e) {
                    console.error("#### 请求失败：", e), this.reportFail && c("request_failed", {
                        url: o,
                        data: JSON.stringify(i),
                        fail_type: "代码出错",
                        info: JSON.stringify(e)
                    }), l && l(e);
                }
            }, e.prototype.decrypyResponse = function(e, t, o, r, i, a, s) {
                try {
                    n.processCookiesFromHeader(t, s);
                } catch (e) {
                    console.error("#### cookie解析失败：", e), this.reportFail && c("cookie_parse_failed", {
                        url: i,
                        data: JSON.stringify(a),
                        fail_type: "cookie解析失败",
                        info: JSON.stringify({
                            result: t.response,
                            error: e
                        })
                    });
                }
                try {
                    var u = e.decryptXxTea(t.responseText), l = JSON.parse(u);
                    "0" == l.resultCode ? (console.debug("#### 请求返回数据：", l.data), o && o(l.data)) : (console.error("#### " + i + " 请求失败：", {
                        resultCode: l.resultCode,
                        resultMessage: l.resultMessage
                    }), this.reportFail && c("request_failed", {
                        url: i,
                        data: JSON.stringify(a),
                        fail_type: "非0结果码",
                        info: JSON.stringify({
                            resultCode: l.resultCode,
                            resultMessage: l.resultMessage
                        })
                    }), r && r(new Error("服务器错误（" + l.resultCode + "），请稍后再试！")));
                } catch (e) {
                    console.error("#### " + i + " 解密失败：", e), this.reportFail && c("request_failed", {
                        url: i,
                        data: JSON.stringify(a),
                        fail_type: "解密失败",
                        info: JSON.stringify({
                            result: t.response,
                            error: e
                        })
                    }), r && r(new Error("数据解析失败，请稍后再试！"));
                }
            }, e;
        }();
        function c(e, t) {
            i.default.getInstance().reportAnalytics(e, t);
        }
        o.default = s, cc._RF.pop();
    }, {
        "../babybusUtils": "babybusUtils",
        "../dataAnalysis/reporter": "reporter",
        "./cookieHelper": "cookieHelper",
        "./systemInfo": "systemInfo"
    } ],
    babybusUtils: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "76b18V9k8VLQ6Eo1pvU3eW6", "babybusUtils"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", i = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx";
        function n(e) {
            void 0 === e && (e = r);
            var t = "";
            return t || (t = e.replace(/[xy]/g, function(e) {
                var t = 16 * Math.random() | 0;
                return ("x" == e ? t : 3 & t | 8).toString(16);
            })), t;
        }
        o.uuid = n, o.uuidNoSeperator = function() {
            return n(i);
        }, o.compareVersion = function(e, t) {
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
        o.StorageAdapter = a, cc._RF.pop();
    }, {} ],
    cookieHelper: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "bf512otZa9Mz7LoXJmwcFHs", "cookieHelper"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = new (e("../../cookie/CookieStore").default)();
        o.addCookiesToHeader = function(e) {
            var t, o = (e || "").split("/")[2], i = e.split(o).pop(), n = r.getRequestCookies(o, i);
            return n && ((t = {}).Cookie = n, t["X-Requested-With"] = "XMLHttpRequest", t.Accept = "application/json, text/plain, */*"), 
            {
                domain: o,
                extraHeader: t
            };
        }, o.processCookiesFromHeader = function(e, t) {
            var o = e.getResponseHeader("Set-Cookie") || e.getResponseHeader("set-cookie") || "";
            o && r.setResponseCookies(o, t);
        }, o.getCookie = r.getCookie.bind(r), cc._RF.pop();
    }, {
        "../../cookie/CookieStore": "CookieStore"
    } ],
    guide: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "af54fzBfBZFipVmZGIuZ3ud", "guide"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./GameData"), i = cc._decorator, n = i.ccclass, a = i.property, s = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.guideSprite = null, t.guideSpriteFrames = [], t._clickTime = 0, t;
            }
            return __extends(t, e), t.prototype.start = function() {
                "0" == r.default.isFirstTime ? (this.node.active = !0, localStorage.setItem("isFirstTime", "1"), 
                r.default.isFirstTime = localStorage.getItem("isFirstTime")) : this.node.active = !1, 
                this.guideSprite.spriteFrame = this.guideSpriteFrames[this._clickTime];
            }, t.prototype.click = function() {
                this._clickTime++, this._clickTime >= 2 ? this.node.active = !1 : this.guideSprite.spriteFrame = this.guideSpriteFrames[this._clickTime];
            }, __decorate([ a(cc.Sprite) ], t.prototype, "guideSprite", void 0), __decorate([ a(cc.SpriteFrame) ], t.prototype, "guideSpriteFrames", void 0), 
            t = __decorate([ n ], t);
        }(cc.Component);
        o.default = s, cc._RF.pop();
    }, {
        "./GameData": "GameData"
    } ],
    "md5.min": [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "de556WTzE5DUYsMXbmK8Dp6", "md5.min");
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        };
        !function(e) {
            function o(e, t) {
                var o = (65535 & e) + (65535 & t);
                return (e >> 16) + (t >> 16) + (o >> 16) << 16 | 65535 & o;
            }
            function i(e, t, r, i, n, a) {
                return o(function(e, t) {
                    return e << t | e >>> 32 - t;
                }(o(o(t, e), o(i, a)), n), r);
            }
            function n(e, t, o, r, n, a, s) {
                return i(t & o | ~t & r, e, t, n, a, s);
            }
            function a(e, t, o, r, n, a, s) {
                return i(t & r | o & ~r, e, t, n, a, s);
            }
            function s(e, t, o, r, n, a, s) {
                return i(t ^ o ^ r, e, t, n, a, s);
            }
            function c(e, t, o, r, n, a, s) {
                return i(o ^ (t | ~r), e, t, n, a, s);
            }
            function u(e, t) {
                e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
                var r, i, u, l, d, p = 1732584193, f = -271733879, h = -1732584194, g = 271733878;
                for (r = 0; r < e.length; r += 16) i = p, u = f, l = h, d = g, f = c(f = c(f = c(f = c(f = s(f = s(f = s(f = s(f = a(f = a(f = a(f = a(f = n(f = n(f = n(f = n(f, h = n(h, g = n(g, p = n(p, f, h, g, e[r], 7, -680876936), f, h, e[r + 1], 12, -389564586), p, f, e[r + 2], 17, 606105819), g, p, e[r + 3], 22, -1044525330), h = n(h, g = n(g, p = n(p, f, h, g, e[r + 4], 7, -176418897), f, h, e[r + 5], 12, 1200080426), p, f, e[r + 6], 17, -1473231341), g, p, e[r + 7], 22, -45705983), h = n(h, g = n(g, p = n(p, f, h, g, e[r + 8], 7, 1770035416), f, h, e[r + 9], 12, -1958414417), p, f, e[r + 10], 17, -42063), g, p, e[r + 11], 22, -1990404162), h = n(h, g = n(g, p = n(p, f, h, g, e[r + 12], 7, 1804603682), f, h, e[r + 13], 12, -40341101), p, f, e[r + 14], 17, -1502002290), g, p, e[r + 15], 22, 1236535329), h = a(h, g = a(g, p = a(p, f, h, g, e[r + 1], 5, -165796510), f, h, e[r + 6], 9, -1069501632), p, f, e[r + 11], 14, 643717713), g, p, e[r], 20, -373897302), h = a(h, g = a(g, p = a(p, f, h, g, e[r + 5], 5, -701558691), f, h, e[r + 10], 9, 38016083), p, f, e[r + 15], 14, -660478335), g, p, e[r + 4], 20, -405537848), h = a(h, g = a(g, p = a(p, f, h, g, e[r + 9], 5, 568446438), f, h, e[r + 14], 9, -1019803690), p, f, e[r + 3], 14, -187363961), g, p, e[r + 8], 20, 1163531501), h = a(h, g = a(g, p = a(p, f, h, g, e[r + 13], 5, -1444681467), f, h, e[r + 2], 9, -51403784), p, f, e[r + 7], 14, 1735328473), g, p, e[r + 12], 20, -1926607734), h = s(h, g = s(g, p = s(p, f, h, g, e[r + 5], 4, -378558), f, h, e[r + 8], 11, -2022574463), p, f, e[r + 11], 16, 1839030562), g, p, e[r + 14], 23, -35309556), h = s(h, g = s(g, p = s(p, f, h, g, e[r + 1], 4, -1530992060), f, h, e[r + 4], 11, 1272893353), p, f, e[r + 7], 16, -155497632), g, p, e[r + 10], 23, -1094730640), h = s(h, g = s(g, p = s(p, f, h, g, e[r + 13], 4, 681279174), f, h, e[r], 11, -358537222), p, f, e[r + 3], 16, -722521979), g, p, e[r + 6], 23, 76029189), h = s(h, g = s(g, p = s(p, f, h, g, e[r + 9], 4, -640364487), f, h, e[r + 12], 11, -421815835), p, f, e[r + 15], 16, 530742520), g, p, e[r + 2], 23, -995338651), h = c(h, g = c(g, p = c(p, f, h, g, e[r], 6, -198630844), f, h, e[r + 7], 10, 1126891415), p, f, e[r + 14], 15, -1416354905), g, p, e[r + 5], 21, -57434055), h = c(h, g = c(g, p = c(p, f, h, g, e[r + 12], 6, 1700485571), f, h, e[r + 3], 10, -1894986606), p, f, e[r + 10], 15, -1051523), g, p, e[r + 1], 21, -2054922799), h = c(h, g = c(g, p = c(p, f, h, g, e[r + 8], 6, 1873313359), f, h, e[r + 15], 10, -30611744), p, f, e[r + 6], 15, -1560198380), g, p, e[r + 13], 21, 1309151649), h = c(h, g = c(g, p = c(p, f, h, g, e[r + 4], 6, -145523070), f, h, e[r + 11], 10, -1120210379), p, f, e[r + 2], 15, 718787259), g, p, e[r + 9], 21, -343485551), 
                p = o(p, i), f = o(f, u), h = o(h, l), g = o(g, d);
                return [ p, f, h, g ];
            }
            function l(e) {
                var t, o = "", r = 32 * e.length;
                for (t = 0; t < r; t += 8) o += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
                return o;
            }
            function d(e) {
                var t, o = [];
                for (o[(e.length >> 2) - 1] = void 0, t = 0; t < o.length; t += 1) o[t] = 0;
                var r = 8 * e.length;
                for (t = 0; t < r; t += 8) o[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
                return o;
            }
            function p(e) {
                var t, o, r = "";
                for (o = 0; o < e.length; o += 1) t = e.charCodeAt(o), r += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
                return r;
            }
            function f(e) {
                return unescape(encodeURIComponent(e));
            }
            function h(e) {
                return function(e) {
                    return l(u(d(e), 8 * e.length));
                }(f(e));
            }
            function g(e, t) {
                return function(e, t) {
                    var o, r, i = d(e), n = [], a = [];
                    for (n[15] = a[15] = void 0, i.length > 16 && (i = u(i, 8 * e.length)), o = 0; o < 16; o += 1) n[o] = 909522486 ^ i[o], 
                    a[o] = 1549556828 ^ i[o];
                    return r = u(n.concat(d(t)), 512 + 8 * t.length), l(u(a.concat(r), 640));
                }(f(e), f(t));
            }
            function m(e, t, o) {
                return t ? o ? g(t, e) : function(e, t) {
                    return p(g(e, t));
                }(t, e) : o ? h(e) : function(e) {
                    return p(h(e));
                }(e);
            }
            "function" == typeof define && define.amd ? define(function() {
                return m;
            }) : "object" == (void 0 === t ? "undefined" : r(t)) && t.exports ? t.exports = m : e.md5 = m;
        }(void 0), cc._RF.pop();
    }, {} ],
    reporter: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "2a7cedHv8lI4rczhpG3gIjp", "reporter"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = function() {
            function e() {
                if (cc.sys.platform !== cc.sys.WECHAT_GAME || !window.GameGlobal || !window.GameGlobal.tdAppSdk) throw new Error("TD未正常引用及配置（仅微信小游戏环境支持）");
                this.tdAppSdk = window.GameGlobal.tdAppSdk;
            }
            return e.prototype.pageOnShow = function(e) {}, e.prototype.reportAnalytics = function(e, t) {
                this.tdAppSdk.event({
                    id: e,
                    params: t
                });
            }, e.prototype.reportShare = function(e, t) {
                this.tdAppSdk.share({
                    title: e,
                    path: t
                });
            }, e;
        }();
        o.TalkingDataAdapter = r;
        var i = function() {
            function e() {
                this.delegators = [];
            }
            return e.getInstance = function() {
                return e.INSTANCE || (e.INSTANCE = new e()), this.INSTANCE;
            }, e.prototype.addDelegator = function(e) {
                this.delegators.push(e);
            }, e.prototype.pageOnShow = function(e) {
                if (!e) throw new Error("[DA] 无效页面路径 " + e);
                console.debug("[DA] 页面展示", e), this.delegators.forEach(function(t) {
                    try {
                        t.pageOnShow(e);
                    } catch (e) {
                        console.error("[DA] 界面显示统计出错", e);
                    }
                });
            }, e.prototype.reportAnalytics = function(e, t) {
                if (!e) throw new Error("[DA] 参数无效，事件名为空");
                console.debug("[DA] 上报事件", e, t), this.delegators.forEach(function(o) {
                    try {
                        o.reportAnalytics(e, t);
                    } catch (e) {
                        console.error("[DA] 上报事件出错", e);
                    }
                });
            }, e.prototype.reportShare = function(e, t) {
                if (void 0 === t && (t = ""), !e) throw new Error("参数无效，标题为空");
                console.debug("[DA] 上报分享", e, t), this.delegators.forEach(function(o) {
                    try {
                        o.reportShare(e, t);
                    } catch (e) {
                        console.error("[DA] 上报分享出错", e);
                    }
                });
            }, e;
        }();
        o.default = i, cc._RF.pop();
    }, {} ],
    rightMove: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "a08613kL1FGiKuVTicpC5Vy", "rightMove"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../GameData"), i = function(e) {
            function t(t) {
                return e.call(this, t) || this;
            }
            return __extends(t, e), t.prototype.transform = function(e) {
                for (var t = this, o = cc.find("/Canvas").getComponent("Game"), i = 1; i < this.mapConfig.row - 1; i++) for (var n = i % (this.mapConfig.row - 2) + 1, a = 1; a < this.mapConfig.col - 1; a++) {
                    this.starMatrix[n][a] = r.default.starMatrix[i][a];
                    var s = r.default.starNodeArr[i][a];
                    this.starNodeArr[n][a] = s, s && s.getComponent("starCtr").move(o.setStarV2(this.mapConfig, n, a), n, a, this.moveTime);
                }
                o.scheduleOnce(function() {
                    r.default.starNodeArr = t.starNodeArr.slice(), r.default.starMatrix = t.starMatrix.slice(), 
                    e();
                }, this.moveTime + .1);
            }, t;
        }(e("./MoveFather").default);
        o.default = i, cc._RF.pop();
    }, {
        "../GameData": "GameData",
        "./MoveFather": "MoveFather"
    } ],
    scoreAni: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "ba91c9MZHdOzJORz10CbD4e", "scoreAni"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = r.property, a = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.label = null, t;
            }
            return __extends(t, e), t.prototype.start = function() {}, t.prototype.init = function(e) {
                this.label.string = e + "";
            }, __decorate([ n(cc.Label) ], t.prototype, "label", void 0), t = __decorate([ i ], t);
        }(cc.Component);
        o.default = a, cc._RF.pop();
    }, {} ],
    "set-cookie": [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "3a4e7uWyudCAJBow+uqCMpu", "set-cookie"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = {
            decodeValues: !0
        };
        function i(e, t) {
            return Object.keys(t).reduce(function(e, o) {
                return e[o] = t[o], e;
            }, e);
        }
        function n(e) {
            return "string" == typeof e && !!e.trim();
        }
        o.default = {
            parse: function(e, t) {
                if (!e) return [];
                e.headers && (e = e.headers["set-cookie"]), Array.isArray(e) || (e = [ e ]);
                var o = i({}, r);
                return t = t ? i(o, t) : o, e.filter(n).map(function(e) {
                    return function(e, t) {
                        var o = e.split(";").filter(n), r = o.shift().split("="), i = r.shift(), a = r.join("="), s = {
                            name: i,
                            value: t.decodeValues ? decodeURIComponent(a) : a
                        };
                        return o.forEach(function(e) {
                            var t = e.split("="), o = t.shift().trimLeft().toLowerCase(), r = t.join("=");
                            "expires" === o ? s.expires = new Date(r) : "max-age" === o ? s.maxAge = parseInt(r, 10) : "secure" === o ? s.secure = !0 : "httponly" === o ? s.httpOnly = !0 : "samesite" === o ? s.sameSite = r : s[o] = r;
                        }), s;
                    }(e, t);
                });
            },
            splitCookiesString: function(e) {
                if (Array.isArray(e)) return e;
                if ("string" != typeof e) return [];
                var t, o, r, i, n, a = [], s = 0;
                function c() {
                    for (;s < e.length && /\s/.test(e.charAt(s)); ) s += 1;
                    return s < e.length;
                }
                for (;s < e.length; ) {
                    for (t = s, n = !1; c(); ) if ("," === (o = e.charAt(s))) {
                        for (r = s, s += 1, c(), i = s; s < e.length && "=" !== (o = e.charAt(s)) && ";" !== o && "," !== o; ) s += 1;
                        s < e.length && "=" === e.charAt(s) ? (n = !0, s = i, a.push(e.substring(t, r)), 
                        t = s) : s = r + 1;
                    } else s += 1;
                    (!n || s >= e.length) && a.push(e.substring(t, e.length));
                }
                return a;
            }
        }, cc._RF.pop();
    }, {} ],
    signature: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "3c899rQ9kdO/JiATrLCSAKF", "signature"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../../xxtea.v3.js"), i = e("../../md5.min.js"), n = r.XxteaHelper, a = function() {
            function e(e, t) {
                this.signKey = e, this.xxTeaKey = t;
            }
            return e.prototype.signMd5 = function(e, t) {
                return t && (e = e.concat(this.signKey)), i(e);
            }, e.prototype.encryptXxTea = function(e) {
                return n.encryptToBase64(e, this.xxTeaKey);
            }, e.prototype.decryptXxTea = function(e) {
                return n.decryptFromBase64(e, this.xxTeaKey);
            }, e.prototype.concatSortParams = function(e) {
                for (var t = function(e) {
                    var t = [];
                    for (var o in e) t.push(o);
                    return t.sort().reverse(), t;
                }(e), o = [], r = [], i = t.length; i--; ) o.push(t[i] + "=" + e[t[i]]), r.push(t[i] + "=" + e[t[i]]);
                return r.join("&");
            }, e;
        }();
        o.default = a, cc._RF.pop();
    }, {
        "../../md5.min.js": "md5.min",
        "../../xxtea.v3.js": "xxtea.v3"
    } ],
    starCtr: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "66a53LsEGJJ8amG05qGxP54", "starCtr"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = cc._decorator, i = r.ccclass, n = r.property, a = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.starSprite = null, t.clickBgImg = [], t.clickBigBgImg = [], t.starSpriteFrames = [], 
                t.x = 0, t.y = 0, t.type = 0, t.ts = 0, t;
            }
            return __extends(t, e), t.prototype.start = function() {
                this.node.on(cc.Node.EventType.TOUCH_START, function(e) {
                    if (this.ts.canClick) return this.ts.isUseBomb ? (this.ts.changeItem(3, -1), this.ts.closeUseBomb(), 
                    void this.ts.removeOneTypePoint(this.type)) : void (this.ts._clickPoint.start !== this ? "start" == this.ts.starClickStatus ? (this.ts.audio.playCommonClick(), 
                    this.startFun()) : "end" == this.ts.starClickStatus && (this.ts.starClickStatus = "start", 
                    this.ts._clickPoint.end = this, this.ts.judgeRemove()) : console.debug("相同点重复点击"));
                }, this);
            }, t.prototype.onLoad = function() {
                this.ts = cc.find("/Canvas").getComponent("Game"), this.initImg();
            }, t.prototype.initImg = function() {
                this.node.getComponent(cc.Sprite).spriteFrame = 1 == this.ts.mapConfig.gridType ? this.clickBgImg[0] : this.clickBigBgImg[0];
            }, t.prototype.initStar = function(e, t, o) {
                -1 != e && (this.type = e, this.starSprite.spriteFrame = this.starSpriteFrames[this.type], 
                this.updateGrid(t, o));
            }, t.prototype.lightBg = function() {
                this.node.getComponent(cc.Sprite).spriteFrame = 1 == this.ts.mapConfig.gridType ? this.clickBgImg[1] : this.clickBigBgImg[1];
            }, t.prototype.darkBg = function() {
                this.initImg(), this.ts.starClickStatus = "start";
            }, t.prototype.startFun = function(e) {
                this.ts.starClickStatus = "end", this.ts._clickPoint.start = this, this.lightBg();
            }, t.prototype.move = function(e, t, o, r) {
                void 0 === r && (r = .5), this.x = t, this.y = o;
                var i = cc.moveTo(r, e);
                this.node.runAction(i);
            }, t.prototype.updateGrid = function(e, t) {
                this.x = e, this.y = t;
            }, t.prototype.removeSelf = function() {
                cc.removeSelf();
            }, __decorate([ n(cc.Sprite) ], t.prototype, "starSprite", void 0), __decorate([ n(cc.SpriteFrame) ], t.prototype, "clickBgImg", void 0), 
            __decorate([ n(cc.SpriteFrame) ], t.prototype, "clickBigBgImg", void 0), __decorate([ n(cc.SpriteFrame) ], t.prototype, "starSpriteFrames", void 0), 
            t = __decorate([ i ], t);
        }(cc.Component);
        o.default = a, cc._RF.pop();
    }, {} ],
    systemInfo: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "dc00a6YL0pH5L1e47vZYeh1", "systemInfo"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("./user"), i = {
            none: -1,
            unknown: 0,
            wifi: 1,
            "2g": 2,
            "3g": 3,
            "4g": 4
        }, n = function() {
            function e() {
                var e;
                if (window.wx) e = wx.getSystemInfoSync(); else {
                    var t = cc.view.getVisibleSizeInPixel();
                    e = {
                        platform: "unknown",
                        system: cc.sys.osVersion,
                        model: "unknown",
                        language: cc.sys.language,
                        screenWidth: t.width,
                        screenHeight: t.height,
                        brand: "unknown",
                        version: cc.sys.browserVersion,
                        SDKVersion: "unknown"
                    };
                }
                this.wxSystemInfo = e, this.info = {
                    OSType: "android" === e.platform.toLocaleLowerCase() ? 2 : 1,
                    Token: "",
                    TokenType: 0,
                    RunVer: e.version,
                    RunSDKVer: e.SDKVersion,
                    Screen: e.screenWidth + "*" + e.screenHeight,
                    DeviceLang: e.language,
                    AppLang: e.language,
                    JbFlag: 0,
                    OSVer: e.system,
                    DeviceModel: e.model,
                    DeviceType: 1,
                    Net: 0
                }, this._isConnected = !0, this._observeNetworkState();
            }
            return e.getInstance = function() {
                return e.INSTANCE || (e.INSTANCE = new e()), this.INSTANCE;
            }, e.prototype._observeNetworkState = function() {
                var e = this;
                if (window.wx) {
                    if ("function" != typeof wx.getNetworkType || "function" != typeof wx.onNetworkStatusChange) return void console.debug("Network status listener not support");
                    wx.getNetworkType({
                        success: function(t) {
                            e._isConnected = "none" !== t.networkType, e.info.Net = i[t.networkType] || 0, console.debug("当前网络状态", t.networkType, e._isConnected);
                        }
                    }), wx.onNetworkStatusChange(function(t) {
                        e._isConnected = !!t.isConnected, e.info.Net = i[t.networkType] || 0, console.debug("网络状态更新", t.networkType, t.isConnected);
                    });
                }
            }, e.prototype.getHeaderInfo = function() {
                var e = r.default.getInstance().openId;
                return e !== this.info.Token && (this.info.Token = e, console.debug("Token更新", e)), 
                this.info;
            }, e.prototype.isIphoneX = function() {
                return this.wxSystemInfo.model.indexOf("iPhone X") >= 0;
            }, e.prototype.isConnected = function() {
                return this._isConnected;
            }, e.prototype.isUsingData = function() {
                return 2 === this.info.Net || 3 === this.info.Net || 4 === this.info.Net;
            }, Object.defineProperty(e.prototype, "model", {
                get: function() {
                    return this.wxSystemInfo.model;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "pixelRatio", {
                get: function() {
                    return this.wxSystemInfo.pixelRatio;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "windowWidth", {
                get: function() {
                    return this.wxSystemInfo.windowWidth;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "windowHeight", {
                get: function() {
                    return this.wxSystemInfo.windowHeight;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "system", {
                get: function() {
                    return this.wxSystemInfo.system;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "language", {
                get: function() {
                    return this.wxSystemInfo.language;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "version", {
                get: function() {
                    return this.wxSystemInfo.version;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "screenWidth", {
                get: function() {
                    return this.wxSystemInfo.screenWidth;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "screenHeight", {
                get: function() {
                    return this.wxSystemInfo.screenHeight;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "SDKVersion", {
                get: function() {
                    return this.wxSystemInfo.SDKVersion;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "brand", {
                get: function() {
                    return this.wxSystemInfo.brand;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "fontSizeSetting", {
                get: function() {
                    return this.wxSystemInfo.fontSizeSetting;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "statusBarHeight", {
                get: function() {
                    return this.wxSystemInfo.statusBarHeight;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "platform", {
                get: function() {
                    return this.wxSystemInfo.platform;
                },
                enumerable: !0,
                configurable: !0
            }), e;
        }();
        o.default = n, cc._RF.pop();
    }, {
        "./user": "user"
    } ],
    usage: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "6fcc4JlqctFcrUboZ3FTrRI", "usage"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../babybusUtils"), i = "server.usage", n = function() {
            function e() {
                try {
                    this.info = r.StorageAdapter.getStorageSync(i);
                } catch (e) {
                    console.error("初始化使用情况失败", e);
                } finally {
                    this.info = this.info || {};
                }
            }
            return e.getInstance = function() {
                return e.sInstance || (e.sInstance = new e()), e.sInstance;
            }, e.prototype.hasInit = function() {
                return Object.keys(this.info).length > 0;
            }, e.prototype.update = function(e) {
                console.debug("更新使用情况", e), e && (this.info = __assign({}, e), r.StorageAdapter.setStorageSync(i, e));
            }, e.prototype.getHeaderInfo = function() {
                return this.info;
            }, e;
        }();
        o.default = n, cc._RF.pop();
    }, {
        "../babybusUtils": "babybusUtils"
    } ],
    userAgent: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "a45e7BiC+xAda8BLNAwcFxo", "userAgent"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../../../Script/Config/AppConfig"), i = e("../babybusUtils"), n = e("./systemInfo"), a = e("./usage"), s = e("./user"), c = i.uuid().replace(/-/g, ""), u = function() {
            function e() {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                if (!Array.isArray(e) || 0 === e.length) throw new Error("UserAgent缺少必要参数，至少要传递包含ProductID与ProjectID的对象");
                this.defaultUserAgent = 1 === e.length ? e[0] : e[1];
            }
            return e.prototype.init = function() {
                this.userInfo = s.default.getInstance(), this.systemInfo = n.default.getInstance(), 
                this.usage = a.default.getInstance();
                var e = "number" == typeof this.defaultUserAgent.PlatForm ? this.defaultUserAgent.PlatForm : 21;
                this.info = __assign({
                    HeadVerID: 1,
                    SessionID: c,
                    PlatForm: e,
                    ProjectID: r.default.projectId,
                    ProductID: "",
                    DataType: 2,
                    CHID: 1,
                    CHCode: "WechatApp",
                    VerID: r.default.versionCode,
                    VerCode: r.default.versionName
                }, this.defaultUserAgent);
            }, e.prototype.setUserAgent = function(e, t) {
                if (e || t) if (this.info || this.init(), e instanceof Object) {
                    e.Token;
                    var o = e.OpenID, r = __rest(e, [ "Token", "OpenID" ]);
                    o && this.userInfo.openId !== o && (console.debug("旧版方式设置UserAgent中的OpenId", o), 
                    this.userInfo.openId = o), r.length > 0 && (console.warn("旧版方式设置UserAgent的其他值", JSON.stringify(r)), 
                    this.info = __assign({}, this.info, r));
                } else "OpenID" === e && this.userInfo.openId !== t && (console.debug("旧版方式2设置UserAgent中的OpenId", t), 
                this.userInfo.openId = t);
            }, e.prototype.getUserAgent = function() {
                this.info || this.init();
                var e = __assign({}, this.userInfo.getHeaderInfo(), this.systemInfo.getHeaderInfo(), this.usage.getHeaderInfo(), this.info);
                return console.debug("#### 头部信息", e), e;
            }, e.prototype.getProductId = function() {
                return this.info ? this.info.ProductID : this.defaultUserAgent.ProductID;
            }, e;
        }();
        o.default = u, cc._RF.pop();
    }, {
        "../../../Script/Config/AppConfig": "AppConfig",
        "../babybusUtils": "babybusUtils",
        "./systemInfo": "systemInfo",
        "./usage": "usage",
        "./user": "user"
    } ],
    user: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "581d1T66fhB9498CIaan5yp", "user"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = e("../babybusUtils"), i = "user.openId", n = "user.bb.info", a = {
            AccountID: 0,
            LoginCode: "",
            LoginStamp: 0,
            LoginSignature: "",
            AccountIDSignature: ""
        }, s = function() {
            function e() {
                var e, t;
                try {
                    e = r.StorageAdapter.getStorageSync(i) || "", console.debug("openId初始结果", e || "空内容"), 
                    t = r.StorageAdapter.getStorageSync(n), console.debug("用户信息初始结果", t || "空内容");
                } catch (e) {
                    console.error("初始化OpenId及用户信息失败", e);
                } finally {
                    e = e || "", t = t || a;
                }
                this.info = __assign({}, t, {
                    OpenID: e
                });
            }
            return e.getInstance = function(t) {
                return void 0 === t && (t = i), e.INSTANCE || (e.INSTANCE = new e()), this.INSTANCE;
            }, Object.defineProperty(e.prototype, "accountId", {
                get: function() {
                    return this.info.AccountID;
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "openId", {
                get: function() {
                    return this.info.OpenID;
                },
                set: function(e) {
                    this.info.OpenID !== e && (this.info.OpenID = e, r.StorageAdapter.setStorage({
                        key: i,
                        data: e
                    }));
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.isLogin = function() {
                return this.info.AccountID > 0;
            }, e.prototype.update = function(e) {
                e && (this.info = __assign({}, this.info, e), r.StorageAdapter.setStorage({
                    key: n,
                    data: e
                }));
            }, e.prototype.reset = function() {
                this.info = __assign({}, a, {
                    OpenID: this.info.OpenID
                });
            }, e.prototype.getHeaderInfo = function() {
                return this.info;
            }, e;
        }();
        o.default = s, cc._RF.pop();
    }, {
        "../babybusUtils": "babybusUtils"
    } ],
    util: [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "84c7b6cW9BMAoP8fGA3FLEb", "util"), Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = function() {
            function e() {}
            return e.prototype.getCookieScopeDomain = function(e) {
                if (void 0 === e && (e = ""), !e) return [];
                var t = (e = e.replace(/^\.+/gi, "")).split(".").map(function(t) {
                    return [ ".", e.slice(e.indexOf(t)) ].join("");
                });
                return [ e ].concat(t);
            }, e;
        }();
        o.default = new r(), cc._RF.pop();
    }, {} ],
    "xxtea.v3": [ function(e, t, o) {
        "use strict";
        cc._RF.push(t, "16ed1KfrTRFNaiy88ncsuDc", "xxtea.v3");
        var r = function() {
            function e(e, t) {
                for (var o = 0; o < t.length; o++) {
                    var r = t[o];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                    Object.defineProperty(e, r.key, r);
                }
            }
            return function(t, o, r) {
                return o && e(t.prototype, o), r && e(t, r), t;
            };
        }();
        var i = function() {
            function e() {
                (function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                })(this, e);
            }
            return r(e, null, [ {
                key: "btoa",
                value: function(e) {
                    return this.btoaEncode(e);
                }
            }, {
                key: "btoaEncode",
                value: function(e) {
                    var t, o, r, i, n, a, s, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
                    for (o = r = 0, i = e.length, a = (i -= n = i % 3) / 3 << 2, n > 0 && (a += 4), 
                    t = new Array(a); o < i; ) s = e.charCodeAt(o++) << 16 | e.charCodeAt(o++) << 8 | e.charCodeAt(o++), 
                    t[r++] = c[s >> 18] + c[s >> 12 & 63] + c[s >> 6 & 63] + c[63 & s];
                    return 1 == n ? (s = e.charCodeAt(o++), t[r++] = c[s >> 2] + c[(3 & s) << 4] + "==") : 2 == n && (s = e.charCodeAt(o++) << 8 | e.charCodeAt(o++), 
                    t[r++] = c[s >> 10] + c[s >> 4 & 63] + c[(15 & s) << 2] + "="), t.join("");
                }
            }, {
                key: "atob",
                value: function(e) {
                    return this.atobDecode(e);
                }
            }, {
                key: "atobDecode",
                value: function(e) {
                    var t, o, r, i, n, a, s, c, u, l, d = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 ];
                    if ((s = e.length) % 4 != 0) return "";
                    if (/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\+\/\=]/.test(e)) return "";
                    for (u = s, (c = "=" == e.charAt(s - 2) ? 1 : "=" == e.charAt(s - 1) ? 2 : 0) > 0 && (u -= 4), 
                    u = 3 * (u >> 2) + c, l = new Array(u), n = a = 0; n < s && -1 != (t = d[e.charCodeAt(n++)]) && -1 != (o = d[e.charCodeAt(n++)]) && (l[a++] = String.fromCharCode(t << 2 | (48 & o) >> 4), 
                    -1 != (r = d[e.charCodeAt(n++)])) && (l[a++] = String.fromCharCode((15 & o) << 4 | (60 & r) >> 2), 
                    -1 != (i = d[e.charCodeAt(n++)])); ) l[a++] = String.fromCharCode((3 & r) << 6 | i);
                    return l.join("");
                }
            }, {
                key: "toBinaryString",
                value: function(e, t) {
                    var o = e.length, r = o << 2;
                    if (t) {
                        var i = e[o - 1];
                        if (i < (r -= 4) - 3 || i > r) return null;
                        r = i;
                    }
                    for (var n = 0; n < o; n++) e[n] = String.fromCharCode(255 & e[n], e[n] >>> 8 & 255, e[n] >>> 16 & 255, e[n] >>> 24 & 255);
                    var a = e.join("");
                    return t ? a.substring(0, r) : a;
                }
            }, {
                key: "toUint32Array",
                value: function(e, t) {
                    var o, r = e.length, i = r >> 2;
                    0 != (3 & r) && ++i, t ? (o = new Array(i + 1))[i] = r : o = new Array(i);
                    for (var n = 0; n < r; ++n) o[n >> 2] |= e.charCodeAt(n) << ((3 & n) << 3);
                    return o;
                }
            }, {
                key: "int32",
                value: function(e) {
                    return 4294967295 & e;
                }
            }, {
                key: "mx",
                value: function(e, t, o, r, i, n) {
                    return (o >>> 5 ^ t << 2) + (t >>> 3 ^ o << 4) ^ (e ^ t) + (n[3 & r ^ i] ^ o);
                }
            }, {
                key: "fixk",
                value: function(e) {
                    return e.length < 4 && (e.length = 4), e;
                }
            }, {
                key: "encryptUint32Array",
                value: function(e, t) {
                    var o, r, i, n, a, s, c = e.length, u = c - 1;
                    for (r = e[u], i = 0, s = 0 | Math.floor(6 + 52 / c); s > 0; --s) {
                        for (n = (i = this.int32(i + 2654435769)) >>> 2 & 3, a = 0; a < u; ++a) o = e[a + 1], 
                        r = e[a] = this.int32(e[a] + this.mx(i, o, r, a, n, t));
                        o = e[0], r = e[u] = this.int32(e[u] + this.mx(i, o, r, u, n, t));
                    }
                    return e;
                }
            }, {
                key: "decryptUint32Array",
                value: function(e, t) {
                    var o, r, i, n, a, s, c = e.length, u = c - 1;
                    for (o = e[0], s = Math.floor(6 + 52 / c), i = this.int32(2654435769 * s); 0 !== i; i = this.int32(i - 2654435769)) {
                        for (n = i >>> 2 & 3, a = u; a > 0; --a) r = e[a - 1], o = e[a] = this.int32(e[a] - this.mx(i, o, r, a, n, t));
                        r = e[u], o = e[0] = this.int32(e[0] - this.mx(i, o, r, 0, n, t));
                    }
                    return e;
                }
            }, {
                key: "utf8Encode",
                value: function(e) {
                    if (/^[\x00-\x7f]*$/.test(e)) return e;
                    for (var t = [], o = e.length, r = 0, i = 0; r < o; ++r, ++i) {
                        var n = e.charCodeAt(r);
                        if (n < 128) t[i] = e.charAt(r); else if (n < 2048) t[i] = String.fromCharCode(192 | n >> 6, 128 | 63 & n); else {
                            if (!(n < 55296 || n > 57343)) {
                                if (r + 1 < o) {
                                    var a = e.charCodeAt(r + 1);
                                    if (n < 56320 && 56320 <= a && a <= 57343) {
                                        var s = 65536 + ((1023 & n) << 10 | 1023 & a);
                                        t[i] = String.fromCharCode(240 | s >> 18 & 63, 128 | s >> 12 & 63, 128 | s >> 6 & 63, 128 | 63 & s), 
                                        ++r;
                                        continue;
                                    }
                                }
                                throw new Error("Malformed string");
                            }
                            t[i] = String.fromCharCode(224 | n >> 12, 128 | n >> 6 & 63, 128 | 63 & n);
                        }
                    }
                    return t.join("");
                }
            }, {
                key: "utf8DecodeShortString",
                value: function(e, t) {
                    for (var o = new Array(t), r = 0, i = 0, n = e.length; r < t && i < n; r++) {
                        var a = e.charCodeAt(i++);
                        switch (a >> 4) {
                          case 0:
                          case 1:
                          case 2:
                          case 3:
                          case 4:
                          case 5:
                          case 6:
                          case 7:
                            o[r] = a;
                            break;

                          case 12:
                          case 13:
                            if (!(i < n)) throw new Error("Unfinished UTF-8 octet sequence");
                            o[r] = (31 & a) << 6 | 63 & e.charCodeAt(i++);
                            break;

                          case 14:
                            if (!(i + 1 < n)) throw new Error("Unfinished UTF-8 octet sequence");
                            o[r] = (15 & a) << 12 | (63 & e.charCodeAt(i++)) << 6 | 63 & e.charCodeAt(i++);
                            break;

                          case 15:
                            if (!(i + 2 < n)) throw new Error("Unfinished UTF-8 octet sequence");
                            var s = ((7 & a) << 18 | (63 & e.charCodeAt(i++)) << 12 | (63 & e.charCodeAt(i++)) << 6 | 63 & e.charCodeAt(i++)) - 65536;
                            if (!(0 <= s && s <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + s.toString(16));
                            o[r++] = s >> 10 & 1023 | 55296, o[r] = 1023 & s | 56320;
                            break;

                          default:
                            throw new Error("Bad UTF-8 encoding 0x" + a.toString(16));
                        }
                    }
                    return r < t && (o.length = r), String.fromCharCode.apply(String, o);
                }
            }, {
                key: "utf8DecodeLongString",
                value: function(e, t) {
                    for (var o = [], r = new Array(32768), i = 0, n = 0, a = e.length; i < t && n < a; i++) {
                        var s = e.charCodeAt(n++);
                        switch (s >> 4) {
                          case 0:
                          case 1:
                          case 2:
                          case 3:
                          case 4:
                          case 5:
                          case 6:
                          case 7:
                            r[i] = s;
                            break;

                          case 12:
                          case 13:
                            if (!(n < a)) throw new Error("Unfinished UTF-8 octet sequence");
                            r[i] = (31 & s) << 6 | 63 & e.charCodeAt(n++);
                            break;

                          case 14:
                            if (!(n + 1 < a)) throw new Error("Unfinished UTF-8 octet sequence");
                            r[i] = (15 & s) << 12 | (63 & e.charCodeAt(n++)) << 6 | 63 & e.charCodeAt(n++);
                            break;

                          case 15:
                            if (!(n + 2 < a)) throw new Error("Unfinished UTF-8 octet sequence");
                            var c = ((7 & s) << 18 | (63 & e.charCodeAt(n++)) << 12 | (63 & e.charCodeAt(n++)) << 6 | 63 & e.charCodeAt(n++)) - 65536;
                            if (!(0 <= c && c <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + c.toString(16));
                            r[i++] = c >> 10 & 1023 | 55296, r[i] = 1023 & c | 56320;
                            break;

                          default:
                            throw new Error("Bad UTF-8 encoding 0x" + s.toString(16));
                        }
                        if (i >= 32766) {
                            var u = i + 1;
                            r.length = u, o[o.length] = String.fromCharCode.apply(String, r), t -= u, i = -1;
                        }
                    }
                    return i > 0 && (r.length = i, o[o.length] = String.fromCharCode.apply(String, r)), 
                    o.join("");
                }
            }, {
                key: "utf8Decode",
                value: function(e, t) {
                    return (void 0 === t || null === t || t < 0) && (t = e.length), 0 === t ? "" : /^[\x00-\x7f]*$/.test(e) || !/^[\x00-\xff]*$/.test(e) ? t === e.length ? e : e.substr(0, t) : t < 65535 ? this.utf8DecodeShortString(e, t) : this.utf8DecodeLongString(e, t);
                }
            }, {
                key: "encrypt",
                value: function(e, t) {
                    return void 0 === e || null === e || 0 === e.length ? e : (e = this.utf8Encode(e), 
                    t = this.utf8Encode(t), this.toBinaryString(this.encryptUint32Array(this.toUint32Array(e, !0), this.fixk(this.toUint32Array(t, !1))), !1));
                }
            }, {
                key: "encryptToBase64",
                value: function(e, t) {
                    return this.btoa(this.encrypt(e, t));
                }
            }, {
                key: "decrypt",
                value: function(e, t) {
                    return void 0 === e || null === e || 0 === e.length ? e : (t = this.utf8Encode(t), 
                    this.utf8Decode(this.toBinaryString(this.decryptUint32Array(this.toUint32Array(e, !1), this.fixk(this.toUint32Array(t, !1))), !0)));
                }
            }, {
                key: "decryptFromBase64",
                value: function(e, t) {
                    return void 0 === e || null === e || 0 === e.length ? e : this.decrypt(this.atob(e), t);
                }
            } ]), e;
        }();
        t.exports = {
            XxteaHelper: i
        }, cc._RF.pop();
    }, {} ]
}, {}, [ "AutoScrollHelper", "CommonNav", "BabybusNavigator", "NavService", "babybusUtils", "reporter", "ajax", "cookieHelper", "signature", "systemInfo", "usage", "user", "userAgent", "Cookie", "CookieStore", "set-cookie", "util", "md5.min", "xxtea.v3", "AdUtils", "App", "BgMusic", "Effect", "Main", "Pass", "AppConfig", "DataAnalysisConfig", "Audio", "Back", "Comb", "DrawLine", "Game", "GameConfig", "GameData", "GameHeart", "GameUtils", "ItemShadow", "Match", "ParticleCtrl", "Point", "Progress", "StarConfig", "guide", "scoreAni", "starCtr", "MoveFather", "Transformer", "rightMove", "ShareUtils", "SubContextHelper", "Utils", "AddTomine", "Welcome" ]);