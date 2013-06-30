var mongoose = require('mongoose');

var RemoteMessageSchema = mongoose.Schema({
	'remote_url':'string'

});

var RemoteMessage = mongoose.model('RemoteMessage', RemoteMessageSchema);

module.exports = RemoteMessage