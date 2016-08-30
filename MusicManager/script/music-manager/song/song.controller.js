(function(){
  'use strict';

  angular.module('music.song.manager').controller('MusicSongController', controllerFunction);

  controllerFunction.$inject = ['$scope', 'songService'];

  function controllerFunction($scope, songService){
    console.log("MusicSongController");
    $scope.titleSong = 'All Songs';
    $scope.data = songService.findAll();
    $scope.listCol = songService.getCols();
    $scope.listIdsSelected = {};
    $scope.listIdsSelected.list = new Set();
    $scope.listIdsSelected.list.add('aaa');
    $scope.listIdsSelected.str = 'aaa';




  }
})();
