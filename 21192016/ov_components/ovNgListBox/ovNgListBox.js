/**
 \$Id:
 (c) Copyright ALE USA Inc., ${YEAR}
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */


/**
 * @ngdoc directive
 * @name ov-component.directive:ovNgListBox
 * @requires ov-component.service:$ovDataViewService
 * @restrict AE
 * @description
 * Show data in list view
 * @param {array} listItem array data
 * @param {object} config component config
 * - **id** (optional) string: component id
 * - **selectFieldList** (require) array: array column ex
 *  <pre>
 *    [
 *      {
 *        title: 'title1',
 *        key: 'key1'
 *      }
 *    ]
 *  </pre>
 * - **limitRow** (optional) number: Limit row for pagination default is 5
 * - **showFooter** (optional) boolean: show/hide footer
 * - **showHeader** (optional) boolean: show/hide header
 * - **sortType** (optional) string (ASC/DESC): sort ordering
 * - **currentPage** (optional) number: current page of pagination
 * - **itemTemplate** (optional) string: url to item template
 * - **headerTemplate** (optional) string: url to header template
 * - **multiSelect** (optional) boolean: multiple or single select
 * - **searchString** (optional) string: get/set your search value
 * - **showTag** (optional) boolean: show/hide tag list (ex: up/down for switch)
 * - **showUpDownTag** (optional) boolean: show/hide up/down tag
 * - **maxHeight** (optional) number: component's max height (overflow with vertical scrollbar)
 * @param {function} onSelectedFunction selected callback function
 * @example
 * <pre>
 *   <!-- IN HTML -->
 *   <div ov-ng-list-box
 *        list-item="vm.listItem"
 *        onSelectedFunction="vm.onSelectedFunction"
 *        config="vm.config">
 *   </div>
 * </pre>
 *
 * <pre>
 *    //IN JS
 *    var attrs = {
 *        column1: {
 *            key: 'key1',
 *            i18nKey: 'i18nKey1'
 *        },
 *        column2: {
 *            key: 'key2',
 *            i18nKey: 'i18nKey2'
 *        }
 *    };
 *    vm.listItem = [{key1: 'value1', key2: 'value2'}];
 *    vm.config = {
 *       selectFieldList: ovDataViewService.getColumnList(attrs)
 *    };
 *    vm.onSelectedFunction = fucntion (indices) {
 *        vm.selectedList = [];
 *        angular.forEach(indices, function (i) {
 *            vm.selectedList.push(vm.listItem[i]);
 *        });
 *    };
 * </pre>
 */

