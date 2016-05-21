$(window).load(function() {

    var APP = {
        TITLE: "无线联盟用户漫游监控系统",
        SUB_TITLE: "数据来自天津市教委网络中心",
        CANVAS_ID: 'main',
        chartEl : null,
        buildVOList: function(data) {
            var voList = util.getCache('voList');
            for (var i = 0, l = data.length; i < l; i++) {
                var el = data[i];
                var obj = new WifiVO({
                    id: el.id,
                    username: $.trim(el.username),
                    macadd: el.macadd,
                    ipadd: el.ipadd,
                    nasip: $.trim(el.nasip),
                    stime: el.stime,
                    etime: el.etime,
                    inflow: el.inflow,
                    outflow: el.outflow,
                    allflow: el.allflow,
                    onlinetime: el.onlinetime
                });
                voList.push(obj);
            }

            return voList;
        },
        buildStructuredRecords: function(list) {
            // 这个方法优化的话可以用trie来做
            var R = util.getCache('R');
            for (var i = 0, l = list.length; i < l; i++) {
                var item = list[i];
                var date = item.dateVO;

                var year = date.year,
                    month = date.month,
                    day = date.day,
                    hour = date.hour;
                // 生成检索树空间， 方便后期的点击查询， 
                // 这块其实可以多加一个参数， 用来实现list在merge后的添加，即异步下的处理
                preIterateMap(year, month, day, hour);

                R[year][month][day][hour].push(item);
            }

            util.log(R);
        }
    };
    var dom = $('#' + APP.CANVAS_ID)[0];
    var chart = APP.chartEl = echarts.init(dom, 'shine');
    var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            (function(i) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push([{
                        coord: fromCoord,
                        tooltip: { // 让鼠标悬浮到此项时能够显示 `tooltip`。
                            formatter: function(params) {
                                var ret = [];
                                ret.push('用户名：' + dataItem[1].username);
                                ret.push('');
                                ret.push('起点 / 终点');
                                ret.push(dataItem[0].name + ' 到 ' + dataItem[1].name);
                                ret.push('');
                                ret.push('起始时间 / 结束时间');
                                ret.push(dataItem[0].stime + ' 至 ' + dataItem[0].stime);
                                ret.push('在线时长：' + dataItem[1].onlinetime);
                                ret.push('');
                                ret.push('MAC地址：' + dataItem[1].macadd);
                                ret.push('');
                                ret.push('流入流量 / 流出流量');
                                ret.push(dataItem[1].inflow + ' / ' + dataItem[1].outflow);
                                ret.push('总流量：' + dataItem[1].allflow);

                                return ret.join('<br />');
                            }
                        }
                    }, {
                        coord: toCoord
                    }]);
                }
            })(i);
        }
        return res;
    };

    var geoCoordMap = getCoordMap();

    function getDefaultCoordData () {
        var map = getCoordMap();
        var data = [];
        for (var attr in map) {
            data.push({
                name: attr,
                value: map[attr]
            });
        }
        return data;
    }

    function initArrow () {
        var on = false;
        $('.arrow').on('click', function () {
            var $this = $(this);
            if (!on) {
                $('#hint').animate({
                    left : 0
                }, 150, function (){
                    $this.text('<');
                })
            } else {
                $('#hint').animate({
                    left : "-125px"
                }, 200, function (){
                    $this.text('>');
                });
            }

            on = !on;

            $this.attr('data-on', on)
        });

        $('#hint').on('click', 'li', function (){
            var text = $(this).text();
            var hour = parseInt(text.split(':')[0]);
            var currentOpt = APP.chartEl.getOption();
            currentOpt.timeline[0].currentIndex = hour;
            APP.chartEl.setOption(currentOpt);
            $('[data-type="date"]').find('.active').click();
        });
    }

    function initApp() {

        initArrow();

        // 全局记录，按whole-data.json定义的数据模型生成
        util.setCache('R', {});

        // 全局记录列表，每个列为wifiVO的实体类数据结构
        util.setCache('voList', []);

        initDataTree(function() {
            var timeline = new Timeline('timeline');
            timeline.init();

            //var option = generateOptionByGivenDate(2015, 11, 26); // test

            $.get('node_modules/echarts/map/json/province/tianjin.json', function(chinaJson) {
                echarts.registerMap('tianjin', chinaJson);
                
                var option = {
                    backgroundColor: '#404a59',
                    title: {
                        text: APP.TITLE,
                        subtext: APP.SUB_TITLE,
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        position: function (point, params, dom) {
                          // 固定在顶部
                          return [point[0], point[1]];
                      }
                    },
                    legend: {
                        orient: 'vertical',
                        y: 'bottom',
                        x: 'right',
                        data: ['学校坐标'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: {
                        map: 'tianjin',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series: [{
                        name: '坐标点',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: getDefaultCoordData(),
                        symbolSize: 10,
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#a6c84c',
                                shadowBlur: 2,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 1
                    }]
                };

                chart.setOption(option);
                //chart.setOption(getChartOption([]));
            });

        });
    };

    function generateOptionByGivenDate(year, month, day) {
        var timeLineData = getTimelineData();
        var options = [];

        timeLineData.forEach(function(item, index) {
            var data = getPathData(year, month, day, index);
            var color = ['#a6c84c', '#ffa022', '#46bee9'];

            var series = [];
            [
                ['天津', data]
            ].forEach(function(item, i) {
                series.push({
                    name: '坐标点',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: getDefaultCoordData(),
                    symbolSize: 10,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#a6c84c',
                            shadowBlur: 2,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                }, {
                    type: 'lines',
                    name: item[0],
                    //type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#fff',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                }, {
                    name: item[0],
                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 20,
                        trailLength: 0,
                        symbol: 'circle',
                        symbolSize: 12
                    },
                    lineStyle: {
                        normal: {
                            color: color[2],
                            width: 1,
                            opacity: 0.4,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                });
            });

            var newItem = {
                title: {
                    text: APP.TITLE
                },
                series: series
            };

            options.push(newItem);
        });

        return getChartOption(options);
    };


    function initDataTree(callback) {
        $.getJSON('data.json', function(data) {
            APP.buildStructuredRecords(APP.buildVOList(data));
            callback && callback();
        });
    }

    function getDateRanges() {
        var R = util.getCache('R');
        var ret = {};
        for (var year in R) {
            ret[year] = [];
            var item = R[year];
            for (var month in item) {
                var newItem = item[month];
                ret[year][month] = [];
                for (var day in newItem) {
                    ret[year][month].push(day);
                }
            }
        }
        return ret;
    };

    function timelineTpl() {
        var tpl = '<li class="range-time-item">{{TEXT}}</li>';
        return tpl;
    }

    function Timeline(id) {
        this.id = id;
    };
    Timeline.prototype = {
        constructor: Timeline,
        init: function() {
            this.buildTimeline();
        },
        buildTimeline: function() {
            var $timeline = $('#' + this.id);
            var data = getDateRanges();

            this.buildMonthList(data, $timeline);
            this.buildDateList(data, $timeline);

            this.bindTimelineEvent($timeline);
        },
        buildMonthList: function(data, $ctx) {
            var $dom = $ctx.find('ul').first();
            var tpl = [];
            for (var year in data) {
                var months = data[year];
                for (var i in months) {
                    var m = i;
                    m = m < 10 ? '0' + m : m;
                    m = year.substring(2) + '-' + m;

                    var tmp = timelineTpl();
                    tmp = tmp.replace("{{TEXT}}", m);

                    tpl.push(tmp);
                }
            }
            $dom.html(tpl.join(''));
        },
        buildDateList: function(data, $ctx, given) {
            var $dom = $ctx.find('ul').last();
            var tpl = [];
            if (!!given && given.length) {
                for (var i = 0, l = given.length; i < l; i++) {
                    var m = given[i];
                    m = m < 10 ? '0' + m : m;
                    var tmp = timelineTpl();
                    tmp = tmp.replace("{{TEXT}}", m);
                    tpl.push(tmp);
                }
            } else {
                console.log('given', given);
                for (var i = 1, l = 31; i <= l; i++) {
                    var m = i;
                    m = m < 10 ? '0' + m : m;
                    var tmp = timelineTpl();
                    tmp = tmp.replace("{{TEXT}}", m);
                    tpl.push(tmp);
                }
            }

            $dom.html(tpl.join(''));
        },
        bindTimelineEvent: function($ctx) {
            var that = this;
            var setDate = function() {
                var date = $ctx.find('ul').first().find('li.active').text();
                var day = $ctx.find('ul').last().find('li.active').text();
                var ym = date.split('-');
                var year = ym[0];
                var month = ym[1];

                day = day != '' ? day + '日' : '';

                var dateText = '20' + year + '年' + month + '月' + day;

                if (!year) dateText = '';

                $dateDom.find('h4').text(dateText);
                $('#hint').find('.time-list').empty();
            };

            $ctx.find('ul').last().hide();
            $ctx.on('click', 'li', function(ev) {
                var $li = $(ev.target);
                var $ul = $(this).closest('ul');
                var type = $ul.attr('data-type');

                $li.addClass('active').siblings().removeClass('active');
                switch (type) {
                    case 'month':
                        $ul.hide();

                        var ym = $ul.find('li.active').text().split('-');
                        var year = '20' + ym[0];
                        var month = ym[1];

                        that.buildDateList({}, $ctx, getValidDays(year, month));

                        $ctx.find('ul').last().fadeIn('slow');
                        setDate();
                        break;
                    case 'date':
                        // 获取年月日， 刷新图表
                        var dateObj = getSelectedDate($ctx);
                        rerenderMap(dateObj);
                        setDate();

                        buildValidHints(dateObj);
                        break;
                }

            });

            var $dateDom = $('.reset-date');
            $('#reset-date-btn').click(function() {
                var $aUl = $ctx.find('ul');
                $ctx.find('.active').removeClass('active');
                $aUl.first().show();
                $aUl.last().hide();
                setDate();
            });
        }
    };


    function buildValidHints (dateObj) {
        var year = dateObj.year;
        var month = dateObj.month;
        var day = dateObj.day;

        var R = util.getCache('R');
        var dayMap = R[year][month][day];

        var list = [];
        for (var key in dayMap) {
            if (dayMap[key].length) {
                list.push(key);
            }
        }

        var $timeList = $('#hint').find('.time-list');
        $timeList.empty();

        var tpl = '';
        list.forEach(function(period){
            var tmp = period < 10 ? '0' + period : period;
            tmp += ':00';
            tpl += '<li class="time-list-item">' + tmp + '</li>';
        });

        $timeList.html(tpl);

        if (typeof $('#hint').attr('data-first') === 'undefined') {
            $('#hint').find('.arrow').trigger('click');

            $('#hint').attr('data-first', true);
        }
    }

    function getValidDays(year, month) {
        var R = util.getCache('R');
        var months = R[year][parseInt(month)];
        var ret = [];
        for (var day in months) {
            ret.push(day);
        }

        return ret;
    }

    function getSelectedDate($ctx) {
        var $aUl = $ctx.find('ul');
        var $firstUl = $aUl.first();
        var $lastUl = $aUl.last();
        var $ymLi = $firstUl.find('li.active');
        var $dayLi = $lastUl.find('li.active');
        var ym = $ymLi.text().split('-');
        var year = parseInt(ym[0]);
        var month = parseInt(ym[1]);
        var day = parseInt($dayLi.text());

        year = '20' + year; // 修正简化版本的年格式

        var ret = {
            year: year,
            month: month,
            day: day
        };

        return ret;
    }

    function rerenderMap(json) {
        var year = json.year;
        var month = json.month;
        var day = json.day;
        var option = generateOptionByGivenDate(year, month, day);
        chart.setOption(option);
    }

    function getSchoolMapping() {
        return WifiVO.prototype.getNameMappingArray();
    }

    function getCoordMap() {
        var map = getSchoolMapping();
        var data = {};
        for (var i in map) {
            var item = map[i];
            for (var id in item) {
                var t = item[id];
                data[t.name] = t.coords;
            }
        }
        return data;
    }

    function getChartOption(options) {
        // 生成对应的地图坐标点
        var color = ['#a6c84c', '#ffa022', '#46bee9'];
        var option = {
            backgroundColor: '#404a59',
            title: {
                text: APP.TITLE,
                subtext: APP.SUB_TITLE,
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                position: function (point, params, dom) {
                      // 固定在顶部
                      return [point[0], point[1]];
                  },
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['天津'],
                textStyle: {
                    color: '#fff'
                },
                selectedMode: 'single'
            },
            geo: {
                map: 'tianjin',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            timeline: {
                show: true,
                type: 'slider',
                axisType: 'category',
                symbol: 'circle',
                symbolSize: 10,
                realtime: true,
                playInterval: 3000,
                data: getTimelineData(), // 24h
                label: {
                    normal: {
                        rotate: 45,
                        textStyle: {
                            color: '#ffffff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffffff'
                    }
                },
                lineStyle: {
                    show: true,
                    color: '#0099ff'
                },
                controlStyle: {
                    normal: {
                        color: '#0099ff'
                    }
                },
                bottom: 15

            },
            series: [{
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#fff',
                        symbol: "circle",
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: color[0],
                            width: 0,
                            curveness: 0.2
                        }
                    }
                }, {
                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: "circle",
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            width: 1,
                            opacity: 0.4,
                            curveness: 0.2
                        }
                    }
                }, {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function(val) {
                        return val[2] / 8;
                    },
                    itemStyle: {
                        normal: {
                            color: color[1]
                        }
                    }
                }]
                //series
        };

        var targetOption = {
            baseOption: option,
            options: options
        };
        return targetOption;
    }


    function getTimelineData() {
        var ret = [];

        for (var i = 0; i < 24; i++) {
            var hour = i < 10 ? '0' + i : i;
            var time = hour + ':00';
            ret.push(time);
        }
        return ret;
    }


    function isUndefined(obj) {
        return typeof obj === 'undefined';
    }

    function preIterateMap(year, month, day, hour) {
        var R = util.getCache('R');
        if (isUndefined(R[year])) R[year] = {};
        if (isUndefined(R[year][month])) R[year][month] = {};
        if (isUndefined(R[year][month][day])) R[year][month][day] = {};
        if (isUndefined(R[year][month][day][hour])) R[year][month][day][hour] = [];
    };

    function getPathData(year, month, day, hour) {
        preIterateMap(year, month, day, hour);

        var R = util.getCache('R');
        var ret = [];
        var list = R[year][month][day][hour];

        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var arr = [];
            // from
            arr.push({
                name: item.path.from,
                stime: item.stime,
            });

            // to 
            arr.push({
                name: item.path.to,
                username: item.username,
                etime: item.etime,
                macadd: item.macadd,
                inflow: item.inflow,
                onlinetime: item.onlinetime,
                outflow: item.outflow,
                allflow: item.allflow,
                value: 100
            });
            ret.push(arr);
        }

        return ret;
    }


    initApp();
});
