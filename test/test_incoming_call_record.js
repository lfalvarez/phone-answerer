var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var IncomingCallRecord = require('../lib/models/incoming_call_record')
var RemoteMessage = require('../lib/models/remote_message')


describe("The remote message", function(){
    before(function(){
    }); 
    after(function(){

    });
    beforeEach(function(){

    });
    afterEach(function(done){
        RemoteMessage.remove(function(err){
            should.not.exist(err)
            done()
        })
    });
    it("is created", function(done){
        var remote_message = new RemoteMessage()
        remote_message.remote_url = '/api/v1/message/2' //this is the first reference to writeit
        remote_message.save(function(err, documento){
            should.not.exist(err)
            documento.remote_url.should.equal(remote_message.remote_url)
            done()
        })
    })
})

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
        record.save(function(err, documento){
            should.not.exist(err)
            documento.from.should.equal('+56 9739123123')
            should.exist(documento.createdAt)
            var today = new Date()
            documento.createdAt.getDate().should.equal(today.getDate())
            documento.createdAt.getMonth().should.equal(today.getMonth())
            documento.createdAt.getFullYear().should.equal(today.getFullYear())

            done()
        })
    })
    it("can have a remote message", function(done){
        var record = IncomingCallRecord()
        record.from = '+56 9739123123'
        var remote_message = new RemoteMessage()
        remote_message.remote_url = '/api/v1/message/3'
        remote_message.save(function(err){
            record.remote_message = remote_message
            record.save(function(err, documento){
                should.not.exist(err)

                IncomingCallRecord.findOne({_id:documento._id})
                    .populate('remote_message')
                    .exec(function(err, retrieved_record){
                        should.not.exist(err)
                        retrieved_record.should.have.property('remote_message')
                        remote_message._id.equals(retrieved_record.remote_message._id).should.be.ok
                        retrieved_record.remote_message.remote_url.should.equal(remote_message.remote_url)
                        done()
                    })
                

                
            })
        })
        
        
    })
});



