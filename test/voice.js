var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')


describe("when I call on the phone", function(){
    var tropo_response;
    before(function(done){
        request(app)
        .post("/")
        .send(incoming_call_json)
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res){
            tropo_response = JSON.parse(res.text).tropo;
            
            done();
        })
    }); 
    after(function(){

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
        record.url.should.equal(config.url)
        record.username.should.equal(config.username)
        record.password.should.equal(config.password)
        
    })
});
