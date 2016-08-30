/**
 * Created by pqanh on 8/29/16.
 */
(function(){
  'use strict';

  angular.module('music.song.manager').service('songService', function() {
    var service = {};
    service.colList = [
     {key : 'id', value: 'Id', visible: false},
//      {key : 'id', value: 'Id', visible: true},
      {key : 'name', value: 'Name', visible: true},
      {key : 'artist', value: 'Artist', visible: true},
      {key : 'viewCount', value: 'View Count', visible: true},
      {key : 'url', value: 'Play', visible: true}
    ];
    service.keyCol = [
      {key : 'id', value: 'Name'}
    ];
    service.songList = [
      {id : '001', name: 'Song 1', artist: 'A ', viewCount: 0, url:'music/001.mp3'},
      {id : '002', name: 'Song 2', artist: 'B ', viewCount: 99, url:'music/002.mp3'},
      {id : '003', name: 'Song 3', artist: 'C ', viewCount: 999, url:'music/003.mp3'}
    ];
    service.findAll = function (){
      return service.songList;
    };
    service.getCols = function (){
      return service.colList;
    };
    service.getKeyCol = function (){
      return service.keyCol;
    };
    service.find = function (songId){
      var result;
      angular.forEach(service.songList, function(song) {
        if(song.id == songId){
          result = song;
        }
      });
      return result;
    };
    return service;
  });
})();
