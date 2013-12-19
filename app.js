
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var request = require('request');
var passport = require('passport');
var config = require('./config/dev.js');
var util = require('util');
var GitHubStrategy = require('passport-github').Strategy;

var clientId = config.passport.github.clientId;
var clientSecret = config.passport.github.clientSecret;
var callbackURL = config.passport.github.callbackUrl;

//setup passport
passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL : callbackURL},
    function(accessToken, refreshToken, profile, done){
      process.nextTick(function(){
        return done(null, profile);
        console.log(profile);
      });
   }
));

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
app.use(express.cookieParser());
app.use(express.session({secret : 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
function ensureAuthenticated(req, res, next){
   if(req.isAuthenticated()){
     next();
   }
   else res.redirect('/error');
}

app.get('/', routes.index);

app.get('/error', routes.error);
app.get('/auth/github', 
        passport.authenticate('github'), function(req, res){});

app.get('/auth/github/callback',
       passport.authenticate('github', {failureRedirect: '/error'}),
       function(req, res){
         res.redirect('/query');
       });      


app.get('/query', ensureAuthenticated, routes.query);

app.post('/', ensureAuthenticated, function(req, res){
   var zipcode = req.body.zip;
   var Url = "http://www.myweather2.com/developer/forecast.ashx?uac=pNuxVGYDai&output=json&query=" + zipcode + "&temp_unit=f&ws_unit=kph";
   Url = Url.toString();

   var weatherData;
   var response = res;

   request.get({url:Url}, function (err, res, data) {
     weatherData = JSON.parse(data);
     console.log(weatherData);
     routes.weather(req, response, weatherData);
   });
});

app.get('/logout', function(req,res){
   req.logout();
   res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
