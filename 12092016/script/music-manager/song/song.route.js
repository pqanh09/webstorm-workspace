 /**
 * Created by pqanh09 on 9/6/16.
 */
(function(){
    'use strict';

    angular.module('music.manager.song').config(routeFunction);

    routeFunction.$inject = ['$routeProvider'];

    function routeFunction($routeProvider){
        var routeManager = '/music-manager/song';
        var configManger = {
            template: '<div song></div>'
        };
        $routeProvider.when(routeManager, configManger)
            .when(routeManager + '/:route*', configManger);
    }
})();