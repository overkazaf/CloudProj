/**
 * [WIFI 漫游数据实体类]
 * @param  {[type]} root [description]
 * @return {[type]}      [description]
 */
(function(root) {
    function WifiVO(opt) {
        this.id = opt.id;
        this.username = opt.username;
        this.ipadd = opt.ipadd;
        this.stime = opt.stime;
        this.etime = opt.etime;
        this.onlinetime = opt.onlinetime;
        this.dateVO = null;

        return this.init.call(this);

    };


    WifiVO.prototype = {
        constructor: WifiVO,
        init: function() {
            var username = this.username;
            var ipadd = this.ipadd;
            var stime = this.stime;

            this.dateVO = this.buildDateVO(stime);
            this.path = this.buildRoamPath(username, ipadd);

            this.fixPathByMapping();

            return this;
        },

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
        buildRoamPath: function(username, ipadd) {
            var from = username;
            var to = ipadd;
            if (username.indexOf('@') >= 0) {
                var arr = username.split('@');
                if (arr.length === 2 && arr[1].indexOf('.') >= 0) {
                    from = arr[1].split('.')[0];
                }
            }

            if (ipadd.indexOf('.') >= 0) {
                var arr = ipadd.split('.');
                to = arr[0].replace(' ', "");
            }

            var path = {
                from: from,
                to: to
            };

            return path;
        },
        fixPathByMapping: function() {
            var fromMappingArray = getNameMappingArray();
            var toMappingArray = [{
                211: {
                    "name": "天津广播电视大学"
                }
            }, {
                172: {
                    "name": "天津理工大学"
                }
            }, {
                210: {
                    "name": "天津市教委"
                }
            }];

            var from = this.path.from;
            var to = this.path.to;

            var fixedFromName = findNameByMappingArray(from, fromMappingArray);
            var fixedToName = findNameByMappingArray(to, toMappingArray);


            this.path.from = fixedFromName;
            this.path.to = fixedToName;

        }
    };


    function findNameByMappingArray(from, mapping) {
        var flag = false;
        var ret = from;
        for (var i = 0, l = mapping.length; i < l; i++) {
            var item = mapping[i];
            for (var key in item) {
                if (key.toLowerCase() === from.toLowerCase()) {
                    ret = item[key]['name'];
                    flag = true;
                    break;
                }
            }
            if (flag) break;
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
