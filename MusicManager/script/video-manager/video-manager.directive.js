/**
 * Created by pqanh09 on 9/7/16.
 */
(function(){
    'use strict';

    angular.module('video.manager').directive('videoManager', directiveFunction);

    directiveFunction.$inject = [];

    function directiveFunction(){
        return {
            templateUrl : 'script/video-manager/video-manager.html',
            restrict: 'EA',
            controller: 'videoManagerController',
            controllerAs: 'vm',
            scope: {},
            bindToController: false
        }
    }
})();