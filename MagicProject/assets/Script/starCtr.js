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
    starSprite: {
        default: null,
        type: cc.Sprite,
    },
    clickBgImg: {
        default: [], 
        type: cc.SpriteFrame,
    },
    clickBigBgImg: {
        default: [], 
        type: cc.SpriteFrame,
    },
    starSpriteFrames: {
        default: [],
        type: cc.SpriteFrame,
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.ts = cc.find("/GameCanvas").getComponent("Game");
    this.initImg();
  },

  initStar (e, t, o) {
    if (-1 != e) {
        this.type = e, this.starSprite.spriteFrame = this.starSpriteFrames[this.type], 
        cc.log('Holy', this.starSpriteFrames[this.type], this.type)
        this.updateGrid(t, o)
    }
  },

  updateGrid (e, t) {
    this.x = e, this.y = t;
  },

  initImg() {
    // this.node.getComponent(cc.Sprite).spriteFrame =
    //   1 == this.ts.mapConfig.gridType
    //     ? this.clickBgImg[0]
    //     : this.clickBigBgImg[0];
    // console.log('Node', this.starSprite, this.node, this.node.getComponent(cc.Sprite), this.node.getComponent(cc.Sprite).spriteFrame)
  },

  start() {
    this.node.on(
      cc.Node.EventType.TOUCH_START,
      function(e) {
        if (this.ts.canClick)
          return this.ts.isUseBomb
            ? (this.ts.changeItem(3, -1),
              this.ts.closeUseBomb(),
              void this.ts.removeOneTypePoint(this.type))
            : void (this.ts._clickPoint.start !== this
                ? "start" == this.ts.starClickStatus
                  ? (this.ts.audio.playCommonClick(), this.startFun())
                  : "end" == this.ts.starClickStatus &&
                    ((this.ts.starClickStatus = "start"),
                    (this.ts._clickPoint.end = this),
                    this.ts.judgeRemove())
                : console.debug("相同点重复点击"));
      },
      this
    );
  }

  // update (dt) {},
});
