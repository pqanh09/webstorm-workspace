/**
 * Created by pqanh09 on 9/7/16.
 */
(function () {
  'use strict';

  angular.module('music.manager.song.view').controller('musicSongViewController', controllerFunction);

  controllerFunction.$inject = ['$scope'];

  function controllerFunction($scope) {
    var vmView = this;
    vmView.title = 'All Songs';


    // view all songs
    vmView.viewAll = true;
    // view detail song
    vmView.viewDetail = viewDetail;
    // back to view all songs
    vmView.back = back;

    function viewDetail() {
      vmView.listSelected.song.viewCount = vmView.listSelected.song.viewCount + 1;
      vmView.viewAll = false;

    }

    function back() {
      vmView.viewAll = true;
    }


  }
})();
