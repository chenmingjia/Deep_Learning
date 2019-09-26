exports.default = {
    starMatrix: [],
    starNodeArr: [],
    Init: function (e) {
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
    }
}