var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')
var IncomingCallRecord = require('../lib/models/incoming_call_record')
var Answer = require('../lib/models/answer')
var send_sms_request = require('./fixtures/incoming_sms_request')
var answer_updater =  require('../answer_updater')
var RemoteMessage = require('../lib/models/remote_message')
var fs = require('fs')
var sinon = require("sinon")
var request_http = require("request")

describe("The Answer model", function(){
	after(function(done){
        IncomingCallRecord.remove(function(err){
            done()
        })
    });
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
    var record;
    var remote_message;
    var remote_answer_json;
    before(function(done){
        fs.readFile('./test/fixtures/writeit_api_message.json', 'utf-8', function (err, fileContents) {
          if (err) throw err;
          remote_answer_json = JSON.parse(fileContents);
        });
        record = IncomingCallRecord()
        record.from = '+56 9739123123'
        remote_message = new RemoteMessage()
        remote_message.remote_url = '/api/v1/message/3'
        remote_message.save(function(err){
            record.remote_message = remote_message
            record.save(function(err, documento){
                done()
            })
        })
    })
	after(function(done){
        IncomingCallRecord.remove(function(err){
            done()
        })
    });

	it('calls the writeit api url', function(done){
        request_get = sinon.stub(request_http, "get", function(uri, options, callback){
            
            options["headers"]["authorization"].should.equal("ApiKey "+config.writeit_username+":"+config.writeit_key)
            uri.should.equal(config.writeit_url + remote_message.remote_url)
            return remote_answer_json;
            });
		answer_updater.update(function(){
            request_get.calledOnce.should.be.true;
			done()
		})
	})
})