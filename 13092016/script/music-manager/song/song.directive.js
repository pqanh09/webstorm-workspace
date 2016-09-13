/**
 * Created by pqanh09 on 9/6/16.
 */

(function(){
    'use strict';

    angular.module('music.manager.song').directive('song', directiveFunction);

    directiveFunction.$inject = [];

    function directiveFunction(){
        return {
            templateUrl : 'script/music-manager/song/song.html',
            restrict: 'EA',
            controller: 'musicSongController',
            controllerAs: 'vmSong',
            scope: {},
            bindToController: false
        }
    }
})();