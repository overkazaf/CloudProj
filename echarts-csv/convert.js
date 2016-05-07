var csvjson = require('csvjson');
csvjson.toObject('./csv/jbxx.csv').output;
csvjson.toObject('/csv/jbxx.csv').save('./output/jbxx.json');

csvjson.toObject('./csv/xzqh.csv').output;
csvjson.toObject('/csv/xzqh.csv').save('./output/xzqh.json');

csvjson.toObject('./csv/bls.csv').output;
csvjson.toObject('/csv/bls.csv').save('./output/bls.json');

csvjson.toObject('./csv/ArchivesCases.csv').output;
csvjson.toObject('/csv/ArchivesCases.csv').save('./output/ArchivesCases.json');

csvjson.toObject('./csv/DangerFactors.csv').output;
csvjson.toObject('/csv/DangerFactors.csv').save('./output/DangerFactors.json');

csvjson.toObject('./csv/GB_native.csv').output;
csvjson.toObject('/csv/GB_native.csv').save('./output/GB_native.json');