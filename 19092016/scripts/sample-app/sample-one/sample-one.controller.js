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
    .controller('SampleAppOneCtrl', ControllerFunction);

  ControllerFunction.$inject = ['$scope', 'SampleAppConstant', 'sampleAppOneService', 'ovConstant', 'ovSlickMenuBuilder',
    'ovSelectShowService', 'sampleAppOneViewService', 'sampleAppOneActionService'];

  function ControllerFunction($scope, SampleAppConstant, sampleAppOneService, ovConstant, ovSlickMenuBuilder,
                              ovSelectShowService, sampleAppOneViewService, sampleAppOneActionService) {
    var vm = this;

    vm.cache = sampleAppOneService.cache;
    vm.constant = SampleAppConstant;
    vm.appTitle = vm.constant.sampleOne.title;
    vm.helpLink = vm.constant.sampleOne.helpLink;
    vm.mode = ovConstant.mode;

    //menu button items
    var btn = {
      create: {
        id: 'sample-one-create',
        onClick: createCb,
        titleI18key: 'button-label.add',
        iconClass: 'fa fa-plus'
        //permission: vm.constant.permission.create // is used to check permission to enable/disable button
      },
      edit: {
        id: 'sample-one-edit',
        onClick: editCb,
        titleI18key: 'button-label.edit',
        iconClass: 'fa fa-edit',
        checkDisabled: function () {
          return _.size(vm.dataView.selectedList) !== 1;
        }
        //permission: vm.constant.permission.edit
      },
      delete: {
        id: 'sample-one-delete',
        onClick: deleteCb,
        titleI18key: 'button-label.delete',
        iconClass: 'fa fa-trash-o',
        checkDisabled: function () {
          return _.size(vm.dataView.selectedList) === 0;
        }
        //permission: vm.constant.permission.delete
      },
      tableView: {
        id: 'sample-one-table-view',
        onClick: function () {
          vm.dataView.viewMode = vm.mode.table;
        },
        titleI18key: 'button-label.tableView',
        iconClass: 'fa fa-table',
        disabled: false,
        groupId: 'user-view-mode',
        checkGroupActive: function () {
          return (vm.dataView.viewMode === vm.mode.table);
        }
      },
      listView: {
        id: 'user-list-view',
        onClick: function () {
          vm.dataView.viewMode = vm.mode.list;
        },
        titleI18key: 'button-label.listView',
        iconClass: 'fa fa-list',
        checkDisabled: function () {
          return false;
        },
        groupId: 'user-view-mode',
        checkGroupActive: function () {
          return (vm.dataView.viewMode === vm.mode.list);
        }
      },
      tableSetting: {
        id: 'user-table-setting',
        onClick: function () {
          ovSelectShowService.showTableSetting($scope, vm.dataView.viewConfig);
        },
        isHidden: function () {
          return vm.dataView.viewMode !== vm.mode.table;
        },
        titleI18key: 'common.setting',
        iconClass: 'fa fa-gear'
      },
      listSetting: {
        id: 'user-list-setting',
        onClick: function () {
          ovSelectShowService.showListSetting($scope, vm.dataView.viewConfig);
        },
        isHidden: function () {
          return vm.dataView.viewMode !== vm.mode.list;
        },
        titleI18key: 'common.setting',
        iconClass: 'fa fa-gear'
      },
      refresh: {
        id: 'user-refresh',
        onClick: refreshCb,
        titleI18key: 'common.refresh',
        iconClass: 'fa fa-refresh'
      }
    };

    /**
     * Config of ovContainer contains many configs of other components
     *   Ref: app/ov_components/ovContainer/ovContainerDefaultTemplate.html
     * appId: using to add id for UI Automation test Ex: <button id='button1'></button>
     * helpLink: A question mask icon at top right screen to open a new window with guideline about this app
     *   but at training period we don't need it
     * slickMenu: a object contains data and config of ovSlickMenu component (Ref ngDocs)
     * alertObject: config of ovAlert component (Ref ngDocs)
     * state: a object contains all state (view, create, edit) and current state to get currentTemplate
     *   Ref: app/ov_components/ovContainer/ovContainerDefaultTemplate.html
     * spinner: a object contains only status value with boolean type to show a spinner when loading data
     *   Ref: ovSpinnerLoading (ngDocs)
     */
    vm.containerConfig = {
      appId: 'vm-server-connection',
      helpLink: vm.constant.sampleOne.helpLink,
      title: vm.constant.sampleOne.title,
      slickMenu: {
        data: [btn.create, btn.edit, btn.delete, btn.tableView, btn.listView, btn.tableSetting, btn.listSetting, btn.refresh],
        config: ovSlickMenuBuilder.getConfigBuilder().build(),
        getStatus: function () {
          return vm.cache.state.getMenuStatus();
        }
      },
      alertObject: vm.cache.alertObject,
      state: vm.cache.state,
      spinner: vm.cache.spinner
    };

    /**
     * Ref: ovAppState.js check what is current state
     */
    vm.isCreate = function () {
      return vm.cache.state.check(vm.mode.create);
    };

    /**
     * Ref: ovAppState.js check what is current state
     */
    vm.isEdit = function () {
      return vm.cache.state.check(vm.mode.edit);
    };

    /**
     * Show spinner when loading data
     * Ref: ovContainer - app/ov_components/ovContainer/ovContainerDefaultTemplate.html
     */
    vm.showLoading = function () {
      vm.cache.spinner.status = true;
    };

    /**
     * hide spinner when loaded data
     * Ref: ovContainer - app/ov_components/ovContainer/ovContainerDefaultTemplate.html
     */
    vm.hideLoading = function () {
      vm.cache.spinner.status = false;
    };

    vm.refresh = refreshCb;

    /**
     * What is the serviceName.decorator
     * RCA: I don't want to this file has many lines also separate by function or type
     * Instead of inline in this file I move these code to other service files
     * and set variables to this controller
     */
    sampleAppOneViewService.decorator(vm, $scope);
    sampleAppOneActionService.decorator(vm, $scope);

    /**
     * Where vm.cache.state.change is defined?
     * Support by ovAppState utility allow changing current state to others
     * Ref: ovAppState.js -> ovContainer
     */
    function createCb() {
      vm.cache.state.change(vm.mode.create);
    }

    /**
     * Where vm.cache.state.change is defined?
     * Support by ovAppState utility allow changing current state to others
     * Ref: ovAppState.js -> ovContainer
     */
    function editCb() {
      vm.cache.currentItem = angular.copy(vm.dataView.selectedList[0]);
      vm.cache.currentItemJson = angular.toJson(vm.cache.currentItem);
      vm.cache.state.change(vm.mode.edit);
    }

    /**
     * Where vm.action is  defined?
     * Ref: sample-one-action.decorator.js
     * How: sampleAppOneActionService.decorator(vm, $scope);
     */
    function deleteCb() {
      vm.action.delete();
    }

    /**
     * Where vm.dataView is  defined?
     * Ref: sample-one-view.decorator.js
     * How: sampleAppOneViewService.decorator(vm, $scope);
     */
    function refreshCb() {
      vm.dataView.getList(true);
    }
  }
})();