/**
 * @license OmniVista v1.0
 * (c) 2014-2015 TMA Solutions
 * License:
 */
(function () {
  'use strict';
  // This option prohibits the use of a variable before it was defined.
  /* jshint  latedef:nofunc*/

  function ovAppSkeletonCacheService() {
    var service = {};
    service.cacheData = {};
    service.CacheObject = function CacheObject(){
      this.lastedPage = {};
      this.selectedMenuItem = {};
    };
    service.resetCacheObject = function resetCacheObject(id){
      delete service.cacheData[id];
    };
    return service;
  }

  ovAppSkeletonCacheService.$inject = [];
  angular.module('ngnms.ui.fwk.ovAppSkeleton')
    .factory('ovAppSkeletonCacheService', ovAppSkeletonCacheService);
})();
