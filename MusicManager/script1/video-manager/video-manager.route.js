(function(){
  'use strict';

  angular.module('video.manager').config(routeFunction);

  routeFunction.$inject = ['$routeProvider'];

  function routeFunction($routeProvider){
    var routeManager = '/video-manager';
    var configManger = {
      templateUrl:'script/video-manager/video-manager.html',
      controller : "VideoManagerController"
    };
    $routeProvider.when(routeManager, configManger)
      .when(routeManager + '/:route*', configManger);
  }
})();
