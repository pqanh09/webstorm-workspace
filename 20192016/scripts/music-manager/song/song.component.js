/**
 * Created by pqanh on 9/20/16.
 */
(function(){
  'use strict';

  angular.module('music.song').component('musicSong', {
    // isolated scope binding
    bindings: {
    },

    // Load the template
    templateUrl: 'scripts/music-manager/song/song.component.html',


    // The controller that handles component logic
    controller: 'musicSongController',
    controllerAs: 'vm'
  });

})();