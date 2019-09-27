// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const gameData = require("GameData");
const gameConfig = require("GameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        starPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log('魔鬼', gameConfig);

        // gameData.default.starMatrix = [1,2,3]
        // cc.log('魔鬼2', gameData.default.starMatrix);

        this.mapConfig = gameConfig.default.getInstance().mapConfigEndless
        cc.log('Map', this.mapConfig)
    },

    start () {
        this.initPool() 
        gameData.default.starMatrix = gameData.default.Init(this.mapConfig)
        this.initMatrix();
    },

    initPool () {
        var e = this;
        this._starPool = new cc.NodePool(), this._bombPool = new cc.NodePool();

        // 初始化 _starPool 中的方块数
        for (var t = 0; t <= (this.mapConfig.row - 1) * (this.mapConfig.col - 1); ++t) {
            var o = cc.instantiate(this.starPrefab);
            this._starPool.put(o);
        }
        // var r = function(t) {
        //     var o = cc.instantiate(i.bombPrefab);
        //     o.scale = i.mapConfig.per, o.getComponent(cc.Animation).on("finished", function() {
        //         e.node.isValid && e._bombPool.put(o);
        //     }, i), i._bombPool.put(o);
        // }, i = this;
        // for (t = 0; t < 5; t++) r();
    },

    setStarV2 (e, t, o) {
        return cc.v2((e.sizeX + e.spaceX) * (t - .5), (e.sizeY + e.spaceY) * (o - .5));
    },

    createStar (e, t, o) {
        var r = null;
        if (this._starPool.size() > 0) {
            (r = this._starPool.get()).scale = 0;
            var i = cc.scaleTo(.3, this.mapConfig.per);
            r.runAction(i);
        } else {
            r = cc.instantiate(this.starPrefab);
        }
        r.setPosition(this.setStarV2(this.mapConfig, t, o))
        cc.find("/GameCanvas/container").addChild(r)
        r.getComponent("starCtr").initStar(e, t, o)
        return r
    },

    initMatrix () {
        cc.log('starMatrix',  gameData.default.starMatrix)
        for (var e = 0; e < gameData.default.starMatrix.length; e++) {
            var t = gameData.default.starMatrix[e];
            gameData.default.starNodeArr[e] = new Array();
            cc.log("T", t)
            for (var o = t.length - 1; o >= 0; o--) {
                var r = gameData.default.starMatrix[e][o];
                if (r > -1) {
                    var i = this.createStar(r, e, o);
                    gameData.default.starNodeArr[e][o] = i;
                } else gameData.default.starNodeArr[e][o] = null;
            }
        }
        cc.log('魔鬼2', gameData.default.starMatrix, gameData.default.starNodeArr);
    },

    // update (dt) {},
});
