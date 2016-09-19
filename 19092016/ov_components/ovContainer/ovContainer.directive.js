/**
 *    $Id:
 *    (c) Copyright ALE USA Inc., 2015
 *    All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 *    or transmitted in any form or by any means, electronic, mechanical,
 *    photocopying, or otherwise without the prior permission of ALE USA Inc..
 *
 */
(function () {
  // This option prohibits the use of a variable before it was defined.
  /* jshint  latedef:nofunc*/
  'use strict';
  ovContainerController.$inject = ['$rootScope'];
  function ovContainerController($rootScope) {
    //jshint validthis:true
    var vm = this;
    vm.$ovContainer = {};
    vm.$ovContainer.openHelp = $rootScope.openHelp;
    vm.$onInit = function () {
      vm.$ovContainerConfig.templateUrl = vm.$ovContainerConfig.templateUrl || 'ov_components/ovContainer/ovContainerDefaultTemplate.html';
      vm.$ovContainerConfig.titleCssClass = vm.$ovContainerConfig.titleCssClass || 'app-heading';
    };

  }

  //function ovContainerDirectiveLink() {
  //}

  ovContainer.$inject = [];
  function ovContainer() {
    return {
      scope: true,
      restrict: 'A',
      templateUrl: 'ov_components/ovContainer/ovContainer.html',
      controller: 'ovContainerController',
      controllerAs: 'ovContainer',
      bindToController: {
        $ovContainerConfig: '=ovContainerConfig'
      }
      //,
      //link: ovContainerDirectiveLink
    };
  }

  angular.module('ngnms.ui.fwk.ovContainer', [])
    .controller('ovContainerController', ovContainerController)
    .directive('ovContainer', ovContainer);
})();