(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovNgListBox', [])
    .directive('ovNgListBox', [function () {
      return {
        restrict: 'AE',
        scope: {
          listItem: '=',
          config: '=',
          reportOptions: '=?',
          onSelectedFunction: '=?',
          templateUrl: '=?',
          onRowsChanged: '=?',
          functionList: '=?'
        },
        template: '<div ng-include="templateUrl"></div>',
        link: function (scope, element) {
          if (angular.isDefined(scope.config.heightOptions.ovResize)) {
            /*Responsive ovNgListBox*/
            var windowHeight = $(window).height();
            var minHeight = scope.config.heightOptions.minHeight;
            var ovResize = scope.config.heightOptions.ovResize;
            var height = windowHeight - element.offset().top - ovResize;

            scope.config.maxHeight = height > minHeight ? height : minHeight;
          }
        },
        controller: ['$scope', '$attrs', '$filter', '$ovUtility', '$log', 'ovDottie', '$i18next', '$timeout', function (scope, attrs, $filter, $ovUtility, $log, ovDottie, $i18next, $timeout) {
          if (!scope.config) {
            $log.error('ovNgListBox: Missing config');
            return;
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
            scope.templateUrl = scope.templateUrl || 'ov_components/ovNgListBox/ovNgListBox.html';
          });

          var reportCacheObj = ovDottie.get(scope, 'reportOptions.reportCacheObj');

          if (reportCacheObj && reportCacheObj.config) {
            /**
             * Override ovNgListBox config by reportCacheObj.config
             * Reproduce step:
             *  Step1: change columns' size of ovDataView
             *  Step2: add to report and test columns' size on report page
             */
            scope.config = $ovUtility.extendConfig(reportCacheObj.config, scope.config);
          }

          /*default parameter*/
          scope.checkAll = {};
          scope.totalPage = [];
          scope.localData = [];
          var returnArr = [];
          scope.listView = [];

          //action
          var DEFAULT_ACTION_TEMPLATE = 'ov_components/ovNgListBox/defaultActionTemplate.html';
          scope.isArray = function (value) {
            return angular.isArray(value);
          };
          //END action

          var DEFAULT_TEMPLATE = 'ov_components/ovNgListBox/defaultItemTemplate.html',
            DEFAULT_HEADER = 'ov_components/ovNgListBox/defaultHeaderTemplate.html',
            DEFAULT_TAG_TEMPLATE = 'ov_components/ovNgListBox/defaultRepeatedTagTemplate.html',
            defaultTagList = $ovUtility.getDefaultTagList(),
            defaultConfig = {
              limitRow: 5,
              showFooter: true,
              showHeader: true,
              showSelectAll: true,
              sortType: 'ASC',
              showFilter: true,
              currentPage: 1,
              itemTemplate: DEFAULT_TEMPLATE,
              headerTemplate: DEFAULT_HEADER,
              actionTemplate: DEFAULT_ACTION_TEMPLATE,
              tagTemplate: DEFAULT_TAG_TEMPLATE,
              isCheckAll: new Array(scope.totalPage),
              multiSelect: true,
              searchString: '',
              extendedTagList: [],
              showUpDownTag: true,
              maxHeight: 570,
              heightOptions: {
                //ovResize: 200,
                minHeight: 270
              },
              reportOptions: {
                title: ovDottie.getString(scope.config, 'reportOptions.title', ovDottie.getString(scope.config, 'reportOptions.title')),
                id: 'ov-report-builder',
                params: {
                  config: attrs.config,
                  listItem: attrs.listItem,
                  functionList: attrs.functionList,
                  templateUrl: 'ov_components/ovNgListBox/reportTpl/ovNgListBox.list.report.html'
                }
              },
              selectFieldList: [
              /**
               * name: for old template of ovNgListBox
               * title: for new template of ovDataView
               */
                {key: '', name: '', title: ''}
              ],
              mapFunction: [
                {
                  'from': 'getContent',
                  'to': $ovUtility.ovListBoxGetContent
                },
                {
                  'from': 'getTitle',
                  'to': $ovUtility.ovListBoxGetTitle
                },
                {
                  'from': 'findValItem',
                  'to': $ovUtility.findValItem
                }
              ],
              sorter: function (fieldName, value1, value2, sign, colDef, dataCtx1, dataCtx2) {
                if (colDef && colDef.sortBy) {
                  value1 = dataCtx1[colDef.sortBy];
                  value2 = dataCtx2[colDef.sortBy];
                }
                return $ovUtility.naturalSort(value1, value2) * sign;
              }
            };

          if (scope.config.id) {
            scope.ovNgListBoxId = scope.config.id;
          } else {
            $log.error('ovNgListBox: PR-211179: add id for ui automation test: Please add config.id');
          }

          if (!angular.isDefined(scope.listItem) || scope.listItem === null) {
            scope.listItem = [];
          }

          /*Keep references data*/
          defaultConfig.selectFieldList = scope.config.selectFieldList || defaultConfig.selectFieldList;

          /*Default config for ov-ng-list-box*/
          $ovUtility.extendConfig(scope.config, defaultConfig);
          scope.config.tagList = scope.config.tagList || defaultTagList;

          /*Default sortBy for ovNgListBox*/
          scope.config.sortBy = scope.config.sortBy || ovDottie.getString(scope.config.selectFieldList, '0.key');

          //Allow user update list data without angular.copy listItem
          function updateListFn(val) {
            if (angular.isDefined(val) && val !== null) {
              if (angular.isDefined(scope.config.limitRow) && scope.config.limitRow !== null) {
                returnArr = [];
                scope.localData = copyData(val);
                if (angular.isDefined(scope.config.searchString) && scope.config.searchString !== null && scope.config.searchString !== '') {
                  scope.search(scope.config.searchString);
                } else {
                  scope.sortFunction();
                }
                scope.totalPage[0] = Math.ceil(scope.listItem.length / scope.config.limitRow);

                scope.changePage(scope.config.currentPage);
              }
            } else {
              scope.totalPage[0] = 1;
            }
          }

          scope.config.updateListFn = updateListFn;

          //merge tagList and extendedTagList
          if (angular.isDefined(scope.config.extendedTagList) && scope.config.extendedTagList.length !== 0) {
            scope.config.tagList = defaultTagList.concat(scope.config.extendedTagList);
            // angular.forEach(scope.config.extendedTagList, function (extendedTag) {
            //   scope.config.tagList.push(extendedTag);
            // });
          }

          // Sort
          scope.$watch('config.sortType', function (val) {
            if (val) {
              if (val === 'ASC') {
                scope.asc = true;
              } else if (val === 'DESC') {
                scope.asc = false;
              }
            }
            scope.sortFunction();
          });
          scope.$watch('config.sortBy', function (newVal) {
            if (angular.isDefined(newVal)) {
              var val = scope.config.sortType;
              if (val) {
                if (val === 'ASC') {
                  scope.asc = true;
                } else if (val === 'DESC') {
                  scope.asc = false;
                }
              }

              //change newVal to first item in list selectFieldList
              if (angular.isArray(scope.config.selectFieldList)) {
                for (var i = 0; i < scope.config.selectFieldList.length; i++) {
                  if (scope.config.selectFieldList[i].key === newVal) {
                    var temp = scope.config.selectFieldList[0];
                    scope.config.selectFieldList[0] = scope.config.selectFieldList[i];
                    scope.config.selectFieldList[i] = temp;
                    break;
                  }
                }
              }

              /**
               * DOQ: Fix the issue witch search when existing search by and sortBy
               * If existing search string then need to search and sort
               * The old code is only search if changed search by
               * So that I've changed to updateListFn to check search and sort
               * Reproduce steps:
               *  Step 1: Fill search string to input
               *  Step 2: Change sortBy then check if the data is changed.
               */
              updateListFn(scope.listItem);
            }
          });

          /**
           * I've changed to watch selectFieldList[0].key because
           * if the user only changes arrangement of data but not references
           * Reproduce step:
           *  Step 1: Go to Captive Portal -> choose a menu
           *  Step 2: Check config button then change arrangement of field list
           *  Step 3: Check title of ovNgListBox is depends on first selected field list
           */
          scope.$watch(function () {
            return ovDottie.getString(scope.config.selectFieldList, '0.key');
          }, function (newVal) {
            if (newVal) {
              scope.config.sortBy = newVal;
            }
          });

          var copyData = function (list) {
            var tmp = {};
            var results = [];
            if (list) {
              for (var i = 0; i < list.length; i++) {
                if (angular.isObject(list[i])) {
                  tmp = angular.extend(list[i], {});
                  tmp.bkHashKey = i;
                  if (list[i].checked && returnArr.indexOf(i) === -1) {
                    returnArr.push(i);
                  }
                  results.push(tmp);
                } else {
                  $log.error('ovNgListBox - warning existing empty item from index', i);
                }
              }
            }
            return results;
          };

          var removeAllItemCurrentPage = function () {
            var from = (scope.config.currentPage - 1) * scope.config.limitRow;
            var to = from + scope.config.limitRow;
            for (var i = from; i < to; i++) {
              if (scope.localData[i]) {
                var index = returnArr.indexOf(scope.localData[i].bkHashKey);
                if (index !== -1) {
                  returnArr.splice(index, 1);
                }
              }
            }
          };

          scope.filter = function (list, keyword) {
            return $filter('filter')(list, keyword);
          };

          //check all item in list
          scope.selectAll = function () {
            scope.config.checkAllPage(scope.checkAll[0], scope.config.currentPage);

          };
          //====================================
          scope.config.checkAllPage = function (val, page) {
            //scope.config.isCheckAll[page] = val;
            var start = scope.config.limitRow * (page - 1);
            var end = scope.config.limitRow * page;
            var mod = 0;

            if (end > scope.localData.length) {
              mod = end - scope.localData.length;
            }

            //count selected items
            var count = 0, isExistChecked;
            for (var i = start; i < end - mod; i++) {
              if (!scope.localData[i].disabled) {
                scope.localData[i].checked = val;
                if (val) {
                  if (returnArr.indexOf(scope.localData[i].bkHashKey) === -1) {
                    returnArr.push(scope.localData[i].bkHashKey);
                  }
                } else {
                  if (scope.localData[i]) {
                    var index = returnArr.indexOf(scope.localData[i].bkHashKey);
                    if (index !== -1) {
                      returnArr.splice(index, 1);
                    }
                  }
                }
              }
              //Check if all data is disabled and no checked => checkAll = false
              isExistChecked = scope.localData[i].checked ? true : isExistChecked;
              count = count + (scope.localData[i].checked || scope.localData[i].disabled ? 1 : 0);
            }
            scope.checkAll[0] = scope.localData.length && count === scope.listView.length && isExistChecked;
            if (scope.onSelectedFunction) {
              scope.onSelectedFunction(returnArr);
            }
          };

          scope.config.selectItem = function (key, val, callOnSelectCallBack) {
            var i, j;
            returnArr.length = 0;
            var post = scope.localData.map(function (e) {
              return e[key];
            }).indexOf(val);
            var page = Math.ceil((post + 1) / scope.config.limitRow);
            if (post >= 0) {
              returnArr.push(scope.localData[post].bkHashKey);
              for (i = 0; i < scope.localData.length; i++) {
                scope.localData[i].checked = i === post;
                //assign new value to listView
                for (j = 0; j < scope.listView.length; j++) {
                  if (scope.localData[i].bkHashKey === scope.listView[j].bkHashKey) {
                    scope.listView[j] = angular.copy(scope.localData[i]);
                  }
                }
              }
            }
            scope.listView = angular.copy(scope.listView);
            scope.config.currentPage = page;
            // scope.listView[post%25].checked = true;

            if (callOnSelectCallBack) {
//              returnArr = [scope.localData[post].bkHashKey];
              var currentIndex = (post % scope.config.limitRow - 1) + ((scope.config.currentPage - 1) * scope.config.limitRow);
              scope.onSelectedFunction(returnArr, {}, currentIndex, scope.listItem[currentIndex]);
            }
          };

          scope.onSelectItem = function (item, $event, $index) {
            if ($event.target.nodeName === 'LABEL') {
              return;
            }
            var arr = [];
            var i = 0;

            if ($event.ctrlKey || $event.target.type === 'checkbox') {
              removeAllItemCurrentPage();
            } else {
              returnArr = [];
            }
            for (i = 0; i < item.length; i++) {
              var index = item[i] + ((scope.config.currentPage - 1) * scope.config.limitRow);
              if (arr.indexOf(scope.localData[index].bkHashKey) === -1) {
                arr.push(scope.localData[index].bkHashKey);
              }
            }
            returnArr = returnArr.concat(arr);

            var currentIndex = $index + ((scope.config.currentPage - 1) * scope.config.limitRow);

            if (scope.onSelectedFunction) {
              scope.onSelectedFunction(returnArr, currentIndex);
            }
          };
          /*Select function*/

          /*Paging*/
          scope.setPage = function (page) {
            scope.config.currentPage = page;
          };
          scope.config.changePage = scope.changePage = function (page) {
            var to = (scope.config.limitRow * page);
            scope.listView = scope.localData.slice(to - scope.config.limitRow, to);
            for (var i = 0; i < scope.listView.length; i++) {
              if (returnArr.indexOf(scope.listView[i].bkHashKey) === -1) {
                scope.listView[i].checked = false;
              } else {
                scope.listView[i].checked = true;
              }
            }
          };
          scope.$watch('config.currentPage', function (val, old) {
            if (val !== old) {
              scope.changePage(val);
            }
          });
          /*Paging*/

          /*Sort*/
          /*Sort*/
          var findValItem = function (item, key) {
            if (item [key]) {
              return item [key];
            } else {
              var arr = key.split('.');
              var result = item [arr[0]];
              for (var i = 1; i < arr.length; i++) {
                if (!result) {
                  return '';
                }
                result = result [arr[i]];
              }
              return result;
            }
          };
          var listBoxSort = function (a, b) {
            if (scope.config.selectFieldList) {
              //Support custom sort
              //Ex: col's field is 'a' but sort by field 'b'
              var fieldName = scope.config.selectFieldList[0].key,
                value1 = findValItem(a, scope.config.selectFieldList[0].key),
                value2 = findValItem(b, scope.config.selectFieldList[0].key),
                sign = scope.asc ? 1 : -1,
                colDef = scope.config.selectFieldList[0];
              return scope.config.sorter(fieldName, value1, value2, sign, colDef, a, b);
            } else {
              if (scope.asc) {
                return $ovUtility.naturalSort(JSON.stringify(a), JSON.stringify(b));
              } else {
                return $ovUtility.naturalSort(JSON.stringify(b), JSON.stringify(a));
              }

            }
          };
          scope.sortFunction = function () {
            if (scope.config.sortType) {
              //scope.config.isCheckAll = [];
              scope.localData.sort(listBoxSort);
              scope.changePage(scope.config.currentPage);
            }
          };
          scope.revertList = function () {
            scope.localData = copyData(scope.listItem);
            if (scope.config.sortType) {
              scope.sortFunction();
            }
            scope.totalPage[0] = Math.ceil(scope.localData.length / scope.config.limitRow);
            scope.config.currentPage = 1;
          };
          scope.sort = function () {
            //scope.config.isCheckAll = [];
            if (scope.config.sortType === 'ASC') {
              scope.config.sortType = 'DESC';
            } else {
              scope.config.sortType = 'ASC';
            }
          };
          /*Sort*/

          /*Search*/
          scope.search = function (keyword) {
            if (keyword !== '') {
              //scope.config.isCheckAll = [];
              var obj = {};
              if (scope.config.selectFieldList) {
                //Support searchBy another column
                if (scope.config.selectFieldList[0].searchBy) {
                  ovDottie.set(obj, scope.config.selectFieldList[0].searchBy, keyword);
                } else {
                  ovDottie.set(obj, scope.config.selectFieldList[0].key, keyword);
                }
                scope.localData = copyData(scope.listItem);
                scope.localData = scope.filter(scope.localData, obj);
                if (scope.config.sortType) {
                  scope.sortFunction();
                }
                scope.totalPage[0] = Math.ceil(scope.localData.length / scope.config.limitRow);
              } else {
                scope.localData = copyData(scope.listItem);
                scope.localData = scope.filter(scope.localData, keyword);
                if (scope.config.sortType) {
                  scope.sortFunction();
                }
                scope.totalPage[0] = Math.ceil(scope.localData.length / scope.config.limitRow);
              }
//              scope.changePage(1);
              scope.config.currentPage = 1;
            } else {
              scope.revertList();
            }
          };

          scope.clear = function () {
            scope.config.searchString = '';
            scope.revertList();
          };
          scope.onSearch = function () {
            _.delay(function () {
              scope.search(scope.config.searchString);
              scope.$digest();
            }, 500);
          };
          /*Search*/

          /*Reset*/
          scope.config.reset = function () {
            scope.checkAll[0] = false;
            for (var i in scope.listItem) {
              delete scope.listItem[i].checked;
            }
            scope.config.currentPage = 1;
            scope.config.sortType = 'ASC';
            scope.clear();
          };

          scope.checkAddToReport = function () {
            return ovDottie.get(scope, 'config.reportOptions.controller');
          };

          /*Add To Report*/
          scope.config.addToReport = function (reportOptions) {
            console.log('Not support in traning mode');
          };

          /*watch listItem*/
          scope.$watchCollection('listItem', updateListFn);

          if (angular.isDefined(scope.config.mapFunction) && scope.config.mapFunction !== null) {
            var func = {};
            for (var i = 0; i < scope.config.mapFunction.length; i++) {
              func = scope.config.mapFunction[i];
              scope[func.from] = func.to;
            }
          }

          if (angular.isDefined(scope.functionList) && scope.functionList !== null) {
            angular.forEach(scope.functionList, function (fn, key) {
              scope[key] = fn;
            });
          }

          if (angular.isFunction(scope.config.onListInitCallback)) {
            scope.config.onListInitCallback();
          }
        }]
      };
    }])
    .directive('ovNgList', ['$compile', '$http', '$templateCache', function ($compile, $http, $templateCache) {
      return {
        restrict: 'AE',
        scope: true,
        link: function (scope, element) {
          var TEMPLATE_URL = scope.config.useVirtualRepeat ? 'ov_components/ovNgListBox/ovNgListVirtualRepeat.html' :
            'ov_components/ovNgListBox/ovNgList.html';

          $http.get(TEMPLATE_URL, {cache: $templateCache}).then(function (result) {
            element.html(result.data).show();
            $compile(element.contents())(scope);
          });

          var selected = [];
          scope.selectedIndex = {};

          scope.itemChange = function (index) {
            var allCheck = true;
            if (scope.listView[index].disabled) {
              scope.listView[index].checked = false;
            }
            for (var i = 0; i < scope.listView.length; i++) {
              if (!scope.listView[i].checked) {
                allCheck = false;
                break;
              }
            }
            scope.checkAll[0] = allCheck;
            var event = {};
            event.target = {};
            event.target.type = 'checkbox';
            scope.selectItem(index, event);
          };

          scope.onClickItem = function (index, event, item) {
            if (!item.disabled && !scope.config.preventSelect) {
              if (!$(event.target).closest('[ov-stop-propagation="true"]').length) {
                scope.selectItem(index, event);
              }
            }
          };

          scope.selectItem = function (index, $event) {
            var i;
            var e = $event || window.event;
            var ctrlKey = false;
            var shiftKey = false;
            if (scope.config.multiSelect) {
              ctrlKey = e.ctrlKey;
              shiftKey = e.shiftKey;
            } else {
              $event.ctrlKey = false;
              $event.shiftKey = false;
            }
            if ($event.shiftKey) {
              if (!angular.isDefined(scope.selectedIndex.start) || scope.selectedIndex.start === null) {
                scope.selectedIndex.start = index;
              }
            } else {
              scope.selectedIndex.start = index;
            }
            if (ctrlKey || $event.target.type === 'checkbox') {
              if ($event.target.type !== 'checkbox') {
                scope.listView[index].checked = !scope.listView[index].checked;
              }

              selected.length = 0;
              for (i = 0; i < scope.listView.length; i++) {
                if (scope.listView[i].checked) {
                  selected.push(i);
                }
              }
            } else if ($event.shiftKey) {
              var startIndex = scope.selectedIndex.start, endIndex = index;
              if (scope.selectedIndex.start > index) {
                startIndex = index;
                endIndex = scope.selectedIndex.start;
              }
              selected.length = 0;

              for (i = 0; i < scope.listView.length; i++) {
                if (!scope.listView[i].disabled) {
                  scope.listView[i].checked = false;
                }

                if (scope.listView[i].checked) {
                  selected.push(i);
                }
              }
              for (i = startIndex; i <= endIndex; i++) {
                scope.listView[i].checked = true;
                selected.push(i);
              }
            } else {
              selected.length = 0;
              selected.push(index);
              for (i = 0; i < scope.listView.length; i++) {
                /**
                 * DOQ: PR-209146: if singleSelect and a item is checked and disabled
                 * Can leads to wrong can select another item when this item is still selected (sigleSelect to multiSelect)
                 * Then I check if singleSelect then don't care this item is disabled or not
                 * Reproduce step: in edgeTemplate
                 *  Step1: Apply a switch
                 *  Step2: Go to database change switch's status to Down
                 *  Step3: Go to apply page then add some switch to apply
                 *  Step4: Select one of them them u see both down switch and new switch are chosen
                 */
                if (!scope.listView[i].disabled || !scope.config.multiSelect) {
                  scope.listView[i].checked = false;
                }

                if (scope.listView[i].checked) {
                  selected.push(i);
                }
              }
              scope.listView[index].checked = !scope.listView[index].checked;
            }

            scope.checkAll[0] = scope.checkItem();
            scope.onSelectItem(selected, $event, index);
          };

          scope.checkItem = function () {
            //Count selected items, Check if all data is disabled and no checked => checkAll = false
            var count = 0, isExistChecked;
            for (var i = 0; i < scope.listView.length; i++) {
              isExistChecked = scope.listView[i].checked ? true : isExistChecked;
              count = count + (scope.listView[i].checked || scope.listView[i].disabled ? 1 : 0);
              if (!scope.listView[i].checked && !scope.listView[i].disabled) {
                return false;
              }
            }
            return scope.listView.length && count === scope.listView.length && isExistChecked;
          };

          scope.getItemList = function (item, action) {
            return _.get(item, action.field(item), []);
          };
          /** ttthien:
           * due to PR#216197 on VM Manager - Enable One-Touch SPB
           * support the function which gets items list without default value (an empty array [])
           * this function returns value of port array which is located below each selected device
           * initially, port array is undefined, this value will be used to display defaultBtnLabel
           * reference: defaultActionTemplate.html */
          scope.getItemListWithoutDefaultValue = function (item, action) {
            return _.get(item, action.field(item));
          };
          /** ``` */
          scope.$watch('listView', function (newValue) {
            scope.selectedIndex.start = null;
            scope.checkAll[0] = scope.checkItem();
            if (typeof(scope.onRowsChanged) === 'function') {
              scope.onRowsChanged(newValue);
            }
          });
        }
      };
    }])
  ;
})();
