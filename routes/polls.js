
/*
 * Module dependencies
 */

var mongoose = require('mongoose');

var app = module.parent.parent.exports;

/*
 * Require poll model
 */

require('../models/poll');

/*
 * Getting models
 */ 

var Poll = mongoose.model('Poll');

app.post('/polls/create', function(req, res){
	// New Poll instance
	var poll = new Poll();
	
	// Add options to the poll
	req.body.options.forEach(function(option){
		poll.options.push({title: option});
	});

	// Add a poll title
	poll.title = req.body.title;

	// Save the instance to the db
	poll.save(function(err, poll){
		console.log(err);
		if(!err){
			res.redirect('/polls/' + poll._id);
		} else {
			res.redirect('back');
		}
	});
});

app.get('/polls/:poll_id', function(req, res){
	console.log(req.params.poll_id);
	Poll.findById(req.params.poll_id, function(err, poll){
		if(err){
			res.redirect('back');
		} else {
			res.locals({ title: poll.title, poll: poll });
			res.render('polls/view');
		}
	});
});
