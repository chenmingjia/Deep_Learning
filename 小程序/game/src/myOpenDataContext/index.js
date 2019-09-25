const ItemHeight = 115;

const MaxShowNum = 20;

const MaxBounceDistance = 100;

const BounceDuration = 400;

class Rank {
    constructor() {
        this.gameDatas = [];
        //https://developers.weixin.qq.com/minigame/dev/document/open-api/data/UserGameData.html
                this.beginY = 0;
        this.images = {};
        this.init();
    }
    getUserInfo() {
        var self = this;
        wx.getUserInfo({
            openIdList: [ "selfOpenId" ],
            lang: "zh_CN",
            success: res => {
                self.userData = res.data[0];
                console.log("success self.userData", self.userData);
            }
        });
    }
    init() {
        if (wx.getSharedCanvas) {
            this.canvas = wx.getSharedCanvas();
        }
        if (!this.canvas) {
            return;
        }
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = "high";
        this.banner1 = wx.createImage();
        this.banner1.src = "src/myOpenDataContext/banner1.png";
        this.banner1.onload = (() => {});
        this.banner2 = wx.createImage();
        this.banner2.src = "src/myOpenDataContext/banner2.png";
        this.banner2.onload = (() => {});
        this._1st = wx.createImage();
        this._1st.src = "src/myOpenDataContext/1st.png";
        this._1st.onload = (() => {});
        this._2nd = wx.createImage();
        this._2nd.src = "src/myOpenDataContext/2nd.png";
        this._2nd.onload = (() => {});
        this._3rd = wx.createImage();
        this._3rd.src = "src/myOpenDataContext/3rd.png";
        this._3rd.onload = (() => {});
        this.getUserInfo();
    }
    listen() {
        if (!wx.getSharedCanvas) {
            return;
        }
        wx.onMessage(msg => {
            switch (msg.type) {
              case "rank":
                this.getRankData();
                //获取数据
                                break;

              case "touchMove":
                this.onTouchMove(msg.x, msg.y);
                break;

              case "touchEnd":
                this.bounce();
                break;

              case "saveTopLevel":
                this.setUserCloudStaroge("rank", msg.data);
                break;
            }
        });
    }
    getRankData() {
        wx.getFriendCloudStorage({
            keyList: [ "rank" ],
            success: res => {
                console.log("wx.getFriendCloudStorage success", res);
                var infoList = [];
                for (var i in res.data) {
                    var info = res.data[i];
                    var kvData = info.KVDataList.find(kvData => kvData.key == "rank");
                    if (kvData) {
                        infoList.push(info);
                    }
                }
                const dataLen = infoList.length;
                this.maxHeight = 100 * dataLen;
                //todo
                //console.log(infoList);
                //this.gameEndlessDatas = dataSorter(infoList,'rank');
                                this.rankDatas = infoList.sort((a, b) => {
                    return Number(a.KVDataList[0]["value"]) < Number(b.KVDataList[0]["value"]);
                });
                if (dataLen) {
                    this.beginY = 0;
                    this.showRank();
                    //显示界面
                                }
            },
            fail: res => {
                console.log("wx.getFriendCloudStorage fail", res);
            }
        });
    }
    showRank() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.rankDatas.length; i++) {
            var data = this.rankDatas[i];
            this.dramRankItem(this.ctx, data, i);
        }
    }
    dramRankItem(ctx, data, i) {
        const avatarUrl = data.avatarUrl.substr(0, data.avatarUrl.length - 3) + "96";
        const nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        const kvData = data.KVDataList.find(kvData => kvData.key == "rank");
        var isSelf = this.userData && this.userData.nickName == data.nickname;
        var Y = 100 * i + this.beginY;
        var X = (600 - 552) / 2;
        /** canvas width 600 */
        //背景
                if (isSelf) {
            ctx.drawImage(this.banner2, X, Y, 552, 90);
        } else {
            ctx.drawImage(this.banner1, X, Y, 552, 90);
        }
        //排名
                if (i < 3) {
            if (i == 0) {
                ctx.drawImage(this._1st, X + 20, Y + (90 - 67) / 2, 78, 67);
            } else if (i == 1) {
                ctx.drawImage(this._2nd, X + 20, Y + (90 - 67) / 2, 78, 67);
            } else if (i == 2) {
                ctx.drawImage(this._3rd, X + 20, Y + (90 - 67) / 2, 78, 67);
            }
        } else {
            ctx.fillStyle = "#CCDBFF";
            //todo #C17317
            // if(isSelf){                        
            //     ctx.fillStyle = "009C33";//todo #17c12b
            // }
                        ctx.textAlign = "center";
            ctx.baseLine = "middle";
            ctx.font = "40px Helvetica";
            ctx.fillText(i + 1, X + 20 + 78 / 2, Y + 90 / 2 + 20);
        }
        //名字
                ctx.fillStyle = "#CCDBFF";
        // if(isSelf){
        //     ctx.fillStyle = "#009C33";
        // }
                ctx.textAlign = "center";
        ctx.baseLine = "middle";
        ctx.font = "22px Helvetica";
        ctx.fillText(nick, X + 200, Y + 90 / 2 + 11);
        //头像 为了减少请求吧大概 不知道有没有效果
                if (this.images[data.openid] == null) {
            const avatarImg = wx.createImage();
            avatarImg.src = avatarUrl;
            avatarImg.onload = (() => {
                this.images[data.openid] = avatarImg;
                ctx.drawImage(avatarImg, X + 300, Y + (90 - 64) / 2, 64, 64);
            });
        } else {
            ctx.drawImage(this.images[data.openid], X + 300, Y + (90 - 64) / 2, 64, 64);
        }
        //关卡
                ctx.fillStyle = "#00FFD8";
        // if(isSelf){
        //     ctx.fillStyle = "#009C33";
        // }
                ctx.textAlign = "center";
        ctx.baseLine = "middle";
        ctx.font = "26px Helvetica";
        ctx.fillText("第" + kvData["value"] + "关", X + 460, Y + 90 / 2 + 13);
    }
    clearInterval() {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    onTouchMove(x, y) {
        var newY = this.beginY - y;
        if (y > 0) {
            if (this.maxHeight <= this.canvas.height) {
                // return
                if (newY <= -MaxBounceDistance) {
                    newY = -MaxBounceDistance;
                }
            } else {
                if (newY <= -(this.maxHeight - this.canvas.height + 100)) {
                    newY = -(this.maxHeight - this.canvas.height + 100);
                }
            }
        } else if (y < 0) {
            if (newY >= MaxBounceDistance) {
                newY = MaxBounceDistance;
            }
        } else {
            return;
        }
        if (this.beginY == newY) {
            return;
        }
        this.beginY = newY;
        this.showRank();
        // this.ctx.translate(0, y)
        }
    bounce() {
        this.clearInterval();
        var beginY = this.beginY;
        var endY = 0;
        var intervalTime = 100;
        if (beginY > 0) {
            endY = 0;
        } else {
            if (this.maxHeight <= this.canvas.height) {
                endY = 0;
            } else {
                var endY = this.canvas.height - this.maxHeight;
                if (beginY >= endY) {
                    return;
                }
            }
        }
        if (beginY == endY) {
            return;
        }
        var speed = intervalTime / BounceDuration * (beginY - endY);
        console.log("speed", speed);
        console.log(" start bounce");
        var self = this;
        this.intervalId = setInterval(function(dt) {
            var oldY = self.beginY;
            self.beginY -= speed;
            var isEnd = oldY > endY != self.beginY > endY;
            if (isEnd) {
                self.beginY = endY;
                self.clearInterval();
            }
            self.showRank();
        }, intervalTime);
    }
    setUserCloudStaroge(key, value) {
        wx.setUserCloudStorage({
            KVDataList: [ {
                key: key + "",
                value: value + ""
            } ]
        });
    }
}

var rank = new Rank();

rank.listen();