exports.config = function () {

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
    }, e;
    // , e.prototype.update = function() {
    //     for (var e in r.default.passConfig) for (var t in this.config) this.config[t].pass == r.default.passConfig[e].pass && (this.config[t] = Object.assign({}, this.config[t], r.default.passConfig[e]));
    // }, e.prototype.transform = function(e) {
    //     console.log(e.grid);
    //     for (var t = JSON.parse(e.grid), o = new Array(t[0].length), r = [], i = 0; i < t[0].length; i++) o[i] = new Array(t.length), 
    //     r = new Array(t.length + 2);
    //     for (i = 0; i < r.length; i++) r[i] = -1;
    //     for (i = 0; i < t.length; i++) for (var n = 0; n < t[0].length; n++) o[n][i] = t[i][n], 
    //     o[n][i] = 1 === o[n][i] ? -2 : -1;
    //     for (i = 0; i < t[0].length; i++) o[i].push(-1), o[i].unshift(-1);
    //     return o.push(r), o.unshift(r), e.mapConfig = 1 == e.gridType ? this.mapConfig1 : this.mapConfig2, 
    //     e.mapConfig.moveType = e.moveType, e.mapConfig.grid = o, e.mapConfig.gridType = e.gridType, 
    //     e.mapConfig;
    // }, e;
}
