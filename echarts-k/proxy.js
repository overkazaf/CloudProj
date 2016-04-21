var http = require('http');
var qs = require('querystring');  
var url = require('url');  

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.writeHead(200, {"Content-Type": "text/html"});

	var params = url.parse(req.url, true).query;
	var path = params.target || '/shuju/json_yuany2.php';
	var hostname = params.host || 'kxt.tuojingtz.com';

	var data = {  
    	interval: params.interval,  
    	rows: params.rows
    };//这是需要提交的数据  
  

  
	var content = qs.stringify(data);

	var options = {  
	    hostname: hostname,  
	    port: 80,  
	    path: path + '?' + content,  
	    method: 'GET'  
	};

	  
	var target = '';
	var req = http.request(options, function (res) {  
	    target = '';
	    //console.log('STATUS: ' + res.statusCode);  
	    //console.log('HEADERS: ' + JSON.stringify(res.headers));  
	    res.setEncoding('utf8');  
	    
	    res.on('data', function (chunk) {  
	    	target += chunk;
	    }); 

	    res.on('end', function (){
	    	response.write(target);
	    	response.end();
	    }) 
	});  
	  
	req.on('error', function (e) {  
	    console.log('problem with request: ' + e.message);  
	});  
	  
	req.end();

});
console.log('proxy server has been running at port 5555');
server.listen(5555);