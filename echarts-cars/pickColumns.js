var fs = require('fs');

var pickedMap = {
	'history.json' : {
		direct : [
			'内部ID', 
			'平均节气门开合角度',
			'平均油压', 
			'平均点火正时',
			'平均进气温度'
		],
		indirect : [
			'平均冷却液水温', 
			'平均空气流量', 
			'平均电瓶电压'
		]
	},
	'immediate.json' : {
		direct : [
			'平均速度', 
			'前一次时间段至此引擎平均转速', 
			'当前引擎温度', 
			'引擎负荷'
		],
		indirect : []
	}
};

var ChartParam = {
	"history.json" : [],
	"immediate.json" : []
};

function loadJSONAsync () {
	var counter = 0;
	for (var fileName in pickedMap) {
		var current = pickedMap[fileName];
		fs.readFile(fileName, 'utf-8', function (err,data) {
			if (err) throw err;
			counter++;
			var list = [];
			var listedData = JSON.parse(data);

			console.log(listedData.length + ' items have been parsed');

			listedData.forEach(function (item, index) {
				var newItem = {};
				var dArray = current['direct'];
				var idArray = current['indirect'];
				
				[
					dArray, 
					idArray
				].forEach(function (array){
					array.forEach(function (p) {
						if(p in item) {
							newItem[p] = item[p];
						}
					});
				});
					
				console.log('pushing item (' + index + ')', newItem);
				var t = 0;
				for (var key in  newItem) {
					t++;
				}
				if (t>0) {
					list.push(newItem);
				}
			});

			ChartParam[fileName] = list;

			if (counter == 2) {
				console.log(ChartParam);
			}
		});
	}
};

loadJSONAsync();
