var http = require('http');
http.createServer(function (req, res) {
	if(req.url == '/api/v1/message/'){
		res.writeHead(201, {'Location': '/api/v1/message/12/',
						'Content-Type': 'text/plain'});
  		res.end('');
	}
	if(req.url == '/api/v1/message/3'){
		console.log(req)
	}
  
}).listen(1337, '127.0.0.1');