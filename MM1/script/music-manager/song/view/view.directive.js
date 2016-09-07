/**
 * Created by pqanh09 on 9/7/16.
 */
(function(){
    'use strict';

    angular.module('music.manager.song.view').directive('songView', directiveFunction);

    directiveFunction.$inject = [];

    function directiveFunction(){
        return {
            templateUrl : 'script/music-manager/song/view/view.html',
            restrict: 'EA',
            controller: 'musicSongViewController',
            controllerAs: 'vm',
            scope: {
                listIdsSelected: '=listIdsSelected'
            },
            bindToController: {

            }
        }
    }
})();