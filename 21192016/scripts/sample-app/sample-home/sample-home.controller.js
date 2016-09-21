/**
 $Id:
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';
  angular
    .module('sample.app.home')
    .controller('SampleAppHomeCtrl', ControllerFunction);

  ControllerFunction.$inject = ['ovCardsConstant', '$location'];

  function ControllerFunction(ovCardsConstant, $location) {
    var vm = this;

    /**
     * Config and data for ovCards
     * Ref: ngDocs
     */
    vm.cardsConfig = {cardType: ovCardsConstant.cardType.includedIcon, hintedWidthCard: 300};

    vm.cards = [
      {
        iconClass: 'fa fa-lg fa-bar-chart-o',
        title: ' .menus.sampleOne.title',
        description: 'sampleApp.menus.sampleOne.description',
        onSelected: function() {
          $location.url('sample-app/sample-one');
        }
      }
    ];
  }
})();