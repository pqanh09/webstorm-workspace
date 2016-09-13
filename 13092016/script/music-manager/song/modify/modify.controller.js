/**
 * Created by pqanh09 on 9/7/16.
 */
(function () {
    'use strict';

    angular.module('music.manager.song.modify').controller('musicSongModifyController', controllerFunction);

    controllerFunction.$inject = ['$scope', 'musicManagerService'];

    function controllerFunction($scope, musicManagerService) {
        var vmModify = this;

        vmModify.disApplyBtn = true;
        vmModify.invalid = '';
        vmModify.songModify = {};
        vmModify.songModify.name = '';
        vmModify.songModify.artist = '';
        vmModify.apply = apply;


        var listObject = musicManagerService.findAll();

        if (vmModify.action == 'Edit') {
            vmModify.songModify.id = vmModify.songObj.id;
            vmModify.songModify.name = vmModify.songObj.name;
            vmModify.songModify.artist = vmModify.songObj.artist;
        }

        function apply() {

            vmModify.songModify.name.trim();
            vmModify.songModify.artist.trim();
            if (vmModify.action == 'Create') {
                var d = new Date().getTime();
                vmModify.songModify.id = d;
                vmModify.songModify.viewCount = 0;
                musicManagerService.addSong(vmModify.songModify);
            }
            if (vmModify.action == 'Edit') {
                musicManagerService.editSong(vmModify.songModify);
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
                    if (0 < newVal.length && (isValid(newVal))) {
                        vmModify.disApplyBtn = false;
                    } else {
                        vmModify.disApplyBtn = true;
                    }
                } else {
                    vmModify.disApplyBtn = true;
                }
                if (vmModify.action == 'Edit') {
                    if (newVal == vmModify.songObj.name
                        && vmModify.songModify.artist == vmModify.songObj.artist
                        ) {
                        vmModify.disApplyBtn = true;
                    } else {
                        vmModify.disApplyBtn = false;
                    }
                }


                /*        if (newVal == oldVal && 0 == newVal.length) {
                 vmModify.disApplyBtn = false;
                 vmModify.invalid = "";
                 return;
                 }
                 newVal.trim();
                 if ((0 == newVal.length)  // empty
                 || !(isValid(newVal)) // invalid
                 ) {
                 // -> disable apply button
                 vmModify.disApplyBtn = true;
                 vmModify.invalid = "Invalid";
                 return;
                 }
                 // equal oldName
                 if (vmModify.action == 'Edit' && newVal == vmModify.songObj.name) {
                 vmModify.disApplyBtn = vmModify.disApplyBtn? true : false;
                 }
                 vmModify.disApplyBtn = false;
                 vmModify.invalid = "";*/
            });
        $scope.$watch(
            'vmModify.songModify.artist',
            function (newVal, oldVal) {

                if (newVal != oldVal) {
                    newVal.trim();
                    if (0 < newVal.length) {
                        vmModify.disApplyBtn = vmModify.disApplyBtn ? true : false;
                    }
                } else {
                    vmModify.disApplyBtn = true;
                }
                if (vmModify.action == 'Edit') {
                    if (newVal == vmModify.songObj.artist
                        && vmModify.songModify.name == vmModify.songObj.name
                        ) {
                        vmModify.disApplyBtn = true;
                    } else {
                        vmModify.disApplyBtn = false;
                    }
                }
            });
    }
})();
