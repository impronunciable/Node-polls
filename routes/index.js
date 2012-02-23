
/*
 * Module dependencies
 */

var everyauth = require('everyauth')
	, mongoose = require('mongoose')
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

var Poll = mongoose.model('Poll');

app.get('/', function(req, res){
	Poll.findOne({}).desc('updated_at').run(function(err, poll){
		res.render('index', { title: 'InstaPolls', hot_poll: poll, json_poll: JSON.stringify(poll), poll_domain: config.host.domain });
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
