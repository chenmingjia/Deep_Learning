window.__require = function e(t, n, i) {
    function o(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var r = a.split("/");
                if (r = r[r.length - 1], !t[r]) {
                    var d = "function" == typeof __require && __require;
                    if (!s && d) return d(r, !0);
                    if (c) return c(r, !0);
                    throw new Error("Cannot find module '" + a + "'");
                }
            }
            var l = n[a] = {
                exports: {}
            };
            t[a][0].call(l.exports, function(e) {
                return o(t[a][1][e] || e);
            }, l, l.exports, e, t, n, i);
        }
        return n[a].exports;
    }
    for (var c = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
    return o;
}({
    ADMoveScript: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "5ce51gabUNEI4ZGAOOeF7NI", "ADMoveScript"), cc.Class({
            extends: cc.Component,
            properties: {
                spiteFrame1: cc.SpriteFrame,
                spiteFrame2: cc.SpriteFrame,
                type: !0
            },
            start: function() {
                this.ad = cc.find("Canvas/UI_Result"), this.time = 0;
            },
            update: function(e) {
                1 == this.ad.active && (this.time += e, this.time > 1 && (this.time -= 1, 1 == this.type ? (this.type = !this.type, 
                this.node.getComponent(cc.Sprite).spriteFrame = this.spiteFrame1) : (this.type = !this.type, 
                this.node.getComponent(cc.Sprite).spriteFrame = this.spiteFrame2)));
            }
        }), cc._RF.pop();
    }, {} ],
    Ammo: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "324adPETN5Ih4mXInGkADqc", "Ammo"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                var e = this.node;
                e.getComponent(cc.Animation).play(), e.getChildByName("ammo1").getComponent(cc.Animation).play(), 
                e.getChildByName("lightning").getComponent(cc.Animation).play();
                var t = e.getChildByName("wing1");
                t.rotation = 0, t.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(.2, -5), cc.rotateBy(.4, 10), cc.rotateBy(.2, -5))));
                var n = e.getChildByName("wing2");
                n.rotation = 0, n.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(.2, 5), cc.rotateBy(.4, -10), cc.rotateBy(.2, 5))));
                var i = e.getChildByName("word");
                i.scale = 0, i.runAction(cc.sequence(cc.scaleTo(.4, 1), cc.callFunc(function() {
                    i && i.isValid && (i.scale = 0);
                })));
            },
            onDisable: function() {
                var e = this.node;
                e.getComponent(cc.Animation).stop(), e.getChildByName("ammo1").getComponent(cc.Animation).stop(), 
                e.getChildByName("lightning").getComponent(cc.Animation).stop(), e.getChildByName("wing1").stopAllActions(), 
                e.getChildByName("wing2").stopAllActions(), e.getChildByName("word").stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    AudioManager: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "913c9b8akFIf6AXZKC6wxsU", "AudioManager"), window.AMI = function() {
            cc.audioEngine.setMaxAudioInstance(3);
            var e = -1, t = -1;
            return {
                playMusic: function(e) {
                    cc.loader.loadRes(e, cc.AudioClip, function(e, t) {
                        e || cc.audioEngine.playMusic(t, !0);
                    });
                },
                playEffect: function(e) {
                    cc.loader.loadRes(e, cc.AudioClip, function(e, t) {
                        e || cc.audioEngine.playEffect(t, !1);
                    });
                },
                openMusic: function() {
                    cc.audioEngine.setMusicVolume(1);
                },
                closeMusic: function() {
                    cc.audioEngine.setMusicVolume(0);
                },
                openEffect: function() {
                    cc.audioEngine.setEffectsVolume(1), this._tryActiveMusic();
                },
                closeEffect: function() {
                    cc.audioEngine.setEffectsVolume(0), this._tryActiveMusic();
                },
                _tryActiveMusic: function() {
                    cc.audioEngine.getMusicVolume() > .1 ? this.openMusic() : this.closeMusic();
                },
                replayBgm: function() {
                    switch (cc.audioEngine.getMusicVolume() > .1 ? this.openMusic() : this.closeMusic(), 
                    e) {
                      default:
                        break;

                      case 1:
                        this.playMusic_normalBgm();
                        break;

                      case 2:
                        this.playMusic_endlessGame();
                        break;

                      case 3:
                        this.playMusic_levelGame();
                        break;

                      case 4:
                        this.playMusic_beatingBgm();
                    }
                },
                playMusic_normalBgm: function() {
                    1 == e && cc.audioEngine.isMusicPlaying() || (e = 1, this.playMusic("music/normalBgm", !0));
                },
                playMusic_endlessGame: function() {
                    2 == e && cc.audioEngine.isMusicPlaying() || (e = 2, this.playMusic("music/endlessGame", !0));
                },
                playMusic_levelGame: function() {
                    if (3 == e && cc.audioEngine.isMusicPlaying()) return console.log("_bgmTag == 3"), 
                    void this.playMusic("music/levelGame", !0);
                    e = 3, console.log("this.playMusic()"), this.playMusic("music/levelGame", !0);
                },
                playMusic_beatingBgm: function() {
                    4 == e && cc.audioEngine.isMusicPlaying() || (e = 4, this.playMusic("music/beatingBoss", !0));
                },
                playEffect_eatCoin: function() {
                    this.playEffect("music/eatCoin");
                },
                playEffect_shockWave: function() {
                    this.playEffect("music/shockWave");
                },
                playEffect_sprint: function() {
                    cc.loader.loadRes("music/sprint", cc.AudioClip, function(e, n) {
                        e || (t = cc.audioEngine.playEffect(n, !1));
                    });
                },
                playEffect_warning: function() {
                    this.playEffect("music/warning");
                },
                playEffect_explosion: function() {
                    this.playEffect("music/explosion");
                },
                playEffect_firework: function() {
                    this.playEffect("music/firework");
                },
                stopEffect_sprint: function() {
                    t > 0 && cc.audioEngine.stopEffect(t);
                }
            };
        }(), cc._RF.pop();
    }, {} ],
    AutoPlay: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "3e15fAGyAxGlL2BreKEBig4", "AutoPlay"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this.node.getComponent(cc.Animation).play();
            },
            onDisable: function() {
                this.node.getComponent(cc.Animation).stop();
            }
        }), cc._RF.pop();
    }, {} ],
    BossControl: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "23d1f4D89FAVIOPBjVhpBNR", "BossControl");
        cc.Class({
            extends: cc.Component,
            init: function(e) {
                var t = e.code;
                this._coinNum = e.coinNum;
                var n = e.hp;
                switch (this._medalNum = e.medalNum, this._hp = this._hpMax = n, this.count = 0, 
                t) {
                  case "BOSS01":
                    this.attackModes = [ this.shoot1_1.bind(this), this.shoot1_2.bind(this), this.shoot1_3.bind(this) ];
                    break;

                  case "BOSS02":
                    this.attackModes = [ this.shoot2_1.bind(this), this.shoot2_2.bind(this), this.shoot2_3.bind(this) ];
                    break;

                  case "BOSS03":
                    this.attackModes = [ this.shoot3_1.bind(this), this.shoot3_2.bind(this), this.shoot3_3.bind(this), this.shoot3_4.bind(this) ];
                    break;

                  case "BOSS04":
                    this.attackModes = [ this.shoot4_1.bind(this), this.shoot4_2.bind(this), this.shoot4_3.bind(this), this.shoot4_4.bind(this) ];
                    break;

                  case "BOSS05":
                    this.attackModes = [ this.shoot5_1.bind(this), this.shoot5_2.bind(this), this.shoot5_3.bind(this), this.shoot5_4.bind(this) ];
                }
            },
            onEnable: function() {
                this._invincible = !1, this._crashed = !1;
                var e = this.node.getChildByName("bar_hp");
                e && e.isValid ? e.active = !1 : (e = m_pool.getObject("bar_hp")) && (e.scale = 1, 
                e.position = cc.v2(0, this.node.height / 2 - 13), e.parent = this.node, e.active = !1, 
                this.bar_hp = e, this.BAR_HP = e.getChildByName("bar_hp").getComponent(cc.ProgressBar));
            },
            onDisable: function() {
                this.unscheduleAllCallbacks(), this.node.stopAllActions();
            },
            run: function() {
                this._invincible = !1;
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2, n = cc.rect(-e, t / 2, 2 * e, t / 2), i = this.node, o = function() {
                    var e = i.position, t = cc.v2(between(n.x, n.x + n.width), between(n.y, n.y + n.height)), c = t.sub(e).mag() / 100 || 1;
                    i.runAction(cc.sequence(cc.moveTo(c, t).easing(cc.easeSineInOut()), cc.callFunc(o)));
                }.bind(this);
                o(), this.step();
            },
            test: function() {
                for (var e = 0, t = m_iterateLayer.children, n = 0; n < t.length; n++) {
                    var i = t[n];
                    if (i && i.isValid && i.active && "D" == i.name.charAt(0) && ++e > 3) return !1;
                }
                return !0;
            },
            step: function() {
                if (this.test()) if (0 == this.count) this.count++, this.attackModes[0](); else {
                    var e = between(4, 7);
                    this.scheduleOnce(function() {
                        var e = this.attackModes, t = this.count;
                        if (t < e.length) {
                            var n = e[t];
                            this.count++;
                        } else n = e[Math.floor(Math.random() * e.length)];
                        n();
                    }.bind(this), e);
                } else this.scheduleOnce(this.step.bind(this), between(4, 7));
            },
            updateHp: function(e) {
                if (this._hp = cc.misc.clampf(this._hp + e, 0, this._hpMax), this.bar_hp.active = !0, 
                this.BAR_HP.progress = cc.misc.clampf(this._hp / this._hpMax, 0, 1), WXI.vibrateShort(), 
                this._hp <= 0 && !this._crashed) {
                    this._crashed = !0;
                    var t = this.node.position, n = this.node.width / 2, i = this.node.height / 2;
                    this.unscheduleAllCallbacks(), this.node.stopAllActions(), this.node.removeComponent(cc.PolygonCollider), 
                    this.m_schedule(function() {
                        var e = t.add(cc.v2(between(-n, n), between(-i, i)));
                        drop("explosion", e, 30), AMI.playEffect_explosion();
                    }.bind(this), .2, 20, function() {
                        this.node && this.node.isValid && (EMI.dispatchEvent(m_define.eventType.medalGot, {
                            num: this._medalNum,
                            position: t,
                            bossFight: !0
                        }), this.node.destroy());
                    }.bind(this));
                    for (var o = this._coinNum, c = 0; c < o; c++) {
                        var a = t.add(cc.v2(between(-n, n), between(-i, i)));
                        EMI.dispatchEvent(m_define.eventType.coinGot, a);
                    }
                }
            },
            onCollisionEnter: function(e, t) {
                switch (e.tag) {
                  default:
                    break;

                  case 1:
                    this._invincible || this.updateHp(-m_data.damage);
                    var n = e.node;
                    drop("hit", n.position.add(cc.v2(0, 64)), 61), m_pool.pushObject(n);
                    break;

                  case 3:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), m_pool.pushObject(n);
                    break;

                  case 4:
                    this._invincible || this.updateHp(-m_data.wingmanDamage);
                    break;

                  case 6:
                    this._invincible || this.updateHp(-m_data.wingmanDamage);
                    n = e.node;
                    drop("hit5", n.position.add(cc.v2(0, 94)), 61), m_pool.pushObject(n);
                    break;

                  case 7:
                    this._invincible || this.updateHp(-m_data.wingmanDamage);
                    n = e.node;
                    drop("hit5", n.position.add(n.rotation < 0 ? cc.v2(-94, 0) : cc.v2(94, 0)), 61);
                    break;

                  case 8:
                    this._invincible || this.updateHp(-m_data.damage);
                    n = e.node;
                    drop("hit", n.position.add(cc.v2(0, 64)), 61), EMI.dispatchEvent(m_define.eventType.coinGotCoinBag, n.position.add(cc.v2(0, 64))), 
                    m_pool.pushObject(n);
                    break;

                  case 9:
                    this._invincible || this.updateHp(-m_data.wingmanDamage);
                    n = e.node;
                    drop("hit1", cc.v2(n.x, this.node.y), 61);
                    break;

                  case 10:
                    this._invincible || this.updateHp(-m_data.wingmanDamage);
                    n = e.node;
                    drop("hit2", n.position, 61), m_pool.pushObject(n);
                    break;

                  case 12:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), drop("hit4", n.position, 61);
                }
            },
            onCollisionStay: function(e, t) {
                this._invincible || 2 == e.tag && (this.updateHp(-m_data.damage), Math.random() < .4 && drop("hit4", cc.v2(e.node.x, this.node.y), 61));
            },
            attachEnemy: function(e) {
                var t = e.code || "D1", n = e.position || cc.v2(0, 0), i = e.action || cc.place(0, 0), o = e.moveLogic || 0, c = e.shootLogic || 0, a = e.zIndex || 0;
                switch (t) {
                  case "D1":
                    c = m_define.shootLogicType.shootPGM;
                    break;

                  case "D2":
                    c = m_define.shootLogicType.shootStraight;
                    break;

                  case "D3":
                    c = m_define.shootLogicType.shootStraightTrack;
                    break;

                  case "D4":
                    c = m_define.shootLogicType.shootFissure;
                    break;

                  case "D0":
                    c = m_define.shootLogicType.shootExpand;
                }
                var s = JMI.getEnemyData(t), r = m_pool.getObject(t);
                if (r) {
                    switch (r.scale = 0, t) {
                      default:
                        r.zIndex = 10;
                        break;

                      case "D1":
                        r.zIndex = 11;
                        break;

                      case "D2":
                        r.zIndex = 12;
                        break;

                      case "D3":
                        r.zIndex = 13;
                        break;

                      case "D4":
                        r.zIndex = 14;
                        break;

                      case "D6":
                        r.zIndex = 15;
                        break;

                      case "D8":
                        r.zIndex = 16;
                        break;

                      case "D0":
                        r.zIndex = 17;
                    }
                    s.rate_coin = 0, s.rate_medal = [ 1, 0, 0, 0, 0, 0, 0 ];
                    var d = r.getComponent("EnemyControl") || r.addComponent("EnemyControl");
                    d.init(t, s), r.position = n, r.attachParent(m_iterateLayer, a), r.runAction(cc.sequence(i, cc.callFunc(function() {
                        d && (d.useMoveLogic(o), d.useShootLogic(c));
                    })));
                }
            },
            getRandomShoot: function() {
                var e = [ m_define.shootLogicType.shootFissure, m_define.shootLogicType.shootPGM, m_define.shootLogicType.shootStraight, m_define.shootLogicType.shootStraightTrack, m_define.shootLogicType.shootExpand ];
                return e[Math.floor(Math.random() * e.length)];
            },
            getRamdomEnemy: function() {
                var e = [ "D1", "D2", "D3", "D4", "D0" ];
                return e[Math.floor(Math.random() * e.length)];
            },
            shoot1_1: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = this.getRamdomEnemy(), o = this.getRandomShoot(), c = this.node.position.add(cc.v2(0, 0)), a = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 3, 2 * t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: a,
                    action: n(cc.v2(e / 3, 2 * t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 3, t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: a,
                    action: n(cc.v2(e / 3, t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.step();
            },
            shoot1_2: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = this.getRamdomEnemy(), o = this.getRandomShoot(), c = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-2 * e / 3, 3 * t / 4)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 3, t / 2)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(0, t / 4)),
                    moveLogic: m_define.moveLogicType.topScreenBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 3, t / 2)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(2 * e / 3, 3 * t / 4)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.step();
            },
            shoot1_3: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = this.getRamdomEnemy(), o = this.getRandomShoot(), c = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 2, 2 * t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(0, 2 * t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 2, 2 * t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 3, t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 3, t / 3)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.step();
            },
            shoot2_1: function() {
                this.shoot1_3();
            },
            shoot2_2: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = this.getRamdomEnemy(), o = this.getRandomShoot(), c = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(0, 3 * t / 4)),
                    moveLogic: m_define.moveLogicType.topScreenTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 2, t / 2)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(0, t / 2)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 2, t / 2)),
                    moveLogic: m_define.moveLogicType.topScreenTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(0, t / 4)),
                    moveLogic: m_define.moveLogicType.topScreenBottom,
                    shootLogic: o
                }), this.step();
            },
            shoot2_3: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = this.getRamdomEnemy(), o = this.getRandomShoot(), c = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-3 * e / 5, 4 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(3 * e / 5, 4 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 5, 3 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 5, 3 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-3 * e / 5, 2 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(3 * e / 5, 2 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 5, t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 5, t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.step();
            },
            shoot3_1: function() {
                this.shoot1_2();
            },
            shoot3_2: function() {
                this.shoot2_3();
            },
            shoot3_3: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = m_define.shootLogicType.shootNothing, o = m_define.moveLogicType.UAVFullScreenHalfTimeTrack, c = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: "D6",
                    position: c,
                    action: n(cc.v2(-5 * e / 7, t / 7)),
                    moveLogic: o,
                    shootLogic: i
                }), this.attachEnemy({
                    code: "D6",
                    position: c,
                    action: n(cc.v2(-3 * e / 7, 2 * t / 7)),
                    moveLogic: o,
                    shootLogic: i
                }), this.attachEnemy({
                    code: "D6",
                    position: c,
                    action: n(cc.v2(-e / 7, 3 * t / 7)),
                    moveLogic: o,
                    shootLogic: i
                }), this.attachEnemy({
                    code: "D6",
                    position: c,
                    action: n(cc.v2(e / 7, 4 * t / 7)),
                    moveLogic: o,
                    shootLogic: i
                }), this.attachEnemy({
                    code: "D6",
                    position: c,
                    action: n(cc.v2(3 * e / 7, 5 * t / 7)),
                    moveLogic: o,
                    shootLogic: i
                }), this.attachEnemy({
                    code: "D6",
                    position: c,
                    action: n(cc.v2(5 * e / 7, 6 * t / 7)),
                    moveLogic: o,
                    shootLogic: i
                }), this.scheduleOnce(function() {
                    this.attachEnemy({
                        code: "D6",
                        position: c,
                        action: n(cc.v2(-5 * e / 7, 6 * t / 7)),
                        moveLogic: o,
                        shootLogic: i
                    }), this.attachEnemy({
                        code: "D6",
                        position: c,
                        action: n(cc.v2(-3 * e / 7, 5 * t / 7)),
                        moveLogic: o,
                        shootLogic: i
                    }), this.attachEnemy({
                        code: "D6",
                        position: c,
                        action: n(cc.v2(-e / 7, 4 * t / 7)),
                        moveLogic: o,
                        shootLogic: i
                    }), this.attachEnemy({
                        code: "D6",
                        position: c,
                        action: n(cc.v2(e / 7, 3 * t / 7)),
                        moveLogic: o,
                        shootLogic: i
                    }), this.attachEnemy({
                        code: "D6",
                        position: c,
                        action: n(cc.v2(3 * e / 7, 2 * t / 7)),
                        moveLogic: o,
                        shootLogic: i
                    }), this.attachEnemy({
                        code: "D6",
                        position: c,
                        action: n(cc.v2(5 * e / 7, t / 7)),
                        moveLogic: o,
                        shootLogic: i
                    });
                }.bind(this), 3), this.step();
            },
            shoot3_4: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = this.getRamdomEnemy(), o = this.getRandomShoot(), c = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-3 * e / 5, 4 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(3 * e / 5, 4 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 5, 3 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 5, 3 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 5, 2 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 5, 2 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-3 * e / 5, t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(3 * e / 5, t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.step();
            },
            shoot4_1: function() {
                this.shoot2_2();
            },
            shoot4_2: function() {
                this.shoot3_4();
            },
            shoot4_3: function() {
                var e = cc.winSize.height / 2, t = Math.PI, n = [ t, 3 * t / 4, t / 2, t / 4, 0, 5 * t / 4, 3 * t / 2, 7 * t / 4 ].map(function(t) {
                    return cc.v2(0, e / 2).add(cc.v2(Math.cos(t), Math.sin(t)).mul(200));
                }), i = this.node.position, o = this.getRamdomEnemy(), c = this.getRandomShoot();
                function a(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[0]),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: c
                }), this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[1]),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: c
                }), this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[2]),
                    moveLogic: m_define.moveLogicType.topScreenTop,
                    shootLogic: c
                }), this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[3]),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: c
                }), this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[4]),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: c
                }), this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[5]),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: c
                }), this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[6]),
                    moveLogic: m_define.moveLogicType.topScreenBottom,
                    shootLogic: c
                }), this.attachEnemy({
                    code: o,
                    position: i,
                    action: a(n[7]),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: c
                }), this.step();
            },
            shoot4_4: function() {
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2;
                function n(e) {
                    return cc.spawn(cc.moveTo(.4, e).easing(cc.easeSineInOut()), cc.scaleTo(.4, 1));
                }
                var i = this.getRamdomEnemy(), o = this.getRandomShoot(), c = this.node.position.add(cc.v2(0, 0));
                this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-3 * e / 5, 4 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(3 * e / 5, 4 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 5, 3 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 5, 3 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightTop,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-3 * e / 5, 2 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(3 * e / 5, 2 * t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(-e / 5, t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenLeftBottom,
                    shootLogic: o
                }), this.attachEnemy({
                    code: i,
                    position: c,
                    action: n(cc.v2(e / 5, t / 5)),
                    moveLogic: m_define.moveLogicType.topScreenRightBottom,
                    shootLogic: o
                }), this.step();
            },
            shoot5_1: function() {
                this.shoot4_3();
            },
            shoot5_2: function() {
                this.shoot4_4();
            },
            shoot5_3: function() {
                this.shoot3_3();
            },
            shoot5_4: function() {
                this.shoot2_3();
            }
        }), cc._RF.pop();
    }, {} ],
    Chest: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "6114aCX4eRMzrTXD+Kq1l3X", "Chest"), cc.Class({
            extends: cc.Component,
            properties: {},
            onLoad: function() {
                this.scheduleOnce(function() {
                    this.node.destroy();
                }, .7);
            },
            init: function() {
                this.node.runAction(cc.sequence(cc.delayTime(.3), cc.fadeOut(.4)));
            },
            onClickChest: function() {
                m_data.chest++;
                var e = cc.find("Canvas/ChestGame/starList").children, t = cc.find("Canvas/ChestGame/Text").getComponent(cc.Label);
                switch (m_data.chest) {
                  case 2:
                    e[0].active = !0, t.string = "快快快！";
                    break;

                  case 4:
                    e[1].active = !0, t.string = "再努力一下！";
                    break;

                  case 6:
                    e[2].active = !0, t.string = "神一样的手速！";
                    break;

                  case 8:
                    e[3].active = !0, t.string = "大奖就在眼前！";
                    break;

                  case 10:
                    e[4].active = !0, t.string = "你是最棒的！";
                }
                this.node.destroy();
            }
        }), cc._RF.pop();
    }, {} ],
    CoinBag: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "ef518Cv3NlNnaHTc5lVr5VG", "CoinBag"), cc.Class({
            extends: cc.Component
        }), cc._RF.pop();
    }, {} ],
    Coin: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "8e3614EbHNGII7cUalCWVFx", "Coin"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this._target = null, this.node.getComponent(cc.Animation).play();
            },
            onDisable: function() {
                this.node.getComponent(cc.Animation).stop(), this.node.stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    Core: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "ffacdspOw1Ki54wKLC4tvKb", "Core"), cc.Class({
            extends: cc.Component,
            start: function() {
                EMI.on(m_define.eventType.useItemBegin, function(e) {
                    "shield" != e.getUserData() && "shield_rebirth" != e.getUserData() || (this._invincible = !0);
                }, this), EMI.on(m_define.eventType.useItemEnd, function(e) {
                    this._invincible = !1;
                }, this);
            },
            onEnable: function() {
                this._invincible = !1, this._crashed = !1, this.node.getComponent(cc.Animation).play();
            },
            selfPlaneCrash: function() {
                var e = this.node.parent;
                if (e.isValid) {
                    var t, n = e.position;
                    switch (drop("explosion", n, 30), JMI.getPropData()) {
                      default:
                        break;

                      case 0:
                        t = drop("itemShield", n, 32);
                        break;

                      case 1:
                        t = drop("itemAmmo", n, 33);
                        break;

                      case 2:
                        t = drop("itemGemini", n, 34);
                        break;

                      case 3:
                        t = drop("itemLaser", n, 35);
                        break;

                      case 4:
                        t = drop("itemCoinBag", n, 36);
                    }
                    t && (t.v = cc.v2(0, -60)), AMI.playEffect_explosion(), WXI.vibrateLong(), e.destroy(), 
                    setTimeout(function() {
                        console.log("游戏结束"), EMI.dispatchEvent(m_define.eventType.gameFail);
                    }, 800);
                }
            },
            onCollisionEnter: function(e, t) {
                switch (e.tag) {
                  default:
                    break;

                  case 0:
                    this._invincible || this.selfPlaneCrash();
                    break;

                  case 1:
                    this._invincible || this.selfPlaneCrash(), m_pool.pushObject(e.node);
                    break;

                  case 2:
                    m_pool.pushObject(e.node), EMI.dispatchEvent(m_define.eventType.getItem, "ammo");
                    break;

                  case 3:
                    m_pool.pushObject(e.node), EMI.dispatchEvent(m_define.eventType.getItem, "shield");
                    break;

                  case 4:
                    m_pool.pushObject(e.node), EMI.dispatchEvent(m_define.eventType.getItem, "gemini");
                    break;

                  case 5:
                    m_pool.pushObject(e.node), EMI.dispatchEvent(m_define.eventType.getItem, "laser");
                    break;

                  case 6:
                    this._invincible ? (drop("explosion", this.node.parent.position, 30), AMI.playEffect_explosion()) : this.selfPlaneCrash(), 
                    m_pool.pushObject(e.node);
                    break;

                  case 7:
                    m_pool.pushObject(e.node), EMI.dispatchEvent(m_define.eventType.getItem, "coinBag");
                    break;

                  case 8:
                    m_pool.pushObject(e.node), EMI.dispatchEvent(m_define.eventType.getItem, "super");
                    break;

                  case 9:
                    m_pool.pushObject(e.node), EMI.dispatchEvent(m_define.eventType.getItem, "trywinman");
                }
            }
        }), cc._RF.pop();
    }, {} ],
    DisappearInPool: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "509187kPYpCMII+x1Ey3JG5", "DisappearInPool"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this.node.getComponent(cc.Animation).play();
            },
            onDisappear: function() {
                this.node.isValid && m_pool.pushObject(this.node);
            }
        }), cc._RF.pop();
    }, {} ],
    EnemyBullet1: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "fca04LJtjxC8ZkPddabCQvR", "EnemyBullet1");
        var i = e("EnemyBullet");
        cc.Class({
            extends: i,
            onEnable: function() {
                this.tailMoveBegin(), this._hp = 2, this._crashed = !1, this.node.v = cc.v2(0, -600);
            },
            onDisable: function() {
                this.tailMoveEnd();
            }
        }), cc.Node.prototype.shootEnemyBullet1 = function(e, t, n, i, o) {
            var c = this.getComponent("Shoot") || this.addComponent("Shoot");
            c.unscheduleAllCallbacks();
            var a = function() {
                t instanceof cc.Vec2 && (t = [ t ]), t.forEach(function(t) {
                    var n = m_pool.getObject(e);
                    n && (n.position = this.position.add(t), n.attachParent(m_iterateLayer, o));
                }.bind(this));
            }.bind(this);
            a(), c.schedule(a, i || 1);
        }, cc._RF.pop();
    }, {
        EnemyBullet: "EnemyBullet"
    } ],
    EnemyBullet2: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "8afc4cwgudL7KL7q2C3peda", "EnemyBullet2");
        var i = e("EnemyBullet"), o = 180 / Math.PI;
        cc.Class({
            extends: i,
            onEnable: function() {
                this.tailMoveBegin(), this._hp = 2, this._crashed = !1;
                var e = this.node;
                this.scheduleOnce(function() {
                    e && e.isValid && (m_pool.pushObject(e), drop("explosion", e.position, 30), AMI.playEffect_explosion());
                }, between(2, 4));
            },
            onDisable: function() {
                this.tailMoveEnd(), this.unscheduleAllCallbacks();
            }
        }), cc.Node.prototype.shootEnemyBullet2 = function(e, t, n, i, c) {
            var a = this.getComponent("Shoot") || this.addComponent("Shoot");
            a.unscheduleAllCallbacks();
            var s = function() {
                t instanceof cc.Vec2 && (t = [ t ]), t.forEach(function(t) {
                    var n = m_pool.getObject(e);
                    if (n) {
                        var i = m_mainScene.plane;
                        if (i && i.isValid) {
                            var a = this.position.add(t), s = i.position.sub(a).normalize();
                            n.rotation = s.y > 0 ? Math.atan(s.x / s.y) * o + 180 : Math.atan(s.x / s.y) * o, 
                            n.v = s.mul(300), n.position = this.position.add(t), n.attachParent(m_iterateLayer, c);
                        } else n.rotation = 0, n.v = cc.v2(0, -300), n.position = this.position.add(t), 
                        n.attachParent(m_iterateLayer, c);
                    }
                }.bind(this));
            }.bind(this);
            s(), a.schedule(s, i || 1);
        }, cc._RF.pop();
    }, {
        EnemyBullet: "EnemyBullet"
    } ],
    EnemyBullet3: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "c4140QpPK9HA7W4q+FslR5/", "EnemyBullet3");
        var i = e("EnemyBullet"), o = 180 / Math.PI;
        cc.Class({
            extends: i,
            onEnable: function() {
                this.tailMoveBegin(), this._hp = 2, this._crashed = !1, this._stopTracking = !1, 
                this.node.rotation = 0, this.node.v = cc.v2(0, -300), this.scheduleOnce(function() {
                    this._stopTracking = !0;
                }.bind(this), between(2, 4));
            },
            onDisable: function() {
                this.tailMoveEnd();
            },
            update: function() {
                if (!this._stopTracking) {
                    var e = m_mainScene.plane;
                    if (e && e.isValid) {
                        var t = this.node.position, n = e.position.sub(t);
                        this.node.rotation = n.y > 0 ? Math.atan(n.x / n.y) * o + 180 : Math.atan(n.x / n.y) * o, 
                        this.node.v = n.normalize().mul(300);
                    }
                }
            }
        }), cc.Node.prototype.shootEnemyBullet3 = function(e, t, n, i, o) {
            var c = this.getComponent("Shoot") || this.addComponent("Shoot");
            c.unscheduleAllCallbacks();
            var a = function() {
                t instanceof cc.Vec2 && (t = [ t ]), t.forEach(function(t) {
                    var n = m_pool.getObject(e);
                    n && (n.position = this.position.add(t), n.attachParent(m_iterateLayer, o));
                }.bind(this));
            }.bind(this);
            a(), c.schedule(a, i || 1);
        }, cc._RF.pop();
    }, {
        EnemyBullet: "EnemyBullet"
    } ],
    EnemyBullet4: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "11571jewtBJ45I3/6YyzD4b", "EnemyBullet4");
        var i = Math.PI / 180, o = e("EnemyBullet");
        cc.Class({
            extends: o,
            properties: {
                _target: 0
            },
            onEnable: function() {
                this.tailMoveBegin(), this._hp = 1, this._crashed = !1;
            },
            onDisable: function() {
                this.tailMoveEnd(), this.unscheduleAllCallbacks(), this.schedule(function() {
                    this._target = -this._target;
                }.bind(this), 1);
            },
            fissure: function() {
                this.scheduleOnce(this._fissure.bind(this), between(.1, .3));
            },
            update: function(e) {
                var t = this.node, n = t.rotation, o = this._target;
                n < o ? t.rotation += 1 : n > o && (t.rotation -= 1);
                var c = (270 - t.rotation) * i;
                t.v = cc.v2(Math.cos(c), Math.sin(c)).mul(400);
            },
            _fissure: function() {
                var e = -between(15, 45), t = between(15, 45);
                this._target = e;
                var n = m_pool.getObject("enemyBullet4");
                n && (n.position = this.node.position, n.v = this.node.v, n.getComponent("EnemyBullet4")._target = t, 
                n.attachParent(m_iterateLayer));
            }
        }), cc.Node.prototype.shootEnemyBullet4 = function(e, t, n, i, o) {
            var c = this.getComponent("Shoot") || this.addComponent("Shoot");
            c.unscheduleAllCallbacks();
            var a = function() {
                t instanceof cc.Vec2 && (t = [ t ]), t.forEach(function(t) {
                    var n = m_pool.getObject(e);
                    n && (n.v = cc.v2(0, -400), n.rotation = 0, n.getComponent("EnemyBullet4")._target = 0, 
                    n.position = this.position.add(t), n.attachParent(m_iterateLayer, o), n.getComponent("EnemyBullet4").fissure());
                }.bind(this));
            }.bind(this);
            a(), c.schedule(a, i || 1);
        }, cc._RF.pop();
    }, {
        EnemyBullet: "EnemyBullet"
    } ],
    EnemyBullet5: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "229ec9hEfFJYZCdVLOMdAs2", "EnemyBullet5");
        var i = e("EnemyBullet");
        cc.Class({
            extends: i,
            onEnable: function() {
                this._hp = 2, this._crashed = !1, this.node.scale = .8, this.node.getChildByName("sp").getComponent(cc.Animation).play(), 
                this.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1, 2.4), cc.scaleTo(1, .8))));
            },
            onDisable: function() {
                this.node.getChildByName("sp").getComponent(cc.Animation).stop(), this.node.stopAllActions(), 
                this.unscheduleAllCallbacks();
            }
        }), cc._RF.pop();
    }, {
        EnemyBullet: "EnemyBullet"
    } ],
    EnemyBullet: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "cdd1eOs1q9C3KUL3+lsBaGl", "EnemyBullet");
        cc.Class({
            extends: cc.Component,
            properties: {
                _crashed: !1,
                _hp: 1
            },
            onLoad: function() {},
            updateHp: function(e) {
                if (this._hp += e, WXI.vibrateShort(), this._hp <= 0 && !this._crashed) {
                    this._crashed = !0;
                    var t = this.node, n = t.position;
                    drop("explosion", n, 30), AMI.playEffect_explosion(), m_pool.pushObject(t);
                }
            },
            onCollisionEnter: function(e, t) {
                switch (e.tag) {
                  default:
                    break;

                  case 1:
                    this.updateHp(-1);
                    var n = e.node;
                    drop("hit", n.position.add(cc.v2(0, 64)), 61), m_pool.pushObject(n);
                    break;

                  case 3:
                    this.updateHp(-1);
                    n = e.node;
                    m_pool.pushObject(n);
                    break;

                  case 4:
                    this.updateHp(-1);
                    break;

                  case 6:
                    this.updateHp(-1);
                    n = e.node;
                    drop("hit5", n.position.add(cc.v2(0, 94)), 61), m_pool.pushObject(n);
                    break;

                  case 7:
                    this.updateHp(-1);
                    n = e.node;
                    drop("hit5", n.position.add(n.rotation < 0 ? cc.v2(-94, 0) : cc.v2(94, 0)), 61);
                    break;

                  case 8:
                    this.updateHp(-1);
                    n = e.node;
                    drop("hit", n.position.add(cc.v2(0, 64)), 61), EMI.dispatchEvent(m_define.eventType.coinGotCoinBag, n.position), 
                    m_pool.pushObject(n);
                    break;

                  case 9:
                    this.updateHp(-1), drop("hit1", this.node.position, 61);
                    break;

                  case 10:
                    this.updateHp(-1);
                    n = e.node;
                    drop("hit2", n.position, 61), m_pool.pushObject(n);
                    break;

                  case 12:
                    this.updateHp(-1);
                    n = e.node;
                    drop("hit4", n.position, 61);
                }
            },
            onCollisionStay: function(e, t) {
                2 == e.tag && (this.updateHp(-1), Math.random() < .4 && drop("hit4", this.node.position, 61));
            },
            tailMoveBegin: function() {
                var e = this.node.getChildByName("tail");
                e.stopAllActions(), e.scale = 1, e.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.1, .3), cc.scaleTo(.1, 1))));
            },
            tailMoveEnd: function() {
                var e = this.node.getChildByName("tail");
                e.scale = 1, e.stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    EnemyControl: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "cbfabqqO51I64diqqsaZblw", "EnemyControl");
        cc.Class({
            extends: cc.Component,
            onLoad: function() {
                this.recover = function() {
                    var e = this.node.getActionByTag(1);
                    e && e.setSpeed(1);
                }.bind(this);
            },
            init: function(e, t) {
                this._code = e, this._bulletNum = t.bulletNum, this._enemySpeed = t.enemySpeed <= 0 ? 140 : t.enemySpeed, 
                this._bulletSpeed = t.bulletSpeed <= 0 ? 350 : t.bulletSpeed;
                var n = JMI.getHpData(e, m_data.level);
                this._hpMax = n, this._hp = n, this._shootInterval = t.shootInterval <= 0 ? 1 : t.shootInterval, 
                this._rate_coin = t.rate_coin, this._rate_item = t.rate_item, this._rate_medal = t.rate_medal;
            },
            updateHp: function(e) {
                if (this._hp = cc.misc.clampf(this._hp + e, 0, this._hpMax), this.bar_hp.active = !0, 
                this.BAR_HP.progress = cc.misc.clampf(this._hp / this._hpMax, 0, 1), WXI.vibrateShort(), 
                this._hp <= 0 && !this._crashed) {
                    this._crashed = !0;
                    var t, n = this.node.position;
                    if (drop("explosion", n, 30), AMI.playEffect_explosion(), Math.random() < this._rate_coin && EMI.dispatchEvent(m_define.eventType.coinGot, n), 
                    Math.random() < this._rate_item) switch (JMI.getPropData()) {
                      default:
                        break;

                      case 0:
                        (t = drop("itemShield", n, 32)) && (t.v = cc.v2(0, -160));
                        break;

                      case 1:
                        (t = drop("itemAmmo", n, 33)) && (t.v = cc.v2(0, -165));
                        break;

                      case 2:
                        (t = drop("itemGemini", n, 34)) && (t.v = cc.v2(0, -170));
                        break;

                      case 3:
                        (t = drop("itemLaser", n, 35)) && (t.v = cc.v2(0, -175));
                        break;

                      case 4:
                        (t = drop("itemCoinBag", n, 36)) && (t.v = cc.v2(0, -180));
                    }
                    for (var i = this._rate_medal, o = Math.random(), c = 0, a = 0; a < i.length && !(o < (c += i[a])); a++) ;
                    EMI.dispatchEvent(m_define.eventType.medalGot, {
                        num: a > 1 ? 3 : a,
                        position: n
                    }), m_pool.pushObject(this.node), EMI.dispatchEvent(m_define.eventType.enemyCrashed);
                }
            },
            onEnable: function() {
                this._invincible = !1, this._crashed = !1, this._ready = !1;
                var e = this.node.getComponent(cc.Animation);
                e && e.play();
                var t = this.node.getChildByName("bar_hp");
                t && t.isValid ? t.active = !1 : (t = m_pool.getObject("bar_hp")) && (t.scale = .5, 
                t.position = cc.v2(0, this.node.height / 2), t.parent = this.node, t.active = !1, 
                this.bar_hp = t, this.BAR_HP = t.getChildByName("bar_hp").getComponent(cc.ProgressBar));
            },
            onDisable: function() {
                var e = this.node.getComponent(cc.Animation);
                e && e.stop();
                var t = this.node.getComponent("Shoot");
                t && t.unscheduleAllCallbacks(), this.node.stopAllActions();
            },
            useMoveLogic: function(e) {
                this._invincible = !1;
                var t = cc.winSize.width / 2, n = cc.winSize.height / 2;
                switch (this._uav = !1, e) {
                  default:
                  case m_define.moveLogicType.topScreenLeftTop:
                    this.rect = cc.rect(-t, n / 2, t, n / 2);
                    break;

                  case m_define.moveLogicType.topScreenRightTop:
                    this.rect = cc.rect(0, n / 2, t, n / 2);
                    break;

                  case m_define.moveLogicType.topScreenLeftBottom:
                    this.rect = cc.rect(-t, 0, t, n / 2);
                    break;

                  case m_define.moveLogicType.topScreenRightBottom:
                    this.rect = cc.rect(0, 0, t, n / 2);
                    break;

                  case m_define.moveLogicType.topScreenTop:
                    this.rect = cc.rect(-t, n / 2, 2 * t, n / 2);
                    break;

                  case m_define.moveLogicType.topScreenBottom:
                    this.rect = cc.rect(-t, 0, 2 * t, n / 2);
                    break;

                  case m_define.moveLogicType.topScreenLeft:
                    this.rect = cc.rect(-t, 0, t, n);
                    break;

                  case m_define.moveLogicType.topScreen:
                    this.rect = cc.rect(-t, 0, 2 * t, n);
                    break;

                  case m_define.moveLogicType.bottomScreen:
                    this.rect = cc.rect(-t, -n, 2 * t, n);
                    break;

                  case m_define.moveLogicType.fullScreen:
                    this.rect = cc.rect(-t, -n, 2 * t, 2 * n);
                    break;

                  case m_define.moveLogicType.UAVFullScreenHalfTimeTrack:
                    this.rect = cc.rect(-t, -n, 2 * t, 2 * n), this._uav = !0;
                }
                var i = this._enemySpeed, o = this.node, c = this._uav, a = function() {
                    var e = this.rect, t = o.position, n = cc.v2(between(e.x, e.x + e.width), between(e.y, e.y + e.height));
                    if (c && Math.random() < .5) {
                        var s = m_mainScene.plane;
                        s && s.isValid && (n = s.position);
                    }
                    var r = n.sub(t).mag() / i || .1, d = cc.speed(cc.sequence(cc.moveTo(r, n).easing(cc.easeSineInOut()), cc.callFunc(a)), 1);
                    d.setTag(1), o.runAction(d);
                }.bind(this);
                a(), this._ready = !0;
            },
            useShootLogic: function(e) {
                var t = "enemyBullet1", n = "shootEnemyBullet1";
                switch (e) {
                  default:
                  case m_define.shootLogicType.shootNothing:
                    return;

                  case m_define.shootLogicType.shootStraight:
                    break;

                  case m_define.shootLogicType.shootStraightTrack:
                    t = "enemyBullet2", n = "shootEnemyBullet2";
                    break;

                  case m_define.shootLogicType.shootPGM:
                    t = "enemyBullet3", n = "shootEnemyBullet3";
                    break;

                  case m_define.shootLogicType.shootFissure:
                    t = "enemyBullet4", n = "shootEnemyBullet4";
                    break;

                  case m_define.shootLogicType.shootExpand:
                    t = "enemyBullet5", n = "shootEnemyBullet2";
                }
                switch (this._code) {
                  case "D1":
                    this._bulletNum > 1 ? this.node[n](t, [ cc.v2(-37, 66), cc.v2(37, 66) ], cc.v2(0, -this._bulletSpeed), this._shootInterval, 60) : this.node[n](t, cc.v2(0, 53), cc.v2(0, -this._bulletSpeed), this._shootInterval, 60);
                    break;

                  case "D2":
                    this._bulletNum > 1 ? this.node[n](t, [ cc.v2(-34, 69), cc.v2(34, 69) ], cc.v2(0, -this._bulletSpeed), this._shootInterval, 60) : this.node[n](t, cc.v2(0, 44), cc.v2(0, -this._bulletSpeed), this._shootInterval, 60);
                    break;

                  case "D3":
                    this._bulletNum > 1 ? this.node[n](t, [ cc.v2(-51, 71), cc.v2(51, 71) ], cc.v2(0, -this._bulletSpeed), this._shootInterval, 60) : this.node[n](t, cc.v2(0, 45), cc.v2(0, -this._bulletSpeed), this._shootInterval, 60);
                    break;

                  case "D4":
                    this._bulletNum > 1 ? this.node[n](t, [ cc.v2(-49, 66), cc.v2(49, 66) ], cc.v2(0, -this._bulletSpeed), this._shootInterval, 60) : this.node[n](t, cc.v2(0, 48), cc.v2(0, -this._bulletSpeed), this._shootInterval, 60);
                    break;

                  case "D0":
                    this._bulletNum > 1 ? this.node[n](t, [ cc.v2(-44, 48), cc.v2(44, 48) ], cc.v2(0, -this._bulletSpeed), this._shootInterval, 60) : this.node[n](t, cc.v2(0, 33), cc.v2(0, -this._bulletSpeed), this._shootInterval, 60);
                }
            },
            onCollisionEnter: function(e, t) {
                var n = e.node;
                if (this._ready) {
                    var i = this.node.getActionByTag(1);
                    i && (i.setSpeed(.6), this.unschedule(this.recover), this.scheduleOnce(this.recover, .3));
                }
                switch (e.tag) {
                  default:
                    break;

                  case 1:
                    this._invincible || this.updateHp(-m_data.damage), drop("hit", n.position.add(cc.v2(0, 64)), 61), 
                    m_pool.pushObject(n);
                    break;

                  case 3:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), m_pool.pushObject(n);
                    break;

                  case 4:
                    this._invincible || this.updateHp(-m_data.wingmanDamage);
                    break;

                  case 6:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), drop("hit5", n.position.add(cc.v2(0, 94)), 61), 
                    m_pool.pushObject(n);
                    break;

                  case 7:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), drop("hit5", n.position.add(n.rotation < 0 ? cc.v2(-94, 0) : cc.v2(94, 0)), 61);
                    break;

                  case 8:
                    this._invincible || this.updateHp(-m_data.damage), drop("hit", n.position.add(cc.v2(0, 64)), 61), 
                    EMI.dispatchEvent(m_define.eventType.coinGotCoinBag, n.position), m_pool.pushObject(n);
                    break;

                  case 9:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), drop("hit1", this.node.position, 61);
                    break;

                  case 10:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), drop("hit2", n.position.add(cc.v2(0, n.height)), 61), 
                    m_pool.pushObject(n);
                    break;

                  case 12:
                    this._invincible || this.updateHp(-m_data.wingmanDamage), drop("hit4", n.position, 61);
                }
            },
            onCollisionStay: function(e, t) {
                this._invincible || 2 == e.tag && (this.updateHp(-m_data.damage), Math.random() < .4 && drop("hit4", this.node.position, 61));
            }
        }), cc._RF.pop();
    }, {} ],
    EventManager: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "b917bgFWlZDHbjiqSxRzyR2", "EventManager"), window.EMI = function() {
            var e = new cc.EventTarget();
            return {
                on: function(t, n, i) {
                    e.on(t, n, i);
                },
                dispatchEvent: function(t, n) {
                    var i = new cc.Event.EventCustom(t, !1);
                    i.setUserData(n), e.dispatchEvent(i);
                },
                targetOff: function(t) {
                    e.targetOff(t);
                }
            };
        }(), cc._RF.pop();
    }, {} ],
    GameCommonUtil: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "d774aDLfYZBPYt5wEC/xw5h", "GameCommonUtil"), Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {}
            return e.uuid = function() {
                var e, t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), n = [];
                for (e = 0; e < 32; e++) n[e] = t[0 | 16 * Math.random()];
                return n.join("");
            }, e.isToday = function(e) {
                return new Date(e).toDateString() === new Date().toDateString();
            }, e.wxHttpGet = function(e, t) {
                null != e && (-1 == e.indexOf("mcachenum") && (e.indexOf("?") > -1 ? e += "&mcachenum=" + Date.now() : e += "?mcachenum=" + Date.now()), 
                wx.request({
                    url: e,
                    success: function(e) {
                        t && t(0, e.data);
                    },
                    fail: function(e) {
                        t && t(-1, null);
                    }
                }));
            }, e.wxHttpPost = function(e, t, n) {
                null != e && (-1 == e.indexOf("mcachenum") && (e.indexOf("?") > -1 ? e += "&mcachenum=" + Date.now() : e += "?mcachenum=" + Date.now()), 
                wx.request({
                    url: e,
                    data: t,
                    method: "POST",
                    header: {
                        "content-type": "application/json",
                        charset: "utf-8"
                    },
                    success: function(e) {
                        n && n(0, e.data);
                    },
                    fail: function(e) {
                        n && n(-1, null);
                    }
                }));
            }, e;
        }();
        n.GameCommonUtil = i, cc._RF.pop();
    }, {} ],
    GameCommon: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "05968k8TPtAsIubK4PgoP24", "GameCommon"), Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = e("./SDK/WxSDK"), o = e("./SDK/WebSDK"), c = function() {
            function e() {
                this._sdk = null;
            }
            return e.prototype.sdkInit = function() {
                window.gameCommon = this, wx ? (this._sdk = new i.WxSDK(), this._sdk.wxInitData(), 
                this._sdk.appGameOnLanch()) : this._sdk = new o.WebSDK();
            }, Object.defineProperty(e.prototype, "getSDK", {
                get: function() {
                    return this._sdk;
                },
                enumerable: !0,
                configurable: !0
            }), e.WxAppId = "wxfa9dfb94ec742cd1", e;
        }();
        n.GameCommon = c, cc._RF.pop();
    }, {
        "./SDK/WebSDK": "WebSDK",
        "./SDK/WxSDK": "WxSDK"
    } ],
    GameIconLoop: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "74d66gT9ltM84e5HsC/Fs5K", "GameIconLoop");
        var i = e("GameIcon"), o = 0;
        cc.Class({
            extends: i,
            onEnable: function() {
                this.node.stopAllActions(), this.node.rotation = 0, this.node.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0), cc.delayTime(1))));
            },
            onDisable: function() {
                this.node.stopAllActions(), this.node.rotation = 0;
            },
            loop: function() {
                var e = m_data.adList_7thAv;
                if (e.length > 0) {
                    (o < 0 || o > e.length - 1) && (o = 0);
                    var t = e[o];
                    this.init(t), o++, this.scheduleOnce(this.loop.bind(this), 10);
                }
            }
        }), cc._RF.pop();
    }, {
        GameIcon: "GameIcon"
    } ],
    GameIconZoom: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "653fcPnlWdGerDrxceYxQIS", "GameIconZoom"), e("Globals"), cc.Class({
            extends: cc.Component,
            properties: {},
            start: function() {
                this.icon = this.node.getChildByName("icon"), this.bg = this.node.getChildByName("iconboard"), 
                this.father = this.node.parent.parent.parent.parent.parent.name;
            },
            update: function(e) {
                if ("banner" == this.father) if (m_data.scorller) this.icon.scale = 1, this.bg.scale = 1; else {
                    var t = this.node.convertToWorldSpace(cc.v2(0, 0));
                    t.x < 360 && t.x > 240 ? (this.icon.scale = 1.2, this.bg.scale = 1.2) : (this.icon.scale = 1, 
                    this.bg.scale = 1);
                }
            }
        }), cc._RF.pop();
    }, {
        Globals: "Globals"
    } ],
    GameIcon: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "debb1Fe7ohJvowfbotK4nqQ", "GameIcon"), cc.Class({
            extends: cc.Component,
            init: function(e) {
                this.info = e;
            },
            onClick: function() {
                this.info && WXI.navigateToMiniProgram_7thAv(this.info);
            }
        }), cc._RF.pop();
    }, {} ],
    Globals: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "9cb1daSJbRA7bd7PVFUxj7t", "Globals"), window.m_data = {
            adList_7thAv: [],
            shareImageList: [],
            uid: void 0,
            level: 1e3,
            coin: 0,
            coinRecord: 0,
            chest: 0,
            diamond: 0,
            energy: 0,
            collect: {
                f: "p5",
                p5: {
                    s: 0,
                    p: 0
                }
            },
            signInStatus: 0,
            signInDays: 0,
            earnings: 0,
            coinLevel: 0,
            placeLevel: 0,
            damage: 1,
            wingmanDamage: 1,
            coinValue: 1,
            placeValue: 1,
            vibrate: 1,
            sound: 1,
            coolMode: !1,
            rebirthChance: 1,
            scorller: !1,
            plane: {
                s: 0,
                p: 0
            },
            tempF: void 0,
            signJson: [ 5e4, 2e5, 1e5, 5e4, 1e5, 15e4, 2e5 ],
            gloryJson: [ {
                over: 0,
                finish: 0,
                name: "炫酷暴走",
                mission: [ 1, 5, 10, 15, 20, 30, 40, 60, 80, 100 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "日常三倍领取次数",
                mission: [ 1, 5, 10, 15, 20, 30, 40, 60, 80, 100 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "战机火力等级",
                mission: [ 50, 100, 150, 200, 250, 300, 350, 400, 450, 500 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "战机强度等级",
                mission: [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "获得僚机架数",
                mission: [ 1, 2, 3, 4, 5 ],
                reward: [ 1e4, 4e4, 8e4, 15e4, 3e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "累计视频复活",
                mission: [ 1, 5, 10, 15, 20, 30, 40, 60, 80, 100 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "累计分享复活",
                mission: [ 1, 5, 10, 15, 20, 30, 40, 60, 80, 100 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机一强度",
                mission: [ 2, 4, 8, 16, 24, 32, 40, 48, 56, 64 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机二强度",
                mission: [ 2, 4, 8, 16, 24, 32, 40, 48, 56, 64 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机三强度",
                mission: [ 2, 4, 8, 16, 24, 32, 40, 48, 56, 64 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机四强度",
                mission: [ 2, 4, 8, 16, 24, 32, 40, 48, 56, 64 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机五强度",
                mission: [ 2, 4, 8, 16, 24, 32, 40, 48, 56, 64 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机一火力",
                mission: [ 10, 20, 40, 80, 120, 160, 200, 240, 280, 320 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机二火力",
                mission: [ 10, 20, 40, 80, 120, 160, 200, 240, 280, 320 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机三火力",
                mission: [ 10, 20, 40, 80, 120, 160, 200, 240, 280, 320 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机四火力",
                mission: [ 10, 20, 40, 80, 120, 160, 200, 240, 280, 320 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "僚机五火力",
                mission: [ 10, 20, 40, 80, 120, 160, 200, 240, 280, 320 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "通关关卡",
                mission: [ 1, 5, 10, 20, 40, 60, 100, 150, 200, 300 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "累计击毁飞机",
                mission: [ 100, 200, 400, 600, 1e3, 1800, 3200, 6e3, 12e3, 2e4 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "累计消耗体力",
                mission: [ 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "累计签到天数",
                mission: [ 1, 3, 5, 7, 10, 13, 16, 20, 25, 30 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "连续签到天数",
                mission: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            }, {
                over: 0,
                finish: 0,
                name: "累计转盘次数",
                mission: [ 1, 5, 10, 15, 20, 30, 40, 60, 80, 100 ],
                reward: [ 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 3e5, 5e5 ]
            } ]
        }, window.m_define = Object.freeze({
            eventType: {
                attachFormation: "attachFormation",
                enemyCrashed: "enemyCrashed",
                gameSuccess: "gameSuccess",
                gameFail: "gameFail",
                rebirth: "rebirth",
                backToStartMenu: "backToStartMenu",
                medalGot: "medalGot",
                initLevelGoal: "initLevelGoal",
                getItem: "getItem",
                useItemBegin: "useItemBegin",
                useItemEnd: "useItemEnd",
                afterALL: "afterALL",
                chestGame: "chestGame",
                updateCoinRecord: "updateCoinRecord",
                bossFightBegin: "bossFightBegin",
                slowDownEnd: "slowDownEnd",
                slowDownBegin: "slowDownBegin",
                coinGot: "coinGot",
                coinGotCoinBag: "coinGotCoinBag",
                showCoinAni: "showCoinAni",
                navFail: "navFail",
                afterSuccessAndFail: "afterSuccessAndFail",
                JAVA_VIDEO_CLOSE: "JAVA_VIDEO_CLOSE"
            },
            moveLogicType: {
                topScreenLeftTop: 1,
                topScreenRightTop: 2,
                topScreenLeftBottom: 3,
                topScreenRightBottom: 4,
                topScreenTop: 5,
                topScreenBottom: 6,
                topScreenLeft: 7,
                topScreenRight: 8,
                topScreen: 9,
                bottomScreen: 10,
                fullScreen: 11,
                UAVFullScreenHalfTimeTrack: 12
            },
            shootLogicType: {
                shootNothing: 0,
                shootStraight: 1,
                shootStraightTrack: 2,
                shootPGM: 3,
                shootFissure: 4,
                shootExpand: 5
            }
        }), window.pop = function(e) {
            cc.loader.loadRes("prefabs/pop", cc.Prefab, function(t, n) {
                if (!t) {
                    var i = cc.director.getScene();
                    if (i && i.isValid) {
                        var o = cc.instantiate(n);
                        o.getChildByName("label").write(e), o.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2), 
                        o.parent = i, o.runAction(cc.sequence(cc.spawn(cc.moveBy(1.5, cc.v2(0, 100)), cc.fadeTo(2, 0)), cc.callFunc(function() {
                            o && o.isValid && o.destroy();
                        })));
                    }
                }
            });
        }, window.isFunction = function(e) {
            return "function" == typeof e;
        }, window.oppositeX = function(e) {
            return cc.v2(-e.x, e.y);
        }, window.between = function(e, t) {
            return e + Math.random() * (t - e);
        }, window.drop = function(e, t, n) {
            var i = m_pool.getObject(e);
            return i.position = t, i.attachParent(m_iterateLayer, n), i;
        }, window.gray = function(e) {
            if (e && e.isValid) {
                var t = e.getComponent(cc.Sprite);
                t && t._sgNode && t._sgNode.setState && t._sgNode.setState(1), e.children.forEach(gray);
            }
        }, window.unGray = function(e) {
            if (e && e.isValid) {
                var t = e.getComponent(cc.Sprite);
                t && t._sgNode && t._sgNode.setState && t._sgNode.setState(0), e.children.forEach(unGray);
            }
        }, cc._RF.pop();
    }, {} ],
    GloryPop: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "0b2d5nL0txBlJ4kORJreiMm", "GloryPop"), cc.Class({
            extends: cc.Component,
            properties: {
                itemTemplate: {
                    default: null,
                    type: cc.Prefab
                },
                itemTemplateHeight: 0,
                scrollView: {
                    default: null,
                    type: cc.ScrollView
                },
                spawnCount: 0,
                totalCount: 0,
                spacing: 0,
                bufferZone: 0
            },
            onLoad: function() {
                this.content = this.scrollView.content, this.items = [], this.initialize(), this.updateTimer = 0, 
                this.updateInterval = .2, this.lastContentPosY = 0;
            },
            initialize: function() {
                this.content.height = this.totalCount * (this.itemTemplateHeight + this.spacing) + this.spacing;
                for (var e = 0; e < this.spawnCount; ++e) {
                    var t = cc.instantiate(this.itemTemplate);
                    this.content.addChild(t), t.setPosition(0, -t.height * (.5 + e) - this.spacing * (e + 1)), 
                    this.initItem(t, e), this.items.push(t);
                }
            },
            getPositionInView: function(e) {
                var t = e.parent.convertToWorldSpaceAR(e.position);
                return this.scrollView.node.convertToNodeSpaceAR(t);
            },
            update: function(e) {
                if (this.updateTimer += e, !(this.updateTimer < this.updateInterval)) {
                    this.updateTimer = 0;
                    for (var t = this.items, n = this.bufferZone, i = this.scrollView.content.y < this.lastContentPosY, o = (this.itemTemplateHeight + this.spacing) * t.length, c = 0; c < t.length; ++c) {
                        var a = this.getPositionInView(t[c]);
                        if (i) {
                            if (a.y < -n && t[c].y + o < 0) {
                                t[c].y = t[c].y + o;
                                var s = t[c].itemId - t.length;
                                this.updateItem(t[c], s);
                            }
                        } else if (a.y > n && t[c].y - o > -this.content.height) {
                            t[c].y = t[c].y - o;
                            var r = t[c].itemId + t.length;
                            this.updateItem(t[c], r);
                        }
                    }
                    this.lastContentPosY = this.scrollView.content.y;
                }
            },
            reUpdate: function() {
                for (var e = this.items, t = 0; t < e.length; t++) {
                    var n = e[t];
                    this.updateItem(n, n.itemId);
                }
            },
            onClickAccept1: function(e, t, n) {
                cc.log(t);
                var i = function() {
                    for (var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson, i = 0; i < e.length; i++) if (e[i].name == t) {
                        m_data.coin += e[i].reward[e[i].finish] * (n ? 2 : 1), e[i].finish++, WXI.setStorageSync("GLORY", e), 
                        WXI.setStorageSync("COIN", m_data.coin);
                        try {
                            var o = cc.find("Canvas").getComponent("MainScene");
                            o.lb_coin.writeShoot(m_data.coin), o.playAnimation_getEarnings();
                        } catch (e) {}
                        this.reUpdate();
                        break;
                    }
                }.bind(this);
                n ? WXI.createVideo(i) : i();
            },
            onClickAccept2: function(e, t) {
                this.onClickAccept1(e, t, !0);
            },
            initItem: function(e, t) {
                e.itemId = t;
                var n = e.getChildByName("get"), i = e.getChildByName("doubleGet"), o = new cc.Component.EventHandler();
                o.target = this.node, o.component = "GloryPop", o.handler = "onClickAccept1", n.getComponent(cc.Button).clickEvents.push(o);
                var c = new cc.Component.EventHandler();
                c.target = this.node, c.component = "GloryPop", c.handler = "onClickAccept2", i.getComponent(cc.Button).clickEvents.push(c), 
                this.updateItem(e, t);
            },
            updateItem: function(e, t) {
                e.itemId = t;
                var n = e.getChildByName("title").getComponent(cc.Label), i = e.getChildByName("coin").getChildByName("number"), o = e.getChildByName("overAndtotal").getComponent(cc.Label), c = e.getChildByName("progress").getComponent(cc.ProgressBar), a = e.getChildByName("get"), s = e.getChildByName("doubleGet"), r = (WXI.getStorageSync("GLORY", "object") || m_data.gloryJson).safeGet(t), d = r.name, l = r.finish, h = r.over, m = r.mission;
                n.string = d, i.writeShoot(r.reward[l]), o.string = h + "/" + m[l], c.progress = cc.misc.clampf(h / m[l], 0, 1), 
                h >= m[l] ? (a.active = !0, s.active = !0) : (a.active = !1, s.active = !1), a.getComponent(cc.Button).clickEvents[0].customEventData = d, 
                s.getComponent(cc.Button).clickEvents[0].customEventData = d;
            }
        }), cc._RF.pop();
    }, {} ],
    Hit1: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "81bf16aLz1BtYqQ2n8ZL38C", "Hit1"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                var e = this.node, t = e.getChildByName("circle1"), n = e.getChildByName("circle2");
                t.stopAllActions(), n.stopAllActions(), t.scale = 1, n.scale = 1, t.runAction(cc.scaleTo(.15, 2).easing(cc.easeSineInOut())), 
                n.runAction(cc.sequence(cc.scaleTo(.15, .5).easing(cc.easeSineInOut()), cc.callFunc(function() {
                    m_pool.pushObject(e);
                })));
            },
            onDisable: function() {
                var e = this.node, t = e.getChildByName("circle1"), n = e.getChildByName("circle2");
                t.stopAllActions(), n.stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    ISDK: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "49195+x49ZFJJKihGOimTIM", "ISDK"), Object.defineProperty(n, "__esModule", {
            value: !0
        }), cc._RF.pop();
    }, {} ],
    InvitePop: [ function(e, t, n) {
        "use strict";
        function i(e) {
            return e >= 1e6 ? (parseInt(e / 1e5) / 10).toString() + "M" : e >= 1e3 ? (parseInt(e / 100) / 10).toString() + "K" : e + "";
        }
        cc._RF.push(t, "ab7728q15tBQ7BgIe3oeLpH", "InvitePop");
        var o = [ 6e5, 2e5, 3e5, 4e5, 5e5, 6e5, 7e5, 8e5, 9e5, 1e6 ];
        cc.Class({
            extends: cc.Component,
            properties: {
                content: cc.Node,
                item: cc.Node,
                texture1: cc.SpriteFrame,
                texture2: cc.SpriteFrame
            },
            onLoad: function() {
                for (var e = 0; e < 10; e++) this.attachItem(e, "+" + i(o[e]), 3);
            },
            onEnable: function() {
                this.node.getChildByName("scrollView").getComponent(cc.ScrollView).scrollToTop(), 
                this.updateItems();
            },
            updateItems: function() {
                MCI.getShareList(function(e) {
                    var t = WXI.getStorageSync("SHARELIST");
                    void 0 !== t && "" !== t || (t = {}, WXI.setStorageSync("SHARELIST", t)), e.forEach(function(e, n) {
                        t["share" + n] ? this.updateItem(n, 1) : this.updateItem(n, 2);
                    }.bind(this));
                }.bind(this));
            },
            updateItem: function(e, t) {
                if (this.content.childrenCount > e) {
                    var n = this.content.children[e];
                    if (n && n.isValid) {
                        var i = n.getChildByName("sp"), o = n.getChildByName("word"), c = n.getChildByName("btn");
                        switch (o.active = !1, c.active = !1, t) {
                          default:
                          case 1:
                            i.getComponent(cc.Sprite).spriteFrame = this.texture2, o.color = cc.color(246, 120, 58), 
                            o.write("已领取"), o.active = !0;
                            break;

                          case 2:
                            i.getComponent(cc.Sprite).spriteFrame = this.texture2, c.active = !0;
                            break;

                          case 3:
                            o.color = cc.color(0, 255, 216), o.write("未邀请"), o.active = !0;
                        }
                    }
                }
            },
            attachItem: function(e, t, n) {
                var i = cc.instantiate(this.item), o = i.getChildByName("lb_num"), c = i.getChildByName("sp"), a = i.getChildByName("lb_reward"), s = i.getChildByName("word"), r = i.getChildByName("btn");
                switch (o.write(e + 1), a.write(t), s.active = !1, r.active = !1, n) {
                  default:
                  case 1:
                    c.getComponent(cc.Sprite).spriteFrame = this.texture2, s.color = cc.color(246, 120, 58), 
                    s.write("已领取"), s.active = !0;
                    break;

                  case 2:
                    c.getComponent(cc.Sprite).spriteFrame = this.texture2, r.active = !0;
                    break;

                  case 3:
                    s.color = cc.color(0, 255, 216), s.write("未邀请"), s.active = !0;
                }
                r.getComponent(cc.Button).clickEvents[0].customEventData = "share" + e, i.x = 0, 
                i.active = !0, i.parent = this.content;
            },
            onClickBlank: function() {
                this.node.active = !1;
            },
            onClickGetReward: function(e, t) {
                var n = WXI.getStorageSync("SHARELIST");
                if (void 0 !== n && "" !== n || (WXI.setStorageSync("SHARELIST", {}), n = {}), void 0 != n[t]) this.updateItems(); else {
                    var i = parseInt(t.replace("share", ""));
                    isNaN(i) || (n[t] = 1, WXI.setStorageSync("SHARELIST", n), this.updateItems(), m_data.coin += o.safeGet(i), 
                    EMI.dispatchEvent(m_define.eventType.showCoinAni, cc.v2(0, 0)));
                }
            },
            onClickShare: function() {
                WXI.shareWithUid();
            }
        }), cc._RF.pop();
    }, {} ],
    ItemFrame: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "20e7aNF1OdCK6uUzl9Ufael", "ItemFrame"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this.node.runAction(cc.repeatForever(cc.rotateBy(.1, -30)));
            },
            onDisable: function() {
                this.node.stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    JsonFileManager: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "1fbb70sZJVDUJhxevhJ4+Mr", "JsonFileManager"), window.JMI = function() {
            var e = [], t = [], n = {}, i = {}, o = {}, c = {}, a = [], s = {};
            return {
                _loadFile: function(e, t) {
                    cc.loader.loadRes(e, function(n, i) {
                        n ? console.log(n.message) : (t && t(i.json), cc.loader.releaseRes(e));
                    });
                },
                init: function(e) {
                    var t = [ this._loadChapterData.bind(this), this._loadDialData.bind(this), this._loadEnemyData.bind(this), this._loadHpData.bind(this), this._loadEnemyBOSSData.bind(this), this._loadWingmanData.bind(this), this._loadPowerData.bind(this), this._loadPropData.bind(this) ];
                    (function n() {
                        var i = t.shift();
                        i ? i(n) : (console.log("表格加载完成"), e && e());
                    })();
                },
                _loadChapterData: function(t) {
                    this._loadFile("data/Chapter", function(n) {
                        e = n.map(function(e) {
                            return e.number;
                        }), cc.log("(1)章节数据:", e), t && t();
                    });
                },
                getChapterData: function(t) {
                    (t = t || m_data.level) < 0 ? t = 0 : t > e.length - 1 && (t = e.length - 1);
                    var n = e[t];
                    return console.log("通关需要" + n + "枚勋章"), n;
                },
                _loadDialData: function(e) {
                    this._loadFile("data/Dial", function(n) {
                        var i = 0, o = n.map(function(e) {
                            var t = e.rate;
                            return i += t, t;
                        });
                        t = o.map(function(e) {
                            return e / i;
                        }), cc.log("(2)转盘数据:", t), e && e();
                    });
                },
                getDialData: function() {
                    return t;
                },
                _loadEnemyData: function(e) {
                    this._loadFile("data/Enemy", function(t) {
                        t.forEach(function(e) {
                            e.id, e.enemy_desc;
                            var t = e.enemy_png, i = e.bullet_num, o = e.enemy_speed, c = e.bullet_speed, a = e.bullet_span, s = e.rate, r = e.rate_gold, d = e.rate0, l = e.rate1, h = e.rate3;
                            n[t] = {
                                bulletNum: i,
                                enemySpeed: o,
                                bulletSpeed: c,
                                shootInterval: Number(a),
                                rate_item: s / 100,
                                rate_coin: r / 100,
                                rate_medal: [ d, l, h ].map(function(e) {
                                    return e / 100;
                                })
                            };
                        }), cc.log("(3)敌机数据:", n), e && e();
                    });
                },
                getEnemyData: function(e) {
                    return n[e];
                },
                _loadHpData: function(e) {
                    this._loadFile("data/HP", function(t) {
                        i = {
                            D6: [],
                            D2: [],
                            D4: [],
                            D1: [],
                            D8: [],
                            D3: [],
                            D0: []
                        }, t.forEach(function(e) {
                            i.D6.push(e.hp1), i.D2.push(e.hp2), i.D4.push(e.hp3), i.D1.push(e.hp4), i.D8.push(e.hp5), 
                            i.D3.push(e.hp6), i.D0.push(e.hp7);
                        }), cc.log("(3.1)敌机血量", i), e && e();
                    });
                },
                getHpData: function(e, t) {
                    return i[e].safeGet(t);
                },
                _loadEnemyBOSSData: function(e) {
                    this._loadFile("data/EnemyBOSS", function(t) {
                        t.forEach(function(e) {
                            e.id;
                            var t = e.section, n = e.enemy_desc, i = e.enemy_hp, c = e.gold, a = e.number;
                            o[t] = {
                                code: n,
                                hp: i,
                                coinNum: c,
                                medalNum: a
                            };
                        }), cc.log("(4)头目数据:", o), e && e();
                    });
                },
                getBossData: function(e) {
                    return e = e || m_data.level, o[e += ""];
                },
                _loadWingmanData: function(e) {
                    this._loadFile("data/Wingman", function(t) {
                        s = {
                            lv: 0,
                            p: [],
                            s: []
                        }, t.forEach(function(e) {
                            e.id;
                            var t = e["1power"], n = e["1power_cost"], i = e["1frequency"], o = e["1intensity_cost"];
                            "" !== n && s.p.push({
                                num: Number(t),
                                cost: Number(n)
                            }), "" !== o && s.s.push({
                                num: Number(i),
                                data: Number(i),
                                cost: Number(o)
                            });
                        }), cc.log("(5)僚机数据:", s), e && e();
                    });
                },
                getWingmanData: function(e) {
                    switch (e) {
                      case "p1":
                        return {
                            lv: 10,
                            s: s.s,
                            p: s.p.map(function(e) {
                                return {
                                    num: 4 * e.num,
                                    cost: e.cost
                                };
                            })
                        };

                      default:
                      case "p2":
                        return s.lv = 20, s;

                      case "p3":
                        return s.lv = 30, s;

                      case "p4":
                        return s.lv = 40, s;

                      case "p5":
                        return s.lv = 50, s;
                    }
                },
                _loadPowerData: function(e) {
                    this._loadFile("data/Power", function(t) {
                        c = {
                            s: [],
                            p: []
                        }, t.forEach(function(e) {
                            e.id;
                            var t = e.intensity, n = e.speed, i = e.number, o = e.speed_grow, a = e.attack, s = e.attack_grow;
                            0 != a && c.p.push({
                                cost: s,
                                num: a
                            }), 0 != n && c.s.push({
                                speed: n,
                                cost: o,
                                num: t,
                                bulletNum: i
                            });
                        }), cc.log("(6)主机数据:", c), e && e();
                    });
                },
                getPowerData: function() {
                    return c;
                },
                _loadPropData: function(e) {
                    this._loadFile("data/Prop", function(t) {
                        var n = 0, i = t.map(function(e) {
                            var t = e.rate;
                            return n += t, t;
                        });
                        a = i.map(function(e) {
                            return e / n;
                        }), cc.log("(7)道具数据:", a), e && e();
                    });
                },
                getPropData: function() {
                    for (var e = 0, t = Math.random(), n = 0; n < a.length; n++) if (t < (e += a[n])) return n;
                    return n;
                }
            };
        }(), cc._RF.pop();
    }, {} ],
    Laser: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "5d6a7vZmbhHmZpZspLuH96I", "Laser"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this.node.getComponent(cc.Animation).play(), this.node.getChildByName("circle").getComponent(cc.Animation).play();
            },
            onDisable: function() {
                this.node.getComponent(cc.Animation).stop(), this.node.getChildByName("circle").getComponent(cc.Animation).stop();
            }
        }), cc._RF.pop();
    }, {} ],
    LaunchOption: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "e2bd11Dg+hDeqJwehwV7lnu", "LaunchOption"), Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {
                this.sourceAppId = null, this.sessionSourceAppId = null;
            }
            return e.data = new e(), e;
        }();
        n.LaunchOption = i;
        var o = function() {
            function e() {
                this.needUserStorage = !0, this.needOpenId = !0, this.code = null, this.sourceAppId = null, 
                this.sessionSourceAppId = null, this.uuid = null;
            }
            return e.data = new e(), e;
        }();
        n.LaunchPacket = o, cc._RF.pop();
    }, {} ],
    LoadScene: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "57f27+ZelFIKJN1Ri3fcd7K", "LoadScene"), cc.Class({
            extends: cc.Component,
            properties: {},
            start: function() {
                var e = cc.find("Canvas/background/loading").getComponent(cc.ProgressBar);
                cc.loader.onProgress = function(t, n, i) {
                    e.progress = t / n;
                }, cc.director.loadScene("MainScene");
            },
            onDestroy: function() {
                cc.loader.onProgress = function() {};
            }
        }), cc._RF.pop();
    }, {} ],
    MainScene: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "95755DCdfZF0IJVVdugHjmb", "MainScene");
        var i = e("./GameCommon/GameCommon"), o = e("./GameCommon/UserData");
        e("AudioManager"), e("EventManager"), e("Globals"), e("JsonFileManager"), e("MessageCenter"), 
        e("ObjectPool"), e("Prototype"), e("WeChatManager"), e("md5");
        var c = 1, a = 0;
        cc.Class({
            extends: cc.Component,
            properties: {
                iterateLayer: cc.Node,
                prefabNode: cc.Node,
                camera: cc.Node,
                backgroundUp: cc.Node,
                backgroundDown: cc.Node,
                cloudLayer: cc.Node,
                piggy: cc.Node,
                lb_level: cc.Node,
                lb_countDown: cc.Node,
                lb_earnings: cc.Node,
                lb_progress: cc.Node,
                lb_coinRecord: cc.Node,
                lb_coin: cc.Node,
                lb_energy: cc.Node,
                lb_diamond: cc.Node,
                lb_coinReward: cc.Node,
                lb_key1: cc.Node,
                lb_value1: cc.Node,
                lb_key2: cc.Node,
                lb_value2: cc.Node,
                lb_cost1: cc.Node,
                lb_cost2: cc.Node,
                itemTextures: [ cc.SpriteFrame ],
                backgroundTextures: [ cc.SpriteFrame ],
                mask: cc.Node,
                planeTexture: cc.SpriteFrame,
                arrow1: cc.Node,
                arrow2: cc.Node,
                bgPlaneTextures: [ cc.SpriteFrame ],
                bannerTextures: [ cc.SpriteFrame ],
                extantEnemy: 0,
                nextDialog: !0,
                gloryPrefab: cc.Prefab,
                successType: null,
                guessPrefab: cc.Prefab,
                picNumber: 20,
                changeIconBtn: !0
            },
            onLoad: function() {
                new i.GameCommon().sdkInit(), this.gameFailType = !1, this.arrow1.active = !1, this.arrow2.active = !1, 
                this.bgIndex = 0, this.cloudLayer.active = !1, MCI.getAdWall(), window.m_mainScene = this.node.getComponent("MainScene");
                var e = this.node.getChildByName("UI_Const"), t = this.node.getChildByName("UI_Start"), n = this.node.getChildByName("UI_GamePlay"), o = this.node.getChildByName("UI_Result");
                e.active = !1, t.active = !1, n.active = !1, o.active = !1, this.lb_level.parent.active = !1, 
                this.mask.opacity = 0, this.mask.active = !0, this.com_prefabNode = this.prefabNode.getComponent("PrefabNode"), 
                this.com_barMedal = cc.find("Canvas/UI_GamePlay/bg_medal/bar_medal").getComponent(cc.ProgressBar), 
                this.com_barPlace = cc.find("Canvas/UI_Start/MoveNode/earnings/bar_earnings").getComponent(cc.ProgressBar), 
                cc.find("Canvas/UI_Start/earningsPop").active = !1, WXI.initUserLocalData(), EMI.on(m_define.eventType.getUidFail, function(e) {
                    cc.find("Canvas/UI_Start/btn_invite").active = !1;
                }, this), EMI.on(m_define.eventType.navFail, function(e) {
                    var t = e.getUserData().customEventData, n = 0;
                    if ("首页" == t.where) {
                        var i = cc.find("Canvas/UI_Start/banner/ADbottom/board/view/content");
                        n = 0;
                    } else if ("尾页" == t.where) {
                        i = cc.find("Canvas/UI_Result/ADbottom/board/view/content");
                        n = 1;
                    } else if ("底页" == t.where) {
                        i = cc.find("Canvas/UI_Result/LRJumpNode");
                        n = 2;
                    } else if ("全屏" == t.where) {
                        i = cc.find("Canvas/ADBG/view/content");
                        n = 3;
                    }
                    for (var o = i.getChildByName(t.node), c = -1, a = parseInt(o.name); ;) {
                        var s = void 0;
                        if (0 == n) {
                            if (-1 == this.picList2[a]) {
                                c = a + 10, this.picList2[a] = a;
                                break;
                            }
                            c = a, this.picList2[a] = -1;
                            break;
                        }
                        if (1 == n) {
                            if ((s = parseInt(Math.random() * this.picList3.length)) > 10) {
                                if (s -= 10, -1 != this.picList3[s]) {
                                    c = s;
                                    break;
                                }
                            } else if (-1 != this.picList3[s]) {
                                c = s;
                                break;
                            }
                        } else {
                            if (2 != n) return;
                            if ((s = parseInt(Math.random() * this.picList4.length)) > 10) {
                                if (s -= 10, -1 != this.picList4[s]) {
                                    c = s;
                                    break;
                                }
                            } else if (-1 != this.picList4[s]) {
                                c = s;
                                break;
                            }
                        }
                    }
                    if (0 == n || (1 == n ? this.picList3[a] = a : 2 == n ? this.picList4[a] = a : this.picList5[a] = a), 
                    c > 10) {
                        var r = c - 10;
                        o.name = r + "";
                    } else o.name = c + "";
                    if (1 == n || 2 == n) {
                        var d = o.getComponent(cc.Button);
                        d.clickEvents = [];
                        var l = new cc.Component.EventHandler();
                        l.target = this.node, l.component = "MainScene", l.handler = "onClickGuessGameIcon";
                        var h, m = MCI.getGuessAD();
                        h = {
                            appId: m[c].appid,
                            path: m[c].path,
                            name: m[c].title,
                            where: t.where,
                            from: t.from,
                            node: o.name
                        }, o.getChildByName("name").getComponent(cc.Label).string = m[c].title, l.customEventData = h, 
                        d.clickEvents.push(l);
                    }
                    if (3 != n && 0 != n) cc.loader.loadRes("icon/" + c, function(e, t) {
                        e || (o.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t));
                    }); else {
                        var p = o.getComponent(cc.Button);
                        p.clickEvents = [];
                        var u = new cc.Component.EventHandler();
                        u.target = this.node, u.component = "MainScene", u.handler = "onClickGuessGameIcon";
                        var v, g = MCI.getGuessAD();
                        v = {
                            appId: g[c].appid,
                            path: g[c].path,
                            name: g[c].title,
                            where: t.where,
                            from: t.from,
                            node: o.name
                        }, u.customEventData = v, p.clickEvents.push(u), o.getChildByName("title").getComponent(cc.Label).string = g[c].title;
                    }
                    0 == n ? this.picList2[c] = -1 : 1 == n ? this.picList3[c] = -1 : 2 == n ? this.picList4[c] = -1 : this.picList5[c] = -1;
                }, this), JMI.init(function() {
                    WXI.getUid(function() {
                        cc.find("Canvas/preloading").active = !1, this.scheduleOnce(function() {
                            var e = WXI.getStorageSync("FIRSTMAN"), t = WXI.getStorageSync("FIRSTTIME");
                            "undefined" == e || null == e || "" == e ? (WXI.setStorageSync("FIRSTMAN", "firstPlay"), 
                            WXI.setStorageSync("FIRSTTIME", new Date().toString()), wx.aldSendEvent("看到首页的新增玩家数")) : new Date().toString() != t && ("firstPlay" == e && WXI.setStorageSync("FIRSTMAN", "secondPlay"), 
                            wx.aldSendEvent("看到首页的留存玩家数"));
                            WXI.getStorageSync(""), this.updatePlanes(), this.showUI_Const(), this.showUI_Start(), 
                            this.initSelfPlane(), this.lb_level.parent.active = !0, this.onClickImproveEarnings(!1, !0), 
                            this.hideBanner(), this.initGlory(), isNaN(WXI.getStorageSync("COIN")) && (m_data.coin = 1e6, 
                            WXI.saveUserLocalData(), this.lb_coin.writeShoot(m_data.coin)), m_data.coinValue = 200, 
                            m_data.placeValue = 20, this.speedTime = WXI.getStorageSync("SPEEDTIME"), "" !== this.speedTime && void 0 != this.speedTime || (this.speedTime = 0, 
                            WXI.setStorageSync("SPEEDTIME", 0));
                            var n = WXI.getStorageSync("SPEEDTOTAL");
                            "" !== n && void 0 != n || (n = 0, WXI.setStorageSync("SPEEDTOTAL", 0)), this.speedTime != n && 0 != n && (this.speedCall2 = function() {
                                var e = WXI.getStorageSync("SPEEDPROGRESS");
                                cc.find("Canvas/UI_Start/toolBar/board/btn_speed/time").write(200 - e + "s"), e >= 200 ? (WXI.setStorageSync("SPEEDPROGRESS", 0), 
                                cc.find("Canvas/UI_Start/toolBar/board/btn_speed/time").write("0s"), this.unschedule(this.speedCall2)) : (e++, 
                                this.speedTime++, WXI.setStorageSync("SPEEDPROGRESS", e), WXI.setStorageSync("SPEEDTIME", this.speedTime));
                            }, this.schedule(this.speedCall2, 1)), this.countPlaceEarnings(), this.schedule(this.countPlaceEarnings.bind(this), 10);
                            WXI.countPlaceEarnings().num > 4320 && this.onClickGetEarnings();
                            var i = WXI.getStorageSync("SPEEDSTAMPS");
                            if ("" === i || void 0 == i) WXI.setStorageSync("SPEEDSTAMPS", new Date().toDateString()), 
                            WXI.setStorageSync("SPEEDCHANCE", 3); else if (new Date().toDateString() != i) {
                                WXI.setStorageSync("SPEEDSTAMPS", new Date().toDateString()), WXI.setStorageSync("SPEEDCHANCE", 3);
                                var o = WXI.getStorageSync("SIGNIN");
                                o++, WXI.setStorageSync("SIGNIN", o);
                            }
                            this.schedule(function() {
                                this.piggy.active && this.piggy.getComponent(cc.Animation).play();
                            }.bind(this), 1);
                        }.bind(this), .5);
                    }.bind(this));
                }.bind(this)), this.lb_level.write(m_data.level + 1), this.lb_coin.writeShoot(m_data.coin), 
                this.lb_diamond.write(m_data.diamond), this.lb_energy.write(m_data.energy), this.lb_energy.write(m_data.energy), 
                this.initCrossPromotionModule();
                var c = cc.find("Canvas/UI_Start/settingPop/btn_vibrate/line"), a = cc.find("Canvas/UI_Start/settingPop/btn_sound/line"), s = cc.find("Canvas/UI_Start/settingPop/btn_vibrate/box/gou"), r = cc.find("Canvas/UI_Start/settingPop/btn_sound/box/gou"), d = WXI.getStorageSync("VIBRATE");
                "1" == d || "" === d || void 0 == d ? (c.active = !1, s.active = !0, WXI.openVibrate()) : (c.active = !0, 
                s.active = !1, WXI.closeVibrate());
                var l = WXI.getStorageSync("SOUND");
                "1" == l || "" === l || void 0 == l ? (a.active = !1, r.active = !0, AMI.openMusic()) : (a.active = !0, 
                s.active = !1, AMI.closeMusic()), cc.loader.loadRes("prefabs/roulette", cc.Prefab, function(e, t) {});
            },
            showBgLevel_gamePlay: function() {
                var e = this.lb_level, t = e.parent;
                e.stopAllActions(), t.stopAllActions(), e.runAction(cc.scaleTo(.4, 1.67)), t.runAction(cc.scaleTo(.4, .6)), 
                t.runAction(cc.moveTo(.4, cc.v2(0, cc.winSize.height / 2 - 100)));
            },
            showBgLevel_result: function() {
                var e = this.lb_level, t = e.parent;
                e.stopAllActions(), t.stopAllActions(), e.runAction(cc.scaleTo(.4, 1.67)), t.runAction(cc.scaleTo(.4, .6)), 
                t.runAction(cc.moveTo(.4, cc.v2(0, cc.winSize.height / 2 - 150)));
            },
            showBgLevel_start: function() {
                var e = this.lb_level, t = e.parent;
                e.stopAllActions(), t.stopAllActions(), e.runAction(cc.scaleTo(.4, 1)), t.runAction(cc.scaleTo(.4, 1)), 
                t.runAction(cc.moveTo(.4, cc.v2(0, 224)));
            },
            checkTopSP: function() {
                var e = m_data.collect, t = 0, n = 0;
                for (var i in e) {
                    var o = e[i], c = o.s, a = o.p;
                    void 0 != c && c > t && (t = c), void 0 != a && a > n && (n = a);
                }
                return {
                    s: t,
                    p: n
                };
            },
            updateCollectData: function(e) {
                var t = m_data.collect, n = m_data.level, i = !1;
                if ([ "p2", "p3", "p4", "p5" ].forEach(function(e) {
                    void 0 == t[e] && n > JMI.getWingmanData(e).lv - 1 && (t[e] = {
                        s: 0,
                        p: 0
                    }, i = !0);
                }), void 0 == t.p1 && 1 == m_data.level) if (this.isM = wx.getStorageSync("MASKFIRE"), 
                null === this.isM || "" === this.isM || void 0 === this.isM) this.isM = !0, cc.find("Canvas/UI_Start/banner/mask_fire").active = !0; else if (1 == this.isM) {
                    cc.find("Canvas/UI_Start/banner/mask_fire").active = !0;
                }
                if (void 0 == t.p1 && m_data.level > 1 && (t.p1 = {
                    s: 0,
                    p: 0
                }, i = !0), i) {
                    cc.find("Canvas/UI_Start/banner/mask_guide").active = !0, this.planeFreeTryRecover(), 
                    this.showBtnPop("newWingman");
                } else {
                    if (e) return this.planeFreeTry();
                    this.planeFreeTryRecover();
                }
                return "unknown";
            },
            updatePlanes: function(e) {
                var t = this.updateCollectData(e), n = m_data.collect;
                cc.find("Canvas/UI_Start/banner/selfPlanes").children.forEach(function(e) {
                    var i = "p" + e.name;
                    void 0 == n[i] && e.name != t ? gray(e) : unGray(e);
                }.bind(this));
            },
            signToUpdatePlanes: function() {
                var e = m_data.collect;
                return void 0 == e.p2 && (e.p2 = {
                    s: 0,
                    p: 0
                }, cc.find("Canvas/UI_Start/banner/selfPlanes").children.forEach(function(t) {
                    var n = "p" + t.name;
                    void 0 == e[n] ? gray(t) : unGray(t);
                }.bind(this)), m_data.collect = e, WXI.saveUserLocalData(), !0);
            },
            initSelfPlane: function(e) {
                this.plane && this.plane.isValid && this.plane.destroy();
                var t = m_data.collect.f, n = new cc.Node();
                n.group = "gameObject";
                var i = new cc.Node();
                i.name = "body", i.addComponent(cc.Sprite).spriteFrame = this.planeTexture, i.zIndex = 1, 
                i.group = "gameObject";
                var o = cc.instantiate(this.com_prefabNode.tail);
                o.position = cc.v2(0, -i.height / 2), o.parent = n, o.zIndex = 1, i.parent = n;
                var c = cc.instantiate(this.com_prefabNode.core);
                if (c.parent = n, c.zIndex = 1, cc.instantiate(this.com_prefabNode.coinAttract).parent = n, 
                void 0 != m_data.collect[t]) {
                    var a = cc.instantiate(this.com_prefabNode["wingman" + t.replace("p", "")]);
                    a.position = cc.v2(-70, -70), a.name = "wingman1", a.parent = n, this.wingman1Frame = a.getComponent(cc.Sprite).spriteFrame;
                    var s = cc.instantiate(this.com_prefabNode["wingman" + t.replace("p", "")]);
                    s.position = cc.v2(70, -70), s.name = "wingman2", s.parent = n, this.wingman2Frame = s.getComponent(cc.Sprite).spriteFrame;
                }
                n.position = cc.v2(0, -cc.winSize.height - 200), n.parent = this.iterateLayer, n.addComponent("SelfPlaneControl"), 
                n.name = "M_PLANE", this.plane = n, n.runAction(cc.sequence(cc.moveTo(1, cc.v2(0, -100)), cc.callFunc(e)));
            },
            start: function() {
                AMI.playMusic_levelGame(), cc.director.getCollisionManager().enabled = !0, window.m_iterateLayer = this.node.getChildByName("iterateLayer");
                var e = cc.winSize.width / 2, t = cc.winSize.height / 2, n = Math.PI / 2;
                this.node.on(cc.Node.EventType.TOUCH_MOVE, function(i) {
                    var o = i.getLocation().x;
                    this.camera.x = 50 * Math.sin(n * (o - e) / e);
                    var c = i.getDelta();
                    c && this._target && this._target.isValid && (this._target.x = cc.misc.clampf(this._target.x + c.x, -e - 50, e + 50), 
                    this._target.y = cc.misc.clampf(this._target.y + c.y, -t - 50, t + 50));
                }.bind(this));
                var i = cc.find("Canvas/UI_Result"), o = function() {
                    this._allowSlowDown && (this.mask.stopAllActions(), this.mask.runAction(cc.fadeTo(.1, 255)), 
                    c = .2, cc.director.getScheduler().setTimeScale(.2), EMI.dispatchEvent(m_define.eventType.slowDownBegin));
                }.bind(this);
                this.slowDownFunction = o;
                var s = function() {
                    this.totleStop = !0, cc.director.pause();
                }.bind(this);
                this.totleStopFunction = s, this.totleResume = function() {
                    null != this.totleStop && 1 == this.totleStop && (cc.director.resume(), cc.find("Canvas/battleSuperPop").active = !1, 
                    this.totleStop = !1);
                };
                var r = function() {
                    this.mask.stopAllActions(), this.mask.runAction(cc.fadeTo(.1, 0)), c = 1, cc.director.getScheduler().setTimeScale(1), 
                    i.active || EMI.dispatchEvent(m_define.eventType.slowDownEnd);
                }.bind(this);
                this.unSlowDownFunction = r;
                var d = cc.find("Canvas/UI_GamePlay");
                d.on(cc.Node.EventType.TOUCH_START, r), d.on(cc.Node.EventType.TOUCH_CANCEL, o), 
                d.on(cc.Node.EventType.TOUCH_END, o);
                var l = -1, h = !1, m = 0;
                EMI.on(m_define.eventType.attachFormation, function(e) {
                    var t = e.getUserData();
                    l = t || 0;
                }, this), EMI.on(m_define.eventType.enemyCrashed, function(e) {
                    l--;
                    var t = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                    if ((t[18].over += 1, WXI.setStorageSync("GLORY", t), 0 == l) && (!h && !(m++, this.unschedule(this.reloadEnemy), 
                    this.attachFormation(), this.schedule(this.reloadEnemy, 30), 2 != m || this._planeFreeTryVideoWatched && m_data.coolMode))) if (wx.aldSendEvent("通关神器掉落数", {
                        "界面": "战斗界面"
                    }), (m_data.level + 1 + 1) % 5 == 0) drop("itemSuper", cc.v2(0, 667), 30).v = cc.v2(0, -60), 
                    wx.aldSendEvent("通关神器掉落数", {
                        "界面": "战斗界面"
                    }); else if ((m_data.level + 1 + 2) % 5 == 0) {
                        drop("itemTryWinMan", cc.v2(0, 667), 30).v = cc.v2(0, -60), wx.aldSendEvent("通关神器掉落数", {
                            "界面": "战斗界面"
                        });
                    }
                }, this), EMI.on(m_define.eventType.afterSuccessAndFail, function(e) {
                    e.getUserData();
                    var t = cc.find("Canvas/UI_Result"), n = t.getChildByName("success"), i = t.getChildByName("fail"), o = t.getChildByName("after"), c = t.getChildByName("ADbottom"), a = cc.find("Canvas/ChestGame");
                    this.successType || this.playCoinAnimation(cc.v2(0, 0), cc.v2(-330, cc.winSize.height / 2 - 90)), 
                    this.unschedule(this.ClockFunc), this.showUI_Const(), t.active = !0, c.active = MCI.getAdWall(), 
                    n.active = !1, i.active = !1, o.active = !0, a.active = !1;
                }, this), EMI.on(m_define.eventType.chestGame, function(e) {
                    var t = cc.find("Canvas/ChestGame");
                    t.active = !0;
                    var n = cc.find("Canvas/ChestGame/checkArea"), i = 0;
                    this.chestGameFunction = function() {
                        m_data.chest >= 10 ? (this.unschedule(this.chestGameFunction), m_data.coin += 5e4, 
                        WXI.saveUserLocalData(), pop("你赚到了50k金币"), this.playCoinAnimation(cc.v2(0, 0), cc.v2(0, cc.winSize.height / 2 - 90)), 
                        t.active = !1) : i >= 42 && (this.unschedule(this.chestGameFunction), pop("好遗憾，就差一点点"), 
                        t.active = !1), i++;
                        var e = m_pool.getObject("chest"), o = m_pool.getObject("chest");
                        n.addChild(e), n.addChild(o), m_data.chest < 6 ? (e.position = cc.v2(675 * Math.random() - 337, 600 * Math.random() - 300), 
                        o.position = cc.v2(675 * Math.random() - 337, 600 * Math.random() - 300)) : (e.position = cc.v2(675 * Math.random() - 337, -300 * Math.random()), 
                        o.position = cc.v2(675 * Math.random() - 337, -300 * Math.random())), e.getComponent("Chest").init(), 
                        o.getComponent("Chest").init(), e.zIndex = -120, o.zIndex = -121;
                    }, this.schedule(this.chestGameFunction, .35);
                }, this), EMI.on(m_define.eventType.afterALL, function(e) {
                    MCI.getAdWall() && (WXI.hideBanner(), this.scheduleOnce(function() {
                        WXI.hideBanner();
                    }, .5), cc.find("Canvas/ADBG").active = !0);
                }, this), EMI.on(m_define.eventType.gameSuccess, function(e) {
                    this.unschedule(this.reloadEnemy);
                    var t = this.node.getComponent("Shoot");
                    t && t.unscheduleAllCallbacks();
                    var n = cc.find("Canvas/UI_GamePlay/itemRoot");
                    n.children.forEach(function(e) {
                        var t = e.getComponent("Shoot");
                        t && t.unscheduleAllCallbacks(), e.removeFromParent(), m_pool.pushObject(e);
                    }), n.active = !1, l = -1, this.iterateLayer.children.forEach(function(e) {
                        "M_PLANE" != e.name && m_pool.pushObject(e);
                    });
                    var i = this.node.getChildByName("UI_GamePlay");
                    this._allowSlowDown = !1, c = 1, cc.director.getScheduler().setTimeScale(1), this._target = null;
                    var o = this.plane, a = cc.find("Canvas/UI_GamePlay/FireWorkList");
                    a.active = !0;
                    var s = a.children, r = 1;
                    this.fireListfunction = function() {
                        s[r++].getComponent(cc.Animation).play(), AMI.playEffect_firework(), r == s.length && this.unschedule(this.fireListfunction);
                    }, this.schedule(this.fireListfunction, .1), o && o.isValid && (o.removeComponent("Shoot"), 
                    o.runAction(cc.sequence(cc.moveTo(.6, cc.v2(0, 0)), cc.moveTo(.6, cc.v2(0, cc.winSize.height + 200)), cc.callFunc(function() {
                        o && o.isValid && o.destroy();
                    }.bind(this))))), MCI.getAdWall() && (cc.find("Canvas/UI_Result/success/btn_gotReward").active = !1), 
                    cc.find("Canvas/item_anime1").active = !1, cc.find("Canvas/item_anime2").active = !1, 
                    this.scheduleOnce(function() {
                        this.clearIterateLayer(), this.showBgLevel_result(), EMI.dispatchEvent(m_define.eventType.afterALL), 
                        a.active = !1;
                        i.getChildByName("bg_medal");
                        if (m_data.energy += 5, WXI.setStorageSync("ENERGY", m_data.energy), this.showUI_Const(), 
                        this.showUI_Result_success(), m_data.level++, this.successType = !0, "firstPlay" == WXI.getStorageSync("FIRSTMAN") && m_data.level - 1 <= 7 ? wx.aldSendEvent("新增玩家过关人数", {
                            "关卡": m_data.level - 1
                        }) : wx.aldSendEvent("留存玩家过关人数", {
                            "关卡": m_data.level - 1
                        }), m_data.level <= 20) {
                            var e = WXI.getStorageSync("WINCOUNT");
                            null == e || void 0 == e || "" == e ? (WXI.setStorageSync("WINCOUNT", m_data.level), 
                            wx.aldSendEvent("当前关卡玩家过关累计次数", {
                                "关卡": m_data.level
                            }), wx.aldSendEvent("当前关卡玩家过关累计人数", {
                                "关卡": m_data.level
                            })) : e < m_data.level ? (WXI.setStorageSync("WINCOUNT", m_data.level), wx.aldSendEvent("当前关卡玩家过关累计次数", {
                                "关卡": m_data.level
                            }), wx.aldSendEvent("当前关卡玩家过关累计人数", {
                                "关卡": m_data.level
                            })) : wx.aldSendEvent("当前关卡玩家过关累计次数", {
                                "关卡": m_data.level
                            });
                        }
                        MCI.getAdWall() && this.scheduleOnce(function() {
                            cc.find("Canvas/UI_Result/success/btn_gotReward").active = !0;
                        }, 3);
                    }.bind(this), 2);
                }, this), EMI.on(m_define.eventType.gameFail, function(e) {
                    if (this.successType = !1, this.unschedule(this.reloadEnemy), this.showUI_Const(), 
                    MCI.getAdWall() && (cc.find("Canvas/UI_Result/fail/btn_ignoreShare").active = !1, 
                    this.scheduleOnce(function() {
                        cc.find("Canvas/UI_Result/fail/btn_ignoreShare").active = !0;
                    }, 3)), "firstPlay" == WXI.getStorageSync("FIRSTMAN") && m_data.level <= 7 ? wx.aldSendEvent("新增玩家死亡人数", {
                        "关卡": m_data.level
                    }) : wx.aldSendEvent("留存玩家死亡人数", {
                        "关卡": m_data.level
                    }), m_data.level <= 20) {
                        var t = WXI.getStorageSync("DEADCOUNT");
                        null == t || void 0 == t || "" == t ? (WXI.setStorageSync("DEADCOUNT", m_data.level), 
                        wx.aldSendEvent("当前关卡玩家死亡累计次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("当前关卡玩家死亡累计人数", {
                            "关卡": m_data.level
                        })) : t < m_data.level ? (WXI.setStorageSync("DEADCOUNT", m_data.level), wx.aldSendEvent("当前关卡玩家死亡累计次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("当前关卡玩家死亡累计人数", {
                            "关卡": m_data.level
                        })) : wx.aldSendEvent("当前关卡玩家死亡累计次数", {
                            "关卡": m_data.level
                        });
                    }
                    cc.find("Canvas/UI_Result/fail/OverLabel").getComponent(cc.Label).string = "还需要" + this.medalGotNumber + "枚勋章";
                    var n = cc.find("Canvas/item_anime1"), i = cc.find("Canvas/item_anime2");
                    if (n.active = !1, i.active = !1, m_data.rebirthChance > 0) {
                        var o = this.node.getComponent("Shoot");
                        o && o.unscheduleAllCallbacks();
                        var c = cc.find("Canvas/UI_GamePlay/itemRoot");
                        c.children.forEach(function(e) {
                            var t = e.getComponent("Shoot");
                            t && t.unscheduleAllCallbacks(), e.removeFromParent(), m_pool.pushObject(e);
                        }), c.active = !1, this.showUI_Result_fail();
                    } else EMI.dispatchEvent(m_define.eventType.afterALL), m_data.coin += m_data.coinRecord, 
                    WXI.saveUserLocalData(), m_data.coinRecord > 0 ? (pop("你赚到了" + m_data.coinRecord + "金币"), 
                    this.playCoinAnimation(cc.v2(0, 0), cc.v2(-330, cc.winSize.height / 2 - 90)), EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                        showCoinAni: !0,
                        planeFreeTry: !0,
                        type: "fail"
                    })) : EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                        planeFreeTry: !0,
                        type: "fail"
                    });
                }, this), EMI.on(m_define.eventType.backToStartMenu, function(e) {
                    this.plane && this.plane.isValid && this.plane.destroy(), this.bossCreate = !0, 
                    5 == ++a && (m_pool.destroyAllNodes(), a = 0), m_data.coolMode = !1, this.clearIterateLayer(), 
                    this.camera.x = 0, this.zoomIn(), this.hideUI_GamePlay(), this.hideUI_Result(), 
                    this.showUI_Const(), this.showUI_Start(), this.showBgLevel_start(), this.initSelfPlane(), 
                    this._allowSlowDown = !1, this.mask.stopAllActions(), this.mask.runAction(cc.fadeTo(.1, 0)), 
                    c = 1, cc.director.getScheduler().setTimeScale(1), this.lb_level.write(m_data.level + 1), 
                    this.lb_coin.writeShoot(m_data.coin), this.lb_diamond.write(m_data.diamond), this.lb_energy.write(m_data.energy);
                    var t = e.getUserData();
                    this.updatePlanes(t && t.planeFreeTry), this.onClickImproveEarnings(!1, !0), m = 0, 
                    this.hideBanner(), WXI.saveUserLocalData(), WXI.postMessage({
                        type: "saveTopLevel",
                        data: m_data.level + 1
                    });
                    var n = m_data.collect, i = 0;
                    [ "p1", "p2", "p3", "p4", "p5" ].forEach(function(e) {
                        void 0 != n[e] && i++;
                    });
                    var o = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                    o[17].over = m_data.level, 1 == this.gameFailType && (o[19].over += 5), o[4].over = i, 
                    WXI.setStorageSync("GLORY", o), this._gaming = !1, this._planeFreeTryVideoWatched = !1;
                    WXI.countPlaceEarnings().num > 4320 ? t && !t.super && (this.gameFailType = !0, 
                    this.onClickGetEarnings()) : this.gameFailType, this.unschedule(this.reloadEnemy);
                    var s = this.node.getChildByName("UI_Result"), r = this.node.getChildByName("UI_GamePlay"), d = s.getChildByName("bg_medal");
                    if (null != d && (s.removeChild(d), r.addChild(d)), m_data.level <= 7) {
                        var l = WXI.getStorageSync("FIRSTMAN");
                        1 == this.successType ? "firstPlay" == l ? wx.aldSendEvent("新增玩家成功且返回首页人数", {
                            "关卡": m_data.level - 1
                        }) : "secondPlay" == l && wx.aldSendEvent("留存玩家成功且返回首页人数", {
                            "关卡": m_data.level - 1
                        }) : 0 == this.successType && ("firstPlay" == l ? wx.aldSendEvent("新增玩家失败且返回首页人数", {
                            "关卡": m_data.level
                        }) : "secondPlay" == l && wx.aldSendEvent("留存玩家失败且返回首页人数", {
                            "关卡": m_data.level
                        }));
                    }
                    if (m_data.level <= 20) if (1 == this.successType) wx.aldSendEvent("过关且返回首页累计人数", {
                        "关卡": m_data.level - 1
                    }), wx.aldSendEvent("过关且返回首页累计次数", {
                        "关卡": m_data.level - 1
                    }); else if (0 == this.successType) {
                        var h = WXI.getStorageSync("LOSEBACKCOUNT");
                        null == h || void 0 == h || "" == h ? (WXI.setStorageSync("LOSEBACKCOUNT", m_data.level), 
                        wx.aldSendEvent("失败再次返回首页累计次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("失败再次返回首页累计人数", {
                            "关卡": m_data.level
                        })) : h < m_data.level ? (WXI.setStorageSync("LOSEBACKCOUNT", m_data.level), wx.aldSendEvent("失败再次返回首页累计次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("失败再次返回首页累计人数", {
                            "关卡": m_data.level
                        })) : wx.aldSendEvent("失败再次返回首页累计次数", {
                            "关卡": m_data.level
                        });
                    }
                    !this._gaming || t.super || t.nextLevel || WXI.createInterAD(), 1 != m_data.level && 2 != m_data.level && (this.isM || (t && t.super ? this.scheduleOnce(function() {
                        this.onClickGemini();
                    }, 1) : t && t.nextLevel && this.scheduleOnce(function() {
                        this.onClickPlane();
                    }, 1)));
                }, this);
                var p = -1, u = 0, v = 0;
                EMI.on(m_define.eventType.initLevelGoal, function() {
                    h = !1, p = JMI.getChapterData() || 1, u = 0;
                    var e = JMI.getBossData(m_data.level % 1e3 + 1 + "");
                    v = e ? e.medalNum : 0;
                    var t = cc.misc.clampf(u / (p + v), 0, 1);
                    this.com_barMedal.progress = t, this.lb_progress.write("还需要" + p + "枚"), this.medalGotNumber = p;
                }, this);
                var g = cc.winSize.height / 2 - 150 - 30;
                EMI.on(m_define.eventType.medalGot, function(e) {
                    var t = e.getUserData(), n = t.position, i = t.num, o = t.bossFight, c = !1;
                    if (o) {
                        i = parseInt((i - 6) / 3) + (i - 6) % 3 + 6;
                        var a = parseInt((i - 6) / 3);
                    } else i >= 3 && (i /= 3, c = !0);
                    var s = 0;
                    this.m_schedule(function(e) {
                        if (o) {
                            if (s < 6 || s > a + 6) var t = m_pool.getObject("medal"); else t = m_pool.getObject("medal3");
                            s++, t.scale = 2, t.position = n, t.attachParent(this.iterateLayer, 39), t.runAction(cc.sequence(cc.moveTo(.3, cc.v2(n.x + 400 * Math.random() - 200, n.y + 400 * Math.random() - 200)).easing(cc.easeElasticInOut(3)), cc.delayTime(.5), cc.spawn(cc.moveTo(.3, cc.v2(195, g)).easing(cc.easeSineInOut()), cc.scaleTo(.6, .6)), cc.callFunc(function() {
                                if (t && t.isValid) {
                                    m_pool.pushObject(t), s < 6 || s > a + 6 ? u += 3 : u++, this.medalGotNumber = p - u;
                                    var n = cc.misc.clampf(u / (p + v), 0, 1);
                                    this.com_barMedal.progress = n;
                                    var c = 0;
                                    p - u < 0 ? (c = 0, this.lb_progress.write("胜利通关"), v > 0 && this.lb_progress.write("战胜BOSS")) : (c = p - u, 
                                    this.lb_progress.write("还需要" + c + "枚")), u == p && (v > 0 ? (h = !0, this.lb_progress.write("战胜BOSS"), 
                                    this.attachBoss()) : EMI.dispatchEvent(m_define.eventType.gameSuccess)), o && e == i && EMI.dispatchEvent(m_define.eventType.gameSuccess);
                                }
                            }.bind(this))));
                        } else {
                            if (c) t = m_pool.getObject("medal3"); else var t = m_pool.getObject("medal");
                            t.scale = 2, t.position = n, t.attachParent(this.iterateLayer, 39), t.runAction(cc.sequence(cc.delayTime(.5), cc.spawn(cc.moveTo(.6, cc.v2(195, g)).easing(cc.easeSineInOut()), cc.scaleTo(.6, .6)), cc.callFunc(function() {
                                if (t && t.isValid) {
                                    m_pool.pushObject(t), c ? u += 3 : u++, this.medalGotNumber = p - u;
                                    var n = cc.misc.clampf(u / (p + v), 0, 1);
                                    this.com_barMedal.progress = n;
                                    var a = 0;
                                    p - u <= 0 ? (a = 0, this.lb_progress.write("胜利通关"), v > 0 && this.lb_progress.write("战胜BOSS")) : (a = p - u, 
                                    this.lb_progress.write("还需要" + a + "枚")), void 0 == this.bossCreate && (this.bossCreate = !0), 
                                    u >= p && !h && (this.bossCreate = !1, v > 0 ? (h = !0, this.lb_progress.write("战胜BOSS"), 
                                    this.attachBoss()) : EMI.dispatchEvent(m_define.eventType.gameSuccess)), o && e == i && EMI.dispatchEvent(m_define.eventType.gameSuccess);
                                }
                            }.bind(this))));
                        }
                    }.bind(this), .02, i);
                }, this);
                var f = cc.find("Canvas/UI_GamePlay/item1"), _ = cc.find("Canvas/UI_GamePlay/itemRoot");
                EMI.on(m_define.eventType.getItem, function(e) {
                    var t = e.getUserData(), n = "shield_rebirth" == t ? "shield" : t;
                    n += "_icon", EMI.dispatchEvent(m_define.eventType.useItemBegin, t);
                    var i = _.getChildByName(n);
                    if (!i || !i.isValid) {
                        switch (i = m_pool.getObject(n, f), n) {
                          case "shield_icon":
                            i.getComponent(cc.Sprite).spriteFrame = this.itemTextures[0];
                            break;

                          case "ammo_icon":
                            i.getComponent(cc.Sprite).spriteFrame = this.itemTextures[1];
                            break;

                          case "gemini_icon":
                            i.getComponent(cc.Sprite).spriteFrame = this.itemTextures[2];
                            break;

                          case "laser_icon":
                            i.getComponent(cc.Sprite).spriteFrame = this.itemTextures[3];
                            break;

                          case "coinBag_icon":
                            i.getComponent(cc.Sprite).spriteFrame = this.itemTextures[4];
                        }
                        "super_icon" != n && "trywinman_icon" != n && (i.name = n, i.position = cc.v2(0, 0));
                    }
                    i.attachParent(_);
                    var o = 5;
                    function c(e) {
                        e.forEach(function(e) {
                            var t = _.getChildByName(e);
                            if (t && t.isValid) {
                                t.removeFromParent();
                                var n = t.getComponent("Shoot");
                                n && n.unscheduleAllCallbacks(), m_pool.pushObject(t);
                            }
                        });
                    }
                    var a = cc.find("Canvas/battleSuperPop"), s = a.getChildByName("board"), r = s.getChildByName("superUI"), d = s.getChildByName("tryUI");
                    switch (n) {
                      case "ammo_icon":
                        c([ "gemini_icon", "laser_icon" ]);
                        break;

                      case "gemini_icon":
                        c([ "ammo_icon", "laser_icon" ]);
                        break;

                      case "laser_icon":
                        c([ "ammo_icon", "gemini_icon" ]);
                        break;

                      case "coinBag_icon":
                        o = 10;
                        break;

                      case "super_icon":
                        c([ "ammo_icon", "laser_icon", "gemini_icon" ]), wx.aldSendEvent("通关神器拾取数", {
                            "界面": "战斗界面"
                        }), this.totleStopFunction(), a.active = !0, s.getChildByName("label").getComponent(cc.Label).string = "炫酷暴走，通关神器", 
                        r.active = !0, d.active = !1;
                        break;

                      case "trywinman_icon":
                        c([ "ammo_icon", "laser_icon", "gemini_icon" ]), wx.aldSendEvent("通关神器拾取数", {
                            "界面": "战斗界面"
                        }), this.totleStopFunction(), a.active = !0, s.getChildByName("label").getComponent(cc.Label).string = "超级僚机，通关神器", 
                        r.active = !1, d.active = !0, d.getChildByName("winman1").getComponent(cc.Sprite).spriteFrame = this.wingman1Frame, 
                        d.getChildByName("winman2").getComponent(cc.Sprite).spriteFrame = this.wingman2Frame;
                    }
                    cc.game.setTimeout;
                    var l = i.getChildByName("lb_item_countDown");
                    l.write(o + "s");
                    var h = i.getComponent("Shoot") || i.addComponent("Shoot");
                    h.unscheduleAllCallbacks(), h.m_schedule(function() {
                        o--, l.write(o + "s");
                    }.bind(this), 1, 4, function() {
                        o--, l.write(o + "s"), i && i.isValid && (i.getComponent("Shoot").unscheduleAllCallbacks(), 
                        i.removeFromParent(), m_pool.pushObject(i), EMI.dispatchEvent(m_define.eventType.useItemEnd, t));
                    }.bind(this));
                }, this);
                var S = function(e) {
                    var t = e.getUserData(), n = m_pool.getObject("coin");
                    n && (n.scale = 1.5, n.position = t, n.attachParent(this.iterateLayer, 99), n.runAction(cc.sequence(cc.spawn(cc.moveTo(.6, cc.v2(-186, g)).easing(cc.easeSineInOut()), cc.scaleTo(.6, .53)), cc.callFunc(function() {
                        n && n.isValid && (AMI.playEffect_eatCoin(), m_pool.pushObject(n), m_data.coinRecord += m_data.coinValue, 
                        this.lb_coinRecord.write(m_data.coinRecord));
                    }.bind(this)))));
                }.bind(this);
                EMI.on(m_define.eventType.coinGot, S, this), EMI.on(m_define.eventType.coinGotCoinBag, S, this), 
                EMI.on(m_define.eventType.showCoinAni, function(e) {
                    var t = e.getUserData();
                    this.playCoinAnimation(t, cc.v2(-330, cc.winSize.height / 2 - 90), function() {
                        this.lb_coin.writeShoot(m_data.coin);
                    }.bind(this));
                }, this);
            },
            clearIterateLayer: function() {
                this.plane && this.plane.isValid && this.plane.destroy(), this.iterateLayer.children.forEach(function(e) {
                    m_pool.pushObject(e);
                });
            },
            countPlaceEarnings: function() {
                var e = WXI.countPlaceEarnings(), t = e.num, n = e.str, i = e.percent, o = e.speed, c = m_data.placeValue * t;
                o && (c = m_data.placeValue * (o + t)), m_data.earnings = c, this.lb_countDown.write(n), 
                this.com_barPlace.progress = i, this.lb_earnings.writeShoot(c);
            },
            setTarget: function(e) {
                this._target = e;
            },
            update: function(e) {
                var t = cc.winSize.width, n = cc.winSize.height;
                this.iterateLayer.children.forEach(function(i) {
                    if (i && i.isValid && i.active) {
                        var o = i.v;
                        o && (i.position = i.position.add(o.mul(e * c)), cc.rect(-t / 2 - 50, -n / 2 - 50, t + 100, n + 100).contains(i.position) || m_pool.pushObject(i));
                    }
                }), 9 == m_data.chest && WXI.showBanner(), this.dealBackground(e);
            },
            dealBackground: function(e) {
                if (this.backgroundDown.y -= 200 * e, this.backgroundDown.y < -2050.2) {
                    this.backgroundDown.y = 0;
                    var t = this.backgroundTextures.length;
                    this._bgStill ? this._bgUpChanged ? (this.backgroundDown.changeSp(this.backgroundTextures[this.bgIndex + 1 > t - 1 ? 0 : this.bgIndex + 1]), 
                    this.bgIndex = this.bgIndex + 1 > t - 1 ? 0 : this.bgIndex + 1, this._bgUpChanged = !1, 
                    this._bgStill = !1, this.cloudLayer.y = -1025.1) : (this._bgUpChanged = !0, this.backgroundUp.changeSp(this.backgroundTextures[this.bgIndex + 1 > t - 1 ? 0 : this.bgIndex + 1]), 
                    this.cloudLayer.y = 1025.1) : (this._bgStill = !0, this.cloudLayer.y = 3075.3, this.cloudLayer.active = !0);
                }
            },
            onClickRank: function() {
                var e = cc.find("Canvas/UI_Start/rankPop");
                e.active || (e.active = !0, wx.aldSendEvent("点击排行榜", {
                    "页面": "游戏开始界面"
                }));
            },
            onClickMoveNode: function(e) {
                var t = cc.find("Canvas/UI_Start/MoveNode");
                t.stopAllActions(), 1 == e ? t.runAction(cc.moveTo(.2, cc.v2(0, 100))) : t.runAction(cc.moveTo(.2, cc.v2(0, -180)));
            },
            onClickToolBar: function() {
                var e = cc.find("Canvas/UI_Start/toolBar"), t = e.getChildByName("board");
                t.stopAllActions(), 1 == t.active ? e.runAction(cc.sequence(cc.moveTo(.5, e.position.add(cc.v2(-440, 0))), cc.callFunc(function() {
                    t.active = !1;
                }))) : (t.active = !0, e.runAction(cc.moveTo(.5, e.position.add(cc.v2(440, 0)))));
            },
            onClickItemInPlay: function(e, t) {
                wx.aldSendEvent("点击右边的道具", {
                    "页面": "战斗界面"
                }), this.totleStopFunction(), this.unSlowDownFunction();
                var n = cc.find("Canvas/ItemInPlayPop");
                n.zIndex = 9e4, n.active = !0, this.item_in_play_btn = cc.find("Canvas/item_anime" + t), 
                this.nowClickitem = t, n.getChildByName("board").getChildByName("item").getComponent(cc.Sprite).spriteFrame = this.item_in_play_btn.getComponent("SelectItem").getItem();
                var i = n.getChildByName("btn_share").getComponent(cc.Button);
                i.clickEvents = [];
                var o = new cc.Component.EventHandler();
                o.target = this.node, o.component = "MainScene", o.handler = "onClickGetItem", o.customEventData = this.item_in_play_btn.getComponent("SelectItem").getItemNumber(), 
                i.clickEvents.push(o);
            },
            onClickItemInPlayClose: function() {
                null != this.totleResume && this.totleResume(), cc.find("Canvas/ItemInPlayPop").active = !1, 
                wx.aldSendEvent("没有看广告获取右边的道具，直接关闭了", {
                    "页面": "战斗界面"
                });
            },
            onClickGetItem: function(e, t) {
                WXI.createVideo(function() {
                    switch (wx.aldSendEvent("点击看广告获取右边的道具", {
                        "页面": "战斗界面"
                    }), 1 == this.nowClickitem ? this.item_anime1ac = !1 : this.item_anime2ac = !1, 
                    t) {
                      case 0:
                        EMI.dispatchEvent(m_define.eventType.getItem, "ammo");
                        break;

                      case 1:
                        EMI.dispatchEvent(m_define.eventType.getItem, "gemini");
                        break;

                      case 2:
                        EMI.dispatchEvent(m_define.eventType.getItem, "shield");
                        break;

                      case 3:
                        EMI.dispatchEvent(m_define.eventType.getItem, "laser");
                    }
                    void 0 != this.item_in_play_btn && (this.item_in_play_btn.active = !1), this.onClickItemInPlayClose();
                }.bind(this), null, "adunit-68b60853ed7ebe7b");
            },
            onClickBattlePopSkip: function() {
                null != this.totleResume && this.totleResume(), wx.aldSendEvent("关闭了游戏中的通关神器", {
                    "页面": "战斗界面"
                });
            },
            onClickBattlePopButton: function() {
                "炫酷暴走，通关神器" == cc.find("Canvas/battleSuperPop/board/label").getComponent(cc.Label).string ? (wx.aldSendEvent("点击游戏中的炫酷暴走，通关神器", {
                    "页面": "战斗界面"
                }), this.onClickGemini()) : (wx.aldSendEvent("点击游戏中的超级僚机，通关神器", {
                    "页面": "战斗界面"
                }), WXI.createVideo(function() {
                    null != this.totleResume && this.totleResume(), m_data.tempF = this.tempF_freetrywinman || "p1", 
                    this.plane.getComponent("SelfPlaneControl").init();
                }.bind(this), null, "adunit-68b60853ed7ebe7b"));
            },
            onClickADBGSkip: function() {
                cc.find("Canvas/ADBG").active = !1, WXI.showBanner();
            },
            onClickAfterSuperNext: function() {
                wx.aldSendEvent("点击结算界面的炫酷暴走", {
                    "页面": "游戏结算界面"
                }), this.successType ? EMI.dispatchEvent(m_define.eventType.backToStartMenu, {
                    super: !0
                }) : (m_data.coinRecord, EMI.dispatchEvent(m_define.eventType.backToStartMenu, {
                    planeFreeTry: !0,
                    super: !0
                }));
            },
            onClickAfterNext: function() {
                wx.aldSendEvent("点击结算界面的直接开始下一局", {
                    "页面": "游戏结算界面"
                }), EMI.dispatchEvent(m_define.eventType.backToStartMenu, {
                    nextLevel: !0
                });
            },
            onClickBack: function() {
                this._rewardGetting || (wx.aldSendEvent("点击结算界面的返回首页", {
                    "页面": "游戏结算界面"
                }), this._rewardGetting = !0, cc.find("Canvas/pigCoinRoot").active = !0, this.CoinGotType || this.playCoinAnimation(cc.v2(0, 139), cc.v2(-330, cc.winSize.height / 2 - 90), function() {
                    var e = m_data.coin + m_data.coinRecord;
                    this.addCoinStepByStep = function() {
                        m_data.coin += e > 1e5 ? 1e4 : 1e3, m_data.coin += 1e3, this.lb_coin.writeShoot(m_data.coin), 
                        m_data.coin > e && (m_data.coinRecord = 0, m_data.coin = e, this.lb_coin.writeShoot(m_data.coin), 
                        WXI.saveUserLocalData(), this._rewardGetting = !1, this.unschedule(this.addCoinStepByStep));
                    }, this.schedule(this.addCoinStepByStep, .02);
                }.bind(this)), this.successType ? EMI.dispatchEvent(m_define.eventType.backToStartMenu) : m_data.coinRecord > 0 ? EMI.dispatchEvent(m_define.eventType.backToStartMenu, {
                    showCoinAni: !0,
                    planeFreeTry: !0
                }) : EMI.dispatchEvent(m_define.eventType.backToStartMenu, {
                    planeFreeTry: !0
                }), this.CoinGotType = !0);
            },
            onClickShareOnceWithOutReward: function() {
                WXI.share3Seconds();
            },
            onScrollerIcon: function() {
                m_data.scorller = !0, null == this.ScrollerFun && (this.ScrollerFun = function() {
                    m_data.scorller = !1, this.ScrollerFun = null;
                }, this.scheduleOnce(this.ScrollerFun, 1));
            },
            onClickChangeBtn: function() {
                for (var e = cc.find("Canvas/UI_Start/moreGamesBoard/board").children, t = [], n = 0; n < e.length; n++) for (var i = 0; ;) {
                    if (i = parseInt(Math.random() * e.length), 0 == t.length) {
                        t.push(i);
                        break;
                    }
                    for (var o = 0; o < t.length && t[o] != i; ) o++;
                    if (o == t.length) {
                        t.push(i);
                        break;
                    }
                }
                for (var c = MCI.getGuessAD(), a = function(n) {
                    var i = t[n];
                    e[n].name = i + "", e[n].getComponent("GameIcon").init(c[i]), e[n].getChildByName("lb_name").getComponent(cc.Label).string = c[i].title, 
                    cc.loader.loadRes("icon/" + i, function(t, i) {
                        t || (e[n].getChildByName("sp").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(i));
                    });
                }, s = 0; s < e.length; s++) a(s);
                this.changeIconBtn = !this.changeIconBtn;
            },
            onClickGuessGameIcon: function(e, t) {
                (o.UserData.addClick(t.appId, 1), "全屏" == t.where && wx.aldSendEvent("点击游戏", {
                    "页面": "全屏广告",
                    appid: t.appId
                }), "尾页" == t.where) ? (1 == cc.find("Canvas/UI_Result/success").active ? wx.aldSendEvent("点击游戏", {
                    "页面": "游戏胜利页面",
                    appid: t.appId
                }) : wx.aldSendEvent("点击游戏", {
                    "页面": "游戏失败页面",
                    appid: t.appId
                }), wx.aldSendEvent("点击游戏", {
                    "组件": "列表组件",
                    appid: t.appId
                })) : (wx.aldSendEvent("点击游戏", {
                    "页面": "首页",
                    appid: t.appId
                }), wx.aldSendEvent("点击游戏", {
                    "组件": "轮播组件",
                    appid: t.appId
                }));
                wx.navigateToMiniProgram({
                    appId: t.appId,
                    path: t.path,
                    success: function() {
                        (o.UserData.addExport(t.appId, 1), "尾页" == t.where) ? (1 == cc.find("Canvas/UI_Result/success").active ? wx.aldSendEvent("确认点击游戏", {
                            "页面": "游戏胜利页面",
                            appid: t.appId
                        }) : wx.aldSendEvent("确认点击游戏", {
                            "页面": "游戏失败页面",
                            appid: t.appId
                        }), wx.aldSendEvent("确认点击游戏", {
                            "组件": "列表组件",
                            appid: t.appId
                        })) : (wx.aldSendEvent("确认点击游戏", {
                            "页面": "首页",
                            appid: t.appId
                        }), wx.aldSendEvent("确认点击游戏", {
                            "组件": "轮播组件",
                            appid: t.appId
                        }));
                    },
                    fail: function() {
                        EMI.dispatchEvent(m_define.eventType.navFail, {
                            customEventData: t
                        });
                    }
                });
            },
            initGlory: function() {
                var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                "" !== e && void 0 != e && null != e || WXI.setStorageSync("GLORY", m_data.gloryJson), 
                this.updateGlory();
            },
            updateGlory: function() {
                for (var e = cc.find("Canvas/UI_Start/gloryPop/board/view/content"), t = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson, n = [], i = [], o = 0; o < t.length; o++) 10 == t[o].finish ? (i.push(t[o]), 
                t.splice(o, 1), o--) : 5 == t[o].finish && "获得僚机架数" == t[o].name ? (i.push(t[o]), 
                t.splice(o, 1), o--) : t[o].over < t[o].mission[t[o].finish] && (n.push(t[o]), t.splice(o, 1), 
                o--);
                for (var c = 0; c < n.length; c++) t.push(n[c]);
                for (var a = 0; a < i.length; a++) t.push(i[a]);
                console.log(i), console.log(t);
                for (var s = 0; s < t.length; s++) {
                    var r = e.children[s];
                    r.name = "mission" + s;
                    var d = t[s].finish, l = t[s].over, h = t[s].mission, m = r.getChildByName("doubleGet"), p = r.getChildByName("get");
                    if (r.getChildByName("coin").getChildByName("number").writeShoot(t[s].reward[d]), 
                    r.getChildByName("overAndtotal").getComponent(cc.Label).string = l + "/" + h[d], 
                    r.getChildByName("title").getComponent(cc.Label).string = t[s].name, m.getComponent(cc.Button).clickEvents = [], 
                    p.getComponent(cc.Button).clickEvents = [], l >= h[d]) {
                        r.getChildByName("progress").getComponent(cc.ProgressBar).progress = 1, m.active = !0, 
                        p.active = !0;
                        var u = new cc.Component.EventHandler();
                        u.target = this.node, u.component = "MainScene", u.handler = "onClickGloryButtonDouble", 
                        u.customEventData = t[s].name, m.getComponent(cc.Button).clickEvents.push(u);
                        var v = new cc.Component.EventHandler();
                        v.target = this.node, v.component = "MainScene", v.handler = "onClickGloryButtonOnce", 
                        v.customEventData = t[s].name, p.getComponent(cc.Button).clickEvents.push(v), r.getChildByName("doubleGet").getChildByName("Label").string = "立即领取";
                    } else 10 == d ? (r.getChildByName("progress").getComponent(cc.ProgressBar).progress = 0, 
                    r.getChildByName("coin").getChildByName("number").writeShoot(0), r.getChildByName("overAndtotal").getComponent(cc.Label).string = "已完成", 
                    m.active = !1, p.active = !1, m.getComponent(cc.Button).clickEvents = [], p.getComponent(cc.Button).clickEvents = []) : "获得僚机架数" == t[s].name && 5 == d ? (r.getChildByName("progress").getComponent(cc.ProgressBar).progress = 0, 
                    r.getChildByName("coin").getChildByName("number").writeShoot(0), r.getChildByName("overAndtotal").getComponent(cc.Label).string = "已完成", 
                    m.active = !1, p.active = !1, m.getComponent(cc.Button).clickEvents = [], p.getComponent(cc.Button).clickEvents = []) : (r.getChildByName("progress").getComponent(cc.ProgressBar).progress = l / h[d], 
                    m.active = !1, p.active = !1, m.getComponent(cc.Button).clickEvents = [], p.getComponent(cc.Button).clickEvents = []);
                }
            },
            onClickGloryOpen: function() {
                wx.aldSendEvent("点击成就按钮", {
                    "页面": "游戏开始界面"
                }), cc.find("Canvas/UI_Start/gloryPop").active = !0, this.updateGlory();
            },
            onClickGloryOff: function() {
                cc.find("Canvas/UI_Start/gloryPop").active = !1;
            },
            onClickGloryButtonDouble: function(e, t) {
                for (var n = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson, i = 0; i < n.length; i++) if (n[i].name == t) {
                    WXI.createVideo(function() {
                        wx.aldSendEvent("点击成就里面的多倍领取", {
                            "页面": "成就界面"
                        }), m_data.coin += 3 * n[i].reward[n[i].finish], n[i].finish++, this.lb_coin.writeShoot(m_data.coin), 
                        this.playCoinAnimation(cc.v2(0, 0), cc.v2(-330, cc.winSize.height / 2 - 90)), WXI.setStorageSync("GLORY", n);
                    }.bind(this), null, "adunit-68b60853ed7ebe7b");
                    break;
                }
                this.updateGlory();
            },
            onClickGloryButtonOnce: function(e, t) {
                var n = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                console.log(e);
                for (var i = 0; i < n.length; i++) if (n[i].name == t) {
                    wx.aldSendEvent("点击成就里面的单倍领取", {
                        "页面": "成就界面"
                    }), m_data.coin += n[i].reward[n[i].finish], n[i].finish++, this.lb_coin.writeShoot(m_data.coin), 
                    this.playCoinAnimation(cc.v2(0, 0), cc.v2(-330, cc.winSize.height / 2 - 90)), WXI.setStorageSync("GLORY", n);
                    break;
                }
                this.updateGlory();
            },
            onClickGloryClose: function() {
                cc.find("Canvas/UI_Start/gloryPop").active = !1;
            },
            openSuper: function() {
                cc.find("Canvas/UI_Start/superPop").active = !0;
            },
            onClickSuperClose: function() {
                cc.find("Canvas/UI_Start/superPop").active = !1;
            },
            onClickSignIn: function() {
                cc.find("Canvas/UI_Start/signInPop").active = !0, wx.aldSendEvent("点击开始界面的签到按钮", {
                    "页面": "游戏开始界面"
                });
                var e = WXI.getStorageSync("SIGNIN");
                "" !== e && void 0 != e && null != e || WXI.setStorageSync("SIGNIN", 1);
                var t = WXI.getStorageSync("OLDDATE");
                if (void 0 == t || "" === t || null == t) {
                    var n = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                    t = new Date(), WXI.setStorageSync("OLDDATE", t), n[21].over = 0, WXI.setStorageSync("GLORY", n);
                }
                var i = WXI.getStorageSync("CUMULATIVESIGN");
                if ("" !== i && void 0 != i || (i = 0, WXI.setStorageSync("CUMULATIVESIGN", 0)), 
                e) {
                    var o = cc.find("Canvas/UI_Start/signInPop/board");
                    if (void 0 == m_data.collect.p2) for (var c = 1; c < i + 1; c++) o.getChildByName("bg" + c).getChildByName("Splash").active = !0; else {
                        e %= 7;
                        var a = o.getChildByName("bg2");
                        a.getChildByName("reward").active = !1, a.getChildByName("reward2").active = !0, 
                        a.getChildByName("number").getComponent(cc.Label).string = "20k";
                        for (c = 1; c < e + 1; c++) o.getChildByName("bg" + c).getChildByName("Splash").active = !0;
                    }
                }
            },
            onClickSignInShare: function() {
                var e = WXI.getStorageSync("SIGNIN"), t = WXI.getStorageSync("CUMULATIVESIGN");
                if (0 == (e %= 7) && (e = 7), e > t) if (1 == cc.find("Canvas/UI_Start/signInPop/btn_refuse/bg/hook").active) wx.aldSendEvent("签到界面多倍领取", {
                    "页面": "签到界面"
                }), WXI.share3Seconds(function() {
                    var n = e;
                    2 != n ? (m_data.coin += 3 * m_data.signJson[n - 1], this.lb_coin.writeShoot(m_data.coin), 
                    this.playAnimation_getEarnings()) : this.signToUpdatePlanes(), WXI.saveUserLocalData(), 
                    t = e;
                    var i = WXI.getStorageSync("OLDDATE");
                    if (void 0 == i || "" === i || null == i) {
                        var o = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                        i = new Date(), WXI.setStorageSync("OLDDATE", i), o[21].over = 0, WXI.setStorageSync("GLORY", o);
                    }
                    new Date() - i > 864e5 && ((o = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson)[21].over = 0, 
                    WXI.setStorageSync("GLORY", o));
                    (o = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson)[21].over += 1, o[20].over = t, 
                    WXI.setStorageSync("GLORY", o), WXI.setStorageSync("CUMULATIVESIGN", t), this.onClickSignInClose();
                }.bind(this), function() {
                    pop("分享失败");
                }); else {
                    wx.aldSendEvent("签到界面单倍领取", {
                        "页面": "签到界面"
                    });
                    var n = e;
                    2 != n ? (m_data.coin += m_data.signJson[n - 1], this.lb_coin.writeShoot(m_data.coin), 
                    this.playAnimation_getEarnings()) : this.signToUpdatePlanes(), WXI.saveUserLocalData(), 
                    t = e;
                    var i = WXI.getStorageSync("OLDDATE");
                    if (void 0 == i || "" === i || null == i) {
                        var o = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                        i = new Date(), WXI.setStorageSync("OLDDATE", i), o[21].over = 0, WXI.setStorageSync("GLORY", o);
                    }
                    if (new Date() - i > 864e5) (o = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson)[21].over = 0, 
                    WXI.setStorageSync("GLORY", o);
                    (o = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson)[21].over += 1, o[20].over = t, 
                    WXI.setStorageSync("GLORY", o), WXI.setStorageSync("CUMULATIVESIGN", t), this.onClickSignInClose();
                } else pop("今天已经签到过了，请明天再来");
            },
            onClickSignInClose: function() {
                cc.find("Canvas/UI_Start/signInPop").active = !1;
            },
            onClickChangeDouble: function() {
                var e = cc.find("Canvas/UI_Start/signInPop/btn_refuse/bg/hook"), t = cc.find("Canvas/UI_Start/signInPop/btn_share/icon");
                1 == e.active ? (e.active = !1, t.active = !1) : (e.active = !0, t.active = !0);
            },
            onClickSpeedOpen: function() {
                var e;
                return WXI.getStorageSync("SPEEDCHANCE") < 0 ? ((e = cc.find("Canvas/UI_Start/title")).active = !0, 
                e.getChildByName("text").getComponent(cc.Label).string = "每天加速最多3次", void this.scheduleOnce(function() {
                    e.active = !1;
                }, .5)) : 0 != WXI.getStorageSync("SPEEDPROGRESS") ? ((e = cc.find("Canvas/UI_Start/title")).active = !0, 
                e.getChildByName("text").getComponent(cc.Label).string = "加速时间尚未结束", void this.scheduleOnce(function() {
                    e.active = !1;
                }, .5)) : (cc.find("Canvas/UI_Start/speedPop").active = !0, void wx.aldSendEvent("点击加速界面按钮", {
                    "页面": "游戏开始界面"
                }));
            },
            onClickSpeedShare: function() {
                WXI.share3Seconds(function() {
                    wx.aldSendEvent("点击加速界面的分享加速按钮", {
                        "页面": "加速界面"
                    });
                    var e = WXI.getStorageSync("SPEEDCHANCE");
                    e > 0 && (e--, WXI.setStorageSync("SPEEDCHANCE", e)), WXI.setStorageSync("isSpeed", !0);
                    var t = WXI.getStorageSync("SPEEDTOTAL");
                    WXI.setStorageSync("SPEEDTOTAL", t + 200), WXI.setStorageSync("SPEEDPROGRESS", 0), 
                    this.speedTime = WXI.getStorageSync("SPEEDTIME"), this.speedCall = function() {
                        var e = WXI.getStorageSync("SPEEDPROGRESS");
                        cc.find("Canvas/UI_Start/toolBar/board/btn_speed/time").write(200 - e + "s"), e >= 200 ? (WXI.setStorageSync("SPEEDPROGRESS", 0), 
                        cc.find("Canvas/UI_Start/toolBar/board/btn_speed/time").write("0s"), this.unschedule(this.speedCall)) : (e++, 
                        this.speedTime++, WXI.setStorageSync("SPEEDPROGRESS", e), WXI.setStorageSync("SPEEDTIME", this.speedTime));
                    }, this.schedule(this.speedCall, 1), this.onClickSpeedClose();
                }.bind(this), function() {
                    pop("分享失败");
                });
            },
            onClickSpeedVedio: function() {
                WXI.createVideo(function() {
                    wx.aldSendEvent("点击加速界面的广告加速按钮", {
                        "页面": "加速界面"
                    });
                    var e = WXI.getStorageSync("SPEEDCHANCE");
                    e > 0 && (e--, WXI.setStorageSync("SPEEDCHANCE", e)), WXI.setStorageSync("isSpeed", !0);
                    var t = WXI.getStorageSync("SPEEDTOTAL");
                    WXI.setStorageSync("SPEEDTOTAL", t + 200), WXI.setStorageSync("SPEEDPROGRESS", 0), 
                    this.speedTime = WXI.getStorageSync("SPEEDTIME"), this.speedCall = function() {
                        var e = WXI.getStorageSync("SPEEDPROGRESS");
                        cc.find("Canvas/UI_Start/toolBar/board/btn_speed/time").write(200 - e + "s"), e >= 200 ? (WXI.setStorageSync("SPEEDPROGRESS", 0), 
                        cc.find("Canvas/UI_Start/toolBar/board/btn_speed/time").write("0s"), this.unschedule(this.speedCall)) : (e++, 
                        this.speedTime++, WXI.setStorageSync("SPEEDPROGRESS", e), WXI.setStorageSync("SPEEDTIME", this.speedTime));
                    }, this.schedule(this.speedCall, 1), this.onClickSpeedClose();
                }.bind(this), null, "adunit-68b60853ed7ebe7b");
            },
            onClickSpeedClose: function() {
                cc.find("Canvas/UI_Start/speedPop").active = !1;
            },
            onClickEarningsPopBlank: function() {
                cc.find("Canvas/UI_Start/earningsPop").active = !1, void 0 != this.gameFailType && this.gameFailType;
            },
            onClickShare: function() {
                var e = Math.random() > .5 ? 0 : 1;
                wx.aldSendEvent("点击离线收益的多倍领取按钮", {
                    "页面": "离线收益界面"
                }), e ? WXI.createVideo(function() {
                    var e = m_data.earnings;
                    if (e > 0) {
                        if (m_data.coin += 3 * e, this.lb_coin.writeShoot(m_data.coin), WXI.setStorageSync("PLACESTAMP", new Date().getTime()), 
                        WXI.saveUserLocalData(), this.speedTime == i && WXI.setStorageSync("isSpeed", !1), 
                        0 != this.speedTime) {
                            var t = WXI.getStorageSync("SPEEDTOTAL");
                            t -= this.speedTime, WXI.setStorageSync("SPEEDTOTAL", t), WXI.setStorageSync("SPEEDTIME", 0);
                        }
                        var n = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                        n[1].over += 1, WXI.setStorageSync("GLORY", n);
                        var i = WXI.getStorageSync("SPEEDTOTAL");
                        this.countPlaceEarnings(), this.playAnimation_getEarnings(), this.onClickEarningsPopBlank();
                    }
                }.bind(this), null, "adunit-68b60853ed7ebe7b") : WXI.share3Seconds(function() {
                    var e = m_data.earnings;
                    if (e > 0) {
                        if (m_data.coin += 3 * e, this.lb_coin.writeShoot(m_data.coin), WXI.setStorageSync("PLACESTAMP", new Date().getTime()), 
                        WXI.saveUserLocalData(), this.speedTime == i && WXI.setStorageSync("isSpeed", !1), 
                        0 != this.speedTime) {
                            var t = WXI.getStorageSync("SPEEDTOTAL");
                            t -= this.speedTime, WXI.setStorageSync("SPEEDTOTAL", t), WXI.setStorageSync("SPEEDTIME", 0);
                        }
                        var n = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                        n[1].over += 1, WXI.setStorageSync("GLORY", n);
                        var i = WXI.getStorageSync("SPEEDTOTAL");
                        this.countPlaceEarnings(), this.playAnimation_getEarnings(), this.onClickEarningsPopBlank();
                    }
                }.bind(this), function() {
                    pop("分享失败");
                });
            },
            onClickRefuse: function() {
                wx.aldSendEvent("点击离线收益的单倍领取按钮", {
                    "页面": "离线收益界面"
                });
                var e = m_data.earnings;
                if (e > 0) {
                    if (m_data.coin += e, this.lb_coin.writeShoot(m_data.coin), WXI.setStorageSync("PLACESTAMP", new Date().getTime()), 
                    WXI.saveUserLocalData(), this.speedTime == n && WXI.setStorageSync("isSpeed", !1), 
                    0 != this.speedTime) {
                        var t = WXI.getStorageSync("SPEEDTOTAL");
                        t -= this.speedTime, WXI.setStorageSync("SPEEDTOTAL", t), WXI.setStorageSync("SPEEDTIME", 0);
                    }
                    var n = WXI.getStorageSync("SPEEDTOTAL");
                    this.countPlaceEarnings(), this.playAnimation_getEarnings(), this.onClickEarningsPopBlank();
                }
            },
            onClickGetEarnings: function() {
                var e = m_data.earnings;
                if (wx.aldSendEvent("点击离线收益的存钱罐按钮", {
                    "页面": "游戏开始界面"
                }), e > 0) if (e >= 500) {
                    var t = cc.find("Canvas/UI_Start/earningsPop");
                    t.getChildByName("btn_share").getChildByName("coin").getChildByName("label").writeShoot(3 * e), 
                    t.getChildByName("btn_refuse").getChildByName("coin").getChildByName("label").writeShoot(e), 
                    t.active = !0;
                } else {
                    if (m_data.coin += e, this.lb_coin.writeShoot(m_data.coin), WXI.setStorageSync("PLACESTAMP", new Date().getTime()), 
                    WXI.saveUserLocalData(), this.speedTime == i && WXI.setStorageSync("isSpeed", !1), 
                    0 != this.speedTime) {
                        var n = WXI.getStorageSync("SPEEDTOTAL");
                        n -= this.speedTime, WXI.setStorageSync("SPEEDTOTAL", n), WXI.setStorageSync("SPEEDTIME", 0);
                    }
                    var i = WXI.getStorageSync("SPEEDTOTAL");
                    this.countPlaceEarnings(), this.playAnimation_getEarnings();
                }
            },
            playCoinAnimation: function(e, t, n) {
                for (var i = cc.find("Canvas/pigCoinRoot"), o = Math.PI / 10, c = function() {
                    s = o * a;
                    var n = e.add(cc.v2(Math.cos(s), Math.sin(s)).mul(150)), c = cc.v2(between(n.x, t.x), between(n.y, t.y)), r = m_pool.getObject("pigCoin");
                    r.position = n, r.attachParent(i), r.runAction(cc.sequence(cc.delayTime(.2), cc.bezierTo(.8, [ n, c, t ]).easing(cc.easeSineInOut()), cc.callFunc(function() {
                        r && r.isValid && m_pool.pushObject(r);
                    })));
                }, a = 0; a < 20; a++) {
                    var s;
                    c();
                }
                n && this.scheduleOnce(n, 1);
            },
            playAnimation_getEarnings: function() {
                this.playCoinAnimation(cc.v2(290, 203), cc.v2(-330, cc.winSize.height / 2 - 90));
            },
            onClickSetting: function() {
                var e = cc.find("Canvas/UI_Start/settingPop"), t = e.active;
                e.active = !t, t && wx.aldSendEvent("点击设置按钮", {
                    "页面": "游戏开始界面"
                });
            },
            onClickVibrate: function() {
                var e = cc.find("Canvas/UI_Start/settingPop/btn_vibrate/line"), t = cc.find("Canvas/UI_Start/settingPop/btn_vibrate/box/gou");
                e.active ? (e.active = !1, t.active = !0, WXI.setStorageSync("VIBRATE", "1"), WXI.openVibrate()) : (e.active = !0, 
                t.active = !1, WXI.setStorageSync("VIBRATE", "0"), WXI.closeVibrate());
            },
            onClickSound: function() {
                var e = cc.find("Canvas/UI_Start/settingPop/btn_sound/line"), t = cc.find("Canvas/UI_Start/settingPop/btn_sound/box/gou");
                e.active ? (e.active = !1, t.active = !0, WXI.setStorageSync("SOUND", "1"), AMI.openEffect(), 
                AMI.openMusic()) : (e.active = !0, t.active = !1, WXI.setStorageSync("SOUND", "0"), 
                AMI.closeEffect(), AMI.closeMusic());
            },
            initCrossPromotionModule: function() {
                var e = cc.find("Canvas/UI_Start/MoveNode/btn_moreGames");
                e.active = !1;
                var t = cc.find("Canvas/UI_Start/moreGamesBoard/board");
                t.destroyAllChildren(), MCI.getADList_7thAv(function(n) {
                    var i = this;
                    if (n.length > 0) {
                        e.active = !0, cc.find("Canvas/UI_Start").active && e.bounceToX(-329), this.initDotaGameIcon();
                        this.picList = [];
                        for (var o = 0; o < this.picNumber; o++) this.picList[o] = o;
                        var c = [], a = 0;
                        if (cc.loader.loadRes("prefabs/gameIcon", cc.Prefab, function(e, i) {
                            n.forEach(function(n) {
                                if (!e) {
                                    var o = cc.instantiate(i), s = o.getComponent("GameIcon");
                                    o.scale = 1.3, s.getComponent("GameIcon").init(n);
                                    var r = o.getChildByName("sp");
                                    o.name = a + "", cc.loader.loadRes("icon/" + a, cc.SpriteFrame, function(e, t) {
                                        e || (r.getComponent(cc.Sprite).spriteFrame = t, o.getChildByName("lb_name").getComponent(cc.Label).string = n.title);
                                    }), c.push(a), a++, o.parent = t;
                                }
                            });
                        }), 0 != MCI.getGuessAD().length) {
                            var s = cc.find("Canvas/UI_Start/banner/ADbottom/board/view/content"), r = cc.find("Canvas/UI_Result/ADbottom/board/view/content"), d = MCI.getGuessAD();
                            this.gameListAll = d, this.picList2 = [];
                            for (var l = 0; l < d.length; l++) this.picList2[l] = l;
                            for (var h = function(e) {
                                var t = cc.instantiate(i.guessPrefab);
                                t.getChildByName("name").getComponent(cc.Label).string = d[e].title, t.name = e + "", 
                                cc.loader.loadRes("icon/" + e, function(e, n) {
                                    e || (t.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(n));
                                }), i.picList2[e] = -1;
                                var n = t.getComponent(cc.Button), o = new cc.Component.EventHandler();
                                o.target = i.node, o.component = "MainScene", o.handler = "onClickGuessGameIcon";
                                var c = {
                                    appId: d[e].appid,
                                    path: d[e].path,
                                    name: d[e].title,
                                    where: "首页",
                                    from: "轮播组件",
                                    node: t.name
                                };
                                o.customEventData = c, n.getComponent(cc.Button).clickEvents.push(o), s.addChild(t);
                            }, m = 0; m < d.length; m++) h(m);
                            var p = d.length;
                            p > 6 && (p = 6), this.picList3 = [];
                            for (var u = 0; u < d.length; u++) this.picList3[u] = u;
                            var v = function(e) {
                                var t = cc.instantiate(i.guessPrefab);
                                t.getChildByName("name").getComponent(cc.Label).string = d[e].title, t.name = e + "", 
                                cc.loader.loadRes("icon/" + e, function(e, n) {
                                    e || (t.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(n));
                                }), i.picList3[e] = -1;
                                var n = t.getComponent(cc.Button), o = new cc.Component.EventHandler();
                                o.target = i.node, o.component = "MainScene", o.handler = "onClickGuessGameIcon";
                                var c = {
                                    appId: d[e].appid,
                                    path: d[e].path,
                                    name: d[e].title,
                                    where: "尾页",
                                    from: "列表组件",
                                    node: t.name
                                };
                                o.customEventData = c, n.getComponent(cc.Button).clickEvents.push(o), r.addChild(t);
                            };
                            for (m = 0; m < p; m++) v(m);
                            var g = cc.find("Canvas/UI_Result/LRJumpNode");
                            this.picList4 = [];
                            for (var f = 0; f < d.length; f++) this.picList4[f] = f;
                            var _ = function(e) {
                                var t = g.children[e];
                                t.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0), cc.delayTime(1)))), 
                                t.getChildByName("name").getComponent(cc.Label).string = d[e].title, t.name = e + "", 
                                cc.loader.loadRes("icon/" + e, function(e, n) {
                                    e || (t.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(n));
                                }), i.picList4[e] = -1;
                                var n = t.getComponent(cc.Button), o = new cc.Component.EventHandler();
                                o.target = i.node, o.component = "MainScene", o.handler = "onClickGuessGameIcon";
                                var c = {
                                    appId: d[e].appid,
                                    path: d[e].path,
                                    name: d[e].title,
                                    where: "底页",
                                    from: "左右两边组件",
                                    node: t.name
                                };
                                o.customEventData = c, n.getComponent(cc.Button).clickEvents.push(o);
                            };
                            for (m = 0; m < 6; m++) _(m);
                            this.picList5 = [];
                            for (var S = 0; S < d.length; S++) this.picList5[S] = S;
                            var y = cc.find("Canvas/ADBG/view/content").children, b = function(e) {
                                var t = y[e];
                                t.name = e + "", cc.loader.loadRes("icon2/" + e, function(e, n) {
                                    e || (t.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(n));
                                }), i.picList5[e] = -1, t.getChildByName("title").getComponent(cc.Label).string = d[e].title;
                                var n = t.getComponent(cc.Button), o = new cc.Component.EventHandler();
                                o.target = i.node, o.component = "MainScene", o.handler = "onClickGuessGameIcon";
                                var c = {
                                    appId: d[e].appid,
                                    path: d[e].path,
                                    name: d[e].title,
                                    where: "全屏",
                                    from: "全屏组件",
                                    node: t.name
                                };
                                o.customEventData = c, n.getComponent(cc.Button).clickEvents.push(o);
                            };
                            for (m = 0; m < d.length; m++) b(m);
                        }
                    }
                }.bind(this));
            },
            initDotaGameIcon: function() {
                cc.loader.loadRes("prefabs/gameIcon", cc.Prefab, function(e, t) {
                    if (!e) {
                        var n = cc.instantiate(t);
                        n.removeComponent("GameIcon");
                        var i = n.addComponent("GameIconLoop");
                        n.position = cc.v2(1300, 421), n.parent = cc.find("Canvas/UI_Start"), i.getComponent("GameIconLoop").loop();
                    }
                }.bind(this));
            },
            onClickMoreGames: function() {
                var e = cc.find("Canvas/UI_Start/moreGamesBoard");
                if (!e.active) {
                    e.active = !0;
                    var t = e.getChildByName("board"), n = e.getChildByName("ChangeBtn");
                    t.x = -700, t.moveToX(-153), n.moveToX(-153);
                }
            },
            onClickMoreGamesBoard: function() {
                var e = cc.find("Canvas/UI_Start/moreGamesBoard"), t = e.getChildByName("board");
                t.getNumberOfRunningActions() > 0 || t.moveToX(-700, function() {
                    e.active = !1;
                });
            },
            onClickPlanes: function(e, t) {
                var n = "p" + t;
                this.tempF_freetrywinman = n;
                var i = m_data.collect, o = function() {
                    var e = this.plane;
                    if (e && e.isValid) {
                        var n = e.getChildByName("wingman1");
                        n && n.isValid && n.destroy();
                        var i = e.getChildByName("wingman2");
                        i && i.isValid && i.destroy();
                        var o = cc.instantiate(this.com_prefabNode["wingman" + t]);
                        o.name = "wingman1", o.position = cc.v2(-70, -70), o.parent = e, this.wingman1Frame = o.getComponent(cc.Sprite).spriteFrame;
                        var c = cc.instantiate(this.com_prefabNode["wingman" + t]);
                        c.name = "wingman2", c.position = cc.v2(70, -70), c.parent = e, this.wingman2Frame = c.getComponent(cc.Sprite).spriteFrame;
                    }
                }.bind(this), c = cc.find("Canvas/UI_Start/banner/mask_guide");
                c.active && (c.getChildByName("1").active && (c.active = !1));
                if (m_data.tempF == "p" + t) this._planeFreeTryVideoWatched ? (o(), this.onClickImproveEarnings(!1)) : (Math.random() > .5 ? 0 : 1) ? WXI.createVideo(function() {
                    o(), this.onClickImproveEarnings(!1), this._planeFreeTryVideoWatched = !0;
                }.bind(this), null, "adunit-41de1a55eea86cb4") : WXI.share3Seconds(function() {
                    o(), this.onClickImproveEarnings(!1), this._planeFreeTryVideoWatched = !0;
                }.bind(this), function() {
                    pop("分享失败");
                }); else if (void 0 != i[n]) i.f = n, WXI.saveUserLocalData(), this.onClickImproveEarnings(!1), 
                o(); else if (1 == t) pop("击败第2关解锁"); else {
                    var a = JMI.getWingmanData(n).lv;
                    pop("击败第" + a + "关解锁");
                }
            },
            initTempData: function() {
                m_data.coinRecord = 0, m_data.rebirthChance = 1;
            },
            onClickPlane: function(e) {
                if (this.plane && this.plane.isValid) {
                    if (this._gaming) return;
                    this._gaming = !0, this.CoinGotType = !1;
                    var t = Math.random();
                    if (t < .33 && null != this.successType && WXI.createInterAD(function() {
                        wx.aldSendEvent("关闭广告继续的玩家数");
                    }), m_data.tempF) if (this._planeFreeTryVideoWatched) {
                        var n = WXI.getStorageSync("TRYTIMES");
                        void 0 === n && "" === n ? n = 10 : n--, WXI.setStorageSync("TRYTIMES", n);
                    } else m_data.tempF = void 0;
                    if (m_data.energy < 5) return void this.energyNotEnough("今日体力不足!");
                    if (m_data.energy -= 5, WXI.setStorageSync("ENERGY", m_data.energy), this.initTempData(), 
                    EMI.dispatchEvent(m_define.eventType.initLevelGoal), this.hideUI_Const(), this.hideUI_Start(), 
                    WXI.hideBanner(), this.showBgLevel_gamePlay(), this.lb_coinRecord.write(m_data.coinRecord), 
                    this.showUI_GamePlay(), this.zoomOut(function() {
                        this.setTarget(this.plane);
                        var n = this.plane.getComponent("SelfPlaneControl");
                        n.init(), n.run(), this.scheduleOnce(function() {
                            this.attachFormation();
                        }.bind(this), 2), this.item_anime1ac = !0, this.item_anime2ac = !0, 1 == e && this.slowDownFunction(), 
                        t < .33 && null != this.successType && this.slowDownFunction(), this.unschedule(this.reloadEnemy), 
                        this.reloadEnemy = function() {
                            this.attachFormation();
                        }, this.schedule(this.reloadEnemy, 30);
                    }.bind(this)), m_data.level <= 7) {
                        var i = WXI.getStorageSync("FIRSTMAN");
                        "firstPlay" != i ? wx.aldSendEvent("开始游戏的留存玩家数") : wx.aldSendEvent("开始游戏的新增玩家数"), 
                        null != this.successType && (1 == this.successType ? "firstPlay" != i ? wx.aldSendEvent("过关再次开始人数的留存玩家数", {
                            "关卡": m_data.level - 1
                        }) : wx.aldSendEvent("过关再次开始人数的新增玩家数", {
                            "关卡": m_data.level - 1
                        }) : "firstPlay" != i ? wx.aldSendEvent("失败再次开始人数的留存玩家数", {
                            "关卡": m_data.level
                        }) : wx.aldSendEvent("失败再次开始人数的新增玩家数", {
                            "关卡": m_data.level
                        }));
                    }
                    if (m_data.level <= 20) {
                        var o = WXI.getStorageSync("STARTCOUNT");
                        if (null == o || void 0 == o || "" == o ? (WXI.setStorageSync("STARTCOUNT", m_data.level), 
                        wx.aldSendEvent("当前关卡累计开始次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("当前关卡累计开始人数", {
                            "关卡": m_data.level
                        })) : o < m_data.level ? (WXI.setStorageSync("STARTCOUNT", m_data.level), wx.aldSendEvent("当前关卡累计开始次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("当前关卡累计开始人数", {
                            "关卡": m_data.level
                        })) : wx.aldSendEvent("当前关卡累计开始次数", {
                            "关卡": m_data.level
                        }), null != this.successType) if (1 == this.successType) wx.aldSendEvent("当前关卡过关再次开始人数的累计人数", {
                            "关卡": m_data.level - 1
                        }), wx.aldSendEvent("当前关卡过关再次开始人数的累计次数", {
                            "关卡": m_data.level - 1
                        }); else {
                            var c = WXI.getStorageSync("AGAINCOUNT");
                            null == c || void 0 == c || "" == c ? (WXI.setStorageSync("AGAINCOUNT", m_data.level), 
                            wx.aldSendEvent("当前关卡失败再次开始人数的累计次数", {
                                "关卡": m_data.level
                            }), wx.aldSendEvent("当前关卡失败再次开始人数的累计人数", {
                                "关卡": m_data.level
                            })) : c < m_data.level ? (WXI.setStorageSync("AGAINCOUNT", m_data.level), wx.aldSendEvent("当前关卡失败再次开始人数的累计次数", {
                                "关卡": m_data.level
                            }), wx.aldSendEvent("当前关卡失败再次开始人数的累计人数", {
                                "关卡": m_data.level
                            })) : wx.aldSendEvent("当前关卡失败再次开始人数的累计次数", {
                                "关卡": m_data.level
                            });
                        }
                    }
                }
            },
            onClickImprovePlane: function(e) {
                0 == this.bannerNumber && e ? (this.hideBanner(), this.bannerNumber = -1) : this.showBanner(0);
                var t = cc.find("Canvas/UI_Start/banner/mask_fire");
                1 == t.active && (t.getChildByName("btn_powerUp").active = !1, t.getChildByName("btn_addSpeed").active = !0), 
                cc.find("Canvas/UI_Start/banner/selfPlanes").active = !1;
                var n = m_data.plane, i = n.s, o = n.p, c = JMI.getPowerData(), a = cc.color(92, 194, 243);
                this.lb_key1.color = a, this.lb_key2.color = a, this.lb_value1.color = a, this.lb_value2.color = a, 
                this.lb_key1.write("火力(Lv" + (o + 1) + ")"), this.lb_key2.write("强度(Lv" + (i + 1) + ")"), 
                this.lb_value1.write(c.p.safeGet(o).num), this.lb_value2.write(c.s.safeGet(i).num);
                var s = c.p.safeGet(o + 1).cost, r = c.s.safeGet(i + 1).cost;
                m_data.coin < s ? (this.lb_cost1.color = cc.color(255, 56, 56), this.lb_cost1.getComponent(cc.LabelOutline).color = cc.color(0, 0, 0), 
                cc.find("Canvas/UI_Start/banner/banner2/btn_addSpeed/vedio").active = !0) : (this.lb_cost1.color = cc.color(255, 239, 239), 
                this.lb_cost1.getComponent(cc.LabelOutline).color = cc.color(210, 50, 0), cc.find("Canvas/UI_Start/banner/banner2/btn_addSpeed/vedio").active = !1), 
                m_data.coin < r ? (this.lb_cost2.color = cc.color(255, 56, 56), this.lb_cost2.getComponent(cc.LabelOutline).color = cc.color(0, 0, 0), 
                cc.find("Canvas/UI_Start/banner/banner1/btn_addAmmo/vedio").active = !0) : (this.lb_cost2.color = cc.color(255, 239, 239), 
                this.lb_cost2.getComponent(cc.LabelOutline).color = cc.color(210, 50, 0), cc.find("Canvas/UI_Start/banner/banner1/btn_addAmmo/vedio").active = !1), 
                this.lb_cost1.writeShoot(s), this.lb_cost2.writeShoot(r), this.updateArrows();
            },
            updateArrows: function() {
                var e = !1, t = m_data.plane, n = t.s, i = t.p, o = JMI.getPowerData(), c = o.p.safeGet(i + 1).cost, a = o.s.safeGet(n + 1).cost;
                (m_data.coin >= c || m_data.coin >= a) && (e = !0), this.arrow1.active = e, this.arrow1.stopAllActions(), 
                this.arrow1.y = 42, e && this.arrow1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.4, cc.v2(0, 10)), cc.moveBy(.1, cc.v2(0, -10)), cc.delayTime(.5))));
                var s = m_data.collect, r = s.f, d = s[r], l = !1;
                if (void 0 != d) {
                    var h = d.s, m = d.p, p = JMI.getWingmanData(r), u = p.s, v = p.p, g = u.safeGet(h + 1).cost, f = v.safeGet(m + 1).cost;
                    (m_data.coin >= g || m_data.coin >= f) && (l = !0);
                }
                this.arrow2.active = l, this.arrow2.stopAllActions(), this.arrow2.y = 42, l && this.arrow2.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.4, cc.v2(0, 10)), cc.moveBy(.1, cc.v2(0, -10)), cc.delayTime(.5))));
            },
            hideBanner: function() {
                var e = cc.find("Canvas/UI_Start/banner"), t = e.getChildByName("banner1"), n = e.getChildByName("banner2"), i = e.getChildByName("selfPlanes");
                this.onClickMoveNode(0), t.active = !1, n.active = !1, i.active = !1;
            },
            showBtnPop: function(e) {
                var t = cc.find("Canvas/UI_Start/banner/btn_earningsUp/pop");
                switch (t.stopAllActions(), e) {
                  default:
                    t.active = !1;
                    break;

                  case "newWingman":
                    t.getChildByName("label").write("新僚机解锁"), t.active = !0, t.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.4, cc.v2(0, 10)), cc.moveBy(.1, cc.v2(0, -10)), cc.delayTime(.5))));
                    break;

                  case "freeTry":
                    t.getChildByName("label").write("满级试用"), t.active = !0, t.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.4, cc.v2(0, 10)), cc.moveBy(.1, cc.v2(0, -10)), cc.delayTime(.5))));
                }
            },
            showBanner: function(e) {
                var t = cc.find("Canvas/UI_Start/banner"), n = t.getChildByName("banner1"), i = t.getChildByName("banner2");
                this.onClickMoveNode(1), 1 == e ? (n.changeSp(this.bannerTextures[1]), i.changeSp(this.bannerTextures[1]), 
                this.bannerNumber = 1) : (n.changeSp(this.bannerTextures[0]), i.changeSp(this.bannerTextures[0]), 
                this.bannerNumber = 0), n.active = !0, i.active = !0;
                var o = this.plane;
                o && o.isValid && o.getNumberOfRunningActions() < 1 && o.runAction(cc.moveTo(.1, cc.v2(0, 0)));
            },
            onClickImproveEarnings: function(e, t) {
                var n = cc.find("Canvas/UI_Start/banner/selfPlanes");
                if (!t) {
                    var i = cc.find("Canvas/UI_Start/banner/btn_earningsUp/pop");
                    i.active && (i.stopAllActions(), i.active = !1);
                    var o = cc.find("Canvas/UI_Start/banner/mask_guide");
                    o.active && (o.zIndex = 99, o.getChildByName("1").active = !0);
                }
                n.active = !0, 1 == this.bannerNumber && e ? (this.hideBanner(), this.bannerNumber = -1) : this.showBanner(1);
                var c = m_data.collect, a = c.f, s = c[a], r = a.replace("p", ""), d = m_data.tempF ? m_data.tempF.replace("p", "") : "";
                if (n.children.forEach(function(e) {
                    var t = e.getChildByName("bg");
                    e.name == r && s || e.name == d ? t.changeSp(this.bgPlaneTextures[1]) : t.changeSp(this.bgPlaneTextures[0]);
                }.bind(this)), void 0 != s) {
                    var l = s.s, h = s.p, m = (_ = JMI.getWingmanData(a)).s, p = _.p, u = cc.color(252, 72, 37);
                    this.lb_key1.color = u, this.lb_key2.color = u, this.lb_value1.color = u, this.lb_value2.color = u, 
                    this.lb_key1.write("火力(Lv" + (h + 1) + ")"), this.lb_key2.write("强度(Lv" + (l + 1) + ")"), 
                    this.lb_value1.write(p.safeGet(h).num), this.lb_value2.write(m.safeGet(l).num);
                    var v = p.safeGet(h + 1).cost, g = m.safeGet(l + 1).cost, f = !1;
                    m_data.coin < v ? (this.lb_cost1.color = cc.color(255, 56, 56), this.lb_cost1.getComponent(cc.LabelOutline).color = cc.color(0, 0, 0), 
                    cc.find("Canvas/UI_Start/banner/banner2/btn_addSpeed/vedio").active = !0) : (f = !0, 
                    this.lb_cost1.color = cc.color(255, 239, 239), this.lb_cost1.getComponent(cc.LabelOutline).color = cc.color(210, 50, 0), 
                    cc.find("Canvas/UI_Start/banner/banner2/btn_addSpeed/vedio").active = !1), m_data.coin < g ? (this.lb_cost2.color = cc.color(255, 56, 56), 
                    this.lb_cost2.getComponent(cc.LabelOutline).color = cc.color(0, 0, 0), cc.find("Canvas/UI_Start/banner/banner1/btn_addAmmo/vedio").active = !0) : (f = !0, 
                    this.lb_cost2.color = cc.color(255, 239, 239), this.lb_cost2.getComponent(cc.LabelOutline).color = cc.color(210, 50, 0), 
                    cc.find("Canvas/UI_Start/banner/banner1/btn_addAmmo/vedio").active = !1), this.arrow2.active = f, 
                    this.lb_cost1.writeShoot(v), this.lb_cost2.writeShoot(g);
                } else {
                    l = 0, h = 0;
                    var _;
                    m = (_ = JMI.getWingmanData(a)).s, p = _.p, u = cc.color(252, 72, 37);
                    this.lb_key1.color = u, this.lb_key2.color = u, this.lb_value1.color = u, this.lb_value2.color = u, 
                    this.lb_key1.write("火力(Lv" + (h + 1) + ")"), this.lb_key2.write("强度(Lv" + (l + 1) + ")"), 
                    this.lb_value1.write(p.safeGet(h).num), this.lb_value2.write(m.safeGet(l).num);
                    v = p.safeGet(h + 1).cost, g = m.safeGet(l + 1).cost, f = !1;
                    m_data.coin < v ? (this.lb_cost1.color = cc.color(255, 56, 56), this.lb_cost1.getComponent(cc.LabelOutline).color = cc.color(0, 0, 0)) : (f = !0, 
                    this.lb_cost1.color = cc.color(255, 239, 239), this.lb_cost1.getComponent(cc.LabelOutline).color = cc.color(210, 50, 0)), 
                    m_data.coin < g ? (this.lb_cost2.color = cc.color(255, 56, 56), this.lb_cost2.getComponent(cc.LabelOutline).color = cc.color(0, 0, 0)) : (f = !0, 
                    this.lb_cost2.color = cc.color(255, 239, 239), this.lb_cost2.getComponent(cc.LabelOutline).color = cc.color(210, 50, 0)), 
                    this.arrow2.active = f, this.lb_cost1.writeShoot(v), this.lb_cost2.writeShoot(g);
                }
                this.updateArrows();
            },
            onClickCost2: function() {
                if (cc.find("Canvas/UI_Start/banner/selfPlanes").active) {
                    var e = m_data.collect, t = e.f, n = e[t];
                    if (void 0 != n) {
                        var i = n.s, o = (s = JMI.getWingmanData(t)).s;
                        if (i < 0) i = 0; else if (i > o.length - 1) return i = o.length - 1, void pop("已达到最高等级!");
                        var c = o.safeGet(i + 1).cost;
                        if (m_data.coin >= c) {
                            m_data.coin -= c, pop("升级成功!"), m_data.collect[t].s = i + 1, WXI.saveUserLocalData(), 
                            this.lb_coin.writeShoot(m_data.coin), this.onClickImproveEarnings(!1);
                            var a = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                            switch (t.split("")[1]) {
                              case "1":
                                a[12].over += 1;
                                break;

                              case "2":
                                a[13].over += 1;
                                break;

                              case "3":
                                a[14].over += 1;
                                break;

                              case "4":
                                a[15].over += 1;
                                break;

                              case "5":
                                a[16].over += 1;
                            }
                            WXI.setStorageSync("GLORY", a);
                        } else this.coinNotEnough("金币不足!", c);
                    } else pop("战机未解锁");
                } else {
                    i = m_data.plane.s;
                    var s = JMI.getPowerData().s;
                    if (i < 0) i = 0; else if (i > s.length - 1) return i = s.length - 1, void pop("已达到最高等级!");
                    c = s.safeGet(i + 1).cost;
                    if (m_data.coin >= c) m_data.coin -= c, pop("升级成功!"), m_data.plane.s = i + 1, WXI.saveUserLocalData(), 
                    this.lb_coin.writeShoot(m_data.coin), this.onClickImprovePlane(!1), (a = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson)[2].over += 1, 
                    WXI.setStorageSync("GLORY", a); else this.coinNotEnough("金币不足!", c);
                }
            },
            onClickCost1: function() {
                var e = cc.find("Canvas/UI_Start/banner/mask_fire");
                if (1 == e.active && (e.active = !1, wx.setStorageSync("MASKFIRE", !1)), cc.find("Canvas/UI_Start/banner/selfPlanes").active) {
                    var t = m_data.collect, n = t.f, i = t[n];
                    if (void 0 != i) {
                        var o = i.p, c = (r = JMI.getWingmanData(n)).p;
                        if (o < 0) o = 0; else if (o > c.length - 1) return o = c.length - 1, void pop("已达到最高等级!");
                        var a = c.safeGet(o + 1).cost;
                        if (m_data.coin >= a) {
                            m_data.coin -= a, pop("升级成功!"), m_data.collect[n].p = o + 1, WXI.saveUserLocalData(), 
                            this.lb_coin.writeShoot(m_data.coin), this.onClickImproveEarnings(!1);
                            var s = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                            switch (n.split("")[1]) {
                              case "1":
                                s[7].over += 1;
                                break;

                              case "2":
                                s[8].over += 1;
                                break;

                              case "3":
                                s[9].over += 1;
                                break;

                              case "4":
                                s[10].over += 1;
                                break;

                              case "5":
                                s[11].over += 1;
                            }
                            WXI.setStorageSync("GLORY", s);
                        } else this.coinNotEnough("金币不足!", a);
                    } else pop("战机未解锁");
                } else {
                    o = m_data.plane.p;
                    var r = JMI.getPowerData().p;
                    if (o < 0) o = 0; else if (o > r.length - 1) return o = r.length - 1, void pop("已达到最高等级!");
                    a = r.safeGet(o + 1).cost;
                    if (m_data.coin >= a) m_data.coin -= a, pop("升级成功!"), m_data.plane.p = o + 1, WXI.saveUserLocalData(), 
                    this.lb_coin.writeShoot(m_data.coin), this.onClickImprovePlane(!1), (s = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson)[3].over += 1, 
                    WXI.setStorageSync("GLORY", s); else this.coinNotEnough("金币不足!", a);
                }
            },
            energyNotEnough: function(e) {
                (Math.random() > .5 ? 0 : 1) ? WXI.createVideo(function() {
                    m_data.energy += 10, this.lb_energy.write(m_data.energy), WXI.saveUserLocalData();
                }.bind(this)) : WXI.share3Seconds(function() {
                    m_data.energy += 10, this.lb_energy.write(m_data.energy), WXI.saveUserLocalData();
                }.bind(this), function() {
                    pop("分享失败");
                });
            },
            coinNotEnough: function(e, t) {
                var n = WXI.getStorageSync("FREETIMEDAY"), i = new Date().toDateString();
                void 0 != n && void 0 != n && n == i || (WXI.setStorageSync("FREETIMEDAY", i), WXI.setStorageSync("FREETIME", 10));
                var o = WXI.getStorageSync("FREETIME");
                (void 0 !== o && "" !== o || (o = 10), o <= 0) ? pop(e) : (Math.random() > .5 ? 0 : 1) ? WXI.createVideo(function() {
                    o--, m_data.coin += t >= 0 ? t : 0, this.lb_coin.writeShoot(m_data.coin), WXI.saveUserLocalData(), 
                    WXI.setStorageSync("FREETIME", o), this.playCoinAnimation(cc.v2(0, 0), cc.v2(-330, cc.winSize.height / 2 - 90));
                }.bind(this), null, "adunit-aa8d8b2d21c39e6b") : WXI.share3Seconds(function() {
                    o--, m_data.coin += t >= 0 ? t : 0, this.lb_coin.writeShoot(m_data.coin), WXI.saveUserLocalData(), 
                    WXI.setStorageSync("FREETIME", o), this.playCoinAnimation(cc.v2(0, 0), cc.v2(-330, cc.winSize.height / 2 - 90));
                }.bind(this), function() {
                    pop("分享失败");
                });
            },
            onClickGetReward: function() {
                this._rewardGetting || (this._rewardGetting = !0, cc.find("Canvas/pigCoinRoot").active = !0, 
                this.CoinGotType || this.playCoinAnimation(cc.v2(0, 139), cc.v2(-330, cc.winSize.height / 2 - 90), function() {
                    var e = m_data.coin + m_data.coinRecord;
                    this.addCoinStepByStep = function() {
                        m_data.coin += e > 1e5 ? 1e4 : 1e3, m_data.coin += 1e3, this.lb_coin.writeShoot(m_data.coin), 
                        m_data.coin > e && (m_data.coinRecord = 0, m_data.coin = e, this.lb_coin.writeShoot(m_data.coin), 
                        WXI.saveUserLocalData(), this._rewardGetting = !1, this.unschedule(this.addCoinStepByStep));
                    }, this.schedule(this.addCoinStepByStep, .02);
                }.bind(this)), this.CoinGotType = !0, EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail));
            },
            onClickTurnTable: function() {
                (Math.random() > .5 ? 0 : 1) ? WXI.createVideo(function() {
                    var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                    e[22].over += 1, WXI.setStorageSync("GLORY", e), cc.loader.loadRes("prefabs/roulette", cc.Prefab, function(e, t) {
                        if (!e) {
                            var n = this.node.getChildByName("roulette");
                            if (n && n.isValid) return;
                            (n = cc.instantiate(t)).position = cc.v2(0, 0), n.parent = this.node;
                        }
                    }.bind(this));
                }.bind(this), null, "adunit-0d5ad47cb4c138c7") : WXI.share3Seconds(function() {
                    var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                    e[22].over += 1, WXI.setStorageSync("GLORY", e), cc.loader.loadRes("prefabs/roulette", cc.Prefab, function(e, t) {
                        if (!e) {
                            var n = this.node.getChildByName("roulette");
                            if (n && n.isValid) return;
                            (n = cc.instantiate(t)).position = cc.v2(0, 0), n.parent = this.node;
                        }
                    }.bind(this));
                }.bind(this), function() {
                    pop("分享失败");
                });
            },
            zoomIn: function(e) {
                var t = this.camera.getComponent(cc.Camera);
                t.zoomRatio = 1, this.m_schedule(function() {
                    t.zoomRatio = cc.misc.clampf(t.zoomRatio + .01, 1, 1.2);
                }, .02, 20, function() {
                    t.zoomRatio = 1.2, e && e();
                }.bind(this));
            },
            zoomOut: function(e) {
                var t = this.camera.getComponent(cc.Camera);
                t.zoomRatio = 1.2, this.m_schedule(function() {
                    t.zoomRatio = cc.misc.clampf(t.zoomRatio - .01, 1, 1.2);
                }, .02, 20, function() {
                    t.zoomRatio = 1, e && e();
                }.bind(this));
            },
            showUI_Const: function() {
                this.lb_energy.write(m_data.energy);
                var e = this.node.getChildByName("UI_Const"), t = e.getChildByName("coin"), n = e.getChildByName("energy"), i = e.getChildByName("diamond");
                n.getChildByName("plus").active = MCI.getAdWall();
                t.y = 1e3, n.y = 1e3, i.y = 1e3, e.active = !0;
                var o = cc.winSize.height / 2 - 90;
                t.bounceToY(o), n.bounceToY(o), i.bounceToY(o);
            },
            hideUI_Const: function() {
                var e = this.node.getChildByName("UI_Const"), t = e.getChildByName("coin"), n = e.getChildByName("energy"), i = e.getChildByName("diamond");
                t.moveToY(1e3), n.moveToY(1e3), i.moveToY(1e3, function() {
                    e.active = !1;
                });
            },
            showUI_GamePlay: function() {
                var e = this.node.getChildByName("UI_GamePlay");
                e.getChildByName("bg_medal").y = cc.winSize.height / 2 - 150, this.scheduleOnce(function() {
                    var e = cc.find("Canvas/item_anime1"), t = cc.find("Canvas/item_anime2");
                    e.active = !0, t.active = !0;
                    var n = e.getComponent("SelectItem"), i = t.getComponent("SelectItem");
                    n.resetFrame(), i.setSecondItemNumber(n.getItemNumber()), i.resetFrame();
                }, 1);
                var t = cc.find("Canvas/UI_GamePlay/itemRoot");
                t.children.forEach(function(e) {
                    var t = e.getComponent("Shoot");
                    t && t.unscheduleAllCallbacks(), e.removeFromParent(), m_pool.pushObject(e);
                }), t.active = !0, e.active = !0, this._allowSlowDown = !0;
            },
            hideUI_GamePlay: function() {
                this.node.getChildByName("UI_GamePlay").active = !1;
                var e = cc.find("Canvas/item_anime1"), t = cc.find("Canvas/item_anime2");
                e.active = !1, t.active = !1;
            },
            showUI_Start: function() {
                var e = this.node.getChildByName("UI_Start"), t = e.getChildByName("banner"), n = e.getChildByName("MoveNode"), i = e.getChildByName("toolBar").getChildByName("board"), o = e.getChildByName("logo"), c = n.getChildByName("earnings"), a = n.getChildByName("btn_moreGames"), s = e.getChildByName("word"), r = (i.getChildByName("btn_rank"), 
                i.getChildByName("btn_signIn"), i.getChildByName("btn_setting"), i.getChildByName("btn_invite"), 
                n.getChildByName("btn_gemini"));
                r.active = MCI.getAdWall(), WXI.showBanner(), o.y = 1e3, c.x = 1e3, a.active = MCI.getAdWall(), 
                a.x = -1e3, a.runAction(cc.moveTo(1, cc.v2(100, 100))), s.y = 1e3, t.y = -800, r.x = -1e3, 
                e.active = !0, o.bounceToY(400), c.bounceToX(290), r.bounceToX(320, function() {
                    r.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(.1, 10), cc.rotateTo(.2, -10), cc.rotateTo(.1, 0), cc.delayTime(1))));
                }), a.bounceToX(-329), s.bounceToY(144, function() {
                    s.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(.3, 0), cc.fadeTo(.3, 255))));
                });
                var d = t.getChildByName("ADbottom");
                if (MCI.getAdWall() && 0 != MCI.getGuessAD().length) {
                    t.bounceToY(-cc.winSize.height / 2 + 370), d.active = !0;
                    var l = d.getChildByName("board").getChildByName("view").getChildByName("content"), h = l.childrenCount - 6, m = -30;
                    h > 0 && (this.ADbottomMoveTrunAround = function() {
                        l.position.x < -125 * h - 376 ? m = 30 : l.position.x > -376 && (m = -30);
                        var e = cc.v2(l.position.x + .02 * m, l.position.y);
                        l.setPosition(e);
                    }, this.schedule(this.ADbottomMoveTrunAround, .02));
                } else t.bounceToY(-cc.winSize.height / 2 + 220), d.active = !1;
                var p = cc.find("Canvas/pigCoinRoot");
                p.active = !0, p.children.forEach(function(e) {
                    e.active = !1;
                });
            },
            hideUI_Start: function() {
                var e = this.node.getChildByName("UI_Start"), t = e.getChildByName("banner"), n = e.getChildByName("MoveNode"), i = e.getChildByName("toolBar").getChildByName("board"), o = e.getChildByName("logo"), c = n.getChildByName("earnings"), a = n.getChildByName("btn_moreGames"), s = e.getChildByName("word"), r = n.getChildByName("btn_gemini");
                i.getChildByName("btn_rank"), i.getChildByName("btn_signIn"), i.getChildByName("btn_setting"), 
                i.getChildByName("btn_invite");
                r.active = !0, o.moveToY(1e3), c.moveToX(1e3), a.moveToX(-1e3), s.moveToY(1e3), 
                t.moveToY(-1e3, function() {
                    e.active = !1;
                }), r.moveToX(-1e3);
                var d = cc.find("Canvas/pigCoinRoot");
                d.active = !1, d.children.forEach(function(e) {
                    e.active = !1;
                });
            },
            showUI_Result_success: function() {
                var e = this.node.getChildByName("UI_Result"), t = e.getChildByName("success"), n = e.getChildByName("fail"), i = e.getChildByName("after");
                MCI.getAdWall() && 0 != MCI.getGuessAD().length ? (e.getChildByName("ADbottom").active = !0, 
                e.getChildByName("LRJumpNode").active = !0) : (e.getChildByName("ADbottom").active = !1, 
                e.getChildByName("LRJumpNode").active = !1);
                cc.winSize.width;
                t.active = !0, n.active = !1, i.active = !1, e.active = !0;
                var o = 0;
                if (this.addCoinFunBig = function() {
                    o += 500, this.lb_coinReward.write("+" + o), o > m_data.coinRecord && (this.lb_coinReward.write("+" + m_data.coinRecord), 
                    this.unschedule(this.addCoinFunBig));
                }, this.schedule(this.addCoinFunBig, .02), t.bounceToX(0), this._allowSlowDown = !1, 
                this.mask.stopAllActions(), this.mask.runAction(cc.fadeTo(.1, 255)), c = 1, cc.director.getScheduler().setTimeScale(1), 
                this.gameFailType = !1, 1 == cc.find("Canvas/UI_Result/ADbottom").active) for (var a = 0; a < this.gameListAll.length; a++) wx.aldSendEvent("曝光游戏", {
                    "页面": "游戏胜利页面",
                    appid: this.gameListAll[a].appId
                });
            },
            showUI_Result_fail: function() {
                var e = this.node.getChildByName("UI_Result"), t = e.getChildByName("success"), n = e.getChildByName("fail"), i = e.getChildByName("after"), o = cc.find("Canvas/UI_Result/ADbottom");
                o.active = !1, n.getChildByName("btn_ignoreShare").active = !1, MCI.getAdWall() && 0 != MCI.getGuessAD().length ? e.getChildByName("LRJumpNode").active = !0 : e.getChildByName("LRJumpNode").active = !1;
                cc.winSize.width;
                t.active = !1, n.active = !0, i.active = !1, e.active = !0, n.bounceToX(0), this.mask.stopAllActions(), 
                this.mask.runAction(cc.fadeTo(.1, 255)), c = 1, cc.director.getScheduler().setTimeScale(1);
                var a = n.getChildByName("clock").getChildByName("lb_second").getComponent(cc.Label), s = 10;
                if (a.string = s + "s", this.ClockFunc = function() {
                    s -= 1, a.string = s + "s", 7 == s && (n.getChildByName("btn_ignoreShare").active = !0), 
                    0 == s && (m_data.coin += m_data.coinRecord, WXI.saveUserLocalData(), m_data.coinRecord > 0 ? (pop("你赚到了" + m_data.coinRecord + "金币"), 
                    EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                        showCoinAni: !0,
                        planeFreeTry: !0,
                        type: "fail"
                    })) : EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                        planeFreeTry: !0,
                        type: "fail"
                    }), this.unschedule(this.ClockFunc));
                }, this.schedule(this.ClockFunc, 1), this._allowSlowDown = !1, this.gameFailType = !0, 
                1 == o.active) for (var r = 0; r < 6; r++) wx.aldSendEvent("曝光游戏", {
                    "页面": "游戏失败页面",
                    appid: this.gameListAll[r].appId
                });
            },
            hideUI_Result: function() {
                this.mask.stopAllActions(), this.mask.runAction(cc.fadeTo(.1, 0)), c = 1, cc.director.getScheduler().setTimeScale(1), 
                this._allowSlowDown = !1;
                var e = this.node.getChildByName("UI_Result"), t = e.getChildByName("success"), n = e.getChildByName("fail"), i = cc.find("Canvas/ChestGame"), o = e.getChildByName("after"), a = -cc.winSize.width / 2 - 300;
                i.active = !1, o.action = !1, t.x = 0, n.x = 0, t.active ? t.moveToX(a, function() {
                    e.active = !1;
                }) : n.active ? n.moveToX(a, function() {
                    e.active = !1;
                }) : e.active = !1, WXI.hideBanner();
            },
            attachFormation: function(e) {
                var t, n = cc.winSize.width / 2, i = cc.winSize.height / 2, o = [ "D0", "D1", "D2", "D3", "D4" ].sort(function() {
                    return Math.random() < .5 ? -1 : 1;
                }), c = o[0], a = o[1], s = (o[2], o[3], [ m_define.shootLogicType.shootStraight, m_define.shootLogicType.shootStraightTrack, m_define.shootLogicType.shootPGM, m_define.shootLogicType.shootFissure ].sort(function() {
                    return Math.random() < .5;
                })), r = s[0], d = s[1];
                s[2];
                function l(e, t) {
                    t = t || {};
                    for (var n = [], i = 0; i < e; i++) n.push(cc.instantiate(t));
                    return n;
                }
                function h(e) {
                    EMI.dispatchEvent(m_define.eventType.attachFormation, e);
                }
                var m = (m_data.level + 1) % 5;
                switch (e = 1 + Math.floor(17 * Math.random()), m) {
                  case 0:
                    for (c = (p = [ "D0", "D1", "D4" ].sort(function() {
                        return Math.random() < .5 ? -1 : 1;
                    }))[0], a = p[1]; e > 9 && e < 13; ) e = 1 + Math.floor(17 * Math.random());
                    break;

                  case 1:
                    a = "D2" == (c = Math.random() > .5 ? "D2" : "D6") ? "D6" : "D2";
                    break;

                  case 2:
                    c = (p = [ "D2", "D3", "D6" ].sort(function() {
                        return Math.random() < .5 ? -1 : 1;
                    }))[0], a = p[1];
                    break;

                  case 3:
                    c = (p = [ "D0", "D3", "D6" ].sort(function() {
                        return Math.random() < .5 ? -1 : 1;
                    }))[0], a = p[1];
                    break;

                  case 4:
                    var p;
                    for (c = (p = [ "D0", "D1", "D3" ].sort(function() {
                        return Math.random() < .5 ? -1 : 1;
                    }))[0], a = p[1]; e > 9 && e < 13; ) e = 1 + Math.floor(17 * Math.random());
                }
                switch (e) {
                  default:
                  case 1:
                    (t = l(2, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n / 3, i + 200), t[0].action = cc.moveTo(2, cc.v2(-n / 3, i / 2)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(n / 3, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(n / 3, i / 2)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenRightTop, 
                    this.dealEnemyList(t), h(this.extantEnemy + 2);
                    break;

                  case 2:
                    (t = l(3, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n / 3, i + 200), t[0].action = cc.moveTo(2, cc.v2(-n / 3, i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(n / 3, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(n / 3, i / 3)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenRightTop, 
                    t[2].code = Math.random() < .5 ? c : a, t[2].position = cc.v2(0, i + 200), t[2].action = cc.moveTo(2, cc.v2(0, i / 6)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenTop, Math.random() < .5 && (t[2].shootLogic = d), 
                    this.dealEnemyList(t), h(this.extantEnemy + 3);
                    break;

                  case 3:
                    (t = l(3, {
                        code: c,
                        shootLogic: r
                    }))[0].code = Math.random() < .5 ? c : a, t[0].position = cc.v2(0, i + 200), t[0].action = cc.moveTo(2, cc.v2(0, i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenTop, Math.random() < .5 && (t[0].shootLogic = d), 
                    t[1].position = cc.v2(-n / 3, i + 200), t[1].action = cc.moveTo(2, cc.v2(-n / 3, i / 6)).easing(cc.easeSineInOut()), 
                    t[1].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[2].position = cc.v2(n / 3, i + 200), 
                    t[2].action = cc.moveTo(2, cc.v2(n / 3, i / 6)).easing(cc.easeSineInOut()), t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, 
                    this.dealEnemyList(t), h(this.extantEnemy + 3);
                    break;

                  case 4:
                    (t = l(3, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n / 2, i + 200), t[0].action = cc.moveTo(2, cc.v2(-n / 2, i / 2)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].code = Math.random() < .5 ? c : a, 
                    t[1].position = cc.v2(0, i + 200), t[1].action = cc.moveTo(2, cc.v2(0, i / 2)).easing(cc.easeSineInOut()), 
                    t[1].moveLogic = m_define.moveLogicType.topScreenTop, Math.random() < .5 && (t[1].shootLogic = d), 
                    t[2].position = cc.v2(n / 2, i + 200), t[2].action = cc.moveTo(2, cc.v2(n / 2, i / 2)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, this.dealEnemyList(t), 
                    h(this.extantEnemy + 3);
                    break;

                  case 5:
                    (t = l(4, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-3 * n / 5, i + 200), t[0].action = cc.moveTo(2, cc.v2(-3 * n / 5, i / 2)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(-n / 5, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(-n / 5, i / 2)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenLeftTop, 
                    t[2].position = cc.v2(n / 5, i + 200), t[2].action = cc.moveTo(2, cc.v2(n / 5, i / 2)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, t[3].position = cc.v2(3 * n / 5, i + 200), 
                    t[3].action = cc.moveTo(2, cc.v2(3 * n / 5, i / 2)).easing(cc.easeSineInOut()), 
                    t[3].moveLogic = m_define.moveLogicType.topScreenRightTop, this.dealEnemyList(t), 
                    h(this.extantEnemy + 4);
                    break;

                  case 6:
                    (t = l(4, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n / 2, i + 200), t[0].action = cc.moveTo(2, cc.v2(-n / 2, i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].code = Math.random() < .5 ? c : a, 
                    t[1].position = cc.v2(0, i + 200), t[1].action = cc.moveTo(2, cc.v2(0, i / 3)).easing(cc.easeSineInOut()), 
                    t[1].moveLogic = m_define.moveLogicType.topScreenTop, t[2].position = cc.v2(n / 2, i + 200), 
                    t[2].action = cc.moveTo(2, cc.v2(n / 2, i / 3)).easing(cc.easeSineInOut()), t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, 
                    t[3].code = Math.random() < .5 ? c : a, t[3].position = cc.v2(0, i + 200), t[3].action = cc.moveTo(2, cc.v2(0, i / 6)).easing(cc.easeSineInOut()), 
                    t[3].moveLogic = m_define.moveLogicType.topScreenBottom, Math.random() < .5 && (t[3].shootLogic = d), 
                    this.dealEnemyList(t), h(this.extantEnemy + 4);
                    break;

                  case 7:
                    (t = l(4, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n / 3, i + 200), t[0].action = cc.moveTo(2, cc.v2(-n / 3, i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(n / 3, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(n / 3, i / 3)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenRightTop, 
                    t[2].position = cc.v2(-n / 3, i + 200), t[2].action = cc.moveTo(2, cc.v2(-n / 3, i / 6)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenLeftBottom, t[3].position = cc.v2(n / 3, i + 200), 
                    t[3].action = cc.moveTo(2, cc.v2(n / 3, i / 6)).easing(cc.easeSineInOut()), t[3].moveLogic = m_define.moveLogicType.topScreenRightBottom, 
                    this.dealEnemyList(t), h(this.extantEnemy + 4);
                    break;

                  case 8:
                    (t = l(4, {
                        code: c,
                        shootLogic: r
                    }))[0].code = Math.random() < .5 ? c : a, t[0].position = cc.v2(0, i + 200), t[0].action = cc.moveTo(2, cc.v2(0, i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenTop, Math.random() < .5 && (t[0].shootLogic = d), 
                    t[1].position = cc.v2(-n / 2, i + 200), t[1].action = cc.moveTo(2, cc.v2(-n / 2, i / 6)).easing(cc.easeSineInOut()), 
                    t[1].moveLogic = m_define.moveLogicType.topScreenLeftBottom, t[2].position = cc.v2(0, i + 200), 
                    t[2].action = cc.moveTo(2, cc.v2(0, i / 6)).easing(cc.easeSineInOut()), t[2].moveLogic = m_define.moveLogicType.topScreenRightBottom, 
                    t[3].position = cc.v2(n / 2, i + 200), t[3].action = cc.moveTo(2, cc.v2(n / 2, i / 6)).easing(cc.easeSineInOut()), 
                    t[3].moveLogic = m_define.moveLogicType.topScreenBottom, this.dealEnemyList(t), 
                    h(this.extantEnemy + 4);
                    break;

                  case 9:
                    (t = l(4, {
                        code: c,
                        shootLogic: r
                    }))[0].code = Math.random() < .5 ? c : a, t[0].position = cc.v2(0, i + 200), t[0].action = cc.moveTo(2, cc.v2(0, 3 * i / 4)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenTop, t[1].position = cc.v2(-n / 3, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(-n / 3, i / 2)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenLeftTop, 
                    t[2].position = cc.v2(n / 3, i + 200), t[2].action = cc.moveTo(2, cc.v2(n / 3, i / 2)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, t[3].code = t[0].code, 
                    t[3].position = cc.v2(0, i + 200), t[3].action = cc.moveTo(2, cc.v2(0, i / 4)).easing(cc.easeSineInOut()), 
                    t[3].moveLogic = m_define.moveLogicType.topScreenBottom, this.dealEnemyList(t), 
                    h(this.extantEnemy + 4);
                    break;

                  case 10:
                    (t = l(5, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-2 * n / 3, i + 200), t[0].action = cc.moveTo(2, cc.v2(-2 * n / 3, i / 2)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(-n / 3, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(-n / 3, i / 2)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenLeftTop, 
                    t[2].position = cc.v2(0, i + 200), t[2].action = cc.moveTo(2, cc.v2(0, i / 2)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenTop, t[3].position = cc.v2(n / 3, i + 200), 
                    t[3].action = cc.moveTo(2, cc.v2(n / 3, i / 2)).easing(cc.easeSineInOut()), t[3].moveLogic = m_define.moveLogicType.topScreenRightTop, 
                    t[4].position = cc.v2(2 * n / 3, i + 200), t[4].action = cc.moveTo(2, cc.v2(2 * n / 3, i / 2)).easing(cc.easeSineInOut()), 
                    t[4].moveLogic = m_define.moveLogicType.topScreenRightTop, Math.random() < .5 && (t[1].code = "D6", 
                    t[1].moveLogic = m_define.moveLogicType.UAVFullScreenHalfTimeTrack, t[1].shootLogic = m_define.shootLogicType.shootNothing, 
                    t[3].code = "D6", t[3].moveLogic = m_define.moveLogicType.UAVFullScreenHalfTimeTrack, 
                    t[3].shootLogic = m_define.shootLogicType.shootNothing), this.dealEnemyList(t), 
                    h(this.extantEnemy + 5);
                    break;

                  case 11:
                    this.m_schedule(function() {
                        this.attachEnemy({
                            code: "D6",
                            position: cc.v2(n / 3, i + 200),
                            action: cc.bezierTo(2, [ cc.v2(n / 3, i + 200), cc.v2(0, 0), cc.v2(-n / 3, i / 3) ]).easing(cc.easeSineInOut()),
                            moveLogic: m_define.moveLogicType.UAVFullScreenHalfTimeTrack,
                            shootLogic: m_define.shootLogicType.shootNothing
                        }), this.attachEnemy({
                            code: "D6",
                            position: cc.v2(-n / 3, i + 200),
                            action: cc.bezierTo(2, [ cc.v2(-n / 3, i + 200), cc.v2(0, 0), cc.v2(n / 3, i / 3) ]).easing(cc.easeSineInOut()),
                            moveLogic: m_define.moveLogicType.UAVFullScreenHalfTimeTrack,
                            shootLogic: m_define.shootLogicType.shootNothing
                        });
                    }.bind(this), .2, 4), h(this.extantEnemy + 8);
                    break;

                  case 12:
                    this.m_schedule(function() {
                        this.attachEnemy({
                            code: "D6",
                            position: cc.v2(0, i + 200),
                            action: cc.bezierTo(2, [ cc.v2(0, i + 200), cc.v2(0, 3 * i / 4), cc.v2(-n / 3, i / 4) ]).easing(cc.easeSineInOut()),
                            moveLogic: m_define.moveLogicType.UAVFullScreenHalfTimeTrack,
                            shootLogic: m_define.shootLogicType.shootNothing
                        }), this.attachEnemy({
                            code: "D6",
                            position: cc.v2(0, i + 200),
                            action: cc.bezierTo(2, [ cc.v2(0, i + 200), cc.v2(0, 3 * i / 4), cc.v2(n / 3, i / 4) ]).easing(cc.easeSineInOut()),
                            moveLogic: m_define.moveLogicType.UAVFullScreenHalfTimeTrack,
                            shootLogic: m_define.shootLogicType.shootNothing
                        });
                    }.bind(this), .3, 3), (t = l(2, {
                        code: c,
                        shootLogic: m_define.shootLogicType.shootStraight
                    }))[0].position = cc.v2(-n / 2, i + 200), t[0].action = cc.moveTo(2, cc.v2(-n / 2, i / 2)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(n / 2, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(n / 2, i / 2)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenRightTop, 
                    this.dealEnemyList(t), h(this.extantEnemy + 8);
                    break;

                  case 13:
                    (t = l(5, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n - 200, 2 * i / 3), t[0].action = cc.moveTo(2, cc.v2(-3 * n / 5, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(-n - 200, 2 * i / 3), 
                    t[1].action = cc.moveTo(2, cc.v2(-n / 5, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[1].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[2].position = cc.v2(n + 200, 2 * i / 3), 
                    t[2].action = cc.moveTo(2, cc.v2(n / 5, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, t[3].position = cc.v2(n + 200, 2 * i / 3), 
                    t[3].action = cc.moveTo(2, cc.v2(3 * n / 5, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[3].moveLogic = m_define.moveLogicType.topScreenRightTop, t[4].position = cc.v2(0, i + 200), 
                    t[4].action = cc.moveTo(2, cc.v2(0, i / 3)).easing(cc.easeSineInOut()), t[4].moveLogic = m_define.moveLogicType.topScreenBottom, 
                    Math.random() < .5 && (t[4].code = a, t[4].shoot = d), this.dealEnemyList(t), h(this.extantEnemy + 5);
                    break;

                  case 14:
                    (t = l(5, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(0, i + 200), t[0].action = cc.moveTo(2, cc.v2(0, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenBottom, t[1].position = cc.v2(-n - 200, i / 3), 
                    t[1].action = cc.moveTo(2, cc.v2(-3 * n / 5, i / 3)).easing(cc.easeSineInOut()), 
                    t[1].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[2].position = cc.v2(-n - 200, i / 3), 
                    t[2].action = cc.moveTo(2, cc.v2(-n / 5, i / 3)).easing(cc.easeSineInOut()), t[2].moveLogic = m_define.moveLogicType.topScreenLeftTop, 
                    t[3].position = cc.v2(n + 200, i / 3), t[3].action = cc.moveTo(2, cc.v2(n / 5, i / 3)).easing(cc.easeSineInOut()), 
                    t[3].moveLogic = m_define.moveLogicType.topScreenRightTop, t[4].position = cc.v2(n + 200, i / 3), 
                    t[4].action = cc.moveTo(2, cc.v2(3 * n / 5, i / 3)).easing(cc.easeSineInOut()), 
                    t[4].moveLogic = m_define.moveLogicType.topScreenRightTop, Math.random() < .5 && (t[0].code = a, 
                    t[0].shoot = d), this.dealEnemyList(t), h(this.extantEnemy + 5);
                    break;

                  case 15:
                    (t = l(5, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n - 200, 2 * i / 3), t[0].action = cc.moveTo(2, cc.v2(-n / 2, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(0, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(0, 2 * i / 3)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenTop, 
                    t[2].position = cc.v2(n + 200, 2 * i / 3), t[2].action = cc.moveTo(2, cc.v2(n / 2, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, t[3].position = cc.v2(-n - 200, i / 3), 
                    t[3].action = cc.moveTo(2, cc.v2(-n / 3, i / 3)).easing(cc.easeSineInOut()), t[3].moveLogic = m_define.moveLogicType.topScreenLeftBottom, 
                    t[4].position = cc.v2(n + 200, i / 3), t[4].action = cc.moveTo(2, cc.v2(n / 3, i / 3)).easing(cc.easeSineInOut()), 
                    t[4].moveLogic = m_define.moveLogicType.topScreenRightBottom, Math.random() < .5 && (t[3].code = a, 
                    t[4].code = a, t[3].shootLogic = d, t[4].shootLogic = d), this.dealEnemyList(t), 
                    h(this.extantEnemy + 5);
                    break;

                  case 16:
                    (t = l(5, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n - 200, 2 * i / 3), t[0].action = cc.moveTo(2, cc.v2(-n / 3, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(n + 200, 2 * i / 3), 
                    t[1].action = cc.moveTo(2, cc.v2(n / 3, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[1].moveLogic = m_define.moveLogicType.topScreenRightTop, t[2].position = cc.v2(-n - 200, i / 3), 
                    t[2].action = cc.moveTo(2, cc.v2(-n / 2, i / 3)).easing(cc.easeSineInOut()), t[2].moveLogic = m_define.moveLogicType.topScreenLeftBottom, 
                    t[3].position = cc.v2(0, i + 200), t[3].action = cc.moveTo(2, cc.v2(0, i / 3)).easing(cc.easeSineInOut()), 
                    t[3].moveLogic = m_define.moveLogicType.topScreenBottom, t[4].position = cc.v2(n + 200, i / 3), 
                    t[4].action = cc.moveTo(2, cc.v2(n / 2, i / 3)).easing(cc.easeSineInOut()), t[4].moveLogic = m_define.moveLogicType.topScreenRightBottom, 
                    Math.random() < .5 && (t[0].code = a, t[1].code = a, t[0].shootLogic = d, t[1].shootLogic = d), 
                    this.dealEnemyList(t), h(this.extantEnemy + 5);
                    break;

                  case 17:
                    (t = l(6, {
                        code: c,
                        shootLogic: r
                    }))[0].position = cc.v2(-n - 200, 2 * i / 3), t[0].action = cc.moveTo(2, cc.v2(-n / 2, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[0].moveLogic = m_define.moveLogicType.topScreenLeftTop, t[1].position = cc.v2(0, i + 200), 
                    t[1].action = cc.moveTo(2, cc.v2(0, 2 * i / 3)).easing(cc.easeSineInOut()), t[1].moveLogic = m_define.moveLogicType.topScreenTop, 
                    t[2].position = cc.v2(n + 200, 2 * i / 3), t[2].action = cc.moveTo(2, cc.v2(n / 2, 2 * i / 3)).easing(cc.easeSineInOut()), 
                    t[2].moveLogic = m_define.moveLogicType.topScreenRightTop, t[3].position = cc.v2(-n - 200, i / 3), 
                    t[3].action = cc.moveTo(2, cc.v2(-n / 2, i / 3)).easing(cc.easeSineInOut()), t[3].moveLogic = m_define.moveLogicType.topScreenLeftBottom, 
                    t[4].position = cc.v2(0, i + 200), t[4].action = cc.moveTo(2, cc.v2(0, i / 3)).easing(cc.easeSineInOut()), 
                    t[4].moveLogic = m_define.moveLogicType.topScreenBottom, t[5].position = cc.v2(n + 200, i / 3), 
                    t[5].action = cc.moveTo(2, cc.v2(n / 2, i / 3)).easing(cc.easeSineInOut()), t[5].moveLogic = m_define.moveLogicType.topScreenRightBottom, 
                    Math.random() < .5 && (t[0].code = a, t[0].shootLogic = d, t[2].code = a, t[2].shootLogic = d, 
                    t[4].code = a, t[4].shootLogic = d), this.dealEnemyList(t), h(this.extantEnemy + 6);
                }
            },
            attachBoss: function() {
                var e = JMI.getBossData(m_data.level % 100 + 1 + "");
                if (e) {
                    var t = e.code, n = (e.coinNum, e.hp, e.medalNum, cc.winSize.height / 2), i = m_pool.getObject(t);
                    if (i) {
                        var o = i.getComponent("BossControl") || i.addComponent("BossControl");
                        o.init(e), i.position = cc.v2(0, n + 200), i.attachParent(this.iterateLayer), i.runAction(cc.sequence(cc.moveTo(2, cc.v2(0, n / 2)).easing(cc.easeSineInOut()), cc.callFunc(function() {
                            o.run();
                        })));
                    }
                } else EMI.dispatchEvent(m_define.eventType.gameSuccess);
            },
            dealEnemyList: function(e) {
                var t = this.attachEnemy.bind(this);
                e.forEach(t);
            },
            attachEnemy: function(e) {
                var t = e.code || "D1", n = e.position || cc.v2(0, 0), i = e.action || cc.place(0, 0), o = e.moveLogic || 0, c = e.shootLogic || 0, a = e.zIndex || 0;
                switch (t) {
                  case "D1":
                    c = m_define.shootLogicType.shootPGM;
                    break;

                  case "D2":
                    c = m_define.shootLogicType.shootStraight;
                    break;

                  case "D3":
                    c = m_define.shootLogicType.shootStraightTrack;
                    break;

                  case "D4":
                    c = m_define.shootLogicType.shootFissure;
                    break;

                  case "D0":
                    c = m_define.shootLogicType.shootExpand;
                }
                var s = JMI.getEnemyData(t), r = m_pool.getObject(t);
                if (r) {
                    switch (r.scale = 1, t) {
                      default:
                        a = 10;
                        break;

                      case "D1":
                        a = 11;
                        break;

                      case "D2":
                        a = 12;
                        break;

                      case "D3":
                        a = 13;
                        break;

                      case "D4":
                        a = 14;
                        break;

                      case "D6":
                        a = 15;
                        break;

                      case "D8":
                        a = 16;
                        break;

                      case "D0":
                        a = 17;
                    }
                    var d = r.getComponent("EnemyControl") || r.addComponent("EnemyControl");
                    d.init(t, s), r.position = n, r.attachParent(this.iterateLayer, a), r.runAction(cc.sequence(i, cc.callFunc(function() {
                        d && (d.useMoveLogic(o), d.useShootLogic(c));
                    })));
                }
            },
            selfPlaneRebirth: function() {
                m_data.rebirthChance--, this.hideUI_Result(), this.initSelfPlane(function() {
                    this.setTarget(this.plane), this.plane.getComponent("SelfPlaneControl").init(), 
                    this.plane.getComponent("SelfPlaneControl").run();
                }.bind(this)), this._allowSlowDown = !0;
                var e = cc.find("Canvas/UI_GamePlay/itemRoot");
                e.children.forEach(function(e) {
                    var t = e.getComponent("Shoot");
                    t && t.unscheduleAllCallbacks(), e.removeFromParent(), m_pool.pushObject(e);
                }), e.active = !0, this.scheduleOnce(function() {
                    EMI.dispatchEvent(m_define.eventType.getItem, "shield_rebirth");
                }, 0), this.schedule(this.reloadEnemy, 30);
            },
            onClickContinue: function() {
                var e = cc.find("Canvas/UI_Result/fail");
                if (window.wx) {
                    e.getChildByName("btn_continue").getChildByName("video");
                    if ("firstPlay" == WXI.getStorageSync("FIRSTMAN") && m_data.level - 1 <= 7 ? wx.aldSendEvent("新增玩家复活人数", {
                        "关卡": m_data.level
                    }) : wx.aldSendEvent("留存玩家复活人数", {
                        "关卡": m_data.level
                    }), m_data.level <= 20) {
                        var t = WXI.getStorageSync("RELIFECOUNT");
                        null == t || void 0 == t || "" == t ? (WXI.setStorageSync("RELIFECOUNT", m_data.level), 
                        wx.aldSendEvent("当前关卡累计复活次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("当前关卡累计复活人数", {
                            "关卡": m_data.level
                        })) : t < m_data.level ? (WXI.setStorageSync("RELIFECOUNT", m_data.level), wx.aldSendEvent("当前关卡累计复活次数", {
                            "关卡": m_data.level
                        }), wx.aldSendEvent("当前关卡累计复活人数", {
                            "关卡": m_data.level
                        })) : wx.aldSendEvent("当前关卡累计复活次数", {
                            "关卡": m_data.level
                        });
                    }
                    this.unschedule(this.ClockFunc);
                    var n = cc.find("Canvas/item_anime1"), i = cc.find("Canvas/item_anime2");
                    if (MCI.getAdWall()) (Math.random() > .75 ? 0 : 1) ? WXI.createVideo(function() {
                        var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                        e[5].over += 1, WXI.setStorageSync("GLORY", e), this.selfPlaneRebirth(), n.active = this.item_anime1ac, 
                        i.active = this.item_anime2ac;
                    }.bind(this), function() {
                        m_data.coin += m_data.coinRecord, WXI.saveUserLocalData(), m_data.coinRecord > 0 ? (pop("你赚到了" + m_data.coinRecord + "金币"), 
                        EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                            showCoinAni: !0,
                            planeFreeTry: !0,
                            type: "fail"
                        })) : EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                            planeFreeTry: !0,
                            type: "fail"
                        });
                    }, "adunit-5c89cd5303554fd5") : WXI.share3Seconds(function() {
                        var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                        e[6].over += 1, WXI.setStorageSync("GLORY", e), this.selfPlaneRebirth(), n.active = this.item_anime1ac, 
                        i.active = this.item_anime2ac;
                    }.bind(this), function() {
                        pop("分享失败"), m_data.coin += m_data.coinRecord, WXI.saveUserLocalData(), m_data.coinRecord > 0 ? (pop("你赚到了" + m_data.coinRecord + "金币"), 
                        EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                            showCoinAni: !0,
                            planeFreeTry: !0,
                            type: "fail"
                        })) : EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                            planeFreeTry: !0,
                            type: "fail"
                        });
                    }); else WXI.createVideo(function() {
                        var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                        e[5].over += 1, WXI.setStorageSync("GLORY", e), this.selfPlaneRebirth(), n.active = this.item_anime1ac, 
                        i.active = this.item_anime2ac;
                    }.bind(this), function() {
                        m_data.coin += m_data.coinRecord, WXI.saveUserLocalData(), m_data.coinRecord > 0 ? (pop("你赚到了" + m_data.coinRecord + "金币"), 
                        EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                            showCoinAni: !0,
                            planeFreeTry: !0,
                            type: "fail"
                        })) : EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                            planeFreeTry: !0,
                            type: "fail"
                        });
                    }, "adunit-5c89cd5303554fd5");
                } else this.selfPlaneRebirth();
            },
            onClickGemini: function() {
                (Math.random() > .5 ? 0 : 1) ? WXI.createVideo(function() {
                    m_data.coolMode = !0, console.log(3, "m_data.coolMode"), cc.find("Canvas/UI_Start/MoveNode/btn_gemini").active = !1;
                    var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                    e[0].over += 1, WXI.setStorageSync("GLORY", e), this.onClickPlane(1), null != this.totleResume && this.totleResume();
                }.bind(this), null, "adunit-70668e86d86b8824") : WXI.share3Seconds(function() {
                    m_data.coolMode = !0, cc.find("Canvas/UI_Start/MoveNode/btn_gemini").active = !1;
                    var e = WXI.getStorageSync("GLORY", "object") || m_data.gloryJson;
                    e[0].over += 1, WXI.setStorageSync("GLORY", e), this.onClickPlane(1), null != this.totleResume && this.totleResume();
                }.bind(this), function() {
                    pop("分享失败");
                });
            },
            onClickInvite: function() {
                cc.find("Canvas/UI_Start/invitePop").active = !0;
            },
            planeFreeTryRecover: function() {
                m_data.tempF = void 0, cc.find("Canvas/UI_Start/banner/selfPlanes").children.forEach(function(e) {
                    var t = e.frame;
                    t && t.isValid && (t.destroy(), e.frame = null);
                }), this.showBtnPop();
            },
            planeFreeTry: function() {
                this.planeFreeTryRecover();
                var e = WXI.getStorageSync("TRYSTAMP");
                void 0 !== e && "" !== e && e == new Date().toDateString() || (WXI.setStorageSync("TRYSTAMP", new Date().toDateString()), 
                WXI.setStorageSync("TRYTIMES", 10));
                var t = WXI.getStorageSync("TRYTIMES");
                if (void 0 !== t && "" !== t || (WXI.setStorageSync("TRYTIMES", 10), t = 10), !(t <= 0)) {
                    var n = [ "p1", "p2", "p3", "p4", "p5" ];
                    if (n.length > 0) {
                        var i = n[Math.floor(Math.random() * n.length)];
                        m_data.tempF = i;
                        var o = i.replace("p", ""), c = cc.find("Canvas/UI_Start/banner/selfPlanes").getChildByName(o);
                        if (!c.frame || !c.frame.isValid) {
                            unGray(c);
                            var a = cc.find("Canvas/UI_Start/banner/tryFrame"), s = cc.instantiate(a);
                            return s.position = cc.v2(0, 3), s.active = !0, s.parent = c, c.frame = s, s.stopAllActions(), 
                            s.scale = 1, s.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.3, 1.1), cc.scaleTo(.3, 1)))), 
                            this.showBtnPop("freeTry"), o;
                        }
                    }
                    return "unknown";
                }
            }
        }), cc._RF.pop();
    }, {
        "./GameCommon/GameCommon": "GameCommon",
        "./GameCommon/UserData": "UserData",
        AudioManager: "AudioManager",
        EventManager: "EventManager",
        Globals: "Globals",
        JsonFileManager: "JsonFileManager",
        MessageCenter: "MessageCenter",
        ObjectPool: "ObjectPool",
        Prototype: "Prototype",
        WeChatManager: "WeChatManager",
        md5: "md5"
    } ],
    Medal: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "2f36fc0yLBGnJONQTUWX6Nk", "Medal"), cc.Class({
            extends: cc.Component,
            onDisable: function() {
                this.node.stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    MessageCenter: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "fdbbeuzUSFJ96oND9uXBrg0", "MessageCenter"), window.MCI = function() {
            var e = !1, t = {}, n = [ {
                appid: "wxf2c9efc3b9a9ebe2",
                id: "",
                title: "雷霆战车",
                path: "?cp_id=226"
            }, {
                appid: "wxa74c4ea773cdb9a6",
                id: "",
                title: "人人当枪神",
                path: "?cp_id=223"
            }, {
                appid: "wxdea13d22d56c41d2",
                id: "",
                title: "流浪火箭",
                path: "?channel=rongyaofeiji_cost&plan=zhise_yyml&ald_media_id=21408&ald_link_key=831efc9bc475e6c0&ald_position_id=0"
            }, {
                appid: "wx5183864ab7af5343",
                id: "",
                title: "火柴人挑战",
                path: "game/gamePage.html?channel=tcyl "
            }, {
                appid: "wx0b56412f6fa41f2d",
                id: "",
                title: "龙行贪吃蛇",
                path: ""
            }, {
                appid: "wxe1c9e0abb4119f3e",
                id: "",
                title: "坦克杀手",
                path: ""
            }, {
                appid: "wxb592ccba1103773a",
                id: "",
                title: "超级城市大战",
                path: ""
            }, {
                appid: "wxef82b48ec3e84052",
                id: "",
                title: "欢乐水杯",
                path: "?ald_media_id=23285&ald_link_key=169d2f1ad0da5bba&ald_position_id=0"
            }, {
                appid: "wxbb67c77aea9d76a8",
                id: "",
                title: "遇见球球",
                path: "?ald_media_id=18862&ald_link_key=c5e2acf41597dec6&ald_position_id=0"
            }, {
                appid: "wxc519ef31807dc90f",
                id: "",
                title: "千炮富翁捕鱼",
                path: "?tcchannel=tc20036&zgzChannelTag=20036&ald_media_id=11727&ald_link_key=b8218b39aff5fcfa&ald_position_id=0"
            } ];
            return {
                getGuessAD: function() {
                    return n;
                },
                _postData: function(e, t, n, i, o) {
                    window.wx && wx.request({
                        url: e,
                        method: "POST",
                        data: t,
                        success: function(e) {
                            200 == e.statusCode && n && n(e);
                        },
                        fail: function(e) {
                            i && i(e);
                        },
                        complete: function(e) {
                            o && o(e);
                        }
                    });
                },
                _getData: function(e, t, n, i, o) {
                    window.wx && wx.request({
                        url: e,
                        method: "GET",
                        data: t,
                        success: function(e) {
                            200 == e.statusCode && n && n(e);
                        },
                        fail: function(e) {
                            i && i(e);
                        },
                        complete: function(e) {
                            o && o(e);
                        }
                    });
                },
                init: function() {
                    this.login_7thAv(), this.getAdWall(), this.getShareImageList();
                },
                getAdWall: function() {
                    return shareSdk.isSouSuo && !shareSdk.isQuYu && shareSdk.isEwm && shareSdk.isSwitch ? (t.ADWALL = !1, 
                    e = !1, !1) : t.ADWALL ? e : (this._postData("https://account.api.snsfun.com/XyxApi/shstatus", {
                        gameid: 53,
                        v: "190923"
                    }, function(n) {
                        var i = n.data;
                        void 0 != i && (0 == i && (e = !0), t.ADWALL = !0);
                    }, function(n) {
                        t.ADWALL = !0, e = !0;
                    }.bind(this)), !1);
                },
                getShareImageList: function() {
                    this._postData("https://account.api.snsfun.com/XyxApi/share", {
                        gameid: 53,
                        sh: e ? 0 : 1
                    }, function(e) {
                        var t = e.data;
                        console.log("传入审核接口的返回值", t), void 0 != t && t.length && (m_data.shareImageList = t);
                    });
                },
                login_7thAv: function() {},
                getADList_7thAv: function(e) {
                    e && e([ {
                        appid: "wxf2c9efc3b9a9ebe2",
                        id: "",
                        title: "雷霆战车",
                        path: "?cp_id=226"
                    }, {
                        appid: "wxa74c4ea773cdb9a6",
                        id: "",
                        title: "人人当枪神",
                        path: "?cp_id=223"
                    }, {
                        appid: "wxdea13d22d56c41d2",
                        id: "",
                        title: "流浪火箭",
                        path: "?channel=rongyaofeiji_cost&plan=zhise_yyml&ald_media_id=21408&ald_link_key=831efc9bc475e6c0&ald_position_id=0"
                    }, {
                        appid: "wx5183864ab7af5343",
                        id: "",
                        title: "火柴人挑战",
                        path: "game/gamePage.html?channel=tcyl "
                    }, {
                        appid: "wx0b56412f6fa41f2d",
                        id: "",
                        title: "龙行贪吃蛇",
                        path: ""
                    }, {
                        appid: "wxe1c9e0abb4119f3e",
                        id: "",
                        title: "坦克杀手",
                        path: ""
                    }, {
                        appid: "wxb592ccba1103773a",
                        id: "",
                        title: "超级城市大战",
                        path: ""
                    }, {
                        appid: "wxef82b48ec3e84052",
                        id: "",
                        title: "欢乐水杯",
                        path: "?ald_media_id=23285&ald_link_key=169d2f1ad0da5bba&ald_position_id=0"
                    }, {
                        appid: "wxbb67c77aea9d76a8",
                        id: "",
                        title: "遇见球球",
                        path: "?ald_media_id=18862&ald_link_key=c5e2acf41597dec6&ald_position_id=0"
                    } ]);
                },
                gameHitCallback_7thAv: function(e, t, n) {
                    this._getData("https://sdk.yiqiangame.com/index.php/api/base/gameHitCallback", {
                        game_id: e,
                        source_id: t,
                        status: n
                    });
                },
                setContent: function(e, t, n, i, o) {
                    e < 0 || (t = "string" == typeof t ? t : JSON.stringify(t), this._postData("https://account.api.snsfun.com/Gamecustom/setCon", {
                        gameid: 53,
                        openid: e,
                        content: t,
                        sign: m_encoder.md5(t + 53 + e)
                    }, n, i, o));
                },
                getContent: function(e, t, n, i) {
                    this._postData("https://account.api.snsfun.com/Gamecustom/getCon", {
                        gameid: 53,
                        openid: e
                    }, t, n, i);
                },
                shareBy: function(e) {
                    var t = m_data.uid;
                    e && t && this.getContent(e, function(n) {
                        if (n.data) {
                            var i = n.data.data;
                            if (i) {
                                var o = (i = JSON.parse(i)).shareList;
                                if (o) {
                                    if (o.length >= 10) return void console.log("分享用户已达上限");
                                    o.indexOf(t) < 0 && (o.push(t), i.shareList = o, this.setContent(e, i));
                                } else i.shareList = [ t ], this.setContent(e, i);
                            } else i = {
                                shareList: [ t ]
                            }, this.setContent(e, i);
                        }
                    }.bind(this));
                },
                getShareList: function(e, t, n) {
                    m_data.uid && this.getContent(m_data.uid, function(t) {
                        if (t && t.data && t.data.data) {
                            var n = JSON.parse(t.data.data).shareList;
                            n && e && e(n);
                        }
                    }, t, n);
                }
            };
        }(), cc._RF.pop();
    }, {} ],
    ObjectPool: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "43ec7bJAZtD6JAGrKGdtMvi", "ObjectPool"), window.m_pool = function() {
            var e = {}, t = null;
            return {
                getPrefab: function(e) {
                    if (t) return t[e];
                    var n = cc.find("Canvas/prefabNode");
                    return n && (t = n.getComponent("PrefabNode")), t[e];
                },
                pushObject: function(t, n) {
                    if (t instanceof cc.Node && t.isValid) {
                        if (n = n || t.name, void 0 === e[n] && (e[n] = []), t.inPooled) return;
                        t.active = !1, e[n].push(t), t.inPooled = !0;
                    }
                },
                getObject: function(t, n) {
                    if (void 0 != e[t]) {
                        var i = e[t].pop();
                        if (i && i.isValid) return i.inPooled = !1, i;
                    }
                    if (n instanceof cc.Prefab || n instanceof cc.Node) return cc.instantiate(n);
                    if ("function" == typeof n) {
                        var o = n();
                        if (o instanceof cc.Node) return o;
                    }
                    var c = this.getPrefab(t);
                    return c ? cc.instantiate(c) : (cc.warn("m_pool[" + t + "] getNull!"), null);
                },
                dump: function() {
                    var t = "\n";
                    for (var n in e) t += "池[" + n + "]:" + e[n].length + "\n";
                    cc.log(t + "\n");
                },
                destroyAllNodes: function() {
                    for (var t in e) for (var n = e[t]; n.length > 0; ) {
                        var i = n.pop();
                        i && i.isValid && i.destroy();
                    }
                }
            };
        }(), cc._RF.pop();
    }, {} ],
    PigCoin: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "c61d7xEp65LqYJ43ZZlOgXg", "PigCoin"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this.node.getComponent(cc.Animation).play();
            },
            onDisable: function() {
                this.node.getComponent(cc.Animation).stop(), this.node.stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    PrefabNode: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "a3317rX/CtCbp0dlzZFWBnq", "PrefabNode"), cc.Class({
            extends: cc.Component,
            properties: {
                D0: cc.Prefab,
                D1: cc.Prefab,
                D2: cc.Prefab,
                D3: cc.Prefab,
                D4: cc.Prefab,
                D6: cc.Prefab,
                D8: cc.Prefab,
                enemyBullet1: cc.Prefab,
                enemyBullet2: cc.Prefab,
                enemyBullet3: cc.Prefab,
                enemyBullet4: cc.Prefab,
                enemyBullet5: cc.Prefab,
                selfBullet1: cc.Prefab,
                selfBulletGold: cc.Prefab,
                itemLaser: cc.Prefab,
                itemShield: cc.Prefab,
                itemAmmo: cc.Prefab,
                itemGemini: cc.Prefab,
                itemCoinBag: cc.Prefab,
                itemSuper: cc.Prefab,
                itemTryWinMan: cc.Prefab,
                chest: cc.Prefab,
                coin: cc.Prefab,
                medal: cc.Prefab,
                medal3: cc.Prefab,
                hit: cc.Prefab,
                hit1: cc.Prefab,
                hit2: cc.Prefab,
                hit3: cc.Prefab,
                hit4: cc.Prefab,
                hit5: cc.Prefab,
                explosion: cc.Prefab,
                tail: cc.Prefab,
                core: cc.Prefab,
                coinAttract: cc.Prefab,
                bar_hp: cc.Prefab,
                ammo: cc.Prefab,
                gemini: cc.Prefab,
                shield: cc.Prefab,
                laser: cc.Prefab,
                coinBag: cc.Prefab,
                pigCoin: cc.Prefab,
                BOSS01: cc.Prefab,
                BOSS02: cc.Prefab,
                BOSS03: cc.Prefab,
                BOSS04: cc.Prefab,
                BOSS05: cc.Prefab,
                wingmanBullet1: cc.Prefab,
                wingmanBullet2: cc.Prefab,
                wingmanBullet3: cc.Prefab,
                wingmanBullet4: cc.Prefab,
                wingmanBullet5: cc.Prefab,
                wingmanBullet3_test: cc.Prefab,
                wingmanBullet5_test: cc.Prefab,
                wingman1: cc.Prefab,
                wingman2: cc.Prefab,
                wingman3: cc.Prefab,
                wingman4: cc.Prefab,
                wingman5: cc.Prefab
            }
        }), cc._RF.pop();
    }, {} ],
    Prototype: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "8a8bbVwy/FDjZmdStltJ98a", "Prototype"), cc.Node.prototype.moveToX = function(e, t) {
            this.stopAllActions(), this.runAction(cc.sequence(cc.moveTo(.4, cc.v2(e, this.y)), cc.callFunc(t)));
        }, cc.Node.prototype.moveToY = function(e, t) {
            this.stopAllActions(), this.runAction(cc.sequence(cc.moveTo(.4, cc.v2(this.x, e)), cc.callFunc(t)));
        }, cc.Node.prototype.bounceToX = function(e, t) {
            this.stopAllActions(), this.runAction(cc.sequence(cc.moveTo(.3, cc.v2(e, this.y)), cc.moveBy(.05, cc.v2(0, 30)), cc.moveBy(.05, cc.v2(0, -30)), cc.callFunc(t)));
        }, cc.Node.prototype.bounceToY = function(e, t) {
            this.stopAllActions(), this.runAction(cc.sequence(cc.moveTo(.3, cc.v2(this.x, e)), cc.moveBy(.05, cc.v2(0, 30)), cc.moveBy(.05, cc.v2(0, -30)), cc.callFunc(t)));
        }, cc.Node.prototype.write = function(e) {
            var t = this.getComponent(cc.Label);
            t && t.string != e && (t.string = e);
        }, cc.Node.prototype.writeShoot = function(e) {
            "number" == typeof e && (e < 1e3 ? this.write(e) : e < 1e6 ? this.write((parseInt(e / 100) / 10).toString() + "K") : this.write((parseInt(e / 1e5) / 10).toString() + "M"));
        }, cc.Component.prototype.m_schedule = function(e, t, n, i) {
            if (e && t > 0 && n > 0) {
                var o = 0, c = function() {
                    ++o < n + 1 ? e(o) : i && i(o);
                };
                return this.schedule(c, t, n), c;
            }
            return null;
        }, cc.Node.prototype.__defineSetter__("v", function(e) {
            e instanceof cc.Vec2 ? (this._v = e, this._p = void 0) : cc.warn("v not instanceof Vec2");
        }), cc.Node.prototype.__defineGetter__("v", function() {
            return this._v;
        }), cc.Node.prototype.attachParent = function(e, t) {
            this.parent || (this.zIndex = t || 0, e instanceof cc.Node ? this.parent = e : "string" == typeof e && (this.parent = cc.find(e))), 
            this.active = !0;
        }, cc.Node.prototype.shootStraight = function(e, t, n, i, o) {
            var c = this.getComponent("Shoot") || this.addComponent("Shoot");
            c.unscheduleAllCallbacks();
            var a = function() {
                t instanceof cc.Vec2 && (t = [ t ]), t.forEach(function(t) {
                    var i = m_pool.getObject(e);
                    i && (i.v = n, i.position = this.position.add(t), i.attachParent(m_iterateLayer, o));
                }.bind(this));
            }.bind(this);
            a(), c.schedule(a, i || 1);
        }, Array.prototype.safeGet = function(e) {
            return e < 0 ? this.length > 0 ? this[0] : void 0 : e > this.length - 1 ? this.length > 0 ? this[this.length - 1] : void 0 : this[e];
        }, cc.Node.prototype.changeSp = function(e) {
            var t = this.getComponent(cc.Sprite);
            t && e instanceof cc.SpriteFrame && (t.spriteFrame = e);
        }, cc._RF.pop();
    }, {} ],
    RankPop: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "80e9bIhZ2dPUpAYyylE29rF", "RankPop"), cc.Class({
            extends: cc.Component,
            properties: {},
            onLoad: function() {
                this.sp = this.node.getChildByName("myOpenDataContext").getComponent(cc.Sprite);
            },
            onEnable: function() {
                var e = this.node.getChildByName("myOpenDataContext");
                WXI.setSharedCanvasSize(e.width, e.height), WXI.postMessage({
                    type: "rank"
                });
            },
            onDisable: function() {},
            start: function() {
                this.tex = new cc.Texture2D();
                var e = this.node.getChildByName("bg");
                e.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this)), e.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this)), 
                e.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this)), e.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this));
            },
            update: function(e) {
                if (this.tex) {
                    var t = wx.getOpenDataContext().canvas;
                    this.tex.initWithElement(t), this.tex.handleLoadedTexture(), this.sp.spriteFrame = new cc.SpriteFrame(this.tex);
                }
            },
            onClickBlank: function() {
                this.node.active = !1;
            },
            onTouchStart: function(e) {
                e.stopPropagation(), WXI.postMessage({
                    type: "touchStart"
                });
            },
            onTouchMove: function(e) {
                e.stopPropagation();
                var t = e.getDelta();
                t && WXI.postMessage({
                    type: "touchMove",
                    x: t.x,
                    y: t.y
                });
            },
            onTouchEnd: function(e) {
                e.stopPropagation(), WXI.postMessage({
                    type: "touchEnd"
                });
            }
        }), cc._RF.pop();
    }, {} ],
    RebirthPop: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "a2866Y51/9MUqnVVXXXVNOs", "RebirthPop"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this._switched = !1;
                var e = this.node.getChildByName("btn_continue"), t = e.getChildByName("video");
                e.getChildByName("share").active = !1, t.active = !0;
            },
            onDisable: function() {
                this.node.stopAllActions(), this.node.x = 0;
            },
            backToStartMenu: function() {
                m_data.coin += m_data.coinRecord, WXI.saveUserLocalData(), EMI.dispatchEvent(m_define.eventType.afterALL), 
                m_data.coinRecord > 0 ? (pop("你赚到了" + m_data.coinRecord + "金币"), EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                    showCoinAni: !0,
                    planeFreeTry: !0,
                    type: "fail"
                })) : EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                    planeFreeTry: !0,
                    type: "fail"
                });
            },
            onClickIgnore: function() {
                this.backToStartMenu();
            },
            switchShare: function() {
                this.node.x = -cc.winSize.width / 2 - 300;
                var e = this.node.getChildByName("btn_continue"), t = e.getChildByName("video");
                e.getChildByName("share").active = !0, t.active = !1, this.node.getChildByName("btn_ignoreShare").active = !0, 
                this.node.bounceToX(0);
            }
        }), cc._RF.pop();
    }, {} ],
    Roulette: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "1db5bJlVN9P4KBRtOrR2/nC", "Roulette"), cc.Class({
            extends: cc.Component,
            getResult: function() {
                for (var e = JMI.getDialData(), t = 0, n = Math.random(), i = 0; i < e.length && !(n < (t += e[i])); i++) ;
                var o = i + 2, c = [ [ 182, 218 ], [ 23, 60 ], [ 261, 300 ], [ 142, 180 ], [ 343, 381 ], [ 102, 140 ], [ 302, 340 ], [ 221, 259 ], [ 62, 100 ] ], a = c[i][0], s = c[i][1];
                return {
                    multiScale: o,
                    angle: a + Math.random() * (s - a) + 3600
                };
            },
            start: function() {
                var e = this.node.getChildByName("wheel");
                if (e.getNumberOfRunningActions() < 1) {
                    var t = cc.find("Canvas/UI_Result");
                    if (t.active) t.getChildByName("success").active = !1;
                    e.rotation = 0;
                    var n = this.getResult(), i = n.angle, o = n.multiScale;
                    console.log("转盘旋转度数:", i, " 翻倍数:", o), e.runAction(cc.sequence(cc.rotateBy(5, i).easing(cc.easeExponentialInOut()), cc.callFunc(function() {
                        this.node && this.node.isValid && (this.node.destroy(), m_data.coinRecord *= o, 
                        pop("翻" + o + "倍,恭喜获得金币奖励\n" + m_data.coinRecord), m_data.coin += m_data.coinRecord, 
                        EMI.dispatchEvent(m_define.eventType.afterSuccessAndFail, {
                            showCoinAni: !0,
                            type: "success"
                        }));
                    }.bind(this))));
                }
            },
            onClickRotate: function() {},
            onClickIgnore: function() {}
        }), cc._RF.pop();
    }, {} ],
    SelectItem: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "3aabfmbdZpNC4OfMYky81uI", "SelectItem"), cc.Class({
            extends: cc.Component,
            properties: {
                item_ammo: cc.SpriteFrame,
                item_gemini: cc.SpriteFrame,
                item_shield: cc.SpriteFrame,
                item_laser: cc.SpriteFrame
            },
            resetFrame: function() {
                if (null != this.itemNumberOver && void 0 != this.itemNumberOver) for (;this.itemNumber = parseInt(4 * Math.random()), 
                this.itemNumber == this.itemNumberOver; ) ; else this.itemNumber = parseInt(4 * Math.random());
                var e = this.node.getChildByName("item");
                switch (this.itemNumber) {
                  case 0:
                    e.getComponent(cc.Sprite).spriteFrame = this.item_ammo;
                    break;

                  case 1:
                    e.getComponent(cc.Sprite).spriteFrame = this.item_gemini;
                    break;

                  case 2:
                    e.getComponent(cc.Sprite).spriteFrame = this.item_shield;
                    break;

                  case 3:
                    e.getComponent(cc.Sprite).spriteFrame = this.item_laser;
                }
                this.item = e.getComponent(cc.Sprite).spriteFrame;
            },
            getItem: function() {
                return console.log(this.item), this.item;
            },
            getItemNumber: function() {
                return this.itemNumber;
            },
            setSecondItemNumber: function(e) {
                this.itemNumberOver = e;
            }
        }), cc._RF.pop();
    }, {} ],
    SelfPlaneControl: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "a88f5aGy4VDXoFLU90HiDfq", "SelfPlaneControl");
        var i = Math.PI;
        function o(e) {
            return 90 - 180 * e / i;
        }
        cc.Class({
            extends: cc.Component,
            init: function() {
                var e = m_data.plane, t = e.s, n = e.p, i = JMI.getPowerData();
                this.shootInterval = 10 / i.s.safeGet(t).speed, this.bulletNum = i.s.safeGet(t).bulletNum, 
                m_data.damage = i.p.safeGet(n).num;
                var o = m_data.collect, c = o.f, a = o[c];
                if (m_data.tempF) {
                    console.log(3);
                    var s = JMI.getWingmanData(m_data.tempF);
                    s && (c = m_data.tempF, a = {
                        s: s.s.length - 1,
                        p: s.p.length - 1
                    });
                }
                var r = JMI.getWingmanData(c), d = r.s, l = r.p;
                this._wingmanCode = c, a && (this.wingmanIntervalScale = 55 / d.safeGet(a.s).data, 
                m_data.wingmanDamage = l.safeGet(a.p).num), this._inited = !0;
            },
            onLoad: function() {
                this.bulletKey = "selfBullet1", this.node.zIndex = 40;
            },
            start: function() {
                EMI.on(m_define.eventType.useItemBegin, function(e) {
                    this.useItemBegin(e.getUserData());
                }, this), EMI.on(m_define.eventType.useItemEnd, function(e) {
                    this.useItemEnd(e.getUserData());
                }, this), EMI.on(m_define.eventType.slowDownBegin, function(e) {
                    this.stopRun();
                }, this), EMI.on(m_define.eventType.slowDownEnd, function(e) {
                    this.run();
                }, this);
            },
            removeItems: function(e) {
                this.node.children.forEach(function(t) {
                    t.active && e.indexOf(t.name) > -1 && m_pool.pushObject(t);
                });
            },
            useItemBegin: function(e) {
                var t = m_pool.getObject("shield_rebirth" == e ? "shield" : e);
                if (t) switch (e) {
                  case "shield":
                  case "shield_rebirth":
                    t.position = cc.v2(0, 0), t.attachParent(this.node, 4);
                    break;

                  case "ammo":
                    this.removeItems([ "ammo", "gemini", "laser" ]), t.position = cc.v2(0, 0), t.attachParent(this.node, 4), 
                    this.itemKey = "ammo", this.runAmmo();
                    break;

                  case "gemini":
                    this.removeItems([ "ammo", "gemini", "laser" ]);
                    var n = this.node.getChildByName("body"), i = n.getComponent(cc.Sprite).spriteFrame;
                    t.position = cc.v2(n.width + 30, 0), t.getComponent(cc.Sprite).spriteFrame = i, 
                    t.attachParent(this.node, 4), this.itemKey = "gemini", this.runGemini();
                    break;

                  case "laser":
                    this.removeItems([ "ammo", "gemini", "laser" ]), this.stopRunSelf(), t.position = cc.v2(0, 0), 
                    t.attachParent(this.node, 0), this.itemKey = "laser";
                    break;

                  case "coinBag":
                    t.position = cc.v2(0, 0), t.attachParent(this.node, 4), this.bulletKey = "selfBulletGold";
                }
            },
            useItemEnd: function(e) {
                var t = "shield_rebirth" == e ? "shield" : e;
                switch (e) {
                  case "coinBag":
                    this.bulletKey = "selfBullet1";

                  case "shield":
                  case "shield_rebirth":
                    this.removeItems([ t ]);
                    break;

                  case "ammo":
                  case "gemini":
                  case "laser":
                    this.removeItems([ t ]), this.itemKey = void 0, this.run();
                }
            },
            stopRunSelf: function() {
                (this.node.getComponent("Shoot") || this.node.addComponent("Shoot")).unscheduleAllCallbacks();
            },
            stopRun: function() {
                (this.node.getComponent("Shoot") || this.node.addComponent("Shoot")).unscheduleAllCallbacks();
                var e = this.node.getChildByName("wingman1");
                e && e.isValid && (e.getComponent("Shoot") || e.addComponent("Shoot")).unscheduleAllCallbacks();
            },
            test: function(e, t, n, o) {
                var c = this.node.getComponent("Shoot") || this.node.addComponent("Shoot");
                c.unscheduleAllCallbacks();
                var a = function() {
                    for (var o = this.bulletKey, c = 0; c < e.length; c++) for (var a = this.node.position.add(e[c]), s = function() {
                        var e = m_pool.getObject(o);
                        e && (e.v = cc.v2(0, 0), e.stopAllActions(), d = 24 * ((1 - t) / 2 + r), e.rotation = 180 * Math.atan(d / 60) / i, 
                        e.position = a, e.attachParent(m_iterateLayer, 70), e.runAction(cc.sequence(cc.spawn(cc.rotateTo(.1, 0), cc.moveTo(.1, a.add(cc.v2(d, 60)))), cc.callFunc(function() {
                            e && e.isValid && (e.v = n);
                        }))));
                    }, r = 0; r < t; r++) {
                        var d;
                        s();
                    }
                }.bind(this);
                a(), c.schedule(a, o);
            },
            run: function() {
                this._inited || this.init(), this.runWingman();
                var e = this.itemKey;
                if (e) "ammo" == e ? this.runAmmo() : "gemini" == e && this.runGemini(); else {
                    var t = this.shootInterval, n = this.node.getChildByName("body").height / 2;
                    this.node.getChildByName("body").width;
                    m_data.coolMode ? this.test([ cc.v2(0, n) ], 12, cc.v2(0, 1300), t) : this.test([ cc.v2(0, n) ], this.bulletNum, cc.v2(0, 1300), t);
                }
            },
            runGemini: function() {
                this._inited || this.init();
                var e = this.shootInterval, t = this.node.getChildByName("body").width + 30, n = this.node.getChildByName("body").height / 2;
                m_data.coolMode ? this.test([ cc.v2(0, n), cc.v2(t, n) ], 7, cc.v2(0, 1300), e) : this.test([ cc.v2(0, n), cc.v2(t, n) ], this.bulletNum, cc.v2(0, 1300), e);
            },
            runAmmo: function() {
                this._inited || this.init();
                var e = this.shootInterval, t = this.node.getChildByName("body").height / 2;
                m_data.coolMode ? this.test([ cc.v2(0, t) ], 14, cc.v2(0, 1300), e) : this.test([ cc.v2(0, t) ], 12, cc.v2(0, 1300), e);
            },
            runWingman: function() {
                var e = this.node.getChildByName("wingman1");
                if (e && e.isValid) {
                    var t = e.getComponent("Shoot") || e.addComponent("Shoot");
                    switch (t.unscheduleAllCallbacks(), this._wingmanCode) {
                      case "p1":
                        t.schedule(function() {
                            var e = m_pool.getObject("wingmanBullet1");
                            e && (e.stopAllActions(), e.scaleX = 0, e.position = this.node.position.add(cc.v2(-70, -57)), 
                            e.attachParent(m_iterateLayer, 71), e.runAction(cc.sequence(cc.scaleTo(.1, 1, 1), cc.delayTime(.2), cc.scaleTo(.1, 0, 1), cc.callFunc(function() {
                                e && e.isValid && (e.stopAllActions(), m_pool.pushObject(e));
                            }))));
                            var t = m_pool.getObject("wingmanBullet1");
                            t && (t.stopAllActions(), t.scaleX = 0, t.position = this.node.position.add(cc.v2(70, -57)), 
                            t.attachParent(m_iterateLayer, 71), t.runAction(cc.sequence(cc.scaleTo(.1, 1, 1), cc.delayTime(.2), cc.scaleTo(.1, 0, 1), cc.callFunc(function() {
                                t && t.isValid && (t.stopAllActions(), m_pool.pushObject(t));
                            }))));
                        }.bind(this), 4 * this.wingmanIntervalScale);
                        break;

                      case "p2":
                        var n = i / 2, c = i / 2, a = 1;
                        t.schedule(function() {
                            c -= a * i / 16, (n += a * i / 16) >= 3 * i / 4 ? a = -1 : n <= i / 2 && (a = 1);
                            var e = m_pool.getObject("wingmanBullet2");
                            e && (e.rotation = o(n), e.position = this.node.position.add(cc.v2(-70, -45)), e.v = cc.v2(Math.cos(n), Math.sin(n)).mul(300), 
                            e.attachParent(m_iterateLayer, 71));
                            var t = m_pool.getObject("wingmanBullet2");
                            t && (t.rotation = o(c), t.position = this.node.position.add(cc.v2(70, -45)), t.v = cc.v2(Math.cos(c), Math.sin(c)).mul(300), 
                            t.attachParent(m_iterateLayer, 71));
                        }.bind(this), 1 * this.wingmanIntervalScale);
                        break;

                      case "p3":
                        t.schedule(function() {
                            var e = m_pool.getObject("wingmanBullet3");
                            e && (e.position = this.node.position.add(cc.v2(-70, -61)), e.v = cc.v2(0, 300), 
                            e.attachParent(m_iterateLayer, 71));
                            var t = m_pool.getObject("wingmanBullet3");
                            t && (t.position = this.node.position.add(cc.v2(70, -61)), t.v = cc.v2(0, 300), 
                            t.attachParent(m_iterateLayer, 71));
                        }.bind(this), 4 * this.wingmanIntervalScale);
                        break;

                      case "p4":
                        t.schedule(function() {
                            var e = m_pool.getObject("wingmanBullet4");
                            if (e) {
                                e.position = this.node.position.add(cc.v2(-70, -70));
                                var t = e.x;
                                e.stopAllActions(), e.attachParent(m_iterateLayer, 71), e.runAction(cc.sequence(cc.moveTo(1, cc.v2(t, cc.winSize.height / 2)).easing(cc.easeSineInOut()), cc.delayTime(.3), cc.moveTo(1, cc.v2(t, -cc.winSize.height / 2)).easing(cc.easeSineInOut()), cc.callFunc(function() {
                                    e && e.isValid && (e.stopAllActions(), m_pool.pushObject(e));
                                })));
                            }
                            var n = m_pool.getObject("wingmanBullet4");
                            if (n) {
                                n.position = this.node.position.add(cc.v2(70, -70));
                                var i = n.x;
                                n.stopAllActions(), n.attachParent(m_iterateLayer, 71), n.runAction(cc.sequence(cc.moveTo(1, cc.v2(i, cc.winSize.height / 2)).easing(cc.easeSineInOut()), cc.delayTime(.3), cc.moveTo(1, cc.v2(i, -cc.winSize.height / 2)).easing(cc.easeSineInOut()), cc.callFunc(function() {
                                    n && n.isValid && (n.stopAllActions(), m_pool.pushObject(n));
                                })));
                            }
                        }.bind(this), 4 * this.wingmanIntervalScale);
                        break;

                      case "p5":
                        t.schedule(function() {
                            var e = m_pool.getObject("wingmanBullet5");
                            e && (e.position = this.node.position.add(cc.v2(-70, -140)), e.v = cc.v2(0, 600), 
                            e.attachParent(m_iterateLayer, 71));
                            var t = m_pool.getObject("wingmanBullet5");
                            t && (t.position = this.node.position.add(cc.v2(70, -140)), t.v = cc.v2(0, 600), 
                            t.attachParent(m_iterateLayer, 71));
                        }.bind(this), 1 * this.wingmanIntervalScale);
                    }
                }
            }
        }), cc._RF.pop();
    }, {} ],
    ShaderUtils: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "1e9e8VJKPlP2YT0x3jlzMdo", "ShaderUtils");
        var i = {
            shaderPrograms: {},
            setShader: function(t, n) {
                var i = this.shaderPrograms[n];
                if (!i) {
                    i = new cc.GLProgram();
                    var o = e(cc.js.formatStr("%s.vert", n)), c = e(cc.js.formatStr("%s.frag", n));
                    i.initWithString(o, c), cc.sys.isNative || (i.initWithVertexShaderByteArray(o, c), 
                    i.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION), 
                    i.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR), i.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS)), 
                    i.link(), i.updateUniforms(), this.shaderPrograms[n] = i;
                }
                return t._sgNode.setShaderProgram(i), i;
            }
        };
        t.exports = i, cc._RF.pop();
    }, {} ],
    Shader_Galaxy: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "231fft2tI5JOIuqSWYI1TQu", "Shader_Galaxy");
        e("ShaderUtils");
        cc.Class({
            extends: cc.Component,
            properties: {
                sp: cc.Sprite
            }
        }), cc._RF.pop();
    }, {
        ShaderUtils: "ShaderUtils"
    } ],
    Shield: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "a77b1bxQEhKOZ+HlyMqME3s", "Shield"), cc.Class({
            extends: cc.Component,
            onEnable: function() {
                this.node.opacity = 0, this.node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(.2, 255), cc.fadeTo(.2, 0))));
            },
            onDisable: function() {
                this.node.stopAllActions();
            }
        }), cc._RF.pop();
    }, {} ],
    Shoot: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "02fc1KyrYdPWr99IXdZ41aV", "Shoot"), cc.Class({
            extends: cc.Component
        }), cc._RF.pop();
    }, {} ],
    TaskManager: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "0d027XFmCZBwqjxsX9Y+49Q", "TaskManager"), Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {
                this.concurrency = 5, this.queue = [], this.tasks = [], this.activeCount = 0;
            }
            return e.prototype.push = function(e) {
                var t = this;
                this.tasks.push(new Promise(function(n, i) {
                    var o = function() {
                        t.activeCount++, e().then(function(e) {
                            n(e);
                        }).then(function() {
                            t.next();
                        });
                    };
                    t.activeCount < t.concurrency ? o() : t.queue.push(o);
                }));
            }, e.prototype.all = function() {
                return Promise.all(this.tasks);
            }, e.prototype.next = function() {
                this.activeCount--, this.queue.length > 0 && this.queue.shift()();
            }, e.prototype.addTask = function(e) {
                this.push(function() {
                    return new Promise(function(t, n) {
                        e(function() {
                            t("");
                        }, function() {
                            t("");
                        });
                    });
                });
            }, e.addTask = function(t) {
                null == this.instance && (this.instance = new e()), this.instance.addTask(t);
            }, e.instance = null, e;
        }();
        n.TaskManager = i, cc._RF.pop();
    }, {} ],
    UserData: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "938fbJyQR1MgIlcr/CQ5ODe", "UserData"), Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = e("./GameCommonUtil"), o = function() {
            function e() {
                this.playerId = i.GameCommonUtil.uuid(), this.openId = null, this.sessionKey = null, 
                this.stayTime = 0, this.passPart = 0, this.exports = [], this.clicks = [];
            }
            return e.addExport = function(e, t) {
                if (!(null == e || t <= 0)) {
                    null == this.data.exports && (this.data.exports = []);
                    var n = !1;
                    this.data.exports.forEach(function(i) {
                        null != i && i.targetAppId == e && (n = !0, i.count += t);
                    }), n || this.data.exports.push({
                        targetAppId: e,
                        count: t
                    });
                }
            }, e.addClick = function(e, t) {
                if (!(null == e || t <= 0)) {
                    null == this.data.clicks && (this.data.clicks = []);
                    var n = !1;
                    this.data.clicks.forEach(function(i) {
                        null != i && i.targetAppId == e && (n = !0, i.count = t);
                    }), n || this.data.clicks.push({
                        targetAppId: e,
                        count: t
                    });
                }
            }, e.getJsonStr = function() {
                var e = JSON.stringify(this.data);
                return console.log(e), e;
            }, e.parseFromStr = function(e) {
                if (null != e && "" != e && "string" == typeof e) try {
                    var t = JSON.parse(e);
                    if (null == t) return;
                    null != t.playerId && (this.data.playerId = t.playerId), null != t.openId && (this.data.openId = t.openId), 
                    null != t.sessionKey && (this.data.sessionKey = t.sessionKey), null != t.stayTime && (this.data.stayTime = t.stayTime), 
                    null != t.passPart && (this.data.passPart = t.passPart), null != t.exports && (this.data.exports = t.exports), 
                    null != t.clicks && (this.data.clicks = t.clicks);
                } catch (e) {
                    console.log(e);
                }
            }, e.storageKey = "userData", e.data = new e(), e;
        }();
        n.UserData = o;
        var c = function() {
            function e() {
                this.uuid = null, this.openId = null, this.sourceAppId = null, this.sessionSourceAppId = null;
            }
            return e.KEY = "userStorage", e.data = null, e;
        }();
        n.UserStorage = c, cc._RF.pop();
    }, {
        "./GameCommonUtil": "GameCommonUtil"
    } ],
    WeChatManager: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "54997DRSQtLGY93xtbFN/ox", "WeChatManager"), window.WXI = function() {
            var e = null, t = 0, n = null, i = null, o = null, c = !0, a = null, s = !1, r = {};
            return window.wx && (wx.getOpenDataContext && (a = wx.getOpenDataContext()) && a.canvas, 
            wx.onHide(function(e) {
                console.log("wx onHide", e), t = new Date().getTime();
            }), wx.onShow(function(c) {
                if (console.log("wx onShow", c), AMI.replayBgm(), e && e.hide(), c) {
                    var a = c.query;
                    if (a) {
                        var s = a.uid;
                        s && (console.log("从用户", s, "的分享卡片进入游戏"), WXI.getUid(function() {
                            MCI.shareBy(s);
                        }));
                    }
                }
                (new Date().getTime() - t) / 1e3 >= 3 ? n && n() : i && i(), o && o(), n = null, 
                i = null, o = null;
            })), {
                setStorageSync: function(e, t) {
                    if (window.wx) try {
                        wx.setStorageSync(e, t);
                    } catch (e) {
                        console.log(e.message);
                    }
                },
                removeStorageSync: function(e) {
                    window.wx && wx.removeStorageSync(e);
                },
                getStorageSync: function(e) {
                    try {
                        var t = wx.getStorageSync(e);
                        return void 0 === t || "" === t ? "" : t;
                    } catch (e) {
                        return console.log(e.message), "";
                    }
                },
                initUserLocalData: function() {
                    function e(e, t) {
                        return "" === e || void 0 == e ? t : e;
                    }
                    m_data.level = e(this.getStorageSync("LEVEL"), 0), m_data.coin = e(this.getStorageSync("COIN"), 0), 
                    m_data.diamond = e(this.getStorageSync("DIAMOND"), 0), m_data.collect = e(this.getStorageSync("COLLECT"), {
                        f: "p1"
                    }), m_data.plane = e(this.getStorageSync("PLANE"), {
                        s: 0,
                        p: 0
                    }), m_data.vibrate = e(this.getStorageSync("VIBRATE"), "1"), m_data.sound = e(this.getStorageSync("SOUND"), "1"), 
                    this.initPlaceData(), this.initEnergy(), this.initMerchant(), this.test();
                },
                initEnergy: function() {
                    var e = this.getStorageSync("ENERGYDATESTR");
                    if (void 0 == e || "" === e) console.log("无能量槽时间戳 用户能量重置"), m_data.energy = 80, 
                    this.setStorageSync("ENERGYDATESTR", new Date().toDateString()), this.setStorageSync("ENERGY", m_data.energy); else if (new Date().toDateString() != e) console.log("有能量槽时间戳 不同的一天 用户能量重置"), 
                    m_data.energy = 80, this.setStorageSync("ENERGYDATESTR", new Date().toDateString()), 
                    this.setStorageSync("ENERGY", m_data.energy); else {
                        var t = this.getStorageSync("ENERGY");
                        void 0 != t && "" != t ? m_data.energy = t : (m_data.energy = 80, this.setStorageSync("ENERGYDATESTR", new Date().toDateString()), 
                        this.setStorageSync("ENERGY", m_data.energy));
                    }
                },
                test: function() {},
                saveUserLocalData: function() {
                    this.setStorageSync("LEVEL", m_data.level), this.setStorageSync("DIAMOND", m_data.diamond), 
                    this.setStorageSync("ENERGY", m_data.energy), this.setStorageSync("COLLECT", m_data.collect), 
                    this.setStorageSync("PLANE", m_data.plane), NaN == m_data.coin && this.setStorageSync("COIN", 1e5), 
                    this.setStorageSync("COIN", m_data.coin);
                },
                initPlaceData: function() {
                    var e = this.getStorageSync("PLACESTAMP");
                    if ("" === e || void 0 == e) e = new Date().getTime(), this.setStorageSync("PLACESTAMP", e); else {
                        var t = new Date().getTime();
                        t < e && (console.log("当前时间小于过去时间?重置放置时间戳"), this.setStorageSync("PLACESTAMP", t));
                    }
                    return this.getStorageSync("PLACESTAMP");
                },
                countPlaceEarnings: function() {
                    var e = this.getStorageSync("PLACESTAMP"), t = new Date().getTime();
                    "" !== e && void 0 != e || (this.setStorageSync("PLACESTAMP", t), e = t);
                    var n = parseInt((t - e) / 1e3);
                    n < 0 ? n = 0 : n > 86400 && (n = 86400);
                    var i = parseInt((86400 - n) / 3600), o = parseInt((86400 - n) / 60 % 60), c = this.getStorageSync("isSpeed");
                    if ("" !== c && void 0 != c || (this.setStorageSync("isSpeed", !1), c = !1), c) {
                        var a = this.getStorageSync("SPEEDTIME"), s = this.getStorageSync("SPEEDTOTAL");
                        s - a < n && (a = s, this.setStorageSync("SPEEDTIME", s));
                    }
                    var r = {
                        num: parseInt(n / 10),
                        str: (i < 10 ? "0" + i : i) + ":" + (o < 10 ? "0" + o : o),
                        percent: cc.misc.clampf(n / 86400, 0, 1),
                        speed: parseInt(a / 10) || null
                    };
                    return console.log("放置数据:", r), r;
                },
                share: function() {
                    if (window.wx) {
                        var e = m_data.shareImageList, t = e[Math.floor(Math.random() * e.length)];
                        console.log(t);
                        var n = t.query || "", i = t.text || "鍝囷紒绔熺劧鏈変汉鍒锋柊浜嗕綘鐨勮褰曪紝璧剁揣鍘绘暀璁粬锛?", o = (t.type, 
                        t.url || "https://g.snsfun.com/data/uploads/201901/5c4fc2b8047bb.jpg");
                        wx.shareAppMessage({
                            title: i,
                            imageUrl: o,
                            query: n
                        });
                    }
                },
                share3Seconds: function(e, t, c) {
                    if (window.wx) {
                        var a = {}, s = a.query || "", r = a.text || "哇！竟然有人刷新了你的记录，赶紧去教训他！", d = a.url || "https://g.snsfun.com/data/uploads/201901/5c4fc2b8047bb.jpg";
                        n = e, i = t, o = c, AMI.closeMusic(), wx.shareAppMessage({
                            title: r,
                            imageUrl: d,
                            query: s
                        });
                    }
                },
                shareWithUid: function() {
                    if (window.wx) {
                        wx.shareAppMessage({
                            title: "哇！竟然有人刷新了你的记录，赶紧去教训他！",
                            imageUrl: "https://g.snsfun.com/data/uploads/201901/5c4fc2b8047bb.jpg",
                            query: "uid=" + m_data.uid
                        });
                    }
                },
                showBanner: function() {
                    if (!e && window.wx && wx.createBannerAd) {
                        var t = wx.getSystemInfoSync();
                        t.screenWidth, t.screenHeight;
                        e = shareSdk.showbanner({
                            left: 0,
                            top: 0,
                            width: 300
                        });
                    }
                    e && e.show();
                },
                hideBanner: function() {
                    e && e.hide();
                },
                createInterAD: function(e, t, n) {
                    if (window.wx && wx.createInterstitialAd) {
                        var i = wx.createInterstitialAd({
                            adUnitId: "adunit-d62d7d2cf42cf272"
                        });
                        i.onLoad(function() {
                            wx.aldSendEvent("运气好进入广告的玩家数");
                        }), i.onError(function() {}), i.onClose(function() {
                            i.offLoad(), i.offError(), i.offClose(), null != e && e();
                        }), i.show();
                    }
                },
                createVideo: function(e, t, n) {
                    if (n = n || "adunit-09ff2e4b8f014f63", window.wx && wx.createRewardedVideoAd) {
                        var i = wx.createRewardedVideoAd({
                            adUnitId: n
                        });
                        i.onError(function(e) {}), i.load().then(function() {
                            AMI.closeMusic(), i.show();
                        }).catch(function(e) {
                            pop("视频播放失败");
                        }), i.onClose(function(n) {
                            i.offClose(), AMI.openMusic(), AMI.replayBgm(), n && n.isEnded || void 0 === n ? e && e() : t && t();
                        });
                    } else pop("微信版本过低");
                },
                aldSendEvent: function(e, t) {
                    if (window.wx && wx.aldSendEvent) {
                        if (void 0 === e) return;
                        void 0 === t ? (console.log("aldSendEvent:", e), wx.aldSendEvent(e)) : (console.log("aldSendEvent:", e, t), 
                        wx.aldSendEvent(e, t));
                    }
                },
                navigateToMiniProgram_7thAv: function(e) {
                    if (e && window.wx) {
                        var t = e.appid, n = e.path;
                        wx.navigateToMiniProgram && wx.navigateToMiniProgram({
                            appId: t,
                            path: n
                        });
                    }
                },
                vibrateShort: function() {
                    c && !s && window.wx && wx.vibrateShort && (wx.vibrateShort(), s = !0, setTimeout(function() {
                        s = !1;
                    }, 10));
                },
                vibrateLong: function() {
                    c && window.wx && wx.vibrateLong && wx.vibrateLong();
                },
                openVibrate: function() {
                    c = !0;
                },
                closeVibrate: function() {
                    c = !1;
                },
                postMessage: function(e) {
                    window.wx && wx.getOpenDataContext && wx.getOpenDataContext().postMessage(e);
                },
                setSharedCanvasSize: function(e, t) {
                    if (window.wx && wx.getOpenDataContext) {
                        var n = wx.getOpenDataContext();
                        if (n) {
                            var i = n.canvas;
                            i && (i.width = e, i.height = t);
                        }
                    }
                },
                getUid: function(e) {
                    if (window.wx) {
                        var t = WXI.getStorageSync("UID");
                        void 0 === t || "" === t ? window.wx && wx.login({
                            success: function(n) {
                                var i = {
                                    gameid: 53,
                                    jscode: n.code
                                };
                                wx.request({
                                    url: "https://account.api.snsfun.com/XyxApi/aloneuid",
                                    data: i,
                                    success: function(t) {
                                        var n = !1;
                                        if (t && 200 == t.statusCode && t.data && t.data.data) {
                                            var i = t.data.data, o = i.uid;
                                            i.isnew;
                                            o && (m_data.uid = o, WXI.removeStorageSync("SHARELIST"), MCI.setContent(o, {}), 
                                            n = !0, e && e());
                                        }
                                        n || setTimeout(function() {
                                            WXI.getUid(e);
                                        }, 1e3);
                                    },
                                    fail: function() {
                                        setTimeout(function() {
                                            m_data.uid = "", WXI.removeStorageSync("SHARELIST"), MCI.setContent(t, {}), e && e();
                                        }, 1e3);
                                    }
                                });
                            },
                            fail: function() {
                                setTimeout(function() {
                                    WXI.getUid(e);
                                }, 1e3);
                            }
                        }) : (m_data.uid = t, console.log("用户的uid:", t), e && e());
                    } else e();
                },
                initMerchant: function() {
                    if (window.wx) {
                        var e = {}, t = "", n = wx.getLaunchOptionsSync();
                        if (void 0 != n.query.chid && (r.chid = n.query.chid), void 0 != n.query.sid && (r.sid = n.query.sid), 
                        void 0 != n.referrerInfo && void 0 != n.referrerInfo.appId && (r.fromid = n.referrerInfo.appId), 
                        1038 == n.scene ? 0 : 1037 == n.scene && (void 0 != n.referrerInfo.extraData.toid && n.referrerInfo.extraData.toid, 
                        2, void 0 != n.referrerInfo.extraData.hsts && (1 == n.referrerInfo.extraData.hsts ? 1 : 2)), 
                        void 0 != n.query.scene) {
                            var i = decodeURIComponent(n.query.scene);
                            if (t = i, -1 != i.indexOf("&")) {
                                var o = i.split("&");
                                for (var c in o) {
                                    var a = o[c].split("=");
                                    e[a[0]] = a[1];
                                }
                                r.chid = e.chid, r.sid = e.sid;
                            } else if (-1 != i.indexOf(";")) {
                                var s = i.split(";");
                                t = s[0], s[1], 2;
                            }
                            wx.setStorageSync("mescene", t);
                        }
                        r.mescene = wx.getStorageSync("mescene"), this.merchantLogin();
                    }
                },
                merchantLogin: function() {
                    window.wx && wx.login({
                        success: function(e) {
                            console.log("wx login success", e);
                            var t = e.code;
                            t && wx.request({
                                url: "https://dev.xcx.snsfun.com/xcxApi/login",
                                data: {
                                    method: "GET",
                                    jscode: t,
                                    gid: 69,
                                    channel: r.mescene || 0,
                                    chid: r.chid || 0,
                                    fromid: r.fromid || 0,
                                    sid: r.sid || 0
                                }
                            });
                        }
                    });
                }
            };
        }(), cc._RF.pop();
    }, {} ],
    WebSDK: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "62830zPR29KgqYgnUUfL998", "WebSDK"), Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {}
            return e.prototype.getLaunchOptions = function() {
                return null;
            }, e.prototype.appGameOnLanch = function() {}, e.prototype.wxInitData = function() {}, 
            e.prototype.setStorage = function(e, t) {}, e.prototype.getStorage = function(e) {
                return null;
            }, e.prototype.baseShareMsg = function(e, t, n) {}, e;
        }();
        n.WebSDK = i, cc._RF.pop();
    }, {} ],
    WingmanBullet1: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "4a7126iSB5CCIeRFvorxNi8", "WingmanBullet1"), cc.Class({
            extends: cc.Component
        }), cc._RF.pop();
    }, {} ],
    WingmanBullet2: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "a82f1+9B8ROqIst9Yv6wnXy", "WingmanBullet2"), cc.Class({
            extends: cc.Component
        }), cc._RF.pop();
    }, {} ],
    WingmanBullet3: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "03249IIm3hBW6I/E7Z0B0tb", "WingmanBullet3"), cc.Class({
            extends: cc.Component,
            onCollisionEnter: function(e, t) {
                var n = e.node;
                if (n && n.isValid) {
                    var i = n.position, o = m_pool.getObject("wingmanBullet3_test");
                    o && (o.scale = 1.7, o.opacity = 255, o.position = i, o.attachParent(m_iterateLayer, 71), 
                    o.runAction(cc.sequence(cc.scaleTo(.1, 3).easing(cc.easeSineInOut()), cc.delayTime(.1), cc.fadeTo(.2, 0).easing(cc.easeSineInOut()), cc.callFunc(function() {
                        o && m_pool.pushObject(o);
                    }))));
                }
            }
        }), cc._RF.pop();
    }, {} ],
    WingmanBullet4: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "6ab68vWS41K1pZUKkR5xZAF", "WingmanBullet4"), cc.Class({
            extends: cc.Component
        }), cc._RF.pop();
    }, {} ],
    WingmanBullet5: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "a2798L1abpKEKwnTh+bsmka", "WingmanBullet5"), cc.Class({
            extends: cc.Component,
            onCollisionEnter: function(e, t) {
                var n = this.node.position, i = m_pool.getObject("wingmanBullet5_test");
                i && (i.rotation = -90, i.position = n.add(cc.v2(0, 100)), i.v = cc.v2(-300, 0), 
                i.attachParent(m_iterateLayer, 70));
                var o = m_pool.getObject("wingmanBullet5_test");
                o && (o.rotation = 90, o.position = n.add(cc.v2(0, 100)), o.v = cc.v2(300, 0), o.attachParent(m_iterateLayer, 70));
            }
        }), cc._RF.pop();
    }, {} ],
    WingmanControl: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "e6af9SoyzpFNp+Qk3AVciux", "WingmanControl"), cc.Class({
            extends: cc.Component,
            properties: {},
            run: function(e) {
                var t = this["shoot" + e];
                t && (this.unscheduleAllCallbacks(), t());
            },
            shoot1: function() {
                this.schedule(function() {}.bind(this), 2);
            },
            shoot2: function() {
                this.schedule(function() {}, .01);
            },
            shoot3: function() {
                this.schedule(function() {}.bind(this), 3);
            },
            shoot4: function() {
                this.schedule(function() {}.bind(this), 3);
            },
            shoot5: function() {
                this.schedule(function() {}.bind(this), 3);
            }
        }), cc._RF.pop();
    }, {} ],
    WxSDK: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "590caloEqlFUIMz001j6C4a", "WxSDK"), Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = e("../GameCommon"), o = e("../UserData"), c = e("../LaunchOption"), a = e("../TaskManager"), s = e("../GameCommonUtil"), r = function() {
            function e() {
                this.launchUpload = !1, this.lastOnShowTime = 0, this.keepScreenOn(), this.showShareMenu();
            }
            return e.prototype.keepScreenOn = function() {
                "function" == typeof wx.setKeepScreenOn && wx.setKeepScreenOn({
                    keepScreenOn: !0
                });
            }, e.prototype.showShareMenu = function() {
                "function" == typeof wx.showShareMenu && wx.showShareMenu({
                    withShareTicket: !0
                });
            }, e.prototype.setStorage = function(e, t) {
                wx.setStorage({
                    key: e,
                    data: t
                });
            }, e.prototype.getStorage = function(e) {
                return wx.getStorageSync(e);
            }, e.prototype.getLaunchOptions = function() {
                return wx.getLaunchOptionsSync();
            }, e.prototype.uploadLoginRecord = function() {
                console.log("uploadLoginRecord"), o.UserData.data.sessionKey ? a.TaskManager.addTask(this.checkSessionTask.bind(this)) : a.TaskManager.addTask(this.loginTask.bind(this));
            }, e.prototype.uploadLoginTask = function(t, n) {
                var a = this, r = this.getStorage(o.UserStorage.KEY);
                r && "" !== r ? (o.UserStorage.data = JSON.parse(r), c.LaunchPacket.data.needUserStorage = !1, 
                c.LaunchPacket.data.needOpenId = null == o.UserData.data.openId) : (c.LaunchPacket.data.needUserStorage = !0, 
                c.LaunchPacket.data.needOpenId = !0), c.LaunchPacket.data.uuid = o.UserData.data.playerId, 
                c.LaunchPacket.data.sessionSourceAppId = c.LaunchOption.data.sessionSourceAppId, 
                c.LaunchPacket.data.sourceAppId = c.LaunchOption.data.sourceAppId;
                var d = e.PlayerLaunchRecordUrl + i.GameCommon.WxAppId, l = {};
                l.needUserStorage = c.LaunchPacket.data.needUserStorage, l.needOpenId = c.LaunchPacket.data.needOpenId, 
                l.code = c.LaunchPacket.data.code, l.uuid = c.LaunchPacket.data.uuid, l.sourceAppId = c.LaunchPacket.data.sourceAppId, 
                l.sessionSourceAppId = c.LaunchPacket.data.sessionSourceAppId;
                s.GameCommonUtil.wxHttpPost(d, l, function(e, i) {
                    0 == e ? (t && t(), i && i.data && (i.data.sessionKey && (o.UserData.data.sessionKey = i.data.sessionKey), 
                    i.data.userStorage && (o.UserStorage.data = i.data.userStorage, a.setStorage(o.UserStorage.KEY, JSON.stringify(o.UserStorage.data)), 
                    o.UserStorage.data.uuid && (o.UserData.data.playerId = o.UserStorage.data.uuid), 
                    o.UserStorage.data.openId && (o.UserData.data.openId = o.UserStorage.data.openId)))) : n && n();
                });
            }, e.prototype.checkSessionTask = function(e, t) {
                console.log("checkSessionTask");
                var n = this;
                wx.checkSession({
                    success: function() {
                        e && e(), a.TaskManager.addTask(n.uploadLoginTask.bind(n));
                    },
                    fail: function() {
                        t && t(), a.TaskManager.addTask(n.loginTask.bind(n));
                    }
                });
            }, e.prototype.loginTask = function(e, t) {
                console.log("loginTask");
                var n = this;
                wx.login({
                    success: function(t) {
                        e && e(), console.log("wxLogin succ  res.code is : " + t.code), c.LaunchPacket.data.code = t.code, 
                        a.TaskManager.addTask(n.uploadLoginTask.bind(n));
                    },
                    fail: function(e) {
                        t && t(), wx.showModal({
                            title: "登陆失败",
                            content: "请检查网络后重试~",
                            showCancel: !1,
                            cancelText: "取消",
                            confirmText: "确定",
                            success: function(e) {
                                e.confirm ? a.TaskManager.addTask(n.loginTask.bind(n)) : a.TaskManager.addTask(n.uploadLoginTask.bind(n));
                            },
                            fail: function() {
                                a.TaskManager.addTask(n.uploadLoginTask.bind(n));
                            }
                        });
                    }
                });
            }, e.prototype.uploadEvent = function() {
                if (o.UserStorage.data) {
                    var t = {};
                    if (t.uuid = o.UserData.data.playerId, t.stayTime = o.UserData.data.stayTime, o.UserData.data.passPart > 0) {
                        var n = [];
                        n.push({
                            code: "passPart",
                            value: o.UserData.data.passPart
                        }), t.events = n;
                    }
                    null != o.UserData.data.exports && o.UserData.data.exports.length > 0 && (t.exports = o.UserData.data.exports), 
                    null != o.UserData.data.clicks && o.UserData.data.clicks.length > 0 && (t.clicks = o.UserData.data.clicks), 
                    o.UserData.data.stayTime = 0, o.UserData.data.passPart = 0, o.UserData.data.exports = [], 
                    o.UserData.data.clicks = [];
                    a.TaskManager.addTask(function(n, o) {
                        var c = e.UploadEventUrl + i.GameCommon.WxAppId;
                        s.GameCommonUtil.wxHttpPost(c, t, function(e, t) {
                            0 == e ? n && n() : o && o();
                        });
                    }.bind(this));
                }
            }, e.prototype.appGameOnLanch = function() {
                if (!this.launchUpload) {
                    this.launchUpload = !0, this.lastOnShowTime = Date.now();
                    var e = this.getLaunchOptions();
                    if (e && e.query) {
                        var t = e.query, n = c.LaunchOption.data;
                        n.sessionSourceAppId = t.sessionSourceAppId;
                        var o = e.referrerInfo ? e.referrerInfo.appId : null, a = e.referrerInfo && e.referrerInfo.extraData ? e.referrerInfo.extraData.appid : null;
                        null != o && a == i.GameCommon.WxAppId && (o = a), null == o && t.sappid && (o = t.sappid), 
                        n.sourceAppId = o, console.log("appGameOnLanch"), this.uploadLoginRecord();
                    } else this.uploadLoginRecord();
                }
            }, e.prototype.wxInitData = function() {
                var e = this, t = window.gameCommon.getSDK.getStorage(o.UserData.storageKey);
                t && "" !== t && o.UserData.parseFromStr(t);
                var n = function(t) {
                    return {
                        title: "",
                        imageUrl: "",
                        query: e.getQueryParam(null)
                    };
                };
                "function" != typeof wx.aldOnShareAppMessage ? wx.onShareAppMessage(n) : wx.aldOnShareAppMessage(n), 
                wx.onHide(function() {
                    0 != e.lastOnShowTime && (o.UserData.data.stayTime = Math.round((Date.now() - e.lastOnShowTime) / 1e3), 
                    e.lastOnShowTime = 0), e.uploadEvent(), e.setStorage(o.UserData.storageKey, o.UserData.getJsonStr());
                }), wx.onShow(function(t) {
                    e.lastOnShowTime = Date.now();
                });
            }, e.prototype.baseShareMsg = function(e, t, n) {
                var i = {
                    title: e,
                    imageUrl: t,
                    query: this.getQueryParam(n)
                };
                "function" == typeof wx.aldShareAppMessage ? wx.aldShareAppMessage(i) : wx.shareAppMessage(i);
            }, e.prototype.getQueryParam = function(e) {
                var t = "";
                return null != o.UserStorage.data && (t = t + "&sessionSourceAppId=" + o.UserStorage.data.sourceAppId), 
                null != e && (t = t + "&" + e), t;
            }, e.PlayerLaunchRecordUrl = "https://hfws.dcatgame.com/statistic-service/launch/", 
            e.UploadEventUrl = "https://hfws.dcatgame.com/statistic-service/upload/", e;
        }();
        n.WxSDK = r, cc._RF.pop();
    }, {
        "../GameCommon": "GameCommon",
        "../GameCommonUtil": "GameCommonUtil",
        "../LaunchOption": "LaunchOption",
        "../TaskManager": "TaskManager",
        "../UserData": "UserData"
    } ],
    "galaxy.frag": [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "525dbuMZWJH34J7vOTqyc3B", "galaxy.frag"), t.exports = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec2 v_texCoord;\nuniform float sys_time;\nvoid main()\n{\n    vec4 src_color = texture2D(CC_Texture0, v_texCoord).rgba;\n    float width = 0.2;\n    float start = sys_time * 1.2;\n    float strength = 0.02;\n    float offset = 0.2;\n\n    if( v_texCoord.x < (start - offset * v_texCoord.y) &&  v_texCoord.x > (start - offset * v_texCoord.y - width))\n    {\n        vec3 improve = strength * vec3(255, 255, 255);\n        vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);\n        gl_FragColor = vec4(result, src_color.a);\n\n    } else {\n        gl_FragColor = src_color;\n    }\n}\n", 
        cc._RF.pop();
    }, {} ],
    "galaxy.vert": [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "66a42pJntBB3JK21nGEO8be", "galaxy.vert"), t.exports = "\nattribute vec4 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\nvarying vec2 v_texCoord;\nvarying vec4 v_fragmentColor;\nvoid main()\n{\n    gl_Position = CC_PMatrix * a_position;\n    v_fragmentColor = a_color;\n    v_texCoord = a_texCoord;\n}\n", 
        cc._RF.pop();
    }, {} ],
    md5: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "26d0bRjBNxHo6V2t0wCNI5j", "md5"), window.m_encoder = function() {
            var e = function(e, t) {
                return e << t | e >>> 32 - t;
            }, t = function(e, t) {
                var n, i, o, c, a;
                return o = 2147483648 & e, c = 2147483648 & t, a = (1073741823 & e) + (1073741823 & t), 
                (n = 1073741824 & e) & (i = 1073741824 & t) ? 2147483648 ^ a ^ o ^ c : n | i ? 1073741824 & a ? 3221225472 ^ a ^ o ^ c : 1073741824 ^ a ^ o ^ c : a ^ o ^ c;
            }, n = function(n, i, o, c, a, s, r) {
                return n = t(n, t(t(function(e, t, n) {
                    return e & t | ~e & n;
                }(i, o, c), a), r)), t(e(n, s), i);
            }, i = function(n, i, o, c, a, s, r) {
                return n = t(n, t(t(function(e, t, n) {
                    return e & n | t & ~n;
                }(i, o, c), a), r)), t(e(n, s), i);
            }, o = function(n, i, o, c, a, s, r) {
                return n = t(n, t(t(function(e, t, n) {
                    return e ^ t ^ n;
                }(i, o, c), a), r)), t(e(n, s), i);
            }, c = function(n, i, o, c, a, s, r) {
                return n = t(n, t(t(function(e, t, n) {
                    return t ^ (e | ~n);
                }(i, o, c), a), r)), t(e(n, s), i);
            }, a = function(e) {
                var t, n = "", i = "";
                for (t = 0; t <= 3; t++) n += (i = "0" + (e >>> 8 * t & 255).toString(16)).substr(i.length - 2, 2);
                return n;
            };
            return {
                md5: function(e) {
                    var s, r, d, l, h, m, p, u, v, g = Array();
                    for (g = function(e) {
                        for (var t, n = e.length, i = n + 8, o = 16 * ((i - i % 64) / 64 + 1), c = Array(o - 1), a = 0, s = 0; s < n; ) a = s % 4 * 8, 
                        c[t = (s - s % 4) / 4] = c[t] | e.charCodeAt(s) << a, s++;
                        return a = s % 4 * 8, c[t = (s - s % 4) / 4] = c[t] | 128 << a, c[o - 2] = n << 3, 
                        c[o - 1] = n >>> 29, c;
                    }(e = function(e) {
                        e = e.replace(/\x0d\x0a/g, "\n");
                        for (var t = "", n = 0; n < e.length; n++) {
                            var i = e.charCodeAt(n);
                            i < 128 ? t += String.fromCharCode(i) : i > 127 && i < 2048 ? (t += String.fromCharCode(i >> 6 | 192), 
                            t += String.fromCharCode(63 & i | 128)) : (t += String.fromCharCode(i >> 12 | 224), 
                            t += String.fromCharCode(i >> 6 & 63 | 128), t += String.fromCharCode(63 & i | 128));
                        }
                        return t;
                    }(e)), m = 1732584193, p = 4023233417, u = 2562383102, v = 271733878, s = 0; s < g.length; s += 16) r = m, 
                    d = p, l = u, h = v, m = n(m, p, u, v, g[s + 0], 7, 3614090360), v = n(v, m, p, u, g[s + 1], 12, 3905402710), 
                    u = n(u, v, m, p, g[s + 2], 17, 606105819), p = n(p, u, v, m, g[s + 3], 22, 3250441966), 
                    m = n(m, p, u, v, g[s + 4], 7, 4118548399), v = n(v, m, p, u, g[s + 5], 12, 1200080426), 
                    u = n(u, v, m, p, g[s + 6], 17, 2821735955), p = n(p, u, v, m, g[s + 7], 22, 4249261313), 
                    m = n(m, p, u, v, g[s + 8], 7, 1770035416), v = n(v, m, p, u, g[s + 9], 12, 2336552879), 
                    u = n(u, v, m, p, g[s + 10], 17, 4294925233), p = n(p, u, v, m, g[s + 11], 22, 2304563134), 
                    m = n(m, p, u, v, g[s + 12], 7, 1804603682), v = n(v, m, p, u, g[s + 13], 12, 4254626195), 
                    u = n(u, v, m, p, g[s + 14], 17, 2792965006), p = n(p, u, v, m, g[s + 15], 22, 1236535329), 
                    m = i(m, p, u, v, g[s + 1], 5, 4129170786), v = i(v, m, p, u, g[s + 6], 9, 3225465664), 
                    u = i(u, v, m, p, g[s + 11], 14, 643717713), p = i(p, u, v, m, g[s + 0], 20, 3921069994), 
                    m = i(m, p, u, v, g[s + 5], 5, 3593408605), v = i(v, m, p, u, g[s + 10], 9, 38016083), 
                    u = i(u, v, m, p, g[s + 15], 14, 3634488961), p = i(p, u, v, m, g[s + 4], 20, 3889429448), 
                    m = i(m, p, u, v, g[s + 9], 5, 568446438), v = i(v, m, p, u, g[s + 14], 9, 3275163606), 
                    u = i(u, v, m, p, g[s + 3], 14, 4107603335), p = i(p, u, v, m, g[s + 8], 20, 1163531501), 
                    m = i(m, p, u, v, g[s + 13], 5, 2850285829), v = i(v, m, p, u, g[s + 2], 9, 4243563512), 
                    u = i(u, v, m, p, g[s + 7], 14, 1735328473), p = i(p, u, v, m, g[s + 12], 20, 2368359562), 
                    m = o(m, p, u, v, g[s + 5], 4, 4294588738), v = o(v, m, p, u, g[s + 8], 11, 2272392833), 
                    u = o(u, v, m, p, g[s + 11], 16, 1839030562), p = o(p, u, v, m, g[s + 14], 23, 4259657740), 
                    m = o(m, p, u, v, g[s + 1], 4, 2763975236), v = o(v, m, p, u, g[s + 4], 11, 1272893353), 
                    u = o(u, v, m, p, g[s + 7], 16, 4139469664), p = o(p, u, v, m, g[s + 10], 23, 3200236656), 
                    m = o(m, p, u, v, g[s + 13], 4, 681279174), v = o(v, m, p, u, g[s + 0], 11, 3936430074), 
                    u = o(u, v, m, p, g[s + 3], 16, 3572445317), p = o(p, u, v, m, g[s + 6], 23, 76029189), 
                    m = o(m, p, u, v, g[s + 9], 4, 3654602809), v = o(v, m, p, u, g[s + 12], 11, 3873151461), 
                    u = o(u, v, m, p, g[s + 15], 16, 530742520), p = o(p, u, v, m, g[s + 2], 23, 3299628645), 
                    m = c(m, p, u, v, g[s + 0], 6, 4096336452), v = c(v, m, p, u, g[s + 7], 10, 1126891415), 
                    u = c(u, v, m, p, g[s + 14], 15, 2878612391), p = c(p, u, v, m, g[s + 5], 21, 4237533241), 
                    m = c(m, p, u, v, g[s + 12], 6, 1700485571), v = c(v, m, p, u, g[s + 3], 10, 2399980690), 
                    u = c(u, v, m, p, g[s + 10], 15, 4293915773), p = c(p, u, v, m, g[s + 1], 21, 2240044497), 
                    m = c(m, p, u, v, g[s + 8], 6, 1873313359), v = c(v, m, p, u, g[s + 15], 10, 4264355552), 
                    u = c(u, v, m, p, g[s + 6], 15, 2734768916), p = c(p, u, v, m, g[s + 13], 21, 1309151649), 
                    m = c(m, p, u, v, g[s + 4], 6, 4149444226), v = c(v, m, p, u, g[s + 11], 10, 3174756917), 
                    u = c(u, v, m, p, g[s + 2], 15, 718787259), p = c(p, u, v, m, g[s + 9], 21, 3951481745), 
                    m = t(m, r), p = t(p, d), u = t(u, l), v = t(v, h);
                    return (a(m) + a(p) + a(u) + a(v)).toLowerCase();
                }
            };
        }(), cc._RF.pop();
    }, {} ],
    shareSdk: [ function(e, t, n) {
        "use strict";
        cc._RF.push(t, "2df91uKce1A9oHX0yoFUzLO", "shareSdk");
        var i = window.wx, o = cc.Class({
            properties: {
                imgurl: "share/share.png",
                text: "快来全部吃掉这些可爱的布丁吧!",
                query: "",
                gameid_g: 53,
                v: "190923",
                adUnitId: "adunit-ae87cf508603c0a4",
                bannerId: "adunit-544eaa26ad569888",
                myGame: !1,
                isSouSuo: !1,
                isQuery: !1,
                sh: !1,
                isQuYu: !0,
                isEwm: !1,
                isSwitch: !1,
                isBannerClick: !1,
                isVideoing: !1,
                isShareing: !1,
                isAding: !1,
                isBanner: !1
            },
            ctor: function() {
                if (this.imgList = [], i) {
                    this.wx = i;
                    var e = this;
                    this.wx.onShow(function(t) {
                        e.query = t.query, console.log("-------onshow------", t), e.shareTicket = t.shareTicket, 
                        1103 != t.scene && 1104 != t.scene || (e.myGame = !0), 1005 != t.scene && 1006 != t.scene || (e.isSouSuo = !0), 
                        1011 != t.scene && 1012 != t.scene && 1013 != t.scene || (e.isEwm = !0), e.isVideoing || e.isShareing || e.isAding || !e.isBanner ? (e.isVideoing = !1, 
                        e.isShareing = !1, e.isAding = !1) : e.bannerclick(), e.shareCB && e.shareCB();
                    }), this.wx.onHide(function(e) {
                        console.log("-------------onHide--------------");
                    }), this.showShareMenu(), this.initWX(), this.shareInfo(), this.onShareAppMessage();
                }
            },
            shareInfo: function() {
                var e = this;
                i.request({
                    url: "https://account.api.snsfun.com/XyxApi/shstatus",
                    data: {
                        gameid: e.gameid_g,
                        v: e.v
                    },
                    success: function(t) {
                        e.sh = t.data, i.request({
                            url: "https://account.api.snsfun.com/XyxApi/share",
                            data: {
                                gameid: e.gameid_g,
                                sh: t.data
                            },
                            success: function(t) {
                                e.imgList = t.data;
                            }
                        });
                    }
                }), i.request({
                    url: "https://account.api.snsfun.com/Gamecustom/shield",
                    data: {
                        gameid: e.gameid_g
                    },
                    success: function(t) {
                        e.isQuYu = t.data;
                    }
                }), i.request({
                    url: "https://account.api.snsfun.com/XyxApi/custom",
                    data: {
                        gameid: e.gameid_g
                    },
                    success: function(t) {
                        e.isSwitch = Math.floor(t.data.switch), i.request({
                            url: "https://account.api.snsfun.com/bannerclick/findParam",
                            data: {
                                game_id: e.gameid_g
                            },
                            success: function(n) {
                                Math.floor(n.data.click) / Math.floor(n.data.exposure) * 100 > t.data.banner && (e.isBannerClick = !0);
                            }
                        });
                    }
                });
            },
            initWX: function(e) {
                if (window.wx) {
                    var t = i.getLaunchOptionsSync();
                    Object.keys(t.query).length;
                }
            },
            showShareMenu: function() {
                this.wx.showShareMenu({
                    withShareTicket: !0
                });
            },
            onShareAppMessage: function() {
                this.imgList || (this.imgList = []);
                var e = this.imgList.length, t = Math.floor(Math.random() * e), n = this.imgList[t];
                n || (n = {
                    str: this.text,
                    img: this.imgurl
                });
                var i = n.text, o = n.url;
                this.wx.aldOnShareAppMessage ? this.wx.aldOnShareAppMessage(function() {
                    return {
                        title: i,
                        imageUrl: o
                    };
                }) : this.wx.onShareAppMessage(function() {
                    return {
                        title: i,
                        imageUrl: o
                    };
                });
            },
            aldSendCustomEvent: function(e, t, n) {
                if (this.wx.aldSendCustomEvent) {
                    null == e && (e = "title"), null == t && (t = "key"), null == n && (n = "value");
                    var i = {};
                    i[t] = n, this.wx.aldSendCustomEvent && this.wx.aldSendCustomEvent(e, i);
                }
            },
            shareAppMessage: function(e, t, n) {
                if (window.wx) if (this.sh || this.isSouSuo || this.isQuery || !this.isQuYu) this.createVideoAd(e, t); else {
                    var i = this.wx.getSystemInfoSync().windowWidth, o = this.wx.getSystemInfoSync().windowHeight, c = this;
                    this.imgList || (this.imgList = []);
                    var a = this.imgList.length, s = Math.floor(Math.random() * a), r = this.imgList[s];
                    r || (r = {
                        str: this.text,
                        img: this.imgurl,
                        query: this.query
                    });
                    var d = r.text, l = r.url;
                    n || (n = r.query), this.shareIndex || (this.shareIndex = 0), this.shareIndex++, 
                    this.aldSendCustomEvent("分享总次数", "share", this.shareIndex), this.isShareing = !0, 
                    this.wx.aldShareAppMessage ? this.wx.aldShareAppMessage({
                        title: d || c.text,
                        imageUrl: l || canvas.toTempFilePathSync({
                            x: 0,
                            y: .3 * o,
                            width: i,
                            height: .6 * o,
                            destWidth: i,
                            destHeight: .6 * o
                        }),
                        query: n || ""
                    }) : this.wx.shareAppMessage({
                        title: d || c.text,
                        imageUrl: l || canvas.toTempFilePathSync({
                            x: 0,
                            y: .3 * o,
                            width: i,
                            height: .6 * o,
                            destWidth: i,
                            destHeight: .6 * o
                        }),
                        query: n || ""
                    });
                    var h = +new Date();
                    this.shareCB = function() {
                        var n = +new Date(), i = 2500;
                        cc.sys.platform == cc.sys.ANDROID && (i = 2500), n - h > i ? (this.maxShareRate || (this.maxShareRate = .5), 
                        Math.random() < this.maxShareRate ? (t && t(), c.showToast("换个好友试试吧"), this.maxShareRate = 0) : e && (this.shareSuccessIndex || (this.shareSuccessIndex = 0), 
                        this.shareSuccessIndex++, this.aldSendCustomEvent("分享总成功次数", "share", this.shareSuccessIndex), 
                        e(), this.maxShareRate = .3)) : (t && t(), c.showToast("推荐给其他好友试试吧")), this.shareCB = null;
                    };
                }
            },
            createVideoAd: function(e, t) {
                var n = this, o = i.getSystemInfoSync();
                if (!(n.compareVer(o.SDKVersion, "2.0.4") < 0)) {
                    this.vvideoIndex || (this.vvideoIndex = 0), this.vvideoIndex++, this.aldSendCustomEvent("video总次数", "video", this.vvideoIndex);
                    var c = null;
                    return (c = n.videoAd ? n.videoAd : i.createRewardedVideoAd({
                        adUnitId: n.adUnitId
                    })).load().then(function() {
                        n.videoAd = c, c.show();
                    }).catch(function(e) {}), c.onClose(function(t) {
                        (t && t.isEnded || void 0 === t) && e && e(), c.offClose();
                    }), c.onError(function(e) {}), c;
                }
            },
            hidebanner: function() {
                this.bannerAd && (this.bannerAd.destory(), this.isBanner = !1);
            },
            showbanner: function(e) {
                if (!o.sh) {
                    var t = this;
                    return this.hidebanner(), void 0 !== this.wx.createBannerAd && (t.bannerAd = i.createBannerAd({
                        adUnitId: t.bannerId,
                        style: e
                    }), t.bannerAd.onLoad(function() {
                        var n = i.getSystemInfoSync(), o = n.windowHeight - t.bannerAd.style.realHeight, c = (n.windowWidth - t.bannerAd.style.realWidth) / 2;
                        -1 != n.model.indexOf("iPhone X") && (o -= 40), t.bannerAd.style.top = o, t.bannerAd.style.left = c;
                        try {
                            e.width ? t.bannerAd.style.width = e.width : t.bannerAd.style.width = n.windowWidth;
                        } catch (e) {}
                        t.isBanner = !0, i.request({
                            url: "https://account.api.snsfun.com/bannerclick/index",
                            data: {
                                type: "exposure",
                                game_id: t.gameid_g
                            },
                            success: function(e) {}
                        });
                    }), t.bannerAd.onError(function(e) {
                        console.log(e);
                    }), t.bannerAd.show()), t.bannerAd;
                }
            },
            bannerclick: function() {
                var e = this;
                i.request({
                    url: "https://account.api.snsfun.com/bannerclick/index",
                    data: {
                        type: "click",
                        game_id: e.gameid_g
                    },
                    success: function(t) {
                        e.isShareing = !1, e.isAding = !1, e.isVideoing = !1;
                    }
                });
            },
            compareVer: function(e, t) {
                var n = e.split("."), i = t.split(".");
                if (n.length > i.length) return 1;
                if (n.length < i.length) return -1;
                for (var o = 0; o < n.length; ++o) {
                    if (Number(e[o]) > Number(t[o])) return 1;
                    if (Number(e[o]) < Number(t[o])) return -1;
                }
                return 0;
            },
            showToast: function(e, t) {
                this.wx.showToast({
                    title: e || "分享",
                    icon: "none",
                    duration: t || 2e3
                });
            }
        });
        window.shareSdk = new o(), cc._RF.pop();
    }, {} ]
}, {}, [ "ADMoveScript", "GameCommon", "GameCommonUtil", "LaunchOption", "ISDK", "WebSDK", "WxSDK", "TaskManager", "UserData", "GloryPop", "LoadScene", "MainScene", "PrefabNode", "shareSdk", "AudioManager", "EventManager", "Globals", "JsonFileManager", "MessageCenter", "ObjectPool", "Prototype", "WeChatManager", "md5", "BossControl", "EnemyBullet", "EnemyBullet1", "EnemyBullet2", "EnemyBullet3", "EnemyBullet4", "EnemyBullet5", "EnemyControl", "SelfPlaneControl", "Shoot", "Ammo", "AutoPlay", "Coin", "CoinBag", "Core", "DisappearInPool", "ItemFrame", "Laser", "Medal", "PigCoin", "SelectItem", "Shield", "Chest", "GameIcon", "GameIconLoop", "GameIconZoom", "InvitePop", "RankPop", "RebirthPop", "Roulette", "ShaderUtils", "Shader_Galaxy", "galaxy.frag", "galaxy.vert", "Hit1", "WingmanBullet1", "WingmanBullet2", "WingmanBullet3", "WingmanBullet4", "WingmanBullet5", "WingmanControl" ]);