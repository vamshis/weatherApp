
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.query = function(req, res, user){
 res.render('query', {user: user});
};

exports.error = function(req, res){
 res.render('error');
};

exports.weather = function(req, res, data){
  res.render('weather', {weatherData:data});
};
