
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
	function async_querys(queue, callback) {
		var to_go = queue.length;
		var results = [];
		queue.forEach(function(query){
			switch(query.type) {
				case 'find':
					qr = Poll.find(query.query);
					break;
				case 'findOne':
					qr = Poll.findOne(query.query)
					break;
				default:
					qr = false;
			}
			if(qr) {
				if(query.desc) { qr.desc(query.desc); }
				if(query.limit) { qr.limit(query.limit); }
				qr.run(function(err, res) {
					results[query.name] = res;
					if (--to_go == 0) callback(results);
				});
			} else {
				--to_go
			}
		});
	};

	querys = [
		{ name: 'last_polls', type: 'find', query: {}, desc: 'updated_at', limit: 5 },
		{ name: 'hot_poll', type: 'findOne', query: {}, desc: 'updated_at' }
	];

	async_querys(querys, function(context) {
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
