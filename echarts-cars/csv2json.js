var csvjson = require('csvjson');
csvjson.toObject('./history.csv').output;
csvjson.toObject('./history.csv').save('./indirect.json');
csvjson.toObject('./immediate.csv').output;
csvjson.toObject('./immediate.csv').save('./direct.json');