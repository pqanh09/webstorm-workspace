(function () {
    'use strict';

    angular.module('music.manager.song').controller('musicSongController', controllerFunction);

    controllerFunction.$inject = ['$scope','songService'];

    function controllerFunction($scope, songService) {
        var vm = this;
        vm.songManagerView = true;
        vm.listIdsSelected = {};
        vm.listIdsSelected.list = new Set([]);
        vm.listIdsSelected.str = 'aaa';
        vm.listIdsSelected.size = 0;

        /*$scope.$watch(
            "vm.listIdsSelected.list", changeSelected
        );

        function handleFooChange( newValue, oldValue ) {
            console.log( "vm.fooCount:", newValue );
        }
        function changeSelected() {
            var sizeId = vm.listIdsSelected.list.size;
            if(sizeId == 1){
                console.log('1');
            } else if (sizeId <= 0) {
                console.log('0');
            } else {
                console.log('>1');
            }
            *//*var listStr = '';
            angular.forEach(vm.listIdsSelected.list, function (id) {
                listStr += id + ' ';
            });
            console.log(listStr)*//*
        }*/
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
