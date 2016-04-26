$(function() {
    var APP = {
        DEBUG: true,
        INTERFACE_IMPLEMENTED: false,
        BASE_INTERFACE: 'http://localhost:3000',
        FILE_PATH: {
            exponent: 'exponent.json',
            dangan: 'dangan_search.json',
            exponentChart10: 'exponent-chart-10.json'
        },
        DATA: {
            exponent: null,
            dangan: null,
            exponentChart10: null
        },
        DEALS: ['turnover', 'exponent', 'outcount'],
        TAB_ID: '#tab-list',
        TAB_CONTAINER_ID: '#tab-conatiner',
        zeroData: null,
        PLAT_IDS: {
            0: '网贷指数',
            57: '人人贷',
            52: '拍拍贷',
            60: '红岭创投',
            59: '陆金所',
            85: '宜人贷',
            116: '开鑫贷',
            689: '爱钱进',
            38: '微贷网',
            142: '有利网',
            984: '金宝保',
            942: '易贷网',
            129: '点融网'
        },
        chartList: []
    };

    function checkDataLoaded() {
        var flag = true;
        for (var fileId in APP.DATA) {
            if (APP.DATA[fileId] == null) {
                flag = false;
            }
        }
        return flag;
    }

    function initApp() {
        initData();
        renderTab(initTabEvents);
        $('.charts').hide();
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });


        var fn = function() {
            if (!checkDataLoaded()) {
                setTimeout(fn, 500);
                return;
            }
            renderDeal();
            batchRenderCharts();
        };

        fn();

    };

    function batchRenderCharts() {
        for (var id in APP.PLAT_IDS) {
            renderChart(id, APP.PLAT_IDS[id]);
        }
    }

    function renderDeal() {
        var data = APP.DATA['exponent'];
        for (var i = 0, deals = APP.DEALS, l = deals.length; i < l; i++) {
            var id = deals[i];
            $('#' + id).text(data[id])
        }

        $('.charts').show();
    }

    function renderTab(callback) {
        var tpl = '',
            containerTpl = '';

        for (var id in APP.PLAT_IDS) {
            var name = APP.PLAT_IDS[id];
            var fixedClass = id == 0 ? ' header-item' : '';
            tpl += '<li data-id="' + id + '" class="tab-list-item' + fixedClass + '"><span class="arrow"></span><a href="#">' + name + '</a></li>';


            containerTpl += '<div id="chart_' + id + '" class="tab-container-item"></div>';
        }

        $(APP.TAB_ID).html(tpl);
        $(APP.TAB_CONTAINER_ID).html(containerTpl);

        callback && callback();
    }

    function initTabEvents() {
        var $containers = $(APP.TAB_CONTAINER_ID).find('.tab-container-item');
        $(APP.TAB_ID).on('mouseenter', 'li', function(ev) {
            var $target = $(ev.target);
            var index = $target.index();
            if (index > 0) {
                $('.deal-container').hide();
            } else {
                $('.deal-container').show();
            }

            $containers.hide().eq(index).show();
        });

        $(APP.TAB_ID).find('li:first').trigger('mouseenter');
    }


    function getCandlestick(series) {
        return {
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                width: 700,
                height: 360
            },
            rangeSelector: {
                enabled: false, //暂时关闭
                inputEnabled: false //关闭日期区间的输入
            },

            credits: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            title: {
                text: ''
            },
            xAxis: [{
                type: 'date', //定义x轴上日期的显示格式
                gridLineColor: '#dcdcdc',
                labels: {
                    formatter: function() {
                        return Highcharts.dateFormat('%m/%d', this.value);
                    },
                    align: 'center'
                }
            }],
            yAxis: [{
                title: {
                    text: '利率（%）',
                    style: {
                        color: '#333333',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: '#dcdcdc',
                height: 100,
                opposite: false
            }, {
                title: {
                    text: '成交量',
                    style: {
                        color: '#333333',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: '#dcdcdc',
                top: 160,
                offset: 40,
                opposite: true,
                height: 130
            }, {
                title: {
                    text: '人气(人)',
                    style: {
                        color: '#333333',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: '#dcdcdc',
                top: 160,
                height: 130,
                opposite: false,
                offset: 0
            }],
            tooltip: {
                xDateFormat: "%Y年%m月%d日"
            },
            series: series
        }
    }

    function getCandlestick1(series) {
        return {
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                width: 700,
                height: 320
            },
            rangeSelector: {
                enabled: false, //暂时关闭
                inputEnabled: false //关闭日期区间的输入
            },
            credits: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            title: {
                text: ''
            },
            xAxis: [{
                type: 'date', //定义x轴上日期的显示格式
                gridLineColor: '#dcdcdc',
                labels: {
                    formatter: function() {
                        return Highcharts.dateFormat('%m/%d', this.value);
                    },
                    align: 'center'
                }
            }],
            yAxis: [{
                title: {
                    text: '利率指数',
                    style: {
                        color: '#333333',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: '#dcdcdc',
                height: 100,
                opposite: false
            }, {
                title: {
                    text: '成交指数',
                    style: {
                        color: '#333333',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: '#dcdcdc',
                top: 120,
                height: 130,
                offset: 20
            }, {
                title: {
                    text: '人气指数',
                    style: {
                        color: '#333333',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: '#dcdcdc',
                top: 120,
                height: 130,
                opposite: false,
                offset: 0
            }],
            tooltip: {
                xDateFormat: "%Y年%m月%d日"
            },
            series: series
        }
    }

    function getChartOption(id, json) {
        if (id == 0) {
            return getCandlestick1(json);
        } else {
            return getCandlestick(json);
        }
    }

    function paserStockData(data) {
        var rate = [],
            money = [],
            outCount = [];

        for (var i = 0; i < data.length; i++) {
            rate.push([
                data[i][0], // the date
                data[i][1] // spline
            ]);
            money.push([
                data[i][0], // the date
                data[i][3] // the exponent
            ]);
            outCount.push([
                data[i][0], // the date
                data[i][2]
            ])
        }

        var groupingUnits = [
            ['week', [1]],
            ['month', [1, 2, 3, 4, 5, 6]]
        ];

        var series = [{
            type: 'spline',
            name: '利率',
            data: rate,
            lineWidth: 2,
            marker: {
                fillColor: '#ff4400',
                enabled: true,
                radius: 4
            },
            dataGrouping: {
                units: groupingUnits
            },
            color: '#4572A7'
        }, {
            type: 'column',
            name: '成交量',
            data: money,
            colorByPoint: true,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            },
            colors: ['#0099ff', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
                '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'
            ],
            color: "#0099ff"
        }, {
            type: 'spline',
            name: '人气',
            data: outCount,
            yAxis: 2,
            lineWidth: 2,
            marker: {
                fillColor: '#2b2b2b',
                enabled: true,
                radius: 4
            },
            dataGrouping: {
                units: groupingUnits
            },
            color: "#e6bc8a"
        }];
        return series;
    }

    function renderChart(id, name) {
        var data = APP.DATA['exponentChart10'];
        if (data) {
            if (data.length > 1) {
                $.each(data, function(i, item) {
                    if (item.platId == id) {
                        var json = paserStockData(item.data);
                        if (!$("#chart_" + id).attr('data-init')) {
                            var option = getChartOption(id, json);
                            var chartEl = $('#chart_' + id).highcharts('StockChart', option);
                            APP.chartList.push(chartEl);

                        }
                        return;
                    }
                });
            } else {
                if (!APP.zeroData) {
                    APP.zeroData = [];
                    var tempData = data.day[0].data;
                    for (var i = 0; i < tempData.length; i++) {
                        zeroData[i] = [];
                        zeroData[i][0] = tempData[i][0];
                        for (var j = 1; j < tempData[i].length; j++) {
                            APP.zeroData[i][j] = 0;
                        }
                    }
                }
                var json = paserStockData(APP.zeroData);
                $("#chart_" + id).highcharts('StockChart', getChartOption(id, json));
            }
        }
    }

    function getFilePath(fileName) {
        return APP.BASE_INTERFACE + '/file/' + fileName;
    }






    function getJSON(fileName) {
        return $.getJSON(getFilePath(fileName));

    }

    function getStaticFile(fileId) {
        //APP.DATA[fileId] = StaticFile[fileId]();

        var $iframe = $('<iframe>').attr({
            width: 0,
            height: 0,
            frameBorder: 0,
            src: APP.FILE_PATH[fileId]
        });
        $iframe.appendTo($(document.body));
        $iframe.on('load', function() {
            var contents = $iframe.contents().find('pre').text();
            APP.DATA[fileId] = JSON.parse(contents);
        });
    }

    function initData() {
        for (var f in APP.FILE_PATH) {
            if (APP.INTERFACE_IMPLEMENTED) {
                + function(fileId) {
                    if (!!APP.DATA[fileId]) return;
                    getJSON(APP.FILE_PATH[fileId]).then(function(data) {
                        APP.DATA[fileId] = data;
                    });
                }(f);
            } else {
                + function(fileId) {
                    console.log('fileId', fileId);
                    getStaticFile(fileId);
                }(f);
            }
        }
    }

    function log(k, v) {
        if (APP.DEBUG) {
            console.log(k, v);
        }
    }



    initApp();
});
