var should = require("should")
var request = require('supertest');
var superagent = require('superagent');
var app = require('../app');
var config = require('../config')
var incoming_call_json = require('./fixtures/incoming_call')
var IncomingCallRecord = require('../lib/models/incoming_call_record')
var sinon = require("sinon")
var request_http = require("request")
var writeit_server = require('./writeit-server')

function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}

describe("when I call on the phone", function(){
    var tropo_response;
    var request_post;
    before(function(done){
        /*
        This is the new mock
        */
        config.writeit_answer_creation_endpoint = 'http://127.0.0.1:1337/'

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
    it("if is called twice it gets two different names for the file", function(done){
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
describe("When I call, in writeit", function(){
    var request_post;
    before(function(done){
        config.writeit_answer_creation_endpoint = 'http://127.0.0.1:1337/'
        done()
    })
    afterEach(function(done){
        request_post.restore()
        done()
    });
    after(function(done){
        IncomingCallRecord.remove(function(){
            done()
        })
    })
    it("a message is created", function(done){
        request_post = sinon.stub(request_http, "post", function(uri, options, callback){
            var args = request_post.args[0][0]
            uri.should.equal(config.writeit_answer_creation_endpoint)
            
            
            options["headers"]["authorization"].should.equal("ApiKey "+config.writeit_username+":"+config.writeit_key)
            app.get('file_name').should.match(/(?:\w){36}/)
            /*
            This is the data sent to writeit
            the content should be the link to the message file
            */
            options.should.have.property("form")
            options["form"]["author_name"].should.equal('56XXXXXXXX23');
            options["form"]["subject"].should.equal('Mensaje telefónico');
            options["form"]["content"].should.equal(app.get('file_name')+".wav");
            options["form"]["writeitinstance"].should.equal(config.remote_writeitinstance_url);
            options["form"]["persons"].should.equal('all');
            done();
        })
        request(app)
        .post("/")
        .send(incoming_call_json)
        .end(function(){
        })  

    })
    it("I save the remote_url of the message in the incoming call record", function(done){
        request(app)
        .post("/")
        .send(incoming_call_json)
        .end(function(err,res){
            IncomingCallRecord.findOne()
                .populate('remote_message')
                .exec(function(err,record){
                    record.remote_message.remote_url.should.equal('/api/v1/message/12/')
                    done()
                })
        }) 
    })
})