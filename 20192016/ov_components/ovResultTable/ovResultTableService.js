/**
 * Created by pttthuan on 1/6/2016.
 */

(function () {
  'use strict';
  //ignore jshint warning function was used before was defined
  /* jshint latedef:nofunc */
  angular.module('ngnms.ui.fwk.ovResultTable')
    .factory('ovResultTableService', ovResultTableService);
  ovResultTableService.$inject = ['ovOboeBuilder', '$q', 'ovResultTableConstant', '$timeout', 'ovAlertBuilder', 'ovDottie', '$i18next'];
  function ovResultTableService(ovOboeBuilder, $q, ovResultTableConstant, $timeout, ovAlertBuilder, ovDottie, $i18next) {
    var service = {};
    service.appCache = {};
    var defaultRsData = {
      targetGroup: []
    };
    var defaultAppCache = {
      rsData: defaultRsData,
      isTaskRunning: false,
      displayOkButton: true,
      responseSaver: [],
      isAppRunning: false,
      isExistOther: false,
      functionList: {},
      config: {},
      listBoxConfig: {},
      resultTableExportCsv: {
        data: [],
        config: {
          fieldConfig: [
            {name: $i18next('ovResultTable.sourceName'), key: 'name'},
            {name: $i18next('common.friendlyName'), key: 'friendlyName'},
            {name: $i18next('common.resultTable.header.status'), key: 'status'},
            {name: $i18next('common.resultTable.header.message'), key: 'description'},
            {name: $i18next('common.timestamp'), key: 'resultTimestampTranslated'}
          ]
        },
        enableExportCsv: false
      },
      resultCounting: {
        success: {
          number: 0,
          name: $i18next('ovResultTable.success')
        },
        error: {
          number: 0,
          name: $i18next('ovResultTable.failure')
        },
        warning: {
          number: 0,
          name: $i18next('ovResultTable.partialSuccess')
        },
        other: {
          number: 0,
          name: $i18next('ovResultTable.other').toLowerCase()
        }
      },
      resultTextArray: []
    };
    /**
     * @ngdoc method
     * @name ovResultTableService.isTaskRunning
     * @methodOf ov-component.directive:ovResultTable
     * @description:
     * (in ovResultTableService)Check task is completed/uncompleted.
     * @param {string} id app id
     */
    service.isTaskRunning = function (id) {
      return ovDottie.getBoolean(service.appCache[id], 'isTaskRunning');
    };
    /**
     * @ngdoc method
     * @name ovResultTableService.clearCache
     * @methodOf ov-component.directive:ovResultTable
     * @description:
     * (in ovResultTableService) reset component cache.
     * @param {string} id app id
     */
    service.clearCache = function (id) {
      if (angular.isDefined(service.appCache[id])) {
        service.appCache[id] = angular.copy(defaultAppCache);
      }
    };
    /**
     *
     * @param {string} id
     * @returns {*}
     */
    service.getAppData = function (id) {
      if (angular.isUndefined(service.appCache[id])) {
        service.appCache[id] = angular.copy(defaultAppCache);
      }
      service.appCache[id].ovAlert = service.appCache[id].ovAlert || ovAlertBuilder.getBuilder().build();
      return service.appCache[id];
    };

    var buildOboe = ovOboeBuilder.build({
      successProperty: ovResultTableConstant.code,
      failCompareKey: ovResultTableConstant.error.toUpperCase(),
      finalResponseProperty: ovResultTableConstant.code,
      finalResponseValue: ovResultTableConstant.endRequest
    });

    /**
     *
     * @param {string} id
     * @param {string} method
     * @param {string} url
     * @param {Object|String}requestBody
     * @param {Object} [ovOboeBuilderObj]
     * @returns {*}
     */
    service.setCallApi = function (id, method, url, requestBody, ovOboeBuilderObj) {
      // service.clearCache(id);
      if (angular.isDefined(ovOboeBuilderObj)) {
        buildOboe = ovOboeBuilder.build(ovOboeBuilderObj);
      }
      return buildOboe[method]({requestId: id || 'ovResultTable', url: url}).execute(requestBody);

    };


    return service;
  }
})();
