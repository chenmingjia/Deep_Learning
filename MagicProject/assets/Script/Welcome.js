// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
    },

    onLoad () {
        console.log("初始化APP"), 
        s.default.init(), 
        window.wx && wx.triggerGC(), 
        i.default.getInstance().init(), 
        n.default.getInstance().onWelcomeLoaded(), 
        this.audio.playBg();
    },

    GotoSelect () {
        this.audio.playCommonClick(), 
        cc.director.loadScene("Choose");
    },

    showRanking () {
        this.audio.playCommonClick(), 
        this.rankShadow.active = !0;
    },

    hideRanking () {
        this.audio.playCommonClick(),
        this.rankShadow.active = !1;
    },

    inviteFriend () {
        this.audio.playCommonClick(), 
        i.default.getInstance().share();
    },

    setBgImg () {

    },

    GotoEndless () {
        this.audio.playCommonClick(), 
        r.default.nowPass = -1, 
        cc.director.loadScene("Game");
    },

    onDestroy () {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.director.preloadScene("Game", function() {}), 
        cc.director.preloadScene("Choose", function() {});
    },

    // update (dt) {},
});
