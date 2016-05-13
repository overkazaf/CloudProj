/**
 * [WIFI 漫游数据实体类]
 * @param  {[type]} root [description]
 * @return {[type]}      [description]
 */
(function(root) {
    function WifiVO(opt) {
        this.id = opt.id;
        this.username = opt.username;
        this.macadd = opt.macadd;
        this.ipadd = opt.ipadd;
        this.nasip = opt.nasip;
        this.stime = opt.stime;
        this.etime = opt.etime;
        this.inflow = opt.inflow;
        this.outflow = opt.outflow;
        this.allflow = opt.allflow;
        this.onlinetime = opt.onlinetime;
        this.dateVO = null;

        return this.init.call(this);

    };


    WifiVO.prototype = {
        constructor: WifiVO,
        init: function() {
            var username = this.username;
            var ipadd = this.ipadd;
            var nasip = this.nasip;
            var stime = this.stime;

            this.dateVO = this.buildDateVO(stime);
            this.path = this.buildRoamPath(username, nasip);

            this.fixPathByMapping();

            return this;
        },
		getNameMappingArray :getNameMappingArray,
        buildDateVO: function(stime) {
            var d = new Date(stime);
            var dateVO = {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                day: d.getDate(),
                hour: d.getHours()
            };
            return dateVO;
        },
        buildRoamPath: function(username, nasip) {
            var from = username;
            var to = nasip;
            if (username.indexOf('@') >= 0) {
                var arr = username.split('@');
                if (arr.length === 2 && arr[1].indexOf('.') >= 0) {
                    from = arr[1].split('.')[0];
                }
            }

            var path = {
                from: from,
                to: nasip
            };

            return path;
        },
        fixPathByMapping: function() {
            var fromMappingArray = getNameMappingArray();
            var toMappingArray = [{
                "210.31.145.148": {
                    "name": "天津市教委"
                }
            }, {
                "211.81.20.100": {
                    "name": "天津市教委信息中心"
                }
            }, {
                "211.81.21.12": {
                    "name": "天津市教委信息中心"
                }
            }, {
                "10.10.100.58": {
                    "name": "天津科技大学"
                }
            }, {
                "59.67.65.26": {
                    "name": "天津师范大学"
                }
            }, {
                "115.24.185.2": {
                    "name": "天津师范大学"
                }
            }, {
                "222.30.102.236": {
                    "name": "天津职业学院"
                }
            }, {
                "211.68.230.34": {
                    "name": "天津职业学院"
                }
            }, {
                "211.68.118.1": {
                    "name": "天津工业大学"
                }
            },{
                "202.113.88.144": {
                    "name": "天津城建大学"
                }
            },{
                "172.20.128.1": {
                    "name": "天津理工大学"
                }
            },{
                "210.31.144": {
                    "name": "天津市教委"
                }
            },{
                "210.31.151": {
                    "name": "天津市教委"
                }
            }];

            var from = this.path.from;
            var to = this.path.to;

            var fixedFromName = findNameByMappingArray(from, fromMappingArray);
            var fixedToName = findNameByMappingArray(to, toMappingArray);


            this.path.from = fixedFromName;
            this.path.to = fixedToName;

            console.log(fixedFromName, fixedToName)
        }
    };


    function findNameByMappingArray(from, mapping) {
        var flag = false;
        var ret = from;
        for (var i = 0, l = mapping.length; i < l; i++) {
            var item = mapping[i];
            for (var key in item) {
                if (key.toLowerCase() === from.toLowerCase() || key.toLowerCase().indexOf(from.toLowerCase()) >= 0) {
                    ret = item[key]['name'];
                    flag = true;
                    break;
                }
            }
            if (flag) break;
        }

        if (!flag) {
            // 处理特殊情况
            var prefix = "210.31";
            if (from.substring(0,6).indexOf(prefix) >= 0) {
                var arr = from.split('.');
                if (~~arr[2] >= 144 && ~~arr[2] <= 151) {
                    ret = '天津市教委';
                }
            }
        }
        return ret;
    }


    function getNameMappingArray() {
        var arr = [{
            "TJUT": {
                "name": "天津理工大学",
                "coords": [117.129893, 39.073672]
            }
        }, {
            "TJNU": {
                "name": "天津师范大学",
                "coords": [117.148474, 39.067139]
            }
        }, {
            "TJPU": {
                "name": "天津工业大学",
                "coords": [117.115746, 39.077202]
            }
        }, {
            "TJTC": {
                "name": "天津市教委信息中心",
                "coords": [117.15955, 39.099785]
            }
        }, {
            "TJU": {
                "name": "天津大学",
                "coords": [117.181503, 39.114877]
            }
        }, {
            "NKU": {
                "name": "南开大学",
                "coords": [117.176953, 39.109299]
            }
        }, {
            "TFSU": {
                "name": "天津外国语大学",
                "coords": [117.216346, 39.114366]
            }
        }, {
            "CAUC": {
                "name": "中国民航大学",
                "coords": [117.359348, 39.112904]
            }
        }, {
            "TUST": {
                "name": "天津科技大学",
                "coords": [117.278097, 39.077101]
            }
        },
        {
            "TJ": {
                "name": "天津市教委信息中心",
                "coords": [117.15955, 39.099785]
            }
        },
        {
            "TJ": {
                "name": "天津市教委",
                "coords": [117.21702, 39.118572]
            }
        }, {
            "TJCU": {
                "name": "天津商业大学",
                "coords": [117.135262, 39.189084]
            }
        }, {
            "TCU": {
                "name": "天津城建大学",
                "coords": [117.102684, 39.101383]
            }
        }, {
            "TUFE": {
                "name": "天津财经",
                "coords": [117.279475, 39.06924]
            }
        }, {
            "TJMU": {
                "name": "天津医科",
                "coords": [117.1915, 39.112218]
            }
        }, {
            "TJRTVU": {
                "name": "天津广播电视大学",
                "coords": [117.164077, 39.097995]
            }
        }];

        return arr;
    };

    root.WifiVO = WifiVO;
})(window);
