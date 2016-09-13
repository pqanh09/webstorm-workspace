/**
 * Created by pqanh on 8/29/16.
 */
(function(){
  'use strict';

  angular.module('music.manager').service('musicManagerService', function() {
    var service = {};
    service.colSongList = [
     {key : 'id', value: 'Id', visible: false},
      {key : 'name', value: 'Name', visible: true},
      {key : 'artist', value: 'Artist', visible: true},
      {key : 'viewCount', value: 'View Count', visible: true}
    ];
    service.songList = [
      {id : 1, name: 'Song 1', artist: 'A', viewCount: 0, checked: false},
      {id : 2, name: 'Song 2', artist: 'B', viewCount: 99, checked: false},
      {id : 3, name: 'Song 3', artist: 'C', viewCount: 999,  checked: false}
    ];
    service.addSong = function (song){
      service.songList.push(song);
    };
    service.editSong = function (songModify){
      angular.forEach(service.songList, function(song) {
        if(song.id == songModify.id){
          song.name = songModify.name;
          song.artist = songModify.artist;
        }
      });
    };
    service.deleteSongs = function (listId){
      listId.forEach(function(value) {
        var song = service.findSongById(value);
        if(song){
          service.songList.splice(song, 1);
          listId.delete(value)

        }
      });
    };

    service.findAllSongs = function (){
      return service.songList;
    };
    service.getSongCols = function (){
      return service.colSongList;
    };

    service.findSongById = function (songId){
      var result;
      angular.forEach(service.songList, function(song) {
        if(song.id == songId){
          result = song;
        }
      });
      return result;
    };
    service.findSongByName = function (name){
      var result;
      angular.forEach(service.songList, function(song) {
        if(song.name == name){
          result = song;
        }
      });
      return result;
    };
    return service;
  });
})();
