(function(){
  'use strict';

  angular.module('music.manager').controller('MusicManagerController', controllerFunction);

  controllerFunction.$inject = ['$scope', '$routeParams'];

  function controllerFunction($scope, $routeParams){
    $scope.musicManagerView = 'script/music-manager/song/song.html';
    var routeMap = [
      {id : 'song', view: 'script/music-manager/song/song.html', name: 'Song Manager'},
      {id : 'playlist', view: 'script/music-manager/play-list/playlist.html', name: 'Playlist Manager'}
    ];
    var param = $routeParams.route;
    angular.forEach(routeMap, function(route) {
      if(route.id == param){
        $scope.musicManagerView = route.view;
      }
    });
  }
})();