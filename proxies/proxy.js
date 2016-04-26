var https = require('https');
var fs = require('fs');

var options =  {
	key : fs.readFileSync('./server.key'),
	cert : fs.readFileSync('./server.crt')
};

https.createServer(options, function (req, res) {
	console.log(req);
	res.writeHead(200);
	res.end('hahah');
}).listen(5555);