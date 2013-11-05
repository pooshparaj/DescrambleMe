
/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
mongoose.connect('mongodb://localhost:27017/descrambleme');

// dynamically include models 
fs.readdirSync(__dirname+'/models').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      require(__dirname+'/models/' + file);
  }
});

// dynamically include routes (Controller)
fs.readdirSync(__dirname+'/viewcontrollers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require(__dirname+'/viewcontrollers/' + file);
      route.controller(app);
  }
});


var server=http.createServer(app);

var io = require('socket.io').listen(server);
io.set('log level', 2);

io.sockets.on('connection',require(__dirname+'/socket'));

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
