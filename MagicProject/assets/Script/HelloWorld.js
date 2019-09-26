cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        button: cc.Button
    },

    // use this for initialization
    onLoad: function () {
        this.button.node.on('click', this.callback, this);
    },

    callback: function (button) {
        cc.log('Magic Power')
        cc.director.loadScene("Game");
         // do whatever you want with button
         // 另外，注意这种方式注册的事件，也无法传递 customEventData
    },

    // called every frame
    update: function (dt) {

    },
});
