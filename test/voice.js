var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')


describe("when I call on the phone", function(){
    before(function(){

    }); 
    after(function(){

    });
    beforeEach(function(){

    });
    afterEach(function(){

    });
    it("it says hello world", function(done){
        request(app)
        .post("/")
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res){
            var text = JSON.parse(res.text).tropo[0].say.value
            var voice = JSON.parse(res.text).tropo[0].say.voice
            text.should.equal("Hola Sergio!")
            voice.should.equal("Francisca")
            done();
        })
    })
    it("it records a message", function(done){
        request(app)
        .post("/")
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res){
            var record = JSON.parse(res.text).tropo[1]
            .record
            record.name.should.equal(config.name)
            record.url.should.equal(config.url)
            record.username.should.equal(config.username)
            record.password.should.equal(config.password)
            done();
        })
    })
});