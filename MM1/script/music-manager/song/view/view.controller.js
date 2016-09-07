/**
 * Created by pqanh09 on 9/7/16.
 */
(function(){
    'use strict';

    angular.module('music.manager.song.view').controller('musicSongViewController', controllerFunction);

    controllerFunction.$inject = ['songService'];

    function controllerFunction(songService){
        var vm = this;
        vm.titleSong = 'All Songs';
         vm.listObject = songService.findAll();
         vm.listCol = songService.getCols();
        console.log(vm.listIdsSelected);
        console.log(vm.listIdsSelected.list.toString());
        console.log(vm.listIdsSelected.str);



    }
})();
