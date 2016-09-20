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
    .factory('sampleAppOneActionService', serviceFunction);
  serviceFunction.$inject = ['sampleAppOneService', 'ovValidatorServices', '$i18next', 'dlgDataBuilder', '$ovDlgService2', '$q', '$timeout'];
  function serviceFunction(sampleAppOneService, ovValidatorServices, $i18next, dlgDataBuilder, $ovDlgService2, $q, $timeout) {
    var service = {};

    service.decorator = decorator;

    return service;
    /////////////////////////////////////////////////////////////////////////////////

    function decorator(vm, $scope) {

      vm.action = {};

      /**
       * Defined all validator rules
       * Ref: ovValidator (ngDocs)
       */
      vm.action.rules = {
        name: [
          ovValidatorServices.requiredRule,
          {
            validator: function (model) {
              return model && _.size(model) <= 32;
            },
            error: 'sampleApp.menus.sampleOne.msg.nameLength'
          },
          ovValidatorServices.nameRule,
          ovValidatorServices.ASCIIRule,
          {
            validator: function (model) {
              return vm.isEdit() ? true : _.map(vm.dataView.list, function (item) {
                return item[vm.constant.sampleOne.attrs.name.key];
              }).indexOf(model) < 0;
            },
            error: 'sampleApp.menus.sampleOne.msg.nameExist'
          }
        ],
        description: [
          {
            validator: function (model) {
              return _.size(model) <= 256;
            },
            error: 'sampleApp.menus.sampleOne.msg.description'
          }
        ]
      };


      /**
       * Check all rules of a groupId are valid
       * Ref: ovValidator (ngDocs)
       */
      vm.action.isValidForm = function () {
        return ovValidatorServices.checkValidGroup(vm.constant.sampleOne.validatorGroupId);
      };

      //detect data is changed to enable/disable apply button
      vm.action.isChanged = function () {
        return vm.cache.currentItemJson !== angular.toJson(vm.cache.currentItem);
      };


      /**
       * cancel create or edit and go to view mode
       * where vm.cache.state is defined
       * Ref: ovAppState.js -> ovContainer.js
       */
      vm.action.reset = function reset() {
        vm.cache.currentItem = {};
        vm.cache.state.reset();
      };

      /**
       * create and go to view mode
       * where vm.cache.state is defined
       * Ref: ovAppState.js -> ovContainer.js
       */
      vm.action.create = function save() {
        sampleAppOneService.createItem(vm.cache.currentItem);
        vm.cache.alertObject._success($i18next('common.msg.createSuccess'));
        vm.action.reset();
      };

      /**
       * edit and go to view mode
       * where vm.cache.state is defined
       * Ref: ovAppState.js -> ovContainer.js
       */
      vm.action.update = function update() {
        sampleAppOneService.updateItem(vm.cache.currentItem);
        vm.cache.alertObject._success($i18next('common.msg.updateSuccess'));
        vm.action.reset();
      };


      /**
       * delete and show a warning dialog then go to result page
       * Ref: ovDialog, ovResultTable (ngDocs)
       */
      vm.action.delete = function () {
        vm.confirmMsg = $i18next('sampleApp.menus.sampleOne.msg.confirmDelete', {count: vm.dataView.selectedList.length});
        var dialog = dlgDataBuilder.getBuilder()
          .setTitle($i18next('button-label.delete'))
          .setIdDlg('sample-one-delete-item')
          .setTitleIconClasses('fa fa-warning fa-fw')
          .setPerformFinish(deleteCb)
          .setOverrideClass('small-dialog')
          .setTemplateUrl(vm.constant.shared.templateUrl.confirm)
          .build();
        $ovDlgService2.showDialog($scope, dialog);
      };

      //delete items list
      function deleteCb() {
        var listName = _.map(vm.dataView.selectedList, function (item) {
          return item[vm.constant.sampleOne.attrs.name.key];
        });
        vm.cache.state.change(vm.mode.result);
        sampleAppOneService.deleteItems(listName);

        /**
         * Config + data for ovResultTable
         * It seems very complex but please (ngDocs for more details)
         * Also responsePromise is fake response from server (Not need if existing valid api)
         */
        vm.rsListItem = vm.dataView.selectedList;
        vm.rsConfig = {
          config: {
            appId: 'sample-one',
            title: 'Delete profiles',
            parseRsListItem: function (item) {
              return {
                targetId: item.name,
                friendlyName: item.name
              };
            },
            responsePromise: function () {
              var deferred = $q.defer();

              $timeout(function () {
                angular.forEach(vm.dataView.selectedList, function (item) {
                  deferred.notify({
                    status: 200,
                    statusCode: 'SUCCESS',
                    response: {
                      code: 'OPERATION_TARGET_SUCCESS',
                      targetId: item.name,
                      translated: {
                        messageObjectTranslated: 'Delete item ' + item.name + ' successfully.'
                      }
                    }
                  });
                });

                deferred.notify({
                  status: 200,
                  statusCode: 'SUCCESS',
                  response: {
                    code: 'END_REQUEST',
                    translated: {
                      messageObjectTranslated: ''
                    }
                  }
                });
              }, 3000);

              return deferred.promise;
            }
          },
          functionList: {
            okCallback: function () {
              vm.action.reset();
            }
          }
        };
      }
    }
  }
})();