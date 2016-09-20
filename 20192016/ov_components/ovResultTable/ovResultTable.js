/**
 * Created by pttthuan on 12/14/2015.
 */
/**
 * @ngdoc directive
 * @name ov-component.directive:ovResultTable
 * @restrict E-A
 * @description
 * Show result table using task executer
 *
 * @param {object} rsConfig: Assignable angular expression to data-bind to
 *   * **config** 'object': contain configs for component
 *   *    * **appId** `string`: Id of apps using component
 *   *    * **title**  `string`: Title of progress
 *   *    * **request**  `object`: set request api
 *   *    *   * **url** 'string'
 *   *    *   * **requestBody** 'string'
 *   *    *   * **method**  'string'
 *   *    *   * **ovOboeBuilderObj**(optional) 'string'
 *   *    * **parseRsListItem** `function`: parse switches list of your app to switches list of component.
 *   *    * **responsePromise** (optional) `function`: replace request (return promise)
 *   *    * **displayOkButton** (optional) `function`: show/hide ok button
 *   *    * **enableDialog** (optional) `boolean`: show result as a dialog when click "show more"
 *   * **functionList** 'object': contain functions for component
 *   *    * **okCallback**(optional) `function`: set action for ok button
 *
 * @param {Array} rsListItem: Rows of result displayed on screen
 * @param {object} listBoxConfig (optional) : Config for ovNgListBox inside resultTable
 *
 *
 * @example
 * **Basic Example:**
 *<pre>
 *  //HTML
 <ov-result-table-directive
 rs-config="vm.rsConfig"
 rs-list-item="vm.rsListItem">
 </ov-result-table-directive>
 *</pre>
 *<pre>
 * //JS
 vm.rsConfig = {
     config:{
            appId: 'vlan-create',
            title: 'add 1 vlan',
            parseRsListItem: function(item){
                                return {
                                       targetId:item.deviceId,
                                       friendlyName:item.friendlyName
                                        }
                             }
            request:{
                        method: 'POST',
                        url: '/api/vlanservice/spantree/get/view',
                        requestBody: {vlanIds:[1]},
                    }
    }
 }
 vm.rsListItem=[
 {
    deviceId:'10101010',
    friendlyName:'10.10.10.10'
 },
 {
     deviceId:'10101011',
     friendlyName:'10.10.10.11'
 }
 ];
 *</pre>
 * ** Custom detail template Example:**
 * <pre>
 * //HTML
 <ov-result-table-directive
 rs-config="vm.rsConfig"
 rs-list-item="vm.rsListItem"
 list-box-config="vm.listBoxConfig">
 </ov-result-table-directive>
 *</pre>
 *<pre>
 * //JS
 //vm.rsConfig & vm.rsListItem as basic Example
 vm.listBoxConfig.config.detailTemplate='ov_components/ovResultTable/customDetailTpl.html'
 *</pre>
 * ** onSelect for detail button Example:**
 *<pre>
 * //JS
 vm.listBoxConfig.onSelected=function(item){
                             console.log(item);
                             }
 *</pre>
 * ** set limit row of list box Example:**
 *<pre>
 * //JS
 vm.listBoxConfig.config.limitRow=10;
 *</pre>
 *
 * **Parse response Example:**
 *<pre>
 * //JS
 vm.rsConfig.config.parseResponse=function(response){
                                    response.translated.messageObjectTranslated=response.operationName+response.translated.messageObjectTranslated;
                                    return response;
                                  }
 *</pre>
 *
 * ** Hide ok button  Example:**
 *<pre>
 vm.rsConfig.config.displayOkButton=false
 *</pre>
 *
 * ** enable dialog  Example:**
 *<pre>
 vm.rsConfig.config.enableDialog=true
 *</pre>
 * ** Check done progress  Example:**
 * <pre>
 * //HTML
 <button class="btn btn-primary" ng-disabled="!vm.isDone">OK</button>
 *</pre>
 *<pre>
 * //JS
 vm.isDone=ovResultTableService.isTaskRunning(appId);
 *</pre>
 *
 * **Assign action to OK button  Example:**
 *<pre>
 *  //JS
 vm.rsConfig.functionList.okCallback=function(){
                                        backToMainPage();
                                      }
 *</pre>
 * **use responsePromise Example:**
 *<pre>
 *  //JS
 vm.rsConfig.functionList.responsePromise= function(){
                                             var deferred = $q.defer();
                                             functionAdd().then(angular.noop,
                                                        function (errorRes) {
                                                          deferred.reject(errorRes);
                                                        },
                                                        function (notifyRes) {
                                                          deferred.notify(notifyRes);
                                                        });
                                              return deferred.promise;
                                          }
 *</pre>
 * **clear cache Example:**
 *<pre>
 *  //JS
 ovResultTableService.clearCache('vlan-create');
 *</pre>
 */
