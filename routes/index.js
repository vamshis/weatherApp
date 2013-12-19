
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.query = function(req, res){
 res.render('query');
};

exports.error = function(req, res){
 res.render('error');
};

exports.weather = function(req, res, data){
//  console.log(data);
  res.render('weather', {weatherData:data});
};
