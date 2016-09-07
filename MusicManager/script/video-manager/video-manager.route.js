(function(){
  'use strict';

  angular.module('video.manager').config(routeFunction);

  routeFunction.$inject = ['$routeProvider'];

  function routeFunction($routeProvider){
    var routeManager = '/video-manager';
    var configManger = {
        template: '<video-manager></video-manager>'
    };
    $routeProvider.when(routeManager, configManger)
      .when(routeManager + '/:route*', configManger);
  }
})();
