var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var IncomingCallRecord = require('../lib/models/incoming_call_record')


describe("The IncomingCallRecord", function(){
    before(function(){
    }); 
    after(function(){

    });
    beforeEach(function(){

    });
    afterEach(function(done){
        IncomingCallRecord.remove(function(err){
            done()
        })
    });
    it("is created", function(done){
        var record = IncomingCallRecord()
        record.from = '+56 9739123123'
        record.save(function(err){
            should.not.exist(err)
            record.from.should.equal('+56 9739123123')
            should.exist(record.createdAt)
            var today = new Date()
            record.createdAt.getDate().should.equal(today.getDate())
            record.createdAt.getMonth().should.equal(today.getMonth())
            record.createdAt.getFullYear().should.equal(today.getFullYear())

            done()
        })
    })
});

