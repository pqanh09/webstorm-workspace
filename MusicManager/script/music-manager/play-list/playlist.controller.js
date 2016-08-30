(function(){
  'use strict';

  angular.module('music.playlist.manager').controller('music-playList-controller', controllerFunction);

  controllerFunction.$inject = ['$scope'];

  function controllerFunction($scope){
    console.log("Music - PlayList - Controller");
    $scope.title = 'All PlayLists';
  }
})();
