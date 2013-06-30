var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')
var IncomingCallRecord = require('../lib/models/incoming_call_record')


describe("when the app sends an SMS", function(){
    var tropo_response;
    before(function(done){
        request(app)
        .post("/sms")
        .send(incoming_call_json)
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res){
            should.not.exist(err)
            tropo_response = JSON.parse(res.text).tropo;
            
            done();
        })
    }); 
    after(function(done){
        IncomingCallRecord.remove(function(err){
            done()
        })
    });
    beforeEach(function(){

    });
    afterEach(function(){
        
    });
    it("it says whatever from the international number", function(){
        var message = tropo_response[0].message;
        var say = message.say
        message.say.value.should.equal('whatever')
        message.from.should.equal(config.from_international_number)
        //message.to not yet defined
    })
});
