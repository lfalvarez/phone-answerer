
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , tropowebapi = require('tropo-webapi')
  , path = require('path')
  , mongoose = require('mongoose')
  , IncomingCallRecord = require('./lib/models/incoming_call_record')
  , request = require('request')
  , config = require('./config');

mongoose.connect(config.mongo_db);

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
app.post('/sms', function(req,res){
  var tropo = new tropowebapi.TropoWebAPI();
  var content = new Say()
  content.value = 'whatever'
  var message = new Message()
  message.say = content
  message.from = config.from_international_number
  tropo.tropo.push({'message':message})

  res.send(res.send(tropowebapi.TropoJSON(tropo)))
})

app.post('/', function(req, res){
  var tropo = new tropowebapi.TropoWebAPI();
  if(req.body.session.userType == 'HUMAN'){
    // Create a new instance of the TropoWebAPI object.
    
    // Use the say method https://www.tropo.com/docs/webapi/say.htm
    var welcome = new Say();
    welcome.value = "Di algo después del bip tienes 30 segundos!"
    welcome.voice = "Francisca"
    tropo.tropo.push({"say":welcome})


    var record = new Record();
    record.name = config.name;
    record_file_name = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    record.url = config.url+record_file_name+".wav";
    record.password = config.password;
    record.username = config.username;
    tropo.tropo.push({"record":record})

    var record = IncomingCallRecord();
    record.from = req.body.session.from.name;
    record.save(function(){
        var options = {
            "uri":config.writeit_answer_creation_endpoint,
            "headers":{"authorization":"ApiKey "+config.writeit_username+":"+config.writeit_key}
        }
        request.post(options, function(error, response, body){
          console.log("error")
          console.log("response")
          console.log("s")
        })
        res.send(tropowebapi.TropoJSON(tropo));
      })
  }
  else {
    var oliwi = new Say();
    oliwi.value = "oli felipinwi"
    call = new Call()
    call.to = 'tel:+56973961732'
    call.from = 'tel:+4038009468'

    tropo.tropo.push({"call":call})
    tropo.tropo.push({"say":oliwi})    

  }
  res.send(tropowebapi.TropoJSON(tropo));
	
})
var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});
module.exports = app;