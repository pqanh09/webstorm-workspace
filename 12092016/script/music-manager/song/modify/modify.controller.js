/**
 * Created by pqanh09 on 9/7/16.
 */
(function () {
  'use strict';

  angular.module('music.manager.song.modify').controller('musicSongModifyController', controllerFunction);

  controllerFunction.$inject = ['$scope', 'songService'];

  function controllerFunction($scope, songService) {
    var vmModify = this;

    vmModify.applyBtn = true;
    vmModify.songModify = {};
    vmModify.songModify.name = '';
    vmModify.songModify.artist = '';
    vmModify.apply = apply;
    vmModify.invalid = '';

    var listObject = songService.findAll();

    if (vmModify.action == 'Edit') {
      vmModify.songModify.id = vmModify.songObj.id;
      vmModify.songModify.name = vmModify.songObj.name;
      vmModify.songModify.artist = vmModify.songObj.artist;
    }

    function apply() {
      var d = new Date().getTime();
      if (vmModify.action == 'Create') {
        vmModify.songModify.id = d;
        vmModify.songModify.viewCount = 0;
        songService.add(vmModify.songModify);
      }
      if (vmModify.action == 'Edit') {
        songService.edit(vmModify.songModify);
      }
      vmModify.viewAll()
    }


    function isValid(name) {
      var rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
      var rg2 = /^\./; // cannot start with dot (.)
      var rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
      return rg1.test(name) && !rg2.test(name) && !rg3.test(name);
    }

    $scope.$watch(
      'vmModify.songModify.name',
      function (newVal, oldVal) {
        if (newVal != oldVal) {
          newVal.trim();
        } else {
          vmModify.applyBtn = true;
          vmModify.invalid = "";
          return;
        }
        if (!newVal //null or undefined
          || (0 === newVal.length)  // empty
          || !(isValid(newVal)) // invalid
          ) {
          // -> disable apply button
          vmModify.applyBtn = true;
          vmModify.invalid = "Invalid";
          return;
        }
        // check Song is existed
        var song = songService.findByName(newVal);
        if (song) {
          vmModify.applyBtn = true;
          vmModify.invalid = "Song is existed";
          return;
        }
        vmModify.applyBtn = false;
        vmModify.invalid = "";
      });
    $scope.$watch(
      'vmModify.songModify.artist',
      function (newVal, oldVal) {
        vmModify.applyBtn = false;
        if (newVal != oldVal) {
          newVal.trim();
        }
        // equal oldName
        if ((vmModify.songObj) && (newVal == vmModify.songObj.artist)) {
          vmModify.applyBtn = true;
        }
      });
  }
})();
