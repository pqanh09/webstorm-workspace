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
    .module('sample.app')
    .controller('SampleAppCtrl', ControllerFunction);

  ControllerFunction.$inject = ['SampleAppConstant', 'sampleAppService'];

  function ControllerFunction(SampleAppConstant, sampleAppService) {
    var vm = this;
    /**
     * data for ov-app-skeletons
     * Ref: ngDocs
     */
    vm.appRootUrl = '/' + SampleAppConstant.sample.id;
    //vm.redirectUrl = vm.appRootUrl + '/' + SampleAppConstant.sampleOne.id; // use redirectUrl if you don't want to show home page
    vm.sideBarMenu = sampleAppService.getSideBarMenu();
    vm.navData = sampleAppService.getNavData();
    vm.home = sampleAppService.sideBarObject.sampleHome;
  }
})();