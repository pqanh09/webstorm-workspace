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
    .factory('sampleAppOneViewService', serviceFunction);
  serviceFunction.$inject = ['sampleAppOneService'];
  function serviceFunction(sampleAppOneService) {
    var service = {};

    service.decorator = decorator;

    return service;
    /////////////////////////////////////////////////////////////////////////////////

    function decorator(vm) {

      /*data view*/
      vm.dataView = {};
      /**
       * Why vm.dataView.firstLoad is needed?
       * Ref: vm.dataView.getList
       * RCA: ovDataView component support two method allow you to set data
       *   1) setSelectedFromCache (cache all configurations when scope destroyed)
       *   2) resetOvDataViewConfig (clear all current configurations)
       * Two method in one function -> Using a flag to know when it should be called
       *   1) setSelectedFromCache call when scope destroyed Ex: change route url, change template
       *   2) resetOvDataViewConfig call when pressing reset button (ref: sample-one.controller refreshCb)
       */
      vm.dataView.firstLoad = vm.cache.state.check(vm.mode.view);

      /**
       * Why vm.dataView.fnList is need
       * Ref: shared-view.html
       * It is a param of ovDataView component
       * RCA: Because of using isolate scope so that detail template won't see data from parent controller
       * So that I by pass object to directive and directive assign all data to scope then I can using this
       * variable in detail tpl Ref: sample-one-detail.html I can read attrs from scope
       */
      vm.dataView.fnList = {
        attrs: vm.constant.sampleOne.attrs
      };

      /**
       * Config for ovDataView component
       * Ref: ngDocs
       * title: title at top left component
       * primaryKey: Due to component supports cache selectedList -> need to know where selected item is
       * id: 'Id for component'
       * tableConfig.csvFileName: if empty using data.csv but existing PR required friendly csv file name for this
       * attrs: columns list
       */
      vm.dataView.viewConfig = {
        title: vm.constant.sampleOne.title,
        primaryKey: vm.constant.sampleOne.attrs.name.key,
        id: 'listItem',
        tableConfig: {
          csvFileName: vm.constant.sample.title
        },
        attrs: vm.constant.sampleOne.attrs
      };

      /**
       * detail for ovDataView component
       * Value: sample-one-detail.html
       */
      vm.dataView.tplDetail = vm.constant.sampleOne.templateUrl.detail;

      /**
       * As explained above (Why vm.dataView.firstLoad is needed?)
       */
      vm.dataView.getList = function getList(isReset) {
        vm.showLoading();
        sampleAppOneService.getList()
          .then(function success(data) {
            if (isReset) {
              vm.dataView.viewConfig.resetOvDataViewConfig(data);
            } else {
              var selectedList = vm.dataView.viewConfig.setSelectedFromCache(data);
              vm.dataView.onSelected(selectedList);
            }
          })
          .finally(function () {
            vm.hideLoading();
          });
      };

      /**
       * Callback when pressing a item
       * param: selected item
       */
      vm.dataView.onSelected = function onSelected(selected) {
        if (_.size(selected) === 1) {
          //do some thing when selecting a row
        }
      };

      /**
       * Make sure slick grid already loaded then call functions
       * vm.dataView.viewConfig.setSelectedFromCache in vm.dataView.getList need to render component first
       * So that this callback let you know at this time everything is fine
       */
      vm.dataView.viewConfig.tableConfig.onGridInitCallback = function () {
        vm.dataView.getList(!vm.dataView.firstLoad);
        vm.dataView.firstLoad = false;
      };
    }
  }
})();