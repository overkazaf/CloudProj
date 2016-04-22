var chart_value;
var chart;
//删除冗余代码要查看请至svn20150702之前版本
/**
 * Spline Chart Template
 */
function getCandlestick(series) {
    return {
        chart: {
			backgroundColor: 'rgba(255, 255, 255, 0)',
            width: 575,
            height: 322
        },
        rangeSelector: {
            enabled:false,			//暂时关闭
            inputEnabled: false   //关闭日期区间的输入
        },
        credits:{
            enabled: false
        },
        scrollbar:{
            enabled:false
        },
        navigator: {
            enabled:false
        },
        title: {
            text: ''
        },
        xAxis:[{
            type: 'date', //定义x轴上日期的显示格式
            gridLineColor:'#dcdcdc',
            labels: {
                formatter: function() { return Highcharts.dateFormat('%m/%d', this.value);},
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
            gridLineColor:'#dcdcdc',
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
            gridLineColor:'#dcdcdc',
            top: 160,
            height: 130,
            offset: 20
        },{
            title: {
                text: '人气(人)',
                style: {
                    color: '#333333',
                    fontWeight: 'bold'
                }
            },
            gridLineColor:'#dcdcdc',
            top: 160,
            height: 130,
            opposite: false,
            offset: 0
        }],
        tooltip:{
            xDateFormat:"%Y年%m月%d日"
        },
        series:series
    }
}
function getCandlestick1(series) {
    return {
        chart: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            width: 575,
            height: 280
        },
        rangeSelector: {
            enabled:false,			//暂时关闭
            inputEnabled: false   //关闭日期区间的输入
        },
        credits:{
            enabled: false
        },
        scrollbar:{
            enabled:false
        },
        navigator: {
            enabled:false
        },
        title: {
            text: ''
        },
        xAxis:[{
            type: 'date', //定义x轴上日期的显示格式
            gridLineColor:'#dcdcdc',
            labels: {
                formatter: function() { return Highcharts.dateFormat('%m/%d', this.value);},
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
            gridLineColor:'#dcdcdc',
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
            gridLineColor:'#dcdcdc',
            top: 120,
            height: 130,
            offset: 20
        },{
            title: {
                text: '人气指数',
                style: {
                    color: '#333333',
                    fontWeight: 'bold'
                }
            },
            gridLineColor:'#dcdcdc',
            top: 120,
            height: 130,
            opposite: false,
            offset: 0
        }],
        tooltip:{
            xDateFormat:"%Y年%m月%d日"
        },
        series:series
    }
}
function paserStockData(data){
    var rate = [],money = [],outCount = [];

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
        ['week',[1]],
        ['month',[1, 2, 3, 4, 5, 6]]
    ];

    var series=[{
        name: '利率',
        data: rate,
        dataGrouping: {
            units: groupingUnits
        },
        color:'#0e7fb4'
    }, {
        type: 'column',
        name: '成交量',
        data: money,
        yAxis: 1,
        dataGrouping: {
            units: groupingUnits
        },
        color:"#0e7fb4"
    }, {
        type: 'spline',
        name: '人气',
        data: outCount,
        yAxis: 2,
        dataGrouping: {
            units: groupingUnits
        },
        color:"#e6bc8a"
    }];
    return series;
}
$(function(){
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    $.ajax({
        url:"/wdzj/html/json/exponent-chart-10.json",
        dataType:"jsonp",
        jsonpCallback: 'chartJsonpData',
        success: function (json){
            chart_value = json;
            daySpline('0','总交易量');
        }
    });
});
var firstFlag = false;
var zeroData;
function daySpline(id, name){
	if(firstFlag == true) {
		$(".data_dwm li a").removeClass("cur");
		$(".data_dwm li a").eq(0).addClass("cur");
	}
	firstFlag = true;
	
    if(chart_value){
        if(chart_value.length > 1){
            $.each(chart_value, function(i, item){
                if(item.platId == id){
                    var json = paserStockData(item.data);
                    if(id == 0){
                        $("#chartdiv"+id).highcharts('StockChart',getCandlestick1(json));
                    }else{
                        $("#chartdiv"+id).highcharts('StockChart',getCandlestick(json));
                    }
                    return;
                }
            });
        }else{
            if(!zeroData){
                zeroData = [];
                var data = chart_value.day[0].data;
                for(var i = 0; i < data.length; i++){
                    zeroData[i] = [];
                    zeroData[i][0] = data[i][0];
                    for(var j = 1; j < data[i].length; j++){
                        zeroData[i][j] = 0;
                    }
                }
            }
            var json = paserStockData(zeroData);
            if(id == 0){
                $("#chartdiv"+id).highcharts('StockChart',getCandlestick1(json));
            }else{
                $("#chartdiv"+id).highcharts('StockChart',getCandlestick(json));
            }
        }
    }
}
