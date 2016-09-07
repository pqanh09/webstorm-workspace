/**
 * Created by pqanh on 8/30/16.
 */
(function(){
  'use strict';

  angular.module('music.manager.playlist').directive('playList', directiveFunction);

  directiveFunction.$inject = [];

  function directiveFunction(){
    return {
      templateUrl : 'script/music-manager/playlist/playlist.html',
      restrict: 'EA',
      controller: 'musicPlayListController',
      controllerAs: 'vm',
      scope: {},
      bindToController: false
    }
  }
})();