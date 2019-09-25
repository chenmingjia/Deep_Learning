(function(t, e, i) {
    function n(i, r) {
        var s = e[i];
        if (!s) {
            var a = t[i];
            if (!a) return;
            var o = {};
            s = e[i] = {
                exports: o
            }, a[0](function(t) {
                return n(a[1][t] || t);
            }, s, o);
        }
        return s.exports;
    }
    for (var r = 0; r < i.length; r++) n(i[r]);
})({
    1: [ function(t, e, i) {
        t("../../DebugInfos");
        var n = "https://github.com/cocos-creator/engine/blob/master/EngineErrorMap.md", r = void 0;
        cc.log = cc.warn = cc.error = cc.assert = console.log;
        function s(t) {
            return function() {
                var e = arguments[0], i = t + " " + e + ", please go to " + n + "#" + e + " to see details.";
                if (1 === arguments.length) return i;
                if (2 === arguments.length) return i + " Arguments: " + arguments[1];
                var r = cc.js.shiftArguments.apply(null, arguments);
                return i + " Arguments: " + r.join(", ");
            };
        }
        cc._throw = function(t) {
            var e = t.stack;
            e ? cc.error(e) : cc.error(t);
        };
        var a = s("Log");
        cc.logID = function() {
            cc.log(a.apply(null, arguments));
        };
        var o = s("Warning");
        cc.warnID = function() {
            cc.warn(o.apply(null, arguments));
        };
        var c = s("Error");
        cc.errorID = function() {
            cc.error(c.apply(null, arguments));
        };
        var h = s("Assert");
        cc.assertID = function(t) {
            "use strict";
            t || cc.assert(!1, h.apply(null, cc.js.shiftArguments.apply(null, arguments)));
        };
        var l = cc.Enum({
            NONE: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            INFO_FOR_WEB_PAGE: 4,
            WARN_FOR_WEB_PAGE: 5,
            ERROR_FOR_WEB_PAGE: 6
        });
        e.exports = cc.debug = {
            DebugMode: l,
            _resetDebugSetting: function(t) {
                cc.log = cc.warn = cc.error = cc.assert = function() {}, t !== l.NONE && (t > l.ERROR ? function() {
                    function e(t) {
                        if (cc.game.canvas) {
                            if (!r) {
                                var e = document.createElement("Div");
                                e.setAttribute("id", "logInfoDiv"), e.setAttribute("width", "200"), e.setAttribute("height", cc.game.canvas.height);
                                var i = e.style;
                                i.zIndex = "99999", i.position = "absolute", i.top = i.left = "0", (r = document.createElement("textarea")).setAttribute("rows", "20"), 
                                r.setAttribute("cols", "30"), r.setAttribute("disabled", "true");
                                var n = r.style;
                                n.backgroundColor = "transparent", n.borderBottom = "1px solid #cccccc", n.borderTopWidth = n.borderLeftWidth = n.borderRightWidth = "0px", 
                                n.borderTopStyle = n.borderLeftStyle = n.borderRightStyle = "none", n.padding = "0px", 
                                n.margin = 0, e.appendChild(r), cc.game.canvas.parentNode.appendChild(e);
                            }
                            r.value = r.value + t + "\r\n", r.scrollTop = r.scrollHeight;
                        }
                    }
                    cc.error = function() {
                        e("ERROR :  " + cc.js.formatStr.apply(null, arguments));
                    }, cc.assert = function(t, i) {
                        "use strict";
                        !t && i && e("ASSERT: " + (i = cc.js.formatStr.apply(null, cc.js.shiftArguments.apply(null, arguments))));
                    }, t !== l.ERROR_FOR_WEB_PAGE && (cc.warn = function() {
                        e("WARN :  " + cc.js.formatStr.apply(null, arguments));
                    }), t === l.INFO_FOR_WEB_PAGE && (cc.log = function() {
                        e(cc.js.formatStr.apply(null, arguments));
                    });
                }() : console && console.log.apply && (console.error || (console.error = console.log), 
                console.warn || (console.warn = console.log), console.error.bind ? cc.error = console.error.bind(console) : cc.error = function() {
                    return console.error.apply(console, arguments);
                }, cc.assert = function(t, e) {
                    if (!t) throw e && (e = cc.js.formatStr.apply(null, cc.js.shiftArguments.apply(null, arguments))), 
                    new Error(e);
                }), t !== l.ERROR && (console.warn.bind ? cc.warn = console.warn.bind(console) : cc.warn = function() {
                    return console.warn.apply(console, arguments);
                }), t === l.INFO && (console.log.bind ? cc.log = console.log.bind(console) : cc.log = function() {
                    return console.log.apply(console, arguments);
                }));
            },
            getError: s("ERROR"),
            isDisplayStats: function() {
                return !!cc.profiler && cc.profiler.isShowingStats();
            },
            setDisplayStats: function(t) {
                cc.profiler && (t ? cc.profiler.showStats() : cc.profiler.hideStats(), cc.game.config.showFPS = !!t);
            }
        };
    }, {
        "../../DebugInfos": void 0
    } ],
    2: [ function(t, e, i) {
        var n = t("./event/event-target"), r = t("./load-pipeline/auto-release-utils"), s = t("./component-scheduler"), a = t("./node-activator"), o = t("./platform/CCObject"), c = t("./CCGame"), h = t("./renderer"), l = t("./event-manager"), u = t("./CCScheduler");
        cc.Director = function() {
            n.call(this), this.invalid = !1, this._paused = !1, this._purgeDirectorInNextLoop = !1, 
            this._winSizeInPoints = null, this._loadingScene = "", this._scene = null, this._totalFrames = 0, 
            this._lastUpdate = 0, this._deltaTime = 0, this._scheduler = null, this._compScheduler = null, 
            this._nodeActivator = null, this._actionManager = null;
            var t = this;
            c.on(c.EVENT_SHOW, function() {
                t._lastUpdate = performance.now();
            }), c.once(c.EVENT_ENGINE_INITED, this.init, this);
        }, cc.Director.prototype = {
            constructor: cc.Director,
            init: function() {
                return this._totalFrames = 0, this._lastUpdate = performance.now(), this._paused = !1, 
                this._purgeDirectorInNextLoop = !1, this._winSizeInPoints = cc.size(0, 0), this._scheduler = new u(), 
                cc.ActionManager ? (this._actionManager = new cc.ActionManager(), this._scheduler.scheduleUpdate(this._actionManager, u.PRIORITY_SYSTEM, !1)) : this._actionManager = null, 
                this.sharedInit(), !0;
            },
            sharedInit: function() {
                this._compScheduler = new s(), this._nodeActivator = new a(), l && l.setEnabled(!0), 
                cc.AnimationManager ? (this._animationManager = new cc.AnimationManager(), this._scheduler.scheduleUpdate(this._animationManager, u.PRIORITY_SYSTEM, !1)) : this._animationManager = null, 
                cc.CollisionManager ? (this._collisionManager = new cc.CollisionManager(), this._scheduler.scheduleUpdate(this._collisionManager, u.PRIORITY_SYSTEM, !1)) : this._collisionManager = null, 
                cc.PhysicsManager ? (this._physicsManager = new cc.PhysicsManager(), this._scheduler.scheduleUpdate(this._physicsManager, u.PRIORITY_SYSTEM, !1)) : this._physicsManager = null, 
                cc._widgetManager && cc._widgetManager.init(this), cc.loader.init(this);
            },
            calculateDeltaTime: function() {
                var t = performance.now();
                this._deltaTime = (t - this._lastUpdate) / 1e3, this._lastUpdate = t;
            },
            convertToGL: function(t) {
                var e = c.container, i = cc.view, n = e.getBoundingClientRect(), r = n.left + window.pageXOffset - e.clientLeft, s = n.top + window.pageYOffset - e.clientTop, a = i._devicePixelRatio * (t.x - r), o = i._devicePixelRatio * (s + n.height - t.y);
                return i._isRotated ? cc.v2(i._viewportRect.width - o, a) : cc.v2(a, o);
            },
            convertToUI: function(t) {
                var e = c.container, i = cc.view, n = e.getBoundingClientRect(), r = n.left + window.pageXOffset - e.clientLeft, s = n.top + window.pageYOffset - e.clientTop, a = cc.v2(0, 0);
                return i._isRotated ? (a.x = r + t.y / i._devicePixelRatio, a.y = s + n.height - (i._viewportRect.width - t.x) / i._devicePixelRatio) : (a.x = r + t.x * i._devicePixelRatio, 
                a.y = s + n.height - t.y * i._devicePixelRatio), a;
            },
            end: function() {
                this._purgeDirectorInNextLoop = !0;
            },
            getWinSize: function() {
                return cc.size(cc.winSize);
            },
            getWinSizeInPixels: function() {
                return cc.size(cc.winSize);
            },
            pause: function() {
                this._paused || (this._paused = !0);
            },
            purgeCachedData: function() {
                cc.loader.releaseAll();
            },
            purgeDirector: function() {
                this._scheduler.unscheduleAll(), this._compScheduler.unscheduleAll(), this._nodeActivator.reset(), 
                l && l.setEnabled(!1), cc.renderer.clear(), cc.isValid(this._scene) && this._scene.destroy(), 
                this._scene = null, this.stopAnimation(), cc.loader.releaseAll();
            },
            reset: function() {
                this.purgeDirector(), l && l.setEnabled(!0), this._actionManager && this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, !1), 
                this._animationManager && this._scheduler.scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, !1), 
                this._collisionManager && this._scheduler.scheduleUpdate(this._collisionManager, cc.Scheduler.PRIORITY_SYSTEM, !1), 
                this._physicsManager && this._scheduler.scheduleUpdate(this._physicsManager, cc.Scheduler.PRIORITY_SYSTEM, !1), 
                this.startAnimation();
            },
            runSceneImmediate: function(t, e, i) {
                cc.assertID(t instanceof cc.Scene, 1216), t._load();
                for (var n = Object.keys(c._persistRootNodes).map(function(t) {
                    return c._persistRootNodes[t];
                }), s = 0; s < n.length; s++) {
                    var a = n[s], h = t.getChildByUuid(a.uuid);
                    if (h) {
                        var l = h.getSiblingIndex();
                        h._destroyImmediate(), t.insertChild(a, l);
                    } else a.parent = t;
                }
                var u = this._scene, _ = u && u.autoReleaseAssets && u.dependAssets;
                r.autoRelease(_, t.dependAssets, n), cc.isValid(u) && u.destroy(), this._scene = null, 
                o._deferredDestroy(), e && e(), this.emit(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, t), 
                this._scene = t, t._activate(), this.startAnimation(), i && i(null, t), this.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH, t);
            },
            runScene: function(t, e, i) {
                cc.assertID(t, 1205), cc.assertID(t instanceof cc.Scene, 1216), t._load(), this.once(cc.Director.EVENT_AFTER_UPDATE, function() {
                    this.runSceneImmediate(t, e, i);
                }, this);
            },
            _getSceneUuid: function(t) {
                var e = c._sceneInfos;
                if ("string" == typeof t) {
                    t.endsWith(".fire") || (t += ".fire"), "/" === t[0] || t.startsWith("db://") || (t = "/" + t);
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        if (n.url.endsWith(t)) return n;
                    }
                } else if ("number" == typeof t) {
                    if (0 <= t && t < e.length) return e[t];
                    cc.errorID(1206, t);
                } else cc.errorID(1207, t);
                return null;
            },
            loadScene: function(t, e, i) {
                if (this._loadingScene) return cc.errorID(1208, t, this._loadingScene), !1;
                var n = this._getSceneUuid(t);
                if (n) {
                    var r = n.uuid;
                    return this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, t), this._loadingScene = t, 
                    this._loadSceneByUuid(r, e, i), !0;
                }
                return cc.errorID(1209, t), !1;
            },
            preloadScene: function(t, e, i) {
                void 0 === i && (i = e, e = null);
                var n = this._getSceneUuid(t);
                if (n) this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, t), cc.loader.load({
                    uuid: n.uuid,
                    type: "uuid"
                }, e, function(e, n) {
                    e && cc.errorID(1210, t, e.message), i && i(e, n);
                }); else {
                    var r = 'Can not preload the scene "' + t + '" because it is not in the build settings.';
                    i(new Error(r)), cc.error("preloadScene: " + r);
                }
            },
            _loadSceneByUuid: function(t, e, i, n) {
                console.time("LoadScene " + t), cc.AssetLibrary.loadAsset(t, function(n, r) {
                    console.timeEnd("LoadScene " + t);
                    var s = cc.director;
                    if (s._loadingScene = "", n) n = "Failed to load scene: " + n, cc.error(n); else {
                        if (r instanceof cc.SceneAsset) {
                            var a = r.scene;
                            return a._id = r._uuid, a._name = r._name, void s.runSceneImmediate(a, i, e);
                        }
                        n = "The asset " + t + " is not a scene", cc.error(n);
                    }
                    e && e(n);
                });
            },
            resume: function() {
                this._paused && (this._lastUpdate = performance.now(), this._lastUpdate || cc.logID(1200), 
                this._paused = !1, this._deltaTime = 0);
            },
            setDepthTest: function(t) {
                cc.Camera.main && (cc.Camera.main.depth = !!t);
            },
            setClearColor: function(t) {
                cc.Camera.main && (cc.Camera.main.backgroundColor = t);
            },
            getRunningScene: function() {
                return this._scene;
            },
            getScene: function() {
                return this._scene;
            },
            getAnimationInterval: function() {
                return 1e3 / c.getFrameRate();
            },
            setAnimationInterval: function(t) {
                c.setFrameRate(Math.round(1e3 / t));
            },
            getDeltaTime: function() {
                return this._deltaTime;
            },
            getTotalFrames: function() {
                return this._totalFrames;
            },
            isPaused: function() {
                return this._paused;
            },
            getScheduler: function() {
                return this._scheduler;
            },
            setScheduler: function(t) {
                this._scheduler !== t && (this._scheduler = t);
            },
            getActionManager: function() {
                return this._actionManager;
            },
            setActionManager: function(t) {
                this._actionManager !== t && (this._actionManager && this._scheduler.unscheduleUpdate(this._actionManager), 
                this._actionManager = t, this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, !1));
            },
            getAnimationManager: function() {
                return this._animationManager;
            },
            getCollisionManager: function() {
                return this._collisionManager;
            },
            getPhysicsManager: function() {
                return this._physicsManager;
            },
            startAnimation: function() {
                this.invalid = !1, this._lastUpdate = performance.now();
            },
            stopAnimation: function() {
                this.invalid = !0;
            },
            mainLoop: function() {
                this._purgeDirectorInNextLoop ? (this._purgeDirectorInNextLoop = !1, this.purgeDirector()) : this.invalid || (this.calculateDeltaTime(), 
                this._paused || (this.emit(cc.Director.EVENT_BEFORE_UPDATE), this._compScheduler.startPhase(), 
                this._compScheduler.updatePhase(this._deltaTime), this._scheduler.update(this._deltaTime), 
                this._compScheduler.lateUpdatePhase(this._deltaTime), this.emit(cc.Director.EVENT_AFTER_UPDATE), 
                o._deferredDestroy()), this.emit(cc.Director.EVENT_BEFORE_DRAW), h.render(this._scene), 
                this.emit(cc.Director.EVENT_AFTER_DRAW), l.frameUpdateListeners(), this._totalFrames++);
            },
            __fastOn: function(t, e, i) {
                this.add(t, e, i);
            },
            __fastOff: function(t, e, i) {
                this.remove(t, e, i);
            }
        }, cc.js.addon(cc.Director.prototype, n.prototype), cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed", 
        cc.Director.EVENT_BEFORE_SCENE_LOADING = "director_before_scene_loading", cc.Director.EVENT_BEFORE_SCENE_LAUNCH = "director_before_scene_launch", 
        cc.Director.EVENT_AFTER_SCENE_LAUNCH = "director_after_scene_launch", cc.Director.EVENT_BEFORE_UPDATE = "director_before_update", 
        cc.Director.EVENT_AFTER_UPDATE = "director_after_update", cc.Director.EVENT_BEFORE_VISIT = "director_before_draw", 
        cc.Director.EVENT_AFTER_VISIT = "director_before_draw", cc.Director.EVENT_BEFORE_DRAW = "director_before_draw", 
        cc.Director.EVENT_AFTER_DRAW = "director_after_draw", cc.Director.PROJECTION_2D = 0, 
        cc.Director.PROJECTION_3D = 1, cc.Director.PROJECTION_CUSTOM = 3, cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_2D, 
        cc.director = new cc.Director(), e.exports = cc.director;
    }, {
        "./CCGame": 3,
        "./CCScheduler": 7,
        "./component-scheduler": 27,
        "./event-manager": 48,
        "./event/event-target": 50,
        "./load-pipeline/auto-release-utils": 63,
        "./node-activator": 79,
        "./platform/CCObject": 88,
        "./renderer": 123
    } ],
    3: [ function(t, e, i) {
        var n = t("./event/event-target");
        t("../audio/CCAudioEngine");
        var r = t("./CCDebug"), s = t("./renderer/index.js"), a = t("./platform/CCInputManager"), o = t("../core/renderer/utils/dynamic-atlas/manager"), c = {
            EVENT_HIDE: "game_on_hide",
            EVENT_SHOW: "game_on_show",
            EVENT_RESTART: "game_on_restart",
            EVENT_GAME_INITED: "game_inited",
            EVENT_ENGINE_INITED: "engine_inited",
            EVENT_RENDERER_INITED: "engine_inited",
            RENDER_TYPE_CANVAS: 0,
            RENDER_TYPE_WEBGL: 1,
            RENDER_TYPE_OPENGL: 2,
            _persistRootNodes: {},
            _paused: !0,
            _configLoaded: !1,
            _isCloning: !1,
            _prepared: !1,
            _rendererInitialized: !1,
            _renderContext: null,
            _intervalId: null,
            _lastTime: null,
            _frameTime: null,
            _sceneInfos: [],
            frame: null,
            container: null,
            canvas: null,
            renderType: -1,
            config: null,
            onStart: null,
            setFrameRate: function(t) {
                this.config.frameRate = t, this._intervalId && window.cancelAnimFrame(this._intervalId), 
                this._intervalId = 0, this._paused = !0, this._setAnimFrame(), this._runMainLoop();
            },
            getFrameRate: function() {
                return this.config.frameRate;
            },
            step: function() {
                cc.director.mainLoop();
            },
            pause: function() {
                this._paused || (this._paused = !0, cc.audioEngine && cc.audioEngine._break(), cc.director.stopAnimation(), 
                this._intervalId && window.cancelAnimFrame(this._intervalId), this._intervalId = 0);
            },
            resume: function() {
                this._paused && (this._paused = !1, cc.audioEngine && cc.audioEngine._restore(), 
                cc.director.startAnimation(), this._runMainLoop());
            },
            isPaused: function() {
                return this._paused;
            },
            restart: function() {
                cc.director.once(cc.Director.EVENT_AFTER_DRAW, function() {
                    for (var t in c._persistRootNodes) c.removePersistRootNode(c._persistRootNodes[t]);
                    cc.director.getScene().destroy(), cc.Object._deferredDestroy(), cc.director.purgeDirector(), 
                    cc.audioEngine && cc.audioEngine.uncacheAll(), cc.director.reset(), c.onStart(), 
                    c.emit(c.EVENT_RESTART);
                });
            },
            end: function() {
                close();
            },
            _initEngine: function() {
                this._rendererInitialized || (this._initRenderer(), this._initEvents(), this.emit(this.EVENT_ENGINE_INITED));
            },
            _prepareFinished: function(t) {
                this._prepared = !0, this._initEngine(), console.log("Cocos Creator v" + cc.ENGINE_VERSION), 
                this._setAnimFrame(), this._runMainLoop(), this.emit(this.EVENT_GAME_INITED), t && t();
            },
            eventTargetOn: n.prototype.on,
            eventTargetOnce: n.prototype.once,
            on: function(t, e, i) {
                this._prepared && t === this.EVENT_ENGINE_INITED || !this._pause && t === this.EVENT_GAME_INITED ? e.call(i) : this.eventTargetOn(t, e, i);
            },
            once: function(t, e, i) {
                this._prepared && t === this.EVENT_ENGINE_INITED || !this._pause && t === this.EVENT_GAME_INITED ? e.call(i) : this.eventTargetOnce(t, e, i);
            },
            prepare: function(t) {
                if (this._prepared) t && t(); else {
                    var e = this.config.jsList;
                    if (e && e.length > 0) {
                        var i = this;
                        cc.loader.load(e, function(e) {
                            if (e) throw new Error(JSON.stringify(e));
                            i._prepareFinished(t);
                        });
                    } else this._prepareFinished(t);
                }
            },
            run: function(t, e) {
                this._initConfig(t), this.onStart = e, this.prepare(c.onStart && c.onStart.bind(c));
            },
            addPersistRootNode: function(t) {
                if (cc.Node.isNode(t) && t.uuid) {
                    var e = t.uuid;
                    if (!this._persistRootNodes[e]) {
                        var i = cc.director._scene;
                        if (cc.isValid(i)) if (t.parent) {
                            if (!(t.parent instanceof cc.Scene)) return void cc.warnID(3801);
                            if (t.parent !== i) return void cc.warnID(3802);
                        } else t.parent = i;
                        this._persistRootNodes[e] = t, t._persistNode = !0;
                    }
                } else cc.warnID(3800);
            },
            removePersistRootNode: function(t) {
                var e = t.uuid || "";
                t === this._persistRootNodes[e] && (delete this._persistRootNodes[e], t._persistNode = !1);
            },
            isPersistRootNode: function(t) {
                return t._persistNode;
            },
            _setAnimFrame: function() {
                this._lastTime = new Date();
                var t = c.config.frameRate;
                this._frameTime = 1e3 / t, 60 !== t && 30 !== t ? (window.requestAnimFrame = this._stTime, 
                window.cancelAnimFrame = this._ctTime) : (window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || this._stTime, 
                window.cancelAnimFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || this._ctTime);
            },
            _stTime: function(t) {
                var e = new Date().getTime(), i = Math.max(0, c._frameTime - (e - c._lastTime)), n = window.setTimeout(function() {
                    t();
                }, i);
                return c._lastTime = e + i, n;
            },
            _ctTime: function(t) {
                window.clearTimeout(t);
            },
            _runMainLoop: function() {
                var t, e = this, i = e.config, n = cc.director, s = !0, a = i.frameRate;
                r.setDisplayStats(i.showFPS), t = function() {
                    if (!e._paused) {
                        if (e._intervalId = window.requestAnimFrame(t), 30 === a && (s = !s)) return;
                        n.mainLoop();
                    }
                }, e._intervalId = window.requestAnimFrame(t), e._paused = !1;
            },
            _initConfig: function(t) {
                "number" != typeof t.debugMode && (t.debugMode = 0), t.exposeClassName = !!t.exposeClassName, 
                "number" != typeof t.frameRate && (t.frameRate = 60);
                var e = t.renderMode;
                ("number" != typeof e || e > 2 || e < 0) && (t.renderMode = 0), "boolean" != typeof t.registerSystemEvent && (t.registerSystemEvent = !0), 
                t.showFPS = !!t.showFPS, this._sceneInfos = t.scenes || [], this.collisionMatrix = t.collisionMatrix || [], 
                this.groupList = t.groupList || [], r._resetDebugSetting(t.debugMode), this.config = t, 
                this._configLoaded = !0;
            },
            _determineRenderType: function() {
                var t = this.config, e = parseInt(t.renderMode) || 0;
                this.renderType = this.RENDER_TYPE_CANVAS;
                var i = !1;
                if (0 === e ? cc.sys.capabilities.opengl ? (this.renderType = this.RENDER_TYPE_WEBGL, 
                i = !0) : cc.sys.capabilities.canvas && (this.renderType = this.RENDER_TYPE_CANVAS, 
                i = !0) : 1 === e && cc.sys.capabilities.canvas ? (this.renderType = this.RENDER_TYPE_CANVAS, 
                i = !0) : 2 === e && cc.sys.capabilities.opengl && (this.renderType = this.RENDER_TYPE_WEBGL, 
                i = !0), !i) throw new Error(r.getError(3820, e));
            },
            _initRenderer: function() {
                if (!this._rendererInitialized) {
                    this.config.id;
                    var t = void 0, e = void 0;
                    if (this.container = e = document.createElement("DIV"), this.frame = e.parentNode === document.body ? document.documentElement : e.parentNode, 
                    t = cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB ? window.sharedCanvas || wx.getSharedCanvas() : canvas, 
                    this.canvas = t, this._determineRenderType(), this.renderType === this.RENDER_TYPE_WEBGL) {
                        var i = {
                            stencil: !0,
                            antialias: cc.macro.ENABLE_WEBGL_ANTIALIAS,
                            alpha: cc.macro.ENABLE_TRANSPARENT_CANVAS,
                            preserveDrawingBuffer: !0
                        };
                        s.initWebGL(t, i), this._renderContext = s.device._gl, !cc.macro.CLEANUP_IMAGE_CACHE && o && (o.enabled = !0);
                    }
                    this._renderContext || (this.renderType = this.RENDER_TYPE_CANVAS, s.initCanvas(t), 
                    this._renderContext = s.device._ctx), this.canvas.oncontextmenu = function() {
                        if (!cc._isContextMenuEnable) return !1;
                    }, this._rendererInitialized = !0;
                }
            },
            _initEvents: function() {
                var t, e = window;
                this.config.registerSystemEvent && a.registerSystemEvent(this.canvas), void 0 !== document.hidden ? t = "hidden" : void 0 !== document.mozHidden ? t = "mozHidden" : void 0 !== document.msHidden ? t = "msHidden" : void 0 !== document.webkitHidden && (t = "webkitHidden");
                var i = !1;
                function n() {
                    i || (i = !0, c.emit(c.EVENT_HIDE));
                }
                function r(t, e, n, r, s) {
                    i && (i = !1, c.emit(c.EVENT_SHOW, t, e, n, r, s));
                }
                if (t) for (var s = [ "visibilitychange", "mozvisibilitychange", "msvisibilitychange", "webkitvisibilitychange", "qbrowserVisibilityChange" ], o = 0; o < s.length; o++) document.addEventListener(s[o], function(e) {
                    var i = document[t];
                    (i = i || e.hidden) ? n() : r();
                }); else e.addEventListener("blur", n), e.addEventListener("focus", r);
                navigator.userAgent.indexOf("MicroMessenger") > -1 && (e.onfocus = r), cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB && (wx.onShow && wx.onShow(r), 
                wx.onHide && wx.onHide(n)), "onpageshow" in window && "onpagehide" in window && (e.addEventListener("pagehide", n), 
                e.addEventListener("pageshow", r), document.addEventListener("pagehide", n), document.addEventListener("pageshow", r)), 
                this.on(c.EVENT_HIDE, function() {
                    c.pause();
                }), this.on(c.EVENT_SHOW, function() {
                    c.resume();
                });
            }
        };
        n.call(c), cc.js.addon(c, n.prototype), cc.game = e.exports = c;
    }, {
        "../audio/CCAudioEngine": void 0,
        "../core/renderer/utils/dynamic-atlas/manager": void 0,
        "./CCDebug": 1,
        "./event/event-target": 50,
        "./platform/BKInputManager": 80,
        "./platform/CCInputManager": 86,
        "./renderer/index.js": 123
    } ],
    4: [ function(t, e, i) {
        "use strict";
        var n = t("./utils/base-node"), r = t("./utils/prefab-helper"), s = t("./utils/math-pools"), a = t("./renderer/render-engine").math, o = t("./utils/affine-transform"), c = t("./event-manager"), h = t("./platform/CCMacro"), l = t("./utils/misc"), u = t("./platform/js"), _ = (t("./event/event"), 
        t("./event/event-target")), d = t("./renderer/render-flow"), f = cc.Object.Flags.Destroying, p = Math.PI / 180, m = !!cc.ActionManager, v = function() {}, g = cc.v2(), y = cc.v2(), x = a.mat4.create(), E = a.vec3.create(), T = a.quat.create(), C = new Array(16);
        C.length = 0;
        var A = cc.Enum({
            DEBUG: 31
        }), b = cc.Enum({
            POSITION: 1,
            SCALE: 2,
            ROTATION: 4,
            SKEW: 8,
            RT: 7,
            ALL: 65535
        }), w = cc.Enum({
            TOUCH_START: "touchstart",
            TOUCH_MOVE: "touchmove",
            TOUCH_END: "touchend",
            TOUCH_CANCEL: "touchcancel",
            MOUSE_DOWN: "mousedown",
            MOUSE_MOVE: "mousemove",
            MOUSE_ENTER: "mouseenter",
            MOUSE_LEAVE: "mouseleave",
            MOUSE_UP: "mouseup",
            MOUSE_WHEEL: "mousewheel",
            POSITION_CHANGED: "position-changed",
            ROTATION_CHANGED: "rotation-changed",
            SCALE_CHANGED: "scale-changed",
            SIZE_CHANGED: "size-changed",
            ANCHOR_CHANGED: "anchor-changed",
            COLOR_CHANGED: "color-changed",
            CHILD_ADDED: "child-added",
            CHILD_REMOVED: "child-removed",
            CHILD_REORDER: "child-reorder",
            GROUP_CHANGED: "group-changed"
        }), D = [ w.TOUCH_START, w.TOUCH_MOVE, w.TOUCH_END, w.TOUCH_CANCEL ], S = [ w.MOUSE_DOWN, w.MOUSE_ENTER, w.MOUSE_MOVE, w.MOUSE_LEAVE, w.MOUSE_UP, w.MOUSE_WHEEL ], R = null, M = function(t, e) {
            var i = t.getLocation(), n = this.owner;
            return !!n._hitTest(i, this) && (e.type = w.TOUCH_START, e.touch = t, e.bubbles = !0, 
            n.dispatchEvent(e), !0);
        }, O = function(t, e) {
            var i = this.owner;
            e.type = w.TOUCH_MOVE, e.touch = t, e.bubbles = !0, i.dispatchEvent(e);
        }, L = function(t, e) {
            var i = t.getLocation(), n = this.owner;
            n._hitTest(i, this) ? e.type = w.TOUCH_END : e.type = w.TOUCH_CANCEL, e.touch = t, 
            e.bubbles = !0, n.dispatchEvent(e);
        }, I = function(t, e) {
            t.getLocation();
            var i = this.owner;
            e.type = w.TOUCH_CANCEL, e.touch = t, e.bubbles = !0, i.dispatchEvent(e);
        }, F = function(t) {
            var e = t.getLocation(), i = this.owner;
            i._hitTest(e, this) && (t.type = w.MOUSE_DOWN, t.bubbles = !0, i.dispatchEvent(t));
        }, P = function(t) {
            var e = t.getLocation(), i = this.owner;
            if (i._hitTest(e, this)) this._previousIn || (R && R._mouseListener && (t.type = w.MOUSE_LEAVE, 
            R.dispatchEvent(t), R._mouseListener._previousIn = !1), R = this.owner, t.type = w.MOUSE_ENTER, 
            i.dispatchEvent(t), this._previousIn = !0), t.type = w.MOUSE_MOVE, t.bubbles = !0, 
            i.dispatchEvent(t); else {
                if (!this._previousIn) return;
                t.type = w.MOUSE_LEAVE, i.dispatchEvent(t), this._previousIn = !1, R = null;
            }
            t.stopPropagation();
        }, N = function(t) {
            var e = t.getLocation(), i = this.owner;
            i._hitTest(e, this) && (t.type = w.MOUSE_UP, t.bubbles = !0, i.dispatchEvent(t), 
            t.stopPropagation());
        }, B = function(t) {
            var e = t.getLocation(), i = this.owner;
            i._hitTest(e, this) && (t.type = w.MOUSE_WHEEL, t.bubbles = !0, i.dispatchEvent(t), 
            t.stopPropagation());
        };
        function z(t) {
            var e = cc.Mask;
            if (e) for (var i = 0, n = t; n && cc.Node.isNode(n); n = n._parent, ++i) if (n.getComponent(e)) return {
                index: i,
                node: n
            };
            return null;
        }
        function k(t, e) {
            if (!(t._objFlags & f)) {
                var i = 0;
                if (t._bubblingListeners) for (;i < e.length; ++i) if (t._bubblingListeners.hasEventListener(e[i])) return !0;
                if (t._capturingListeners) for (;i < e.length; ++i) if (t._capturingListeners.hasEventListener(e[i])) return !0;
                return !1;
            }
            return !0;
        }
        function U(t) {
            var e = t.groupIndex;
            return 0 === e && t.parent && (e = U(t.parent)), e;
        }
        function H(t) {
            var e = U(t);
            t._cullingMask = 1 << e;
            for (var i = 0; i < t._children.length; i++) H(t._children[i]);
        }
        var G = cc.Class({
            name: "cc.Node",
            extends: n,
            properties: {
                _opacity: 255,
                _color: cc.Color.WHITE,
                _contentSize: cc.Size,
                _anchorPoint: cc.v2(.5, .5),
                _position: cc.Vec3,
                _scaleX: {
                    default: void 0,
                    type: cc.Float
                },
                _scaleY: {
                    default: void 0,
                    type: cc.Float
                },
                _scale: cc.Vec3,
                _rotationX: 0,
                _rotationY: 0,
                _quat: cc.Quat,
                _skewX: 0,
                _skewY: 0,
                _zIndex: {
                    default: void 0,
                    type: cc.Integer
                },
                _localZOrder: {
                    default: 0,
                    serializable: !1
                },
                groupIndex: {
                    default: 0,
                    type: cc.Integer
                },
                group: {
                    get: function() {
                        return cc.game.groupList[this.groupIndex] || "";
                    },
                    set: function(t) {
                        this.groupIndex = cc.game.groupList.indexOf(t), H(this), this.emit(w.GROUP_CHANGED, this);
                    }
                },
                x: {
                    get: function() {
                        return this._position.x;
                    },
                    set: function(t) {
                        var e = this._position;
                        t !== e.x && (e.x = t, this.setLocalDirty(b.POSITION), this._renderFlag |= d.FLAG_WORLD_TRANSFORM, 
                        1 & this._eventMask && this.emit(w.POSITION_CHANGED));
                    }
                },
                y: {
                    get: function() {
                        return this._position.y;
                    },
                    set: function(t) {
                        var e = this._position;
                        t !== e.y && (e.y = t, this.setLocalDirty(b.POSITION), this._renderFlag |= d.FLAG_WORLD_TRANSFORM, 
                        1 & this._eventMask && this.emit(w.POSITION_CHANGED));
                    }
                },
                z: {
                    get: function() {
                        return this._position.z;
                    },
                    set: function(t) {
                        var e = this._position;
                        t !== e.z && (e.z = t, this.setLocalDirty(b.POSITION), this._renderFlag |= d.FLAG_WORLD_TRANSFORM, 
                        1 & this._eventMask && this.emit(w.POSITION_CHANGED));
                    }
                },
                rotation: {
                    get: function() {
                        return this._rotationX;
                    },
                    set: function(t) {
                        this._rotationX === t && this._rotationY === t || (this._rotationX = this._rotationY = t, 
                        a.quat.fromEuler(this._quat, 0, 0, -t), this.setLocalDirty(b.ROTATION), this._renderFlag |= d.FLAG_TRANSFORM, 
                        4 & this._eventMask && this.emit(w.ROTATION_CHANGED));
                    }
                },
                rotationX: {
                    get: function() {
                        return this._rotationX;
                    },
                    set: function(t) {
                        this._rotationX !== t && (this._rotationX = t, this._rotationX === this._rotationY ? a.quat.fromEuler(this._quat, 0, 0, -t) : a.quat.fromEuler(this._quat, t, this._rotationY, 0), 
                        this.setLocalDirty(b.ROTATION), this._renderFlag |= d.FLAG_TRANSFORM, 4 & this._eventMask && this.emit(w.ROTATION_CHANGED));
                    }
                },
                rotationY: {
                    get: function() {
                        return this._rotationY;
                    },
                    set: function(t) {
                        this._rotationY !== t && (this._rotationY = t, this._rotationX === this._rotationY ? a.quat.fromEuler(this._quat, 0, 0, -t) : a.quat.fromEuler(this._quat, this._rotationX, t, 0), 
                        this.setLocalDirty(b.ROTATION), this._renderFlag |= d.FLAG_TRANSFORM, 4 & this._eventMask && this.emit(w.ROTATION_CHANGED));
                    }
                },
                scaleX: {
                    get: function() {
                        return this._scale.x;
                    },
                    set: function(t) {
                        this._scale.x !== t && (this._scale.x = t, this.setLocalDirty(b.SCALE), this._renderFlag |= d.FLAG_TRANSFORM, 
                        2 & this._eventMask && this.emit(w.SCALE_CHANGED));
                    }
                },
                scaleY: {
                    get: function() {
                        return this._scale.y;
                    },
                    set: function(t) {
                        this._scale.y !== t && (this._scale.y = t, this.setLocalDirty(b.SCALE), this._renderFlag |= d.FLAG_TRANSFORM, 
                        2 & this._eventMask && this.emit(w.SCALE_CHANGED));
                    }
                },
                skewX: {
                    get: function() {
                        return this._skewX;
                    },
                    set: function(t) {
                        this._skewX = t, this.setLocalDirty(b.SKEW), this._renderFlag |= d.FLAG_TRANSFORM;
                    }
                },
                skewY: {
                    get: function() {
                        return this._skewY;
                    },
                    set: function(t) {
                        this._skewY = t, this.setLocalDirty(b.SKEW), this._renderFlag |= d.FLAG_TRANSFORM;
                    }
                },
                opacity: {
                    get: function() {
                        return this._opacity;
                    },
                    set: function(t) {
                        this._opacity !== t && (this._opacity = t, this._renderFlag |= d.FLAG_OPACITY | d.FLAG_COLOR);
                    },
                    range: [ 0, 255 ]
                },
                color: {
                    get: function() {
                        return this._color.clone();
                    },
                    set: function(t) {
                        this._color.equals(t) || (this._color.set(t), this._renderComponent && (this._renderFlag |= d.FLAG_COLOR), 
                        32 & this._eventMask && this.emit(w.COLOR_CHANGED, t));
                    }
                },
                anchorX: {
                    get: function() {
                        return this._anchorPoint.x;
                    },
                    set: function(t) {
                        var e = this._anchorPoint;
                        e.x !== t && (e.x = t, 16 & this._eventMask && this.emit(w.ANCHOR_CHANGED));
                    }
                },
                anchorY: {
                    get: function() {
                        return this._anchorPoint.y;
                    },
                    set: function(t) {
                        var e = this._anchorPoint;
                        e.y !== t && (e.y = t, 16 & this._eventMask && this.emit(w.ANCHOR_CHANGED));
                    }
                },
                width: {
                    get: function() {
                        return this._contentSize.width;
                    },
                    set: function(t) {
                        t !== this._contentSize.width && (this._contentSize.width = t, 8 & this._eventMask && this.emit(w.SIZE_CHANGED));
                    }
                },
                height: {
                    get: function() {
                        return this._contentSize.height;
                    },
                    set: function(t) {
                        t !== this._contentSize.height && (this._contentSize.height = t, 8 & this._eventMask && this.emit(w.SIZE_CHANGED));
                    }
                },
                zIndex: {
                    get: function() {
                        return this._localZOrder >> 16;
                    },
                    set: function(t) {
                        t > h.MAX_ZINDEX ? (cc.warnID(1636), t = h.MAX_ZINDEX) : t < h.MIN_ZINDEX && (cc.warnID(1637), 
                        t = h.MIN_ZINDEX), this.zIndex !== t && (this._localZOrder = 65535 & this._localZOrder | t << 16, 
                        this._parent && this._onSiblingIndexChanged());
                    }
                }
            },
            ctor: function() {
                this._reorderChildDirty = !1, this._widget = null, this._renderComponent = null, 
                this._capturingListeners = null, this._bubblingListeners = null, this._touchListener = null, 
                this._mouseListener = null, this._scale.x = 1, this._scale.y = 1, this._scale.z = 1, 
                this._matrix = s.mat4.get(), this._worldMatrix = s.mat4.get(), this._localMatDirty = b.ALL, 
                this._worldMatDirty = !0, this._eventMask = 0, this._cullingMask = 1, this._childArrivalOrder = 1;
            },
            statics: {
                EventType: w,
                _LocalDirtyFlag: b,
                isNode: function(t) {
                    return t instanceof G && (t.constructor === G || !(t instanceof cc.Scene));
                },
                BuiltinGroupIndex: A
            },
            _onSiblingIndexChanged: function() {
                for (var t, e = this._parent, i = e._children, n = 0, r = i.length; n < r; n++) (t = i[n])._updateOrderOfArrival(), 
                c._setDirtyForNode(t);
                e._delaySort();
            },
            _onPreDestroy: function() {
                this._onPreDestroyBase();
                m && cc.director.getActionManager().removeAllActionsFromTarget(this), R === this && (R = null), 
                (this._touchListener || this._mouseListener) && (c.removeListeners(this), this._touchListener && (this._touchListener.owner = null, 
                this._touchListener.mask = null, this._touchListener = null), this._mouseListener && (this._mouseListener.owner = null, 
                this._mouseListener.mask = null, this._mouseListener = null)), s.mat4.put(this._matrix), 
                s.mat4.put(this._worldMatrix), this._matrix = this._worldMatrix = null, this._reorderChildDirty && cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
            },
            _onPostActivated: function(t) {
                var e = m ? cc.director.getActionManager() : null;
                if (t) if (this._renderFlag |= d.FLAG_WORLD_TRANSFORM, e && e.resumeTarget(this), 
                c.resumeTarget(this), this._touchListener) {
                    var i = this._touchListener.mask = z(this);
                    this._mouseListener && (this._mouseListener.mask = i);
                } else this._mouseListener && (this._mouseListener.mask = z(this)); else e && e.pauseTarget(this), 
                c.pauseTarget(this);
            },
            _onHierarchyChanged: function(t) {
                this._updateOrderOfArrival(), H(this), this._parent && this._parent._delaySort(), 
                this._renderFlag |= d.FLAG_WORLD_TRANSFORM, this._onHierarchyChangedBase(t), cc._widgetManager && (cc._widgetManager._nodesOrderDirty = !0);
            },
            _upgrade_1x_to_2x: function() {
                if (void 0 !== this._scaleX && (this._scale.x = this._scaleX, this._scaleX = void 0), 
                void 0 !== this._scaleY && (this._scale.y = this._scaleY, this._scaleY = void 0), 
                void 0 !== this._zIndex && (this._localZOrder = this._zIndex << 16, this._zIndex = void 0), 
                0 !== this._rotationX || 0 !== this._rotationY) this._rotationX === this._rotationY ? a.quat.fromEuler(this._quat, 0, 0, -this._rotationX) : a.quat.fromEuler(this._quat, this._rotationX, this._rotationY, 0); else {
                    var t = this._quat.getRoll(), e = this._quat.getPitch();
                    0 === t && 0 === e ? this._rotationX = this._rotationY = -this._quat.getYaw() : (this._rotationX = t, 
                    this._rotationY = e);
                }
                this._color.a < 255 && 255 === this._opacity && (this._opacity = this._color.a, 
                this._color.a = 255);
            },
            _onBatchCreated: function() {
                this._upgrade_1x_to_2x(), this._updateOrderOfArrival(), this._cullingMask = 1 << U(this);
                var t = this._prefab;
                t && t.sync && t.root === this && r.syncWithPrefab(this), this._activeInHierarchy || (m && cc.director.getActionManager().pauseTarget(this), 
                c.pauseTarget(this));
                for (var e = this._children, i = 0, n = e.length; i < n; i++) e[i]._onBatchCreated();
                e.length > 0 && (this._renderFlag |= d.FLAG_CHILDREN);
            },
            _onBatchRestored: function() {
                this._upgrade_1x_to_2x(), this._cullingMask = 1 << U(this), this._activeInHierarchy || (m && cc.director.getActionManager().pauseTarget(this), 
                c.pauseTarget(this));
                for (var t = this._children, e = 0, i = t.length; e < i; e++) t[e]._onBatchRestored();
                t.length > 0 && (this._renderFlag |= d.FLAG_CHILDREN);
            },
            _checknSetupSysEvent: function(t) {
                var e = !1, i = !1;
                return -1 !== D.indexOf(t) ? (this._touchListener || (this._touchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: !0,
                    owner: this,
                    mask: z(this),
                    onTouchBegan: M,
                    onTouchMoved: O,
                    onTouchEnded: L,
                    onTouchCancelled: I
                }), c.addListener(this._touchListener, this), e = !0), i = !0) : -1 !== S.indexOf(t) && (this._mouseListener || (this._mouseListener = cc.EventListener.create({
                    event: cc.EventListener.MOUSE,
                    _previousIn: !1,
                    owner: this,
                    mask: z(this),
                    onMouseDown: F,
                    onMouseMove: P,
                    onMouseUp: N,
                    onMouseScroll: B
                }), c.addListener(this._mouseListener, this), e = !0), i = !0), e && !this._activeInHierarchy && cc.director.getScheduler().schedule(function() {
                    this._activeInHierarchy || c.pauseTarget(this);
                }, this, 0, 0, 0, !1), i;
            },
            on: function(t, e, i, n) {
                if (this._checknSetupSysEvent(t)) return this._onDispatch(t, e, i, n);
                switch (t) {
                  case w.POSITION_CHANGED:
                    this._eventMask |= 1;
                    break;

                  case w.SCALE_CHANGED:
                    this._eventMask |= 2;
                    break;

                  case w.ROTATION_CHANGED:
                    this._eventMask |= 4;
                    break;

                  case w.SIZE_CHANGED:
                    this._eventMask |= 8;
                    break;

                  case w.ANCHOR_CHANGED:
                    this._eventMask |= 16;
                    break;

                  case w.COLOR_CHANGED:
                    this._eventMask |= 32;
                }
                return this._bubblingListeners || (this._bubblingListeners = new _()), this._bubblingListeners.on(t, e, i);
            },
            once: function(t, e, i, n) {
                var r = this, s = this._checknSetupSysEvent(t), a = "__ONCE_FLAG:" + t, o = null;
                (o = s && n ? this._capturingListeners = this._capturingListeners || new _() : this._bubblingListeners = this._bubblingListeners || new _()).hasEventListener(a, e, i) || function() {
                    var n = r, s = function(r, c, h, l, u) {
                        n.off(t, s, i), o.remove(a, e, i), e.call(this, r, c, h, l, u);
                    };
                    r.on(t, s, i), o.add(a, e, i);
                }();
            },
            _onDispatch: function(t, e, i, n) {
                if ("boolean" == typeof i ? (n = i, i = void 0) : n = !!n, e) {
                    var r = null;
                    return (r = n ? this._capturingListeners = this._capturingListeners || new _() : this._bubblingListeners = this._bubblingListeners || new _()).hasEventListener(t, e, i) || (r.add(t, e, i), 
                    i && i.__eventTargets && i.__eventTargets.push(this)), e;
                }
                cc.errorID(6800);
            },
            off: function(t, e, i, n) {
                var r = -1 !== D.indexOf(t), s = !r && -1 !== S.indexOf(t);
                if (r || s) this._offDispatch(t, e, i, n), r ? this._touchListener && !k(this, D) && (c.removeListener(this._touchListener), 
                this._touchListener = null) : s && this._mouseListener && !k(this, S) && (c.removeListener(this._mouseListener), 
                this._mouseListener = null); else if (this._bubblingListeners) {
                    if (this._bubblingListeners.off(t, e, i), !this._bubblingListeners.hasEventListener(t)) switch (t) {
                      case w.POSITION_CHANGED:
                        this._eventMask &= -2;
                        break;

                      case w.SCALE_CHANGED:
                        this._eventMask &= -3;
                        break;

                      case w.ROTATION_CHANGED:
                        this._eventMask &= -5;
                        break;

                      case w.SIZE_CHANGED:
                        this._eventMask &= -9;
                        break;

                      case w.ANCHOR_CHANGED:
                        this._eventMask &= -17;
                        break;

                      case w.COLOR_CHANGED:
                        this._eventMask &= -33;
                    }
                }
            },
            _offDispatch: function(t, e, i, n) {
                if ("boolean" == typeof i ? (n = i, i = void 0) : n = !!n, e) {
                    var r = n ? this._capturingListeners : this._bubblingListeners;
                    r && (r.remove(t, e, i), i && i.__eventTargets && u.array.fastRemove(i.__eventTargets, this));
                } else this._capturingListeners && this._capturingListeners.removeAll(t), this._bubblingListeners && this._bubblingListeners.removeAll(t);
            },
            targetOff: function(t) {
                var e = this._bubblingListeners;
                e && (e.targetOff(t), 1 & this._eventMask && !e.hasEventListener(w.POSITION_CHANGED) && (this._eventMask &= -2), 
                2 & this._eventMask && !e.hasEventListener(w.SCALE_CHANGED) && (this._eventMask &= -3), 
                4 & this._eventMask && !e.hasEventListener(w.ROTATION_CHANGED) && (this._eventMask &= -5), 
                8 & this._eventMask && !e.hasEventListener(w.SIZE_CHANGED) && (this._eventMask &= -9), 
                16 & this._eventMask && !e.hasEventListener(w.ANCHOR_CHANGED) && (this._eventMask &= -17), 
                32 & this._eventMask && !e.hasEventListener(w.COLOR_CHANGED) && (this._eventMask &= -33)), 
                this._capturingListeners && this._capturingListeners.targetOff(t), this._touchListener && !k(this, D) && (c.removeListener(this._touchListener), 
                this._touchListener = null), this._mouseListener && !k(this, S) && (c.removeListener(this._mouseListener), 
                this._mouseListener = null);
            },
            hasEventListener: function(t) {
                var e = !1;
                return this._bubblingListeners && (e = this._bubblingListeners.hasEventListener(t)), 
                !e && this._capturingListeners && (e = this._capturingListeners.hasEventListener(t)), 
                e;
            },
            emit: function(t, e, i, n, r, s) {
                this._bubblingListeners && this._bubblingListeners.emit(t, e, i, n, r, s);
            },
            dispatchEvent: function(t) {
                (function(t, e) {
                    var i, n;
                    for (e.target = t, C.length = 0, t._getCapturingTargets(e.type, C), e.eventPhase = 1, 
                    n = C.length - 1; n >= 0; --n) if ((i = C[n])._capturingListeners && (e.currentTarget = i, 
                    i._capturingListeners.emit(e.type, e, C), e._propagationStopped)) return void (C.length = 0);
                    if (C.length = 0, e.eventPhase = 2, e.currentTarget = t, t._capturingListeners && t._capturingListeners.emit(e.type, e), 
                    !e._propagationImmediateStopped && t._bubblingListeners && t._bubblingListeners.emit(e.type, e), 
                    !e._propagationStopped && e.bubbles) for (t._getBubblingTargets(e.type, C), e.eventPhase = 3, 
                    n = 0; n < C.length; ++n) if ((i = C[n])._bubblingListeners && (e.currentTarget = i, 
                    i._bubblingListeners.emit(e.type, e), e._propagationStopped)) return void (C.length = 0);
                    C.length = 0;
                })(this, t), C.length = 0;
            },
            pauseSystemEvents: function(t) {
                c.pauseTarget(this, t);
            },
            resumeSystemEvents: function(t) {
                c.resumeTarget(this, t);
            },
            _hitTest: function(t, e) {
                var i = this._contentSize.width, n = this._contentSize.height, r = g, s = y, o = cc.Camera.findCamera(this);
                if (o ? o.getCameraToWorldPoint(t, r) : r.set(t), this._updateWorldMatrix(), a.mat4.invert(x, this._worldMatrix), 
                a.vec2.transformMat4(s, r, x), s.x += this._anchorPoint.x * i, s.y += this._anchorPoint.y * n, 
                s.x >= 0 && s.y >= 0 && s.x <= i && s.y <= n) {
                    if (e && e.mask) {
                        for (var c = e.mask, h = this, l = 0; h && l < c.index; ++l, h = h.parent) ;
                        if (h === c.node) {
                            var u = h.getComponent(cc.Mask);
                            return !u || !u.enabledInHierarchy || u._hitTest(r);
                        }
                        return e.mask = null, !0;
                    }
                    return !0;
                }
                return !1;
            },
            _getCapturingTargets: function(t, e) {
                for (var i = this.parent; i; ) i._capturingListeners && i._capturingListeners.hasEventListener(t) && e.push(i), 
                i = i.parent;
            },
            _getBubblingTargets: function(t, e) {
                for (var i = this.parent; i; ) i._bubblingListeners && i._bubblingListeners.hasEventListener(t) && e.push(i), 
                i = i.parent;
            },
            runAction: m ? function(t) {
                if (this.active) return cc.assertID(t, 1618), cc.director.getActionManager().addAction(t, this, !1), 
                t;
            } : v,
            pauseAllActions: m ? function() {
                cc.director.getActionManager().pauseTarget(this);
            } : v,
            resumeAllActions: m ? function() {
                cc.director.getActionManager().resumeTarget(this);
            } : v,
            stopAllActions: m ? function() {
                cc.director.getActionManager().removeAllActionsFromTarget(this);
            } : v,
            stopAction: m ? function(t) {
                cc.director.getActionManager().removeAction(t);
            } : v,
            stopActionByTag: m ? function(t) {
                t !== cc.Action.TAG_INVALID ? cc.director.getActionManager().removeActionByTag(t, this) : cc.logID(1612);
            } : v,
            getActionByTag: m ? function(t) {
                return t === cc.Action.TAG_INVALID ? (cc.logID(1613), null) : cc.director.getActionManager().getActionByTag(t, this);
            } : function() {
                return null;
            },
            getNumberOfRunningActions: m ? function() {
                return cc.director.getActionManager().getNumberOfRunningActionsInTarget(this);
            } : function() {
                return 0;
            },
            getPosition: function() {
                return new cc.Vec2(this._position);
            },
            setPosition: function(t, e) {
                var i;
                void 0 === e ? (i = t.x, e = t.y) : i = t;
                var n = this._position;
                n.x === i && n.y === e || (n.x = i, n.y = e, this.setLocalDirty(b.POSITION), this._renderFlag |= d.FLAG_WORLD_TRANSFORM, 
                1 & this._eventMask && this.emit(w.POSITION_CHANGED));
            },
            getScale: function() {
                return this._scale.x !== this._scale.y && cc.logID(1603), this._scale.x;
            },
            setScale: function(t, e) {
                t && "number" != typeof t ? (e = t.y, t = t.x) : void 0 === e && (e = t), this._scale.x === t && this._scale.y === e || (this._scale.x = t, 
                this._scale.y = e, this.setLocalDirty(b.SCALE), this._renderFlag |= d.FLAG_TRANSFORM, 
                2 & this._eventMask && this.emit(w.SCALE_CHANGED));
            },
            getContentSize: function() {
                return cc.size(this._contentSize.width, this._contentSize.height);
            },
            setContentSize: function(t, e) {
                var i = this._contentSize;
                if (void 0 === e) {
                    if (t.width === i.width && t.height === i.height) return;
                    0, i.width = t.width, i.height = t.height;
                } else {
                    if (t === i.width && e === i.height) return;
                    0, i.width = t, i.height = e;
                }
                8 & this._eventMask && this.emit(w.SIZE_CHANGED);
            },
            getAnchorPoint: function() {
                return cc.v2(this._anchorPoint);
            },
            setAnchorPoint: function(t, e) {
                var i = this._anchorPoint;
                if (void 0 === e) {
                    if (t.x === i.x && t.y === i.y) return;
                    i.x = t.x, i.y = t.y;
                } else {
                    if (t === i.x && e === i.y) return;
                    i.x = t, i.y = e;
                }
                this.setLocalDirty(b.POSITION), 16 & this._eventMask && this.emit(w.ANCHOR_CHANGED);
            },
            _invTransformPoint: function(t, e) {
                return this._parent ? this._parent._invTransformPoint(t, e) : a.vec3.copy(t, e), 
                a.vec3.sub(t, t, this._position), a.quat.conjugate(T, this._quat), a.vec3.transformQuat(t, t, T), 
                a.vec3.inverseSafe(E, this._scale), a.vec3.mul(t, t, E), t;
            },
            getWorldPos: function(t) {
                a.vec3.copy(t, this._position);
                for (var e = this._parent; e; ) a.vec3.mul(t, t, e._scale), a.vec3.transformQuat(t, t, e._quat), 
                a.vec3.add(t, t, e._position), e = e._parent;
                return t;
            },
            setWorldPos: function(t) {
                this._parent ? this._parent._invTransformPoint(this._position, t) : a.vec3.copy(this._position, t), 
                this.setLocalDirty(b.POSITION), 1 & this._eventMask && this.emit(w.POSITION_CHANGED);
            },
            getWorldRot: function(t) {
                a.quat.copy(t, this._quat);
                for (var e = this._parent; e; ) a.quat.mul(t, e._quat, t), e = e._parent;
                return t;
            },
            setWorldRot: function(t) {
                this._parent ? (this._parent.getWorldRot(this._quat), a.quat.conjugate(this._quat, this._quat), 
                a.quat.mul(this._quat, this._quat, t)) : a.quat.copy(this._quat, t), this.setLocalDirty(b.ROTATION);
            },
            getWorldRT: function(t) {
                var e = E, i = T;
                a.vec3.copy(e, this._position), a.quat.copy(i, this._quat);
                for (var n = this._parent; n; ) a.vec3.mul(e, e, n._scale), a.vec3.transformQuat(e, e, n._quat), 
                a.vec3.add(e, e, n._position), a.quat.mul(i, n._quat, i), n = n._parent;
                return a.mat4.fromRT(t, i, e), t;
            },
            lookAt: function(t, e) {
                this.getWorldPos(E), a.vec3.sub(E, E, t), a.vec3.normalize(E, E), a.quat.fromViewUp(T, E, e), 
                this.setWorldRot(T);
            },
            _updateLocalMatrix: function() {
                var t = this._localMatDirty;
                if (t) {
                    var e = this._matrix;
                    if (t & (b.RT | b.SKEW)) {
                        var i = this._rotationX || this._rotationY, n = this._skewX || this._skewY, r = this._scale.x, s = this._scale.y;
                        if (i || n) {
                            var a = 1, o = 0, c = 0, h = 1;
                            if (i) {
                                var l = this._rotationX * p;
                                if (c = Math.sin(l), h = Math.cos(l), this._rotationY === this._rotationX) a = h, 
                                o = -c; else {
                                    var u = this._rotationY * p;
                                    a = Math.cos(u), o = -Math.sin(u);
                                }
                            }
                            if (e.m00 = a *= r, e.m01 = o *= r, e.m04 = c *= s, e.m05 = h *= s, n) {
                                var _ = e.m00, d = e.m01, f = e.m04, m = e.m05, v = Math.tan(this._skewX * p), g = Math.tan(this._skewY * p);
                                v === 1 / 0 && (v = 99999999), g === 1 / 0 && (g = 99999999), e.m00 = _ + f * g, 
                                e.m01 = d + m * g, e.m04 = f + _ * v, e.m05 = m + d * v;
                            }
                        } else e.m00 = r, e.m01 = 0, e.m04 = 0, e.m05 = s;
                    }
                    e.m12 = this._position.x, e.m13 = this._position.y, this._localMatDirty = 0, this._worldMatDirty = !0;
                }
            },
            _calculWorldMatrix: function() {
                this._localMatDirty && this._updateLocalMatrix();
                var t = this._parent;
                if (t) {
                    var e = t._worldMatrix, i = this._matrix, n = this._worldMatrix, r = i.m00, s = i.m01, o = i.m04, c = i.m05, h = i.m12, l = i.m13, u = e.m00, _ = e.m01, d = e.m04, f = e.m05, p = e.m12, m = e.m13;
                    0 !== _ || 0 !== d ? (n.m00 = r * u + s * d, n.m01 = r * _ + s * f, n.m04 = o * u + c * d, 
                    n.m05 = o * _ + c * f, n.m12 = u * h + d * l + p, n.m13 = _ * h + f * l + m) : (n.m00 = r * u, 
                    n.m01 = s * f, n.m04 = o * u, n.m05 = c * f, n.m12 = u * h + p, n.m13 = f * l + m);
                } else a.mat4.copy(this._worldMatrix, this._matrix);
                this._worldMatDirty = !1;
            },
            _updateWorldMatrix: function() {
                if (this._parent && this._parent._updateWorldMatrix(), this._worldMatDirty) {
                    this._calculWorldMatrix();
                    for (var t = this._children, e = 0, i = t.length; e < i; e++) t[e]._worldMatDirty = !0;
                }
            },
            setLocalDirty: function(t) {
                this._localMatDirty = this._localMatDirty | t, this._worldMatDirty = !0;
            },
            setWorldDirty: function() {
                this._worldMatDirty = !0;
            },
            getLocalMatrix: function(t) {
                return this._updateLocalMatrix(), a.mat4.copy(t, this._matrix);
            },
            getWorldMatrix: function(t) {
                return this._updateWorldMatrix(), a.mat4.copy(t, this._worldMatrix);
            },
            convertToNodeSpace: function(t) {
                this._updateWorldMatrix(), a.mat4.invert(x, this._worldMatrix);
                var e = new cc.Vec2();
                return a.vec2.transformMat4(e, t, x), e.x += this._anchorPoint.x * this._contentSize.width, 
                e.y += this._anchorPoint.y * this._contentSize.height, e;
            },
            convertToWorldSpace: function(t) {
                this._updateWorldMatrix();
                var e = new cc.Vec2(t.x - this._anchorPoint.x * this._contentSize.width, t.y - this._anchorPoint.y * this._contentSize.height);
                return a.vec2.transformMat4(e, e, this._worldMatrix);
            },
            convertToNodeSpaceAR: function(t) {
                this._updateWorldMatrix(), a.mat4.invert(x, this._worldMatrix);
                var e = new cc.Vec2();
                return a.vec2.transformMat4(e, t, x);
            },
            convertToWorldSpaceAR: function(t) {
                this._updateWorldMatrix();
                var e = new cc.Vec2();
                return a.vec2.transformMat4(e, t, this._worldMatrix);
            },
            getNodeToParentTransform: function(t) {
                t || (t = o.identity()), this._updateLocalMatrix();
                var e = this._contentSize;
                return E.x = -this._anchorPoint.x * e.width, E.y = -this._anchorPoint.y * e.height, 
                a.mat4.copy(x, this._matrix), a.mat4.translate(x, x, E), o.fromMat4(t, x);
            },
            getNodeToParentTransformAR: function(t) {
                return t || (t = o.identity()), this._updateLocalMatrix(), o.fromMat4(t, this._matrix);
            },
            getNodeToWorldTransform: function(t) {
                t || (t = o.identity()), this._updateWorldMatrix();
                var e = this._contentSize;
                return E.x = -this._anchorPoint.x * e.width, E.y = -this._anchorPoint.y * e.height, 
                a.mat4.copy(x, this._worldMatrix), a.mat4.translate(x, x, E), o.fromMat4(t, x);
            },
            getNodeToWorldTransformAR: function(t) {
                return t || (t = o.identity()), this._updateWorldMatrix(), o.fromMat4(t, this._worldMatrix);
            },
            getParentToNodeTransform: function(t) {
                return t || (t = o.identity()), this._updateLocalMatrix(), a.mat4.invert(x, this._matrix), 
                o.fromMat4(t, x);
            },
            getWorldToNodeTransform: function(t) {
                return t || (t = o.identity()), this._updateWorldMatrix(), a.mat4.invert(x, this._worldMatrix), 
                o.fromMat4(t, x);
            },
            convertTouchToNodeSpace: function(t) {
                return this.convertToNodeSpace(t.getLocation());
            },
            convertTouchToNodeSpaceAR: function(t) {
                return this.convertToNodeSpaceAR(t.getLocation());
            },
            getBoundingBox: function() {
                this._updateLocalMatrix();
                var t = this._contentSize.width, e = this._contentSize.height, i = cc.rect(-this._anchorPoint.x * t, -this._anchorPoint.y * e, t, e);
                return i.transformMat4(i, this._matrix);
            },
            getBoundingBoxToWorld: function() {
                return this._parent ? (this._parent._updateWorldMatrix(), this._getBoundingBoxTo(this._parent._worldMatrix)) : this.getBoundingBox();
            },
            _getBoundingBoxTo: function(t) {
                this._updateLocalMatrix();
                var e = this._contentSize.width, i = this._contentSize.height, n = cc.rect(-this._anchorPoint.x * e, -this._anchorPoint.y * i, e, i);
                t = a.mat4.mul(this._worldMatrix, t, this._matrix);
                if (n.transformMat4(n, t), !this._children) return n;
                for (var r = this._children, s = 0; s < r.length; s++) {
                    var o = r[s];
                    if (o && o.active) {
                        var c = o._getBoundingBoxTo(t);
                        c && n.union(n, c);
                    }
                }
                return n;
            },
            _updateOrderOfArrival: function() {
                var t = this._parent ? ++this._parent._childArrivalOrder : 0;
                if (this._localZOrder = 4294901760 & this._localZOrder | t, 65535 === t) {
                    var e = this._parent._children;
                    e.forEach(function(t, e) {
                        t._localZOrder = 4294901760 & t._localZOrder | e + 1;
                    }), this._parent._childArrivalOrder = e.length;
                }
            },
            addChild: function(t, e, i) {
                cc.assertID(t, 1606), cc.assertID(null === t._parent, 1605), t.parent = this, void 0 !== e && (t.zIndex = e), 
                void 0 !== i && (t.name = i);
            },
            cleanup: function() {
                m && cc.director.getActionManager().removeAllActionsFromTarget(this), c.removeListeners(this);
                var t, e, i = this._children.length;
                for (t = 0; t < i; ++t) (e = this._children[t]) && e.cleanup();
            },
            sortAllChildren: function() {
                if (this._reorderChildDirty) {
                    this._reorderChildDirty = !1;
                    var t = this._children;
                    if (t.length > 1) {
                        var e, i, n, r = t.length;
                        for (e = 1; e < r; e++) {
                            for (n = t[e], i = e - 1; i >= 0 && n._localZOrder < t[i]._localZOrder; ) t[i + 1] = t[i], 
                            i--;
                            t[i + 1] = n;
                        }
                        this.emit(w.CHILD_REORDER, this);
                    }
                    cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
                }
            },
            _delaySort: function() {
                this._reorderChildDirty || (this._reorderChildDirty = !0, cc.director.__fastOn(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this));
            },
            _restoreProperties: !1,
            onRestore: !1
        });
        l.propertyDefine(G, [ "position", "scale", "rotation" ]), cc.Node = e.exports = G;
    }, {
        "./event-manager": 48,
        "./event/event": 51,
        "./event/event-target": 50,
        "./platform/CCMacro": 87,
        "./platform/js": 102,
        "./renderer/render-engine": 124,
        "./renderer/render-flow": 125,
        "./utils/affine-transform": 153,
        "./utils/base-node": 154,
        "./utils/math-pools": 158,
        "./utils/misc": 159,
        "./utils/prefab-helper": 162
    } ],
    5: [ function(t, e, i) {
        "use strict";
        var n = t("./CCNode"), r = t("./renderer/render-flow"), s = t("./renderer/render-engine").math, a = n._LocalDirtyFlag, o = (s.vec3.create(), 
        cc.Class({
            name: "cc.PrivateNode",
            extends: n,
            properties: {
                x: {
                    get: function() {
                        return this._originPos.x;
                    },
                    set: function(t) {
                        var e = this._originPos;
                        t !== e.x && (e.x = t, this._posDirty(!0));
                    },
                    override: !0
                },
                y: {
                    get: function() {
                        return this._originPos.y;
                    },
                    set: function(t) {
                        var e = this._originPos;
                        t !== e.y && (e.y = t, this._posDirty(!0));
                    },
                    override: !0
                },
                zIndex: {
                    get: function() {
                        return cc.macro.MIN_ZINDEX;
                    },
                    set: function() {
                        cc.warnID(1638);
                    },
                    override: !0
                }
            },
            ctor: function(t) {
                this._localZOrder = cc.macro.MIN_ZINDEX << 16, this._originPos = cc.v2();
            },
            _posDirty: function(t) {
                this.setLocalDirty(a.POSITION), this._renderFlag |= r.FLAG_TRANSFORM, !0 === t && 1 & this._eventMask && this.emit(n.EventType.POSITION_CHANGED);
            },
            _updateLocalMatrix: function() {
                if (this._localMatDirty) {
                    var t = this.parent;
                    t && (this._position.x = this._originPos.x - (t._anchorPoint.x - .5) * t._contentSize.width, 
                    this._position.y = this._originPos.y - (t._anchorPoint.y - .5) * t._contentSize.height), 
                    this._super();
                }
            },
            getPosition: function() {
                return new cc.Vec2(this._originPos);
            },
            setPosition: function(t, e) {
                void 0 === e && (e = (t = t.x).y);
                var i = this._originPos;
                i.x === t && i.y === e || (i.x = t, i.y = e, this._posDirty(!0));
            },
            setParent: function(t) {
                var e = this._parent;
                this._super(t), e !== t && (e && e.off(n.EventType.ANCHOR_CHANGED, this._posDirty, this), 
                t && t.on(n.EventType.ANCHOR_CHANGED, this._posDirty, this));
            },
            _updateOrderOfArrival: function() {}
        }));
        cc.js.getset(o.prototype, "parent", o.prototype.getParent, o.prototype.setParent), 
        cc.js.getset(o.prototype, "position", o.prototype.getPosition, o.prototype.setPosition), 
        cc.PrivateNode = e.exports = o;
    }, {
        "./CCNode": 4,
        "./renderer/render-engine": 124,
        "./renderer/render-flow": 125
    } ],
    6: [ function(t, e, i) {
        cc.Scene = cc.Class({
            name: "cc.Scene",
            extends: t("./CCNode"),
            properties: {
                autoReleaseAssets: {
                    default: void 0,
                    type: cc.Boolean
                }
            },
            ctor: function() {
                this._anchorPoint.x = 0, this._anchorPoint.y = 0, this._activeInHierarchy = !1, 
                this._inited = !cc.game._isCloning, this.dependAssets = null;
            },
            destroy: function() {
                if (cc.Object.prototype.destroy.call(this)) for (var t = this._children, e = 0; e < t.length; ++e) t[e].active = !1;
                this._active = !1, this._activeInHierarchy = !1;
            },
            _onHierarchyChanged: function() {},
            _instantiate: null,
            _load: function() {
                this._inited || (this._onBatchCreated(), this._inited = !0);
            },
            _activate: function(t) {
                t = !1 !== t, cc.director._nodeActivator.activateNode(this, t);
            }
        }), e.exports = cc.Scene;
    }, {
        "./CCNode": 4
    } ],
    7: [ function(t, e, i) {
        var n = t("./platform/js"), r = new (t("./platform/id-generater"))("Scheduler"), s = function(t, e, i, n) {
            this.target = t, this.priority = e, this.paused = i, this.markedForDeletion = n;
        }, a = [];
        s.get = function(t, e, i, n) {
            var r = a.pop();
            return r ? (r.target = t, r.priority = e, r.paused = i, r.markedForDeletion = n) : r = new s(t, e, i, n), 
            r;
        }, s.put = function(t) {
            a.length < 20 && (t.target = null, a.push(t));
        };
        var o = function(t, e, i, n) {
            this.list = t, this.entry = e, this.target = i, this.callback = n;
        }, c = [];
        o.get = function(t, e, i, n) {
            var r = c.pop();
            return r ? (r.list = t, r.entry = e, r.target = i, r.callback = n) : r = new o(t, e, i, n), 
            r;
        }, o.put = function(t) {
            c.length < 20 && (t.list = t.entry = t.target = t.callback = null, c.push(t));
        };
        var h = function(t, e, i, n, r, s) {
            var a = this;
            a.timers = t, a.target = e, a.timerIndex = i, a.currentTimer = n, a.currentTimerSalvaged = r, 
            a.paused = s;
        }, l = [];
        function u() {
            this._lock = !1, this._scheduler = null, this._elapsed = -1, this._runForever = !1, 
            this._useDelay = !1, this._timesExecuted = 0, this._repeat = 0, this._delay = 0, 
            this._interval = 0, this._target = null, this._callback = null;
        }
        h.get = function(t, e, i, n, r, s) {
            var a = l.pop();
            return a ? (a.timers = t, a.target = e, a.timerIndex = i, a.currentTimer = n, a.currentTimerSalvaged = r, 
            a.paused = s) : a = new h(t, e, i, n, r, s), a;
        }, h.put = function(t) {
            l.length < 20 && (t.timers = t.target = t.currentTimer = null, l.push(t));
        };
        var _ = u.prototype;
        _.initWithCallback = function(t, e, i, n, r, s) {
            return this._lock = !1, this._scheduler = t, this._target = i, this._callback = e, 
            this._elapsed = -1, this._interval = n, this._delay = s, this._useDelay = this._delay > 0, 
            this._repeat = r, this._runForever = this._repeat === cc.macro.REPEAT_FOREVER, !0;
        }, _.getInterval = function() {
            return this._interval;
        }, _.setInterval = function(t) {
            this._interval = t;
        }, _.update = function(t) {
            -1 === this._elapsed ? (this._elapsed = 0, this._timesExecuted = 0) : (this._elapsed += t, 
            this._runForever && !this._useDelay ? this._elapsed >= this._interval && (this.trigger(), 
            this._elapsed = 0) : (this._useDelay ? this._elapsed >= this._delay && (this.trigger(), 
            this._elapsed -= this._delay, this._timesExecuted += 1, this._useDelay = !1) : this._elapsed >= this._interval && (this.trigger(), 
            this._elapsed = 0, this._timesExecuted += 1), this._callback && !this._runForever && this._timesExecuted > this._repeat && this.cancel()));
        }, _.getCallback = function() {
            return this._callback;
        }, _.trigger = function() {
            this._target && this._callback && (this._lock = !0, this._callback.call(this._target, this._elapsed), 
            this._lock = !1);
        }, _.cancel = function() {
            this._scheduler.unschedule(this._callback, this._target);
        };
        var d = [];
        u.get = function() {
            return d.pop() || new u();
        }, u.put = function(t) {
            d.length < 20 && !t._lock && (t._scheduler = t._target = t._callback = null, d.push(t));
        }, cc.Scheduler = function() {
            this._timeScale = 1, this._updatesNegList = [], this._updates0List = [], this._updatesPosList = [], 
            this._hashForUpdates = n.createMap(!0), this._hashForTimers = n.createMap(!0), this._currentTarget = null, 
            this._currentTargetSalvaged = !1, this._updateHashLocked = !1, this._arrayForTimers = [];
        }, cc.Scheduler.prototype = {
            constructor: cc.Scheduler,
            _removeHashElement: function(t) {
                delete this._hashForTimers[t.target._id];
                for (var e = this._arrayForTimers, i = 0, n = e.length; i < n; i++) if (e[i] === t) {
                    e.splice(i, 1);
                    break;
                }
                h.put(t);
            },
            _removeUpdateFromHash: function(t) {
                var e = t.target._id, i = this._hashForUpdates[e];
                if (i) {
                    for (var n = i.list, r = i.entry, a = 0, c = n.length; a < c; a++) if (n[a] === r) {
                        n.splice(a, 1);
                        break;
                    }
                    delete this._hashForUpdates[e], s.put(r), o.put(i);
                }
            },
            _priorityIn: function(t, e, i) {
                for (var n = 0; n < t.length; n++) if (i < t[n].priority) return void t.splice(n, 0, e);
                t.push(e);
            },
            _appendIn: function(t, e) {
                t.push(e);
            },
            enableForTarget: function(t) {
                t._id || (t.__instanceId ? cc.warnID(1513) : t._id = r.getNewId());
            },
            setTimeScale: function(t) {
                this._timeScale = t;
            },
            getTimeScale: function() {
                return this._timeScale;
            },
            update: function(t) {
                var e, i, n, r;
                for (this._updateHashLocked = !0, 1 !== this._timeScale && (t *= this._timeScale), 
                e = 0, n = (i = this._updatesNegList).length; e < n; e++) (r = i[e]).paused || r.markedForDeletion || r.target.update(t);
                for (e = 0, n = (i = this._updates0List).length; e < n; e++) (r = i[e]).paused || r.markedForDeletion || r.target.update(t);
                for (e = 0, n = (i = this._updatesPosList).length; e < n; e++) (r = i[e]).paused || r.markedForDeletion || r.target.update(t);
                var s, a = this._arrayForTimers;
                for (e = 0; e < a.length; e++) {
                    if (s = a[e], this._currentTarget = s, this._currentTargetSalvaged = !1, !s.paused) for (s.timerIndex = 0; s.timerIndex < s.timers.length; ++s.timerIndex) s.currentTimer = s.timers[s.timerIndex], 
                    s.currentTimerSalvaged = !1, s.currentTimer.update(t), s.currentTimer = null;
                    this._currentTargetSalvaged && 0 === this._currentTarget.timers.length && (this._removeHashElement(this._currentTarget), 
                    --e);
                }
                for (e = 0, i = this._updatesNegList; e < i.length; ) (r = i[e]).markedForDeletion ? this._removeUpdateFromHash(r) : e++;
                for (e = 0, i = this._updates0List; e < i.length; ) (r = i[e]).markedForDeletion ? this._removeUpdateFromHash(r) : e++;
                for (e = 0, i = this._updatesPosList; e < i.length; ) (r = i[e]).markedForDeletion ? this._removeUpdateFromHash(r) : e++;
                this._updateHashLocked = !1, this._currentTarget = null;
            },
            schedule: function(t, e, i, n, r, s) {
                "use strict";
                if ("function" != typeof t) {
                    var a = t;
                    t = e, e = a;
                }
                4 !== arguments.length && 5 !== arguments.length || (s = !!n, n = cc.macro.REPEAT_FOREVER, 
                r = 0), cc.assertID(e, 1502);
                var o = e._id;
                o || (e.__instanceId ? (cc.warnID(1513), o = e._id = e.__instanceId) : cc.errorID(1510));
                var c, l, _ = this._hashForTimers[o];
                if (_ ? _.paused !== s && cc.warnID(1511) : (_ = h.get(null, e, 0, null, null, s), 
                this._arrayForTimers.push(_), this._hashForTimers[o] = _), null == _.timers) _.timers = []; else for (l = 0; l < _.timers.length; ++l) if ((c = _.timers[l]) && t === c._callback) return cc.logID(1507, c.getInterval(), i), 
                void (c._interval = i);
                (c = u.get()).initWithCallback(this, t, e, i, n, r), _.timers.push(c), this._currentTarget === _ && this._currentTargetSalvaged && (this._currentTargetSalvaged = !1);
            },
            scheduleUpdate: function(t, e, i) {
                var n = t._id;
                n || (t.__instanceId ? (cc.warnID(1513), n = t._id = t.__instanceId) : cc.errorID(1510));
                var r = this._hashForUpdates[n];
                if (r && r.entry) {
                    if (r.entry.priority === e) return r.entry.markedForDeletion = !1, void (r.entry.paused = i);
                    if (this._updateHashLocked) return cc.logID(1506), r.entry.markedForDeletion = !1, 
                    void (r.entry.paused = i);
                    this.unscheduleUpdate(t);
                }
                var a, c = s.get(t, e, i, !1);
                0 === e ? (a = this._updates0List, this._appendIn(a, c)) : (a = e < 0 ? this._updatesNegList : this._updatesPosList, 
                this._priorityIn(a, c, e)), this._hashForUpdates[n] = o.get(a, c, t, null);
            },
            unschedule: function(t, e) {
                if (e && t) {
                    var i = e._id;
                    i || (e.__instanceId ? (cc.warnID(1513), i = e._id = e.__instanceId) : cc.errorID(1510));
                    var n = this._hashForTimers[i];
                    if (n) for (var r = n.timers, s = 0, a = r.length; s < a; s++) {
                        var o = r[s];
                        if (t === o._callback) return o !== n.currentTimer || n.currentTimerSalvaged || (n.currentTimerSalvaged = !0), 
                        r.splice(s, 1), u.put(o), n.timerIndex >= s && n.timerIndex--, void (0 === r.length && (this._currentTarget === n ? this._currentTargetSalvaged = !0 : this._removeHashElement(n)));
                    }
                }
            },
            unscheduleUpdate: function(t) {
                if (t) {
                    var e = t._id;
                    e || (t.__instanceId ? (cc.warnID(1513), e = t._id = t.__instanceId) : cc.errorID(1510));
                    var i = this._hashForUpdates[e];
                    i && (this._updateHashLocked ? i.entry.markedForDeletion = !0 : this._removeUpdateFromHash(i.entry));
                }
            },
            unscheduleAllForTarget: function(t) {
                if (t) {
                    var e = t._id;
                    e || (t.__instanceId ? (cc.warnID(1513), e = t._id = t.__instanceId) : cc.errorID(1510));
                    var i = this._hashForTimers[e];
                    if (i) {
                        var n = i.timers;
                        n.indexOf(i.currentTimer) > -1 && !i.currentTimerSalvaged && (i.currentTimerSalvaged = !0);
                        for (var r = 0, s = n.length; r < s; r++) u.put(n[r]);
                        n.length = 0, this._currentTarget === i ? this._currentTargetSalvaged = !0 : this._removeHashElement(i);
                    }
                    this.unscheduleUpdate(t);
                }
            },
            unscheduleAll: function() {
                this.unscheduleAllWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
            },
            unscheduleAllWithMinPriority: function(t) {
                var e, i, n, r = this._arrayForTimers;
                for (e = r.length - 1; e >= 0; e--) i = r[e], this.unscheduleAllForTarget(i.target);
                var s = 0;
                if (t < 0) for (e = 0; e < this._updatesNegList.length; ) s = this._updatesNegList.length, 
                (n = this._updatesNegList[e]) && n.priority >= t && this.unscheduleUpdate(n.target), 
                s == this._updatesNegList.length && e++;
                if (t <= 0) for (e = 0; e < this._updates0List.length; ) s = this._updates0List.length, 
                (n = this._updates0List[e]) && this.unscheduleUpdate(n.target), s == this._updates0List.length && e++;
                for (e = 0; e < this._updatesPosList.length; ) s = this._updatesPosList.length, 
                (n = this._updatesPosList[e]) && n.priority >= t && this.unscheduleUpdate(n.target), 
                s == this._updatesPosList.length && e++;
            },
            isScheduled: function(t, e) {
                cc.assertID(t, 1508), cc.assertID(e, 1509);
                var i = e._id;
                i || (e.__instanceId ? (cc.warnID(1513), i = e._id = e.__instanceId) : cc.errorID(1510));
                var n = this._hashForTimers[i];
                if (!n) return !1;
                if (null == n.timers) return !1;
                for (var r = n.timers, s = 0; s < r.length; ++s) {
                    if (t === r[s]._callback) return !0;
                }
                return !1;
            },
            pauseAllTargets: function() {
                return this.pauseAllTargetsWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
            },
            pauseAllTargetsWithMinPriority: function(t) {
                var e, i, n, r, s = [], a = this._arrayForTimers;
                for (i = 0, n = a.length; i < n; i++) (e = a[i]) && (e.paused = !0, s.push(e.target));
                if (t < 0) for (i = 0; i < this._updatesNegList.length; i++) (r = this._updatesNegList[i]) && r.priority >= t && (r.paused = !0, 
                s.push(r.target));
                if (t <= 0) for (i = 0; i < this._updates0List.length; i++) (r = this._updates0List[i]) && (r.paused = !0, 
                s.push(r.target));
                for (i = 0; i < this._updatesPosList.length; i++) (r = this._updatesPosList[i]) && r.priority >= t && (r.paused = !0, 
                s.push(r.target));
                return s;
            },
            resumeTargets: function(t) {
                if (t) for (var e = 0; e < t.length; e++) this.resumeTarget(t[e]);
            },
            pauseTarget: function(t) {
                cc.assertID(t, 1503);
                var e = t._id;
                e || (t.__instanceId ? (cc.warnID(1513), e = t._id = t.__instanceId) : cc.errorID(1510));
                var i = this._hashForTimers[e];
                i && (i.paused = !0);
                var n = this._hashForUpdates[e];
                n && (n.entry.paused = !0);
            },
            resumeTarget: function(t) {
                cc.assertID(t, 1504);
                var e = t._id;
                e || (t.__instanceId ? (cc.warnID(1513), e = t._id = t.__instanceId) : cc.errorID(1510));
                var i = this._hashForTimers[e];
                i && (i.paused = !1);
                var n = this._hashForUpdates[e];
                n && (n.entry.paused = !1);
            },
            isTargetPaused: function(t) {
                cc.assertID(t, 1505);
                var e = t._id;
                e || (t.__instanceId ? (cc.warnID(1513), e = t._id = t.__instanceId) : cc.errorID(1510));
                var i = this._hashForTimers[e];
                if (i) return i.paused;
                var n = this._hashForUpdates[e];
                return !!n && n.entry.paused;
            }
        }, cc.Scheduler.PRIORITY_SYSTEM = 1 << 31, cc.Scheduler.PRIORITY_NON_SYSTEM = cc.Scheduler.PRIORITY_SYSTEM + 1, 
        e.exports = cc.Scheduler;
    }, {
        "./platform/id-generater": 98,
        "./platform/js": 102
    } ],
    8: [ function(t, e, i) {
        var n = t("./CCRawAsset");
        cc.Asset = cc.Class({
            name: "cc.Asset",
            extends: n,
            ctor: function() {
                this.loaded = !0;
            },
            properties: {
                nativeUrl: {
                    get: function() {
                        if (this._native) {
                            var t = this._native;
                            if (47 === t.charCodeAt(0)) return t.slice(1);
                            if (cc.AssetLibrary) {
                                var e = cc.AssetLibrary.getLibUrlNoExt(this._uuid, !0);
                                return 46 === t.charCodeAt(0) ? e + t : e + "/" + t;
                            }
                            cc.errorID(6400);
                        }
                        return "";
                    },
                    visible: !1
                },
                _native: "",
                _nativeAsset: {
                    get: function() {},
                    set: function(t) {}
                }
            },
            statics: {
                deserialize: !1,
                preventDeferredLoadDependents: !1,
                preventPreloadNativeObject: !1
            },
            toString: function() {
                return this.nativeUrl;
            },
            serialize: !1,
            createNode: null,
            _setRawAsset: function(t, e) {
                this._native = !1 !== e ? t || void 0 : "/" + t;
            }
        }), e.exports = cc.Asset;
    }, {
        "./CCRawAsset": 16
    } ],
    9: [ function(t, e, i) {
        var n = t("./CCAsset"), r = t("../event/event-target"), s = cc.Enum({
            WEB_AUDIO: 0,
            DOM_AUDIO: 1
        }), a = cc.Class({
            name: "cc.AudioClip",
            extends: n,
            mixins: [ r ],
            ctor: function() {
                this.loaded = !1, this._audio = null;
            },
            properties: {
                loadMode: {
                    default: s.WEB_AUDIO,
                    type: s
                },
                _nativeAsset: {
                    get: function() {
                        return this._audio;
                    },
                    set: function(t) {
                        t instanceof cc.AudioClip ? this._audio = t._nativeAsset : this._audio = t, this._audio && (this.loaded = !0, 
                        this.emit("load"));
                    },
                    override: !0
                }
            },
            statics: {
                LoadMode: s,
                _loadByUrl: function(t, e) {
                    var i = cc.loader.getItem(t) || cc.loader.getItem(t + "?useDom=1");
                    i && i.complete ? i._owner instanceof a ? e(null, i._owner) : e(null, i.content) : cc.loader.load(t, function(n, r) {
                        if (n) return e(n);
                        i = cc.loader.getItem(t) || cc.loader.getItem(t + "?useDom=1"), e(null, i.content);
                    });
                }
            },
            destroy: function() {
                cc.audioEngine.uncache(this), this._super();
            }
        });
        cc.AudioClip = a, e.exports = a;
    }, {
        "../event/event-target": 50,
        "./CCAsset": 8
    } ],
    10: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.BitmapFont",
            extends: cc.Font,
            properties: {
                fntDataStr: {
                    default: ""
                },
                spriteFrame: {
                    default: null,
                    type: cc.SpriteFrame
                },
                fontSize: {
                    default: -1
                },
                _fntConfig: null
            }
        });
        cc.BitmapFont = n, e.exports = n;
    }, {} ],
    11: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.BufferAsset",
            extends: cc.Asset,
            ctor: function() {
                this._buffer = null;
            },
            properties: {
                _nativeAsset: {
                    get: function() {
                        return this._buffer;
                    },
                    set: function(t) {
                        this._buffer = t.buffer || t;
                    },
                    override: !0
                }
            }
        });
        cc.BufferAsset = e.exports = n;
    }, {} ],
    12: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.Font",
            extends: cc.Asset
        });
        cc.Font = e.exports = n;
    }, {} ],
    13: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.JsonAsset",
            extends: cc.Asset,
            properties: {
                json: null
            }
        });
        e.exports = cc.JsonAsset = n;
    }, {} ],
    14: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.LabelAtlas",
            extends: cc.BitmapFont
        });
        cc.LabelAtlas = n, e.exports = n;
    }, {} ],
    15: [ function(t, e, i) {
        var n = cc.Enum({
            AUTO: 0,
            SINGLE_INSTANCE: 1,
            MULTI_INSTANCE: 2
        }), r = cc.Class({
            name: "cc.Prefab",
            extends: cc.Asset,
            ctor: function() {
                this._createFunction = null, this._instantiatedTimes = 0;
            },
            properties: {
                data: null,
                optimizationPolicy: n.AUTO,
                asyncLoadAssets: !1
            },
            statics: {
                OptimizationPolicy: n,
                OptimizationPolicyThreshold: 3
            },
            createNode: !1,
            compileCreateFunction: function() {
                var e = t("../platform/instantiate-jit");
                this._createFunction = e.compile(this.data);
            },
            _doInstantiate: function(t) {
                return this.data._prefab ? this.data._prefab._synced = !0 : cc.warnID(3700), this._createFunction || this.compileCreateFunction(), 
                this._createFunction(t);
            },
            _instantiate: function() {
                var t, e = !1;
                return e ? (t = this._doInstantiate(), this.data._instantiate(t)) : (this.data._prefab._synced = !0, 
                t = this.data._instantiate()), ++this._instantiatedTimes, t;
            }
        });
        cc.Prefab = e.exports = r, cc.js.obsolete(cc, "cc._Prefab", "Prefab");
    }, {
        "../platform/instantiate-jit": 100
    } ],
    16: [ function(t, e, i) {
        var n = t("../platform/CCObject"), r = t("../platform/js");
        cc.RawAsset = cc.Class({
            name: "cc.RawAsset",
            extends: n,
            ctor: function() {
                Object.defineProperty(this, "_uuid", {
                    value: "",
                    writable: !0
                });
            }
        }), r.value(cc.RawAsset, "isRawAssetType", function(t) {
            return r.isChildClassOf(t, cc.RawAsset) && !r.isChildClassOf(t, cc.Asset);
        }), r.value(cc.RawAsset, "wasRawAssetType", function(t) {
            return t === cc.Texture2D || t === cc.AudioClip || t === cc.ParticleAsset || t === cc.Asset;
        }), e.exports = cc.RawAsset;
    }, {
        "../platform/CCObject": 88,
        "../platform/js": 102
    } ],
    17: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.SceneAsset",
            extends: cc.Asset,
            properties: {
                scene: null,
                asyncLoadAssets: void 0
            }
        });
        cc.SceneAsset = n, e.exports = n;
    }, {} ],
    18: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.Script",
            extends: cc.Asset
        });
        cc._Script = n;
        var r = cc.Class({
            name: "cc.JavaScript",
            extends: n
        });
        cc._JavaScript = r;
        var s = cc.Class({
            name: "cc.CoffeeScript",
            extends: n
        });
        cc._CoffeeScript = s;
        var a = cc.Class({
            name: "cc.TypeScript",
            extends: n
        });
        cc._TypeScript = a;
    }, {} ],
    19: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.SpriteAtlas",
            extends: cc.Asset,
            properties: {
                _spriteFrames: {
                    default: {}
                }
            },
            getTexture: function() {
                var t = Object.keys(this._spriteFrames);
                if (t.length > 0) {
                    var e = this._spriteFrames[t[0]];
                    return e ? e.getTexture() : null;
                }
                return null;
            },
            getSpriteFrame: function(t) {
                var e = this._spriteFrames[t];
                return e ? (e.name || (e.name = t), e) : null;
            },
            getSpriteFrames: function() {
                var t = [], e = this._spriteFrames;
                for (var i in e) t.push(this.getSpriteFrame(i));
                return t;
            }
        });
        cc.SpriteAtlas = n, e.exports = n;
    }, {} ],
    20: [ function(t, e, i) {
        var n = t("../event/event-target"), r = t("../utils/texture-util"), s = [ {
            u: 0,
            v: 0
        }, {
            u: 0,
            v: 0
        }, {
            u: 0,
            v: 0
        }, {
            u: 0,
            v: 0
        } ], a = cc.Class({
            name: "cc.SpriteFrame",
            extends: t("../assets/CCAsset"),
            mixins: [ n ],
            properties: {
                _textureSetter: {
                    set: function(t) {
                        t && (this._texture !== t && this._refreshTexture(t), this._textureFilename = t.url);
                    }
                },
                insetTop: {
                    get: function() {
                        return this._capInsets[1];
                    },
                    set: function(t) {
                        this._capInsets[1] = t, this._texture && this._calculateSlicedUV();
                    }
                },
                insetBottom: {
                    get: function() {
                        return this._capInsets[3];
                    },
                    set: function(t) {
                        this._capInsets[3] = t, this._texture && this._calculateSlicedUV();
                    }
                },
                insetLeft: {
                    get: function() {
                        return this._capInsets[0];
                    },
                    set: function(t) {
                        this._capInsets[0] = t, this._texture && this._calculateSlicedUV();
                    }
                },
                insetRight: {
                    get: function() {
                        return this._capInsets[2];
                    },
                    set: function(t) {
                        this._capInsets[2] = t, this._texture && this._calculateSlicedUV();
                    }
                }
            },
            ctor: function() {
                n.call(this);
                var t = arguments[0], e = arguments[1], i = arguments[2], r = arguments[3], s = arguments[4];
                this._rect = null, this.uv = [], this._texture = null, this._original = null, this._offset = null, 
                this._originalSize = null, this._rotated = !1, this.vertices = null, this._capInsets = [ 0, 0, 0, 0 ], 
                this.uvSliced = [], this._textureFilename = "", void 0 !== t && this.setTexture(t, e, i, r, s);
            },
            textureLoaded: function() {
                return this._texture && this._texture.loaded;
            },
            isRotated: function() {
                return this._rotated;
            },
            setRotated: function(t) {
                this._rotated = t, this._texture && this._calculateUV();
            },
            getRect: function() {
                return cc.rect(this._rect);
            },
            setRect: function(t) {
                this._rect = t, this._texture && this._calculateUV();
            },
            getOriginalSize: function() {
                return cc.size(this._originalSize);
            },
            setOriginalSize: function(t) {
                this._originalSize ? (this._originalSize.width = t.width, this._originalSize.height = t.height) : this._originalSize = cc.size(t);
            },
            getTexture: function() {
                return this._texture;
            },
            _textureLoadedCallback: function() {
                var t = this._texture;
                if (t) {
                    var e = t.width, i = t.height;
                    this._rotated && cc.game.renderType === cc.game.RENDER_TYPE_CANVAS && (this._rotated = !1, 
                    e = this._texture.width, i = this._texture.height, this._rect = cc.rect(0, 0, e, i)), 
                    this._rect ? this._checkRect(this._texture) : this._rect = cc.rect(0, 0, e, i), 
                    this._originalSize || this.setOriginalSize(cc.size(e, i)), this._offset || this.setOffset(cc.v2(0, 0)), 
                    this._calculateUV(), this.emit("load");
                }
            },
            _refreshTexture: function(t) {
                this._texture = t, t.loaded ? this._textureLoadedCallback() : t.once("load", this._textureLoadedCallback, this);
            },
            getOffset: function() {
                return cc.v2(this._offset);
            },
            setOffset: function(t) {
                this._offset = cc.v2(t);
            },
            clone: function() {
                return new a(this._texture || this._textureFilename, this._rect, this._rotated, this._offset, this._originalSize);
            },
            setTexture: function(t, e, i, n, r) {
                this._rect = e || null, n ? this.setOffset(n) : this._offset = null, r ? this.setOriginalSize(r) : this._originalSize = null, 
                this._rotated = i || !1;
                var s = t;
                return "string" == typeof s && s && (this._textureFilename = s, this._loadTexture()), 
                s instanceof cc.Texture2D && this._texture !== s && this._refreshTexture(s), !0;
            },
            _loadTexture: function() {
                if (this._textureFilename) {
                    var t = r.loadImage(this._textureFilename);
                    this._refreshTexture(t);
                }
            },
            ensureLoadTexture: function() {
                this._texture ? this._texture.loaded || (this._refreshTexture(this._texture), r.postLoadTexture(this._texture)) : this._textureFilename && this._loadTexture();
            },
            clearTexture: function() {
                this._texture = null;
            },
            _checkRect: function(t) {
                var e = this._rect, i = e.x, n = e.y;
                this._rotated ? (i += e.height, n += e.width) : (i += e.width, n += e.height), i > t.width && cc.errorID(3300, t.url + "/" + this.name, i, t.width), 
                n > t.height && cc.errorID(3400, t.url + "/" + this.name, n, t.height);
            },
            _calculateSlicedUV: function() {
                var t = this._rect, e = this._texture.width, i = this._texture.height, n = this._capInsets[0], r = this._capInsets[2], a = t.width - n - r, o = this._capInsets[1], c = this._capInsets[3], h = t.height - o - c, l = this.uvSliced;
                if (l.length = 0, this._rotated) {
                    s[0].u = t.x / e, s[1].u = (t.x + c) / e, s[2].u = (t.x + c + h) / e, s[3].u = (t.x + t.height) / e, 
                    s[3].v = t.y / i, s[2].v = (t.y + n) / i, s[1].v = (t.y + n + a) / i, s[0].v = (t.y + t.width) / i;
                    for (var u = 0; u < 4; ++u) for (var _ = s[u], d = 0; d < 4; ++d) {
                        var f = s[3 - d];
                        l.push({
                            u: _.u,
                            v: f.v
                        });
                    }
                } else {
                    s[0].u = t.x / e, s[1].u = (t.x + n) / e, s[2].u = (t.x + n + a) / e, s[3].u = (t.x + t.width) / e, 
                    s[3].v = t.y / i, s[2].v = (t.y + o) / i, s[1].v = (t.y + o + h) / i, s[0].v = (t.y + t.height) / i;
                    for (var p = 0; p < 4; ++p) for (var m = s[p], v = 0; v < 4; ++v) {
                        var g = s[v];
                        l.push({
                            u: g.u,
                            v: m.v
                        });
                    }
                }
            },
            _setDynamicAtlasFrame: function(t) {
                t && (this._original = {
                    _texture: this._texture,
                    _x: this._rect.x,
                    _y: this._rect.y
                }, this._texture = t.texture, this._rect.x = t.x, this._rect.y = t.y, this._calculateUV());
            },
            _resetDynamicAtlasFrame: function() {
                this._original && (this._rect.x = this._original._x, this._rect.y = this._original._y, 
                this._texture = this._original._texture, this._original = null, this._calculateUV());
            },
            _calculateUV: function() {
                var t = this._rect, e = this._texture, i = this.uv, n = e.width, r = e.height;
                if (this._rotated) {
                    var s = 0 === n ? 0 : t.x / n, a = 0 === n ? 0 : (t.x + t.height) / n, o = 0 === r ? 0 : (t.y + t.width) / r, c = 0 === r ? 0 : t.y / r;
                    i[0] = s, i[1] = c, i[2] = s, i[3] = o, i[4] = a, i[5] = c, i[6] = a, i[7] = o;
                } else {
                    var h = 0 === n ? 0 : t.x / n, l = 0 === n ? 0 : (t.x + t.width) / n, u = 0 === r ? 0 : (t.y + t.height) / r, _ = 0 === r ? 0 : t.y / r;
                    i[0] = h, i[1] = u, i[2] = l, i[3] = u, i[4] = h, i[5] = _, i[6] = l, i[7] = _;
                }
                var d = this.vertices;
                if (d) {
                    d.nu.length = 0, d.nv.length = 0;
                    for (var f = 0; f < d.u.length; f++) d.nu[f] = d.u[f] / n, d.nv[f] = d.v[f] / r;
                }
                this._calculateSlicedUV();
            },
            _serialize: !1,
            _deserialize: function(t, e) {
                var i = t.rect;
                i && (this._rect = new cc.Rect(i[0], i[1], i[2], i[3])), t.offset && this.setOffset(new cc.Vec2(t.offset[0], t.offset[1])), 
                t.originalSize && this.setOriginalSize(new cc.Size(t.originalSize[0], t.originalSize[1])), 
                this._rotated = 1 === t.rotated, this._name = t.name;
                var n = t.capInsets;
                n && (this._capInsets[0] = n[0], this._capInsets[1] = n[1], this._capInsets[2] = n[2], 
                this._capInsets[3] = n[3]), this.vertices = t.vertices, this.vertices && (this.vertices.nu = [], 
                this.vertices.nv = []);
                var r = t.texture;
                r && e.result.push(this, "_textureSetter", r);
            }
        }), o = a.prototype;
        o.copyWithZone = o.clone, o.copy = o.clone, o.initWithTexture = o.setTexture, cc.SpriteFrame = a, 
        e.exports = a;
    }, {
        "../assets/CCAsset": 8,
        "../event/event-target": 50,
        "../utils/texture-util": 167
    } ],
    21: [ function(t, e, i) {
        var n = t("./CCFont"), r = cc.Class({
            name: "cc.TTFFont",
            extends: n,
            properties: {
                _fontFamily: null,
                _nativeAsset: {
                    type: cc.String,
                    get: function() {
                        return this._fontFamily;
                    },
                    set: function(t) {
                        this._fontFamily = t || "Arial";
                    },
                    override: !0
                }
            }
        });
        cc.TTFFont = e.exports = r;
    }, {
        "./CCFont": 12
    } ],
    22: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.TextAsset",
            extends: cc.Asset,
            properties: {
                text: ""
            },
            toString: function() {
                return this.text;
            }
        });
        e.exports = cc.TextAsset = n;
    }, {} ],
    23: [ function(t, e, i) {
        var n = t("../event/event-target"), r = t("../renderer/render-engine"), s = t("../renderer");
        t("../platform/CCClass");
        var a = r.gfx, o = new (t("../platform/id-generater"))("Tex"), c = cc.Enum({
            RGB565: a.TEXTURE_FMT_R5_G6_B5,
            RGB5A1: a.TEXTURE_FMT_R5_G5_B5_A1,
            RGBA4444: a.TEXTURE_FMT_R4_G4_B4_A4,
            RGB888: a.TEXTURE_FMT_RGB8,
            RGBA8888: a.TEXTURE_FMT_RGBA8,
            A8: a.TEXTURE_FMT_A8,
            I8: a.TEXTURE_FMT_L8,
            AI8: a.TEXTURE_FMT_L8_A8
        }), h = cc.Enum({
            REPEAT: 10497,
            CLAMP_TO_EDGE: 33071,
            MIRRORED_REPEAT: 33648
        }), l = cc.Enum({
            LINEAR: 9729,
            NEAREST: 9728
        }), u = {
            9728: 0,
            9729: 1
        }, _ = [], d = {
            width: void 0,
            height: void 0,
            minFilter: void 0,
            magFilter: void 0,
            wrapS: void 0,
            wrapT: void 0,
            format: void 0,
            mipmap: void 0,
            images: void 0,
            image: void 0,
            flipY: void 0,
            premultiplyAlpha: void 0
        };
        function f() {
            for (var t in d) d[t] = void 0;
            return _.length = 0, d.images = _, d.flipY = !1, d;
        }
        var p = cc.Class({
            name: "cc.Texture2D",
            extends: t("../assets/CCAsset"),
            mixins: [ n ],
            properties: {
                _nativeAsset: {
                    get: function() {
                        return this._image;
                    },
                    set: function(t) {
                        this.initWithElement(t);
                    },
                    override: !0
                },
                _hasMipmap: !1,
                _format: c.RGBA8888,
                _premultiplyAlpha: !1,
                _flipY: !1,
                _minFilter: l.LINEAR,
                _magFilter: l.LINEAR,
                _wrapS: h.CLAMP_TO_EDGE,
                _wrapT: h.CLAMP_TO_EDGE
            },
            statics: {
                PixelFormat: c,
                WrapMode: h,
                Filter: l,
                _FilterIndex: u,
                extnames: [ ".png", ".jpg", ".jpeg", ".bmp", ".webp" ]
            },
            ctor: function() {
                this._id = o.getNewId(), this.url = "", this.loaded = !1, this.width = 0, this.height = 0, 
                this._hashDirty = !0, this._hash = 0, this._texture = null;
            },
            getImpl: function() {
                return this._texture;
            },
            getId: function() {
                return this._id;
            },
            toString: function() {
                return this.url || "";
            },
            update: function(t) {
                if (t) {
                    var e = !1;
                    void 0 !== t.width && (this.width = t.width), void 0 !== t.height && (this.height = t.height), 
                    void 0 !== t.minFilter && (this._minFilter = t.minFilter, t.minFilter = u[t.minFilter]), 
                    void 0 !== t.magFilter && (this._magFilter = t.magFilter, t.magFilter = u[t.magFilter]), 
                    void 0 !== t.wrapS && (this._wrapS = t.wrapS), void 0 !== t.wrapT && (this._wrapT = t.wrapT), 
                    void 0 !== t.format && (this._format = t.format), void 0 !== t.flipY && (this._flipY = t.flipY, 
                    e = !0), void 0 !== t.premultiplyAlpha && (this._premultiplyAlpha = t.premultiplyAlpha, 
                    e = !0), void 0 !== t.mipmap && (this._hasMipmap = t.mipmap), e && this._image && (t.image = this._image), 
                    t.images && t.images.length > 0 ? this._image = t.images[0] : void 0 !== t.image && (this._image = t.image, 
                    t.images || (_.length = 0, t.images = _), t.images.push(t.image)), t.images && t.images.length > 0 && this._texture.update(t), 
                    this._hashDirty = !0;
                }
            },
            initWithElement: function(t) {
                t && (this._image = t, this.handleLoadedTexture());
            },
            initWithData: function(t, e, i, n) {
                var r = f();
                return r.image = t, r.images = [ r.image ], r.hasMipmap = this._hasMipmap, r.premultiplyAlpha = this._premultiplyAlpha, 
                r.flipY = this._flipY, r.minFilter = u[this._minFilter], r.magFilter = u[this._magFilter], 
                r.wrapS = this._wrapS, r.wrapT = this._wrapT, r.format = e, r.width = i, r.height = n, 
                this._texture ? this.update(r) : this._texture = new s.Texture2D(s.device, r), this.width = i, 
                this.height = n, this.loaded = !0, this.emit("load"), !0;
            },
            getHtmlElementObj: function() {
                return this._image;
            },
            destroy: function() {
                this._image = null, this._texture && this._texture.destroy(), this._super();
            },
            getPixelFormat: function() {
                return this._format;
            },
            hasPremultipliedAlpha: function() {
                return this._premultiplyAlpha || !1;
            },
            hasMipmap: function() {
                return this._hasMipmap || !1;
            },
            handleLoadedTexture: function() {
                if (this._image && this._image.width && this._image.height) {
                    this.width = this._image.width, this.height = this._image.height;
                    var t = f();
                    t.image = this._image, t.images = [ t.image ], t.width = this.width, t.height = this.height, 
                    t.hasMipmap = this._hasMipmap, t.format = this._format, t.premultiplyAlpha = this._premultiplyAlpha, 
                    t.flipY = this._flipY, t.minFilter = u[this._minFilter], t.magFilter = u[this._magFilter], 
                    t.wrapS = this._wrapS, t.wrapT = this._wrapT, this._texture ? this._texture.update(t) : this._texture = new s.Texture2D(s.device, t), 
                    this.loaded = !0, this.emit("load"), cc.macro.CLEANUP_IMAGE_CACHE && this._image instanceof HTMLImageElement && this._clearImage();
                }
            },
            description: function() {
                return "<cc.Texture2D | Name = " + this.url + " | Dimensions = " + this.width + " x " + this.height + ">";
            },
            releaseTexture: function() {
                this._image = null, this._texture && this._texture.destroy();
            },
            setWrapMode: function(t, e) {
                if (this._wrapS !== t || this._wrapT !== e) {
                    var i = f();
                    i.wrapS = t, i.wrapT = e, this.update(i);
                }
            },
            setFilters: function(t, e) {
                if (this._minFilter !== t || this._magFilter !== e) {
                    var i = f();
                    i.minFilter = t, i.magFilter = e, this.update(i);
                }
            },
            setFlipY: function(t) {
                if (this._flipY !== t) {
                    var e = f();
                    e.flipY = t, this.update(e);
                }
            },
            setPremultiplyAlpha: function(t) {
                if (this._premultiplyAlpha !== t) {
                    var e = f();
                    e.premultiplyAlpha = t, this.update(e);
                }
            },
            setMipmap: function(t) {
                if (this._hasMipmap !== t) {
                    var e = f();
                    e.hasMipmap = t, this.update(e);
                }
            },
            _serialize: !1,
            _deserialize: function(t, e) {
                var i = t.split(","), n = i[0];
                if (n) {
                    var r = n.charCodeAt(0) - 48, s = p.extnames[r];
                    this._setRawAsset(s || n);
                    var a = e.customEnv, o = a && a.uuid;
                    if (o) {
                        this._uuid = o;
                        var c = this.nativeUrl;
                        this.url = c;
                    }
                }
                6 === i.length && (this._minFilter = parseInt(i[1]), this._magFilter = parseInt(i[2]), 
                this._wrapS = parseInt(i[3]), this._wrapT = parseInt(i[4]), this._premultiplyAlpha = 49 === i[5].charCodeAt(0));
            },
            _getHash: function() {
                if (!this._hashDirty) return this._hash;
                var t = this._hasMipmap ? 1 : 0, e = this._premultiplyAlpha ? 1 : 0, i = this._flipY ? 1 : 0, n = this._minFilter === l.LINEAR ? 1 : 2, r = this._magFilter === l.LINEAR ? 1 : 2, s = this._wrapS === h.REPEAT ? 1 : this._wrapS === h.CLAMP_TO_EDGE ? 2 : 3, a = this._wrapT === h.REPEAT ? 1 : this._wrapT === h.CLAMP_TO_EDGE ? 2 : 3, o = this._format;
                return this._hash = parseInt("" + n + r + o + s + a + t + e + i), this._hashDirty = !1, 
                this._hash;
            },
            _clearImage: function() {
                this._image.src = "", cc.loader.removeItem(this._image.id);
            }
        });
        cc.Texture2D = e.exports = p;
    }, {
        "../assets/CCAsset": 8,
        "../event/event-target": 50,
        "../platform/CCClass": 82,
        "../platform/id-generater": 98,
        "../renderer": 123,
        "../renderer/render-engine": 124
    } ],
    24: [ function(t, e, i) {
        t("./CCRawAsset"), t("./CCAsset"), t("./CCFont"), t("./CCPrefab"), t("./CCAudioClip"), 
        t("./CCScripts"), t("./CCSceneAsset"), t("./CCSpriteFrame"), t("./CCTexture2D"), 
        t("./CCRenderTexture"), t("./CCTTFFont"), t("./CCSpriteAtlas"), t("./CCBitmapFont"), 
        t("./CCLabelAtlas"), t("./CCTextAsset"), t("./CCJsonAsset"), t("./CCBufferAsset");
    }, {
        "./CCAsset": 8,
        "./CCAudioClip": 9,
        "./CCBitmapFont": 10,
        "./CCBufferAsset": 11,
        "./CCFont": 12,
        "./CCJsonAsset": 13,
        "./CCLabelAtlas": 14,
        "./CCPrefab": 15,
        "./CCRawAsset": 16,
        "./CCRenderTexture": void 0,
        "./CCSceneAsset": 17,
        "./CCScripts": 18,
        "./CCSpriteAtlas": 19,
        "./CCSpriteFrame": 20,
        "./CCTTFFont": 21,
        "./CCTextAsset": 22,
        "./CCTexture2D": 23
    } ],
    25: [ function(t, e, i) {
        t("../CCNode").EventType;
        var n = 56, r = 7, s = cc.Enum({
            ONCE: 0,
            ON_WINDOW_RESIZE: 1,
            ALWAYS: 2
        });
        function a(t) {
            return t instanceof cc.Scene ? cc.visibleRect : t._contentSize;
        }
        function o(t, e, i, n) {
            for (var r = t._parent._scale.x, s = t._parent._scale.y, a = 0, o = 0, c = t._parent; ;) {
                var h = c._position;
                if (a += h.x, o += h.y, !(c = c._parent)) return i.x = i.y = 0, void (n.x = n.y = 1);
                if (c === e) break;
                var l = c._scale.x, u = c._scale.y;
                a *= l, o *= u, r *= l, s *= u;
            }
            n.x = 0 !== r ? 1 / r : 1, n.y = 0 !== s ? 1 / s : 1, i.x = -a, i.y = -o;
        }
        var c = cc.Vec2.ZERO, h = cc.Vec2.ONE;
        function l(t, e) {
            var i, s, l, u = e._target;
            u ? o(t, i = u, s = c, l = h) : i = t._parent;
            var _ = a(i), d = i._anchorPoint, f = i instanceof cc.Scene, p = t._position.x, m = t._position.y, v = t._anchorPoint;
            if (e._alignFlags & n) {
                var g, y, x = _.width;
                f ? (g = cc.visibleRect.left.x, y = cc.visibleRect.right.x) : y = (g = -d.x * x) + x, 
                g += e._isAbsLeft ? e._left : e._left * x, y -= e._isAbsRight ? e._right : e._right * x, 
                u && (g += s.x, g *= l.x, y += s.x, y *= l.x);
                var E, T = v.x, C = t._scale.x;
                if (C < 0 && (T = 1 - T, C = -C), e.isStretchWidth) E = y - g, 0 !== C && (t.width = E / C), 
                p = g + T * E; else if (E = t.width * C, e.isAlignHorizontalCenter) {
                    var A = e._isAbsHorizontalCenter ? e._horizontalCenter : e._horizontalCenter * x, b = (.5 - d.x) * _.width;
                    u && (A *= l.x, b += s.x, b *= l.x), p = b + (T - .5) * E + A;
                } else p = e.isAlignLeft ? g + T * E : y + (T - 1) * E;
            }
            if (e._alignFlags & r) {
                var w, D, S = _.height;
                f ? (D = cc.visibleRect.bottom.y, w = cc.visibleRect.top.y) : w = (D = -d.y * S) + S, 
                D += e._isAbsBottom ? e._bottom : e._bottom * S, w -= e._isAbsTop ? e._top : e._top * S, 
                u && (D += s.y, D *= l.y, w += s.y, w *= l.y);
                var R, M = v.y, O = t._scale.y;
                if (O < 0 && (M = 1 - M, O = -O), e.isStretchHeight) R = w - D, 0 !== O && (t.height = R / O), 
                m = D + M * R; else if (R = t.height * O, e.isAlignVerticalCenter) {
                    var L = e._isAbsVerticalCenter ? e._verticalCenter : e._verticalCenter * S, I = (.5 - d.y) * _.height;
                    u && (L *= l.y, I += s.y, I *= l.y), m = I + (M - .5) * R + L;
                } else m = e.isAlignBottom ? D + M * R : w + (M - 1) * R;
            }
            t.setPosition(p, m);
        }
        function u() {
            var t = cc.director.getScene();
            if (t) {
                if (d.isAligning = !0, d._nodesOrderDirty) _.length = 0, function t(e) {
                    var i = e._widget;
                    i && (l(e, i), i.alignMode !== s.ALWAYS ? i.enabled = !1 : _.push(i));
                    for (var n = e._children, r = 0; r < n.length; r++) {
                        var a = n[r];
                        a._active && t(a);
                    }
                }(t), d._nodesOrderDirty = !1; else {
                    var e, i = d._activeWidgetsIterator;
                    for (i.i = 0; i.i < _.length; ++i.i) l((e = _[i.i]).node, e);
                }
                d.isAligning = !1;
            }
        }
        var _ = [];
        var d = cc._widgetManager = e.exports = {
            _AlignFlags: {
                TOP: 1,
                MID: 2,
                BOT: 4,
                LEFT: 8,
                CENTER: 16,
                RIGHT: 32
            },
            isAligning: !1,
            _nodesOrderDirty: !1,
            _activeWidgetsIterator: new cc.js.array.MutableForwardIterator(_),
            init: function(t) {
                t.on(cc.Director.EVENT_AFTER_UPDATE, u), cc.sys.isMobile ? window.addEventListener("resize", this.onResized.bind(this)) : cc.view.on("canvas-resize", this.onResized, this);
            },
            add: function(t) {
                t.node._widget = t, this._nodesOrderDirty = !0;
            },
            remove: function(t) {
                t.node._widget = null, this._activeWidgetsIterator.remove(t);
            },
            onResized: function() {
                var t = cc.director.getScene();
                t && this.refreshWidgetOnResized(t);
            },
            refreshWidgetOnResized: function(t) {
                var e = cc.Node.isNode(t) && t.getComponent(cc.Widget);
                e && e.alignMode === s.ON_WINDOW_RESIZE && (e.enabled = !0);
                for (var i = t._children, n = 0; n < i.length; n++) {
                    var r = i[n];
                    this.refreshWidgetOnResized(r);
                }
            },
            updateAlignment: function t(e) {
                var i = e._parent;
                cc.Node.isNode(i) && t(i);
                var n = e._widget || e.getComponent(cc.Widget);
                n && i && l(e, n);
            },
            AlignMode: s
        };
    }, {
        "../CCNode": 4
    } ],
    26: [ function(t, e, i) {
        var n = t("../utils/affine-transform"), r = t("../renderer/render-engine"), s = t("../renderer/index"), a = t("../renderer/render-flow"), o = t("../CCGame"), c = cc.vmath.mat4, h = cc.vmath.vec2, l = cc.vmath.vec3, u = c.create(), _ = c.create(), d = l.create(), f = [], p = null;
        function m() {
            if (p) {
                var t = p._node, e = cc.visibleRect;
                t.z = e.height / 1.1566, t.x = d.x = e.width / 2, t.y = d.y = e.height / 2, d.z = 0, 
                t.lookAt(d);
            }
        }
        var v = cc.Enum({
            COLOR: 1,
            DEPTH: 2,
            STENCIL: 4
        }), g = cc.Class({
            name: "cc.Camera",
            extends: cc.Component,
            ctor: function() {
                if (o.renderType !== o.RENDER_TYPE_CANVAS) {
                    var t = new r.Camera();
                    t.setStages([ "transparent" ]), this._fov = 60 * Math.PI / 180, t.setFov(this._fov), 
                    t.setNear(.1), t.setFar(4096);
                    var e = new r.View();
                    t.view = e, t.dirty = !0, this._matrixDirty = !0, this._inited = !1, this._camera = t;
                } else this._inited = !0;
            },
            editor: !1,
            properties: {
                _cullingMask: 4294967295,
                _clearFlags: v.DEPTH | v.STENCIL,
                _backgroundColor: cc.color(0, 0, 0, 255),
                _depth: 0,
                _zoomRatio: 1,
                _targetTexture: null,
                zoomRatio: {
                    get: function() {
                        return this._zoomRatio;
                    },
                    set: function(t) {
                        this._zoomRatio = t, this._matrixDirty = !0;
                    }
                },
                cullingMask: {
                    get: function() {
                        return this._cullingMask;
                    },
                    set: function(t) {
                        this._cullingMask = t, this._updateCameraMask();
                    }
                },
                clearFlags: {
                    get: function() {
                        return this._clearFlags;
                    },
                    set: function(t) {
                        this._clearFlags = t, this._camera && this._camera.setClearFlags(t);
                    }
                },
                backgroundColor: {
                    get: function() {
                        return this._backgroundColor;
                    },
                    set: function(t) {
                        this._backgroundColor = t, this._updateBackgroundColor();
                    }
                },
                depth: {
                    get: function() {
                        return this._depth;
                    },
                    set: function(t) {
                        this._depth = t, this._camera && this._camera.setDepth(t);
                    }
                },
                targetTexture: {
                    get: function() {
                        return this._targetTexture;
                    },
                    set: function(t) {
                        this._targetTexture = t, this._updateTargetTexture();
                    }
                }
            },
            statics: {
                main: null,
                cameras: f,
                ClearFlags: v,
                findCamera: function(t) {
                    for (var e = 0, i = f.length; e < i; e++) {
                        var n = f[e];
                        if (n.containsNode(t)) return n;
                    }
                    return null;
                },
                _setupDebugCamera: function() {
                    if (!p && o.renderType !== o.RENDER_TYPE_CANVAS) {
                        var t = new r.Camera();
                        p = t, t.setStages([ "transparent" ]), t.setFov(60 * Math.PI / 180), t.setNear(.1), 
                        t.setFar(4096);
                        var e = new r.View();
                        t.view = e, t.dirty = !0, t._cullingMask = t.view._cullingMask = 1 << cc.Node.BuiltinGroupIndex.DEBUG, 
                        t.setDepth(cc.macro.MAX_ZINDEX), t.setClearFlags(0), t.setColor(0, 0, 0, 0);
                        var i = new cc.Node();
                        t.setNode(i), m(), cc.view.on("design-resolution-changed", m), s.scene.addCamera(t);
                    }
                }
            },
            _updateCameraMask: function() {
                if (this._camera) {
                    var t = this._cullingMask & ~(1 << cc.Node.BuiltinGroupIndex.DEBUG);
                    this._camera._cullingMask = t, this._camera.view._cullingMask = t;
                }
            },
            _updateBackgroundColor: function() {
                if (this._camera) {
                    var t = this._backgroundColor;
                    this._camera.setColor(t.r / 255, t.g / 255, t.b / 255, t.a / 255);
                }
            },
            _updateTargetTexture: function() {
                var t = this._targetTexture;
                this._camera && (this._camera._framebuffer = t ? t._framebuffer : null);
            },
            _onMatrixDirty: function() {
                this._matrixDirty = !0;
            },
            _init: function() {
                this._inited || (this._inited = !0, this._camera && (this._camera.setNode(this.node), 
                this._camera.setClearFlags(this._clearFlags), this._camera.setDepth(this._depth), 
                this._updateBackgroundColor(), this._updateCameraMask(), this._updateTargetTexture()));
            },
            onLoad: function() {
                this._init();
            },
            onEnable: function() {
                this._matrixDirty = !0, o.renderType !== o.RENDER_TYPE_CANVAS && (cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this), 
                s.scene.addCamera(this._camera)), f.push(this);
            },
            onDisable: function() {
                o.renderType !== o.RENDER_TYPE_CANVAS && (cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this), 
                s.scene.removeCamera(this._camera)), cc.js.array.remove(f, this);
            },
            getNodeToCameraTransform: function(t) {
                var e = n.identity();
                return t.getWorldMatrix(_), this.containsNode(t) && (this.getWorldToCameraMatrix(u), 
                c.mul(_, _, u)), n.fromMat4(e, _), e;
            },
            getCameraToWorldPoint: function(t, e) {
                return e = e || cc.v2(), this.getCameraToWorldMatrix(u), h.transformMat4(e, t, u), 
                e;
            },
            getWorldToCameraPoint: function(t, e) {
                return e = e || cc.v2(), this.getWorldToCameraMatrix(u), h.transformMat4(e, t, u), 
                e;
            },
            getCameraToWorldMatrix: function(t) {
                return this.getWorldToCameraMatrix(t), c.invert(t, t), t;
            },
            getWorldToCameraMatrix: function(t) {
                this.node.getWorldRT(u);
                var e = this.zoomRatio;
                u.m00 *= e, u.m01 *= e, u.m04 *= e, u.m05 *= e;
                var i = u.m12, n = u.m13, r = cc.visibleRect.center;
                return u.m12 = r.x - (u.m00 * i + u.m04 * n), u.m13 = r.y - (u.m01 * i + u.m05 * n), 
                t !== u && c.copy(t, u), t;
            },
            containsNode: function(t) {
                return t._cullingMask & this.cullingMask;
            },
            render: function(t) {
                if (!(t = t || cc.director.getScene())) return null;
                this.node.getWorldMatrix(u), this.beforeDraw(), a.visit(t), s._forward.renderCamera(this._camera, s.scene);
            },
            beforeDraw: function() {
                var t = this.node;
                if (this._matrixDirty || t._worldMatDirty) {
                    var e = this._camera, i = 2 * Math.atan(Math.tan(this._fov / 2) / this.zoomRatio);
                    e.setFov(i);
                    var n = cc.game.canvas.height / cc.view._scaleY, r = this._targetTexture;
                    r && (n = r.height), t._updateWorldMatrix(), d.x = t._worldMatrix.m12, d.y = t._worldMatrix.m13, 
                    d.z = 0, t.z = n / (2 * Math.tan(this._fov / 2)), t.lookAt(d), this._matrixDirty = !1, 
                    e.dirty = !0;
                }
            }
        });
        e.exports = cc.Camera = g;
    }, {
        "../CCGame": 3,
        "../renderer/index": 123,
        "../renderer/render-engine": 124,
        "../renderer/render-flow": 125,
        "../utils/affine-transform": 153
    } ],
    27: [ function(t, e, i) {
        t("./platform/CCClass");
        var n = t("./platform/CCObject").Flags, r = t("./platform/js").array, s = n.IsStartCalled, a = n.IsOnEnableCalled, o = (n.IsEditorOnEnableCalled, 
        function(t) {
            t.start(), t._objFlags |= s;
        }), c = function(t, e) {
            t.update(e);
        }, h = function(t, e) {
            t.lateUpdate(e);
        };
        function l(t, e) {
            for (var i = e.constructor._executionOrder, n = e._id, r = 0, s = t.length - 1, a = s >>> 1; r <= s; a = r + s >>> 1) {
                var o = t[a], c = o.constructor._executionOrder;
                if (c > i) s = a - 1; else if (c < i) r = a + 1; else {
                    var h = o._id;
                    if (h > n) s = a - 1; else {
                        if (!(h < n)) return a;
                        r = a + 1;
                    }
                }
            }
            return ~r;
        }
        function u(t, e) {
            for (var i = t.array, n = t.i + 1; n < i.length; ) {
                var r = i[n];
                r._enabled && r.node._activeInHierarchy ? ++n : (t.removeAt(n), e && (r._objFlags &= ~e));
            }
        }
        var _ = cc.Class({
            __ctor__: function(t) {
                var e = r.MutableForwardIterator;
                this._zero = new e([]), this._neg = new e([]), this._pos = new e([]), this._invoke = t;
            },
            statics: {
                stableRemoveInactive: u
            },
            add: null,
            remove: null,
            invoke: null
        });
        function d(t, e) {
            return t.constructor._executionOrder - e.constructor._executionOrder;
        }
        var f = cc.Class({
            extends: _,
            add: function(t) {
                var e = t.constructor._executionOrder;
                (0 === e ? this._zero : e < 0 ? this._neg : this._pos).array.push(t);
            },
            remove: function(t) {
                var e = t.constructor._executionOrder;
                (0 === e ? this._zero : e < 0 ? this._neg : this._pos).fastRemove(t);
            },
            cancelInactive: function(t) {
                u(this._zero, t), u(this._neg, t), u(this._pos, t);
            },
            invoke: function() {
                var t = this._neg;
                t.array.length > 0 && (t.array.sort(d), this._invoke(t), t.array.length = 0), this._invoke(this._zero), 
                this._zero.array.length = 0;
                var e = this._pos;
                e.array.length > 0 && (e.array.sort(d), this._invoke(e), e.array.length = 0);
            }
        }), p = cc.Class({
            extends: _,
            add: function(t) {
                var e = t.constructor._executionOrder;
                if (0 === e) this._zero.array.push(t); else {
                    var i = e < 0 ? this._neg.array : this._pos.array, n = l(i, t);
                    n < 0 && i.splice(~n, 0, t);
                }
            },
            remove: function(t) {
                var e = t.constructor._executionOrder;
                if (0 === e) this._zero.fastRemove(t); else {
                    var i = e < 0 ? this._neg : this._pos, n = l(i.array, t);
                    n >= 0 && i.removeAt(n);
                }
            },
            invoke: function(t) {
                this._neg.array.length > 0 && this._invoke(this._neg, t), this._invoke(this._zero, t), 
                this._pos.array.length > 0 && this._invoke(this._pos, t);
            }
        });
        function m(t, e) {
            if ("function" == typeof t) return e ? function(e, i) {
                var n = e.array;
                for (e.i = 0; e.i < n.length; ++e.i) {
                    var r = n[e.i];
                    t(r, i);
                }
            } : function(e) {
                var i = e.array;
                for (e.i = 0; e.i < i.length; ++e.i) {
                    var n = i[e.i];
                    t(n);
                }
            };
            var i = "var a=it.array;for(it.i=0;it.i<a.length;++it.i){var c=a[it.i];" + t + "}";
            return e ? Function("it", "dt", i) : Function("it", i);
        }
        function v() {
            this.startInvoker = new f(m(o)), this.updateInvoker = new p(m(c, !0)), this.lateUpdateInvoker = new p(m(h, !0)), 
            this.scheduleInNextFrame = [], this._updating = !1;
        }
        var g = cc.Class({
            ctor: v,
            unscheduleAll: v,
            statics: {
                LifeCycleInvoker: _,
                OneOffInvoker: f,
                createInvokeImpl: m,
                invokeOnEnable: function(t) {
                    var e = cc.director._compScheduler, i = t.array;
                    for (t.i = 0; t.i < i.length; ++t.i) {
                        var n = i[t.i];
                        if (n._enabled) n.onEnable(), !n.node._activeInHierarchy || e._onEnabled(n);
                    }
                }
            },
            _onEnabled: function(t) {
                cc.director.getScheduler().resumeTarget(t), t._objFlags |= a, this._updating ? this.scheduleInNextFrame.push(t) : this._scheduleImmediate(t);
            },
            _onDisabled: function(t) {
                cc.director.getScheduler().pauseTarget(t), t._objFlags &= ~a;
                var e = this.scheduleInNextFrame.indexOf(t);
                e >= 0 ? r.fastRemoveAt(this.scheduleInNextFrame, e) : (!t.start || t._objFlags & s || this.startInvoker.remove(t), 
                t.update && this.updateInvoker.remove(t), t.lateUpdate && this.lateUpdateInvoker.remove(t));
            },
            enableComp: function(t, e) {
                if (!(t._objFlags & a)) {
                    if (t.onEnable) {
                        if (e) return void e.add(t);
                        if (t.onEnable(), !t.node._activeInHierarchy) return;
                    }
                    this._onEnabled(t);
                }
            },
            disableComp: function(t) {
                t._objFlags & a && (t.onDisable && t.onDisable(), this._onDisabled(t));
            },
            _scheduleImmediate: function(t) {
                !t.start || t._objFlags & s || this.startInvoker.add(t), t.update && this.updateInvoker.add(t), 
                t.lateUpdate && this.lateUpdateInvoker.add(t);
            },
            _deferredSchedule: function() {
                for (var t = this.scheduleInNextFrame, e = 0, i = t.length; e < i; e++) {
                    var n = t[e];
                    this._scheduleImmediate(n);
                }
                t.length = 0;
            },
            startPhase: function() {
                this._updating = !0, this.scheduleInNextFrame.length > 0 && this._deferredSchedule(), 
                this.startInvoker.invoke();
            },
            updatePhase: function(t) {
                this.updateInvoker.invoke(t);
            },
            lateUpdatePhase: function(t) {
                this.lateUpdateInvoker.invoke(t), this._updating = !1;
            }
        });
        e.exports = g;
    }, {
        "./platform/CCClass": 82,
        "./platform/CCObject": 88,
        "./platform/js": 102,
        "./utils/misc": 159
    } ],
    28: [ function(t, e, i) {
        var n = [ "touchstart", "touchmove", "touchend", "mousedown", "mousemove", "mouseup", "mouseenter", "mouseleave", "mousewheel" ];
        function r(t) {
            t.stopPropagation();
        }
        var s = cc.Class({
            name: "cc.BlockInputEvents",
            extends: t("./CCComponent"),
            editor: {
                menu: "i18n:MAIN_MENU.component.ui/Block Input Events",
                inspector: "packages://inspector/inspectors/comps/block-input-events.js",
                help: "i18n:COMPONENT.help_url.block_input_events"
            },
            onEnable: function() {
                for (var t = 0; t < n.length; t++) this.node.on(n[t], r, this);
            },
            onDisable: function() {
                for (var t = 0; t < n.length; t++) this.node.off(n[t], r, this);
            }
        });
        cc.BlockInputEvents = e.exports = s;
    }, {
        "./CCComponent": 30
    } ],
    29: [ function(t, e, i) {
        var n = t("../camera/CCCamera"), r = t("./CCComponent"), s = cc.Class({
            name: "cc.Canvas",
            extends: r,
            editor: !1,
            resetInEditor: !1,
            statics: {
                instance: null
            },
            properties: {
                _designResolution: cc.size(960, 640),
                designResolution: {
                    get: function() {
                        return cc.size(this._designResolution);
                    },
                    set: function(t) {
                        this._designResolution.width = t.width, this._designResolution.height = t.height, 
                        this.applySettings(), this.alignWithScreen();
                    },
                    tooltip: !1
                },
                _fitWidth: !1,
                _fitHeight: !0,
                fitHeight: {
                    get: function() {
                        return this._fitHeight;
                    },
                    set: function(t) {
                        this._fitHeight !== t && (this._fitHeight = t, this.applySettings(), this.alignWithScreen());
                    },
                    tooltip: !1
                },
                fitWidth: {
                    get: function() {
                        return this._fitWidth;
                    },
                    set: function(t) {
                        this._fitWidth !== t && (this._fitWidth = t, this.applySettings(), this.alignWithScreen());
                    },
                    tooltip: !1
                }
            },
            ctor: function() {
                this._thisOnResized = this.alignWithScreen.bind(this);
            },
            __preload: function() {
                if (s.instance) return cc.errorID(6700, this.node.name, s.instance.node.name);
                s.instance = this, cc.sys.isMobile ? window.addEventListener("resize", this._thisOnResized) : cc.view.on("canvas-resize", this._thisOnResized), 
                this.applySettings(), this.alignWithScreen();
                var t = cc.find("Main Camera", this.node);
                t || ((t = new cc.Node("Main Camera")).parent = this.node, t.setSiblingIndex(0));
                var e = t.getComponent(n);
                if (!e) {
                    e = t.addComponent(n);
                    var i = n.ClearFlags;
                    e.clearFlags = i.COLOR | i.DEPTH | i.STENCIL, e.depth = -1;
                }
                n.main = e;
            },
            onDestroy: function() {
                cc.sys.isMobile ? window.removeEventListener("resize", this._thisOnResized) : cc.view.off("canvas-resize", this._thisOnResized), 
                s.instance === this && (s.instance = null);
            },
            alignWithScreen: function() {
                var t, e, i = e = cc.visibleRect;
                t = cc.view.getDesignResolutionSize();
                var n = 0, r = 0;
                !this.fitHeight && !this.fitWidth && (n = .5 * (t.width - i.width), r = .5 * (t.height - i.height)), 
                this.node.setPosition(.5 * i.width + n, .5 * i.height + r), this.node.width = e.width, 
                this.node.height = e.height;
            },
            applySettings: function() {
                var t, e = cc.ResolutionPolicy;
                t = this.fitHeight && this.fitWidth ? e.SHOW_ALL : this.fitHeight || this.fitWidth ? this.fitWidth ? e.FIXED_WIDTH : e.FIXED_HEIGHT : e.NO_BORDER;
                var i = this._designResolution;
                cc.view.setDesignResolutionSize(i.width, i.height, t);
            }
        });
        cc.Canvas = e.exports = s;
    }, {
        "../camera/CCCamera": 26,
        "./CCComponent": 30
    } ],
    30: [ function(t, e, i) {
        var n = t("../platform/CCObject"), r = t("../platform/js"), s = new (t("../platform/id-generater"))("Comp"), a = (n.Flags.IsOnEnableCalled, 
        n.Flags.IsOnLoadCalled), o = cc.Class({
            name: "cc.Component",
            extends: n,
            ctor: function() {
                this._id = s.getNewId(), this.__eventTargets = [];
            },
            properties: {
                node: {
                    default: null,
                    visible: !1
                },
                name: {
                    get: function() {
                        if (this._name) return this._name;
                        var t = cc.js.getClassName(this), e = t.lastIndexOf(".");
                        return e >= 0 && (t = t.slice(e + 1)), this.node.name + "<" + t + ">";
                    },
                    set: function(t) {
                        this._name = t;
                    },
                    visible: !1
                },
                uuid: {
                    get: function() {
                        return this._id;
                    },
                    visible: !1
                },
                __scriptAsset: !1,
                _enabled: !0,
                enabled: {
                    get: function() {
                        return this._enabled;
                    },
                    set: function(t) {
                        if (this._enabled !== t && (this._enabled = t, this.node._activeInHierarchy)) {
                            var e = cc.director._compScheduler;
                            t ? e.enableComp(this) : e.disableComp(this);
                        }
                    },
                    visible: !1,
                    animatable: !0
                },
                enabledInHierarchy: {
                    get: function() {
                        return this._enabled && this.node._activeInHierarchy;
                    },
                    visible: !1
                },
                _isOnLoadCalled: {
                    get: function() {
                        return this._objFlags & a;
                    }
                }
            },
            update: null,
            lateUpdate: null,
            __preload: null,
            onLoad: null,
            start: null,
            onEnable: null,
            onDisable: null,
            onDestroy: null,
            onFocusInEditor: null,
            onLostFocusInEditor: null,
            resetInEditor: null,
            addComponent: function(t) {
                return this.node.addComponent(t);
            },
            getComponent: function(t) {
                return this.node.getComponent(t);
            },
            getComponents: function(t) {
                return this.node.getComponents(t);
            },
            getComponentInChildren: function(t) {
                return this.node.getComponentInChildren(t);
            },
            getComponentsInChildren: function(t) {
                return this.node.getComponentsInChildren(t);
            },
            _getLocalBounds: null,
            onRestore: null,
            destroy: function() {
                this._super() && this._enabled && this.node._activeInHierarchy && cc.director._compScheduler.disableComp(this);
            },
            _onPreDestroy: function() {
                this.unscheduleAllCallbacks();
                for (var t = this.__eventTargets, e = 0, i = t.length; e < i; ++e) {
                    var n = t[e];
                    n && n.targetOff(this);
                }
                t.length = 0, cc.director._nodeActivator.destroyComp(this), this.node._removeComponent(this);
            },
            _instantiate: function(t) {
                return t || (t = cc.instantiate._clone(this, this)), t.node = null, t;
            },
            schedule: function(t, e, i, n) {
                cc.assertID(t, 1619), cc.assertID(e >= 0, 1620), e = e || 0, i = isNaN(i) ? cc.macro.REPEAT_FOREVER : i, 
                n = n || 0;
                var r = cc.director.getScheduler(), s = r.isTargetPaused(this);
                r.schedule(t, this, e, i, n, s);
            },
            scheduleOnce: function(t, e) {
                this.schedule(t, 0, 0, e);
            },
            unschedule: function(t) {
                t && cc.director.getScheduler().unschedule(t, this);
            },
            unscheduleAllCallbacks: function() {
                cc.director.getScheduler().unscheduleAllForTarget(this);
            }
        });
        o._requireComponent = null, o._executionOrder = 0, r.value(o, "_registerEditorProps", function(t, e) {
            var i = e.requireComponent;
            i && (t._requireComponent = i);
            var n = e.executionOrder;
            n && "number" == typeof n && (t._executionOrder = n);
        }), o.prototype.__scriptUuid = "", cc.Component = e.exports = o;
    }, {
        "../platform/CCObject": 88,
        "../platform/id-generater": 98,
        "../platform/js": 102
    } ],
    31: [ function(t, e, i) {
        cc.Component.EventHandler = cc.Class({
            name: "cc.ClickEvent",
            properties: {
                target: {
                    default: null,
                    type: cc.Node
                },
                component: "",
                _componentId: "",
                _componentName: {
                    get: function() {
                        return this._genCompIdIfNeeded(), this._compId2Name(this._componentId);
                    },
                    set: function(t) {
                        this._componentId = this._compName2Id(t);
                    }
                },
                handler: {
                    default: ""
                },
                customEventData: {
                    default: ""
                }
            },
            statics: {
                emitEvents: function(t) {
                    "use strict";
                    var e = void 0;
                    if (arguments.length > 0) for (var i = 0, n = (e = new Array(arguments.length - 1)).length; i < n; i++) e[i] = arguments[i + 1];
                    for (var r = 0, s = t.length; r < s; r++) {
                        var a = t[r];
                        a instanceof cc.Component.EventHandler && a.emit(e);
                    }
                }
            },
            emit: function(t) {
                var e = this.target;
                if (cc.isValid(e)) {
                    this._genCompIdIfNeeded();
                    var i = cc.js._getClassById(this._componentId), n = e.getComponent(i);
                    if (cc.isValid(n)) {
                        var r = n[this.handler];
                        "function" == typeof r && (null != this.customEventData && "" !== this.customEventData && (t = t.slice()).push(this.customEventData), 
                        r.apply(n, t));
                    }
                }
            },
            _compName2Id: function(t) {
                var e = cc.js.getClassByName(t);
                return cc.js._getClassId(e);
            },
            _compId2Name: function(t) {
                var e = cc.js._getClassById(t);
                return cc.js.getClassName(e);
            },
            _genCompIdIfNeeded: function() {
                this._componentId || (this._componentName = this.component, this.component = "");
            }
        });
    }, {} ],
    32: [ function(t, e, i) {
        var n = t("../platform/CCMacro"), r = t("./CCRenderComponent"), s = t("../renderer/render-engine"), a = t("../renderer/render-flow"), o = s.SpriteMaterial, c = t("../renderer/utils/dynamic-atlas/manager"), h = t("../renderer/utils/label/label-frame"), l = n.TextAlignment, u = n.VerticalTextAlignment, _ = cc.Enum({
            NONE: 0,
            CLAMP: 1,
            SHRINK: 2,
            RESIZE_HEIGHT: 3
        }), d = cc.Enum({
            NONE: 0,
            BITMAP: 1,
            CHAR: 2
        }), f = cc.Class({
            name: "cc.Label",
            extends: r,
            ctor: function() {
                this._actualFontSize = 0, this._assemblerData = null, this._frame = null, this._ttfTexture = null, 
                this._letterTexture = null;
            },
            editor: !1,
            properties: {
                _useOriginalSize: !0,
                _string: {
                    default: "",
                    formerlySerializedAs: "_N$string"
                },
                string: {
                    get: function() {
                        return this._string;
                    },
                    set: function(t) {
                        var e = this._string;
                        this._string = t.toString(), this.string !== e && this._updateRenderData(), this._checkStringEmpty();
                    },
                    multiline: !0,
                    tooltip: !1
                },
                horizontalAlign: {
                    default: l.LEFT,
                    type: l,
                    tooltip: !1,
                    notify: function(t) {
                        this.horizontalAlign !== t && this._updateRenderData();
                    },
                    animatable: !1
                },
                verticalAlign: {
                    default: u.TOP,
                    type: u,
                    tooltip: !1,
                    notify: function(t) {
                        this.verticalAlign !== t && this._updateRenderData();
                    },
                    animatable: !1
                },
                actualFontSize: {
                    displayName: "Actual Font Size",
                    animatable: !1,
                    readonly: !0,
                    get: function() {
                        return this._actualFontSize;
                    }
                },
                _fontSize: 40,
                fontSize: {
                    get: function() {
                        return this._fontSize;
                    },
                    set: function(t) {
                        this._fontSize !== t && (this._fontSize = t, this._updateRenderData());
                    },
                    range: [ 0, 512 ],
                    tooltip: !1
                },
                fontFamily: {
                    default: "Arial",
                    tooltip: !1,
                    notify: function(t) {
                        this.fontFamily !== t && this._updateRenderData();
                    },
                    animatable: !1
                },
                _lineHeight: 40,
                lineHeight: {
                    get: function() {
                        return this._lineHeight;
                    },
                    set: function(t) {
                        this._lineHeight !== t && (this._lineHeight = t, this._updateRenderData());
                    },
                    tooltip: !1
                },
                overflow: {
                    default: _.NONE,
                    type: _,
                    tooltip: !1,
                    notify: function(t) {
                        this.overflow !== t && this._updateRenderData();
                    },
                    animatable: !1
                },
                _enableWrapText: !0,
                enableWrapText: {
                    get: function() {
                        return this._enableWrapText;
                    },
                    set: function(t) {
                        this._enableWrapText !== t && (this._enableWrapText = t, this._updateRenderData());
                    },
                    animatable: !1,
                    tooltip: !1
                },
                _N$file: null,
                font: {
                    get: function() {
                        return this._N$file;
                    },
                    set: function(t) {
                        this.font !== t && (t || (this._isSystemFontUsed = !0), this._N$file = t, t && this._isSystemFontUsed && (this._isSystemFontUsed = !1), 
                        "string" == typeof t && cc.warnID(4e3), this._renderData && (this.destroyRenderData(this._renderData), 
                        this._renderData = null), this._fontAtlas = null, this._updateAssembler(), this._applyFontTexture(!0), 
                        this._updateRenderData());
                    },
                    type: cc.Font,
                    tooltip: !1,
                    animatable: !1
                },
                _isSystemFontUsed: !0,
                useSystemFont: {
                    get: function() {
                        return this._isSystemFontUsed;
                    },
                    set: function(t) {
                        this._isSystemFontUsed !== t && (this.destroyRenderData(this._renderData), this._renderData = null, 
                        this._isSystemFontUsed = !!t, t ? (this.font = null, this._updateAssembler(), this._updateRenderData(), 
                        this._checkStringEmpty()) : this._userDefinedFont || this.disableRender());
                    },
                    animatable: !1,
                    tooltip: !1
                },
                _bmFontOriginalSize: {
                    displayName: "BMFont Original Size",
                    get: function() {
                        return this._N$file instanceof cc.BitmapFont ? this._N$file.fontSize : -1;
                    },
                    visible: !0,
                    animatable: !1
                },
                _spacingX: 0,
                spacingX: {
                    get: function() {
                        return this._spacingX;
                    },
                    set: function(t) {
                        this._spacingX = t, this._updateRenderData();
                    }
                },
                _batchAsBitmap: !1,
                cacheMode: {
                    default: d.NONE,
                    type: d,
                    tooltip: !1,
                    notify: function(t) {
                        this.cacheMode !== t && (t !== d.BITMAP || this.font instanceof cc.BitmapFont || this._frame._resetDynamicAtlasFrame(), 
                        t === d.CHAR && (this._ttfTexture = null), this._updateRenderData(!0));
                    },
                    animatable: !1
                },
                _isBold: {
                    default: !1,
                    serializable: !1
                },
                _isItalic: {
                    default: !1,
                    serializable: !1
                },
                _isUnderline: {
                    default: !1,
                    serializable: !1
                }
            },
            statics: {
                HorizontalAlign: l,
                VerticalAlign: u,
                Overflow: _,
                CacheMode: d
            },
            onLoad: function() {
                this._batchAsBitmap && this.cacheMode === d.NONE && (this.cacheMode = d.BITMAP, 
                this._batchAsBitmap = !1);
            },
            onEnable: function() {
                this._super(), this.font || this._isSystemFontUsed || (this.useSystemFont = !0), 
                this.useSystemFont && !this.fontFamily && (this.fontFamily = "Arial"), this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateRenderData, this), 
                this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._updateRenderData, this), this._checkStringEmpty(), 
                this._updateRenderData(!0);
            },
            onDisable: function() {
                this._super(), this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateRenderData, this), 
                this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._updateRenderData, this);
            },
            onDestroy: function() {
                this._assembler && this._assembler._resetAssemblerData && this._assembler._resetAssemblerData(this._assemblerData), 
                this._assemblerData = null, this._letterTexture = null, this._ttfTexture && (this._ttfTexture.destroy(), 
                this._ttfTexture = null), this._super();
            },
            _canRender: function() {
                var t = this._super(), e = this.font;
                if (e instanceof cc.BitmapFont) {
                    var i = e.spriteFrame;
                    i && i.textureLoaded() || (t = !1);
                }
                return t;
            },
            _checkStringEmpty: function() {
                this.markForRender(!!this.string);
            },
            _updateAssembler: function() {
                var t = f._assembler.getAssembler(this);
                this._assembler !== t && (this._assembler = t, this._renderData = null, this._frame = null), 
                this._renderData || (this._renderData = this._assembler.createData(this));
            },
            _applyFontTexture: function(t) {
                var e = this, i = this.font;
                i instanceof cc.BitmapFont ? function() {
                    var n = i.spriteFrame;
                    e._frame = n;
                    var r = e, s = function() {
                        r._frame._texture = n._texture, r._activateMaterial(t), t && r._assembler && r._assembler.updateRenderData(r);
                    };
                    n && n.textureLoaded() ? s() : (e.disableRender(), n && (n.once("load", s, e), n.ensureLoadTexture()));
                }() : (this._frame || (this._frame = new h()), this.cacheMode === d.CHAR && cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB ? (this._letterTexture = this._assembler._getAssemblerData(), 
                this._frame._refreshTexture(this._letterTexture)) : this._ttfTexture || (this._ttfTexture = new cc.Texture2D(), 
                this._assemblerData = this._assembler._getAssemblerData(), this._ttfTexture.initWithElement(this._assemblerData.canvas)), 
                this.cacheMode !== d.CHAR && this._frame._refreshTexture(this._ttfTexture), this._activateMaterial(t), 
                t && this._assembler && this._assembler.updateRenderData(this));
            },
            _updateColor: function() {
                this.font instanceof cc.BitmapFont ? this._super() : (this._updateRenderData(), 
                this.node._renderFlag &= ~a.FLAG_COLOR);
            },
            _activateMaterial: function(t) {
                var e = this._material;
                e && !t || (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? this._frame._texture.url = this.uuid + "_texture" : (e || (e = new o()), 
                e.texture = this._frame._texture, e.useColor = !1, this._updateMaterial(e)), this.markForUpdateRenderData(!0), 
                this.markForRender(!0));
            },
            _updateRenderData: function(t) {
                var e = this._renderData;
                e && (e.vertDirty = !0, e.uvDirty = !0, this.markForUpdateRenderData(!0)), t && (this._updateAssembler(), 
                this._applyFontTexture(t));
            },
            _calDynamicAtlas: function() {
                if (c) {
                    if (!this._frame._original) {
                        var t = c.insertSpriteFrame(this._frame);
                        t && this._frame._setDynamicAtlasFrame(t);
                    }
                    this._material._texture !== this._frame._texture && this._activateMaterial(!0);
                }
            },
            _enableBold: function(t) {
                this._isBold = !!t;
            },
            _enableItalics: function(t) {
                this._isItalic = !!t;
            },
            _enableUnderline: function(t) {
                this._isUnderline = !!t;
            }
        });
        cc.Label = e.exports = f;
    }, {
        "../platform/CCMacro": 87,
        "../renderer/render-engine": 124,
        "../renderer/render-flow": 125,
        "../renderer/utils/dynamic-atlas/manager": void 0,
        "../renderer/utils/label/label-frame": 127,
        "./CCRenderComponent": 35
    } ],
    33: [ function(t, e, i) {
        var n = t("../CCNode").EventType, r = cc.Enum({
            NONE: 0,
            HORIZONTAL: 1,
            VERTICAL: 2,
            GRID: 3
        }), s = cc.Enum({
            NONE: 0,
            CONTAINER: 1,
            CHILDREN: 2
        }), a = cc.Enum({
            HORIZONTAL: 0,
            VERTICAL: 1
        }), o = cc.Enum({
            BOTTOM_TO_TOP: 0,
            TOP_TO_BOTTOM: 1
        }), c = cc.Enum({
            LEFT_TO_RIGHT: 0,
            RIGHT_TO_LEFT: 1
        }), h = cc.Class({
            name: "cc.Layout",
            extends: t("./CCComponent"),
            editor: !1,
            properties: {
                _layoutSize: cc.size(300, 200),
                _layoutDirty: {
                    default: !0,
                    serializable: !1
                },
                _resize: s.NONE,
                _N$layoutType: r.NONE,
                type: {
                    type: r,
                    get: function() {
                        return this._N$layoutType;
                    },
                    set: function(t) {
                        this._N$layoutType = t, this._doLayoutDirty();
                    },
                    tooltip: !1,
                    animatable: !1
                },
                resizeMode: {
                    type: s,
                    tooltip: !1,
                    animatable: !1,
                    get: function() {
                        return this._resize;
                    },
                    set: function(t) {
                        this.type === r.NONE && t === s.CHILDREN || (this._resize = t, this._doLayoutDirty());
                    }
                },
                cellSize: {
                    default: cc.size(40, 40),
                    tooltip: !1,
                    type: cc.Size,
                    notify: function() {
                        this._doLayoutDirty();
                    }
                },
                startAxis: {
                    default: a.HORIZONTAL,
                    tooltip: !1,
                    type: a,
                    notify: function() {
                        this._doLayoutDirty();
                    },
                    animatable: !1
                },
                _N$padding: {
                    default: 0
                },
                paddingLeft: {
                    default: 0,
                    tooltip: !1,
                    notify: function() {
                        this._doLayoutDirty();
                    }
                },
                paddingRight: {
                    default: 0,
                    tooltip: !1,
                    notify: function() {
                        this._doLayoutDirty();
                    }
                },
                paddingTop: {
                    default: 0,
                    tooltip: !1,
                    notify: function() {
                        this._doLayoutDirty();
                    }
                },
                paddingBottom: {
                    default: 0,
                    tooltip: !1,
                    notify: function() {
                        this._doLayoutDirty();
                    }
                },
                spacingX: {
                    default: 0,
                    notify: function() {
                        this._doLayoutDirty();
                    },
                    tooltip: !1
                },
                spacingY: {
                    default: 0,
                    notify: function() {
                        this._doLayoutDirty();
                    },
                    tooltip: !1
                },
                verticalDirection: {
                    default: o.TOP_TO_BOTTOM,
                    type: o,
                    notify: function() {
                        this._doLayoutDirty();
                    },
                    tooltip: !1,
                    animatable: !1
                },
                horizontalDirection: {
                    default: c.LEFT_TO_RIGHT,
                    type: c,
                    notify: function() {
                        this._doLayoutDirty();
                    },
                    tooltip: !1,
                    animatable: !1
                },
                affectedByScale: {
                    default: !1,
                    notify: function() {
                        this._doLayoutDirty();
                    },
                    animatable: !1,
                    tooltip: !1
                }
            },
            statics: {
                Type: r,
                VerticalDirection: o,
                HorizontalDirection: c,
                ResizeMode: s,
                AxisDirection: a
            },
            _migratePaddingData: function() {
                this.paddingLeft = this._N$padding, this.paddingRight = this._N$padding, this.paddingTop = this._N$padding, 
                this.paddingBottom = this._N$padding, this._N$padding = 0;
            },
            onEnable: function() {
                this._addEventListeners(), this.node.getContentSize().equals(cc.size(0, 0)) && this.node.setContentSize(this._layoutSize), 
                0 !== this._N$padding && this._migratePaddingData(), this._doLayoutDirty();
            },
            onDisable: function() {
                this._removeEventListeners();
            },
            _doLayoutDirty: function() {
                this._layoutDirty = !0;
            },
            _doScaleDirty: function() {
                this._layoutDirty = this._layoutDirty || this.affectedByScale;
            },
            _addEventListeners: function() {
                cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this), this.node.on(n.SIZE_CHANGED, this._resized, this), 
                this.node.on(n.ANCHOR_CHANGED, this._doLayoutDirty, this), this.node.on(n.CHILD_ADDED, this._childAdded, this), 
                this.node.on(n.CHILD_REMOVED, this._childRemoved, this), this.node.on(n.CHILD_REORDER, this._doLayoutDirty, this), 
                this._addChildrenEventListeners();
            },
            _removeEventListeners: function() {
                cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this), this.node.off(n.SIZE_CHANGED, this._resized, this), 
                this.node.off(n.ANCHOR_CHANGED, this._doLayoutDirty, this), this.node.off(n.CHILD_ADDED, this._childAdded, this), 
                this.node.off(n.CHILD_REMOVED, this._childRemoved, this), this.node.off(n.CHILD_REORDER, this._doLayoutDirty, this), 
                this._removeChildrenEventListeners();
            },
            _addChildrenEventListeners: function() {
                for (var t = this.node.children, e = 0; e < t.length; ++e) {
                    var i = t[e];
                    i.on(n.SCALE_CHANGED, this._doScaleDirty, this), i.on(n.SIZE_CHANGED, this._doLayoutDirty, this), 
                    i.on(n.POSITION_CHANGED, this._doLayoutDirty, this), i.on(n.ANCHOR_CHANGED, this._doLayoutDirty, this), 
                    i.on("active-in-hierarchy-changed", this._doLayoutDirty, this);
                }
            },
            _removeChildrenEventListeners: function() {
                for (var t = this.node.children, e = 0; e < t.length; ++e) {
                    var i = t[e];
                    i.off(n.SCALE_CHANGED, this._doScaleDirty, this), i.off(n.SIZE_CHANGED, this._doLayoutDirty, this), 
                    i.off(n.POSITION_CHANGED, this._doLayoutDirty, this), i.off(n.ANCHOR_CHANGED, this._doLayoutDirty, this), 
                    i.off("active-in-hierarchy-changed", this._doLayoutDirty, this);
                }
            },
            _childAdded: function(t) {
                t.on(n.SCALE_CHANGED, this._doScaleDirty, this), t.on(n.SIZE_CHANGED, this._doLayoutDirty, this), 
                t.on(n.POSITION_CHANGED, this._doLayoutDirty, this), t.on(n.ANCHOR_CHANGED, this._doLayoutDirty, this), 
                t.on("active-in-hierarchy-changed", this._doLayoutDirty, this), this._doLayoutDirty();
            },
            _childRemoved: function(t) {
                t.off(n.SCALE_CHANGED, this._doScaleDirty, this), t.off(n.SIZE_CHANGED, this._doLayoutDirty, this), 
                t.off(n.POSITION_CHANGED, this._doLayoutDirty, this), t.off(n.ANCHOR_CHANGED, this._doLayoutDirty, this), 
                t.off("active-in-hierarchy-changed", this._doLayoutDirty, this), this._doLayoutDirty();
            },
            _resized: function() {
                this._layoutSize = this.node.getContentSize(), this._doLayoutDirty();
            },
            _doLayoutHorizontally: function(t, e, i, n) {
                var a = this.node.getAnchorPoint(), h = this.node.children, l = 1, u = this.paddingLeft, _ = -a.x * t;
                this.horizontalDirection === c.RIGHT_TO_LEFT && (l = -1, _ = (1 - a.x) * t, u = this.paddingRight);
                for (var d = _ + l * u - l * this.spacingX, f = 0, p = 0, m = 0, v = 0, g = 0, y = 0, x = 0, E = 0; E < h.length; ++E) {
                    (C = h[E]).activeInHierarchy && x++;
                }
                var T = this.cellSize.width;
                this.type !== r.GRID && this.resizeMode === s.CHILDREN && (T = (t - (this.paddingLeft + this.paddingRight) - (x - 1) * this.spacingX) / x);
                for (E = 0; E < h.length; ++E) {
                    var C = h[E], A = this._getUsedScaleValue(C.scaleX), b = this._getUsedScaleValue(C.scaleY);
                    if (C.activeInHierarchy) {
                        this._resize === s.CHILDREN && (C.width = T / A, this.type === r.GRID && (C.height = this.cellSize.height / b));
                        var w = C.anchorX, D = C.width * A, S = C.height * b;
                        m > p && (p = m), S >= p && (m = p, p = S, y = C.getAnchorPoint().y), this.horizontalDirection === c.RIGHT_TO_LEFT && (w = 1 - C.anchorX), 
                        d = d + l * w * D + l * this.spacingX;
                        var R = l * (1 - w) * D;
                        if (e) {
                            var M = d + R + l * (l > 0 ? this.paddingRight : this.paddingLeft), O = this.horizontalDirection === c.LEFT_TO_RIGHT && M > (1 - a.x) * t, L = this.horizontalDirection === c.RIGHT_TO_LEFT && M < -a.x * t;
                            (O || L) && (S >= p ? (0 === m && (m = p), f += m, m = p) : (f += p, m = S, p = 0), 
                            d = _ + l * (u + w * D), v++);
                        }
                        var I = i(C, f, v);
                        t >= D + this.paddingLeft + this.paddingRight && n && C.setPosition(cc.v2(d, I));
                        var F, P = 1, N = 0 === p ? S : p;
                        this.verticalDirection === o.TOP_TO_BOTTOM ? (g = g || this.node._contentSize.height, 
                        (F = I + (P = -1) * (N * y + this.paddingBottom)) < g && (g = F)) : (g = g || -this.node._contentSize.height, 
                        (F = I + P * (N * y + this.paddingTop)) > g && (g = F)), d += R;
                    }
                }
                return g;
            },
            _getVerticalBaseHeight: function(t) {
                var e = 0, i = 0;
                if (this.resizeMode === s.CONTAINER) {
                    for (var n = 0; n < t.length; ++n) {
                        var r = t[n];
                        r.activeInHierarchy && (i++, e += r.height * this._getUsedScaleValue(r.scaleY));
                    }
                    e += (i - 1) * this.spacingY + this.paddingBottom + this.paddingTop;
                } else e = this.node.getContentSize().height;
                return e;
            },
            _doLayoutVertically: function(t, e, i, n) {
                var a = this.node.getAnchorPoint(), h = this.node.children, l = 1, u = this.paddingBottom, _ = -a.y * t;
                this.verticalDirection === o.TOP_TO_BOTTOM && (l = -1, _ = (1 - a.y) * t, u = this.paddingTop);
                for (var d = _ + l * u - l * this.spacingY, f = 0, p = 0, m = 0, v = 0, g = 0, y = 0, x = 0, E = 0; E < h.length; ++E) {
                    (C = h[E]).activeInHierarchy && x++;
                }
                var T = this.cellSize.height;
                this.type !== r.GRID && this.resizeMode === s.CHILDREN && (T = (t - (this.paddingTop + this.paddingBottom) - (x - 1) * this.spacingY) / x);
                for (E = 0; E < h.length; ++E) {
                    var C = h[E], A = this._getUsedScaleValue(C.scaleX), b = this._getUsedScaleValue(C.scaleY);
                    if (C.activeInHierarchy) {
                        this.resizeMode === s.CHILDREN && (C.height = T / b, this.type === r.GRID && (C.width = this.cellSize.width / A));
                        var w = C.anchorY, D = C.width * A, S = C.height * b;
                        m > p && (p = m), D >= p && (m = p, p = D, y = C.getAnchorPoint().x), this.verticalDirection === o.TOP_TO_BOTTOM && (w = 1 - C.anchorY), 
                        d = d + l * w * S + l * this.spacingY;
                        var R = l * (1 - w) * S;
                        if (e) {
                            var M = d + R + l * (l > 0 ? this.paddingTop : this.paddingBottom), O = this.verticalDirection === o.BOTTOM_TO_TOP && M > (1 - a.y) * t, L = this.verticalDirection === o.TOP_TO_BOTTOM && M < -a.y * t;
                            (O || L) && (D >= p ? (0 === m && (m = p), f += m, m = p) : (f += p, m = D, p = 0), 
                            d = _ + l * (u + w * S), v++);
                        }
                        var I = i(C, f, v);
                        t >= S + (this.paddingTop + this.paddingBottom) && n && C.setPosition(cc.v2(I, d));
                        var F, P = 1, N = 0 === p ? D : p;
                        this.horizontalDirection === c.RIGHT_TO_LEFT ? (P = -1, g = g || this.node._contentSize.width, 
                        (F = I + P * (N * y + this.paddingLeft)) < g && (g = F)) : (g = g || -this.node._contentSize.width, 
                        (F = I + P * (N * y + this.paddingRight)) > g && (g = F)), d += R;
                    }
                }
                return g;
            },
            _doLayoutBasic: function() {
                for (var t = this.node.children, e = null, i = 0; i < t.length; ++i) {
                    var n = t[i];
                    n.activeInHierarchy && (e ? e.union(e, n.getBoundingBoxToWorld()) : e = n.getBoundingBoxToWorld());
                }
                if (e) {
                    var r = this.node.parent.convertToNodeSpaceAR(cc.v2(e.x, e.y));
                    r = cc.v2(r.x - this.paddingLeft, r.y - this.paddingBottom);
                    var s = this.node.parent.convertToNodeSpaceAR(cc.v2(e.x + e.width, e.y + e.height));
                    s = cc.v2(s.x + this.paddingRight, s.y + this.paddingTop);
                    var a = cc.size(parseFloat((s.x - r.x).toFixed(2)), parseFloat((s.y - r.y).toFixed(2))), o = this.node.getPosition();
                    if (0 !== a.width) {
                        var c = (o.x - r.x) / a.width;
                        this.node.anchorX = parseFloat(c.toFixed(2));
                    }
                    if (0 !== a.height) {
                        var h = (o.y - r.y) / a.height;
                        this.node.anchorY = parseFloat(h.toFixed(2));
                    }
                    this.node.setContentSize(a);
                }
            },
            _doLayoutGridAxisHorizontal: function(t, e) {
                var i = e.width, n = 1, r = -t.y * e.height, a = this.paddingBottom;
                this.verticalDirection === o.TOP_TO_BOTTOM && (n = -1, r = (1 - t.y) * e.height, 
                a = this.paddingTop);
                var c = function(t, e, i) {
                    return r + n * (e + t.anchorY * t.height * this._getUsedScaleValue(t.scaleY) + a + i * this.spacingY);
                }.bind(this), h = 0;
                if (this.resizeMode === s.CONTAINER) {
                    var l = this._doLayoutHorizontally(i, !0, c, !1);
                    (h = r - l) < 0 && (h *= -1), r = -t.y * h, this.verticalDirection === o.TOP_TO_BOTTOM && (n = -1, 
                    r = (1 - t.y) * h);
                }
                this._doLayoutHorizontally(i, !0, c, !0), this.resizeMode === s.CONTAINER && this.node.setContentSize(i, h);
            },
            _doLayoutGridAxisVertical: function(t, e) {
                var i = e.height, n = 1, r = -t.x * e.width, a = this.paddingLeft;
                this.horizontalDirection === c.RIGHT_TO_LEFT && (n = -1, r = (1 - t.x) * e.width, 
                a = this.paddingRight);
                var o = function(t, e, i) {
                    return r + n * (e + t.anchorX * t.width * this._getUsedScaleValue(t.scaleX) + a + i * this.spacingX);
                }.bind(this), h = 0;
                if (this.resizeMode === s.CONTAINER) {
                    var l = this._doLayoutVertically(i, !0, o, !1);
                    (h = r - l) < 0 && (h *= -1), r = -t.x * h, this.horizontalDirection === c.RIGHT_TO_LEFT && (n = -1, 
                    r = (1 - t.x) * h);
                }
                this._doLayoutVertically(i, !0, o, !0), this.resizeMode === s.CONTAINER && this.node.setContentSize(h, i);
            },
            _doLayoutGrid: function() {
                var t = this.node.getAnchorPoint(), e = this.node.getContentSize();
                this.startAxis === a.HORIZONTAL ? this._doLayoutGridAxisHorizontal(t, e) : this.startAxis === a.VERTICAL && this._doLayoutGridAxisVertical(t, e);
            },
            _getHorizontalBaseWidth: function(t) {
                var e = 0, i = 0;
                if (this.resizeMode === s.CONTAINER) {
                    for (var n = 0; n < t.length; ++n) {
                        var r = t[n];
                        r.activeInHierarchy && (i++, e += r.width * this._getUsedScaleValue(r.scaleX));
                    }
                    e += (i - 1) * this.spacingX + this.paddingLeft + this.paddingRight;
                } else e = this.node.getContentSize().width;
                return e;
            },
            _doLayout: function() {
                if (this.type === r.HORIZONTAL) {
                    var t = this._getHorizontalBaseWidth(this.node.children);
                    this._doLayoutHorizontally(t, !1, function(t) {
                        return t.y;
                    }, !0), this.node.width = t;
                } else if (this.type === r.VERTICAL) {
                    var e = this._getVerticalBaseHeight(this.node.children);
                    this._doLayoutVertically(e, !1, function(t) {
                        return t.x;
                    }, !0), this.node.height = e;
                } else this.type === r.NONE ? this.resizeMode === s.CONTAINER && this._doLayoutBasic() : this.type === r.GRID && this._doLayoutGrid();
            },
            _getUsedScaleValue: function(t) {
                return this.affectedByScale ? Math.abs(t) : 1;
            },
            updateLayout: function() {
                this._layoutDirty && this.node.children.length > 0 && (this._doLayout(), this._layoutDirty = !1);
            }
        });
        Object.defineProperty(h.prototype, "padding", {
            get: function() {
                return cc.warnID(4100), this.paddingLeft;
            },
            set: function(t) {
                this._N$padding = t, this._migratePaddingData(), this._doLayoutDirty();
            }
        }), cc.Layout = e.exports = h;
    }, {
        "../CCNode": 4,
        "./CCComponent": 30
    } ],
    34: [ function(t, e, i) {
        var n = t("../utils/misc"), r = t("../renderer/render-engine"), s = r.math, a = r.StencilMaterial, o = t("./CCRenderComponent"), c = t("../renderer/render-flow"), h = t("../graphics/graphics"), l = t("../CCNode"), u = t("../renderer/utils/dynamic-atlas/manager"), _ = cc.v2(), d = s.mat4.create(), f = [];
        var p = cc.Enum({
            RECT: 0,
            ELLIPSE: 1,
            IMAGE_STENCIL: 2
        }), m = cc.Class({
            name: "cc.Mask",
            extends: o,
            editor: !1,
            ctor: function() {
                this._graphics = null, this._clearGraphics = null;
            },
            properties: {
                _spriteFrame: {
                    default: null,
                    type: cc.SpriteFrame
                },
                _type: p.RECT,
                type: {
                    get: function() {
                        return this._type;
                    },
                    set: function(t) {
                        this._type = t, this._type !== p.IMAGE_STENCIL && (this.spriteFrame = null, this.alphaThreshold = 0, 
                        this._updateGraphics()), this._renderData && (this.destroyRenderData(this._renderData), 
                        this._renderData = null), this._activateMaterial();
                    },
                    type: p,
                    tooltip: !1
                },
                spriteFrame: {
                    type: cc.SpriteFrame,
                    tooltip: !1,
                    get: function() {
                        return this._spriteFrame;
                    },
                    set: function(t) {
                        var e = this._spriteFrame;
                        e !== t && (this._spriteFrame = t, this._applySpriteFrame(e));
                    }
                },
                alphaThreshold: {
                    default: 0,
                    type: cc.Float,
                    range: [ 0, 1, .1 ],
                    slide: !0,
                    tooltip: !1,
                    notify: function() {
                        cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS ? this._material && (this._material.alphaThreshold = this.alphaThreshold, 
                        this._material.updateHash()) : cc.warnID(4201);
                    }
                },
                inverted: {
                    default: !1,
                    type: cc.Boolean,
                    tooltip: !1,
                    notify: function() {
                        cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS || cc.warnID(4202);
                    }
                },
                _segments: 64,
                segements: {
                    get: function() {
                        return this._segments;
                    },
                    set: function(t) {
                        this._segments = n.clampf(t, 3, 1e4), this._updateGraphics();
                    },
                    type: cc.Integer,
                    tooltip: !1
                },
                _resizeToTarget: {
                    animatable: !1,
                    set: function(t) {
                        t && this._resizeNodeToTargetNode();
                    }
                }
            },
            statics: {
                Type: p
            },
            onLoad: function() {
                this._createGraphics();
            },
            onRestore: function() {
                this._createGraphics(), this._type !== p.IMAGE_STENCIL ? this._updateGraphics() : this._applySpriteFrame();
            },
            onEnable: function() {
                this._super(), this._type === p.IMAGE_STENCIL ? this._spriteFrame && this._spriteFrame.textureLoaded() || (this.markForRender(!1), 
                this._spriteFrame && (this.markForUpdateRenderData(!1), this._spriteFrame.once("load", this._onTextureLoaded, this), 
                this._spriteFrame.ensureLoadTexture())) : this._updateGraphics(), this.node.on(cc.Node.EventType.POSITION_CHANGED, this._updateGraphics, this), 
                this.node.on(cc.Node.EventType.ROTATION_CHANGED, this._updateGraphics, this), this.node.on(cc.Node.EventType.SCALE_CHANGED, this._updateGraphics, this), 
                this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateGraphics, this), this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this), 
                this.node._renderFlag |= c.FLAG_POST_RENDER, this._activateMaterial();
            },
            onDisable: function() {
                this._super(), this.node.off(cc.Node.EventType.POSITION_CHANGED, this._updateGraphics, this), 
                this.node.off(cc.Node.EventType.ROTATION_CHANGED, this._updateGraphics, this), this.node.off(cc.Node.EventType.SCALE_CHANGED, this._updateGraphics, this), 
                this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateGraphics, this), this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this), 
                this.node._renderFlag &= ~c.FLAG_POST_RENDER;
            },
            onDestroy: function() {
                this._super(), this._removeGraphics();
            },
            _resizeNodeToTargetNode: !1,
            _onTextureLoaded: function() {
                this._renderData && (this._renderData.uvDirty = !0, this._renderData.vertDirty = !0, 
                this.markForUpdateRenderData(!0)), this.enabledInHierarchy && this._activateMaterial();
            },
            _applySpriteFrame: function(t) {
                t && t.off && t.off("load", this._onTextureLoaded, this);
                var e = this._spriteFrame;
                e ? e.textureLoaded() ? this._onTextureLoaded(null) : (e.once("load", this._onTextureLoaded, this), 
                e.ensureLoadTexture()) : this.disableRender();
            },
            _activateMaterial: function() {
                if (this._type !== p.IMAGE_STENCIL || this.spriteFrame && this.spriteFrame.textureLoaded()) {
                    if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) if (this._material || (this._material = new a()), 
                    this._type === p.IMAGE_STENCIL) {
                        var t = this.spriteFrame.getTexture();
                        this._material.useModel = !1, this._material.useTexture = !0, this._material.useColor = !0, 
                        this._material.texture = t, this._material.alphaThreshold = this.alphaThreshold;
                    } else this._material.useModel = !0, this._material.useTexture = !1, this._material.useColor = !1;
                    this.markForRender(!0);
                } else this.markForRender(!1);
            },
            _createGraphics: function() {
                this._graphics || (this._graphics = new h(), this._graphics.node = this.node, this._graphics.lineWidth = 0, 
                this._graphics.strokeColor = cc.color(0, 0, 0, 0)), this._clearGraphics || (this._clearGraphics = new h(), 
                this._clearGraphics.node = new l(), this._clearGraphics._activateMaterial(), this._clearGraphics.lineWidth = 0, 
                this._clearGraphics.rect(0, 0, cc.visibleRect.width, cc.visibleRect.height), this._clearGraphics.fill());
            },
            _updateGraphics: function() {
                var t = this.node, e = this._graphics;
                e.clear(!1);
                var i = t._contentSize.width, n = t._contentSize.height, r = -i * t._anchorPoint.x, s = -n * t._anchorPoint.y;
                if (this._type === p.RECT) e.rect(r, s, i, n); else if (this._type === p.ELLIPSE) {
                    for (var a = function(t, e, i) {
                        f.length = 0;
                        for (var n = 2 * Math.PI / i, r = 0; r < i; ++r) f.push(cc.v2(e.x * Math.cos(n * r) + t.x, e.y * Math.sin(n * r) + t.y));
                        return f;
                    }(cc.v2(r + i / 2, s + n / 2), {
                        x: i / 2,
                        y: n / 2
                    }, this._segments), o = 0; o < a.length; ++o) {
                        var c = a[o];
                        0 === o ? e.moveTo(c.x, c.y) : e.lineTo(c.x, c.y);
                    }
                    e.close();
                }
                cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? e.stroke() : e.fill();
            },
            _removeGraphics: function() {
                this._graphics && this._graphics.destroy(), this._clearGraphics && this._clearGraphics.destroy();
            },
            _hitTest: function(t) {
                var e = this.node, i = e.getContentSize(), n = i.width, r = i.height, a = _;
                e._updateWorldMatrix(), s.mat4.invert(d, e._worldMatrix), s.vec2.transformMat4(a, t, d), 
                a.x += e._anchorPoint.x * n, a.y += e._anchorPoint.y * r;
                var o = !1;
                if (this.type === p.RECT || this.type === p.IMAGE_STENCIL) o = a.x >= 0 && a.y >= 0 && a.x <= n && a.y <= r; else if (this.type === p.ELLIPSE) {
                    var c = n / 2, h = r / 2, l = a.x - .5 * n, u = a.y - .5 * r;
                    o = l * l / (c * c) + u * u / (h * h) < 1;
                }
                return this.inverted && (o = !o), o;
            },
            markForUpdateRenderData: function(t) {
                t && this.enabledInHierarchy ? this.node._renderFlag |= c.FLAG_UPDATE_RENDER_DATA : t || (this.node._renderFlag &= ~c.FLAG_UPDATE_RENDER_DATA);
            },
            markForRender: function(t) {
                t && this.enabledInHierarchy ? this.node._renderFlag |= c.FLAG_RENDER | c.FLAG_UPDATE_RENDER_DATA | c.FLAG_POST_RENDER : t || (this.node._renderFlag &= ~(c.FLAG_RENDER | c.FLAG_POST_RENDER));
            },
            disableRender: function() {
                this.node._renderFlag &= ~(c.FLAG_RENDER | c.FLAG_UPDATE_RENDER_DATA | c.FLAG_POST_RENDER);
            },
            _calDynamicAtlas: function() {
                if (this._spriteFrame) {
                    if (!this._spriteFrame._original && u) {
                        var t = u.insertSpriteFrame(this._spriteFrame);
                        t && this._spriteFrame._setDynamicAtlasFrame(t);
                    }
                    this._material._texture !== this._spriteFrame._texture && this._activateMaterial();
                }
            }
        });
        cc.Mask = e.exports = m;
    }, {
        "../CCNode": 4,
        "../graphics/graphics": 54,
        "../renderer/render-engine": 124,
        "../renderer/render-flow": 125,
        "../renderer/utils/dynamic-atlas/manager": void 0,
        "../utils/misc": 159,
        "./CCRenderComponent": 35
    } ],
    35: [ function(t, e, i) {
        var n = t("./CCComponent"), r = t("../renderer/render-engine"), s = t("../renderer/render-flow"), a = r.RenderData, o = cc.Class({
            name: "RenderComponent",
            extends: n,
            editor: !1,
            properties: {},
            ctor: function() {
                this._material = null, this._renderData = null, this.__allocedDatas = [], this._vertexFormat = null, 
                this._toPostHandle = !1, this._assembler = this.constructor._assembler, this._postAssembler = this.constructor._postAssembler;
            },
            onEnable: function() {
                this.node._renderComponent && (this.node._renderComponent.enabled = !1), this.node._renderComponent = this, 
                this.node._renderFlag |= s.FLAG_RENDER | s.FLAG_UPDATE_RENDER_DATA | s.FLAG_COLOR;
            },
            onDisable: function() {
                this.node._renderComponent = null, this.disableRender();
            },
            onDestroy: function() {
                for (var t = 0, e = this.__allocedDatas.length; t < e; t++) a.free(this.__allocedDatas[t]);
                this.__allocedDatas.length = 0, this._material = null, this._renderData = null;
            },
            _canRender: function() {
                return this._enabled && this.node._activeInHierarchy;
            },
            markForUpdateRenderData: function(t) {
                t && this._canRender() ? this.node._renderFlag |= s.FLAG_UPDATE_RENDER_DATA : t || (this.node._renderFlag &= ~s.FLAG_UPDATE_RENDER_DATA);
            },
            markForRender: function(t) {
                t && this._canRender() ? this.node._renderFlag |= s.FLAG_RENDER : t || (this.node._renderFlag &= ~s.FLAG_RENDER);
            },
            markForCustomIARender: function(t) {
                t && this._canRender() ? this.node._renderFlag |= s.FLAG_CUSTOM_IA_RENDER : t || (this.node._renderFlag &= ~s.FLAG_CUSTOM_IA_RENDER);
            },
            disableRender: function() {
                this.node._renderFlag &= ~(s.FLAG_RENDER | s.FLAG_CUSTOM_IA_RENDER | s.FLAG_UPDATE_RENDER_DATA | s.FLAG_COLOR);
            },
            requestRenderData: function() {
                var t = a.alloc();
                return this.__allocedDatas.push(t), t;
            },
            destroyRenderData: function(t) {
                var e = this.__allocedDatas.indexOf(t);
                -1 !== e && (this.__allocedDatas.splice(e, 1), a.free(t));
            },
            _updateColor: function() {
                var t = this._material;
                t && (t.useColor && (t.color = this.node.color, t.updateHash()), this.node._renderFlag &= ~s.FLAG_COLOR);
            },
            getMaterial: function() {
                return this._material;
            },
            _updateMaterial: function(t) {
                this._material = t, t.updateHash();
            }
        });
        o._assembler = null, o._postAssembler = null, cc.RenderComponent = e.exports = o;
    }, {
        "../renderer/render-engine": 124,
        "../renderer/render-flow": 125,
        "./CCComponent": 30
    } ],
    36: [ function(t, e, i) {
        var n = t("../CCNode").EventType, r = function() {
            return new Date().getMilliseconds();
        }, s = cc.Enum({
            SCROLL_TO_TOP: 0,
            SCROLL_TO_BOTTOM: 1,
            SCROLL_TO_LEFT: 2,
            SCROLL_TO_RIGHT: 3,
            SCROLLING: 4,
            BOUNCE_TOP: 5,
            BOUNCE_BOTTOM: 6,
            BOUNCE_LEFT: 7,
            BOUNCE_RIGHT: 8,
            SCROLL_ENDED: 9,
            TOUCH_UP: 10,
            AUTOSCROLL_ENDED_WITH_THRESHOLD: 11,
            SCROLL_BEGAN: 12
        }), a = {
            "scroll-to-top": s.SCROLL_TO_TOP,
            "scroll-to-bottom": s.SCROLL_TO_BOTTOM,
            "scroll-to-left": s.SCROLL_TO_LEFT,
            "scroll-to-right": s.SCROLL_TO_RIGHT,
            scrolling: s.SCROLLING,
            "bounce-bottom": s.BOUNCE_BOTTOM,
            "bounce-left": s.BOUNCE_LEFT,
            "bounce-right": s.BOUNCE_RIGHT,
            "bounce-top": s.BOUNCE_TOP,
            "scroll-ended": s.SCROLL_ENDED,
            "touch-up": s.TOUCH_UP,
            "scroll-ended-with-threshold": s.AUTOSCROLL_ENDED_WITH_THRESHOLD,
            "scroll-began": s.SCROLL_BEGAN
        }, o = cc.Class({
            name: "cc.ScrollView",
            extends: t("./CCViewGroup"),
            editor: !1,
            ctor: function() {
                this._topBoundary = 0, this._bottomBoundary = 0, this._leftBoundary = 0, this._rightBoundary = 0, 
                this._touchMoveDisplacements = [], this._touchMoveTimeDeltas = [], this._touchMovePreviousTimestamp = 0, 
                this._touchMoved = !1, this._autoScrolling = !1, this._autoScrollAttenuate = !1, 
                this._autoScrollStartPosition = cc.v2(0, 0), this._autoScrollTargetDelta = cc.v2(0, 0), 
                this._autoScrollTotalTime = 0, this._autoScrollAccumulatedTime = 0, this._autoScrollCurrentlyOutOfBoundary = !1, 
                this._autoScrollBraking = !1, this._autoScrollBrakingStartPosition = cc.v2(0, 0), 
                this._outOfBoundaryAmount = cc.v2(0, 0), this._outOfBoundaryAmountDirty = !0, this._stopMouseWheel = !1, 
                this._mouseWheelEventElapsedTime = 0, this._isScrollEndedWithThresholdEventFired = !1, 
                this._scrollEventEmitMask = 0, this._isBouncing = !1, this._scrolling = !1;
            },
            properties: {
                content: {
                    default: void 0,
                    type: cc.Node,
                    tooltip: !1,
                    formerlySerializedAs: "content",
                    notify: function(t) {
                        this._calculateBoundary();
                    }
                },
                horizontal: {
                    default: !0,
                    animatable: !1,
                    tooltip: !1
                },
                vertical: {
                    default: !0,
                    animatable: !1,
                    tooltip: !1
                },
                inertia: {
                    default: !0,
                    tooltip: !1
                },
                brake: {
                    default: .5,
                    type: "Float",
                    range: [ 0, 1, .1 ],
                    tooltip: !1
                },
                elastic: {
                    default: !0,
                    animatable: !1,
                    tooltip: !1
                },
                bounceDuration: {
                    default: 1,
                    range: [ 0, 10 ],
                    tooltip: !1
                },
                horizontalScrollBar: {
                    default: void 0,
                    type: cc.Scrollbar,
                    tooltip: !1,
                    notify: function() {
                        this.horizontalScrollBar && (this.horizontalScrollBar.setTargetScrollView(this), 
                        this._updateScrollBar(0));
                    },
                    animatable: !1
                },
                verticalScrollBar: {
                    default: void 0,
                    type: cc.Scrollbar,
                    tooltip: !1,
                    notify: function() {
                        this.verticalScrollBar && (this.verticalScrollBar.setTargetScrollView(this), this._updateScrollBar(0));
                    },
                    animatable: !1
                },
                scrollEvents: {
                    default: [],
                    type: cc.Component.EventHandler,
                    tooltip: !1
                },
                cancelInnerEvents: {
                    default: !0,
                    animatable: !1,
                    tooltip: !1
                },
                _view: {
                    get: function() {
                        if (this.content) return this.content.parent;
                    }
                }
            },
            statics: {
                EventType: s
            },
            scrollToBottom: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(0, 0),
                    applyToHorizontal: !1,
                    applyToVertical: !0
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i, !0);
            },
            scrollToTop: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(0, 1),
                    applyToHorizontal: !1,
                    applyToVertical: !0
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
            },
            scrollToLeft: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(0, 0),
                    applyToHorizontal: !0,
                    applyToVertical: !1
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
            },
            scrollToRight: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(1, 0),
                    applyToHorizontal: !0,
                    applyToVertical: !1
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
            },
            scrollToTopLeft: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(0, 1),
                    applyToHorizontal: !0,
                    applyToVertical: !0
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
            },
            scrollToTopRight: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(1, 1),
                    applyToHorizontal: !0,
                    applyToVertical: !0
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
            },
            scrollToBottomLeft: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(0, 0),
                    applyToHorizontal: !0,
                    applyToVertical: !0
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
            },
            scrollToBottomRight: function(t, e) {
                var i = this._calculateMovePercentDelta({
                    anchor: cc.v2(1, 0),
                    applyToHorizontal: !0,
                    applyToVertical: !0
                });
                t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
            },
            scrollToOffset: function(t, e, i) {
                var n = this.getMaxScrollOffset(), r = cc.v2(0, 0);
                0 === n.x ? r.x = 0 : r.x = t.x / n.x, 0 === n.y ? r.y = 1 : r.y = (n.y - t.y) / n.y, 
                this.scrollTo(r, e, i);
            },
            getScrollOffset: function() {
                var t = this._getContentTopBoundary() - this._topBoundary, e = this._getContentLeftBoundary() - this._leftBoundary;
                return cc.v2(e, t);
            },
            getMaxScrollOffset: function() {
                var t = this._view.getContentSize(), e = this.content.getContentSize(), i = e.width - t.width, n = e.height - t.height;
                return i = i >= 0 ? i : 0, n = n >= 0 ? n : 0, cc.v2(i, n);
            },
            scrollToPercentHorizontal: function(t, e, i) {
                var n = this._calculateMovePercentDelta({
                    anchor: cc.v2(t, 0),
                    applyToHorizontal: !0,
                    applyToVertical: !1
                });
                e ? this._startAutoScroll(n, e, !1 !== i) : this._moveContent(n);
            },
            scrollTo: function(t, e, i) {
                var n = this._calculateMovePercentDelta({
                    anchor: cc.v2(t),
                    applyToHorizontal: !0,
                    applyToVertical: !0
                });
                e ? this._startAutoScroll(n, e, !1 !== i) : this._moveContent(n);
            },
            scrollToPercentVertical: function(t, e, i) {
                var n = this._calculateMovePercentDelta({
                    anchor: cc.v2(0, t),
                    applyToHorizontal: !1,
                    applyToVertical: !0
                });
                e ? this._startAutoScroll(n, e, !1 !== i) : this._moveContent(n);
            },
            stopAutoScroll: function() {
                this._autoScrolling = !1, this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
            },
            setContentPosition: function(t) {
                t.fuzzyEquals(this.getContentPosition(), 1e-4) || (this.content.setPosition(t), 
                this._outOfBoundaryAmountDirty = !0);
            },
            getContentPosition: function() {
                return this.content.getPosition();
            },
            isScrolling: function() {
                return this._scrolling;
            },
            isAutoScrolling: function() {
                return this._autoScrolling;
            },
            _registerEvent: function() {
                this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0), this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0), 
                this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0), this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0), 
                this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, !0);
            },
            _unregisterEvent: function() {
                this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0), this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0), 
                this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0), this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0), 
                this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, !0);
            },
            _onMouseWheel: function(t, e) {
                if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
                    var i = cc.v2(0, 0), n = -.1;
                    0, this.vertical ? i = cc.v2(0, t.getScrollY() * n) : this.horizontal && (i = cc.v2(t.getScrollY() * n, 0)), 
                    this._mouseWheelEventElapsedTime = 0, this._processDeltaMove(i), this._stopMouseWheel || (this._handlePressLogic(), 
                    this.schedule(this._checkMouseWheel, 1 / 60), this._stopMouseWheel = !0), this._stopPropagationIfTargetIsMe(t);
                }
            },
            _checkMouseWheel: function(t) {
                if (!this._getHowMuchOutOfBoundary().fuzzyEquals(cc.v2(0, 0), 1e-4)) return this._processInertiaScroll(), 
                this.unschedule(this._checkMouseWheel), void (this._stopMouseWheel = !1);
                this._mouseWheelEventElapsedTime += t, this._mouseWheelEventElapsedTime > .1 && (this._onScrollBarTouchEnded(), 
                this.unschedule(this._checkMouseWheel), this._stopMouseWheel = !1);
            },
            _calculateMovePercentDelta: function(t) {
                var e = t.anchor, i = t.applyToHorizontal, n = t.applyToVertical;
                this._calculateBoundary(), e = e.clampf(cc.v2(0, 0), cc.v2(1, 1));
                var r = this._view.getContentSize(), s = this.content.getContentSize(), a = this._getContentBottomBoundary() - this._bottomBoundary;
                a = -a;
                var o = this._getContentLeftBoundary() - this._leftBoundary;
                o = -o;
                var c = cc.v2(0, 0), h = 0;
                return i && (h = s.width - r.width, c.x = o - h * e.x), n && (h = s.height - r.height, 
                c.y = a - h * e.y), c;
            },
            _moveContentToTopLeft: function(t) {
                var e = this.content.getContentSize(), i = this._getContentBottomBoundary() - this._bottomBoundary;
                i = -i;
                var n = cc.v2(0, 0), r = 0, s = this._getContentLeftBoundary() - this._leftBoundary;
                s = -s, e.height < t.height ? (r = e.height - t.height, n.y = i - r, this.verticalScrollBar && this.verticalScrollBar.hide()) : this.verticalScrollBar && this.verticalScrollBar.show(), 
                e.width < t.width ? (r = e.width - t.width, n.x = s, this.horizontalScrollBar && this.horizontalScrollBar.hide()) : this.horizontalScrollBar && this.horizontalScrollBar.show(), 
                this._moveContent(n), this._adjustContentOutOfBoundary();
            },
            _calculateBoundary: function() {
                if (this.content) {
                    var t = this.content.getComponent(cc.Layout);
                    t && t.enabledInHierarchy && t.updateLayout();
                    var e = this._view.getContentSize(), i = e.width * this._view.anchorX, n = e.height * this._view.anchorY;
                    this._leftBoundary = -i, this._bottomBoundary = -n, this._rightBoundary = this._leftBoundary + e.width, 
                    this._topBoundary = this._bottomBoundary + e.height, this._moveContentToTopLeft(e);
                }
            },
            _hasNestedViewGroup: function(t, e) {
                if (t.eventPhase === cc.Event.CAPTURING_PHASE) {
                    if (e) for (var i = 0; i < e.length; ++i) {
                        var n = e[i];
                        if (this.node === n) return !!t.target.getComponent(cc.ViewGroup);
                        if (n.getComponent(cc.ViewGroup)) return !0;
                    }
                    return !1;
                }
            },
            _stopPropagationIfTargetIsMe: function(t) {
                t.eventPhase === cc.Event.AT_TARGET && t.target === this.node && t.stopPropagation();
            },
            _onTouchBegan: function(t, e) {
                if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
                    var i = t.touch;
                    this.content && this._handlePressLogic(i), this._touchMoved = !1, this._stopPropagationIfTargetIsMe(t);
                }
            },
            _onTouchMoved: function(t, e) {
                if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
                    var i = t.touch;
                    if (this.content && this._handleMoveLogic(i), this.cancelInnerEvents) {
                        if (i.getLocation().sub(i.getStartLocation()).mag() > 7 && !this._touchMoved && t.target !== this.node) {
                            var n = new cc.Event.EventTouch(t.getTouches(), t.bubbles);
                            n.type = cc.Node.EventType.TOUCH_CANCEL, n.touch = t.touch, n.simulate = !0, t.target.dispatchEvent(n), 
                            this._touchMoved = !0;
                        }
                        this._stopPropagationIfTargetIsMe(t);
                    }
                }
            },
            _onTouchEnded: function(t, e) {
                if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
                    this._dispatchEvent("touch-up");
                    var i = t.touch;
                    this.content && this._handleReleaseLogic(i), this._touchMoved ? t.stopPropagation() : this._stopPropagationIfTargetIsMe(t);
                }
            },
            _onTouchCancelled: function(t, e) {
                if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
                    if (!t.simulate) {
                        var i = t.touch;
                        this.content && this._handleReleaseLogic(i);
                    }
                    this._stopPropagationIfTargetIsMe(t);
                }
            },
            _processDeltaMove: function(t) {
                this._scrollChildren(t), this._gatherTouchMove(t);
            },
            _handleMoveLogic: function(t) {
                var e = t.getDelta();
                this._processDeltaMove(e);
            },
            _scrollChildren: function(t) {
                var e = t = this._clampDelta(t), i = void 0;
                this.elastic && (i = this._getHowMuchOutOfBoundary(), e.x *= 0 === i.x ? 1 : .5, 
                e.y *= 0 === i.y ? 1 : .5), this.elastic || (i = this._getHowMuchOutOfBoundary(e), 
                e = e.add(i));
                var n = -1;
                if (e.y > 0) this.content.y - this.content.anchorY * this.content.height + e.y > this._bottomBoundary && (n = "scroll-to-bottom"); else if (e.y < 0) {
                    this.content.y - this.content.anchorY * this.content.height + this.content.height + e.y <= this._topBoundary && (n = "scroll-to-top");
                } else if (e.x < 0) {
                    this.content.x - this.content.anchorX * this.content.width + this.content.width + e.x <= this._rightBoundary && (n = "scroll-to-right");
                } else if (e.x > 0) {
                    this.content.x - this.content.anchorX * this.content.width + e.x >= this._leftBoundary && (n = "scroll-to-left");
                }
                this._moveContent(e, !1), 0 === e.x && 0 === e.y || (this._scrolling || (this._scrolling = !0, 
                this._dispatchEvent("scroll-began")), this._dispatchEvent("scrolling")), -1 !== n && this._dispatchEvent(n);
            },
            _handlePressLogic: function() {
                this._autoScrolling && this._dispatchEvent("scroll-ended"), this._autoScrolling = !1, 
                this._isBouncing = !1, this._touchMovePreviousTimestamp = r(), this._touchMoveDisplacements.length = 0, 
                this._touchMoveTimeDeltas.length = 0, this._onScrollBarTouchBegan();
            },
            _clampDelta: function(t) {
                var e = this.content.getContentSize(), i = this.node.getContentSize();
                return e.width < i.width && (t.x = 0), e.height < i.height && (t.y = 0), t;
            },
            _gatherTouchMove: function(t) {
                for (t = this._clampDelta(t); this._touchMoveDisplacements.length >= 5; ) this._touchMoveDisplacements.shift(), 
                this._touchMoveTimeDeltas.shift();
                this._touchMoveDisplacements.push(t);
                var e = r();
                this._touchMoveTimeDeltas.push((e - this._touchMovePreviousTimestamp) / 1e3), this._touchMovePreviousTimestamp = e;
            },
            _startBounceBackIfNeeded: function() {
                if (!this.elastic) return !1;
                var t = this._getHowMuchOutOfBoundary();
                if ((t = this._clampDelta(t)).fuzzyEquals(cc.v2(0, 0), 1e-4)) return !1;
                var e = Math.max(this.bounceDuration, 0);
                return this._startAutoScroll(t, e, !0), this._isBouncing || (t.y > 0 && this._dispatchEvent("bounce-top"), 
                t.y < 0 && this._dispatchEvent("bounce-bottom"), t.x > 0 && this._dispatchEvent("bounce-right"), 
                t.x < 0 && this._dispatchEvent("bounce-left"), this._isBouncing = !0), !0;
            },
            _processInertiaScroll: function() {
                if (!this._startBounceBackIfNeeded() && this.inertia) {
                    var t = this._calculateTouchMoveVelocity();
                    !t.fuzzyEquals(cc.v2(0, 0), 1e-4) && this.brake < 1 && this._startInertiaScroll(t);
                }
                this._onScrollBarTouchEnded();
            },
            _handleReleaseLogic: function(t) {
                var e = t.getDelta();
                this._gatherTouchMove(e), this._processInertiaScroll(), this._scrolling && (this._scrolling = !1, 
                this._autoScrolling || this._dispatchEvent("scroll-ended"));
            },
            _isOutOfBoundary: function() {
                return !this._getHowMuchOutOfBoundary().fuzzyEquals(cc.v2(0, 0), 1e-4);
            },
            _isNecessaryAutoScrollBrake: function() {
                if (this._autoScrollBraking) return !0;
                if (this._isOutOfBoundary()) {
                    if (!this._autoScrollCurrentlyOutOfBoundary) return this._autoScrollCurrentlyOutOfBoundary = !0, 
                    this._autoScrollBraking = !0, this._autoScrollBrakingStartPosition = this.getContentPosition(), 
                    !0;
                } else this._autoScrollCurrentlyOutOfBoundary = !1;
                return !1;
            },
            getScrollEndedEventTiming: function() {
                return 1e-4;
            },
            _processAutoScrolling: function(t) {
                var e = this._isNecessaryAutoScrollBrake(), i = e ? .05 : 1;
                this._autoScrollAccumulatedTime += t * (1 / i);
                var n = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
                this._autoScrollAttenuate && (n = function(t) {
                    return (t -= 1) * t * t * t * t + 1;
                }(n));
                var r = this._autoScrollStartPosition.add(this._autoScrollTargetDelta.mul(n)), s = Math.abs(n - 1) <= 1e-4;
                if (Math.abs(n - 1) <= this.getScrollEndedEventTiming() && !this._isScrollEndedWithThresholdEventFired && (this._dispatchEvent("scroll-ended-with-threshold"), 
                this._isScrollEndedWithThresholdEventFired = !0), this.elastic) {
                    var a = r.sub(this._autoScrollBrakingStartPosition);
                    e && (a = a.mul(i)), r = this._autoScrollBrakingStartPosition.add(a);
                } else {
                    var o = r.sub(this.getContentPosition()), c = this._getHowMuchOutOfBoundary(o);
                    c.fuzzyEquals(cc.v2(0, 0), 1e-4) || (r = r.add(c), s = !0);
                }
                s && (this._autoScrolling = !1);
                var h = r.sub(this.getContentPosition());
                this._moveContent(this._clampDelta(h), s), this._dispatchEvent("scrolling"), this._autoScrolling || (this._isBouncing = !1, 
                this._scrolling = !1, this._dispatchEvent("scroll-ended"));
            },
            _startInertiaScroll: function(t) {
                var e = t.mul(.7);
                this._startAttenuatingAutoScroll(e, t);
            },
            _calculateAttenuatedFactor: function(t) {
                return this.brake <= 0 ? 1 - this.brake : (1 - this.brake) * (1 / (1 + 14e-6 * t + t * t * 8e-9));
            },
            _startAttenuatingAutoScroll: function(t, e) {
                var i = this._calculateAutoScrollTimeByInitalSpeed(e.mag()), n = t.normalize(), r = this.content.getContentSize(), s = this.node.getContentSize(), a = r.width - s.width, o = r.height - s.height, c = this._calculateAttenuatedFactor(a), h = this._calculateAttenuatedFactor(o);
                n = cc.v2(n.x * a * (1 - this.brake) * c, n.y * o * h * (1 - this.brake));
                var l = t.mag(), u = n.mag() / l;
                n = n.add(t), this.brake > 0 && u > 7 && (u = Math.sqrt(u), n = t.mul(u).add(t)), 
                this.brake > 0 && u > 3 && (i *= u = 3), 0 === this.brake && u > 1 && (i *= u), 
                this._startAutoScroll(n, i, !0);
            },
            _calculateAutoScrollTimeByInitalSpeed: function(t) {
                return Math.sqrt(Math.sqrt(t / 5));
            },
            _startAutoScroll: function(t, e, i) {
                var n = this._flattenVectorByDirection(t);
                this._autoScrolling = !0, this._autoScrollTargetDelta = n, this._autoScrollAttenuate = i, 
                this._autoScrollStartPosition = this.getContentPosition(), this._autoScrollTotalTime = e, 
                this._autoScrollAccumulatedTime = 0, this._autoScrollBraking = !1, this._isScrollEndedWithThresholdEventFired = !1, 
                this._autoScrollBrakingStartPosition = cc.v2(0, 0), this._getHowMuchOutOfBoundary().fuzzyEquals(cc.v2(0, 0), 1e-4) || (this._autoScrollCurrentlyOutOfBoundary = !0);
            },
            _calculateTouchMoveVelocity: function() {
                var t = 0;
                if ((t = this._touchMoveTimeDeltas.reduce(function(t, e) {
                    return t + e;
                }, t)) <= 0 || t >= .5) return cc.v2(0, 0);
                var e = cc.v2(0, 0);
                return e = this._touchMoveDisplacements.reduce(function(t, e) {
                    return t.add(e);
                }, e), cc.v2(e.x * (1 - this.brake) / t, e.y * (1 - this.brake) / t);
            },
            _flattenVectorByDirection: function(t) {
                var e = t;
                return e.x = this.horizontal ? e.x : 0, e.y = this.vertical ? e.y : 0, e;
            },
            _moveContent: function(t, e) {
                var i = this._flattenVectorByDirection(t), n = this.getContentPosition().add(i);
                this.setContentPosition(n);
                var r = this._getHowMuchOutOfBoundary();
                this._updateScrollBar(r), this.elastic && e && this._startBounceBackIfNeeded();
            },
            _getContentLeftBoundary: function() {
                return this.getContentPosition().x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
            },
            _getContentRightBoundary: function() {
                var t = this.content.getContentSize();
                return this._getContentLeftBoundary() + t.width;
            },
            _getContentTopBoundary: function() {
                var t = this.content.getContentSize();
                return this._getContentBottomBoundary() + t.height;
            },
            _getContentBottomBoundary: function() {
                return this.getContentPosition().y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
            },
            _getHowMuchOutOfBoundary: function(t) {
                if ((t = t || cc.v2(0, 0)).fuzzyEquals(cc.v2(0, 0), 1e-4) && !this._outOfBoundaryAmountDirty) return this._outOfBoundaryAmount;
                var e = cc.v2(0, 0);
                return this._getContentLeftBoundary() + t.x > this._leftBoundary ? e.x = this._leftBoundary - (this._getContentLeftBoundary() + t.x) : this._getContentRightBoundary() + t.x < this._rightBoundary && (e.x = this._rightBoundary - (this._getContentRightBoundary() + t.x)), 
                this._getContentTopBoundary() + t.y < this._topBoundary ? e.y = this._topBoundary - (this._getContentTopBoundary() + t.y) : this._getContentBottomBoundary() + t.y > this._bottomBoundary && (e.y = this._bottomBoundary - (this._getContentBottomBoundary() + t.y)), 
                t.fuzzyEquals(cc.v2(0, 0), 1e-4) && (this._outOfBoundaryAmount = e, this._outOfBoundaryAmountDirty = !1), 
                e = this._clampDelta(e);
            },
            _updateScrollBar: function(t) {
                this.horizontalScrollBar && this.horizontalScrollBar._onScroll(t), this.verticalScrollBar && this.verticalScrollBar._onScroll(t);
            },
            _onScrollBarTouchBegan: function() {
                this.horizontalScrollBar && this.horizontalScrollBar._onTouchBegan(), this.verticalScrollBar && this.verticalScrollBar._onTouchBegan();
            },
            _onScrollBarTouchEnded: function() {
                this.horizontalScrollBar && this.horizontalScrollBar._onTouchEnded(), this.verticalScrollBar && this.verticalScrollBar._onTouchEnded();
            },
            _dispatchEvent: function(t) {
                if ("scroll-ended" === t) this._scrollEventEmitMask = 0; else if ("scroll-to-top" === t || "scroll-to-bottom" === t || "scroll-to-left" === t || "scroll-to-right" === t) {
                    var e = 1 << a[t];
                    if (this._scrollEventEmitMask & e) return;
                    this._scrollEventEmitMask |= e;
                }
                cc.Component.EventHandler.emitEvents(this.scrollEvents, this, a[t]), this.node.emit(t, this);
            },
            _adjustContentOutOfBoundary: function() {
                if (this._outOfBoundaryAmountDirty = !0, this._isOutOfBoundary()) {
                    var t = this._getHowMuchOutOfBoundary(cc.v2(0, 0)), e = this.getContentPosition().add(t);
                    this.content && (this.content.setPosition(e), this._updateScrollBar(0));
                }
            },
            start: function() {
                this._calculateBoundary(), this.content && cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
            },
            _hideScrollbar: function() {
                this.horizontalScrollBar && this.horizontalScrollBar.hide(), this.verticalScrollBar && this.verticalScrollBar.hide();
            },
            _showScrollbar: function() {
                this.horizontalScrollBar && this.horizontalScrollBar.show(), this.verticalScrollBar && this.verticalScrollBar.show();
            },
            onDisable: function() {
                this._unregisterEvent(), this.content && (this.content.off(n.SIZE_CHANGED, this._calculateBoundary, this), 
                this.content.off(n.SCALE_CHANGED, this._calculateBoundary, this), this._view && (this._view.off(n.POSITION_CHANGED, this._calculateBoundary, this), 
                this._view.off(n.SCALE_CHANGED, this._calculateBoundary, this), this._view.off(n.SIZE_CHANGED, this._calculateBoundary, this))), 
                this._hideScrollbar(), this.stopAutoScroll();
            },
            onEnable: function() {
                this._registerEvent(), this.content && (this.content.on(n.SIZE_CHANGED, this._calculateBoundary, this), 
                this.content.on(n.SCALE_CHANGED, this._calculateBoundary, this), this._view && (this._view.on(n.POSITION_CHANGED, this._calculateBoundary, this), 
                this._view.on(n.SCALE_CHANGED, this._calculateBoundary, this), this._view.on(n.SIZE_CHANGED, this._calculateBoundary, this))), 
                this._showScrollbar();
            },
            update: function(t) {
                this._autoScrolling && this._processAutoScrolling(t);
            }
        });
        cc.ScrollView = e.exports = o;
    }, {
        "../CCNode": 4,
        "./CCViewGroup": 38
    } ],
    37: [ function(t, e, i) {
        var n = t("../utils/misc"), r = t("../CCNode").EventType, s = t("./CCRenderComponent"), a = t("../renderer/render-flow"), o = t("../renderer/render-engine"), c = o.gfx, h = o.SpriteMaterial, l = o.GraySpriteMaterial, u = t("../renderer/utils/dynamic-atlas/manager"), _ = t("../platform/CCMacro").BlendFactor, d = cc.Enum({
            SIMPLE: 0,
            SLICED: 1,
            TILED: 2,
            FILLED: 3,
            MESH: 4
        }), f = cc.Enum({
            HORIZONTAL: 0,
            VERTICAL: 1,
            RADIAL: 2
        }), p = cc.Enum({
            CUSTOM: 0,
            TRIMMED: 1,
            RAW: 2
        }), m = cc.Enum({
            NORMAL: 0,
            GRAY: 1
        }), v = cc.Class({
            name: "cc.Sprite",
            extends: s,
            ctor: function() {
                this._assembler = null, this._graySpriteMaterial = null, this._spriteMaterial = null;
            },
            editor: !1,
            properties: {
                _spriteFrame: {
                    default: null,
                    type: cc.SpriteFrame
                },
                _type: d.SIMPLE,
                _sizeMode: p.TRIMMED,
                _fillType: 0,
                _fillCenter: cc.v2(0, 0),
                _fillStart: 0,
                _fillRange: 0,
                _isTrimmedMode: !0,
                _state: 0,
                _atlas: {
                    default: null,
                    type: cc.SpriteAtlas,
                    tooltip: !1,
                    editorOnly: !0,
                    visible: !0,
                    animatable: !1
                },
                _srcBlendFactor: _.SRC_ALPHA,
                _dstBlendFactor: _.ONE_MINUS_SRC_ALPHA,
                srcBlendFactor: {
                    get: function() {
                        return this._srcBlendFactor;
                    },
                    set: function(t) {
                        this._srcBlendFactor !== t && (this._srcBlendFactor = t, this._updateBlendFunc(!0));
                    },
                    animatable: !1,
                    type: _,
                    tooltip: !1
                },
                dstBlendFactor: {
                    get: function() {
                        return this._dstBlendFactor;
                    },
                    set: function(t) {
                        this._dstBlendFactor !== t && (this._dstBlendFactor = t, this._updateBlendFunc(!0));
                    },
                    animatable: !1,
                    type: _,
                    tooltip: !1
                },
                spriteFrame: {
                    get: function() {
                        return this._spriteFrame;
                    },
                    set: function(t, e) {
                        var i = this._spriteFrame;
                        i !== t && (this._spriteFrame = t, this.markForUpdateRenderData(!1), this._applySpriteFrame(i));
                    },
                    type: cc.SpriteFrame
                },
                type: {
                    get: function() {
                        return this._type;
                    },
                    set: function(t) {
                        this._type !== t && (this.destroyRenderData(this._renderData), this._renderData = null, 
                        this._type = t, this._updateAssembler());
                    },
                    type: d,
                    animatable: !1,
                    tooltip: !1
                },
                fillType: {
                    get: function() {
                        return this._fillType;
                    },
                    set: function(t) {
                        t !== this._fillType && (t === f.RADIAL || this._fillType === f.RADIAL ? (this.destroyRenderData(this._renderData), 
                        this._renderData = null) : this._renderData && this.markForUpdateRenderData(!0), 
                        this._fillType = t, this._updateAssembler());
                    },
                    type: f,
                    tooltip: !1
                },
                fillCenter: {
                    get: function() {
                        return this._fillCenter;
                    },
                    set: function(t) {
                        this._fillCenter.x = t.x, this._fillCenter.y = t.y, this._type === d.FILLED && this._renderData && this.markForUpdateRenderData(!0);
                    },
                    tooltip: !1
                },
                fillStart: {
                    get: function() {
                        return this._fillStart;
                    },
                    set: function(t) {
                        this._fillStart = n.clampf(t, -1, 1), this._type === d.FILLED && this._renderData && this.markForUpdateRenderData(!0);
                    },
                    tooltip: !1
                },
                fillRange: {
                    get: function() {
                        return this._fillRange;
                    },
                    set: function(t) {
                        this._fillRange = n.clampf(t, -1, 1), this._type === d.FILLED && this._renderData && this.markForUpdateRenderData(!0);
                    },
                    tooltip: !1
                },
                trim: {
                    get: function() {
                        return this._isTrimmedMode;
                    },
                    set: function(t) {
                        this._isTrimmedMode !== t && (this._isTrimmedMode = t, this._type !== d.SIMPLE && this._type !== d.MESH || !this._renderData || this.markForUpdateRenderData(!0));
                    },
                    animatable: !1,
                    tooltip: !1
                },
                sizeMode: {
                    get: function() {
                        return this._sizeMode;
                    },
                    set: function(t) {
                        this._sizeMode = t, t !== p.CUSTOM && this._applySpriteSize();
                    },
                    animatable: !1,
                    type: p,
                    tooltip: !1
                }
            },
            statics: {
                FillType: f,
                Type: d,
                SizeMode: p,
                State: m
            },
            setVisible: function(t) {
                this.enabled = t;
            },
            setState: function(t) {
                this._state !== t && (this._state = t, this._activateMaterial());
            },
            getState: function() {
                return this._state;
            },
            onEnable: function() {
                this._super(), this._spriteFrame && this._spriteFrame.textureLoaded() || (this.disableRender(), 
                this._spriteFrame && (this._spriteFrame.once("load", this._onTextureLoaded, this), 
                this._spriteFrame.ensureLoadTexture())), this._updateAssembler(), this._activateMaterial(), 
                this.node.on(r.SIZE_CHANGED, this._onNodeSizeDirty, this), this.node.on(r.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
            },
            onDisable: function() {
                this._super(), this.node.off(r.SIZE_CHANGED, this._onNodeSizeDirty, this), this.node.off(r.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
            },
            _onNodeSizeDirty: function() {
                this._renderData && this.markForUpdateRenderData(!0);
            },
            _updateAssembler: function() {
                var t = v._assembler.getAssembler(this);
                this._assembler !== t && (this._assembler = t, this._renderData = null), this._renderData || (this._renderData = this._assembler.createData(this), 
                this._renderData.material = this._material, this.markForUpdateRenderData(!0));
            },
            _activateMaterial: function() {
                var t = this._spriteFrame;
                if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
                    var e = void 0;
                    if (this._state === m.GRAY ? (this._graySpriteMaterial || (this._graySpriteMaterial = new l()), 
                    e = this._graySpriteMaterial) : (this._spriteMaterial || (this._spriteMaterial = new h()), 
                    e = this._spriteMaterial), e.useColor = !1, t && t.textureLoaded()) {
                        var i = t.getTexture();
                        e.texture !== i ? (e.texture = i, this._updateMaterial(e)) : e !== this._material && this._updateMaterial(e), 
                        this._renderData && (this._renderData.material = e), this.node._renderFlag |= a.FLAG_COLOR, 
                        this.markForUpdateRenderData(!0), this.markForRender(!0);
                    } else this.disableRender();
                } else this.markForUpdateRenderData(!0), this.markForRender(!0);
            },
            _updateMaterial: function(t) {
                this._material = t, this._updateBlendFunc(), t.updateHash();
            },
            _updateBlendFunc: function(t) {
                this._material && (this._material._mainTech.passes[0].setBlend(c.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor, c.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor), 
                t && this._material.updateHash());
            },
            _applyAtlas: !1,
            _canRender: function() {
                if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                    if (!this._enabled) return !1;
                } else if (!this._enabled || !this._material || !this.node._activeInHierarchy) return !1;
                var t = this._spriteFrame;
                return !(!t || !t.textureLoaded());
            },
            markForUpdateRenderData: function(t) {
                if (t && this._canRender()) {
                    this.node._renderFlag |= a.FLAG_UPDATE_RENDER_DATA;
                    var e = this._renderData;
                    e && (e.uvDirty = !0, e.vertDirty = !0);
                } else t || (this.node._renderFlag &= ~a.FLAG_UPDATE_RENDER_DATA);
            },
            _applySpriteSize: function() {
                if (this._spriteFrame) {
                    if (p.RAW === this._sizeMode) {
                        var t = this._spriteFrame.getOriginalSize();
                        this.node.setContentSize(t);
                    } else if (p.TRIMMED === this._sizeMode) {
                        var e = this._spriteFrame.getRect();
                        this.node.setContentSize(e.width, e.height);
                    }
                    this._activateMaterial();
                }
            },
            _onTextureLoaded: function() {
                this.isValid && this._applySpriteSize();
            },
            _applySpriteFrame: function(t) {
                t && t.off && t.off("load", this._onTextureLoaded, this);
                var e = this._spriteFrame;
                e && (this._material && this._material._texture) === (e && e._texture) || this.markForRender(!1), 
                e && (t && e._texture === t._texture ? this._applySpriteSize() : e.textureLoaded() ? this._onTextureLoaded(null) : (e.once("load", this._onTextureLoaded, this), 
                e.ensureLoadTexture()));
            },
            _resized: !1,
            _calDynamicAtlas: function() {
                if (this._spriteFrame) {
                    if (!this._spriteFrame._original && u) {
                        var t = u.insertSpriteFrame(this._spriteFrame);
                        t && this._spriteFrame._setDynamicAtlasFrame(t);
                    }
                    this._material._texture !== this._spriteFrame._texture && this._activateMaterial();
                }
            }
        });
        cc.Sprite = e.exports = v;
    }, {
        "../CCNode": 4,
        "../platform/CCMacro": 87,
        "../renderer/render-engine": 124,
        "../renderer/render-flow": 125,
        "../renderer/utils/dynamic-atlas/manager": void 0,
        "../utils/misc": 159,
        "./CCRenderComponent": 35
    } ],
    38: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.ViewGroup",
            extends: t("./CCComponent")
        });
        cc.ViewGroup = e.exports = n;
    }, {
        "./CCComponent": 30
    } ],
    39: [ function(t, e, i) {
        var n = t("../base-ui/CCWidgetManager"), r = n.AlignMode, s = n._AlignFlags, a = s.TOP, o = s.MID, c = s.BOT, h = s.LEFT, l = s.CENTER, u = s.RIGHT, _ = a | c, d = h | u, f = cc.Class({
            name: "cc.Widget",
            extends: t("./CCComponent"),
            editor: !1,
            properties: {
                target: {
                    get: function() {
                        return this._target;
                    },
                    set: function(t) {
                        this._target = t;
                    },
                    type: cc.Node,
                    tooltip: !1
                },
                isAlignTop: {
                    get: function() {
                        return (this._alignFlags & a) > 0;
                    },
                    set: function(t) {
                        this._setAlign(a, t);
                    },
                    animatable: !1,
                    tooltip: !1
                },
                isAlignVerticalCenter: {
                    get: function() {
                        return (this._alignFlags & o) > 0;
                    },
                    set: function(t) {
                        t ? (this.isAlignTop = !1, this.isAlignBottom = !1, this._alignFlags |= o) : this._alignFlags &= ~o;
                    },
                    animatable: !1,
                    tooltip: !1
                },
                isAlignBottom: {
                    get: function() {
                        return (this._alignFlags & c) > 0;
                    },
                    set: function(t) {
                        this._setAlign(c, t);
                    },
                    animatable: !1,
                    tooltip: !1
                },
                isAlignLeft: {
                    get: function() {
                        return (this._alignFlags & h) > 0;
                    },
                    set: function(t) {
                        this._setAlign(h, t);
                    },
                    animatable: !1,
                    tooltip: !1
                },
                isAlignHorizontalCenter: {
                    get: function() {
                        return (this._alignFlags & l) > 0;
                    },
                    set: function(t) {
                        t ? (this.isAlignLeft = !1, this.isAlignRight = !1, this._alignFlags |= l) : this._alignFlags &= ~l;
                    },
                    animatable: !1,
                    tooltip: !1
                },
                isAlignRight: {
                    get: function() {
                        return (this._alignFlags & u) > 0;
                    },
                    set: function(t) {
                        this._setAlign(u, t);
                    },
                    animatable: !1,
                    tooltip: !1
                },
                isStretchWidth: {
                    get: function() {
                        return (this._alignFlags & d) === d;
                    },
                    visible: !1
                },
                isStretchHeight: {
                    get: function() {
                        return (this._alignFlags & _) === _;
                    },
                    visible: !1
                },
                top: {
                    get: function() {
                        return this._top;
                    },
                    set: function(t) {
                        this._top = t;
                    },
                    tooltip: !1
                },
                bottom: {
                    get: function() {
                        return this._bottom;
                    },
                    set: function(t) {
                        this._bottom = t;
                    },
                    tooltip: !1
                },
                left: {
                    get: function() {
                        return this._left;
                    },
                    set: function(t) {
                        this._left = t;
                    },
                    tooltip: !1
                },
                right: {
                    get: function() {
                        return this._right;
                    },
                    set: function(t) {
                        this._right = t;
                    },
                    tooltip: !1
                },
                horizontalCenter: {
                    get: function() {
                        return this._horizontalCenter;
                    },
                    set: function(t) {
                        this._horizontalCenter = t;
                    },
                    tooltip: !1
                },
                verticalCenter: {
                    get: function() {
                        return this._verticalCenter;
                    },
                    set: function(t) {
                        this._verticalCenter = t;
                    },
                    tooltip: !1
                },
                isAbsoluteHorizontalCenter: {
                    get: function() {
                        return this._isAbsHorizontalCenter;
                    },
                    set: function(t) {
                        this._isAbsHorizontalCenter = t;
                    },
                    animatable: !1
                },
                isAbsoluteVerticalCenter: {
                    get: function() {
                        return this._isAbsVerticalCenter;
                    },
                    set: function(t) {
                        this._isAbsVerticalCenter = t;
                    },
                    animatable: !1
                },
                isAbsoluteTop: {
                    get: function() {
                        return this._isAbsTop;
                    },
                    set: function(t) {
                        this._isAbsTop = t;
                    },
                    animatable: !1
                },
                isAbsoluteBottom: {
                    get: function() {
                        return this._isAbsBottom;
                    },
                    set: function(t) {
                        this._isAbsBottom = t;
                    },
                    animatable: !1
                },
                isAbsoluteLeft: {
                    get: function() {
                        return this._isAbsLeft;
                    },
                    set: function(t) {
                        this._isAbsLeft = t;
                    },
                    animatable: !1
                },
                isAbsoluteRight: {
                    get: function() {
                        return this._isAbsRight;
                    },
                    set: function(t) {
                        this._isAbsRight = t;
                    },
                    animatable: !1
                },
                alignMode: {
                    default: r.ON_WINDOW_RESIZE,
                    type: r,
                    tooltip: !1
                },
                _wasAlignOnce: {
                    default: void 0,
                    formerlySerializedAs: "isAlignOnce"
                },
                _target: null,
                _alignFlags: 0,
                _left: 0,
                _right: 0,
                _top: 0,
                _bottom: 0,
                _verticalCenter: 0,
                _horizontalCenter: 0,
                _isAbsLeft: !0,
                _isAbsRight: !0,
                _isAbsTop: !0,
                _isAbsBottom: !0,
                _isAbsHorizontalCenter: !0,
                _isAbsVerticalCenter: !0,
                _originalWidth: 0,
                _originalHeight: 0
            },
            statics: {
                AlignMode: r
            },
            onLoad: function() {
                void 0 !== this._wasAlignOnce && (this.alignMode = this._wasAlignOnce ? r.ONCE : r.ALWAYS, 
                this._wasAlignOnce = void 0);
            },
            onEnable: function() {
                n.add(this);
            },
            onDisable: function() {
                n.remove(this);
            },
            _validateTargetInDEV: !1,
            _setAlign: function(t, e) {
                if (e !== (this._alignFlags & t) > 0) {
                    var i = (t & d) > 0;
                    e ? (this._alignFlags |= t, i ? (this.isAlignHorizontalCenter = !1, this.isStretchWidth && (this._originalWidth = this.node.width)) : (this.isAlignVerticalCenter = !1, 
                    this.isStretchHeight && (this._originalHeight = this.node.height))) : (i ? this.isStretchWidth && (this.node.width = this._originalWidth) : this.isStretchHeight && (this.node.height = this._originalHeight), 
                    this._alignFlags &= ~t);
                }
            },
            updateAlignment: function() {
                n.updateAlignment(this.node);
            }
        });
        Object.defineProperty(f.prototype, "isAlignOnce", {
            get: function() {
                return this.alignMode === r.ONCE;
            },
            set: function(t) {
                this.alignMode = t ? r.ONCE : r.ALWAYS;
            }
        }), cc.Widget = e.exports = f;
    }, {
        "../base-ui/CCWidgetManager": 25,
        "./CCComponent": 30
    } ],
    40: [ function(t, e, i) {
        var n = t("./CCComponent"), r = void 0;
        r = cc.sys.platform === cc.sys.BAIDU_GAME ? cc.Class({
            name: "cc.SwanSubContextView",
            extends: n,
            editor: !1,
            ctor: function() {
                this._sprite = null, this._tex = new cc.Texture2D(), this._context = null;
            },
            onLoad: function() {
                if (swan.getOpenDataContext) {
                    this._context = swan.getOpenDataContext();
                    var t = this._context.canvas;
                    t && (t.width = this.node.width, t.height = this.node.height), this._tex.setPremultiplyAlpha(!0), 
                    this._tex.initWithElement(t), this._sprite = this.node.getComponent(cc.Sprite), 
                    this._sprite || (this._sprite = this.node.addComponent(cc.Sprite), this._sprite.srcBlendFactor = cc.macro.BlendFactor.ONE), 
                    this._sprite.spriteFrame = new cc.SpriteFrame(this._tex);
                } else this.enabled = !1;
            },
            onEnable: function() {
                this.updateSubContextViewport();
            },
            update: function() {
                this._tex && this._context && (this._tex.initWithElement(this._context.canvas), 
                this._sprite._activateMaterial());
            },
            updateSubContextViewport: function() {
                if (this._context) {
                    var t = this.node.getBoundingBoxToWorld(), e = cc.view._scaleX, i = cc.view._scaleY;
                    this._context.postMessage({
                        fromEngine: !0,
                        event: "viewport",
                        x: t.x * e + cc.view._viewportRect.x,
                        y: t.y * i + cc.view._viewportRect.y,
                        width: t.width * e,
                        height: t.height * i
                    });
                }
            }
        }) : cc.Class({
            name: "cc.SwanSubContextView",
            extends: n
        }), cc.SwanSubContextView = e.exports = r;
    }, {
        "./CCComponent": 30
    } ],
    41: [ function(t, e, i) {
        var n = t("./CCComponent"), r = void 0;
        r = cc.Class({
            name: "cc.WXSubContextView",
            extends: n,
            editor: !1,
            ctor: function() {
                this._sprite = null, this._tex = new cc.Texture2D(), this._context = null;
            },
            onLoad: function() {
                wx.getOpenDataContext ? (this._context = wx.getOpenDataContext(), this.reset(), 
                this._tex.setPremultiplyAlpha(!0), this._tex.initWithElement(sharedCanvas), this._sprite = this.node.getComponent(cc.Sprite), 
                this._sprite || (this._sprite = this.node.addComponent(cc.Sprite), this._sprite.srcBlendFactor = cc.macro.BlendFactor.ONE), 
                this._sprite.spriteFrame = new cc.SpriteFrame(this._tex)) : this.enabled = !1;
            },
            reset: function() {
                if (this._context) {
                    this.updateSubContextViewport();
                    var t = this._context.canvas;
                    t && (t.width = this.node.width, t.height = this.node.height);
                }
            },
            onEnable: function() {
                this.updateSubContextViewport();
            },
            update: function() {
                this._tex && this._context && (this._tex.initWithElement(this._context.canvas), 
                this._sprite._activateMaterial());
            },
            updateSubContextViewport: function() {
                if (this._context) {
                    var t = this.node.getBoundingBoxToWorld(), e = cc.view._scaleX, i = cc.view._scaleY;
                    this._context.postMessage({
                        fromEngine: !0,
                        event: "viewport",
                        x: t.x * e + cc.view._viewportRect.x,
                        y: t.y * i + cc.view._viewportRect.y,
                        width: t.width * e,
                        height: t.height * i
                    });
                }
            }
        }), cc.WXSubContextView = e.exports = r;
    }, {
        "./CCComponent": 30
    } ],
    42: [ function(t, e, i) {
        t("./CCComponent"), t("./CCComponentEventHandler"), t("./missing-script");
        var n = [ t("./CCSprite"), t("./CCWidget"), t("./CCCanvas"), t("./CCAudioSource"), t("./CCAnimation"), t("./CCButton"), t("./CCLabel"), t("./CCProgressBar"), t("./CCMask"), t("./CCScrollBar"), t("./CCScrollView"), t("./CCPageViewIndicator"), t("./CCPageView"), t("./CCSlider"), t("./CCLayout"), t("./editbox/CCEditBox"), t("./CCLabelOutline"), t("./CCRichText"), t("./CCToggleContainer"), t("./CCToggleGroup"), t("./CCToggle"), t("./CCBlockInputEvents"), t("./CCMotionStreak"), t("./WXSubContextView"), t("./SwanSubContextView") ];
        e.exports = n;
    }, {
        "./CCAnimation": void 0,
        "./CCAudioSource": void 0,
        "./CCBlockInputEvents": 28,
        "./CCButton": void 0,
        "./CCCanvas": 29,
        "./CCComponent": 30,
        "./CCComponentEventHandler": 31,
        "./CCLabel": 32,
        "./CCLabelOutline": void 0,
        "./CCLayout": 33,
        "./CCMask": 34,
        "./CCMotionStreak": void 0,
        "./CCPageView": void 0,
        "./CCPageViewIndicator": void 0,
        "./CCProgressBar": void 0,
        "./CCRichText": void 0,
        "./CCScrollBar": void 0,
        "./CCScrollView": 36,
        "./CCSlider": void 0,
        "./CCSprite": 37,
        "./CCToggle": void 0,
        "./CCToggleContainer": void 0,
        "./CCToggleGroup": void 0,
        "./CCWidget": 39,
        "./SwanSubContextView": 40,
        "./WXSubContextView": 41,
        "./editbox/CCEditBox": void 0,
        "./missing-script": 43
    } ],
    43: [ function(t, e, i) {
        var n = cc.js, r = t("../utils/misc").BUILTIN_CLASSID_RE, s = cc.Class({
            name: "cc.MissingClass",
            properties: {
                _$erialized: {
                    default: null,
                    visible: !1,
                    editorOnly: !0
                }
            }
        }), a = cc.Class({
            name: "cc.MissingScript",
            extends: cc.Component,
            editor: {
                inspector: "packages://inspector/inspectors/comps/missing-script.js"
            },
            properties: {
                compiled: {
                    default: !1,
                    serializable: !1
                },
                _$erialized: {
                    default: null,
                    visible: !1,
                    editorOnly: !0
                }
            },
            ctor: !1,
            statics: {
                safeFindClass: function(t, e) {
                    var i = n._getClassById(t);
                    return i || (t ? (cc.deserialize.reportMissingClass(t), a.getMissingWrapper(t, e)) : null);
                },
                getMissingWrapper: function(t, e) {
                    return e.node && (/^[0-9a-zA-Z+/]{23}$/.test(t) || r.test(t)) ? a : s;
                }
            },
            onLoad: function() {
                cc.warnID(4600, this.node.name);
            }
        });
        cc._MissingScript = e.exports = a;
    }, {
        "../utils/misc": 159
    } ],
    44: [ function(t, e, i) {
        var n = cc.js;
        t("../event/event");
        var r = function(t, e) {
            cc.Event.call(this, cc.Event.MOUSE, e), this._eventType = t, this._button = 0, this._x = 0, 
            this._y = 0, this._prevX = 0, this._prevY = 0, this._scrollX = 0, this._scrollY = 0;
        };
        n.extend(r, cc.Event);
        var s = r.prototype;
        s.setScrollData = function(t, e) {
            this._scrollX = t, this._scrollY = e;
        }, s.getScrollX = function() {
            return this._scrollX;
        }, s.getScrollY = function() {
            return this._scrollY;
        }, s.setLocation = function(t, e) {
            this._x = t, this._y = e;
        }, s.getLocation = function() {
            return cc.v2(this._x, this._y);
        }, s.getLocationInView = function() {
            return cc.v2(this._x, cc.view._designResolutionSize.height - this._y);
        }, s._setPrevCursor = function(t, e) {
            this._prevX = t, this._prevY = e;
        }, s.getPreviousLocation = function() {
            return cc.v2(this._prevX, this._prevY);
        }, s.getDelta = function() {
            return cc.v2(this._x - this._prevX, this._y - this._prevY);
        }, s.getDeltaX = function() {
            return this._x - this._prevX;
        }, s.getDeltaY = function() {
            return this._y - this._prevY;
        }, s.setButton = function(t) {
            this._button = t;
        }, s.getButton = function() {
            return this._button;
        }, s.getLocationX = function() {
            return this._x;
        }, s.getLocationY = function() {
            return this._y;
        }, r.NONE = 0, r.DOWN = 1, r.UP = 2, r.MOVE = 3, r.SCROLL = 4, r.BUTTON_LEFT = 0, 
        r.BUTTON_RIGHT = 2, r.BUTTON_MIDDLE = 1, r.BUTTON_4 = 3, r.BUTTON_5 = 4, r.BUTTON_6 = 5, 
        r.BUTTON_7 = 6, r.BUTTON_8 = 7;
        var a = function(t, e) {
            cc.Event.call(this, cc.Event.TOUCH, e), this._eventCode = 0, this._touches = t || [], 
            this.touch = null, this.currentTouch = null;
        };
        n.extend(a, cc.Event), (s = a.prototype).getEventCode = function() {
            return this._eventCode;
        }, s.getTouches = function() {
            return this._touches;
        }, s._setEventCode = function(t) {
            this._eventCode = t;
        }, s._setTouches = function(t) {
            this._touches = t;
        }, s.setLocation = function(t, e) {
            this.touch && this.touch.setTouchInfo(this.touch.getID(), t, e);
        }, s.getLocation = function() {
            return this.touch ? this.touch.getLocation() : cc.v2();
        }, s.getLocationInView = function() {
            return this.touch ? this.touch.getLocationInView() : cc.v2();
        }, s.getPreviousLocation = function() {
            return this.touch ? this.touch.getPreviousLocation() : cc.v2();
        }, s.getStartLocation = function() {
            return this.touch ? this.touch.getStartLocation() : cc.v2();
        }, s.getID = function() {
            return this.touch ? this.touch.getID() : null;
        }, s.getDelta = function() {
            return this.touch ? this.touch.getDelta() : cc.v2();
        }, s.getDeltaX = function() {
            return this.touch ? this.touch.getDelta().x : 0;
        }, s.getDeltaY = function() {
            return this.touch ? this.touch.getDelta().y : 0;
        }, s.getLocationX = function() {
            return this.touch ? this.touch.getLocationX() : 0;
        }, s.getLocationY = function() {
            return this.touch ? this.touch.getLocationY() : 0;
        }, a.MAX_TOUCHES = 5, a.BEGAN = 0, a.MOVED = 1, a.ENDED = 2, a.CANCELED = 3;
        var o = function(t, e) {
            cc.Event.call(this, cc.Event.ACCELERATION, e), this.acc = t;
        };
        n.extend(o, cc.Event);
        var c = function(t, e, i) {
            cc.Event.call(this, cc.Event.KEYBOARD, i), this.keyCode = t, this.isPressed = e;
        };
        n.extend(c, cc.Event), cc.Event.EventMouse = r, cc.Event.EventTouch = a, cc.Event.EventAcceleration = o, 
        cc.Event.EventKeyboard = c, e.exports = cc.Event;
    }, {
        "../event/event": 51
    } ],
    45: [ function(t, e, i) {
        var n = t("../platform/js");
        cc.EventListener = function(t, e, i) {
            this._onEvent = i, this._type = t || 0, this._listenerID = e || "", this._registered = !1, 
            this._fixedPriority = 0, this._node = null, this._target = null, this._paused = !0, 
            this._isEnabled = !0;
        }, cc.EventListener.prototype = {
            constructor: cc.EventListener,
            _setPaused: function(t) {
                this._paused = t;
            },
            _isPaused: function() {
                return this._paused;
            },
            _setRegistered: function(t) {
                this._registered = t;
            },
            _isRegistered: function() {
                return this._registered;
            },
            _getType: function() {
                return this._type;
            },
            _getListenerID: function() {
                return this._listenerID;
            },
            _setFixedPriority: function(t) {
                this._fixedPriority = t;
            },
            _getFixedPriority: function() {
                return this._fixedPriority;
            },
            _setSceneGraphPriority: function(t) {
                this._target = t, this._node = t;
            },
            _getSceneGraphPriority: function() {
                return this._node;
            },
            checkAvailable: function() {
                return null !== this._onEvent;
            },
            clone: function() {
                return null;
            },
            setEnabled: function(t) {
                this._isEnabled = t;
            },
            isEnabled: function() {
                return this._isEnabled;
            },
            retain: function() {},
            release: function() {}
        }, cc.EventListener.UNKNOWN = 0, cc.EventListener.TOUCH_ONE_BY_ONE = 1, cc.EventListener.TOUCH_ALL_AT_ONCE = 2, 
        cc.EventListener.KEYBOARD = 3, cc.EventListener.MOUSE = 4, cc.EventListener.ACCELERATION = 6, 
        cc.EventListener.CUSTOM = 8;
        var r = cc.EventListener.ListenerID = {
            MOUSE: "__cc_mouse",
            TOUCH_ONE_BY_ONE: "__cc_touch_one_by_one",
            TOUCH_ALL_AT_ONCE: "__cc_touch_all_at_once",
            KEYBOARD: "__cc_keyboard",
            ACCELERATION: "__cc_acceleration"
        }, s = function(t, e) {
            this._onCustomEvent = e, cc.EventListener.call(this, cc.EventListener.CUSTOM, t, this._callback);
        };
        n.extend(s, cc.EventListener), n.mixin(s.prototype, {
            _onCustomEvent: null,
            _callback: function(t) {
                null !== this._onCustomEvent && this._onCustomEvent(t);
            },
            checkAvailable: function() {
                return cc.EventListener.prototype.checkAvailable.call(this) && null !== this._onCustomEvent;
            },
            clone: function() {
                return new s(this._listenerID, this._onCustomEvent);
            }
        });
        var a = function() {
            cc.EventListener.call(this, cc.EventListener.MOUSE, r.MOUSE, this._callback);
        };
        n.extend(a, cc.EventListener), n.mixin(a.prototype, {
            onMouseDown: null,
            onMouseUp: null,
            onMouseMove: null,
            onMouseScroll: null,
            _callback: function(t) {
                var e = cc.Event.EventMouse;
                switch (t._eventType) {
                  case e.DOWN:
                    this.onMouseDown && this.onMouseDown(t);
                    break;

                  case e.UP:
                    this.onMouseUp && this.onMouseUp(t);
                    break;

                  case e.MOVE:
                    this.onMouseMove && this.onMouseMove(t);
                    break;

                  case e.SCROLL:
                    this.onMouseScroll && this.onMouseScroll(t);
                }
            },
            clone: function() {
                var t = new a();
                return t.onMouseDown = this.onMouseDown, t.onMouseUp = this.onMouseUp, t.onMouseMove = this.onMouseMove, 
                t.onMouseScroll = this.onMouseScroll, t;
            },
            checkAvailable: function() {
                return !0;
            }
        });
        var o = function() {
            cc.EventListener.call(this, cc.EventListener.TOUCH_ONE_BY_ONE, r.TOUCH_ONE_BY_ONE, null), 
            this._claimedTouches = [];
        };
        n.extend(o, cc.EventListener), n.mixin(o.prototype, {
            constructor: o,
            _claimedTouches: null,
            swallowTouches: !1,
            onTouchBegan: null,
            onTouchMoved: null,
            onTouchEnded: null,
            onTouchCancelled: null,
            setSwallowTouches: function(t) {
                this.swallowTouches = t;
            },
            isSwallowTouches: function() {
                return this.swallowTouches;
            },
            clone: function() {
                var t = new o();
                return t.onTouchBegan = this.onTouchBegan, t.onTouchMoved = this.onTouchMoved, t.onTouchEnded = this.onTouchEnded, 
                t.onTouchCancelled = this.onTouchCancelled, t.swallowTouches = this.swallowTouches, 
                t;
            },
            checkAvailable: function() {
                return !!this.onTouchBegan || (cc.logID(1801), !1);
            }
        });
        var c = function() {
            cc.EventListener.call(this, cc.EventListener.TOUCH_ALL_AT_ONCE, r.TOUCH_ALL_AT_ONCE, null);
        };
        n.extend(c, cc.EventListener), n.mixin(c.prototype, {
            constructor: c,
            onTouchesBegan: null,
            onTouchesMoved: null,
            onTouchesEnded: null,
            onTouchesCancelled: null,
            clone: function() {
                var t = new c();
                return t.onTouchesBegan = this.onTouchesBegan, t.onTouchesMoved = this.onTouchesMoved, 
                t.onTouchesEnded = this.onTouchesEnded, t.onTouchesCancelled = this.onTouchesCancelled, 
                t;
            },
            checkAvailable: function() {
                return null !== this.onTouchesBegan || null !== this.onTouchesMoved || null !== this.onTouchesEnded || null !== this.onTouchesCancelled || (cc.logID(1802), 
                !1);
            }
        });
        var h = function(t) {
            this._onAccelerationEvent = t, cc.EventListener.call(this, cc.EventListener.ACCELERATION, r.ACCELERATION, this._callback);
        };
        n.extend(h, cc.EventListener), n.mixin(h.prototype, {
            constructor: h,
            _onAccelerationEvent: null,
            _callback: function(t) {
                this._onAccelerationEvent(t.acc, t);
            },
            checkAvailable: function() {
                return cc.assertID(this._onAccelerationEvent, 1803), !0;
            },
            clone: function() {
                return new h(this._onAccelerationEvent);
            }
        });
        var l = function() {
            cc.EventListener.call(this, cc.EventListener.KEYBOARD, r.KEYBOARD, this._callback);
        };
        n.extend(l, cc.EventListener), n.mixin(l.prototype, {
            constructor: l,
            onKeyPressed: null,
            onKeyReleased: null,
            _callback: function(t) {
                t.isPressed ? this.onKeyPressed && this.onKeyPressed(t.keyCode, t) : this.onKeyReleased && this.onKeyReleased(t.keyCode, t);
            },
            clone: function() {
                var t = new l();
                return t.onKeyPressed = this.onKeyPressed, t.onKeyReleased = this.onKeyReleased, 
                t;
            },
            checkAvailable: function() {
                return null !== this.onKeyPressed || null !== this.onKeyReleased || (cc.logID(1800), 
                !1);
            }
        }), cc.EventListener.create = function(t) {
            cc.assertID(t && t.event, 1900);
            var e = t.event;
            delete t.event;
            var i = null;
            for (var n in e === cc.EventListener.TOUCH_ONE_BY_ONE ? i = new o() : e === cc.EventListener.TOUCH_ALL_AT_ONCE ? i = new c() : e === cc.EventListener.MOUSE ? i = new a() : e === cc.EventListener.CUSTOM ? (i = new s(t.eventName, t.callback), 
            delete t.eventName, delete t.callback) : e === cc.EventListener.KEYBOARD ? i = new l() : e === cc.EventListener.ACCELERATION && (i = new h(t.callback), 
            delete t.callback), t) i[n] = t[n];
            return i;
        }, e.exports = cc.EventListener;
    }, {
        "../platform/js": 102
    } ],
    46: [ function(t, e, i) {
        var n = t("../platform/js");
        t("./CCEventListener");
        var r = cc.EventListener.ListenerID, s = function() {
            this._fixedListeners = [], this._sceneGraphListeners = [], this.gt0Index = 0;
        };
        s.prototype = {
            constructor: s,
            size: function() {
                return this._fixedListeners.length + this._sceneGraphListeners.length;
            },
            empty: function() {
                return 0 === this._fixedListeners.length && 0 === this._sceneGraphListeners.length;
            },
            push: function(t) {
                0 === t._getFixedPriority() ? this._sceneGraphListeners.push(t) : this._fixedListeners.push(t);
            },
            clearSceneGraphListeners: function() {
                this._sceneGraphListeners.length = 0;
            },
            clearFixedListeners: function() {
                this._fixedListeners.length = 0;
            },
            clear: function() {
                this._sceneGraphListeners.length = 0, this._fixedListeners.length = 0;
            },
            getFixedPriorityListeners: function() {
                return this._fixedListeners;
            },
            getSceneGraphPriorityListeners: function() {
                return this._sceneGraphListeners;
            }
        };
        var a = {
            DIRTY_NONE: 0,
            DIRTY_FIXED_PRIORITY: 1,
            DIRTY_SCENE_GRAPH_PRIORITY: 2,
            DIRTY_ALL: 3,
            _listenersMap: {},
            _priorityDirtyFlagMap: {},
            _nodeListenersMap: {},
            _nodePriorityMap: n.createMap(!0),
            _globalZOrderNodeMap: [],
            _toAddedListeners: [],
            _toRemovedListeners: [],
            _dirtyNodes: [],
            _inDispatch: 0,
            _isEnabled: !1,
            _nodePriorityIndex: 0,
            _internalCustomListenerIDs: [],
            _setDirtyForNode: function(t) {
                if (void 0 !== this._nodeListenersMap[t._id] && this._dirtyNodes.push(t), t.getChildren) for (var e = t.getChildren(), i = 0, n = e ? e.length : 0; i < n; i++) this._setDirtyForNode(e[i]);
            },
            pauseTarget: function(t, e) {
                if (t instanceof cc._BaseNode) {
                    var i, n, r = this._nodeListenersMap[t._id];
                    if (r) for (i = 0, n = r.length; i < n; i++) r[i]._setPaused(!0);
                    if (!0 === e) {
                        var s = t.getChildren();
                        for (i = 0, n = s ? s.length : 0; i < n; i++) this.pauseTarget(s[i], !0);
                    }
                } else cc.warnID(3506);
            },
            resumeTarget: function(t, e) {
                if (t instanceof cc._BaseNode) {
                    var i, n, r = this._nodeListenersMap[t._id];
                    if (r) for (i = 0, n = r.length; i < n; i++) r[i]._setPaused(!1);
                    if (this._setDirtyForNode(t), !0 === e && t.getChildren) {
                        var s = t.getChildren();
                        for (i = 0, n = s ? s.length : 0; i < n; i++) this.resumeTarget(s[i], !0);
                    }
                } else cc.warnID(3506);
            },
            _addListener: function(t) {
                0 === this._inDispatch ? this._forceAddEventListener(t) : this._toAddedListeners.push(t);
            },
            _forceAddEventListener: function(t) {
                var e = t._getListenerID(), i = this._listenersMap[e];
                if (i || (i = new s(), this._listenersMap[e] = i), i.push(t), 0 === t._getFixedPriority()) {
                    this._setDirty(e, this.DIRTY_SCENE_GRAPH_PRIORITY);
                    var n = t._getSceneGraphPriority();
                    null === n && cc.logID(3507), this._associateNodeAndEventListener(n, t), n.activeInHierarchy && this.resumeTarget(n);
                } else this._setDirty(e, this.DIRTY_FIXED_PRIORITY);
            },
            _getListeners: function(t) {
                return this._listenersMap[t];
            },
            _updateDirtyFlagForSceneGraph: function() {
                if (0 !== this._dirtyNodes.length) {
                    for (var t, e, i = this._dirtyNodes, n = this._nodeListenersMap, r = 0, s = i.length; r < s; r++) if (t = n[i[r]._id]) for (var a = 0, o = t.length; a < o; a++) (e = t[a]) && this._setDirty(e._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
                    this._dirtyNodes.length = 0;
                }
            },
            _removeAllListenersInVector: function(t) {
                if (t) for (var e, i = 0; i < t.length; ) (e = t[i])._setRegistered(!1), null != e._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(e._getSceneGraphPriority(), e), 
                e._setSceneGraphPriority(null)), 0 === this._inDispatch ? cc.js.array.remove(t, e) : ++i;
            },
            _removeListenersForListenerID: function(t) {
                var e, i = this._listenersMap[t];
                if (i) {
                    var n = i.getFixedPriorityListeners(), r = i.getSceneGraphPriorityListeners();
                    this._removeAllListenersInVector(r), this._removeAllListenersInVector(n), delete this._priorityDirtyFlagMap[t], 
                    this._inDispatch || (i.clear(), delete this._listenersMap[t]);
                }
                var s, a = this._toAddedListeners;
                for (e = 0; e < a.length; ) (s = a[e]) && s._getListenerID() === t ? cc.js.array.remove(a, s) : ++e;
            },
            _sortEventListeners: function(t) {
                var e = this.DIRTY_NONE, i = this._priorityDirtyFlagMap;
                if (i[t] && (e = i[t]), e !== this.DIRTY_NONE && (i[t] = this.DIRTY_NONE, e & this.DIRTY_FIXED_PRIORITY && this._sortListenersOfFixedPriority(t), 
                e & this.DIRTY_SCENE_GRAPH_PRIORITY)) {
                    var n = cc.director.getScene();
                    n && this._sortListenersOfSceneGraphPriority(t, n);
                }
            },
            _sortListenersOfSceneGraphPriority: function(t, e) {
                var i = this._getListeners(t);
                if (i) {
                    var r = i.getSceneGraphPriorityListeners();
                    r && 0 !== r.length && (this._nodePriorityIndex = 0, this._nodePriorityMap = n.createMap(!0), 
                    this._visitTarget(e, !0), i.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes));
                }
            },
            _sortEventListenersOfSceneGraphPriorityDes: function(t, e) {
                var i = a._nodePriorityMap, n = t._getSceneGraphPriority(), r = e._getSceneGraphPriority();
                return e && r && i[r._id] ? t && n && i[n._id] ? i[r._id] - i[n._id] : 1 : -1;
            },
            _sortListenersOfFixedPriority: function(t) {
                var e = this._listenersMap[t];
                if (e) {
                    var i = e.getFixedPriorityListeners();
                    if (i && 0 !== i.length) {
                        i.sort(this._sortListenersOfFixedPriorityAsc);
                        for (var n = 0, r = i.length; n < r && !(i[n]._getFixedPriority() >= 0); ) ++n;
                        e.gt0Index = n;
                    }
                }
            },
            _sortListenersOfFixedPriorityAsc: function(t, e) {
                return t._getFixedPriority() - e._getFixedPriority();
            },
            _onUpdateListeners: function(t) {
                var e, i, n, r = t.getFixedPriorityListeners(), s = t.getSceneGraphPriorityListeners(), a = this._toRemovedListeners;
                if (s) for (e = 0; e < s.length; ) (i = s[e])._isRegistered() ? ++e : (cc.js.array.remove(s, i), 
                -1 !== (n = a.indexOf(i)) && a.splice(n, 1));
                if (r) for (e = 0; e < r.length; ) (i = r[e])._isRegistered() ? ++e : (cc.js.array.remove(r, i), 
                -1 !== (n = a.indexOf(i)) && a.splice(n, 1));
                s && 0 === s.length && t.clearSceneGraphListeners(), r && 0 === r.length && t.clearFixedListeners();
            },
            frameUpdateListeners: function() {
                var t = this._listenersMap, e = this._priorityDirtyFlagMap;
                for (var i in t) t[i].empty() && (delete e[i], delete t[i]);
                var n = this._toAddedListeners;
                if (0 !== n.length) {
                    for (var r = 0, s = n.length; r < s; r++) this._forceAddEventListener(n[r]);
                    n.length = 0;
                }
                0 !== this._toRemovedListeners.length && this._cleanToRemovedListeners();
            },
            _updateTouchListeners: function(t) {
                var e = this._inDispatch;
                if (cc.assertID(e > 0, 3508), !(e > 1)) {
                    var i;
                    (i = this._listenersMap[r.TOUCH_ONE_BY_ONE]) && this._onUpdateListeners(i), (i = this._listenersMap[r.TOUCH_ALL_AT_ONCE]) && this._onUpdateListeners(i), 
                    cc.assertID(1 === e, 3509);
                    var n = this._toAddedListeners;
                    if (0 !== n.length) {
                        for (var s = 0, a = n.length; s < a; s++) this._forceAddEventListener(n[s]);
                        this._toAddedListeners.length = 0;
                    }
                    0 !== this._toRemovedListeners.length && this._cleanToRemovedListeners();
                }
            },
            _cleanToRemovedListeners: function() {
                for (var t = this._toRemovedListeners, e = 0; e < t.length; e++) {
                    var i = t[e], n = this._listenersMap[i._getListenerID()];
                    if (n) {
                        var r, s = n.getFixedPriorityListeners(), a = n.getSceneGraphPriorityListeners();
                        a && -1 !== (r = a.indexOf(i)) && a.splice(r, 1), s && -1 !== (r = s.indexOf(i)) && s.splice(r, 1);
                    }
                }
                t.length = 0;
            },
            _onTouchEventCallback: function(t, e) {
                if (!t._isRegistered()) return !1;
                var i = e.event, n = i.currentTouch;
                i.currentTarget = t._node;
                var r, s = !1, o = i.getEventCode(), c = cc.Event.EventTouch;
                return o === c.BEGAN ? t.onTouchBegan && (s = t.onTouchBegan(n, i)) && t._registered && t._claimedTouches.push(n) : t._claimedTouches.length > 0 && -1 !== (r = t._claimedTouches.indexOf(n)) && (s = !0, 
                o === c.MOVED && t.onTouchMoved ? t.onTouchMoved(n, i) : o === c.ENDED ? (t.onTouchEnded && t.onTouchEnded(n, i), 
                t._registered && t._claimedTouches.splice(r, 1)) : o === c.CANCELLED && (t.onTouchCancelled && t.onTouchCancelled(n, i), 
                t._registered && t._claimedTouches.splice(r, 1))), i.isStopped() ? (a._updateTouchListeners(i), 
                !0) : !(!s || !t.swallowTouches) && (e.needsMutableSet && e.touches.splice(n, 1), 
                !0);
            },
            _dispatchTouchEvent: function(t) {
                this._sortEventListeners(r.TOUCH_ONE_BY_ONE), this._sortEventListeners(r.TOUCH_ALL_AT_ONCE);
                var e = this._getListeners(r.TOUCH_ONE_BY_ONE), i = this._getListeners(r.TOUCH_ALL_AT_ONCE);
                if (null !== e || null !== i) {
                    var n = t.getTouches(), s = cc.js.array.copy(n), a = {
                        event: t,
                        needsMutableSet: e && i,
                        touches: s,
                        selTouch: null
                    };
                    if (e) for (var o = 0; o < n.length; o++) t.currentTouch = n[o], t._propagationStopped = t._propagationImmediateStopped = !1, 
                    this._dispatchEventToListeners(e, this._onTouchEventCallback, a);
                    i && s.length > 0 && (this._dispatchEventToListeners(i, this._onTouchesEventCallback, {
                        event: t,
                        touches: s
                    }), t.isStopped()) || this._updateTouchListeners(t);
                }
            },
            _onTouchesEventCallback: function(t, e) {
                if (!t._registered) return !1;
                var i = cc.Event.EventTouch, n = e.event, r = e.touches, s = n.getEventCode();
                return n.currentTarget = t._node, s === i.BEGAN && t.onTouchesBegan ? t.onTouchesBegan(r, n) : s === i.MOVED && t.onTouchesMoved ? t.onTouchesMoved(r, n) : s === i.ENDED && t.onTouchesEnded ? t.onTouchesEnded(r, n) : s === i.CANCELLED && t.onTouchesCancelled && t.onTouchesCancelled(r, n), 
                !!n.isStopped() && (a._updateTouchListeners(n), !0);
            },
            _associateNodeAndEventListener: function(t, e) {
                var i = this._nodeListenersMap[t._id];
                i || (i = [], this._nodeListenersMap[t._id] = i), i.push(e);
            },
            _dissociateNodeAndEventListener: function(t, e) {
                var i = this._nodeListenersMap[t._id];
                i && (cc.js.array.remove(i, e), 0 === i.length && delete this._nodeListenersMap[t._id]);
            },
            _dispatchEventToListeners: function(t, e, i) {
                var n, r, s = !1, a = t.getFixedPriorityListeners(), o = t.getSceneGraphPriorityListeners(), c = 0;
                if (a && 0 !== a.length) for (;c < t.gt0Index; ++c) if ((r = a[c]).isEnabled() && !r._isPaused() && r._isRegistered() && e(r, i)) {
                    s = !0;
                    break;
                }
                if (o && !s) for (n = 0; n < o.length; n++) if ((r = o[n]).isEnabled() && !r._isPaused() && r._isRegistered() && e(r, i)) {
                    s = !0;
                    break;
                }
                if (a && !s) for (;c < a.length; ++c) if ((r = a[c]).isEnabled() && !r._isPaused() && r._isRegistered() && e(r, i)) {
                    s = !0;
                    break;
                }
            },
            _setDirty: function(t, e) {
                var i = this._priorityDirtyFlagMap;
                null == i[t] ? i[t] = e : i[t] = e | i[t];
            },
            _visitTarget: function(t, e) {
                t._reorderChildDirty && t.sortAllChildren();
                var i, n = t.getChildren(), r = 0, s = n.length, a = this._globalZOrderNodeMap, o = this._nodeListenersMap;
                if (s > 0) for (void 0 !== o[t._id] && (a || (a = []), a.push(t._id)); r < s; r++) (i = n[r]) && this._visitTarget(i, !1); else void 0 !== o[t._id] && (a || (a = []), 
                a.push(t._id));
                if (e) {
                    for (var c = this._nodePriorityMap, h = 0; h < a.length; h++) c[a[h]] = ++this._nodePriorityIndex;
                    this._globalZOrderNodeMap.length = 0;
                }
            },
            _sortNumberAsc: function(t, e) {
                return t - e;
            },
            hasEventListener: function(t) {
                return !!this._getListeners(t);
            },
            addListener: function(t, e) {
                if (cc.assertID(t && e, 3503), cc.js.isNumber(e) || e instanceof cc._BaseNode) {
                    if (t instanceof cc.EventListener) {
                        if (t._isRegistered()) return void cc.logID(3505);
                    } else cc.assertID(!cc.js.isNumber(e), 3504), t = cc.EventListener.create(t);
                    if (t.checkAvailable()) {
                        if (cc.js.isNumber(e)) {
                            if (0 === e) return void cc.logID(3500);
                            t._setSceneGraphPriority(null), t._setFixedPriority(e), t._setRegistered(!0), t._setPaused(!1), 
                            this._addListener(t);
                        } else t._setSceneGraphPriority(e), t._setFixedPriority(0), t._setRegistered(!0), 
                        this._addListener(t);
                        return t;
                    }
                } else cc.warnID(3506);
            },
            addCustomListener: function(t, e) {
                var i = new cc.EventListener.create({
                    event: cc.EventListener.CUSTOM,
                    eventName: t,
                    callback: e
                });
                return this.addListener(i, 1), i;
            },
            removeListener: function(t) {
                if (null != t) {
                    var e, i = this._listenersMap;
                    for (var n in i) {
                        var r = i[n], s = r.getFixedPriorityListeners(), a = r.getSceneGraphPriorityListeners();
                        if ((e = this._removeListenerInVector(a, t)) ? this._setDirty(t._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY) : (e = this._removeListenerInVector(s, t)) && this._setDirty(t._getListenerID(), this.DIRTY_FIXED_PRIORITY), 
                        r.empty() && (delete this._priorityDirtyFlagMap[t._getListenerID()], delete i[n]), 
                        e) break;
                    }
                    if (!e) for (var o = this._toAddedListeners, c = 0, h = o.length; c < h; c++) {
                        var l = o[c];
                        if (l === t) {
                            cc.js.array.remove(o, l), l._setRegistered(!1);
                            break;
                        }
                    }
                }
            },
            _removeListenerInCallback: function(t, e) {
                if (null == t) return !1;
                for (var i = 0, n = t.length; i < n; i++) {
                    var r = t[i];
                    if (r._onCustomEvent === e || r._onEvent === e) return r._setRegistered(!1), null != r._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(r._getSceneGraphPriority(), r), 
                    r._setSceneGraphPriority(null)), 0 === this._inDispatch ? cc.js.array.remove(t, r) : this._toRemovedListeners.push(r), 
                    !0;
                }
                return !1;
            },
            _removeListenerInVector: function(t, e) {
                if (null == t) return !1;
                for (var i = 0, n = t.length; i < n; i++) {
                    var r = t[i];
                    if (r === e) return r._setRegistered(!1), null != r._getSceneGraphPriority() && (this._dissociateNodeAndEventListener(r._getSceneGraphPriority(), r), 
                    r._setSceneGraphPriority(null)), 0 === this._inDispatch ? cc.js.array.remove(t, r) : this._toRemovedListeners.push(r), 
                    !0;
                }
                return !1;
            },
            removeListeners: function(t, e) {
                var i = this;
                if (cc.js.isNumber(t) || t instanceof cc._BaseNode) if (void 0 !== t._id) {
                    delete i._nodePriorityMap[t._id], cc.js.array.remove(i._dirtyNodes, t);
                    var n, s = i._nodeListenersMap[t._id];
                    if (s) {
                        var a = cc.js.array.copy(s);
                        for (n = 0; n < a.length; n++) i.removeListener(a[n]);
                        delete i._nodeListenersMap[t._id];
                    }
                    var o = i._toAddedListeners;
                    for (n = 0; n < o.length; ) {
                        var c = o[n];
                        c._getSceneGraphPriority() === t ? (c._setSceneGraphPriority(null), c._setRegistered(!1), 
                        o.splice(n, 1)) : ++n;
                    }
                    if (!0 === e) {
                        var h, l = t.getChildren();
                        for (n = 0, h = l.length; n < h; n++) i.removeListeners(l[n], !0);
                    }
                } else t === cc.EventListener.TOUCH_ONE_BY_ONE ? i._removeListenersForListenerID(r.TOUCH_ONE_BY_ONE) : t === cc.EventListener.TOUCH_ALL_AT_ONCE ? i._removeListenersForListenerID(r.TOUCH_ALL_AT_ONCE) : t === cc.EventListener.MOUSE ? i._removeListenersForListenerID(r.MOUSE) : t === cc.EventListener.ACCELERATION ? i._removeListenersForListenerID(r.ACCELERATION) : t === cc.EventListener.KEYBOARD ? i._removeListenersForListenerID(r.KEYBOARD) : cc.logID(3501); else cc.warnID(3506);
            },
            removeCustomListeners: function(t) {
                this._removeListenersForListenerID(t);
            },
            removeAllListeners: function() {
                var t = this._listenersMap, e = this._internalCustomListenerIDs;
                for (var i in t) -1 === e.indexOf(i) && this._removeListenersForListenerID(i);
            },
            setPriority: function(t, e) {
                if (null != t) {
                    var i = this._listenersMap;
                    for (var n in i) {
                        var r = i[n].getFixedPriorityListeners();
                        if (r) if (-1 !== r.indexOf(t)) return null != t._getSceneGraphPriority() && cc.logID(3502), 
                        void (t._getFixedPriority() !== e && (t._setFixedPriority(e), this._setDirty(t._getListenerID(), this.DIRTY_FIXED_PRIORITY)));
                    }
                }
            },
            setEnabled: function(t) {
                this._isEnabled = t;
            },
            isEnabled: function() {
                return this._isEnabled;
            },
            dispatchEvent: function(t) {
                if (this._isEnabled) if (this._updateDirtyFlagForSceneGraph(), this._inDispatch++, 
                t && t.getType) {
                    if (t.getType().startsWith(cc.Event.TOUCH)) return this._dispatchTouchEvent(t), 
                    void this._inDispatch--;
                    var e = function(t) {
                        var e = cc.Event, i = t.type;
                        return i === e.ACCELERATION ? r.ACCELERATION : i === e.KEYBOARD ? r.KEYBOARD : i.startsWith(e.MOUSE) ? r.MOUSE : (i.startsWith(e.TOUCH) && cc.logID(2e3), 
                        "");
                    }(t);
                    this._sortEventListeners(e);
                    var i = this._listenersMap[e];
                    null != i && (this._dispatchEventToListeners(i, this._onListenerCallback, t), this._onUpdateListeners(i)), 
                    this._inDispatch--;
                } else cc.errorID(3511);
            },
            _onListenerCallback: function(t, e) {
                return e.currentTarget = t._target, t._onEvent(e), e.isStopped();
            },
            dispatchCustomEvent: function(t, e) {
                var i = new cc.Event.EventCustom(t);
                i.setUserData(e), this.dispatchEvent(i);
            }
        };
        n.get(cc, "eventManager", function() {
            return cc.warnID(1405, "cc.eventManager", "cc.EventTarget or cc.systemEvent"), a;
        }), e.exports = a;
    }, {
        "../platform/js": 102,
        "./CCEventListener": 45
    } ],
    47: [ function(t, e, i) {
        cc.Touch = function(t, e, i) {
            this._lastModified = 0, this.setTouchInfo(i, t, e);
        }, cc.Touch.prototype = {
            constructor: cc.Touch,
            getLocation: function() {
                return cc.v2(this._point.x, this._point.y);
            },
            getLocationX: function() {
                return this._point.x;
            },
            getLocationY: function() {
                return this._point.y;
            },
            getPreviousLocation: function() {
                return cc.v2(this._prevPoint.x, this._prevPoint.y);
            },
            getStartLocation: function() {
                return cc.v2(this._startPoint.x, this._startPoint.y);
            },
            getDelta: function() {
                return this._point.sub(this._prevPoint);
            },
            getLocationInView: function() {
                return cc.v2(this._point.x, cc.view._designResolutionSize.height - this._point.y);
            },
            getPreviousLocationInView: function() {
                return cc.v2(this._prevPoint.x, cc.view._designResolutionSize.height - this._prevPoint.y);
            },
            getStartLocationInView: function() {
                return cc.v2(this._startPoint.x, cc.view._designResolutionSize.height - this._startPoint.y);
            },
            getID: function() {
                return this._id;
            },
            setTouchInfo: function(t, e, i) {
                this._prevPoint = this._point, this._point = cc.v2(e || 0, i || 0), this._id = t, 
                this._startPointCaptured || (this._startPoint = cc.v2(this._point), cc.view._convertPointWithScale(this._startPoint), 
                this._startPointCaptured = !0);
            },
            _setPoint: function(t, e) {
                void 0 === e ? (this._point.x = t.x, this._point.y = t.y) : (this._point.x = t, 
                this._point.y = e);
            },
            _setPrevPoint: function(t, e) {
                this._prevPoint = void 0 === e ? cc.v2(t.x, t.y) : cc.v2(t || 0, e || 0);
            }
        };
    }, {} ],
    48: [ function(t, e, i) {
        t("./CCEvent"), t("./CCTouch"), t("./CCEventListener");
        var n = t("./CCEventManager");
        e.exports = n;
    }, {
        "./CCEvent": 44,
        "./CCEventListener": 45,
        "./CCEventManager": 46,
        "./CCTouch": 47
    } ],
    49: [ function(t, e, i) {
        var n = cc.js, r = t("../platform/callbacks-invoker").CallbacksHandler;
        function s() {
            r.call(this);
        }
        n.extend(s, r), s.prototype.invoke = function(t, e) {
            var i = t.type, n = this._callbackTable[i];
            if (n) {
                var r = !n.isInvoking;
                n.isInvoking = !0;
                for (var s = n.callbacks, a = n.targets, o = 0, c = s.length; o < c; ++o) {
                    var h = s[o];
                    if (h) {
                        var l = a[o] || t.currentTarget;
                        if (h.call(l, t, e), t._propagationImmediateStopped) break;
                    }
                }
                r && (n.isInvoking = !1, n.containCanceled && n.purgeCanceled());
            }
        }, e.exports = s;
    }, {
        "../platform/callbacks-invoker": 95
    } ],
    50: [ function(t, e, i) {
        var n = t("../platform/js"), r = t("../platform/callbacks-invoker"), s = n.array.fastRemove;
        function a() {
            r.call(this);
        }
        n.extend(a, r);
        var o = a.prototype;
        o.on = function(t, e, i) {
            if (e) return this.hasEventListener(t, e, i) || (this.add(t, e, i), i && i.__eventTargets && i.__eventTargets.push(this)), 
            e;
            cc.errorID(6800);
        }, o.off = function(t, e, i) {
            e ? (this.remove(t, e, i), i && i.__eventTargets && s(i.__eventTargets, this)) : this.removeAll(t);
        }, o.targetOff = o.removeAll, o.once = function(t, e, i) {
            var n = "__ONCE_FLAG:" + t;
            if (!this.hasEventListener(n, e, i)) {
                var r = this, s = function(a, o, c, h, l) {
                    r.off(t, s, i), r.remove(n, e, i), e.call(this, a, o, c, h, l);
                };
                this.on(t, s, i), this.add(n, e, i);
            }
        }, o.emit = r.prototype.invoke, o.dispatchEvent = function(t) {
            this.invoke(t.type, t);
        }, cc.EventTarget = e.exports = a;
    }, {
        "../platform/callbacks-invoker": 95,
        "../platform/js": 102
    } ],
    51: [ function(t, e, i) {
        var n = t("../platform/js");
        cc.Event = function(t, e) {
            this.type = t, this.bubbles = !!e, this.target = null, this.currentTarget = null, 
            this.eventPhase = 0, this._propagationStopped = !1, this._propagationImmediateStopped = !1;
        }, cc.Event.prototype = {
            constructor: cc.Event,
            unuse: function() {
                this.type = cc.Event.NO_TYPE, this.target = null, this.currentTarget = null, this.eventPhase = cc.Event.NONE, 
                this._propagationStopped = !1, this._propagationImmediateStopped = !1;
            },
            reuse: function(t, e) {
                this.type = t, this.bubbles = e || !1;
            },
            stopPropagation: function() {
                this._propagationStopped = !0;
            },
            stopPropagationImmediate: function() {
                this._propagationImmediateStopped = !0;
            },
            isStopped: function() {
                return this._propagationStopped || this._propagationImmediateStopped;
            },
            getCurrentTarget: function() {
                return this.currentTarget;
            },
            getType: function() {
                return this.type;
            }
        }, cc.Event.NO_TYPE = "no_type", cc.Event.TOUCH = "touch", cc.Event.MOUSE = "mouse", 
        cc.Event.KEYBOARD = "keyboard", cc.Event.ACCELERATION = "acceleration", cc.Event.NONE = 0, 
        cc.Event.CAPTURING_PHASE = 1, cc.Event.AT_TARGET = 2, cc.Event.BUBBLING_PHASE = 3;
        var r = function(t, e) {
            cc.Event.call(this, t, e), this.detail = null;
        };
        n.extend(r, cc.Event), r.prototype.reset = r, r.prototype.setUserData = function(t) {
            this.detail = t;
        }, r.prototype.getUserData = function() {
            return this.detail;
        }, r.prototype.getEventName = cc.Event.prototype.getType;
        var s = new n.Pool(10);
        r.put = function(t) {
            s.put(t);
        }, r.get = function(t, e) {
            var i = s._get();
            return i ? i.reset(t, e) : i = new r(t, e), i;
        }, cc.Event.EventCustom = r, e.exports = cc.Event;
    }, {
        "../platform/js": 102
    } ],
    52: [ function(t, e, i) {
        t("./event"), t("./event-listeners"), t("./event-target"), t("./system-event");
    }, {
        "./event": 51,
        "./event-listeners": 49,
        "./event-target": 50,
        "./system-event": 53
    } ],
    53: [ function(t, e, i) {
        var n = t("../event/event-target"), r = t("../event-manager"), s = t("../platform/CCInputManager"), a = cc.Enum({
            KEY_DOWN: "keydown",
            KEY_UP: "keyup",
            DEVICEMOTION: "devicemotion"
        }), o = null, c = null, h = cc.Class({
            name: "SystemEvent",
            extends: n,
            statics: {
                EventType: a
            },
            setAccelerometerEnabled: function(t) {
                s.setAccelerometerEnabled(t);
            },
            setAccelerometerInterval: function(t) {
                s.setAccelerometerInterval(t);
            },
            on: function(t, e, i) {
                this._super(t, e, i), t !== a.KEY_DOWN && t !== a.KEY_UP || (o || (o = cc.EventListener.create({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function(t, e) {
                        e.type = a.KEY_DOWN, cc.systemEvent.dispatchEvent(e);
                    },
                    onKeyReleased: function(t, e) {
                        e.type = a.KEY_UP, cc.systemEvent.dispatchEvent(e);
                    }
                })), r.hasEventListener(cc.EventListener.ListenerID.KEYBOARD) || r.addListener(o, 1)), 
                t === a.DEVICEMOTION && (c || (c = cc.EventListener.create({
                    event: cc.EventListener.ACCELERATION,
                    callback: function(t, e) {
                        e.type = a.DEVICEMOTION, cc.systemEvent.dispatchEvent(e);
                    }
                })), r.hasEventListener(cc.EventListener.ListenerID.ACCELERATION) || r.addListener(c, 1));
            },
            off: function(t, e, i) {
                if (this._super(t, e, i), o && (t === a.KEY_DOWN || t === a.KEY_UP)) {
                    var n = this.hasEventListener(a.KEY_DOWN), s = this.hasEventListener(a.KEY_UP);
                    n || s || r.removeListener(o);
                }
                c && t === a.DEVICEMOTION && r.removeListener(c);
            }
        });
        cc.SystemEvent = e.exports = h, cc.systemEvent = new cc.SystemEvent();
    }, {
        "../event-manager": 48,
        "../event/event-target": 50,
        "../platform/CCInputManager": 86
    } ],
    54: [ function(t, e, i) {
        var n = t("../components/CCRenderComponent"), r = t("../renderer/render-engine").SpriteMaterial, s = t("./types"), a = s.LineCap, o = s.LineJoin, c = cc.Class({
            name: "cc.Graphics",
            extends: n,
            editor: !1,
            ctor: function() {
                this._impl = c._assembler.createImpl(this);
            },
            properties: {
                _lineWidth: 1,
                _strokeColor: cc.Color.BLACK,
                _lineJoin: o.MITER,
                _lineCap: a.BUTT,
                _fillColor: cc.Color.WHITE,
                _miterLimit: 10,
                lineWidth: {
                    get: function() {
                        return this._lineWidth;
                    },
                    set: function(t) {
                        this._lineWidth = t, this._impl.lineWidth = t;
                    }
                },
                lineJoin: {
                    get: function() {
                        return this._lineJoin;
                    },
                    set: function(t) {
                        this._lineJoin = t, this._impl.lineJoin = t;
                    },
                    type: o
                },
                lineCap: {
                    get: function() {
                        return this._lineCap;
                    },
                    set: function(t) {
                        this._lineCap = t, this._impl.lineCap = t;
                    },
                    type: a
                },
                strokeColor: {
                    get: function() {
                        return this._strokeColor;
                    },
                    set: function(t) {
                        this._impl.strokeColor = this._strokeColor = cc.color(t);
                    }
                },
                fillColor: {
                    get: function() {
                        return this._fillColor;
                    },
                    set: function(t) {
                        this._impl.fillColor = this._fillColor = cc.color(t);
                    }
                },
                miterLimit: {
                    get: function() {
                        return this._miterLimit;
                    },
                    set: function(t) {
                        this._miterLimit = t, this._impl.miterLimit = t;
                    }
                }
            },
            statics: {
                LineJoin: o,
                LineCap: a
            },
            onRestore: function() {
                this._impl || (this._impl = c._assembler.createImpl());
            },
            onEnable: function() {
                this._super(), this._activateMaterial();
            },
            onDestroy: function() {
                this._super(), this._impl.clear(this, !0), this._impl = null;
            },
            _activateMaterial: function() {
                if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS && (this.node._renderFlag &= ~cc.RenderFlow.FLAG_RENDER, 
                this.node._renderFlag |= cc.RenderFlow.FLAG_CUSTOM_IA_RENDER, !this._material)) {
                    var t = new r();
                    t.useColor = !1, t.useTexture = !1, t.useModel = !0, this._updateMaterial(t);
                }
            },
            moveTo: function(t, e) {
                this._impl.moveTo(t, e);
            },
            lineTo: function(t, e) {
                this._impl.lineTo(t, e);
            },
            bezierCurveTo: function(t, e, i, n, r, s) {
                this._impl.bezierCurveTo(t, e, i, n, r, s);
            },
            quadraticCurveTo: function(t, e, i, n) {
                this._impl.quadraticCurveTo(t, e, i, n);
            },
            arc: function(t, e, i, n, r, s) {
                this._impl.arc(t, e, i, n, r, s);
            },
            ellipse: function(t, e, i, n) {
                this._impl.ellipse(t, e, i, n);
            },
            circle: function(t, e, i) {
                this._impl.circle(t, e, i);
            },
            rect: function(t, e, i, n) {
                this._impl.rect(t, e, i, n);
            },
            roundRect: function(t, e, i, n, r) {
                this._impl.roundRect(t, e, i, n, r);
            },
            fillRect: function(t, e, i, n) {
                this.rect(t, e, i, n), this.fill();
            },
            clear: function(t) {
                this._impl.clear(this, t);
            },
            close: function() {
                this._impl.close();
            },
            stroke: function() {
                c._assembler.stroke(this);
            },
            fill: function() {
                c._assembler.fill(this);
            }
        });
        cc.Graphics = e.exports = c;
    }, {
        "../components/CCRenderComponent": 35,
        "../renderer/render-engine": 124,
        "./types": 57
    } ],
    55: [ function(t, e, i) {
        var n = t("./types").PointFlags, r = Math.PI, s = Math.min, a = Math.max, o = Math.cos, c = Math.sin, h = Math.abs, l = Math.sign, u = .5522847493;
        e.exports = {
            arc: function(t, e, i, n, l, u, _) {
                var d, f, p, m = 0, v = 0, g = 0, y = 0, x = 0, E = 0, T = 0, C = 0, A = 0, b = 0, w = 0, D = 0, S = 0;
                if (v = u - l, _ = _ || !1) if (h(v) >= 2 * r) v = 2 * r; else for (;v < 0; ) v += 2 * r; else if (h(v) >= 2 * r) v = 2 * -r; else for (;v > 0; ) v -= 2 * r;
                for (p = 0 | a(1, s(h(v) / (.5 * r) + .5, 5)), g = h(4 / 3 * (1 - o(d = v / p / 2)) / c(d)), 
                _ || (g = -g), f = 0; f <= p; f++) E = e + (y = o(m = l + v * (f / p))) * n, T = i + (x = c(m)) * n, 
                C = -x * n * g, A = y * n * g, 0 === f ? t.moveTo(E, T) : t.bezierCurveTo(b + D, w + S, E - C, T - A, E, T), 
                b = E, w = T, D = C, S = A;
            },
            ellipse: function(t, e, i, n, r) {
                t.moveTo(e - n, i), t.bezierCurveTo(e - n, i + r * u, e - n * u, i + r, e, i + r), 
                t.bezierCurveTo(e + n * u, i + r, e + n, i + r * u, e + n, i), t.bezierCurveTo(e + n, i - r * u, e + n * u, i - r, e, i - r), 
                t.bezierCurveTo(e - n * u, i - r, e - n, i - r * u, e - n, i), t.close();
            },
            roundRect: function(t, e, i, n, r, a) {
                if (a < .1) t.rect(e, i, n, r); else {
                    var o = s(a, .5 * h(n)) * l(n), c = s(a, .5 * h(r)) * l(r);
                    t.moveTo(e, i + c), t.lineTo(e, i + r - c), t.bezierCurveTo(e, i + r - c * (1 - u), e + o * (1 - u), i + r, e + o, i + r), 
                    t.lineTo(e + n - o, i + r), t.bezierCurveTo(e + n - o * (1 - u), i + r, e + n, i + r - c * (1 - u), e + n, i + r - c), 
                    t.lineTo(e + n, i + c), t.bezierCurveTo(e + n, i + c * (1 - u), e + n - o * (1 - u), i, e + n - o, i), 
                    t.lineTo(e + o, i), t.bezierCurveTo(e + o * (1 - u), i, e, i + c * (1 - u), e, i + c), 
                    t.close();
                }
            },
            tesselateBezier: function t(e, i, r, s, a, o, c, l, u, _, d) {
                var f, p, m, v, g, y, x, E, T, C, A, b, w, D, S, R;
                _ > 10 || (g = .5 * (o + l), y = .5 * (c + u), x = .5 * ((f = .5 * (i + s)) + (m = .5 * (s + o))), 
                E = .5 * ((p = .5 * (r + a)) + (v = .5 * (a + c))), ((S = h((s - l) * (D = u - r) - (a - u) * (w = l - i))) + (R = h((o - l) * D - (c - u) * w))) * (S + R) < e._tessTol * (w * w + D * D) ? e._addPoint(l, u, 0 === d ? d | n.PT_BEVEL : d) : (t(e, i, r, f, p, x, E, A = .5 * (x + (T = .5 * (m + g))), b = .5 * (E + (C = .5 * (v + y))), _ + 1, 0), 
                t(e, A, b, T, C, g, y, l, u, _ + 1, d)));
            }
        };
    }, {
        "./types": 57
    } ],
    56: [ function(t, e, i) {
        "use strict";
        t("./graphics");
    }, {
        "./graphics": 54
    } ],
    57: [ function(t, e, i) {
        "use strict";
        var n = cc.Enum({
            BUTT: 0,
            ROUND: 1,
            SQUARE: 2
        }), r = cc.Enum({
            BEVEL: 0,
            ROUND: 1,
            MITER: 2
        }), s = cc.Enum({
            PT_CORNER: 1,
            PT_LEFT: 2,
            PT_BEVEL: 4,
            PT_INNERBEVEL: 8
        });
        e.exports = {
            LineCap: n,
            LineJoin: r,
            PointFlags: s
        };
    }, {} ],
    58: [ function(t, e, i) {
        t("./platform"), t("./assets"), t("./CCNode"), t("./CCPrivateNode"), t("./CCScene"), 
        t("./components"), t("./graphics"), t("./collider"), t("./collider/CCIntersection"), 
        t("./physics"), t("./camera/CCCamera"), t("./utils/polyfill-3d"), t("./base-ui/CCWidgetManager");
    }, {
        "./CCNode": 4,
        "./CCPrivateNode": 5,
        "./CCScene": 6,
        "./assets": 24,
        "./base-ui/CCWidgetManager": 25,
        "./camera/CCCamera": 26,
        "./collider": void 0,
        "./collider/CCIntersection": void 0,
        "./components": 42,
        "./graphics": 56,
        "./physics": void 0,
        "./platform": 99,
        "./utils/polyfill-3d": 161
    } ],
    59: [ function(t, e, i) {
        var n = t("../platform/js"), r = t("./pipeline"), s = t("./loading-items"), a = t("./asset-loader"), o = t("./downloader"), c = t("./loader"), h = t("./asset-table"), l = t("../platform/utils").callInNextTick, u = t("./auto-release-utils"), _ = new h();
        var d = {
            url: null,
            raw: !1
        };
        function f(t) {
            var e, i, n;
            if ("object" == typeof t) {
                if (i = t, t.url) return i;
                e = t.uuid;
            } else i = {}, e = t;
            return n = i.type ? "uuid" === i.type : cc.AssetLibrary._uuidInSettings(e), cc.AssetLibrary._getAssetInfoInRuntime(e, d), 
            i.url = n ? d.url : e, d.url && "uuid" === i.type && d.raw ? (i.type = null, i.isRawAsset = !0) : n || (i.isRawAsset = !0), 
            i;
        }
        var p = [], m = [];
        function v() {
            var t = new a(), e = new o(), i = new c();
            r.call(this, [ t, e, i ]), this.assetLoader = t, this.md5Pipe = null, this.downloader = e, 
            this.loader = i, this.onProgress = null, this._autoReleaseSetting = n.createMap(!0);
        }
        n.extend(v, r);
        var g = v.prototype;
        g.init = function(t) {}, g.getXMLHttpRequest = function() {
            return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
        }, g.addDownloadHandlers = function(t) {
            this.downloader.addHandlers(t);
        }, g.addLoadHandlers = function(t) {
            this.loader.addHandlers(t);
        }, g.load = function(t, e, i) {
            void 0 === i && (i = e, e = this.onProgress || null);
            var n, r = this, a = !1;
            t instanceof Array || (t ? (a = !0, t = [ t ]) : t = []), p.length = 0;
            for (var o = 0; o < t.length; ++o) {
                var c = t[o];
                if (c && c.id && (cc.warnID(4920, c.id), c.uuid || c.url || (c.url = c.id)), (n = f(c)).url || n.uuid) {
                    var h = this._cache[n.url];
                    p.push(h || n);
                }
            }
            var u = s.create(this, e, function(t, e) {
                l(function() {
                    if (i) {
                        if (a) {
                            var s = n.url;
                            i.call(r, t, e.getContent(s));
                        } else i.call(r, t, e);
                        i = null;
                    }
                    e.destroy();
                });
            });
            s.initQueueDeps(u), u.append(p), p.length = 0;
        }, g.flowInDeps = function(t, e, i) {
            m.length = 0;
            for (var n = 0; n < e.length; ++n) {
                var r = f(e[n]);
                if (r.url || r.uuid) {
                    var a = this._cache[r.url];
                    a ? m.push(a) : m.push(r);
                }
            }
            var o = s.create(this, t ? function(t, e, i) {
                this._ownerQueue && this._ownerQueue.onProgress && this._ownerQueue._childOnProgress(i);
            } : null, function(e, n) {
                i(e, n), t && t.deps && (t.deps.length = 0), n.destroy();
            });
            if (t) {
                var c = s.getQueue(t);
                o._ownerQueue = c._ownerQueue || c;
            }
            var h = o.append(m, t);
            return m.length = 0, h;
        }, g._resources = _, g._getResUuid = function(t, e, i) {
            if (!t) return null;
            var n = t.indexOf("?");
            -1 !== n && (t = t.substr(0, n));
            var r = _.getUuid(t, e);
            if (!r) {
                var s = cc.path.extname(t);
                s && (t = t.slice(0, -s.length), (r = _.getUuid(t, e)) && !i && cc.warnID(4901, t, s));
            }
            return r;
        }, g._getReferenceKey = function(t) {
            var e;
            return "object" == typeof t ? e = t._uuid || null : "string" == typeof t && (e = this._getResUuid(t, null, !0) || t), 
            e ? (cc.AssetLibrary._getAssetInfoInRuntime(e, d), this._cache[d.url] ? d.url : e) : (cc.warnID(4800, t), 
            e);
        }, g._urlNotFound = function(t, e, i) {
            l(function() {
                t = cc.url.normalize(t);
                var r = (e ? n.getClassName(e) : "Asset") + ' in "resources/' + t + '" does not exist.';
                i && i(new Error(r), []);
            });
        }, g._parseLoadResArgs = function(t, e, i) {
            if (void 0 === i) {
                var r = t instanceof Array || n.isChildClassOf(t, cc.RawAsset);
                e ? (i = e, r && (e = this.onProgress || null)) : void 0 !== e || r || (i = t, e = this.onProgress || null, 
                t = null), void 0 === e || r || (e = t, t = null);
            }
            return {
                type: t,
                onProgress: e,
                onComplete: i
            };
        }, g.loadRes = function(t, e, i, n) {
            var r = this._parseLoadResArgs(e, i, n);
            e = r.type, i = r.onProgress, n = r.onComplete;
            var s = this, a = s._getResUuid(t, e);
            a ? this.load({
                type: "uuid",
                uuid: a
            }, i, function(t, e) {
                e && s.setAutoReleaseRecursively(a, !1), n && n(t, e);
            }) : s._urlNotFound(t, e, n);
        }, g._loadResUuids = function(t, e, i, n) {
            if (t.length > 0) {
                var r = this, s = t.map(function(t) {
                    return {
                        type: "uuid",
                        uuid: t
                    };
                });
                this.load(s, e, function(t, e) {
                    if (i) {
                        for (var a = [], o = n && [], c = 0; c < s.length; ++c) {
                            var h = s[c].uuid, l = this._getReferenceKey(h), u = e.getContent(l);
                            u && (r.setAutoReleaseRecursively(h, !1), a.push(u), o && o.push(n[c]));
                        }
                        n ? i(t, a, o) : i(t, a);
                    }
                });
            } else i && l(function() {
                n ? i(null, [], []) : i(null, []);
            });
        }, g.loadResArray = function(t, e, i, n) {
            var r = this._parseLoadResArgs(e, i, n);
            e = r.type, i = r.onProgress, n = r.onComplete;
            for (var s = [], a = e instanceof Array, o = 0; o < t.length; o++) {
                var c = t[o], h = a ? e[o] : e, l = this._getResUuid(c, h);
                if (!l) return void this._urlNotFound(c, h, n);
                s.push(l);
            }
            this._loadResUuids(s, i, n);
        }, g.loadResDir = function(t, e, i, n) {
            var r = this._parseLoadResArgs(e, i, n);
            e = r.type, i = r.onProgress, n = r.onComplete;
            var s = [], a = _.getUuidArray(t, e, s);
            this._loadResUuids(a, i, function(t, e, i) {
                for (var r = e.length, s = 0; s < r; ++s) if (e[s] instanceof cc.SpriteAtlas) {
                    var a = e[s].getSpriteFrames();
                    for (var o in a) {
                        var c = a[o];
                        e.push(c), i && i.push(i[s] + "/" + c.name);
                    }
                }
                n && n(t, e, i);
            }, s);
        }, g.getRes = function(t, e) {
            var i = this._cache[t];
            if (!i) {
                var n = this._getResUuid(t, e, !0);
                if (!n) return null;
                var r = this._getReferenceKey(n);
                i = this._cache[r];
            }
            return i && i.alias && (i = i.alias), i && i.complete ? i.content : null;
        }, g.getResCount = function() {
            return Object.keys(this._cache).length;
        }, g.getDependsRecursively = function(t) {
            if (t) {
                var e = this._getReferenceKey(t), i = u.getDependsRecursively(e);
                return i.push(e), i;
            }
            return [];
        }, g.release = function(t) {
            if (Array.isArray(t)) for (var e = 0; e < t.length; e++) {
                var i = t[e];
                this.release(i);
            } else if (t) {
                var n = this._getReferenceKey(t), r = this.getItem(n);
                if (r) {
                    this.removeItem(n);
                    if ((t = r.content) instanceof cc.Asset) {
                        var s = t.nativeUrl;
                        s && this.release(s), t.destroy();
                    }
                    0;
                }
            }
        }, g.releaseAsset = function(t) {
            var e = t._uuid;
            e && this.release(e);
        }, g.releaseRes = function(t, e) {
            var i = this._getResUuid(t, e);
            i ? this.release(i) : cc.errorID(4914, t);
        }, g.releaseResDir = function(t, e) {
            for (var i = _.getUuidArray(t, e), n = 0; n < i.length; n++) {
                var r = i[n];
                this.release(r);
            }
        }, g.releaseAll = function() {
            for (var t in this._cache) this.release(t);
        }, g.removeItem = function(t) {
            var e = r.prototype.removeItem.call(this, t);
            return delete this._autoReleaseSetting[t], e;
        }, g.setAutoRelease = function(t, e) {
            var i = this._getReferenceKey(t);
            i && (this._autoReleaseSetting[i] = !!e);
        }, g.setAutoReleaseRecursively = function(t, e) {
            e = !!e;
            var i = this._getReferenceKey(t);
            if (i) {
                this._autoReleaseSetting[i] = e;
                for (var n = u.getDependsRecursively(i), r = 0; r < n.length; r++) {
                    var s = n[r];
                    this._autoReleaseSetting[s] = e;
                }
            } else 0;
        }, g.isAutoRelease = function(t) {
            var e = this._getReferenceKey(t);
            return !!e && !!this._autoReleaseSetting[e];
        }, cc.loader = new v(), e.exports = cc.loader;
    }, {
        "../platform/js": 102,
        "../platform/utils": 106,
        "./asset-loader": 60,
        "./asset-table": 61,
        "./auto-release-utils": 63,
        "./downloader": 65,
        "./loader": 68,
        "./loading-items": 69,
        "./pipeline": 72,
        "./released-asset-checker": 73
    } ],
    60: [ function(t, e, i) {
        t("../utils/CCPath");
        var n = t("../CCDebug"), r = t("./pipeline"), s = t("./loading-items"), a = "AssetLoader", o = function(t) {
            this.id = a, this.async = !0, this.pipeline = null;
        };
        o.ID = a;
        var c = [];
        o.prototype.handle = function(t, e) {
            var i = t.uuid;
            if (!i) return t.content || null;
            cc.AssetLibrary.queryAssetInfo(i, function(r, a, o) {
                if (r) e(r); else if (t.url = t.rawUrl = a, t.isRawAsset = o, o) {
                    var h = cc.path.extname(a).toLowerCase();
                    if (!h) return void e(new Error(n.getError(4931, i, a)));
                    h = h.substr(1);
                    var l = s.getQueue(t);
                    c[0] = {
                        queueId: t.queueId,
                        id: a,
                        url: a,
                        type: h,
                        error: null,
                        alias: t,
                        complete: !0
                    }, l.append(c), t.type = h, e(null, t.content);
                } else t.type = "uuid", e(null, t.content);
            });
        }, r.AssetLoader = e.exports = o;
    }, {
        "../CCDebug": 1,
        "../utils/CCPath": 152,
        "./loading-items": 69,
        "./pipeline": 72
    } ],
    61: [ function(t, e, i) {
        var n = t("../utils/misc").pushToMap, r = t("../platform/js");
        function s() {
            this._pathToUuid = r.createMap(!0);
        }
        function a(t, e) {
            if (t.length > e.length) {
                var i = t.charCodeAt(e.length);
                return 46 === i || 47 === i;
            }
            return !0;
        }
        var o = s.prototype;
        o.getUuid = function(t, e) {
            t = cc.url.normalize(t);
            var i = this._pathToUuid[t];
            if (i) if (Array.isArray(i)) {
                if (!e) return i[0].uuid;
                for (var n = 0; n < i.length; n++) {
                    var s = i[n];
                    if (r.isChildClassOf(s.type, e)) return s.uuid;
                }
            } else {
                if (!e || r.isChildClassOf(i.type, e)) return i.uuid;
            }
            return "";
        }, o.getUuidArray = function(t, e, i) {
            "/" === (t = cc.url.normalize(t))[t.length - 1] && (t = t.slice(0, -1));
            var n = this._pathToUuid, s = [], o = r.isChildClassOf;
            for (var c in n) if (c.startsWith(t) && a(c, t) || !t) {
                var h = n[c];
                if (Array.isArray(h)) for (var l = 0; l < h.length; l++) {
                    var u = h[l];
                    (!e || o(u.type, e)) && (s.push(u.uuid), i && i.push(c));
                } else (!e || o(h.type, e)) && (s.push(h.uuid), i && i.push(c));
            }
            return s;
        }, o.add = function(t, e, i, r) {
            t = t.substring(0, t.length - cc.path.extname(t).length);
            var s = new function(t, e) {
                this.uuid = t, this.type = e;
            }(e, i);
            n(this._pathToUuid, t, s, r);
        }, o._getInfo_DEBUG = !1, o.reset = function() {
            this._pathToUuid = r.createMap(!0);
        }, e.exports = s;
    }, {
        "../platform/js": 102,
        "../utils/misc": 159
    } ],
    62: [ function(t, e, i) {
        var n = t("../platform/CCSys"), r = t("../CCDebug"), s = n.__audioSupport, a = s.format, o = s.context;
        function c(t, e) {
            var i = document.createElement("audio");
            i.src = t.url;
            cc.sys.platform, cc.sys.BAIDU_GAME;
            e(null, i);
        }
        function h(t, e) {
            o || e(new Error(r.getError(4926)));
            var i = cc.loader.getXMLHttpRequest();
            i.open("GET", t.url, !0), i.responseType = "arraybuffer", i.onload = function() {
                o.decodeAudioData(i.response, function(t) {
                    e(null, t);
                }, function() {
                    e("decode error - " + t.id, null);
                });
            }, i.onerror = function() {
                e("request error - " + t.id, null);
            }, i.send();
        }
        e.exports = function(t, e) {
            if (0 === a.length) return new Error(r.getError(4927));
            var i;
            i = s.WEB_AUDIO ? t._owner instanceof cc.AudioClip ? t._owner.loadMode === cc.AudioClip.LoadMode.WEB_AUDIO ? h : c : t.urlParam && t.urlParam.useDom ? c : h : c, 
            i(t, e);
        };
    }, {
        "../CCDebug": 1,
        "../platform/CCSys": 91
    } ],
    63: [ function(t, e, i) {
        var n = t("../platform/js");
        function r(t, e) {
            var i = cc.loader.getItem(t);
            if (i) {
                var n = i.dependKeys;
                if (n) for (var s = 0; s < n.length; s++) {
                    var a = n[s];
                    e[a] || (e[a] = !0, r(a, e));
                }
            }
        }
        function s(t, e) {
            if (t._uuid) {
                var i = cc.loader._getReferenceKey(t);
                e[i] || (e[i] = !0, r(i, e));
            }
        }
        function a(t, e) {
            for (var i = Object.getOwnPropertyNames(t), n = 0; n < i.length; n++) {
                var r = t[i[n]];
                if ("object" == typeof r && r) if (Array.isArray(r)) for (var a = 0; a < r.length; a++) {
                    var o = r[a];
                    o instanceof cc.RawAsset && s(o, e);
                } else if (r.constructor && r.constructor !== Object) r instanceof cc.RawAsset && s(r, e); else for (var c = Object.getOwnPropertyNames(r), h = 0; h < c.length; h++) {
                    var l = r[c[h]];
                    l instanceof cc.RawAsset && s(l, e);
                }
            }
        }
        function o(t, e) {
            for (var i = 0; i < t._components.length; i++) a(t._components[i], e);
            for (var n = 0; n < t._children.length; n++) o(t._children[n], e);
        }
        e.exports = {
            autoRelease: function(t, e, i) {
                var r = cc.loader._autoReleaseSetting, s = n.createMap();
                if (e) for (var a = 0; a < e.length; a++) s[e[a]] = !0;
                for (var c = 0; c < i.length; c++) o(i[c], s);
                if (t) for (var h = 0; h < t.length; h++) {
                    var l = t[h];
                    !1 === r[l] || s[l] || cc.loader.release(l);
                }
                for (var u = Object.keys(r), _ = 0; _ < u.length; _++) {
                    var d = u[_];
                    !0 !== r[d] || s[d] || cc.loader.release(d);
                }
            },
            getDependsRecursively: function(t) {
                var e = {};
                return r(t, e), Object.keys(e);
            }
        };
    }, {
        "../platform/js": 102
    } ],
    64: [ function(t, e, i) {
        e.exports = function(t, e) {
            var i = t.url, n = cc.loader.getXMLHttpRequest(), r = "Load binary data failed: " + i;
            n.open("GET", i, !0), n.responseType = "arraybuffer", n.onload = function() {
                var t = n.response;
                if (t) {
                    var i = new Uint8Array(t);
                    e(null, i);
                } else e({
                    status: n.status,
                    errorMessage: r + "(no response)"
                });
            }, n.onerror = function() {
                e({
                    status: n.status,
                    errorMessage: r + "(error)"
                });
            }, n.ontimeout = function() {
                e({
                    status: n.status,
                    errorMessage: r + "(time out)"
                });
            }, n.send(null);
        };
    }, {} ],
    65: [ function(t, e, i) {
        var n = t("../platform/js"), r = t("../CCDebug");
        t("../utils/CCPath");
        var s, a = t("./pipeline"), o = t("./pack-downloader"), c = t("./binary-downloader"), h = t("./text-downloader"), l = t("./utils").urlAppendTimestamp;
        function u() {
            return null;
        }
        function _(t, e, i) {
            var n = t.url, s = document, a = document.createElement("script");
            function o() {
                a.parentNode.removeChild(a), a.removeEventListener("load", o, !1), a.removeEventListener("error", c, !1), 
                e(null, n);
            }
            function c() {
                a.parentNode.removeChild(a), a.removeEventListener("load", o, !1), a.removeEventListener("error", c, !1), 
                e(new Error(r.getError(4928, n)));
            }
            "file:" !== window.location.protocol && (a.crossOrigin = "anonymous"), a.async = i, 
            a.src = l(n), a.addEventListener("load", o, !1), a.addEventListener("error", c, !1), 
            s.body.appendChild(a);
        }
        function d(t, e, i, n) {
            void 0 === i && (i = !0);
            var s = l(t.url);
            if (n = n || new Image(), i && "file:" !== window.location.protocol ? n.crossOrigin = "anonymous" : n.crossOrigin = null, 
            n.complete && n.naturalWidth > 0 && n.src === s) return n;
            (function() {
                function i() {
                    n.removeEventListener("load", i), n.removeEventListener("error", a), n.id = t.id, 
                    e(null, n);
                }
                function a() {
                    n.removeEventListener("load", i), n.removeEventListener("error", a), "https:" !== window.location.protocol && n.crossOrigin && "anonymous" === n.crossOrigin.toLowerCase() ? d(t, e, !1, n) : e(new Error(r.getError(4930, s)));
                }
                n.addEventListener("load", i), n.addEventListener("error", a), n.src = s;
            })();
        }
        var f = {
            js: _,
            png: d,
            jpg: d,
            bmp: d,
            jpeg: d,
            gif: d,
            ico: d,
            tiff: d,
            webp: function(t, e, i, n) {
                return cc.sys.capabilities.webp ? d(t, e, i, n) : new Error(r.getError(4929, t.url));
            },
            image: d,
            mp3: s = t("./audio-downloader"),
            ogg: s,
            wav: s,
            m4a: s,
            txt: h,
            xml: h,
            vsh: h,
            fsh: h,
            atlas: h,
            tmx: h,
            tsx: h,
            json: h,
            ExportJson: h,
            plist: h,
            fnt: h,
            font: u,
            eot: u,
            ttf: u,
            woff: u,
            svg: u,
            ttc: u,
            uuid: function(t, e) {
                var i = o.load(t, e);
                return void 0 === i ? this.extMap.json(t, e) : i || void 0;
            },
            binary: c,
            dbbin: c,
            default: h
        }, p = "Downloader", m = function(t) {
            this.id = p, this.async = !0, this.pipeline = null, this._curConcurrent = 0, this._loadQueue = [], 
            this._subpackages = {}, this.extMap = n.mixin(t, f);
        };
        m.ID = p, m.PackDownloader = o, m.prototype.addHandlers = function(t) {
            n.mixin(this.extMap, t);
        }, m.prototype._handleLoadQueue = function() {
            for (;this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT; ) {
                var t = this._loadQueue.shift();
                if (!t) break;
                var e = this.handle(t.item, t.callback);
                void 0 !== e && (e instanceof Error ? t.callback(e) : t.callback(null, e));
            }
        }, m.prototype.handle = function(t, e) {
            var i = this, n = this.extMap[t.type] || this.extMap.default, r = void 0;
            if (this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT) {
                if (this._curConcurrent++, void 0 !== (r = n.call(this, t, function(t, n) {
                    i._curConcurrent = Math.max(0, i._curConcurrent - 1), i._handleLoadQueue(), e && e(t, n);
                }))) return this._curConcurrent = Math.max(0, this._curConcurrent - 1), this._handleLoadQueue(), 
                r;
            } else if (t.ignoreMaxConcurrency) {
                if (void 0 !== (r = n.call(this, t, e))) return r;
            } else this._loadQueue.push({
                item: t,
                callback: e
            });
        }, m.prototype.loadSubpackage = function(t, e) {
            var i = this._subpackages[t];
            i ? i.loaded ? e && e() : _({
                url: i.path + "index.js"
            }, function(t) {
                t || (i.loaded = !0), e && e(t);
            }) : e && e(new Error("Can't find subpackage " + t));
        }, a.Downloader = e.exports = m;
    }, {
        "../CCDebug": 1,
        "../platform/js": 102,
        "../utils/CCPath": 152,
        "./audio-downloader": 62,
        "./binary-downloader": 64,
        "./pack-downloader": 71,
        "./pipeline": 72,
        "./text-downloader": 75,
        "./utils": 77
    } ],
    66: [ function(t, e, i) {
        var n = t("../utils/text-utils"), r = null, s = "BES bswy:->@123丁ぁᄁ", a = {}, o = -1, c = [], h = 6e4, l = function() {
            var t = void 0;
            return function() {
                if (void 0 === t) if (window.FontFace) {
                    var e = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent), i = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);
                    t = e ? parseInt(e[1], 10) > 42 : !i;
                } else t = !1;
                return t;
            };
        }();
        function u() {
            for (var t = !0, e = Date.now(), i = c.length - 1; i >= 0; i--) {
                var a = c[i], l = a.fontFamilyName;
                if (e - a.startTime > h) cc.warnID(4933, l), a.callback(null, l), c.splice(i, 1); else {
                    var u = a.refWidth;
                    r.font = "40px " + l, u !== n.safeMeasureText(r, s) ? (c.splice(i, 1), a.callback(null, l)) : t = !1;
                }
            }
            t && (clearInterval(o), o = -1);
        }
        var _ = {
            loadFont: function(t, e) {
                var i = t.url, d = _._getFontFamily(i);
                if (a[d]) return d;
                if (!r) {
                    var f = document.createElement("canvas");
                    f.width = 100, f.height = 100, r = f.getContext("2d");
                }
                var p = "40px " + d;
                r.font = p;
                var m = n.safeMeasureText(r, s), v = document.createElement("style");
                v.type = "text/css";
                var g = "";
                isNaN(d - 0) ? g += "@font-face { font-family:" + d + "; src:" : g += "@font-face { font-family:'" + d + "'; src:", 
                g += "url('" + i + "');", v.textContent = g + "}", document.body.appendChild(v);
                var y = document.createElement("div"), x = y.style;
                if (x.fontFamily = d, y.innerHTML = ".", x.position = "absolute", x.left = "-100px", 
                x.top = "-100px", document.body.appendChild(y), l()) (function(t, e, i) {
                    var n = new Promise(function(i, n) {
                        var r = function() {
                            Date.now() - t >= h ? n() : document.fonts.load("40px " + e).then(function(t) {
                                t.length >= 1 ? i() : setTimeout(r, 100);
                            }, function() {
                                n();
                            });
                        };
                        r();
                    }), r = null, s = new Promise(function(t, e) {
                        r = setTimeout(e, h);
                    });
                    Promise.race([ s, n ]).then(function() {
                        r && (clearTimeout(r), r = null), i(null, e);
                    }, function() {
                        cc.warnID(4933, e), i(null, e);
                    });
                })(Date.now(), d, e); else {
                    var E = {
                        fontFamilyName: d,
                        refWidth: m,
                        callback: e,
                        startTime: Date.now()
                    };
                    c.push(E), -1 === o && (o = setInterval(u, 100));
                }
                a[d] = v;
            },
            _getFontFamily: function(t) {
                var e = t.lastIndexOf(".ttf");
                if (-1 === e) return t;
                var i, n = t.lastIndexOf("/");
                return -1 !== (i = -1 === n ? t.substring(0, e) + "_LABEL" : t.substring(n + 1, e) + "_LABEL").indexOf(" ") && (i = '"' + i + '"'), 
                i;
            }
        };
        e.exports = _;
    }, {
        "../utils/text-utils": 166
    } ],
    67: [ function(t, e, i) {
        t("./downloader"), t("./loader"), t("./loading-items"), t("./pipeline"), t("./CCLoader");
    }, {
        "./CCLoader": 59,
        "./downloader": 65,
        "./loader": 68,
        "./loading-items": 69,
        "./pipeline": 72
    } ],
    68: [ function(t, e, i) {
        var n = t("../platform/js"), r = t("../platform/CCSAXParser").plistParser, s = t("./pipeline"), a = t("../assets/CCTexture2D"), o = t("./uuid-loader"), c = t("./font-loader");
        function h(t) {
            if ("string" != typeof t.content) return new Error("JSON Loader: Input item doesn't contain string content");
            try {
                return JSON.parse(t.content);
            } catch (e) {
                return new Error("JSON Loader: Parse json [" + t.id + "] failed : " + e);
            }
        }
        function l(t) {
            if (t._owner instanceof cc.Asset) return null;
            var e = t.content;
            var i = t.rawUrl, n = t.texture || new a();
            return n._uuid = t.uuid, n.url = i, n._setRawAsset(i, !1), n._nativeAsset = e, n;
        }
        function u(t, e) {
            if (t._owner instanceof cc.Asset) return null;
            var i = new cc.AudioClip();
            return i._setRawAsset(t.rawUrl, !1), i._nativeAsset = t.content, i;
        }
        function _(t) {
            return t.load ? t.load(t.content) : null;
        }
        var d = {
            png: l,
            jpg: l,
            bmp: l,
            jpeg: l,
            gif: l,
            ico: l,
            tiff: l,
            webp: l,
            image: l,
            mp3: u,
            ogg: u,
            wav: u,
            m4a: u,
            json: h,
            ExportJson: h,
            plist: function(t) {
                if ("string" != typeof t.content) return new Error("Plist Loader: Input item doesn't contain string content");
                var e = r.parse(t.content);
                return e || new Error("Plist Loader: Parse [" + t.id + "] failed");
            },
            uuid: o,
            prefab: o,
            fire: o,
            scene: o,
            binary: _,
            dbbin: _,
            font: c.loadFont,
            eot: c.loadFont,
            ttf: c.loadFont,
            woff: c.loadFont,
            svg: c.loadFont,
            ttc: c.loadFont,
            default: function() {
                return null;
            }
        }, f = function(t) {
            this.id = "Loader", this.async = !0, this.pipeline = null, this.extMap = n.mixin(t, d);
        };
        f.ID = "Loader", f.prototype.addHandlers = function(t) {
            this.extMap = n.mixin(this.extMap, t);
        }, f.prototype.handle = function(t, e) {
            return (this.extMap[t.type] || this.extMap.default).call(this, t, e);
        }, s.Loader = e.exports = f;
    }, {
        "../assets/CCTexture2D": 23,
        "../platform/CCSAXParser": 89,
        "../platform/js": 102,
        "./font-loader": 66,
        "./pipeline": 72,
        "./uuid-loader": 78
    } ],
    69: [ function(t, e, i) {
        var n = t("../platform/callbacks-invoker");
        t("../utils/CCPath");
        var r = t("../platform/js"), s = 0 | 998 * Math.random(), a = r.createMap(!0), o = [], c = {
            WORKING: 1,
            COMPLETE: 2,
            ERROR: 3
        }, h = r.createMap(!0);
        function l(t) {
            return "string" == typeof (t.url || t);
        }
        function u(t, e) {
            var i = "object" == typeof t ? t.url : t, n = {
                queueId: e,
                id: i,
                url: i,
                rawUrl: void 0,
                urlParam: function(t) {
                    if (t) {
                        var e = t.split("?");
                        if (e && e[0] && e[1]) {
                            var i = {};
                            return e[1].split("&").forEach(function(t) {
                                var e = t.split("=");
                                i[e[0]] = e[1];
                            }), i;
                        }
                    }
                }(i),
                type: "",
                error: null,
                content: null,
                complete: !1,
                states: {},
                deps: null
            };
            if ("object" == typeof t && (r.mixin(n, t), t.skips)) for (var s = 0; s < t.skips.length; s++) {
                var a = t.skips[s];
                n.states[a] = c.COMPLETE;
            }
            return n.rawUrl = n.url, i && !n.type && (n.type = cc.path.extname(i).toLowerCase().substr(1)), 
            n;
        }
        var _ = [];
        function d(t, e, i) {
            if (!t || !e) return !1;
            var n = !1;
            if (_.push(e.id), e.deps) {
                var r, s, a = e.deps;
                for (r = 0; r < a.length; r++) {
                    if ((s = a[r]).id === t.id) {
                        n = !0;
                        break;
                    }
                    if (!(_.indexOf(s.id) >= 0) && (s.deps && d(t, s, !0))) {
                        n = !0;
                        break;
                    }
                }
            }
            return i || (_.length = 0), n;
        }
        var f = function(t, e, i, o) {
            n.call(this), this._id = ++s, a[this._id] = this, this._pipeline = t, this._errorUrls = r.createMap(!0), 
            this._appending = !1, this._ownerQueue = null, this.onProgress = i, this.onComplete = o, 
            this.map = r.createMap(!0), this.completed = {}, this.totalCount = 0, this.completedCount = 0, 
            this._pipeline ? this.active = !0 : this.active = !1, e && (e.length > 0 ? this.append(e) : this.allComplete());
        };
        f.ItemState = new cc.Enum(c), f.create = function(t, e, i, n) {
            void 0 === i ? "function" == typeof e && (n = e, e = i = null) : void 0 === n && ("function" == typeof e ? (n = i, 
            i = e, e = null) : (n = i, i = null));
            var r = o.pop();
            return r ? (r._pipeline = t, r.onProgress = i, r.onComplete = n, a[r._id] = r, r._pipeline && (r.active = !0), 
            e && r.append(e)) : r = new f(t, e, i, n), r;
        }, f.getQueue = function(t) {
            return t.queueId ? a[t.queueId] : null;
        }, f.itemComplete = function(t) {
            var e = a[t.queueId];
            e && e.itemComplete(t.id);
        }, f.initQueueDeps = function(t) {
            var e = h[t._id];
            e ? (e.completed.length = 0, e.deps.length = 0) : e = h[t._id] = {
                completed: [],
                deps: []
            };
        }, f.registerQueueDep = function(t, e) {
            var i = t.queueId || t;
            if (!i) return !1;
            var n = h[i];
            if (n) -1 === n.deps.indexOf(e) && n.deps.push(e); else if (t.id) for (var r in h) {
                var s = h[r];
                -1 !== s.deps.indexOf(t.id) && -1 === s.deps.indexOf(e) && s.deps.push(e);
            }
        }, f.finishDep = function(t) {
            for (var e in h) {
                var i = h[e];
                -1 !== i.deps.indexOf(t) && -1 === i.completed.indexOf(t) && i.completed.push(t);
            }
        };
        var p = f.prototype;
        r.mixin(p, n.prototype), p.append = function(t, e) {
            if (!this.active) return [];
            e && !e.deps && (e.deps = []), this._appending = !0;
            var i, n, r, s = [];
            for (i = 0; i < t.length; ++i) if (!(n = t[i]).queueId || this.map[n.id]) {
                if (l(n)) {
                    var o = (r = u(n, this._id)).id;
                    this.map[o] || (this.map[o] = r, this.totalCount++, e && e.deps.push(r), f.registerQueueDep(e || this._id, o), 
                    s.push(r));
                }
            } else {
                if (this.map[n.id] = n, e && e.deps.push(n), n.complete || d(e, n)) {
                    this.totalCount++, this.itemComplete(n.id);
                    continue;
                }
                var c = this, h = a[n.queueId];
                h && (this.totalCount++, f.registerQueueDep(e || this._id, n.id), h.addListener(n.id, function(t) {
                    c.itemComplete(t.id);
                }));
            }
            return this._appending = !1, this.completedCount === this.totalCount ? this.allComplete() : this._pipeline.flowIn(s), 
            s;
        }, p._childOnProgress = function(t) {
            if (this.onProgress) {
                var e = h[this._id];
                this.onProgress(e ? e.completed.length : this.completedCount, e ? e.deps.length : this.totalCount, t);
            }
        }, p.allComplete = function() {
            var t = r.isEmptyObject(this._errorUrls) ? null : this._errorUrls;
            this.onComplete && this.onComplete(t, this);
        }, p.isCompleted = function() {
            return this.completedCount >= this.totalCount;
        }, p.isItemCompleted = function(t) {
            return !!this.completed[t];
        }, p.exists = function(t) {
            return !!this.map[t];
        }, p.getContent = function(t) {
            var e = this.map[t], i = null;
            return e && (e.content ? i = e.content : e.alias && (i = e.alias.content)), i;
        }, p.getError = function(t) {
            var e = this.map[t], i = null;
            return e && (e.error ? i = e.error : e.alias && (i = e.alias.error)), i;
        }, p.addListener = n.prototype.add, p.hasListener = n.prototype.has, p.removeListener = n.prototype.remove, 
        p.removeAllListeners = n.prototype.removeAll, p.removeItem = function(t) {
            var e = this.map[t];
            e && this.completed[e.alias || t] && (delete this.completed[t], delete this.map[t], 
            e.alias && (delete this.completed[e.alias.id], delete this.map[e.alias.id]), this.completedCount--, 
            this.totalCount--);
        }, p.itemComplete = function(t) {
            var e = this.map[t];
            if (e) {
                var i = t in this._errorUrls;
                if (e.error instanceof Error || r.isString(e.error) ? this._errorUrls[t] = e.error : e.error ? r.mixin(this._errorUrls, e.error) : !e.error && i && delete this._errorUrls[t], 
                this.completed[t] = e, this.completedCount++, f.finishDep(e.id), this.onProgress) {
                    var n = h[this._id];
                    this.onProgress(n ? n.completed.length : this.completedCount, n ? n.deps.length : this.totalCount, e);
                }
                this.invoke(t, e), this.removeAll(t), !this._appending && this.completedCount >= this.totalCount && this.allComplete();
            }
        }, p.destroy = function() {
            this.active = !1, this._appending = !1, this._pipeline = null, this._ownerQueue = null, 
            r.clear(this._errorUrls), this.onProgress = null, this.onComplete = null, this.map = r.createMap(!0), 
            this.completed = {}, this.totalCount = 0, this.completedCount = 0, n.call(this), 
            h[this._id] && (h[this._id].completed.length = 0, h[this._id].deps.length = 0), 
            delete a[this._id], delete h[this._id], -1 === o.indexOf(this) && o.length < 10 && o.push(this);
        }, cc.LoadingItems = e.exports = f;
    }, {
        "../platform/callbacks-invoker": 95,
        "../platform/js": 102,
        "../utils/CCPath": 152
    } ],
    70: [ function(t, e, i) {
        var n = t("./pipeline"), r = "MD5Pipe", s = /(\.[^.\n\\/]*)$/, a = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;
        var o = function(t, e, i) {
            this.id = r, this.async = !1, this.pipeline = null, this.md5AssetsMap = t, this.md5NativeAssetsMap = e, 
            this.libraryBase = i;
        };
        o.ID = r, o.prototype.handle = function(t) {
            var e = !1;
            return "ttf" === t.type && (e = !0), t.url = this.transformURL(t.url, e), null;
        }, o.prototype.transformURL = function(t, e) {
            var i, n, r, o, c = this, h = function(t) {
                var e = t.match(a);
                return e ? e[1] : "";
            }(t);
            h && function() {
                i = !t.startsWith(c.libraryBase);
                var a = (i ? c.md5NativeAssetsMap : c.md5AssetsMap)[h];
                a && (e ? (n = cc.path.dirname(t), r = cc.path.basename(t), t = n + "." + a + "/" + r) : (o = !1, 
                t = t.replace(s, function(t, e) {
                    return o = !0, "." + a + e;
                }), o || (t = t + "." + a)));
            }();
            return t;
        }, n.MD5Pipe = e.exports = o;
    }, {
        "./pipeline": 72
    } ],
    71: [ function(t, e, i) {
        var n = t("./unpackers"), r = t("../utils/misc").pushToMap, s = {
            Invalid: 0,
            Removed: 1,
            Downloading: 2,
            Loaded: 3
        };
        function a() {
            this.unpacker = null, this.state = s.Invalid;
        }
        var o = {}, c = {}, h = {};
        function l(t, e) {
            return new Error("Can not retrieve " + t + " from packer " + e);
        }
        e.exports = {
            initPacks: function(t) {
                for (var e in c = t, t) for (var i = t[e], n = 0; n < i.length; n++) {
                    var s = i[n], a = 1 === i.length;
                    r(o, s, e, a);
                }
            },
            _loadNewPack: function(t, e, i) {
                var n = this, r = cc.AssetLibrary.getLibUrlNoExt(e) + ".json";
                cc.loader.load({
                    url: r,
                    ignoreMaxConcurrency: !0
                }, function(r, s) {
                    if (r) return cc.errorID(4916, t), i(r);
                    var a = n._doLoadNewPack(t, e, s);
                    a ? i(null, a) : i(l(t, e));
                });
            },
            _doPreload: function(t, e) {
                var i = h[t];
                i || ((i = h[t] = new a()).state = s.Downloading), i.state !== s.Loaded && (i.unpacker = new n.JsonUnpacker(), 
                i.unpacker.load(c[t], e), i.state = s.Loaded);
            },
            _doLoadNewPack: function(t, e, i) {
                var r = h[e];
                return r.state !== s.Loaded && ("string" == typeof i && (i = JSON.parse(i)), Array.isArray(i) ? r.unpacker = new n.JsonUnpacker() : i.type === n.TextureUnpacker.ID && (r.unpacker = new n.TextureUnpacker()), 
                r.unpacker.load(c[e], i), r.state = s.Loaded), r.unpacker.retrieve(t);
            },
            _selectLoadedPack: function(t) {
                for (var e = s.Invalid, i = "", n = 0; n < t.length; n++) {
                    var r = t[n], a = h[r];
                    if (a) {
                        var o = a.state;
                        if (o === s.Loaded) return r;
                        o > e && (e = o, i = r);
                    }
                }
                return e !== s.Invalid ? i : t[0];
            },
            load: function(t, e) {
                var i = t.uuid, n = o[i];
                if (n) {
                    Array.isArray(n) && (n = this._selectLoadedPack(n));
                    var r = h[n];
                    if (r && r.state === s.Loaded) {
                        var c = r.unpacker.retrieve(i);
                        return c || l(i, n);
                    }
                    return r || (console.log("Create unpacker %s for %s", n, i), (r = h[n] = new a()).state = s.Downloading), 
                    this._loadNewPack(i, n, e), null;
                }
            }
        };
    }, {
        "../utils/misc": 159,
        "./unpackers": 76
    } ],
    72: [ function(t, e, i) {
        var n = t("../platform/js"), r = t("./loading-items"), s = r.ItemState;
        function a(t, e) {
            var i = t.id, n = e.states[i], r = t.next, o = t.pipeline;
            if (!e.error && n !== s.WORKING && n !== s.ERROR) if (n === s.COMPLETE) r ? a(r, e) : o.flowOut(e); else {
                e.states[i] = s.WORKING;
                var c = t.handle(e, function(t, n) {
                    t ? (e.error = t, e.states[i] = s.ERROR, o.flowOut(e)) : (n && (e.content = n), 
                    e.states[i] = s.COMPLETE, r ? a(r, e) : o.flowOut(e));
                });
                c instanceof Error ? (e.error = c, e.states[i] = s.ERROR, o.flowOut(e)) : void 0 !== c && (null !== c && (e.content = c), 
                e.states[i] = s.COMPLETE, r ? a(r, e) : o.flowOut(e));
            }
        }
        var o = function(t) {
            this._pipes = t, this._cache = n.createMap(!0);
            for (var e = 0; e < t.length; ++e) {
                var i = t[e];
                i.handle && i.id && (i.pipeline = this, i.next = e < t.length - 1 ? t[e + 1] : null);
            }
        };
        o.ItemState = s;
        var c = o.prototype;
        c.insertPipe = function(t, e) {
            if (!t.handle || !t.id || e > this._pipes.length) cc.warnID(4921); else if (this._pipes.indexOf(t) > 0) cc.warnID(4922); else {
                t.pipeline = this;
                var i = null;
                e < this._pipes.length && (i = this._pipes[e]);
                var n = null;
                e > 0 && (n = this._pipes[e - 1]), n && (n.next = t), t.next = i, this._pipes.splice(e, 0, t);
            }
        }, c.insertPipeAfter = function(t, e) {
            var i = this._pipes.indexOf(t);
            i < 0 || this.insertPipe(e, i + 1);
        }, c.appendPipe = function(t) {
            t.handle && t.id && (t.pipeline = this, t.next = null, this._pipes.length > 0 && (this._pipes[this._pipes.length - 1].next = t), 
            this._pipes.push(t));
        }, c.flowIn = function(t) {
            var e, i, n = this._pipes[0];
            if (n) {
                for (e = 0; e < t.length; e++) i = t[e], this._cache[i.id] = i;
                for (e = 0; e < t.length; e++) a(n, i = t[e]);
            } else for (e = 0; e < t.length; e++) this.flowOut(t[e]);
        }, c.flowInDeps = function(t, e, i) {
            return r.create(this, function(t, e) {
                i(t, e), e.destroy();
            }).append(e, t);
        }, c.flowOut = function(t) {
            t.error ? delete this._cache[t.id] : this._cache[t.id] || (this._cache[t.id] = t), 
            t.complete = !0, r.itemComplete(t);
        }, c.copyItemStates = function(t, e) {
            if (e instanceof Array) for (var i = 0; i < e.length; ++i) e[i].states = t.states; else e.states = t.states;
        }, c.getItem = function(t) {
            var e = this._cache[t];
            return e ? (e.alias && (e = e.alias), e) : e;
        }, c.removeItem = function(t) {
            var e = this._cache[t];
            return e && e.complete && delete this._cache[t], e;
        }, c.clear = function() {
            for (var t in this._cache) {
                var e = this._cache[t];
                delete this._cache[t], e.complete || (e.error = new Error("Canceled manually"), 
                this.flowOut(e));
            }
        }, cc.Pipeline = e.exports = o;
    }, {
        "../platform/js": 102,
        "./loading-items": 69
    } ],
    73: [ function(t, e, i) {}, {
        "../platform/js": 102
    } ],
    74: [ function(t, e, i) {
        var n = t("./pipeline"), r = "SubPackPipe", s = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;
        var a = Object.create(null), o = function(t) {
            for (var e in this.id = r, this.async = !1, this.pipeline = null, t) {
                var i = t[e];
                i.uuids && i.uuids.forEach(function(t) {
                    a[t] = i.path;
                });
            }
        };
        o.ID = r, o.prototype.handle = function(t) {
            return t.url = this.transformURL(t.url), null;
        }, o.prototype.transformURL = function(t) {
            var e = function(t) {
                var e = t.match(s);
                return e ? e[1] : "";
            }(t);
            if (e) {
                var i = a[e];
                if (i) return t.replace("res/raw-assets/", i + "raw-assets/");
            }
            return t;
        }, n.SubPackPipe = e.exports = o;
    }, {
        "./pipeline": 72
    } ],
    75: [ function(t, e, i) {
        var n = t("./utils").urlAppendTimestamp;
        e.exports = function(t, e) {
            var i = t.url;
            i = n(i);
            var r = cc.loader.getXMLHttpRequest(), s = "Load text file failed: " + i;
            r.open("GET", i, !0), r.overrideMimeType && r.overrideMimeType("text/plain; charset=utf-8"), 
            r.onload = function() {
                4 === r.readyState ? 200 === r.status || 0 === r.status ? e(null, r.responseText) : e({
                    status: r.status,
                    errorMessage: s + "(wrong status)"
                }) : e({
                    status: r.status,
                    errorMessage: s + "(wrong readyState)"
                });
            }, r.onerror = function() {
                e({
                    status: r.status,
                    errorMessage: s + "(error)"
                });
            }, r.ontimeout = function() {
                e({
                    status: r.status,
                    errorMessage: s + "(time out)"
                });
            }, r.send(null);
        };
    }, {
        "./utils": 77
    } ],
    76: [ function(t, e, i) {
        var n = t("../assets/CCTexture2D"), r = t("../platform/js");
        function s() {
            this.jsons = {};
        }
        function a() {
            this.contents = {};
        }
        s.prototype.load = function(t, e) {
            e.length !== t.length && cc.errorID(4915);
            for (var i = 0; i < t.length; i++) {
                var n = t[i], r = e[i];
                this.jsons[n] = r;
            }
        }, s.prototype.retrieve = function(t) {
            return this.jsons[t] || null;
        }, a.ID = r._getClassId(n), a.prototype.load = function(t, e) {
            var i = e.data.split("|");
            i.length !== t.length && cc.errorID(4915);
            for (var n = 0; n < t.length; n++) this.contents[t[n]] = i[n];
        }, a.prototype.retrieve = function(t) {
            var e = this.contents[t];
            return e ? {
                __type__: a.ID,
                content: e
            } : null;
        }, e.exports = {
            JsonUnpacker: s,
            TextureUnpacker: a
        };
    }, {
        "../assets/CCTexture2D": 23,
        "../platform/js": 102
    } ],
    77: [ function(t, e, i) {
        var n = /\?/;
        e.exports = {
            urlAppendTimestamp: function(t) {
                return cc.game.config.noCache && "string" == typeof t && (n.test(t) ? t += "&_t=" + (new Date() - 0) : t += "?_t=" + (new Date() - 0)), 
                t;
            }
        };
    }, {} ],
    78: [ function(t, e, i) {
        var n = t("../platform/js"), r = t("../CCDebug");
        t("../platform/deserialize");
        var s = t("./loading-items");
        function a(t) {
            return t && (t[0] && "cc.Scene" === t[0].__type__ || t[1] && "cc.Scene" === t[1].__type__ || t[0] && "cc.Prefab" === t[0].__type__);
        }
        function o(t, e) {
            var i, o;
            if ("string" == typeof t.content) try {
                i = JSON.parse(t.content);
            } catch (e) {
                return new Error(r.getError(4923, t.id, e.stack));
            } else {
                if ("object" != typeof t.content) return new Error(r.getError(4924));
                i = t.content;
            }
            var c = a(i);
            o = c ? cc._MissingScript.safeFindClass : function(t) {
                var e = n._getClassById(t);
                return e || (cc.warnID(4903, t), Object);
            };
            var h, l = cc.deserialize.Details.pool.get();
            try {
                h = cc.deserialize(i, l, {
                    classFinder: o,
                    target: t.existingAsset,
                    customEnv: t
                });
            } catch (e) {
                cc.deserialize.Details.pool.put(l);
                var u = e.stack;
                return new Error(r.getError(4925, t.id, u));
            }
            h._uuid = t.uuid;
            var _ = function(t, e, i, n) {
                var r, s, a, o = i.uuidList, c = i.uuidObjList, h = i.uuidPropList, l = i._stillUseUrl, u = t.dependKeys = [];
                if (n) for (r = [], s = 0; s < o.length; s++) {
                    a = o[s];
                    var _ = c[s], d = h[s], f = cc.AssetLibrary._getAssetInfoInRuntime(a);
                    if (f.raw) {
                        var p = f.url;
                        _[d] = p, u.push(p);
                    } else r.push({
                        type: "uuid",
                        uuid: a,
                        deferredLoadRaw: !0,
                        _owner: _,
                        _ownerProp: d,
                        _stillUseUrl: l[s]
                    });
                } else {
                    for (r = new Array(o.length), s = 0; s < o.length; s++) a = o[s], r[s] = {
                        type: "uuid",
                        uuid: a,
                        _owner: c[s],
                        _ownerProp: h[s],
                        _stillUseUrl: l[s]
                    };
                    e._native && !e.constructor.preventPreloadNativeObject && r.push({
                        url: e.nativeUrl,
                        _owner: e,
                        _ownerProp: "_nativeAsset"
                    });
                }
                return r;
            }(t, h, l, function(t, e, i) {
                var n = e.deferredLoadRaw;
                return n ? t instanceof cc.Asset && t.constructor.preventDeferredLoadDependents && (n = !1) : i && (t instanceof cc.SceneAsset || t instanceof cc.Prefab) && (n = t.asyncLoadAssets), 
                n;
            }(h, t, c));
            if (cc.deserialize.Details.pool.put(l), 0 === _.length) return e(null, h);
            (function(t, e, i, n, r) {
                e.content = i;
                var a = e.dependKeys;
                t.flowInDeps(e, n, function(t, e) {
                    var o, c = e.map;
                    for (var h in c) (o = c[h]).uuid && o.content && (o.content._uuid = o.uuid);
                    for (var l = 0; l < n.length; l++) {
                        var u = n[l], _ = u.uuid, d = u.url;
                        if (u._owner, u._ownerProp, o = c[d]) {
                            var f = u;
                            if (o.complete || o.content) o.error ? cc._throw(o.error) : v.call(f, o); else {
                                var p = s.getQueue(o), m = p._callbackTable[_];
                                m ? m.unshift(v, f) : p.addListener(_, v, f);
                            }
                        }
                        function v(t) {
                            var e = t.content;
                            this._stillUseUrl && (e = e && cc.RawAsset.wasRawAssetType(e.constructor) ? e.nativeUrl : t.rawUrl), 
                            this._owner[this._ownerProp] = e, t.uuid !== i._uuid && a.indexOf(t.id) < 0 && a.push(t.id);
                        }
                    }
                    r(t, i);
                });
            })(this.pipeline, t, h, _, e);
        }
        e.exports = o, o.isSceneObj = a;
    }, {
        "../CCDebug": 1,
        "../platform/deserialize": 97,
        "../platform/js": 102,
        "./loading-items": 69
    } ],
    79: [ function(t, e, i) {
        var n = t("./component-scheduler"), r = t("./platform/CCObject").Flags, s = t("./platform/js"), a = r.IsPreloadStarted, o = r.IsOnLoadStarted, c = r.IsOnLoadCalled, h = r.Deactivating, l = function(t) {
            t.__preload();
        }, u = function(t) {
            t.onLoad(), t._objFlags |= c;
        }, _ = cc.Class({
            extends: n.LifeCycleInvoker,
            add: function(t) {
                this._zero.array.push(t);
            },
            remove: function(t) {
                this._zero.fastRemove(t);
            },
            cancelInactive: function(t) {
                n.LifeCycleInvoker.stableRemoveInactive(this._zero, t);
            },
            invoke: function() {
                this._invoke(this._zero), this._zero.array.length = 0;
            }
        }), d = n.createInvokeImpl(l), f = n.createInvokeImpl(u), p = new s.Pool(4);
        function m(t, e, i) {
            e ? t._removeComponent(e) : s.array.removeAt(t._components, i);
        }
        function v() {
            this._activatingStack = [];
        }
        p.get = function() {
            var t = this._get() || {
                preload: new _(d),
                onLoad: new n.OneOffInvoker(f),
                onEnable: new n.OneOffInvoker(n.invokeOnEnable)
            };
            t.preload._zero.i = -1;
            var e = t.onLoad;
            return e._zero.i = -1, e._neg.i = -1, e._pos.i = -1, (e = t.onEnable)._zero.i = -1, 
            e._neg.i = -1, e._pos.i = -1, t;
        };
        var g = cc.Class({
            ctor: v,
            reset: v,
            _activateNodeRecursively: function(t, e, i, n) {
                if (t._objFlags & h) cc.errorID(3816, t.name); else {
                    t._activeInHierarchy = !0;
                    for (var r = t._components.length, s = 0; s < r; ++s) {
                        var a = t._components[s];
                        a instanceof cc.Component ? this.activateComp(a, e, i, n) : (m(t, a, s), --s, --r);
                    }
                    for (var o = 0, c = t._children.length; o < c; ++o) {
                        var l = t._children[o];
                        l._active && this._activateNodeRecursively(l, e, i, n);
                    }
                    t._onPostActivated(!0);
                }
            },
            _deactivateNodeRecursively: function(t) {
                t._objFlags |= h, t._activeInHierarchy = !1;
                for (var e = t._components.length, i = 0; i < e; ++i) {
                    var n = t._components[i];
                    if (n._enabled && (cc.director._compScheduler.disableComp(n), t._activeInHierarchy)) return void (t._objFlags &= ~h);
                }
                for (var r = 0, s = t._children.length; r < s; ++r) {
                    var a = t._children[r];
                    if (a._activeInHierarchy && (this._deactivateNodeRecursively(a), t._activeInHierarchy)) return void (t._objFlags &= ~h);
                }
                t._onPostActivated(!1), t._objFlags &= ~h;
            },
            activateNode: function(t, e) {
                if (e) {
                    var i = p.get();
                    this._activatingStack.push(i), this._activateNodeRecursively(t, i.preload, i.onLoad, i.onEnable), 
                    i.preload.invoke(), i.onLoad.invoke(), i.onEnable.invoke(), this._activatingStack.pop(), 
                    p.put(i);
                } else {
                    this._deactivateNodeRecursively(t);
                    for (var n = this._activatingStack, r = 0; r < n.length; r++) {
                        var s = n[r];
                        s.preload.cancelInactive(a), s.onLoad.cancelInactive(o), s.onEnable.cancelInactive();
                    }
                }
                t.emit("active-in-hierarchy-changed", t);
            },
            activateComp: function(t, e, i, n) {
                if (cc.isValid(t, !0) && (t._objFlags & a || (t._objFlags |= a, t.__preload && (e ? e.add(t) : t.__preload())), 
                t._objFlags & o || (t._objFlags |= o, t.onLoad ? i ? i.add(t) : (t.onLoad(), t._objFlags |= c) : t._objFlags |= c), 
                t._enabled)) {
                    if (!t.node._activeInHierarchy) return;
                    cc.director._compScheduler.enableComp(t, n);
                }
            },
            destroyComp: function(t) {
                cc.director._compScheduler.disableComp(t), t.onDestroy && t._objFlags & c && t.onDestroy();
            },
            resetComp: !1
        });
        e.exports = g;
    }, {
        "./component-scheduler": 27,
        "./platform/CCObject": 88,
        "./platform/js": 102,
        "./utils/misc": 159
    } ],
    80: [ function(t, e, i) {}, {
        "../event-manager": 48,
        "../platform/js": 102,
        "./CCMacro": 87,
        "./CCSys": 91
    } ],
    81: [ function(t, e, i) {
        t("../assets/CCAsset");
        var n = t("./utils").callInNextTick, r = t("../load-pipeline/CCLoader"), s = t("../load-pipeline/pack-downloader"), a = t("../load-pipeline/auto-release-utils"), o = t("../utils/decode-uuid"), c = t("../load-pipeline/md5-pipe"), h = t("../load-pipeline/subpackage-pipe"), l = t("./js"), u = "", _ = "", d = l.createMap(!0);
        function f(t) {
            return t && (t.constructor === cc.SceneAsset || t instanceof cc.Scene);
        }
        function p(t, e) {
            this.url = t, this.type = e;
        }
        var m = {
            loadAsset: function(t, e, i) {
                if ("string" != typeof t) return n(e, new Error("[AssetLibrary] uuid must be string"), null);
                var s = {
                    uuid: t,
                    type: "uuid"
                };
                i && i.existingAsset && (s.existingAsset = i.existingAsset), r.load(s, function(i, n) {
                    if (i || !n) i = new Error("[AssetLibrary] loading JSON or dependencies failed: " + (i ? i.message : "Unknown error")); else {
                        if (n.constructor === cc.SceneAsset) {
                            var s = cc.loader._getReferenceKey(t);
                            n.scene.dependAssets = a.getDependsRecursively(s);
                        }
                        if (f(n)) {
                            var o = cc.loader._getReferenceKey(t);
                            r.removeItem(o);
                        }
                    }
                    e && e(i, n);
                });
            },
            getLibUrlNoExt: function(t, e) {
                return t = o(t), (e ? _ + "assets/" : u) + t.slice(0, 2) + "/" + t;
            },
            _queryAssetInfoInEditor: function(t, e) {
                0;
            },
            _getAssetInfoInRuntime: function(t, e) {
                e = e || {
                    url: null,
                    raw: !1
                };
                var i = d[t];
                return i && !l.isChildClassOf(i.type, cc.Asset) ? (e.url = _ + i.url, e.raw = !0) : (e.url = this.getLibUrlNoExt(t) + ".json", 
                e.raw = !1), e;
            },
            _uuidInSettings: function(t) {
                return t in d;
            },
            queryAssetInfo: function(t, e) {
                var i = this._getAssetInfoInRuntime(t);
                e(null, i.url, i.raw);
            },
            parseUuidInEditor: function(t) {},
            loadJson: function(t, e) {
                var i = "" + (new Date().getTime() + Math.random()), n = {
                    uuid: i,
                    type: "uuid",
                    content: t,
                    skips: [ r.assetLoader.id, r.downloader.id ]
                };
                r.load(n, function(t, n) {
                    if (t) t = new Error("[AssetLibrary] loading JSON or dependencies failed: " + t.message); else {
                        if (n.constructor === cc.SceneAsset) {
                            var s = cc.loader._getReferenceKey(i);
                            n.scene.dependAssets = a.getDependsRecursively(s);
                        }
                        if (f(n)) {
                            var o = cc.loader._getReferenceKey(i);
                            r.removeItem(o);
                        }
                    }
                    n._uuid = "", e && e(t, n);
                });
            },
            getAssetByUuid: function(t) {
                return m._uuidToAsset[t] || null;
            },
            init: function(t) {
                var e = t.libraryPath;
                if (e = e.replace(/\\/g, "/"), u = cc.path.stripSep(e) + "/", _ = t.rawAssetsBase, 
                t.subpackages) {
                    var i = new h(t.subpackages);
                    cc.loader.insertPipeAfter(cc.loader.assetLoader, i), cc.loader.subPackPipe = i;
                }
                var n = t.md5AssetsMap;
                if (n && n.import) {
                    var a = 0, f = 0, m = l.createMap(!0), v = n.import;
                    for (a = 0; a < v.length; a += 2) m[f = o(v[a])] = v[a + 1];
                    var g = l.createMap(!0);
                    for (v = n["raw-assets"], a = 0; a < v.length; a += 2) g[f = o(v[a])] = v[a + 1];
                    var y = new c(m, g, u);
                    cc.loader.insertPipeAfter(cc.loader.assetLoader, y), cc.loader.md5Pipe = y;
                }
                var x = r._resources;
                x.reset();
                var E = t.rawAssets;
                if (E) for (var T in E) {
                    var C = E[T];
                    for (var f in C) {
                        var A = C[f], b = A[0], w = A[1], D = cc.js._getClassById(w);
                        if (D) {
                            if (d[f] = new p(T + "/" + b, D), "assets" === T) {
                                var S = cc.path.extname(b);
                                S && (b = b.slice(0, -S.length));
                                var R = 1 === A[2];
                                x.add(b, f, D, !R);
                            }
                        } else cc.error("Cannot get", w);
                    }
                }
                t.packedAssets && s.initPacks(t.packedAssets), cc.url._init(t.mountPaths && t.mountPaths.assets || _ + "assets");
            },
            _uuidToAsset: {}
        };
        e.exports = cc.AssetLibrary = m;
    }, {
        "../assets/CCAsset": 8,
        "../load-pipeline/CCLoader": 59,
        "../load-pipeline/auto-release-utils": 63,
        "../load-pipeline/md5-pipe": 70,
        "../load-pipeline/pack-downloader": 71,
        "../load-pipeline/subpackage-pipe": 74,
        "../utils/decode-uuid": 155,
        "./js": 102,
        "./utils": 106
    } ],
    82: [ function(t, e, i) {
        var n = t("./js"), r = t("./CCEnum"), s = t("./utils"), a = (s.isPlainEmptyObj_DEV, 
        s.cloneable_DEV, t("./attribute")), o = a.DELIMETER, c = a.getTypeChecker, h = t("./preprocess-class");
        t("./requiring-frame");
        var l = [ "name", "extends", "mixins", "ctor", "__ctor__", "properties", "statics", "editor", "__ES6__" ];
        function u(t, e) {
            t.indexOf(e) < 0 && t.push(e);
        }
        var _ = {
            datas: null,
            push: function(t) {
                if (this.datas) this.datas.push(t); else {
                    this.datas = [ t ];
                    var e = this;
                    setTimeout(function() {
                        e.init();
                    }, 0);
                }
            },
            init: function() {
                var t = this.datas;
                if (t) {
                    for (var e = 0; e < t.length; ++e) {
                        var i = t[e], r = i.cls, s = i.props;
                        "function" == typeof s && (s = s());
                        var a = n.getClassName(r);
                        s ? w(r, a, s, r.$super, i.mixins) : cc.errorID(3633, a);
                    }
                    this.datas = null;
                }
            }
        };
        function d(t, e) {
            u(t.__props__, e);
        }
        var f = [];
        function p(t, e, i, n, r) {
            var s = n.default;
            a.setClassAttr(t, i, "default", s), d(t, i);
            var o = M(t, n, e, i, !1);
            if (o) {
                for (var c = f, h = 0; h < o.length; h++) {
                    var l = o[h];
                    a.attr(t, i, l), l._onAfterProp && c.push(l._onAfterProp);
                }
                for (var u = 0; u < c.length; u++) c[u](t, i);
                f.length = 0, o.length = 0;
            }
        }
        function m(t, e, i, r, s) {
            var o = r.get, c = r.set, h = t.prototype, l = Object.getOwnPropertyDescriptor(h, i), u = !l;
            if (o) {
                0;
                for (var _ = M(t, r, e, i, !0), d = 0; d < _.length; d++) a.attr(t, i, _[d]);
                _.length = 0, a.setClassAttr(t, i, "serializable", !1), s || n.get(h, i, o, u, u);
            }
            c && (s || n.set(h, i, c, u, u));
        }
        function v(t) {
            return "function" == typeof t ? t() : t;
        }
        function g(t, e, i) {
            for (var r in e) t.hasOwnProperty(r) || i && !i(r) || Object.defineProperty(t, r, n.getPropertyDescriptor(e, r));
        }
        function y(t, e, i, r) {
            var s, o, c = r.__ctor__, h = r.ctor, l = r.__ES6__;
            l ? (s = [ h ], o = h) : (s = c ? [ c ] : function(t, e, i) {
                function n(t) {
                    return D._isCCClass(t) ? t.__ctors__ || [] : [ t ];
                }
                for (var r = [], s = [ t ].concat(e), a = 0; a < s.length; a++) {
                    var o = s[a];
                    if (o) for (var c = n(o), h = 0; h < c.length; h++) u(r, c[h]);
                }
                var l = i.ctor;
                l && r.push(l);
                return r;
            }(e, i, r), o = C(s, e, t, r), n.value(o, "extend", function(t) {
                return t.extends = this, D(t);
            }, !0)), n.value(o, "__ctors__", s.length > 0 ? s : null, !0);
            var _ = o.prototype;
            if (e && (l || (n.extend(o, e), _ = o.prototype), o.$super = e), i) {
                for (var d = i.length - 1; d >= 0; d--) {
                    var f = i[d];
                    g(_, f.prototype), g(o, f, function(t) {
                        return f.hasOwnProperty(t) && !0;
                    }), D._isCCClass(f) && g(a.getClassAttrs(o).constructor.prototype, a.getClassAttrs(f).constructor.prototype);
                }
                _.constructor = o;
            }
            return l || (_.__initProps__ = T), n.setClassName(t, o), o;
        }
        function x(t) {
            return JSON.stringify(t).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
        }
        var E = /^[A-Za-z_$][0-9A-Za-z_$]*$/;
        function T(t) {
            var e = a.getClassAttrs(t), i = t.__props__;
            null === i && (_.init(), i = t.__props__);
            var n = function(t, e) {
                for (var i = [], n = [], r = [], s = [], a = 0; a < e.length; ++a) {
                    var c = e[a], h = c + o + "default";
                    if (h in t) {
                        var l = t[h];
                        "object" == typeof l && l || "function" == typeof l ? (i.push(c), n.push(l)) : (r.push(c), 
                        s.push(l));
                    }
                }
                return function() {
                    for (var t = 0; t < r.length; ++t) this[r[t]] = s[t];
                    for (var e = 0; e < i.length; e++) {
                        var a, o = i[e], c = n[e];
                        a = "object" == typeof c ? c instanceof cc.ValueType ? c.clone() : Array.isArray(c) ? [] : {} : c(), 
                        this[o] = a;
                    }
                };
            }(e, i);
            t.prototype.__initProps__ = n, n.call(this);
        }
        var C = function(t, e, i, n) {
            var r, s = e && b(e, n, i), a = t.length;
            return r = a > 0 ? s ? 2 === a ? function() {
                this._super = null, this.__initProps__(r), t[0].apply(this, arguments), t[1].apply(this, arguments);
            } : function() {
                this._super = null, this.__initProps__(r);
                for (var e = 0; e < t.length; ++e) t[e].apply(this, arguments);
            } : 3 === a ? function() {
                this.__initProps__(r), t[0].apply(this, arguments), t[1].apply(this, arguments), 
                t[2].apply(this, arguments);
            } : function() {
                this.__initProps__(r);
                for (var t = r.__ctors__, e = 0; e < t.length; ++e) t[e].apply(this, arguments);
            } : function() {
                s && (this._super = null), this.__initProps__(r);
            };
        };
        var A = /xyz/.test(function() {
            xyz;
        }) ? /\b\._super\b/ : /.*/;
        /xyz/.test(function() {
            xyz;
        });
        function b(t, e, i) {
            var r = !1;
            for (var s in e) if (!(l.indexOf(s) >= 0)) {
                var a = e[s];
                if ("function" == typeof a) {
                    var o = n.getPropertyDescriptor(t.prototype, s);
                    if (o) {
                        var c = o.value;
                        if ("function" == typeof c) {
                            A.test(a) && (r = !0, e[s] = function(t, e) {
                                return function() {
                                    var i = this._super;
                                    this._super = t;
                                    var n = e.apply(this, arguments);
                                    return this._super = i, n;
                                };
                            }(c, a));
                            continue;
                        }
                    }
                    0;
                }
            }
            return r;
        }
        function w(t, e, i, n, r, s) {
            if (t.__props__ = [], n && n.__props__ && (t.__props__ = n.__props__.slice()), r) for (var c = 0; c < r.length; ++c) {
                var l = r[c];
                l.__props__ && (t.__props__ = t.__props__.concat(l.__props__.filter(function(e) {
                    return t.__props__.indexOf(e) < 0;
                })));
            }
            if (i) for (var u in h.preprocessAttrs(i, e, t, s), i) {
                var _ = i[u];
                "default" in _ ? p(t, e, u, _) : m(t, e, u, _, s);
            }
            var d = a.getClassAttrs(t);
            t.__values__ = t.__props__.filter(function(t) {
                return !1 !== d[t + o + "serializable"];
            });
        }
        function D(t) {
            var e = (t = t || {}).name, i = t.extends, r = t.mixins, s = function(t, e, i, r) {
                var s = cc.Component, a = cc._RF.peek();
                if (a && n.isChildClassOf(e, s)) {
                    if (n.isChildClassOf(a.cls, s)) return cc.errorID(3615), null;
                    t = t || a.script;
                }
                var o = y(t, e, i, r);
                if (a) if (n.isChildClassOf(e, s)) {
                    var c = a.uuid;
                    c && n._setClassId(c, o), a.cls = o;
                } else n.isChildClassOf(a.cls, s) || (a.cls = o);
                return o;
            }(e, i, r, t);
            e || (e = cc.js.getClassName(s)), s._sealed = !0, i && (i._sealed = !1);
            var a = t.properties;
            "function" == typeof a || i && null === i.__props__ || r && r.some(function(t) {
                return null === t.__props__;
            }) ? (_.push({
                cls: s,
                props: a,
                mixins: r
            }), s.__props__ = s.__values__ = null) : w(s, e, a, i, t.mixins, t.__ES6__);
            var o, c = t.statics;
            if (c) for (o in c) s[o] = c[o];
            for (var u in t) if (!(l.indexOf(u) >= 0)) {
                var d = t[u];
                h.validateMethodWithProps(d, u, e, s, i) && n.value(s.prototype, u, d, !0, !0);
            }
            var f = t.editor;
            return f && n.isChildClassOf(i, cc.Component) && cc.Component._registerEditorProps(s, f), 
            s;
        }
        D._isCCClass = function(t) {
            return t && t.hasOwnProperty("__ctors__");
        }, D._fastDefine = function(t, e, i) {
            n.setClassName(t, e);
            for (var r = e.__props__ = e.__values__ = Object.keys(i), s = a.getClassAttrsProto(e), c = 0; c < r.length; c++) {
                var h = r[c];
                s[h + o + "visible"] = !1, s[h + o + "default"] = i[h];
            }
        }, D.Attr = a, D.attr = a.attr, D.getInheritanceChain = function(t) {
            for (var e = []; t = n.getSuper(t); ) t !== Object && e.push(t);
            return e;
        };
        var S = {
            Integer: "Number",
            Float: "Number",
            Boolean: "Boolean",
            String: "String"
        }, R = [];
        function M(t, e, i, n, s) {
            var h = null, l = "";
            function u() {
                return l = n + o, h = a.getClassAttrsProto(t);
            }
            R.length = 0;
            var _ = R, d = e.type;
            if (d) {
                var f = S[d];
                if (f) _.push({
                    type: d,
                    _onAfterProp: c(f, "cc." + d)
                }); else if ("Object" === d) 0; else if (d === a.ScriptUuid) {
                    var p = a.ObjectType(cc.ScriptAsset);
                    p.type = "Script", _.push(p);
                } else "object" == typeof d ? r.isEnum(d) && _.push({
                    type: "Enum",
                    enumList: r.getList(d)
                }) : "function" == typeof d && (e.url ? _.push({
                    type: "Object",
                    ctor: d,
                    _onAfterProp: c("String", "cc.String")
                }) : _.push(e._short ? {
                    type: "Object",
                    ctor: d
                } : a.ObjectType(d)));
            }
            function m(t, i) {
                if (t in e) {
                    var n = e[t];
                    typeof n === i && ((h || u())[l + t] = n);
                }
            }
            e.editorOnly && ((h || u())[l + "editorOnly"] = !0), e.url && ((h || u())[l + "saveUrlAsAsset"] = !0), 
            !1 === e.serializable && ((h || u())[l + "serializable"] = !1), m("formerlySerializedAs", "string");
            var v = e.range;
            return v && Array.isArray(v) && v.length >= 2 && ((h || u())[l + "min"] = v[0], 
            h[l + "max"] = v[1], v.length > 2 && (h[l + "step"] = v[2])), m("min", "number"), 
            m("max", "number"), m("step", "number"), _;
        }
        cc.Class = D, e.exports = {
            isArray: function(t) {
                return t = v(t), Array.isArray(t);
            },
            fastDefine: D._fastDefine,
            getNewValueTypeCode: !1,
            IDENTIFIER_RE: E,
            escapeForJS: x,
            getDefault: v
        };
    }, {
        "./CCEnum": 84,
        "./attribute": 94,
        "./js": 102,
        "./preprocess-class": 103,
        "./requiring-frame": 104,
        "./utils": 106
    } ],
    83: [ function(t, e, i) {
        t("./CCClass");
        var n = t("./preprocess-class"), r = t("./js"), s = "__ccclassCache__";
        function a(t) {
            return t;
        }
        function o(t, e) {
            return t[e] || (t[e] = {});
        }
        function c(t) {
            return function(e) {
                return "function" == typeof e ? t(e) : function(i) {
                    return t(i, e);
                };
            };
        }
        function h(t, e, i) {
            return function(t) {
                return function(i) {
                    return e(i, t);
                };
            };
        }
        var l = h.bind(null, !1);
        function u(t) {
            return h.bind(null, !1);
        }
        var _ = u(), d = u();
        function f(t, e) {
            return o(t, s);
        }
        var p = c(function(t, e) {
            var i = r.getSuper(t);
            i === Object && (i = null);
            var n = {
                name: e,
                extends: i,
                ctor: t,
                __ES6__: !0
            }, a = t[s];
            if (a) {
                var o = a.proto;
                o && r.mixin(n, o), t[s] = void 0;
            }
            return cc.Class(n);
        });
        function m(t, e, i) {
            return t(function(t, n) {
                var r = f(t);
                if (r) {
                    var s = void 0 !== i ? i : n;
                    o(o(r, "proto"), "editor")[e] = s;
                }
            }, e);
        }
        function v(t) {
            return t(a);
        }
        var g = v(c), y = m(l, "requireComponent"), x = v(_), E = m(d, "executionOrder"), T = v(c), C = v(c), A = v(_), b = v(_), w = v(_);
        cc._decorator = e.exports = {
            ccclass: p,
            property: function(t, e, i) {
                var s = null;
                function a(t, e, i) {
                    var a = f(t.constructor);
                    if (a) {
                        var c = o(o(a, "proto"), "properties");
                        (function(t, e, i, s, a, o) {
                            var c;
                            s && (c = (c = n.getFullFormOfProperty(s)) || s);
                            var h = e[i], l = r.mixin(h || {}, c || {});
                            if (a && (a.get || a.set)) a.get && (l.get = a.get), a.set && (l.set = a.set); else {
                                var u = void 0;
                                if (a) a.initializer && (u = function(t) {
                                    var e;
                                    try {
                                        e = t();
                                    } catch (e) {
                                        return t;
                                    }
                                    return "object" != typeof e || null === e ? e : t;
                                }(a.initializer)); else {
                                    var _ = o.default || (o.default = function(t) {
                                        var e;
                                        try {
                                            e = new t();
                                        } catch (t) {
                                            return {};
                                        }
                                        return e;
                                    }(t));
                                    _.hasOwnProperty(i) && (u = _[i]);
                                }
                                l.default = u;
                            }
                            e[i] = l;
                        })(t.constructor, c, e, s, i, a);
                    }
                }
                if (void 0 === e) return s = t, a;
                a(t, e, i);
            },
            executeInEditMode: g,
            requireComponent: y,
            menu: x,
            executionOrder: E,
            disallowMultiple: T,
            playOnFocus: C,
            inspector: A,
            icon: b,
            help: w,
            mixins: function() {
                for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                return function(e) {
                    var i = f(e);
                    i && (o(i, "proto").mixins = t);
                };
            }
        };
    }, {
        "./CCClass": 82,
        "./js": 102,
        "./preprocess-class": 103,
        "./utils": 106
    } ],
    84: [ function(t, e, i) {
        var n = t("./js");
        function r(t) {
            if ("__enums__" in t) return t;
            n.value(t, "__enums__", null, !0);
            for (var e = -1, i = Object.keys(t), r = 0; r < i.length; r++) {
                var s = i[r], a = t[s];
                if (-1 === a) a = ++e, t[s] = a; else if ("number" == typeof a) e = a; else if ("string" == typeof a && Number.isInteger(parseFloat(s))) continue;
                var o = "" + a;
                s !== o && n.value(t, o, s);
            }
            return t;
        }
        r.isEnum = function(t) {
            return t && t.hasOwnProperty("__enums__");
        }, r.getList = function(t) {
            if (t.__enums__) return t.__enums__;
            var e = t.__enums__ = [];
            for (var i in t) {
                var n = t[i];
                Number.isInteger(n) && e.push({
                    name: i,
                    value: n
                });
            }
            return e.sort(function(t, e) {
                return t.value - e.value;
            }), e;
        }, e.exports = cc.Enum = r;
    }, {
        "./js": 102
    } ],
    85: [ function(t, e, i) {
        var n = t("../event-manager"), r = t("./CCInputManager"), s = void 0;
        cc.Acceleration = function(t, e, i, n) {
            this.x = t || 0, this.y = e || 0, this.z = i || 0, this.timestamp = n || 0;
        }, r.setAccelerometerEnabled = function(t) {
            var e = this;
            if (e._accelEnabled !== t) {
                e._accelEnabled = t;
                var i = cc.director.getScheduler();
                i.enableForTarget(e), e._accelEnabled ? (e._registerAccelerometerEvent(), e._accelCurTime = 0, 
                i.scheduleUpdate(e)) : (e._unregisterAccelerometerEvent(), e._accelCurTime = 0, 
                i.unscheduleUpdate(e));
            }
        }, r.setAccelerometerInterval = function(t) {
            this._accelInterval !== t && (this._accelInterval = t);
        }, r._registerKeyboardEvent = function() {
            cc.game.canvas.addEventListener("keydown", function(t) {
                n.dispatchEvent(new cc.Event.EventKeyboard(t.keyCode, !0)), t.stopPropagation(), 
                t.preventDefault();
            }, !1), cc.game.canvas.addEventListener("keyup", function(t) {
                n.dispatchEvent(new cc.Event.EventKeyboard(t.keyCode, !1)), t.stopPropagation(), 
                t.preventDefault();
            }, !1);
        }, r._registerAccelerometerEvent = function() {
            var t = window, e = this;
            e._acceleration = new cc.Acceleration(), e._accelDeviceEvent = t.DeviceMotionEvent || t.DeviceOrientationEvent, 
            cc.sys.browserType === cc.sys.BROWSER_TYPE_MOBILE_QQ && (e._accelDeviceEvent = window.DeviceOrientationEvent);
            var i = e._accelDeviceEvent === t.DeviceMotionEvent ? "devicemotion" : "deviceorientation", n = navigator.userAgent;
            (/Android/.test(n) || /Adr/.test(n) && cc.sys.browserType === cc.BROWSER_TYPE_UC) && (e._minus = -1), 
            s = e.didAccelerate.bind(e), t.addEventListener(i, s, !1);
        }, r._unregisterAccelerometerEvent = function() {
            var t = window, e = this._accelDeviceEvent === t.DeviceMotionEvent ? "devicemotion" : "deviceorientation";
            s && t.removeEventListener(e, s, !1);
        }, r.didAccelerate = function(t) {
            var e = this, i = window;
            if (e._accelEnabled) {
                var n = e._acceleration, r = void 0, s = void 0, a = void 0;
                if (e._accelDeviceEvent === window.DeviceMotionEvent) {
                    var o = t.accelerationIncludingGravity;
                    r = e._accelMinus * o.x * .1, s = e._accelMinus * o.y * .1, a = .1 * o.z;
                } else r = t.gamma / 90 * .981, s = -t.beta / 90 * .981, a = t.alpha / 90 * .981;
                if (cc.view._isRotated) {
                    var c = r;
                    r = -s, s = c;
                }
                n.x = r, n.y = s, n.z = a, n.timestamp = t.timeStamp || Date.now();
                var h = n.x;
                90 === i.orientation ? (n.x = -n.y, n.y = h) : -90 === i.orientation ? (n.x = n.y, 
                n.y = -h) : 180 === i.orientation && (n.x = -n.x, n.y = -n.y), cc.sys.os === cc.sys.OS_ANDROID && cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ && (n.x = -n.x, 
                n.y = -n.y);
            }
        };
    }, {
        "../event-manager": 48,
        "./CCInputManager": 86
    } ],
    86: [ function(t, e, i) {
        var n = t("./CCMacro"), r = t("./CCSys"), s = t("../event-manager"), a = n.TOUCH_TIMEOUT, o = cc.v2(), c = {
            _mousePressed: !1,
            _isRegisterEvent: !1,
            _preTouchPoint: cc.v2(0, 0),
            _prevMousePoint: cc.v2(0, 0),
            _preTouchPool: [],
            _preTouchPoolPointer: 0,
            _touches: [],
            _touchesIntegerDict: {},
            _indexBitsUsed: 0,
            _maxTouches: 8,
            _accelEnabled: !1,
            _accelInterval: .2,
            _accelMinus: 1,
            _accelCurTime: 0,
            _acceleration: null,
            _accelDeviceEvent: null,
            _getUnUsedIndex: function() {
                for (var t = this._indexBitsUsed, e = cc.sys.now(), i = 0; i < this._maxTouches; i++) {
                    if (!(1 & t)) return this._indexBitsUsed |= 1 << i, i;
                    var n = this._touches[i];
                    if (e - n._lastModified > a) return this._removeUsedIndexBit(i), delete this._touchesIntegerDict[n.getID()], 
                    i;
                    t >>= 1;
                }
                return -1;
            },
            _removeUsedIndexBit: function(t) {
                if (!(t < 0 || t >= this._maxTouches)) {
                    var e = 1 << t;
                    e = ~e, this._indexBitsUsed &= e;
                }
            },
            _glView: null,
            handleTouchesBegin: function(t) {
                for (var e = void 0, i = void 0, n = void 0, a = [], o = this._touchesIntegerDict, c = r.now(), h = 0, l = t.length; h < l; h++) if (null == o[n = (e = t[h]).getID()]) {
                    var u = this._getUnUsedIndex();
                    if (-1 === u) {
                        cc.logID(2300, u);
                        continue;
                    }
                    (i = this._touches[u] = new cc.Touch(e._point.x, e._point.y, e.getID()))._lastModified = c, 
                    i._setPrevPoint(e._prevPoint), o[n] = u, a.push(i);
                }
                if (a.length > 0) {
                    this._glView._convertTouchesWithScale(a);
                    var _ = new cc.Event.EventTouch(a);
                    _._eventCode = cc.Event.EventTouch.BEGAN, s.dispatchEvent(_);
                }
            },
            handleTouchesMove: function(t) {
                for (var e = void 0, i = void 0, n = void 0, a = [], o = this._touches, c = r.now(), h = 0, l = t.length; h < l; h++) n = (e = t[h]).getID(), 
                null != (i = this._touchesIntegerDict[n]) && o[i] && (o[i]._setPoint(e._point), 
                o[i]._setPrevPoint(e._prevPoint), o[i]._lastModified = c, a.push(o[i]));
                if (a.length > 0) {
                    this._glView._convertTouchesWithScale(a);
                    var u = new cc.Event.EventTouch(a);
                    u._eventCode = cc.Event.EventTouch.MOVED, s.dispatchEvent(u);
                }
            },
            handleTouchesEnd: function(t) {
                var e = this.getSetOfTouchesEndOrCancel(t);
                if (e.length > 0) {
                    this._glView._convertTouchesWithScale(e);
                    var i = new cc.Event.EventTouch(e);
                    i._eventCode = cc.Event.EventTouch.ENDED, s.dispatchEvent(i);
                }
                this._preTouchPool.length = 0;
            },
            handleTouchesCancel: function(t) {
                var e = this.getSetOfTouchesEndOrCancel(t);
                if (e.length > 0) {
                    this._glView._convertTouchesWithScale(e);
                    var i = new cc.Event.EventTouch(e);
                    i._eventCode = cc.Event.EventTouch.CANCELLED, s.dispatchEvent(i);
                }
                this._preTouchPool.length = 0;
            },
            getSetOfTouchesEndOrCancel: function(t) {
                for (var e = void 0, i = void 0, n = void 0, r = [], s = this._touches, a = this._touchesIntegerDict, o = 0, c = t.length; o < c; o++) null != (i = a[n = (e = t[o]).getID()]) && s[i] && (s[i]._setPoint(e._point), 
                s[i]._setPrevPoint(e._prevPoint), r.push(s[i]), this._removeUsedIndexBit(i), delete a[n]);
                return r;
            },
            getHTMLElementPosition: function(t) {
                return {
                    left: 0,
                    top: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            getPreTouch: function(t) {
                for (var e = null, i = this._preTouchPool, n = t.getID(), r = i.length - 1; r >= 0; r--) if (i[r].getID() === n) {
                    e = i[r];
                    break;
                }
                return e || (e = t), e;
            },
            setPreTouch: function(t) {
                for (var e = !1, i = this._preTouchPool, n = t.getID(), r = i.length - 1; r >= 0; r--) if (i[r].getID() === n) {
                    i[r] = t, e = !0;
                    break;
                }
                e || (i.length <= 50 ? i.push(t) : (i[this._preTouchPoolPointer] = t, this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50));
            },
            getTouchByXY: function(t, e, i) {
                var n = this._preTouchPoint, r = this._glView.convertToLocationInView(t, e, i), s = new cc.Touch(r.x, r.y, 0);
                return s._setPrevPoint(n.x, n.y), n.x = r.x, n.y = r.y, s;
            },
            getMouseEvent: function(t, e, i) {
                var n = this._prevMousePoint, r = new cc.Event.EventMouse(i);
                return r._setPrevCursor(n.x, n.y), n.x = t.x, n.y = t.y, this._glView._convertMouseToLocationInView(n, e), 
                r.setLocation(n.x, n.y), r;
            },
            getPointByEvent: function(t, e) {
                return null != t.pageX ? {
                    x: t.pageX,
                    y: t.pageY
                } : (e.left = 0, e.top = 0, {
                    x: t.clientX,
                    y: t.clientY
                });
            },
            getTouchesByEvent: function(t, e) {
                for (var i = [], n = this._glView, s = void 0, a = void 0, c = void 0, h = this._preTouchPoint, l = t.changedTouches.length, u = 0; u < l; u++) if (s = t.changedTouches[u]) {
                    var _ = void 0;
                    _ = r.BROWSER_TYPE_FIREFOX === r.browserType ? n.convertToLocationInView(s.pageX, s.pageY, e, o) : n.convertToLocationInView(s.clientX, s.clientY, e, o), 
                    null != s.identifier ? (a = new cc.Touch(_.x, _.y, s.identifier), c = this.getPreTouch(a).getLocation(), 
                    a._setPrevPoint(c.x, c.y), this.setPreTouch(a)) : (a = new cc.Touch(_.x, _.y))._setPrevPoint(h.x, h.y), 
                    h.x = _.x, h.y = _.y, i.push(a);
                }
                return i;
            },
            registerSystemEvent: function(t) {
                if (!this._isRegisterEvent) {
                    this._glView = cc.view;
                    var e = this, i = r.isMobile, n = (r.capabilities, "touches" in r.capabilities);
                    if (i = !1, n = !0, !1) {
                        i || (window.addEventListener("mousedown", function() {
                            e._mousePressed = !0;
                        }, !1), window.addEventListener("mouseup", function(i) {
                            if (e._mousePressed) {
                                e._mousePressed = !1;
                                var n = e.getHTMLElementPosition(t), r = e.getPointByEvent(i, n);
                                if (!cc.rect(n.left, n.top, n.width, n.height).contains(r)) {
                                    e.handleTouchesEnd([ e.getTouchByXY(r.x, r.y, n) ]);
                                    var a = e.getMouseEvent(r, n, cc.Event.EventMouse.UP);
                                    a.setButton(i.button), s.dispatchEvent(a);
                                }
                            }
                        }, !1));
                        for (var a = cc.Event.EventMouse, o = [ !i && [ "mousedown", a.DOWN, function(i, n, r, s) {
                            e._mousePressed = !0, e.handleTouchesBegin([ e.getTouchByXY(r.x, r.y, s) ]), t.focus();
                        } ], !i && [ "mouseup", a.UP, function(t, i, n, r) {
                            e._mousePressed = !1, e.handleTouchesEnd([ e.getTouchByXY(n.x, n.y, r) ]);
                        } ], !i && [ "mousemove", a.MOVE, function(t, i, n, r) {
                            e.handleTouchesMove([ e.getTouchByXY(n.x, n.y, r) ]), e._mousePressed || i.setButton(null);
                        } ], [ "mousewheel", a.SCROLL, function(t, e) {
                            e.setScrollData(0, t.wheelDelta);
                        } ], [ "DOMMouseScroll", a.SCROLL, function(t, e) {
                            e.setScrollData(0, -120 * t.detail);
                        } ] ], c = 0; c < o.length; ++c) {
                            var h = o[c];
                            h && function() {
                                var i = h[0], n = h[1], r = h[2];
                                t.addEventListener(i, function(i) {
                                    var a = e.getHTMLElementPosition(t), o = e.getPointByEvent(i, a), c = e.getMouseEvent(o, a, n);
                                    c.setButton(i.button), r(i, c, o, a), s.dispatchEvent(c), i.stopPropagation(), i.preventDefault();
                                }, !1);
                            }();
                        }
                    }
                    if (window.navigator.msPointerEnabled) {
                        var l = {
                            MSPointerDown: e.handleTouchesBegin,
                            MSPointerMove: e.handleTouchesMove,
                            MSPointerUp: e.handleTouchesEnd,
                            MSPointerCancel: e.handleTouchesCancel
                        }, u = function(i) {
                            var n = l[i];
                            t.addEventListener(i, function(i) {
                                var r = e.getHTMLElementPosition(t);
                                r.left -= document.documentElement.scrollLeft, r.top -= document.documentElement.scrollTop, 
                                n.call(e, [ e.getTouchByXY(i.clientX, i.clientY, r) ]), i.stopPropagation();
                            }, !1);
                        };
                        for (var _ in l) u(_);
                    }
                    n && function() {
                        var i = {
                            touchstart: function(t) {
                                e.handleTouchesBegin(t);
                            },
                            touchmove: function(t) {
                                e.handleTouchesMove(t);
                            },
                            touchend: function(t) {
                                e.handleTouchesEnd(t);
                            },
                            touchcancel: function(t) {
                                e.handleTouchesCancel(t);
                            }
                        }, n = void 0;
                        for (var r in cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB ? (i = {
                            onTouchStart: i.touchstart,
                            onTouchMove: i.touchmove,
                            onTouchEnd: i.touchend,
                            onTouchCancel: i.touchcancel
                        }, n = function(n) {
                            var r = i[n];
                            wx[n](function(i) {
                                if (i.changedTouches) {
                                    var n = e.getHTMLElementPosition(t), s = document.body;
                                    n.left -= s.scrollLeft || 0, n.top -= s.scrollTop || 0, r(e.getTouchesByEvent(i, n));
                                }
                            });
                        }) : n = function(n) {
                            var r = i[n];
                            t.addEventListener(n, function(i) {
                                if (i.changedTouches) {
                                    var n = e.getHTMLElementPosition(t), s = document.body;
                                    n.left -= s.scrollLeft || 0, n.top -= s.scrollTop || 0, r(e.getTouchesByEvent(i, n)), 
                                    i.stopPropagation(), i.preventDefault();
                                }
                            }, !1);
                        }, i) n(r);
                    }(), cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB && this._registerKeyboardEvent(), 
                    this._isRegisterEvent = !0;
                }
            },
            _registerKeyboardEvent: function() {},
            _registerAccelerometerEvent: function() {},
            update: function(t) {
                this._accelCurTime > this._accelInterval && (this._accelCurTime -= this._accelInterval, 
                s.dispatchEvent(new cc.Event.EventAcceleration(this._acceleration))), this._accelCurTime += t;
            }
        };
        e.exports = _cc.inputManager = c;
    }, {
        "../event-manager": 48,
        "./CCMacro": 87,
        "./CCSys": 91
    } ],
    87: [ function(t, e, i) {
        var n = t("./js");
        cc.macro = {
            RAD: Math.PI / 180,
            DEG: 180 / Math.PI,
            REPEAT_FOREVER: Number.MAX_VALUE - 1,
            FLT_EPSILON: 1.192092896e-7,
            MIN_ZINDEX: -Math.pow(2, 15),
            MAX_ZINDEX: Math.pow(2, 15) - 1,
            ONE: 1,
            ZERO: 0,
            SRC_ALPHA: 770,
            SRC_ALPHA_SATURATE: 776,
            SRC_COLOR: 768,
            DST_ALPHA: 772,
            DST_COLOR: 774,
            ONE_MINUS_SRC_ALPHA: 771,
            ONE_MINUS_SRC_COLOR: 769,
            ONE_MINUS_DST_ALPHA: 773,
            ONE_MINUS_DST_COLOR: 775,
            ONE_MINUS_CONSTANT_ALPHA: 32772,
            ONE_MINUS_CONSTANT_COLOR: 32770,
            ORIENTATION_PORTRAIT: 1,
            ORIENTATION_LANDSCAPE: 2,
            ORIENTATION_AUTO: 3,
            DENSITYDPI_DEVICE: "device-dpi",
            DENSITYDPI_HIGH: "high-dpi",
            DENSITYDPI_MEDIUM: "medium-dpi",
            DENSITYDPI_LOW: "low-dpi",
            FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX: !0,
            DIRECTOR_STATS_POSITION: cc.v2(0, 0),
            ENABLE_STACKABLE_ACTIONS: !0,
            TOUCH_TIMEOUT: 5e3,
            BATCH_VERTEX_COUNT: 2e4,
            ENABLE_TILEDMAP_CULLING: !0,
            DOWNLOAD_MAX_CONCURRENT: 64,
            ENABLE_TRANSPARENT_CANVAS: !1,
            ENABLE_WEBGL_ANTIALIAS: !1,
            ENABLE_CULLING: !1,
            CLEANUP_IMAGE_CACHE: !1
        }, n.getset(cc.macro, "ENABLE_3D", function() {
            return cc._polyfill3D.enabled;
        }, function(t) {
            t ? cc._polyfill3D.enable() : cc._polyfill3D.disable();
        }), cc.macro.KEY = {
            none: 0,
            back: 6,
            menu: 18,
            backspace: 8,
            tab: 9,
            enter: 13,
            shift: 16,
            ctrl: 17,
            alt: 18,
            pause: 19,
            capslock: 20,
            escape: 27,
            space: 32,
            pageup: 33,
            pagedown: 34,
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            select: 41,
            insert: 45,
            Delete: 46,
            0: 48,
            1: 49,
            2: 50,
            3: 51,
            4: 52,
            5: 53,
            6: 54,
            7: 55,
            8: 56,
            9: 57,
            a: 65,
            b: 66,
            c: 67,
            d: 68,
            e: 69,
            f: 70,
            g: 71,
            h: 72,
            i: 73,
            j: 74,
            k: 75,
            l: 76,
            m: 77,
            n: 78,
            o: 79,
            p: 80,
            q: 81,
            r: 82,
            s: 83,
            t: 84,
            u: 85,
            v: 86,
            w: 87,
            x: 88,
            y: 89,
            z: 90,
            num0: 96,
            num1: 97,
            num2: 98,
            num3: 99,
            num4: 100,
            num5: 101,
            num6: 102,
            num7: 103,
            num8: 104,
            num9: 105,
            "*": 106,
            "+": 107,
            "-": 109,
            numdel: 110,
            "/": 111,
            f1: 112,
            f2: 113,
            f3: 114,
            f4: 115,
            f5: 116,
            f6: 117,
            f7: 118,
            f8: 119,
            f9: 120,
            f10: 121,
            f11: 122,
            f12: 123,
            numlock: 144,
            scrolllock: 145,
            ";": 186,
            semicolon: 186,
            equal: 187,
            "=": 187,
            ",": 188,
            comma: 188,
            dash: 189,
            ".": 190,
            period: 190,
            forwardslash: 191,
            grave: 192,
            "[": 219,
            openbracket: 219,
            backslash: 220,
            "]": 221,
            closebracket: 221,
            quote: 222,
            dpadLeft: 1e3,
            dpadRight: 1001,
            dpadUp: 1003,
            dpadDown: 1004,
            dpadCenter: 1005
        }, cc.macro.ImageFormat = cc.Enum({
            JPG: 0,
            PNG: 1,
            TIFF: 2,
            WEBP: 3,
            PVR: 4,
            ETC: 5,
            S3TC: 6,
            ATITC: 7,
            TGA: 8,
            RAWDATA: 9,
            UNKNOWN: 10
        }), cc.macro.BlendFactor = cc.Enum({
            ONE: 1,
            ZERO: 0,
            SRC_ALPHA: 770,
            SRC_COLOR: 768,
            DST_ALPHA: 772,
            DST_COLOR: 774,
            ONE_MINUS_SRC_ALPHA: 771,
            ONE_MINUS_SRC_COLOR: 769,
            ONE_MINUS_DST_ALPHA: 773,
            ONE_MINUS_DST_COLOR: 775
        }), cc.macro.TextAlignment = cc.Enum({
            LEFT: 0,
            CENTER: 1,
            RIGHT: 2
        }), cc.macro.VerticalTextAlignment = cc.Enum({
            TOP: 0,
            CENTER: 1,
            BOTTOM: 2
        }), e.exports = cc.macro;
    }, {
        "./js": 102
    } ],
    88: [ function(t, e, i) {
        var n = t("./js"), r = t("./CCClass"), s = 1;
        function a() {
            this._name = "", this._objFlags = 0;
        }
        r.fastDefine("cc.Object", a, {
            _name: "",
            _objFlags: 0
        }), n.value(a, "Flags", {
            Destroyed: s,
            DontSave: 8,
            EditorOnly: 16,
            Dirty: 32,
            DontDestroy: 64,
            PersistentMask: -4192741,
            Destroying: 128,
            Deactivating: 256,
            LockedInEditor: 512,
            IsPreloadStarted: 8192,
            IsOnLoadStarted: 32768,
            IsOnLoadCalled: 16384,
            IsOnEnableCalled: 2048,
            IsStartCalled: 65536,
            IsEditorOnEnableCalled: 4096,
            IsPositionLocked: 1 << 21,
            IsRotationLocked: 1 << 17,
            IsScaleLocked: 1 << 18,
            IsAnchorLocked: 1 << 19,
            IsSizeLocked: 1 << 20
        });
        var o = [];
        function c() {
            for (var t = o.length, e = 0; e < t; ++e) {
                var i = o[e];
                i._objFlags & s || i._destroyImmediate();
            }
            t === o.length ? o.length = 0 : o.splice(0, t);
        }
        n.value(a, "_deferredDestroy", c);
        var h = a.prototype;
        n.getset(h, "name", function() {
            return this._name;
        }, function(t) {
            this._name = t;
        }, !0), n.get(h, "isValid", function() {
            return !(this._objFlags & s);
        }, !0);
        h.destroy = function() {
            return this._objFlags & s ? (cc.warnID(5e3), !1) : !(4 & this._objFlags) && (this._objFlags |= 4, 
            o.push(this), !0);
        }, h._destruct = function() {
            var t = this.constructor, e = t.__destruct__;
            e || (e = function(t, e) {
                var i, n = t instanceof cc._BaseNode || t instanceof cc.Component, r = n ? "_id" : null, s = {};
                for (i in t) if (t.hasOwnProperty(i)) {
                    if (i === r) continue;
                    switch (typeof t[i]) {
                      case "string":
                        s[i] = "";
                        break;

                      case "object":
                      case "function":
                        s[i] = null;
                    }
                }
                if (cc.Class._isCCClass(e)) for (var a = cc.Class.Attr.getClassAttrs(e), o = e.__props__, c = 0; c < o.length; c++) {
                    var h = (i = o[c]) + cc.Class.Attr.DELIMETER + "default";
                    if (h in a) {
                        if (n && "_id" === i) continue;
                        switch (typeof a[h]) {
                          case "string":
                            s[i] = "";
                            break;

                          case "object":
                          case "function":
                            s[i] = null;
                            break;

                          case "undefined":
                            s[i] = void 0;
                        }
                    }
                }
                return function(t) {
                    for (var e in s) t[e] = s[e];
                };
            }(this, t), n.value(t, "__destruct__", e, !0)), e(this);
        }, h._onPreDestroy = null, h._destroyImmediate = function() {
            this._objFlags & s ? cc.errorID(5e3) : (this._onPreDestroy && this._onPreDestroy(), 
            this._destruct(), this._objFlags |= s);
        }, h._deserialize = null, cc.isValid = function(t, e) {
            return "object" == typeof t ? !(!t || t._objFlags & (e ? 4 | s : s)) : void 0 !== t;
        }, cc.Object = e.exports = a;
    }, {
        "./CCClass": 82,
        "./js": 102
    } ],
    89: [ function(t, e, i) {
        var n = t("../platform/js");
        cc.SAXParser = function() {
            window.DOMParser ? (this._isSupportDOMParser = !0, this._parser = new DOMParser()) : (this._isSupportDOMParser = !1, 
            this._parser = null);
        }, cc.SAXParser.prototype = {
            constructor: cc.SAXParser,
            parse: function(t) {
                return this._parseXML(t);
            },
            _parseXML: function(t) {
                var e;
                return this._isSupportDOMParser ? e = this._parser.parseFromString(t, "text/xml") : ((e = new ActiveXObject("Microsoft.XMLDOM")).async = "false", 
                e.loadXML(t)), e;
            }
        }, cc.PlistParser = function() {
            cc.SAXParser.call(this);
        }, n.extend(cc.PlistParser, cc.SAXParser), n.mixin(cc.PlistParser.prototype, {
            parse: function(t) {
                var e = this._parseXML(t), i = e.documentElement;
                if ("plist" !== i.tagName) return cc.warnID(5100), {};
                for (var n = null, r = 0, s = i.childNodes.length; r < s && 1 !== (n = i.childNodes[r]).nodeType; r++) ;
                return e = null, this._parseNode(n);
            },
            _parseNode: function(t) {
                var e = null, i = t.tagName;
                if ("dict" === i) e = this._parseDict(t); else if ("array" === i) e = this._parseArray(t); else if ("string" === i) if (1 === t.childNodes.length) e = t.firstChild.nodeValue; else {
                    e = "";
                    for (var n = 0; n < t.childNodes.length; n++) e += t.childNodes[n].nodeValue;
                } else "false" === i ? e = !1 : "true" === i ? e = !0 : "real" === i ? e = parseFloat(t.firstChild.nodeValue) : "integer" === i && (e = parseInt(t.firstChild.nodeValue, 10));
                return e;
            },
            _parseArray: function(t) {
                for (var e = [], i = 0, n = t.childNodes.length; i < n; i++) {
                    var r = t.childNodes[i];
                    1 === r.nodeType && e.push(this._parseNode(r));
                }
                return e;
            },
            _parseDict: function(t) {
                for (var e = {}, i = null, n = 0, r = t.childNodes.length; n < r; n++) {
                    var s = t.childNodes[n];
                    1 === s.nodeType && ("key" === s.tagName ? i = s.firstChild.nodeValue : e[i] = this._parseNode(s));
                }
                return e;
            }
        }), cc.saxParser = new cc.SAXParser(), cc.plistParser = new cc.PlistParser(), e.exports = {
            saxParser: cc.saxParser,
            plistParser: cc.plistParser
        };
    }, {
        "../platform/js": 102
    } ],
    90: [ function(t, e, i) {
        cc.screen = {
            _supportsFullScreen: !1,
            _preOnFullScreenChange: null,
            _touchEvent: "",
            _fn: null,
            _fnMap: [ [ "requestFullscreen", "exitFullscreen", "fullscreenchange", "fullscreenEnabled", "fullscreenElement" ], [ "requestFullScreen", "exitFullScreen", "fullScreenchange", "fullScreenEnabled", "fullScreenElement" ], [ "webkitRequestFullScreen", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitIsFullScreen", "webkitCurrentFullScreenElement" ], [ "mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozFullScreen", "mozFullScreenElement" ], [ "msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "msFullscreenEnabled", "msFullscreenElement" ] ],
            init: function() {
                this._fn = {};
                var t, e, i, n, r = this._fnMap;
                for (t = 0, e = r.length; t < e; t++) if ((i = r[t]) && void 0 !== document[i[1]]) {
                    for (t = 0, n = i.length; t < n; t++) this._fn[r[0][t]] = i[t];
                    break;
                }
                this._supportsFullScreen = void 0 !== this._fn.requestFullscreen, this._touchEvent = "ontouchstart" in window ? "touchstart" : "mousedown";
            },
            fullScreen: function() {
                return !!this._supportsFullScreen && !!(document[this._fn.fullscreenElement] || document[this._fn.webkitFullscreenElement] || document[this._fn.mozFullScreenElement]);
            },
            requestFullScreen: function(t, e) {
                if (t && "video" === t.tagName.toLowerCase()) {
                    if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && t.readyState > 0) return void (t.webkitEnterFullscreen && t.webkitEnterFullscreen());
                    t.setAttribute("x5-video-player-fullscreen", "true");
                }
                if (this._supportsFullScreen) {
                    if (t = t || document.documentElement, e) {
                        var i = this._fn.fullscreenchange;
                        this._preOnFullScreenChange && document.removeEventListener(i, this._preOnFullScreenChange), 
                        this._preOnFullScreenChange = e, document.addEventListener(i, e, !1);
                    }
                    return t[this._fn.requestFullscreen]();
                }
            },
            exitFullScreen: function(t) {
                if (t && "video" === t.tagName.toLowerCase()) {
                    if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser) return void (t.webkitExitFullscreen && t.webkitExitFullscreen());
                    t.setAttribute("x5-video-player-fullscreen", "false");
                }
                return !this._supportsFullScreen || document[this._fn.exitFullscreen]();
            },
            autoFullScreen: function(t, e) {
                t = t || document.body;
                var i = cc.game.canvas || t, n = this;
                this.requestFullScreen(t, e), i.addEventListener(this._touchEvent, function r() {
                    i.removeEventListener(n._touchEvent, r), n.requestFullScreen(t, e);
                });
            }
        }, cc.screen.init();
    }, {} ],
    91: [ function(t, e, i) {
        var n = void 0;
        n = window._CCSettings ? _CCSettings.platform : void 0;
        var r = cc && cc.sys ? cc.sys : function() {
            cc.sys = {};
            var t, e = cc.sys;
            e.LANGUAGE_ENGLISH = "en", e.LANGUAGE_CHINESE = "zh", e.LANGUAGE_FRENCH = "fr", 
            e.LANGUAGE_ITALIAN = "it", e.LANGUAGE_GERMAN = "de", e.LANGUAGE_SPANISH = "es", 
            e.LANGUAGE_DUTCH = "du", e.LANGUAGE_RUSSIAN = "ru", e.LANGUAGE_KOREAN = "ko", e.LANGUAGE_JAPANESE = "ja", 
            e.LANGUAGE_HUNGARIAN = "hu", e.LANGUAGE_PORTUGUESE = "pt", e.LANGUAGE_ARABIC = "ar", 
            e.LANGUAGE_NORWEGIAN = "no", e.LANGUAGE_POLISH = "pl", e.LANGUAGE_TURKISH = "tr", 
            e.LANGUAGE_UKRAINIAN = "uk", e.LANGUAGE_ROMANIAN = "ro", e.LANGUAGE_BULGARIAN = "bg", 
            e.LANGUAGE_UNKNOWN = "unknown", e.OS_IOS = "iOS", e.OS_ANDROID = "Android", e.OS_WINDOWS = "Windows", 
            e.OS_MARMALADE = "Marmalade", e.OS_LINUX = "Linux", e.OS_BADA = "Bada", e.OS_BLACKBERRY = "Blackberry", 
            e.OS_OSX = "OS X", e.OS_WP8 = "WP8", e.OS_WINRT = "WINRT", e.OS_UNKNOWN = "Unknown", 
            e.UNKNOWN = -1, e.WIN32 = 0, e.LINUX = 1, e.MACOS = 2, e.ANDROID = 3, e.IPHONE = 4, 
            e.IPAD = 5, e.BLACKBERRY = 6, e.NACL = 7, e.EMSCRIPTEN = 8, e.TIZEN = 9, e.WINRT = 10, 
            e.WP8 = 11, e.MOBILE_BROWSER = 100, e.DESKTOP_BROWSER = 101, e.EDITOR_PAGE = 102, 
            e.EDITOR_CORE = 103, e.WECHAT_GAME = 104, e.QQ_PLAY = 105, e.FB_PLAYABLE_ADS = 106, 
            e.BAIDU_GAME = 107, e.VIVO_GAME = 108, e.OPPO_GAME = 109, e.BROWSER_TYPE_WECHAT = "wechat", 
            e.BROWSER_TYPE_WECHAT_GAME = "wechatgame", e.BROWSER_TYPE_WECHAT_GAME_SUB = "wechatgamesub", 
            e.BROWSER_TYPE_BAIDU_GAME = "baidugame", e.BROWSER_TYPE_BAIDU_GAME_SUB = "baidugamesub", 
            e.BROWSER_TYPE_QQ_PLAY = "qqplay", e.BROWSER_TYPE_ANDROID = "androidbrowser", e.BROWSER_TYPE_IE = "ie", 
            e.BROWSER_TYPE_QQ = "qqbrowser", e.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser", e.BROWSER_TYPE_UC = "ucbrowser", 
            e.BROWSER_TYPE_UCBS = "ucbs", e.BROWSER_TYPE_360 = "360browser", e.BROWSER_TYPE_BAIDU_APP = "baiduboxapp", 
            e.BROWSER_TYPE_BAIDU = "baidubrowser", e.BROWSER_TYPE_MAXTHON = "maxthon", e.BROWSER_TYPE_OPERA = "opera", 
            e.BROWSER_TYPE_OUPENG = "oupeng", e.BROWSER_TYPE_MIUI = "miuibrowser", e.BROWSER_TYPE_FIREFOX = "firefox", 
            e.BROWSER_TYPE_SAFARI = "safari", e.BROWSER_TYPE_CHROME = "chrome", e.BROWSER_TYPE_LIEBAO = "liebao", 
            e.BROWSER_TYPE_QZONE = "qzone", e.BROWSER_TYPE_SOUGOU = "sogou", e.BROWSER_TYPE_UNKNOWN = "unknown", 
            e.isNative = !1, e.isBrowser = "object" == typeof window && "object" == typeof document && !1;
            var i = wx.getSystemInfoSync();
            e.isMobile = !0, e.platform = e.WECHAT_GAME, e.language = i.language.substr(0, 2), 
            e.languageCode = i.language.toLowerCase();
            var n = i.system.toLowerCase();
            "android" === i.platform ? e.os = e.OS_ANDROID : "ios" === i.platform ? e.os = e.OS_IOS : "devtools" === i.platform && (e.isMobile = !1, 
            n.indexOf("android") > -1 ? e.os = e.OS_ANDROID : n.indexOf("ios") > -1 && (e.os = e.OS_IOS)), 
            "android p" === n && (n = "android p 9.0");
            var r = /[\d\.]+/.exec(n);
            e.osVersion = r ? r[0] : n, e.osMainVersion = parseInt(e.osVersion), e.browserType = e.BROWSER_TYPE_WECHAT_GAME_SUB, 
            e.browserVersion = i.version;
            var s = i.windowWidth, a = i.windowHeight, o = i.pixelRatio || 1;
            e.windowPixelResolution = {
                width: o * s,
                height: o * a
            }, e.localStorage = window.localStorage;
            var c = t = !1;
            try {
                var h = document.createElement("canvas");
                c = h.getContext("webgl"), t = h.toDataURL("image/webp").startsWith("data:image/webp");
            } catch (t) {}
            return e.capabilities = {
                canvas: !0,
                opengl: !!c,
                webp: t
            }, e.__audioSupport = {
                ONLY_ONE: !1,
                WEB_AUDIO: !1,
                DELAY_CREATE_CTX: !1,
                format: [ ".mp3" ]
            }, e.NetworkType = {
                NONE: 0,
                LAN: 1,
                WWAN: 2
            }, e.getNetworkType = function() {
                return e.NetworkType.LAN;
            }, e.getBatteryLevel = function() {
                return 1;
            }, e.garbageCollect = function() {}, e.restartVM = function() {}, e.getSafeAreaRect = function() {
                var t = cc.view.getVisibleSize();
                return cc.rect(0, 0, t.width, t.height);
            }, e.isObjectValid = function(t) {
                return !!t;
            }, e.dump = function() {
                var t = "";
                t += "isMobile : " + this.isMobile + "\r\n", t += "language : " + this.language + "\r\n", 
                t += "browserType : " + this.browserType + "\r\n", t += "browserVersion : " + this.browserVersion + "\r\n", 
                t += "capabilities : " + JSON.stringify(this.capabilities) + "\r\n", t += "os : " + this.os + "\r\n", 
                t += "osVersion : " + this.osVersion + "\r\n", t += "platform : " + this.platform + "\r\n", 
                t += "Using " + (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? "WEBGL" : "CANVAS") + " renderer.\r\n", 
                cc.log(t);
            }, e.openURL = function(t) {
                window.open(t);
            }, e.now = function() {
                return Date.now ? Date.now() : +new Date();
            }, e;
        }();
        e.exports = r;
    }, {} ],
    92: [ function(t, e, i) {
        var n = t("../event/event-target"), r = t("../platform/js"), s = t("../renderer");
        t("../platform/CCClass");
        var a = cc.sys.platform === cc.sys.BAIDU_GAME, o = {
            init: function() {
                0;
            },
            availWidth: function(t) {
                return t && t !== this.html ? t.clientWidth : window.innerWidth;
            },
            availHeight: function(t) {
                return t && t !== this.html ? t.clientHeight : window.innerHeight;
            },
            meta: {
                width: "device-width"
            },
            adaptationType: cc.sys.browserType
        };
        switch (cc.sys.os === cc.sys.OS_IOS && (o.adaptationType = cc.sys.BROWSER_TYPE_SAFARI), 
        a && (cc.sys.browserType === cc.sys.BROWSER_TYPE_BAIDU_GAME_SUB ? o.adaptationType = cc.sys.BROWSER_TYPE_BAIDU_GAME_SUB : o.adaptationType = cc.sys.BROWSER_TYPE_BAIDU_GAME), 
        cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB ? o.adaptationType = cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB : o.adaptationType = cc.sys.BROWSER_TYPE_WECHAT_GAME, 
        o.adaptationType) {
          case cc.sys.BROWSER_TYPE_SAFARI:
            o.meta["minimal-ui"] = "true";

          case cc.sys.BROWSER_TYPE_SOUGOU:
          case cc.sys.BROWSER_TYPE_UC:
            o.availWidth = function(t) {
                return t.clientWidth;
            }, o.availHeight = function(t) {
                return t.clientHeight;
            };
            break;

          case cc.sys.BROWSER_TYPE_WECHAT_GAME:
            o.availWidth = function() {
                return window.innerWidth;
            }, o.availHeight = function() {
                return window.innerHeight;
            };
            break;

          case cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB:
            var c = window.sharedCanvas || wx.getSharedCanvas();
            o.availWidth = function() {
                return c.width;
            }, o.availHeight = function() {
                return c.height;
            };
        }
        var h = null, l = function() {
            n.call(this);
            var t = this, e = cc.ContainerStrategy, i = cc.ContentStrategy;
            o.init(this), t._frameSize = cc.size(0, 0), t._designResolutionSize = cc.size(0, 0), 
            t._originalDesignResolutionSize = cc.size(0, 0), t._scaleX = 1, t._scaleY = 1, t._viewportRect = cc.rect(0, 0, 0, 0), 
            t._visibleRect = cc.rect(0, 0, 0, 0), t._autoFullScreen = !1, t._devicePixelRatio = 1, 
            t._maxPixelRatio = 2, t._retinaEnabled = !1, t._resizeCallback = null, t._resizing = !1, 
            t._resizeWithBrowserSize = !1, t._orientationChanging = !0, t._isRotated = !1, t._orientation = cc.macro.ORIENTATION_AUTO, 
            t._isAdjustViewport = !0, t._antiAliasEnabled = !1, t._resolutionPolicy = null, 
            t._rpExactFit = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.EXACT_FIT), t._rpShowAll = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.SHOW_ALL), 
            t._rpNoBorder = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.NO_BORDER), t._rpFixedHeight = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.FIXED_HEIGHT), 
            t._rpFixedWidth = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.FIXED_WIDTH), cc.game.once(cc.game.EVENT_ENGINE_INITED, this.init, this);
        };
        cc.js.extend(l, n), cc.js.mixin(l.prototype, {
            init: function() {
                this._initFrameSize(), this.enableAntiAlias(!0);
                var t = cc.game.canvas.width, e = cc.game.canvas.height;
                this._designResolutionSize.width = t, this._designResolutionSize.height = e, this._originalDesignResolutionSize.width = t, 
                this._originalDesignResolutionSize.height = e, this._viewportRect.width = t, this._viewportRect.height = e, 
                this._visibleRect.width = t, this._visibleRect.height = e, cc.winSize.width = this._visibleRect.width, 
                cc.winSize.height = this._visibleRect.height, cc.visibleRect && cc.visibleRect.init(this._visibleRect);
            },
            _resizeEvent: function(t) {
                var e, i = (e = this.setDesignResolutionSize ? this : cc.view)._frameSize.width, n = e._frameSize.height, r = e._isRotated;
                if (cc.sys.isMobile) {
                    var s = cc.game.container.style, a = s.margin;
                    s.margin = "0", s.display = "none", e._initFrameSize(), s.margin = a, s.display = "block";
                } else e._initFrameSize();
                if (!0 === t || e._isRotated !== r || e._frameSize.width !== i || e._frameSize.height !== n) {
                    var o = e._originalDesignResolutionSize.width, c = e._originalDesignResolutionSize.height;
                    e._resizing = !0, o > 0 && e.setDesignResolutionSize(o, c, e._resolutionPolicy), 
                    e._resizing = !1, e.emit("canvas-resize"), e._resizeCallback && e._resizeCallback.call();
                }
            },
            _orientationChange: function() {
                cc.view._orientationChanging = !0, cc.view._resizeEvent();
            },
            resizeWithBrowserSize: function(t) {
                t ? this._resizeWithBrowserSize || (this._resizeWithBrowserSize = !0, window.addEventListener("resize", this._resizeEvent), 
                window.addEventListener("orientationchange", this._orientationChange)) : this._resizeWithBrowserSize && (this._resizeWithBrowserSize = !1, 
                window.removeEventListener("resize", this._resizeEvent), window.removeEventListener("orientationchange", this._orientationChange));
            },
            setResizeCallback: function(t) {
                "function" != typeof t && null != t || (this._resizeCallback = t);
            },
            setOrientation: function(t) {
                if ((t &= cc.macro.ORIENTATION_AUTO) && this._orientation !== t) {
                    this._orientation = t;
                    var e = this._originalDesignResolutionSize.width, i = this._originalDesignResolutionSize.height;
                    this.setDesignResolutionSize(e, i, this._resolutionPolicy);
                }
            },
            _initFrameSize: function() {
                var t = this._frameSize, e = o.availWidth(cc.game.frame), i = o.availHeight(cc.game.frame), n = e >= i;
                !cc.sys.isMobile || n && this._orientation & cc.macro.ORIENTATION_LANDSCAPE || !n && this._orientation & cc.macro.ORIENTATION_PORTRAIT ? (t.width = e, 
                t.height = i, cc.game.container.style["-webkit-transform"] = "rotate(0deg)", cc.game.container.style.transform = "rotate(0deg)", 
                this._isRotated = !1) : (t.width = i, t.height = e, cc.game.container.style["-webkit-transform"] = "rotate(90deg)", 
                cc.game.container.style.transform = "rotate(90deg)", cc.game.container.style["-webkit-transform-origin"] = "0px 0px 0px", 
                cc.game.container.style.transformOrigin = "0px 0px 0px", this._isRotated = !0), 
                this._orientationChanging && setTimeout(function() {
                    cc.view._orientationChanging = !1;
                }, 1e3);
            },
            _adjustSizeKeepCanvasSize: function() {
                var t = this._originalDesignResolutionSize.width, e = this._originalDesignResolutionSize.height;
                t > 0 && this.setDesignResolutionSize(t, e, this._resolutionPolicy);
            },
            _setViewportMeta: function(t, e) {
                var i = document.getElementById("cocosMetaElement");
                i && e && document.head.removeChild(i);
                var n, r, s, a = document.getElementsByName("viewport"), o = a ? a[0] : null;
                for (r in n = o ? o.content : "", (i = i || document.createElement("meta")).id = "cocosMetaElement", 
                i.name = "viewport", i.content = "", t) -1 == n.indexOf(r) ? n += "," + r + "=" + t[r] : e && (s = new RegExp(r + "s*=s*[^,]+"), 
                n.replace(s, r + "=" + t[r]));
                /^,/.test(n) && (n = n.substr(1)), i.content = n, o && (o.content = n), document.head.appendChild(i);
            },
            _adjustViewportMeta: function() {
                this._isAdjustViewport, 0;
            },
            adjustViewportMeta: function(t) {
                this._isAdjustViewport = t;
            },
            enableRetina: function(t) {
                this._retinaEnabled = !!t;
            },
            isRetinaEnabled: function() {
                return this._retinaEnabled;
            },
            enableAntiAlias: function(t) {
                if (this._antiAliasEnabled !== t) if (this._antiAliasEnabled = t, cc.game.renderType === cc.game.RENDER_TYPE_WEBGL) {
                    var e = cc.loader._cache;
                    for (var i in e) {
                        var n = e[i], r = n && n.content instanceof cc.Texture2D ? n.content : null;
                        if (r) {
                            var s = cc.Texture2D.Filter;
                            t ? r.setFilters(s.LINEAR, s.LINEAR) : r.setFilters(s.NEAREST, s.NEAREST);
                        }
                    }
                } else if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                    var a = cc.game.canvas.getContext("2d");
                    a.imageSmoothingEnabled = t, a.mozImageSmoothingEnabled = t;
                }
            },
            isAntiAliasEnabled: function() {
                return this._antiAliasEnabled;
            },
            enableAutoFullScreen: function(t) {
                t && t !== this._autoFullScreen && cc.sys.isMobile && cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT ? (this._autoFullScreen = !0, 
                cc.screen.autoFullScreen(cc.game.frame)) : this._autoFullScreen = !1;
            },
            isAutoFullScreenEnabled: function() {
                return this._autoFullScreen;
            },
            setCanvasSize: function(t, e) {
                var i = cc.game.canvas, n = cc.game.container;
                i.width = t * this._devicePixelRatio, i.height = e * this._devicePixelRatio, i.style.width = t + "px", 
                i.style.height = e + "px", n.style.width = t + "px", n.style.height = e + "px", 
                this._resizeEvent();
            },
            getCanvasSize: function() {
                return cc.size(cc.game.canvas.width, cc.game.canvas.height);
            },
            getFrameSize: function() {
                return cc.size(this._frameSize.width, this._frameSize.height);
            },
            setFrameSize: function(t, e) {
                this._frameSize.width = t, this._frameSize.height = e, cc.game.frame.style.width = t + "px", 
                cc.game.frame.style.height = e + "px", this._resizeEvent(!0);
            },
            getVisibleSize: function() {
                return cc.size(this._visibleRect.width, this._visibleRect.height);
            },
            getVisibleSizeInPixel: function() {
                return cc.size(this._visibleRect.width * this._scaleX, this._visibleRect.height * this._scaleY);
            },
            getVisibleOrigin: function() {
                return cc.v2(this._visibleRect.x, this._visibleRect.y);
            },
            getVisibleOriginInPixel: function() {
                return cc.v2(this._visibleRect.x * this._scaleX, this._visibleRect.y * this._scaleY);
            },
            getResolutionPolicy: function() {
                return this._resolutionPolicy;
            },
            setResolutionPolicy: function(t) {
                var e = this;
                if (t instanceof cc.ResolutionPolicy) e._resolutionPolicy = t; else {
                    var i = cc.ResolutionPolicy;
                    t === i.EXACT_FIT && (e._resolutionPolicy = e._rpExactFit), t === i.SHOW_ALL && (e._resolutionPolicy = e._rpShowAll), 
                    t === i.NO_BORDER && (e._resolutionPolicy = e._rpNoBorder), t === i.FIXED_HEIGHT && (e._resolutionPolicy = e._rpFixedHeight), 
                    t === i.FIXED_WIDTH && (e._resolutionPolicy = e._rpFixedWidth);
                }
            },
            setDesignResolutionSize: function(t, e, i) {
                if (t > 0 || e > 0) {
                    this.setResolutionPolicy(i);
                    var n = this._resolutionPolicy;
                    if (n && n.preApply(this), cc.sys.isMobile && this._adjustViewportMeta(), this._orientationChanging = !0, 
                    this._resizing || this._initFrameSize(), n) {
                        this._originalDesignResolutionSize.width = this._designResolutionSize.width = t, 
                        this._originalDesignResolutionSize.height = this._designResolutionSize.height = e;
                        var r = n.apply(this, this._designResolutionSize);
                        if (r.scale && 2 === r.scale.length && (this._scaleX = r.scale[0], this._scaleY = r.scale[1]), 
                        r.viewport) {
                            var a = this._viewportRect, o = this._visibleRect, c = r.viewport;
                            a.x = c.x, a.y = c.y, a.width = c.width, a.height = c.height, o.x = 0, o.y = 0, 
                            o.width = c.width / this._scaleX, o.height = c.height / this._scaleY;
                        }
                        n.postApply(this), cc.winSize.width = this._visibleRect.width, cc.winSize.height = this._visibleRect.height, 
                        cc.visibleRect && cc.visibleRect.init(this._visibleRect), s.updateCameraViewport(), 
                        this.emit("design-resolution-changed");
                    } else cc.logID(2201);
                } else cc.logID(2200);
            },
            getDesignResolutionSize: function() {
                return cc.size(this._designResolutionSize.width, this._designResolutionSize.height);
            },
            setRealPixelResolution: function(t, e, i) {
                this.setDesignResolutionSize(t, e, i);
            },
            setViewportInPoints: function(t, e, i, n) {
                var r = this._scaleX, s = this._scaleY;
                cc.game._renderContext.viewport(t * r + this._viewportRect.x, e * s + this._viewportRect.y, i * r, n * s);
            },
            setScissorInPoints: function(t, e, i, n) {
                var r = this._scaleX, s = this._scaleY, a = Math.ceil(t * r + this._viewportRect.x), o = Math.ceil(e * s + this._viewportRect.y), c = Math.ceil(i * r), l = Math.ceil(n * s), u = cc.game._renderContext;
                if (!h) {
                    var _ = u.getParameter(u.SCISSOR_BOX);
                    h = cc.rect(_[0], _[1], _[2], _[3]);
                }
                h.x === a && h.y === o && h.width === c && h.height === l || (h.x = a, h.y = o, 
                h.width = c, h.height = l, u.scissor(a, o, c, l));
            },
            isScissorEnabled: function() {
                return cc.game._renderContext.isEnabled(gl.SCISSOR_TEST);
            },
            getScissorRect: function() {
                if (!h) {
                    var t = gl.getParameter(gl.SCISSOR_BOX);
                    h = cc.rect(t[0], t[1], t[2], t[3]);
                }
                var e = 1 / this._scaleX, i = 1 / this._scaleY;
                return cc.rect((h.x - this._viewportRect.x) * e, (h.y - this._viewportRect.y) * i, h.width * e, h.height * i);
            },
            getViewportRect: function() {
                return this._viewportRect;
            },
            getScaleX: function() {
                return this._scaleX;
            },
            getScaleY: function() {
                return this._scaleY;
            },
            getDevicePixelRatio: function() {
                return this._devicePixelRatio;
            },
            convertToLocationInView: function(t, e, i, n) {
                var r = n || cc.v2(), s = this._devicePixelRatio * (t - i.left), a = this._devicePixelRatio * (i.top + i.height - e);
                return this._isRotated ? (r.x = cc.game.canvas.width - a, r.y = s) : (r.x = s, r.y = a), 
                r;
            },
            _convertMouseToLocationInView: function(t, e) {
                var i = this._viewportRect;
                t.x = (this._devicePixelRatio * (t.x - e.left) - i.x) / this._scaleX, t.y = (this._devicePixelRatio * (e.top + e.height - t.y) - i.y) / this._scaleY;
            },
            _convertPointWithScale: function(t) {
                var e = this._viewportRect;
                t.x = (t.x - e.x) / this._scaleX, t.y = (t.y - e.y) / this._scaleY;
            },
            _convertTouchesWithScale: function(t) {
                for (var e, i, n, r = this._viewportRect, s = this._scaleX, a = this._scaleY, o = 0; o < t.length; o++) i = (e = t[o])._point, 
                n = e._prevPoint, i.x = (i.x - r.x) / s, i.y = (i.y - r.y) / a, n.x = (n.x - r.x) / s, 
                n.y = (n.y - r.y) / a;
            }
        }), cc.ContainerStrategy = cc.Class({
            name: "ContainerStrategy",
            preApply: function(t) {},
            apply: function(t, e) {},
            postApply: function(t) {},
            _setupContainer: function(t, e, i) {
                var n = cc.game.canvas;
                cc.game.container;
                var r = t._devicePixelRatio = 1;
                t.isRetinaEnabled() && (r = t._devicePixelRatio = Math.min(t._maxPixelRatio, window.devicePixelRatio || 1)), 
                n.width = e * r, n.height = i * r;
            },
            _fixContainer: function() {
                document.body.insertBefore(cc.game.container, document.body.firstChild);
                var t = document.body.style;
                t.width = window.innerWidth + "px", t.height = window.innerHeight + "px", t.overflow = "hidden";
                var e = cc.game.container.style;
                e.position = "fixed", e.left = e.top = "0px", document.body.scrollTop = 0;
            }
        }), cc.ContentStrategy = cc.Class({
            name: "ContentStrategy",
            ctor: function() {
                this._result = {
                    scale: [ 1, 1 ],
                    viewport: null
                };
            },
            _buildResult: function(t, e, i, n, r, s) {
                Math.abs(t - i) < 2 && (i = t), Math.abs(e - n) < 2 && (n = e);
                var a = cc.rect((t - i) / 2, (e - n) / 2, i, n);
                return cc.game.renderType, cc.game.RENDER_TYPE_CANVAS, this._result.scale = [ r, s ], 
                this._result.viewport = a, this._result;
            },
            preApply: function(t) {},
            apply: function(t, e) {
                return {
                    scale: [ 1, 1 ]
                };
            },
            postApply: function(t) {}
        }), function() {
            var t = cc.Class({
                name: "EqualToFrame",
                extends: cc.ContainerStrategy,
                apply: function(t) {
                    var e = t._frameSize.height, i = cc.game.container.style;
                    this._setupContainer(t, t._frameSize.width, t._frameSize.height), t._isRotated ? i.margin = "0 0 0 " + e + "px" : i.margin = "0px", 
                    i.padding = "0px";
                }
            }), e = cc.Class({
                name: "ProportionalToFrame",
                extends: cc.ContainerStrategy,
                apply: function(t, e) {
                    var i, n, r = t._frameSize.width, s = t._frameSize.height, a = cc.game.container.style, o = e.width, c = e.height, h = r / o, l = s / c;
                    h < l ? (i = r, n = c * h) : (i = o * l, n = s);
                    var u = Math.round((r - i) / 2), _ = Math.round((s - n) / 2);
                    i = r - 2 * u, n = s - 2 * _, this._setupContainer(t, i, n), t._isRotated ? a.margin = "0 0 0 " + s + "px" : a.margin = "0px", 
                    a.paddingLeft = u + "px", a.paddingRight = u + "px", a.paddingTop = _ + "px", a.paddingBottom = _ + "px";
                }
            }), i = (cc.Class({
                name: "EqualToWindow",
                extends: t,
                preApply: function(t) {
                    this._super(t), cc.game.frame = document.documentElement;
                },
                apply: function(t) {
                    this._super(t), this._fixContainer();
                }
            }), cc.Class({
                name: "ProportionalToWindow",
                extends: e,
                preApply: function(t) {
                    this._super(t), cc.game.frame = document.documentElement;
                },
                apply: function(t, e) {
                    this._super(t, e), this._fixContainer();
                }
            }), cc.Class({
                name: "OriginalContainer",
                extends: cc.ContainerStrategy,
                apply: function(t) {
                    this._setupContainer(t, cc.game.canvas.width, cc.game.canvas.height);
                }
            }));
            cc.ContainerStrategy.EQUAL_TO_FRAME = new t(), cc.ContainerStrategy.PROPORTION_TO_FRAME = new e(), 
            cc.ContainerStrategy.ORIGINAL_CONTAINER = new i();
            var n = cc.Class({
                name: "ExactFit",
                extends: cc.ContentStrategy,
                apply: function(t, e) {
                    var i = cc.game.canvas.width, n = cc.game.canvas.height, r = i / e.width, s = n / e.height;
                    return this._buildResult(i, n, i, n, r, s);
                }
            }), r = cc.Class({
                name: "ShowAll",
                extends: cc.ContentStrategy,
                apply: function(t, e) {
                    var i, n, r = cc.game.canvas.width, s = cc.game.canvas.height, a = e.width, o = e.height, c = r / a, h = s / o, l = 0;
                    return c < h ? (i = r, n = o * (l = c)) : (i = a * (l = h), n = s), this._buildResult(r, s, i, n, l, l);
                }
            }), s = cc.Class({
                name: "NoBorder",
                extends: cc.ContentStrategy,
                apply: function(t, e) {
                    var i, n, r, s = cc.game.canvas.width, a = cc.game.canvas.height, o = e.width, c = e.height, h = s / o, l = a / c;
                    return h < l ? (n = o * (i = l), r = a) : (n = s, r = c * (i = h)), this._buildResult(s, a, n, r, i, i);
                }
            }), a = cc.Class({
                name: "FixedHeight",
                extends: cc.ContentStrategy,
                apply: function(t, e) {
                    var i = cc.game.canvas.width, n = cc.game.canvas.height, r = n / e.height, s = i, a = n;
                    return this._buildResult(i, n, s, a, r, r);
                }
            }), o = cc.Class({
                name: "FixedWidth",
                extends: cc.ContentStrategy,
                apply: function(t, e) {
                    var i = cc.game.canvas.width, n = cc.game.canvas.height, r = i / e.width, s = i, a = n;
                    return this._buildResult(i, n, s, a, r, r);
                }
            });
            cc.ContentStrategy.EXACT_FIT = new n(), cc.ContentStrategy.SHOW_ALL = new r(), cc.ContentStrategy.NO_BORDER = new s(), 
            cc.ContentStrategy.FIXED_HEIGHT = new a(), cc.ContentStrategy.FIXED_WIDTH = new o();
        }(), cc.ResolutionPolicy = cc.Class({
            name: "cc.ResolutionPolicy",
            ctor: function(t, e) {
                this._containerStrategy = null, this._contentStrategy = null, this.setContainerStrategy(t), 
                this.setContentStrategy(e);
            },
            preApply: function(t) {
                this._containerStrategy.preApply(t), this._contentStrategy.preApply(t);
            },
            apply: function(t, e) {
                return this._containerStrategy.apply(t, e), this._contentStrategy.apply(t, e);
            },
            postApply: function(t) {
                this._containerStrategy.postApply(t), this._contentStrategy.postApply(t);
            },
            setContainerStrategy: function(t) {
                t instanceof cc.ContainerStrategy && (this._containerStrategy = t);
            },
            setContentStrategy: function(t) {
                t instanceof cc.ContentStrategy && (this._contentStrategy = t);
            }
        }), r.get(cc.ResolutionPolicy.prototype, "canvasSize", function() {
            return cc.v2(cc.game.canvas.width, cc.game.canvas.height);
        }), cc.ResolutionPolicy.EXACT_FIT = 0, cc.ResolutionPolicy.NO_BORDER = 1, cc.ResolutionPolicy.SHOW_ALL = 2, 
        cc.ResolutionPolicy.FIXED_HEIGHT = 3, cc.ResolutionPolicy.FIXED_WIDTH = 4, cc.ResolutionPolicy.UNKNOWN = 5, 
        cc.view = new l(), cc.winSize = cc.v2(), e.exports = cc.view;
    }, {
        "../event/event-target": 50,
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "../renderer": 123
    } ],
    93: [ function(t, e, i) {
        cc.visibleRect = {
            topLeft: cc.v2(0, 0),
            topRight: cc.v2(0, 0),
            top: cc.v2(0, 0),
            bottomLeft: cc.v2(0, 0),
            bottomRight: cc.v2(0, 0),
            bottom: cc.v2(0, 0),
            center: cc.v2(0, 0),
            left: cc.v2(0, 0),
            right: cc.v2(0, 0),
            width: 0,
            height: 0,
            init: function(t) {
                var e = this.width = t.width, i = this.height = t.height, n = t.x, r = t.y, s = r + i, a = n + e;
                this.topLeft.x = n, this.topLeft.y = s, this.topRight.x = a, this.topRight.y = s, 
                this.top.x = n + e / 2, this.top.y = s, this.bottomLeft.x = n, this.bottomLeft.y = r, 
                this.bottomRight.x = a, this.bottomRight.y = r, this.bottom.x = n + e / 2, this.bottom.y = r, 
                this.center.x = n + e / 2, this.center.y = r + i / 2, this.left.x = n, this.left.y = r + i / 2, 
                this.right.x = a, this.right.y = r + i / 2;
            }
        };
    }, {} ],
    94: [ function(t, e, i) {
        var n = t("./js"), r = (t("./utils").isPlainEmptyObj_DEV, "$_$");
        function s(t, e, i) {
            var r;
            r = function() {}, i && n.extend(r, i.constructor);
            var s = new r();
            return n.value(t, "__attrs__", s), s;
        }
        function a(t, e, i) {
            var n, a, c;
            if ("function" == typeof t) a = (n = o(t)).constructor.prototype; else {
                var h = t;
                if (!(n = h.__attrs__)) n = s(h, 0, o(t = h.constructor));
                a = n;
            }
            if (void 0 === i) {
                var l = e + r, u = {};
                for (c in n) c.startsWith(l) && (u[c.slice(l.length)] = n[c]);
                return u;
            }
            if ("object" == typeof i) for (c in i) 95 !== c.charCodeAt(0) && (a[e + r + c] = i[c]); else 0;
        }
        function o(t) {
            return t.hasOwnProperty("__attrs__") && t.__attrs__ || function(t) {
                for (var e, i = cc.Class.getInheritanceChain(t), n = i.length - 1; n >= 0; n--) {
                    var r = i[n];
                    r.hasOwnProperty("__attrs__") && r.__attrs__ || s(r, 0, (e = i[n + 1]) && e.__attrs__);
                }
                return s(t, 0, (e = i[0]) && e.__attrs__), t.__attrs__;
            }(t);
        }
        function c(t) {
            return o(t).constructor.prototype;
        }
        function h(t, e) {
            0;
        }
        cc.Integer = "Integer", cc.Float = "Float", cc.Boolean = "Boolean", cc.String = "String", 
        e.exports = {
            attr: a,
            getClassAttrs: o,
            getClassAttrsProto: c,
            setClassAttr: function(t, e, i, n) {
                c(t)[e + r + i] = n;
            },
            DELIMETER: r,
            getTypeChecker: h,
            ObjectType: function(t) {
                return {
                    type: "Object",
                    ctor: t,
                    _onAfterProp: !1
                };
            },
            ScriptUuid: {}
        };
    }, {
        "./CCClass": 82,
        "./js": 102,
        "./utils": 106
    } ],
    95: [ function(t, e, i) {
        var n = t("./js"), r = n.array.fastRemoveAt;
        function s() {
            this.callbacks = [], this.targets = [], this.isInvoking = !1, this.containCanceled = !1;
        }
        var a = s.prototype;
        a.removeBy = function(t, e) {
            for (var i = this.callbacks, n = this.targets, s = 0; s < t.length; ++s) t[s] === e && (r(i, s), 
            r(n, s), --s);
        }, a.cancel = function(t) {
            this.callbacks[t] = this.targets[t] = null, this.containCanceled = !0;
        }, a.cancelAll = function() {
            for (var t = this.callbacks, e = this.targets, i = 0; i < t.length; i++) t[i] = e[i] = null;
            this.containCanceled = !0;
        }, a.purgeCanceled = function() {
            this.removeBy(this.callbacks, null), this.containCanceled = !1;
        };
        var o = new n.Pool(function(t) {
            t.callbacks.length = 0, t.targets.length = 0, t.isInvoking = !1, t.containCanceled = !1;
        }, 16);
        function c() {
            this._callbackTable = n.createMap(!0);
        }
        o.get = function() {
            return this._get() || new s();
        }, (a = c.prototype).add = function(t, e, i) {
            var n = this._callbackTable[t];
            n || (n = this._callbackTable[t] = o.get()), n.callbacks.push(e), n.targets.push(i || null);
        }, a.hasEventListener = function(t, e, i) {
            var n = this._callbackTable[t];
            if (!n) return !1;
            var r = n.callbacks;
            if (!e) {
                if (n.isInvoking) {
                    for (var s = 0; s < r.length; s++) if (r[s]) return !0;
                    return !1;
                }
                return r.length > 0;
            }
            i = i || null;
            for (var a = n.targets, o = 0; o < r.length; ++o) if (r[o] === e && a[o] === i) return !0;
            return !1;
        }, a.removeAll = function(t) {
            if ("string" == typeof t) {
                var e = this._callbackTable[t];
                e && (e.isInvoking ? e.cancelAll() : (o.put(e), delete this._callbackTable[t]));
            } else if (t) for (var i in this._callbackTable) {
                var n = this._callbackTable[i];
                if (n.isInvoking) for (var r = n.targets, s = 0; s < r.length; ++s) r[s] === t && n.cancel(s); else n.removeBy(n.targets, t);
            }
        }, a.remove = function(t, e, i) {
            var n = this._callbackTable[t];
            if (n) {
                i = i || null;
                for (var s = n.callbacks, a = n.targets, o = 0; o < s.length; ++o) if (s[o] === e && a[o] === i) {
                    n.isInvoking ? n.cancel(o) : (r(s, o), r(a, o));
                    break;
                }
            }
        };
        var h = function() {
            c.call(this);
        };
        n.extend(h, c), h.prototype.invoke = function(t, e, i, n, r, s) {
            var a = this._callbackTable[t];
            if (a) {
                var o = !a.isInvoking;
                a.isInvoking = !0;
                for (var c = a.callbacks, h = a.targets, l = 0, u = c.length; l < u; ++l) {
                    var _ = c[l];
                    if (_) {
                        var d = h[l];
                        d ? _.call(d, e, i, n, r, s) : _(e, i, n, r, s);
                    }
                }
                o && (a.isInvoking = !1, a.containCanceled && a.purgeCanceled());
            }
        }, h.CallbacksHandler = c, e.exports = h;
    }, {
        "./js": 102
    } ],
    96: [ function(t, e, i) {
        e.exports = {
            flattenCodeArray: function(t) {
                var e = [];
                return function t(e, i) {
                    for (var n = 0; n < i.length; n++) {
                        var r = i[n];
                        Array.isArray(r) ? t(e, r) : e.push(r);
                    }
                }(e, t), e.join("");
            }
        };
    }, {} ],
    97: [ function(t, e, i) {
        var n = t("./js"), r = t("./attribute"), s = t("./CCClass"), a = t("../utils/misc"), o = function() {
            this.uuidList = [], this.uuidObjList = [], this.uuidPropList = [], this._stillUseUrl = n.createMap(!0);
        };
        o.prototype.reset = function() {
            this.uuidList.length = 0, this.uuidObjList.length = 0, this.uuidPropList.length = 0, 
            n.clear(this._stillUseUrl);
        }, o.prototype.push = function(t, e, i, n) {
            n && (this._stillUseUrl[this.uuidList.length] = !0), this.uuidList.push(i), this.uuidObjList.push(t), 
            this.uuidPropList.push(e);
        }, (o.pool = new n.Pool(function(t) {
            t.reset();
        }, 10)).get = function() {
            return this._get() || new o();
        };
        var c = function() {
            function t(t, e, i, n, r) {
                this.result = t, this.customEnv = n, this.deserializedList = [], this.deserializedData = null, 
                this._classFinder = i, this._idList = [], this._idObjList = [], this._idPropList = [];
            }
            var e = t.prototype;
            e.deserialize = function(t) {
                if (Array.isArray(t)) {
                    var e = t, i = e.length;
                    this.deserializedList.length = i;
                    for (var n = 0; n < i; n++) {
                        if (e[n]) this.deserializedList[n] = this._deserializeObject(e[n], !1);
                    }
                    this.deserializedData = i > 0 ? this.deserializedList[0] : [];
                } else this.deserializedList.length = 1, this.deserializedData = t ? this._deserializeObject(t, !1) : null, 
                this.deserializedList[0] = this.deserializedData;
                return function(t) {
                    var e, i, n, r = t.deserializedList, s = t._idPropList, a = t._idList, o = t._idObjList;
                    for (t._classFinder && t._classFinder.onDereferenced, e = 0; e < a.length; e++) i = s[e], 
                    n = a[e], o[e][i] = r[n];
                }(this), this.deserializedData;
            }, e._deserializeObject = function(t, e, r, s, a) {
                var o, c = null, h = null, l = t.__type__;
                if (l) {
                    if (!(h = this._classFinder(l, t, s, a))) return this._classFinder === n._getClassById && cc.deserialize.reportMissingClass(l), 
                    null;
                    if ((c = new h())._deserialize) return c._deserialize(t.content, this), c;
                    cc.Class._isCCClass(h) ? function(t, e, r, s, a) {
                        var o;
                        s.hasOwnProperty("__deserialize__") ? o = s.__deserialize__ : (o = i(t, s), n.value(s, "__deserialize__", o, !0));
                        o(t, e, r, s, a), 0;
                    }(this, c, t, h, r) : this._deserializeTypedObject(c, t, h);
                } else if (Array.isArray(t)) {
                    c = new Array(t.length);
                    for (var u = 0; u < t.length; u++) "object" == typeof (o = t[u]) && o ? this._deserializeObjField(c, o, "" + u, null, e) : c[u] = o;
                } else c = {}, this._deserializePrimitiveObject(c, t);
                return c;
            }, e._deserializeObjField = function(t, e, i, n, r) {
                var s = e.__id__;
                if (void 0 === s) {
                    var a = e.__uuid__;
                    a ? this.result.push(t, i, a, r) : t[i] = this._deserializeObject(e, r);
                } else {
                    var o = this.deserializedList[s];
                    o ? t[i] = o : (this._idList.push(s), this._idObjList.push(t), this._idPropList.push(i));
                }
            }, e._deserializePrimitiveObject = function(t, e) {
                for (var i in e) if (e.hasOwnProperty(i)) {
                    var n = e[i];
                    "object" != typeof n ? "__type__" !== i && (t[i] = n) : n ? this._deserializeObjField(t, n, i) : t[i] = null;
                }
            }, e._deserializeTypedObject = function(t, e, i) {
                if (i === cc.Vec2) return t.x = e.x || 0, void (t.y = e.y || 0);
                if (i === cc.Vec3) return t.x = e.x || 0, t.y = e.y || 0, void (t.z = e.z || 0);
                if (i !== cc.Color) {
                    if (i === cc.Size) return t.width = e.width || 0, void (t.height = e.height || 0);
                    for (var n = r.DELIMETER + "default", a = r.getClassAttrs(i), o = i.__props__ || Object.keys(t), c = 0; c < o.length; c++) {
                        var h = o[c], l = e[h];
                        void 0 !== l && e.hasOwnProperty(h) || (l = s.getDefault(a[h + n])), "object" != typeof l ? t[h] = l : l ? this._deserializeObjField(t, l, h) : t[h] = null;
                    }
                } else {
                    t.r = e.r || 0, t.g = e.g || 0, t.b = e.b || 0;
                    var u = e.a;
                    t.a = void 0 === u ? 255 : u;
                }
            };
            var i = function(t, e) {
                var i, o = a.BUILTIN_CLASSID_RE.test(n._getClassId(e)), c = cc.js.isChildClassOf(e, cc._BaseNode) || cc.js.isChildClassOf(e, cc.Component), h = [], l = h, u = [], _ = u, d = [], f = [];
                return function() {
                    var t = e.__values__;
                    i = "_$erialized" === t[t.length - 1];
                    for (var n = r.getClassAttrs(e), a = r.DELIMETER + "type", c = r.DELIMETER + "default", p = r.DELIMETER + "saveUrlAsAsset", m = r.DELIMETER + "formerlySerializedAs", v = 0; v < t.length; v++) {
                        var g = t[v], y = g;
                        n[g + m] && (y = n[g + m]);
                        var x = n[g + p], E = s.getDefault(n[g + c]), T = !1;
                        if (o) {
                            var C = n[g + a];
                            if (void 0 === E && C) T = C === cc.String || C === cc.Integer || C === cc.Float || C === cc.Boolean; else {
                                var A = typeof E;
                                T = "string" === A && !x || "number" === A || "boolean" === A;
                            }
                        }
                        o && T ? (y !== g && l === h && (l = h.slice()), h.push(g), l !== h && l.push(y)) : (y !== g && _ === u && (_ = u.slice()), 
                        u.push(g), _ !== u && _.push(y), d.push(x), f.push(E instanceof cc.ValueType && E.constructor));
                    }
                }(), function(t, e, n, r, s) {
                    for (var a = 0; a < h.length; ++a) {
                        var p = n[l[a]];
                        void 0 !== p && (e[h[a]] = p);
                    }
                    for (var m = 0; m < u.length; ++m) {
                        var v = u[m], g = n[_[m]];
                        if (void 0 !== g) if (o || "object" == typeof g) {
                            var y = f[m];
                            y ? o || g ? t._deserializeTypedObject(e[v], g, y) : e[v] = null : g ? t._deserializeObjField(e, g, v, null, d[m]) : e[v] = null;
                        } else e[v] = g;
                    }
                    c && n._id && (e._id = n._id), i && (e._$erialized = JSON.parse(JSON.stringify(n)), 
                    t._deserializePrimitiveObject(e._$erialized, n));
                };
            };
            return t.pool = new n.Pool(function(t) {
                t.result = null, t.customEnv = null, t.deserializedList.length = 0, t.deserializedData = null, 
                t._classFinder = null, t._idList.length = 0, t._idObjList.length = 0, t._idPropList.length = 0;
            }, 1), t.pool.get = function(e, i, n, r, s) {
                var a = this._get();
                return a ? (a.result = e, a.customEnv = r, a._classFinder = n, a) : new t(e, i, n, r, s);
            }, t;
        }();
        cc.deserialize = function(t, e, i) {
            var r = (i = i || {}).classFinder || n._getClassById, s = i.createAssetRefs || cc.sys.platform === cc.sys.EDITOR_CORE, a = i.customEnv, h = i.ignoreEditorOnly;
            "string" == typeof t && (t = JSON.parse(t));
            var l = !e;
            e = e || o.pool.get();
            var u = c.pool.get(e, !1, r, a, h);
            cc.game._isCloning = !0;
            var _ = u.deserialize(t);
            return cc.game._isCloning = !1, c.pool.put(u), s && e.assignAssetsBy(Editor.serialize.asAsset), 
            l && o.pool.put(e), _;
        }, cc.deserialize.Details = o, cc.deserialize.reportMissingClass = function(t) {
            cc.warnID(5302, t);
        };
    }, {
        "../utils/misc": 159,
        "./CCClass": 82,
        "./attribute": 94,
        "./js": 102
    } ],
    98: [ function(t, e, i) {
        var n = ".";
        function r(t) {
            this.id = 0 | 998 * Math.random(), this.prefix = t ? t + n : "";
        }
        r.prototype.getNewId = function() {
            return this.prefix + ++this.id;
        }, r.global = new r("global"), e.exports = r;
    }, {} ],
    99: [ function(t, e, i) {
        t("./js"), t("./CCClass"), t("./CCClassDecorator"), t("./CCEnum"), t("./CCObject"), 
        t("./callbacks-invoker"), t("./url"), t("./deserialize"), t("./instantiate"), t("./instantiate-jit"), 
        t("./requiring-frame"), t("./CCSys"), t("./CCMacro"), t("./CCAssetLibrary"), t("./CCVisibleRect");
    }, {
        "./CCAssetLibrary": 81,
        "./CCClass": 82,
        "./CCClassDecorator": 83,
        "./CCEnum": 84,
        "./CCMacro": 87,
        "./CCObject": 88,
        "./CCSys": 91,
        "./CCVisibleRect": 93,
        "./callbacks-invoker": 95,
        "./deserialize": 97,
        "./instantiate": 101,
        "./instantiate-jit": 100,
        "./js": 102,
        "./requiring-frame": 104,
        "./url": 105
    } ],
    100: [ function(t, e, i) {
        var n = t("./CCObject"), r = n.Flags.Destroyed, s = n.Flags.PersistentMask, a = t("./attribute"), o = t("./js"), c = t("./CCClass"), h = t("./compiler"), l = a.DELIMETER + "default", u = c.IDENTIFIER_RE, _ = c.escapeForJS, d = "var ", f = "o", p = "t", m = {
            "cc.Node": "cc.Node",
            "cc.Sprite": "cc.Sprite",
            "cc.Label": "cc.Label",
            "cc.Button": "cc.Button",
            "cc.Widget": "cc.Widget",
            "cc.Animation": "cc.Animation",
            "cc.ClickEvent": !1,
            "cc.PrefabInfo": !1
        };
        function v(t, e) {
            this.varName = t, this.expression = e;
        }
        function g(t, e) {
            return e instanceof v ? new v(e.varName, t + e.expression) : t + e;
        }
        function y(t, e, i) {
            Array.isArray(i) ? (i[0] = g(e, i[0]), t.push(i)) : t.push(g(e, i) + ";");
        }
        function x(t) {
            this._exps = [], this._targetExp = t;
        }
        function E(t, e) {
            if ("function" == typeof t) try {
                t = t();
            } catch (t) {
                return !1;
            }
            if (t === e) return !0;
            if (t && e) {
                if (t instanceof cc.ValueType && t.equals(e)) return !0;
                if (Array.isArray(t) && Array.isArray(e) || t.constructor === Object && e.constructor === Object) try {
                    return Array.isArray(t) && Array.isArray(e) && 0 === t.length && 0 === e.length;
                } catch (t) {}
            }
            return !1;
        }
        function T(t) {
            return u.test(t) ? "." + t : "[" + _(t) + "]";
        }
        function C(t, e) {
            var i;
            this.parent = e, this.objsToClear_iN$t = [], this.codeArray = [], this.objs = [], 
            this.funcs = [], this.funcModuleCache = o.createMap(), o.mixin(this.funcModuleCache, m), 
            this.globalVariables = [], this.globalVariableId = 0, this.localVariableId = 0, 
            this.codeArray.push(d + f + "," + p + ";", "if(R){", f + "=R;", "}else{", f + "=R=new " + this.getFuncModule(t.constructor, !0) + "();", "}"), 
            o.value(t, "_iN$t", {
                globalVar: "R"
            }, !0), this.objsToClear_iN$t.push(t), this.enumerateObject(this.codeArray, t), 
            this.globalVariables.length > 0 && (i = d + this.globalVariables.join(",") + ";");
            var n = h.flattenCodeArray([ "return (function(R){", i || [], this.codeArray, "return o;", "})" ]);
            this.result = Function("O", "F", n)(this.objs, this.funcs);
            for (var r = 0, s = this.objsToClear_iN$t.length; r < s; ++r) this.objsToClear_iN$t[r]._iN$t = null;
            this.objsToClear_iN$t.length = 0;
        }
        v.prototype.toString = function() {
            return d + this.varName + "=" + this.expression + ";";
        }, x.prototype.append = function(t, e) {
            this._exps.push([ t, e ]);
        }, x.prototype.writeCode = function(t) {
            var e;
            if (this._exps.length > 1) t.push(p + "=" + this._targetExp + ";"), e = p; else {
                if (1 !== this._exps.length) return;
                e = this._targetExp;
            }
            for (var i = 0; i < this._exps.length; i++) {
                var n = this._exps[i];
                y(t, e + T(n[0]) + "=", n[1]);
            }
        }, x.pool = new o.Pool(function(t) {
            t._exps.length = 0, t._targetExp = null;
        }, 1), x.pool.get = function(t) {
            var e = this._get() || new x();
            return e._targetExp = t, e;
        };
        var A = C.prototype;
        A.getFuncModule = function(t, e) {
            var i = o.getClassName(t);
            if (i) {
                var n = this.funcModuleCache[i];
                if (n) return n;
                if (void 0 === n) {
                    var r = -1 !== i.indexOf(".");
                    if (r) try {
                        if (r = t === Function("return " + i)()) return this.funcModuleCache[i] = i, i;
                    } catch (t) {}
                }
            }
            var s = this.funcs.indexOf(t);
            s < 0 && (s = this.funcs.length, this.funcs.push(t));
            var a = "F[" + s + "]";
            return e && (a = "(" + a + ")"), this.funcModuleCache[i] = a, a;
        }, A.getObjRef = function(t) {
            var e = this.objs.indexOf(t);
            return e < 0 && (e = this.objs.length, this.objs.push(t)), "O[" + e + "]";
        }, A.setValueType = function(t, e, i, n) {
            var r = x.pool.get(n), s = e.constructor.__props__;
            s || (s = Object.keys(e));
            for (var a = 0; a < s.length; a++) {
                var o = s[a], c = i[o];
                if (e[o] !== c) {
                    var h = this.enumerateField(i, o, c);
                    r.append(o, h);
                }
            }
            r.writeCode(t), x.pool.put(r);
        }, A.enumerateCCClass = function(t, e, i) {
            for (var n = i.__values__, r = a.getClassAttrs(i), s = 0; s < n.length; s++) {
                var o = n[s], h = e[o], u = r[o + l];
                if (!E(u, h)) if ("object" == typeof h && h instanceof cc.ValueType && (u = c.getDefault(u)) && u.constructor === h.constructor) {
                    var _ = f + T(o);
                    this.setValueType(t, u, h, _);
                } else this.setObjProp(t, e, o, h);
            }
        }, A.instantiateArray = function(t) {
            if (0 === t.length) return "[]";
            var e = "a" + ++this.localVariableId, i = [ new v(e, "new Array(" + t.length + ")") ];
            o.value(t, "_iN$t", {
                globalVar: "",
                source: i
            }, !0), this.objsToClear_iN$t.push(t);
            for (var n = 0; n < t.length; ++n) {
                y(i, e + "[" + n + "]=", this.enumerateField(t, n, t[n]));
            }
            return i;
        }, A.enumerateField = function(t, e, i) {
            if ("object" == typeof i && i) {
                var r = i._iN$t;
                if (r) {
                    var a = r.globalVar;
                    if (!a) {
                        a = r.globalVar = "v" + ++this.globalVariableId, this.globalVariables.push(a);
                        var o = r.source[0];
                        r.source[0] = g(a + "=", o);
                    }
                    return a;
                }
                return Array.isArray(i) ? this.instantiateArray(i) : this.instantiateObj(i);
            }
            return "function" == typeof i ? this.getFuncModule(i) : "string" == typeof i ? _(i) : ("_objFlags" === e && t instanceof n && (i &= s), 
            i);
        }, A.setObjProp = function(t, e, i, n) {
            y(t, f + T(i) + "=", this.enumerateField(e, i, n));
        }, A.enumerateObject = function(t, e) {
            var i = e.constructor;
            if (cc.Class._isCCClass(i)) this.enumerateCCClass(t, e, i); else for (var n in e) if (e.hasOwnProperty(n) && (95 !== n.charCodeAt(0) || 95 !== n.charCodeAt(1) || "__type__" === n)) {
                var r = e[n];
                "object" == typeof r && r && r === e._iN$t || this.setObjProp(t, e, n, r);
            }
        }, A.instantiateObj = function(t) {
            if (t instanceof cc.ValueType) return c.getNewValueTypeCode(t);
            if (t instanceof cc.Asset) return this.getObjRef(t);
            if (t._objFlags & r) return null;
            var e, i = t.constructor;
            if (cc.Class._isCCClass(i)) {
                if (this.parent) if (this.parent instanceof cc.Component) {
                    if (t instanceof cc._BaseNode || t instanceof cc.Component) return this.getObjRef(t);
                } else if (this.parent instanceof cc._BaseNode) if (t instanceof cc._BaseNode) {
                    if (!t.isChildOf(this.parent)) return this.getObjRef(t);
                } else if (t instanceof cc.Component && !t.node.isChildOf(this.parent)) return this.getObjRef(t);
                e = new v(f, "new " + this.getFuncModule(i, !0) + "()");
            } else if (i === Object) e = new v(f, "{}"); else {
                if (i) return this.getObjRef(t);
                e = new v(f, "Object.create(null)");
            }
            var n = [ e ];
            return o.value(t, "_iN$t", {
                globalVar: "",
                source: n
            }, !0), this.objsToClear_iN$t.push(t), this.enumerateObject(n, t), [ "(function(){", n, "return o;})();" ];
        }, e.exports = {
            compile: function(t) {
                return new C(t, t instanceof cc._BaseNode && t).result;
            },
            equalsToDefault: E
        };
    }, {
        "./CCClass": 82,
        "./CCObject": 88,
        "./attribute": 94,
        "./compiler": 96,
        "./js": 102
    } ],
    101: [ function(t, e, i) {
        var n = t("./CCObject"), r = t("../value-types/value-type"), s = n.Flags.Destroyed, a = n.Flags.PersistentMask, o = t("./utils").isDomNode, c = t("./js");
        function h(t, e) {
            if (!e) {
                if ("object" != typeof t || Array.isArray(t)) return null;
                if (!t) return null;
                if (!cc.isValid(t)) return null;
                0;
            }
            var i;
            if (t instanceof n) {
                if (t._instantiate) return cc.game._isCloning = !0, i = t._instantiate(), cc.game._isCloning = !1, 
                i;
                if (t instanceof cc.Asset) return null;
            }
            return cc.game._isCloning = !0, i = u(t), cc.game._isCloning = !1, i;
        }
        var l = [];
        function u(t, e) {
            if (Array.isArray(t)) return null;
            if (o && o(t)) return null;
            var i;
            if (t._iN$t) i = t._iN$t; else if (t.constructor) {
                i = new (0, t.constructor)();
            } else i = Object.create(null);
            _(t, i, e);
            for (var n = 0, r = l.length; n < r; ++n) l[n]._iN$t = null;
            return l.length = 0, i;
        }
        function _(t, e, i) {
            c.value(t, "_iN$t", e, !0), l.push(t);
            var s = t.constructor;
            if (cc.Class._isCCClass(s)) (function(t, e, i, n) {
                for (var s = t.__values__, a = 0; a < s.length; a++) {
                    var o = s[a], c = e[o];
                    if ("object" == typeof c && c) {
                        var h = i[o];
                        h instanceof r && h.constructor === c.constructor ? h.set(c) : i[o] = c._iN$t || d(c, n);
                    } else i[o] = c;
                }
            })(s, t, e, i); else for (var o in t) if (t.hasOwnProperty(o) && (95 !== o.charCodeAt(0) || 95 !== o.charCodeAt(1) || "__type__" === o)) {
                var h = t[o];
                if ("object" == typeof h && h) {
                    if (h === e) continue;
                    e[o] = h._iN$t || d(h, i);
                } else e[o] = h;
            }
            t instanceof n && (e._objFlags &= a);
        }
        function d(t, e) {
            if (t instanceof r) return t.clone();
            if (t instanceof cc.Asset) return t;
            var i;
            if (Array.isArray(t)) {
                var n = t.length;
                i = new Array(n), c.value(t, "_iN$t", i, !0);
                for (var a = 0; a < n; ++a) {
                    var o = t[a];
                    i[a] = "object" == typeof o && o ? o._iN$t || d(o, e) : o;
                }
                return l.push(t), i;
            }
            if (t._objFlags & s) return null;
            var h = t.constructor;
            if (cc.Class._isCCClass(h)) {
                if (e) if (e instanceof cc.Component) {
                    if (t instanceof cc._BaseNode || t instanceof cc.Component) return t;
                } else if (e instanceof cc._BaseNode) if (t instanceof cc._BaseNode) {
                    if (!t.isChildOf(e)) return t;
                } else if (t instanceof cc.Component && !t.node.isChildOf(e)) return t;
                i = new h();
            } else if (h === Object) i = {}; else {
                if (h) return t;
                i = Object.create(null);
            }
            return _(t, i, e), i;
        }
        h._clone = u, cc.instantiate = h, e.exports = h;
    }, {
        "../value-types/value-type": 174,
        "./CCObject": 88,
        "./js": 102,
        "./utils": 106
    } ],
    102: [ function(t, e, i) {
        var n = new (t("./id-generater"))("TmpCId.");
        function r(t, e) {
            for (;t; ) {
                var i = Object.getOwnPropertyDescriptor(t, e);
                if (i) return i;
                t = Object.getPrototypeOf(t);
            }
            return null;
        }
        function s(t, e, i) {
            var n = r(e, t);
            Object.defineProperty(i, t, n);
        }
        var a = {
            isNumber: function(t) {
                return "number" == typeof t || t instanceof Number;
            },
            isString: function(t) {
                return "string" == typeof t || t instanceof String;
            },
            addon: function(t) {
                "use strict";
                t = t || {};
                for (var e = 1, i = arguments.length; e < i; e++) {
                    var n = arguments[e];
                    if (n) {
                        if ("object" != typeof n) {
                            cc.errorID(5402, n);
                            continue;
                        }
                        for (var r in n) r in t || s(r, n, t);
                    }
                }
                return t;
            },
            mixin: function(t) {
                "use strict";
                t = t || {};
                for (var e = 1, i = arguments.length; e < i; e++) {
                    var n = arguments[e];
                    if (n) {
                        if ("object" != typeof n) {
                            cc.errorID(5403, n);
                            continue;
                        }
                        for (var r in n) s(r, n, t);
                    }
                }
                return t;
            },
            extend: function(t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                return t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), t;
            },
            getSuper: function(t) {
                var e = t.prototype, i = e && Object.getPrototypeOf(e);
                return i && i.constructor;
            },
            isChildClassOf: function(t, e) {
                if (t && e) {
                    if ("function" != typeof t) return !1;
                    if ("function" != typeof e) return !1;
                    if (t === e) return !0;
                    for (;;) {
                        if (!(t = a.getSuper(t))) return !1;
                        if (t === e) return !0;
                    }
                }
                return !1;
            },
            clear: function(t) {
                for (var e = Object.keys(t), i = 0; i < e.length; i++) delete t[e[i]];
            },
            isEmptyObject: function(t) {
                for (var e in t) return !1;
                return !0;
            },
            getPropertyDescriptor: r
        }, o = {
            value: void 0,
            enumerable: !1,
            writable: !1,
            configurable: !0
        };
        a.value = function(t, e, i, n, r) {
            o.value = i, o.writable = n, o.enumerable = r, Object.defineProperty(t, e, o), o.value = void 0;
        };
        var c = {
            get: null,
            set: null,
            enumerable: !1
        };
        a.getset = function(t, e, i, n, r) {
            "function" != typeof n && (r = n, n = void 0), c.get = i, c.set = n, c.enumerable = r, 
            Object.defineProperty(t, e, c), c.get = null, c.set = null;
        };
        var h = {
            get: null,
            enumerable: !1,
            configurable: !1
        };
        a.get = function(t, e, i, n, r) {
            h.get = i, h.enumerable = n, h.configurable = r, Object.defineProperty(t, e, h), 
            h.get = null;
        };
        var l = {
            set: null,
            enumerable: !1,
            configurable: !1
        };
        a.set = function(t, e, i, n, r) {
            l.set = i, l.enumerable = n, l.configurable = r, Object.defineProperty(t, e, l), 
            l.set = null;
        }, a.getClassName = function(t) {
            if ("function" == typeof t) {
                var e = t.prototype;
                if (e && e.hasOwnProperty("__classname__") && e.__classname__) return e.__classname__;
                var i = "";
                if (t.name && (i = t.name), t.toString) {
                    var n, r = t.toString();
                    (n = "[" === r.charAt(0) ? r.match(/\[\w+\s*(\w+)\]/) : r.match(/function\s*(\w+)/)) && 2 === n.length && (i = n[1]);
                }
                return "Object" !== i ? i : "";
            }
            return t && t.constructor ? a.getClassName(t.constructor) : "";
        }, function() {
            var t = {}, e = {};
            function i(t, e, i) {
                return a.getset(a, e, function() {
                    return Object.assign({}, i);
                }, function(t) {
                    a.clear(i), Object.assign(i, t);
                }), function(e, n) {
                    if (n.prototype.hasOwnProperty(t) && delete i[n.prototype[t]], a.value(n.prototype, t, e), 
                    e) {
                        var r = i[e];
                        if (r && r !== n) {
                            var s = "A Class already exists with the same " + t + ' : "' + e + '".';
                            0, cc.error(s);
                        } else i[e] = n;
                    }
                };
            }
            a._setClassId = i("__cid__", "_registeredClassIds", t);
            var r = i("__classname__", "_registeredClassNames", e);
            a.setClassName = function(t, e) {
                if (r(t, e), !e.prototype.hasOwnProperty("__cid__")) {
                    var i = t || n.getNewId();
                    i && a._setClassId(i, e);
                }
            }, a.unregisterClass = function() {
                for (var i = 0; i < arguments.length; i++) {
                    var n = arguments[i].prototype, r = n.__cid__;
                    r && delete t[r];
                    var s = n.__classname__;
                    s && delete e[s];
                }
            }, a._getClassById = function(e) {
                return t[e];
            }, a.getClassByName = function(t) {
                return e[t];
            }, a._getClassId = function(t, e) {
                if (e = void 0 === e || e, "function" == typeof t && t.prototype.hasOwnProperty("__cid__")) return t.prototype.__cid__;
                if (t && t.constructor) {
                    var i = t.constructor.prototype;
                    if (i && i.hasOwnProperty("__cid__")) return t.__cid__;
                }
                return "";
            };
        }(), a.obsolete = function(t, e, i, n) {
            var r = /([^.]+)$/, s = r.exec(e)[0], o = r.exec(i)[0];
            function c() {
                return this[o];
            }
            n ? a.getset(t, s, c, function(t) {
                this[o] = t;
            }) : a.get(t, s, c);
        }, a.obsoletes = function(t, e, i, n) {
            for (var r in i) {
                var s = i[r];
                a.obsolete(t, e + "." + r, s, n);
            }
        };
        var u = /(%d)|(%s)/, _ = /%s/;
        function d(t, e) {
            t.splice(e, 1);
        }
        function f(t, e) {
            var i = t.indexOf(e);
            return i >= 0 && (d(t, i), !0);
        }
        a.formatStr = function() {
            var t = arguments.length;
            if (0 === t) return "";
            var e = arguments[0];
            if (1 === t) return "" + e;
            if ("string" == typeof e && u.test(e)) for (var i = 1; i < t; ++i) {
                var n = arguments[i], r = "number" == typeof n ? u : _;
                r.test(e) ? e = e.replace(r, n) : e += " " + n;
            } else for (var s = 1; s < t; ++s) e += " " + arguments[s];
            return e;
        }, a.shiftArguments = function() {
            for (var t = arguments.length - 1, e = new Array(t), i = 0; i < t; ++i) e[i] = arguments[i + 1];
            return e;
        }, a.createMap = function(t) {
            var e = Object.create(null);
            if (t) {
                e["."] = !0, e["/"] = !0, delete e["."], delete e["/"];
            }
            return e;
        };
        var p = Array.prototype.indexOf;
        function m(t, e) {
            void 0 === e && (e = t, t = null), this.get = null, this.count = 0, this._pool = new Array(e), 
            this._cleanup = t;
        }
        a.array = {
            remove: f,
            fastRemove: function(t, e) {
                var i = t.indexOf(e);
                i >= 0 && (t[i] = t[t.length - 1], --t.length);
            },
            removeAt: d,
            fastRemoveAt: function(t, e) {
                var i = t.length;
                e < 0 || e >= i || (t[e] = t[i - 1], t.length = i - 1);
            },
            contains: function(t, e) {
                return t.indexOf(e) >= 0;
            },
            verifyType: function(t, e) {
                if (t && t.length > 0) for (var i = 0; i < t.length; i++) if (!(t[i] instanceof e)) return cc.logID(1300), 
                !1;
                return !0;
            },
            removeArray: function(t, e) {
                for (var i = 0, n = e.length; i < n; i++) f(t, e[i]);
            },
            appendObjectsAt: function(t, e, i) {
                return t.splice.apply(t, [ i, 0 ].concat(e)), t;
            },
            copy: function(t) {
                var e, i = t.length, n = new Array(i);
                for (e = 0; e < i; e += 1) n[e] = t[e];
                return n;
            },
            indexOf: p,
            MutableForwardIterator: t("../utils/mutable-forward-iterator")
        }, m.prototype._get = function() {
            if (this.count > 0) {
                --this.count;
                var t = this._pool[this.count];
                return this._pool[this.count] = null, t;
            }
            return null;
        }, m.prototype.put = function(t) {
            var e = this._pool;
            if (this.count < e.length) {
                if (this._cleanup && !1 === this._cleanup(t)) return;
                e[this.count] = t, ++this.count;
            }
        }, m.prototype.resize = function(t) {
            t >= 0 && (this._pool.length = t, this.count > t && (this.count = t));
        }, a.Pool = m, cc.js = a, e.exports = a;
    }, {
        "../utils/mutable-forward-iterator": 160,
        "./id-generater": 98
    } ],
    103: [ function(t, e, i) {
        var n = t("./js"), r = {
            url: {
                canUsedInGet: !0
            },
            default: {},
            serializable: {},
            editorOnly: {},
            formerlySerializedAs: {}
        };
        function s(t, e, i, n) {
            if (!t.get && !t.set) if (t.hasOwnProperty("default")) {
                var s = "_N$" + e;
                t.get = function() {
                    return this[s];
                }, t.set = function(t) {
                    var e = this[s];
                    this[s] = t, i.call(this, e);
                };
                var a = {};
                for (var o in n[s] = a, r) {
                    var c = r[o];
                    t.hasOwnProperty(o) && (a[o] = t[o], c.canUsedInGet || delete t[o]);
                }
            } else 0;
        }
        function a(t, e, i, n) {
            Array.isArray(n) && n.length > 0 && (n = n[0]), t.type = n;
        }
        function o(t, e, i, n) {
            if (Array.isArray(e)) {
                if (!(e.length > 0)) return cc.errorID(5508, i, n);
                if (cc.RawAsset.isRawAssetType(e[0])) return t.url = e[0], void delete t.type;
                t.type = e = e[0];
            }
        }
        i.getFullFormOfProperty = function(t, e, i) {
            if (!(t && t.constructor === Object)) {
                if (Array.isArray(t) && t.length > 0) {
                    var r = t[0];
                    return {
                        default: [],
                        type: t,
                        _short: !0
                    };
                }
                if ("function" == typeof t) {
                    r = t;
                    return cc.RawAsset.isRawAssetType(r) || cc.RawAsset.wasRawAssetType(r) ? {
                        default: "",
                        url: r,
                        _short: !0
                    } : {
                        default: n.isChildClassOf(r, cc.ValueType) ? new r() : null,
                        type: r,
                        _short: !0
                    };
                }
                return {
                    default: t,
                    _short: !0
                };
            }
            return null;
        }, i.preprocessAttrs = function(t, e, n, r) {
            for (var c in t) {
                var h = t[c], l = i.getFullFormOfProperty(h, c, e);
                if (l && (h = t[c] = l), h) {
                    var u = h.notify;
                    u && s(h, c, u, t), "type" in h && o(h, h.type, e, c), "url" in h && a(h, 0, 0, h.url), 
                    "type" in h && h.type;
                }
            }
        }, i.validateMethodWithProps = function(t, e, i, n, r) {
            return "function" == typeof t || null === t;
        };
    }, {
        "./CCClass": 82,
        "./js": 102
    } ],
    104: [ function(t, e, i) {
        var n = [];
        cc._RF = {
            push: function(t, e, i) {
                void 0 === i && (i = e, e = ""), n.push({
                    uuid: e,
                    script: i,
                    module: t,
                    exports: t.exports,
                    beh: null
                });
            },
            pop: function() {
                var t = n.pop(), e = t.module, i = e.exports;
                if (i === t.exports) {
                    for (var r in i) return;
                    e.exports = i = t.cls;
                }
            },
            peek: function() {
                return n[n.length - 1];
            }
        };
    }, {} ],
    105: [ function(t, e, i) {
        cc.url = {
            _rawAssets: "",
            normalize: function(t) {
                return t && (46 === t.charCodeAt(0) && 47 === t.charCodeAt(1) ? t = t.slice(2) : 47 === t.charCodeAt(0) && (t = t.slice(1))), 
                t;
            },
            raw: function(t) {
                if ((t = this.normalize(t)).startsWith("resources/")) {
                    var e = cc.loader._getResUuid(t.slice(10), cc.Asset, !0);
                    if (e) return cc.AssetLibrary.getLibUrlNoExt(e, !0) + cc.path.extname(t);
                } else cc.errorID(7002, t);
                return this._rawAssets + t;
            },
            _init: function(t) {
                this._rawAssets = cc.path.stripSep(t) + "/";
            }
        }, e.exports = cc.url;
    }, {} ],
    106: [ function(t, e, i) {
        t("./js");
        e.exports = {
            contains: function(t, e) {
                if ("function" == typeof t.contains) return t.contains(e);
                if ("function" == typeof t.compareDocumentPosition) return !!(16 & t.compareDocumentPosition(e));
                var i = e.parentNode;
                if (i) do {
                    if (i === t) return !0;
                    i = i.parentNode;
                } while (null !== i);
                return !1;
            },
            isDomNode: "object" == typeof window && ("function" == typeof Node ? function(t) {
                return t instanceof Node;
            } : function(t) {
                return t && "object" == typeof t && "number" == typeof t.nodeType && "string" == typeof t.nodeName;
            }),
            callInNextTick: function(t, e, i) {
                t && setTimeout(function() {
                    t(e, i);
                }, 0);
            }
        };
    }, {
        "./js": 102
    } ],
    107: [ function(t, e, i) {
        t("./platform/js"), t("./value-types"), t("./utils"), t("./platform/CCInputManager"), 
        t("./platform/CCInputExtension"), t("./event"), t("./platform/CCSys"), t("./platform/CCMacro"), 
        t("./load-pipeline"), t("./CCDirector"), t("./renderer"), t("./platform/CCView"), 
        t("./platform/CCScreen"), t("./CCScheduler"), t("./event-manager");
    }, {
        "./CCDirector": 2,
        "./CCScheduler": 7,
        "./event": 52,
        "./event-manager": 48,
        "./load-pipeline": 67,
        "./platform/CCInputExtension": 85,
        "./platform/CCInputManager": 86,
        "./platform/CCMacro": 87,
        "./platform/CCScreen": 90,
        "./platform/CCSys": 91,
        "./platform/CCView": 92,
        "./platform/js": 102,
        "./renderer": 123,
        "./utils": 157,
        "./value-types": 169
    } ],
    108: [ function(t, e, i) {
        var n = function() {};
        n.prototype = {
            constructor: n,
            _reset: function() {},
            render: function() {}
        }, e.exports = n;
    }, {} ],
    109: [ function(t, e, i) {
        e.exports = {
            ForwardRenderer: t("./forward-renderer"),
            RenderComponentHandle: t("./render-component-handle"),
            _renderers: t("./renderers")
        };
    }, {
        "./forward-renderer": 108,
        "./render-component-handle": 110,
        "./renderers": 113
    } ],
    110: [ function(t, e, i) {
        t("./renderers");
        var n = function(t, e) {
            this._device = t, this._camera = e, this.parentOpacity = 1, this.parentOpacityDirty = 0, 
            this.worldMatDirty = 0, this.walking = !1;
        };
        n.prototype = {
            constructor: n,
            reset: function() {
                var t = this._device._ctx, e = this._device._canvas, i = cc.Camera.main ? cc.Camera.main.backgroundColor : cc.color(), n = "rgba(" + i.r + ", " + i.g + ", " + i.b + ", " + i.a / 255 + ")";
                t.fillStyle = n, t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height), 
                t.fillRect(0, 0, e.width, e.height), this._device._stats.drawcalls = 0;
            },
            terminate: function() {
                this.walking = !1;
            },
            _commitComp: function(t, e) {
                var i = this._device._ctx, n = this._camera;
                i.setTransform(n.a, n.b, n.c, n.d, n.tx, n.ty), i.scale(1, -1), e.draw(i, t);
            }
        }, e.exports = n;
    }, {
        "./renderers": 113
    } ],
    111: [ function(t, e, i) {
        var n = t("../../../../graphics/helper"), r = t("../../../../graphics/types"), s = t("../../../../platform/js"), a = (r.PointFlags, 
        r.LineJoin), o = r.LineCap;
        function c() {
            this.cmds = [], this.style = {
                strokeStyle: "black",
                fillStyle: "white",
                lineCap: "butt",
                lineJoin: "miter",
                miterLimit: 10
            };
        }
        var h = c.prototype;
        s.mixin(h, {
            moveTo: function(t, e) {
                this.cmds.push([ "moveTo", [ t, e ] ]);
            },
            lineTo: function(t, e) {
                this.cmds.push([ "lineTo", [ t, e ] ]);
            },
            bezierCurveTo: function(t, e, i, n, r, s) {
                this.cmds.push([ "bezierCurveTo", [ t, e, i, n, r, s ] ]);
            },
            quadraticCurveTo: function(t, e, i, n) {
                this.cmds.push([ "quadraticCurveTo", [ t, e, i, n ] ]);
            },
            arc: function(t, e, i, r, s, a) {
                n.arc(this, t, e, i, r, s, a);
            },
            ellipse: function(t, e, i, r) {
                n.ellipse(this, t, e, i, r);
            },
            circle: function(t, e, i) {
                n.ellipse(this, t, e, i, i);
            },
            rect: function(t, e, i, n) {
                this.moveTo(t, e), this.lineTo(t, e + n), this.lineTo(t + i, e + n), this.lineTo(t + i, e), 
                this.close();
            },
            roundRect: function(t, e, i, r, s) {
                n.roundRect(this, t, e, i, r, s);
            },
            clear: function(t, e) {
                this.cmds.length = 0;
            },
            close: function() {
                this.cmds.push([ "closePath", [] ]);
            },
            stroke: function() {
                this.cmds.push([ "stroke", [] ]);
            },
            fill: function() {
                this.cmds.push([ "fill", [] ]);
            }
        }), s.set(h, "strokeColor", function(t) {
            var e = "rgba(" + (0 | t.r) + "," + (0 | t.g) + "," + (0 | t.b) + "," + t.a / 255 + ")";
            this.cmds.push([ "strokeStyle", e ]), this.style.strokeStyle = e;
        }), s.set(h, "fillColor", function(t) {
            var e = "rgba(" + (0 | t.r) + "," + (0 | t.g) + "," + (0 | t.b) + "," + t.a / 255 + ")";
            this.cmds.push([ "fillStyle", e ]), this.style.fillStyle = e;
        }), s.set(h, "lineWidth", function(t) {
            this.cmds.push([ "lineWidth", t ]), this.style.lineWidth = t;
        }), s.set(h, "lineCap", function(t) {
            var e = "butt";
            t === o.BUTT ? e = "butt" : t === o.ROUND ? e = "round" : t === o.SQUARE && (e = "square"), 
            this.cmds.push([ "lineCap", e ]), this.style.lineCap = e;
        }), s.set(h, "lineJoin", function(t) {
            var e = "bevel";
            t === a.BEVEL ? e = "bevel" : t === a.ROUND ? e = "round" : t === a.MITER && (e = "miter"), 
            this.cmds.push([ "lineJoin", e ]), this.style.lineJoin = e;
        }), s.set(h, "miterLimit", function(t) {
            this.cmds.push([ "miterLimit", t ]), this.style.miterLimit = t;
        }), e.exports = c;
    }, {
        "../../../../graphics/helper": 55,
        "../../../../graphics/types": 57,
        "../../../../platform/js": 102
    } ],
    112: [ function(t, e, i) {
        var n = t("./impl");
        e.exports = {
            createImpl: function() {
                return new n();
            },
            draw: function(t, e) {
                var i = e.node, n = i._worldMatrix, r = n.m00, s = n.m01, a = n.m04, o = n.m05, c = n.m12, h = n.m13;
                t.transform(r, s, a, o, c, h), t.save(), t.globalAlpha = i.opacity / 255;
                var l = e._impl.style;
                t.strokeStyle = l.strokeStyle, t.fillStyle = l.fillStyle, t.lineWidth = l.lineWidth, 
                t.lineJoin = l.lineJoin, t.miterLimit = l.miterLimit;
                for (var u = !0, _ = e._impl.cmds, d = 0, f = _.length; d < f; d++) {
                    var p = _[d], m = p[0], v = p[1];
                    "moveTo" === m && u ? (t.beginPath(), u = !1) : "fill" !== m && "stroke" !== m && "fillRect" !== m || (u = !0), 
                    "function" == typeof t[m] ? t[m].apply(t, v) : t[m] = v;
                }
                return t.restore(), 1;
            },
            stroke: function(t) {
                t._impl.stroke();
            },
            fill: function(t) {
                t._impl.fill();
            }
        };
    }, {
        "./impl": 111
    } ],
    113: [ function(t, e, i) {
        var n = t("../../../platform/js"), r = t("../../../components/CCSprite"), s = t("../../../components/CCLabel"), a = t("../../../components/CCMask"), o = t("../../../graphics/graphics"), c = t("./sprite"), h = t("./label"), l = t("./graphics"), u = t("./mask"), _ = {}, d = {};
        function f(t, e, i) {
            var r = n.getClassName(t);
            _[r] = e, i && (d[r] = i), t._assembler = e, t._postAssembler = i;
        }
        f(r, c), f(s, h), a && f(a, u.beforeHandler, u.afterHandler), o && f(o, l), e.exports = {
            map: _,
            postMap: d,
            addRenderer: f
        };
    }, {
        "../../../components/CCLabel": 32,
        "../../../components/CCMask": 34,
        "../../../components/CCSprite": 37,
        "../../../graphics/graphics": 54,
        "../../../platform/js": 102,
        "./graphics": 112,
        "./label": 115,
        "./mask": 117,
        "./sprite": 118
    } ],
    114: [ function(t, e, i) {
        var n = t("../../../utils/label/bmfont"), r = t("../../../../platform/js"), s = t("../utils");
        e.exports = r.addon({
            createData: function(t) {
                return t.requestRenderData();
            },
            appendQuad: function(t, e, i, n, r, s, a) {
                var o = t.dataLength;
                t.dataLength += 2;
                var c = t._data, h = (e.width, e.height, i.width), l = i.height, u = void 0, _ = void 0, d = void 0, f = void 0;
                n ? (u = i.x, d = i.x + l, _ = i.y, f = i.y + h, c[o].u = u, c[o].v = f, c[o + 1].u = u, 
                c[o + 1].v = _) : (u = i.x, d = i.x + h, _ = i.y, f = i.y + l, c[o].u = u, c[o].v = _, 
                c[o + 1].u = d, c[o + 1].v = f), c[o].x = r, c[o].y = s - l * a, c[o + 1].x = r + h * a, 
                c[o + 1].y = s;
            },
            draw: function(t, e) {
                var i = e.node, n = i._worldMatrix, r = n.m00, a = n.m01, o = n.m04, c = n.m05, h = n.m12, l = n.m13;
                t.transform(r, a, o, c, h, l), t.scale(1, -1), t.globalAlpha = i.opacity / 255;
                for (var u = e._frame._texture, _ = e._renderData._data, d = s.getColorizedImage(u, i._color), f = 0, p = _.length; f < p; f += 2) {
                    var m = _[f].x, v = _[f].y, g = _[f + 1].x - m, y = _[f + 1].y - v;
                    v = -v - y;
                    var x = _[f].u, E = _[f].v, T = _[f + 1].u - x, C = _[f + 1].v - E;
                    t.drawImage(d, x, E, T, C, m, v, g, y);
                }
                return 1;
            }
        }, n);
    }, {
        "../../../../platform/js": 102,
        "../../../utils/label/bmfont": 126,
        "../utils": 122
    } ],
    115: [ function(t, e, i) {
        var n = t("../../../../components/CCLabel"), r = t("./ttf"), s = t("./bmfont"), a = {
            pool: [],
            get: function() {
                var t = this.pool.pop();
                if (!t) {
                    var e = document.createElement("canvas");
                    t = {
                        canvas: e,
                        context: e.getContext("2d")
                    };
                }
                return t;
            },
            put: function(t) {
                this.pool.length >= 32 || this.pool.push(t);
            }
        };
        n._canvasPool = a, e.exports = {
            getAssembler: function(t) {
                var e = r;
                return t.font instanceof cc.BitmapFont && (e = s), e;
            },
            createData: function(t) {
                return t._assembler.createData(t);
            },
            draw: function(t, e) {
                if (!e._texture) return 0;
                var i = e._assembler;
                return i ? (i.updateRenderData(e), i.draw(t, e)) : 0;
            }
        };
    }, {
        "../../../../components/CCLabel": 32,
        "./bmfont": 114,
        "./ttf": 116
    } ],
    116: [ function(t, e, i) {
        var n = t("../../../utils/label/ttf"), r = t("../../../../platform/js"), s = t("../utils");
        e.exports = r.addon({
            createData: function(t) {
                var e = t.requestRenderData();
                return e.dataLength = 2, e;
            },
            _updateVerts: function(t) {
                var e = t._renderData, i = t.node, n = i.width, r = i.height, s = i.anchorX * n, a = i.anchorY * r, o = e._data;
                o[0].x = -s, o[0].y = -a, o[1].x = n - s, o[1].y = r - a;
            },
            _updateTexture: function(t) {
                n._updateTexture(t);
                var e = t._frame._texture;
                s.dropColorizedImage(e, t.node.color);
            },
            draw: function(t, e) {
                var i = e.node, n = i._worldMatrix, r = n.m00, s = n.m01, a = n.m04, o = n.m05, c = n.m12, h = n.m13;
                t.transform(r, s, a, o, c, h), t.scale(1, -1), t.globalAlpha = i.opacity / 255;
                var l = e._frame._texture, u = e._renderData._data, _ = l.getHtmlElementObj(), d = u[0].x, f = u[0].y, p = u[1].x - d, m = u[1].y - f;
                return f = -f - m, t.drawImage(_, d, f, p, m), 1;
            }
        }, n);
    }, {
        "../../../../platform/js": 102,
        "../../../utils/label/ttf": 129,
        "../utils": 122
    } ],
    117: [ function(t, e, i) {
        t("../../../components/CCMask");
        var n = t("./graphics"), r = {
            updateRenderData: function(t) {},
            draw: function(t, e) {
                t.save(), n.draw(t, e._graphics), t.clip();
            }
        };
        e.exports = {
            beforeHandler: r,
            afterHandler: {
                updateRenderData: function(t) {},
                draw: function(t, e) {
                    t.restore();
                }
            }
        };
    }, {
        "../../../components/CCMask": 34,
        "./graphics": 112
    } ],
    118: [ function(t, e, i) {
        var n = t("../../../../components/CCSprite"), r = n.Type, s = n.FillType, a = t("./simple"), o = t("./sliced"), c = t("./tiled");
        e.exports = {
            getAssembler: function(t) {
                switch (t.type) {
                  case r.SIMPLE:
                    return a;

                  case r.SLICED:
                    return o;

                  case r.TILED:
                    return c;

                  case r.FILLED:
                    return t._fillType, s.RADIAL, null;
                }
            },
            createData: function(t) {
                return t._assembler.createData(t);
            }
        };
    }, {
        "../../../../components/CCSprite": 37,
        "../../../webgl/assemblers/sprite/index.js": 140,
        "./simple": 119,
        "./sliced": 120,
        "./tiled": 121
    } ],
    119: [ function(t, e, i) {
        var n = t("../utils"), r = {
            createData: function(t) {
                var e = t.requestRenderData();
                return e.dataLength = 2, e;
            },
            updateRenderData: function(t) {
                t._material || t._activateMaterial();
                var e = t._renderData;
                e.uvDirty && this.updateUVs(t), e.vertDirty && this.updateVerts(t);
            },
            updateUVs: function(t) {
                var e = t.spriteFrame, i = t._renderData, n = i._data, r = e._rect;
                e._texture;
                if (e._rotated) {
                    var s = r.x, a = r.height, o = r.y, c = r.width;
                    n[0].u = s, n[0].v = c, n[1].u = a, n[1].v = o;
                } else {
                    var h = r.x, l = r.width, u = r.y, _ = r.height;
                    n[0].u = h, n[0].v = u, n[1].u = l, n[1].v = _;
                }
                i.uvDirty = !1;
            },
            updateVerts: function(t) {
                var e = t._renderData, i = t.node, n = e._data, r = i.width, s = i.height, a = i.anchorX * r, o = i.anchorY * s, c = void 0, h = void 0, l = void 0, u = void 0;
                if (t.trim) c = -a, h = -o, l = r, u = s; else {
                    var _ = t.spriteFrame, d = _._originalSize.width, f = _._originalSize.height, p = _._rect.width, m = _._rect.height, v = _._offset, g = r / d, y = s / f, x = v.x + (d - p) / 2, E = (v.x, 
                    v.y + (f - m) / 2);
                    v.y;
                    c = x * g - a, h = E * y - o, l = r, u = s;
                }
                n[0].x = c, n[0].y = h, n[1].x = l, n[1].y = u, e.vertDirty = !1;
            },
            draw: function(t, e) {
                var i = e.node, r = i._worldMatrix, s = r.m00, a = r.m01, o = r.m04, c = r.m05, h = r.m12, l = r.m13;
                t.transform(s, a, o, c, h, l), t.scale(1, -1), t.globalAlpha = i.opacity / 255;
                var u = e._spriteFrame._texture, _ = e._renderData._data, d = n.getColorizedImage(u, i._color), f = _[0].x, p = _[0].y, m = _[1].x, v = _[1].y;
                p = -p - v;
                var g = _[0].u, y = _[0].v, x = _[1].u, E = _[1].v;
                return t.drawImage(d, g, y, x, E, f, p, m, v), 1;
            }
        };
        e.exports = r;
    }, {
        "../utils": 122
    } ],
    120: [ function(t, e, i) {
        var n = t("../utils"), r = {
            createData: function(t) {
                var e = t.requestRenderData();
                return e.dataLength = 4, e;
            },
            updateRenderData: t("./simple").updateRenderData,
            updateUVs: function(t) {
                var e = t.spriteFrame, i = t._renderData, n = e._rect, r = (e._texture, e.insetLeft), s = e.insetRight, a = n.width - r - s, o = e.insetTop, c = e.insetBottom, h = n.height - o - c, l = i._data;
                e._rotated ? (l[0].u = n.x, l[1].u = c + n.x, l[2].u = c + h + n.x, l[3].u = n.x + n.height, 
                l[3].v = n.y, l[2].v = r + n.y, l[1].v = r + a + n.y, l[0].v = n.y + n.width) : (l[0].u = n.x, 
                l[1].u = r + n.x, l[2].u = r + a + n.x, l[3].u = n.x + n.width, l[3].v = n.y, l[2].v = o + n.y, 
                l[1].v = o + h + n.y, l[0].v = n.y + n.height), i.uvDirty = !1;
            },
            updateVerts: function(t) {
                var e = t._renderData, i = e._data, n = t.node, r = n.width, s = n.height, a = n.anchorX * r, o = n.anchorY * s, c = t.spriteFrame, h = (c._rect, 
                c.insetLeft), l = c.insetRight, u = c.insetTop, _ = c.insetBottom, d = r - h - l, f = s - u - _, p = r / (h + l), m = s / (u + _);
                p = isNaN(p) || p > 1 ? 1 : p, m = isNaN(m) || m > 1 ? 1 : m, d = d < 0 ? 0 : d, 
                f = f < 0 ? 0 : f, i[0].x = -a, i[0].y = -o, i[1].x = h * p - a, i[1].y = _ * m - o, 
                i[2].x = i[1].x + d, i[2].y = i[1].y + f, i[3].x = r - a, i[3].y = s - o, e.vertDirty = !1;
            },
            draw: function(t, e) {
                var i = e.node, r = i._worldMatrix, s = r.m00, a = r.m01, o = r.m04, c = r.m05, h = r.m12, l = r.m13;
                t.transform(s, a, o, c, h, l), t.scale(1, -1), t.globalAlpha = i.opacity / 255;
                for (var u = e._spriteFrame._texture, _ = e._renderData._data, d = n.getColorizedImage(u, i._color), f = 0, p = void 0, m = void 0, v = void 0, g = void 0, y = void 0, x = void 0, E = void 0, T = void 0, C = void 0, A = void 0, b = void 0, w = void 0, D = 0; D < 3; ++D) {
                    g = _[D], v = _[D + 1];
                    for (var S = 0; S < 3; ++S) p = _[S], m = _[S + 1], y = p.x, x = g.y, E = m.x - y, 
                    x = -x - (T = v.y - x), C = p.u, A = v.v, b = m.u - C, w = g.v - A, b > 0 && w > 0 && E > 0 && T > 0 && (t.drawImage(d, C, A, b, w, y, x, E, T), 
                    f++);
                }
                return f;
            }
        };
        e.exports = r;
    }, {
        "../utils": 122,
        "./simple": 119
    } ],
    121: [ function(t, e, i) {
        var n = t("../utils"), r = (t("./simple"), {
            createData: function(t) {
                return t.requestRenderData();
            },
            updateRenderData: function(t) {
                t._material || t._activateMaterial();
            },
            draw: function(t, e) {
                var i = e.node, r = i._worldMatrix, s = r.m00, a = r.m01, o = r.m04, c = r.m05, h = r.m12, l = r.m13;
                t.transform(s, a, o, c, h, l), t.scale(1, -1), t.globalAlpha = i.opacity / 255;
                var u = e.spriteFrame, _ = u._rect, d = u._texture, f = _.x, p = _.y, m = u._rotated ? _.height : _.width, v = u._rotated ? _.width : _.height, g = n.getFrameCache(d, i._color, f, p, m, v), y = i.width, x = i.height, E = -i.anchorX * y, T = -i.anchorY * x;
                return T = -T - x, t.translate(E, T), t.fillStyle = t.createPattern(g, "repeat"), 
                t.fillRect(0, 0, y, x), 1;
            }
        });
        e.exports = r;
    }, {
        "../utils": 122,
        "./simple": 119
    } ],
    122: [ function(t, e, i) {
        function n(t, e, i, n, r, s, a) {
            var o = e._image, c = t.getContext("2d");
            return t.width = s, t.height = a, c.globalCompositeOperation = "source-over", c.fillStyle = "rgb(" + i.r + "," + i.g + "," + i.b + ")", 
            c.fillRect(0, 0, s, a), c.globalCompositeOperation = "multiply", c.drawImage(o, n, r, s, a, 0, 0, s, a), 
            c.globalCompositeOperation = "destination-atop", c.drawImage(o, n, r, s, a, 0, 0, s, a), 
            t;
        }
        var r = {
            canvasMap: {},
            canvasUsed: {},
            canvasPool: [],
            checking: !1,
            check: function() {
                var t = !1;
                for (var e in this.canvasUsed) if (t = !0, this.canvasUsed[e]) this.canvasUsed[e] = !1; else {
                    var i = this.canvasMap[e];
                    i.width = 0, i.height = 0, this.canvasPool.length < 32 && this.canvasPool.push(i), 
                    delete this.canvasMap[e], delete this.canvasUsed[e];
                }
                t || (cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.check, this), this.checking = !1);
            },
            startCheck: function() {
                cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.check, this), this.checking = !0;
            },
            getCanvas: function(t) {
                return this.canvasUsed[t] = !0, this.canvasMap[t];
            },
            cacheCanvas: function(t, e) {
                this.canvasMap[e] = t, this.canvasUsed[e] = !0, this.checking || this.startCheck();
            },
            dropImage: function(t) {
                this.canvasMap[t] && delete this.canvasMap[t];
            }
        };
        e.exports = {
            getColorizedImage: function(t, e) {
                if (!t) return null;
                if (0 === t.width || 0 === t.height) return t._image;
                var i = 16777215 & e._val;
                if (16777215 === i) return t._image;
                var s = t.url + i, a = r.getCanvas(s);
                return a || (n(a = r.canvasPool.pop() || document.createElement("canvas"), t, e, 0, 0, t.width, t.height), 
                r.cacheCanvas(a, s)), a;
            },
            getFrameCache: function(t, e, i, s, a, o) {
                if (!t || !t.url || i < 0 || s < 0 || a <= 0 || o <= 0) return null;
                var c = t.url, h = !1, l = 16777215 & e._val;
                if (16777215 !== l && (c += l, h = !0), (0 !== i || 0 !== s && a !== t.width && o !== t.height) && (c += "_" + i + "_" + s + "_" + a + "_" + o, 
                h = !0), !h) return t._image;
                var u = r.getCanvas(c);
                return u || (n(u = r.canvasPool.pop() || document.createElement("canvas"), t, e, i, s, a, o), 
                r.cacheCanvas(u, c)), u;
            },
            dropColorizedImage: function(t, e) {
                var i = t.url + (16777215 & e._val);
                r.dropImage(i);
            }
        };
    }, {} ],
    123: [ function(t, e, i) {
        var n = t("./render-engine"), r = t("./render-flow");
        cc.vmath.vec3.create();
        cc.renderer = e.exports = {
            renderEngine: n,
            Texture2D: null,
            canvas: null,
            device: null,
            scene: null,
            drawCalls: 0,
            _handle: null,
            _cameraNode: null,
            _camera: null,
            _forward: null,
            initWebGL: function(e, i) {
                t("./webgl/assemblers");
                var s = t("./webgl/model-batcher");
                this.Texture2D = n.Texture2D, this.canvas = e, this.device = new n.Device(e, i), 
                this.scene = new n.Scene(), this._handle = new s(this.device, this.scene), r.init(this._handle);
                var a = function(t) {
                    return {
                        defaultTexture: new n.Texture2D(t, {
                            images: [],
                            width: 128,
                            height: 128,
                            wrapS: n.gfx.WRAP_REPEAT,
                            wrapT: n.gfx.WRAP_REPEAT,
                            format: n.gfx.TEXTURE_FMT_RGB8,
                            mipmap: !1
                        }),
                        programTemplates: n.shaders.templates,
                        programChunks: n.shaders.chunks
                    };
                }(this.device);
                this._forward = new n.ForwardRenderer(this.device, a);
            },
            initCanvas: function(e) {
                var i = t("./canvas");
                n.Texture2D = n.canvas.Texture2D, n.Device = n.canvas.Device, this.Texture2D = n.Texture2D, 
                this.canvas = e, this.device = new n.Device(e), this._camera = {
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    tx: 0,
                    ty: 0
                }, this._handle = new i.RenderComponentHandle(this.device, this._camera), r.init(this._handle), 
                this._forward = new i.ForwardRenderer();
            },
            updateCameraViewport: function() {
                if (cc.director) {
                    var t = cc.director.getScene();
                    t.scaleX = t.scaleY = 1;
                }
                if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                    var e = cc.view.getViewportRect();
                    this.device.setViewport(e.x, e.y, e.width, e.height), this._camera.a = cc.view.getScaleX(), 
                    this._camera.d = cc.view.getScaleY(), this._camera.tx = e.x, this._camera.ty = e.y + e.height;
                } else {}
            },
            render: function(t) {
                this.device._stats.drawcalls = 0, t && (r.visit(t), this._forward.render(this.scene), 
                this.drawCalls = this.device._stats.drawcalls);
            },
            clear: function() {
                this._handle.reset(), this._forward._reset();
            }
        };
    }, {
        "./canvas": 109,
        "./render-engine": 124,
        "./render-flow": 125,
        "./webgl/assemblers": 133,
        "./webgl/model-batcher": 147
    } ],
    124: [ function(t, e, i) {
        "use strict";
        var n = Math.PI / 180, r = 180 / Math.PI, s = 1e-6;
        function a(t) {
            return t * n;
        }
        var o = Math.random;
        function c(t, e) {
            return Math.random() * (e - t) + t;
        }
        var h = 32, l = -1 << h - 1;
        function u(t) {
            var e = 32;
            return (t &= -t) && e--, 65535 & t && (e -= 16), 16711935 & t && (e -= 8), 252645135 & t && (e -= 4), 
            858993459 & t && (e -= 2), 1431655765 & t && (e -= 1), e;
        }
        var _ = new Array(256);
        (function(t) {
            for (var e = 0; e < 256; ++e) {
                var i = e, n = e, r = 7;
                for (i >>>= 1; i; i >>>= 1) n <<= 1, n |= 1 & i, --r;
                t[e] = n << r & 255;
            }
        })(_);
        var d = Object.freeze({
            INT_BITS: h,
            INT_MAX: 2147483647,
            INT_MIN: l,
            sign: function(t) {
                return (t > 0) - (t < 0);
            },
            abs: function(t) {
                var e = t >> h - 1;
                return (t ^ e) - e;
            },
            min: function(t, e) {
                return e ^ (t ^ e) & -(t < e);
            },
            max: function(t, e) {
                return t ^ (t ^ e) & -(t < e);
            },
            isPow2: function(t) {
                return !(t & t - 1 || !t);
            },
            log2: function(t) {
                var e, i;
                return e = (t > 65535) << 4, e |= i = ((t >>>= e) > 255) << 3, e |= i = ((t >>>= i) > 15) << 2, 
                (e |= i = ((t >>>= i) > 3) << 1) | (t >>>= i) >> 1;
            },
            log10: function(t) {
                return t >= 1e9 ? 9 : t >= 1e8 ? 8 : t >= 1e7 ? 7 : t >= 1e6 ? 6 : t >= 1e5 ? 5 : t >= 1e4 ? 4 : t >= 1e3 ? 3 : t >= 100 ? 2 : t >= 10 ? 1 : 0;
            },
            popCount: function(t) {
                return 16843009 * ((t = (858993459 & (t -= t >>> 1 & 1431655765)) + (t >>> 2 & 858993459)) + (t >>> 4) & 252645135) >>> 24;
            },
            countTrailingZeros: u,
            nextPow2: function(t) {
                return t += 0 === t, --t, t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, 
                1 + (t |= t >>> 16);
            },
            prevPow2: function(t) {
                return t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, (t |= t >>> 16) - (t >>> 1);
            },
            parity: function(t) {
                return t ^= t >>> 16, t ^= t >>> 8, t ^= t >>> 4, 27030 >>> (t &= 15) & 1;
            },
            reverse: function(t) {
                return _[255 & t] << 24 | _[t >>> 8 & 255] << 16 | _[t >>> 16 & 255] << 8 | _[t >>> 24 & 255];
            },
            interleave2: function(t, e) {
                return (t = 1431655765 & ((t = 858993459 & ((t = 252645135 & ((t = 16711935 & ((t &= 65535) | t << 8)) | t << 4)) | t << 2)) | t << 1)) | (e = 1431655765 & ((e = 858993459 & ((e = 252645135 & ((e = 16711935 & ((e &= 65535) | e << 8)) | e << 4)) | e << 2)) | e << 1)) << 1;
            },
            deinterleave2: function(t, e) {
                return (t = 65535 & ((t = 16711935 & ((t = 252645135 & ((t = 858993459 & ((t = t >>> e & 1431655765) | t >>> 1)) | t >>> 2)) | t >>> 4)) | t >>> 16)) << 16 >> 16;
            },
            interleave3: function(t, e, i) {
                return t = 1227133513 & ((t = 3272356035 & ((t = 251719695 & ((t = 4278190335 & ((t &= 1023) | t << 16)) | t << 8)) | t << 4)) | t << 2), 
                (t |= (e = 1227133513 & ((e = 3272356035 & ((e = 251719695 & ((e = 4278190335 & ((e &= 1023) | e << 16)) | e << 8)) | e << 4)) | e << 2)) << 1) | (i = 1227133513 & ((i = 3272356035 & ((i = 251719695 & ((i = 4278190335 & ((i &= 1023) | i << 16)) | i << 8)) | i << 4)) | i << 2)) << 2;
            },
            deinterleave3: function(t, e) {
                return (t = 1023 & ((t = 4278190335 & ((t = 251719695 & ((t = 3272356035 & ((t = t >>> e & 1227133513) | t >>> 2)) | t >>> 4)) | t >>> 8)) | t >>> 16)) << 22 >> 22;
            },
            nextCombination: function(t) {
                var e = t | t - 1;
                return e + 1 | (~e & -~e) - 1 >>> u(t) + 1;
            }
        }), f = new Array(2), p = function(t, e) {
            this.x = t, this.y = e;
        };
        p.prototype.toJSON = function() {
            return f[0] = this.x, f[1] = this.y, f;
        };
        var m = {
            create: function() {
                return new p(0, 0);
            },
            new: function(t, e) {
                return new p(t, e);
            },
            clone: function(t) {
                return new p(t.x, t.y);
            },
            copy: function(t, e) {
                return t.x = e.x, t.y = e.y, t;
            },
            set: function(t, e, i) {
                return t.x = e, t.y = i, t;
            },
            add: function(t, e, i) {
                return t.x = e.x + i.x, t.y = e.y + i.y, t;
            },
            subtract: function(t, e, i) {
                return t.x = e.x - i.x, t.y = e.y - i.y, t;
            }
        };
        m.sub = m.subtract, m.multiply = function(t, e, i) {
            return t.x = e.x * i.x, t.y = e.y * i.y, t;
        }, m.mul = m.multiply, m.divide = function(t, e, i) {
            return t.x = e.x / i.x, t.y = e.y / i.y, t;
        }, m.div = m.divide, m.ceil = function(t, e) {
            return t.x = Math.ceil(e.x), t.y = Math.ceil(e.y), t;
        }, m.floor = function(t, e) {
            return t.x = Math.floor(e.x), t.y = Math.floor(e.y), t;
        }, m.min = function(t, e, i) {
            return t.x = Math.min(e.x, i.x), t.y = Math.min(e.y, i.y), t;
        }, m.max = function(t, e, i) {
            return t.x = Math.max(e.x, i.x), t.y = Math.max(e.y, i.y), t;
        }, m.round = function(t, e) {
            return t.x = Math.round(e.x), t.y = Math.round(e.y), t;
        }, m.scale = function(t, e, i) {
            return t.x = e.x * i, t.y = e.y * i, t;
        }, m.scaleAndAdd = function(t, e, i, n) {
            return t.x = e.x + i.x * n, t.y = e.y + i.y * n, t;
        }, m.distance = function(t, e) {
            var i = e.x - t.x, n = e.y - t.y;
            return Math.sqrt(i * i + n * n);
        }, m.dist = m.distance, m.squaredDistance = function(t, e) {
            var i = e.x - t.x, n = e.y - t.y;
            return i * i + n * n;
        }, m.sqrDist = m.squaredDistance, m.length = function(t) {
            var e = t.x, i = t.y;
            return Math.sqrt(e * e + i * i);
        }, m.len = m.length, m.squaredLength = function(t) {
            var e = t.x, i = t.y;
            return e * e + i * i;
        }, m.sqrLen = m.squaredLength, m.negate = function(t, e) {
            return t.x = -e.x, t.y = -e.y, t;
        }, m.inverse = function(t, e) {
            return t.x = 1 / e.x, t.y = 1 / e.y, t;
        }, m.inverseSafe = function(t, e) {
            var i = e.x, n = e.y;
            return Math.abs(i) < s ? t.x = 0 : t.x = 1 / i, Math.abs(n) < s ? t.y = 0 : t.y = 1 / e.y, 
            t;
        }, m.normalize = function(t, e) {
            var i = e.x, n = e.y, r = i * i + n * n;
            return r > 0 && (r = 1 / Math.sqrt(r), t.x = e.x * r, t.y = e.y * r), t;
        }, m.dot = function(t, e) {
            return t.x * e.x + t.y * e.y;
        }, m.cross = function(t, e, i) {
            var n = e.x * i.y - e.y * i.x;
            return t.x = t.y = 0, t.z = n, t;
        }, m.lerp = function(t, e, i, n) {
            var r = e.x, s = e.y;
            return t.x = r + n * (i.x - r), t.y = s + n * (i.y - s), t;
        }, m.random = function(t, e) {
            e = e || 1;
            var i = 2 * o() * Math.PI;
            return t.x = Math.cos(i) * e, t.y = Math.sin(i) * e, t;
        }, m.transformMat2 = function(t, e, i) {
            var n = e.x, r = e.y;
            return t.x = i.m00 * n + i.m02 * r, t.y = i.m01 * n + i.m03 * r, t;
        }, m.transformMat23 = function(t, e, i) {
            var n = e.x, r = e.y;
            return t.x = i.m00 * n + i.m02 * r + i.m04, t.y = i.m01 * n + i.m03 * r + i.m05, 
            t;
        }, m.transformMat3 = function(t, e, i) {
            var n = e.x, r = e.y;
            return t.x = i.m00 * n + i.m03 * r + i.m06, t.y = i.m01 * n + i.m04 * r + i.m07, 
            t;
        }, m.transformMat4 = function(t, e, i) {
            var n = e.x, r = e.y;
            return t.x = i.m00 * n + i.m04 * r + i.m12, t.y = i.m01 * n + i.m05 * r + i.m13, 
            t;
        }, m.forEach = function() {
            var t = m.create();
            return function(e, i, n, r, s, a) {
                var o, c;
                for (i || (i = 2), n || (n = 0), c = r ? Math.min(r * i + n, e.length) : e.length, 
                o = n; o < c; o += i) t.x = e[o], t.y = e[o + 1], s(t, t, a), e[o] = t.x, e[o + 1] = t.y;
                return e;
            };
        }(), m.str = function(t) {
            return "vec2(" + t.x + ", " + t.y + ")";
        }, m.array = function(t, e) {
            return t[0] = e.x, t[1] = e.y, t;
        }, m.exactEquals = function(t, e) {
            return t.x === e.x && t.y === e.y;
        }, m.equals = function(t, e) {
            var i = t.x, n = t.y, r = e.x, a = e.y;
            return Math.abs(i - r) <= s * Math.max(1, Math.abs(i), Math.abs(r)) && Math.abs(n - a) <= s * Math.max(1, Math.abs(n), Math.abs(a));
        };
        var v = new Array(3), g = function(t, e, i) {
            this.x = t, this.y = e, this.z = i;
        };
        g.prototype.toJSON = function() {
            return v[0] = this.x, v[1] = this.y, v[2] = this.z, v;
        };
        var y = {
            create: function() {
                return new g(0, 0, 0);
            },
            new: function(t, e, i) {
                return new g(t, e, i);
            },
            clone: function(t) {
                return new g(t.x, t.y, t.z);
            },
            copy: function(t, e) {
                return t.x = e.x, t.y = e.y, t.z = e.z, t;
            },
            set: function(t, e, i, n) {
                return t.x = e, t.y = i, t.z = n, t;
            },
            add: function(t, e, i) {
                return t.x = e.x + i.x, t.y = e.y + i.y, t.z = e.z + i.z, t;
            },
            subtract: function(t, e, i) {
                return t.x = e.x - i.x, t.y = e.y - i.y, t.z = e.z - i.z, t;
            }
        };
        y.sub = y.subtract, y.multiply = function(t, e, i) {
            return t.x = e.x * i.x, t.y = e.y * i.y, t.z = e.z * i.z, t;
        }, y.mul = y.multiply, y.divide = function(t, e, i) {
            return t.x = e.x / i.x, t.y = e.y / i.y, t.z = e.z / i.z, t;
        }, y.div = y.divide, y.ceil = function(t, e) {
            return t.x = Math.ceil(e.x), t.y = Math.ceil(e.y), t.z = Math.ceil(e.z), t;
        }, y.floor = function(t, e) {
            return t.x = Math.floor(e.x), t.y = Math.floor(e.y), t.z = Math.floor(e.z), t;
        }, y.min = function(t, e, i) {
            return t.x = Math.min(e.x, i.x), t.y = Math.min(e.y, i.y), t.z = Math.min(e.z, i.z), 
            t;
        }, y.max = function(t, e, i) {
            return t.x = Math.max(e.x, i.x), t.y = Math.max(e.y, i.y), t.z = Math.max(e.z, i.z), 
            t;
        }, y.round = function(t, e) {
            return t.x = Math.round(e.x), t.y = Math.round(e.y), t.z = Math.round(e.z), t;
        }, y.scale = function(t, e, i) {
            return t.x = e.x * i, t.y = e.y * i, t.z = e.z * i, t;
        }, y.scaleAndAdd = function(t, e, i, n) {
            return t.x = e.x + i.x * n, t.y = e.y + i.y * n, t.z = e.z + i.z * n, t;
        }, y.distance = function(t, e) {
            var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z;
            return Math.sqrt(i * i + n * n + r * r);
        }, y.dist = y.distance, y.squaredDistance = function(t, e) {
            var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z;
            return i * i + n * n + r * r;
        }, y.sqrDist = y.squaredDistance, y.length = function(t) {
            var e = t.x, i = t.y, n = t.z;
            return Math.sqrt(e * e + i * i + n * n);
        }, y.len = y.length, y.squaredLength = function(t) {
            var e = t.x, i = t.y, n = t.z;
            return e * e + i * i + n * n;
        }, y.sqrLen = y.squaredLength, y.negate = function(t, e) {
            return t.x = -e.x, t.y = -e.y, t.z = -e.z, t;
        }, y.inverse = function(t, e) {
            return t.x = 1 / e.x, t.y = 1 / e.y, t.z = 1 / e.z, t;
        }, y.inverseSafe = function(t, e) {
            var i = e.x, n = e.y, r = e.z;
            return Math.abs(i) < s ? t.x = 0 : t.x = 1 / i, Math.abs(n) < s ? t.y = 0 : t.y = 1 / n, 
            Math.abs(r) < s ? t.z = 0 : t.z = 1 / r, t;
        }, y.normalize = function(t, e) {
            var i = e.x, n = e.y, r = e.z, s = i * i + n * n + r * r;
            return s > 0 && (s = 1 / Math.sqrt(s), t.x = i * s, t.y = n * s, t.z = r * s), t;
        }, y.dot = function(t, e) {
            return t.x * e.x + t.y * e.y + t.z * e.z;
        }, y.cross = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z, a = i.x, o = i.y, c = i.z;
            return t.x = r * c - s * o, t.y = s * a - n * c, t.z = n * o - r * a, t;
        }, y.lerp = function(t, e, i, n) {
            var r = e.x, s = e.y, a = e.z;
            return t.x = r + n * (i.x - r), t.y = s + n * (i.y - s), t.z = a + n * (i.z - a), 
            t;
        }, y.hermite = function(t, e, i, n, r, s) {
            var a = s * s, o = a * (2 * s - 3) + 1, c = a * (s - 2) + s, h = a * (s - 1), l = a * (3 - 2 * s);
            return t.x = e.x * o + i.x * c + n.x * h + r.x * l, t.y = e.y * o + i.y * c + n.y * h + r.y * l, 
            t.z = e.z * o + i.z * c + n.z * h + r.z * l, t;
        }, y.bezier = function(t, e, i, n, r, s) {
            var a = 1 - s, o = a * a, c = s * s, h = o * a, l = 3 * s * o, u = 3 * c * a, _ = c * s;
            return t.x = e.x * h + i.x * l + n.x * u + r.x * _, t.y = e.y * h + i.y * l + n.y * u + r.y * _, 
            t.z = e.z * h + i.z * l + n.z * u + r.z * _, t;
        }, y.random = function(t, e) {
            e = e || 1;
            var i = 2 * o() * Math.PI, n = 2 * o() - 1, r = Math.sqrt(1 - n * n) * e;
            return t.x = Math.cos(i) * r, t.y = Math.sin(i) * r, t.z = n * e, t;
        }, y.transformMat4 = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z, a = i.m03 * n + i.m07 * r + i.m11 * s + i.m15;
            return a = a || 1, t.x = (i.m00 * n + i.m04 * r + i.m08 * s + i.m12) / a, t.y = (i.m01 * n + i.m05 * r + i.m09 * s + i.m13) / a, 
            t.z = (i.m02 * n + i.m06 * r + i.m10 * s + i.m14) / a, t;
        }, y.transformMat3 = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z;
            return t.x = n * i.m00 + r * i.m03 + s * i.m06, t.y = n * i.m01 + r * i.m04 + s * i.m07, 
            t.z = n * i.m02 + r * i.m05 + s * i.m08, t;
        }, y.transformQuat = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z, a = i.x, o = i.y, c = i.z, h = i.w, l = h * n + o * s - c * r, u = h * r + c * n - a * s, _ = h * s + a * r - o * n, d = -a * n - o * r - c * s;
            return t.x = l * h + d * -a + u * -c - _ * -o, t.y = u * h + d * -o + _ * -a - l * -c, 
            t.z = _ * h + d * -c + l * -o - u * -a, t;
        }, y.rotateX = function(t, e, i, n) {
            var r = [], s = [];
            return r.x = e.x - i.x, r.y = e.y - i.y, r.z = e.z - i.z, s.x = r.x, s.y = r.y * Math.cos(n) - r.z * Math.sin(n), 
            s.z = r.y * Math.sin(n) + r.z * Math.cos(n), t.x = s.x + i.x, t.y = s.y + i.y, t.z = s.z + i.z, 
            t;
        }, y.rotateY = function(t, e, i, n) {
            var r = [], s = [];
            return r.x = e.x - i.x, r.y = e.y - i.y, r.z = e.z - i.z, s.x = r.z * Math.sin(n) + r.x * Math.cos(n), 
            s.y = r.y, s.z = r.z * Math.cos(n) - r.x * Math.sin(n), t.x = s.x + i.x, t.y = s.y + i.y, 
            t.z = s.z + i.z, t;
        }, y.rotateZ = function(t, e, i, n) {
            var r = [], s = [];
            return r.x = e.x - i.x, r.y = e.y - i.y, r.z = e.z - i.z, s.x = r.x * Math.cos(n) - r.y * Math.sin(n), 
            s.y = r.x * Math.sin(n) + r.y * Math.cos(n), s.z = r.z, t.x = s.x + i.x, t.y = s.y + i.y, 
            t.z = s.z + i.z, t;
        }, y.forEach = function() {
            var t = y.create();
            return function(e, i, n, r, s, a) {
                var o, c;
                for (i || (i = 3), n || (n = 0), c = r ? Math.min(r * i + n, e.length) : e.length, 
                o = n; o < c; o += i) t.x = e[o], t.y = e[o + 1], t.z = e[o + 2], s(t, t, a), e[o] = t.x, 
                e[o + 1] = t.y, e[o + 2] = t.z;
                return e;
            };
        }(), y.angle = function() {
            var t = y.create(), e = y.create();
            return function(i, n) {
                y.copy(t, i), y.copy(e, n), y.normalize(t, t), y.normalize(e, e);
                var r = y.dot(t, e);
                return r > 1 ? 0 : r < -1 ? Math.PI : Math.acos(r);
            };
        }(), y.str = function(t) {
            return "vec3(" + t.x + ", " + t.y + ", " + t.z + ")";
        }, y.array = function(t, e) {
            return t[0] = e.x, t[1] = e.y, t[2] = e.z, t;
        }, y.exactEquals = function(t, e) {
            return t.x === e.x && t.y === e.y && t.z === e.z;
        }, y.equals = function(t, e) {
            var i = t.x, n = t.y, r = t.z, a = e.x, o = e.y, c = e.z;
            return Math.abs(i - a) <= s * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(n - o) <= s * Math.max(1, Math.abs(n), Math.abs(o)) && Math.abs(r - c) <= s * Math.max(1, Math.abs(r), Math.abs(c));
        };
        var x = new Array(4), E = function(t, e, i, n) {
            this.x = t, this.y = e, this.z = i, this.w = n;
        };
        E.prototype.toJSON = function() {
            return x[0] = this.x, x[1] = this.y, x[2] = this.z, x[3] = this.w, x;
        };
        var T = {
            create: function() {
                return new E(0, 0, 0, 0);
            },
            new: function(t, e, i, n) {
                return new E(t, e, i, n);
            },
            clone: function(t) {
                return new E(t.x, t.y, t.z, t.w);
            },
            copy: function(t, e) {
                return t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t;
            },
            set: function(t, e, i, n, r) {
                return t.x = e, t.y = i, t.z = n, t.w = r, t;
            },
            add: function(t, e, i) {
                return t.x = e.x + i.x, t.y = e.y + i.y, t.z = e.z + i.z, t.w = e.w + i.w, t;
            },
            subtract: function(t, e, i) {
                return t.x = e.x - i.x, t.y = e.y - i.y, t.z = e.z - i.z, t.w = e.w - i.w, t;
            }
        };
        T.sub = T.subtract, T.multiply = function(t, e, i) {
            return t.x = e.x * i.x, t.y = e.y * i.y, t.z = e.z * i.z, t.w = e.w * i.w, t;
        }, T.mul = T.multiply, T.divide = function(t, e, i) {
            return t.x = e.x / i.x, t.y = e.y / i.y, t.z = e.z / i.z, t.w = e.w / i.w, t;
        }, T.div = T.divide, T.ceil = function(t, e) {
            return t.x = Math.ceil(e.x), t.y = Math.ceil(e.y), t.z = Math.ceil(e.z), t.w = Math.ceil(e.w), 
            t;
        }, T.floor = function(t, e) {
            return t.x = Math.floor(e.x), t.y = Math.floor(e.y), t.z = Math.floor(e.z), t.w = Math.floor(e.w), 
            t;
        }, T.min = function(t, e, i) {
            return t.x = Math.min(e.x, i.x), t.y = Math.min(e.y, i.y), t.z = Math.min(e.z, i.z), 
            t.w = Math.min(e.w, i.w), t;
        }, T.max = function(t, e, i) {
            return t.x = Math.max(e.x, i.x), t.y = Math.max(e.y, i.y), t.z = Math.max(e.z, i.z), 
            t.w = Math.max(e.w, i.w), t;
        }, T.round = function(t, e) {
            return t.x = Math.round(e.x), t.y = Math.round(e.y), t.z = Math.round(e.z), t.w = Math.round(e.w), 
            t;
        }, T.scale = function(t, e, i) {
            return t.x = e.x * i, t.y = e.y * i, t.z = e.z * i, t.w = e.w * i, t;
        }, T.scaleAndAdd = function(t, e, i, n) {
            return t.x = e.x + i.x * n, t.y = e.y + i.y * n, t.z = e.z + i.z * n, t.w = e.w + i.w * n, 
            t;
        }, T.distance = function(t, e) {
            var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z, s = e.w - t.w;
            return Math.sqrt(i * i + n * n + r * r + s * s);
        }, T.dist = T.distance, T.squaredDistance = function(t, e) {
            var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z, s = e.w - t.w;
            return i * i + n * n + r * r + s * s;
        }, T.sqrDist = T.squaredDistance, T.length = function(t) {
            var e = t.x, i = t.y, n = t.z, r = t.w;
            return Math.sqrt(e * e + i * i + n * n + r * r);
        }, T.len = T.length, T.squaredLength = function(t) {
            var e = t.x, i = t.y, n = t.z, r = t.w;
            return e * e + i * i + n * n + r * r;
        }, T.sqrLen = T.squaredLength, T.negate = function(t, e) {
            return t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
        }, T.inverse = function(t, e) {
            return t.x = 1 / e.x, t.y = 1 / e.y, t.z = 1 / e.z, t.w = 1 / e.w, t;
        }, T.inverseSafe = function(t, e) {
            var i = e.x, n = e.y, r = e.z, a = e.w;
            return Math.abs(i) < s ? t.x = 0 : t.x = 1 / i, Math.abs(n) < s ? t.y = 0 : t.y = 1 / n, 
            Math.abs(r) < s ? t.z = 0 : t.z = 1 / r, Math.abs(a) < s ? t.w = 0 : t.w = 1 / a, 
            t;
        }, T.normalize = function(t, e) {
            var i = e.x, n = e.y, r = e.z, s = e.w, a = i * i + n * n + r * r + s * s;
            return a > 0 && (a = 1 / Math.sqrt(a), t.x = i * a, t.y = n * a, t.z = r * a, t.w = s * a), 
            t;
        }, T.dot = function(t, e) {
            return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
        }, T.lerp = function(t, e, i, n) {
            var r = e.x, s = e.y, a = e.z, o = e.w;
            return t.x = r + n * (i.x - r), t.y = s + n * (i.y - s), t.z = a + n * (i.z - a), 
            t.w = o + n * (i.w - o), t;
        }, T.random = function(t, e) {
            return e = e || 1, t.x = o(), t.y = o(), t.z = o(), t.w = o(), T.normalize(t, t), 
            T.scale(t, t, e), t;
        }, T.transformMat4 = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z, a = e.w;
            return t.x = i.m00 * n + i.m04 * r + i.m08 * s + i.m12 * a, t.y = i.m01 * n + i.m05 * r + i.m09 * s + i.m13 * a, 
            t.z = i.m02 * n + i.m06 * r + i.m10 * s + i.m14 * a, t.w = i.m03 * n + i.m07 * r + i.m11 * s + i.m15 * a, 
            t;
        }, T.transformQuat = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z, a = i.x, o = i.y, c = i.z, h = i.w, l = h * n + o * s - c * r, u = h * r + c * n - a * s, _ = h * s + a * r - o * n, d = -a * n - o * r - c * s;
            return t.x = l * h + d * -a + u * -c - _ * -o, t.y = u * h + d * -o + _ * -a - l * -c, 
            t.z = _ * h + d * -c + l * -o - u * -a, t.w = e.w, t;
        }, T.forEach = function() {
            var t = T.create();
            return function(e, i, n, r, s, a) {
                var o, c;
                for (i || (i = 4), n || (n = 0), c = r ? Math.min(r * i + n, e.length) : e.length, 
                o = n; o < c; o += i) t.x = e[o], t.y = e[o + 1], t.z = e[o + 2], t.w = e[o + 3], 
                s(t, t, a), e[o] = t.x, e[o + 1] = t.y, e[o + 2] = t.z, e[o + 3] = t.w;
                return e;
            };
        }(), T.str = function(t) {
            return "vec4(" + t.x + ", " + t.y + ", " + t.z + ", " + t.w + ")";
        }, T.array = function(t, e) {
            return t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w, t;
        }, T.exactEquals = function(t, e) {
            return t.x === e.x && t.y === e.y && t.z === e.z && t.w === e.w;
        }, T.equals = function(t, e) {
            var i = t.x, n = t.y, r = t.z, a = t.w, o = e.x, c = e.y, h = e.z, l = e.w;
            return Math.abs(i - o) <= s * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(n - c) <= s * Math.max(1, Math.abs(n), Math.abs(c)) && Math.abs(r - h) <= s * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(a - l) <= s * Math.max(1, Math.abs(a), Math.abs(l));
        };
        var C = new Array(9), A = function(t, e, i, n, r, s, a, o, c) {
            this.m00 = t, this.m01 = e, this.m02 = i, this.m03 = n, this.m04 = r, this.m05 = s, 
            this.m06 = a, this.m07 = o, this.m08 = c;
        };
        A.prototype.toJSON = function() {
            return C[0] = this.m00, C[1] = this.m01, C[2] = this.m02, C[3] = this.m03, C[4] = this.m04, 
            C[5] = this.m05, C[6] = this.m06, C[7] = this.m07, C[8] = this.m08, C;
        };
        var b = {
            create: function() {
                return new A(1, 0, 0, 0, 1, 0, 0, 0, 1);
            },
            new: function(t, e, i, n, r, s, a, o, c) {
                return new A(t, e, i, n, r, s, a, o, c);
            },
            clone: function(t) {
                return new A(t.m00, t.m01, t.m02, t.m03, t.m04, t.m05, t.m06, t.m07, t.m08);
            },
            copy: function(t, e) {
                return t.m00 = e.m00, t.m01 = e.m01, t.m02 = e.m02, t.m03 = e.m03, t.m04 = e.m04, 
                t.m05 = e.m05, t.m06 = e.m06, t.m07 = e.m07, t.m08 = e.m08, t;
            },
            set: function(t, e, i, n, r, s, a, o, c, h) {
                return t.m00 = e, t.m01 = i, t.m02 = n, t.m03 = r, t.m04 = s, t.m05 = a, t.m06 = o, 
                t.m07 = c, t.m08 = h, t;
            },
            identity: function(t) {
                return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 1, t.m05 = 0, t.m06 = 0, 
                t.m07 = 0, t.m08 = 1, t;
            },
            transpose: function(t, e) {
                if (t === e) {
                    var i = e.m01, n = e.m02, r = e.m05;
                    t.m01 = e.m03, t.m02 = e.m06, t.m03 = i, t.m05 = e.m07, t.m06 = n, t.m07 = r;
                } else t.m00 = e.m00, t.m01 = e.m03, t.m02 = e.m06, t.m03 = e.m01, t.m04 = e.m04, 
                t.m05 = e.m07, t.m06 = e.m02, t.m07 = e.m05, t.m08 = e.m08;
                return t;
            },
            invert: function(t, e) {
                var i = e.m00, n = e.m01, r = e.m02, s = e.m03, a = e.m04, o = e.m05, c = e.m06, h = e.m07, l = e.m08, u = l * a - o * h, _ = -l * s + o * c, d = h * s - a * c, f = i * u + n * _ + r * d;
                return f ? (f = 1 / f, t.m00 = u * f, t.m01 = (-l * n + r * h) * f, t.m02 = (o * n - r * a) * f, 
                t.m03 = _ * f, t.m04 = (l * i - r * c) * f, t.m05 = (-o * i + r * s) * f, t.m06 = d * f, 
                t.m07 = (-h * i + n * c) * f, t.m08 = (a * i - n * s) * f, t) : null;
            },
            adjoint: function(t, e) {
                var i = e.m00, n = e.m01, r = e.m02, s = e.m03, a = e.m04, o = e.m05, c = e.m06, h = e.m07, l = e.m08;
                return t.m00 = a * l - o * h, t.m01 = r * h - n * l, t.m02 = n * o - r * a, t.m03 = o * c - s * l, 
                t.m04 = i * l - r * c, t.m05 = r * s - i * o, t.m06 = s * h - a * c, t.m07 = n * c - i * h, 
                t.m08 = i * a - n * s, t;
            },
            determinant: function(t) {
                var e = t.m00, i = t.m01, n = t.m02, r = t.m03, s = t.m04, a = t.m05, o = t.m06, c = t.m07, h = t.m08;
                return e * (h * s - a * c) + i * (-h * r + a * o) + n * (c * r - s * o);
            },
            multiply: function(t, e, i) {
                var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = e.m06, l = e.m07, u = e.m08, _ = i.m00, d = i.m01, f = i.m02, p = i.m03, m = i.m04, v = i.m05, g = i.m06, y = i.m07, x = i.m08;
                return t.m00 = _ * n + d * a + f * h, t.m01 = _ * r + d * o + f * l, t.m02 = _ * s + d * c + f * u, 
                t.m03 = p * n + m * a + v * h, t.m04 = p * r + m * o + v * l, t.m05 = p * s + m * c + v * u, 
                t.m06 = g * n + y * a + x * h, t.m07 = g * r + y * o + x * l, t.m08 = g * s + y * c + x * u, 
                t;
            }
        };
        b.mul = b.multiply, b.translate = function(t, e, i) {
            var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = e.m06, l = e.m07, u = e.m08, _ = i.x, d = i.y;
            return t.m00 = n, t.m01 = r, t.m02 = s, t.m03 = a, t.m04 = o, t.m05 = c, t.m06 = _ * n + d * a + h, 
            t.m07 = _ * r + d * o + l, t.m08 = _ * s + d * c + u, t;
        }, b.rotate = function(t, e, i) {
            var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = e.m06, l = e.m07, u = e.m08, _ = Math.sin(i), d = Math.cos(i);
            return t.m00 = d * n + _ * a, t.m01 = d * r + _ * o, t.m02 = d * s + _ * c, t.m03 = d * a - _ * n, 
            t.m04 = d * o - _ * r, t.m05 = d * c - _ * s, t.m06 = h, t.m07 = l, t.m08 = u, t;
        }, b.scale = function(t, e, i) {
            var n = i.x, r = i.y;
            return t.m00 = n * e.m00, t.m01 = n * e.m01, t.m02 = n * e.m02, t.m03 = r * e.m03, 
            t.m04 = r * e.m04, t.m05 = r * e.m05, t.m06 = e.m06, t.m07 = e.m07, t.m08 = e.m08, 
            t;
        }, b.fromMat4 = function(t, e) {
            return t.m00 = e.m00, t.m01 = e.m01, t.m02 = e.m02, t.m03 = e.m04, t.m04 = e.m05, 
            t.m05 = e.m06, t.m06 = e.m08, t.m07 = e.m09, t.m08 = e.m10, t;
        }, b.fromTranslation = function(t, e) {
            return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 1, t.m05 = 0, t.m06 = e.x, 
            t.m07 = e.y, t.m08 = 1, t;
        }, b.fromRotation = function(t, e) {
            var i = Math.sin(e), n = Math.cos(e);
            return t.m00 = n, t.m01 = i, t.m02 = 0, t.m03 = -i, t.m04 = n, t.m05 = 0, t.m06 = 0, 
            t.m07 = 0, t.m08 = 1, t;
        }, b.fromScaling = function(t, e) {
            return t.m00 = e.x, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = e.y, t.m05 = 0, t.m06 = 0, 
            t.m07 = 0, t.m08 = 1, t;
        }, b.fromMat2d = function(t, e) {
            return t.m00 = e.m00, t.m01 = e.m01, t.m02 = 0, t.m03 = e.m02, t.m04 = e.m03, t.m05 = 0, 
            t.m06 = e.m04, t.m07 = e.m05, t.m08 = 1, t;
        }, b.fromQuat = function(t, e) {
            var i = e.x, n = e.y, r = e.z, s = e.w, a = i + i, o = n + n, c = r + r, h = i * a, l = n * a, u = n * o, _ = r * a, d = r * o, f = r * c, p = s * a, m = s * o, v = s * c;
            return t.m00 = 1 - u - f, t.m03 = l - v, t.m06 = _ + m, t.m01 = l + v, t.m04 = 1 - h - f, 
            t.m07 = d - p, t.m02 = _ - m, t.m05 = d + p, t.m08 = 1 - h - u, t;
        }, b.fromViewUp = function() {
            var t = y.new(0, 1, 0), e = y.create(), i = y.create();
            return function(n, r, a) {
                return y.sqrLen(r) < s * s ? (b.identity(n), n) : (a = a || t, y.cross(e, a, r), 
                y.sqrLen(e) < s * s ? (b.identity(n), n) : (y.cross(i, r, e), b.set(n, e.x, e.y, e.z, i.x, i.y, i.z, r.x, r.y, r.z), 
                n));
            };
        }(), b.normalFromMat4 = function(t, e) {
            var i = e.m00, n = e.m01, r = e.m02, s = e.m03, a = e.m04, o = e.m05, c = e.m06, h = e.m07, l = e.m08, u = e.m09, _ = e.m10, d = e.m11, f = e.m12, p = e.m13, m = e.m14, v = e.m15, g = i * o - n * a, y = i * c - r * a, x = i * h - s * a, E = n * c - r * o, T = n * h - s * o, C = r * h - s * c, A = l * p - u * f, b = l * m - _ * f, w = l * v - d * f, D = u * m - _ * p, S = u * v - d * p, R = _ * v - d * m, M = g * R - y * S + x * D + E * w - T * b + C * A;
            return M ? (M = 1 / M, t.m00 = (o * R - c * S + h * D) * M, t.m01 = (c * w - a * R - h * b) * M, 
            t.m02 = (a * S - o * w + h * A) * M, t.m03 = (r * S - n * R - s * D) * M, t.m04 = (i * R - r * w + s * b) * M, 
            t.m05 = (n * w - i * S - s * A) * M, t.m06 = (p * C - m * T + v * E) * M, t.m07 = (m * x - f * C - v * y) * M, 
            t.m08 = (f * T - p * x + v * g) * M, t) : null;
        }, b.str = function(t) {
            return "mat3(" + t.m00 + ", " + t.m01 + ", " + t.m02 + ", " + t.m03 + ", " + t.m04 + ", " + t.m05 + ", " + t.m06 + ", " + t.m07 + ", " + t.m08 + ")";
        }, b.array = function(t, e) {
            return t[0] = e.m00, t[1] = e.m01, t[2] = e.m02, t[3] = e.m03, t[4] = e.m04, t[5] = e.m05, 
            t[6] = e.m06, t[7] = e.m07, t[8] = e.m08, t;
        }, b.frob = function(t) {
            return Math.sqrt(Math.pow(t.m00, 2) + Math.pow(t.m01, 2) + Math.pow(t.m02, 2) + Math.pow(t.m03, 2) + Math.pow(t.m04, 2) + Math.pow(t.m05, 2) + Math.pow(t.m06, 2) + Math.pow(t.m07, 2) + Math.pow(t.m08, 2));
        }, b.add = function(t, e, i) {
            return t.m00 = e.m00 + i.m00, t.m01 = e.m01 + i.m01, t.m02 = e.m02 + i.m02, t.m03 = e.m03 + i.m03, 
            t.m04 = e.m04 + i.m04, t.m05 = e.m05 + i.m05, t.m06 = e.m06 + i.m06, t.m07 = e.m07 + i.m07, 
            t.m08 = e.m08 + i.m08, t;
        }, b.subtract = function(t, e, i) {
            return t.m00 = e.m00 - i.m00, t.m01 = e.m01 - i.m01, t.m02 = e.m02 - i.m02, t.m03 = e.m03 - i.m03, 
            t.m04 = e.m04 - i.m04, t.m05 = e.m05 - i.m05, t.m06 = e.m06 - i.m06, t.m07 = e.m07 - i.m07, 
            t.m08 = e.m08 - i.m08, t;
        }, b.sub = b.subtract, b.multiplyScalar = function(t, e, i) {
            return t.m00 = e.m00 * i, t.m01 = e.m01 * i, t.m02 = e.m02 * i, t.m03 = e.m03 * i, 
            t.m04 = e.m04 * i, t.m05 = e.m05 * i, t.m06 = e.m06 * i, t.m07 = e.m07 * i, t.m08 = e.m08 * i, 
            t;
        }, b.multiplyScalarAndAdd = function(t, e, i, n) {
            return t.m00 = e.m00 + i.m00 * n, t.m01 = e.m01 + i.m01 * n, t.m02 = e.m02 + i.m02 * n, 
            t.m03 = e.m03 + i.m03 * n, t.m04 = e.m04 + i.m04 * n, t.m05 = e.m05 + i.m05 * n, 
            t.m06 = e.m06 + i.m06 * n, t.m07 = e.m07 + i.m07 * n, t.m08 = e.m08 + i.m08 * n, 
            t;
        }, b.exactEquals = function(t, e) {
            return t.m00 === e.m00 && t.m01 === e.m01 && t.m02 === e.m02 && t.m03 === e.m03 && t.m04 === e.m04 && t.m05 === e.m05 && t.m06 === e.m06 && t.m07 === e.m07 && t.m08 === e.m08;
        }, b.equals = function(t, e) {
            var i = t.m00, n = t.m01, r = t.m02, a = t.m03, o = t.m04, c = t.m05, h = t.m06, l = t.m07, u = t.m08, _ = e.m00, d = e.m01, f = e.m02, p = e.m03, m = e.m04, v = e.m05, g = e.m06, y = e.m07, x = e.m08;
            return Math.abs(i - _) <= s * Math.max(1, Math.abs(i), Math.abs(_)) && Math.abs(n - d) <= s * Math.max(1, Math.abs(n), Math.abs(d)) && Math.abs(r - f) <= s * Math.max(1, Math.abs(r), Math.abs(f)) && Math.abs(a - p) <= s * Math.max(1, Math.abs(a), Math.abs(p)) && Math.abs(o - m) <= s * Math.max(1, Math.abs(o), Math.abs(m)) && Math.abs(c - v) <= s * Math.max(1, Math.abs(c), Math.abs(v)) && Math.abs(h - g) <= s * Math.max(1, Math.abs(h), Math.abs(g)) && Math.abs(l - y) <= s * Math.max(1, Math.abs(l), Math.abs(y)) && Math.abs(u - x) <= s * Math.max(1, Math.abs(u), Math.abs(x));
        };
        var w = new Array(4), D = function(t, e, i, n) {
            this.x = t, this.y = e, this.z = i, this.w = n;
        };
        D.prototype.toJSON = function() {
            return w[0] = this.x, w[1] = this.y, w[2] = this.z, w[3] = this.w, w;
        };
        var S = {
            create: function() {
                return new D(0, 0, 0, 1);
            },
            new: function(t, e, i, n) {
                return new D(t, e, i, n);
            },
            clone: function(t) {
                return new D(t.x, t.y, t.z, t.w);
            }
        };
        S.copy = T.copy, S.set = T.set, S.identity = function(t) {
            return t.x = 0, t.y = 0, t.z = 0, t.w = 1, t;
        }, S.rotationTo = function() {
            var t = y.create(), e = y.new(1, 0, 0), i = y.new(0, 1, 0);
            return function(n, r, s) {
                var a = y.dot(r, s);
                return a < -.999999 ? (y.cross(t, e, r), y.length(t) < 1e-6 && y.cross(t, i, r), 
                y.normalize(t, t), S.fromAxisAngle(n, t, Math.PI), n) : a > .999999 ? (n.x = 0, 
                n.y = 0, n.z = 0, n.w = 1, n) : (y.cross(t, r, s), n.x = t.x, n.y = t.y, n.z = t.z, 
                n.w = 1 + a, S.normalize(n, n));
            };
        }(), S.getAxisAngle = function(t, e) {
            var i = 2 * Math.acos(e.w), n = Math.sin(i / 2);
            return 0 != n ? (t.x = e.x / n, t.y = e.y / n, t.z = e.z / n) : (t.x = 1, t.y = 0, 
            t.z = 0), i;
        }, S.multiply = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z, a = e.w, o = i.x, c = i.y, h = i.z, l = i.w;
            return t.x = n * l + a * o + r * h - s * c, t.y = r * l + a * c + s * o - n * h, 
            t.z = s * l + a * h + n * c - r * o, t.w = a * l - n * o - r * c - s * h, t;
        }, S.mul = S.multiply, S.scale = T.scale, S.rotateX = function(t, e, i) {
            i *= .5;
            var n = e.x, r = e.y, s = e.z, a = e.w, o = Math.sin(i), c = Math.cos(i);
            return t.x = n * c + a * o, t.y = r * c + s * o, t.z = s * c - r * o, t.w = a * c - n * o, 
            t;
        }, S.rotateY = function(t, e, i) {
            i *= .5;
            var n = e.x, r = e.y, s = e.z, a = e.w, o = Math.sin(i), c = Math.cos(i);
            return t.x = n * c - s * o, t.y = r * c + a * o, t.z = s * c + n * o, t.w = a * c - r * o, 
            t;
        }, S.rotateZ = function(t, e, i) {
            i *= .5;
            var n = e.x, r = e.y, s = e.z, a = e.w, o = Math.sin(i), c = Math.cos(i);
            return t.x = n * c + r * o, t.y = r * c - n * o, t.z = s * c + a * o, t.w = a * c - s * o, 
            t;
        }, S.rotateAround = function() {
            var t = y.create(), e = S.create();
            return function(i, n, r, s) {
                return S.invert(e, n), y.transformQuat(t, r, e), S.fromAxisAngle(e, t, s), S.mul(i, n, e), 
                i;
            };
        }(), S.rotateAroundLocal = function() {
            var t = S.create();
            return function(e, i, n, r) {
                return S.fromAxisAngle(t, n, r), S.mul(e, i, t), e;
            };
        }(), S.calculateW = function(t, e) {
            var i = e.x, n = e.y, r = e.z;
            return t.x = i, t.y = n, t.z = r, t.w = Math.sqrt(Math.abs(1 - i * i - n * n - r * r)), 
            t;
        }, S.dot = T.dot, S.lerp = T.lerp, S.slerp = function(t, e, i, n) {
            var r, s, a, o, c, h = e.x, l = e.y, u = e.z, _ = e.w, d = i.x, f = i.y, p = i.z, m = i.w;
            return (s = h * d + l * f + u * p + _ * m) < 0 && (s = -s, d = -d, f = -f, p = -p, 
            m = -m), 1 - s > 1e-6 ? (r = Math.acos(s), a = Math.sin(r), o = Math.sin((1 - n) * r) / a, 
            c = Math.sin(n * r) / a) : (o = 1 - n, c = n), t.x = o * h + c * d, t.y = o * l + c * f, 
            t.z = o * u + c * p, t.w = o * _ + c * m, t;
        }, S.sqlerp = function() {
            var t = S.create(), e = S.create();
            return function(i, n, r, s, a, o) {
                return S.slerp(t, n, a, o), S.slerp(e, r, s, o), S.slerp(i, t, e, 2 * o * (1 - o)), 
                i;
            };
        }(), S.invert = function(t, e) {
            var i = e.x, n = e.y, r = e.z, s = e.w, a = i * i + n * n + r * r + s * s, o = a ? 1 / a : 0;
            return t.x = -i * o, t.y = -n * o, t.z = -r * o, t.w = s * o, t;
        }, S.conjugate = function(t, e) {
            return t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = e.w, t;
        }, S.length = T.length, S.len = S.length, S.squaredLength = T.squaredLength, S.sqrLen = S.squaredLength, 
        S.normalize = T.normalize, S.fromAxes = function() {
            var t = b.create();
            return function(e, i, n, r) {
                return b.set(t, i.x, i.y, i.z, n.x, n.y, n.z, r.x, r.y, r.z), S.normalize(e, S.fromMat3(e, t));
            };
        }(), S.fromViewUp = function() {
            var t = b.create();
            return function(e, i, n) {
                return b.fromViewUp(t, i, n), t ? S.normalize(e, S.fromMat3(e, t)) : null;
            };
        }(), S.fromAxisAngle = function(t, e, i) {
            i *= .5;
            var n = Math.sin(i);
            return t.x = n * e.x, t.y = n * e.y, t.z = n * e.z, t.w = Math.cos(i), t;
        }, S.fromMat3 = function(t, e) {
            var i = e.m00, n = e.m03, r = e.m06, s = e.m01, a = e.m04, o = e.m07, c = e.m02, h = e.m05, l = e.m08, u = i + a + l;
            if (u > 0) {
                var _ = .5 / Math.sqrt(u + 1);
                t.w = .25 / _, t.x = (h - o) * _, t.y = (r - c) * _, t.z = (s - n) * _;
            } else if (i > a && i > l) {
                var d = 2 * Math.sqrt(1 + i - a - l);
                t.w = (h - o) / d, t.x = .25 * d, t.y = (n + s) / d, t.z = (r + c) / d;
            } else if (a > l) {
                var f = 2 * Math.sqrt(1 + a - i - l);
                t.w = (r - c) / f, t.x = (n + s) / f, t.y = .25 * f, t.z = (o + h) / f;
            } else {
                var p = 2 * Math.sqrt(1 + l - i - a);
                t.w = (s - n) / p, t.x = (r + c) / p, t.y = (o + h) / p, t.z = .25 * p;
            }
            return t;
        }, S.fromEuler = function(t, e, i, n) {
            var r = .5 * Math.PI / 180;
            e *= r, i *= r, n *= r;
            var s = Math.sin(e), a = Math.cos(e), o = Math.sin(i), c = Math.cos(i), h = Math.sin(n), l = Math.cos(n);
            return t.x = s * c * l - a * o * h, t.y = a * o * l + s * c * h, t.z = a * c * h - s * o * l, 
            t.w = a * c * l + s * o * h, t;
        }, S.str = function(t) {
            return "quat(" + t.x + ", " + t.y + ", " + t.z + ", " + t.w + ")";
        }, S.array = function(t, e) {
            return t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w, t;
        }, S.exactEquals = T.exactEquals, S.equals = T.equals;
        var R = new Array(4), M = function(t, e, i, n) {
            this.m00 = t, this.m01 = e, this.m02 = i, this.m03 = n;
        };
        M.prototype.toJSON = function() {
            return R[0] = this.m00, R[1] = this.m01, R[2] = this.m02, R[3] = this.m03, R;
        };
        var O = {
            create: function() {
                return new M(1, 0, 0, 1);
            },
            new: function(t, e, i, n) {
                return new M(t, e, i, n);
            },
            clone: function(t) {
                return new M(t.m00, t.m01, t.m02, t.m03);
            },
            copy: function(t, e) {
                return t.m00 = e.m00, t.m01 = e.m01, t.m02 = e.m02, t.m03 = e.m03, t;
            },
            identity: function(t) {
                return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 1, t;
            },
            set: function(t, e, i, n, r) {
                return t.m00 = e, t.m01 = i, t.m02 = n, t.m03 = r, t;
            },
            transpose: function(t, e) {
                if (t === e) {
                    var i = e.m01;
                    t.m01 = e.m02, t.m02 = i;
                } else t.m00 = e.m00, t.m01 = e.m02, t.m02 = e.m01, t.m03 = e.m03;
                return t;
            },
            invert: function(t, e) {
                var i = e.m00, n = e.m01, r = e.m02, s = e.m03, a = i * s - r * n;
                return a ? (a = 1 / a, t.m00 = s * a, t.m01 = -n * a, t.m02 = -r * a, t.m03 = i * a, 
                t) : null;
            },
            adjoint: function(t, e) {
                var i = e.m00;
                return t.m00 = e.m03, t.m01 = -e.m01, t.m02 = -e.m02, t.m03 = i, t;
            },
            determinant: function(t) {
                return t.m00 * t.m03 - t.m02 * t.m01;
            },
            multiply: function(t, e, i) {
                var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = i.m00, c = i.m01, h = i.m02, l = i.m03;
                return t.m00 = n * o + s * c, t.m01 = r * o + a * c, t.m02 = n * h + s * l, t.m03 = r * h + a * l, 
                t;
            }
        };
        O.mul = O.multiply, O.rotate = function(t, e, i) {
            var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = Math.sin(i), c = Math.cos(i);
            return t.m00 = n * c + s * o, t.m01 = r * c + a * o, t.m02 = n * -o + s * c, t.m03 = r * -o + a * c, 
            t;
        }, O.scale = function(t, e, i) {
            var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = i.x, c = i.y;
            return t.m00 = n * o, t.m01 = r * o, t.m02 = s * c, t.m03 = a * c, t;
        }, O.fromRotation = function(t, e) {
            var i = Math.sin(e), n = Math.cos(e);
            return t.m00 = n, t.m01 = i, t.m02 = -i, t.m03 = n, t;
        }, O.fromScaling = function(t, e) {
            return t.m00 = e.x, t.m01 = 0, t.m02 = 0, t.m03 = e.y, t;
        }, O.str = function(t) {
            return "mat2(" + t.m00 + ", " + t.m01 + ", " + t.m02 + ", " + t.m03 + ")";
        }, O.array = function(t, e) {
            return t[0] = e.m00, t[1] = e.m01, t[2] = e.m02, t[3] = e.m03, t;
        }, O.frob = function(t) {
            return Math.sqrt(Math.pow(t.m00, 2) + Math.pow(t.m01, 2) + Math.pow(t.m02, 2) + Math.pow(t.m03, 2));
        }, O.LDU = function(t, e, i, n) {
            t.m02 = n.m02 / n.m00, i.m00 = n.m00, i.m01 = n.m01, i.m03 = n.m03 - t.m02 * i.m01;
        }, O.add = function(t, e, i) {
            return t.m00 = e.m00 + i.m00, t.m01 = e.m01 + i.m01, t.m02 = e.m02 + i.m02, t.m03 = e.m03 + i.m03, 
            t;
        }, O.subtract = function(t, e, i) {
            return t.m00 = e.m00 - i.m00, t.m01 = e.m01 - i.m01, t.m02 = e.m02 - i.m02, t.m03 = e.m03 - i.m03, 
            t;
        }, O.sub = O.subtract, O.exactEquals = function(t, e) {
            return t.m00 === e.m00 && t.m01 === e.m01 && t.m02 === e.m02 && t.m03 === e.m03;
        }, O.equals = function(t, e) {
            var i = t.m00, n = t.m01, r = t.m02, a = t.m03, o = e.m00, c = e.m01, h = e.m02, l = e.m03;
            return Math.abs(i - o) <= s * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(n - c) <= s * Math.max(1, Math.abs(n), Math.abs(c)) && Math.abs(r - h) <= s * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(a - l) <= s * Math.max(1, Math.abs(a), Math.abs(l));
        }, O.multiplyScalar = function(t, e, i) {
            return t.m00 = e.m00 * i, t.m01 = e.m01 * i, t.m02 = e.m02 * i, t.m03 = e.m03 * i, 
            t;
        }, O.multiplyScalarAndAdd = function(t, e, i, n) {
            return t.m00 = e.m00 + i.m00 * n, t.m01 = e.m01 + i.m01 * n, t.m02 = e.m02 + i.m02 * n, 
            t.m03 = e.m03 + i.m03 * n, t;
        };
        var L = new Array(6), I = function(t, e, i, n, r, s) {
            this.m00 = t, this.m01 = e, this.m02 = i, this.m03 = n, this.m04 = r, this.m05 = s;
        };
        I.prototype.toJSON = function() {
            return L[0] = this.m00, L[1] = this.m01, L[2] = this.m02, L[3] = this.m03, L[4] = this.m04, 
            L[5] = this.m05, L;
        };
        var F = {
            create: function() {
                return new I(1, 0, 0, 1, 0, 0);
            },
            new: function(t, e, i, n, r, s) {
                return new I(t, e, i, n, r, s);
            },
            clone: function(t) {
                return new I(t.m00, t.m01, t.m02, t.m03, t.m04, t.m05);
            },
            copy: function(t, e) {
                return t.m00 = e.m00, t.m01 = e.m01, t.m02 = e.m02, t.m03 = e.m03, t.m04 = e.m04, 
                t.m05 = e.m05, t;
            },
            identity: function(t) {
                return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 1, t.m04 = 0, t.m05 = 0, t;
            },
            set: function(t, e, i, n, r, s, a) {
                return t.m00 = e, t.m01 = i, t.m02 = n, t.m03 = r, t.m04 = s, t.m05 = a, t;
            },
            invert: function(t, e) {
                var i = e.m00, n = e.m01, r = e.m02, s = e.m03, a = e.m04, o = e.m05, c = i * s - n * r;
                return c ? (c = 1 / c, t.m00 = s * c, t.m01 = -n * c, t.m02 = -r * c, t.m03 = i * c, 
                t.m04 = (r * o - s * a) * c, t.m05 = (n * a - i * o) * c, t) : null;
            },
            determinant: function(t) {
                return t.m00 * t.m03 - t.m01 * t.m02;
            },
            multiply: function(t, e, i) {
                var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = i.m00, l = i.m01, u = i.m02, _ = i.m03, d = i.m04, f = i.m05;
                return t.m00 = n * h + s * l, t.m01 = r * h + a * l, t.m02 = n * u + s * _, t.m03 = r * u + a * _, 
                t.m04 = n * d + s * f + o, t.m05 = r * d + a * f + c, t;
            }
        };
        F.mul = F.multiply, F.rotate = function(t, e, i) {
            var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = Math.sin(i), l = Math.cos(i);
            return t.m00 = n * l + s * h, t.m01 = r * l + a * h, t.m02 = n * -h + s * l, t.m03 = r * -h + a * l, 
            t.m04 = o, t.m05 = c, t;
        }, F.scale = function(t, e, i) {
            var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = i.x, l = i.y;
            return t.m00 = n * h, t.m01 = r * h, t.m02 = s * l, t.m03 = a * l, t.m04 = o, t.m05 = c, 
            t;
        }, F.translate = function(t, e, i) {
            var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = i.x, l = i.y;
            return t.m00 = n, t.m01 = r, t.m02 = s, t.m03 = a, t.m04 = n * h + s * l + o, t.m05 = r * h + a * l + c, 
            t;
        }, F.fromRotation = function(t, e) {
            var i = Math.sin(e), n = Math.cos(e);
            return t.m00 = n, t.m01 = i, t.m02 = -i, t.m03 = n, t.m04 = 0, t.m05 = 0, t;
        }, F.fromScaling = function(t, e) {
            return t.m00 = e.m00, t.m01 = 0, t.m02 = 0, t.m03 = e.m01, t.m04 = 0, t.m05 = 0, 
            t;
        }, F.fromTranslation = function(t, e) {
            return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 1, t.m04 = e.x, t.m05 = e.y, t;
        }, F.str = function(t) {
            return "mat23(" + t.m00 + ", " + t.m01 + ", " + t.m02 + ", " + t.m03 + ", " + t.m04 + ", " + t.m05 + ")";
        }, F.array = function(t, e) {
            return t[0] = e.m00, t[1] = e.m01, t[2] = e.m02, t[3] = e.m03, t[4] = e.m04, t[5] = e.m05, 
            t;
        }, F.array4x4 = function(t, e) {
            return t[0] = e.m00, t[1] = e.m01, t[2] = 0, t[3] = 0, t[4] = e.m02, t[5] = e.m03, 
            t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = e.m04, t[13] = e.m05, 
            t[14] = 0, t[15] = 1, t;
        }, F.frob = function(t) {
            return Math.sqrt(Math.pow(t.m00, 2) + Math.pow(t.m01, 2) + Math.pow(t.m02, 2) + Math.pow(t.m03, 2) + Math.pow(t.m04, 2) + Math.pow(t.m05, 2) + 1);
        }, F.add = function(t, e, i) {
            return t.m00 = e.m00 + i.m00, t.m01 = e.m01 + i.m01, t.m02 = e.m02 + i.m02, t.m03 = e.m03 + i.m03, 
            t.m04 = e.m04 + i.m04, t.m05 = e.m05 + i.m05, t;
        }, F.subtract = function(t, e, i) {
            return t.m00 = e.m00 - i.m00, t.m01 = e.m01 - i.m01, t.m02 = e.m02 - i.m02, t.m03 = e.m03 - i.m03, 
            t.m04 = e.m04 - i.m04, t.m05 = e.m05 - i.m05, t;
        }, F.sub = F.subtract, F.multiplyScalar = function(t, e, i) {
            return t.m00 = e.m00 * i, t.m01 = e.m01 * i, t.m02 = e.m02 * i, t.m03 = e.m03 * i, 
            t.m04 = e.m04 * i, t.m05 = e.m05 * i, t;
        }, F.multiplyScalarAndAdd = function(t, e, i, n) {
            return t.m00 = e.m00 + i.m00 * n, t.m01 = e.m01 + i.m01 * n, t.m02 = e.m02 + i.m02 * n, 
            t.m03 = e.m03 + i.m03 * n, t.m04 = e.m04 + i.m04 * n, t.m05 = e.m05 + i.m05 * n, 
            t;
        }, F.exactEquals = function(t, e) {
            return t.m00 === e.m00 && t.m01 === e.m01 && t.m02 === e.m02 && t.m03 === e.m03 && t.m04 === e.m04 && t.m05 === e.m05;
        }, F.equals = function(t, e) {
            var i = t.m00, n = t.m01, r = t.m02, a = t.m03, o = t.m04, c = t.m05, h = e.m00, l = e.m01, u = e.m02, _ = e.m03, d = e.m04, f = e.m05;
            return Math.abs(i - h) <= s * Math.max(1, Math.abs(i), Math.abs(h)) && Math.abs(n - l) <= s * Math.max(1, Math.abs(n), Math.abs(l)) && Math.abs(r - u) <= s * Math.max(1, Math.abs(r), Math.abs(u)) && Math.abs(a - _) <= s * Math.max(1, Math.abs(a), Math.abs(_)) && Math.abs(o - d) <= s * Math.max(1, Math.abs(o), Math.abs(d)) && Math.abs(c - f) <= s * Math.max(1, Math.abs(c), Math.abs(f));
        };
        var P = new Array(16), N = function(t, e, i, n, r, s, a, o, c, h, l, u, _, d, f, p) {
            this.m00 = t, this.m01 = e, this.m02 = i, this.m03 = n, this.m04 = r, this.m05 = s, 
            this.m06 = a, this.m07 = o, this.m08 = c, this.m09 = h, this.m10 = l, this.m11 = u, 
            this.m12 = _, this.m13 = d, this.m14 = f, this.m15 = p;
        };
        N.prototype.toJSON = function() {
            return P[0] = this.m00, P[1] = this.m01, P[2] = this.m02, P[3] = this.m03, P[4] = this.m04, 
            P[5] = this.m05, P[6] = this.m06, P[7] = this.m07, P[8] = this.m08, P[9] = this.m09, 
            P[10] = this.m10, P[11] = this.m11, P[12] = this.m12, P[13] = this.m13, P[14] = this.m14, 
            P[15] = this.m15, P;
        };
        var B = {
            create: function() {
                return new N(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            },
            new: function(t, e, i, n, r, s, a, o, c, h, l, u, _, d, f, p) {
                return new N(t, e, i, n, r, s, a, o, c, h, l, u, _, d, f, p);
            },
            clone: function(t) {
                return new N(t.m00, t.m01, t.m02, t.m03, t.m04, t.m05, t.m06, t.m07, t.m08, t.m09, t.m10, t.m11, t.m12, t.m13, t.m14, t.m15);
            },
            copy: function(t, e) {
                return t.m00 = e.m00, t.m01 = e.m01, t.m02 = e.m02, t.m03 = e.m03, t.m04 = e.m04, 
                t.m05 = e.m05, t.m06 = e.m06, t.m07 = e.m07, t.m08 = e.m08, t.m09 = e.m09, t.m10 = e.m10, 
                t.m11 = e.m11, t.m12 = e.m12, t.m13 = e.m13, t.m14 = e.m14, t.m15 = e.m15, t;
            },
            set: function(t, e, i, n, r, s, a, o, c, h, l, u, _, d, f, p, m) {
                return t.m00 = e, t.m01 = i, t.m02 = n, t.m03 = r, t.m04 = s, t.m05 = a, t.m06 = o, 
                t.m07 = c, t.m08 = h, t.m09 = l, t.m10 = u, t.m11 = _, t.m12 = d, t.m13 = f, t.m14 = p, 
                t.m15 = m, t;
            },
            identity: function(t) {
                return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = 1, t.m06 = 0, 
                t.m07 = 0, t.m08 = 0, t.m09 = 0, t.m10 = 1, t.m11 = 0, t.m12 = 0, t.m13 = 0, t.m14 = 0, 
                t.m15 = 1, t;
            },
            transpose: function(t, e) {
                if (t === e) {
                    var i = e.m01, n = e.m02, r = e.m03, s = e.m06, a = e.m07, o = e.m11;
                    t.m01 = e.m04, t.m02 = e.m08, t.m03 = e.m12, t.m04 = i, t.m06 = e.m09, t.m07 = e.m13, 
                    t.m08 = n, t.m09 = s, t.m11 = e.m14, t.m12 = r, t.m13 = a, t.m14 = o;
                } else t.m00 = e.m00, t.m01 = e.m04, t.m02 = e.m08, t.m03 = e.m12, t.m04 = e.m01, 
                t.m05 = e.m05, t.m06 = e.m09, t.m07 = e.m13, t.m08 = e.m02, t.m09 = e.m06, t.m10 = e.m10, 
                t.m11 = e.m14, t.m12 = e.m03, t.m13 = e.m07, t.m14 = e.m11, t.m15 = e.m15;
                return t;
            },
            invert: function(t, e) {
                var i = e.m00, n = e.m01, r = e.m02, s = e.m03, a = e.m04, o = e.m05, c = e.m06, h = e.m07, l = e.m08, u = e.m09, _ = e.m10, d = e.m11, f = e.m12, p = e.m13, m = e.m14, v = e.m15, g = i * o - n * a, y = i * c - r * a, x = i * h - s * a, E = n * c - r * o, T = n * h - s * o, C = r * h - s * c, A = l * p - u * f, b = l * m - _ * f, w = l * v - d * f, D = u * m - _ * p, S = u * v - d * p, R = _ * v - d * m, M = g * R - y * S + x * D + E * w - T * b + C * A;
                return M ? (M = 1 / M, t.m00 = (o * R - c * S + h * D) * M, t.m01 = (r * S - n * R - s * D) * M, 
                t.m02 = (p * C - m * T + v * E) * M, t.m03 = (_ * T - u * C - d * E) * M, t.m04 = (c * w - a * R - h * b) * M, 
                t.m05 = (i * R - r * w + s * b) * M, t.m06 = (m * x - f * C - v * y) * M, t.m07 = (l * C - _ * x + d * y) * M, 
                t.m08 = (a * S - o * w + h * A) * M, t.m09 = (n * w - i * S - s * A) * M, t.m10 = (f * T - p * x + v * g) * M, 
                t.m11 = (u * x - l * T - d * g) * M, t.m12 = (o * b - a * D - c * A) * M, t.m13 = (i * D - n * b + r * A) * M, 
                t.m14 = (p * y - f * E - m * g) * M, t.m15 = (l * E - u * y + _ * g) * M, t) : null;
            },
            adjoint: function(t, e) {
                var i = e.m00, n = e.m01, r = e.m02, s = e.m03, a = e.m04, o = e.m05, c = e.m06, h = e.m07, l = e.m08, u = e.m09, _ = e.m10, d = e.m11, f = e.m12, p = e.m13, m = e.m14, v = e.m15;
                return t.m00 = o * (_ * v - d * m) - u * (c * v - h * m) + p * (c * d - h * _), 
                t.m01 = -(n * (_ * v - d * m) - u * (r * v - s * m) + p * (r * d - s * _)), t.m02 = n * (c * v - h * m) - o * (r * v - s * m) + p * (r * h - s * c), 
                t.m03 = -(n * (c * d - h * _) - o * (r * d - s * _) + u * (r * h - s * c)), t.m04 = -(a * (_ * v - d * m) - l * (c * v - h * m) + f * (c * d - h * _)), 
                t.m05 = i * (_ * v - d * m) - l * (r * v - s * m) + f * (r * d - s * _), t.m06 = -(i * (c * v - h * m) - a * (r * v - s * m) + f * (r * h - s * c)), 
                t.m07 = i * (c * d - h * _) - a * (r * d - s * _) + l * (r * h - s * c), t.m08 = a * (u * v - d * p) - l * (o * v - h * p) + f * (o * d - h * u), 
                t.m09 = -(i * (u * v - d * p) - l * (n * v - s * p) + f * (n * d - s * u)), t.m10 = i * (o * v - h * p) - a * (n * v - s * p) + f * (n * h - s * o), 
                t.m11 = -(i * (o * d - h * u) - a * (n * d - s * u) + l * (n * h - s * o)), t.m12 = -(a * (u * m - _ * p) - l * (o * m - c * p) + f * (o * _ - c * u)), 
                t.m13 = i * (u * m - _ * p) - l * (n * m - r * p) + f * (n * _ - r * u), t.m14 = -(i * (o * m - c * p) - a * (n * m - r * p) + f * (n * c - r * o)), 
                t.m15 = i * (o * _ - c * u) - a * (n * _ - r * u) + l * (n * c - r * o), t;
            },
            determinant: function(t) {
                var e = t.m00, i = t.m01, n = t.m02, r = t.m03, s = t.m04, a = t.m05, o = t.m06, c = t.m07, h = t.m08, l = t.m09, u = t.m10, _ = t.m11, d = t.m12, f = t.m13, p = t.m14, m = t.m15;
                return (e * a - i * s) * (u * m - _ * p) - (e * o - n * s) * (l * m - _ * f) + (e * c - r * s) * (l * p - u * f) + (i * o - n * a) * (h * m - _ * d) - (i * c - r * a) * (h * p - u * d) + (n * c - r * o) * (h * f - l * d);
            },
            multiply: function(t, e, i) {
                var n = e.m00, r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = e.m06, l = e.m07, u = e.m08, _ = e.m09, d = e.m10, f = e.m11, p = e.m12, m = e.m13, v = e.m14, g = e.m15, y = i.m00, x = i.m01, E = i.m02, T = i.m03;
                return t.m00 = y * n + x * o + E * u + T * p, t.m01 = y * r + x * c + E * _ + T * m, 
                t.m02 = y * s + x * h + E * d + T * v, t.m03 = y * a + x * l + E * f + T * g, y = i.m04, 
                x = i.m05, E = i.m06, T = i.m07, t.m04 = y * n + x * o + E * u + T * p, t.m05 = y * r + x * c + E * _ + T * m, 
                t.m06 = y * s + x * h + E * d + T * v, t.m07 = y * a + x * l + E * f + T * g, y = i.m08, 
                x = i.m09, E = i.m10, T = i.m11, t.m08 = y * n + x * o + E * u + T * p, t.m09 = y * r + x * c + E * _ + T * m, 
                t.m10 = y * s + x * h + E * d + T * v, t.m11 = y * a + x * l + E * f + T * g, y = i.m12, 
                x = i.m13, E = i.m14, T = i.m15, t.m12 = y * n + x * o + E * u + T * p, t.m13 = y * r + x * c + E * _ + T * m, 
                t.m14 = y * s + x * h + E * d + T * v, t.m15 = y * a + x * l + E * f + T * g, t;
            }
        };
        B.mul = B.multiply, B.translate = function(t, e, i) {
            var n, r, s, a, o, c, h, l, u, _, d, f, p = i.x, m = i.y, v = i.z;
            return e === t ? (t.m12 = e.m00 * p + e.m04 * m + e.m08 * v + e.m12, t.m13 = e.m01 * p + e.m05 * m + e.m09 * v + e.m13, 
            t.m14 = e.m02 * p + e.m06 * m + e.m10 * v + e.m14, t.m15 = e.m03 * p + e.m07 * m + e.m11 * v + e.m15) : (n = e.m00, 
            r = e.m01, s = e.m02, a = e.m03, o = e.m04, c = e.m05, h = e.m06, l = e.m07, u = e.m08, 
            _ = e.m09, d = e.m10, f = e.m11, t.m00 = n, t.m01 = r, t.m02 = s, t.m03 = a, t.m04 = o, 
            t.m05 = c, t.m06 = h, t.m07 = l, t.m08 = u, t.m09 = _, t.m10 = d, t.m11 = f, t.m12 = n * p + o * m + u * v + e.m12, 
            t.m13 = r * p + c * m + _ * v + e.m13, t.m14 = s * p + h * m + d * v + e.m14, t.m15 = a * p + l * m + f * v + e.m15), 
            t;
        }, B.scale = function(t, e, i) {
            var n = i.x, r = i.y, s = i.z;
            return t.m00 = e.m00 * n, t.m01 = e.m01 * n, t.m02 = e.m02 * n, t.m03 = e.m03 * n, 
            t.m04 = e.m04 * r, t.m05 = e.m05 * r, t.m06 = e.m06 * r, t.m07 = e.m07 * r, t.m08 = e.m08 * s, 
            t.m09 = e.m09 * s, t.m10 = e.m10 * s, t.m11 = e.m11 * s, t.m12 = e.m12, t.m13 = e.m13, 
            t.m14 = e.m14, t.m15 = e.m15, t;
        }, B.rotate = function(t, e, i, n) {
            var r, a, o, c, h, l, u, _, d, f, p, m, v, g, y, x, E, T, C, A, b, w, D, S, R = n.x, M = n.y, O = n.z, L = Math.sqrt(R * R + M * M + O * O);
            return Math.abs(L) < s ? null : (R *= L = 1 / L, M *= L, O *= L, r = Math.sin(i), 
            o = 1 - (a = Math.cos(i)), c = e.m00, h = e.m01, l = e.m02, u = e.m03, _ = e.m04, 
            d = e.m05, f = e.m06, p = e.m07, m = e.m08, v = e.m09, g = e.m10, y = e.m11, x = R * R * o + a, 
            E = M * R * o + O * r, T = O * R * o - M * r, C = R * M * o - O * r, A = M * M * o + a, 
            b = O * M * o + R * r, w = R * O * o + M * r, D = M * O * o - R * r, S = O * O * o + a, 
            t.m00 = c * x + _ * E + m * T, t.m01 = h * x + d * E + v * T, t.m02 = l * x + f * E + g * T, 
            t.m03 = u * x + p * E + y * T, t.m04 = c * C + _ * A + m * b, t.m05 = h * C + d * A + v * b, 
            t.m06 = l * C + f * A + g * b, t.m07 = u * C + p * A + y * b, t.m08 = c * w + _ * D + m * S, 
            t.m09 = h * w + d * D + v * S, t.m10 = l * w + f * D + g * S, t.m11 = u * w + p * D + y * S, 
            e !== t && (t.m12 = e.m12, t.m13 = e.m13, t.m14 = e.m14, t.m15 = e.m15), t);
        }, B.rotateX = function(t, e, i) {
            var n = Math.sin(i), r = Math.cos(i), s = e.m04, a = e.m05, o = e.m06, c = e.m07, h = e.m08, l = e.m09, u = e.m10, _ = e.m11;
            return e !== t && (t.m00 = e.m00, t.m01 = e.m01, t.m02 = e.m02, t.m03 = e.m03, t.m12 = e.m12, 
            t.m13 = e.m13, t.m14 = e.m14, t.m15 = e.m15), t.m04 = s * r + h * n, t.m05 = a * r + l * n, 
            t.m06 = o * r + u * n, t.m07 = c * r + _ * n, t.m08 = h * r - s * n, t.m09 = l * r - a * n, 
            t.m10 = u * r - o * n, t.m11 = _ * r - c * n, t;
        }, B.rotateY = function(t, e, i) {
            var n = Math.sin(i), r = Math.cos(i), s = e.m00, a = e.m01, o = e.m02, c = e.m03, h = e.m08, l = e.m09, u = e.m10, _ = e.m11;
            return e !== t && (t.m04 = e.m04, t.m05 = e.m05, t.m06 = e.m06, t.m07 = e.m07, t.m12 = e.m12, 
            t.m13 = e.m13, t.m14 = e.m14, t.m15 = e.m15), t.m00 = s * r - h * n, t.m01 = a * r - l * n, 
            t.m02 = o * r - u * n, t.m03 = c * r - _ * n, t.m08 = s * n + h * r, t.m09 = a * n + l * r, 
            t.m10 = o * n + u * r, t.m11 = c * n + _ * r, t;
        }, B.rotateZ = function(t, e, i) {
            var n = Math.sin(i), r = Math.cos(i), s = e.m00, a = e.m01, o = e.m02, c = e.m03, h = e.m04, l = e.m05, u = e.m06, _ = e.m07;
            return e !== t && (t.m08 = e.m08, t.m09 = e.m09, t.m10 = e.m10, t.m11 = e.m11, t.m12 = e.m12, 
            t.m13 = e.m13, t.m14 = e.m14, t.m15 = e.m15), t.m00 = s * r + h * n, t.m01 = a * r + l * n, 
            t.m02 = o * r + u * n, t.m03 = c * r + _ * n, t.m04 = h * r - s * n, t.m05 = l * r - a * n, 
            t.m06 = u * r - o * n, t.m07 = _ * r - c * n, t;
        }, B.fromTranslation = function(t, e) {
            return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = 1, t.m06 = 0, 
            t.m07 = 0, t.m08 = 0, t.m09 = 0, t.m10 = 1, t.m11 = 0, t.m12 = e.x, t.m13 = e.y, 
            t.m14 = e.z, t.m15 = 1, t;
        }, B.fromScaling = function(t, e) {
            return t.m00 = e.x, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = e.y, t.m06 = 0, 
            t.m07 = 0, t.m08 = 0, t.m09 = 0, t.m10 = e.z, t.m11 = 0, t.m12 = 0, t.m13 = 0, t.m14 = 0, 
            t.m15 = 1, t;
        }, B.fromRotation = function(t, e, i) {
            var n, r, a, o = i.x, c = i.y, h = i.z, l = Math.sqrt(o * o + c * c + h * h);
            return Math.abs(l) < s ? null : (o *= l = 1 / l, c *= l, h *= l, n = Math.sin(e), 
            a = 1 - (r = Math.cos(e)), t.m00 = o * o * a + r, t.m01 = c * o * a + h * n, t.m02 = h * o * a - c * n, 
            t.m03 = 0, t.m04 = o * c * a - h * n, t.m05 = c * c * a + r, t.m06 = h * c * a + o * n, 
            t.m07 = 0, t.m08 = o * h * a + c * n, t.m09 = c * h * a - o * n, t.m10 = h * h * a + r, 
            t.m11 = 0, t.m12 = 0, t.m13 = 0, t.m14 = 0, t.m15 = 1, t);
        }, B.fromXRotation = function(t, e) {
            var i = Math.sin(e), n = Math.cos(e);
            return t.m00 = 1, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = n, t.m06 = i, 
            t.m07 = 0, t.m08 = 0, t.m09 = -i, t.m10 = n, t.m11 = 0, t.m12 = 0, t.m13 = 0, t.m14 = 0, 
            t.m15 = 1, t;
        }, B.fromYRotation = function(t, e) {
            var i = Math.sin(e), n = Math.cos(e);
            return t.m00 = n, t.m01 = 0, t.m02 = -i, t.m03 = 0, t.m04 = 0, t.m05 = 1, t.m06 = 0, 
            t.m07 = 0, t.m08 = i, t.m09 = 0, t.m10 = n, t.m11 = 0, t.m12 = 0, t.m13 = 0, t.m14 = 0, 
            t.m15 = 1, t;
        }, B.fromZRotation = function(t, e) {
            var i = Math.sin(e), n = Math.cos(e);
            return t.m00 = n, t.m01 = i, t.m02 = 0, t.m03 = 0, t.m04 = -i, t.m05 = n, t.m06 = 0, 
            t.m07 = 0, t.m08 = 0, t.m09 = 0, t.m10 = 1, t.m11 = 0, t.m12 = 0, t.m13 = 0, t.m14 = 0, 
            t.m15 = 1, t;
        }, B.fromRT = function(t, e, i) {
            var n = e.x, r = e.y, s = e.z, a = e.w, o = n + n, c = r + r, h = s + s, l = n * o, u = n * c, _ = n * h, d = r * c, f = r * h, p = s * h, m = a * o, v = a * c, g = a * h;
            return t.m00 = 1 - (d + p), t.m01 = u + g, t.m02 = _ - v, t.m03 = 0, t.m04 = u - g, 
            t.m05 = 1 - (l + p), t.m06 = f + m, t.m07 = 0, t.m08 = _ + v, t.m09 = f - m, t.m10 = 1 - (l + d), 
            t.m11 = 0, t.m12 = i.x, t.m13 = i.y, t.m14 = i.z, t.m15 = 1, t;
        }, B.getTranslation = function(t, e) {
            return t.x = e.m12, t.y = e.m13, t.z = e.m14, t;
        }, B.getScaling = function(t, e) {
            var i = e.m00, n = e.m01, r = e.m02, s = e.m04, a = e.m05, o = e.m06, c = e.m08, h = e.m09, l = e.m10;
            return t.x = Math.sqrt(i * i + n * n + r * r), t.y = Math.sqrt(s * s + a * a + o * o), 
            t.z = Math.sqrt(c * c + h * h + l * l), t;
        }, B.getRotation = function(t, e) {
            var i = e.m00 + e.m05 + e.m10, n = 0;
            return i > 0 ? (n = 2 * Math.sqrt(i + 1), t.w = .25 * n, t.x = (e.m06 - e.m09) / n, 
            t.y = (e.m08 - e.m02) / n, t.z = (e.m01 - e.m04) / n) : e.m00 > e.m05 & e.m00 > e.m10 ? (n = 2 * Math.sqrt(1 + e.m00 - e.m05 - e.m10), 
            t.w = (e.m06 - e.m09) / n, t.x = .25 * n, t.y = (e.m01 + e.m04) / n, t.z = (e.m08 + e.m02) / n) : e.m05 > e.m10 ? (n = 2 * Math.sqrt(1 + e.m05 - e.m00 - e.m10), 
            t.w = (e.m08 - e.m02) / n, t.x = (e.m01 + e.m04) / n, t.y = .25 * n, t.z = (e.m06 + e.m09) / n) : (n = 2 * Math.sqrt(1 + e.m10 - e.m00 - e.m05), 
            t.w = (e.m01 - e.m04) / n, t.x = (e.m08 + e.m02) / n, t.y = (e.m06 + e.m09) / n, 
            t.z = .25 * n), t;
        }, B.fromRTS = function(t, e, i, n) {
            var r = e.x, s = e.y, a = e.z, o = e.w, c = r + r, h = s + s, l = a + a, u = r * c, _ = r * h, d = r * l, f = s * h, p = s * l, m = a * l, v = o * c, g = o * h, y = o * l, x = n.x, E = n.y, T = n.z;
            return t.m00 = (1 - (f + m)) * x, t.m01 = (_ + y) * x, t.m02 = (d - g) * x, t.m03 = 0, 
            t.m04 = (_ - y) * E, t.m05 = (1 - (u + m)) * E, t.m06 = (p + v) * E, t.m07 = 0, 
            t.m08 = (d + g) * T, t.m09 = (p - v) * T, t.m10 = (1 - (u + f)) * T, t.m11 = 0, 
            t.m12 = i.x, t.m13 = i.y, t.m14 = i.z, t.m15 = 1, t;
        }, B.fromRTSOrigin = function(t, e, i, n, r) {
            var s = e.x, a = e.y, o = e.z, c = e.w, h = s + s, l = a + a, u = o + o, _ = s * h, d = s * l, f = s * u, p = a * l, m = a * u, v = o * u, g = c * h, y = c * l, x = c * u, E = n.x, T = n.y, C = n.z, A = r.x, b = r.y, w = r.z;
            return t.m00 = (1 - (p + v)) * E, t.m01 = (d + x) * E, t.m02 = (f - y) * E, t.m03 = 0, 
            t.m04 = (d - x) * T, t.m05 = (1 - (_ + v)) * T, t.m06 = (m + g) * T, t.m07 = 0, 
            t.m08 = (f + y) * C, t.m09 = (m - g) * C, t.m10 = (1 - (_ + p)) * C, t.m11 = 0, 
            t.m12 = i.x + A - (t.m00 * A + t.m04 * b + t.m08 * w), t.m13 = i.y + b - (t.m01 * A + t.m05 * b + t.m09 * w), 
            t.m14 = i.z + w - (t.m02 * A + t.m06 * b + t.m10 * w), t.m15 = 1, t;
        }, B.fromQuat = function(t, e) {
            var i = e.x, n = e.y, r = e.z, s = e.w, a = i + i, o = n + n, c = r + r, h = i * a, l = n * a, u = n * o, _ = r * a, d = r * o, f = r * c, p = s * a, m = s * o, v = s * c;
            return t.m00 = 1 - u - f, t.m01 = l + v, t.m02 = _ - m, t.m03 = 0, t.m04 = l - v, 
            t.m05 = 1 - h - f, t.m06 = d + p, t.m07 = 0, t.m08 = _ + m, t.m09 = d - p, t.m10 = 1 - h - u, 
            t.m11 = 0, t.m12 = 0, t.m13 = 0, t.m14 = 0, t.m15 = 1, t;
        }, B.frustum = function(t, e, i, n, r, s, a) {
            var o = 1 / (i - e), c = 1 / (r - n), h = 1 / (s - a);
            return t.m00 = 2 * s * o, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = 2 * s * c, 
            t.m06 = 0, t.m07 = 0, t.m08 = (i + e) * o, t.m09 = (r + n) * c, t.m10 = (a + s) * h, 
            t.m11 = -1, t.m12 = 0, t.m13 = 0, t.m14 = a * s * 2 * h, t.m15 = 0, t;
        }, B.perspective = function(t, e, i, n, r) {
            var s = 1 / Math.tan(e / 2), a = 1 / (n - r);
            return t.m00 = s / i, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = s, t.m06 = 0, 
            t.m07 = 0, t.m08 = 0, t.m09 = 0, t.m10 = (r + n) * a, t.m11 = -1, t.m12 = 0, t.m13 = 0, 
            t.m14 = 2 * r * n * a, t.m15 = 0, t;
        }, B.perspectiveFromFieldOfView = function(t, e, i, n) {
            var r = Math.tan(e.upDegrees * Math.PI / 180), s = Math.tan(e.downDegrees * Math.PI / 180), a = Math.tan(e.leftDegrees * Math.PI / 180), o = Math.tan(e.rightDegrees * Math.PI / 180), c = 2 / (a + o), h = 2 / (r + s);
            return t.m00 = c, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = h, t.m06 = 0, 
            t.m07 = 0, t.m08 = -(a - o) * c * .5, t.m09 = (r - s) * h * .5, t.m10 = n / (i - n), 
            t.m11 = -1, t.m12 = 0, t.m13 = 0, t.m14 = n * i / (i - n), t.m15 = 0, t;
        }, B.ortho = function(t, e, i, n, r, s, a) {
            var o = 1 / (e - i), c = 1 / (n - r), h = 1 / (s - a);
            return t.m00 = -2 * o, t.m01 = 0, t.m02 = 0, t.m03 = 0, t.m04 = 0, t.m05 = -2 * c, 
            t.m06 = 0, t.m07 = 0, t.m08 = 0, t.m09 = 0, t.m10 = 2 * h, t.m11 = 0, t.m12 = (e + i) * o, 
            t.m13 = (r + n) * c, t.m14 = (a + s) * h, t.m15 = 1, t;
        }, B.lookAt = function(t, e, i, n) {
            var r, a, o, c, h, l, u, _, d, f, p = e.x, m = e.y, v = e.z, g = n.x, y = n.y, x = n.z, E = i.x, T = i.y, C = i.z;
            return Math.abs(p - E) < s && Math.abs(m - T) < s && Math.abs(v - C) < s ? B.identity(t) : (u = p - E, 
            _ = m - T, d = v - C, r = y * (d *= f = 1 / Math.sqrt(u * u + _ * _ + d * d)) - x * (_ *= f), 
            a = x * (u *= f) - g * d, o = g * _ - y * u, (f = Math.sqrt(r * r + a * a + o * o)) ? (r *= f = 1 / f, 
            a *= f, o *= f) : (r = 0, a = 0, o = 0), c = _ * o - d * a, h = d * r - u * o, l = u * a - _ * r, 
            (f = Math.sqrt(c * c + h * h + l * l)) ? (c *= f = 1 / f, h *= f, l *= f) : (c = 0, 
            h = 0, l = 0), t.m00 = r, t.m01 = c, t.m02 = u, t.m03 = 0, t.m04 = a, t.m05 = h, 
            t.m06 = _, t.m07 = 0, t.m08 = o, t.m09 = l, t.m10 = d, t.m11 = 0, t.m12 = -(r * p + a * m + o * v), 
            t.m13 = -(c * p + h * m + l * v), t.m14 = -(u * p + _ * m + d * v), t.m15 = 1, t);
        }, B.str = function(t) {
            return "mat4(" + t.m00 + ", " + t.m01 + ", " + t.m02 + ", " + t.m03 + ", " + t.m04 + ", " + t.m05 + ", " + t.m06 + ", " + t.m07 + ", " + t.m08 + ", " + t.m09 + ", " + t.m10 + ", " + t.m11 + ", " + t.m12 + ", " + t.m13 + ", " + t.m14 + ", " + t.m15 + ")";
        }, B.array = function(t, e) {
            return t[0] = e.m00, t[1] = e.m01, t[2] = e.m02, t[3] = e.m03, t[4] = e.m04, t[5] = e.m05, 
            t[6] = e.m06, t[7] = e.m07, t[8] = e.m08, t[9] = e.m09, t[10] = e.m10, t[11] = e.m11, 
            t[12] = e.m12, t[13] = e.m13, t[14] = e.m14, t[15] = e.m15, t;
        }, B.frob = function(t) {
            return Math.sqrt(Math.pow(t.m00, 2) + Math.pow(t.m01, 2) + Math.pow(t.m02, 2) + Math.pow(t.m03, 2) + Math.pow(t.m04, 2) + Math.pow(t.m05, 2) + Math.pow(t.m06, 2) + Math.pow(t.m07, 2) + Math.pow(t.m08, 2) + Math.pow(t.m09, 2) + Math.pow(t.m10, 2) + Math.pow(t.m11, 2) + Math.pow(t.m12, 2) + Math.pow(t.m13, 2) + Math.pow(t.m14, 2) + Math.pow(t.m15, 2));
        }, B.add = function(t, e, i) {
            return t.m00 = e.m00 + i.m00, t.m01 = e.m01 + i.m01, t.m02 = e.m02 + i.m02, t.m03 = e.m03 + i.m03, 
            t.m04 = e.m04 + i.m04, t.m05 = e.m05 + i.m05, t.m06 = e.m06 + i.m06, t.m07 = e.m07 + i.m07, 
            t.m08 = e.m08 + i.m08, t.m09 = e.m09 + i.m09, t.m10 = e.m10 + i.m10, t.m11 = e.m11 + i.m11, 
            t.m12 = e.m12 + i.m12, t.m13 = e.m13 + i.m13, t.m14 = e.m14 + i.m14, t.m15 = e.m15 + i.m15, 
            t;
        }, B.subtract = function(t, e, i) {
            return t.m00 = e.m00 - i.m00, t.m01 = e.m01 - i.m01, t.m02 = e.m02 - i.m02, t.m03 = e.m03 - i.m03, 
            t.m04 = e.m04 - i.m04, t.m05 = e.m05 - i.m05, t.m06 = e.m06 - i.m06, t.m07 = e.m07 - i.m07, 
            t.m08 = e.m08 - i.m08, t.m09 = e.m09 - i.m09, t.m10 = e.m10 - i.m10, t.m11 = e.m11 - i.m11, 
            t.m12 = e.m12 - i.m12, t.m13 = e.m13 - i.m13, t.m14 = e.m14 - i.m14, t.m15 = e.m15 - i.m15, 
            t;
        }, B.sub = B.subtract, B.multiplyScalar = function(t, e, i) {
            return t.m00 = e.m00 * i, t.m01 = e.m01 * i, t.m02 = e.m02 * i, t.m03 = e.m03 * i, 
            t.m04 = e.m04 * i, t.m05 = e.m05 * i, t.m06 = e.m06 * i, t.m07 = e.m07 * i, t.m08 = e.m08 * i, 
            t.m09 = e.m09 * i, t.m10 = e.m10 * i, t.m11 = e.m11 * i, t.m12 = e.m12 * i, t.m13 = e.m13 * i, 
            t.m14 = e.m14 * i, t.m15 = e.m15 * i, t;
        }, B.multiplyScalarAndAdd = function(t, e, i, n) {
            return t.m00 = e.m00 + i.m00 * n, t.m01 = e.m01 + i.m01 * n, t.m02 = e.m02 + i.m02 * n, 
            t.m03 = e.m03 + i.m03 * n, t.m04 = e.m04 + i.m04 * n, t.m05 = e.m05 + i.m05 * n, 
            t.m06 = e.m06 + i.m06 * n, t.m07 = e.m07 + i.m07 * n, t.m08 = e.m08 + i.m08 * n, 
            t.m09 = e.m09 + i.m09 * n, t.m10 = e.m10 + i.m10 * n, t.m11 = e.m11 + i.m11 * n, 
            t.m12 = e.m12 + i.m12 * n, t.m13 = e.m13 + i.m13 * n, t.m14 = e.m14 + i.m14 * n, 
            t.m15 = e.m15 + i.m15 * n, t;
        }, B.exactEquals = function(t, e) {
            return t.m00 === e.m00 && t.m01 === e.m01 && t.m02 === e.m02 && t.m03 === e.m03 && t.m04 === e.m04 && t.m05 === e.m05 && t.m06 === e.m06 && t.m07 === e.m07 && t.m08 === e.m08 && t.m09 === e.m09 && t.m10 === e.m10 && t.m11 === e.m11 && t.m12 === e.m12 && t.m13 === e.m13 && t.m14 === e.m14 && t.m15 === e.m15;
        }, B.equals = function(t, e) {
            var i = t.m00, n = t.m01, r = t.m02, a = t.m03, o = t.m04, c = t.m05, h = t.m06, l = t.m07, u = t.m08, _ = t.m09, d = t.m10, f = t.m11, p = t.m12, m = t.m13, v = t.m14, g = t.m15, y = e.m00, x = e.m01, E = e.m02, T = e.m03, C = e.m04, A = e.m05, b = e.m06, w = e.m07, D = e.m08, S = e.m09, R = e.m10, M = e.m11, O = e.m12, L = e.m13, I = e.m14, F = e.m15;
            return Math.abs(i - y) <= s * Math.max(1, Math.abs(i), Math.abs(y)) && Math.abs(n - x) <= s * Math.max(1, Math.abs(n), Math.abs(x)) && Math.abs(r - E) <= s * Math.max(1, Math.abs(r), Math.abs(E)) && Math.abs(a - T) <= s * Math.max(1, Math.abs(a), Math.abs(T)) && Math.abs(o - C) <= s * Math.max(1, Math.abs(o), Math.abs(C)) && Math.abs(c - A) <= s * Math.max(1, Math.abs(c), Math.abs(A)) && Math.abs(h - b) <= s * Math.max(1, Math.abs(h), Math.abs(b)) && Math.abs(l - w) <= s * Math.max(1, Math.abs(l), Math.abs(w)) && Math.abs(u - D) <= s * Math.max(1, Math.abs(u), Math.abs(D)) && Math.abs(_ - S) <= s * Math.max(1, Math.abs(_), Math.abs(S)) && Math.abs(d - R) <= s * Math.max(1, Math.abs(d), Math.abs(R)) && Math.abs(f - M) <= s * Math.max(1, Math.abs(f), Math.abs(M)) && Math.abs(p - O) <= s * Math.max(1, Math.abs(p), Math.abs(O)) && Math.abs(m - L) <= s * Math.max(1, Math.abs(m), Math.abs(L)) && Math.abs(v - I) <= s * Math.max(1, Math.abs(v), Math.abs(I)) && Math.abs(g - F) <= s * Math.max(1, Math.abs(g), Math.abs(F));
        };
        var z = new Array(3), k = function(t, e, i) {
            this.r = t, this.g = e, this.b = i;
        };
        k.prototype.toJSON = function() {
            return z[0] = this.r, z[1] = this.g, z[2] = this.b, z;
        };
        var U = {
            create: function() {
                return new k(1, 1, 1);
            },
            new: function(t, e, i) {
                return new k(t, e, i);
            },
            clone: function(t) {
                return new k(t.r, t.g, t.b, t.a);
            },
            copy: function(t, e) {
                return t.r = e.r, t.g = e.g, t.b = e.b, t;
            },
            set: function(t, e, i, n) {
                return t.r = e, t.g = i, t.b = n, t;
            },
            fromHex: function(t, e) {
                var i = (e >> 16) / 255, n = (e >> 8 & 255) / 255, r = (255 & e) / 255;
                return t.r = i, t.g = n, t.b = r, t;
            },
            add: function(t, e, i) {
                return t.r = e.r + i.r, t.g = e.g + i.g, t.b = e.b + i.b, t;
            },
            subtract: function(t, e, i) {
                return t.r = e.r - i.r, t.g = e.g - i.g, t.b = e.b - i.b, t;
            }
        };
        U.sub = U.subtract, U.multiply = function(t, e, i) {
            return t.r = e.r * i.r, t.g = e.g * i.g, t.b = e.b * i.b, t;
        }, U.mul = U.multiply, U.divide = function(t, e, i) {
            return t.r = e.r / i.r, t.g = e.g / i.g, t.b = e.b / i.b, t;
        }, U.div = U.divide, U.scale = function(t, e, i) {
            return t.r = e.r * i, t.g = e.g * i, t.b = e.b * i, t;
        }, U.lerp = function(t, e, i, n) {
            var r = e.r, s = e.g, a = e.b;
            return t.r = r + n * (i.r - r), t.g = s + n * (i.g - s), t.b = a + n * (i.b - a), 
            t;
        }, U.str = function(t) {
            return "color3(" + t.r + ", " + t.g + ", " + t.b + ")";
        }, U.array = function(t, e) {
            return t[0] = e.r, t[1] = e.g, t[2] = e.b, t;
        }, U.exactEquals = function(t, e) {
            return t.r === e.r && t.g === e.g && t.b === e.b;
        }, U.equals = function(t, e) {
            var i = t.r, n = t.g, r = t.b, a = e.r, o = e.g, c = e.b;
            return Math.abs(i - a) <= s * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(n - o) <= s * Math.max(1, Math.abs(n), Math.abs(o)) && Math.abs(r - c) <= s * Math.max(1, Math.abs(r), Math.abs(c));
        }, U.hex = function(t) {
            return 255 * t.r << 16 | 255 * t.g << 8 | 255 * t.b;
        };
        var H = new Array(4), G = function(t, e, i, n) {
            this.r = t, this.g = e, this.b = i, this.a = n;
        };
        G.prototype.toJSON = function() {
            return H[0] = this.r, H[1] = this.g, H[2] = this.b, H[3] = this.a, H;
        };
        var V = {
            create: function() {
                return new G(1, 1, 1, 1);
            },
            new: function(t, e, i, n) {
                return new G(t, e, i, n);
            },
            clone: function(t) {
                return new G(t.r, t.g, t.b, t.a);
            },
            copy: function(t, e) {
                return t.r = e.r, t.g = e.g, t.b = e.b, t.a = e.a, t;
            },
            set: function(t, e, i, n, r) {
                return t.r = e, t.g = i, t.b = n, t.a = r, t;
            },
            fromHex: function(t, e) {
                var i = (e >> 24) / 255, n = (e >> 16 & 255) / 255, r = (e >> 8 & 255) / 255, s = (255 & e) / 255;
                return t.r = i, t.g = n, t.b = r, t.a = s, t;
            },
            add: function(t, e, i) {
                return t.r = e.r + i.r, t.g = e.g + i.g, t.b = e.b + i.b, t.a = e.a + i.a, t;
            },
            subtract: function(t, e, i) {
                return t.r = e.r - i.r, t.g = e.g - i.g, t.b = e.b - i.b, t.a = e.a - i.a, t;
            }
        };
        V.sub = V.subtract, V.multiply = function(t, e, i) {
            return t.r = e.r * i.r, t.g = e.g * i.g, t.b = e.b * i.b, t.a = e.a * i.a, t;
        }, V.mul = V.multiply, V.divide = function(t, e, i) {
            return t.r = e.r / i.r, t.g = e.g / i.g, t.b = e.b / i.b, t.a = e.a / i.a, t;
        }, V.div = V.divide, V.scale = function(t, e, i) {
            return t.r = e.r * i, t.g = e.g * i, t.b = e.b * i, t.a = e.a * i, t;
        }, V.lerp = function(t, e, i, n) {
            var r = e.r, s = e.g, a = e.b, o = e.a;
            return t.r = r + n * (i.r - r), t.g = s + n * (i.g - s), t.b = a + n * (i.b - a), 
            t.a = o + n * (i.a - o), t;
        }, V.str = function(t) {
            return "color4(" + t.r + ", " + t.g + ", " + t.b + ", " + t.a + ")";
        }, V.array = function(t, e) {
            return t[0] = e.r, t[1] = e.g, t[2] = e.b, t[3] = e.a, t;
        }, V.exactEquals = function(t, e) {
            return t.r === e.r && t.g === e.g && t.b === e.b && t.a === e.a;
        }, V.equals = function(t, e) {
            var i = t.r, n = t.g, r = t.b, a = t.a, o = e.r, c = e.g, h = e.b, l = e.a;
            return Math.abs(i - o) <= s * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(n - c) <= s * Math.max(1, Math.abs(n), Math.abs(c)) && Math.abs(r - h) <= s * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(a - l) <= s * Math.max(1, Math.abs(a), Math.abs(l));
        }, V.hex = function(t) {
            return (255 * t.r << 24 | 255 * t.g << 16 | 255 * t.b << 8 | 255 * t.a) >>> 0;
        };
        var W = d, j = Object.freeze({
            bits: W,
            vec2: m,
            vec3: y,
            vec4: T,
            quat: S,
            mat2: O,
            mat23: F,
            mat3: b,
            mat4: B,
            color3: U,
            color4: V,
            EPSILON: s,
            equals: function(t, e) {
                return Math.abs(t - e) <= s * Math.max(1, Math.abs(t), Math.abs(e));
            },
            approx: function(t, e, i) {
                return i = i || s, Math.abs(t - e) <= i;
            },
            clamp: function(t, e, i) {
                return t < e ? e : t > i ? i : t;
            },
            clamp01: function(t) {
                return t < 0 ? 0 : t > 1 ? 1 : t;
            },
            lerp: function(t, e, i) {
                return t + (e - t) * i;
            },
            toRadian: a,
            toDegree: function(t) {
                return t * r;
            },
            random: o,
            randomRange: c,
            randomRangeInt: function(t, e) {
                return Math.floor(c(t, e));
            },
            nextPow2: function(t) {
                return --t, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, t |= t >> 16, ++t;
            }
        }), Y = {
            PROJ_PERSPECTIVE: 0,
            PROJ_ORTHO: 1,
            LIGHT_DIRECTIONAL: 0,
            LIGHT_POINT: 1,
            LIGHT_SPOT: 2,
            SHADOW_NONE: 0,
            SHADOW_HARD: 1,
            SHADOW_SOFT: 2,
            PARAM_INT: 0,
            PARAM_INT2: 1,
            PARAM_INT3: 2,
            PARAM_INT4: 3,
            PARAM_FLOAT: 4,
            PARAM_FLOAT2: 5,
            PARAM_FLOAT3: 6,
            PARAM_FLOAT4: 7,
            PARAM_COLOR3: 8,
            PARAM_COLOR4: 9,
            PARAM_MAT2: 10,
            PARAM_MAT3: 11,
            PARAM_MAT4: 12,
            PARAM_TEXTURE_2D: 13,
            PARAM_TEXTURE_CUBE: 14,
            CLEAR_COLOR: 1,
            CLEAR_DEPTH: 2,
            CLEAR_STENCIL: 4
        }, X = [ [ 9728, 9984, 9986 ], [ 9729, 9985, 9987 ] ], q = [ {
            format: 6407,
            internalFormat: 33776,
            pixelType: null
        }, {
            format: 6408,
            internalFormat: 33777,
            pixelType: null
        }, {
            format: 6408,
            internalFormat: 33778,
            pixelType: null
        }, {
            format: 6408,
            internalFormat: 33779,
            pixelType: null
        }, {
            format: 6407,
            internalFormat: 36196,
            pixelType: null
        }, {
            format: 6407,
            internalFormat: 35841,
            pixelType: null
        }, {
            format: 6408,
            internalFormat: 35843,
            pixelType: null
        }, {
            format: 6407,
            internalFormat: 35840,
            pixelType: null
        }, {
            format: 6408,
            internalFormat: 35842,
            pixelType: null
        }, {
            format: 6406,
            internalFormat: 6406,
            pixelType: 5121
        }, {
            format: 6409,
            internalFormat: 6409,
            pixelType: 5121
        }, {
            format: 6410,
            internalFormat: 6410,
            pixelType: 5121
        }, {
            format: 6407,
            internalFormat: 6407,
            pixelType: 33635
        }, {
            format: 6408,
            internalFormat: 6408,
            pixelType: 32820
        }, {
            format: 6408,
            internalFormat: 6408,
            pixelType: 32819
        }, {
            format: 6407,
            internalFormat: 6407,
            pixelType: 5121
        }, {
            format: 6408,
            internalFormat: 6408,
            pixelType: 5121
        }, {
            format: 6407,
            internalFormat: 6407,
            pixelType: 36193
        }, {
            format: 6408,
            internalFormat: 6408,
            pixelType: 36193
        }, {
            format: 6407,
            internalFormat: 6407,
            pixelType: 5126
        }, {
            format: 6408,
            internalFormat: 6408,
            pixelType: 5126
        }, {
            format: null,
            internalFormat: null,
            pixelType: null
        }, {
            format: null,
            internalFormat: null,
            pixelType: null
        }, {
            format: null,
            internalFormat: null,
            pixelType: null
        }, {
            format: null,
            internalFormat: null,
            pixelType: null
        }, {
            format: 6402,
            internalFormat: 6402,
            pixelType: 5123
        }, {
            format: 6402,
            internalFormat: 6402,
            pixelType: 5125
        }, {
            format: null,
            internalFormat: null,
            pixelType: null
        } ], Z = {
            USAGE_STATIC: 35044,
            USAGE_DYNAMIC: 35048,
            USAGE_STREAM: 35040,
            INDEX_FMT_UINT8: 5121,
            INDEX_FMT_UINT16: 5123,
            INDEX_FMT_UINT32: 5125,
            ATTR_POSITION: "a_position",
            ATTR_NORMAL: "a_normal",
            ATTR_TANGENT: "a_tangent",
            ATTR_BITANGENT: "a_bitangent",
            ATTR_WEIGHTS: "a_weights",
            ATTR_JOINTS: "a_joints",
            ATTR_COLOR: "a_color",
            ATTR_COLOR0: "a_color0",
            ATTR_COLOR1: "a_color1",
            ATTR_UV: "a_uv",
            ATTR_UV0: "a_uv0",
            ATTR_UV1: "a_uv1",
            ATTR_UV2: "a_uv2",
            ATTR_UV3: "a_uv3",
            ATTR_UV4: "a_uv4",
            ATTR_UV5: "a_uv5",
            ATTR_UV6: "a_uv6",
            ATTR_UV7: "a_uv7",
            ATTR_TYPE_INT8: 5120,
            ATTR_TYPE_UINT8: 5121,
            ATTR_TYPE_INT16: 5122,
            ATTR_TYPE_UINT16: 5123,
            ATTR_TYPE_INT32: 5124,
            ATTR_TYPE_UINT32: 5125,
            ATTR_TYPE_FLOAT32: 5126,
            FILTER_NEAREST: 0,
            FILTER_LINEAR: 1,
            WRAP_REPEAT: 10497,
            WRAP_CLAMP: 33071,
            WRAP_MIRROR: 33648,
            TEXTURE_FMT_RGB_DXT1: 0,
            TEXTURE_FMT_RGBA_DXT1: 1,
            TEXTURE_FMT_RGBA_DXT3: 2,
            TEXTURE_FMT_RGBA_DXT5: 3,
            TEXTURE_FMT_RGB_ETC1: 4,
            TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5,
            TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6,
            TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7,
            TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8,
            TEXTURE_FMT_A8: 9,
            TEXTURE_FMT_L8: 10,
            TEXTURE_FMT_L8_A8: 11,
            TEXTURE_FMT_R5_G6_B5: 12,
            TEXTURE_FMT_R5_G5_B5_A1: 13,
            TEXTURE_FMT_R4_G4_B4_A4: 14,
            TEXTURE_FMT_RGB8: 15,
            TEXTURE_FMT_RGBA8: 16,
            TEXTURE_FMT_RGB16F: 17,
            TEXTURE_FMT_RGBA16F: 18,
            TEXTURE_FMT_RGB32F: 19,
            TEXTURE_FMT_RGBA32F: 20,
            TEXTURE_FMT_R32F: 21,
            TEXTURE_FMT_111110F: 22,
            TEXTURE_FMT_SRGB: 23,
            TEXTURE_FMT_SRGBA: 24,
            TEXTURE_FMT_D16: 25,
            TEXTURE_FMT_D32: 26,
            TEXTURE_FMT_D24S8: 27,
            DS_FUNC_NEVER: 512,
            DS_FUNC_LESS: 513,
            DS_FUNC_EQUAL: 514,
            DS_FUNC_LEQUAL: 515,
            DS_FUNC_GREATER: 516,
            DS_FUNC_NOTEQUAL: 517,
            DS_FUNC_GEQUAL: 518,
            DS_FUNC_ALWAYS: 519,
            RB_FMT_RGBA4: 32854,
            RB_FMT_RGB5_A1: 32855,
            RB_FMT_RGB565: 36194,
            RB_FMT_D16: 33189,
            RB_FMT_S8: 36168,
            RB_FMT_D24S8: 34041,
            BLEND_FUNC_ADD: 32774,
            BLEND_FUNC_SUBTRACT: 32778,
            BLEND_FUNC_REVERSE_SUBTRACT: 32779,
            BLEND_ZERO: 0,
            BLEND_ONE: 1,
            BLEND_SRC_COLOR: 768,
            BLEND_ONE_MINUS_SRC_COLOR: 769,
            BLEND_DST_COLOR: 774,
            BLEND_ONE_MINUS_DST_COLOR: 775,
            BLEND_SRC_ALPHA: 770,
            BLEND_ONE_MINUS_SRC_ALPHA: 771,
            BLEND_DST_ALPHA: 772,
            BLEND_ONE_MINUS_DST_ALPHA: 773,
            BLEND_CONSTANT_COLOR: 32769,
            BLEND_ONE_MINUS_CONSTANT_COLOR: 32770,
            BLEND_CONSTANT_ALPHA: 32771,
            BLEND_ONE_MINUS_CONSTANT_ALPHA: 32772,
            BLEND_SRC_ALPHA_SATURATE: 776,
            STENCIL_OP_KEEP: 7680,
            STENCIL_OP_ZERO: 0,
            STENCIL_OP_REPLACE: 7681,
            STENCIL_OP_INCR: 7682,
            STENCIL_OP_INCR_WRAP: 34055,
            STENCIL_OP_DECR: 7683,
            STENCIL_OP_DECR_WRAP: 34056,
            STENCIL_OP_INVERT: 5386,
            CULL_NONE: 0,
            CULL_FRONT: 1028,
            CULL_BACK: 1029,
            CULL_FRONT_AND_BACK: 1032,
            PT_POINTS: 0,
            PT_LINES: 1,
            PT_LINE_LOOP: 2,
            PT_LINE_STRIP: 3,
            PT_TRIANGLES: 4,
            PT_TRIANGLE_STRIP: 5,
            PT_TRIANGLE_FAN: 6
        };
        function K(t) {
            return t === Z.ATTR_TYPE_INT8 ? 1 : t === Z.ATTR_TYPE_UINT8 ? 1 : t === Z.ATTR_TYPE_INT16 ? 2 : t === Z.ATTR_TYPE_UINT16 ? 2 : t === Z.ATTR_TYPE_INT32 ? 4 : t === Z.ATTR_TYPE_UINT32 ? 4 : t === Z.ATTR_TYPE_FLOAT32 ? 4 : (console.warn("Unknown ATTR_TYPE: " + t), 
            0);
        }
        function J(t, e, i) {
            void 0 === i && (i = -1);
            var n = X[e][i + 1];
            return void 0 === n ? (console.warn("Unknown FILTER: " + e), -1 === i ? t.LINEAR : t.LINEAR_MIPMAP_LINEAR) : n;
        }
        function Q(t) {
            var e = q[t];
            return void 0 === e ? (console.warn("Unknown TEXTURE_FMT: " + t), q[Z.TEXTURE_FMT_RGBA8]) : e;
        }
        var $ = function(t) {
            this._attr2el = {}, this._elements = [], this._bytes = 0;
            for (var e = 0, i = 0, n = t.length; i < n; ++i) {
                var r = t[i], s = {
                    name: r.name,
                    offset: e,
                    stride: 0,
                    stream: -1,
                    type: r.type,
                    num: r.num,
                    normalize: void 0 !== r.normalize && r.normalize,
                    bytes: r.num * K(r.type)
                };
                this._attr2el[s.name] = s, this._elements.push(s), this._bytes += s.bytes, e += s.bytes;
            }
            for (var a = 0, o = this._elements.length; a < o; ++a) {
                this._elements[a].stride = this._bytes;
            }
        };
        $.prototype.element = function(t) {
            return this._attr2el[t];
        };
        var tt = function(t, e, i, n, r) {
            this._device = t, this._format = e, this._usage = i, this._numIndices = r, this._bytesPerIndex = 0, 
            e === Z.INDEX_FMT_UINT8 ? this._bytesPerIndex = 1 : e === Z.INDEX_FMT_UINT16 ? this._bytesPerIndex = 2 : e === Z.INDEX_FMT_UINT32 && (this._bytesPerIndex = 4), 
            this._bytes = this._bytesPerIndex * r, this._glID = t._gl.createBuffer(), this.update(0, n), 
            t._stats.ib += this._bytes;
        }, et = {
            count: {
                configurable: !0
            }
        };
        tt.prototype.destroy = function() {
            -1 !== this._glID ? (this._device._gl.deleteBuffer(this._glID), this._device._stats.ib -= this.bytes, 
            this._glID = -1) : console.error("The buffer already destroyed");
        }, tt.prototype.update = function(t, e) {
            if (-1 !== this._glID) if (e && e.byteLength + t > this._bytes) console.error("Failed to update data, bytes exceed."); else {
                var i = this._device._gl, n = this._usage;
                i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, this._glID), e ? t ? i.bufferSubData(i.ELEMENT_ARRAY_BUFFER, t, e) : i.bufferData(i.ELEMENT_ARRAY_BUFFER, e, n) : this._bytes ? i.bufferData(i.ELEMENT_ARRAY_BUFFER, this._bytes, n) : console.warn("bufferData should not submit 0 bytes data"), 
                this._device._restoreIndexBuffer();
            } else console.error("The buffer is destroyed");
        }, et.count.get = function() {
            return this._numIndices;
        }, Object.defineProperties(tt.prototype, et);
        var it = function(t, e, i, n, r) {
            this._device = t, this._format = e, this._usage = i, this._numVertices = r, this._bytes = this._format._bytes * r, 
            this._glID = t._gl.createBuffer(), this.update(0, n), t._stats.vb += this._bytes;
        }, nt = {
            count: {
                configurable: !0
            }
        };
        it.prototype.destroy = function() {
            -1 !== this._glID ? (this._device._gl.deleteBuffer(this._glID), this._device._stats.vb -= this.bytes, 
            this._glID = -1) : console.error("The buffer already destroyed");
        }, it.prototype.update = function(t, e) {
            if (-1 !== this._glID) if (e && e.byteLength + t > this._bytes) console.error("Failed to update data, bytes exceed."); else {
                var i = this._device._gl, n = this._usage;
                i.bindBuffer(i.ARRAY_BUFFER, this._glID), e ? t ? i.bufferSubData(i.ARRAY_BUFFER, t, e) : i.bufferData(i.ARRAY_BUFFER, e, n) : this._bytes ? i.bufferData(i.ARRAY_BUFFER, this._bytes, n) : console.warn("bufferData should not submit 0 bytes data"), 
                i.bindBuffer(i.ARRAY_BUFFER, null);
            } else console.error("The buffer is destroyed");
        }, nt.count.get = function() {
            return this._numVertices;
        }, Object.defineProperties(it.prototype, nt);
        var rt = 0;
        function st(t, e, i) {
            i.split("\n").forEach(function(i) {
                if (!(i.length < 5)) {
                    var n = /^ERROR\:\s+(\d+)\:(\d+)\:\s*(.*)$/.exec(i);
                    n ? t.push({
                        type: e,
                        fileID: 0 | n[1],
                        line: 0 | n[2],
                        message: n[3].trim()
                    }) : i.length > 0 && t.push({
                        type: e,
                        fileID: -1,
                        line: 0,
                        message: i
                    });
                }
            });
        }
        var at = function(t, e) {
            this._device = t, this._attributes = [], this._uniforms = [], this._samplers = [], 
            this._errors = [], this._linked = !1, this._vertSource = e.vert, this._fragSource = e.frag, 
            this._glID = null, this._id = rt++;
        }, ot = {
            id: {
                configurable: !0
            }
        };
        function ct(t, e, i) {
            var n = t.createShader(e);
            return t.shaderSource(n, i), t.compileShader(n), n;
        }
        ot.id.get = function() {
            return this._id;
        }, at.prototype.link = function() {
            if (!this._linked) {
                var t = this._device._gl, e = ct(t, t.VERTEX_SHADER, this._vertSource), i = ct(t, t.FRAGMENT_SHADER, this._fragSource), n = t.createProgram();
                t.attachShader(n, e), t.attachShader(n, i), t.linkProgram(n);
                var r = !1, s = this._errors;
                if (t.getShaderParameter(e, t.COMPILE_STATUS) || (st(s, "vs", t.getShaderInfoLog(e)), 
                r = !0), t.getShaderParameter(i, t.COMPILE_STATUS) || (st(s, "fs", t.getShaderInfoLog(i)), 
                r = !0), t.deleteShader(e), t.deleteShader(i), r) s.forEach(function(t) {
                    console.error("Failed to compile " + t.type + " " + t.fileID + " (ln " + t.line + "): " + t.message);
                }); else if (t.getProgramParameter(n, t.LINK_STATUS) || (console.error("Failed to link shader program: " + t.getProgramInfoLog(n)), 
                r = !0), !r) {
                    this._glID = n;
                    for (var a = t.getProgramParameter(n, t.ACTIVE_ATTRIBUTES), o = 0; o < a; ++o) {
                        var c = t.getActiveAttrib(n, o), h = t.getAttribLocation(n, c.name);
                        this._attributes.push({
                            name: c.name,
                            location: h,
                            type: c.type
                        });
                    }
                    for (var l = t.getProgramParameter(n, t.ACTIVE_UNIFORMS), u = 0; u < l; ++u) {
                        var _ = t.getActiveUniform(n, u), d = _.name, f = t.getUniformLocation(n, d), p = "[0]" === d.substr(d.length - 3);
                        p && (d = d.substr(0, d.length - 3)), this._uniforms.push({
                            name: d,
                            location: f,
                            type: _.type,
                            size: p ? _.size : void 0
                        });
                    }
                    this._linked = !0;
                }
            }
        }, at.prototype.destroy = function() {
            this._device._gl.deleteProgram(this._glID), this._linked = !1, this._glID = null, 
            this._attributes = [], this._uniforms = [], this._samplers = [];
        }, Object.defineProperties(at.prototype, ot);
        var ht = function(t) {
            this._device = t, this._width = 4, this._height = 4, this._hasMipmap = !1, this._compressed = !1, 
            this._anisotropy = 1, this._minFilter = Z.FILTER_LINEAR, this._magFilter = Z.FILTER_LINEAR, 
            this._mipFilter = Z.FILTER_LINEAR, this._wrapS = Z.WRAP_REPEAT, this._wrapT = Z.WRAP_REPEAT, 
            this._format = Z.TEXTURE_FMT_RGBA8, this._target = -1;
        };
        function lt(t) {
            return !(t & t - 1 || !t);
        }
        ht.prototype.destroy = function() {
            -1 !== this._glID ? (this._device._gl.deleteTexture(this._glID), this._device._stats.tex -= this.bytes, 
            this._glID = -1) : console.error("The texture already destroyed");
        };
        var ut = function(t) {
            function e(e, i) {
                t.call(this, e);
                var n = this._device._gl;
                this._target = n.TEXTURE_2D, this._glID = n.createTexture(), i.images = i.images || [ null ], 
                this.update(i);
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, 
            e.prototype.update = function(t) {
                var e = this._device._gl, i = this._hasMipmap;
                t && (void 0 !== t.width && (this._width = t.width), void 0 !== t.height && (this._height = t.height), 
                void 0 !== t.anisotropy && (this._anisotropy = t.anisotropy), void 0 !== t.minFilter && (this._minFilter = t.minFilter), 
                void 0 !== t.magFilter && (this._magFilter = t.magFilter), void 0 !== t.mipFilter && (this._mipFilter = t.mipFilter), 
                void 0 !== t.wrapS && (this._wrapS = t.wrapS), void 0 !== t.wrapT && (this._wrapT = t.wrapT), 
                void 0 !== t.format && (this._format = t.format, this._compressed = this._format >= Z.TEXTURE_FMT_RGB_DXT1 && this._format <= Z.TEXTURE_FMT_RGBA_PVRTC_4BPPV1), 
                void 0 !== t.mipmap && (this._hasMipmap = t.mipmap, i = t.mipmap), void 0 !== t.images && t.images.length > 1 && (i = !1, 
                (t.width > t.height ? t.width : t.height) >> t.images.length - 1 != 1 && console.error("texture-2d mipmap is invalid, should have a 1x1 mipmap.")));
                lt(this._width) && lt(this._height) || (i = !1), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, this._glID), 
                void 0 !== t.images && t.images.length > 0 && this._setMipmap(t.images, t.flipY, t.premultiplyAlpha), 
                this._setTexInfo(), i && (e.hint(e.GENERATE_MIPMAP_HINT, e.NICEST), e.generateMipmap(e.TEXTURE_2D)), 
                this._device._restoreTexture(0);
            }, e.prototype.updateSubImage = function(t) {
                var e = this._device._gl, i = Q(this._format);
                e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, this._glID), this._setSubImage(i, t), 
                this._device._restoreTexture(0);
            }, e.prototype.updateImage = function(t) {
                var e = this._device._gl, i = Q(this._format);
                e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, this._glID), this._setImage(i, t), 
                this._device._restoreTexture(0);
            }, e.prototype._setSubImage = function(t, e) {
                var i = this._device._gl, n = e.flipY, r = e.premultiplyAlpha, s = e.image;
                !s || ArrayBuffer.isView(s) || s instanceof ArrayBuffer ? (void 0 === n ? i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1) : i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, n), 
                void 0 === r ? i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1) : i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r), 
                this._compressed ? i.compressedTexSubImage2D(i.TEXTURE_2D, e.level, e.x, e.y, e.width, e.height, t.format, s) : i.texSubImage2D(i.TEXTURE_2D, e.level, e.x, e.y, e.width, e.height, t.format, t.pixelType, s)) : (void 0 === n ? i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !0) : i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, n), 
                void 0 === r ? i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1) : i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r), 
                i.texSubImage2D(i.TEXTURE_2D, e.level, e.x, e.y, t.format, t.pixelType, s));
            }, e.prototype._setImage = function(t, e) {
                var i = this._device._gl, n = e.flipY, r = e.premultiplyAlpha, s = e.image;
                !s || ArrayBuffer.isView(s) || s instanceof ArrayBuffer ? (void 0 === n ? i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1) : i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, n), 
                void 0 === r ? i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1) : i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r), 
                this._compressed ? i.compressedTexImage2D(i.TEXTURE_2D, e.level, t.internalFormat, e.width, e.height, 0, s) : i.texImage2D(i.TEXTURE_2D, e.level, t.internalFormat, e.width, e.height, 0, t.format, t.pixelType, s)) : (void 0 === n ? i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !0) : i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, n), 
                void 0 === r ? i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1) : i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r), 
                i.texImage2D(i.TEXTURE_2D, e.level, t.internalFormat, t.format, t.pixelType, s));
            }, e.prototype._setMipmap = function(t, e, i) {
                for (var n = Q(this._format), r = {
                    width: this._width,
                    height: this._height,
                    flipY: e,
                    premultiplyAlpha: i,
                    level: 0,
                    image: null
                }, s = 0; s < t.length; ++s) r.level = s, r.width = this._width >> s, r.height = this._height >> s, 
                r.image = t[s], this._setImage(n, r);
            }, e.prototype._setTexInfo = function() {
                var t = this._device._gl, e = lt(this._width) && lt(this._height);
                e || this._wrapS === Z.WRAP_CLAMP && this._wrapT === Z.WRAP_CLAMP || (console.warn("WebGL1 doesn't support all wrap modes with NPOT textures"), 
                this._wrapS = Z.WRAP_CLAMP, this._wrapT = Z.WRAP_CLAMP);
                var i = this._hasMipmap ? this._mipFilter : -1;
                e || -1 === i || (console.warn("NPOT textures do not support mipmap filter"), i = -1), 
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, J(t, this._minFilter, i)), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, J(t, this._magFilter, -1)), 
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, this._wrapS), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, this._wrapT);
                var n = this._device.ext("EXT_texture_filter_anisotropic");
                n && n.TEXTURE_MAX_ANISOTROPY_EXT && t.texParameteri(t.TEXTURE_2D, n.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
            }, e;
        }(ht), _t = function(t) {
            function e(e, i) {
                t.call(this, e);
                var n = this._device._gl;
                this._target = n.TEXTURE_CUBE_MAP, this._glID = n.createTexture(), this.update(i);
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, 
            e.prototype.update = function(t) {
                var e = this._device._gl, i = this._hasMipmap;
                t && (void 0 !== t.width && (this._width = t.width), void 0 !== t.height && (this._height = t.height), 
                void 0 !== t.anisotropy && (this._anisotropy = t.anisotropy), void 0 !== t.minFilter && (this._minFilter = t.minFilter), 
                void 0 !== t.magFilter && (this._magFilter = t.magFilter), void 0 !== t.mipFilter && (this._mipFilter = t.mipFilter), 
                void 0 !== t.wrapS && (this._wrapS = t.wrapS), void 0 !== t.wrapT && (this._wrapT = t.wrapT), 
                void 0 !== t.format && (this._format = t.format, this._compressed = this._format >= Z.TEXTURE_FMT_RGB_DXT1 && this._format <= Z.TEXTURE_FMT_RGBA_PVRTC_4BPPV1), 
                void 0 !== t.mipmap && (this._hasMipmap = t.mipmap, i = t.mipmap), void 0 !== t.images && t.images.length > 1 && (i = !1, 
                t.width !== t.height && console.warn("texture-cube width and height should be identical."), 
                t.width >> t.images.length - 1 != 1 && console.error("texture-cube mipmap is invalid. please set mipmap as 1x1, 2x2, 4x4 ... nxn"))), 
                lt(this._width) && lt(this._height) || (i = !1), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_CUBE_MAP, this._glID), 
                void 0 !== t.images && t.images.length > 0 && this._setMipmap(t.images, t.flipY, t.premultiplyAlpha), 
                this._setTexInfo(), i && (e.hint(e.GENERATE_MIPMAP_HINT, e.NICEST), e.generateMipmap(e.TEXTURE_CUBE_MAP)), 
                this._device._restoreTexture(0);
            }, e.prototype.updateSubImage = function(t) {
                var e = this._device._gl, i = Q(this._format);
                e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_CUBE_MAP, this._glID), this._setSubImage(i, t), 
                this._device._restoreTexture(0);
            }, e.prototype.updateImage = function(t) {
                var e = this._device._gl, i = Q(this._format);
                e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_CUBE_MAP, this._glID), this._setImage(i, t), 
                this._device._restoreTexture(0);
            }, e.prototype._setSubImage = function(t, e) {
                var i = this._device._gl, n = e.flipY, r = e.premultiplyAlpha, s = e.faceIndex, a = e.image;
                void 0 === n ? i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1) : i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, n), 
                void 0 === r ? i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1) : i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r), 
                !a || ArrayBuffer.isView(a) || a instanceof ArrayBuffer ? this._compressed ? i.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + s, e.level, e.x, e.y, e.width, e.height, t.format, a) : i.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + s, e.level, e.x, e.y, e.width, e.height, t.format, t.pixelType, a) : i.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + s, e.level, e.x, e.y, t.format, t.pixelType, a);
            }, e.prototype._setImage = function(t, e) {
                var i = this._device._gl, n = e.flipY, r = e.premultiplyAlpha, s = e.faceIndex, a = e.image;
                void 0 === n ? i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1) : i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, n), 
                void 0 === r ? i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1) : i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r), 
                !a || ArrayBuffer.isView(a) || a instanceof ArrayBuffer ? this._compressed ? i.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + s, e.level, t.internalFormat, e.width, e.height, 0, a) : i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + s, e.level, t.internalFormat, e.width, e.height, 0, t.format, t.pixelType, a) : i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + s, e.level, t.internalFormat, t.format, t.pixelType, a);
            }, e.prototype._setMipmap = function(t, e, i) {
                for (var n = Q(this._format), r = {
                    width: this._width,
                    height: this._height,
                    faceIndex: 0,
                    flipY: e,
                    premultiplyAlpha: i,
                    level: 0,
                    image: null
                }, s = 0; s < t.length; ++s) {
                    var a = t[s];
                    r.level = s, r.width = this._width >> s, r.height = this._height >> s;
                    for (var o = 0; o < 6; ++o) r.faceIndex = o, r.image = a[o], this._setImage(n, r);
                }
            }, e.prototype._setTexInfo = function() {
                var t = this._device._gl, e = lt(this._width) && lt(this._height);
                e || this._wrapS === Z.WRAP_CLAMP && this._wrapT === Z.WRAP_CLAMP || (console.warn("WebGL1 doesn't support all wrap modes with NPOT textures"), 
                this._wrapS = Z.WRAP_CLAMP, this._wrapT = Z.WRAP_CLAMP);
                var i = this._hasMipmap ? this._mipFilter : -1;
                e || -1 === i || (console.warn("NPOT textures do not support mipmap filter"), i = -1), 
                t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MIN_FILTER, J(t, this._minFilter, i)), 
                t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MAG_FILTER, J(t, this._magFilter, -1)), 
                t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_WRAP_S, this._wrapS), t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_WRAP_T, this._wrapT);
                var n = this._device.ext("EXT_texture_filter_anisotropic");
                n && n.TEXTURE_MAX_ANISOTROPY_EXT && t.texParameteri(t.TEXTURE_CUBE_MAP, n.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
            }, e;
        }(ht), dt = function(t, e, i, n) {
            this._device = t, this._format = e, this._width = i, this._height = n;
            var r = t._gl;
            this._glID = r.createRenderbuffer(), r.bindRenderbuffer(r.RENDERBUFFER, this._glID), 
            r.renderbufferStorage(r.RENDERBUFFER, e, i, n), r.bindRenderbuffer(r.RENDERBUFFER, null);
        };
        dt.prototype.destroy = function() {
            if (null !== this._glID) {
                var t = this._device._gl;
                t.bindRenderbuffer(t.RENDERBUFFER, null), t.deleteRenderbuffer(this._glID), this._glID = null;
            } else console.error("The render-buffer already destroyed");
        };
        var ft = function(t, e, i, n) {
            this._device = t, this._width = e, this._height = i, this._colors = n.colors || [], 
            this._depth = n.depth || null, this._stencil = n.stencil || null, this._depthStencil = n.depthStencil || null, 
            this._glID = t._gl.createFramebuffer();
        };
        ft.prototype.destroy = function() {
            null !== this._glID ? (this._device._gl.deleteFramebuffer(this._glID), this._glID = null) : console.error("The frame-buffer already destroyed");
        };
        var pt = {
            blend: !1,
            blendSep: !1,
            blendColor: 4294967295,
            blendEq: Z.BLEND_FUNC_ADD,
            blendAlphaEq: Z.BLEND_FUNC_ADD,
            blendSrc: Z.BLEND_ONE,
            blendDst: Z.BLEND_ZERO,
            blendSrcAlpha: Z.BLEND_ONE,
            blendDstAlpha: Z.BLEND_ZERO,
            depthTest: !1,
            depthWrite: !1,
            depthFunc: Z.DS_FUNC_LESS,
            stencilTest: !1,
            stencilSep: !1,
            stencilFuncFront: Z.DS_FUNC_ALWAYS,
            stencilRefFront: 0,
            stencilMaskFront: 255,
            stencilFailOpFront: Z.STENCIL_OP_KEEP,
            stencilZFailOpFront: Z.STENCIL_OP_KEEP,
            stencilZPassOpFront: Z.STENCIL_OP_KEEP,
            stencilWriteMaskFront: 255,
            stencilFuncBack: Z.DS_FUNC_ALWAYS,
            stencilRefBack: 0,
            stencilMaskBack: 255,
            stencilFailOpBack: Z.STENCIL_OP_KEEP,
            stencilZFailOpBack: Z.STENCIL_OP_KEEP,
            stencilZPassOpBack: Z.STENCIL_OP_KEEP,
            stencilWriteMaskBack: 255,
            cullMode: Z.CULL_BACK,
            primitiveType: Z.PT_TRIANGLES,
            maxStream: -1,
            vertexBuffers: [],
            vertexBufferOffsets: [],
            indexBuffer: null,
            maxTextureSlot: -1,
            textureUnits: [],
            program: null
        }, mt = function(t) {
            this.vertexBuffers = new Array(t._caps.maxVertexStreams), this.vertexBufferOffsets = new Array(t._caps.maxVertexStreams), 
            this.textureUnits = new Array(t._caps.maxTextureUnits), this.set(pt);
        };
        mt.initDefault = function(t) {
            pt.vertexBuffers = new Array(t._caps.maxVertexStreams), pt.vertexBufferOffsets = new Array(t._caps.maxVertexStreams), 
            pt.textureUnits = new Array(t._caps.maxTextureUnits);
        }, mt.prototype.reset = function() {
            this.set(pt);
        }, mt.prototype.set = function(t) {
            this.blend = t.blend, this.blendSep = t.blendSep, this.blendColor = t.blendColor, 
            this.blendEq = t.blendEq, this.blendAlphaEq = t.blendAlphaEq, this.blendSrc = t.blendSrc, 
            this.blendDst = t.blendDst, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, 
            this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.depthFunc = t.depthFunc, 
            this.stencilTest = t.stencilTest, this.stencilSep = t.stencilSep, this.stencilFuncFront = t.stencilFuncFront, 
            this.stencilRefFront = t.stencilRefFront, this.stencilMaskFront = t.stencilMaskFront, 
            this.stencilFailOpFront = t.stencilFailOpFront, this.stencilZFailOpFront = t.stencilZFailOpFront, 
            this.stencilZPassOpFront = t.stencilZPassOpFront, this.stencilWriteMaskFront = t.stencilWriteMaskFront, 
            this.stencilFuncBack = t.stencilFuncBack, this.stencilRefBack = t.stencilRefBack, 
            this.stencilMaskBack = t.stencilMaskBack, this.stencilFailOpBack = t.stencilFailOpBack, 
            this.stencilZFailOpBack = t.stencilZFailOpBack, this.stencilZPassOpBack = t.stencilZPassOpBack, 
            this.stencilWriteMaskBack = t.stencilWriteMaskBack, this.cullMode = t.cullMode, 
            this.primitiveType = t.primitiveType, this.maxStream = t.maxStream;
            for (var e = 0; e < t.vertexBuffers.length; ++e) this.vertexBuffers[e] = t.vertexBuffers[e];
            for (var i = 0; i < t.vertexBufferOffsets.length; ++i) this.vertexBufferOffsets[i] = t.vertexBufferOffsets[i];
            this.indexBuffer = t.indexBuffer, this.maxTextureSlot = t.maxTextureSlot;
            for (var n = 0; n < t.textureUnits.length; ++n) this.textureUnits[n] = t.textureUnits[n];
            this.program = t.program;
        };
        var vt = {
            5124: function(t, e, i) {
                t.uniform1i(e, i);
            },
            5126: function(t, e, i) {
                t.uniform1f(e, i);
            },
            35664: function(t, e, i) {
                t.uniform2fv(e, i);
            },
            35665: function(t, e, i) {
                t.uniform3fv(e, i);
            },
            35666: function(t, e, i) {
                t.uniform4fv(e, i);
            },
            35667: function(t, e, i) {
                t.uniform2iv(e, i);
            },
            35668: function(t, e, i) {
                t.uniform3iv(e, i);
            },
            35669: function(t, e, i) {
                t.uniform4iv(e, i);
            },
            35670: function(t, e, i) {
                t.uniform1i(e, i);
            },
            35671: function(t, e, i) {
                t.uniform2iv(e, i);
            },
            35672: function(t, e, i) {
                t.uniform3iv(e, i);
            },
            35673: function(t, e, i) {
                t.uniform4iv(e, i);
            },
            35674: function(t, e, i) {
                t.uniformMatrix2fv(e, !1, i);
            },
            35675: function(t, e, i) {
                t.uniformMatrix3fv(e, !1, i);
            },
            35676: function(t, e, i) {
                t.uniformMatrix4fv(e, !1, i);
            },
            35678: function(t, e, i) {
                t.uniform1i(e, i);
            },
            35680: function(t, e, i) {
                t.uniform1i(e, i);
            }
        }, gt = {};
        function yt(t, e, i, n) {
            void 0 === n && (n = 0), i instanceof ut ? t.framebufferTexture2D(t.FRAMEBUFFER, e, t.TEXTURE_2D, i._glID, 0) : i instanceof _t ? t.framebufferTexture2D(t.FRAMEBUFFER, e, t.TEXTURE_CUBE_MAP_POSITIVE_X + n, i._glID, 0) : t.framebufferRenderbuffer(t.FRAMEBUFFER, e, t.RENDERBUFFER, i._glID);
        }
        gt[5124] = function(t, e, i) {
            t.uniform1iv(e, i);
        }, gt[5126] = function(t, e, i) {
            t.uniform1fv(e, i);
        }, gt[35664] = function(t, e, i) {
            t.uniform2fv(e, i);
        }, gt[35665] = function(t, e, i) {
            t.uniform3fv(e, i);
        }, gt[35666] = function(t, e, i) {
            t.uniform4fv(e, i);
        }, gt[35667] = function(t, e, i) {
            t.uniform2iv(e, i);
        }, gt[35668] = function(t, e, i) {
            t.uniform3iv(e, i);
        }, gt[35669] = function(t, e, i) {
            t.uniform4iv(e, i);
        }, gt[35670] = function(t, e, i) {
            t.uniform1iv(e, i);
        }, gt[35671] = function(t, e, i) {
            t.uniform2iv(e, i);
        }, gt[35672] = function(t, e, i) {
            t.uniform3iv(e, i);
        }, gt[35673] = function(t, e, i) {
            t.uniform4iv(e, i);
        }, gt[35674] = function(t, e, i) {
            t.uniformMatrix2fv(e, !1, i);
        }, gt[35675] = function(t, e, i) {
            t.uniformMatrix3fv(e, !1, i);
        }, gt[35676] = function(t, e, i) {
            t.uniformMatrix4fv(e, !1, i);
        }, gt[35678] = function(t, e, i) {
            t.uniform1iv(e, i);
        }, gt[35680] = function(t, e, i) {
            t.uniform1iv(e, i);
        };
        var xt = function(t, e) {
            var i;
            void 0 === (e = e || {}).alpha && (e.alpha = !1), void 0 === e.stencil && (e.stencil = !0), 
            void 0 === e.depth && (e.depth = !0), void 0 === e.antialias && (e.antialias = !1), 
            void 0 === e.preserveDrawingBuffer && (e.preserveDrawingBuffer = !1);
            try {
                i = t.getContext("webgl", e) || t.getContext("experimental-webgl", e) || t.getContext("webkit-3d", e) || t.getContext("moz-webgl", e);
            } catch (t) {
                return void console.error(t);
            }
            this._gl = i, this._extensions = {}, this._caps = {}, this._stats = {
                texture: 0,
                vb: 0,
                ib: 0,
                drawcalls: 0
            }, this._initExtensions([ "EXT_texture_filter_anisotropic", "EXT_shader_texture_lod", "OES_standard_derivatives", "OES_texture_float", "OES_texture_float_linear", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_compressed_texture_atc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_pvrtc", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "WEBGL_draw_buffers" ]), 
            this._initCaps(), this._initStates(), mt.initDefault(this), this._current = new mt(this), 
            this._next = new mt(this), this._uniforms = {}, this._vx = this._vy = this._vw = this._vh = 0, 
            this._sx = this._sy = this._sw = this._sh = 0, this._framebuffer = null, this._enabledAttributes = new Array(this._caps.maxVertexAttribs), 
            this._newAttributes = new Array(this._caps.maxVertexAttribs);
            for (var n = 0; n < this._caps.maxVertexAttribs; ++n) this._enabledAttributes[n] = 0, 
            this._newAttributes[n] = 0;
        };
        xt.prototype._initExtensions = function(t) {
            for (var e = this._gl, i = 0; i < t.length; ++i) for (var n = t[i], r = [ "", "WEBKIT_", "MOZ_" ], s = 0; s < r.length; s++) try {
                var a = e.getExtension(r[s] + n);
                a && (this._extensions[n] = a);
            } catch (t) {
                console.error(t);
            }
        }, xt.prototype._initCaps = function() {
            var t = this._gl, e = this.ext("WEBGL_draw_buffers");
            this._caps.maxVertexStreams = 4, this._caps.maxVertexTextures = t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS), 
            this._caps.maxFragUniforms = t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS), this._caps.maxTextureUnits = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), 
            this._caps.maxVertexAttribs = t.getParameter(t.MAX_VERTEX_ATTRIBS), this._caps.maxDrawBuffers = e ? t.getParameter(e.MAX_DRAW_BUFFERS_WEBGL) : 1, 
            this._caps.maxColorAttachments = e ? t.getParameter(e.MAX_COLOR_ATTACHMENTS_WEBGL) : 1;
        }, xt.prototype._initStates = function() {
            var t = this._gl;
            t.disable(t.BLEND), t.blendFunc(t.ONE, t.ZERO), t.blendEquation(t.FUNC_ADD), t.blendColor(1, 1, 1, 1), 
            t.colorMask(!0, !0, !0, !0), t.enable(t.CULL_FACE), t.cullFace(t.BACK), t.disable(t.DEPTH_TEST), 
            t.depthFunc(t.LESS), t.depthMask(!1), t.disable(t.POLYGON_OFFSET_FILL), t.depthRange(0, 1), 
            t.disable(t.STENCIL_TEST), t.stencilFunc(t.ALWAYS, 0, 255), t.stencilMask(255), 
            t.stencilOp(t.KEEP, t.KEEP, t.KEEP), t.clearDepth(1), t.clearColor(0, 0, 0, 0), 
            t.clearStencil(0), t.disable(t.SCISSOR_TEST);
        }, xt.prototype._restoreTexture = function(t) {
            var e = this._gl, i = this._current.textureUnits[t];
            i && -1 !== i._glID ? e.bindTexture(i._target, i._glID) : e.bindTexture(e.TEXTURE_2D, null);
        }, xt.prototype._restoreIndexBuffer = function() {
            var t = this._gl, e = this._current.indexBuffer;
            e && -1 !== e._glID ? t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, e._glID) : t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null);
        }, xt.prototype.ext = function(t) {
            return this._extensions[t];
        }, xt.prototype.setFrameBuffer = function(t) {
            if (this._framebuffer !== t) {
                this._framebuffer = t;
                var e = this._gl;
                if (null !== t) {
                    e.bindFramebuffer(e.FRAMEBUFFER, t._glID);
                    for (var i = this._framebuffer._colors.length, n = 0; n < i; ++n) {
                        var r = this._framebuffer._colors[n];
                        yt(e, e.COLOR_ATTACHMENT0 + n, r);
                    }
                    for (var s = i; s < this._caps.maxColorAttachments; ++s) e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + s, e.TEXTURE_2D, null, 0);
                    this._framebuffer._depth && yt(e, e.DEPTH_ATTACHMENT, this._framebuffer._depth), 
                    this._framebuffer._stencil && yt(e, e.STENCIL_ATTACHMENT, t._stencil), this._framebuffer._depthStencil && yt(e, e.DEPTH_STENCIL_ATTACHMENT, t._depthStencil);
                } else e.bindFramebuffer(e.FRAMEBUFFER, null);
            }
        }, xt.prototype.setViewport = function(t, e, i, n) {
            this._vx === t && this._vy === e && this._vw === i && this._vh === n || (this._gl.viewport(t, e, i, n), 
            this._vx = t, this._vy = e, this._vw = i, this._vh = n);
        }, xt.prototype.setScissor = function(t, e, i, n) {
            this._sx === t && this._sy === e && this._sw === i && this._sh === n || (this._gl.scissor(t, e, i, n), 
            this._sx = t, this._sy = e, this._sw = i, this._sh = n);
        }, xt.prototype.clear = function(t) {
            if (void 0 !== t.color || void 0 !== t.depth || void 0 !== t.stencil) {
                var e = this._gl, i = 0;
                void 0 !== t.color && (i |= e.COLOR_BUFFER_BIT, e.clearColor(t.color[0], t.color[1], t.color[2], t.color[3])), 
                void 0 !== t.depth && (i |= e.DEPTH_BUFFER_BIT, e.clearDepth(t.depth), e.enable(e.DEPTH_TEST), 
                e.depthMask(!0), e.depthFunc(e.ALWAYS)), void 0 !== t.stencil && (i |= e.STENCIL_BUFFER_BIT, 
                e.clearStencil(t.stencil)), e.clear(i), void 0 !== t.depth && (!1 === this._current.depthTest ? e.disable(e.DEPTH_TEST) : (!1 === this._current.depthWrite && e.depthMask(!1), 
                this._current.depthFunc !== Z.DS_FUNC_ALWAYS && e.depthFunc(this._current.depthFunc)));
            }
        }, xt.prototype.enableBlend = function() {
            this._next.blend = !0;
        }, xt.prototype.enableDepthTest = function() {
            this._next.depthTest = !0;
        }, xt.prototype.enableDepthWrite = function() {
            this._next.depthWrite = !0;
        }, xt.prototype.enableStencilTest = function() {
            this._next.stencilTest = !0;
        }, xt.prototype.setStencilFunc = function(t, e, i) {
            this._next.stencilSep = !1, this._next.stencilFuncFront = this._next.stencilFuncBack = t, 
            this._next.stencilRefFront = this._next.stencilRefBack = e, this._next.stencilMaskFront = this._next.stencilMaskBack = i;
        }, xt.prototype.setStencilFuncFront = function(t, e, i) {
            this._next.stencilSep = !0, this._next.stencilFuncFront = t, this._next.stencilRefFront = e, 
            this._next.stencilMaskFront = i;
        }, xt.prototype.setStencilFuncBack = function(t, e, i) {
            this._next.stencilSep = !0, this._next.stencilFuncBack = t, this._next.stencilRefBack = e, 
            this._next.stencilMaskBack = i;
        }, xt.prototype.setStencilOp = function(t, e, i, n) {
            this._next.stencilFailOpFront = this._next.stencilFailOpBack = t, this._next.stencilZFailOpFront = this._next.stencilZFailOpBack = e, 
            this._next.stencilZPassOpFront = this._next.stencilZPassOpBack = i, this._next.stencilWriteMaskFront = this._next.stencilWriteMaskBack = n;
        }, xt.prototype.setStencilOpFront = function(t, e, i, n) {
            this._next.stencilSep = !0, this._next.stencilFailOpFront = t, this._next.stencilZFailOpFront = e, 
            this._next.stencilZPassOpFront = i, this._next.stencilWriteMaskFront = n;
        }, xt.prototype.setStencilOpBack = function(t, e, i, n) {
            this._next.stencilSep = !0, this._next.stencilFailOpBack = t, this._next.stencilZFailOpBack = e, 
            this._next.stencilZPassOpBack = i, this._next.stencilWriteMaskBack = n;
        }, xt.prototype.setDepthFunc = function(t) {
            this._next.depthFunc = t;
        }, xt.prototype.setBlendColor32 = function(t) {
            this._next.blendColor = t;
        }, xt.prototype.setBlendColor = function(t, e, i, n) {
            this._next.blendColor = (255 * t << 24 | 255 * e << 16 | 255 * i << 8 | 255 * n) >>> 0;
        }, xt.prototype.setBlendFunc = function(t, e) {
            this._next.blendSep = !1, this._next.blendSrc = t, this._next.blendDst = e;
        }, xt.prototype.setBlendFuncSep = function(t, e, i, n) {
            this._next.blendSep = !0, this._next.blendSrc = t, this._next.blendDst = e, this._next.blendSrcAlpha = i, 
            this._next.blendDstAlpha = n;
        }, xt.prototype.setBlendEq = function(t) {
            this._next.blendSep = !1, this._next.blendEq = t;
        }, xt.prototype.setBlendEqSep = function(t, e) {
            this._next.blendSep = !0, this._next.blendEq = t, this._next.blendAlphaEq = e;
        }, xt.prototype.setCullMode = function(t) {
            this._next.cullMode = t;
        }, xt.prototype.setVertexBuffer = function(t, e, i) {
            void 0 === i && (i = 0), this._next.vertexBuffers[t] = e, this._next.vertexBufferOffsets[t] = i, 
            this._next.maxStream < t && (this._next.maxStream = t);
        }, xt.prototype.setIndexBuffer = function(t) {
            this._next.indexBuffer = t;
        }, xt.prototype.setProgram = function(t) {
            this._next.program = t;
        }, xt.prototype.setTexture = function(t, e, i) {
            i >= this._caps.maxTextureUnits ? console.warn("Can not set texture " + t + " at stage " + i + ", max texture exceed: " + this._caps.maxTextureUnits) : (this._next.textureUnits[i] = e, 
            this.setUniform(t, i), this._next.maxTextureSlot < i && (this._next.maxTextureSlot = i));
        }, xt.prototype.setTextureArray = function(t, e, i) {
            var n = e.length;
            if (n >= this._caps.maxTextureUnits) console.warn("Can not set " + n + " textures for " + t + ", max texture exceed: " + this._caps.maxTextureUnits); else {
                for (var r = 0; r < n; ++r) {
                    var s = i[r];
                    this._next.textureUnits[s] = e[r];
                }
                this.setUniform(t, i);
            }
        }, xt.prototype.setUniform = function(t, e) {
            var i = this._uniforms[t], n = !1;
            do {
                if (!i) break;
                if (i.isArray !== Array.isArray(e)) break;
                if (i.isArray && i.value.length !== e.length) break;
                n = !0;
            } while (0);
            if (n) {
                var r = i.value, s = !1;
                if (i.isArray) for (var a = 0, o = r.length; a < o; a++) r[a] !== e[a] && (s = !0, 
                r[a] = e[a]); else r !== e && (s = !0, i.value = e);
                s && (i.dirty = !0);
            } else {
                var c = e, h = !1;
                e instanceof Float32Array || Array.isArray(e) ? (c = new Float32Array(e), h = !0) : e instanceof Int32Array && (c = new Int32Array(e), 
                h = !0), i = {
                    dirty: !0,
                    value: c,
                    isArray: h
                };
            }
            this._uniforms[t] = i;
        }, xt.prototype.setPrimitiveType = function(t) {
            this._next.primitiveType = t;
        }, xt.prototype.draw = function(t, e) {
            var i = this._gl, n = this._current, r = this._next;
            (function(t, e, i) {
                if (e.blend !== i.blend) return i.blend ? (t.enable(t.BLEND), i.blendSrc !== Z.BLEND_CONSTANT_COLOR && i.blendSrc !== Z.BLEND_ONE_MINUS_CONSTANT_COLOR && i.blendDst !== Z.BLEND_CONSTANT_COLOR && i.blendDst !== Z.BLEND_ONE_MINUS_CONSTANT_COLOR || t.blendColor((i.blendColor >> 24) / 255, (i.blendColor >> 16 & 255) / 255, (i.blendColor >> 8 & 255) / 255, (255 & i.blendColor) / 255), 
                void (i.blendSep ? (t.blendFuncSeparate(i.blendSrc, i.blendDst, i.blendSrcAlpha, i.blendDstAlpha), 
                t.blendEquationSeparate(i.blendEq, i.blendAlphaEq)) : (t.blendFunc(i.blendSrc, i.blendDst), 
                t.blendEquation(i.blendEq)))) : void t.disable(t.BLEND);
                !1 !== i.blend && (e.blendColor !== i.blendColor && t.blendColor((i.blendColor >> 24) / 255, (i.blendColor >> 16 & 255) / 255, (i.blendColor >> 8 & 255) / 255, (255 & i.blendColor) / 255), 
                e.blendSep === i.blendSep ? i.blendSep ? (e.blendSrc === i.blendSrc && e.blendDst === i.blendDst && e.blendSrcAlpha === i.blendSrcAlpha && e.blendDstAlpha === i.blendDstAlpha || t.blendFuncSeparate(i.blendSrc, i.blendDst, i.blendSrcAlpha, i.blendDstAlpha), 
                e.blendEq === i.blendEq && e.blendAlphaEq === i.blendAlphaEq || t.blendEquationSeparate(i.blendEq, i.blendAlphaEq)) : (e.blendSrc === i.blendSrc && e.blendDst === i.blendDst || t.blendFunc(i.blendSrc, i.blendDst), 
                e.blendEq !== i.blendEq && t.blendEquation(i.blendEq)) : i.blendSep ? (t.blendFuncSeparate(i.blendSrc, i.blendDst, i.blendSrcAlpha, i.blendDstAlpha), 
                t.blendEquationSeparate(i.blendEq, i.blendAlphaEq)) : (t.blendFunc(i.blendSrc, i.blendDst), 
                t.blendEquation(i.blendEq)));
            })(i, n, r), function(t, e, i) {
                if (e.depthTest !== i.depthTest) return i.depthTest ? (t.enable(t.DEPTH_TEST), t.depthFunc(i.depthFunc), 
                void t.depthMask(i.depthWrite)) : void t.disable(t.DEPTH_TEST);
                e.depthWrite !== i.depthWrite && t.depthMask(i.depthWrite), !1 !== i.depthTest ? e.depthFunc !== i.depthFunc && t.depthFunc(i.depthFunc) : i.depthWrite && (i.depthTest = !0, 
                i.depthFunc = Z.DS_FUNC_ALWAYS, t.enable(t.DEPTH_TEST), t.depthFunc(i.depthFunc));
            }(i, n, r), function(t, e, i) {
                if (i.stencilTest !== e.stencilTest) return i.stencilTest ? (t.enable(t.STENCIL_TEST), 
                void (i.stencilSep ? (t.stencilFuncSeparate(t.FRONT, i.stencilFuncFront, i.stencilRefFront, i.stencilMaskFront), 
                t.stencilMaskSeparate(t.FRONT, i.stencilWriteMaskFront), t.stencilOpSeparate(t.FRONT, i.stencilFailOpFront, i.stencilZFailOpFront, i.stencilZPassOpFront), 
                t.stencilFuncSeparate(t.BACK, i.stencilFuncBack, i.stencilRefBack, i.stencilMaskBack), 
                t.stencilMaskSeparate(t.BACK, i.stencilWriteMaskBack), t.stencilOpSeparate(t.BACK, i.stencilFailOpBack, i.stencilZFailOpBack, i.stencilZPassOpBack)) : (t.stencilFunc(i.stencilFuncFront, i.stencilRefFront, i.stencilMaskFront), 
                t.stencilMask(i.stencilWriteMaskFront), t.stencilOp(i.stencilFailOpFront, i.stencilZFailOpFront, i.stencilZPassOpFront)))) : void t.disable(t.STENCIL_TEST);
                i.stencilTest && (e.stencilSep === i.stencilSep ? i.stencilSep ? (e.stencilFuncFront === i.stencilFuncFront && e.stencilRefFront === i.stencilRefFront && e.stencilMaskFront === i.stencilMaskFront || t.stencilFuncSeparate(t.FRONT, i.stencilFuncFront, i.stencilRefFront, i.stencilMaskFront), 
                e.stencilWriteMaskFront !== i.stencilWriteMaskFront && t.stencilMaskSeparate(t.FRONT, i.stencilWriteMaskFront), 
                e.stencilFailOpFront === i.stencilFailOpFront && e.stencilZFailOpFront === i.stencilZFailOpFront && e.stencilZPassOpFront === i.stencilZPassOpFront || t.stencilOpSeparate(t.FRONT, i.stencilFailOpFront, i.stencilZFailOpFront, i.stencilZPassOpFront), 
                e.stencilFuncBack === i.stencilFuncBack && e.stencilRefBack === i.stencilRefBack && e.stencilMaskBack === i.stencilMaskBack || t.stencilFuncSeparate(t.BACK, i.stencilFuncBack, i.stencilRefBack, i.stencilMaskBack), 
                e.stencilWriteMaskBack !== i.stencilWriteMaskBack && t.stencilMaskSeparate(t.BACK, i.stencilWriteMaskBack), 
                e.stencilFailOpBack === i.stencilFailOpBack && e.stencilZFailOpBack === i.stencilZFailOpBack && e.stencilZPassOpBack === i.stencilZPassOpBack || t.stencilOpSeparate(t.BACK, i.stencilFailOpBack, i.stencilZFailOpBack, i.stencilZPassOpBack)) : (e.stencilFuncFront === i.stencilFuncFront && e.stencilRefFront === i.stencilRefFront && e.stencilMaskFront === i.stencilMaskFront || t.stencilFunc(i.stencilFuncFront, i.stencilRefFront, i.stencilMaskFront), 
                e.stencilWriteMaskFront !== i.stencilWriteMaskFront && t.stencilMask(i.stencilWriteMaskFront), 
                e.stencilFailOpFront === i.stencilFailOpFront && e.stencilZFailOpFront === i.stencilZFailOpFront && e.stencilZPassOpFront === i.stencilZPassOpFront || t.stencilOp(i.stencilFailOpFront, i.stencilZFailOpFront, i.stencilZPassOpFront)) : i.stencilSep ? (t.stencilFuncSeparate(t.FRONT, i.stencilFuncFront, i.stencilRefFront, i.stencilMaskFront), 
                t.stencilMaskSeparate(t.FRONT, i.stencilWriteMaskFront), t.stencilOpSeparate(t.FRONT, i.stencilFailOpFront, i.stencilZFailOpFront, i.stencilZPassOpFront), 
                t.stencilFuncSeparate(t.BACK, i.stencilFuncBack, i.stencilRefBack, i.stencilMaskBack), 
                t.stencilMaskSeparate(t.BACK, i.stencilWriteMaskBack), t.stencilOpSeparate(t.BACK, i.stencilFailOpBack, i.stencilZFailOpBack, i.stencilZPassOpBack)) : (t.stencilFunc(i.stencilFuncFront, i.stencilRefFront, i.stencilMaskFront), 
                t.stencilMask(i.stencilWriteMaskFront), t.stencilOp(i.stencilFailOpFront, i.stencilZFailOpFront, i.stencilZPassOpFront)));
            }(i, n, r), function(t, e, i) {
                e.cullMode !== i.cullMode && (i.cullMode !== Z.CULL_NONE ? (t.enable(t.CULL_FACE), 
                t.cullFace(i.cullMode)) : t.disable(t.CULL_FACE));
            }(i, n, r), function(t, e, i, n) {
                var r = !1;
                if (-1 !== n.maxStream) {
                    if (i.maxStream !== n.maxStream) r = !0; else if (i.program !== n.program) r = !0; else for (var s = 0; s < n.maxStream + 1; ++s) if (i.vertexBuffers[s] !== n.vertexBuffers[s] || i.vertexBufferOffsets[s] !== n.vertexBufferOffsets[s]) {
                        r = !0;
                        break;
                    }
                    if (r) {
                        for (var a = 0; a < t._caps.maxVertexAttribs; ++a) t._newAttributes[a] = 0;
                        for (var o = 0; o < n.maxStream + 1; ++o) {
                            var c = n.vertexBuffers[o], h = n.vertexBufferOffsets[o];
                            if (c) {
                                e.bindBuffer(e.ARRAY_BUFFER, c._glID);
                                for (var l = 0; l < n.program._attributes.length; ++l) {
                                    var u = n.program._attributes[l], _ = c._format.element(u.name);
                                    _ ? (0 === t._enabledAttributes[u.location] && (e.enableVertexAttribArray(u.location), 
                                    t._enabledAttributes[u.location] = 1), t._newAttributes[u.location] = 1, e.vertexAttribPointer(u.location, _.num, _.type, _.normalize, _.stride, _.offset + h * _.stride)) : console.warn("Can not find vertex attribute: " + u.name);
                                }
                            }
                        }
                        for (var d = 0; d < t._caps.maxVertexAttribs; ++d) t._enabledAttributes[d] !== t._newAttributes[d] && (e.disableVertexAttribArray(d), 
                        t._enabledAttributes[d] = 0);
                    }
                } else console.warn("VertexBuffer not assigned, please call setVertexBuffer before every draw.");
            }(this, i, n, r), n.indexBuffer !== r.indexBuffer && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, r.indexBuffer ? r.indexBuffer._glID : null);
            var s = !1;
            n.program !== r.program && (r.program._linked ? i.useProgram(r.program._glID) : console.warn("Failed to use program: has not linked yet."), 
            s = !0), function(t, e, i) {
                for (var n = 0; n < i.maxTextureSlot + 1; ++n) if (e.textureUnits[n] !== i.textureUnits[n]) {
                    var r = i.textureUnits[n];
                    r && -1 !== r._glID && (t.activeTexture(t.TEXTURE0 + n), t.bindTexture(r._target, r._glID));
                }
            }(i, n, r);
            for (var a = 0; a < r.program._uniforms.length; ++a) {
                var o = r.program._uniforms[a], c = this._uniforms[o.name];
                if (c && (s || c.dirty)) {
                    c.dirty = !1;
                    var h = void 0 === o.size ? vt[o.type] : gt[o.type];
                    h ? h(i, o.location, c.value) : console.warn("Can not find commit function for uniform " + o.name);
                }
            }
            r.indexBuffer ? i.drawElements(this._next.primitiveType, e, r.indexBuffer._format, t * r.indexBuffer._bytesPerIndex) : i.drawArrays(this._next.primitiveType, t, e), 
            this._stats.drawcalls += 1, n.set(r), r.reset();
        };
        var Et = {
            VertexFormat: $,
            IndexBuffer: tt,
            VertexBuffer: it,
            Program: at,
            Texture: ht,
            Texture2D: ut,
            TextureCube: _t,
            RenderBuffer: dt,
            FrameBuffer: ft,
            Device: xt,
            attrTypeBytes: K,
            glFilter: J,
            glTextureFmt: Q
        };
        Object.assign(Et, Z);
        var Tt = function(t, e, i) {
            void 0 === i && (i = Et.PT_TRIANGLES), this._vertexBuffer = t, this._indexBuffer = e, 
            this._primitiveType = i, this._start = 0, this._count = -1;
        };
        Tt.prototype.getPrimitiveCount = function() {
            return -1 !== this._count ? this._count : this._indexBuffer ? this._indexBuffer.count : this._vertexBuffer.count;
        };
        var Ct = function(t) {
            this._programName = t, this._cullMode = Et.CULL_BACK, this._blend = !1, this._blendEq = Et.BLEND_FUNC_ADD, 
            this._blendAlphaEq = Et.BLEND_FUNC_ADD, this._blendSrc = Et.BLEND_ONE, this._blendDst = Et.BLEND_ZERO, 
            this._blendSrcAlpha = Et.BLEND_ONE, this._blendDstAlpha = Et.BLEND_ZERO, this._blendColor = 4294967295, 
            this._depthTest = !1, this._depthWrite = !1, this._depthFunc = Et.DS_FUNC_LESS, 
            this._stencilTest = !1, this._stencilFuncFront = Et.DS_FUNC_ALWAYS, this._stencilRefFront = 0, 
            this._stencilMaskFront = 255, this._stencilFailOpFront = Et.STENCIL_OP_KEEP, this._stencilZFailOpFront = Et.STENCIL_OP_KEEP, 
            this._stencilZPassOpFront = Et.STENCIL_OP_KEEP, this._stencilWriteMaskFront = 255, 
            this._stencilFuncBack = Et.DS_FUNC_ALWAYS, this._stencilRefBack = 0, this._stencilMaskBack = 255, 
            this._stencilFailOpBack = Et.STENCIL_OP_KEEP, this._stencilZFailOpBack = Et.STENCIL_OP_KEEP, 
            this._stencilZPassOpBack = Et.STENCIL_OP_KEEP, this._stencilWriteMaskBack = 255;
        };
        Ct.prototype.copy = function(t) {
            this._programName = t._programName, this._cullMode = t._cullMode, this._blend = t._blend, 
            this._blendEq = t._blendEq, this._blendAlphaEq = t._blendAlphaEq, this._blendSrc = t._blendSrc, 
            this._blendDst = t._blendDst, this._blendSrcAlpha = t._blendSrcAlpha, this._blendDstAlpha = t._blendDstAlpha, 
            this._blendColor = t._blendColor, this._depthTest = t._depthTest, this._depthWrite = t._depthWrite, 
            this._depthFunc = t._depthFunc, this._stencilTest = t._stencilTest, this._stencilFuncFront = t._stencilFuncFront, 
            this._stencilRefFront = t._stencilRefFront, this._stencilMaskFront = t._stencilMaskFront, 
            this._stencilFailOpFront = t._stencilFailOpFront, this._stencilZFailOpFront = t._stencilZFailOpFront, 
            this._stencilZPassOpFront = t._stencilZPassOpFront, this._stencilWriteMaskFront = t._stencilWriteMaskFront, 
            this._stencilFuncBack = t._stencilFuncBack, this._stencilRefBack = t._stencilRefBack, 
            this._stencilMaskBack = t._stencilMaskBack, this._stencilFailOpBack = t._stencilFailOpBack, 
            this._stencilZFailOpBack = t._stencilZFailOpBack, this._stencilZPassOpBack = t._stencilZPassOpBack, 
            this._stencilWriteMaskBack = t._stencilWriteMaskBack;
        }, Ct.prototype.setCullMode = function(t) {
            this._cullMode = t;
        }, Ct.prototype.setBlend = function(t, e, i, n, r, s, a) {
            void 0 === t && (t = Et.BLEND_FUNC_ADD), void 0 === e && (e = Et.BLEND_ONE), void 0 === i && (i = Et.BLEND_ZERO), 
            void 0 === n && (n = Et.BLEND_FUNC_ADD), void 0 === r && (r = Et.BLEND_ONE), void 0 === s && (s = Et.BLEND_ZERO), 
            void 0 === a && (a = 4294967295), this._blend = !0, this._blendEq = t, this._blendSrc = e, 
            this._blendDst = i, this._blendAlphaEq = n, this._blendSrcAlpha = r, this._blendDstAlpha = s, 
            this._blendColor = a;
        }, Ct.prototype.setDepth = function(t, e, i) {
            void 0 === t && (t = !1), void 0 === e && (e = !1), void 0 === i && (i = Et.DS_FUNC_LESS), 
            this._depthTest = t, this._depthWrite = e, this._depthFunc = i;
        }, Ct.prototype.setStencilFront = function(t, e, i, n, r, s, a) {
            void 0 === t && (t = Et.DS_FUNC_ALWAYS), void 0 === e && (e = 0), void 0 === i && (i = 255), 
            void 0 === n && (n = Et.STENCIL_OP_KEEP), void 0 === r && (r = Et.STENCIL_OP_KEEP), 
            void 0 === s && (s = Et.STENCIL_OP_KEEP), void 0 === a && (a = 255), this._stencilTest = !0, 
            this._stencilFuncFront = t, this._stencilRefFront = e, this._stencilMaskFront = i, 
            this._stencilFailOpFront = n, this._stencilZFailOpFront = r, this._stencilZPassOpFront = s, 
            this._stencilWriteMaskFront = a;
        }, Ct.prototype.setStencilBack = function(t, e, i, n, r, s, a) {
            void 0 === t && (t = Et.DS_FUNC_ALWAYS), void 0 === e && (e = 0), void 0 === i && (i = 255), 
            void 0 === n && (n = Et.STENCIL_OP_KEEP), void 0 === r && (r = Et.STENCIL_OP_KEEP), 
            void 0 === s && (s = Et.STENCIL_OP_KEEP), void 0 === a && (a = 255), this._stencilTest = !0, 
            this._stencilFuncBack = t, this._stencilRefBack = e, this._stencilMaskBack = i, 
            this._stencilFailOpBack = n, this._stencilZFailOpBack = r, this._stencilZPassOpBack = s, 
            this._stencilWriteMaskBack = a;
        }, Ct.prototype.disableStencilTest = function() {
            this._stencilTest = !1;
        };
        var At = 0, bt = {}, wt = {
            addStage: function(t) {
                if (void 0 === bt[t]) {
                    var e = 1 << At;
                    bt[t] = e, At += 1;
                }
            },
            stageID: function(t) {
                var e = bt[t];
                return void 0 === e ? -1 : e;
            },
            stageIDs: function(t) {
                for (var e = 0, i = 0; i < t.length; ++i) {
                    var n = bt[t[i]];
                    void 0 !== n && (e |= n);
                }
                return e;
            }
        }, Dt = 0, St = function(t, e, i, n) {
            void 0 === n && (n = 0), this._id = Dt++, this._stageIDs = wt.stageIDs(t), this._parameters = e, 
            this._passes = i, this._layer = n;
        }, Rt = {
            passes: {
                configurable: !0
            },
            stageIDs: {
                configurable: !0
            }
        };
        St.prototype.copy = function(t) {
            this._id = t._id, this._stageIDs = t._stageIDs, this._parameters = [];
            for (var e = 0; e < t._parameters.length; ++e) {
                var i = t._parameters[e];
                this._parameters.push({
                    name: i.name,
                    type: i.type
                });
            }
            for (var n = 0; n < t._passes.length; ++n) {
                var r = this._passes[n];
                r || (r = new Pe.Pass(), this._passes.push(r)), r.copy(t._passes[n]);
            }
            this._passes.length = t._passes.length, this._layer = t._layer;
        }, St.prototype.setStages = function(t) {
            this._stageIDs = wt.stageIDs(t);
        }, Rt.passes.get = function() {
            return this._passes;
        }, Rt.stageIDs.get = function() {
            return this._stageIDs;
        }, Object.defineProperties(St.prototype, Rt);
        var Mt = function(t, e, i) {
            void 0 === e && (e = {}), void 0 === i && (i = []), this._techniques = t, this._properties = e, 
            this._defines = i;
        };
        Mt.prototype.clear = function() {
            this._techniques.length = 0, this._properties = null, this._defines.length = 0;
        }, Mt.prototype.getTechnique = function(t) {
            for (var e = wt.stageID(t), i = 0; i < this._techniques.length; ++i) {
                var n = this._techniques[i];
                if (n.stageIDs & e) return n;
            }
            return null;
        }, Mt.prototype.getProperty = function(t) {
            return this._properties[t];
        }, Mt.prototype.setProperty = function(t, e) {
            this._properties[t] = e;
        }, Mt.prototype.getDefine = function(t) {
            for (var e = 0; e < this._defines.length; ++e) {
                var i = this._defines[e];
                if (i.name === t) return i.value;
            }
            return console.warn("Failed to get define " + t + ", define not found."), null;
        }, Mt.prototype.define = function(t, e) {
            for (var i = 0; i < this._defines.length; ++i) {
                var n = this._defines[i];
                if (n.name === t) return void (n.value = e);
            }
            console.warn("Failed to set define " + t + ", define not found.");
        }, Mt.prototype.extractDefines = function(t) {
            void 0 === t && (t = {});
            for (var e = 0; e < this._defines.length; ++e) {
                var i = this._defines[e];
                t[i.name] = i.value;
            }
            return t;
        };
        var Ot = B.create(), Lt = 0, It = function() {
            this._id = Lt++, this._rect = {
                x: 0,
                y: 0,
                w: 1,
                h: 1
            }, this._color = V.new(.3, .3, .3, 1), this._depth = 1, this._stencil = 0, this._clearFlags = Y.CLEAR_COLOR | Y.CLEAR_DEPTH, 
            this._matView = B.create(), this._matProj = B.create(), this._matViewProj = B.create(), 
            this._matInvViewProj = B.create(), this._stages = [], this._cullingMask = 1, this._framebuffer = null, 
            this._shadowLight = null;
        };
        It.prototype.getForward = function(t) {
            return y.set(t, -this._matView.m02, -this._matView.m06, -this._matView.m10);
        }, It.prototype.getPosition = function(t) {
            return B.invert(Ot, this._matView), B.getTranslation(t, Ot);
        };
        var Ft = y.new(0, 0, -1), Pt = B.create(), Nt = b.create(), Bt = y.create();
        var zt = function() {
            this._poolID = -1, this._node = null, this._type = Y.LIGHT_DIRECTIONAL, this._color = U.new(1, 1, 1), 
            this._intensity = 1, this._range = 1, this._spotAngle = a(60), this._spotExp = 1, 
            this._directionUniform = new Float32Array(3), this._positionUniform = new Float32Array(3), 
            this._colorUniform = new Float32Array([ this._color.r * this._intensity, this._color.g * this._intensity, this._color.b * this._intensity ]), 
            this._spotUniform = new Float32Array([ Math.cos(.5 * this._spotAngle), this._spotExp ]), 
            this._shadowType = Y.SHADOW_NONE, this._shadowFrameBuffer = null, this._shadowMap = null, 
            this._shadowMapDirty = !1, this._shadowDepthBuffer = null, this._shadowResolution = 1024, 
            this._shadowBias = 5e-5, this._shadowDarkness = 1, this._shadowMinDepth = 1, this._shadowMaxDepth = 1e3, 
            this._shadowDepthScale = 50, this._frustumEdgeFalloff = 0, this._viewProjMatrix = B.create(), 
            this._spotAngleScale = 1, this._shadowFustumSize = 80;
        }, kt = {
            color: {
                configurable: !0
            },
            intensity: {
                configurable: !0
            },
            type: {
                configurable: !0
            },
            spotAngle: {
                configurable: !0
            },
            spotExp: {
                configurable: !0
            },
            range: {
                configurable: !0
            },
            shadowType: {
                configurable: !0
            },
            shadowMap: {
                configurable: !0
            },
            viewProjMatrix: {
                configurable: !0
            },
            shadowResolution: {
                configurable: !0
            },
            shadowBias: {
                configurable: !0
            },
            shadowDarkness: {
                configurable: !0
            },
            shadowMinDepth: {
                configurable: !0
            },
            shadowMaxDepth: {
                configurable: !0
            },
            shadowDepthScale: {
                configurable: !0
            },
            frustumEdgeFalloff: {
                configurable: !0
            }
        };
        zt.prototype.setNode = function(t) {
            this._node = t;
        }, zt.prototype.setColor = function(t, e, i) {
            U.set(this._color, t, e, i), this._colorUniform[0] = t * this._intensity, this._colorUniform[1] = e * this._intensity, 
            this._colorUniform[2] = i * this._intensity;
        }, kt.color.get = function() {
            return this._color;
        }, zt.prototype.setIntensity = function(t) {
            this._intensity = t, this._colorUniform[0] = t * this._color.r, this._colorUniform[1] = t * this._color.g, 
            this._colorUniform[2] = t * this._color.b;
        }, kt.intensity.get = function() {
            return this._intensity;
        }, zt.prototype.setType = function(t) {
            this._type = t;
        }, kt.type.get = function() {
            return this._type;
        }, zt.prototype.setSpotAngle = function(t) {
            this._spotAngle = t, this._spotUniform[0] = Math.cos(.5 * this._spotAngle);
        }, kt.spotAngle.get = function() {
            return this._spotAngle;
        }, zt.prototype.setSpotExp = function(t) {
            this._spotExp = t, this._spotUniform[1] = t;
        }, kt.spotExp.get = function() {
            return this._spotExp;
        }, zt.prototype.setRange = function(t) {
            this._range = t;
        }, kt.range.get = function() {
            return this._range;
        }, zt.prototype.setShadowType = function(t) {
            this._shadowType === Y.SHADOW_NONE && t !== Y.SHADOW_NONE && (this._shadowMapDirty = !0), 
            this._shadowType = t;
        }, kt.shadowType.get = function() {
            return this._shadowType;
        }, kt.shadowMap.get = function() {
            return this._shadowMap;
        }, kt.viewProjMatrix.get = function() {
            return this._viewProjMatrix;
        }, zt.prototype.setShadowResolution = function(t) {
            this._shadowResolution !== t && (this._shadowMapDirty = !0), this._shadowResolution = t;
        }, kt.shadowResolution.get = function() {
            return this._shadowResolution;
        }, zt.prototype.setShadowBias = function(t) {
            this._shadowBias = t;
        }, kt.shadowBias.get = function() {
            return this._shadowBias;
        }, zt.prototype.setShadowDarkness = function(t) {
            this._shadowDarkness = t;
        }, kt.shadowDarkness.get = function() {
            return this._shadowDarkness;
        }, zt.prototype.setShadowMinDepth = function(t) {
            this._shadowMinDepth = t;
        }, kt.shadowMinDepth.get = function() {
            return this._type === Y.LIGHT_DIRECTIONAL ? 1 : this._shadowMinDepth;
        }, zt.prototype.setShadowMaxDepth = function(t) {
            this._shadowMaxDepth = t;
        }, kt.shadowMaxDepth.get = function() {
            return this._type === Y.LIGHT_DIRECTIONAL ? 1 : this._shadowMaxDepth;
        }, zt.prototype.setShadowDepthScale = function(t) {
            this._shadowDepthScale = t;
        }, kt.shadowDepthScale.get = function() {
            return this._shadowDepthScale;
        }, zt.prototype.setFrustumEdgeFalloff = function(t) {
            this._frustumEdgeFalloff = t;
        }, kt.frustumEdgeFalloff.get = function() {
            return this._frustumEdgeFalloff;
        }, zt.prototype.extractView = function(t, e) {
            switch (t._shadowLight = this, t._rect.x = 0, t._rect.y = 0, t._rect.w = this._shadowResolution, 
            t._rect.h = this._shadowResolution, V.set(t._color, 1, 1, 1, 1), t._depth = 1, t._stencil = 0, 
            t._clearFlags = Y.CLEAR_COLOR | Y.CLEAR_DEPTH, t._stages = e, t._framebuffer = this._shadowFrameBuffer, 
            this._type) {
              case Y.LIGHT_SPOT:
                (function(t, e, i) {
                    t._node.getWorldRT(e), B.invert(e, e), B.perspective(i, t._spotAngle * t._spotAngleScale, 1, t._shadowMinDepth, t._shadowMaxDepth);
                })(this, t._matView, t._matProj);
                break;

              case Y.LIGHT_DIRECTIONAL:
                (function(t, e, i) {
                    t._node.getWorldRT(e), B.invert(e, e);
                    var n = t._shadowFustumSize / 2;
                    B.ortho(i, -n, n, -n, n, t._shadowMinDepth, t._shadowMaxDepth);
                })(this, t._matView, t._matProj);
                break;

              case Y.LIGHT_POINT:
                t._matView, t._matProj;
                break;

              default:
                console.warn("shadow of this light type is not supported");
            }
            B.mul(t._matViewProj, t._matProj, t._matView), this._viewProjMatrix = t._matViewProj, 
            B.invert(t._matInvViewProj, t._matViewProj);
        }, zt.prototype._updateLightPositionAndDirection = function() {
            this._node.getWorldMatrix(Pt), b.fromMat4(Nt, Pt), y.transformMat3(Bt, Ft, Nt), 
            y.array(this._directionUniform, Bt);
            var t = this._positionUniform;
            t[0] = Pt.m12, t[1] = Pt.m13, t[2] = Pt.m14;
        }, zt.prototype._generateShadowMap = function(t) {
            this._shadowMap = new Et.Texture2D(t, {
                width: this._shadowResolution,
                height: this._shadowResolution,
                format: Et.TEXTURE_FMT_RGBA8,
                wrapS: Et.WRAP_CLAMP,
                wrapT: Et.WRAP_CLAMP
            }), this._shadowDepthBuffer = new Et.RenderBuffer(t, Et.RB_FMT_D16, this._shadowResolution, this._shadowResolution), 
            this._shadowFrameBuffer = new Et.FrameBuffer(t, this._shadowResolution, this._shadowResolution, {
                colors: [ this._shadowMap ],
                depth: this._shadowDepthBuffer
            });
        }, zt.prototype._destroyShadowMap = function() {
            this._shadowMap && (this._shadowMap.destroy(), this._shadowDepthBuffer.destroy(), 
            this._shadowFrameBuffer.destroy(), this._shadowMap = null, this._shadowDepthBuffer = null, 
            this._shadowFrameBuffer = null);
        }, zt.prototype.update = function(t) {
            this._updateLightPositionAndDirection(), this._shadowType === Y.SHADOW_NONE ? this._destroyShadowMap() : this._shadowMapDirty && (this._destroyShadowMap(), 
            this._generateShadowMap(t), this._shadowMapDirty = !1);
        }, Object.defineProperties(zt.prototype, kt);
        var Ut = B.create(), Ht = B.create(), Gt = B.create(), Vt = B.create(), Wt = y.create(), jt = function() {
            this._poolID = -1, this._node = null, this._projection = Y.PROJ_PERSPECTIVE, this._color = V.new(.2, .3, .47, 1), 
            this._depth = 1, this._stencil = 0, this._clearFlags = Y.CLEAR_COLOR | Y.CLEAR_DEPTH, 
            this._cullingMask = 1, this._stages = [], this._framebuffer = null, this._near = .01, 
            this._far = 1e3, this._fov = Math.PI / 4, this._rect = {
                x: 0,
                y: 0,
                w: 1,
                h: 1
            }, this._orthoHeight = 10;
        }, Yt = {
            cullingMask: {
                configurable: !0
            }
        };
        Yt.cullingMask.get = function() {
            return this._cullingMask;
        }, Yt.cullingMask.set = function(t) {
            this._cullingMask = t;
        }, jt.prototype.getNode = function() {
            return this._node;
        }, jt.prototype.setNode = function(t) {
            this._node = t;
        }, jt.prototype.getType = function() {
            return this._projection;
        }, jt.prototype.setType = function(t) {
            this._projection = t;
        }, jt.prototype.getOrthoHeight = function() {
            return this._orthoHeight;
        }, jt.prototype.setOrthoHeight = function(t) {
            this._orthoHeight = t;
        }, jt.prototype.getFov = function() {
            return this._fov;
        }, jt.prototype.setFov = function(t) {
            this._fov = t;
        }, jt.prototype.getNear = function() {
            return this._near;
        }, jt.prototype.setNear = function(t) {
            this._near = t;
        }, jt.prototype.getFar = function() {
            return this._far;
        }, jt.prototype.setFar = function(t) {
            this._far = t;
        }, jt.prototype.getColor = function(t) {
            return V.copy(t, this._color);
        }, jt.prototype.setColor = function(t, e, i, n) {
            V.set(this._color, t, e, i, n);
        }, jt.prototype.getDepth = function() {
            return this._depth;
        }, jt.prototype.setDepth = function(t) {
            this._depth = t;
        }, jt.prototype.getStencil = function() {
            return this._stencil;
        }, jt.prototype.setStencil = function(t) {
            this._stencil = t;
        }, jt.prototype.getClearFlags = function() {
            return this._clearFlags;
        }, jt.prototype.setClearFlags = function(t) {
            this._clearFlags = t;
        }, jt.prototype.getRect = function(t) {
            return t.x = this._rect.x, t.y = this._rect.y, t.w = this._rect.w, t.h = this._rect.h, 
            t;
        }, jt.prototype.setRect = function(t, e, i, n) {
            this._rect.x = t, this._rect.y = e, this._rect.w = i, this._rect.h = n;
        }, jt.prototype.getStages = function() {
            return this._stages;
        }, jt.prototype.setStages = function(t) {
            this._stages = t;
        }, jt.prototype.getFramebuffer = function() {
            return this._framebuffer;
        }, jt.prototype.setFramebuffer = function(t) {
            this._framebuffer = t;
        }, jt.prototype.extractView = function(t, e, i) {
            t._rect.x = this._rect.x * e, t._rect.y = this._rect.y * i, t._rect.w = this._rect.w * e, 
            t._rect.h = this._rect.h * i, t._color = this._color, t._depth = this._depth, t._stencil = this._stencil, 
            t._clearFlags = this._clearFlags, t._cullingMask = this._cullingMask, t._stages = this._stages, 
            t._framebuffer = this._framebuffer, this._node.getWorldRT(t._matView), B.invert(t._matView, t._matView);
            var n = e / i;
            if (this._projection === Y.PROJ_PERSPECTIVE) B.perspective(t._matProj, this._fov, n, this._near, this._far); else {
                var r = this._orthoHeight * n, s = this._orthoHeight;
                B.ortho(t._matProj, -r, r, -s, s, this._near, this._far);
            }
            B.mul(t._matViewProj, t._matProj, t._matView), B.invert(t._matInvViewProj, t._matViewProj);
        }, jt.prototype.screenToWorld = function(t, e, i, n) {
            var r = i / n, s = this._rect.x * i, a = this._rect.y * n, o = this._rect.w * i, c = this._rect.h * n;
            if (this._node.getWorldRT(Ut), B.invert(Ut, Ut), this._projection === Y.PROJ_PERSPECTIVE) B.perspective(Ht, this._fov, r, this._near, this._far); else {
                var h = this._orthoHeight * r, l = this._orthoHeight;
                B.ortho(Ht, -h, h, -l, l, this._near, this._far);
            }
            if (B.mul(Gt, Ht, Ut), B.invert(Vt, Gt), this._projection === Y.PROJ_PERSPECTIVE) y.set(t, 2 * (e.x - s) / o - 1, 2 * (e.y - a) / c - 1, 1), 
            y.transformMat4(t, t, Vt), this._node.getWorldPos(Wt), y.lerp(t, Wt, t, e.z / this._far); else {
                var u = this._farClip - this._nearClip;
                y.set(t, 2 * (e.x - s) / o - 1, 2 * (e.y - a) / c - 1, (this._far - e.z) / u * 2 - 1), 
                y.transformMat4(t, t, Vt);
            }
            return t;
        }, jt.prototype.worldToScreen = function(t, e, i, n) {
            var r = i / n, s = this._rect.x * i, a = this._rect.y * n, o = this._rect.w * i, c = this._rect.h * n;
            if (this._node.getWorldRT(Ut), B.invert(Ut, Ut), this._projection === Y.PROJ_PERSPECTIVE) B.perspective(Ht, this._fov, r, this._near, this._far); else {
                var h = this._orthoHeight * r, l = this._orthoHeight;
                B.ortho(Ht, -h, h, -l, l, this._near, this._far);
            }
            B.mul(Gt, Ht, Ut);
            var u = e.x * Gt.m03 + e.y * Gt.m07 + e.z * Gt.m11 + Gt.m15;
            return y.transformMat4(t, e, Gt), t.x = s + .5 * (t.x / u + 1) * o, t.y = a + .5 * (t.y / u + 1) * c, 
            t;
        }, Object.defineProperties(jt.prototype, Yt);
        var Xt = function() {
            this._poolID = -1, this._node = null, this._inputAssemblers = [], this._effects = [], 
            this._defines = [], this._dynamicIA = !1, this._cullingMask = -1;
        }, qt = {
            inputAssemblerCount: {
                configurable: !0
            },
            dynamicIA: {
                configurable: !0
            },
            drawItemCount: {
                configurable: !0
            },
            cullingMask: {
                configurable: !0
            }
        };
        qt.inputAssemblerCount.get = function() {
            return this._inputAssemblers.length;
        }, qt.dynamicIA.get = function() {
            return this._dynamicIA;
        }, qt.drawItemCount.get = function() {
            return this._dynamicIA ? 1 : this._inputAssemblers.length;
        }, qt.cullingMask.get = function() {
            return this._cullingMask;
        }, qt.cullingMask.set = function(t) {
            this._cullingMask = t;
        }, Xt.prototype.setNode = function(t) {
            this._node = t;
        }, Xt.prototype.setDynamicIA = function(t) {
            this._dynamicIA = t;
        }, Xt.prototype.addInputAssembler = function(t) {
            -1 === this._inputAssemblers.indexOf(t) && this._inputAssemblers.push(t);
        }, Xt.prototype.clearInputAssemblers = function() {
            this._inputAssemblers.length = 0;
        }, Xt.prototype.addEffect = function(t) {
            if (-1 === this._effects.indexOf(t)) {
                this._effects.push(t);
                var e = Object.create(null);
                t.extractDefines(e), this._defines.push(e);
            }
        }, Xt.prototype.clearEffects = function() {
            this._effects.length = 0, this._defines.length = 0;
        }, Xt.prototype.extractDrawItem = function(t, e) {
            return this._dynamicIA ? (t.model = this, t.node = this._node, t.ia = null, t.effect = this._effects[0], 
            void (t.defines = t.effect.extractDefines(this._defines[0]))) : e >= this._inputAssemblers.length ? (t.model = null, 
            t.node = null, t.ia = null, t.effect = null, void (t.defines = null)) : (t.model = this, 
            t.node = this._node, t.ia = this._inputAssemblers[e], e < this._effects.length ? (i = this._effects[e], 
            n = this._defines[e]) : (i = this._effects[this._effects.length - 1], n = this._defines[this._effects.length - 1]), 
            t.effect = i, void (t.defines = i.extractDefines(n)));
            var i, n;
        }, Object.defineProperties(Xt.prototype, qt);
        var Zt = 32, Kt = [ 1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9 ];
        function Jt(t) {
            return t < 1e5 ? t < 100 ? t < 10 ? 0 : 1 : t < 1e4 ? t < 1e3 ? 2 : 3 : 4 : t < 1e7 ? t < 1e6 ? 5 : 6 : t < 1e9 ? t < 1e8 ? 7 : 8 : 9;
        }
        function Qt(t, e) {
            if (t === e) return 0;
            if (~~t === t && ~~e === e) {
                if (0 === t || 0 === e) return t < e ? -1 : 1;
                if (t < 0 || e < 0) {
                    if (e >= 0) return -1;
                    if (t >= 0) return 1;
                    t = -t, e = -e;
                }
                var i = Jt(t), n = Jt(e), r = 0;
                return i < n ? (t *= Kt[n - i - 1], e /= 10, r = -1) : i > n && (e *= Kt[i - n - 1], 
                t /= 10, r = 1), t === e ? r : t < e ? -1 : 1;
            }
            var s = String(t), a = String(e);
            return s === a ? 0 : s < a ? -1 : 1;
        }
        function $t(t, e, i, n) {
            var r = e + 1;
            if (r === i) return 1;
            if (n(t[r++], t[e]) < 0) {
                for (;r < i && n(t[r], t[r - 1]) < 0; ) r++;
                (function(t, e, i) {
                    i--;
                    for (;e < i; ) {
                        var n = t[e];
                        t[e++] = t[i], t[i--] = n;
                    }
                })(t, e, r);
            } else for (;r < i && n(t[r], t[r - 1]) >= 0; ) r++;
            return r - e;
        }
        function te(t, e, i, n, r) {
            for (n === e && n++; n < i; n++) {
                for (var s = t[n], a = e, o = n; a < o; ) {
                    var c = a + o >>> 1;
                    r(s, t[c]) < 0 ? o = c : a = c + 1;
                }
                var h = n - a;
                switch (h) {
                  case 3:
                    t[a + 3] = t[a + 2];

                  case 2:
                    t[a + 2] = t[a + 1];

                  case 1:
                    t[a + 1] = t[a];
                    break;

                  default:
                    for (;h > 0; ) t[a + h] = t[a + h - 1], h--;
                }
                t[a] = s;
            }
        }
        function ee(t, e, i, n, r, s) {
            var a = 0, o = 0, c = 1;
            if (s(t, e[i + r]) > 0) {
                for (o = n - r; c < o && s(t, e[i + r + c]) > 0; ) a = c, (c = 1 + (c << 1)) <= 0 && (c = o);
                c > o && (c = o), a += r, c += r;
            } else {
                for (o = r + 1; c < o && s(t, e[i + r - c]) <= 0; ) a = c, (c = 1 + (c << 1)) <= 0 && (c = o);
                c > o && (c = o);
                var h = a;
                a = r - c, c = r - h;
            }
            for (a++; a < c; ) {
                var l = a + (c - a >>> 1);
                s(t, e[i + l]) > 0 ? a = l + 1 : c = l;
            }
            return c;
        }
        function ie(t, e, i, n, r, s) {
            var a = 0, o = 0, c = 1;
            if (s(t, e[i + r]) < 0) {
                for (o = r + 1; c < o && s(t, e[i + r - c]) < 0; ) a = c, (c = 1 + (c << 1)) <= 0 && (c = o);
                c > o && (c = o);
                var h = a;
                a = r - c, c = r - h;
            } else {
                for (o = n - r; c < o && s(t, e[i + r + c]) >= 0; ) a = c, (c = 1 + (c << 1)) <= 0 && (c = o);
                c > o && (c = o), a += r, c += r;
            }
            for (a++; a < c; ) {
                var l = a + (c - a >>> 1);
                s(t, e[i + l]) < 0 ? c = l : a = l + 1;
            }
            return c;
        }
        var ne = function(t, e) {
            this.array = t, this.compare = e, this.minGallop = 7, this.length = t.length, this.tmpStorageLength = 256, 
            this.length < 512 && (this.tmpStorageLength = this.length >>> 1), this.tmp = new Array(this.tmpStorageLength), 
            this.stackLength = this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40, 
            this.runStart = new Array(this.stackLength), this.runLength = new Array(this.stackLength), 
            this.stackSize = 0;
        };
        function re(t, e, i, n) {
            if (!Array.isArray(t)) throw new TypeError("Can only sort arrays");
            void 0 === e && (e = 0), void 0 === i && (i = t.length), void 0 === n && (n = Qt);
            var r = i - e;
            if (!(r < 2)) {
                var s = 0;
                if (r < Zt) te(t, e, i, e + (s = $t(t, e, i, n)), n); else {
                    var a = new ne(t, n), o = function(t) {
                        for (var e = 0; t >= Zt; ) e |= 1 & t, t >>= 1;
                        return t + e;
                    }(r);
                    do {
                        if ((s = $t(t, e, i, n)) < o) {
                            var c = r;
                            c > o && (c = o), te(t, e, e + c, e + s, n), s = c;
                        }
                        a.pushRun(e, s), a.mergeRuns(), r -= s, e += s;
                    } while (0 !== r);
                    a.forceMergeRuns();
                }
            }
        }
        ne.prototype.pushRun = function(t, e) {
            this.runStart[this.stackSize] = t, this.runLength[this.stackSize] = e, this.stackSize += 1;
        }, ne.prototype.mergeRuns = function() {
            for (;this.stackSize > 1; ) {
                var t = this.stackSize - 2;
                if (t >= 1 && this.runLength[t - 1] <= this.runLength[t] + this.runLength[t + 1] || t >= 2 && this.runLength[t - 2] <= this.runLength[t] + this.runLength[t - 1]) this.runLength[t - 1] < this.runLength[t + 1] && t--; else if (this.runLength[t] > this.runLength[t + 1]) break;
                this.mergeAt(t);
            }
        }, ne.prototype.forceMergeRuns = function() {
            for (;this.stackSize > 1; ) {
                var t = this.stackSize - 2;
                t > 0 && this.runLength[t - 1] < this.runLength[t + 1] && t--, this.mergeAt(t);
            }
        }, ne.prototype.mergeAt = function(t) {
            var e = this.compare, i = this.array, n = this.runStart[t], r = this.runLength[t], s = this.runStart[t + 1], a = this.runLength[t + 1];
            this.runLength[t] = r + a, t === this.stackSize - 3 && (this.runStart[t + 1] = this.runStart[t + 2], 
            this.runLength[t + 1] = this.runLength[t + 2]), this.stackSize--;
            var o = ie(i[s], i, n, r, 0, e);
            n += o, 0 !== (r -= o) && 0 !== (a = ee(i[n + r - 1], i, s, a, a - 1, e)) && (r <= a ? this.mergeLow(n, r, s, a) : this.mergeHigh(n, r, s, a));
        }, ne.prototype.mergeLow = function(t, e, i, n) {
            var r = this.compare, s = this.array, a = this.tmp, o = 0;
            for (o = 0; o < e; o++) a[o] = s[t + o];
            var c = 0, h = i, l = t;
            if (s[l++] = s[h++], 0 != --n) if (1 !== e) {
                for (var u = this.minGallop; ;) {
                    var _ = 0, d = 0, f = !1;
                    do {
                        if (r(s[h], a[c]) < 0) {
                            if (s[l++] = s[h++], d++, _ = 0, 0 == --n) {
                                f = !0;
                                break;
                            }
                        } else if (s[l++] = a[c++], _++, d = 0, 1 == --e) {
                            f = !0;
                            break;
                        }
                    } while ((_ | d) < u);
                    if (f) break;
                    do {
                        if (0 !== (_ = ie(s[h], a, c, e, 0, r))) {
                            for (o = 0; o < _; o++) s[l + o] = a[c + o];
                            if (l += _, c += _, (e -= _) <= 1) {
                                f = !0;
                                break;
                            }
                        }
                        if (s[l++] = s[h++], 0 == --n) {
                            f = !0;
                            break;
                        }
                        if (0 !== (d = ee(a[c], s, h, n, 0, r))) {
                            for (o = 0; o < d; o++) s[l + o] = s[h + o];
                            if (l += d, h += d, 0 === (n -= d)) {
                                f = !0;
                                break;
                            }
                        }
                        if (s[l++] = a[c++], 1 == --e) {
                            f = !0;
                            break;
                        }
                        u--;
                    } while (_ >= 7 || d >= 7);
                    if (f) break;
                    u < 0 && (u = 0), u += 2;
                }
                if (this.minGallop = u, u < 1 && (this.minGallop = 1), 1 === e) {
                    for (o = 0; o < n; o++) s[l + o] = s[h + o];
                    s[l + n] = a[c];
                } else {
                    if (0 === e) throw new Error("mergeLow preconditions were not respected");
                    for (o = 0; o < e; o++) s[l + o] = a[c + o];
                }
            } else {
                for (o = 0; o < n; o++) s[l + o] = s[h + o];
                s[l + n] = a[c];
            } else for (o = 0; o < e; o++) s[l + o] = a[c + o];
        }, ne.prototype.mergeHigh = function(t, e, i, n) {
            var r = this.compare, s = this.array, a = this.tmp, o = 0;
            for (o = 0; o < n; o++) a[o] = s[i + o];
            var c = t + e - 1, h = n - 1, l = i + n - 1, u = 0, _ = 0;
            if (s[l--] = s[c--], 0 != --e) if (1 !== n) {
                for (var d = this.minGallop; ;) {
                    var f = 0, p = 0, m = !1;
                    do {
                        if (r(a[h], s[c]) < 0) {
                            if (s[l--] = s[c--], f++, p = 0, 0 == --e) {
                                m = !0;
                                break;
                            }
                        } else if (s[l--] = a[h--], p++, f = 0, 1 == --n) {
                            m = !0;
                            break;
                        }
                    } while ((f | p) < d);
                    if (m) break;
                    do {
                        if (0 !== (f = e - ie(a[h], s, t, e, e - 1, r))) {
                            for (e -= f, _ = (l -= f) + 1, u = (c -= f) + 1, o = f - 1; o >= 0; o--) s[_ + o] = s[u + o];
                            if (0 === e) {
                                m = !0;
                                break;
                            }
                        }
                        if (s[l--] = a[h--], 1 == --n) {
                            m = !0;
                            break;
                        }
                        if (0 !== (p = n - ee(s[c], a, 0, n, n - 1, r))) {
                            for (n -= p, _ = (l -= p) + 1, u = (h -= p) + 1, o = 0; o < p; o++) s[_ + o] = a[u + o];
                            if (n <= 1) {
                                m = !0;
                                break;
                            }
                        }
                        if (s[l--] = s[c--], 0 == --e) {
                            m = !0;
                            break;
                        }
                        d--;
                    } while (f >= 7 || p >= 7);
                    if (m) break;
                    d < 0 && (d = 0), d += 2;
                }
                if (this.minGallop = d, d < 1 && (this.minGallop = 1), 1 === n) {
                    for (_ = (l -= e) + 1, u = (c -= e) + 1, o = e - 1; o >= 0; o--) s[_ + o] = s[u + o];
                    s[l] = a[h];
                } else {
                    if (0 === n) throw new Error("mergeHigh preconditions were not respected");
                    for (u = l - (n - 1), o = 0; o < n; o++) s[u + o] = a[o];
                }
            } else {
                for (_ = (l -= e) + 1, u = (c -= e) + 1, o = e - 1; o >= 0; o--) s[_ + o] = s[u + o];
                s[l] = a[h];
            } else for (u = l - (n - 1), o = 0; o < n; o++) s[u + o] = a[o];
        };
        var se = function(t) {
            this._count = 0, this._data = new Array(t);
        }, ae = {
            length: {
                configurable: !0
            },
            data: {
                configurable: !0
            }
        };
        se.prototype._resize = function(t) {
            if (t > this._data.length) for (var e = this._data.length; e < t; ++e) this._data[e] = void 0;
        }, ae.length.get = function() {
            return this._count;
        }, ae.data.get = function() {
            return this._data;
        }, se.prototype.reset = function() {
            for (var t = 0; t < this._count; ++t) this._data[t] = void 0;
            this._count = 0;
        }, se.prototype.push = function(t) {
            this._count >= this._data.length && this._resize(2 * this._data.length), this._data[this._count] = t, 
            ++this._count;
        }, se.prototype.pop = function() {
            --this._count, this._count < 0 && (this._count = 0);
            var t = this._data[this._count];
            return this._data[this._count] = void 0, t;
        }, se.prototype.fastRemove = function(t) {
            if (!(t >= this._count)) {
                var e = this._count - 1;
                this._data[t] = this._data[e], this._data[e] = void 0, this._count -= 1;
            }
        }, se.prototype.indexOf = function(t) {
            var e = this._data.indexOf(t);
            return e >= this._count ? -1 : e;
        }, se.prototype.sort = function(t) {
            return re(this._data, 0, this._count, t);
        }, Object.defineProperties(se.prototype, ae);
        var oe = function(t, e) {
            this._fn = t, this._idx = e - 1, this._frees = new Array(e);
            for (var i = 0; i < e; ++i) this._frees[i] = t();
        };
        oe.prototype._expand = function(t) {
            var e = this._frees;
            this._frees = new Array(t);
            for (var i = t - e.length, n = 0; n < i; ++n) this._frees[n] = this._fn();
            for (var r = i, s = 0; r < t; ++r, ++s) this._frees[r] = e[s];
            this._idx += i;
        }, oe.prototype.alloc = function() {
            this._idx < 0 && this._expand(Math.round(1.2 * this._frees.length) + 1);
            var t = this._frees[this._idx];
            return this._frees[this._idx] = null, --this._idx, t;
        }, oe.prototype.free = function(t) {
            ++this._idx, this._frees[this._idx] = t;
        };
        var ce = function(t, e) {
            this._fn = t, this._count = 0, this._head = null, this._tail = null, this._pool = new oe(t, e);
        }, he = {
            head: {
                configurable: !0
            },
            tail: {
                configurable: !0
            },
            length: {
                configurable: !0
            }
        };
        he.head.get = function() {
            return this._head;
        }, he.tail.get = function() {
            return this._tail;
        }, he.length.get = function() {
            return this._count;
        }, ce.prototype.add = function() {
            var t = this._pool.alloc();
            return this._tail ? (this._tail._next = t, t._prev = this._tail) : this._head = t, 
            this._tail = t, this._count += 1, t;
        }, ce.prototype.remove = function(t) {
            t._prev ? t._prev._next = t._next : this._head = t._next, t._next ? t._next._prev = t._prev : this._tail = t._prev, 
            t._next = null, t._prev = null, this._pool.free(t), this._count -= 1;
        }, ce.prototype.forEach = function(t, e) {
            var i = this._head;
            if (i) {
                e && (t = t.bind(e));
                for (var n = 0, r = i; i; ) r = i._next, t(i, n, this), i = r, ++n;
            }
        }, Object.defineProperties(ce.prototype, he);
        var le = function(t, e) {
            this._fn = t, this._count = 0, this._data = new Array(e);
            for (var i = 0; i < e; ++i) this._data[i] = t();
        }, ue = {
            length: {
                configurable: !0
            },
            data: {
                configurable: !0
            }
        };
        ue.length.get = function() {
            return this._count;
        }, ue.data.get = function() {
            return this._data;
        }, le.prototype.reset = function() {
            this._count = 0;
        }, le.prototype.resize = function(t) {
            if (t > this._data.length) for (var e = this._data.length; e < t; ++e) this._data[e] = this._fn();
        }, le.prototype.add = function() {
            return this._count >= this._data.length && this.resize(2 * this._data.length), this._data[this._count++];
        }, le.prototype.remove = function(t) {
            if (!(t >= this._count)) {
                var e = this._count - 1, i = this._data[t];
                this._data[t] = this._data[e], this._data[e] = i, this._count -= 1;
            }
        }, le.prototype.sort = function(t) {
            return re(this._data, 0, this._count, t);
        }, Object.defineProperties(le.prototype, ue);
        for (var _e = Array(8), de = 0; de < 8; ++de) _e[de] = [];
        var fe = function() {
            this._lights = new se(16), this._models = new se(16), this._cameras = new se(16), 
            this._debugCamera = null, this._views = [];
        };
        fe.prototype._add = function(t, e) {
            -1 === e._poolID && (t.push(e), e._poolID = t.length - 1);
        }, fe.prototype._remove = function(t, e) {
            -1 !== e._poolID && (t.data[t.length - 1]._poolID = e._poolID, t.fastRemove(e._poolID), 
            e._poolID = -1);
        }, fe.prototype.reset = function() {
            for (var t = 0; t < this._models.length; ++t) {
                this._models.data[t]._cullingMask = -1;
            }
        }, fe.prototype.setDebugCamera = function(t) {
            this._debugCamera = t;
        }, fe.prototype.getCameraCount = function() {
            return this._cameras.length;
        }, fe.prototype.getCamera = function(t) {
            return this._cameras.data[t];
        }, fe.prototype.addCamera = function(t) {
            this._add(this._cameras, t);
        }, fe.prototype.removeCamera = function(t) {
            this._remove(this._cameras, t);
        }, fe.prototype.getModelCount = function() {
            return this._models.length;
        }, fe.prototype.getModel = function(t) {
            return this._models.data[t];
        }, fe.prototype.addModel = function(t) {
            this._add(this._models, t);
        }, fe.prototype.removeModel = function(t) {
            this._remove(this._models, t);
        }, fe.prototype.getLightCount = function() {
            return this._lights.length;
        }, fe.prototype.getLight = function(t) {
            return this._lights.data[t];
        }, fe.prototype.addLight = function(t) {
            this._add(this._lights, t);
        }, fe.prototype.removeLight = function(t) {
            this._remove(this._lights, t);
        }, fe.prototype.addView = function(t) {
            -1 === this._views.indexOf(t) && this._views.push(t);
        }, fe.prototype.removeView = function(t) {
            var e = this._views.indexOf(t);
            -1 !== e && this._views.splice(e, 1);
        };
        var pe = 0;
        function me(t, e) {
            var i = {}, n = t;
            for (var r in e) Number.isInteger(e[r]) && (i[r] = e[r]);
            for (var s in i) {
                var a = new RegExp(s, "g");
                n = n.replace(a, i[s]);
            }
            return n;
        }
        function ve(t) {
            return t.replace(/#pragma for (\w+) in range\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]+?)#pragma endFor/g, function(t, e, i, n, r) {
                var s = "", a = parseInt(i), o = parseInt(n);
                (a.isNaN || o.isNaN) && console.error("Unroll For Loops Error: begin and end of range must be an int num.");
                for (var c = a; c < o; ++c) s += r.replace(new RegExp("{" + e + "}", "g"), c);
                return s;
            });
        }
        var ge = function(t, e, i) {
            void 0 === e && (e = []), void 0 === i && (i = {}), this._device = t, this._precision = "precision highp float;\n", 
            this._templates = {};
            for (var n = 0; n < e.length; ++n) {
                var r = e[n];
                this.define(r.name, r.vert, r.frag, r.defines);
            }
            this._chunks = {}, Object.assign(this._chunks, i), this._cache = {};
        };
        ge.prototype.define = function(t, e, i, n) {
            if (this._templates[t]) console.warn("Failed to define shader " + t + ": already exists."); else {
                for (var r = ++pe, s = 0, a = function(t) {
                    var e = n[t];
                    e._offset = s;
                    var i = 1;
                    void 0 !== e.min && void 0 !== e.max ? (i = Math.ceil(.5 * (e.max - e.min)), e._map = function(t) {
                        return t - this._min << e._offset;
                    }.bind(e)) : e._map = function(t) {
                        return t ? 1 << e._offset : 0;
                    }.bind(e), s += i, e._offset = s;
                }, o = 0; o < n.length; ++o) a(o);
                e = this._precision + e, i = this._precision + i, this._templates[t] = {
                    id: r,
                    name: t,
                    vert: e,
                    frag: i,
                    defines: n
                };
            }
        }, ge.prototype.getKey = function(t, e) {
            for (var i = this._templates[t], n = 0, r = 0; r < i.defines.length; ++r) {
                var s = i.defines[r], a = e[s.name];
                void 0 !== a && (n |= s._map(a));
            }
            return n << 8 | i.id;
        }, ge.prototype.getProgram = function(t, e) {
            var i = this.getKey(t, e), n = this._cache[i];
            if (n) return n;
            var r = this._templates[t], s = function(t) {
                var e = [];
                for (var i in t) !0 === t[i] && e.push("#define " + i);
                return e.join("\n");
            }(e) + "\n", a = me(r.vert, e);
            a = s + ve(a);
            var o = me(r.frag, e);
            return o = s + ve(o), (n = new Et.Program(this._device, {
                vert: a,
                frag: o
            })).link(), this._cache[i] = n, n;
        };
        var ye = b.create(), xe = B.create(), Ee = new le(function() {
            return {
                stage: null,
                items: null
            };
        }, 8), Te = new le(function() {
            return new Float32Array(2);
        }, 8), Ce = new le(function() {
            return new Float32Array(3);
        }, 8), Ae = new le(function() {
            return new Float32Array(4);
        }, 8), be = new le(function() {
            return new Float32Array(9);
        }, 8), we = new le(function() {
            return new Float32Array(16);
        }, 8), De = new le(function() {
            return new Float32Array(64);
        }, 8), Se = new le(function() {
            return new Int32Array(2);
        }, 8), Re = new le(function() {
            return new Int32Array(3);
        }, 8), Me = new le(function() {
            return new Int32Array(4);
        }, 8), Oe = new le(function() {
            return new Int32Array(64);
        }, 8), Le = {};
        Le[Y.PARAM_INT] = function(t) {
            return t;
        }, Le[Y.PARAM_INT2] = function(t) {
            return m.array(Se.add(), t);
        }, Le[Y.PARAM_INT3] = function(t) {
            return y.array(Re.add(), t);
        }, Le[Y.PARAM_INT4] = function(t) {
            return T.array(Me.add(), t);
        }, Le[Y.PARAM_FLOAT] = function(t) {
            return t;
        }, Le[Y.PARAM_FLOAT2] = function(t) {
            return m.array(Te.add(), t);
        }, Le[Y.PARAM_FLOAT3] = function(t) {
            return y.array(Ce.add(), t);
        }, Le[Y.PARAM_FLOAT4] = function(t) {
            return T.array(Ae.add(), t);
        }, Le[Y.PARAM_COLOR3] = function(t) {
            return U.array(Ce.add(), t);
        }, Le[Y.PARAM_COLOR4] = function(t) {
            return V.array(Ae.add(), t);
        }, Le[Y.PARAM_MAT2] = function(t) {
            return O.array(Ae.add(), t);
        }, Le[Y.PARAM_MAT3] = function(t) {
            return b.array(be.add(), t);
        }, Le[Y.PARAM_MAT4] = function(t) {
            return B.array(we.add(), t);
        };
        var Ie = {};
        Ie[Y.PARAM_INT] = {
            func: function(t) {
                for (var e = Oe.add(), i = 0; i < t.length; ++i) e[i] = t[i];
                return e;
            },
            size: 1
        }, Ie[Y.PARAM_INT2] = {
            func: function(t) {
                for (var e = Oe.add(), i = 0; i < t.length; ++i) e[2 * i] = t[i].x, e[2 * i + 1] = t[i].y;
                return e;
            },
            size: 2
        }, Ie[Y.PARAM_INT3] = {
            func: void 0,
            size: 3
        }, Ie[Y.PARAM_INT4] = {
            func: function(t) {
                for (var e = Oe.add(), i = 0; i < t.length; ++i) {
                    var n = t[i];
                    e[4 * i] = n.x, e[4 * i + 1] = n.y, e[4 * i + 2] = n.z, e[4 * i + 3] = n.w;
                }
                return e;
            },
            size: 4
        }, Ie[Y.PARAM_FLOAT] = {
            func: function(t) {
                for (var e = De.add(), i = 0; i < t.length; ++i) e[i] = t[i];
                return e;
            },
            size: 1
        }, Ie[Y.PARAM_FLOAT2] = {
            func: function(t) {
                for (var e = De.add(), i = 0; i < t.length; ++i) e[2 * i] = t[i].x, e[2 * i + 1] = t[i].y;
                return e;
            },
            size: 2
        }, Ie[Y.PARAM_FLOAT3] = {
            func: void 0,
            size: 3
        }, Ie[Y.PARAM_FLOAT4] = {
            func: function(t) {
                for (var e = De.add(), i = 0; i < t.length; ++i) {
                    var n = t[i];
                    e[4 * i] = n.x, e[4 * i + 1] = n.y, e[4 * i + 2] = n.z, e[4 * i + 3] = n.w;
                }
                return e;
            },
            size: 4
        }, Ie[Y.PARAM_COLOR3] = {
            func: void 0,
            size: 3
        }, Ie[Y.PARAM_COLOR4] = {
            func: function(t) {
                for (var e = De.add(), i = 0; i < t.length; ++i) {
                    var n = t[i];
                    e[4 * i] = n.r, e[4 * i + 1] = n.g, e[4 * i + 2] = n.b, e[4 * i + 3] = n.a;
                }
                return e;
            },
            size: 4
        }, Ie[Y.PARAM_MAT2] = {
            func: function(t) {
                for (var e = De.add(), i = 0; i < t.length; ++i) {
                    var n = t[i];
                    e[4 * i] = n.m00, e[4 * i + 1] = n.m01, e[4 * i + 2] = n.m02, e[4 * i + 3] = n.m03;
                }
                return e;
            },
            size: 4
        }, Ie[Y.PARAM_MAT3] = {
            func: void 0,
            size: 9
        }, Ie[Y.PARAM_MAT4] = {
            func: function(t) {
                for (var e = De.add(), i = 0; i < t.length; ++i) {
                    var n = t[i];
                    e[16 * i] = n.m00, e[16 * i + 1] = n.m01, e[16 * i + 2] = n.m02, e[16 * i + 3] = n.m03, 
                    e[16 * i + 4] = n.m04, e[16 * i + 5] = n.m05, e[16 * i + 6] = n.m06, e[16 * i + 7] = n.m07, 
                    e[16 * i + 8] = n.m08, e[16 * i + 9] = n.m09, e[16 * i + 10] = n.m10, e[16 * i + 11] = n.m11, 
                    e[16 * i + 12] = n.m12, e[16 * i + 13] = n.m13, e[16 * i + 14] = n.m14, e[16 * i + 15] = n.m15;
                }
                return e;
            },
            size: 16
        };
        var Fe = function(t, e) {
            var i;
            this._device = t, this._programLib = new ge(t, e.programTemplates, e.programChunks), 
            this._opts = e, this._type2defaultValue = ((i = {})[Y.PARAM_INT] = 0, i[Y.PARAM_INT2] = m.new(0, 0), 
            i[Y.PARAM_INT3] = y.new(0, 0, 0), i[Y.PARAM_INT4] = T.new(0, 0, 0, 0), i[Y.PARAM_FLOAT] = 0, 
            i[Y.PARAM_FLOAT2] = m.new(0, 0), i[Y.PARAM_FLOAT3] = y.new(0, 0, 0), i[Y.PARAM_FLOAT4] = T.new(0, 0, 0, 0), 
            i[Y.PARAM_COLOR3] = U.new(0, 0, 0), i[Y.PARAM_COLOR4] = V.new(0, 0, 0, 1), i[Y.PARAM_MAT2] = O.create(), 
            i[Y.PARAM_MAT3] = b.create(), i[Y.PARAM_MAT4] = B.create(), i[Y.PARAM_TEXTURE_2D] = e.defaultTexture, 
            i[Y.PARAM_TEXTURE_CUBE] = e.defaultTextureCube, i), this._stage2fn = {}, this._usedTextureUnits = 0, 
            this._viewPools = new le(function() {
                return new It();
            }, 8), this._drawItemsPools = new le(function() {
                return {
                    model: null,
                    node: null,
                    ia: null,
                    effect: null,
                    defines: null
                };
            }, 100), this._stageItemsPools = new le(function() {
                return new le(function() {
                    return {
                        model: null,
                        node: null,
                        ia: null,
                        effect: null,
                        defines: null,
                        technique: null,
                        sortKey: -1
                    };
                }, 100);
            }, 16);
        };
        Fe.prototype._resetTextuerUnit = function() {
            this._usedTextureUnits = 0;
        }, Fe.prototype._allocTextuerUnit = function() {
            var t = this._device, e = this._usedTextureUnits;
            return e >= t._caps.maxTextureUnits && console.warn("Trying to use " + e + " texture units while this GPU supports only " + t._caps.maxTextureUnits), 
            this._usedTextureUnits += 1, e;
        }, Fe.prototype._registerStage = function(t, e) {
            this._stage2fn[t] = e;
        }, Fe.prototype._reset = function() {
            this._viewPools.reset(), this._stageItemsPools.reset();
        }, Fe.prototype._requestView = function() {
            return this._viewPools.add();
        }, Fe.prototype._render = function(t, e) {
            var i = this._device;
            i.setFrameBuffer(t._framebuffer), i.setViewport(t._rect.x, t._rect.y, t._rect.w, t._rect.h);
            var n = {};
            t._clearFlags & Y.CLEAR_COLOR && (n.color = [ t._color.r, t._color.g, t._color.b, t._color.a ]), 
            t._clearFlags & Y.CLEAR_DEPTH && (n.depth = t._depth), t._clearFlags & Y.CLEAR_STENCIL && (n.stencil = t._stencil), 
            i.clear(n), this._drawItemsPools.reset();
            for (var r = 0; r < e._models.length; ++r) {
                var s = e._models.data[r];
                if (0 != (s._cullingMask & t._cullingMask)) for (var a = 0; a < s.drawItemCount; ++a) {
                    var o = this._drawItemsPools.add();
                    s.extractDrawItem(o, a);
                }
            }
            Ee.reset();
            for (var c = 0; c < t._stages.length; ++c) {
                var h = t._stages[c], l = this._stageItemsPools.add();
                l.reset();
                for (var u = 0; u < this._drawItemsPools.length; ++u) {
                    var _ = this._drawItemsPools.data[u], d = _.effect.getTechnique(h);
                    if (d) {
                        var f = l.add();
                        f.model = _.model, f.node = _.node, f.ia = _.ia, f.effect = _.effect, f.defines = _.defines, 
                        f.technique = d, f.sortKey = -1;
                    }
                }
                var p = Ee.add();
                p.stage = h, p.items = l;
            }
            for (var m = 0; m < Ee.length; ++m) {
                var v = Ee.data[m];
                (0, this._stage2fn[v.stage])(t, v.items);
            }
        }, Fe.prototype._draw = function(t) {
            var e = this._device, i = this._programLib, n = t.node, r = t.ia, s = t.effect, a = t.technique, o = t.defines;
            Te.reset(), Ce.reset(), Ae.reset(), be.reset(), we.reset(), De.reset(), Se.reset(), 
            Re.reset(), Me.reset(), Oe.reset(), n.getWorldMatrix(xe), e.setUniform("model", B.array(we.add(), xe));
            var c = b.invert(ye, b.fromMat4(ye, xe));
            c && (b.transpose(ye, c), e.setUniform("normalMatrix", b.array(be.add(), ye)));
            for (var h = 0; h < a._parameters.length; ++h) {
                var l = a._parameters[h], u = s.getProperty(l.name);
                if (void 0 === u && (u = l.val), void 0 === u && (u = this._type2defaultValue[l.type]), 
                void 0 !== u) if (l.type === Y.PARAM_TEXTURE_2D || l.type === Y.PARAM_TEXTURE_CUBE) if (void 0 !== l.size) {
                    if (l.size !== u.length) {
                        console.error("The length of texture array (" + u.length + ") is not corrent(expect " + l.size + ").");
                        continue;
                    }
                    for (var _ = Oe.add(), d = 0; d < u.length; ++d) _[d] = this._allocTextuerUnit();
                    e.setTextureArray(l.name, u, _);
                } else e.setTexture(l.name, u, this._allocTextuerUnit()); else {
                    var f = void 0;
                    if (void 0 !== l.size) {
                        var p = Ie[l.type];
                        if (void 0 === p.func) {
                            console.error("Uniform array of color3/int3/float3/mat3 can not be supportted!");
                            continue;
                        }
                        if (l.size * p.size > 64) {
                            console.error("Uniform array is too long!");
                            continue;
                        }
                        f = p.func(u);
                    } else {
                        f = (0, Le[l.type])(u);
                    }
                    e.setUniform(l.name, f);
                } else console.warn("Failed to set technique property " + l.name + ", value not found.");
            }
            for (var m = 0; m < a._passes.length; ++m) {
                var v = a._passes[m], g = r.getPrimitiveCount();
                e.setVertexBuffer(0, r._vertexBuffer), r._indexBuffer && e.setIndexBuffer(r._indexBuffer), 
                e.setPrimitiveType(r._primitiveType);
                var y = i.getProgram(v._programName, o);
                e.setProgram(y), e.setCullMode(v._cullMode), v._blend && (e.enableBlend(), e.setBlendFuncSep(v._blendSrc, v._blendDst, v._blendSrcAlpha, v._blendDstAlpha), 
                e.setBlendEqSep(v._blendEq, v._blendAlphaEq), e.setBlendColor32(v._blendColor)), 
                v._depthTest && (e.enableDepthTest(), e.setDepthFunc(v._depthFunc)), v._depthWrite && e.enableDepthWrite(), 
                v._stencilTest && (e.enableStencilTest(), e.setStencilFuncFront(v._stencilFuncFront, v._stencilRefFront, v._stencilMaskFront), 
                e.setStencilOpFront(v._stencilFailOpFront, v._stencilZFailOpFront, v._stencilZPassOpFront, v._stencilWriteMaskFront), 
                e.setStencilFuncBack(v._stencilFuncBack, v._stencilRefBack, v._stencilMaskBack), 
                e.setStencilOpBack(v._stencilFailOpBack, v._stencilZFailOpBack, v._stencilZPassOpBack, v._stencilWriteMaskBack)), 
                e.draw(r._start, g), this._resetTextuerUnit();
            }
        };
        var Pe = {
            addStage: wt.addStage,
            createIA: function(t, e) {
                if (!e.positions) return console.error("The data must have positions field"), null;
                for (var i = [], n = e.positions.length / 3, r = 0; r < n; ++r) i.push(e.positions[3 * r], e.positions[3 * r + 1], e.positions[3 * r + 2]), 
                e.normals && i.push(e.normals[3 * r], e.normals[3 * r + 1], e.normals[3 * r + 2]), 
                e.uvs && i.push(e.uvs[2 * r], e.uvs[2 * r + 1]);
                var s = [];
                s.push({
                    name: Et.ATTR_POSITION,
                    type: Et.ATTR_TYPE_FLOAT32,
                    num: 3
                }), e.normals && s.push({
                    name: Et.ATTR_NORMAL,
                    type: Et.ATTR_TYPE_FLOAT32,
                    num: 3
                }), e.uvs && s.push({
                    name: Et.ATTR_UV0,
                    type: Et.ATTR_TYPE_FLOAT32,
                    num: 2
                });
                var a = new Et.VertexBuffer(t, new Et.VertexFormat(s), Et.USAGE_STATIC, new Float32Array(i), n), o = null;
                return e.indices && (o = new Et.IndexBuffer(t, Et.INDEX_FMT_UINT16, Et.USAGE_STATIC, new Uint16Array(e.indices), e.indices.length)), 
                new Tt(a, o);
            },
            Pass: Ct,
            Technique: St,
            Effect: Mt,
            InputAssembler: Tt,
            View: It,
            Light: zt,
            Camera: jt,
            Model: Xt,
            Scene: fe,
            Base: Fe,
            ProgramLib: ge
        };
        Object.assign(Pe, Y);
        var Ne, Be = new Float32Array(16), ze = new Float32Array(16), ke = new Float32Array(16), Ue = function(t) {
            function e(e, i) {
                t.call(this, e, i), this._registerStage("transparent", this._transparentStage.bind(this));
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, 
            e.prototype.reset = function() {
                this._reset();
            }, e.prototype.render = function(t) {
                this._reset(), t._cameras.sort(function(t, e) {
                    return t._depth > e._depth ? 1 : t._depth < e._depth ? -1 : 0;
                });
                for (var e = 0; e < t._cameras.length; ++e) {
                    var i = t._cameras.data[e];
                    i._poolID = e, this.renderCamera(i, t);
                }
            }, e.prototype.renderCamera = function(t, e) {
                var i = this._device._gl.canvas, n = t.view, r = t.dirty;
                if (n || (n = this._requestView(), r = !0), r) {
                    var s = i.width, a = i.height;
                    t._framebuffer && (s = t._framebuffer._width, a = t._framebuffer._height), t.extractView(n, s, a);
                }
                this._render(n, e);
            }, e.prototype._transparentStage = function(t, e) {
                this._device.setUniform("view", B.array(Be, t._matView)), this._device.setUniform("proj", B.array(ze, t._matProj)), 
                this._device.setUniform("viewProj", B.array(ke, t._matViewProj));
                for (var i = 0; i < e.length; ++i) {
                    var n = e.data[i];
                    this._draw(n);
                }
            }, e;
        }(Pe.Base), He = {
            chunks: {},
            templates: [ {
                name: "gray_sprite",
                vert: "\n \nuniform mat4 viewProj;\nattribute vec3 a_position;\nattribute mediump vec2 a_uv0;\nvarying mediump vec2 uv0;\n#ifndef useColor\nattribute lowp vec4 a_color;\nvarying lowp vec4 v_fragmentColor;\n#endif\nvoid main () {\n  vec4 pos = viewProj * vec4(a_position, 1);\n  gl_Position = pos;\n  uv0 = a_uv0;\n #ifndef useColor\n  v_fragmentColor = a_color;\n #endif\n}",
                frag: "\n \nuniform sampler2D texture;\nvarying mediump vec2 uv0;\n#ifdef useColor\n  uniform lowp vec4 color;\n#else\n  varying lowp vec4 v_fragmentColor;\n#endif\nvoid main () {\n  #ifdef useColor\n    vec4 o = color;\n  #else\n    vec4 o = v_fragmentColor;\n  #endif\n  vec4 c = o * texture2D(texture, uv0);\n  float gray = 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;\n  gl_FragColor = vec4(gray, gray, gray, c.a);\n}",
                defines: [ {
                    name: "useColor"
                } ]
            }, {
                name: "sprite",
                vert: "\n \nuniform mat4 viewProj;\n#ifdef use2DPos\nattribute vec2 a_position;\n#else\nattribute vec3 a_position;\n#endif\nattribute lowp vec4 a_color;\n#ifdef useModel\n  uniform mat4 model;\n#endif\n#ifdef useTexture\n  attribute mediump vec2 a_uv0;\n  varying mediump vec2 uv0;\n#endif\n#ifndef useColor\nvarying lowp vec4 v_fragmentColor;\n#endif\nvoid main () {\n  mat4 mvp;\n  #ifdef useModel\n    mvp = viewProj * model;\n  #else\n    mvp = viewProj;\n  #endif\n  #ifdef use2DPos\n  vec4 pos = mvp * vec4(a_position, 0, 1);\n  #else\n  vec4 pos = mvp * vec4(a_position, 1);\n  #endif\n  #ifndef useColor\n  v_fragmentColor = a_color;\n  #endif\n  #ifdef useTexture\n    uv0 = a_uv0;\n  #endif\n  gl_Position = pos;\n}",
                frag: "\n \n#ifdef useTexture\n  uniform sampler2D texture;\n  varying mediump vec2 uv0;\n#endif\n#ifdef alphaTest\n  uniform lowp float alphaThreshold;\n#endif\n#ifdef useColor\n  uniform lowp vec4 color;\n#else\n  varying lowp vec4 v_fragmentColor;\n#endif\nvoid main () {\n  #ifdef useColor\n    vec4 o = color;\n  #else\n    vec4 o = v_fragmentColor;\n  #endif\n  #ifdef useTexture\n    o *= texture2D(texture, uv0);\n  #endif\n  #ifdef alphaTest\n    if (o.a <= alphaThreshold)\n      discard;\n  #endif\n  gl_FragColor = o;\n}",
                defines: [ {
                    name: "useTexture"
                }, {
                    name: "useModel"
                }, {
                    name: "alphaTest"
                }, {
                    name: "use2DPos"
                }, {
                    name: "useColor"
                } ]
            }, {
                name: "spine",
                vert: "\n \nuniform mat4 viewProj;\n\n#ifdef use2DPos\n  attribute vec2 a_position;\n#else\n  attribute vec3 a_position;\n#endif\n\nattribute lowp vec4 a_color;\n#ifdef useTint\n  attribute lowp vec4 a_color0;\n#endif\n\n#ifdef useModel\n  uniform mat4 model;\n#endif\n\nattribute mediump vec2 a_uv0;\nvarying mediump vec2 uv0;\n\nvarying lowp vec4 v_light;\n#ifdef useTint\n  varying lowp vec4 v_dark;\n#endif\n\nvoid main () {\n  mat4 mvp;\n  #ifdef useModel\n    mvp = viewProj * model;\n  #else\n    mvp = viewProj;\n  #endif\n\n  #ifdef use2DPos\n  vec4 pos = mvp * vec4(a_position, 0, 1);\n  #else\n  vec4 pos = mvp * vec4(a_position, 1);\n  #endif\n\n  v_light = a_color;\n  #ifdef useTint\n    v_dark = a_color0;\n  #endif\n\n  uv0 = a_uv0;\n\n  gl_Position = pos;\n}",
                frag: "\n \nuniform sampler2D texture;\nvarying mediump vec2 uv0;\n\n#ifdef alphaTest\n  uniform lowp float alphaThreshold;\n#endif\n\nvarying lowp vec4 v_light;\n#ifdef useTint\n  varying lowp vec4 v_dark;\n#endif\n\nvoid main () {\n  vec4 texColor = texture2D(texture, uv0);\n  vec4 finalColor;\n\n  #ifdef useTint\n    finalColor.a = v_light.a * texColor.a;\n    finalColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;\n  #else\n    finalColor = texColor * v_light;\n  #endif\n\n  #ifdef alphaTest\n    if (finalColor.a <= alphaThreshold)\n      discard;\n  #endif\n\n  gl_FragColor = finalColor;\n}",
                defines: [ {
                    name: "useModel"
                }, {
                    name: "alphaTest"
                }, {
                    name: "use2DPos"
                }, {
                    name: "useTint"
                } ]
            } ]
        }, Ge = function() {
            this.material = null, this.vertexCount = 0, this.indiceCount = 0;
        }, Ve = new oe(function() {
            return {
                x: 0,
                y: 0,
                u: 0,
                v: 0,
                color: 0
            };
        }, 128), We = function(t) {
            function e() {
                t.call(this), this._data = [], this._indices = [], this._pivotX = 0, this._pivotY = 0, 
                this._width = 0, this._height = 0, this.uvDirty = !0, this.vertDirty = !0;
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var i = {
                type: {
                    configurable: !0
                },
                dataLength: {
                    configurable: !0
                }
            };
            return i.type.get = function() {
                return e.type;
            }, i.dataLength.get = function() {
                return this._data.length;
            }, i.dataLength.set = function(t) {
                var e = this._data;
                if (e.length !== t) {
                    for (var i = t; i < e.length; i++) Ve.free(e[i]);
                    for (var n = e.length; n < t; n++) e[n] = Ve.alloc();
                    e.length = t;
                }
            }, e.prototype.updateSizeNPivot = function(t, e, i, n) {
                t === this._width && e === this._height && i === this._pivotX && n === this._pivotY || (this._width = t, 
                this._height = e, this._pivotX = i, this._pivotY = n, this.vertDirty = !0);
            }, e.alloc = function() {
                return Ne.alloc();
            }, e.free = function(t) {
                if (t instanceof e) {
                    for (var i = t.length - 1; i > 0; i--) Ve.free(t._data[i]);
                    t._data.length = 0, t._indices.length = 0, t.material = null, t.uvDirty = !0, t.vertDirty = !0, 
                    t.vertexCount = 0, t.indiceCount = 0, Ne.free(t);
                }
            }, Object.defineProperties(e.prototype, i), e;
        }(Ge);
        We.type = "RenderData", Ne = new oe(function() {
            return new We();
        }, 32);
        var je = function(t) {
            function e() {
                t.call(this), this.ia = null;
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var i = {
                type: {
                    configurable: !0
                }
            };
            return i.type.get = function() {
                return e.type;
            }, Object.defineProperties(e.prototype, i), e;
        }(Ge);
        je.type = "IARenderData";
        var Ye = function(t) {
            void 0 === t && (t = !0), this._loaded = !1, this._persist = t;
        };
        Ye.prototype.unload = function() {
            this._loaded = !1;
        }, Ye.prototype.reload = function() {};
        var Xe = function(t) {
            function e(e) {
                void 0 === e && (e = !0), t.call(this, e), this._texture = null;
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, 
            e.prototype.getImpl = function() {
                return this._texture;
            }, e.prototype.getId = function() {}, e.prototype.destroy = function() {
                this._texture && this._texture.destroy();
            }, e;
        }(Ye);
        function qe(t) {
            var e = t._programName + t._cullMode;
            return t._blend && (e += t._blendEq + t._blendAlphaEq + t._blendSrc + t._blendDst + t._blendSrcAlpha + t._blendDstAlpha + t._blendColor), 
            t._depthTest && (e += t._depthWrite + t._depthFunc), t._stencilTest && (e += t._stencilFuncFront + t._stencilRefFront + t._stencilMaskFront + t._stencilFailOpFront + t._stencilZFailOpFront + t._stencilZPassOpFront + t._stencilWriteMaskFront + t._stencilFuncBack + t._stencilRefBack + t._stencilMaskBack + t._stencilFailOpBack + t._stencilZFailOpBack + t._stencilZPassOpBack + t._stencilWriteMaskBack), 
            e;
        }
        var Ze = function(t) {
            function e(e) {
                void 0 === e && (e = !1), t.call(this, e), this._effect = null, this._texIds = {}, 
                this._hash = "";
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var i = {
                hash: {
                    configurable: !0
                }
            };
            return i.hash.get = function() {
                return this._hash;
            }, e.prototype.updateHash = function(t) {
                this._hash = t || function(t) {
                    var e, i, n, r, s, a, o = t._effect, c = "";
                    if (o) for (c += function(t) {
                        for (var e = "", i = 0; i < t.length; i++) e += t[i].name + t[i].value;
                        return e;
                    }(o._defines), e = 0; e < o._techniques.length; e++) {
                        for (c += (n = o._techniques[e]).stageIDs, i = 0; i < n.passes.length; i++) c += qe(n.passes[i]);
                        for (i = 0; i < n._parameters.length; i++) if (a = (r = n._parameters[i]).name, 
                        s = o._properties[a]) switch (r.type) {
                          case Pe.PARAM_INT:
                          case Pe.PARAM_FLOAT:
                            c += s + ";";
                            break;

                          case Pe.PARAM_INT2:
                          case Pe.PARAM_FLOAT2:
                            c += s.x + "," + s.y + ";";
                            break;

                          case Pe.PARAM_INT4:
                          case Pe.PARAM_FLOAT4:
                            c += s.x + "," + s.y + "," + s.z + "," + s.w + ";";
                            break;

                          case Pe.PARAM_COLOR4:
                            c += s.r + "," + s.g + "," + s.b + "," + s.a + ";";
                            break;

                          case Pe.PARAM_MAT2:
                            c += s.m00 + "," + s.m01 + "," + s.m02 + "," + s.m03 + ";";
                            break;

                          case Pe.PARAM_TEXTURE_2D:
                          case Pe.PARAM_TEXTURE_CUBE:
                            c += t._texIds[a] + ";";
                            break;

                          case Pe.PARAM_INT3:
                          case Pe.PARAM_FLOAT3:
                          case Pe.PARAM_COLOR3:
                          case Pe.PARAM_MAT3:
                          case Pe.PARAM_MAT4:
                            c += JSON.stringify(s) + ";";
                        }
                    }
                    return c ? function(t, e) {
                        for (var i, n = t.length, r = e ^ n, s = 0; n >= 4; ) i = 1540483477 * (65535 & (i = 255 & t.charCodeAt(s) | (255 & t.charCodeAt(++s)) << 8 | (255 & t.charCodeAt(++s)) << 16 | (255 & t.charCodeAt(++s)) << 24)) + ((1540483477 * (i >>> 16) & 65535) << 16), 
                        r = 1540483477 * (65535 & r) + ((1540483477 * (r >>> 16) & 65535) << 16) ^ (i = 1540483477 * (65535 & (i ^= i >>> 24)) + ((1540483477 * (i >>> 16) & 65535) << 16)), 
                        n -= 4, ++s;
                        switch (n) {
                          case 3:
                            r ^= (255 & t.charCodeAt(s + 2)) << 16;

                          case 2:
                            r ^= (255 & t.charCodeAt(s + 1)) << 8;

                          case 1:
                            r = 1540483477 * (65535 & (r ^= 255 & t.charCodeAt(s))) + ((1540483477 * (r >>> 16) & 65535) << 16);
                        }
                        return r = 1540483477 * (65535 & (r ^= r >>> 13)) + ((1540483477 * (r >>> 16) & 65535) << 16), 
                        (r ^= r >>> 15) >>> 0;
                    }(c, 666) : c;
                }(this);
            }, Object.defineProperties(e.prototype, i), e;
        }(Ye), Ke = function(t) {
            function e() {
                t.call(this, !1);
                var e = new Pe.Pass("sprite");
                e.setDepth(!1, !1), e.setCullMode(Et.CULL_NONE), e.setBlend(Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA, Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA);
                var i = new Pe.Technique([ "transparent" ], [ {
                    name: "texture",
                    type: Pe.PARAM_TEXTURE_2D
                }, {
                    name: "color",
                    type: Pe.PARAM_COLOR4
                } ], [ e ]);
                this._color = {
                    r: 1,
                    g: 1,
                    b: 1,
                    a: 1
                }, this._effect = new Pe.Effect([ i ], {
                    color: this._color
                }, [ {
                    name: "useTexture",
                    value: !0
                }, {
                    name: "useModel",
                    value: !1
                }, {
                    name: "alphaTest",
                    value: !1
                }, {
                    name: "use2DPos",
                    value: !0
                }, {
                    name: "useColor",
                    value: !0
                } ]), this._mainTech = i, this._texture = null;
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var i = {
                effect: {
                    configurable: !0
                },
                useTexture: {
                    configurable: !0
                },
                useModel: {
                    configurable: !0
                },
                use2DPos: {
                    configurable: !0
                },
                useColor: {
                    configurable: !0
                },
                texture: {
                    configurable: !0
                },
                color: {
                    configurable: !0
                }
            };
            return i.effect.get = function() {
                return this._effect;
            }, i.useTexture.get = function() {
                return this._effect.getDefine("useTexture");
            }, i.useTexture.set = function(t) {
                this._effect.define("useTexture", t);
            }, i.useModel.get = function() {
                return this._effect.getDefine("useModel");
            }, i.useModel.set = function(t) {
                this._effect.define("useModel", t);
            }, i.use2DPos.get = function() {
                return this._effect.getDefine("use2DPos");
            }, i.use2DPos.set = function(t) {
                this._effect.define("use2DPos", t);
            }, i.useColor.get = function() {
                return this._effect.getDefine("useColor");
            }, i.useColor.set = function(t) {
                this._effect.define("useColor", t);
            }, i.texture.get = function() {
                return this._texture;
            }, i.texture.set = function(t) {
                this._texture !== t && (this._texture = t, this._effect.setProperty("texture", t.getImpl()), 
                this._texIds.texture = t.getId());
            }, i.color.get = function() {
                return this._color;
            }, i.color.set = function(t) {
                var e = this._color;
                e.r = t.r / 255, e.g = t.g / 255, e.b = t.b / 255, e.a = t.a / 255, this._effect.setProperty("color", e);
            }, e.prototype.clone = function() {
                var t = new e();
                return t._mainTech.copy(this._mainTech), t.texture = this.texture, t.useTexture = this.useTexture, 
                t.useModel = this.useModel, t.use2DPos = this.use2DPos, t.useColor = this.useColor, 
                t.updateHash(), t;
            }, Object.defineProperties(e.prototype, i), e;
        }(Ze), Je = function(t) {
            function e() {
                t.call(this, !1);
                var e = new Pe.Pass("spine");
                e.setDepth(!1, !1), e.setCullMode(Et.CULL_NONE), e.setBlend(Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA, Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA);
                var i = new Pe.Technique([ "transparent" ], [ {
                    name: "texture",
                    type: Pe.PARAM_TEXTURE_2D
                } ], [ e ]);
                this._effect = new Pe.Effect([ i ], {}, [ {
                    name: "useModel",
                    value: !0
                }, {
                    name: "alphaTest",
                    value: !1
                }, {
                    name: "use2DPos",
                    value: !0
                }, {
                    name: "useTint",
                    value: !1
                } ]), this._mainTech = i, this._texture = null;
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var i = {
                effect: {
                    configurable: !0
                },
                useModel: {
                    configurable: !0
                },
                use2DPos: {
                    configurable: !0
                },
                useTint: {
                    configurable: !1
                },
                texture: {
                    configurable: !0
                }
            };
            return i.effect.get = function() {
                return this._effect;
            }, i.useModel.get = function() {
                return this._effect.getDefine("useModel");
            }, i.useModel.set = function(t) {
                this._effect.define("useModel", t);
            }, i.use2DPos.get = function() {
                return this._effect.getDefine("use2DPos");
            }, i.use2DPos.set = function(t) {
                this._effect.define("use2DPos", t);
            }, i.useTint.get = function() {
                return this._effect.getDefine("useTint");
            }, i.useTint.set = function(t) {
                this._effect.define("useTint", t);
            }, i.texture.get = function() {
                return this._texture;
            }, i.texture.set = function(t) {
                this._texture !== t && (this._texture = t, this._effect.setProperty("texture", t.getImpl()), 
                this._texIds.texture = t.getId());
            }, e.prototype.clone = function() {
                var t = new e();
                return t._mainTech.copy(this._mainTech), t.texture = this.texture, t.useModel = this.useModel, 
                t.use2DPos = this.use2DPos, t.useTint = this.useTint, t._hash = this._hash, t;
            }, Object.defineProperties(e.prototype, i), e;
        }(Ze), Qe = function(t) {
            function e() {
                t.call(this, !1);
                var e = new Pe.Pass("gray_sprite");
                e.setDepth(!1, !1), e.setCullMode(Et.CULL_NONE), e.setBlend(Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA, Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA);
                var i = new Pe.Technique([ "transparent" ], [ {
                    name: "texture",
                    type: Pe.PARAM_TEXTURE_2D
                }, {
                    name: "color",
                    type: Pe.PARAM_COLOR4
                } ], [ e ]);
                this._color = {
                    r: 1,
                    g: 1,
                    b: 1,
                    a: 1
                }, this._effect = new Pe.Effect([ i ], {
                    color: this._color
                }, [ {
                    name: "useColor",
                    value: !1
                } ]), this._mainTech = i, this._texture = null;
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var i = {
                effect: {
                    configurable: !0
                },
                texture: {
                    configurable: !0
                },
                color: {
                    configurable: !0
                }
            };
            return i.effect.get = function() {
                return this._effect;
            }, i.texture.get = function() {
                return this._texture;
            }, i.texture.set = function(t) {
                this._texture !== t && (this._texture = t, this._effect.setProperty("texture", t.getImpl()), 
                this._texIds.texture = t.getId());
            }, i.color.get = function() {
                return this._color;
            }, i.color.set = function(t) {
                var e = this._color;
                e.r = t.r / 255, e.g = t.g / 255, e.b = t.b / 255, e.a = t.a / 255, this._effect.setProperty("color", e);
            }, e.prototype.clone = function() {
                var t = new e();
                return t._mainTech.copy(this._mainTech), t.texture = this.texture, t.color = this.color, 
                t.updateHash(), t;
            }, Object.defineProperties(e.prototype, i), e;
        }(Ze), $e = function(t) {
            function e() {
                t.call(this, !1), this._pass = new Pe.Pass("sprite"), this._pass.setDepth(!1, !1), 
                this._pass.setCullMode(Et.CULL_NONE), this._pass.setBlend(Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA, Et.BLEND_FUNC_ADD, Et.BLEND_SRC_ALPHA, Et.BLEND_ONE_MINUS_SRC_ALPHA);
                var e = new Pe.Technique([ "transparent" ], [ {
                    name: "texture",
                    type: Pe.PARAM_TEXTURE_2D
                }, {
                    name: "alphaThreshold",
                    type: Pe.PARAM_FLOAT
                }, {
                    name: "color",
                    type: Pe.PARAM_COLOR4
                } ], [ this._pass ]);
                this._effect = new Pe.Effect([ e ], {
                    color: {
                        r: 1,
                        g: 1,
                        b: 1,
                        a: 1
                    }
                }, [ {
                    name: "useTexture",
                    value: !0
                }, {
                    name: "useModel",
                    value: !1
                }, {
                    name: "alphaTest",
                    value: !0
                }, {
                    name: "use2DPos",
                    value: !0
                }, {
                    name: "useColor",
                    value: !0
                } ]), this._mainTech = e, this._texture = null;
            }
            t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
            var i = {
                effect: {
                    configurable: !0
                },
                useTexture: {
                    configurable: !0
                },
                useModel: {
                    configurable: !0
                },
                useColor: {
                    configurable: !0
                },
                texture: {
                    configurable: !0
                },
                alphaThreshold: {
                    configurable: !0
                }
            };
            return i.effect.get = function() {
                return this._effect;
            }, i.useTexture.get = function() {
                this._effect.getDefine("useTexture");
            }, i.useTexture.set = function(t) {
                this._effect.define("useTexture", t);
            }, i.useModel.get = function() {
                this._effect.getDefine("useModel");
            }, i.useModel.set = function(t) {
                this._effect.define("useModel", t);
            }, i.useColor.get = function() {
                this._effect.getDefine("useColor");
            }, i.useColor.set = function(t) {
                this._effect.define("useColor", t);
            }, i.texture.get = function() {
                return this._texture;
            }, i.texture.set = function(t) {
                this._texture !== t && (this._texture = t, this._effect.setProperty("texture", t.getImpl()), 
                this._texIds.texture = t.getId());
            }, i.alphaThreshold.get = function() {
                return this._effect.getProperty("alphaThreshold");
            }, i.alphaThreshold.set = function(t) {
                this._effect.setProperty("alphaThreshold", t);
            }, e.prototype.clone = function() {
                var t = new e();
                return t._mainTech.copy(this._mainTech), t.useTexture = this.useTexture, t.useModel = this.useModel, 
                t.useColor = this.useColor, t.texture = this.texture, t.alphaThreshold = this.alphaThreshold, 
                t.updateHash(), t;
            }, Object.defineProperties(e.prototype, i), e;
        }(Ze), ti = function(t) {
            var e;
            try {
                e = t.getContext("2d");
            } catch (t) {
                return void console.error(t);
            }
            this._canvas = t, this._ctx = e, this._caps = {}, this._stats = {
                drawcalls: 0
            }, this._vx = this._vy = this._vw = this._vh = 0, this._sx = this._sy = this._sw = this._sh = 0;
        };
        ti.prototype._restoreTexture = function(t) {}, ti.prototype.setViewport = function(t, e, i, n) {
            this._vx === t && this._vy === e && this._vw === i && this._vh === n || (this._vx = t, 
            this._vy = e, this._vw = i, this._vh = n);
        }, ti.prototype.setScissor = function(t, e, i, n) {
            this._sx === t && this._sy === e && this._sw === i && this._sh === n || (this._sx = t, 
            this._sy = e, this._sw = i, this._sh = n);
        }, ti.prototype.clear = function(t) {
            var e = this._ctx;
            e.clearRect(this._vx, this._vy, this._vw, this._vh), !t || 0 === t[0] && 0 === t[1] && 0 === t[2] || (e.fillStyle = "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")", 
            e.globalAlpha = t[3], e.fillRect(this._vx, this._vy, this._vw, this._vh));
        };
        var ei = function(t, e) {
            this._device = t, this._width = 4, this._height = 4, this._image = null, e && (void 0 !== e.width && (this._width = e.width), 
            void 0 !== e.height && (this._height = e.height), this.updateImage(e));
        };
        ei.prototype.update = function(t) {
            this.updateImage(t);
        }, ei.prototype.updateImage = function(t) {
            if (t.images && t.images[0]) {
                var e = t.images[0];
                e && e !== this._image && (this._image = e);
            }
        }, ei.prototype.destroy = function() {
            this._image = null;
        };
        var ii = {
            Device: ti,
            Texture2D: ei
        }, ni = Pe.Scene, ri = Pe.Camera, si = Pe.View, ai = Et.Texture2D, oi = Et.Device, ci = Pe.Model, hi = Pe.InputAssembler;
        Pe.addStage("transparent");
        var li = {
            Device: oi,
            ForwardRenderer: Ue,
            Texture2D: ai,
            canvas: ii,
            Scene: ni,
            Camera: ri,
            View: si,
            Model: ci,
            RenderData: We,
            IARenderData: je,
            InputAssembler: hi,
            Asset: Ye,
            TextureAsset: Xe,
            Material: Ze,
            SpineMaterial: Je,
            SpriteMaterial: Ke,
            GraySpriteMaterial: Qe,
            StencilMaterial: $e,
            shaders: He,
            RecyclePool: le,
            Pool: oe,
            math: j,
            renderer: Pe,
            gfx: Et
        };
        e.exports = li;
    }, {} ],
    125: [ function(t, e, i) {
        var n = 0, r = 1, s = 2, a = r | s, o = 4, c = 8, h = 16, l = 32, u = 64, _ = 128, d = 256, f = 512, p = 1024, m = void 0;
        function v() {
            this._func = T, this._next = null;
        }
        var g = v.prototype;
        g._doNothing = function() {}, g._localTransform = function(t) {
            t._updateLocalMatrix(), t._renderFlag &= ~r, this._next._func(t);
        }, g._worldTransform = function(t) {
            m.worldMatDirty++;
            var e = t._matrix, i = t._position;
            e.m12 = i.x, e.m13 = i.y, function(t, e, i) {
                var n = e.m00, r = e.m01, s = e.m04, a = e.m05, o = e.m12, c = e.m13, h = i.m00, l = i.m01, u = i.m04, _ = i.m05, d = i.m12, f = i.m13;
                0 !== l || 0 !== u ? (t.m00 = n * h + r * u, t.m01 = n * l + r * _, t.m04 = s * h + a * u, 
                t.m05 = s * l + a * _, t.m12 = h * o + u * c + d, t.m13 = l * o + _ * c + f) : (t.m00 = n * h, 
                t.m01 = r * _, t.m04 = s * h, t.m05 = a * _, t.m12 = h * o + d, t.m13 = _ * c + f);
            }(t._worldMatrix, e, t._parent._worldMatrix), t._renderFlag &= ~s, this._next._func(t), 
            m.worldMatDirty--;
        }, g._color = function(t) {
            var e = t._renderComponent;
            e ? e._updateColor() : t._renderFlag &= ~h, this._next._func(t);
        }, g._opacity = function(t) {
            m.parentOpacityDirty++, t._renderFlag &= ~c, this._next._func(t), m.parentOpacityDirty--;
        }, g._updateRenderData = function(t) {
            var e = t._renderComponent;
            e._assembler.updateRenderData(e), t._renderFlag &= ~o, this._next._func(t);
        }, g._render = function(t) {
            var e = t._renderComponent;
            m._commitComp(e, e._assembler, t._cullingMask), this._next._func(t);
        }, g._customIARender = function(t) {
            var e = t._renderComponent;
            m._commitIA(e, e._assembler, t._cullingMask), this._next._func(t);
        }, g._children = function(t) {
            for (var e = m, i = e.parentOpacity, n = e.parentOpacity *= t._opacity / 255, r = (e.worldMatDirty ? s : 0) | (e.parentOpacityDirty ? h : 0), a = t._children, o = 0, c = a.length; o < c; o++) {
                var l = a[o];
                if (l._renderFlag |= r, l._activeInHierarchy && 0 !== l._opacity) {
                    var u = l._color._val;
                    l._color._fastSetA(l._opacity * n), x[l._renderFlag]._func(l), l._color._val = u;
                }
            }
            e.parentOpacity = i, this._next._func(t);
        }, g._postUpdateRenderData = function(t) {
            var e = t._renderComponent;
            e._postAssembler && e._postAssembler.updateRenderData(e), t._renderFlag &= ~d, this._next._func(t);
        }, g._postRender = function(t) {
            var e = t._renderComponent;
            m._commitComp(e, e._postAssembler, t._cullingMask), this._next._func(t);
        };
        var y = new v();
        y._func = y._doNothing, y._next = y;
        var x = {};
        function E(t, e) {
            var i = new v();
            switch (i._next = e || y, t) {
              case n:
                i._func = i._doNothing;
                break;

              case r:
                i._func = i._localTransform;
                break;

              case s:
                i._func = i._worldTransform;
                break;

              case h:
                i._func = i._color;
                break;

              case c:
                i._func = i._opacity;
                break;

              case o:
                i._func = i._updateRenderData;
                break;

              case l:
                i._func = i._render;
                break;

              case u:
                i._func = i._customIARender;
                break;

              case _:
                i._func = i._children;
                break;

              case d:
                i._func = i._postUpdateRenderData;
                break;

              case f:
                i._func = i._postRender;
            }
            return i;
        }
        function T(t) {
            var e = t._renderFlag;
            (x[e] = function(t) {
                for (var e = null, i = p; i > 0; ) i & t && (e = E(i, e)), i >>= 1;
                return e;
            }(e))._func(t);
        }
        v.flows = x, v.createFlow = E, v.visit = function(t) {
            m.reset(), m.walking = !0, 1 << t.groupIndex, t._renderFlag & s ? (m.worldMatDirty++, 
            t._calculWorldMatrix(), t._renderFlag &= ~s, x[t._renderFlag]._func(t), m.worldMatDirty--) : x[t._renderFlag]._func(t), 
            m.terminate();
        }, v.init = function(t) {
            m = t, x[0] = y;
            for (var e = 1; e < p; e++) x[e] = new v();
        }, v.FLAG_DONOTHING = n, v.FLAG_LOCAL_TRANSFORM = r, v.FLAG_WORLD_TRANSFORM = s, 
        v.FLAG_TRANSFORM = a, v.FLAG_COLOR = h, v.FLAG_OPACITY = c, v.FLAG_UPDATE_RENDER_DATA = o, 
        v.FLAG_RENDER = l, v.FLAG_CUSTOM_IA_RENDER = u, v.FLAG_CHILDREN = _, v.FLAG_POST_UPDATE_RENDER_DATA = d, 
        v.FLAG_POST_RENDER = f, v.FLAG_FINAL = p, e.exports = cc.RenderFlow = v;
    }, {} ],
    126: [ function(t, e, i) {
        var n = t("../../../platform/CCMacro"), r = t("../../../components/CCLabel").Overflow, s = t("../../../utils/text-utils"), a = function() {
            this._u = 0, this._v = 0, this._width = 0, this._height = 0, this._offsetX = 0, 
            this._offsetY = 0, this._textureID = 0, this._validDefinition = !1, this._xAdvance = 0;
        };
        cc.FontAtlas = function(t) {
            this._letterDefinitions = {};
        }, cc.FontAtlas.prototype = {
            constructor: cc.FontAtlas,
            addLetterDefinitions: function(t, e) {
                this._letterDefinitions[t] = e;
            },
            cloneLetterDefinition: function() {
                var t = {};
                for (var e in this._letterDefinitions) {
                    var i = new a();
                    cc.js.mixin(i, this._letterDefinitions[e]), t[e] = i;
                }
                return t;
            },
            assignLetterDefinitions: function(t) {
                for (var e in this._letterDefinitions) {
                    var i = t[e], n = this._letterDefinitions[e];
                    cc.js.mixin(n, i);
                }
            },
            scaleFontLetterDefinition: function(t) {
                for (var e in this._letterDefinitions) {
                    var i = this._letterDefinitions[e];
                    i._width *= t, i._height *= t, i._offsetX *= t, i._offsetY *= t, i._xAdvance *= t;
                }
            },
            getLetterDefinitionForChar: function(t) {
                return this._letterDefinitions.hasOwnProperty(t.charCodeAt(0)) ? this._letterDefinitions[t.charCodeAt(0)] : null;
            }
        };
        var o = function() {
            this._char = "", this._valid = !0, this._positionX = 0, this._positionY = 0, this._lineIndex = 0;
        }, c = cc.rect(), h = null, l = [], u = [], _ = [], d = [], f = cc.size(), p = null, m = null, v = 0, g = 0, y = 0, x = 0, E = 0, T = 1, C = null, A = "", b = 0, w = 0, D = cc.size(), S = 0, R = 0, M = 0, O = 0, L = 0, I = !1, F = 0, P = 0, N = 0;
        e.exports = {
            updateRenderData: function(t) {
                t._renderData.vertDirty && h !== t && (h = t, this._updateProperties(), this._updateContent(), 
                h._actualFontSize = b, h.node.setContentSize(D), h._renderData.vertDirty = h._renderData.uvDirty = !1, 
                h = null, this._resetProperties());
            },
            _updateFontScale: function() {
                T = b / w;
            },
            _updateProperties: function() {
                var t = h.font;
                if (C = t.spriteFrame, m = t._fntConfig, !(p = h._fontAtlas)) {
                    p = new cc.FontAtlas(m);
                    var e = m.fontDefDictionary;
                    for (var i in e) {
                        var n = new a(), s = e[i].rect;
                        n._offsetX = e[i].xOffset, n._offsetY = e[i].yOffset, n._width = s.width, n._height = s.height, 
                        n._u = s.x, n._v = s.y, n._textureID = 0, n._validDefinition = !0, n._xAdvance = e[i].xAdvance, 
                        p.addLetterDefinitions(i, n);
                    }
                    h._fontAtlas = p;
                }
                A = h.string.toString(), b = h.fontSize, w = m.fontSize, D.width = h.node._contentSize.width, 
                D.height = h.node._contentSize.height, S = h.horizontalAlign, R = h.verticalAlign, 
                M = h.spacingX, L = h.overflow, O = h._lineHeight, I = L !== r.NONE && (L === r.RESIZE_HEIGHT || h.enableWrapText), 
                this._setupBMFontOverflowMetrics();
            },
            _resetProperties: function() {
                p = null, m = null, C = null;
            },
            _updateContent: function() {
                this._updateFontScale(), this._computeHorizontalKerningForText(), this._alignText();
            },
            _computeHorizontalKerningForText: function() {
                for (var t = A, e = t.length, i = m.kerningDict, n = l, r = -1, s = 0; s < e; ++s) {
                    var a = t.charCodeAt(s), o = i[r << 16 | 65535 & a] || 0;
                    n[s] = s < e - 1 ? o : 0, r = a;
                }
            },
            _multilineTextWrap: function(t) {
                var e = A.length, i = 0, n = 0, r = 0, a = 0, o = 0, c = 0, h = 0, u = null, d = cc.v2(0, 0);
                this._updateFontScale();
                for (var f = p._letterDefinitions, y = 0; y < e; ) {
                    var C = A.charAt(y);
                    if ("\n" !== C) {
                        for (var b = t(A, y, e), w = c, S = h, R = o, L = n, B = !1, z = 0; z < b; ++z) {
                            var k = y + z;
                            if ("\r" !== (C = A.charAt(k))) if (u = p.getLetterDefinitionForChar(C)) {
                                var U = L + u._offsetX * T;
                                if (I && N > 0 && n > 0 && U + u._width * T > N && !s.isUnicodeSpace(C)) {
                                    _.push(o), o = 0, i++, n = 0, r -= O * T + 0, B = !0;
                                    break;
                                }
                                d.x = U, d.y = r - u._offsetY * T, this._recordLetterInfo(f, d, C, k, i), k + 1 < l.length && k < e - 1 && (L += l[k + 1]), 
                                L += u._xAdvance * T + M, R = d.x + u._width * T, w < d.y && (w = d.y), S > d.y - u._height * T && (S = d.y - u._height * T);
                            } else this._recordPlaceholderInfo(k, C), console.log("Can't find letter definition in texture atlas " + m.atlasName + " for letter:" + C); else this._recordPlaceholderInfo(k, C);
                        }
                        B || (n = L, o = R, c < w && (c = w), h > S && (h = S), a < o && (a = o), y += b);
                    } else _.push(o), o = 0, i++, n = 0, r -= O * T + 0, this._recordPlaceholderInfo(y, C), 
                    y++;
                }
                return _.push(o), g = (v = i + 1) * O * T, v > 1 && (g += 0 * (v - 1)), D.width = F, 
                D.height = P, F <= 0 && (D.width = parseFloat(a.toFixed(2))), P <= 0 && (D.height = parseFloat(g.toFixed(2))), 
                x = D.height, E = 0, c > 0 && (x = D.height + c), h < -g && (E = g + h), !0;
            },
            _getFirstCharLen: function() {
                return 1;
            },
            _getFirstWordLen: function(t, e, i) {
                var n = t.charAt(e);
                if (s.isUnicodeCJK(n) || "\n" === n || s.isUnicodeSpace(n)) return 1;
                var r = 1, a = p.getLetterDefinitionForChar(n);
                if (!a) return r;
                for (var o = a._xAdvance * T + M, c = e + 1; c < i && (n = t.charAt(c), a = p.getLetterDefinitionForChar(n)); ++c) {
                    if (o + a._offsetX * T + a._width * T > N && !s.isUnicodeSpace(n) && N > 0) return r;
                    if (o += a._xAdvance * T + M, "\n" === n || s.isUnicodeSpace(n) || s.isUnicodeCJK(n)) break;
                    r++;
                }
                return r;
            },
            _multilineTextWrapByWord: function() {
                return this._multilineTextWrap(this._getFirstWordLen);
            },
            _multilineTextWrapByChar: function() {
                return this._multilineTextWrap(this._getFirstCharLen);
            },
            _recordPlaceholderInfo: function(t, e) {
                if (t >= u.length) {
                    var i = new o();
                    u.push(i);
                }
                u[t]._char = e, u[t]._valid = !1;
            },
            _recordLetterInfo: function(t, e, i, n, r) {
                if (n >= u.length) {
                    var s = new o();
                    u.push(s);
                }
                i = i.charCodeAt(0), u[n]._lineIndex = r, u[n]._char = i, u[n]._valid = t[i]._validDefinition, 
                u[n]._positionX = e.x, u[n]._positionY = e.y;
            },
            _alignText: function() {
                g = 0, _.length = 0, this._multilineTextWrapByWord(), this._computeAlignmentOffset(), 
                L === r.SHRINK && b > 0 && this._isVerticalClamp() && this._shrinkLabelToContentSize(this._isVerticalClamp), 
                this._updateQuads() || L === r.SHRINK && this._shrinkLabelToContentSize(this._isHorizontalClamp);
            },
            _scaleFontSizeDown: function(t) {
                var e = !0;
                t || (t = .1, e = !1), b = t, e && this._updateContent();
            },
            _shrinkLabelToContentSize: function(t) {
                for (var e = b, i = O, n = p, r = 0, s = n.cloneLetterDefinition(), a = !0; t(); ) {
                    var o = e - ++r;
                    if (a = !1, o <= 0) break;
                    var c = o / e;
                    n.assignLetterDefinitions(s), n.scaleFontLetterDefinition(c), O = i * c, this._multilineTextWrapByWord(), 
                    this._computeAlignmentOffset();
                }
                O = i, n.assignLetterDefinitions(s), a || e - r >= 0 && this._scaleFontSizeDown(e - r);
            },
            _isVerticalClamp: function() {
                return g > D.height;
            },
            _isHorizontalClamp: function() {
                for (var t = p._letterDefinitions, e = !1, i = 0, n = A.length; i < n; ++i) {
                    var r = u[i];
                    if (r._valid) {
                        var s = t[r._char], a = r._positionX + s._width / 2 * T, o = r._lineIndex;
                        if (F > 0) if (I) {
                            if (_[o] > D.width && (a > D.width || a < 0)) {
                                e = !0;
                                break;
                            }
                        } else if (a > D.width) {
                            e = !0;
                            break;
                        }
                    }
                }
                return e;
            },
            _isHorizontalClamped: function(t, e) {
                var i = _[e], n = t > D.width || t < 0;
                return I ? i > D.width && n : n;
            },
            _updateQuads: function() {
                var t = p._letterDefinitions, e = C._texture, i = h.node, n = h._renderData;
                n.dataLength = n.vertexCount = n.indiceCount = 0;
                for (var s = D, a = i._anchorPoint.x * s.width, o = i._anchorPoint.y * s.height, l = !0, _ = 0, f = A.length; _ < f; ++_) {
                    var m = u[_];
                    if (m._valid) {
                        var v = t[m._char];
                        c.height = v._height, c.width = v._width, c.x = v._u, c.y = v._v;
                        var g = m._positionY + y;
                        if (P > 0) {
                            if (g > x) {
                                var b = g - x;
                                c.y += b, c.height -= b, g -= b;
                            }
                            g - v._height * T < E && (c.height = g < E ? 0 : g - E);
                        }
                        var w = m._lineIndex, S = m._positionX + v._width / 2 * T + d[w];
                        if (F > 0 && this._isHorizontalClamped(S, w)) if (L === r.CLAMP) c.width = 0; else if (L === r.SHRINK) {
                            if (D.width > v._width) {
                                l = !1;
                                break;
                            }
                            c.width = 0;
                        }
                        if (c.height > 0 && c.width > 0) {
                            var R = C.isRotated(), M = C._originalSize, O = C._rect, I = C._offset, N = I.x + (M.width - O.width) / 2, B = I.y - (M.height - O.height) / 2;
                            if (R) {
                                var z = c.x;
                                c.x = O.x + O.height - c.y - c.height - B, c.y = z + O.y - N, c.y < 0 && (c.height = c.height + B);
                            } else c.x += O.x - N, c.y += O.y + B;
                            var k = m._positionX + d[m._lineIndex];
                            this.appendQuad(n, e, c, R, k - a, g - o, T);
                        }
                    }
                }
                return l;
            },
            appendQuad: function(t, e, i, n, r, s, a) {},
            _computeAlignmentOffset: function() {
                switch (d.length = 0, S) {
                  case n.TextAlignment.LEFT:
                    for (var t = 0; t < v; ++t) d.push(0);
                    break;

                  case n.TextAlignment.CENTER:
                    for (var e = 0, i = _.length; e < i; e++) d.push((D.width - _[e]) / 2);
                    break;

                  case n.TextAlignment.RIGHT:
                    for (var r = 0, s = _.length; r < s; r++) d.push(D.width - _[r]);
                }
                switch (R) {
                  case n.VerticalTextAlignment.TOP:
                    y = D.height;
                    break;

                  case n.VerticalTextAlignment.CENTER:
                    y = (D.height + g) / 2;
                    break;

                  case n.VerticalTextAlignment.BOTTOM:
                    y = g;
                }
            },
            _setupBMFontOverflowMetrics: function() {
                var t = D.width, e = D.height;
                L === r.RESIZE_HEIGHT && (e = 0), L === r.NONE && (t = 0, e = 0), F = t, P = e, 
                f.width = t, f.height = e, N = t;
            }
        };
    }, {
        "../../../components/CCLabel": 32,
        "../../../platform/CCMacro": 87,
        "../../../utils/text-utils": 166
    } ],
    127: [ function(t, e, i) {
        function n() {
            this._rect = null, this.uv = [], this._texture = null, this._original = null;
        }
        n.prototype = {
            constructor: n,
            getRect: function() {
                return cc.rect(this._rect);
            },
            setRect: function(t) {
                this._rect = t, this._texture && this._calculateUV();
            },
            _setDynamicAtlasFrame: function(t) {
                t && (this._original = {
                    _texture: this._texture,
                    _x: this._rect.x,
                    _y: this._rect.y
                }, this._texture = t.texture, this._rect.x = t.x, this._rect.y = t.y, this._calculateUV());
            },
            _resetDynamicAtlasFrame: function() {
                this._original && (this._rect.x = this._original._x, this._rect.y = this._original._y, 
                this._texture = this._original._texture, this._original = null, this._calculateUV());
            },
            _refreshTexture: function(t) {
                this._texture = t, this._rect = cc.rect(0, 0, t.width, t.height), this._calculateUV();
            },
            _calculateUV: function() {
                var t = this._rect, e = this._texture, i = this.uv, n = e.width, r = e.height, s = 0 === n ? 0 : t.x / n, a = 0 === n ? 0 : (t.x + t.width) / n, o = 0 === r ? 0 : (t.y + t.height) / r, c = 0 === r ? 0 : t.y / r;
                i[0] = s, i[1] = o, i[2] = a, i[3] = o, i[4] = s, i[5] = c, i[6] = a, i[7] = c;
            }
        }, e.exports = n;
    }, {} ],
    128: [ function(t, e, i) {
        var n = t("../../../platform/CCMacro"), r = t("../../../components/CCLabel"), s = t("../../../components/CCLabelOutline"), a = t("../../../utils/text-utils"), o = t("../../../components/CCComponent"), c = t("../../../assets/CCRenderTexture"), h = cc.js.isChildClassOf(s, o), l = r.Overflow, u = cc.Color.WHITE, _ = 2, d = function() {
            this.char = "", this.valid = !0, this.x = 0, this.y = 0, this.line = 0, this.hash = "";
        }, f = function() {
            this.u = 0, this.v = 0, this.w = 0, this.h = 0, this.texture = null, this.offsetX = 0, 
            this.offsetY = 0, this.valid = !1, this.xAdvance = 0;
        };
        function p(t, e) {
            this._texture = null, this._labelInfo = e, this._char = t, this._hash = null, this._data = null, 
            this._canvas = null, this._context = null, this._width = 0, this._height = 0, this._hash = t.charCodeAt(0) + e.hash;
        }
        function m(t, e) {
            var i = new c();
            i.initWithSize(t, e), i.update(), this._texture = i, this._x = _, this._y = _, this._nexty = _, 
            this._width = t, this._height = e, this._letterDefinitions = {}, cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
        }
        p.prototype = {
            constructor: p,
            updateRenderData: function() {
                this._updateProperties(), this._updateTexture();
            },
            _updateProperties: function() {
                this._texture = new cc.Texture2D(), this._data = r._canvasPool.get(), this._canvas = this._data.canvas, 
                this._context = this._data.context, this._context.font = this._labelInfo.fontDesc;
                var t = a.safeMeasureText(this._context, this._char);
                this._width = parseFloat(t.toFixed(2)) + 2 * this._labelInfo.margin, this._height = this._labelInfo.lineHeight, 
                this._canvas.width !== this._width && (this._canvas.width = this._width), this._canvas.height !== this._height && (this._canvas.height = this._height), 
                this._texture.initWithElement(this._canvas);
            },
            _updateTexture: function() {
                var t = this._context, e = this._labelInfo, i = this._canvas.width, n = this._canvas.height;
                t.textAlign = "center", t.textBaseline = "middle", t.clearRect(0, 0, i, n), t.fillStyle = "rgba(255, 255, 255, 0.005)", 
                t.fillRect(0, 0, i, n), t.font = e.fontDesc;
                var r = i / 2, s = n / 2, a = e.color;
                if (t.lineJoin = "round", t.fillStyle = "rgba(" + a.r + ", " + a.g + ", " + a.b + ", 1)", 
                e.isOutlined) {
                    var o = e.out || u;
                    t.strokeStyle = "rgba(" + o.r + ", " + o.g + ", " + o.b + ", " + o.a / 255 + ")", 
                    t.lineWidth = 2 * e.margin, t.strokeText(this._char, r, s);
                }
                t.fillText(this._char, r, s), this._texture.handleLoadedTexture();
            },
            destroy: function() {
                this._texture.destroy(), this._texture = null, r._canvasPool.put(this._data);
            }
        }, cc.js.mixin(m.prototype, {
            insertLetterTexture: function(t) {
                var e = t._texture, i = e.width, n = e.height;
                if (this._x + i + _ > this._width && (this._x = _, this._y = this._nexty), this._y + n > this._nexty && (this._nexty = this._y + n + _), 
                this._nexty > this._height) return null;
                this._texture.drawTextureAt(e, this._x, this._y), this._dirty = !0;
                var r = new f();
                return r.u = this._x, r.v = this._y, r.texture = this._texture, r.valid = !0, r.w = t._width, 
                r.h = t._height, r.xAdvance = t._width, this._x += i + _, this._letterDefinitions[t._hash] = r, 
                r;
            },
            update: function() {
                this._dirty && (this._texture.update(), this._dirty = !1);
            },
            reset: function() {
                this._x = _, this._y = _, this._nexty = _;
                for (var t = this._letterDefinitions, e = 0, i = t.length; e < i; e++) {
                    var n = t[e];
                    n.isValid && n.destroy();
                }
                this._letterDefinitions = {};
            },
            destroy: function() {
                this.reset(), this._texture.destroy();
            },
            beforeSceneLoad: function() {
                this.destroy();
                var t = new c();
                t.initWithSize(this._width, this._height), t.update(), this._texture = t;
            },
            getLetter: function(t) {
                return this._letterDefinitions[t];
            },
            addLetterDefinitions: function(t, e) {
                this._letterDefinitions[t] = e;
            },
            cloneLetterDefinition: function() {
                var t = {};
                for (var e in this._letterDefinitions) {
                    var i = new f();
                    cc.js.mixin(i, this._letterDefinitions[e]), t[e] = i;
                }
                return t;
            },
            assignLetterDefinitions: function(t) {
                for (var e in this._letterDefinitions) {
                    var i = t[e], n = this._letterDefinitions[e];
                    cc.js.mixin(n, i);
                }
            },
            scaleFontLetterDefinition: function(t) {
                for (var e in this._letterDefinitions) {
                    var i = this._letterDefinitions[e];
                    i.w *= t, i.h *= t, i.offsetX *= t, i.offsetY *= t, i.xAdvance *= t;
                }
            },
            getLetterDefinitionForChar: function(t, e) {
                var i = t.charCodeAt(0) + e.hash, n = this._letterDefinitions[i];
                if (!n) {
                    var r = new p(t, e);
                    r.updateRenderData(), n = this.insertLetterTexture(r), r.destroy();
                }
                return n;
            }
        });
        var v = cc.rect(), g = null, y = [], x = [], E = [], T = [], C = cc.size(), A = null, b = 0, w = 0, D = 0, S = 0, R = 0, M = 1, O = "", L = 0, I = 0, F = cc.size(), P = 0, N = 0, B = 0, z = 0, k = 0, U = !1, H = 0, G = 0, V = 0, W = "", j = !1, Y = {
            fontSize: 0,
            lineHeight: 0,
            hash: "",
            fontFamily: "",
            fontDesc: "Arial",
            hAlign: 0,
            vAlign: 0,
            color: u,
            isOutlined: !1,
            out: u,
            margin: 0
        };
        e.exports = {
            _getAssemblerData: function() {
                return A || (A = new m(2048, 2048)), A._texture;
            },
            updateRenderData: function(t) {
                t._renderData.vertDirty && g !== t && (g = t, this._updateFontFamily(t), Y.fontFamily = W, 
                this._updateProperties(), Y.fontDesc = this._getFontDesc(), this._updateContent(), 
                g._actualFontSize = L, g.node.setContentSize(F), g._renderData.vertDirty = g._renderData.uvDirty = !1, 
                g = null, this._resetProperties());
            },
            _updateFontScale: function() {
                M = L / I;
            },
            _updateProperties: function() {
                O = g.string.toString(), L = g.fontSize, I = L, F.width = g.node._contentSize.width, 
                F.height = g.node._contentSize.height, P = g.horizontalAlign, N = g.verticalAlign, 
                B = g.spacingX, k = g.overflow, z = g._lineHeight, j = g._isBold, U = k !== l.NONE && (k === l.RESIZE_HEIGHT || g.enableWrapText);
                var t = h && g.getComponent(s);
                t && t.enabled ? (Y.isOutlined = !0, Y.margin = t.width, Y.out = t.color, Y.out.a = t.color.a * g.node.color.a / 255) : (Y.isOutlined = !1, 
                Y.margin = 0), Y.lineHeight = z, Y.fontSize = L, Y.fontFamily = W, Y.color = g.node.color, 
                Y.hash = this._computeHash(Y), this._setupBMFontOverflowMetrics();
            },
            _updateFontFamily: function(t) {
                t.useSystemFont ? W = t.fontFamily : t.font ? t.font._nativeAsset ? W = t.font._nativeAsset : (W = cc.loader.getRes(t.font.nativeUrl)) || cc.loader.load(t.font.nativeUrl, function(e, i) {
                    W = i || "Arial", t.font._nativeAsset = i, t._updateRenderData(!0);
                }) : W = "Arial";
            },
            _computeHash: function(t) {
                var e = t.color.toHEX("#rrggbb"), i = "";
                return t.isOutlined && (i = t.out.toHEX("#rrggbb")), "" + t.fontSize + t.fontFamily + e + i;
            },
            _getFontDesc: function() {
                var t = L.toString() + "px ";
                return t += W, j && (t = "bold " + t), t;
            },
            _resetProperties: function() {},
            _updateContent: function() {
                this._updateFontScale(), this._alignText();
            },
            _computeHorizontalKerningForText: function() {
                for (var t = O, e = t.length, i = null.kerningDict, n = y, r = -1, s = 0; s < e; ++s) {
                    var a = t.charCodeAt(s), o = i[r << 16 | 65535 & a] || 0;
                    n[s] = s < e - 1 ? o : 0, r = a;
                }
            },
            _multilineTextWrap: function(t) {
                var e = O.length, i = 0, n = 0, r = 0, s = 0, o = 0, c = 0, h = 0, l = null, u = cc.v2(0, 0);
                this._updateFontScale();
                for (var _ = 0; _ < e; ) {
                    var d = O.charAt(_);
                    if ("\n" !== d) {
                        for (var f = t(O, _, e), p = c, m = h, v = o, g = n, x = !1, T = 0; T < f; ++T) {
                            var C = _ + T;
                            if ("\r" !== (d = O.charAt(C))) if (l = A.getLetterDefinitionForChar(d, Y)) {
                                var D = g + l.offsetX * M;
                                if (U && V > 0 && n > 0 && D + l.w * M > V && !a.isUnicodeSpace(d)) {
                                    E.push(o), o = 0, i++, n = 0, r -= z * M + 0, x = !0;
                                    break;
                                }
                                u.x = D, u.y = r - l.offsetY * M, this._recordLetterInfo(u, d, C, i), C + 1 < y.length && C < e - 1 && (g += y[C + 1]), 
                                g += l.xAdvance * M + B, v = u.x + l.w * M, p < u.y && (p = u.y), m > u.y - l.h * M && (m = u.y - l.h * M);
                            } else this._recordPlaceholderInfo(C, d); else this._recordPlaceholderInfo(C, d);
                        }
                        x || (n = g, o = v, c < p && (c = p), h > m && (h = m), s < o && (s = o), _ += f);
                    } else E.push(o), o = 0, i++, n = 0, r -= z * M + 0, this._recordPlaceholderInfo(_, d), 
                    _++;
                }
                return E.push(o), w = (b = i + 1) * z * M, b > 1 && (w += 0 * (b - 1)), F.width = H, 
                F.height = G, H <= 0 && (F.width = parseFloat(s.toFixed(2))), G <= 0 && (F.height = parseFloat(w.toFixed(2))), 
                S = F.height, R = 0, c > 0 && (S = F.height + c), h < -w && (R = w + h), !0;
            },
            _getFirstCharLen: function() {
                return 1;
            },
            _getFirstWordLen: function(t, e, i) {
                var n = t.charAt(e);
                if (a.isUnicodeCJK(n) || "\n" === n || a.isUnicodeSpace(n)) return 1;
                var r = 1, s = A.getLetterDefinitionForChar(n, Y);
                if (!s) return r;
                for (var o = s.xAdvance * M + B, c = e + 1; c < i && (n = t.charAt(c), s = A.getLetterDefinitionForChar(n, Y)); ++c) {
                    if (o + s.offsetX * M + s.w * M > V && !a.isUnicodeSpace(n) && V > 0) return r;
                    if (o += s.xAdvance * M + B, "\n" === n || a.isUnicodeSpace(n) || a.isUnicodeCJK(n)) break;
                    r++;
                }
                return r;
            },
            _multilineTextWrapByWord: function() {
                return this._multilineTextWrap(this._getFirstWordLen);
            },
            _multilineTextWrapByChar: function() {
                return this._multilineTextWrap(this._getFirstCharLen);
            },
            _recordPlaceholderInfo: function(t, e) {
                if (t >= x.length) {
                    var i = new d();
                    x.push(i);
                }
                x[t].char = e, x[t].hash = e.charCodeAt(0) + Y.hash, x[t].valid = !1;
            },
            _recordLetterInfo: function(t, e, i, n) {
                if (i >= x.length) {
                    var r = new d();
                    x.push(r);
                }
                var s = e.charCodeAt(0) + Y.hash;
                x[i].line = n, x[i].char = e, x[i].hash = s, x[i].valid = A.getLetter(s).valid, 
                x[i].x = t.x, x[i].y = t.y;
            },
            _alignText: function() {
                w = 0, E.length = 0, this._multilineTextWrapByWord(), this._computeAlignmentOffset(), 
                this._updateQuads();
            },
            _scaleFontSizeDown: function(t) {
                var e = !0;
                t || (t = .1, e = !1), L = t, e && this._updateContent();
            },
            _isVerticalClamp: function() {
                return w > F.height;
            },
            _isHorizontalClamp: function() {
                for (var t = !1, e = 0, i = O.length; e < i; ++e) {
                    var n = x[e];
                    if (n.valid) {
                        var r = A.getLetter(n.hash), s = n.x + r.w / 2 * M, a = n.line;
                        if (H > 0) if (U) {
                            if (E[a] > F.width && (s > F.width || s < 0)) {
                                t = !0;
                                break;
                            }
                        } else if (s > F.width) {
                            t = !0;
                            break;
                        }
                    }
                }
                return t;
            },
            _isHorizontalClamped: function(t, e) {
                var i = E[e], n = t > F.width || t < 0;
                return U ? i > F.width && n : n;
            },
            _updateQuads: function() {
                var t = A._texture, e = g.node, i = g._renderData;
                i.dataLength = i.vertexCount = i.indiceCount = 0;
                for (var n = F, r = e._anchorPoint.x * n.width, s = e._anchorPoint.y * n.height, a = !0, o = 0, c = O.length; o < c; ++o) {
                    var h = x[o];
                    if (h.valid) {
                        var u = A.getLetter(h.hash);
                        v.height = u.h, v.width = u.w, v.x = u.u, v.y = u.v;
                        var _ = h.y + D;
                        if (G > 0) {
                            if (_ > S) {
                                var d = _ - S;
                                v.y += d, v.height -= d, _ -= d;
                            }
                            _ - u.h * M < R && (v.height = _ < R ? 0 : _ - R);
                        }
                        var f = h.line, p = h.x + u.w / 2 * M + T[f];
                        if (H > 0 && this._isHorizontalClamped(p, f)) if (k === l.CLAMP) v.width = 0; else if (k === l.SHRINK) {
                            if (F.width > u.w) {
                                a = !1;
                                break;
                            }
                            v.width = 0;
                        }
                        if (v.height > 0 && v.width > 0) {
                            var m = h.x + T[h.line];
                            this.appendQuad(i, t, v, !1, m - r, _ - s, M);
                        }
                    }
                }
                return a;
            },
            appendQuad: function(t, e, i, n, r, s, a) {},
            _computeAlignmentOffset: function() {
                switch (T.length = 0, P) {
                  case n.TextAlignment.LEFT:
                    for (var t = 0; t < b; ++t) T.push(0);
                    break;

                  case n.TextAlignment.CENTER:
                    for (var e = 0, i = E.length; e < i; e++) T.push((F.width - E[e]) / 2);
                    break;

                  case n.TextAlignment.RIGHT:
                    for (var r = 0, s = E.length; r < s; r++) T.push(F.width - E[r]);
                }
                switch (N) {
                  case n.VerticalTextAlignment.TOP:
                    D = F.height;
                    break;

                  case n.VerticalTextAlignment.CENTER:
                    D = (F.height + w) / 2;
                    break;

                  case n.VerticalTextAlignment.BOTTOM:
                    D = w;
                }
            },
            _setupBMFontOverflowMetrics: function() {
                var t = F.width, e = F.height;
                k === l.RESIZE_HEIGHT && (e = 0), k === l.NONE && (t = 0, e = 0), H = t, G = e, 
                C.width = t, C.height = e, V = t;
            }
        };
    }, {
        "../../../assets/CCRenderTexture": void 0,
        "../../../components/CCComponent": 30,
        "../../../components/CCLabel": 32,
        "../../../components/CCLabelOutline": void 0,
        "../../../platform/CCMacro": 87,
        "../../../utils/text-utils": 166
    } ],
    129: [ function(t, e, i) {
        var n = t("../../../platform/CCMacro"), r = t("../../../utils/text-utils"), s = t("../../../components/CCComponent"), a = t("../../../components/CCLabel"), o = t("../../../components/CCLabelOutline"), c = a.Overflow, h = cc.Color.WHITE, l = cc.js.isChildClassOf(o, s), u = null, _ = null, d = null, f = "", p = "", m = 0, v = 0, g = [], y = cc.size(), x = 0, E = 0, T = 0, C = null, A = "", b = c.NONE, w = !1, D = (1 / 255).toFixed(3), S = !1, R = null, M = 0, O = 0, L = !1, I = !1, F = !1, P = void 0;
        e.exports = {
            _getAssemblerData: function() {
                return (P = a._canvasPool.get()).canvas.width = P.canvas.height = 1, P;
            },
            _resetAssemblerData: function(t) {
                t && a._canvasPool.put(t);
            },
            updateRenderData: function(t) {
                t._renderData.vertDirty && (this._updateFontFamily(t), this._updateProperties(t), 
                this._calculateLabelFont(), this._calculateSplitedStrings(), this._updateLabelDimensions(), 
                this._calculateTextBaseline(), this._updateTexture(t), this._calDynamicAtlas(t), 
                t._actualFontSize = m, t.node.setContentSize(y), this._updateVerts(t), t._renderData.vertDirty = t._renderData.uvDirty = !1, 
                u = null, _ = null, d = null);
            },
            _updateVerts: function() {},
            _updateFontFamily: function(t) {
                t.useSystemFont ? A = t.fontFamily : t.font ? t.font._nativeAsset ? A = t.font._nativeAsset : (A = cc.loader.getRes(t.font.nativeUrl)) || cc.loader.load(t.font.nativeUrl, function(e, i) {
                    A = i || "Arial", t.font._nativeAsset = i, t._updateRenderData(!0);
                }) : A = "Arial";
            },
            _updateProperties: function(t) {
                var e = t._assemblerData;
                u = e.context, _ = e.canvas, d = t._frame._original ? t._frame._original._texture : t._frame._texture, 
                p = t.string.toString(), m = t._fontSize, v = m, b = t.overflow, y.width = t.node.width, 
                y.height = t.node.height, x = t._lineHeight, E = t.horizontalAlign, T = t.verticalAlign, 
                C = t.node.color, L = t._isBold, I = t._isItalic, F = t._isUnderline, w = b !== c.NONE && (b === c.RESIZE_HEIGHT || t.enableWrapText);
                var i = l && t.getComponent(o);
                i && i.enabled ? (S = !0, O = M = i.width, (R = cc.color(i.color)).a = R.a * t.node.color.a / 255) : (S = !1, 
                O = 0);
            },
            _calculateFillTextStartPosition: function() {
                var t = this._getLineHeight(), e = g.length, i = void 0, r = void 0;
                return i = E === n.TextAlignment.RIGHT ? y.width - O : E === n.TextAlignment.CENTER ? y.width / 2 : 0 + O, 
                r = T === n.VerticalTextAlignment.TOP ? 0 : T === n.VerticalTextAlignment.CENTER ? y.height / 2 - t * (e - 1) / 2 : y.height - t * (e - 1), 
                cc.v2(i, r);
            },
            _updateTexture: function(t) {
                u.clearRect(0, 0, _.width, _.height), u.fillStyle = "rgba(" + C.r + ", " + C.g + ", " + C.b + ", " + D + ")", 
                u.fillRect(0, 0, _.width, _.height), u.font = f;
                var e = this._calculateFillTextStartPosition(), i = this._getLineHeight();
                u.lineJoin = "round", u.fillStyle = "rgba(" + C.r + ", " + C.g + ", " + C.b + ", 1)";
                for (var n = void 0, r = 0; r < g.length; ++r) {
                    if (S) {
                        var s = R || h;
                        u.strokeStyle = "rgba(" + s.r + ", " + s.g + ", " + s.b + ", " + s.a / 255 + ")", 
                        u.lineWidth = 2 * M, u.strokeText(g[r], e.x, e.y + r * i);
                    }
                    u.fillText(g[r], e.x, e.y + r * i), F && (n = this._calculateUnderlineStartPosition(), 
                    u.save(), u.beginPath(), u.lineWidth = m / 8, u.strokeStyle = "rgba(" + C.r + ", " + C.g + ", " + C.b + ", 1)", 
                    u.moveTo(n.x, n.y + r * i - 1), u.lineTo(n.x + _.width, n.y + r * i - 1), u.stroke(), 
                    u.restore());
                }
                d.handleLoadedTexture();
            },
            _calDynamicAtlas: function(t) {
                t.cacheMode === a.CacheMode.BITMAP && (t._frame._original || t._frame.setRect(cc.rect(0, 0, _.width, _.height)), 
                t._calDynamicAtlas());
            },
            _calculateUnderlineStartPosition: function() {
                var t, e = this._getLineHeight(), i = g.length, r = void 0;
                return t = 0 + O, r = T === n.VerticalTextAlignment.TOP ? m : T === n.VerticalTextAlignment.CENTER ? y.height / 2 - e * (i - 1) / 2 + m / 2 : y.height - e * (i - 1), 
                cc.v2(t, r);
            },
            _updateLabelDimensions: function() {
                var t = p.split("\n");
                if (b === c.RESIZE_HEIGHT) y.height = g.length * this._getLineHeight(); else if (b === c.NONE) {
                    g = t;
                    for (var e = 0, i = 0, n = 0; n < t.length; ++n) {
                        var s = r.safeMeasureText(u, t[n]);
                        e = e > s ? e : s;
                    }
                    i = g.length * this._getLineHeight(), y.width = parseFloat(e.toFixed(2)) + 2 * O, 
                    y.height = parseFloat(i.toFixed(2)), I && (y.width += v * Math.tan(.20943951));
                }
                _.width !== y.width && (_.width = y.width), _.height !== y.height && (_.height = y.height);
            },
            _calculateTextBaseline: function() {
                this._node;
                var t = void 0, e = void 0;
                t = E === n.TextAlignment.RIGHT ? "right" : E === n.TextAlignment.CENTER ? "center" : "left", 
                u.textAlign = t, e = T === n.VerticalTextAlignment.TOP ? "top" : T === n.VerticalTextAlignment.CENTER ? "middle" : "bottom", 
                u.textBaseline = e;
            },
            _calculateSplitedStrings: function() {
                var t = p.split("\n");
                if (w) {
                    g = [];
                    for (var e = y.width - 2 * O, i = 0; i < t.length; ++i) {
                        var n = r.safeMeasureText(u, t[i]), s = r.fragmentText(t[i], n, e, this._measureText(u));
                        g = g.concat(s);
                    }
                } else g = t;
            },
            _getFontDesc: function() {
                var t = m.toString() + "px ";
                return t += A, L && (t = "bold " + t), t;
            },
            _getLineHeight: function() {
                var t = x;
                return 0 | (t = 0 === t ? m : t * m / v);
            },
            _calculateParagraphLength: function(t, e) {
                for (var i = [], n = 0; n < t.length; ++n) {
                    var s = r.safeMeasureText(e, t[n]);
                    i.push(s);
                }
                return i;
            },
            _measureText: function(t) {
                return function(e) {
                    return r.safeMeasureText(t, e);
                };
            },
            _calculateLabelFont: function() {
                if (f = this._getFontDesc(), u.font = f, b === c.SHRINK) {
                    var t = p.split("\n"), e = this._calculateParagraphLength(t, u), i = 0, n = 0, s = 0;
                    if (w) {
                        var a = y.width - 2 * O, o = y.height - 2 * O;
                        if (a < 0 || o < 0) return f = this._getFontDesc(), void (u.font = f);
                        n = o + 1, s = a + 1;
                        for (var h = m + 1, l = "", _ = !0, d = 0 | h; n > o || s > a; ) {
                            if (_ ? h = d / 2 | 0 : d = h = d - 1, h <= 0) {
                                cc.logID(4003);
                                break;
                            }
                            for (m = h, f = this._getFontDesc(), u.font = f, n = 0, i = 0; i < t.length; ++i) {
                                var g = 0, x = r.safeMeasureText(u, t[i]);
                                for (l = r.fragmentText(t[i], x, a, this._measureText(u)); g < l.length; ) {
                                    s = r.safeMeasureText(u, l[g]), n += this._getLineHeight(), ++g;
                                }
                            }
                            _ && (n > o ? d = 0 | h : (_ = !1, n = o + 1));
                        }
                    } else {
                        for (n = t.length * this._getLineHeight(), i = 0; i < t.length; ++i) s < e[i] && (s = e[i]);
                        var E = (y.width - 2 * O) / s, T = y.height / n;
                        m = v * Math.min(1, E, T) | 0, f = this._getFontDesc(), u.font = f;
                    }
                }
            }
        };
    }, {
        "../../../components/CCComponent": 30,
        "../../../components/CCLabel": 32,
        "../../../components/CCLabelOutline": void 0,
        "../../../platform/CCMacro": 87,
        "../../../utils/text-utils": 166
    } ],
    130: [ function(t, e, i) {
        "use strict";
        function n(t, e, i) {
            i = i || 2;
            var n, o, c, h, l, d, p, m = e && e.length, v = m ? e[0] * i : t.length, g = r(t, 0, v, i, !0), y = [];
            if (!g) return y;
            if (m && (g = function(t, e, i, n) {
                var a, o, c, h, l, d = [];
                for (a = 0, o = e.length; a < o; a++) c = e[a] * n, h = a < o - 1 ? e[a + 1] * n : t.length, 
                (l = r(t, c, h, n, !1)) === l.next && (l.steiner = !0), d.push(f(l));
                for (d.sort(u), a = 0; a < d.length; a++) _(d[a], i), i = s(i, i.next);
                return i;
            }(t, e, g, i)), t.length > 80 * i) {
                n = c = t[0], o = h = t[1];
                for (var x = i; x < v; x += i) l = t[x], d = t[x + 1], l < n && (n = l), d < o && (o = d), 
                l > c && (c = l), d > h && (h = d);
                p = Math.max(c - n, h - o);
            }
            return a(g, y, i, n, o, p), y;
        }
        function r(t, e, i, n, r) {
            var s, a;
            if (r === b(t, e, i, n) > 0) for (s = e; s < i; s += n) a = T(s, t[s], t[s + 1], a); else for (s = i - n; s >= e; s -= n) a = T(s, t[s], t[s + 1], a);
            return a && g(a, a.next) && (C(a), a = a.next), a;
        }
        function s(t, e) {
            if (!t) return t;
            e || (e = t);
            var i, n = t;
            do {
                if (i = !1, n.steiner || !g(n, n.next) && 0 !== v(n.prev, n, n.next)) n = n.next; else {
                    if (C(n), (n = e = n.prev) === n.next) return null;
                    i = !0;
                }
            } while (i || n !== e);
            return e;
        }
        function a(t, e, i, n, r, u, _) {
            if (t) {
                !_ && u && function(t, e, i, n) {
                    var r = t;
                    do {
                        null === r.z && (r.z = d(r.x, r.y, e, i, n)), r.prevZ = r.prev, r.nextZ = r.next, 
                        r = r.next;
                    } while (r !== t);
                    r.prevZ.nextZ = null, r.prevZ = null, function(t) {
                        var e, i, n, r, s, a, o, c, h = 1;
                        do {
                            for (i = t, t = null, s = null, a = 0; i; ) {
                                for (a++, n = i, o = 0, e = 0; e < h && (o++, n = n.nextZ); e++) ;
                                for (c = h; o > 0 || c > 0 && n; ) 0 === o ? (r = n, n = n.nextZ, c--) : 0 !== c && n ? i.z <= n.z ? (r = i, 
                                i = i.nextZ, o--) : (r = n, n = n.nextZ, c--) : (r = i, i = i.nextZ, o--), s ? s.nextZ = r : t = r, 
                                r.prevZ = s, s = r;
                                i = n;
                            }
                            s.nextZ = null, h *= 2;
                        } while (a > 1);
                    }(r);
                }(t, n, r, u);
                for (var f, p, m = t; t.prev !== t.next; ) if (f = t.prev, p = t.next, u ? c(t, n, r, u) : o(t)) e.push(f.i / i), 
                e.push(t.i / i), e.push(p.i / i), C(t), t = p.next, m = p.next; else if ((t = p) === m) {
                    _ ? 1 === _ ? a(t = h(t, e, i), e, i, n, r, u, 2) : 2 === _ && l(t, e, i, n, r, u) : a(s(t), e, i, n, r, u, 1);
                    break;
                }
            }
        }
        function o(t) {
            var e = t.prev, i = t, n = t.next;
            if (v(e, i, n) >= 0) return !1;
            for (var r = t.next.next; r !== t.prev; ) {
                if (p(e.x, e.y, i.x, i.y, n.x, n.y, r.x, r.y) && v(r.prev, r, r.next) >= 0) return !1;
                r = r.next;
            }
            return !0;
        }
        function c(t, e, i, n) {
            var r = t.prev, s = t, a = t.next;
            if (v(r, s, a) >= 0) return !1;
            for (var o = r.x < s.x ? r.x < a.x ? r.x : a.x : s.x < a.x ? s.x : a.x, c = r.y < s.y ? r.y < a.y ? r.y : a.y : s.y < a.y ? s.y : a.y, h = r.x > s.x ? r.x > a.x ? r.x : a.x : s.x > a.x ? s.x : a.x, l = r.y > s.y ? r.y > a.y ? r.y : a.y : s.y > a.y ? s.y : a.y, u = d(o, c, e, i, n), _ = d(h, l, e, i, n), f = t.nextZ; f && f.z <= _; ) {
                if (f !== t.prev && f !== t.next && p(r.x, r.y, s.x, s.y, a.x, a.y, f.x, f.y) && v(f.prev, f, f.next) >= 0) return !1;
                f = f.nextZ;
            }
            for (f = t.prevZ; f && f.z >= u; ) {
                if (f !== t.prev && f !== t.next && p(r.x, r.y, s.x, s.y, a.x, a.y, f.x, f.y) && v(f.prev, f, f.next) >= 0) return !1;
                f = f.prevZ;
            }
            return !0;
        }
        function h(t, e, i) {
            var n = t;
            do {
                var r = n.prev, s = n.next.next;
                !g(r, s) && y(r, n, n.next, s) && x(r, s) && x(s, r) && (e.push(r.i / i), e.push(n.i / i), 
                e.push(s.i / i), C(n), C(n.next), n = t = s), n = n.next;
            } while (n !== t);
            return n;
        }
        function l(t, e, i, n, r, o) {
            var c = t;
            do {
                for (var h = c.next.next; h !== c.prev; ) {
                    if (c.i !== h.i && m(c, h)) {
                        var l = E(c, h);
                        return c = s(c, c.next), l = s(l, l.next), a(c, e, i, n, r, o), void a(l, e, i, n, r, o);
                    }
                    h = h.next;
                }
                c = c.next;
            } while (c !== t);
        }
        function u(t, e) {
            return t.x - e.x;
        }
        function _(t, e) {
            if (e = function(t, e) {
                var i, n = e, r = t.x, s = t.y, a = -1 / 0;
                do {
                    if (s <= n.y && s >= n.next.y) {
                        var o = n.x + (s - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
                        if (o <= r && o > a) {
                            if (a = o, o === r) {
                                if (s === n.y) return n;
                                if (s === n.next.y) return n.next;
                            }
                            i = n.x < n.next.x ? n : n.next;
                        }
                    }
                    n = n.next;
                } while (n !== e);
                if (!i) return null;
                if (r === a) return i.prev;
                var c, h = i, l = i.x, u = i.y, _ = 1 / 0;
                n = i.next;
                for (;n !== h; ) r >= n.x && n.x >= l && p(s < u ? r : a, s, l, u, s < u ? a : r, s, n.x, n.y) && ((c = Math.abs(s - n.y) / (r - n.x)) < _ || c === _ && n.x > i.x) && x(n, t) && (i = n, 
                _ = c), n = n.next;
                return i;
            }(t, e)) {
                var i = E(e, t);
                s(i, i.next);
            }
        }
        function d(t, e, i, n, r) {
            return (t = 1431655765 & ((t = 858993459 & ((t = 252645135 & ((t = 16711935 & ((t = 32767 * (t - i) / r) | t << 8)) | t << 4)) | t << 2)) | t << 1)) | (e = 1431655765 & ((e = 858993459 & ((e = 252645135 & ((e = 16711935 & ((e = 32767 * (e - n) / r) | e << 8)) | e << 4)) | e << 2)) | e << 1)) << 1;
        }
        function f(t) {
            var e = t, i = t;
            do {
                e.x < i.x && (i = e), e = e.next;
            } while (e !== t);
            return i;
        }
        function p(t, e, i, n, r, s, a, o) {
            return (r - a) * (e - o) - (t - a) * (s - o) >= 0 && (t - a) * (n - o) - (i - a) * (e - o) >= 0 && (i - a) * (s - o) - (r - a) * (n - o) >= 0;
        }
        function m(t, e) {
            return t.next.i !== e.i && t.prev.i !== e.i && !function(t, e) {
                var i = t;
                do {
                    if (i.i !== t.i && i.next.i !== t.i && i.i !== e.i && i.next.i !== e.i && y(i, i.next, t, e)) return !0;
                    i = i.next;
                } while (i !== t);
                return !1;
            }(t, e) && x(t, e) && x(e, t) && function(t, e) {
                var i = t, n = !1, r = (t.x + e.x) / 2, s = (t.y + e.y) / 2;
                do {
                    i.y > s != i.next.y > s && r < (i.next.x - i.x) * (s - i.y) / (i.next.y - i.y) + i.x && (n = !n), 
                    i = i.next;
                } while (i !== t);
                return n;
            }(t, e);
        }
        function v(t, e, i) {
            return (e.y - t.y) * (i.x - e.x) - (e.x - t.x) * (i.y - e.y);
        }
        function g(t, e) {
            return t.x === e.x && t.y === e.y;
        }
        function y(t, e, i, n) {
            return !!(g(t, e) && g(i, n) || g(t, n) && g(i, e)) || v(t, e, i) > 0 != v(t, e, n) > 0 && v(i, n, t) > 0 != v(i, n, e) > 0;
        }
        function x(t, e) {
            return v(t.prev, t, t.next) < 0 ? v(t, e, t.next) >= 0 && v(t, t.prev, e) >= 0 : v(t, e, t.prev) < 0 || v(t, t.next, e) < 0;
        }
        function E(t, e) {
            var i = new A(t.i, t.x, t.y), n = new A(e.i, e.x, e.y), r = t.next, s = e.prev;
            return t.next = e, e.prev = t, i.next = r, r.prev = i, n.next = i, i.prev = n, s.next = n, 
            n.prev = s, n;
        }
        function T(t, e, i, n) {
            var r = new A(t, e, i);
            return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, 
            r.next = r), r;
        }
        function C(t) {
            t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), 
            t.nextZ && (t.nextZ.prevZ = t.prevZ);
        }
        function A(t, e, i) {
            this.i = t, this.x = e, this.y = i, this.prev = null, this.next = null, this.z = null, 
            this.prevZ = null, this.nextZ = null, this.steiner = !1;
        }
        function b(t, e, i, n) {
            for (var r = 0, s = e, a = i - n; s < i; s += n) r += (t[a] - t[s]) * (t[s + 1] + t[a + 1]), 
            a = s;
            return r;
        }
        e.exports = n, n.deviation = function(t, e, i, n) {
            var r = e && e.length, s = r ? e[0] * i : t.length, a = Math.abs(b(t, 0, s, i));
            if (r) for (var o = 0, c = e.length; o < c; o++) {
                var h = e[o] * i, l = o < c - 1 ? e[o + 1] * i : t.length;
                a -= Math.abs(b(t, h, l, i));
            }
            var u = 0;
            for (o = 0; o < n.length; o += 3) {
                var _ = n[o] * i, d = n[o + 1] * i, f = n[o + 2] * i;
                u += Math.abs((t[_] - t[f]) * (t[d + 1] - t[_ + 1]) - (t[_] - t[d]) * (t[f + 1] - t[_ + 1]));
            }
            return 0 === a && 0 === u ? 0 : Math.abs((u - a) / a);
        }, n.flatten = function(t) {
            for (var e = t[0][0].length, i = {
                vertices: [],
                holes: [],
                dimensions: e
            }, n = 0, r = 0; r < t.length; r++) {
                for (var s = 0; s < t[r].length; s++) for (var a = 0; a < e; a++) i.vertices.push(t[r][s][a]);
                r > 0 && (n += t[r - 1].length, i.holes.push(n));
            }
            return i;
        };
    }, {} ],
    131: [ function(t, e, i) {
        var n = t("../../../../graphics/helper"), r = t("../../../../graphics/types").PointFlags, s = t("../../mesh-buffer"), a = t("../../vertex-format").vfmtPosColor, o = t("../../../index"), c = o.renderEngine, h = c.IARenderData, l = c.InputAssembler, u = cc.Class({
            name: "cc.GraphicsPoint",
            extends: cc.Vec2,
            ctor: function(t, e) {
                this.reset();
            },
            reset: function() {
                this.dx = 0, this.dy = 0, this.dmx = 0, this.dmy = 0, this.flags = 0, this.len = 0;
            }
        });
        function _() {
            this.reset();
        }
        function d(t) {
            this._tessTol = .25, this._distTol = .01, this._updatePathOffset = !1, this._paths = null, 
            this._pathLength = 0, this._pathOffset = 0, this._points = null, this._pointsOffset = 0, 
            this._commandx = 0, this._commandy = 0, this._paths = [], this._points = [], this._renderDatas = [], 
            this._dataOffset = 0;
        }
        cc.js.mixin(_.prototype, {
            reset: function() {
                this.closed = !1, this.nbevel = 0, this.complex = !0, this.points ? this.points.length = 0 : this.points = [];
            }
        }), cc.js.mixin(d.prototype, {
            moveTo: function(t, e) {
                this._updatePathOffset && (this._pathOffset = this._pathLength, this._updatePathOffset = !1), 
                this._addPath(), this._addPoint(t, e, r.PT_CORNER), this._commandx = t, this._commandy = e;
            },
            lineTo: function(t, e) {
                this._addPoint(t, e, r.PT_CORNER), this._commandx = t, this._commandy = e;
            },
            bezierCurveTo: function(t, e, i, s, a, o) {
                var c = this._curPath, h = c.points[c.points.length - 1];
                h.x !== t || h.y !== e || i !== a || s !== o ? (n.tesselateBezier(this, h.x, h.y, t, e, i, s, a, o, 0, r.PT_CORNER), 
                this._commandx = a, this._commandy = o) : this.lineTo(a, o);
            },
            quadraticCurveTo: function(t, e, i, n) {
                var r = this._commandx, s = this._commandy;
                this.bezierCurveTo(r + 2 / 3 * (t - r), s + 2 / 3 * (e - s), i + 2 / 3 * (t - i), n + 2 / 3 * (e - n), i, n);
            },
            arc: function(t, e, i, r, s, a) {
                n.arc(this, t, e, i, r, s, a);
            },
            ellipse: function(t, e, i, r) {
                n.ellipse(this, t, e, i, r), this._curPath.complex = !1;
            },
            circle: function(t, e, i) {
                n.ellipse(this, t, e, i, i), this._curPath.complex = !1;
            },
            rect: function(t, e, i, n) {
                this.moveTo(t, e), this.lineTo(t, e + n), this.lineTo(t + i, e + n), this.lineTo(t + i, e), 
                this.close(), this._curPath.complex = !1;
            },
            roundRect: function(t, e, i, r, s) {
                n.roundRect(this, t, e, i, r, s), this._curPath.complex = !1;
            },
            clear: function(t, e) {
                this._pathLength = 0, this._pathOffset = 0, this._pointsOffset = 0, this._dataOffset = 0, 
                this._curPath = null;
                var i = this._renderDatas;
                if (e) {
                    this._paths.length = 0, this._points.length = 0;
                    for (var n = 0, r = i.length; n < r; n++) {
                        var s = i[n];
                        s.meshbuffer.destroy(), s.meshbuffer = null;
                    }
                    i.length = 0;
                } else for (var a = 0, o = i.length; a < o; a++) {
                    i[a].meshbuffer.reset();
                }
            },
            close: function() {
                this._curPath.closed = !0;
            },
            _addPath: function() {
                var t = this._pathLength, e = this._paths[t];
                return e ? e.reset() : (e = new _(), this._paths.push(e)), this._pathLength++, this._curPath = e, 
                e;
            },
            _addPoint: function(t, e, i) {
                var n = this._curPath;
                if (n) {
                    var r, s = this._points, a = n.points;
                    (r = s[this._pointsOffset++]) ? (r.x = t, r.y = e) : (r = new u(t, e), s.push(r)), 
                    r.flags = i, a.push(r);
                }
            },
            requestRenderData: function() {
                var t = new h(), e = new s(o._handle, a);
                t.meshbuffer = e, this._renderDatas.push(t);
                var i = new l();
                return i._vertexBuffer = e._vb, i._indexBuffer = e._ib, i._start = 0, t.ia = i, 
                t;
            },
            getRenderDatas: function() {
                return 0 === this._renderDatas.length && this.requestRenderData(), this._renderDatas;
            }
        }), e.exports = d;
    }, {
        "../../../../graphics/helper": 55,
        "../../../../graphics/types": 57,
        "../../../index": 123,
        "../../mesh-buffer": 146,
        "../../vertex-format": 151
    } ],
    132: [ function(t, e, i) {
        var n = t("../../../../graphics/graphics"), r = t("../../../../graphics/types").PointFlags, s = n.LineJoin, a = n.LineCap, o = t("./earcut"), c = t("./impl"), h = Math.PI, l = Math.min, u = Math.max, _ = Math.ceil, d = Math.acos, f = Math.cos, p = Math.sin, m = Math.atan2, v = (Math.abs, 
        null), g = null, y = 0;
        function x(t, e, i) {
            return t < e ? e : t > i ? i : t;
        }
        var E = {
            useModel: !0,
            createImpl: function(t) {
                return new c(t);
            },
            updateRenderData: function(t) {
                for (var e = t._impl.getRenderDatas(), i = 0, n = e.length; i < n; i++) e[i].material = t.getMaterial();
            },
            fillBuffers: function(t, e) {
                e._flush();
                var i = e.node;
                e.node = t.node, this.renderIA(t, e), e.node = i;
            },
            renderIA: function(t, e) {
                for (var i = t.node.color, n = (i.r, i.g, i.b, i.a, t._impl.getRenderDatas()), r = 0, s = n.length; r < s; r++) {
                    var a = n[r], o = a.meshbuffer;
                    a.ia._count = o.indiceStart, e._flushIA(a), o.uploadData();
                }
            },
            genRenderData: function(t, e) {
                var i = g.getRenderDatas(), n = i[g._dataOffset], r = n.meshbuffer, s = r.vertexStart + e;
                return (s > 65535 || 3 * s > 131070) && (++g._dataOffset, s = e, g._dataOffset < i.length ? n = i[g._dataOffset] : (n = g.requestRenderData(t), 
                i[g._dataOffset] = n), n.material = t.getMaterial(), r = n.meshbuffer), s > r.vertexOffset && r.requestStatic(e, 3 * e), 
                n;
            },
            stroke: function(t) {
                y = t._strokeColor._val, this._flattenPaths(t._impl), this._expandStroke(t), t._impl._updatePathOffset = !0;
            },
            fill: function(t) {
                y = t._fillColor._val, this._expandFill(t), t._impl._updatePathOffset = !0;
            },
            _expandStroke: function(t) {
                var e = .5 * t.lineWidth, i = t.lineCap, n = t.lineJoin, o = t.miterLimit;
                g = t._impl;
                var c = function(t, e, i) {
                    var n = 2 * d(t / (t + i));
                    return u(2, _(e / n));
                }(e, h, g._tessTol);
                this._calculateJoins(g, e, n, o);
                for (var l = g._paths, f = 0, p = g._pathOffset, m = g._pathLength; p < m; p++) {
                    var y = l[p], x = y.points.length;
                    n === s.ROUND ? f += 2 * (x + y.nbevel * (c + 2) + 1) : f += 2 * (x + 5 * y.nbevel + 1), 
                    y.closed || (i === a.ROUND ? f += 2 * (2 * c + 2) : f += 12);
                }
                for (var E = (v = this.genRenderData(t, f)).meshbuffer, T = E._vData, C = E._iData, A = g._pathOffset, b = g._pathLength; A < b; A++) {
                    var w, D = l[A], S = D.points, R = S.length, M = E.vertexStart, O = void 0, L = void 0, I = void 0, F = void 0;
                    if ((w = D.closed) ? (O = S[R - 1], L = S[0], I = 0, F = R) : (O = S[0], L = S[1], 
                    I = 1, F = R - 1), !w) {
                        var P = L.sub(O);
                        P.normalizeSelf();
                        var N = P.x, B = P.y;
                        i === a.BUTT ? this._buttCap(O, N, B, e, 0) : i === a.SQUARE ? this._buttCap(O, N, B, e, e) : i === a.ROUND && this._roundCapStart(O, N, B, e, c);
                    }
                    for (var z = I; z < F; ++z) n === s.ROUND ? this._roundJoin(O, L, e, e, c) : 0 != (L.flags & (r.PT_BEVEL | r.PT_INNERBEVEL)) ? this._bevelJoin(O, L, e, e) : (this._vset(L.x + L.dmx * e, L.y + L.dmy * e), 
                    this._vset(L.x - L.dmx * e, L.y - L.dmy * e)), O = L, L = S[z + 1];
                    if (w) {
                        var k = 3 * M;
                        this._vset(T[k], T[k + 1]), this._vset(T[k + 3], T[k + 4]);
                    } else {
                        var U = L.sub(O);
                        U.normalizeSelf();
                        var H = U.x, G = U.y;
                        i === a.BUTT ? this._buttCap(L, H, G, e, 0) : i === a.BUTT || i === a.SQUARE ? this._buttCap(L, H, G, e, e) : i === a.ROUND && this._roundCapEnd(L, H, G, e, c);
                    }
                    for (var V = E.indiceStart, W = M + 2, j = E.vertexStart; W < j; W++) C[V++] = W - 2, 
                    C[V++] = W - 1, C[V++] = W;
                    E.indiceStart = V;
                }
                v = null, g = null;
            },
            _expandFill: function(t) {
                for (var e = (g = t._impl)._paths, i = 0, n = g._pathOffset, r = g._pathLength; n < r; n++) {
                    i += e[n].points.length;
                }
                for (var s = (v = this.genRenderData(t, i)).meshbuffer, a = s._vData, c = s._iData, h = g._pathOffset, l = g._pathLength; h < l; h++) {
                    var u = e[h], _ = u.points, d = _.length;
                    if (0 !== d) {
                        for (var f = s.vertexStart, p = 0; p < d; ++p) this._vset(_[p].x, _[p].y);
                        var m = s.indiceStart;
                        if (u.complex) {
                            for (var y = [], x = f, E = s.vertexStart; x < E; x++) {
                                var T = 3 * x;
                                y.push(a[T]), y.push(a[T + 1]);
                            }
                            var C = o(y, null, 2);
                            if (!C || 0 === C.length) continue;
                            for (var A = 0, b = C.length; A < b; A++) c[m++] = C[A] + f;
                        } else for (var w = f, D = f + 2, S = s.vertexStart; D < S; D++) c[m++] = w, c[m++] = D - 1, 
                        c[m++] = D;
                        s.indiceStart = m;
                    }
                }
                v = null, g = null;
            },
            _calculateJoins: function(t, e, i, n) {
                var a = 0;
                e > 0 && (a = 1 / e);
                for (var o = t._paths, c = t._pathOffset, h = t._pathLength; c < h; c++) {
                    var _ = o[c], d = _.points, f = d.length, p = d[f - 1], m = d[0];
                    _.nbevel = 0;
                    for (var v = 0; v < f; v++) {
                        var g, y, x = p.dy, E = -p.dx, T = m.dy, C = -m.dx;
                        if (m.dmx = .5 * (x + T), m.dmy = .5 * (E + C), (g = m.dmx * m.dmx + m.dmy * m.dmy) > 1e-6) {
                            var A = 1 / g;
                            A > 600 && (A = 600), m.dmx *= A, m.dmy *= A;
                        }
                        m.dx * p.dy - p.dx * m.dy > 0 && (0, m.flags |= r.PT_LEFT), g * (y = u(11, l(p.len, m.len) * a)) * y < 1 && (m.flags |= r.PT_INNERBEVEL), 
                        m.flags & r.PT_CORNER && (g * n * n < 1 || i === s.BEVEL || i === s.ROUND) && (m.flags |= r.PT_BEVEL), 
                        0 != (m.flags & (r.PT_BEVEL | r.PT_INNERBEVEL)) && _.nbevel++, p = m, m = d[v + 1];
                    }
                }
            },
            _flattenPaths: function(t) {
                for (var e = t._paths, i = t._pathOffset, n = t._pathLength; i < n; i++) {
                    var r = e[i], s = r.points, a = s[s.length - 1], o = s[0];
                    a.equals(o) && (r.closed = !0, s.pop(), a = s[s.length - 1]);
                    for (var c = 0, h = s.length; c < h; c++) {
                        var l = o.sub(a);
                        a.len = l.mag(), (l.x || l.y) && l.normalizeSelf(), a.dx = l.x, a.dy = l.y, a = o, 
                        o = s[c + 1];
                    }
                }
            },
            _chooseBevel: function(t, e, i, n) {
                var r = i.x, s = i.y, a = void 0, o = void 0, c = void 0, h = void 0;
                return 0 !== t ? (a = r + e.dy * n, o = s - e.dx * n, c = r + i.dy * n, h = s - i.dx * n) : (a = c = r + i.dmx * n, 
                o = h = s + i.dmy * n), [ a, o, c, h ];
            },
            _buttCap: function(t, e, i, n, r) {
                var s = t.x - e * r, a = t.y - i * r, o = i, c = -e;
                this._vset(s + o * n, a + c * n), this._vset(s - o * n, a - c * n);
            },
            _roundCapStart: function(t, e, i, n, r) {
                for (var s = t.x, a = t.y, o = i, c = -e, l = 0; l < r; l++) {
                    var u = l / (r - 1) * h, _ = f(u) * n, d = p(u) * n;
                    this._vset(s - o * _ - e * d, a - c * _ - i * d), this._vset(s, a);
                }
                this._vset(s + o * n, a + c * n), this._vset(s - o * n, a - c * n);
            },
            _roundCapEnd: function(t, e, i, n, r) {
                var s = t.x, a = t.y, o = i, c = -e;
                this._vset(s + o * n, a + c * n), this._vset(s - o * n, a - c * n);
                for (var l = 0; l < r; l++) {
                    var u = l / (r - 1) * h, _ = f(u) * n, d = p(u) * n;
                    this._vset(s, a), this._vset(s - o * _ + e * d, a - c * _ + i * d);
                }
            },
            _roundJoin: function(t, e, i, n, s) {
                var a = t.dy, o = -t.dx, c = e.dy, l = -e.dx, u = e.x, d = e.y;
                if (0 != (e.flags & r.PT_LEFT)) {
                    var v = this._chooseBevel(e.flags & r.PT_INNERBEVEL, t, e, i), g = v[0], y = v[1], E = v[2], T = v[3], C = m(-o, -a), A = m(-l, -c);
                    A > C && (A -= 2 * h), this._vset(g, y), this._vset(u - a * n, e.y - o * n);
                    for (var b = x(_((C - A) / h) * s, 2, s), w = 0; w < b; w++) {
                        var D = C + w / (b - 1) * (A - C), S = u + f(D) * n, R = d + p(D) * n;
                        this._vset(u, d), this._vset(S, R);
                    }
                    this._vset(E, T), this._vset(u - c * n, d - l * n);
                } else {
                    var M = this._chooseBevel(e.flags & r.PT_INNERBEVEL, t, e, -n), O = M[0], L = M[1], I = M[2], F = M[3], P = m(o, a), N = m(l, c);
                    N < P && (N += 2 * h), this._vset(u + a * n, d + o * n), this._vset(O, L);
                    for (var B = x(_((N - P) / h) * s, 2, s), z = 0; z < B; z++) {
                        var k = P + z / (B - 1) * (N - P), U = u + f(k) * i, H = d + p(k) * i;
                        this._vset(U, H), this._vset(u, d);
                    }
                    this._vset(u + c * n, d + l * n), this._vset(I, F);
                }
            },
            _bevelJoin: function(t, e, i, n) {
                var s = void 0, a = void 0, o = void 0, c = void 0, h = void 0, l = void 0, u = void 0, _ = void 0, d = t.dy, f = -t.dx, p = e.dy, m = -e.dx;
                if (e.flags & r.PT_LEFT) {
                    var v = this._chooseBevel(e.flags & r.PT_INNERBEVEL, t, e, i);
                    h = v[0], l = v[1], u = v[2], _ = v[3], this._vset(h, l), this._vset(e.x - d * n, e.y - f * n), 
                    this._vset(u, _), this._vset(e.x - p * n, e.y - m * n);
                } else {
                    var g = this._chooseBevel(e.flags & r.PT_INNERBEVEL, t, e, -n);
                    s = g[0], a = g[1], o = g[2], c = g[3], this._vset(e.x + d * i, e.y + f * i), this._vset(s, a), 
                    this._vset(e.x + p * i, e.y + m * i), this._vset(o, c);
                }
            },
            _vset: function(t, e) {
                var i = v.meshbuffer, n = 3 * i.vertexStart, r = i._vData, s = i._uintVData;
                r[n] = t, r[n + 1] = e, s[n + 2] = y, i.vertexStart++, i._dirty = !0;
            }
        };
        n._assembler = E, e.exports = E;
    }, {
        "../../../../graphics/graphics": 54,
        "../../../../graphics/types": 57,
        "./earcut": 130,
        "./impl": 131
    } ],
    133: [ function(t, e, i) {
        t("./sprite"), t("./mask-assembler"), t("./graphics"), t("./label"), t("./motion-streak");
    }, {
        "./graphics": 132,
        "./label": 135,
        "./mask-assembler": 138,
        "./motion-streak": void 0,
        "./sprite": 140
    } ],
    134: [ function(t, e, i) {
        var n = t("../../../../platform/js"), r = t("../../../utils/label/bmfont");
        e.exports = n.addon({
            createData: function(t) {
                return t.requestRenderData();
            },
            fillBuffers: function(t, e) {
                for (var i = t.node, n = t._renderData, r = n._data, s = i.color._val, a = i._worldMatrix, o = a.m00, c = a.m01, h = a.m04, l = a.m05, u = a.m12, _ = a.m13, d = e._meshBuffer, f = n.vertexCount, p = d.request(f, n.indiceCount), m = p.indiceOffset, v = p.byteOffset >> 2, g = p.vertexOffset, y = d._vData, x = d._uintVData, E = d._iData, T = 0; T < f; T++) {
                    var C = r[T];
                    y[v++] = C.x * o + C.y * h + u, y[v++] = C.x * c + C.y * l + _, y[v++] = C.u, y[v++] = C.v, 
                    x[v++] = s;
                }
                for (var A = 0, b = f / 4; A < b; A++) {
                    var w = g + 4 * A;
                    E[m++] = w, E[m++] = w + 1, E[m++] = w + 2, E[m++] = w + 1, E[m++] = w + 3, E[m++] = w + 2;
                }
            },
            appendQuad: function(t, e, i, n, r, s, a) {
                var o = t.dataLength;
                t.dataLength += 4, t.vertexCount = t.dataLength, t.indiceCount = t.dataLength / 2 * 3;
                var c = t._data, h = e.width, l = e.height, u = i.width, _ = i.height, d = void 0, f = void 0, p = void 0, m = void 0;
                n ? (d = i.x / h, p = (i.x + _) / h, f = (i.y + u) / l, m = i.y / l, c[o].u = d, 
                c[o].v = m, c[o + 1].u = d, c[o + 1].v = f, c[o + 2].u = p, c[o + 2].v = m, c[o + 3].u = p, 
                c[o + 3].v = f) : (d = i.x / h, p = (i.x + u) / h, f = (i.y + _) / l, m = i.y / l, 
                c[o].u = d, c[o].v = f, c[o + 1].u = p, c[o + 1].v = f, c[o + 2].u = d, c[o + 2].v = m, 
                c[o + 3].u = p, c[o + 3].v = m), c[o].x = r, c[o].y = s - _ * a, c[o + 1].x = r + u * a, 
                c[o + 1].y = s - _ * a, c[o + 2].x = r, c[o + 2].y = s, c[o + 3].x = r + u * a, 
                c[o + 3].y = s;
            }
        }, r);
    }, {
        "../../../../platform/js": 102,
        "../../../utils/label/bmfont": 126
    } ],
    135: [ function(t, e, i) {
        var n = t("../../../../components/CCLabel"), r = t("./ttf"), s = t("./bmfont"), a = t("./letter-font"), o = {
            pool: [],
            get: function() {
                var t = this.pool.pop();
                if (!t) {
                    var e = document.createElement("canvas");
                    t = {
                        canvas: e,
                        context: e.getContext("2d")
                    };
                }
                return t;
            },
            put: function(t) {
                this.pool.length >= 32 || this.pool.push(t);
            }
        }, c = {
            getAssembler: function(t) {
                var e = r;
                return t.font instanceof cc.BitmapFont ? e = s : t.cacheMode === n.CacheMode.CHAR && (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB ? cc.warn("sorry, subdomain does not support CHAR mode currently!") : e = a), 
                e;
            },
            updateRenderData: function(t) {
                return t.__allocedDatas;
            }
        };
        n._assembler = c, n._canvasPool = o, e.exports = c;
    }, {
        "../../../../components/CCLabel": 32,
        "./bmfont": 134,
        "./letter-font": 136,
        "./ttf": 137
    } ],
    136: [ function(t, e, i) {
        var n = t("../../../../platform/js"), r = t("../../../utils/label/letter-font"), s = cc.color(255, 255, 255, 255);
        e.exports = n.addon({
            createData: function(t) {
                return t.requestRenderData();
            },
            fillBuffers: function(t, e) {
                var i = t.node, n = t._renderData, r = n._data, a = i._worldMatrix, o = a.m00, c = a.m01, h = a.m04, l = a.m05, u = a.m12, _ = a.m13;
                s._fastSetA(i.color.a);
                for (var d = s._val, f = e._meshBuffer, p = n.vertexCount, m = f.request(p, n.indiceCount), v = m.indiceOffset, g = m.byteOffset >> 2, y = m.vertexOffset, x = f._vData, E = f._uintVData, T = f._iData, C = 0; C < p; C++) {
                    var A = r[C];
                    x[g++] = A.x * o + A.y * h + u, x[g++] = A.x * c + A.y * l + _, x[g++] = A.u, x[g++] = A.v, 
                    E[g++] = d;
                }
                for (var b = 0, w = p / 4; b < w; b++) {
                    var D = y + 4 * b;
                    T[v++] = D, T[v++] = D + 1, T[v++] = D + 2, T[v++] = D + 1, T[v++] = D + 3, T[v++] = D + 2;
                }
            },
            appendQuad: function(t, e, i, n, r, s, a) {
                var o = t.dataLength;
                t.dataLength += 4, t.vertexCount = t.dataLength, t.indiceCount = t.dataLength / 2 * 3;
                var c = t._data, h = e.width, l = e.height, u = i.width, _ = i.height, d = void 0, f = void 0, p = void 0, m = void 0;
                n ? (d = i.x / h, p = (i.x + _) / h, f = (i.y + u) / l, m = i.y / l, c[o].u = d, 
                c[o].v = m, c[o + 1].u = d, c[o + 1].v = f, c[o + 2].u = p, c[o + 2].v = m, c[o + 3].u = p, 
                c[o + 3].v = f) : (d = i.x / h, p = (i.x + u) / h, f = (i.y + _) / l, m = i.y / l, 
                c[o].u = d, c[o].v = f, c[o + 1].u = p, c[o + 1].v = f, c[o + 2].u = d, c[o + 2].v = m, 
                c[o + 3].u = p, c[o + 3].v = m), c[o].x = r, c[o].y = s - _ * a, c[o + 1].x = r + u * a, 
                c[o + 1].y = s - _ * a, c[o + 2].x = r, c[o + 2].y = s, c[o + 3].x = r + u * a, 
                c[o + 3].y = s;
            }
        }, r);
    }, {
        "../../../../platform/js": 102,
        "../../../utils/label/letter-font": 128
    } ],
    137: [ function(t, e, i) {
        var n = t("../../../../platform/js"), r = t("../../../utils/label/ttf"), s = cc.color(255, 255, 255, 255);
        e.exports = n.addon({
            createData: function(t) {
                var e = t.requestRenderData();
                return e.dataLength = 4, e.vertexCount = 4, e.indiceCount = 6, e;
            },
            fillBuffers: function(t, e) {
                var i = t._renderData._data, n = t.node, r = n._worldMatrix, a = r.m00, o = r.m01, c = r.m04, h = r.m05, l = r.m12, u = r.m13;
                s._fastSetA(n.color.a);
                for (var _ = s._val, d = e._meshBuffer, f = d.request(4, 6), p = f.indiceOffset, m = f.byteOffset >> 2, v = f.vertexOffset, g = d._vData, y = d._uintVData, x = d._iData, E = 0; E < 4; E++) {
                    var T = i[E];
                    g[m++] = T.x * a + T.y * c + l, g[m++] = T.x * o + T.y * h + u, g[m++] = T.u, g[m++] = T.v, 
                    y[m++] = _;
                }
                x[p++] = v, x[p++] = v + 1, x[p++] = v + 2, x[p++] = v + 1, x[p++] = v + 3, x[p++] = v + 2;
            },
            _updateVerts: function(t) {
                var e = t._renderData, i = t._frame.uv, n = t.node, r = n.width, s = n.height, a = n.anchorX * r, o = n.anchorY * s, c = e._data;
                c[0].x = -a, c[0].y = -o, c[1].x = r - a, c[1].y = -o, c[2].x = -a, c[2].y = s - o, 
                c[3].x = r - a, c[3].y = s - o, c[0].u = i[0], c[0].v = i[1], c[1].u = i[2], c[1].v = i[3], 
                c[2].u = i[4], c[2].v = i[5], c[3].u = i[6], c[3].v = i[7];
            }
        }, r);
    }, {
        "../../../../platform/js": 102,
        "../../../utils/label/ttf": 129
    } ],
    138: [ function(t, e, i) {
        var n = t("../stencil-manager"), r = t("../../../components/CCMask"), s = t("../../render-flow"), a = t("./sprite/simple"), o = t("./graphics"), c = n.sharedManager, h = {
            updateRenderData: function(t) {
                t._renderData || (o.updateRenderData(t._clearGraphics), t._type === r.Type.IMAGE_STENCIL ? t._renderData = a.createData(t) : t._renderData = t.requestRenderData());
                var e = t._renderData;
                if (t._type === r.Type.IMAGE_STENCIL) if (t.spriteFrame) {
                    var i = t.node._contentSize, n = t.node._anchorPoint;
                    e.updateSizeNPivot(i.width, i.height, n.x, n.y), e.dataLength = 4, a.updateRenderData(t), 
                    e.material = t._material;
                } else t._material = null; else t._graphics._material = t._material, o.updateRenderData(t._graphics);
            },
            fillBuffers: function(t, e) {
                (t._type !== r.Type.IMAGE_STENCIL || t.spriteFrame) && (c.pushMask(t), c.clear(), 
                o.fillBuffers(t._clearGraphics, e), c.enterLevel(), e.node = t.node, e.material = t._material, 
                t._type === r.Type.IMAGE_STENCIL ? (a.fillBuffers(t, e), e._flush()) : o.fillBuffers(t._graphics, e), 
                c.enableMask()), t.node._renderFlag |= s.FLAG_UPDATE_RENDER_DATA;
            }
        }, l = {
            fillBuffers: function(t, e) {
                (t._type !== r.Type.IMAGE_STENCIL || t.spriteFrame) && c.exitMask(), t.node._renderFlag |= s.FLAG_UPDATE_RENDER_DATA;
            }
        };
        r._assembler = h, r._postAssembler = l, e.exports = {
            front: h,
            end: l
        };
    }, {
        "../../../components/CCMask": 34,
        "../../render-flow": 125,
        "../stencil-manager": 150,
        "./graphics": 132,
        "./sprite/simple": 143
    } ],
    139: [ function(t, e, i) {
        var n = t("../../../../components/CCSprite").FillType;
        e.exports = {
            useModel: !1,
            updateRenderData: function(t) {
                var e = t.spriteFrame;
                t._calDynamicAtlas();
                var i = t._renderData;
                if (i && e) {
                    var n = i.uvDirty, r = i.vertDirty;
                    if (!n && !r) return t.__allocedDatas;
                    var s = t._fillStart, a = t._fillRange;
                    a < 0 && (s += a, a = -a), a = s + a, s = (s = s > 1 ? 1 : s) < 0 ? 0 : s, a = (a = a > 1 ? 1 : a) < 0 ? 0 : a;
                    var o = s + (a = (a -= s) < 0 ? 0 : a);
                    o = o > 1 ? 1 : o, n && this.updateUVs(t, s, o), r && (this.updateVerts(t, s, o), 
                    this.updateWorldVerts(t));
                }
            },
            updateUVs: function(t, e, i) {
                var r = t._spriteFrame, s = t._renderData, a = s._data, o = r._texture.width, c = r._texture.height, h = r._rect, l = void 0, u = void 0, _ = void 0, d = void 0, f = void 0, p = void 0, m = void 0, v = void 0, g = void 0, y = void 0;
                switch (r._rotated ? (l = h.x / o, u = (h.y + h.width) / c, _ = f = l, m = g = (h.x + h.height) / o, 
                p = y = u, d = v = h.y / c) : (l = h.x / o, u = (h.y + h.height) / c, _ = m = l, 
                f = g = (h.x + h.width) / o, d = p = u, v = y = h.y / c), t._fillType) {
                  case n.HORIZONTAL:
                    a[0].u = _ + (f - _) * e, a[0].v = d + (p - d) * e, a[1].u = _ + (f - _) * i, a[1].v = d + (p - d) * i, 
                    a[2].u = m + (g - m) * e, a[2].v = v + (y - v) * e, a[3].u = m + (g - m) * i, a[3].v = v + (y - v) * i;
                    break;

                  case n.VERTICAL:
                    a[0].u = _ + (m - _) * e, a[0].v = d + (v - d) * e, a[1].u = f + (g - f) * e, a[1].v = p + (y - p) * e, 
                    a[2].u = _ + (m - _) * i, a[2].v = d + (v - d) * i, a[3].u = f + (g - f) * i, a[3].v = p + (y - p) * i;
                    break;

                  default:
                    cc.errorID(2626);
                }
                s.uvDirty = !1;
            },
            updateVerts: function(t, e, i) {
                var r = t._renderData, s = r._data, a = t.node, o = a.width, c = a.height, h = a.anchorX * o, l = a.anchorY * c, u = -h, _ = -l, d = o - h, f = c - l, p = void 0;
                switch (t._fillType) {
                  case n.HORIZONTAL:
                    p = u + (d - u) * i, u = u + (d - u) * e, d = p;
                    break;

                  case n.VERTICAL:
                    p = _ + (f - _) * i, _ = _ + (f - _) * e, f = p;
                    break;

                  default:
                    cc.errorID(2626);
                }
                s[4].x = u, s[4].y = _, s[5].x = d, s[5].y = _, s[6].x = u, s[6].y = f, s[7].x = d, 
                s[7].y = f, r.vertDirty = !1;
            },
            createData: function(t) {
                var e = t.requestRenderData();
                return e.dataLength = 8, e.vertexCount = 4, e.indiceCount = 6, e;
            },
            updateWorldVerts: function(t) {
                for (var e = t.node, i = t._renderData._data, n = e._worldMatrix, r = n.m00, s = n.m01, a = n.m04, o = n.m05, c = n.m12, h = n.m13, l = 0; l < 4; l++) {
                    var u = i[l + 4], _ = i[l];
                    _.x = u.x * r + u.y * a + c, _.y = u.x * s + u.y * o + h;
                }
            },
            fillBuffers: function(t, e) {
                e.worldMatDirty && this.updateWorldVerts(t);
                for (var i = t._renderData._data, n = t.node, r = n._color._val, s = n._worldMatrix, a = (s.m00, 
                s.m01, s.m04, s.m05, s.m12, s.m13, e._meshBuffer), o = a.request(4, 6), c = o.indiceOffset, h = o.byteOffset >> 2, l = o.vertexOffset, u = a._vData, _ = a._uintVData, d = 0; d < 4; d++) {
                    var f = i[d];
                    u[h++] = f.x, u[h++] = f.y, u[h++] = f.u, u[h++] = f.v, _[h++] = r;
                }
                var p = a._iData;
                p[c++] = l, p[c++] = l + 1, p[c++] = l + 2, p[c++] = l + 1, p[c++] = l + 3, p[c++] = l + 2;
            }
        };
    }, {
        "../../../../components/CCSprite": 37
    } ],
    140: [ function(t, e, i) {
        var n = t("../../../../components/CCSprite"), r = n.Type, s = n.FillType, a = t("./simple"), o = t("./sliced"), c = t("./tiled"), h = t("./radial-filled"), l = t("./bar-filled"), u = t("./mesh"), _ = {
            getAssembler: function(t) {
                var e = a;
                switch (t.type) {
                  case r.SLICED:
                    e = o;
                    break;

                  case r.TILED:
                    e = c;
                    break;

                  case r.FILLED:
                    e = t._fillType === s.RADIAL ? h : l;
                    break;

                  case r.MESH:
                    e = u;
                }
                return e;
            },
            updateRenderData: function(t) {
                return t.__allocedDatas;
            }
        };
        n._assembler = _, e.exports = _;
    }, {
        "../../../../components/CCSprite": 37,
        "./bar-filled": 139,
        "./mesh": 141,
        "./radial-filled": 142,
        "./simple": 143,
        "./sliced": 144,
        "./tiled": 145
    } ],
    141: [ function(t, e, i) {
        e.exports = {
            useModel: !1,
            createData: function(t) {
                return t.requestRenderData();
            },
            updateRenderData: function(t) {
                var e = t.spriteFrame;
                t._calDynamicAtlas();
                var i = t._renderData;
                if (i && e) {
                    var n = e.vertices;
                    if (n) i.vertexCount !== n.x.length && (i.vertexCount = n.x.length, i.indiceCount = n.triangles.length, 
                    i.dataLength = 2 * i.vertexCount, i.uvDirty = i.vertDirty = !0), i.uvDirty && this.updateUVs(t), 
                    i.vertDirty && (this.updateVerts(t), this.updateWorldVerts(t));
                }
            },
            updateUVs: function(t) {
                for (var e = t.getMaterial().effect.getProperty("texture"), i = (e._width, e._height, 
                t.spriteFrame.vertices), n = i.nu, r = i.nv, s = t._renderData, a = s._data, o = 0, c = n.length; o < c; o++) {
                    var h = a[o];
                    h.u = n[o], h.v = r[o];
                }
                s.uvDirty = !1;
            },
            updateVerts: function(t) {
                var e = t.node, i = Math.abs(e.width), n = Math.abs(e.height), r = e.anchorX * i, s = e.anchorY * n, a = t.spriteFrame, o = a.vertices, c = o.x, h = o.y, l = a._originalSize.width, u = a._originalSize.height, _ = a._rect.width, d = a._rect.height, f = a._offset.x + (l - _) / 2, p = a._offset.y + (u - d) / 2, m = i / (t.trim ? _ : l), v = n / (t.trim ? d : u), g = t._renderData, y = g._data;
                if (t.trim) for (var x = 0, E = c.length; x < E; x++) {
                    var T = y[x + E];
                    T.x = (c[x] - f) * m - r, T.y = (u - h[x] - p) * v - s;
                } else for (var C = 0, A = c.length; C < A; C++) {
                    var b = y[C + A];
                    b.x = c[C] * m - r, b.y = (u - h[C]) * v - s;
                }
                g.vertDirty = !1;
            },
            updateWorldVerts: function(t) {
                for (var e = t.node, i = t._renderData, n = i._data, r = e._worldMatrix, s = r.m00, a = r.m01, o = r.m04, c = r.m05, h = r.m12, l = r.m13, u = 0, _ = i.vertexCount; u < _; u++) {
                    var d = n[u + _], f = n[u];
                    f.x = d.x * s + d.y * o + h, f.y = d.x * a + d.y * c + l;
                }
            },
            fillBuffers: function(t, e) {
                var i = t.node._color._val, n = t._renderData, r = n._data, s = t.spriteFrame.vertices;
                if (s) {
                    e.worldMatDirty && this.updateWorldVerts(t);
                    for (var a = e._meshBuffer, o = a.request(n.vertexCount, n.indiceCount), c = o.indiceOffset, h = o.byteOffset >> 2, l = o.vertexOffset, u = a._vData, _ = a._uintVData, d = a._iData, f = 0, p = n.vertexCount; f < p; f++) {
                        var m = r[f];
                        u[h++] = m.x, u[h++] = m.y, u[h++] = m.u, u[h++] = m.v, _[h++] = i;
                    }
                    for (var v = s.triangles, g = 0, y = v.length; g < y; g++) d[c++] = l + v[g];
                }
            }
        };
    }, {} ],
    142: [ function(t, e, i) {
        var n = 2 * Math.PI;
        e.exports = {
            useModel: !1,
            _vertPos: [ cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0) ],
            _vertices: [ 0, 0, 0, 0 ],
            _uvs: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
            _intersectPoint_1: [ cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0) ],
            _intersectPoint_2: [ cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0) ],
            _center: cc.v2(0, 0),
            _triangles: [],
            createData: function(t) {
                return t.requestRenderData();
            },
            updateRenderData: function(t) {
                var e = t.spriteFrame;
                t._calDynamicAtlas();
                var i = t._renderData;
                if (i && e && (i.vertDirty || i.uvDirty)) {
                    var r = i._data, s = t._fillStart, a = t._fillRange;
                    for (a < 0 && (s += a, a = -a); s >= 1; ) s -= 1;
                    for (;s < 0; ) s += 1;
                    var o = (s *= n) + (a *= n);
                    this._calculateVertices(t), this._calculateUVs(e);
                    var c = this._center, h = this._vertPos, l = this._vertices, u = this._triangles;
                    this._calcInsectedPoints(l[0], l[2], l[1], l[3], c, s, this._intersectPoint_1), 
                    this._calcInsectedPoints(l[0], l[2], l[1], l[3], c, s + a, this._intersectPoint_2);
                    for (var _ = 0, d = 0; d < 4; ++d) {
                        var f = u[d];
                        if (f) if (a >= n) i.dataLength = _ + 3, this._generateTriangle(r, _, c, h[f[0]], h[f[1]]), 
                        _ += 3; else {
                            var p = this._getVertAngle(c, h[f[0]]), m = this._getVertAngle(c, h[f[1]]);
                            m < p && (m += n), p -= n, m -= n;
                            for (var v = 0; v < 3; ++v) p >= o || (p >= s ? (i.dataLength = _ + 3, m >= o ? this._generateTriangle(r, _, c, h[f[0]], this._intersectPoint_2[d]) : this._generateTriangle(r, _, c, h[f[0]], h[f[1]]), 
                            _ += 3) : m <= s || (m <= o ? (i.dataLength = _ + 3, this._generateTriangle(r, _, c, this._intersectPoint_1[d], h[f[1]]), 
                            _ += 3) : (i.dataLength = _ + 3, this._generateTriangle(r, _, c, this._intersectPoint_1[d], this._intersectPoint_2[d]), 
                            _ += 3))), p += n, m += n;
                        }
                    }
                    i.indiceCount = i.vertexCount = _, i.vertDirty = i.uvDirty = !1;
                }
            },
            _getVertAngle: function(t, e) {
                var i, n;
                if (i = e.x - t.x, n = e.y - t.y, 0 !== i || 0 !== n) {
                    if (0 === i) return n > 0 ? .5 * Math.PI : 1.5 * Math.PI;
                    var r = Math.atan(n / i);
                    return i < 0 && (r += Math.PI), r;
                }
            },
            _generateTriangle: function(t, e, i, n, r) {
                var s = this._vertices, a = s[0], o = s[1], c = s[2], h = s[3];
                t[e].x = i.x, t[e].y = i.y, t[e + 1].x = n.x, t[e + 1].y = n.y, t[e + 2].x = r.x, 
                t[e + 2].y = r.y;
                var l = void 0, u = void 0;
                l = (i.x - a) / (c - a), u = (i.y - o) / (h - o), this._generateUV(l, u, t, e), 
                l = (n.x - a) / (c - a), u = (n.y - o) / (h - o), this._generateUV(l, u, t, e + 1), 
                l = (r.x - a) / (c - a), u = (r.y - o) / (h - o), this._generateUV(l, u, t, e + 2);
            },
            _generateUV: function(t, e, i, n) {
                var r = this._uvs, s = r[0] + (r[2] - r[0]) * t, a = r[4] + (r[6] - r[4]) * t, o = r[1] + (r[3] - r[1]) * t, c = r[5] + (r[7] - r[5]) * t, h = i[n];
                h.u = s + (a - s) * e, h.v = o + (c - o) * e;
            },
            _calcInsectedPoints: function(t, e, i, n, r, s, a) {
                var o = Math.sin(s), c = Math.cos(s), h = void 0, l = void 0;
                if (0 !== Math.cos(s)) {
                    if (h = o / c, (t - r.x) * c > 0) {
                        var u = r.y + h * (t - r.x);
                        a[0].x = t, a[0].y = u;
                    }
                    if ((e - r.x) * c > 0) {
                        var _ = r.y + h * (e - r.x);
                        a[2].x = e, a[2].y = _;
                    }
                }
                if (0 !== Math.sin(s)) {
                    if (l = c / o, (n - r.y) * o > 0) {
                        var d = r.x + l * (n - r.y);
                        a[3].x = d, a[3].y = n;
                    }
                    if ((i - r.y) * o > 0) {
                        var f = r.x + l * (i - r.y);
                        a[1].x = f, a[1].y = i;
                    }
                }
            },
            _calculateVertices: function(t) {
                var e = t.node, i = e.width, n = e.height, r = e.anchorX * i, s = e.anchorY * n, a = -r, o = -s, c = i - r, h = n - s, l = this._vertices;
                l[0] = a, l[1] = o, l[2] = c, l[3] = h;
                var u = this._center, _ = t._fillCenter, d = u.x = Math.min(Math.max(0, _.x), 1) * (c - a) + a, f = u.y = Math.min(Math.max(0, _.y), 1) * (h - o) + o, p = this._vertPos;
                p[0].x = p[3].x = a, p[1].x = p[2].x = c, p[0].y = p[1].y = o, p[2].y = p[3].y = h;
                var m = this._triangles;
                m.length = 0, d !== l[0] && (m[0] = [ 3, 0 ]), d !== l[2] && (m[2] = [ 1, 2 ]), 
                f !== l[1] && (m[1] = [ 0, 1 ]), f !== l[3] && (m[3] = [ 2, 3 ]);
            },
            _calculateUVs: function(t) {
                var e = t._texture.width, i = t._texture.height, n = t._rect, r = void 0, s = void 0, a = void 0, o = void 0, c = this._uvs;
                t._rotated ? (r = n.x / e, s = (n.x + n.height) / e, a = n.y / i, o = (n.y + n.width) / i, 
                c[0] = c[2] = r, c[4] = c[6] = s, c[3] = c[7] = o, c[1] = c[5] = a) : (r = n.x / e, 
                s = (n.x + n.width) / e, a = n.y / i, o = (n.y + n.height) / i, c[0] = c[4] = r, 
                c[2] = c[6] = s, c[1] = c[3] = o, c[5] = c[7] = a);
            },
            fillBuffers: function(t, e) {
                for (var i = t._renderData, n = i._data, r = t.node, s = r._color._val, a = r._worldMatrix, o = a.m00, c = a.m01, h = a.m04, l = a.m05, u = a.m12, _ = a.m13, d = e._meshBuffer, f = d.request(i.vertexCount, i.indiceCount), p = f.indiceOffset, m = f.byteOffset >> 2, v = f.vertexOffset, g = d._iData, y = d._vData, x = d._uintVData, E = n.length, T = 0; T < E; T++) {
                    var C = n[T];
                    y[m++] = C.x * o + C.y * h + u, y[m++] = C.x * c + C.y * l + _, y[m++] = C.u, y[m++] = C.v, 
                    x[m++] = s;
                }
                for (var A = 0; A < E; A++) g[p + A] = v + A;
            }
        };
    }, {} ],
    143: [ function(t, e, i) {
        e.exports = {
            useModel: !1,
            updateRenderData: function(t) {
                var e = t._spriteFrame;
                t._calDynamicAtlas();
                var i = t._renderData;
                i && e && i.vertDirty && this.updateVerts(t);
            },
            fillBuffers: function(t, e) {
                var i = t._renderData._data, n = t.node, r = n._color._val, s = n._worldMatrix, a = s.m00, o = s.m01, c = s.m04, h = s.m05, l = s.m12, u = s.m13, _ = e._meshBuffer, d = _.request(4, 6), f = d.indiceOffset, p = d.byteOffset >> 2, m = d.vertexOffset, v = _._vData, g = _._uintVData, y = _._iData, x = t._spriteFrame.uv;
                v[p + 2] = x[0], v[p + 3] = x[1], v[p + 7] = x[2], v[p + 8] = x[3], v[p + 12] = x[4], 
                v[p + 13] = x[5], v[p + 17] = x[6], v[p + 18] = x[7];
                var E = i[0], T = i[3], C = E.x, A = T.x, b = E.y, w = T.y, D = a * C, S = a * A, R = o * C, M = o * A, O = c * b, L = c * w, I = h * b, F = h * w;
                v[p] = D + O + l, v[p + 1] = R + I + u, v[p + 5] = S + O + l, v[p + 6] = M + I + u, 
                v[p + 10] = D + L + l, v[p + 11] = R + F + u, v[p + 15] = S + L + l, v[p + 16] = M + F + u, 
                g[p + 4] = r, g[p + 9] = r, g[p + 14] = r, g[p + 19] = r, y[f++] = m, y[f++] = m + 1, 
                y[f++] = m + 2, y[f++] = m + 1, y[f++] = m + 3, y[f++] = m + 2;
            },
            createData: function(t) {
                var e = t.requestRenderData();
                return e.dataLength = 4, e.vertexCount = 4, e.indiceCount = 6, e;
            },
            updateVerts: function(t) {
                var e = t._renderData, i = t.node, n = e._data, r = i.width, s = i.height, a = i.anchorX * r, o = i.anchorY * s, c = void 0, h = void 0, l = void 0, u = void 0;
                if (t.trim) c = -a, h = -o, l = r - a, u = s - o; else {
                    var _ = t.spriteFrame, d = _._originalSize.width, f = _._originalSize.height, p = _._rect.width, m = _._rect.height, v = _._offset, g = r / d, y = s / f, x = v.x + (d - p) / 2, E = v.x - (d - p) / 2;
                    c = x * g - a, h = (v.y + (f - m) / 2) * y - o, l = r + E * g - a, u = s + (v.y - (f - m) / 2) * y - o;
                }
                n[0].x = c, n[0].y = h, n[3].x = l, n[3].y = u, e.vertDirty = !1;
            }
        };
    }, {} ],
    144: [ function(t, e, i) {
        e.exports = {
            useModel: !1,
            createData: function(t) {
                var e = t.requestRenderData();
                return e.dataLength = 20, e.vertexCount = 16, e.indiceCount = 54, e;
            },
            updateRenderData: function(t, e) {
                var i = t.spriteFrame;
                t._calDynamicAtlas();
                var n = t._renderData;
                n && i && (n.vertDirty && (this.updateVerts(t), this.updateWorldVerts(t)));
            },
            updateVerts: function(t) {
                var e = t._renderData, i = e._data, n = t.node, r = n.width, s = n.height, a = n.anchorX * r, o = n.anchorY * s, c = t.spriteFrame, h = c.insetLeft, l = c.insetRight, u = c.insetTop, _ = c.insetBottom, d = r - h - l, f = s - u - _, p = r / (h + l), m = s / (u + _);
                p = isNaN(p) || p > 1 ? 1 : p, m = isNaN(m) || m > 1 ? 1 : m, d = d < 0 ? 0 : d, 
                f = f < 0 ? 0 : f, i[0].x = -a, i[0].y = -o, i[1].x = h * p - a, i[1].y = _ * m - o, 
                i[2].x = i[1].x + d, i[2].y = i[1].y + f, i[3].x = r - a, i[3].y = s - o, e.vertDirty = !1;
            },
            fillBuffers: function(t, e) {
                e.worldMatDirty && this.updateWorldVerts(t);
                for (var i = t._renderData, n = t.node._color._val, r = i._data, s = e._meshBuffer, a = i.vertexCount, o = t.spriteFrame.uvSliced, c = s.request(a, i.indiceCount), h = c.indiceOffset, l = c.byteOffset >> 2, u = c.vertexOffset, _ = s._vData, d = s._uintVData, f = s._iData, p = 4; p < 20; ++p) {
                    var m = r[p], v = o[p - 4];
                    _[l++] = m.x, _[l++] = m.y, _[l++] = v.u, _[l++] = v.v, d[l++] = n;
                }
                for (var g = 0; g < 3; ++g) for (var y = 0; y < 3; ++y) {
                    var x = u + 4 * g + y;
                    f[h++] = x, f[h++] = x + 1, f[h++] = x + 4, f[h++] = x + 1, f[h++] = x + 5, f[h++] = x + 4;
                }
            },
            updateWorldVerts: function(t) {
                for (var e = t.node, i = t._renderData._data, n = e._worldMatrix, r = n.m00, s = n.m01, a = n.m04, o = n.m05, c = n.m12, h = n.m13, l = 0; l < 4; ++l) for (var u = i[l], _ = 0; _ < 4; ++_) {
                    var d = i[_], f = i[4 + 4 * l + _];
                    f.x = d.x * r + u.y * a + c, f.y = d.x * s + u.y * o + h;
                }
            }
        };
    }, {} ],
    145: [ function(t, e, i) {
        e.exports = {
            useModel: !1,
            createData: function(t) {
                return t.requestRenderData();
            },
            updateRenderData: function(t) {
                var e = t.spriteFrame;
                t._calDynamicAtlas();
                var i = t._renderData;
                if (e && i && (i.uvDirty || i.vertDirty)) {
                    var n = e._texture, r = (n.width, n.height, e._rect), s = t.node, a = Math.abs(s.width), o = Math.abs(s.height), c = s.anchorX * a, h = s.anchorY * o, l = r.width, u = r.height, _ = a / l, d = o / u, f = Math.ceil(d), p = Math.ceil(_), m = i._data;
                    i.dataLength = Math.max(8, f + 1, p + 1);
                    for (var v = 0; v <= p; ++v) m[v].x = Math.min(l * v, a) - c;
                    for (var g = 0; g <= f; ++g) m[g].y = Math.min(u * g, o) - h;
                    i.vertexCount = f * p * 4, i.indiceCount = f * p * 6, i.uvDirty = !1, i.vertDirty = !1;
                }
            },
            fillBuffers: function(t, e) {
                for (var i = t.node, n = i._color._val, r = t._renderData, s = r._data, a = e._meshBuffer, o = a.request(r.vertexCount, r.indiceCount), c = o.indiceOffset, h = o.byteOffset >> 2, l = o.vertexOffset, u = a._vData, _ = a._uintVData, d = a._iData, f = t.spriteFrame._rotated, p = t.spriteFrame.uv, m = t.spriteFrame._rect, v = Math.abs(i.width), g = Math.abs(i.height), y = v / m.width, x = g / m.height, E = Math.ceil(x), T = Math.ceil(y), C = i._worldMatrix, A = C.m00, b = C.m01, w = C.m04, D = C.m05, S = C.m12, R = C.m13, M = void 0, O = void 0, L = void 0, I = void 0, F = void 0, P = void 0, N = 0, B = E; N < B; ++N) {
                    L = s[N].y, I = s[N + 1].y, P = Math.min(1, x - N);
                    for (var z = 0, k = T; z < k; ++z) F = Math.min(1, y - z), M = s[z].x, O = s[z + 1].x, 
                    u[h] = M * A + L * w + S, u[h + 1] = M * b + L * D + R, u[h + 5] = O * A + L * w + S, 
                    u[h + 6] = O * b + L * D + R, u[h + 10] = M * A + I * w + S, u[h + 11] = M * b + I * D + R, 
                    u[h + 15] = O * A + I * w + S, u[h + 16] = O * b + I * D + R, f ? (u[h + 2] = p[0], 
                    u[h + 3] = p[1], u[h + 7] = p[0], u[h + 8] = p[1] + (p[7] - p[1]) * F, u[h + 12] = p[0] + (p[6] - p[0]) * P, 
                    u[h + 13] = p[1], u[h + 17] = u[h + 12], u[h + 18] = u[h + 8]) : (u[h + 2] = p[0], 
                    u[h + 3] = p[1], u[h + 7] = p[0] + (p[6] - p[0]) * F, u[h + 8] = p[1], u[h + 12] = p[0], 
                    u[h + 13] = p[1] + (p[7] - p[1]) * P, u[h + 17] = u[h + 7], u[h + 18] = u[h + 13]), 
                    _[h + 4] = n, _[h + 9] = n, _[h + 14] = n, _[h + 19] = n, h += 20;
                }
                for (var U = r.indiceCount, H = 0; H < U; H += 6) d[c++] = l, d[c++] = l + 1, d[c++] = l + 2, 
                d[c++] = l + 1, d[c++] = l + 3, d[c++] = l + 2, l += 4;
            }
        };
    }, {} ],
    146: [ function(t, e, i) {
        var n = t("../render-engine").gfx, r = cc.Class({
            name: "cc.MeshBuffer",
            ctor: function(t, e) {
                this.byteStart = 0, this.byteOffset = 0, this.indiceStart = 0, this.indiceOffset = 0, 
                this.vertexStart = 0, this.vertexOffset = 0, this._vertexFormat = e, this._vertexBytes = this._vertexFormat._bytes, 
                this._arrOffset = 0, this._vbArr = [], this._vb = new n.VertexBuffer(t._device, e, n.USAGE_DYNAMIC, new ArrayBuffer(), 0), 
                this._vbArr[0] = this._vb, this._ibArr = [], this._ib = new n.IndexBuffer(t._device, n.INDEX_FMT_UINT16, n.USAGE_STATIC, new ArrayBuffer(), 0), 
                this._ibArr[0] = this._ib, this._vData = null, this._uintVData = null, this._iData = null, 
                this._batcher = t, this._initVDataCount = 256 * e._bytes, this._initIDataCount = 1536, 
                this._offsetInfo = {
                    byteOffset: 0,
                    vertexOffset: 0,
                    indiceOffset: 0
                }, this._reallocBuffer();
            },
            uploadData: function() {
                if (0 !== this.byteOffset && this._dirty) {
                    var t = new Float32Array(this._vData.buffer, 0, this.byteOffset >> 2), e = new Uint16Array(this._iData.buffer, 0, this.indiceOffset);
                    this._vb.update(0, t), this._ib.update(0, e), this._dirty = !1;
                }
            },
            checkAndSwitchBuffer: function(t) {
                if (this.vertexOffset + t > 65535) {
                    this.uploadData(), this._batcher._flush();
                    var e = ++this._arrOffset;
                    this.byteStart = 0, this.byteOffset = 0, this.vertexStart = 0, this.vertexOffset = 0, 
                    this.indiceStart = 0, this.indiceOffset = 0, e < this._vbArr.length ? (this._vb = this._vbArr[e], 
                    this._ib = this._ibArr[e]) : (this._vb = new n.VertexBuffer(this._batcher._device, this._vertexFormat, n.USAGE_DYNAMIC, new ArrayBuffer(), 0), 
                    this._vbArr[e] = this._vb, this._vb._bytes = this._vData.byteLength, this._ib = new n.IndexBuffer(this._batcher._device, n.INDEX_FMT_UINT16, n.USAGE_STATIC, new ArrayBuffer(), 0), 
                    this._ibArr[e] = this._ib, this._ib._bytes = this._iData.byteLength);
                }
            },
            requestStatic: function(t, e) {
                this.checkAndSwitchBuffer(t);
                var i = this.byteOffset + t * this._vertexBytes, n = this.indiceOffset + e, r = this._vData.byteLength, s = this._iData.length;
                if (i > r || n > s) {
                    for (;r < i || s < n; ) this._initVDataCount *= 2, this._initIDataCount *= 2, r = 4 * this._initVDataCount, 
                    s = this._initIDataCount;
                    this._reallocBuffer();
                }
                var a = this._offsetInfo;
                a.vertexOffset = this.vertexOffset, this.vertexOffset += t, a.indiceOffset = this.indiceOffset, 
                this.indiceOffset += e, a.byteOffset = this.byteOffset, this.byteOffset = i, this._dirty = !0;
            },
            request: function(t, e) {
                return this._batcher._buffer !== this && (this._batcher._flush(), this._batcher._buffer = this), 
                this.requestStatic(t, e), this._offsetInfo;
            },
            _reallocBuffer: function() {
                this._reallocVData(!0), this._reallocIData(!0);
            },
            _reallocVData: function(t) {
                var e = void 0;
                this._vData && (e = new Uint8Array(this._vData.buffer)), this._vData = new Float32Array(this._initVDataCount), 
                this._uintVData = new Uint32Array(this._vData.buffer);
                var i = new Uint8Array(this._uintVData.buffer);
                if (e && t) for (var n = 0, r = e.length; n < r; n++) i[n] = e[n];
                this._vb._bytes = this._vData.byteLength;
            },
            _reallocIData: function(t) {
                var e = this._iData;
                if (this._iData = new Uint16Array(this._initIDataCount), e && t) for (var i = this._iData, n = 0, r = e.length; n < r; n++) i[n] = e[n];
                this._ib._bytes = this._iData.byteLength;
            },
            reset: function() {
                this._arrOffset = 0, this._vb = this._vbArr[0], this._ib = this._ibArr[0], this.byteStart = 0, 
                this.byteOffset = 0, this.indiceStart = 0, this.indiceOffset = 0, this.vertexStart = 0, 
                this.vertexOffset = 0, this._dirty = !1;
            },
            destroy: function() {
                for (var t in this._vbArr) {
                    this._vbArr[t].destroy();
                }
                for (var e in this._vbArr = void 0, this._ibArr) {
                    this._ibArr[e].destroy();
                }
                this._ibArr = void 0, this._ib = void 0, this._vb = void 0;
            }
        });
        cc.MeshBuffer = e.exports = r;
    }, {
        "../render-engine": 124
    } ],
    147: [ function(t, e, i) {
        var n = t("../render-engine"), r = t("./vertex-format").vfmtPosUvColor, s = t("./stencil-manager"), a = t("./quad-buffer"), o = t("./mesh-buffer"), c = t("./spine-buffer"), h = new (t("../../platform/id-generater"))("VertextFormat"), l = n.RecyclePool, u = n.InputAssembler, _ = {}, d = new n.Material();
        d.updateHash();
        var f = function(t, e) {
            this._renderScene = e, this._device = t, this._stencilMgr = s.sharedManager, this.walking = !1, 
            this.material = d, this.cullingMask = 1, this._iaPool = new l(function() {
                return new u();
            }, 16), this._modelPool = new l(function() {
                return new n.Model();
            }, 16), this._quadBuffer = this.getBuffer("quad", r), this._meshBuffer = this.getBuffer("mesh", r), 
            this._buffer = this._quadBuffer, this._batchedModels = [], this._dummyNode = new cc.Node(), 
            this._sortKey = 0, this.node = this._dummyNode, this.parentOpacity = 1, this.parentOpacityDirty = 0, 
            this.worldMatDirty = 0;
        };
        f.prototype = {
            constructor: f,
            reset: function() {
                this._iaPool.reset();
                for (var t = this._renderScene, e = this._batchedModels, i = 0; i < e.length; ++i) e[i].clearInputAssemblers(), 
                e[i].clearEffects(), t.removeModel(e[i]);
                for (var n in this._modelPool.reset(), e.length = 0, this._sortKey = 0, _) _[n].reset();
                this._buffer = this._quadBuffer, this.node = this._dummyNode, this.material = d, 
                this.cullingMask = 1, this.parentOpacity = 1, this.parentOpacityDirty = 0, this.worldMatDirty = 0, 
                this._stencilMgr.reset();
            },
            _flush: function() {
                var t = this.material, e = this._buffer, i = e.indiceStart, n = e.indiceOffset - i;
                if (this.walking && t && !(n <= 0)) {
                    var r = t.effect, s = this._iaPool.add();
                    s._vertexBuffer = e._vb, s._indexBuffer = e._ib, s._start = i, s._count = n, this._stencilMgr.handleEffect(r);
                    var a = this._modelPool.add();
                    this._batchedModels.push(a), a.sortKey = this._sortKey++, a._cullingMask = this.cullingMask, 
                    a.setNode(this.node), a.addEffect(r), a.addInputAssembler(s), this._renderScene.addModel(a), 
                    e.byteStart = e.byteOffset, e.indiceStart = e.indiceOffset, e.vertexStart = e.vertexOffset;
                }
            },
            _flushIA: function(t) {
                var e = t.material;
                if (t.ia && e) {
                    this.material = e;
                    var i = this._stencilMgr.handleEffect(e.effect), n = this._modelPool.add();
                    this._batchedModels.push(n), n.sortKey = this._sortKey++, n._cullingMask = this.cullingMask, 
                    n.setNode(this.node), n.addEffect(i), n.addInputAssembler(t.ia), this._renderScene.addModel(n);
                }
            },
            _commitComp: function(t, e, i) {
                this.material._hash === t._material._hash && this.cullingMask === i || (this._flush(), 
                this.node = e.useModel ? t.node : this._dummyNode, this.material = t._material, 
                this.cullingMask = i), e.fillBuffers(t, this);
            },
            _commitIA: function(t, e, i) {
                this._flush(), this.cullingMask = i, this.material = t._material, this.node = e.useModel ? t.node : this._dummyNode, 
                e.renderIA(t, this);
            },
            terminate: function() {
                for (var t in cc.dynamicAtlasManager && cc.dynamicAtlasManager.enabled && cc.dynamicAtlasManager.update(), 
                this._flush(), _) _[t].uploadData();
                this.walking = !1;
            },
            getBuffer: function(t, e) {
                e.name || (e.name = h.getNewId());
                var i = t + e.name, n = _[i];
                if (!n) {
                    if ("mesh" === t) n = new o(this, e); else if ("quad" === t) n = new a(this, e); else {
                        if ("spine" !== t) return cc.error("Not support buffer type [" + t + "]"), null;
                        n = new c(this, e);
                    }
                    _[i] = n;
                }
                return n;
            }
        }, e.exports = f;
    }, {
        "../../platform/id-generater": 98,
        "../render-engine": 124,
        "./mesh-buffer": 146,
        "./quad-buffer": 148,
        "./spine-buffer": 149,
        "./stencil-manager": 150,
        "./vertex-format": 151
    } ],
    148: [ function(t, e, i) {
        var n = t("./mesh-buffer"), r = cc.Class({
            name: "cc.QuadBuffer",
            extends: n,
            _fillQuadBuffer: function() {
                for (var t = this._initIDataCount / 6, e = this._iData, i = 0, n = 0; i < t; i++) {
                    var r = 4 * i;
                    e[n++] = r, e[n++] = r + 1, e[n++] = r + 2, e[n++] = r + 1, e[n++] = r + 3, e[n++] = r + 2;
                }
                var s = new Uint16Array(this._iData.buffer, 0, 6 * t);
                this._ib.update(0, s);
            },
            uploadData: function() {
                if (0 !== this.byteOffset && this._dirty) {
                    var t = new Float32Array(this._vData.buffer, 0, this.byteOffset >> 2);
                    this._vb.update(0, t), this._dirty = !1;
                }
            },
            _reallocBuffer: function() {
                this._reallocVData(!0), this._reallocIData(), this._fillQuadBuffer();
            }
        });
        cc.QuadBuffer = e.exports = r;
    }, {
        "./mesh-buffer": 146
    } ],
    149: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.SpineBuffer",
            extends: t("./mesh-buffer"),
            requestStatic: function(t, e) {
                this.checkAndSwitchBuffer(t);
                var i = this.byteOffset + t * this._vertexBytes, n = this.indiceOffset + e, r = this._vData.byteLength, s = this._iData.length;
                if (i > r || n > s) {
                    for (;r < i || s < n; ) this._initVDataCount *= 2, this._initIDataCount *= 2, r = 4 * this._initVDataCount, 
                    s = this._initIDataCount;
                    this._reallocBuffer();
                }
                var a = this._offsetInfo;
                a.vertexOffset = this.vertexOffset, a.indiceOffset = this.indiceOffset, a.byteOffset = this.byteOffset;
            },
            adjust: function(t, e) {
                this.vertexOffset += t, this.indiceOffset += e, this.byteOffset = this.byteOffset + t * this._vertexBytes, 
                this._dirty = !0;
            }
        });
        cc.SpineBuffer = e.exports = n;
    }, {
        "./mesh-buffer": 146
    } ],
    150: [ function(t, e, i) {
        var n = t("../render-engine").gfx, r = cc.Enum({
            DISABLED: 0,
            CLEAR: 1,
            ENTER_LEVEL: 2,
            ENABLED: 3,
            EXIT_LEVEL: 4
        });
        function s() {
            this._maxLevel = 8, this._maskStack = [], this.stage = r.DISABLED;
        }
        s.prototype = {
            constructor: s,
            reset: function() {
                this._maskStack.length = 0, this.stage = r.DISABLED;
            },
            handleEffect: function(t) {
                var e = t.getTechnique("transparent").passes;
                if (this.stage === r.DISABLED) {
                    this.stage = r.DISABLED;
                    for (var i = 0; i < e.length; ++i) {
                        var s = e[i];
                        s._stencilTest && s.disableStencilTest();
                    }
                    return t;
                }
                var a = void 0, o = void 0, c = void 0, h = void 0, l = void 0, u = void 0, _ = n.STENCIL_OP_KEEP, d = n.STENCIL_OP_KEEP;
                this.stage === r.ENABLED ? (a = this._maskStack[this._maskStack.length - 1], o = n.DS_FUNC_EQUAL, 
                u = n.STENCIL_OP_KEEP, h = c = this.getStencilRef(), l = this.getWriteMask()) : this.stage === r.CLEAR ? (a = this._maskStack[this._maskStack.length - 1], 
                o = n.DS_FUNC_NEVER, u = a.inverted ? n.STENCIL_OP_REPLACE : n.STENCIL_OP_ZERO, 
                h = c = this.getWriteMask(), l = c) : this.stage === r.ENTER_LEVEL && (a = this._maskStack[this._maskStack.length - 1], 
                o = n.DS_FUNC_NEVER, u = a.inverted ? n.STENCIL_OP_ZERO : n.STENCIL_OP_REPLACE, 
                h = c = this.getWriteMask(), l = c);
                for (var f = 0; f < e.length; ++f) {
                    var p = e[f];
                    p.setStencilFront(o, c, h, u, _, d, l), p.setStencilBack(o, c, h, u, _, d, l);
                }
                return t;
            },
            pushMask: function(t) {
                this._maskStack.length + 1 > this._maxLevel && cc.errorID(9e3, this._maxLevel), 
                this._maskStack.push(t);
            },
            clear: function() {
                this.stage = r.CLEAR;
            },
            enterLevel: function() {
                this.stage = r.ENTER_LEVEL;
            },
            enableMask: function() {
                this.stage = r.ENABLED;
            },
            exitMask: function() {
                0 === this._maskStack.length && cc.errorID(9001), this._maskStack.pop(), 0 === this._maskStack.length ? this.stage = r.DISABLED : this.stage = r.ENABLED;
            },
            getWriteMask: function() {
                return 1 << this._maskStack.length - 1;
            },
            getExitWriteMask: function() {
                return 1 << this._maskStack.length;
            },
            getStencilRef: function() {
                for (var t = 0, e = 0; e < this._maskStack.length; ++e) t += 1 << e;
                return t;
            },
            getInvertedRef: function() {
                for (var t = 0, e = 0; e < this._maskStack.length - 1; ++e) t += 1 << e;
                return t;
            }
        }, s.sharedManager = new s(), s.Stage = r, e.exports = cc.StencilManager = s;
    }, {
        "../render-engine": 124
    } ],
    151: [ function(t, e, i) {
        var n = t("../render-engine").gfx, r = new n.VertexFormat([ {
            name: n.ATTR_POSITION,
            type: n.ATTR_TYPE_FLOAT32,
            num: 3
        }, {
            name: n.ATTR_UV0,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        }, {
            name: n.ATTR_COLOR,
            type: n.ATTR_TYPE_UINT8,
            num: 4,
            normalize: !0
        } ]);
        r.name = "vfmt3D", n.VertexFormat.XYZ_UV_Color = r;
        var s = new n.VertexFormat([ {
            name: n.ATTR_POSITION,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        }, {
            name: n.ATTR_UV0,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        }, {
            name: n.ATTR_COLOR,
            type: n.ATTR_TYPE_UINT8,
            num: 4,
            normalize: !0
        } ]);
        s.name = "vfmtPosUvColor", n.VertexFormat.XY_UV_Color = s;
        var a = new n.VertexFormat([ {
            name: n.ATTR_POSITION,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        }, {
            name: n.ATTR_UV0,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        }, {
            name: n.ATTR_COLOR,
            type: n.ATTR_TYPE_UINT8,
            num: 4,
            normalize: !0
        }, {
            name: n.ATTR_COLOR0,
            type: n.ATTR_TYPE_UINT8,
            num: 4,
            normalize: !0
        } ]);
        a.name = "vfmtPosUvTwoColor", n.VertexFormat.XY_UV_Two_Color = a;
        var o = new n.VertexFormat([ {
            name: n.ATTR_POSITION,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        }, {
            name: n.ATTR_UV0,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        } ]);
        o.name = "vfmtPosUv", n.VertexFormat.XY_UV = o;
        var c = new n.VertexFormat([ {
            name: n.ATTR_POSITION,
            type: n.ATTR_TYPE_FLOAT32,
            num: 2
        }, {
            name: n.ATTR_COLOR,
            type: n.ATTR_TYPE_UINT8,
            num: 4,
            normalize: !0
        } ]);
        c.name = "vfmtPosColor", n.VertexFormat.XY_Color = c, e.exports = {
            vfmt3D: r,
            vfmtPosUvColor: s,
            vfmtPosUvTwoColor: a,
            vfmtPosUv: o,
            vfmtPosColor: c
        };
    }, {
        "../render-engine": 124
    } ],
    152: [ function(t, e, i) {
        t("../platform/CCSys");
        var n = /(\.[^\.\/\?\\]*)(\?.*)?$/, r = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/, s = /[^\.\/]+\/\.\.\//;
        cc.path = {
            join: function() {
                for (var t = arguments.length, e = "", i = 0; i < t; i++) e = (e + ("" === e ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
                return e;
            },
            extname: function(t) {
                var e = n.exec(t);
                return e ? e[1] : "";
            },
            mainFileName: function(t) {
                if (t) {
                    var e = t.lastIndexOf(".");
                    if (-1 !== e) return t.substring(0, e);
                }
                return t;
            },
            basename: function(t, e) {
                var i = t.indexOf("?");
                i > 0 && (t = t.substring(0, i));
                var n = /(\/|\\)([^\/\\]+)$/g.exec(t.replace(/(\/|\\)$/, ""));
                if (!n) return null;
                var r = n[2];
                return e && t.substring(t.length - e.length).toLowerCase() === e.toLowerCase() ? r.substring(0, r.length - e.length) : r;
            },
            dirname: function(t) {
                var e = r.exec(t);
                return e ? e[2] : "";
            },
            changeExtname: function(t, e) {
                e = e || "";
                var i = t.indexOf("?"), n = "";
                return i > 0 && (n = t.substring(i), t = t.substring(0, i)), (i = t.lastIndexOf(".")) < 0 ? t + e + n : t.substring(0, i) + e + n;
            },
            changeBasename: function(t, e, i) {
                if (0 === e.indexOf(".")) return this.changeExtname(t, e);
                var n = t.indexOf("?"), r = "", s = i ? this.extname(t) : "";
                return n > 0 && (r = t.substring(n), t = t.substring(0, n)), n = (n = t.lastIndexOf("/")) <= 0 ? 0 : n + 1, 
                t.substring(0, n) + e + s + r;
            },
            _normalize: function(t) {
                var e = t = String(t);
                do {
                    e = t, t = t.replace(s, "");
                } while (e.length !== t.length);
                return t;
            },
            sep: cc.sys.os === cc.sys.OS_WINDOWS ? "\\" : "/",
            stripSep: function(t) {
                return t.replace(/[\/\\]$/, "");
            }
        }, e.exports = cc.path;
    }, {
        "../platform/CCSys": 91
    } ],
    153: [ function(t, e, i) {
        var n = function(t, e, i, n, r, s) {
            this.a = t, this.b = e, this.c = i, this.d = n, this.tx = r, this.ty = s;
        };
        n.create = function(t, e, i, n, r, s) {
            return {
                a: t,
                b: e,
                c: i,
                d: n,
                tx: r,
                ty: s
            };
        }, n.identity = function() {
            return {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                tx: 0,
                ty: 0
            };
        }, n.clone = function(t) {
            return {
                a: t.a,
                b: t.b,
                c: t.c,
                d: t.d,
                tx: t.tx,
                ty: t.ty
            };
        }, n.concat = function(t, e, i) {
            var n = e.a, r = e.b, s = e.c, a = e.d, o = e.tx, c = e.ty;
            return t.a = n * i.a + r * i.c, t.b = n * i.b + r * i.d, t.c = s * i.a + a * i.c, 
            t.d = s * i.b + a * i.d, t.tx = o * i.a + c * i.c + i.tx, t.ty = o * i.b + c * i.d + i.ty, 
            t;
        }, n.invert = function(t, e) {
            var i = e.a, n = e.b, r = e.c, s = e.d, a = 1 / (i * s - n * r), o = e.tx, c = e.ty;
            return t.a = a * s, t.b = -a * n, t.c = -a * r, t.d = a * i, t.tx = a * (r * c - s * o), 
            t.ty = a * (n * o - i * c), t;
        }, n.fromMat4 = function(t, e) {
            return t.a = e.m00, t.b = e.m01, t.c = e.m04, t.d = e.m05, t.tx = e.m12, t.ty = e.m13, 
            t;
        }, n.transformVec2 = function(t, e, i, n) {
            var r, s;
            return void 0 === n ? (n = i, r = e.x, s = e.y) : (r = e, s = i), t.x = n.a * r + n.c * s + n.tx, 
            t.y = n.b * r + n.d * s + n.ty, t;
        }, n.transformSize = function(t, e, i) {
            return t.width = i.a * e.width + i.c * e.height, t.height = i.b * e.width + i.d * e.height, 
            t;
        }, n.transformRect = function(t, e, i) {
            var n = e.x, r = e.y, s = n + e.width, a = r + e.height, o = i.a * n + i.c * r + i.tx, c = i.b * n + i.d * r + i.ty, h = i.a * s + i.c * r + i.tx, l = i.b * s + i.d * r + i.ty, u = i.a * n + i.c * a + i.tx, _ = i.b * n + i.d * a + i.ty, d = i.a * s + i.c * a + i.tx, f = i.b * s + i.d * a + i.ty, p = Math.min(o, h, u, d), m = Math.max(o, h, u, d), v = Math.min(c, l, _, f), g = Math.max(c, l, _, f);
            return t.x = p, t.y = v, t.width = m - p, t.height = g - v, t;
        }, n.transformObb = function(t, e, i, n, r, s) {
            var a = r.x, o = r.y, c = r.width, h = r.height, l = s.a * a + s.c * o + s.tx, u = s.b * a + s.d * o + s.ty, _ = s.a * c, d = s.b * c, f = s.c * h, p = s.d * h;
            e.x = l, e.y = u, i.x = _ + l, i.y = d + u, t.x = f + l, t.y = p + u, n.x = _ + f + l, 
            n.y = d + p + u;
        }, cc.AffineTransform = e.exports = n;
    }, {} ],
    154: [ function(t, e, i) {
        var n = t("../platform/CCObject").Flags, r = t("./misc"), s = t("../platform/js"), a = t("../platform/id-generater"), o = t("../event-manager"), c = t("../renderer/render-flow"), h = n.Destroying, l = n.DontDestroy, u = n.Deactivating, _ = new a("Node");
        function d(t) {
            return t ? "string" == typeof t ? s.getClassByName(t) : t : (cc.errorID(3804), null);
        }
        function f(t, e) {
            if (e._sealed) for (var i = 0; i < t._components.length; ++i) {
                var n = t._components[i];
                if (n.constructor === e) return n;
            } else for (var r = 0; r < t._components.length; ++r) {
                var s = t._components[r];
                if (s instanceof e) return s;
            }
            return null;
        }
        function p(t, e, i) {
            if (e._sealed) for (var n = 0; n < t._components.length; ++n) {
                var r = t._components[n];
                r.constructor === e && i.push(r);
            } else for (var s = 0; s < t._components.length; ++s) {
                var a = t._components[s];
                a instanceof e && i.push(a);
            }
        }
        var m = cc.Class({
            name: "cc._BaseNode",
            extends: cc.Object,
            properties: {
                _parent: null,
                _children: [],
                _active: !0,
                _level: 0,
                _components: [],
                _prefab: null,
                _persistNode: {
                    get: function() {
                        return (this._objFlags & l) > 0;
                    },
                    set: function(t) {
                        t ? this._objFlags |= l : this._objFlags &= ~l;
                    }
                },
                name: {
                    get: function() {
                        return this._name;
                    },
                    set: function(t) {
                        this._name = t;
                    }
                },
                uuid: {
                    get: function() {
                        return this._id;
                    }
                },
                children: {
                    get: function() {
                        return this._children;
                    }
                },
                childrenCount: {
                    get: function() {
                        return this._children.length;
                    }
                },
                active: {
                    get: function() {
                        return this._active;
                    },
                    set: function(t) {
                        if (t = !!t, this._active !== t) {
                            this._active = t;
                            var e = this._parent;
                            if (e) e._activeInHierarchy && cc.director._nodeActivator.activateNode(this, t);
                        }
                    }
                },
                activeInHierarchy: {
                    get: function() {
                        return this._activeInHierarchy;
                    }
                }
            },
            ctor: function(t) {
                this._name = void 0 !== t ? t : "New Node", this._activeInHierarchy = !1, this._id = _.getNewId(), 
                cc.director._scheduler && cc.director._scheduler.enableForTarget(this), this.__eventTargets = [], 
                this._renderFlag = c.FLAG_TRANSFORM;
            },
            getParent: function() {
                return this._parent;
            },
            setParent: function(t) {
                if (this._parent !== t) {
                    0;
                    var e = this._parent;
                    if (this._parent = t || null, this._onSetParent(t), t && (this._level = t._level + 1, 
                    o._setDirtyForNode(this), t._children.push(this), t.emit && t.emit("child-added", this), 
                    t._renderFlag |= c.FLAG_CHILDREN), e) {
                        if (!(e._objFlags & h)) {
                            var i = e._children.indexOf(this);
                            0, e._children.splice(i, 1), e.emit && e.emit("child-removed", this), this._onHierarchyChanged(e), 
                            0 === e._children.length && (e._renderFlag &= ~c.FLAG_CHILDREN);
                        }
                    } else t && this._onHierarchyChanged(null);
                }
            },
            attr: function(t) {
                s.mixin(this, t);
            },
            getChildByUuid: function(t) {
                if (!t) return cc.log("Invalid uuid"), null;
                for (var e = this._children, i = 0, n = e.length; i < n; i++) if (e[i]._id === t) return e[i];
                return null;
            },
            getChildByName: function(t) {
                if (!t) return cc.log("Invalid name"), null;
                for (var e = this._children, i = 0, n = e.length; i < n; i++) if (e[i]._name === t) return e[i];
                return null;
            },
            addChild: function(t) {
                cc.assertID(t, 1606), cc.assertID(null === t._parent, 1605), t.setParent(this);
            },
            insertChild: function(t, e) {
                t.parent = this, t.setSiblingIndex(e);
            },
            getSiblingIndex: function() {
                return this._parent ? this._parent._children.indexOf(this) : 0;
            },
            setSiblingIndex: function(t) {
                if (this._parent) if (this._parent._objFlags & u) cc.errorID(3821); else {
                    var e = this._parent._children;
                    t = -1 !== t ? t : e.length - 1;
                    var i = e.indexOf(this);
                    t !== i && (e.splice(i, 1), t < e.length ? e.splice(t, 0, this) : e.push(this), 
                    this._onSiblingIndexChanged && this._onSiblingIndexChanged(t));
                }
            },
            walk: function(t, e) {
                var i, n, r, s, a = cc._BaseNode, o = 1, c = a._stacks[a._stackId];
                c || (c = [], a._stacks.push(c)), a._stackId++, c.length = 0, c[0] = this;
                var h = null;
                for (s = !1; o; ) if (n = c[--o]) if (!s && t ? t(n) : s && e && e(n), c[o] = null, 
                s) {
                    if (s = !1, i) if (i[++r]) c[o] = i[r], o++; else if (h && (c[o] = h, o++, s = !0, 
                    h._parent ? (r = (i = h._parent._children).indexOf(h), h = h._parent) : (h = null, 
                    i = null), r < 0)) break;
                } else n._children.length > 0 ? (h = n, i = n._children, r = 0, c[o] = i[r], o++) : (c[o] = n, 
                o++, s = !0);
                c.length = 0, a._stackId--;
            },
            cleanup: function() {},
            removeFromParent: function(t) {
                this._parent && (void 0 === t && (t = !0), this._parent.removeChild(this, t));
            },
            removeChild: function(t, e) {
                this._children.indexOf(t) > -1 && ((e || void 0 === e) && t.cleanup(), t.parent = null);
            },
            removeAllChildren: function(t) {
                var e = this._children;
                void 0 === t && (t = !0);
                for (var i = e.length - 1; i >= 0; i--) {
                    var n = e[i];
                    n && (t && n.cleanup(), n.parent = null);
                }
                this._children.length = 0;
            },
            isChildOf: function(t) {
                var e = this;
                do {
                    if (e === t) return !0;
                    e = e._parent;
                } while (e);
                return !1;
            },
            getComponent: function(t) {
                var e = d(t);
                return e ? f(this, e) : null;
            },
            getComponents: function(t) {
                var e = d(t), i = [];
                return e && p(this, e, i), i;
            },
            getComponentInChildren: function(t) {
                var e = d(t);
                return e ? function t(e, i) {
                    for (var n = 0; n < e.length; ++n) {
                        var r = e[n], s = f(r, i);
                        if (s) return s;
                        if (r._children.length > 0 && (s = t(r._children, i))) return s;
                    }
                    return null;
                }(this._children, e) : null;
            },
            getComponentsInChildren: function(t) {
                var e = d(t), i = [];
                return e && (p(this, e, i), function t(e, i, n) {
                    for (var r = 0; r < e.length; ++r) {
                        var s = e[r];
                        p(s, i, n), s._children.length > 0 && t(s._children, i, n);
                    }
                }(this._children, e, i)), i;
            },
            _checkMultipleComp: !1,
            addComponent: function(t) {
                var e;
                if ("string" == typeof t) {
                    if (!(e = s.getClassByName(t))) return cc.errorID(3807, t), cc._RFpeek() && cc.errorID(3808, t), 
                    null;
                } else {
                    if (!t) return cc.errorID(3804), null;
                    e = t;
                }
                if ("function" != typeof e) return cc.errorID(3809), null;
                if (!s.isChildClassOf(e, cc.Component)) return cc.errorID(3810), null;
                var i = e._requireComponent;
                if (i && !this.getComponent(i) && !this.addComponent(i)) return null;
                var n = new e();
                return n.node = this, this._components.push(n), this._activeInHierarchy && cc.director._nodeActivator.activateComp(n), 
                n;
            },
            _addComponentAt: !1,
            removeComponent: function(t) {
                t ? (t instanceof cc.Component || (t = this.getComponent(t)), t && t.destroy()) : cc.errorID(3813);
            },
            _getDependComponent: !1,
            _removeComponent: function(t) {
                if (t) {
                    if (!(this._objFlags & h)) {
                        var e = this._components.indexOf(t);
                        -1 !== e ? this._components.splice(e, 1) : t.node !== this && cc.errorID(3815);
                    }
                } else cc.errorID(3814);
            },
            destroy: function() {
                cc.Object.prototype.destroy.call(this) && (this.active = !1);
            },
            destroyAllChildren: function() {
                for (var t = this._children, e = 0; e < t.length; ++e) t[e].destroy();
            },
            _onSetParent: function(t) {},
            _onPostActivated: function() {},
            _onBatchRestored: function() {},
            _onBatchCreated: function() {},
            _onHierarchyChanged: function(t) {
                var e = this._parent;
                !this._persistNode || e instanceof cc.Scene || cc.game.removePersistRootNode(this);
                var i = this._active && !(!e || !e._activeInHierarchy);
                this._activeInHierarchy !== i && cc.director._nodeActivator.activateNode(this, i);
            },
            _instantiate: function(t) {
                t || (t = cc.instantiate._clone(this, this));
                var e = this._prefab;
                e && this === e.root && e.sync;
                return t._parent = null, t._onBatchRestored(), t;
            },
            _registerIfAttached: !1,
            _onPreDestroy: function() {
                var t, e;
                this._objFlags |= h;
                var i = this._parent, n = i && i._objFlags & h;
                var r = this._children;
                for (t = 0, e = r.length; t < e; ++t) r[t]._destroyImmediate();
                for (t = 0, e = this._components.length; t < e; ++t) {
                    this._components[t]._destroyImmediate();
                }
                var s = this.__eventTargets;
                for (t = 0, e = s.length; t < e; ++t) {
                    var a = s[t];
                    a && a.targetOff(this);
                }
                if (s.length = 0, this._persistNode && cc.game.removePersistRootNode(this), !n && i) {
                    var o = i._children.indexOf(this);
                    i._children.splice(o, 1), i.emit && i.emit("child-removed", this);
                }
                return n;
            },
            onRestore: !1
        });
        m.idGenerater = _, m._stacks = [ [] ], m._stackId = 0, m.prototype._onPreDestroyBase = m.prototype._onPreDestroy, 
        m.prototype._onHierarchyChangedBase = m.prototype._onHierarchyChanged;
        r.propertyDefine(m, [ "parent", "name", "children", "childrenCount" ], {}), cc._BaseNode = e.exports = m;
    }, {
        "../event-manager": 48,
        "../platform/CCObject": 88,
        "../platform/id-generater": 98,
        "../platform/js": 102,
        "../renderer/render-flow": 125,
        "./misc": 159
    } ],
    155: [ function(t, e, i) {
        var n = t("./misc").BASE64_VALUES, r = "0123456789abcdef".split(""), s = [ "", "", "", "" ], a = s.concat(s, "-", s, "-", s, "-", s, "-", s, s, s), o = a.map(function(t, e) {
            return "-" === t ? NaN : e;
        }).filter(isFinite);
        e.exports = function(t) {
            if (22 !== t.length) return t;
            a[0] = t[0], a[1] = t[1];
            for (var e = 2, i = 2; e < 22; e += 2) {
                var s = n[t.charCodeAt(e)], c = n[t.charCodeAt(e + 1)];
                a[o[i++]] = r[s >> 2], a[o[i++]] = r[(3 & s) << 2 | c >> 4], a[o[i++]] = r[15 & c];
            }
            return a.join("");
        };
    }, {
        "./misc": 159
    } ],
    156: [ function(t, e, i) {
        cc.find = e.exports = function(t, e) {
            if (null == t) return cc.errorID(5600), null;
            if (e) 0; else {
                var i = cc.director.getScene();
                if (!i) return null;
                e = i;
            }
            for (var n = e, r = "/" !== t[0] ? 0 : 1, s = t.split("/"), a = r; a < s.length; a++) {
                var o = s[a], c = n._children;
                n = null;
                for (var h = 0, l = c.length; h < l; ++h) {
                    var u = c[h];
                    if (u.name === o) {
                        n = u;
                        break;
                    }
                }
                if (!n) return null;
            }
            return n;
        };
    }, {} ],
    157: [ function(t, e, i) {
        t("./CCPath"), t("./profiler/CCProfiler"), t("./find"), t("./mutable-forward-iterator");
    }, {
        "./CCPath": 152,
        "./find": 156,
        "./mutable-forward-iterator": 160,
        "./profiler/CCProfiler": 163
    } ],
    158: [ function(t, e, i) {
        var n = t("../platform/js"), r = t("../renderer/render-engine").math, s = new n.Pool(128);
        s.get = function() {
            var t = this._get();
            return t ? r.mat4.identity(t) : t = r.mat4.create(), t;
        };
        var a = new n.Pool(64);
        a.get = function() {
            var t = this._get();
            return t ? (t.x = t.y = t.z = 0, t.w = 1) : t = r.quat.create(), t;
        }, e.exports = {
            mat4: s,
            quat: a
        };
    }, {
        "../platform/js": 102,
        "../renderer/render-engine": 124
    } ],
    159: [ function(t, e, i) {
        for (var n = t("../platform/js"), r = {
            propertyDefine: function(t, e, i) {
                function r(t, e, i, r) {
                    var s = Object.getOwnPropertyDescriptor(t, e);
                    if (s) s.get && (t[i] = s.get), s.set && r && (t[r] = s.set); else {
                        var a = t[i];
                        n.getset(t, e, a, t[r]);
                    }
                }
                for (var s, a = t.prototype, o = 0; o < e.length; o++) {
                    var c = (s = e[o])[0].toUpperCase() + s.slice(1);
                    r(a, s, "get" + c, "set" + c);
                }
                for (s in i) {
                    var h = i[s];
                    r(a, s, h[0], h[1]);
                }
            },
            NextPOT: function(t) {
                return t -= 1, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, (t |= t >> 16) + 1;
            },
            BUILTIN_CLASSID_RE: /^(?:cc|dragonBones|sp|ccsg)\..+/
        }, s = new Array(123), a = 0; a < 123; ++a) s[a] = 64;
        for (var o = 0; o < 64; ++o) s["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charCodeAt(o)] = o;
        r.BASE64_VALUES = s, r.pushToMap = function(t, e, i, n) {
            var r = t[e];
            r ? Array.isArray(r) ? n ? (r.push(r[0]), r[0] = i) : r.push(i) : t[e] = n ? [ i, r ] : [ r, i ] : t[e] = i;
        }, r.clampf = function(t, e, i) {
            if (e > i) {
                var n = e;
                e = i, i = n;
            }
            return t < e ? e : t < i ? t : i;
        }, r.clamp01 = function(t) {
            return t < 0 ? 0 : t < 1 ? t : 1;
        }, r.lerp = function(t, e, i) {
            return t + (e - t) * i;
        }, r.degreesToRadians = function(t) {
            return t * cc.macro.RAD;
        }, r.radiansToDegrees = function(t) {
            return t * cc.macro.DEG;
        }, cc.misc = e.exports = r;
    }, {
        "../platform/js": 102
    } ],
    160: [ function(t, e, i) {
        function n(t) {
            this.i = 0, this.array = t;
        }
        var r = n.prototype;
        r.remove = function(t) {
            var e = this.array.indexOf(t);
            e >= 0 && this.removeAt(e);
        }, r.removeAt = function(t) {
            this.array.splice(t, 1), t <= this.i && --this.i;
        }, r.fastRemove = function(t) {
            var e = this.array.indexOf(t);
            e >= 0 && this.fastRemoveAt(e);
        }, r.fastRemoveAt = function(t) {
            var e = this.array;
            e[t] = e[e.length - 1], --e.length, t <= this.i && --this.i;
        }, r.push = function(t) {
            this.array.push(t);
        }, e.exports = n;
    }, {} ],
    161: [ function(t, e, i) {
        var n = t("../CCNode"), r = n.EventType, s = n._LocalDirtyFlag, a = t("../renderer/render-engine").math, o = t("../renderer/render-flow"), c = Math.PI / 180, h = 1, l = 2, u = 4, _ = null, d = null;
        function f() {
            if (this._localMatDirty) {
                var t = this._matrix;
                if (a.mat4.fromRTS(t, this._quat, this._position, this._scale), this._skewX || this._skewY) {
                    var e = t.m00, i = t.m01, n = t.m04, r = t.m05, s = Math.tan(this._skewX * c), o = Math.tan(this._skewY * c);
                    s === 1 / 0 && (s = 99999999), o === 1 / 0 && (o = 99999999), t.m00 = e + n * o, 
                    t.m01 = i + r * o, t.m04 = n + e * s, t.m05 = r + i * s;
                }
                this._localMatDirty = 0, this._worldMatDirty = !0;
            }
        }
        function p() {
            if (this._localMatDirty && this._updateLocalMatrix(), this._parent) {
                var t = this._parent._worldMatrix;
                a.mat4.mul(this._worldMatrix, t, this._matrix);
            } else a.mat4.copy(this._worldMatrix, this._matrix);
            this._worldMatDirty = !1;
        }
        function m() {
            return new cc.Vec3(this._position);
        }
        function v(t, e, i) {
            var n = void 0;
            void 0 === e ? (n = t.x, e = t.y, i = t.z || 0) : (n = t, i = i || 0);
            var a = this._position;
            a.x === n && a.y === e && a.z === i || (a.x = n, a.y = e, a.z = i, this.setLocalDirty(s.POSITION), 
            this._renderFlag |= o.FLAG_WORLD_TRANSFORM, this._eventMask & h && this.emit(r.POSITION_CHANGED));
        }
        function g() {
            return a.quat.clone(this._quat);
        }
        function y(t, e, i, n) {
            var a = void 0;
            void 0 === e && (a = t.x, e = t.y, i = t.z, n = t.w);
            var c = this._quat;
            c.x === a && c.y === e && c.z === i && c.w === n || (c.x = a, c.y = e, c.z = i, 
            c.w = n, this.setLocalDirty(s.ROTATION), this._renderFlag |= o.FLAG_TRANSFORM, this._eventMask & u && this.emit(r.ROTATION_CHANGED));
        }
        function x() {
            return cc.v3(this._scale);
        }
        function E(t, e, i) {
            t && "number" != typeof t ? (e = t.y, i = t.z || 1, t = t.x) : void 0 !== t && void 0 === e ? (e = t, 
            i = t) : void 0 === i && (i = 1), this._scale.x === t && this._scale.y === e && this._scale.z === i || (this._scale.x = t, 
            this._scale.y = e, this._scale.z = i, this.setLocalDirty(s.SCALE), this._renderFlag |= o.FLAG_TRANSFORM, 
            this._eventMask & l && this.emit(r.SCALE_CHANGED));
        }
        cc._polyfill3D = e.exports = {
            enabled: !1,
            enable: function() {
                var t = cc.Node.prototype;
                _ || (_ = t._updateLocalMatrix, d = t._calculWorldMatrix), this.enabled || (t._updateLocalMatrix = f, 
                t._calculWorldMatrix = p, t.getPosition = m, t.setPosition = v, t.getScale = x, 
                t.setScale = E, t.getQuat = g, t.setQuat = y, this.enabled = !0);
            },
            disable: function() {
                this.enabled && (cc.Node.prototype._updateLocalMatrix = _, cc.Node.prototype._calculWorldMatrix = d, 
                this.enabled = !1);
            }
        };
    }, {
        "../CCNode": 4,
        "../renderer/render-engine": 124,
        "../renderer/render-flow": 125
    } ],
    162: [ function(t, e, i) {
        var n = t("../renderer").renderEngine.math;
        cc._PrefabInfo = cc.Class({
            name: "cc.PrefabInfo",
            properties: {
                root: null,
                asset: null,
                fileId: "",
                sync: !1,
                _synced: {
                    default: !1,
                    serializable: !1
                }
            }
        }), e.exports = {
            syncWithPrefab: function(t) {
                var e = t._prefab;
                if (e._synced = !0, !e.asset) return cc.errorID(3701, t.name), void (t._prefab = null);
                var i = t._objFlags, r = t._parent, s = t._id, a = t._name, o = t._active, c = t._position.x, h = t._position.y, l = t._quat, u = t._localZOrder, _ = t._globalZOrder;
                cc.game._isCloning = !0;
                var d = e.asset.data;
                d._prefab._synced = !0, d._iN$t = t, cc.instantiate._clone(d, d), cc.game._isCloning = !1, 
                t._objFlags = i, t._parent = r, t._id = s, t._prefab = e, t._name = a, t._active = o, 
                t._position.x = c, t._position.y = h, n.quat.copy(t._quat, l), t._localZOrder = u, 
                t._globalZOrder = _;
            }
        };
    }, {
        "../renderer": 123
    } ],
    163: [ function(t, e, i) {
        var n = t("../../platform/CCMacro"), r = t("./perf-counter"), s = !1, a = 15, o = null, c = null, h = null, l = null;
        function u() {
            (function() {
                if (!h || !h.isValid) {
                    (h = new cc.Node("PROFILER-NODE")).x = h.y = 10, h.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG, 
                    cc.Camera._setupDebugCamera(), h.zIndex = n.MAX_ZINDEX, cc.game.addPersistRootNode(h);
                    var t = new cc.Node("LEFT-PANEL");
                    t.anchorX = t.anchorY = 0, t.parent = h;
                    var e = t.addComponent(cc.Label);
                    e.font = o, e.fontSize = a, e.lineHeight = a;
                    var i = new cc.Node("RIGHT-PANEL");
                    i.anchorX = 1, i.anchorY = 0, i.x = 200, i.parent = h;
                    var r = i.addComponent(cc.Label);
                    r.horizontalAlign = cc.Label.HorizontalAlign.RIGHT, r.font = o, r.fontSize = a, 
                    r.lineHeight = a, l = {
                        left: e,
                        right: r
                    };
                }
            })();
            var t = cc.director._lastUpdate;
            c.frame._counter.start(t), c.logic._counter.start(t);
        }
        function _() {
            var t = performance.now();
            cc.director.isPaused() ? c.frame._counter.start(t) : c.logic._counter.end(t), c.render._counter.start(t);
        }
        function d() {
            var t = performance.now();
            c.render._counter.end(t), c.draws._counter.value = cc.renderer.drawCalls, c.frame._counter.end(t), 
            c.fps._counter.frame(t);
            var e = "", i = "";
            for (var n in c) {
                var r = c[n];
                r._counter.sample(t), e += r.desc + "\n", i += r._counter.human() + "\n";
            }
            l.left.string = e, l.right.string = i;
        }
        cc.profiler = e.exports = {
            isShowingStats: function() {
                return s;
            },
            hideStats: function() {
                s && (h && (h.active = !1), cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, u), 
                cc.director.off(cc.Director.EVENT_AFTER_UPDATE, _), cc.director.off(cc.Director.EVENT_AFTER_DRAW, d), 
                s = !1);
            },
            showStats: function() {
                s || (function() {
                    if (!o) {
                        var t = document.createElement("canvas");
                        t.style.width = t.width = 256, t.style.height = t.height = 256;
                        var e = t.getContext("2d");
                        e.font = a + "px Arial", e.textBaseline = "top", e.textAlign = "left", e.fillStyle = "#fff";
                        var i = 2, n = 2, r = a;
                        (o = new cc.LabelAtlas())._fntConfig = {
                            atlasName: "profiler-arial",
                            commonHeight: r,
                            fontSize: a,
                            kerningDict: {},
                            fontDefDictionary: {}
                        }, o._name = "profiler-arial", o.fontSize = a;
                        for (var s = o._fntConfig.fontDefDictionary, c = 32; c <= 126; c++) {
                            var h = String.fromCharCode(c), l = e.measureText(h).width;
                            i + l >= 256 && (i = 2, n += r + 2), e.fillText(h, i, n), s[c] = {
                                xAdvance: l,
                                xOffset: 0,
                                yOffset: 0,
                                rect: {
                                    x: i,
                                    y: n,
                                    width: l,
                                    height: r
                                }
                            }, i += l + 2;
                        }
                        var u = new cc.Texture2D();
                        u.initWithElement(t);
                        var _ = new cc.SpriteFrame();
                        _.setTexture(u), o.spriteFrame = _;
                    }
                }(), function() {
                    if (!c) {
                        c = {
                            frame: {
                                desc: "Frame time (ms)",
                                min: 0,
                                max: 50,
                                average: 500
                            },
                            fps: {
                                desc: "Framerate (FPS)",
                                below: 30,
                                average: 500
                            },
                            draws: {
                                desc: "Draw call"
                            },
                            logic: {
                                desc: "Game Logic (ms)",
                                min: 0,
                                max: 50,
                                average: 500,
                                color: "#080"
                            },
                            render: {
                                desc: "Renderer (ms)",
                                min: 0,
                                max: 50,
                                average: 500,
                                color: "#f90"
                            },
                            mode: {
                                desc: cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? "WebGL" : "Canvas",
                                min: 1
                            }
                        };
                        var t = performance.now();
                        for (var e in c) c[e]._counter = new r(e, c[e], t);
                    }
                }(), h && (h.active = !0), cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, u), cc.director.on(cc.Director.EVENT_AFTER_UPDATE, _), 
                cc.director.on(cc.Director.EVENT_AFTER_DRAW, d), s = !0);
            }
        };
    }, {
        "../../platform/CCMacro": 87,
        "./perf-counter": 165
    } ],
    164: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.Counter",
            ctor: function(t, e, i) {
                this._id = t, this._opts = e || {}, this._value = 0, this._total = 0, this._averageValue = 0, 
                this._accumValue = 0, this._accumSamples = 0, this._accumStart = i;
            },
            properties: {
                value: {
                    get: function() {
                        return this._value;
                    },
                    set: function(t) {
                        this._value = t;
                    }
                }
            },
            _average: function(t, e) {
                if (this._opts.average) {
                    this._accumValue += t, ++this._accumSamples;
                    var i = e;
                    i - this._accumStart >= this._opts.average && (this._averageValue = this._accumValue / this._accumSamples, 
                    this._accumValue = 0, this._accumStart = i, this._accumSamples = 0);
                }
            },
            sample: function(t) {
                this._average(this._value, t);
            },
            human: function() {
                var t = this._opts.average ? this._averageValue : this._value;
                return Math.round(100 * t) / 100;
            },
            alarm: function() {
                return this._opts.below && this._value < this._opts.below || this._opts.over && this._value > this._opts.over;
            }
        });
        e.exports = n;
    }, {} ],
    165: [ function(t, e, i) {
        var n = t("./counter"), r = cc.Class({
            name: "cc.PerfCounter",
            extends: n,
            ctor: function(t, e, i) {
                this._time = i;
            },
            start: function(t) {
                this._time = t;
            },
            end: function(t) {
                this._value = t - this._time, this._average(this._value);
            },
            tick: function() {
                this.end(), this.start();
            },
            frame: function(t) {
                var e = t, i = e - this._time;
                this._total++, i > (this._opts.average || 1e3) && (this._value = 1e3 * this._total / i, 
                this._total = 0, this._time = e, this._average(this._value));
            }
        });
        e.exports = r;
    }, {
        "./counter": 164
    } ],
    166: [ function(t, e, i) {
        e.exports = {
            label_wordRex: /([a-zA-Z0-9\xc4\xd6\xdc\xe4\xf6\xfc\xdf\xe9\xe8\xe7\xe0\xf9\xea\xe2\xee\xf4\xfb\u0430-\u044f\u0410-\u042f\u0401\u0451]+|\S)/,
            label_symbolRex: /^[!,.:;'}\]%\?>\u3001\u2018\u201c\u300b\uff1f\u3002\uff0c\uff01]/,
            label_lastWordRex: /([a-zA-Z0-9\xc4\xd6\xdc\xe4\xf6\xfc\xdf\xe9\xe8\xe7\xe0\xf9\xea\xe2\xee\xf4\xfb\u0430\xed\xec\xcd\xcc\xef\xc1\xc0\xe1\xe0\xc9\xc8\xd2\xd3\xf2\xf3\u0150\u0151\xd9\xda\u0170\xfa\u0171\xf1\xd1\xe6\xc6\u0153\u0152\xc3\xc2\xe3\xd4\xf5\u011b\u0161\u010d\u0159\u017e\xfd\xe1\xed\xe9\xf3\xfa\u016f\u0165\u010f\u0148\u011a\u0160\u010c\u0158\u017d\xc1\xcd\xc9\xd3\xda\u0164\u017c\u017a\u015b\xf3\u0144\u0142\u0119\u0107\u0105\u017b\u0179\u015a\xd3\u0143\u0141\u0118\u0106\u0104-\u044f\u0410-\u042f\u0401\u0451]+|\S)$/,
            label_lastEnglish: /[a-zA-Z0-9\xc4\xd6\xdc\xe4\xf6\xfc\xdf\xe9\xe8\xe7\xe0\xf9\xea\xe2\xee\xf4\xfb\u0430\xed\xec\xcd\xcc\xef\xc1\xc0\xe1\xe0\xc9\xc8\xd2\xd3\xf2\xf3\u0150\u0151\xd9\xda\u0170\xfa\u0171\xf1\xd1\xe6\xc6\u0153\u0152\xc3\xc2\xe3\xd4\xf5\u011b\u0161\u010d\u0159\u017e\xfd\xe1\xed\xe9\xf3\xfa\u016f\u0165\u010f\u0148\u011a\u0160\u010c\u0158\u017d\xc1\xcd\xc9\xd3\xda\u0164\u017c\u017a\u015b\xf3\u0144\u0142\u0119\u0107\u0105\u017b\u0179\u015a\xd3\u0143\u0141\u0118\u0106\u0104-\u044f\u0410-\u042f\u0401\u0451]+$/,
            label_firstEnglish: /^[a-zA-Z0-9\xc4\xd6\xdc\xe4\xf6\xfc\xdf\xe9\xe8\xe7\xe0\xf9\xea\xe2\xee\xf4\xfb\u0430\xed\xec\xcd\xcc\xef\xc1\xc0\xe1\xe0\xc9\xc8\xd2\xd3\xf2\xf3\u0150\u0151\xd9\xda\u0170\xfa\u0171\xf1\xd1\xe6\xc6\u0153\u0152\xc3\xc2\xe3\xd4\xf5\u011b\u0161\u010d\u0159\u017e\xfd\xe1\xed\xe9\xf3\xfa\u016f\u0165\u010f\u0148\u011a\u0160\u010c\u0158\u017d\xc1\xcd\xc9\xd3\xda\u0164\u017c\u017a\u015b\xf3\u0144\u0142\u0119\u0107\u0105\u017b\u0179\u015a\xd3\u0143\u0141\u0118\u0106\u0104-\u044f\u0410-\u042f\u0401\u0451]/,
            label_firstEmoji: /^[\uD83C\uDF00-\uDFFF\uDC00-\uDE4F]/,
            label_lastEmoji: /([\uDF00-\uDFFF\uDC00-\uDE4F]+|\S)$/,
            label_wrapinspection: !0,
            __CHINESE_REG: /^[\u4E00-\u9FFF\u3400-\u4DFF]+$/,
            __JAPANESE_REG: /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g,
            __KOREAN_REG: /^[\u1100-\u11FF]|[\u3130-\u318F]|[\uA960-\uA97F]|[\uAC00-\uD7AF]|[\uD7B0-\uD7FF]+$/,
            isUnicodeCJK: function(t) {
                return this.__CHINESE_REG.test(t) || this.__JAPANESE_REG.test(t) || this.__KOREAN_REG.test(t);
            },
            isUnicodeSpace: function(t) {
                return (t = t.charCodeAt(0)) >= 9 && t <= 13 || 32 === t || 133 === t || 160 === t || 5760 === t || t >= 8192 && t <= 8202 || 8232 === t || 8233 === t || 8239 === t || 8287 === t || 12288 === t;
            },
            safeMeasureText: function(t, e) {
                var i = t.measureText(e);
                return i && i.width || 0;
            },
            fragmentText: function(t, e, i, n) {
                var r = [];
                if (0 === t.length || i < 0) return r.push(""), r;
                for (var s = t; e > i && s.length > 1; ) {
                    for (var a = s.length * (i / e) | 0, o = s.substr(a), c = e - n(o), h = o, l = 0, u = 0; c > i && u++ < 10; ) a *= i / c, 
                    a |= 0, c = e - n(o = s.substr(a));
                    for (u = 0; c <= i && u++ < 10; ) {
                        if (o) {
                            var _ = this.label_wordRex.exec(o);
                            l = _ ? _[0].length : 1, h = o;
                        }
                        a += l, c = e - n(o = s.substr(a));
                    }
                    0 == (a -= l) && (a = 1, h = h.substr(1));
                    var d, f = s.substr(0, a);
                    this.label_wrapinspection && this.label_symbolRex.test(h || o) && (0 == (a -= (d = this.label_lastWordRex.exec(f)) ? d[0].length : 0) && (a = 1), 
                    h = s.substr(a), f = s.substr(0, a)), this.label_firstEmoji.test(h) && (d = this.label_lastEmoji.exec(f)) && f !== d[0] && (a -= d[0].length, 
                    h = s.substr(a), f = s.substr(0, a)), this.label_firstEnglish.test(h) && (d = this.label_lastEnglish.exec(f)) && f !== d[0] && (a -= d[0].length, 
                    h = s.substr(a), f = s.substr(0, a)), 0 === r.length ? r.push(f) : (f = f.trim()).length > 0 && r.push(f), 
                    e = n(s = h || o);
                }
                return 0 === r.length ? r.push(s) : (s = s.trim()).length > 0 && r.push(s), r;
            }
        };
    }, {} ],
    167: [ function(t, e, i) {
        var n = t("../assets/CCTexture2D"), r = {
            loadImage: function(t, e, i) {
                cc.assertID(t, 3103);
                var r = cc.loader.getRes(t);
                return r ? r.loaded ? (e && e.call(i, r), r) : (r.once("load", function() {
                    e && e.call(i, r);
                }, i), r) : ((r = new n()).url = t, cc.loader.load({
                    url: t,
                    texture: r
                }, function(t, n) {
                    if (t) return e && e.call(i, t || new Error("Unknown error"));
                    n.handleLoadedTexture(), e && e.call(i, null, n);
                }), r);
            },
            cacheImage: function(t, e) {
                if (t && e) {
                    var i = new n();
                    i.initWithElement(e);
                    var r = {
                        id: t,
                        url: t,
                        error: null,
                        content: i,
                        complete: !1
                    };
                    return cc.loader.flowOut(r), i;
                }
            },
            postLoadTexture: function(t, e) {
                t.loaded ? e && e() : t.url ? cc.loader.load({
                    url: t.url,
                    skips: [ "Loader" ]
                }, function(i, n) {
                    n && (t.loaded || (t._nativeAsset = n)), e && e(i);
                }) : e && e();
            }
        };
        cc.textureUtil = e.exports = r;
    }, {
        "../assets/CCTexture2D": 23
    } ],
    168: [ function(t, e, i) {
        var n = t("./value-type"), r = t("../platform/js"), s = function() {
            function e(t, e, i, n) {
                "object" == typeof t && (e = t.g, i = t.b, n = t.a, t = t.r), t = t || 0, e = e || 0, 
                i = i || 0, n = "number" == typeof n ? n : 255, this._val = (n << 24 >>> 0) + (i << 16) + (e << 8) + t;
            }
            r.extend(e, n), t("../platform/CCClass").fastDefine("cc.Color", e, {
                r: 0,
                g: 0,
                b: 0,
                a: 255
            });
            var i = {
                WHITE: [ 255, 255, 255, 255 ],
                BLACK: [ 0, 0, 0, 255 ],
                TRANSPARENT: [ 0, 0, 0, 0 ],
                GRAY: [ 127.5, 127.5, 127.5 ],
                RED: [ 255, 0, 0 ],
                GREEN: [ 0, 255, 0 ],
                BLUE: [ 0, 0, 255 ],
                YELLOW: [ 255, 235, 4 ],
                ORANGE: [ 255, 127, 0 ],
                CYAN: [ 0, 255, 255 ],
                MAGENTA: [ 255, 0, 255 ]
            };
            for (var s in i) r.get(e, s, function(t) {
                return function() {
                    return new e(t[0], t[1], t[2], t[3]);
                };
            }(i[s]));
            var a = e.prototype;
            return a.clone = function() {
                var t = new e();
                return t._val = this._val, t;
            }, a.equals = function(t) {
                return t && this._val === t._val;
            }, a.lerp = function(t, i, n) {
                n = n || new e();
                var r = this.r, s = this.g, a = this.b, o = this.a;
                return n.r = r + (t.r - r) * i, n.g = s + (t.g - s) * i, n.b = a + (t.b - a) * i, 
                n.a = o + (t.a - o) * i, n;
            }, a.toString = function() {
                return "rgba(" + this.r.toFixed() + ", " + this.g.toFixed() + ", " + this.b.toFixed() + ", " + this.a.toFixed() + ")";
            }, a.getR = function() {
                return 255 & this._val;
            }, a.setR = function(t) {
                return t = ~~cc.misc.clampf(t, 0, 255), this._val = (4294967040 & this._val | t) >>> 0, 
                this;
            }, a.getG = function() {
                return (65280 & this._val) >> 8;
            }, a.setG = function(t) {
                return t = ~~cc.misc.clampf(t, 0, 255), this._val = (4294902015 & this._val | t << 8) >>> 0, 
                this;
            }, a.getB = function() {
                return (16711680 & this._val) >> 16;
            }, a.setB = function(t) {
                return t = ~~cc.misc.clampf(t, 0, 255), this._val = (4278255615 & this._val | t << 16) >>> 0, 
                this;
            }, a.getA = function() {
                return (4278190080 & this._val) >>> 24;
            }, a.setA = function(t) {
                return t = ~~cc.misc.clampf(t, 0, 255), this._val = (16777215 & this._val | t << 24) >>> 0, 
                this;
            }, a._fastSetA = function(t) {
                this._val = (16777215 & this._val | t << 24) >>> 0;
            }, r.getset(a, "r", a.getR, a.setR, !0), r.getset(a, "g", a.getG, a.setG, !0), r.getset(a, "b", a.getB, a.setB, !0), 
            r.getset(a, "a", a.getA, a.setA, !0), a.toCSS = function(t) {
                return "rgba" === t ? "rgba(" + (0 | this.r) + "," + (0 | this.g) + "," + (0 | this.b) + "," + (this.a / 255).toFixed(2) + ")" : "rgb" === t ? "rgb(" + (0 | this.r) + "," + (0 | this.g) + "," + (0 | this.b) + ")" : "#" + this.toHEX(t);
            }, a.fromHEX = function(t) {
                t = 0 === t.indexOf("#") ? t.substring(1) : t;
                var e = parseInt(t.substr(0, 2), 16) || 0, i = parseInt(t.substr(2, 2), 16) || 0, n = parseInt(t.substr(4, 2), 16) || 0, r = parseInt(t.substr(6, 2), 16) || 255;
                return this._val = (r << 24 >>> 0) + (n << 16) + (i << 8) + e, this;
            }, a.toHEX = function(t) {
                var e = [ (this.r < 16 ? "0" : "") + (0 | this.r).toString(16), (this.g < 16 ? "0" : "") + (0 | this.g).toString(16), (this.b < 16 ? "0" : "") + (0 | this.b).toString(16) ], i = -1;
                if ("#rgb" === t) for (i = 0; i < e.length; ++i) e[i].length > 1 && (e[i] = e[i][0]); else if ("#rrggbb" === t) for (i = 0; i < e.length; ++i) 1 === e[i].length && (e[i] = "0" + e[i]); else "#rrggbbaa" === t && e.push((this.a < 16 ? "0" : "") + (0 | this.a).toString(16));
                return e.join("");
            }, a.toRGBValue = function() {
                return 16777215 & this._val;
            }, a.fromHSV = function(t, e, i) {
                var n, r, s;
                if (0 === e) n = r = s = i; else if (0 === i) n = r = s = 0; else {
                    1 === t && (t = 0), t *= 6, e = e, i = i;
                    var a = Math.floor(t), o = t - a, c = i * (1 - e), h = i * (1 - e * o), l = i * (1 - e * (1 - o));
                    switch (a) {
                      case 0:
                        n = i, r = l, s = c;
                        break;

                      case 1:
                        n = h, r = i, s = c;
                        break;

                      case 2:
                        n = c, r = i, s = l;
                        break;

                      case 3:
                        n = c, r = h, s = i;
                        break;

                      case 4:
                        n = l, r = c, s = i;
                        break;

                      case 5:
                        n = i, r = c, s = h;
                    }
                }
                return n *= 255, r *= 255, s *= 255, this._val = (this.a << 24 >>> 0) + (s << 16) + (r << 8) + n, 
                this;
            }, a.toHSV = function() {
                var t = this.r / 255, e = this.g / 255, i = this.b / 255, n = {
                    h: 0,
                    s: 0,
                    v: 0
                }, r = Math.max(t, e, i), s = Math.min(t, e, i), a = 0;
                return n.v = r, n.s = r ? (r - s) / r : 0, n.s ? (a = r - s, n.h = t === r ? (e - i) / a : e === r ? 2 + (i - t) / a : 4 + (t - e) / a, 
                n.h /= 6, n.h < 0 && (n.h += 1)) : n.h = 0, n;
            }, a.set = function(t) {
                t._val ? this._val = t._val : (this.r = t.r, this.g = t.g, this.b = t.b, this.a = t.a);
            }, e;
        }();
        cc.Color = s, cc.color = function(t, e, i, n) {
            return "string" == typeof t ? new cc.Color().fromHEX(t) : "object" == typeof t ? new cc.Color(t.r, t.g, t.b, t.a) : new cc.Color(t, e, i, n);
        }, e.exports = cc.Color;
    }, {
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "./value-type": 174
    } ],
    169: [ function(t, e, i) {
        t("./value-type"), t("./vec2"), t("./vec3"), t("./quat"), t("./mat4"), t("./size"), 
        t("./rect"), t("./color"), cc.vmath = t("../renderer/render-engine").math;
    }, {
        "../renderer/render-engine": 124,
        "./color": 168,
        "./mat4": 170,
        "./quat": 171,
        "./rect": 172,
        "./size": 173,
        "./value-type": 174,
        "./vec2": 175,
        "./vec3": 176
    } ],
    170: [ function(t, e, i) {
        var n = t("./value-type"), r = t("../platform/js"), s = t("../platform/CCClass"), a = t("../renderer/render-engine").math.mat4;
        function o(t, e, i, n, r, s, a, o, c, h, l, u, _, d, f, p) {
            var m = this;
            m.m00 = t, m.m01 = e, m.m02 = i, m.m03 = n, m.m04 = r, m.m05 = s, m.m06 = a, m.m07 = o, 
            m.m08 = c, m.m09 = h, m.m10 = l, m.m11 = u, m.m12 = _, m.m13 = d, m.m14 = f, m.m15 = p;
        }
        r.extend(o, n), s.fastDefine("cc.Mat4", o, {
            m00: 1,
            m01: 0,
            m02: 0,
            m03: 0,
            m04: 0,
            m05: 1,
            m06: 0,
            m07: 0,
            m08: 0,
            m09: 0,
            m10: 1,
            m11: 0,
            m12: 0,
            m13: 0,
            m14: 0,
            m15: 1
        }), r.mixin(o.prototype, {
            clone: function() {
                var t = this;
                return new o(t.m00, t.m01, t.m02, t.m03, t.m04, t.m05, t.m06, t.m07, t.m08, t.m09, t.m10, t.m11, t.m12, t.m13, t.m14, t.m15);
            },
            set: function(t) {
                var e = this;
                return e.m00 = t.m00, e.m01 = t.m01, e.m02 = t.m02, e.m03 = t.m03, e.m04 = t.m04, 
                e.m05 = t.m05, e.m06 = t.m06, e.m07 = t.m07, e.m08 = t.m08, e.m09 = t.m09, e.m10 = t.m10, 
                e.m11 = t.m11, e.m12 = t.m12, e.m13 = t.m13, e.m14 = t.m14, e.m15 = t.m15, this;
            },
            equals: function(t) {
                return a.exactEquals(this, t);
            },
            fuzzyEquals: function(t) {
                return a.equals(this, t);
            },
            toString: function() {
                var t = this;
                return "[\n" + t.m00 + ", " + t.m01 + ", " + t.m02 + ", " + t.m03 + ",\n" + t.m04 + ", " + t.m05 + ", " + t.m06 + ", " + t.m07 + ",\n" + t.m08 + ", " + t.m09 + ", " + t.m10 + ", " + t.m11 + ",\n" + t.m12 + ", " + t.m13 + ", " + t.m14 + ", " + t.m15 + "\n]";
            },
            identity: function() {
                return a.identity(this);
            },
            transpose: function(t) {
                return t = t || new cc.Mat4(), a.transpose(t, this);
            },
            invert: function(t) {
                return t = t || new cc.Mat4(), a.invert(t, this);
            },
            adjoint: function(t) {
                return t = t || new cc.Mat4(), a.adjoint(t, this);
            },
            determinant: function() {
                return a.determinant(this);
            },
            add: function(t, e) {
                return e = e || new cc.Mat4(), a.add(e, this, t);
            },
            sub: function(t, e) {
                return e = e || new cc.Mat4(), a.subtract(e, this, t);
            },
            mul: function(t, e) {
                return e = e || new cc.Mat4(), a.multiply(e, this, t);
            },
            mulScalar: function(t, e) {
                return e = e || new cc.Mat4(), a.mulScalar(e, this, t);
            },
            translate: function(t, e) {
                return e = e || new cc.Mat4(), a.translate(e, this, t);
            },
            scale: function(t, e) {
                return e = e || new cc.Mat4(), a.scale(e, this, t);
            },
            rotate: function(t, e, i) {
                return i = i || new cc.Mat4(), a.rotate(i, this, t, e);
            },
            getTranslation: function(t) {
                return t = t || new cc.Vec3(), a.getTranslation(t, this);
            },
            getScale: function(t) {
                return t = t || new cc.Vec3(), a.getScaling(t, this);
            },
            getRotation: function(t) {
                return t = t || new cc.Quat(), a.getRotation(t, this);
            },
            fromRTS: function(t, e, i) {
                return a.fromRTS(this, t, e, i);
            },
            fromQuat: function(t) {
                return a.fromQuat(this, t);
            }
        }), cc.mat4 = function(t, e, i, n, r, s, a, c, h, l, u, _, d, f, p, m) {
            return new o(t, e, i, n, r, s, a, c, h, l, u, _, d, f, p, m);
        };
    }, {
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "../renderer/render-engine": 124,
        "./value-type": 174
    } ],
    171: [ function(t, e, i) {
        var n = t("./value-type"), r = t("../platform/js"), s = t("../platform/CCClass");
        function a(t, e, i, n) {
            t && "object" == typeof t && (i = t.z, e = t.y, n = (t = t.x).w), this.x = t || 0, 
            this.y = e || 0, this.z = i || 0, this.w = n || 1;
        }
        r.extend(a, n), s.fastDefine("cc.Quat", a, {
            x: 0,
            y: 0,
            z: 0,
            w: 1
        });
        var o = a.prototype;
        o.clone = function() {
            return new a(this.x, this.y, this.z, this.w);
        }, o.set = function(t) {
            return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this;
        }, o.equals = function(t) {
            return t && this.x === t.x && this.y === t.y && this.z === t.z && this.w === t.w;
        }, o.getRoll = function() {
            var t = 2 * (this.w * this.x + this.y * this.z), e = 1 - 2 * (this.x * this.x + this.y * this.y);
            return 180 * Math.atan2(t, e) / Math.PI;
        }, o.getPitch = function() {
            var t = 2 * (this.w * this.y - this.z * this.x), e = t > 1 ? 1 : t;
            return e = t < -1 ? -1 : t, e = 180 * Math.asin(e) / Math.PI;
        }, o.getYaw = function() {
            var t = 2 * (this.w * this.z + this.x * this.y), e = 1 - 2 * (this.y * this.y + this.z * this.z);
            return 180 * Math.atan2(t, e) / Math.PI;
        }, cc.quat = function(t, e, i, n) {
            return new a(t, e, i, n);
        }, e.exports = cc.Quat = a;
    }, {
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "./value-type": 174
    } ],
    172: [ function(t, e, i) {
        var n = t("./value-type"), r = t("../platform/js");
        function s(t, e, i, n) {
            t && "object" == typeof t && (e = t.y, i = t.width, n = t.height, t = t.x), this.x = t || 0, 
            this.y = e || 0, this.width = i || 0, this.height = n || 0;
        }
        r.extend(s, n), t("../platform/CCClass").fastDefine("cc.Rect", s, {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }), s.fromMinMax = function(t, e) {
            var i = Math.min(t.x, e.x), n = Math.min(t.y, e.y);
            return new s(i, n, Math.max(t.x, e.x) - i, Math.max(t.y, e.y) - n);
        };
        var a = s.prototype;
        a.clone = function() {
            return new s(this.x, this.y, this.width, this.height);
        }, a.equals = function(t) {
            return t && this.x === t.x && this.y === t.y && this.width === t.width && this.height === t.height;
        }, a.lerp = function(t, e, i) {
            i = i || new s();
            var n = this.x, r = this.y, a = this.width, o = this.height;
            return i.x = n + (t.x - n) * e, i.y = r + (t.y - r) * e, i.width = a + (t.width - a) * e, 
            i.height = o + (t.height - o) * e, i;
        }, a.set = function(t) {
            this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height;
        }, a.intersects = function(t) {
            var e = this.x + this.width, i = this.y + this.height, n = t.x + t.width, r = t.y + t.height;
            return !(e < t.x || n < this.x || i < t.y || r < this.y);
        }, a.intersection = function(t, e) {
            var i = this.x, n = this.y, r = this.x + this.width, s = this.y + this.height, a = e.x, o = e.y, c = e.x + e.width, h = e.y + e.height;
            return t.x = Math.max(i, a), t.y = Math.max(n, o), t.width = Math.min(r, c) - t.x, 
            t.height = Math.min(s, h) - t.y, t;
        }, a.contains = function(t) {
            return this.x <= t.x && this.x + this.width >= t.x && this.y <= t.y && this.y + this.height >= t.y;
        }, a.containsRect = function(t) {
            return this.x <= t.x && this.x + this.width >= t.x + t.width && this.y <= t.y && this.y + this.height >= t.y + t.height;
        }, a.union = function(t, e) {
            var i = this.x, n = this.y, r = this.width, s = this.height, a = e.x, o = e.y, c = e.width, h = e.height;
            return t.x = Math.min(i, a), t.y = Math.min(n, o), t.width = Math.max(i + r, a + c) - t.x, 
            t.height = Math.max(n + s, o + h) - t.y, t;
        }, a.transformMat4 = function(t, e) {
            var i = this.x, n = this.y, r = i + this.width, s = n + this.height, a = e.m00 * i + e.m04 * n + e.m12, o = e.m01 * i + e.m05 * n + e.m13, c = e.m00 * r + e.m04 * n + e.m12, h = e.m01 * r + e.m05 * n + e.m13, l = e.m00 * i + e.m04 * s + e.m12, u = e.m01 * i + e.m05 * s + e.m13, _ = e.m00 * r + e.m04 * s + e.m12, d = e.m01 * r + e.m05 * s + e.m13, f = Math.min(a, c, l, _), p = Math.max(a, c, l, _), m = Math.min(o, h, u, d), v = Math.max(o, h, u, d);
            return t.x = f, t.y = m, t.width = p - f, t.height = v - m, t;
        }, a.toString = function() {
            return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.width.toFixed(2) + ", " + this.height.toFixed(2) + ")";
        }, r.getset(a, "xMin", function() {
            return this.x;
        }, function(t) {
            this.width += this.x - t, this.x = t;
        }), r.getset(a, "yMin", function() {
            return this.y;
        }, function(t) {
            this.height += this.y - t, this.y = t;
        }), r.getset(a, "xMax", function() {
            return this.x + this.width;
        }, function(t) {
            this.width = t - this.x;
        }), r.getset(a, "yMax", function() {
            return this.y + this.height;
        }, function(t) {
            this.height = t - this.y;
        }), r.getset(a, "center", function() {
            return new cc.Vec2(this.x + .5 * this.width, this.y + .5 * this.height);
        }, function(t) {
            this.x = t.x - .5 * this.width, this.y = t.y - .5 * this.height;
        }), r.getset(a, "origin", function() {
            return new cc.Vec2(this.x, this.y);
        }, function(t) {
            this.x = t.x, this.y = t.y;
        }), r.getset(a, "size", function() {
            return new cc.Size(this.width, this.height);
        }, function(t) {
            this.width = t.width, this.height = t.height;
        }), cc.Rect = s, cc.rect = function(t, e, i, n) {
            return new s(t, e, i, n);
        }, e.exports = cc.Rect;
    }, {
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "./value-type": 174
    } ],
    173: [ function(t, e, i) {
        var n = t("./value-type"), r = t("../platform/js");
        function s(t, e) {
            t && "object" == typeof t && (e = t.height, t = t.width), this.width = t || 0, this.height = e || 0;
        }
        r.extend(s, n), t("../platform/CCClass").fastDefine("cc.Size", s, {
            width: 0,
            height: 0
        }), r.get(s, "ZERO", function() {
            return new s(0, 0);
        });
        var a = s.prototype;
        a.clone = function() {
            return new s(this.width, this.height);
        }, a.equals = function(t) {
            return t && this.width === t.width && this.height === t.height;
        }, a.lerp = function(t, e, i) {
            i = i || new s();
            var n = this.width, r = this.height;
            return i.width = n + (t.width - n) * e, i.height = r + (t.height - r) * e, i;
        }, a.set = function(t) {
            this.width = t.width, this.height = t.height;
        }, a.toString = function() {
            return "(" + this.width.toFixed(2) + ", " + this.height.toFixed(2) + ")";
        }, cc.size = function(t, e) {
            return new s(t, e);
        }, cc.Size = e.exports = s;
    }, {
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "./value-type": 174
    } ],
    174: [ function(t, e, i) {
        var n = t("../platform/js");
        function r() {}
        n.setClassName("cc.ValueType", r);
        var s = r.prototype;
        s.toString = function() {
            return "" + {};
        }, cc.ValueType = e.exports = r;
    }, {
        "../platform/js": 102
    } ],
    175: [ function(t, e, i) {
        var n = t("./value-type"), r = t("../platform/js"), s = t("../platform/CCClass"), a = t("../renderer/render-engine").math, o = t("../utils/misc");
        function c(t, e) {
            t && "object" == typeof t && (e = t.y, t = t.x), this.x = t || 0, this.y = e || 0;
        }
        r.extend(c, n), s.fastDefine("cc.Vec2", c, {
            x: 0,
            y: 0
        });
        var h = c.prototype;
        h.clone = function() {
            return new c(this.x, this.y);
        }, h.set = function(t) {
            return this.x = t.x, this.y = t.y, this;
        }, h.equals = function(t) {
            return t && this.x === t.x && this.y === t.y;
        }, h.fuzzyEquals = function(t, e) {
            return this.x - e <= t.x && t.x <= this.x + e && this.y - e <= t.y && t.y <= this.y + e;
        }, h.toString = function() {
            return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")";
        }, h.lerp = function(t, e, i) {
            i = i || new c();
            var n = this.x, r = this.y;
            return i.x = n + (t.x - n) * e, i.y = r + (t.y - r) * e, i;
        }, h.clampf = function(t, e) {
            return this.x = o.clampf(this.x, t.x, e.x), this.y = o.clampf(this.y, t.y, e.y), 
            this;
        }, h.addSelf = function(t) {
            return this.x += t.x, this.y += t.y, this;
        }, h.add = function(t, e) {
            return (e = e || new c()).x = this.x + t.x, e.y = this.y + t.y, e;
        }, h.subSelf = function(t) {
            return this.x -= t.x, this.y -= t.y, this;
        }, h.sub = function(t, e) {
            return (e = e || new c()).x = this.x - t.x, e.y = this.y - t.y, e;
        }, h.mulSelf = function(t) {
            return this.x *= t, this.y *= t, this;
        }, h.mul = function(t, e) {
            return (e = e || new c()).x = this.x * t, e.y = this.y * t, e;
        }, h.scaleSelf = function(t) {
            return this.x *= t.x, this.y *= t.y, this;
        }, h.scale = function(t, e) {
            return (e = e || new c()).x = this.x * t.x, e.y = this.y * t.y, e;
        }, h.divSelf = function(t) {
            return this.x /= t, this.y /= t, this;
        }, h.div = function(t, e) {
            return (e = e || new c()).x = this.x / t, e.y = this.y / t, e;
        }, h.negSelf = function() {
            return this.x = -this.x, this.y = -this.y, this;
        }, h.neg = function(t) {
            return (t = t || new c()).x = -this.x, t.y = -this.y, t;
        }, h.dot = function(t) {
            return this.x * t.x + this.y * t.y;
        }, h.cross = function(t) {
            return this.x * t.y - this.y * t.x;
        }, h.mag = function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }, h.magSqr = function() {
            return this.x * this.x + this.y * this.y;
        }, h.normalizeSelf = function() {
            var t = this.x * this.x + this.y * this.y;
            if (1 === t) return this;
            if (0 === t) return this;
            var e = 1 / Math.sqrt(t);
            return this.x *= e, this.y *= e, this;
        }, h.normalize = function(t) {
            return (t = t || new c()).x = this.x, t.y = this.y, t.normalizeSelf(), t;
        }, h.angle = function(t) {
            var e = this.magSqr(), i = t.magSqr();
            if (0 === e || 0 === i) return console.warn("Can't get angle between zero vector"), 
            0;
            var n = this.dot(t) / Math.sqrt(e * i);
            return n = o.clampf(n, -1, 1), Math.acos(n);
        }, h.signAngle = function(t) {
            var e = this.angle(t);
            return this.cross(t) < 0 ? -e : e;
        }, h.rotate = function(t, e) {
            return (e = e || new c()).x = this.x, e.y = this.y, e.rotateSelf(t);
        }, h.rotateSelf = function(t) {
            var e = Math.sin(t), i = Math.cos(t), n = this.x;
            return this.x = i * n - e * this.y, this.y = e * n + i * this.y, this;
        }, h.project = function(t) {
            return t.mul(this.dot(t) / t.dot(t));
        }, h.transformMat4 = function(t, e) {
            e = e || new c(), a.vec2.transformMat4(e, this, t);
        }, r.get(c, "ONE", function() {
            return new c(1, 1);
        }), r.get(c, "ZERO", function() {
            return new c(0, 0);
        }), r.get(c, "UP", function() {
            return new c(0, 1);
        }), r.get(c, "RIGHT", function() {
            return new c(1, 0);
        }), cc.Vec2 = c, cc.v2 = function(t, e) {
            return new c(t, e);
        }, cc.p = cc.v2, e.exports = cc.Vec2;
    }, {
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "../renderer/render-engine": 124,
        "../utils/misc": 159,
        "./value-type": 174
    } ],
    176: [ function(t, e, i) {
        var n = t("./value-type"), r = t("../platform/js"), s = t("../platform/CCClass"), a = t("../renderer/render-engine").math, o = t("../utils/misc");
        function c(t, e, i) {
            t && "object" == typeof t && (i = t.z, e = t.y, t = t.x), this.x = t || 0, this.y = e || 0, 
            this.z = i || 0;
        }
        r.extend(c, n), s.fastDefine("cc.Vec3", c, {
            x: 0,
            y: 0,
            z: 0
        });
        var h = c.prototype;
        h.clone = function() {
            return new c(this.x, this.y, this.z);
        }, h.set = function(t) {
            return this.x = t.x, this.y = t.y, this.z = t.z, this;
        }, h.equals = function(t) {
            return t && this.x === t.x && this.y === t.y && this.z === t.z;
        }, h.fuzzyEquals = function(t, e) {
            return this.x - e <= t.x && t.x <= this.x + e && this.y - e <= t.y && t.y <= this.y + e && this.z - e <= t.z && t.z <= this.z + e;
        }, h.toString = function() {
            return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ")";
        }, h.lerp = function(t, e, i) {
            return i = i || new c(), a.vec3.lerp(i, this, t, e), i;
        }, h.clampf = function(t, e) {
            return this.x = o.clampf(this.x, t.x, e.x), this.y = o.clampf(this.y, t.y, e.y), 
            this.z = o.clampf(this.z, t.z, e.z), this;
        }, h.addSelf = function(t) {
            return this.x += t.x, this.y += t.y, this.z += t.z, this;
        }, h.add = function(t, e) {
            return (e = e || new c()).x = this.x + t.x, e.y = this.y + t.y, e.z = this.z + t.z, 
            e;
        }, h.subSelf = function(t) {
            return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
        }, h.sub = function(t, e) {
            return (e = e || new c()).x = this.x - t.x, e.y = this.y - t.y, e.z = this.z - t.z, 
            e;
        }, h.mulSelf = function(t) {
            return this.x *= t, this.y *= t, this.z *= t, this;
        }, h.mul = function(t, e) {
            return (e = e || new c()).x = this.x * t, e.y = this.y * t, e.z = this.z * t, e;
        }, h.scaleSelf = function(t) {
            return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
        }, h.scale = function(t, e) {
            return (e = e || new c()).x = this.x * t.x, e.y = this.y * t.y, e.z = this.z * t.z, 
            e;
        }, h.divSelf = function(t) {
            return this.x /= t, this.y /= t, this.z /= t, this;
        }, h.div = function(t, e) {
            return (e = e || new c()).x = this.x / t, e.y = this.y / t, e.z = this.z / t, e;
        }, h.negSelf = function() {
            return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
        }, h.neg = function(t) {
            return (t = t || new c()).x = -this.x, t.y = -this.y, t.z = -this.z, t;
        }, h.dot = function(t) {
            return this.x * t.x + this.y * t.y + this.z * t.z;
        }, h.cross = function(t, e) {
            return e = e || new c(), a.vec3.cross(e, this, t), e;
        }, h.mag = function() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }, h.magSqr = function() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }, h.normalizeSelf = function() {
            return a.vec3.normalize(this, this), this;
        }, h.normalize = function(t) {
            return t = t || new c(), a.vec3.normalize(t, this), t;
        }, h.transformMat4 = function(t, e) {
            e = e || new c(), a.vec3.transformMat4(e, this, t);
        }, cc.v3 = function(t, e, i) {
            return new c(t, e, i);
        }, e.exports = cc.Vec3 = c;
    }, {
        "../platform/CCClass": 82,
        "../platform/js": 102,
        "../renderer/render-engine": 124,
        "../utils/misc": 159,
        "./value-type": 174
    } ],
    177: [ function(t, e, i) {
        cc.js;
    }, {} ],
    178: [ function(t, e, i) {
        t("./core/CCGame"), t("./actions");
    }, {
        "./actions": void 0,
        "./core/CCGame": 3
    } ],
    179: [ function(t, e, i) {
        var n = t("../core/assets/CCAsset"), r = t("../core/assets/CCSpriteFrame"), s = cc.Class({
            name: "cc.ParticleAsset",
            extends: n,
            properties: {
                spriteFrame: {
                    default: null,
                    type: r
                }
            }
        });
        cc.ParticleAsset = e.exports = s;
    }, {
        "../core/assets/CCAsset": 8,
        "../core/assets/CCSpriteFrame": 20
    } ],
    180: [ function(t, e, i) {
        var n = cc.Class({
            name: "cc.TiledMapAsset",
            extends: cc.Asset,
            properties: {
                tmxXmlStr: "",
                textures: {
                    default: [],
                    type: [ cc.Texture2D ]
                },
                textureNames: [ cc.String ],
                tsxFiles: [ cc.TextAsset ],
                tsxFileNames: [ cc.String ]
            },
            statics: {
                preventDeferredLoadDependents: !0
            },
            createNode: !1
        });
        cc.TiledMapAsset = n, e.exports = n;
    }, {} ],
    181: [ function(t, e, i) {
        t("./cocos2d/core"), t("./cocos2d/animation"), t("./cocos2d/particle"), t("./cocos2d/tilemap"), 
        t("./cocos2d/videoplayer/CCVideoPlayer"), t("./cocos2d/webview/CCWebView"), t("./cocos2d/core/components/CCStudioComponent"), 
        t("./extensions/ccpool/CCNodePool"), t("./cocos2d/actions"), t("./extensions/spine"), 
        t("./extensions/dragonbones"), t("./cocos2d/deprecated");
    }, {
        "./cocos2d/actions": void 0,
        "./cocos2d/animation": void 0,
        "./cocos2d/core": 58,
        "./cocos2d/core/components/CCStudioComponent": void 0,
        "./cocos2d/deprecated": 177,
        "./cocos2d/particle": void 0,
        "./cocos2d/particle/CCParticleAsset": 179,
        "./cocos2d/tilemap": void 0,
        "./cocos2d/tilemap/CCTiledMapAsset": 180,
        "./cocos2d/videoplayer/CCVideoPlayer": void 0,
        "./cocos2d/webview/CCWebView": void 0,
        "./extensions/ccpool/CCNodePool": void 0,
        "./extensions/dragonbones": void 0,
        "./extensions/spine": void 0
    } ],
    182: [ function(t, e, i) {
        var n = "undefined" == typeof window ? global : window;
        n.cc = n.cc || {}, n._cc = n._cc || {}, t("./predefine"), t("./polyfill/string"), 
        t("./polyfill/misc"), t("./polyfill/array"), t("./polyfill/object"), t("./polyfill/array-buffer"), 
        t("./polyfill/typescript"), t("./cocos2d/core/predefine"), t("./cocos2d"), t("./extends"), 
        e.exports = n.cc;
    }, {
        "./cocos2d": 178,
        "./cocos2d/core/predefine": 107,
        "./extends": 181,
        "./package": void 0,
        "./polyfill/array": 184,
        "./polyfill/array-buffer": 183,
        "./polyfill/misc": 185,
        "./polyfill/object": 186,
        "./polyfill/string": 187,
        "./polyfill/typescript": 188,
        "./predefine": 189
    } ],
    183: [ function(t, e, i) {
        ArrayBuffer.isView || function() {
            var t = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array())).constructor;
            ArrayBuffer.isView = function(e) {
                return e instanceof t;
            };
        }();
    }, {} ],
    184: [ function(t, e, i) {
        Array.isArray || (Array.isArray = function(t) {
            return "[object Array]" === Object.prototype.toString.call(t);
        });
    }, {} ],
    185: [ function(t, e, i) {
        if (Math.sign || (Math.sign = function(t) {
            return 0 === (t = +t) || isNaN(t) ? t : t > 0 ? 1 : -1;
        }), Number.isInteger || (Number.isInteger = function(t) {
            return "number" == typeof t && isFinite(t) && Math.floor(t) === t;
        }), !console.time) {
            var n = window.performance || Date, r = Object.create(null);
            console.time = function(t) {
                r[t] = n.now();
            }, console.timeEnd = function(t) {
                var e = r[t], i = n.now() - e;
                console.log(t + ": " + i + "ms");
            };
        }
    }, {} ],
    186: [ function(t, e, i) {
        Object.assign || (Object.assign = function(t, e) {
            cc.js.mixin(t, e);
        }), Object.getOwnPropertyDescriptors || (Object.getOwnPropertyDescriptors = function(t) {
            for (var e = {}, i = Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t)), n = 0; n < i.length; ++n) {
                var r = i[n];
                e[r] = Object.getOwnPropertyDescriptor(t, r);
            }
            return e;
        });
    }, {} ],
    187: [ function(t, e, i) {
        String.prototype.startsWith || (String.prototype.startsWith = function(t, e) {
            return e = e || 0, this.lastIndexOf(t, e) === e;
        }), String.prototype.endsWith || (String.prototype.endsWith = function(t, e) {
            (void 0 === e || e > this.length) && (e = this.length), e -= t.length;
            var i = this.indexOf(t, e);
            return -1 !== i && i === e;
        });
    }, {} ],
    188: [ function(t, e, i) {
        var n = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(t, e) {
            t.__proto__ = e;
        } || function(t, e) {
            for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
        };
        window.__extends = function(t, e) {
            function i() {
                this.constructor = t;
            }
            n(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, 
            new i());
        }, window.__assign = Object.assign || function(t) {
            for (var e, i = 1, n = arguments.length; i < n; i++) for (var r in e = arguments[i]) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t;
        }, window.__rest = function(t, e) {
            var i = {};
            for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (i[n] = t[n]);
            if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                var r = 0;
                for (n = Object.getOwnPropertySymbols(t); r < n.length; r++) e.indexOf(n[r]) < 0 && (i[n[r]] = t[n[r]]);
            }
            return i;
        }, window.__decorate = function(t, e, i, n) {
            var r, s = arguments.length, a = s < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, i, n); else for (var o = t.length - 1; o >= 0; o--) (r = t[o]) && (a = (s < 3 ? r(a) : s > 3 ? r(e, i, a) : r(e, i)) || a);
            return s > 3 && a && Object.defineProperty(e, i, a), a;
        }, window.__param = function(t, e) {
            return function(i, n) {
                e(i, n, t);
            };
        }, window.__metadata = function(t, e) {
            if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(t, e);
        }, window.__awaiter = function(t, e, i, n) {
            return new (i || (i = Promise))(function(r, s) {
                function a(t) {
                    try {
                        c(n.next(t));
                    } catch (t) {
                        s(t);
                    }
                }
                function o(t) {
                    try {
                        c(n.throw(t));
                    } catch (t) {
                        s(t);
                    }
                }
                function c(t) {
                    t.done ? r(t.value) : new i(function(e) {
                        e(t.value);
                    }).then(a, o);
                }
                c((n = n.apply(t, e || [])).next());
            });
        }, window.__generator = function(t, e) {
            var i, n, r, s, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0]) throw r[1];
                    return r[1];
                },
                trys: [],
                ops: []
            };
            return s = {
                next: o(0),
                throw: o(1),
                return: o(2)
            }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
                return this;
            }), s;
            function o(s) {
                return function(o) {
                    return function(s) {
                        if (i) throw new TypeError("Generator is already executing.");
                        for (;a; ) try {
                            if (i = 1, n && (r = n[2 & s[0] ? "return" : s[0] ? "throw" : "next"]) && !(r = r.call(n, s[1])).done) return r;
                            switch (n = 0, r && (s = [ 0, r.value ]), s[0]) {
                              case 0:
                              case 1:
                                r = s;
                                break;

                              case 4:
                                return a.label++, {
                                    value: s[1],
                                    done: !1
                                };

                              case 5:
                                a.label++, n = s[1], s = [ 0 ];
                                continue;

                              case 7:
                                s = a.ops.pop(), a.trys.pop();
                                continue;

                              default:
                                if (!(r = (r = a.trys).length > 0 && r[r.length - 1]) && (6 === s[0] || 2 === s[0])) {
                                    a = 0;
                                    continue;
                                }
                                if (3 === s[0] && (!r || s[1] > r[0] && s[1] < r[3])) {
                                    a.label = s[1];
                                    break;
                                }
                                if (6 === s[0] && a.label < r[1]) {
                                    a.label = r[1], r = s;
                                    break;
                                }
                                if (r && a.label < r[2]) {
                                    a.label = r[2], a.ops.push(s);
                                    break;
                                }
                                r[2] && a.ops.pop(), a.trys.pop();
                                continue;
                            }
                            s = e.call(t, a);
                        } catch (t) {
                            s = [ 6, t ], n = 0;
                        } finally {
                            i = r = 0;
                        }
                        if (5 & s[0]) throw s[1];
                        return {
                            value: s[0] ? s[1] : void 0,
                            done: !0
                        };
                    }([ s, o ]);
                };
            }
        }, window.__exportStar = function(t, e) {
            for (var i in t) e.hasOwnProperty(i) || (e[i] = t[i]);
        }, window.__values = function(t) {
            var e = "function" == typeof Symbol && t[Symbol.iterator], i = 0;
            return e ? e.call(t) : {
                next: function() {
                    return t && i >= t.length && (t = void 0), {
                        value: t && t[i++],
                        done: !t
                    };
                }
            };
        }, window.__read = function(t, e) {
            var i = "function" == typeof Symbol && t[Symbol.iterator];
            if (!i) return t;
            var n, r, s = i.call(t), a = [];
            try {
                for (;(void 0 === e || e-- > 0) && !(n = s.next()).done; ) a.push(n.value);
            } catch (t) {
                r = {
                    error: t
                };
            } finally {
                try {
                    n && !n.done && (i = s.return) && i.call(s);
                } finally {
                    if (r) throw r.error;
                }
            }
            return a;
        }, window.__spread = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(__read(arguments[e]));
            return t;
        }, window.__await = function(t) {
            return this instanceof __await ? (this.v = t, this) : new __await(t);
        }, window.__asyncGenerator = function(t, e, i) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var n, r = i.apply(t, e || []), s = [];
            return n = {}, a("next"), a("throw"), a("return"), n[Symbol.asyncIterator] = function() {
                return this;
            }, n;
            function a(t) {
                r[t] && (n[t] = function(e) {
                    return new Promise(function(i, n) {
                        s.push([ t, e, i, n ]) > 1 || o(t, e);
                    });
                });
            }
            function o(t, e) {
                try {
                    (function(t) {
                        t.value instanceof __await ? Promise.resolve(t.value.v).then(c, h) : l(s[0][2], t);
                    })(r[t](e));
                } catch (t) {
                    l(s[0][3], t);
                }
            }
            function c(t) {
                o("next", t);
            }
            function h(t) {
                o("throw", t);
            }
            function l(t, e) {
                t(e), s.shift(), s.length && o(s[0][0], s[0][1]);
            }
        }, window.__asyncDelegator = function(t) {
            var e, i;
            return e = {}, n("next"), n("throw", function(t) {
                throw t;
            }), n("return"), e[Symbol.iterator] = function() {
                return this;
            }, e;
            function n(n, r) {
                t[n] && (e[n] = function(e) {
                    return (i = !i) ? {
                        value: __await(t[n](e)),
                        done: "return" === n
                    } : r ? r(e) : e;
                });
            }
        }, window.__asyncValues = function(t) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var e = t[Symbol.asyncIterator];
            return e ? e.call(t) : "function" == typeof __values ? __values(t) : t[Symbol.iterator]();
        };
    }, {} ],
    189: [ function(t, e, i) {
        var n = "undefined" == typeof window ? global : window;
        function r(t, e) {
            void 0 === n[t] && (n[t] = e);
        }
        r("CC_BUILD", !1), n.CC_BUILD = !0, n.CC_TEST = !1, n.CC_EDITOR = !1, n.CC_PREVIEW = !1, 
        n.CC_DEV = !1, n.CC_DEBUG = !1, n.CC_JSB = !1, n.CC_WECHATGAMESUB = !0, n.CC_WECHATGAME = !0, 
        n.CC_QQPLAY = !1, n.CC_RUNTIME = !1, n.CC_SUPPORT_JIT = !1;
        n.CocosEngine = cc.ENGINE_VERSION = "2.0.9";
    }, {} ]
}, {}, [ 182 ]);