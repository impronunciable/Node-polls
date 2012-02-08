
/*
 * Module dependencies
 */

var everyauth = require('everyauth');

/*
 * GET home page.
 */

var app = module.parent.exports;

/*
 * Polls routes
 */

require('./polls');

app.get('/', function(req, res){
	res.render('index', { title: 'Express' });
});

app.get('/login/twitter', function(req, res){

	if(!req.loggedIn){
		req.session.redirectTo = req.headers.referer || "/";
    return res.redirect(everyauth.twitter.entryPath());
	}
	res.redirect('back');
});
