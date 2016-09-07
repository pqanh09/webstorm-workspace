/**
 * Created by pqanh09 on 9/7/16.
 */
(function(){
    'use strict';

    angular.module('music.manager.song.modify').directive('songModify', directiveFunction);

    directiveFunction.$inject = [];

    function directiveFunction(){
        return {
            templateUrl : 'script/music-manager/song/modify/modify.html',
            restrict: 'EA',
            controller: 'musicSongModifyController',
            controllerAs: 'vm',
            scope: {

            },
            bindToController: {

            }
        }
    }
})();