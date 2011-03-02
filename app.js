var express = require('express'),
		mongoose = require('mongoose'),
		models = require('./models.js'),
	  Business;

var app = module.exports = express.createServer();

// Configuration

app.configure('development', function() {
  app.set('db-uri', 'mongodb://localhost/guia-development');
});

app.configure('test', function() {
  app.set('db-uri', 'mongodb://localhost/guia-test');
});

app.configure('production', function() {
	app.set('db-uri', 'mongodb://localhost/guia-production');
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  //app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

models.defineModels(mongoose, function() {
	app.Business = Business = mongoose.model('Business');
	mongoose.connect(app.set('db-uri'));
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'Guia Project'
    }
  });
});

// Businesses list
app.get('/business.:format?', function(req, res) {
  Business.find({}, function(err, businesses){
		switch (req.params.format) {
      case 'json':
        res.send(businesses.map(function(business) {
          return business.toObject();
        }));
      break;

      default:
        res.render('business/index.jade', {
          locals: { businesses: businesses }
        });
		}
	}); 
});

app.get('/business/new', function(req, res) {
  res.render('business/new', {
    locals: { business: new Business() }
  });
});

app.post('/business.:format?', function(req, res){
	console.log(req.body.business);
	var business = new Business(req.body.business);
	business.loc.lat = 37.4188244;
	business.loc.lng = -122.0872906;
	business.save(function(){
		switch(req.params.format) {
			case 'json':
				res.send(business.toObject());
			break;
			
			default:
				//req.flash('info', 'Business created');
				res.redirect('/business');
		}
	});
});
// Only listen on $ node app.js


if (!module.parent) {
  app.listen(3000, "127.0.0.1");
  console.log("Express server listening on port %d %d", app.address().port, app.address().host);
}
