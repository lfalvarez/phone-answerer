var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(201, {'Location': '/api/v1/message/12/',
						'Content-Type': 'text/plain'});
  res.end('');
}).listen(1337, '127.0.0.1');