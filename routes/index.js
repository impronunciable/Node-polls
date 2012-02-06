
/*
 * GET home page.
 */

var app = module.parent.exports;

/*
 * Polls routes
 */

require('./polls');

app.get('/', function(req, res){
	res.render('index', { title: 'Express' })
});
