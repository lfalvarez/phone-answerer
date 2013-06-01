
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , tropowebapi = require('tropo-webapi')
  , path = require('path')
  , config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/', function(req, res){
	// Create a new instance of the TropoWebAPI object.
	var tropo = new tropowebapi.TropoWebAPI();
	// Use the say method https://www.tropo.com/docs/webapi/say.htm
	tropo.say("Di algo después del bip tienes 30 segundos!",null, null, null, "Francisca");
  tropo.record(null, null, null, null, null, null, null, null, null, config.name , null, null,null,null, config.url ,config.password,config.username)

    res.send(tropowebapi.TropoJSON(tropo));
})
var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});
module.exports = app;