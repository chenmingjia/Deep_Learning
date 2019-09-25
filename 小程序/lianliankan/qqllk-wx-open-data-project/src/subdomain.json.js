module.exports = [ {
    __type__: "cc.BitmapFont",
    _name: "rank",
    spriteFrame: {
        __uuid__: "652WRwwR5GZKAgDsZAFro9"
    },
    fontSize: 42,
    _fntConfig: {
        commonHeight: 59,
        fontSize: 42,
        atlasName: "rank.png",
        fontDefDictionary: {
            32: {
                rect: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                xOffset: -1,
                yOffset: 0,
                xAdvance: 12
            },
            48: {
                rect: {
                    x: 170,
                    y: 0,
                    width: 22,
                    height: 33
                },
                xOffset: 1,
                yOffset: 11,
                xAdvance: 23
            },
            49: {
                rect: {
                    x: 0,
                    y: 0,
                    width: 14,
                    height: 33
                },
                xOffset: 3,
                yOffset: 11,
                xAdvance: 23
            },
            50: {
                rect: {
                    x: 192,
                    y: 0,
                    width: 23,
                    height: 32
                },
                xOffset: 0,
                yOffset: 12,
                xAdvance: 23
            },
            51: {
                rect: {
                    x: 14,
                    y: 0,
                    width: 22,
                    height: 33
                },
                xOffset: 1,
                yOffset: 11,
                xAdvance: 23
            },
            52: {
                rect: {
                    x: 36,
                    y: 0,
                    width: 23,
                    height: 33
                },
                xOffset: 0,
                yOffset: 11,
                xAdvance: 23
            },
            53: {
                rect: {
                    x: 59,
                    y: 0,
                    width: 22,
                    height: 33
                },
                xOffset: 1,
                yOffset: 11,
                xAdvance: 23
            },
            54: {
                rect: {
                    x: 81,
                    y: 0,
                    width: 23,
                    height: 33
                },
                xOffset: 0,
                yOffset: 11,
                xAdvance: 23
            },
            55: {
                rect: {
                    x: 104,
                    y: 0,
                    width: 22,
                    height: 33
                },
                xOffset: 1,
                yOffset: 11,
                xAdvance: 23
            },
            56: {
                rect: {
                    x: 126,
                    y: 0,
                    width: 22,
                    height: 33
                },
                xOffset: 1,
                yOffset: 11,
                xAdvance: 23
            },
            57: {
                rect: {
                    x: 148,
                    y: 0,
                    width: 22,
                    height: 33
                },
                xOffset: 1,
                yOffset: 11,
                xAdvance: 23
            }
        },
        kerningDict: {}
    }
}, {
    __type__: "cc.SpriteFrame",
    content: {
        name: "1",
        texture: "44YwM2LmhF0J/vCJbZ/i3i",
        rect: [ 0, 0, 39, 52 ],
        offset: [ 0, 0 ],
        originalSize: [ 39, 52 ],
        capInsets: [ 0, 0, 0, 0 ]
    }
}, {
    __type__: "cc.Texture2D",
    content: "0,9729,9729,33071,33071,0"
}, {
    __type__: "cc.SpriteFrame",
    content: {
        name: "2",
        texture: "a6PWyt+jRDKJsXvny5+ld1",
        rect: [ 0, 0, 39, 52 ],
        offset: [ 0, 0 ],
        originalSize: [ 39, 52 ],
        capInsets: [ 0, 0, 0, 0 ]
    }
}, [ {
    __type__: "cc.SceneAsset",
    _name: "Rank",
    scene: {
        __id__: 1
    },
    asyncLoadAssets: null
}, {
    __type__: "cc.Scene",
    _name: "New Node",
    _children: [ {
        __id__: 2
    } ],
    _active: false,
    _anchorPoint: {
        __type__: "cc.Vec2"
    },
    _scale: {
        __type__: "cc.Vec3",
        x: .4105654671078637,
        y: .4105654671078637,
        z: 1
    },
    _zIndex: 0,
    autoReleaseAssets: false
}, {
    __type__: "cc.Node",
    _name: "Canvas",
    _parent: {
        __id__: 1
    },
    _children: [ {
        __id__: 3
    }, {
        __id__: 4
    } ],
    _level: 1,
    _components: [ {
        __type__: "cc.Canvas",
        node: {
            __id__: 2
        },
        _designResolution: {
            __type__: "cc.Size",
            width: 503,
            height: 672
        },
        _fitHeight: false
    } ],
    _contentSize: {
        __type__: "cc.Size",
        width: 503,
        height: 672
    },
    _position: {
        __type__: "cc.Vec3",
        x: 251.5,
        y: 336
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0,
    _id: "70fRTPysJAQZV3T/S+j0r+"
}, {
    __type__: "cc.Node",
    _name: "Main Camera",
    _parent: {
        __id__: 2
    },
    _level: 1,
    _components: [ {
        __type__: "cc.Camera",
        node: {
            __id__: 3
        },
        _clearFlags: 7,
        _backgroundColor: {
            __type__: "cc.Color",
            a: 0
        },
        _depth: -1
    } ],
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Node",
    _name: "RankList",
    _parent: {
        __id__: 2
    },
    _children: [ {
        __id__: 5
    } ],
    _level: 1,
    _components: [ {
        __id__: 7
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 4
        },
        _alignFlags: 45,
        _horizontalCenter: 1,
        _originalWidth: 503,
        _originalHeight: 250
    }, {
        __type__: "14e44JnYXNGmowdqtFOOzzG",
        node: {
            __id__: 4
        },
        scrollView: {
            __id__: 7
        },
        visibleRect: {
            __id__: 5
        },
        paddingStart: 58,
        paddingEnd: 58,
        spacing: 10,
        template: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        templateSizeInScroll: 85,
        templateComponentName: "RankItem"
    } ],
    _contentSize: {
        __type__: "cc.Size",
        width: 503,
        height: 672
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Node",
    _name: "view",
    _parent: {
        __id__: 4
    },
    _children: [ {
        __id__: 6
    } ],
    _components: [ {
        __type__: "cc.Mask",
        node: {
            __id__: 5
        }
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 5
        },
        _alignFlags: 45,
        _verticalCenter: -20,
        _originalWidth: 503,
        _originalHeight: 667.8
    } ],
    _contentSize: {
        __type__: "cc.Size",
        width: 503,
        height: 672
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Node",
    _name: "content",
    _parent: {
        __id__: 5
    },
    _components: [ {
        __type__: "cc.Widget",
        node: {
            __id__: 6
        },
        _alignFlags: 40,
        _originalWidth: 534
    } ],
    _contentSize: {
        __type__: "cc.Size",
        width: 503,
        height: 300
    },
    _anchorPoint: {
        __type__: "cc.Vec2",
        x: .5,
        y: 1
    },
    _position: {
        __type__: "cc.Vec3",
        y: 336.1
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.ScrollView",
    node: {
        __id__: 4
    },
    horizontal: false,
    bounceDuration: .23,
    _N$content: {
        __id__: 6
    },
    content: {
        __id__: 6
    },
    _N$horizontalScrollBar: null,
    _N$verticalScrollBar: null
} ], [ {
    __type__: "cc.Prefab",
    _name: "RankItem",
    data: {
        __id__: 1
    }
}, {
    __type__: "cc.Node",
    _name: "RankItem",
    _children: [ {
        __id__: 2
    }, {
        __id__: 7
    }, {
        __id__: 10
    }, {
        __id__: 12
    } ],
    _level: 1,
    _components: [ {
        __type__: "168e8ACUydBspIzbFUXWxhL",
        node: {
            __id__: 1
        },
        avatarDefault: {
            __uuid__: "e727xqU8ZFQ4XNY+vE39rd"
        },
        medalImages: [ {
            __uuid__: "3aX73hgHNEoadN4W4rcA8N"
        }, {
            __uuid__: "47Fkx5pw9FV5NOF1Kb5sAk"
        }, {
            __uuid__: "d4VGR68rRHyKcJeETqCzhe"
        } ],
        userName: {
            __id__: 11
        },
        userScore: {
            __id__: 13
        },
        rankingMedal: {
            __id__: 4
        },
        rankingNum: {
            __id__: 6
        },
        avatar: {
            __id__: 9
        }
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "98OmfmaaJM65bkZFc04NZs"
    },
    _contentSize: {
        __type__: "cc.Size",
        width: 503,
        height: 85
    },
    _position: {
        __type__: "cc.Vec3",
        y: -46
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Node",
    _name: "Ranking",
    _parent: {
        __id__: 1
    },
    _children: [ {
        __id__: 3
    }, {
        __id__: 5
    } ],
    _level: 2,
    _components: [ {
        __type__: "cc.Widget",
        node: {
            __id__: 2
        },
        _alignFlags: 10
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "34gK12mnJA+bodqZBjuJjX"
    },
    _contentSize: {
        __type__: "cc.Size",
        width: 93,
        height: 85
    },
    _position: {
        __type__: "cc.Vec3",
        x: -205
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Node",
    _name: "sprite",
    _parent: {
        __id__: 2
    },
    _level: 3,
    _components: [ {
        __id__: 4
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 3
        },
        _alignFlags: 18
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "c43YdoRbZMrJPX13mXhV4w"
    },
    _contentSize: {
        __type__: "cc.Size",
        width: 39,
        height: 50
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Sprite",
    node: {
        __id__: 3
    },
    _sizeMode: 0
}, {
    __type__: "cc.Node",
    _name: "label",
    _parent: {
        __id__: 2
    },
    _level: 3,
    _components: [ {
        __id__: 6
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 5
        },
        _alignFlags: 18,
        _verticalCenter: 7
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "faSkoKPetDMrFaOqCyzr73"
    },
    _contentSize: {
        __type__: "cc.Size",
        width: 17,
        height: 42
    },
    _position: {
        __type__: "cc.Vec3",
        y: 7
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Label",
    node: {
        __id__: 5
    },
    _useOriginalSize: false,
    _string: "1",
    _N$string: "1",
    _fontSize: 42,
    _lineHeight: 42,
    _N$file: {
        __uuid__: "0dhu0mXK9FaZgyCKbuDTYu"
    },
    _isSystemFontUsed: false,
    _N$horizontalAlign: 1,
    _N$verticalAlign: 1
}, {
    __type__: "cc.Node",
    _name: "AvatarMask",
    _parent: {
        __id__: 1
    },
    _children: [ {
        __id__: 8
    } ],
    _level: 2,
    _components: [ {
        __type__: "cc.Mask",
        node: {
            __id__: 7
        },
        _type: 1
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 7
        },
        _alignFlags: 10,
        _left: 93
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "29oHRqQeJKoLB4sKOS1p2R"
    },
    _contentSize: {
        __type__: "cc.Size",
        width: 85,
        height: 85
    },
    _position: {
        __type__: "cc.Vec3",
        x: -116
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Node",
    _name: "avatar",
    _parent: {
        __id__: 7
    },
    _level: 3,
    _components: [ {
        __id__: 9
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 8
        },
        _alignFlags: 45,
        _originalWidth: 40,
        _originalHeight: 36
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "59JSHOiR9GUIeZTLDLJzUx"
    },
    _contentSize: {
        __type__: "cc.Size",
        width: 85,
        height: 85
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Sprite",
    node: {
        __id__: 8
    },
    _sizeMode: 0
}, {
    __type__: "cc.Node",
    _name: "Name",
    _parent: {
        __id__: 1
    },
    _level: 2,
    _components: [ {
        __id__: 11
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 10
        },
        _alignFlags: 10,
        _left: 185
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "3bh8FCqbtF5rDdtSOejZSa"
    },
    _color: {
        __type__: "cc.Color",
        r: 69,
        g: 69,
        b: 69
    },
    _contentSize: {
        __type__: "cc.Size",
        width: 175,
        height: 30
    },
    _position: {
        __type__: "cc.Vec3",
        x: 21
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Label",
    node: {
        __id__: 10
    },
    _useOriginalSize: false,
    _fontSize: 30,
    _lineHeight: 30,
    _enableWrapText: false,
    _N$verticalAlign: 1,
    _N$overflow: 1
}, {
    __type__: "cc.Node",
    _name: "Score",
    _parent: {
        __id__: 1
    },
    _level: 2,
    _components: [ {
        __id__: 13
    }, {
        __type__: "cc.Widget",
        node: {
            __id__: 12
        },
        _alignFlags: 34,
        _right: 25
    } ],
    _prefab: {
        __type__: "cc.PrefabInfo",
        root: {
            __id__: 1
        },
        asset: {
            __uuid__: "5bTnkBfpVLP6H2u9NRGwY8"
        },
        fileId: "cd8LI+nIhFMJI61Beleve/"
    },
    _color: {
        __type__: "cc.Color",
        r: 69,
        g: 69,
        b: 69
    },
    _contentSize: {
        __type__: "cc.Size",
        height: 30
    },
    _anchorPoint: {
        __type__: "cc.Vec2",
        x: 1,
        y: .5
    },
    _position: {
        __type__: "cc.Vec3",
        x: 226.5
    },
    _scale: {
        __type__: "cc.Vec3",
        x: 1,
        y: 1,
        z: 1
    },
    _zIndex: 0
}, {
    __type__: "cc.Label",
    node: {
        __id__: 12
    },
    _useOriginalSize: false,
    _fontSize: 30,
    _lineHeight: 30,
    _enableWrapText: false,
    _N$horizontalAlign: 2,
    _N$verticalAlign: 1
} ], {
    __type__: "cc.SpriteFrame",
    content: {
        name: "rank",
        texture: "8eF3biUq1KWYnbqa3p0Sse",
        rect: [ 1, 0, 213, 33 ],
        offset: [ -148.5, 239.5 ],
        originalSize: [ 512, 512 ],
        capInsets: [ 0, 0, 0, 0 ]
    }
}, {
    __type__: "cc.Texture2D",
    content: "1,9729,9729,33071,33071,0"
}, {
    __type__: "cc.Texture2D",
    content: "0,9729,9729,33071,33071,0"
}, {
    __type__: "cc.Texture2D",
    content: "0,9729,9729,33071,33071,0"
}, {
    __type__: "cc.SpriteFrame",
    content: {
        name: "3",
        texture: "feKuUieJNJzrgsn1KVkbC2",
        rect: [ 0, 0, 39, 50 ],
        offset: [ 0, 0 ],
        originalSize: [ 39, 50 ],
        capInsets: [ 0, 0, 0, 0 ]
    }
}, {
    __type__: "cc.SpriteFrame",
    content: {
        name: "avatar_def",
        texture: "6b+TiWDr1DOrkoVEP3RUjW",
        rect: [ 0, 0, 300, 300 ],
        offset: [ 0, 0 ],
        originalSize: [ 300, 300 ],
        capInsets: [ 0, 0, 0, 0 ]
    }
}, {
    __type__: "cc.Texture2D",
    content: "0,9729,9729,33071,33071,0"
} ];