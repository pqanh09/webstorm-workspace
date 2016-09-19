/**
 \$Id:
 (c) Copyright ALE USA Inc., ${YEAR}
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

/**
 * @ngdoc directive
 * @name ov-component.directive:ovDataView
 * @requires ov-component.service:$ovDataViewService
 * @restrict A
 * @description
 * Show data with table/list view mode
 * @param {string} viewMode component view mode (table/list)
 * @param {object} ovDataView component config
 * - **id** (optional) string: component id
 * - **primaryKey** (require) string: unique id for each item in data
 * - **attrs** (require) object: column object ex: By default only need key and i18nKey for display if you want to override then need to pass sortBy, searchBy,....
 * <pre>
 *   {
 *      column1: {
 *        key: 'key1',
 *        i18nKey: 'i18nKey1',
 *        sortBy: 'keySortBy',
 *        searchBy: 'keySearchBy',
 *        filterBy: 'keyFilterBy',
 *        csvBy: 'keyCsvBy',
 *        printBy: 'keyPrintBy',
 *        formatter: function (cell, row, value) {
 *          //html string for tabular view
 *          return <h1>value</h1>
 *        }
 *      }
 *   }
 * </pre>
 * - **multiSelect** (optional) boolean: multiple select or single select
 * - **tableConfig** (optional) object: configurations of tabular view
 * <pre>
 *   tableSortConfig: [ //default table sort columns
 *      {
 *        columnId: 'key1', //same as column1.key above
 *        sortAsc: true //sort ordering
 *      }
 *   ],
 *   heightOptions: {
 *      minRow: 5, //component's min height is 5 rows
 *      //And max-row depends on window height
 *   }
 * </pre>
 * - **listConfig**: (optional) object: configurations for list view
 * <pre>
 *   {
 *      config: {} //Ref to ovNgListBox for details
 *   }
 * </pre>
 * @param {array} viewData data
 * @param {array} selectedList selected list
 * @param {string} ovDataViewDetailTpl detail template url
 * @example
 * <pre>
 *   <!-- IN HTML -->
 *   <div ov-data-view
 *        view-mode="vm.viewMode"
 *        view-data="vm.viewData"
 *        selected-list="vm.selectedList'
 *        ov-data-view="vm.viewConfig"
 *        ov-data-view-detail-tpl="vm.detailTpl">
 *   </div>
 * </pre>
 *
 * <pre>
 *   <!--DetailTemplate1.html-->
 *   <label class="control-label col-md-5">{{:: 'i18nKey1' | i18next}}</label>
 *   <div class="col-md-7 form-control-static">
 *        {{selectedList[0].key1}}
 *   </div>
 * </pre>
 *
 * <pre>
 *   //IN JS
 *   var attrs = {
 *      column1: {
 *          key: 'key1',
 *          i18nKey: 'i18nKey1'
 *      },
 *      column2: {
 *           key: 'key2',
 *           i18nKey: 'i18nKey2'
 *      }
 *   };
 *
 *   vm.viewMode='table';
 *   vm.viewData = [{id: 'id1', key1: 'value1', key2: 'value2'}];
 *   vm.selectedList = [];
 *   vm.detailTpl = 'detailTemplate1.html';
 *   vm.viewConfig  = {
 *      id: 'ov-data-view-app1'
 *      primaryKey: 'id'
 *      attrs: attrs
 *   };
 * </pre>
 */

