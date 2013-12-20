var app = angular.module('weatherAppAngular', []);

app.config(function($locationProvider, $routeProvider){
  $routeProvider
   .when('/weather', {templateUrl: 'partials/weather', controller: 'weather'})
   .otherwise({redirectTo : '/' });
});
