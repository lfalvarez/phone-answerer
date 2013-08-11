var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')
var IncomingCallRecord = require('../lib/models/incoming_call_record')
var Answer = require('../lib/models/answer')
var send_sms_request = require('./fixtures/incoming_sms_request')

describe("The Answer model", function(){
	it("is created", function(){
		var answer = new Answer();
		answer.content = 'oliwi me gusta mucho lo que preguntaste';
		answer.save(function(err, doc){
			doc.should.have.property('content', 'oliwi me gusta mucho lo que preguntaste');
			doc.should.have.property('answered', false);
			doc.should.have.property('createdAt')
		})
	});
	it('is related to an answer', function(done){
		var record = IncomingCallRecord()
        record.from = '+56 9739123123'
        var answer = new Answer()
        answer.content = 'si tienes mucha razón';


        answer.save(function(err, answer){
        	record.answers.push(answer._id);
        	record.save(function(err, record){
        		IncomingCallRecord.findOne()
        			.populate('answers')
        			.exec(function(err, record){
        				record.should.have.property('answers').with.lengthOf(1);
        				record.answers[0].content.should.equal(answer.content)
        				record.answers[0]._id.toString().should.equal(answer._id.toString())
        				
        				done()
        			})
        	})
        })
	})
})

describe('When retrieving new answers', function(){
	it('creates a new answer related to the question', function(){

	})
})