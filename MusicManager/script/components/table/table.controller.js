(function () {
  'use strict';

  angular.module('directive.table').controller('tableController', controllerFunction);

  controllerFunction.$inject = [];

  function controllerFunction() {
    var vm = this;
    var listISelected = vm.listIdsSelected;
    vm.isCheck = false;
    vm.checkOne = checkOne;
    vm.checkAll = checkAll;



    ////////

    function checkAll() {
      var list = vm.listObject;

      for (var i = 0; i < list.length; i++) {
        list[i].checked = vm.isCheck;
        if(vm.isCheck){
          listISelected.list.add(list[i].id);
        } else {
          listISelected.list.delete(list[i].id);
        }
      }
    }

    function checkOne() {
      var list = vm.listObject;
      var checkAll = true;

      for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
          listISelected.list.add(list[i].id);
        } else {
          checkAll = false;
          listISelected.list.delete(list[i].id);
        }
      }
      vm.isCheck = checkAll;
    }
  }
})();
