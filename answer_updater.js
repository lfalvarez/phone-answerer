var request = require('request')
var config = require('./config');
var answer_updater = function(callback){
	
	var get_url = config.writeit_url;
	var options = {
        "headers":{"authorization":"ApiKey "+config.writeit_username+":"+config.writeit_key}
    }
	request.get(get_url ,options, function(error, response, body){

	})
	if(callback!=undefined){
		callback()
	}
}
module.exports.update = answer_updater