
/*
 * Module dependencies
 */

var everyauth = require('everyauth')
	, mongoose = require('mongoose')
	, utils = require('../utils')
	, config = require('../config.json');

/*
 * Models
 */

var Poll = require('../models/poll');

/*
 * GET home page.
 */

var app = module.parent.exports;

/*
 * Polls routes
 */

require('./polls');

var Poll = mongoose.model('Poll')
	, User = mongoose.model('User');


app.get('/', function(req, res){


	querys = [
		{ name: 'last_polls', collection: Poll,  type: 'find', query: {}, desc: 'updated_at', limit: 5 },
		{ name: 'hot_poll', collection: Poll, type: 'findOne', query: {}, desc: 'updated_at' }
	];

	utils.async_queries(querys, function(context) {
		context.title = 'InstaPolls';
		context.poll_domain = config.host.domain;
		context.json_poll = JSON.stringify(context.hot_poll);
		res.render('index', context);
	});

});

app.get('/login/twitter', function(req, res){
	if(!req.loggedIn){
		req.session.redirectTo = req.headers.referer || "/";
    return res.redirect(everyauth.twitter.entryPath());
	}
	res.redirect('back');
});

app.get('/login/facebook', function(req, res){
	if(!req.loggedIn){
		req.session.redirectTo = req.headers.referer || "/";
    return res.redirect(everyauth.facebook.entryPath());
	}
	res.redirect('back');
});

app.get('/terms', function(req, res){
	res.render('terms', {title: 'Terms'});
});

app.error(function(err, req, res, next){
	res.redirect('/');
});