/**
 * @ngdoc method
 * @name parseRsListItem
 * @methodOf ov-component.directive:ovResultTable
 * @description:
 * parse switches list of your app to switches list of component.
 * @param {object} item every item in rsListItem.
 */
 /**
 * @ngdoc method
 * @name displayOkButton
 * @methodOf ov-component.directive:ovResultTable
 * @description:
 * show/hide "Ok" button
 * @param {boolean} bool default: true
 */
 /**
 * @ngdoc method
 * @name okCallback
 * @methodOf ov-component.directive:ovResultTable
 * @description:
 * set actions for "Ok" button
 * @param {boolean} bool default: true
 */
  /**
 * @ngdoc method
 * @name enableDialog
 * @methodOf ov-component.directive:ovResultTable
 * @description:
 * show result as a dialog when click "show more"
 * @param {boolean} bool default: false
 */
(function () {
  'use strict';
  //ignore jshint warning function was used before was defined
  /* jshint latedef:nofunc */
  angular.module('ngnms.ui.fwk.ovResultTable', [])
    .directive('ovResultTableDirective', ovResultTableDirective)
    .controller('ovResultTableCtrl', ovResultTableCtrl);

  function ovResultTableDirective() {
    return {
      scope: {
        rsConfig: '=',
        rsListItem: '=',
        listBoxConfig: '=?'
      },
      templateUrl: 'ov_components/ovResultTable/ovResultTable.html',
      controller: 'ovResultTableCtrl',
      controllerAs: 'vm'
    };
  }

  function ovResultTableCtrl($scope, $ovUtility, ovResultTableService, ovResultTableConstant, $q, dlgDataBuilder, $ovDlgService, $log, ovDottie, $i18next) {
    /*jshint validthis: true*/
    var vm = this;
    var itemTplDefault = 'ov_components/ovResultTable/ovResultTableItemDefault.html';
    var headerDefault = 'ov_components/ovResultTable/ovResultTableHeaderDefault.html';
    var detailTplDefault = 'ov_components/ovResultTable/ovResultTableDetailDefault.html';

    var compulsoryProperties = ['parseRsListItem', 'appId'];
    var codeHandler = {};
    vm.isVisibleBackBtn = false;
    /**
     *
     * @param {object} errorData
     */
    function onError(errorData) {
      var errorMessage = ovDottie.getString(ovDottie.getObject(errorData, 'response.translated'), 'messageObjectTranslated');
      _.forEach(vm.app.rsData.targetGroup, function (target) {
        assignMessage(target, errorMessage, ovResultTableConstant.error);
        target.description = $i18next('ovResultTable.theOperationFailed');
        target.sourceList = 0;
        target.status = ovResultTableConstant.error;
        target.isDone = true;
      });
      vm.app.isError = true;
      vm.app.isTaskRunning = false;
      vm.app.resultCounting.error.number = vm.app.rsData.targetGroup.length;
      assignCSV();
      assignResultTextArray();
      vm.ovAlert._error(ovResultTableConstant.error.toUpperCase() + '! ' + errorMessage);
    }

    var selectedFieldList = [
      {key: 'friendlyName'}
    ];
    var defaultRsConfig = {
      config: {
        enableDialog: false
      }
    };
    var defaultlistBoxConfig = {
      config: {
        id: 'idConfig',
        selectFieldList: selectedFieldList,
        showHeader: true,
        itemTemplate: itemTplDefault,
        detailTemplate: detailTplDefault,
        headerTemplate: headerDefault,
        preventSelect: true,
        searchString: '',
        currentPage: 1,
        limitRow: 10000,
        maxHeight: 900,
        showFooter: false,
        useVirtualRepeat: true,
        heightOptions: {
          ovResize: 150
        }
      },
      functionList: {
        resultItemClick: function (deviceItem) {
          $scope.item = angular.copy(deviceItem);
          vm.listBoxConfig.onSelected($scope.item);
          var detailTpl = ovDottie.getString(vm.app.listBoxConfig.config, 'detailTemplate');
          vm.isVisibleBackBtn = true;

          if (detailTpl !== detailTplDefault) {
            vm.isShowCustomDetailTemplate = true;
            vm.listBoxConfig.config.itemTemplate = detailTpl;
          } else {
            vm.listBoxData = deviceItem.messageArr;
            vm.listBoxConfig.config.itemTemplate = detailTplDefault;
          }
        },
        getItemCss: function (deviceItem) {
          var cssClass = {
            success: ovResultTableConstant.successCss,
            error: ovResultTableConstant.errorCss,
            warning: ovResultTableConstant.warningCss
          };
          return vm.listBoxConfig.functionList.isLoading(deviceItem) ? ovResultTableConstant.loading : cssClass[ovDottie.getString(deviceItem, 'status').toLowerCase()];
        },
        getItemIcon: function (deviceItem) {
          var cssClass = {
            success: ovResultTableConstant.successIcon,
            error: ovResultTableConstant.errorIcon,
            warning: ovResultTableConstant.warningIcon
          };
          return cssClass[ovDottie.getString(deviceItem, 'status').toLowerCase()];
        },
        isLoading: function (item) {
          return !item.isDone;
        }
      },
      onSelected: angular.noop
    };
    var defaultBuildingStructure = {
      targetGroup: []
    };
    vm.app = {
      rsData: defaultBuildingStructure
    };

    vm.backToMainPage = function () {
      var detailTpl = ovDottie.getString(vm.app.listBoxConfig.config, 'detailTemplate');
      vm.listBoxConfig.config.itemTemplate = itemTplDefault;
      vm.isVisibleBackBtn = false;

      if (detailTpl !== detailTplDefault) {
        vm.isShowCustomDetailTemplate = false;
      }
      else {
        vm.listBoxData = vm.app.rsData.targetGroup;
      }
    };
    /**
     * show result when click on link "show more"
     */
    vm.showMoreShowLess = function () {
      vm.app.isShowContent = !vm.app.isShowContent;
      if (vm.app.config.enableDialog) {
        vm.updateConfirmDialog = dlgDataBuilder.getBuilder()
          .setTitle($i18next('ovResultTable.result'))
          .setIdDlg('rs-dialog')
          .setTitleIconClasses('fa fa-info-circle fa-fw')
          .setShowCancel(false)
          .setTemplateUrl('ov_components/ovResultTable/resultDialog.html')
          .build();

        $ovDlgService.showDialog($scope, vm.updateConfirmDialog);
      }
    };
    function logError(text) {
      $log.error('ovResultTable: ' + text + ' has not been set');
    }

    /**
     * check config valid
     * @param {object} config
     * @returns {Boolean|boolean}
     */
    function isValidConfig(config) {
      var valid = _.every(compulsoryProperties, function (property) {
        if (!config[property]) {
          logError(property);
        }
        return !!config[property];
      });
      //if (ovDottie.getArray($scope, 'rsListItem').length === 0) {
      //  doneTask();
      //  valid = false;
      //}
      return valid;
    }

    /**
     * create cache at first load
     */
    function createCache() {
      if (angular.isDefined(vm.rsConfig.config.displayOkButton)) {
        vm.app.displayOkButton = vm.rsConfig.config.displayOkButton;
      }
      vm.app.functionList = $ovUtility.extendConfig(ovDottie.getObject(vm.rsConfig, 'functionList'), vm.app.functionList);
      vm.app.listBoxConfig = $ovUtility.extendConfig(ovDottie.getObject(vm, 'listBoxConfig'), vm.app.listBoxConfig);
      vm.app.config = $ovUtility.extendConfig(ovDottie.getObject(vm.rsConfig, 'config'), vm.app.config);
      vm.app.functionList.okCommit = function () {
        vm.app.functionList.okCallback();
        ovResultTableService.clearCache(vm.rsConfig.config.appId);
      };
      vm.app.callApi = $q.when();
      if (isValidConfig(vm.rsConfig.config)) {
        _.forEach(vm.rsListItem, function (item, index) {
          var tempRsData = vm.app.rsData;
          tempRsData.targetGroup = tempRsData.targetGroup.concat(vm.rsConfig.config.parseRsListItem(item));
          tempRsData.targetGroup[index].sourceList = tempRsData.targetGroup[index].sourceList || 1;
          tempRsData.targetGroup[index].isDone = false;
          tempRsData.targetGroup[index].messageArr = [];
        });
        if (!!vm.rsConfig.config.request) {
          var request = vm.rsConfig.config.request;
          vm.app.callApi = ovResultTableService.setCallApi(vm.rsConfig.config.appId, request.method.toLowerCase(), request.url, request.requestBody, request.ovOboeBuilderObj);
        } else if (!!vm.rsConfig.config.responsePromise) {
          vm.app.callApi = vm.rsConfig.config.responsePromise();
        }
      } else {
        vm.app.isTaskRunning = false;
      }
      vm.app.isAppRunning = true;
    }

    /**
     * format response
     * @param {object} responseData
     */
    function parseResponse(responseData) {
      var response = responseData.response;
      var parse = ovDottie.getFunction(vm.app.config, 'parseResponse');
      if (parse !== angular.noop) {
        response = parse(response);
      }
      (codeHandler[responseData.response.code] || angular.noop)(response);
    }

    function updateStatus(target, newStatus) {
      //update status of target if it has not status
      if (ovDottie.getString(target, 'status').length === 0) {
        target.status = newStatus;
      } else if (target.status !== newStatus) {
        target.status = ovResultTableConstant.warning;
      }
    }

    /**
     * pass messages to messageArr
     * @param{object} target
     * @param{string} message
     * @param{string} status
     */
    function assignMessage(target, message, status) {
      if (message.length > 0) {
        target.messageArr.push({
          friendlyName: message,
          status: status,
          resultTimestampTranslated: getTimestamp()
        });
      }
    }


    function updateCsvData(data) {
      vm.app.resultTableExportCsv.data.push({
        name: data.name,
        friendlyName: data.friendlyName,
        status: data.status,
        description: data.description,
        resultTimestampTranslated: data.resultTimestampTranslated
      });
    }

    function getTimestamp() {
      var time = {};
      $ovUtility.addTimestamp(time);
      return time.resultTimestampTranslated;
    }

    function assignCSV() {
      vm.app.resultTableExportCsv.data = _.sortBy(vm.app.resultTableExportCsv.data, function (item) {
        return item.friendlyName;
      });
      vm.app.resultTableExportCsv.config.fileName = $i18next('ovResultTable.taskResult', {title: vm.app.config.title});
      vm.app.resultTableExportCsv.enableExportCsv = true;
    }

    function assignResultTextArray() {
      _.forEach(vm.app.resultCounting, function (status, property) {
        if (status.number !== 0) {
          vm.app.resultTextArray.push({
            status: property,
            text: status.number.toString() + ' ' + status.name
          });
        }
      });
    }

    var finalStatusHandler = {};
    finalStatusHandler[ovResultTableConstant.success] = function (target) {
      target.description = $i18next('ovResultTable.theOperationCompleteSuccess');
    };
    finalStatusHandler[ovResultTableConstant.error] = function (target) {
      target.description = $i18next('ovResultTable.theOperationFailed');
    };
    finalStatusHandler[ovResultTableConstant.warning] = function (target) {
      var successErrorGroup = _.groupBy(target.messageArr, function (item) {
        return item.status === ovResultTableConstant.error;
      });
      var countResult = {
        numberOfSuccess: ovDottie.getNumber(successErrorGroup.false, 'length'),
        numberOfError: ovDottie.getNumber(successErrorGroup.true, 'length')
      };
      target.description = $i18next('ovResultTable.theOperationIsPartiallysuccessful') + ' (' +
        $i18next('ovResultTable.operationSuccess', {
          count: countResult.numberOfSuccess
        }) + ' ' +
        $i18next('ovResultTable.operationFailed', {
          count: countResult.numberOfError
        }) + ').';
    };
    vm.mapResultCountingToHeaderText = function (status) {
      if (vm.app.resultCounting[status].number === 0) {
        return '';
      } else {
        return vm.app.resultCounting[status].number.toString() + ' ' + vm.app.resultCounting[status].name;
      }
    };
    vm.getResultCssClass = function (status) {
      var statusHandler = {};
      statusHandler[ovResultTableConstant.success] = 'text-success';
      statusHandler[ovResultTableConstant.error] = 'text-danger';
      statusHandler[ovResultTableConstant.warning] = 'text-warning';
      statusHandler[ovResultTableConstant.other] = 'text-muted';
      return statusHandler[status];
    };
    vm.getPluralizeCount = function () {
      var num = _.countBy(vm.app.resultCounting, function (value) {
        return value.number !== 0;
      });
      return num.true;
    };
    //vm.getTextColorByStatus = function (status) {
    //  var textColor = {};
    //  textColor[ovResultTableConstant.success] = 'text-success';
    //  textColor[ovResultTableConstant.error] = 'text-danger';
    //  textColor[ovResultTableConstant.warning] = 'text-warning';
    //  textColor[ovResultTableConstant.other] = 'text-muted';
    //  return textColor[status]
    //};
    //vm.filterByStatus = function (status) {
    //  vm.app.selectedFilterStatus = status.toLowerCase();
    //  var groupTargetByStatus = _.groupBy(vm.app.rsData.targetGroup, function (item) {
    //    return item.status === vm.app.selectedFilterStatus
    //  });
    //  vm.backToMainPage();
    //  vm.isShowFilterByStatus = true;
    //  vm.filterByStatusText = vm.app.resultCounting[vm.app.selectedFilterStatus].name;
    //  vm.listBoxData = groupTargetByStatus.true;
    //};
    //vm.clearFilterByStatus = function () {
    //  vm.app.selectedFilterStatus='';
    //  vm.listBoxData = vm.app.rsData.targetGroup;
    //};

    /*
     After get code SUB_OPERATION_SUCCESS/SUB_OPERATION_FAILED, this will do
     + set target description
     + assign message to mesageArr
     + set target status
     + update CSV
     */
    function updateTargetSubOperation(info, status) {
      var target = _.find(vm.app.rsData.targetGroup, function (tg) {
        return tg.targetId === info.targetId;
      });
      if (angular.isDefined(target)) {
        var description = ovDottie.getString(info.translated, 'messageObjectTranslated');
        target.description = description;
        assignMessage(target, description, status);
        updateStatus(target, status);
        //update timestamp
        var tempCsvData = {
          name: ovDottie.getString(info, 'operationName'),
          status: status,
          description: description,
          friendlyName: target.friendlyName,
          resultTimestampTranslated: getTimestamp()
        };
        updateCsvData(tempCsvData);
      }
    }

    /*
     After get code OPERATION_TARGET_SUCCESS/OPERATION_TARGET_FAILED, this will do:
     + set target status
     + count number of sub_operation failed/success
     + subtract 1 sourceList. If sourceList === 0, set target done
     + if targetId does not belong to any target, it will be pushed to OTHER
     + update CSV
     */
    function updateTargetOperation(info, status) {
      var target = _.find(vm.app.rsData.targetGroup, function (tg) {
        return tg.targetId === info.targetId;
      });
      var description = ovDottie.getString(info.translated, 'messageObjectTranslated');
      var tempCsvData = {
        name: ovDottie.getString(info, 'operationName'),
        status: status,
        description: description,
        resultTimestampTranslated: getTimestamp()
      };
      if (angular.isDefined(target) && angular.isDefined(target.targetId)) {
        if (status === ovResultTableConstant.error) {
          target.status = status;
        } else {
          updateStatus(target, status);
        }
        (finalStatusHandler[target.status])(target);
        assignMessage(target, description, status);
        target.sourceList--;
        if (target.sourceList === 0) {
          target.isDone = true;
        }

        tempCsvData.friendlyName = target.friendlyName;
      } else {
        if (!vm.app.isExistOther) {
          vm.app.isExistOther = true;
          vm.app.rsData.targetGroup.push({
            friendlyName: $i18next('ovResultTable.other'),
            messageArr: [],
            status: ovResultTableConstant.other,
            isDone: false
          });
        }
        var other = _.last(vm.app.rsData.targetGroup);
        assignMessage(other, description, status);
        tempCsvData.friendlyName = $i18next('ovResultTable.other');
      }
      updateCsvData(tempCsvData);
    }

    /*
     After get code END_REQUEST, this will do:
     + force targets done
     + assign target description
     + count number of target success, failed, warning
     + enable csv button, ok button
     */
    function checkRequestFinished() {
      var listNumber, other;
      if (vm.app.isExistOther) {
        listNumber = vm.app.rsData.targetGroup.length - 1;
        other = _.last(vm.app.rsData.targetGroup);
        other.isDone = true;
        vm.app.resultCounting.other.number++;
      } else {
        listNumber = vm.app.rsData.targetGroup.length;
      }
      for (var i = 0; i < listNumber; i++) {
        var tempRsData = vm.app.rsData;
        if (tempRsData.targetGroup[i].sourceList !== 0) {
          tempRsData.targetGroup[i].status = ovResultTableConstant.error;
          assignMessage(tempRsData.targetGroup[i], $i18next('ovResultTable.targetInterupted'), ovResultTableConstant.error);
          tempRsData.targetGroup[i].description = $i18next('ovResultTable.theOperationFailed');
        }
        tempRsData.targetGroup[i].isDone = true;
        /***update header***/
        switch (tempRsData.targetGroup[i].status) {
          case ovResultTableConstant.success:
            vm.app.resultCounting.success.number++;
            break;
          case ovResultTableConstant.error:
            vm.app.resultCounting.error.number++;
            break;
          case ovResultTableConstant.warning:
            vm.app.resultCounting.warning.number++;
            break;
        }
      }

      vm.app.isTaskRunning = false;
      assignCSV();
      assignResultTextArray();

    }

    codeHandler[ovResultTableConstant.operationTargetSuccess] = function (notifyData) {
      updateTargetOperation(notifyData, ovResultTableConstant.success);
    };
    codeHandler[ovResultTableConstant.operationTargetFailed] = function (notifyData) {
      updateTargetOperation(notifyData, ovResultTableConstant.error);
    };
    codeHandler[ovResultTableConstant.subOperationSuccess] = function (notifyData) {
      updateTargetSubOperation(notifyData, ovResultTableConstant.success);
    };
    codeHandler[ovResultTableConstant.subOperationFailed] = function (notifyData) {
      updateTargetSubOperation(notifyData, ovResultTableConstant.error);
    };
    codeHandler[ovResultTableConstant.endRequest] = function (notifyData) {
      checkRequestFinished(notifyData);
    };


    $scope.rsConfig = $scope.rsConfig || {};
    $scope.listBoxConfig = $scope.listBoxConfig || {};
    vm.rsListItem = $scope.rsListItem || [];
    vm.rsConfig = $ovUtility.extendConfig($scope.rsConfig, defaultRsConfig);
    vm.listBoxConfig = $ovUtility.extendConfig(angular.copy($scope.listBoxConfig), defaultlistBoxConfig);
    vm.app = ovResultTableService.getAppData(vm.rsConfig.config.appId);
    vm.ovAlert = vm.app.ovAlert;

    if (!vm.app.isAppRunning) {
      //first time loading
      vm.app.isTaskRunning = true;
      createCache();
      vm.app.callApi.then(angular.noop,
        function (errorData) {
          onError(errorData);
        },
        function (notifyData) {
          parseResponse(notifyData, vm.rsConfig.config);
        }
      );
    } else {
      var title = ovDottie.getString(vm.rsConfig.config, 'title');
      if (title.length !== 0) {
        vm.app.config.title = title;
      }
    }

    vm.listBoxData = vm.app.rsData.targetGroup;

  }

  ovResultTableDirective.$inject = [];
  ovResultTableCtrl.$inject = ['$scope', '$ovUtility', 'ovResultTableService', 'ovResultTableConstant', '$q', 'dlgDataBuilder', '$ovDlgService', '$log', 'ovDottie', '$i18next'];
})();
