
/*
 * Module dependencies
 */

var everyauth = require('everyauth')
	, mongoose = require('mongoose')
	, User = require('../models/user')
	, conf = require('./conf');

// Logout path
everyauth.everymodule.logoutPath('/logout');

everyauth.everymodule.handleLogout( function (req, res) {
  req.logout();
	req.session.destroy();

  res.writeHead(303, { 'Location': this.logoutRedirectPath() });
  res.end();
});


/*
 * Twitter login
 */

everyauth.twitter
	.consumerKey(conf.tw.consumerKey)
	.consumerSecret(conf.tw.consumerSecret)
  .entryPath('/auth/twitter')
  .findOrCreateUser( function (session, accessToken, accessSecret, twuser) {
		var promise = this.Promise();
		User.findOne({tw_id: twuser.id}, function(err, user){
			if(!user){
				var new_user = new User();
				new_user.data = JSON.stringify(twuser);	
				new_user.tw_id = twuser.id;
				new_user.name = twuser.name;
				new_user.save(function(user_attrs){
					session.user = user_attrs;
					promise.fulfill(user_attrs);
				});			
			} else {
				session.user = user;
				promise.fulfill(user);
			}
		})
		return promise;
  })
	.callbackPath('/auth/twitter/callback')
  .sendResponse( function (res, data) {
    var session = data.session;
    var redirectTo = session.redirectTo;
    delete session.redirectTo;
    res.redirect(redirectTo);
  })
	.moduleTimeout(10000);
