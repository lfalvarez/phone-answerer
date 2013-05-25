var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');

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
            text.should.equal("Hello World!")
            done();
        })
    })
});