
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

exports.async_queries =	function (queue, callback) {
		var to_go = queue.length;
		var results = {};
		queue.forEach(function(query){
			var collection = query.collection;
			switch(query.type) {
				case 'find':
					qr = collection.find(query.query);
					break;
				case 'findOne':
					qr = collection.findOne(query.query)
					break;
				default:
					qr = false;
			}
			if(qr) {
				if(query.desc) { qr.sort('-' + query.desc); }
				if(query.limit) { qr.limit(query.limit); }
				qr.exec(function(err, res) {
					results[query.name] = res;
					if (--to_go == 0) callback(results);
				});
			} else {
				--to_go
			}
		});
	};
