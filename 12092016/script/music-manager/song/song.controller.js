(function () {
  'use strict';

  angular.module('music.manager.song').controller('musicSongController', controllerFunction);

  controllerFunction.$inject = ['$scope', 'songService'];

  function controllerFunction($scope, songService) {
    var vmSong = this;
    vmSong.songManagerView = true;

    vmSong.listSelected = {};
    vmSong.listSelected.list = new Set([]);
    vmSong.listObject = songService.findAll();
    vmSong.listCol = songService.getCols();
    vmSong.ctrlButton = {};

    vmSong.createButton = true;


    vmSong.addSong = addSong;
    vmSong.editSong = editSong;
    vmSong.deleteSong = deleteSong;
    vmSong.viewAll = viewAll;

    function viewAll() {
      vmSong.songManagerView = true;
    }
    function addSong() {
      vmSong.songManagerView = false;
      vmSong.action = 'Create';
      vmSong.listSelected.song = null;
      vmSong.listSelected.list.clear();
      var list = vmSong.listObject;
      for (var i = 0; i < list.length; i++) {
        list[i].checked = false;
      }

    }

    function editSong() {
      vmSong.songManagerView = false;
      vmSong.action = 'Edit';
    }


    function deleteSong() {
      var names = '';
      // convert set to plain Array (with Array comprehensions)
      var listId = Array.from(vmSong.listSelected.list);
      for (var i = 0; i < listId.length; i++) {
        var song = songService.find(listId[i]);
        if(song){
          if( i > 0){
            names = names + ', ';
          }
          names = names + song.name;
        }
      }

      var r = confirm("Do you want to delete the Song(s): " + names + ".");
      if (r == true) {
        songService.delete(vmSong.listSelected.list);
      }

    }

    $scope.$watch(
      'vmSong.listSelected.list.size',
      function (newVal) {
        if(newVal < 1) {
          vmSong.ctrlButton.add = false;
          vmSong.ctrlButton.edit = true;
          vmSong.ctrlButton.delete = true;
        } else if(newVal == 1) {
            vmSong.ctrlButton.add = false;
            vmSong.ctrlButton.edit = false;
            vmSong.ctrlButton.delete = false;

        } else{
          vmSong.ctrlButton.add = false;
          vmSong.ctrlButton.edit = true;
          vmSong.ctrlButton.delete = false;
        }
      });


  }
})();
