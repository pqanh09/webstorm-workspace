(function () {
  'use strict';

  //module
  angular.module('myApp', ['ngRoute', 'music.manager', 'video.manager']);

  //controller
  angular.module('myApp').controller('HomeController', HomeController);

  HomeController.$inject = ['$scope'];

  function HomeController($scope) {

  }

  //routing
  angular.module('myApp').config(HomeRoute);

  HomeRoute.$inject = ['$routeProvider'];

  function HomeRoute($routeProvider) {
    $routeProvider
      .otherwise({
        templateUrl: 'script/home.html',
        controller: "HomeController"
      });

  }

})();