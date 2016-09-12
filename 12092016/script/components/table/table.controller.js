(function () {
  'use strict';

  angular.module('directive.table').controller('tableController', controllerFunction);

  controllerFunction.$inject = ['$scope'];

  function controllerFunction($scope) {
    var vmTable = this;
    var listSelected = vmTable.listSelected;

    vmTable.isCheck = false;
    vmTable.checkOne = checkOne;
    vmTable.checkAll = checkAll;
    vmTable.viewObj = viewObj;

    ////////

    $scope.$watch(
      'vmTable.listSelected.list.size',
      function (newVal) {
        if (newVal == 0) {
          vmTable.isCheck = false;
        }
      });
    function checkAll() {
      var list = vmTable.listObject;

      for (var i = 0; i < list.length; i++) {
        list[i].checked = vmTable.isCheck;
        if (vmTable.isCheck) {
          listSelected.list.add(list[i].id);
        } else {
          listSelected.list.delete(list[i].id);
        }
      }

    }

    function checkOne(song) {
      var list = vmTable.listObject;
      var checkAll = true;


      for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
          listSelected.list.add(list[i].id);
          listSelected.song = list[i];
        } else {
          checkAll = false;
          listSelected.list.delete(list[i].id);
        }
      }
      vmTable.isCheck = checkAll;

      if (vmTable.listSelected.list.size != 1) {
        listSelected.song = null
      }

    }

    function viewObj(song) {
      listSelected.song = song;
      vmTable.viewDetail();
    }
  }
})();
