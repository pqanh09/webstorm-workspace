(function () {
    'use strict';

    angular.module('directive.table').controller('tableController', controllerFunction);

    controllerFunction.$inject = [];

    function controllerFunction() {
        var vm = this;
        var listIdsSelected = vm.listIdsSelected;
        console.log('tableController' + vm.listIdsSelected);
        console.log('tableController' + vm.listIdsSelected.list.toString());
        console.log('tableController' + vm.listIdsSelected.str);
        vm.isCheck = false;
        vm.checkOne = checkOne;
        vm.checkAll = checkAll;


        ////////

        function checkAll() {
            var list = vm.listObject;

            for (var i = 0; i < list.length; i++) {
                list[i].checked = vm.isCheck;
                if (vm.isCheck) {
                    listIdsSelected.list.add(list[i].id);
                } else {
                    listIdsSelected.list.delete(list[i].id);
                }
            }
            var sizeId = vm.listIdsSelected.list.size;
            if(sizeId == 1){
                console.log('1');
            } else if (sizeId <= 0) {
                console.log('0');
            } else {
                console.log('>1');
            }
            listIdsSelected.size = sizeId;
        }

        function checkOne() {
            var list = vm.listObject;
            var checkAll = true;

            for (var i = 0; i < list.length; i++) {
                if (list[i].checked) {
                    listIdsSelected.list.add(list[i].id);
                } else {
                    checkAll = false;
                    listIdsSelected.list.delete(list[i].id);
                }
            }
            vm.isCheck = checkAll;
        }
    }
})();
