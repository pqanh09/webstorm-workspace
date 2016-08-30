/**
 * Created by pqanh09 on 8/26/16.
 */
(function(){
  'use strict';

  angular.module('directive.table').directive('ovTable', directiveFunction);

  directiveFunction.$inject = [];

  function directiveFunction(){
    return {
      templateUrl : 'script/components/table/table.html',
      restrict: 'E',
      controller: 'tableController',
      controllerAs: 'vm',
      scope: {
        title: '=title',
        listCol: '=listCol',
        keyCol: '=keyCol',
        listObject: '=listObject',
        listIdsSelected: '=listIdsSelected'
      }
    }
  }
})();