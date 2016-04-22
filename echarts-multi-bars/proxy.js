var express = require('express');
var app = express();
var fs = require('fs');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send('hello world');
});

app.use('/file/:fileName', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  fs.readFile(req.params.fileName, 'utf-8', function (err, data) {
  	if (err) throw err;
  	res.send(data);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});