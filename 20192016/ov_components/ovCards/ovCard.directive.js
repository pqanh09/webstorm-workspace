/**
 (c) Copyright ALE USA Inc., 2015
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';

  function OVCardCtrl($scope, ovDottie, ovCardsConstant) {

    var vm = this;
    vm.contentTemplateUrl = ovDottie.getString(vm, 'ovCard.templateUrl',
      ovDottie.getString(ovCardsConstant, 'templateUrl.cardType.' + vm.cardType, ovCardsConstant.templateUrl.cardType.textOnly));

    //--------------------------handle destroy scope--------------------------
    $scope.$on(ovCardsConstant.onDestroy, function () {
    });
    //------------------------end handle destroy scope------------------------
  }

  OVCardCtrl.$inject = ['$scope', 'ovDottie', 'ovCardsConstant'];

  angular.module('ngnms.ui.fwk.ovCards')
    .controller('OVCardCtrl', OVCardCtrl)
    .directive('ovCard', ['ovCardsConstant',
      function (ovCardsConstant) {
        return {
          scope: {
            ovCard: '=',
            cardType: '@?'
          },
          restrict: 'A',
          controllerAs: 'vm',
          bindToController: true,
          controller: 'OVCardCtrl',
          templateUrl: ovCardsConstant.templateUrl.card
        };
      }]);
})();
