/**
 * Created by pqanh09 on 8/26/16.
 */
(function(){
  'use strict';

  angular.module('directive.table').directive('ovTable', directiveFunction);

  directiveFunction.$inject = [];

  function directiveFunction(){
    /*return {
      templateUrl : 'script/components/table/table.html',
      restrict: 'E',
      controller: 'tableController',
      controllerAs: 'vmTable',
      scope: {
        title: '=',
        listCol: '=',
        keyCol: '=',
        listObject: '=',
        listSelected: '=',
        viewDetail: '&'
      },
      bindToController: true
    }*/
    return {
      templateUrl : 'script/components/table/table.html',
      restrict: 'E',
      controller: 'tableController',
      controllerAs: 'vmTable',
      scope: false,
      bindToController: {
        title: '=',
        listCol: '=',
        listObject: '=',
        viewDetail: '&',
        listSelected: '='
      }
    }
  }
})();