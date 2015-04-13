
/**
 * Module dependencies.
 */

var express = require('express');
var sio = require('socket.io');
var mongoose = require('mongoose');
var everyauth = require('everyauth');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var fs = require('fs');
var config = require('./config.json');

var app = module.exports = express();
var server = require('http').Server(app);

// Set up the db

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

// Auth strategies

require('./auth/strategies');


// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: config.session.secret, resave: false, saveUninitialized: false}));
app.use(morgan('combined', {stream:fs.createWriteStream('./log_file.log', {flags: 'a'})}));
app.use(everyauth.middleware());

// Routes

require('./routes');

if(process.env.NODE_ENV === 'production') {
  app.use(errorHandler()); 
  process.on('uncaughtException', function (err) {
    console.log('Uncaught exception: ' + err);
  });
} else {
  app.use(errorHandler({ dumpExceptions: true, showStack: true })); 
}

// Socket.io

var io = sio(server);

io.sockets.on('connection', function(socket){
	socket.on('join poll', function(poll_id){
		socket.join('poll_'+poll_id);
	});

	socket.on('vote', function(data){
		io.sockets.in('poll_'+data.poll_id).emit('vote proc', data);		
	});
});

// Server listen port 3000

server.listen(3000);
