/**
 *    $Id:
 *    (c) Copyright ALE USA Inc., 2015
 *    All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 *    or transmitted in any form or by any means, electronic, mechanical,
 *    photocopying, or otherwise without the prior permission of ALE USA Inc..
 *
 */
(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovTitle')
    .directive('ovTitle', ['ovTitle', function (ovTitle) {
      return {
        scope: {},
        template: '<title>{{ vm.getTitle() }}</title>',
        replace: true,
        controller: function () {
          var vm = this;
          vm.getTitle = function () {
            return ovTitle.getTitle();
          };
        },
        controllerAs: 'vm'
      };
    }])
  ;
})();