(function () {
  'use strict';
  /**
   * Dependency
   *  modules:
   *    ngnms.ui.fwk.utility,
   *    jm.i18next,
   *    ngnms.ui.fwk.ovValidator.services, ngnms.ui.fwk.ovValidator.directive,
   *    ngnms.ui.fwk.ovFilterConditions.directive
   *    ngnms.ui.fwk.services.ovDataViewService
   *    slickMenuModule
   *    ngnms.ui.fwk.services.ovDottie,
   *  service: $ovUtility, $i18next, ovValidatorServices, $ovDataViewService, AllOvDataViewIds, ovSlickMenuBuilder, ovDottie
   *  files: ovUtility.js, ng-18next.js, ovValidatorServices.js, ovDataViewService.js, ovDataViewConstants.js, ovSlickMenu.js, ovDottieSrv.js
   */

  angular.module('ngnms.ui.fwk.ovDataView.directive', ['ngnms.ui.fwk.ovValidator.directive'])
    .directive('ovDataView', ['$ovUtility', '$i18next', '$http', '$compile', 'ovValidatorServices', '$templateCache', '$ovDataViewService', 'AllOvDataViewIds', '$timeout', '$log', '$q', 'ovSlickMenuBuilder', '$filter', 'ovDottie', '$rootScope',
      function ($ovUtility, $i18next, $http, $compile, ovValidatorServices, $templateCache, $ovDataViewService, AllOvDataViewIds, $timeout, $log, $q, ovSlickMenuBuilder, $filter, ovDottie, $rootScope) {
        return {
          restrict: 'A',
          scope: {
            ovDataView: '=',
            viewMode: '=?',
            viewData: '=?',
            reportOptions: '=?',
            selectedList: '=?',
            onSelectedFunction: '=?',
            disabledItemFunction: '=?',
            onChangedViewModeCallback: '=?',
            ovDataViewDetailTpl: '=?',
            ovDataViewTpl: '=?',
            functionList: '=?'
          },
          link: function (scope, element, attrs) {
            var ovUserPrefSrv = {};

            if (!scope.ovDataView) {
              $log.error('ovDataView - Missing config can leads to wrong render');
              return;
            }

            var setReportData, tableMode = AllOvDataViewIds.environmentVal.TABLE_VIEW, listMode = AllOvDataViewIds.environmentVal.LIST_VIEW;
            var reportCacheObj = ovDottie.get(scope, 'reportOptions.reportCacheObj');

            if (reportCacheObj && reportCacheObj.ovDataView) {
              scope.$$initOvDataView = true;
              setReportData = function (viewData) {
                scope.viewData = viewData;
              };

              /**
               * Override ovDataView config by reportCacheObj.ovDataView
               * This merge need to call first because of the caching workflow
               * Note: Don't use scope.ovDataView = $ovUtility.extendConfig(scope.reportCacheObj.ovDataView, scope.ovDataView); => Loss config's reference
               * Because it needs to take time to binding to controller
               * Reproduce step:
               *  Step1: change columns' size of ovDataView
               *  Step2: add to report and test columns' size on report page
               */
              $ovUtility.extendConfig(reportCacheObj.ovDataView, scope.ovDataView);
              angular.extend(scope.ovDataView, reportCacheObj.ovDataView);

              if (reportCacheObj.viewMode === tableMode) {
                scope.$watch('viewData.length', function () {
                  /**
                   * DOQ: PR-216019: [4200] The icon in report of Third-Party Devices Support page should be removed  and should be blank like csv file
                   * From Before this code in setReportData fnction but existing an issue
                   * Description: When I parse data in setReportData function and user set data directly from controller again so that I lost parsed data
                   * => Move exportGridData to this function
                   * Reproduce step:
                   * Step 1: Go to Network -> Discovery -> Third party profile -> Create a profile -> Add to report
                   * Step 2: Go to report page and see icon shown as base64 encode
                   */
                  scope.viewData = ovDottie.getFunction(scope, 'ovDataView.tableConfig.exportGridData')({
                    getLength: function () {
                      return scope.viewData && scope.viewData.length;
                    },
                    getItem: function (index) {
                      return scope.viewData && scope.viewData[index];
                    }
                  });

                  restoreOvDataViewConfigFromCache();
                  updateGridData(true);
                });
              }

              /**
               * DOQ: PR-215156: [4200] The report of some page have no data
               * Impact analysis: Discovery -> Link
               */
              scope.actions = {
                setData: setReportData,
                setSelectedFromCache: setReportData,
                resetOvDataViewConfig: setReportData
              };

              //scope.actions.destroy = ovComponentRegistry.register(scope.actions, scope.ovDataView.id);

              /**
               * DOQ: Fix onGridInit is called before assignFunctionToConfig
               * Description: using $timeout to call this function
               * Reproduce steps:
               * Step 1: Go to Unified Access -> Unified Profile -> Access Polices -> Location
               * Step 2: Create some data and press "Add to report" button
               * Step 3: Go to report page and check existing exception setSelectedFromCache is not a function
               */
              $timeout(function () {
                (scope.ovDataView.tableConfig.onGridInitCallback || angular.noop)();
              });
            }

            scope.commonId = (scope.ovDataView.id ? scope.ovDataView.id : AllOvDataViewIds.environmentVal.OV_DATA_VIEW_DEFAULT_ID) + '-ov-data-view';

            var ovDataViewBodyElm, ovDataViewDetailElm, ovDataViewCacheId,
              ovDataViewBodyClass = 'showOvDataViewList pull-left ovNgListBox-responsive-wrapper',
              ovDataViewDetailClass = 'showOvDataViewDetail pull-right',
              defaultColumns = [{id: '', key: '', title: '', field: '', name: ''}];

            var ovDataViewSorter = function (fieldName, value1, value2, sign, colDef, dataCtx1, dataCtx2) {
                var sorter = scope.ovDataView.fastSort ? $ovDataViewService.naturalSort : $ovUtility.naturalSort;
                if (colDef && colDef.sortBy) {
                  value1 = dataCtx1[colDef.sortBy];
                  value2 = dataCtx2[colDef.sortBy];
                }
                return sorter(value1, value2) * sign;
              },
              resetFilter = function () {
                console.log('Not support in training mode');
              },
              exportCSV = function () {
                console.log('Not support in training mode');
              },
              print = function () {
                console.log('Not support in training mode');
              },
              doFilter = function () {
                console.log('Not support in training mode');
              },
              addToReport = function (reportOptions) {
                console.log('Not support in training mode');
              };

            var ttContent,
              preventEvent = {
                onSelectedRowsChanged: false
              },
              flag = {
                columnsReordered: 0,
                filterListChanged: 0,
                columnsResized: 0,
                onSortChanged: 0
              },
              slickMenuObj = {
                dataTableMode: {
                  search: {
                    id: scope.commonId + '-search',
                    onClick: function () {
                      scope.ovDataView.tableConfig.showSearchGroup = !scope.ovDataView.tableConfig.showSearchGroup;
                    },
                    titleI18key: 'button-label.search',
                    iconClass: 'fa fa-search fa-fw',
                    disabled: false,
                    groupId: scope.commonId + 'FilterMode',
                    disableGroupActive: true,
                    checkGroupActive: function () {
                      return scope.ovDataView.tableConfig.showSearchGroup;
                    }
                  },
                  filter: {
                    id: scope.commonId + '-filter',
                    onClick: function () {
                      (scope.ovDataView.doFilter || doFilter)();
                    },
                    titleI18key: 'button-label.filter',
                    iconClass: 'fa fa-filter fa-fw',
                    disabled: false,
                    groupId: scope.commonId + 'FilterMode',
                    disableGroupActive: true,
                    checkGroupActive: function () {
                      return ovDottie.getNumber(scope, 'ovDataView.tableConfig.filterSelected.length');
                    }
                  },
                  resetFilter: {
                    id: scope.commonId + '-resetFilter',
                    onClick: function () {
                      (scope.ovDataView.resetFilter || resetFilter)();
                    },
                    titleI18key: 'button-label.resetFilter',
                    iconClass: 'fa fa-refresh fa-fw',
                    iconClassShowMode: 'smallScreen',
                    name: $i18next('button-label.reset'),
                    groupId: scope.commonId + 'FilterMode',
                    disableGroupActive: true,
                    checkDisabled: function () {
                      return !ovDottie.getNumber(scope, 'ovDataView.tableConfig.filterSelected.length');
                    }
                  },
                  exportCSV: {
                    id: scope.commonId + '-exportCSV',
                    onClick: function () {
                      (scope.ovDataView.exportCSV || exportCSV)();
                    },
                    titleI18key: 'button-label.csv',
                    iconClass: 'fa fa-download fa-fw',
                    name: $i18next('button-label.csv'),
                    disabled: false
                  },
                  addToReport: {
                    id: scope.commonId + '-addToReport',
                    onClick: function () {
                      scope.ovDataView.addToReport();
                    },
                    isHidden: function () {
                      return !ovDottie.get(scope.ovDataView, 'reportOptions.controller');
                    },
                    titleI18key: 'report.reportConfig.button.addToReport',
                    name: $i18next('report.reportConfig.button.addToReport')
                  },
                  print: {
                    id: scope.commonId + '-print',
                    onClick: function () {
                      (scope.ovDataView.print || print)();
                    },
                    titleI18key: 'button-label.print',
                    name: $i18next('button-label.print'),
                    iconClass: 'fa fa-print fa-fw',
                    disabled: false
                  }
                },
                dataListMode: {}
              },
              viewDefaultConfig = {
                id: AllOvDataViewIds.environmentVal.OV_DATA_VIEW_DEFAULT_ID,
                enableCache: true,
                enableSync: true,
                multiSelect: true,
                enableTableConfig: true,
                headerTemplate: 'ov_components/ovDataView/templates/ovDataViewDefaultHeader.html',
                viewHeadingTpl: 'ov_components/ovDataView/templates/ovDataViewDefaultHeading.html',
                iconToolbarTpl: 'ov_components/ovDataView/templates/ovDataViewDefaultIconToolbar.html',
                fastSort: false, //evaluating
                showDetailCondition: function (selectedList) {
                  return selectedList && selectedList.length === 1;
                },
                reportOptions: {
                  title: ovDottie.getString(scope.ovDataView, 'reportOptions.title', ovDottie.getString(scope.ovDataView, 'title')),
                  id: 'ov-report-builder',
                  params: {
                    ovDataView: attrs.ovDataView,
                    tableTpl: 'ov_components/ovDataView/templates/ovDataView.table.report.html',
                    listTpl: 'ov_components/ovDataView/templates/ovDataView.list.report.html',
                    viewData: attrs.viewData,
                    functionList: attrs.functionList
                  }
                },
                cacheOptions: {
                  filterList: true,
                  gridColumns: true,
                  selectFieldList: true,
                  viewMode: true
                },
                ovDataViewSorter: ovDataViewSorter,
                tableConfig: {
                  onGridInitCallback: function (/*event, gridElm, grid, dataView*/) {
                  },
                  onFilterListChanged: function () {
                  },
                  onRowsChanged: function () {
                  },
                  clearSearch: function () {
                    var tableConfig = this;
                    tableConfig.searchString = '';
                  },
                  hideSearch: function () {
                    var tableConfig = this;
                    tableConfig.searchString = '';
                    tableConfig.showSearchGroup = false;
                  },
                  heightOptions: { //new options
                    maxRow: 10,
                    minRow: 5
                  },
                  searchString: '',
                  showSearchGroup: true,
                  gridOptions: {
                    enableCellNavigation: true,
                    enableColumnReorder: true,
                    multiColumnSort: true,
                    autoEdit: false,
                    syncColumnCellResize: true,
                    multiSelect: true,
                    forceFitColumns: true,
                    autoFitColumns: true, //For evaluating
                    autoFitRows: true, //new options
                    rowHeight: 38
                  },
                  //tableSortConfig: [], //{columnId: 'same as field of gridColumns', sortAsc: true/false}
                  defaultPageInfo: {pageSize: 0},
                  hideColumns: [],
                  selectionModel: 'checkbox',
                  //gridViewId: AllOvDataViewIds.environmentVal.OV_DATA_VIEW_PRIMARY_KEY,
                  exportGridData: function (dataView) {
                    var showData = [];
                    for (var i = 0; i < dataView.getLength(); i++) {
                      showData[i] = angular.copy(dataView.getItem(i));
                    }
                    return showData;
                  },
                  getCSVConfig: function () {
                    /**
                     * DOQ: Fix the problem in locator - locate
                     * Cannot find attribute  csvBy  in Object....
                     * Because list of columns is getting from another api so need to set default field in here
                     * Reproduce step:
                     * Step1: go to locator - locate
                     * Step2: click csv button
                     */
                    angular.forEach(scope.ovDataView.tableConfig.gridColumns, function (item) {
                      item.csvBy = item.csvBy || item.field;
                    });

                    return {};
                  },
                  printTemplateUrl: 'ov_components/ovDataView/templates/print.html',
                  pagerData: {
                    show: $i18next('ovDataView.slickGrid.show'),
                    showingAll: $i18next('ovDataView.slickGrid.showingAll'),
                    rows: $i18next('ovDataView.slickGrid.rows'),
                    showingPage: $i18next('ovDataView.slickGrid.showingPage'),
                    of: $i18next('ovDataView.slickGrid.of'),
                    all: $i18next('ovDataView.slickGrid.all'),
                    auto: $i18next('ovDataView.slickGrid.auto')
                  },
                  pagerConstructor: Slick.Controls.Pager,
                  filterTitle: 'ovDataView.filterTitle',
                  filterList: [],
                  filterSelected: [],
                  filterData: [],
                  filterFinishCallBack: function () {
                  },
                  filterCancelCallBack: function () {
                  },
                  filterResetCallBack: function () {
                  }
                },
                listConfig: {
                  refreshCallBack: function () {
                  },
                  selectedCallBack: function (/*indices*/) {
                  },
                  onRowsChanged: function (/*listView*/) {
                  },
                  config: {
                    id: AllOvDataViewIds.environmentVal.OV_DATA_VIEW_DEFAULT_ID,
                    searchString: '',
                    itemTemplate: 'ov_components/ovDataView/templates/ovListBoxDefaultContent.html',
                    headerTemplate: 'ov_components/ovDataView/templates/ovListBoxDefaultHeader.html',
                    showHeader: true,
                    showFilter: true,
                    filter: false,
                    showFooter: true,
                    maxHeight: 530,
                    limitRow: 25,
                    sortBy: '',
                    sortType: AllOvDataViewIds.environmentVal.SORT_ASC,
                    currentPage: 1,
                    reportOptions: {
                      title: ovDottie.getString(scope.ovDataView, 'reportOptions.title', ovDottie.getString(scope.ovDataView, 'title')),
                      params: {
                        templateUrl: ovDottie.getString(scope.ovDataView, 'reportOptions.listViewMode') === 'table' ?
                          'ov_components/ovNgListBox/reportTpl/ovNgListBox.table.report.html' :
                          'ov_components/ovNgListBox/reportTpl/ovNgListBox.list.report.html'
                      }
                    },
                    hideFieldList: [],
                    mapFunction: [
                      {
                        'from': 'getContent',
                        'to': $ovUtility.ovListBoxGetContent
                      },
                      {
                        'from': 'getTitle',
                        'to': $ovUtility.ovListBoxGetTitle
                      }
                    ]
                  }
                },
                selectShowColumnConfig: {
                  title: 'ovSelectShow.selectColumn',
                  itemHeight: 35,
                  itemTemplateUrl: 'ov_components/ovSelectShow/templates/defaultItem2.html',
                  searchBy: 'name'
                },
                selectShowFieldConfig: {
                  title: 'ovSelectShow.selectField',
                  itemHeight: 35,
                  itemTemplateUrl: 'ov_components/ovSelectShow/templates/defaultItem1.html',
                  searchBy: 'title'
                },
                showOvSelectBtn: function () {
                  var self = this;
                  return $ovDataViewService.showOvSelectBtn(self.tableConfig.gridColumns, self.tableConfig.hideColumns) ||
                    $ovDataViewService.showOvSelectBtn(self.listConfig.config.selectFieldList, self.listConfig.config.hideFieldList);
                },
                onHandleGetTableConfigFinished: function () {
                },
                mappingDataItem: function (/*data, col*/) {
                }
              },
              observerConfigData = function () {
                scope.$watchCollection(function () {
                  return {
                    //when change press change field of table
                    gridColumns: scope.ovDataView.tableConfig.gridColumns,
                    //when change press change field of list
                    selectFieldList: scope.ovDataView.listConfig.config.selectFieldList,
                    //when change press change sortBy
                    sortBy: ovDottie.get(scope.ovDataView, 'listConfig.config.selectFieldList.0.key'),
                    //When column reorder
                    columnsReordered: flag.columnsReordered,
                    //When filter changed
                    filterListChanged: flag.filterListChanged,
                    //When column is resized
                    columnsResized: flag.columnsResized,
                    //when viewMode changed
                    viewMode: scope.viewMode
                  };
                }, function (newVal, oldVal) {
                  if (newVal && newVal !== oldVal) {
                    var isDataChanged = false;

                    if (newVal.filterListChanged !== oldVal.filterListChanged && scope.ovDataView.cacheOptions.filterList) {
                      isDataChanged = true;
                    }

                    if (newVal.gridColumns !== oldVal.gridColumns) {
                      if (scope.ovDataView.cacheOptions.gridColumns) {
                        isDataChanged = true;
                      }
                      updateGridData();
                    }

                    if (newVal.columnsReordered !== oldVal.columnsReordered && scope.ovDataView.cacheOptions.gridColumns) {
                      isDataChanged = true;
                    }

                    if (newVal.selectFieldList !== oldVal.selectFieldList && scope.ovDataView.cacheOptions.selectFieldList) {
                      isDataChanged = true;
                    }

                    if (newVal.sortBy !== oldVal.sortBy && scope.viewMode === listMode) {
                      isDataChanged = true;
                    }

                    if (newVal.columnsResized !== oldVal.columnsResized && scope.ovDataView.cacheOptions.gridColumns) {
                      isDataChanged = true;
                    }

                    if (newVal.viewMode !== oldVal.viewMode && scope.ovDataView.cacheOptions.viewMode) {
                      isDataChanged = true;
                    }

                    if (isDataChanged) {
                      scope.ovDataView.saveTableConfig();
                    }
                  }
                });
              },
              getGridViewPagingInfo = function (dataView) {
                var result = scope.ovDataView.tableConfig.defaultPageInfo;
                if (dataView && angular.isFunction(dataView.getPagingInfo)) {
                  result = dataView.getPagingInfo();
                  if (!result.pageSize) {
                    delete result.pageNum;
                  }
                }
                return result;
              },
              getSortColumns = function (grid) {
                return grid ? grid.getSortColumns() : [];
              },
              setShowDetail = function (lstSelected) {
                if (typeof (scope.onSelectedFunction) === 'function') {
                  //Need time to bind selected list to controller
                  $timeout(function () {
                    scope.onSelectedFunction(lstSelected);
                  });
                }

                if (scope.ovDataView.showDetailCondition(lstSelected)) {
                  scope.showDetail();
                } else {
                  scope.hideDetail();
                }
              },
              restoreOvDataViewConfigFromCache = function () {
                scope.ovDataView.tableConfig.filterSelected = ovDataViewCacheData.ovDataView.tableConfig.filterSelected;
                scope.ovDataView.tableConfig.searchString = ovDataViewCacheData.ovDataView.tableConfig.searchString;
                scope.ovDataView.tableConfig.showSearchGroup = ovDataViewCacheData.ovDataView.tableConfig.showSearchGroup;

                scope.ovDataView.listConfig.config.sortType = ovDataViewCacheData.ovDataView.listConfig.config.sortType;
                scope.ovDataView.listConfig.config.sortBy = ovDataViewCacheData.ovDataView.listConfig.config.sortBy;
                scope.ovDataView.listConfig.config.searchString = ovDataViewCacheData.ovDataView.listConfig.config.searchString;
                scope.ovDataView.listConfig.config.showSortGroup = ovDataViewCacheData.ovDataView.listConfig.config.showSortGroup;
                scope.ovDataView.listConfig.config.showSearchGroup = ovDataViewCacheData.ovDataView.listConfig.config.showSearchGroup;
              },
              sortOvDataViewData = function (viewData, tableSortConfig) {
                if (tableSortConfig && tableSortConfig.length) {
                  viewData.sort(function (a, b) {
                    var result = 0, sortCol, field, value1, value2, sign, colIdx, colDef;
                    for (var i = 0; i < tableSortConfig.length; i++) {
                      sortCol = tableSortConfig[i];
                      sign = sortCol.sortAsc ? 1 : -1;
                      if (scope.grid) {
                        colIdx = scope.grid.getColumnIndex(sortCol.columnId);
                        colDef = scope.grid.getColumns()[colIdx];
                      } else {
                        colDef = $ovUtility.findValueByKey(sortCol.columnId, scope.ovDataView.tableConfig.gridColumns, 'id');
                      }
                      field = colDef && colDef.field;
                      value1 = a[field];
                      value2 = b[field];
                      result = scope.ovDataView.tableConfig.dataViewSorter(field, value1, value2, sign, colDef, a, b);
                      if (result !== 0) {
                        return result;
                      }
                    }

                    return result;
                  });
                }
              },
              setData = function (data, selectedList) {
                data = data || [];
                selectedList = selectedList || [];

                if (!data.length) {
                  $log.debug('ovDataView - call setData with data is empty may leads to lost selected items', scope.ovDataView.id);
                }

                if (!selectedList.length) {
                  $log.debug('ovDataView - call setData with selectedList is empty may leads to lost selected items', scope.ovDataView.id);
                }

                //require assign id before compare selected item vs data
                data = scope.ovDataView.mappingDataGrid(data);

                var selectedItemIds = [], selectedIndexes;

                var isItemFound = false;

                angular.forEach(data, function (item) {
                  item.checked = false;

                  if (scope.disabledItemFunction(item)) {
                    item.disabled = true;
                  }
                });

                for (var i = 0; i < selectedList.length;) {
                  isItemFound = false;

                  for (var j = 0; j < data.length; j++) {
                    if (scope.ovDataView.isTwoObjectEquals(selectedList[i], data[j], scope.ovDataView.tableConfig.gridViewId)) {
                      if (!data[j].disabled && !scope.disabledItemFunction(data[j])) {
                        data[j].checked = true;
                        selectedList[i] = data[j];
                        //index of listBox different from index of table so use id
                        selectedItemIds.push(data[j][scope.ovDataView.tableConfig.gridViewId]);
                        isItemFound = true;
                      }
                      break;
                    }
                  }

                  if (!isItemFound) {
                    selectedList.splice(i, 1);
                  } else {
                    i++;
                  }
                }

                scope.viewData = data;

                if (scope.grid && scope.dataGridView) {
                  /**
                   * DOQ: Fix issue if using $timeout to call setSelectedFromCache missing selectedList
                   * RCA: viewMode is still loading
                   * Reproduce step (ovSummaryView):
                   *  Step 1: in tabular mode, select a line
                   *  Step 2: go to another app then go to back
                   */
                  if (ovUserPrefSrv.tableListViewMode === tableMode || scope.viewMode === tableMode) {
                    //setSelectedRows only work when slickGrid have data (updateGridData)
                    updateGridData(true);

                    /**
                     * DOQ: Fix issue can not click a row to show detail
                     * Step1: Change defaultPageInfo.pageSize = 10
                     * Step2: Select a row to show detail
                     * Step3: Click this row again but don't see detail
                     */
                    if (selectedItemIds.length) {
                      var pageInfo = {};
                      pageInfo.oldVal = getGridViewPagingInfo(scope.dataGridView);
                      pageInfo.newVal = {pageSize: 0};

                      scope.dataGridView.setPagingOptions(pageInfo.newVal);
                      selectedIndexes = scope.dataGridView.mapIdsToRows(selectedItemIds);

                      /**
                       * DOQ: Prevent from calling onSelectedFunction when filling data
                       * Reproduce step:
                       * Step1: Go to unified Profile -> Access Auth Profile -> Click + (Create)
                       * Step2: Go to another page then go to back
                       * Step3: Check status of OK / Cancel button
                       */
                      preventEvent.onSelectedRowsChanged = true;
                      scope.grid.setSelectedRows(selectedIndexes);

                      //restore current pageInfo
                      scope.dataGridView.setPagingOptions(pageInfo.oldVal);
                    } else {
                      preventEvent.onSelectedRowsChanged = true;
                      scope.grid.setSelectedRows([]);
                    }
                  }
                }

                scope.selectedList = selectedList;

                if (scope.viewMode === listMode) {
                  (scope.ovDataView.listConfig.config.updateListFn || angular.noop)(scope.viewData);
                }

                return scope.selectedList;
              },
              setSelectedFromCache = function (data, selectedList) {
                restoreOvDataViewConfigFromCache();

                ovDataViewCacheData = ovDataViewCacheData || {};

                scope.ovDataView.isShowDetail = ovDataViewCacheData.isShowDetail || false;

                /**
                 * Set sort before calling setData
                 */
                ovDottie.getFunction(scope.grid, 'setSortColumns')(ovDataViewCacheData.tableSortConfig || []);

                setData(data, selectedList || ovDataViewCacheData.selectedList);

                /**
                 * DOQ: Support in case of user call this function with selectedList data then show detail
                 * Description: Click admin link at top page then go to RBAC
                 */
                if (selectedList && selectedList.length) {
                  setShowDetail(scope.selectedList);
                }

                /**
                 * Set current page depends on existing data
                 */
                ovDottie.getFunction(scope.dataGridView, 'setPagingOptions')(ovDataViewCacheData.pageInfo);

                scope.ovDataView.listConfig.config.currentPage = ovDataViewCacheData.ovDataView.listConfig.config.currentPage;

                return scope.selectedList;
              },
              resetOvDataViewConfig = function (data) {
                //Fix call reset then setSelectedFromCache leads to set selectedList again
                $ovDataViewService.clearCache(ovDataViewCacheId);

                ovDataViewCacheData = ovDataViewCacheData || {};

                //DOQ: PR-208697: Refresh button in the application should retain the sort preference
                //ovDottie.getFunction(scope.grid, 'setSortColumns')(ovDataViewCacheData.tableSortConfig || []);

                //Show search in table view
                scope.ovDataView.tableConfig.showSearchGroup = true;

                //Current page in table/list view
                scope.ovDataView.listConfig.config.currentPage = 1;
                ovDottie.getFunction(scope.dataGridView, 'setPagingOptions')(scope.ovDataView.tableConfig.defaultPageInfo);

                //Search/filter in table/list view
                scope.ovDataView.tableConfig.filterSelected = [];
                scope.ovDataView.tableConfig.searchString = '';
                scope.ovDataView.listConfig.config.searchString = '';

                //No need to call updateGridData and refreshOvDataView because call setData
                setData(data || scope.viewData, []);
              },
              checkOvDataViewConfig = function () {
                if (scope.ovDataView.$$destroyedOvDataView && scope.ovDataView.slickMenu) {
                  $log.debug('ovDataView - If you want to override slickMenu you must not cache config and override in onGridInitCallBack function');
                }

                if (!scope.ovDataView.primaryKey && !scope.ovDataView.isTwoObjectEquals) {
                  $log.debug('ovDataView - Missing primaryKey and isTwoObjectEquals can leads to wrong caching selected items - You need implement at least one of them', scope.ovDataView.id);
                }

                if (!scope.ovDataView.id) {
                  $log.debug('ovDataView - Missing id can leads to unable cache all data', scope.ovDataView.id);
                } else if (angular.toJson(AllOvDataViewIds.features).indexOf(scope.ovDataView.id) === -1) {
                  //$log.error('If you are using ovDataView, Please register your id in ovDataViewConstants.js');
                }

                if (angular.isFunction(scope.onSelectedFunction)) {
                  $log.debug('ovDataView - use onSelectedFunction for show detail when you DO NOT WANT TO USE DETAIL OF OvDataView. If you want to get selected rows you can watch reference of selectedList.');
                }

                if (!ovDottie.get(scope.ovDataView, 'tableConfig.csvFileName')) {
                  $log.error('ovDataView - PR-210454: Provide detail name of csv file for all applications support export to csv: viewConfig.tableConfig.csvFileName is required', scope.ovDataView.id);
                }
              },
              getOvDataViewCacheObj = function () {
                return {
                  ovDataView: angular.copy(scope.ovDataView),
                  selectedList: scope.selectedList ? scope.selectedList.map(function (d) {
                    var item = {};
                    item[scope.ovDataView.tableConfig.gridViewId] = d[scope.ovDataView.tableConfig.gridViewId];
                    return item;
                  }) : [],
                  pageInfo: getGridViewPagingInfo(scope.dataGridView),
                  isShowDetail: scope.ovDataView.isShowDetail,
                  tableSortConfig: getSortColumns(scope.grid)
                };
              },
              initDataView = function () {
                checkOvDataViewConfig();
                $ovUtility.extendConfig(scope.ovDataView, viewDefaultConfig);
                ovDataViewCacheId = $rootScope.isNotClientInMaster ? scope.ovDataView.id + '-opex-master' : scope.ovDataView.id;

                var fields = scope.ovDataView.attrs && $ovDataViewService.getColumnList(scope.ovDataView.attrs) || defaultColumns;
                scope.ovDataView.tableConfig.gridColumns = scope.ovDataView.tableConfig.gridColumns || angular.copy(fields);
                scope.ovDataView.tableConfig.filterColumn = scope.ovDataView.tableConfig.filterColumn || angular.copy(fields);
                scope.ovDataView.listConfig.config.selectFieldList = scope.ovDataView.listConfig.config.selectFieldList || angular.copy(fields);

                if (scope.viewData === undefined) {
                  scope.viewData = [];
                }

                /**
                 * DOQ: PR-92933: Fix digest repeat issue
                 * Description: Using $timeout to help removing the nested digest problem.
                 * Reproduce step
                 *  Step 1: Go to Network -> Locator (Same as AGv1, VLAN -> Create -> Step 1)
                 *  Step 2: Go to another app
                 *  Step 3: Go to back Locator app
                 */
                $timeout(function () {
                  scope.headerTemplate = scope.ovDataView.headerTemplate;
                });

                /**
                 * DOQ: Prevent from flicker when changing view mode
                 * Reproduce step:
                 *  Step1: go to preferences -> user settings -> table/list view mode -> change view mode
                 *  Step2: go to back the app then see the flicker from list to table or vice versa.
                 */
                if (scope.ovDataView.cacheOptions.viewMode) {
                  scope.viewMode = null;
                }

                $http({
                  method: 'GET',
                  url: scope.ovDataViewTpl || 'ov_components/ovDataView/templates/ovDataView.html',
                  cache: $templateCache
                }).success(function (result) {
                  element.html(result);
                  element.find('.data-slick-view').attr('id', scope.ovDataView.id);

                  ovDataViewBodyElm = element.find('.ov-data-view-body');
                  ovDataViewDetailElm = element.find('.ov-data-view-detail');

                  scope.viewScope = scope.$new();
                  ttContent = $compile(element.contents())(scope.viewScope);
                  scope.viewScope.$on('$destroy', function () {
                    if (ttContent) {
                      ttContent.remove();
                      ovDataViewBodyElm = ovDataViewDetailElm = ttContent = null;
                    }
                  });

                  //require active watcher after get template (Fix issue of Auth Server)
                  scope.$watch('selectedList + ovDataView.isShowDetail', function () {
                    if (!ovDataViewBodyElm || !ovDataViewDetailElm) {
                      return;
                    }

                    //Using jquery to assign class immediately because ng-class will add class in postDigest
                    //and ngClass call $animate.addClass or $animate.removeClass (angular.js)
                    //also slickGridDirective need actual position and size (width/height) before rendering
                    //https://github.com/angular/angular.js/commit/667183a8c79d6ffce571a2be78c05dc76503b222
                    if (scope.ovDataView.showDetailCondition(scope.selectedList) && scope.ovDataView.isShowDetail) {
                      ovDataViewBodyElm.addClass(ovDataViewBodyClass);
                      ovDataViewDetailElm.addClass(ovDataViewDetailClass);
                    } else {
                      ovDataViewBodyElm.removeClass(ovDataViewBodyClass);
                      ovDataViewDetailElm.removeClass(ovDataViewDetailClass);
                    }

                    scope.ovDataView.resizeGrid();
                  });
                });

                scope.ovDataView.listConfig.config.id = scope.ovDataView.id;
                if (typeof (scope.disabledItemFunction) !== 'function') {
                  scope.disabledItemFunction = function () {
                    return false;
                  };
                }

                scope.ovDataView.tableConfig.gridOptions.multiSelect = scope.ovDataView.multiSelect;
                scope.ovDataView.enableCheckbox = scope.ovDataView.multiSelect;
                scope.ovDataView.listConfig.config.multiSelect = scope.ovDataView.multiSelect;

                if (scope.ovDataView.multiSelect) {
                  scope.ovDataView.tableConfig.selectionModel = 'checkbox';
                } else {
                  scope.ovDataView.tableConfig.selectionModel = 'row';
                }

                if (angular.isDefined(scope.functionList) && scope.functionList !== null) {
                  angular.forEach(scope.functionList, function (fn, key) {
                    scope[key] = fn;
                  });
                }

                //Change filter field if column has a filterBy attribute
                angular.forEach(scope.ovDataView.tableConfig.filterColumn, function (item) {
                  if (item.filterBy) {
                    item.id = item.filterBy;
                  }
                  /**
                   * DOQ: After applying ovNgFilter need to map name to filterColumns
                   */
                  if (!item.name) {
                    item.name = item.title || item.id;
                  }
                });
                scope.ovDataView.tableConfig.filterFields = scope.ovDataView.tableConfig.filterColumn;

                //Prevent select
                if (angular.isUndefined(scope.ovDataView.listConfig.config.preventSelect)) {
                  scope.ovDataView.listConfig.config.preventSelect = scope.ovDataView.preventSelect;
                }

                if (!scope.ovDataView.tableConfig.gridViewId) {
                  if (scope.ovDataView.primaryKey) {
                    scope.ovDataView.tableConfig.gridViewId = scope.ovDataView.primaryKey;
                  } else {
                    scope.ovDataView.tableConfig.gridViewId = AllOvDataViewIds.environmentVal.OV_DATA_VIEW_PRIMARY_KEY;
                  }
                }

                //ovDataViewSorter
                scope.ovDataView.tableConfig.dataViewSorter = scope.ovDataView.tableConfig.dataViewSorter || scope.ovDataView.ovDataViewSorter;
                scope.ovDataView.listConfig.config.sorter = scope.ovDataView.listConfig.config.sorter || scope.ovDataView.ovDataViewSorter;

                //SlickMenu config
                scope.ovDataView.slickMenuObj = slickMenuObj;
                scope.ovDataView.slickMenu = {
                  dataTableMode: [
                    scope.ovDataView.slickMenuObj.dataTableMode.search,
                    scope.ovDataView.slickMenuObj.dataTableMode.filter,
                    scope.ovDataView.slickMenuObj.dataTableMode.resetFilter,
                    scope.ovDataView.slickMenuObj.dataTableMode.exportCSV,
                    //scope.ovDataView.slickMenuObj.dataTableMode.addToReport,
                    scope.ovDataView.slickMenuObj.dataTableMode.print
                  ],
                  dataListMode: [
                    //scope.ovDataView.slickMenuObj.dataTableMode.addToReport
                  ]
                };

                scope.ovDataView.slickMenu.configTableMode = ovSlickMenuBuilder.getBuilder().setIdPrefix('ovDataView-tableMode-').setMinWidth(880).build();
                scope.ovDataView.slickMenu.configTableMode.toggleButtonTemplate = 'ov_components/ovDataView/templates/templateToggleBtn.html';
                scope.ovDataView.slickMenu.configTableMode.ulOverrideCss = 'ul-slick-menu-override-ovDataView';
                scope.ovDataView.slickMenu.configListMode = ovSlickMenuBuilder.getBuilder().setIdPrefix('ovDataView-listMode-').setMinWidth(880).build();
                scope.ovDataView.slickMenu.configListMode.toggleButtonTemplate = 'ov_components/ovDataView/templates/templateToggleBtn.html';
                scope.ovDataView.slickMenu.configListMode.ulOverrideCss = 'ul-slick-menu-override-ovDataView';

                assignFunctionToConfig();
              };

            initDataView();

            //Don't remove these function because scope.resetFilter + exportCSV + print being using by old template of ovDataView
            scope.doFilter = doFilter;
            scope.resetFilter = resetFilter;
            scope.exportCSV = exportCSV;
            scope.print = print;

            //Require ovDataViewCacheData initialize after initDataView
            var ovDataViewCacheData = $ovDataViewService.getCache(ovDataViewCacheId) !== undefined ? $ovDataViewService.getCache(ovDataViewCacheId) : {
              ovDataView: angular.copy(scope.ovDataView),
              //selectedList: angular.copy(scope.selectedList) //Prevent keep selectedList when resetOvDataViewConfig,
              pageInfo: scope.ovDataView.tableConfig.pagingInfo || scope.ovDataView.tableConfig.defaultPageInfo,
              isShowDetail: scope.ovDataView.isShowDetail,
              tableSortConfig: scope.ovDataView.tableConfig.tableSortConfig
            };

            //Important!!! - Please don't init selectedList because when you watch selectedList to set selectedItem will be wrong
            //Because at the present, ovDataViewCacheData.selectedList only have an attribute (id)
            //scope.selectedList = ovDataViewCacheData.selectedList || [];

            //Because when handleGetTableConfig if enableSync = false => config.sortBy is undefined
            ovDataViewCacheData.ovDataView.listConfig.config.sortBy = ovDataViewCacheData.ovDataView.listConfig.config.sortBy || ovDottie.get(ovDataViewCacheData, 'ovDataView.listConfig.config.selectFieldList.0.key');

            var updateGridData = function (enableSort) {
              if (angular.isArray(scope.viewData) && scope.ovDataView.tableConfig.gridColumns.length) {
                var tableSortColumns = scope.grid ? getSortColumns(scope.grid) : ovDataViewCacheData && ovDataViewCacheData.tableSortConfig, filterData, searchStr;

                //call mappingDataGrid before search or filter to support custom formatter
                scope.ovDataView.mappingDataGrid(scope.viewData);

                //sortOvDataViewData need to call after mappingDataGrid to have multiple levels field
                if (enableSort) {
                  sortOvDataViewData(scope.viewData, tableSortColumns);
                }

                filterData = scope.ovDataView.filterSelectedFn(scope.viewData,
                  scope.ovDataView.tableConfig.filterSelected, scope.ovDataView.tableConfig.filterColumn);

                //Check searchString !== '' otherwise leads to empty data with field's value is null or undefined
                if (scope.ovDataView.tableConfig.searchString) {
                  searchStr = ''.toLowerCase.call(scope.ovDataView.tableConfig.searchString);

                  filterData = $filter('filter')(filterData, function (dataItem/*, index*/) {
                    for (var i = 0; i < scope.ovDataView.tableConfig.gridColumns.length; i++) {
                      var field = scope.ovDataView.tableConfig.gridColumns[i].searchBy || scope.ovDataView.tableConfig.gridColumns[i].field,
                        fieldValue = $ovUtility.findValItem(dataItem, field);
                      //Using ''.toLowerCase.call to converter for boolean or number
                      if (angular.isDefined(fieldValue) && fieldValue !== null && ''.toLowerCase.call(fieldValue).indexOf(searchStr) !== -1) {
                        return true;
                      }
                    }
                    return false;
                  });
                }

                scope.filterData = filterData;
                ovDottie.getFunction(scope.dataGridView, 'setItems')(filterData, scope.ovDataView.tableConfig.gridViewId);
                scope.ovDataView.resizeGrid();
              }
            }, updateGridDataDebounce = _.debounce(updateGridData, 500);

            scope.refreshCallBack = function () {
              scope.ovDataView.listConfig.refreshCallBack();
            };
            scope.selectedCallBack = function (indices) {
              scope.selectedList = [];
              angular.forEach(indices, function (i) {
                scope.selectedList.push(scope.viewData[i]);
              });
              scope.ovDataView.listConfig.selectedCallBack(indices);

              setShowDetail(scope.selectedList);
            };

            scope.$on('onGridInit', function (event, gridElm, grid, dataView) {
              if (gridElm[0].id === scope.ovDataView.id) {
                scope.grid = grid;
                scope.dataGridView = dataView;
                scope.gridElm = gridElm;
                scope.$$initOvDataView = true;

                scope.dataGridView.getItemMetadata = function (row) {
                  if (scope.ovDataView.preventSelect) {
                    return {
                      selectable: false,
                      focusable: false
                    };
                  } else if (scope.grid.getDataItem(row).disabled || scope.disabledItemFunction(scope.grid.getDataItem(row))) {
                    return {
                      selectable: false,
                      focusable: false,
                      cssClasses: 'ov-data-view-row-disabled'
                    };
                  } else {
                    return {};
                  }
                };

                scope.grid.onSelectedRowsChanged.subscribe(function (/*e, args*/) {
                  var selectedRowIdx = scope.grid.getSelectedRows();

                  if (!preventEvent.onSelectedRowsChanged) {
                    /**
                     * DOQ: If user change pageSize, filter, sort, ...
                     * Slick grid will return selected items on this page
                     * Keep selectedList data from other pages (preventEvent.onSelectedRowsChanged)
                     * Reproduce step:
                     * Step1: Select one item at page 1
                     * Step2: Add one selected item at page 2
                     * Step3: log selectedList to check 2 items are selected
                     */
                    scope.selectedList = [];
                    angular.forEach(selectedRowIdx, function (i) {
                      scope.selectedList.push(scope.dataGridView.getItem(i));
                    });
                    setShowDetail(scope.selectedList);
                    $timeout(function () {
                    });
                  }

                  preventEvent.onSelectedRowsChanged = false;
                });

                //call when change pageSize, filter
                scope.dataGridView.onRowCountChanged.subscribe(function (/*e, args*/) {
                  //args: {current: 25, previous: 100}
                  //Prevent call onSelectedFunction when change pageSize
                  if (scope.selectedList && scope.selectedList.length) {
                    //prevent call selected items when change pageSize and filter
                    preventEvent.onSelectedRowsChanged = true;
                  }
                });

                //call when sort and change currentPage
                scope.dataGridView.onRowsChanged.subscribe(function (e, args) {
                  if (angular.isFunction(scope.ovDataView.tableConfig.onRowsChanged)) {
                    scope.ovDataView.tableConfig.onRowsChanged(args.rows);
                  }

                  //prevent call onSelectedFunction when onRowsChanged
                  if (scope.selectedList && scope.selectedList.length) {
                    //prevent call selected items when sorting
                    preventEvent.onSelectedRowsChanged = true;
                  }
                });

                //Save columnsList to server when onColumnsReordered
                scope.grid.onColumnsReordered.subscribe(function (/*e,args*/) {
                  flag.columnsReordered++;
                  //Require call $apply to observer saveTableConfig
                  $timeout(function () {
                  });
                });

                scope.grid.onColumnsResized.subscribe(function (/*e, args*/) {
                  flag.columnsResized++;
                  //Require call $apply to observer saveTableConfig
                  $timeout(function () {
                  });
                });

                scope.grid.onSort.subscribe(function (/*e, args*/) {
                  flag.onSortChanged++;
                  scope.ovDataView.tableConfig.tableSortConfig = getSortColumns(scope.grid);
                });

                //ovDataView will watch sortColumn then call sorter by itself instead of default sorter by slickGrid
                if (scope.ovDataView.tableConfig.gridOptions.api) {
                  scope.ovDataView.tableConfig.gridOptions.api.unsubscribeSort();
                }

                scope.$watchCollection(function () {
                  return {
                    tableSearchString: scope.ovDataView.tableConfig.searchString,
                    onSortChanged: flag.onSortChanged
                  };
                }, function (newVal, oldVal) {
                  if (newVal !== oldVal) {
                    updateGridDataDebounce(newVal.onSortChanged !== oldVal.onSortChanged);
                    if (newVal && newVal.tableSearchString) {
                      scope.ovDataView.tableConfig.showSearchGroup = true;
                    }
                  }
                });

                scope.dataGridView.syncGridSelection(scope.grid, true);
                scope.ovDataView.handleGetTableConfig().finally(function () {
                  if (scope.ovDataView.enableSync) {
                    ovDataViewCacheData.ovDataView.listConfig.config.sortBy = ovDottie.get(scope.ovDataView, 'listConfig.config.selectFieldList.0.key');
                    ovDataViewCacheData.tableSortConfig = ovDataViewCacheData.tableSortConfig || [
                        {
                          columnId: ovDataViewCacheData.ovDataView.listConfig.config.sortBy,
                          sortAsc: ovDataViewCacheData.ovDataView.listConfig.config.sortType === AllOvDataViewIds.environmentVal.SORT_ASC
                        }
                      ];
                  }

                  observerConfigData();

                  scope.viewMode = scope.viewMode || tableMode;

                  scope.$watch('viewData.length', function () {
                    updateGridData();
                  });

                  scope.$watch('viewMode', function (newVal, oldVal) {
                    scope.ovDataView.viewMode = newVal;
                    if (newVal !== oldVal) {
                      if (typeof(scope.onChangedViewModeCallback) === 'function') {
                        scope.onChangedViewModeCallback(newVal);
                      }

                      scope.ovDataView.syncByViewMode(oldVal);
                      setData(scope.viewData, scope.selectedList);
                    }
                  });

                  if (angular.isFunction(scope.ovDataView.onHandleGetTableConfigFinished)) {
                    scope.ovDataView.onHandleGetTableConfigFinished();
                  }

                  scope.ovDataView.tableConfig.onGridInitCallback(event, gridElm, grid, dataView);

                  scope.actions = {
                    setData: setData,
                    setSelectedFromCache: setSelectedFromCache,
                    resetOvDataViewConfig: resetOvDataViewConfig
                  };

                  //scope.actions.destroy = ovComponentRegistry.register(scope.actions, scope.ovDataView.id);
                });
              }
            });

            scope.filterFinishCallBack = function () {
              updateGridData();
              if (typeof scope.ovDataView.tableConfig.filterFinishCallBack === 'function') {
                scope.ovDataView.tableConfig.filterFinishCallBack();
              }
            };
            scope.filterCancelCallBack = function () {
              if (typeof scope.ovDataView.tableConfig.filterCancelCallBack === 'function') {
                scope.ovDataView.tableConfig.filterCancelCallBack();
              }
            };

            scope.onFilterListChanged = function () {
              flag.filterListChanged++;
              if (angular.isFunction(scope.ovDataView.tableConfig.onFilterListChanged)) {
                scope.ovDataView.tableConfig.onFilterListChanged();
              }
            };

            scope.$on('i18nextLanguageChange', function () {
              if (scope.ovDataView.tableConfig.pagerData) {
                scope.ovDataView.tableConfig.pagerData = {
                  show: $i18next('ovDataView.slickGrid.show'),
                  showingAll: $i18next('ovDataView.slickGrid.showingAll'),
                  rows: $i18next('ovDataView.slickGrid.rows'),
                  showingPage: $i18next('ovDataView.slickGrid.showingPage'),
                  of: $i18next('ovDataView.slickGrid.of'),
                  all: $i18next('ovDataView.slickGrid.all'),
                  auto: $i18next('ovDataView.slickGrid.auto')
                };
              }
            });

            scope.showDetail = function () {
              if (scope.ovDataViewDetailTpl) {
                scope.ovDataView.isShowDetail = true;
              }
            };

            scope.hideDetail = function () {
              if (scope.ovDataViewDetailTpl) {
                scope.ovDataView.isShowDetail = false;
              }
            };

            scope.$on('$destroy', function () {
              scope.ovDataView.$$destroyedOvDataView = scope.$$destroyedOvDataView = true;

              ovDataViewCacheData = getOvDataViewCacheObj();

              if (scope.ovDataView.enableCache && scope.ovDataView.id) {
                $ovDataViewService.putCache(ovDataViewCacheId, ovDataViewCacheData);
              }

              if (scope.viewScope) {
                scope.viewScope.$destroy();
              }

              ovDottie.getFunction(scope, 'actions.destroy')();

              scope.grid = null;
              scope.dataGridView = null;
              viewDefaultConfig = null;
              ovDataViewCacheData = null;
            });

            function assignFunctionToConfig() {
              scope.ovDataView.updateTable = function (enableSort) {
                if (!scope.$$destroyedOvDataView && scope.$$initOvDataView) {
                  updateGridData(enableSort);
                }
              };
              scope.ovDataView.setShowDetail = function (selectedList) {
                if (angular.isArray(selectedList)) {
                  setShowDetail(selectedList);
                }
              };
              scope.ovDataView.setData = setReportData || function (data, selectedList) {
                  if (!scope.$$destroyedOvDataView && scope.$$initOvDataView) {
                    return setData(data, selectedList);
                  } else {
                    $log.debug('ovDataView - call setSelectedFromCache wrong time (isDestroy, isInit, ovDataViewId)', scope.$$destroyedOvDataView, scope.$$initOvDataView, scope.ovDataView.id);
                    return [];
                  }
                };
              scope.ovDataView.setSelectedFromCache = setReportData || function (data, selectedList) {
                  if (!scope.$$destroyedOvDataView && scope.$$initOvDataView) {
                    return setSelectedFromCache(data, selectedList);
                  } else {
                    $log.debug('ovDataView - call setSelectedFromCache wrong time (isDestroy, isInit, ovDataViewId)', scope.$$destroyedOvDataView, scope.$$initOvDataView, scope.ovDataView.id);
                    return [];
                  }
                };
              scope.ovDataView.resetOvDataViewConfig = setReportData || function (data) {
                  resetOvDataViewConfig(data);
                };
              scope.ovDataView.getSelectedList = function () {
                return scope.selectedList;
              };

              function syncWidthSrcToDest(src, dest) {
                dest.width = src.width;
              }

              scope.ovDataView.handleGetTableConfig = function () {
                var deferred = $q.defer();

                if (scope.ovDataView.enableTableConfig) {
                  $ovDataViewService.getTableConfig(scope.ovDataView.id).then(
                    function success(response) {
                      var configs = ovDottie.get(response, 'data.response.tableconfig', {});

                      if (scope.ovDataView.cacheOptions.filterList) {
                        if (angular.isArray(configs.filterList)) {
                          scope.ovDataView.tableConfig.filterList.length = 0;
                          angular.forEach(configs.filterList, function (filterItem) {
                            scope.ovDataView.tableConfig.filterList.push(filterItem);
                          });
                        }
                      }

                      if (scope.ovDataView.cacheOptions.gridColumns) {
                        if (angular.isArray(configs.columns)) {
                          $ovDataViewService.syncSrcToDst(configs.columns, null,
                            scope.ovDataView.tableConfig.gridColumns,
                            scope.ovDataView.tableConfig.hideColumns,
                            AllOvDataViewIds.environmentVal.TABLE_PRIMARY_KEY,
                            AllOvDataViewIds.environmentVal.TABLE_PRIMARY_KEY,
                            syncWidthSrcToDest);
                        }
                      }

                      if (scope.ovDataView.cacheOptions.selectFieldList) {
                        if (angular.isArray(configs.lists)) {
                          $ovDataViewService.syncSrcToDst(configs.lists, null,
                            scope.ovDataView.listConfig.config.selectFieldList,
                            scope.ovDataView.listConfig.config.hideFieldList,
                            AllOvDataViewIds.environmentVal.LIST_PRIMARY_KEY,
                            AllOvDataViewIds.environmentVal.LIST_PRIMARY_KEY);
                        }
                      }

                      if (scope.ovDataView.cacheOptions.viewMode) {
                        if (configs.viewMode) {
                          if (configs.viewModeVersion !== ovUserPrefSrv.tableListViewModeVersion) {
                            scope.viewMode = ovUserPrefSrv.tableListViewMode;
                          } else {
                            scope.viewMode = configs.viewMode;
                          }
                        } else {
                          scope.viewMode = ovUserPrefSrv.tableListViewMode;
                        }
                      }
                    }).finally(function () {
                    deferred.resolve();
                  });
                } else {
                  deferred.resolve();
                }

                return deferred.promise;
              };

              scope.ovDataView.saveTableConfig = function () {
                var deferred = $q.defer();

                if (scope.ovDataView.enableTableConfig) {
                  //sync two mode before saveTableConfig
                  scope.ovDataView.syncByViewMode(scope.viewMode);

                  var send = {
                    id: scope.ovDataView.id,
                    tableconfig: {
                      filterList: scope.ovDataView.tableConfig.filterList,
                      columns: scope.ovDataView.tableConfig.gridColumns,
                      lists: scope.ovDataView.listConfig.config.selectFieldList,
                      viewMode: scope.viewMode,
                      viewModeVersion: ovUserPrefSrv.tableListViewModeVersion
                    }
                  };

                  if (!scope.ovDataView.cacheOptions.filterList) {
                    delete send.tableconfig.filterList;
                  }

                  if (!scope.ovDataView.cacheOptions.gridColumns) {
                    delete send.tableconfig.columns;
                  }

                  if (!scope.ovDataView.cacheOptions.selectFieldList) {
                    delete send.tableconfig.lists;
                  }

                  if (!scope.ovDataView.cacheOptions.viewMode) {
                    delete send.tableconfig.viewMode;
                    delete send.tableconfig.viewModeVersion;
                  }

                  $ovDataViewService.saveTableConfig(send).finally(function () {
                    deferred.resolve();
                  });
                } else {
                  deferred.resolve();
                }

                return deferred.promise;
              };

              scope.ovDataView.syncByViewMode = function (viewMode) {
                if (!scope.ovDataView.enableSync) {
                  return;
                }

                if (viewMode === tableMode) {
                  $ovDataViewService.syncSrcToDst(
                    scope.ovDataView.tableConfig.gridColumns,
                    scope.ovDataView.tableConfig.hideColumns,
                    scope.ovDataView.listConfig.config.selectFieldList,
                    scope.ovDataView.listConfig.config.hideFieldList,
                    AllOvDataViewIds.environmentVal.TABLE_PRIMARY_KEY,
                    AllOvDataViewIds.environmentVal.LIST_PRIMARY_KEY);

                  //Will support sync searchString after support sync sort
                  //scope.ovDataView.listConfig.config.searchString = scope.ovDataView.tableConfig.searchString;
                } else {
                  $ovDataViewService.syncSrcToDst(
                    scope.ovDataView.listConfig.config.selectFieldList,
                    scope.ovDataView.listConfig.config.hideFieldList,
                    scope.ovDataView.tableConfig.gridColumns,
                    scope.ovDataView.tableConfig.hideColumns,
                    AllOvDataViewIds.environmentVal.LIST_PRIMARY_KEY,
                    AllOvDataViewIds.environmentVal.TABLE_PRIMARY_KEY);
                  //scope.ovDataView.tableConfig.searchString = scope.ovDataView.listConfig.config.searchString;
                }

                scope.ovDataView.listConfig.config.sortBy = ovDottie.get(scope.ovDataView, 'listConfig.config.selectFieldList.0.key');
              };

              scope.ovDataView.resizeGrid = function () {
                if (scope.ovDataView.tableConfig.gridOptions.api && scope.ovDataView.tableConfig.gridOptions.api.resizeGrid) {
                  scope.ovDataView.tableConfig.gridOptions.api.resizeGrid();
                }
              };

              scope.ovDataView.isTwoObjectEquals = scope.ovDataView.isTwoObjectEquals || $ovDataViewService.isTwoObjectEquals;

              //Allow choose columns which user want
              scope.ovDataView.getAllColumns = scope.ovDataView.getAllColumns || function (arrCol) {
                  return arrCol;
                };

              scope.ovDataView.filterSelectedFn = scope.ovDataView.filterSelectedFn || function (viewData, filterSelected) {
                  //Warning if you not by pass attribute and used scope.viewData can lead to access to old scope
                  //Because ovDataView.filterSelectedFn never new assigned
                  return viewData;
                };

              scope.ovDataView.mappingDataGrid = function (data) {
                var result = [], allCols = scope.ovDataView.tableConfig.gridColumns.concat(scope.ovDataView.tableConfig.hideColumns), allIds = {};
                if (!angular.isArray(data)) {
                  $log.debug('ovDataView - warning wrong type of data expect array but: ', data);
                  return [];
                }

                angular.forEach(data, function (dataItem, dataIndex) {
                  if (angular.isObject(dataItem)) {
                    dataItem[scope.ovDataView.tableConfig.gridViewId] = scope.ovDataView.primaryKey ? $ovUtility.findValItem(dataItem, scope.ovDataView.primaryKey) : dataIndex;
                    angular.forEach(allCols, function (columnItem) {
                      dataItem[columnItem.field] = $ovUtility.findValItem(dataItem, columnItem.field);

                      if (angular.isFunction(columnItem.reformatDataFn)) {
                        //This function require 3 params (value, colDef, dataCxt) and return a string after formatted
                        var formatValue = columnItem.reformatDataFn(dataItem[columnItem.field], columnItem, dataItem);
                        dataItem[columnItem.field] = formatValue;
                        //require this to using multilevel search field
                        ovDottie.set(dataItem, columnItem.field, formatValue);
                      }

                      scope.ovDataView.mappingDataItem(dataItem, columnItem);
                    });
                    if (!allIds[dataItem[scope.ovDataView.tableConfig.gridViewId]]) {
                      result.push(dataItem);
                      allIds[dataItem[scope.ovDataView.tableConfig.gridViewId]] = true;
                    } else {
                      $log.error('ovDataView - duplicate data (id, value, index): ', scope.ovDataView.primaryKey, dataItem[scope.ovDataView.tableConfig.gridViewId], dataIndex, ' will be removed.');
                    }
                  } else {
                    $log.error('ovDataView - warning existing empty item from index', dataIndex, scope.ovDataView.id);
                  }
                });
                return result;
              };

              scope.ovDataView.doFilter = doFilter;
              scope.ovDataView.resetFilter = resetFilter;
              scope.ovDataView.exportCSV = exportCSV;
              scope.ovDataView.print = print;
              scope.ovDataView.addToReport = addToReport;
            }
          }
        };
      }]
    );
})();
