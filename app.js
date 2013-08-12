
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , tropowebapi = require('tropo-webapi')
  , path = require('path')
  , mongoose = require('mongoose')
  , IncomingCallRecord = require('./lib/models/incoming_call_record')
  , RemoteMessage = require('./lib/models/remote_message')
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
  var number = req.body.session.parameters.number
  var tropo = new tropowebapi.TropoWebAPI();
  var content = new Say()
  content.value = req.body.session.parameters.msg
  var message = new Message()
  message.say = content
  // note to self the from international number
  // must be in the following format
  // 11234567890
  // and the chilean number must be in the format
  // 56912345678
  message.from = config.from_international_number
  message.network = "SMS"
  message.to = number
  tropo.tropo.push({'message':message})

  res.send(tropowebapi.TropoJSON(tropo))
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
    app.set('file_name',record_file_name)
    record.url = config.url+record_file_name+".wav";
    record.password = config.password;
    record.username = config.username;
    tropo.tropo.push({"record":record})
    var from_number = req.body.session.from.name.substring(0,2)
    from_number += "XXXXXXXX"
    from_number += req.body.session.from.name.substring(10,12)
    var options = {
        "headers":{"authorization":"ApiKey "+config.writeit_username+":"+config.writeit_key},
        "json": {
                'author_name' : from_number,
                'subject': 'Mensaje telefónico',
                'content': config.recording_root_url + app.get('file_name')+".wav",
                'writeitinstance': config.remote_writeitinstance_url,
                'persons': 'all'
            }
    }
    var post_url = config.writeit_url + '/api/v1/message/'
    request.post(post_url ,options, function(error, response, body){
      var record = IncomingCallRecord();
      record.from = req.body.session.from.name;
      var remote_message = new RemoteMessage()
      remote_message.remote_url = response.headers['location']
      remote_message.save(function(){
        record.remote_message = remote_message
        record.save(function(){
          res.send(tropowebapi.TropoJSON(tropo));
        })
        
      })
      
    })
    
  }
	
})
var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});
module.exports = app;