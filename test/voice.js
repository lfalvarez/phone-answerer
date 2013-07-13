var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')
var IncomingCallRecord = require('../lib/models/incoming_call_record')


describe("when I call on the phone", function(){
    var tropo_response;
    before(function(done){
        request(app)
        .post("/")
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
    it("it says hola mundo", function(){
        var text = tropo_response[0].say.value
        var voice = tropo_response[0].say.voice
        text.should.equal("Di algo después del bip tienes 30 segundos!")
        voice.should.equal("Francisca")
    })
    it("it records a message", function(){
        var record = tropo_response[1].record
        record.name.should.equal(config.name)
        var expected_url_regexp = new RegExp(config.url+"(?:\\w){36}(?:\\.wav)");
        record.url.should.match(expected_url_regexp)
        record.username.should.equal(config.username)
        record.password.should.equal(config.password)
        
    })
    it("saves a record of the call", function(done){
        IncomingCallRecord.findOne().exec(function(err, record){
            should.not.exist(err);
            should.exist(record)
            record.from.should.equal(incoming_call_json.session.from.name)
            done()
        })
    })
    it("if is called twice I get two different names for the file", function(done){
        var first_url = tropo_response[1].record.url
        var record_name = first_url
        request(app)
        .post("/")
        .send(incoming_call_json)
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res){
            should.not.exist(err)
            var second_url = JSON.parse(res.text).tropo[1].record.url
            var second_record_name = second_url
            second_record_name.should.not.equal(first_url)
            done();
        })
    })
});
