var csvjson = require('csvjson');
csvjson.toObject('./OBD_INFO_HISTORY.csv').output;
csvjson.toObject('./OBD_INFO_HISTORY.csv').save('./OBD_INFO_HISTORY.json');
csvjson.toObject('./OBD_INFO_IMMEDIATE_HISTORY.csv').output;
csvjson.toObject('./OBD_INFO_IMMEDIATE_HISTORY.csv').save('./OBD_INFO_IMMEDIATE_HISTORY.json');