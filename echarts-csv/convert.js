// var csvjson = require('csvjson');
// csvjson.toObject('./csv/BasicInfo.csv').output;
// csvjson.toObject('/csv/BasicInfo.csv').save('./output/BasicInfo.json');

// csvjson.toObject('./csv/AdministrativeArea.csv').output;
// csvjson.toObject('/csv/AdministrativeArea.csv').save('./output/AdministrativeArea.json');

// csvjson.toObject('./csv/DeseaseHistory.csv').output;
// csvjson.toObject('/csv/DeseaseHistory.csv').save('./output/DeseaseHistory.json');

// csvjson.toObject('./csv/ArchivesCases.csv').output;
// csvjson.toObject('/csv/ArchivesCases.csv').save('./output/ArchivesCases.json');

// csvjson.toObject('./csv/DangerFactors.csv').output;
// csvjson.toObject('/csv/DangerFactors.csv').save('./output/DangerFactors.json');

// csvjson.toObject('./csv/GB_native.csv').output;
// csvjson.toObject('/csv/GB_native.csv').save('./output/GB_native.json');

var fs = require("fs");

var Converter = require("csvtojson").Converter;
var converter = new Converter({});


var fileMap = {
	'basic' : {
		'in' : './csv/BasicInfo.csv',
		'out' : './output/BasicInfo.json'
	},
	'adm' : {
		'in' : './csv/AdministrativeArea.csv',
		'out' : './output/AdministrativeArea.json'
	},
	'history' : {
		'in' : './csv/DeseaseHistory.csv',
		'out' : './output/DeseaseHistory.json'
	},
	'arc' : {
		'in' : './csv/ArchivesCases.csv',
		'out' : './output/ArchivesCases.json'
	},
	'danger' : {
		'in' : './csv/DangerFactors.csv',
		'out' : './output/DangerFactors.json'
	},
	'gb' : {
		'in' : './csv/GB_native.csv',
		'out' : './output/GB_native.json'
	}
};
var doConvertion = function (key) {
	var item = fileMap[key];
	var _in = item['in'];
	var _out = item['out'];

	converter.fromFile(_in,function(err,result){
		if(err) throw err;
		fs.writeFile(_out, JSON.stringify(result) ,function (err) {
			if(err) throw err;
			console.log(_in + ' has been succefully written to ' + _out);
		})
	});
}

// doConvertion('basic');
// doConvertion('adm');
doConvertion('history');
// doConvertion('arc');
// doConvertion('danger');
// doConvertion('gb');