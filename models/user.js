/*
 * Module dependencies
 */

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

/*
 * User schema
 */

var User = new Schema({
		user_id	:	{ type: ObjectId, required: true }
	, title 	: String
	, options : [Option]
});

/*
 * User model
 */ 

mongoose.model('User', User);
