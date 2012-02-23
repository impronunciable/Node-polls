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
		data			 :	String
	, tw_id 		 :  String
	, fb_id 		 :  String
	, name 			 : String
	, created_at : { type: Date, default: Date.now }
});

/*
 * User model
 */ 

module.exports = mongoose.model('User', User);
