(function () {
    'use strict';

    angular.module('music.manager.playlist').controller('musicPlayListController', controllerFunction);

    controllerFunction.$inject = [];

    function controllerFunction() {
        var vm = this;

        vm.createPlayList = createPlayList;
        vm.editPlayList = editPlayList;
        vm.deletePlayList = deletePlayList;


        /////
        function createPlayList() {
        }

        function editPlayList() {
        }

        function deletePlayList() {
        }
    }
})();
