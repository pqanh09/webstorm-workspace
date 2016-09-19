/**
 \$Id:
 (c) Copyright ALE USA Inc., ${YEAR}
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';
  /**
   * Dependency
   *  modules:
   *    ngnms.ui.fwk.ovDialog
   *    jm.i18next
   *    ngnms.ui.fwk.ovDataView.directive
   *    ngnms.ui.fwk.utility
   *  service: $ovDlgService2, dlgDataBuilder, $i18next, AllOvDataViewIds, $ovUtility
   *  files: ovDialog.js, ng-i18next.js, ovDataViewConstants.js, ovUtility.js
   */

  angular.module('ngnms.ui.fwk.ovSelectShow.directive', [])
    .directive('ovSelectShow', ['$ovDlgService2', 'dlgDataBuilder', '$i18next', '$timeout', 'AllOvDataViewIds', '$ovUtility',
      function ($ovDlgService2, dlgDataBuilder, $i18next, $timeout, AllOvDataViewIds, $ovUtility) {
        return {
          restrict: 'A',
          replace: true,
          scope: {
            ovSelectShow: '=',
            showList: '=?',
            hideList: '=?',
            finishCallback: '=?'
          },
          link: function (scope, element, attrs) {
            var tempDlgId = null;
            scope.selectShowId = null;
            if (attrs.ovSelectShowId && attrs.ovSelectShowId !== true && attrs.ovSelectShowId !== false) {
              tempDlgId = attrs.ovSelectShowId + '-dlg';
              scope.selectShowId = attrs.ovSelectShowId + '-sdl';
            }
            var initSelect = function () {
                scope.ovSelectShow = scope.ovSelectShow || {};
                scope.ovSelectShow.title = scope.ovSelectShow.title || 'ovSelectShow.selectField';
                scope.ovSelectShow.itemTemplateUrl = scope.ovSelectShow.itemTemplateUrl || 'ov_components/ovSelectShow/templates/defaultItem1.html';
                scope.ovSelectShow.itemHeight = scope.ovSelectShow.itemHeight || 35;
                scope.ovSelectShow.searchBy = scope.ovSelectShow.searchBy || 'title';
                scope.showList = scope.showList || [];
                scope.hideList = scope.hideList || [];
                scope.finishCallback = scope.finishCallback || function () {
                };
                scope.vm = {
                  sdlConfig: {
                    itemHeight: scope.ovSelectShow.itemHeight,
                    itemTemplateUrl: scope.ovSelectShow.itemTemplateUrl,
                    searchBy: scope.ovSelectShow.searchBy
                  },
                  tempShowList: [],
                  tempHideList: []
                };
                // Enable/Disable 'OK' button on dialog
                var enableOkBtn;
                scope.$watchCollection(function () {
                  return scope.vm.tempShowList;
                }, function (newValue) {
                  enableOkBtn = !$ovUtility.compareArray(newValue, scope.showList);
                });

                scope.selectDlg = dlgDataBuilder.getBuilder()
                  .setTitle($i18next(scope.ovSelectShow.title))
                  .setTitleIconClasses('fa fa-gear fa-fw')
                  .setFinishLabel($i18next('button-label.ok'))
                  .setCancelLabel($i18next('button-label.cancel'))
                  .setCanFinish(function () {
                    return enableOkBtn;
                  })
                  .setIdDlg(tempDlgId)
                  .setPerformFinish(finishSelect)
                  .setTemplateUrl('ov_components/ovSelectShow/templates/ovSelectShow.html').build();
                scope.selectDlg.escToCancel = true;
              },
              finishSelect = function () {
                scope.showList = angular.copy(scope.vm.tempShowList);
                scope.hideList = angular.copy(scope.vm.tempHideList);
                $timeout(function () {
                  scope.finishCallback();
                });
              },
              showDlg = function () {
                initSelect();

                scope.vm.tempShowList = angular.copy(scope.showList);
                scope.vm.tempHideList = angular.copy(scope.hideList);
                $ovDlgService2.showDialog(scope, scope.selectDlg);
              };


            element.on('click', showDlg);
            scope.$on('$destroy', function () {
              element.unbind();
            });
          }
        };
      }])

    /**
     * @ngdoc service
     * @name ov-component.service:ovSelectShowService
     *
     * @description
     * The service wraps ovSlickDoubleList directive to select show/hide columns/fields of table/list view.
     *
     * @example
     *
     */

    .factory('ovSelectShowService', ['$ovDlgService2', 'dlgDataBuilder', '$i18next', '$timeout', 'AllOvDataViewIds', '$ovUtility',
      function ($ovDlgService2, dlgDataBuilder, $i18next, $timeout, AllOvDataViewIds, $ovUtility) {
        var service = {}, dialogTemplate;

        /**
         * @ngdoc method
         * @name ov-component.service:ovSelectShowService#showSelectDlg
         * @methodOf ov-component.service:ovSelectShowService
         * @description
         * Provide to user a screen to select show/hide columns/fields of table/list view.
         * @param {object} scope The owner scope which contains table/list.
         * @param {object} config This is config object:
         *  * **title**: title of dialog.
         *  * **itemTemplateUrl**: item template url.
         *  * **searchBy**: the property items will be searched by.
         *
         * In shorthand, it can be empty object, the service will use default config.
         * @param {array} sl An array of show items.
         * @param {array} hl An array of hide items.
         * @param {string} idApp Provide unique id of directive for automation test.
         * @param {function} finishCb This function will be called when user clicks on ok button.
         * @param {function} cancelCb This function will be called when user clicks on cancel button.
         *
         * @returns {null} This function does not return.
         */
        service.showSelectDlg = function (scope, config, sl, hl, idApp, finishCb, cancelCb) {
          if (!scope) {
            return;
          }
          var selectDlg, selectScope = scope.$new(), finishCallback, cancelCallback;
          var tempDlgId = null;
          selectScope.selectShowId = null;
          if (idApp && idApp.length > 0) {
            tempDlgId = idApp + '-dlg';
            selectScope.selectShowId = idApp + '-sdl';
          }
          var initSelect = function (config, sl, hl, finishCb) {
              dialogTemplate = 'ov_components/ovSelectShow/templates/ovSelectShow.html';
              selectScope.ovSelectShow = config || {};
              selectScope.ovSelectShow.title = config.title || 'ovSelectShow.selectField';
              selectScope.ovSelectShow.itemTemplateUrl = config.itemTemplateUrl || 'ov_components/ovSelectShow/templates/defaultItem1.html';
              selectScope.ovSelectShow.itemHeight = config.itemHeight || 35;
              selectScope.ovSelectShow.searchBy = config.searchBy || 'title';
              selectScope.showList = sl || [];
              selectScope.hideList = hl || [];
              finishCallback = finishCb || angular.noop;
              cancelCallback = cancelCb || angular.noop;
              selectScope.vm = {
                sdlConfig: {
                  itemHeight: selectScope.ovSelectShow.itemHeight,
                  itemTemplateUrl: selectScope.ovSelectShow.itemTemplateUrl,
                  searchBy: selectScope.ovSelectShow.searchBy
                },
                tempShowList: [],
                tempHideList: []
              };
              if (typeof config.extendSettingConfig === 'object') {
                dialogTemplate = config.extendSettingConfig.extendTemplateUrl;
                selectScope.vm.extendModel = config.extendSettingConfig.extendModel;
              }

              // Enable/Disable 'OK' button on dialog
              var enableOkBtn;
              selectScope.$watchCollection(function () {
                return selectScope.vm.tempShowList;
              }, function (newValue) {
                enableOkBtn = !$ovUtility.compareArray(newValue, selectScope.showList);
              });
              selectDlg = dlgDataBuilder.getBuilder()
                .setTitle($i18next(selectScope.ovSelectShow.title))
                .setTitleIconClasses('fa fa-gear fa-fw')
                .setFinishLabel($i18next('button-label.ok'))
                .setCancelLabel($i18next('button-label.cancel'))
                .setCanFinish(function () {
                  return enableOkBtn || (selectScope.vm.extendModel && selectScope.vm.extendModel.changed);
                })
                .setIdDlg(tempDlgId)
                .setPerformFinish(finishSelect)
                .setPerformCancel(cancelCallback)
                .setTemplateUrl(dialogTemplate).build();
              selectDlg.escToCancel = true;
            },
            finishSelect = function () {
              sl.length = 0;
              hl.length = 0;
              angular.forEach(selectScope.vm.tempShowList, function (i) {
                sl.push(i);
              });
              angular.forEach(selectScope.vm.tempHideList, function (i) {
                hl.push(i);
              });
              $timeout(function () {
                finishCallback();
              });
            };

          initSelect(config, sl, hl, finishCb);

          selectScope.vm.tempShowList = angular.copy(selectScope.showList);
          selectScope.vm.tempHideList = angular.copy(selectScope.hideList);


          $ovDlgService2.showDialog(selectScope, selectDlg);
        };



        /**
         * @ngdoc method
         * @name ov-component.service:ovSelectShowService#showTableSetting
         * @methodOf ov-component.service:ovSelectShowService
         * @description
         * This function is a shortcut of "showSelectDlg", it was customized for "ovDataView" to select show/hide **columns of table** view.
         * Instead of passing 'config', 'sl', 'hl' param, we just need to pass one object 'viewConfig'.
         * Please see viewConfig param and check ovDataview directive for more detail.
         * @param {object} scope The owner scope which contains table/list.
         * @param {object} viewConfig This object is viewConfig property of ov-data-view object.
         * @param {string} [idApp] Provide unique id of directive for automation test.
         * @param {function} [finishCb] This function will be called when user clicks on ok button.
         * @param {function} [cancelCb] This function will be called when user clicks on cancel button.
         *
         * @returns {null} This function does not return.
         */
        service.showTableSetting = function (scope, viewConfig, idApp, finishCb, cancelCb) {
          if (!idApp) {
            idApp = 'select-column-configuration';
          }
          var newFinishCb;
          if (typeof viewConfig.saveTableConfig === 'function') {
            newFinishCb = function () {
              (viewConfig.saveTableConfig || angular.noop)();
              (viewConfig.updateTable || angular.noop)(false);
              if (typeof finishCb === 'function') {
                finishCb();
              }
            };
          }
          service.showSelectDlg(scope, viewConfig.selectShowColumnConfig, viewConfig.tableConfig.gridColumns, viewConfig.tableConfig.hideColumns, idApp, newFinishCb, cancelCb);
        };

        /**
         * @ngdoc method
         * @name ov-component.service:ovSelectShowService#showListSetting
         * @methodOf ov-component.service:ovSelectShowService
         * @description
         * This function is a shortcut of "showSelectDlg", it was customized for "ovDataView" to select show/hide **fields of list** view.
         * Instead of passing 'config', 'sl', 'hl' param, we just need to pass one object 'viewConfig'.
         * Please see viewConfig param and check ovDataview directive for more detail.
         * @param {object} scope The owner scope which contains table/list.
         * @param {object} viewConfig This object is viewConfig property of ov-data-view object.
         * @param {string} [idApp] Provide unique id of directive for automation test.
         * @param {function} [finishCb] This function will be called when user clicks on ok button.
         * @param {function} [cancelCb] This function will be called when user clicks on cancel button.
         *
         * @returns {null} This function does not return.
         */
        service.showListSetting = function (scope, viewConfig, idApp, finishCb, cancelCb) {
          if (!idApp) {
            idApp = 'select-field-configuration';
          }
          var newFinishCb;
          if (typeof viewConfig.saveTableConfig === 'function') {
            newFinishCb = function () {
              (viewConfig.saveTableConfig || angular.noop)();
              (viewConfig.updateTable || angular.noop)(false);
              if (typeof finishCb === 'function') {
                finishCb();
              }
            };
          }
          service.showSelectDlg(scope, viewConfig.selectShowFieldConfig, viewConfig.listConfig.config.selectFieldList, viewConfig.listConfig.config.hideFieldList, idApp, newFinishCb, cancelCb);
        };
        return service;
      }]);
})();
