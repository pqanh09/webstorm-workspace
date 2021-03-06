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
    .module('sample.app.one')
    .directive('sampleAppOne', directiveFunction);

  directiveFunction.$inject = ['SampleAppConstant'];
  function directiveFunction(SampleAppConstant) {
    return {
      scope: {},
      restrict: 'E',
      controller: 'SampleAppOneCtrl',
      controllerAs: SampleAppConstant.vm,
      templateUrl: SampleAppConstant.sampleOne.templateUrl.appDirective
    };
  }
})();