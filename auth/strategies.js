
/*
 * Module dependencies
 */

var everyauth = require('everyauth')
	, mongoose = require('mongoose')
	, User = require('../models/user')
	, config = require('../config.json');

// Logout path
everyauth.everymodule.logoutPath('/logout');
everyauth.everymodule.moduleErrback( function (err) {
	console.log(err);
});
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
	.consumerKey(config.tw.consumerKey)
	.consumerSecret(config.tw.consumerSecret)
  .entryPath('/auth/twitter')
  .findOrCreateUser( function (session, accessToken, accessSecret, twuser) {
		var promise = this.Promise();
		User.findOne({tw_id: twuser.id}, function(err, user){
			if(!user){
				var new_user = new User();
				try{
					new_user.data = JSON.stringify(twuser);	
				} catch(e){}
				new_user.tw_id = twuser.id;
				new_user.name = twuser.name;
				new_user.save(function(err, usr){
					session.user = usr._id;
					promise.fulfill(usr._id);
				});			
			} else {
				session.user = user._id;
				promise.fulfill(user._id);
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

/*
 * Facebook login
 */

everyauth.facebook
  .appId(config.fb.appId)
  .appSecret(config.fb.appSecret)
  .handleAuthCallbackError( function (req, res) {
		res.redirect('back');
  })
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbuser) {
		var promise = this.Promise();
		User.findOne({fb_id: fbuser.id}, function(err, user){
			if(!user){
				var new_user = new User();
				try{
					new_user.data = JSON.stringify(fbuser);	
				} catch(e){}
				new_user.fb_id = fbuser.id;
				new_user.name = fbuser.name;
				new_user.save(function(err, usr){
					session.user = usr._id;
					promise.fulfill(usr._id);
				});			
			} else {
				session.user = user._id;
				promise.fulfill(user._id);
			}
		})
		return promise;
  })
	.sendResponse( function (res, data) {
    var session = data.session;
    var redirectTo = session.redirectTo;
    delete session.redirectTo;
    res.redirect(redirectTo);
  })
	.entryPath('/auth/facebook')
  .redirectPath('/');

