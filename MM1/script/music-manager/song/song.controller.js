(function () {
    'use strict';

    angular.module('music.manager.song').controller('musicSongController', controllerFunction);

    controllerFunction.$inject = ['songService'];

    function controllerFunction(songService) {
        var vm = this;
        vm.songManagerView = true;
        vm.listIdsSelected = {};
        vm.listIdsSelected.list = new Set([]);
        vm.listIdsSelected.str = 'aaa';
        /*vm.titleSong = 'All Songs';
         vm.listObject = songService.findAll();
         vm.listCol = songService.getCols();
         vm.listIdsSelected = {};
         vm.listIdsSelected.list = new Set([]);
         vm.listIdsSelected.str = 'aaa';
         vm.songManagerView = 'script/music-manager/song/allSong.html';

         vm.createSong = function(){
         vm.songManagerView = 'script/music-manager/song/createSong.html';
         }
         vm.editSong = function(){
         vm.songManagerView = 'script/music-manager/song/editSong.html';
         }
         */
         vm.deleteSong = function(){
         var str = '';
         vm.listIdsSelected.list.forEach(function(value) {
         str = str + value;
         });
         console.log(str);
         vm.listIdsSelected.str = str;

         }

    }
})();
