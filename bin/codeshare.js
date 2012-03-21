#!/usr/bin/env node

// This is a simple example sharejs server which hosts the sharejs
// examples in examples/.
// 
// It demonstrates a few techniques to get different application behaviour.

require('coffee-script'); 
var connect = require('connect'),
	sharejs = require('share').server,
	hat = require('hat').rack(32, 36);

var argv = require('optimist').
	usage("Usage: $0 [-p portnum]").
	default('p', 8000).
	alias('p', 'port').
	argv;

var server = connect(
    connect.logger(),
    connect.static(__dirname + '/../codemirror')
);

var options = {db: {type: 'memory'}}; // See docs for options. {type: 'redis'} to enable persistance.

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach(server, options);

server.listen(8000);
console.log('Server running at http://127.0.0.1:8000/');
