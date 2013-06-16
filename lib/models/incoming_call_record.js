var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var RecordSchema = mongoose.Schema({
	'from':'string'

});
RecordSchema.plugin(timestamps);
var IncomingCallRecord = mongoose.model('IncomingCallRecord', RecordSchema);

module.exports = IncomingCallRecord;