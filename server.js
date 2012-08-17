
var express = require('express')
  , http = require('http')
	, _ = require('underscore')._
	, engines = require('consolidate')
  , path = require('path');


var app = express();

app.engine('dust', engines.dust);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/');
  app.set('view engine', 'dust');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
	res.render('index', {})		
});

var todos = {};

app.get('/todos', function(req, res) {
	var a = _.map(todos, function(todo, id) {return todo;});
	res.send(a);
});

app.get('/todos/:id', function(req, res) {
	res.send(todos[req.params['id']]);
});

app.put('/todos/:id', function(req, res) {
	todos[req.params['id']] = req.body;
	res.send(req.body);
});

app.delete('/todos/:id', function(req, res) {
	delete todos[req.params['id']];
	res.send(true);
});

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
