(function(){
  'use strict';

  angular.module('directive.table').controller('tableController', controllerFunction);

  controllerFunction.$inject = ['$scope'];

  function controllerFunction($scope){
//    var vm = this;
//    vm.isCheck = true;
      $scope.change = function () {
          console.log($scope);

          console.log('A:'+'listIdsSelected.list:');
          console.log($scope.listIdsSelected.list);
          angular.forEach($scope.listObject, function (song) {
              var checkbox = document.getElementById(song.id);
              if (!checkbox.checked) {
                  $scope.listIdsSelected.list.add(song.id);
              } else {
                  $scope.listIdsSelected.list.delete(song.id);
              }
          });

          console.log('B:'+'listIdsSelected:');
          console.log($scope.listIdsSelected.list);
          var listStr = '';
          angular.forEach($scope.listIdsSelected.list, function (id) {
              listStr += id + ' ';
          });
          console.log(listStr);
          $scope.listSelected = listStr;
          $scope.listIdsSelected.str = listStr;
          console.log($scope);
      };
  }
})();
