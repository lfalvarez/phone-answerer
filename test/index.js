var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');

describe("the index", function(){
    before(function(){

    }); 
    after(function(){

    });
    beforeEach(function(){

    });
    afterEach(function(){

    });
    it("should be accessible", function(done){
        request(app)
        .get("/")
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(){
            done();
        })
    })
});
