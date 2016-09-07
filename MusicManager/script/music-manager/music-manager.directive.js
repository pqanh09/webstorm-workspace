/**
 * Created by pqanh09 on 9/7/16.
 */
(function(){
    'use strict';

    angular.module('music.manager').directive('musicManager', directiveFunction);

    directiveFunction.$inject = [];

    function directiveFunction(){
        return {
            templateUrl : 'script/music-manager/music-manager.html',
            restrict: 'EA',
            controller: 'musicManagerController',
            controllerAs: 'vm',
            scope: {},
            bindToController: false
        }
    }
})();