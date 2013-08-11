var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');


var AnswerSchema = mongoose.Schema({
	'content':'string',
	'answered' : { type: Boolean, default: false }
})
AnswerSchema.plugin(timestamps);
var Answer = mongoose.model('Answer', AnswerSchema);
module.exports = Answer