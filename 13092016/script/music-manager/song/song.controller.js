(function () {
  'use strict';

  angular.module('music.manager.song').controller('musicSongController', controllerFunction);

  controllerFunction.$inject = ['$scope', 'musicManagerService'];

  function controllerFunction($scope, musicManagerService) {
    var vmSong = this;
    vmSong.songManagerView = true;

    vmSong.listSelected = {};
    vmSong.listSelected.list = new Set([]);
    vmSong.listObject = musicManagerService.findAllSongs();
    vmSong.listCol = musicManagerService.getSongCols();
    vmSong.ctrlButton = {};

    vmSong.createButton = true;


    vmSong.addSong = addSong;
    vmSong.editSong = editSong;
    vmSong.deleteSong = deleteSong;
    vmSong.viewAll = viewAll;

    function viewAll() {
      vmSong.songManagerView = true;
        updateCtrlButton(vmSong.listSelected.list.size);
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
        disableAllCtrButton();

    }

    function editSong() {
      vmSong.songManagerView = false;
      vmSong.action = 'Edit';
        disableAllCtrButton();
    }


    function deleteSong() {
      var names = '';
      // convert set to plain Array (with Array comprehensions)
      var listId = Array.from(vmSong.listSelected.list);
      for (var i = 0; i < listId.length; i++) {
        var song = musicManagerService.findSongById(listId[i]);
        if(song){
          if( i > 0){
            names = names + ', ';
          }
          names = names + song.name;
        }
      }

      var r = confirm("Do you want to delete the Song(s): " + names + ".");
      if (r == true) {
        musicManagerService.deleteSongs(vmSong.listSelected.list);
      }

    }
    function disableAllCtrButton(){
        vmSong.ctrlButton.add = true;
        vmSong.ctrlButton.edit = true;
        vmSong.ctrlButton.delete = true;
    }
    $scope.$watch(
      'vmSong.listSelected.list.size',
      function (newVal) {
        updateCtrlButton(newVal);
      });
      function updateCtrlButton(sizeSelected){
          if(sizeSelected < 1) {
              vmSong.ctrlButton.add = false;
              vmSong.ctrlButton.edit = true;
              vmSong.ctrlButton.delete = true;
          } else if(sizeSelected == 1) {
              vmSong.ctrlButton.add = false;
              vmSong.ctrlButton.edit = false;
              vmSong.ctrlButton.delete = false;

          } else{
              vmSong.ctrlButton.add = false;
              vmSong.ctrlButton.edit = true;
              vmSong.ctrlButton.delete = false;
          }
      }


  }
})();
