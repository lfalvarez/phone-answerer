/**
 * Simple outbound message launcher in Node.js
 * 
 * You will need to have a Tropo scripting aplication set up
 *  to use this. See sample code below:
 *  
 *  message(msg, { to:number, network:"SMS" });
 *  
 *  Save this file in your Tropo account as message.js
 * 
 */
var http = require('http');
var sys = require('sys');

// Enter your tropo outbound messaging token below.
var token = 'aquivaelcodigoquetedanentropopuntocom';
var msg = encodeURI('oliwi');
//the chilean number that we are sending an sms to must be in this format
var number = '56912345678';

var tropoSessionAPI = 'api.tropo.com';
var path = '/1.0/sessions?action=create&token=' + token + '&msg=' + msg + '&number=' + number;

var tropo = http.createClient(80, tropoSessionAPI);
var request = tropo.request('GET', path, {'host': tropoSessionAPI});

request.end();

request.on('response', function (response) {
  response.setEncoding('utf8');
  response.addListener('data', function (chunk) {
  sys.log('Sent message. Tropo response code:' + response.statusCode + '. Body: ' + chunk);
  });
});