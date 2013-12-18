
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var request = require('request');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/', function(req, res){
   var zipcode = req.body.zip;
   var Url = "http://www.myweather2.com/developer/forecast.ashx?uac=pNuxVGYDai&output=json&query=" + zipcode + "&temp_unit=f&ws_unit=kph";
   Url = Url.toString();

   var weatherData;
   var response = res;

   request.get({url:Url}, function (err, res, data) {
     weatherData = JSON.parse(data);
     routes.weather(req, response, weatherData);
   });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
