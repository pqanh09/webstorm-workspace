/**
 (c) Copyright ALE USA Inc., 2015
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovCards
   * @restrict A
   * @description
   * _The `ovCards` allows user to display the number of cards (in home page).
   *
   * _Support 2 types of cards displaying:
   * 1. textOnly.
   * 2. includedIcon.
   *
   * _Support custom template for customization.
   *
   * _Responsive (automatically calculate appropriate width for all cards based on a hinted width.
   * This means no matter what screen size, the layout will try to figure out the best width of a card to fit the screen width, thus eliminating any weird empty space).
   *
   *
   *
   * @param {array} ovCards An array of card objects. Card object includes the following attributes:
   *   * **onSelected**: callback function.
   *   * **isHidden**: function returns true (hide)/false (show).
   *   * **templateUrl**: custom template (optional).
   *
   *   -----------------------------content include-----------------------------
   *
   *   * **iconClass**: card icon class.
   *   * **title**: card title.
   *   * **description**: card description.
   *   * **whatEverYouWant**: for custom template.
   * @param {object=} cardsConfig Cards configuration object:
   *   * **hintedWidthCard**: standard width (270 by default).
   *   * **cardType**: support 2 types 'textOnly'/'includedIcon'.
   *
   *   You can use ovCardsConstant service (ovCardsConstant.cardType.textOnly/ovCardsConstant.cardType.includedIcon) for consistency.
   *
   *   By default, the type is ovCardsConstant.cardType.textOnly.
   *
   *
   *
   * @example
   *<pre>
   *  <!--HTML-->
   <div ov-cards="vm.cards" cards-config="vm.cardsConfig"></div>
   *</pre>
   *<pre>
   * //JS
   vm.cardsConfig = {cardType: ovCardsConstant.cardType.includedIcon, hintedWidthCard: 300};
   
   vm.cards = [
   {
     iconClass: 'fa fa-lg fa-bar-chart-o',
     title: 'analytics.statistic.cards.topNApps.title',
     description: 'analytics.statistic.cards.topNApps.description',
     onSelected: function() {}
   },
   {
     iconClass: 'fa fa-lg fa-bar-chart-o',
     title: 'analytics.statistic.cards.topNAppsAdvanced.title',
     description: 'analytics.statistic.cards.topNAppsAdvanced.description',
     isHidden: function () {
       return true;
     },
     onSelected: function() {}
   },
   {
     iconClass: 'fa fa-lg fa-bar-chart-o',
     title: 'analytics.statistic.cards.topNUsers.title',
     description: 'analytics.statistic.cards.topNUsers.description',
     onSelected: function() {}
   },
   {
     iconClass: 'fa fa-lg fa-bar-chart-o',
     title: 'analytics.statistic.cards.topNSwitches.title',
     description: 'analytics.statistic.cards.topNSwitches.description',
     onSelected: function() {}
   },
   {
     iconClass: 'fa fa-lg fa-bar-chart-o',
     title: 'analytics.statistic.cards.topNLinkage.title',
     description: 'analytics.statistic.cards.topNLinkage.description',
     onSelected: function() {}
   },
   {
     iconClass: 'fa fa-lg fa-bar-chart-o',
     title: 'analytics.statistic.cards.networkAvailability.title',
     description: 'analytics.statistic.cards.networkAvailability.description',
     onSelected: function() {}
   },
   {
     iconClass: 'fa fa-lg fa-bar-chart-o',
     title: 'analytics.statistic.cards.alarm.title',
     description: 'analytics.statistic.cards.alarm.description',
     onSelected: function() {}
   }
   ];
   *</pre>
   *
   */

  function OVCardsCtrl() {
  }

  OVCardsCtrl.$inject = [];

  angular.module('ngnms.ui.fwk.ovCards')
    .controller('OVCardsCtrl', OVCardsCtrl)
    .directive('ovCards', ['ovDottie', 'ovCardsConstant',
      function (ovDottie, ovCardsConstant) {
        return {
          scope: {
            ovCards: '=',
            cardsConfig: '=?'
          },
          restrict: 'A',
          controllerAs: 'vm',
          bindToController: true,
          controller: 'OVCardsCtrl',
          templateUrl: ovCardsConstant.templateUrl.main,
          link: function ($scope, $element) {
            var parentWidth = 0;
            var defaultCardsConfig = {
              hintedWidthCard: ovCardsConstant.widthCard,
              cardType: ovCardsConstant.cardType.textOnly
            };

            var CARD_DISTANCE = 20;
            var calculateCardWidth = function () {
              var cardsWidth = parentWidth, totalDistance, idealWidthCard,
                cardsPerRow = Math.floor(cardsWidth / ($scope.vm.cardsConfig.hintedWidthCard + CARD_DISTANCE)) || 1;
              //cardsPerRow = (cardsPerRow > $scope.vm.ovCards.length ? $scope.vm.ovCards.length : cardsPerRow);
              totalDistance = (cardsPerRow) * CARD_DISTANCE;
              idealWidthCard = (cardsWidth - totalDistance) / cardsPerRow;
              $scope.vm.widthCardAuto = idealWidthCard;
            };
            var cardsInit = function () {
              if (!angular.isArray($scope.vm.ovCards)) {
                $scope.vm.ovCards = [];
              }
              $scope.vm.cardsConfig = angular.extend({}, defaultCardsConfig, $scope.vm.cardsConfig);
              $scope.vm.widthCardAuto = $scope.vm.cardsConfig.hintedWidthCard;
              $scope.vm.repeatDone = function () {
                calculateCardWidth();
              };
            };
            cardsInit();

            $scope.$watch(function () {
                var parentElement = $($element.parent()) || {};
                if (angular.isFunction(parentElement.outerWidth)) {
                  return parentElement.outerWidth();
                }
              }, function (newVal) {
                if (newVal) {
                  parentWidth = newVal;
                  calculateCardWidth();
                }
              }
            );

            //--------------------------handle destroy scope--------------------------
            $scope.$on(ovCardsConstant.onDestroy, function () {
            });
            //------------------------end handle destroy scope------------------------
          }
        };
      }]);
})();
