(function(){
  'use strict';

  angular.module('music.manager').config(routeFunction);

  routeFunction.$inject = ['$routeProvider'];

  function routeFunction($routeProvider){
    var routeManager = '/music-manager';
    var configManger = {
      template:'<music-manager></music-manager>'
    };
    $routeProvider.when(routeManager, configManger)
      .when(routeManager + '/:route*', configManger);
  }
})();
