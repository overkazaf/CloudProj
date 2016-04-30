var fs = require('fs');

var pickedMap = {
	'OBD_INFO_HISTORY.json' : {
		direct : [
			'内部ID', 
			'平均节气门开合角度',
			//'平均油压', 
			'平均点火正时',
			'平均进气温度',
			'入库时间'
		],
		indirect : [
			'内部ID',
			'平均冷却液水温', 
			'平均空气流量', 
			'平均电瓶电压',
			'入库时间'
		]
	},
	'OBD_INFO_IMMEDIATE_HISTORY.json' : {
		direct : [
			'内部ID',
			'平均速度', 
			'前一次时间段至此引擎平均转速', 
			'当前引擎温度', 
			'引擎负荷',
			'入库时间'
		],
		indirect : [
			//'内部ID', 
			//'入库时间'
		]
	}
};


function composeJSONAsync () {
	var counter = 0;
	var directList = [];
	var inDirectList = [];
	for (var fileId in pickedMap) {
		(function (fileName){
			var current = pickedMap[fileName];
			fs.readFile(fileName, 'utf-8', function (err,data) {
				if (err) throw err;
				counter++;
				
				var listedData = JSON.parse(data);

				listedData.forEach(function (item, index) {
					//if(index > 400) return;
					var newDirectItem = {};
					var newInDirectItem = {};
					var dArray = current['direct'];
					var idArray = current['indirect'];
					
					[
						dArray, 
						idArray
					].forEach(function (array, idx){
						switch (idx) {
							case 0:
								// 直接参数
								array.forEach(function (p) {
									newDirectItem[p] = item[p];
								});
								break;
							case 1:
								// 间接参数
								array.forEach(function (p) {
									newInDirectItem[p] = item[p];
								});
							break;
						}
						
					});


					if (isObjHasProp(newDirectItem)){
						directList.push(newDirectItem);
					}
					
					if (isObjHasProp(newInDirectItem)) {
						inDirectList.push(newInDirectItem);
					}

				});

				if (counter == 2) {
					directList = mergeListItems(directList);
					inDirectList = mergeListItems(inDirectList);


					directList = calcListItemAverage(directList);
					inDirectList = calcListItemAverage(inDirectList);

					fs.writeFile('OUTPUT_DIRECT.json', JSON.stringify(directList), 'utf8', function(err){
					  if (err) throw err;
					  console.log('OUTPUT_DIRECT.json has been saved by ' + directList.length + ' valid records');
					});

					fs.writeFile('OUTPUT_INDIRECT.json', JSON.stringify(inDirectList), 'utf8', function(err){
					  if (err) throw err;
					  console.log('OUTPUT_INDIRECT.json has been saved by ' + inDirectList.length + ' valid records');
					});
				}

			});
		})(fileId);
	}
};

function isObjHasProp (obj) {
	var hasProp = false;  
    for (var prop in obj){  
        hasProp = true;  
        break;  
    }

    return hasProp;
}

function contains (key, arr) {
	for (var i = 0, l = arr.length; i < l; i++) {
		if (key == arr[i]) {
			return true;
		}
	}

	return false;
}

function uKey (a, b) {
	return a + '__' + b;
}

function calcListItemAverage (list) {
	list.forEach(function (item) {
		for (var attr in item) {
			if (isArray(item[attr])) {
				var array = item[attr];
				if (array.length > 0) {
					var sum = 0;
					array.forEach(function (val) {
						sum += val;
					});
					sum /= array.length;

					item[attr] = +new Number(sum).toFixed(2);
				}
			}
		}
	});

	return list;
}

function mergeListItems (list) {
	var newList = [];
	var cache = {};
	var uniqKey = ['内部ID', '入库时间'];

	list.forEach( function (current){
		
		var key = uKey(current['内部ID'], current['入库时间']);
		var tempIndex = -1;
		var tempItem = {};
		if (key in cache) {
			tempIndex = cache[key];
			tempItem = newList[tempIndex];

			for (var attr in current) {
				if (attr in tempItem) {
					if (contains(attr, uniqKey)) {
						continue;
					}
				} else {
					tempItem[attr] = [];
				}

				tempItem[attr].push(current[attr]);
			}
		} else {
			for (var attr in current) {
				if (contains(attr, uniqKey)) {
					tempItem[attr] = current[attr];
				} else {
					tempItem[attr] = [];
					tempItem[attr].push(current[attr]);
				}
			}

			newList.push(tempItem);

			cache[key] = newList.length - 1;
		}

	});
	return transArrayData2FloatValue(newList);
}


var objtostr = Object.prototype.toString;
var isArray = function (obj) {
	return objtostr.call(obj) === '[object Array]';
}

function transArrayData2FloatValue (list) {
	list.forEach(function (item) {
		for (var attr in item) {
			if (isArray(item[attr])) {
				var currentArray = item[attr];
				for (var j = 0, jl = currentArray.length; j < jl; j++) {
					currentArray[j] = parseFloat(currentArray[j]);
				}
			}
		}
	});
	return list;
}

composeJSONAsync();
