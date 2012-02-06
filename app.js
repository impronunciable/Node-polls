
/**
 * Module dependencies.
 */

var express = require('express')
  , sio = require('socket.io')
  , mongoose = require('mongoose')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Set up the db

mongoose.connect('mongodb://localhost/polls');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
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

app.get('/', routes.index);

// Socket.io

var io = sio.listen(app);

io.sockets.on('connection', function(socket){
	
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
