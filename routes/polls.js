
/*
 * Module dependencies
 */

var app = module.parent.parent.exports;

/*
 * Require poll model
 */

var Poll = require('../models/poll')
	,	utils = require('../utils.js')
	, config = require('../config.json');

app.post('/polls/create', function(req, res){
	var no_empty = [];
	if(req.body.options){
		req.body.options.forEach(function(option){
			if(option.length)	no_empty.push({ title: option});
		});
	}
	if(req.body.options && no_empty.length >= 2){
		// New Poll instance
		var poll = new Poll();
	
		// Add options to the poll
		poll.opts = no_empty;

		// Add a poll title
		poll.title = req.body.title;
		poll.subtitle = req.body.subtitle;
		poll.short_url = utils.shorten_url();	

		// Save the instance to the db
		poll.save(function(err, poll){
			if(!err){
				res.redirect('/polls/' + poll._id);
			} else {
				res.redirect('back');
			}
		});
	} else {
		res.redirect('back');
	}
});

app.get('/polls/:poll_id',  function(req, res){
	Poll.findById(req.params.poll_id, function(err, poll){
		if(err || !poll){
			res.redirect('back');
		} else {
			var voter = ( !(req.session && req.session.user) ||  (poll.voters.indexOf(req.session.user) == -1)) ? false : true;
			res.locals({ title: poll.title, poll: poll, json_poll: JSON.stringify(poll), auth: !!(req.session && req.session.user), voter: voter, poll_domain: config.host.domain});
			res.render('polls/view');
		}
	});
});


app.get('/polls/:poll_id/vote/:opt_id', function(req, res){
	if(req.session && req.session.user){
		Poll.findOne({ '_id': req.params.poll_id, 'voters': { '$nin' : [req.session.user] } }, function(err, poll){
			if(!err && poll){
				poll.opts.id(req.params.opt_id).votes++;
				poll.voters.push(req.session.user);
				poll.updated_at = Date.now();
				opt_index = -1;
				poll.opts.forEach(function(opt, index){
					if(opt._id == req.params.opt_id) opt_index = index;
				});
				poll.save(function(){
					res.json({poll_id: req.params.poll_id, option_id: req.params.opt_id, option_index: opt_index});
				});
			} else {
				res.json("You are trying to vote twice on the same poll.");
			}
		});
	} else {
		res.json("You have to login to be allowed to vote.");
	}
});

app.get('/p/:short_url', function(req, res){
	Poll.findOne({'short_url' : req.params.short_url}, function(err, poll){
		if(poll && !err) {
			res.redirect('/polls/' + poll._id);
		} else {
			res.redirect('/');
		}
	});
});

app.get('/widget/:poll_id', function(req, res){
	Poll.findById(req.params.poll_id, function(err, poll){
		if(err || !poll){
			res.send('bad iframe');
		} else {
			res.locals({ title: poll.title, poll: poll, json_poll: JSON.stringify(poll).replace("\'","&#39;"), poll_domain: config.host.domain});
			res.render('polls/widget', { layout: false});
		}
	});

});
