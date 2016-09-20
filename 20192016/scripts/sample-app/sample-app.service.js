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
    .factory('sampleAppService', serviceFunction);
  serviceFunction.$inject = ['$http', '$i18next', 'SampleAppConstant'];
  function serviceFunction($http, $i18next, SampleAppConstant) {
    var service = {
      getSideBarMenu: getSideBarMenu,
      getNavData: getNavData
    };

    return service;
    /////////////////////////////////////////////////////////////////////////////////


    /*get sideBar Menu data*/
    function getSideBarMenu() {
      var sideBarMenu, sideBarObject;

      sideBarMenu = {
        id: SampleAppConstant.sample.id,
        title: $i18next(SampleAppConstant.sample.title),
        menuItems: [],
        disabled: true
      };
      sideBarObject = service.sideBarObject = {};

      sideBarObject.sampleHome = {
        id: SampleAppConstant.sampleHome.id,
        title: $i18next(SampleAppConstant.sampleHome.title),
        templateUrl: SampleAppConstant.sampleHome.templateUrl.app,
        parent: sideBarMenu
      };
      sideBarObject.sampleOne = {
        id: SampleAppConstant.sampleOne.id,
        title: $i18next(SampleAppConstant.sampleOne.title),
        templateUrl: SampleAppConstant.sampleOne.templateUrl.app,
        parent: sideBarMenu
      };
      sideBarObject.sampleTwo = {
        id: SampleAppConstant.sampleTwo.id,
        title: $i18next(SampleAppConstant.sampleTwo.title),
        parent: sideBarMenu,
        menuItems: []
      };
      sideBarObject.sampleTwo1 = {
        id: SampleAppConstant.sampleTwo1.id,
        title: $i18next(SampleAppConstant.sampleTwo1.title),
        templateUrl: SampleAppConstant.sampleTwo1.templateUrl.app,
        parent: sideBarObject.sampleTwo
      };
      sideBarObject.sampleTwo2 = {
        id: SampleAppConstant.sampleTwo2.id,
        title: $i18next(SampleAppConstant.sampleTwo2.title),
        templateUrl: SampleAppConstant.sampleTwo2.templateUrl.app,
        parent: sideBarObject.sampleTwo
      };
      sideBarObject.sampleTwo.menuItems = [sideBarObject.sampleTwo1, sideBarObject.sampleTwo2];
      sideBarMenu.menuItems = [sideBarObject.sampleHome, sideBarObject.sampleOne, sideBarObject.sampleTwo];
      return sideBarMenu;
    }

    /* get breadcrumb data*/
    function getNavData() {
      var navData = {};
      navData.list = [
        {
          title: 'Training App',
          iconClasses: 'fa fa-fw fa-home',
          disabled: false
        },
        {
          title: $i18next('sampleApp.navData.sampleApp'),
          disabled: true
        }
      ];
      return navData;
    }
  }
})();