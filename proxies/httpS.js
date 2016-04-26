var http = require('http');

http.createServer(function (req, res){
	
	var rawHeaders = req.rawHeaders;
	
	console.log(rawHeaders);
	rawHeaders[2] = 'hacked by john';

	console.log('rawHeaders', rawHeaders);
}).listen(9999);

console.log('Server has been running at port 9999');