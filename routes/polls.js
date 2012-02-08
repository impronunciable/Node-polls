
/*
 * Module dependencies
 */

var app = module.parent.parent.exports;

/*
 * Require poll model
 */

var Poll = require('../models/poll');

app.post('/polls/create', function(req, res){
	if(req.body.options && req.body.options.length >= 2){
		// New Poll instance
		var poll = new Poll();
	
		// Add options to the poll
		req.body.options.forEach(function(option){
			poll.opts.push({title: option});
		});

		// Add a poll title
		poll.title = req.body.title;

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
		if(err){
			res.redirect('back');
		} else {
			res.locals({ title: poll.title, poll: poll, json_poll: JSON.stringify(poll), auth: !!(req.session && req.session.user)});
			res.render('polls/view');
		}
	});
});


app.get('/polls/:poll_id/vote/:opt_id', function(req, res){
	if(req.session && req.session.user){
		Poll.findOne({ '_id': req.params.poll_id, 'voters': { '$nin' : [req.session.user._id] } }, function(err, poll){
			if(!err && poll){
				poll.opts.id(req.params.opt_id).votes++;
				poll.voters.push(req.session.user._id);
				poll.save(function(){
					res.json({poll_id: req.params.poll_id, option_id: req.params.opt_id});
				});
			} else {
				res.json("Estas intentando votar 2 veces en la misma encuesta.");
			}
		});
	} else {
		res.json("Tenes que loggearte en twitter antes de votar.");
	}
});
