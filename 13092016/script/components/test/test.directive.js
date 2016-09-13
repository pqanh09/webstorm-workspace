/**
 * Created by pqanh on 9/9/16.
 */
(function(){
  'use strict';

  angular.module('directive.test').directive('test', directiveFunction);

  directiveFunction.$inject = [];

  function directiveFunction(){
    return {
      templateUrl : 'script/components/test/test.directive.html',
      restrict: 'EA',
      controller: 'testController',
      controllerAs: 'vmTest',
      scope: true

    }
  }
})();