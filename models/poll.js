
/*
 * Module dependencies
 */

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

/*
 * Option schema
 */

var Option = new Schema({
		title	: String
	, votes	: { type: Number, default: 0 }
});

/*
 * Poll schema
 */

var Poll = new Schema({
		user_id	:	{ type: ObjectId, required: true }
	, title 	: String
	, options : [Option]
});

mongoose.model('Poll', Poll);
