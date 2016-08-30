(function(){
  'use strict';

  angular.module('music.manager').config(routeFunction);

  routeFunction.$inject = ['$routeProvider'];

  function routeFunction($routeProvider){
    var routeManager = '/music-manager';
    var configManger = {
      templateUrl:'script/music-manager/music-manager.html',
      controller : "MusicManagerController"
    };
    $routeProvider.when(routeManager, configManger)
      .when(routeManager + '/:route*', configManger);
  }
})();
