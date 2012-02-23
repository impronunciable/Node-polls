
/*
 * Module dependencies
 */

var crypto = require('crypto');

/*
 * Generate a short url
 */

exports.shorten_url = function(){
var shasum = crypto.createHash('sha1');
		shasum.update(Date.now().toString());
		return shasum.digest('hex').substr(0,6);
};
