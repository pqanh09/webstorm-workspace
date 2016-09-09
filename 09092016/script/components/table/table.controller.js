(function () {
    'use strict';

    angular.module('directive.table').controller('tableController', controllerFunction);

    controllerFunction.$inject = [];

    function controllerFunction() {
        var vmTable = this;
        var listIdsSelected = vmTable.listIdsSelected;
        console.log('tableController' + vmTable.listIdsSelected);
        console.log('tableController' + vmTable.listIdsSelected.list.toString());
        console.log('tableController' + vmTable.listIdsSelected.str);
        vmTable.isCheck = false;
        vmTable.checkOne = checkOne;
        vmTable.checkAll = checkAll;


        ////////

        function checkAll() {
            var list = vmTable.listObject;

            for (var i = 0; i < list.length; i++) {
                list[i].checked = vmTable.isCheck;
                if (vmTable.isCheck) {
                    listIdsSelected.list.add(list[i].id);
                } else {
                    listIdsSelected.list.delete(list[i].id);
                }
            }
            var sizeId = vmTable.listIdsSelected.list.size;
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
            var list = vmTable.listObject;
            var checkAll = true;

            for (var i = 0; i < list.length; i++) {
                if (list[i].checked) {
                    listIdsSelected.list.add(list[i].id);
                } else {
                    checkAll = false;
                    listIdsSelected.list.delete(list[i].id);
                }
            }
            vmTable.isCheck = checkAll;
        }
    }
})();
