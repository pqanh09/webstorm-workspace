/**
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';
  angular
    .module('music.manager')
    .controller('musicController', controllerFunction);

  controllerFunction.$inject = ['musicConstant', 'musicManagerService'];

  function controllerFunction(musicConstant, musicManagerService) {

    var vm = this;



    vm.appRootUrl = '/' + musicConstant.id;
    vm.navData = musicManagerService.getBreadCrumbData();
    vm.sideBarMenu = musicManagerService.getSideBarMenu();
    vm.home = musicManagerService.sideBarObject.home;





  }
})();