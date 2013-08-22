var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')
var IncomingCallRecord = require('../lib/models/incoming_call_record')
var Answer = require('../lib/models/answer')
var send_sms_request = require('./fixtures/incoming_sms_request')

console.log()

describe("when the app sends an SMS", function(){
    var tropo_response;
    before(function(done){
        var record = IncomingCallRecord()
        record.from = '+56 9739123123'
        var answer = new Answer()
        answer.content = 'Fiera dijo si tienes mucha razón';

        answer.save(function(err, answer){
            record.answers.push(answer._id);
            record.save(function(err, record){
                send_sms_request.session.parameters.id = answer._id
                request(app)
                .post("/sms")
                .send(send_sms_request)
                .set('Accept', 'text/html')
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err)
                    tropo_response = JSON.parse(res.text).tropo;
                    
                    done();
                })
            })
        })
        
    }); 
    after(function(done){
        IncomingCallRecord.remove(function(err){
            Answer.remove(function(err){
                done()
            })
        })
    });
    beforeEach(function(){

    });
    afterEach(function(){
        
    });
    it("it says whatever from the international number", function(){
        var message = tropo_response[0].message;
        var say = message.say
        message.say.value.should.equal('Fiera dijo si tienes mucha razón' )
        message.from.should.equal(config.from_international_number)
        message.to.should.equal('569739123123')
        message.network.should.equal('SMS')
    })
});
