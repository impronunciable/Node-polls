
/**
 * Module dependencies.
 */

var express = require('express')
  , sio = require('socket.io')
  , mongoose = require('mongoose')
	, everyauth = require('everyauth')
	, config = require('./config.json');

var app = module.exports = express.createServer();

// Set up the db

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

// Auth strategies

require('./auth/strategies');


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.session.secret }));
  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// Routes

require('./routes')

// Socket.io

var io = sio.listen(app);

io.configure(function(){
	io.enable('browser client minification');
	io.enable('browser client gzip');
});

io.sockets.on('connection', function(socket){
	socket.on('join poll', function(poll_id){
		socket.join('poll_'+poll_id);
	});

	socket.on('vote', function(data){
		io.sockets.in('poll_'+data.poll_id).emit('vote proc', data);		
	});
});

// Everyauth helper for express

everyauth.helpExpress(app);

// Server listen port 3000

app.listen(config.host.port,config.host.ip);
