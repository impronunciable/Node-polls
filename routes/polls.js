
/*
 * Module dependencies
 */

var mongoose = require('mongoose');

var app = module.parent.exports;

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

	// Add the user_id from session
	poll.user_id = req.session.user._id;
	
	// Save the instance to the db
	poll.save(function(err, poll){
		if(!err){
			res.redirect('/polls/' + poll._id);
		} else {
			res.redirect('back');
		}
	});
});
