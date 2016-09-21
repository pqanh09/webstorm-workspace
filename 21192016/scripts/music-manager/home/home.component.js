/**
 * Created by pqanh09 on 9/19/16.
 */
(function () {
  'use strict';

  angular.module('music.home').component('musicHome', {
    // isolated scope binding
    bindings: {
    },

    // Load the template
    templateUrl: 'scripts/music-manager/home/home.component.html',


    // The controller that handles component logic
    controller: 'musicHomeController',
    controllerAs: 'vm'
  });
})();
/*
 (function () {
 'use strict';

 angular.module('music.manager').component("music",{
 templateUrl: 'scripts/music-manager/music-manager.component.html',
 bindings: {},
 controller: 'musicController',
 controllerAs: 'vm'
 });
 })();*/
