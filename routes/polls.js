
/*
 * Module dependencies
 */

var app = module.parent.parent.exports;

/*
 * Require poll model
 */

var Poll = require('../models/poll');


app.post('/polls/create', function(req, res){
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
});

app.get('/polls/:poll_id', function(req, res){
	Poll.findById(req.params.poll_id, function(err, poll){
		if(err){
			res.redirect('back');
		} else {
			res.locals({ title: poll.title, poll: poll });
			res.render('polls/view');
		}
	});
});


app.get('/polls/:poll_id/vote/:opt_id', function(req, res){
	Poll.findById(req.params.poll_id, function(err, poll){
		if(!err){
			poll.opts.id(req.params.opt_id).votes++;
			poll.save(function(){
				res.json({poll_id: req.params.poll_id, option_id: req.params.op_id});
			});
		}
	});
});
