/**
 \$Id:
 (c) Copyright ALE USA Inc., ${YEAR}
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

/**
 * @ngdoc service
 * @name ov-component.service:$ovDataViewService
 *
 * @description
 * Service of ovDataView component
 *
 * @example
 * **Get column list:**
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
 *    $ovDataViewService.getColumnList(attrs);
 * </pre>
 */

(function () {
  'use strict';
  /**
   * Dependency
   *  modules:
   *    ngnms.ui.fwk.ovDataView.directive
   *    jm.i18next,
   *    ngnms.ui.fwk.services.ovService
   *    ngnms.ui.fwk.utility
   *  service: AllOvDataViewIds, $i18next, ovServiceManager
   *  files: ovDataView.js, ng-i18next.js, mainService.js, ovUtility.js
   */

  angular.module('ngnms.ui.fwk.services.ovDataViewService', [])
    .factory('$ovDataViewService', ['$http', 'AllOvDataViewIds', '$i18next', '$ovUtility', '$q',
      function ($http, AllOvDataViewIds, $i18next, $ovUtility, $q) {
        var ovDataViewCache = {};

        var TABLE_CONFIG_URL = AllOvDataViewIds.url,
          syncSrcToDst = function (srcSCol, srcACol, dstSCol, dstACol, srcField, dstField, syncColItem) {
            var i, j;

            //Move selected item to except item
            angular.forEach(dstSCol, function (item) {
              dstACol.push(angular.copy(item));
            });

            //set length = 0 to prevent lost reference
            dstSCol.length = 0;

            //Synchronize from srcSCol to dstSCol
            for (i = 0; i < srcSCol.length; i++) {
              for (j = 0; j < dstACol.length; j++) {
                if (srcSCol[i][srcField] === dstACol[j][dstField]) {

                  if (angular.isFunction(syncColItem)) {
                    syncColItem(srcSCol[i], dstACol[j]);
                  }
                  dstSCol.push(angular.copy(dstACol[j]));
                  dstACol.splice(j, 1);
                  break;
                }
              }
            }

            //Not allow show empty column
            if (dstSCol.length === 0) {
              angular.forEach(dstACol, function (item) {
                dstSCol.push(angular.copy(item));
              });
              dstACol.length = 0;
            }
          },
          findValueByKey = function (value, list, key) {
            var result = null;
            for (var i = 0; i < list.length; i++) {
              if (list[i][key] === value) {
                return list[i];
              }
            }
            return result;
          },
          saveTableConfig = function (data) {
            return $q.when();
          },
          getTableConfig = function (tableID) {
            return $q.when();
          },
          isTwoObjectEquals = function (obj1, obj2, key) {
            if (!obj1 || !obj2) {
              return false;
            }

            if (key) {
              var value1 = $ovUtility.findValItem(obj1, key),
                value2 = $ovUtility.findValItem(obj2, key);
              return value1 === value2;
            } else {
              return angular.equals(obj1, obj2);
            }
          },
          getCache = function (id) {
            return ovDataViewCache[id];
          },
          putCache = function (id, data) {
            ovDataViewCache[id] = data;
          },
          clearCache = function (id) {
            if (id) {
              ovDataViewCache[id] = undefined;
            } else {
              ovDataViewCache = {};
            }
          },
          showOvSelectBtn = function (aCol, sCol) {
            aCol = aCol || [];
            sCol = sCol || [];
            return aCol.length + sCol.length > 4;
          },
          /**
           * @ngdoc method
           * @name ov-component.service:$ovDataViewService#getColumnList
           * @methodOf ov-component.service:$ovDataViewService
           * @description
           * Generate column for view components (ovDataView, ovNgListBox, ovDetailTable...)
           * @param {object} attrs columns object
           * <pre>
           * Ex:
           * {
           *    column1: {
           *        key1: 'key1',
           *        i18nKey: 'i18nKey1'
           *    }
           * }
           * </pre>
           *
           * @return {array} column list
           */
          getColumnList = function (attrs) {
            // type 0: string, type 1: number, type 2: boolean, type 3: date, type 4: time, type 5: dateTime
            var result = [];
            angular.forEach(attrs, function (value) {
              if (value && !value.ignore){
                value.id = value.field = value.key;
                value.name = value.title = $i18next(value.i18nKey);
                value.type = value.type || 0;
                value.sortable = angular.isDefined(value.sortable) ? value.sortable : true;
                value.resizable = angular.isDefined(value.resizable) ? value.resizable : true;
                value.minWidth = value.minWidth || 200;
                result.push(value);
              }
            });
            return result;
          };

        //Ref: angular natural sort with cache http://jsfiddle.net/wE7H2/3/
        var natCache = {}, natCacheLength = 500000,
          padding = function (value) {
            return '000000000000000000000000000000'.slice(value.length);
          },
          parseNatValue = function (value) {
            value = angular.isDefined(value) && value !== null ? value.toString() : '';
            return value.replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
              if (decimal !== $3) {
                return $0.replace(/(\d+)/g, function ($d) {
                  return padding($d) + $d;
                });
              } else {
                decimal = decimal || '.0';
                return padding(integer) + integer + decimal + padding(decimal);
              }
            });
          },
          getNatValue = function (value) {
            if (natCacheLength.length > natCacheLength) {
              natCache = {};
            }

            if (typeof value === 'boolean' || typeof value === 'number') {
              return value;
            }

            if (natCache[value]) {
              return natCache[value];
            }
            natCache[value] = parseNatValue(value);
            return natCache[value];
          };

        function getInstance(ovDataViewId) {
          /**
           * Deferred lookup of component instance using $component registry
           */
          function waitForInstance() {
            return {};
          }

          return {
            setData: function (data, selectedList) {
              waitForInstance().then(function (instance) {
                instance.setData(data, selectedList);
              });
            },
            resetOvDataViewConfig: function (data, selectedList) {
              waitForInstance().then(function (instance) {
                instance.resetOvDataViewConfig(data, selectedList);
              });
            },
            setSelectedFromCache: function (data, selectedList) {
              waitForInstance().then(function (instance) {
                instance.setSelectedFromCache(data, selectedList);
              });
            }
          };
        }

        return {
          getInstance: getInstance,
          isTwoObjectEquals: isTwoObjectEquals,
          syncSrcToDst: syncSrcToDst,
          saveTableConfig: saveTableConfig,
          getTableConfig: getTableConfig,
          findValueByKey: findValueByKey,
          showOvSelectBtn: showOvSelectBtn,
          getCache: getCache,
          putCache: putCache,
          clearCache: clearCache,
          getColumnList: getColumnList,
          naturalSort: function (a, b) {
            a = getNatValue(a);
            b = getNatValue(b);
            return (a < b) ? -1 : ((a > b) ? 1 : 0);
          }
        };
      }]);
})();
