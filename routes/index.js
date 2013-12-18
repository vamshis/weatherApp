
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.weather = function(req, res, data){
//  console.log(data);
  res.render('weather', {weatherData:data});
};
