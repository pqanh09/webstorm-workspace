/**
 * Created by pqanh09 on 9/6/16.
 */
(function(){
    'use strict';

    angular.module('music.manager.playlist').config(routeFunction);

    routeFunction.$inject = ['$routeProvider'];

    function routeFunction($routeProvider){
        var routeManager = '/music-manager/playlist';
        var configManger = {
            template: '<play-list></play-list>'
        };
        $routeProvider.when(routeManager, configManger)
            .when(routeManager + '/:route*', configManger);
    }
})();
