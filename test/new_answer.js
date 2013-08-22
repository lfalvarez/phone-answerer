var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')
var IncomingCallRecord = require('../lib/models/incoming_call_record')
var Answer = require('../lib/models/answer')
var send_sms_request = require('./fixtures/incoming_sms_request')
var RemoteMessage = require('../lib/models/remote_message')
var fs = require('fs')
var sinon = require("sinon")
var request_http = require("request")
var sinon = require("sinon")
var request_http = require("request")
var url = require("url")

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

//ok I'm not going to retrieve a new answer
describe('When writeit posts to the webhook', function(){
    var record;
    var remote_message;
    var remote_answer_json;
    var writeit_payload = {
            'user':{
                'username':config.writeit_username,
                'apikey':config.writeit_key
            },
            'payload':{
                'message_id':'/api/v1/message/3/',
                'content':'holiwi',
                'person': 'Fiera'
            }
         

        };
    beforeEach(function(done){
        record = IncomingCallRecord()
        record.from = '+56 9739123123'
        remote_message = new RemoteMessage()
        remote_message.remote_url = '/api/v1/message/3/'
        remote_message.save(function(err){
            record.remote_message = remote_message
            record.save(function(err, documento){
                done()
            })
        })
    })
	afterEach(function(done){
        IncomingCallRecord.remove(function(err){
            Answer.remove(function(err){
                done()
            })
            
        })
    });
    it("creates a new answer",function(done){
        request(app)
        .post("/new_answer")
        .send(writeit_payload)
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res){
            should.not.exist(err)
            IncomingCallRecord.findOne({'_id': record._id})
                    .populate('answers')
                    .exec(function(err, record){
                        record.should.have.property('answers').with.lengthOf(1);
                        record.answers[0].content.should.equal('Fiera dijo holiwi')
                        
                        done()
                    })
        })
    });
    it("sends a request to tropo to send an sms", function(done){
        request_get = sinon.stub(request_http, "get", function(uri, options, callback){
            IncomingCallRecord.findOne({'_id': record._id})
                    .populate('answers')
                    .exec(function(err, record){
                        var answer_id = record.answers[0]._id;
                        uri.should.equal('http://api.tropo.com/1.0/sessions?action=create&token=' + config.tropo_messaging_api_key + '&id=' + answer_id)
                        done()
                    })
            
        });

        request(app)
        .post("/new_answer")
        .send(writeit_payload)
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res){
            should.not.exist(err)
            
        })
        
        
        
    })

})