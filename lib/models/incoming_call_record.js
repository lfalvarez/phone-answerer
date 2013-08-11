var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var RemoteMessage = require('./remote_message')
var Answer = require('./answer')

var RecordSchema = mongoose.Schema({
	'from':'string',
	'remote_message': {
		type: mongoose.Schema.Types.ObjectId,
		ref: "RemoteMessage"

	},
	'answers':[{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Answer' 
	}]

});
RecordSchema.plugin(timestamps);
var IncomingCallRecord = mongoose.model('IncomingCallRecord', RecordSchema);

module.exports = IncomingCallRecord;