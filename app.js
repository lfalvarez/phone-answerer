
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , tropowebapi = require('tropo-webapi')
  , path = require('path');

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
	tropo.say("Hello World!");

    res.send(tropowebapi.TropoJSON(tropo));
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;