/**
 * Created by pqanh09 on 9/19/16.
 */
(function () {
    'use strict';

    angular.module('music.home').component('musicHome', {
        // isolated scope binding
        bindings: {
            message: '='
        },

        // Load the template
        templateUrl: 'scripts/music-manager/home/home.component.html',


        // The controller that handles component logic
        controller: 'musicHomeController'
    });
})