
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
		created_at	: { type: Date, default: Date.now }
	, title 			: String
	, voters 		  : { type: [ObjectId], default: [] }
	, opts 				: [Option]
});

/*
 * Poll model
 */ 

module.exports = mongoose.model('Poll', Poll);
