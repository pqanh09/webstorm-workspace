/**
 * Created by pttthuan on 1/15/2016.
 */
(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovResultTable')
    .constant('ovResultTableConstant', {
      operationTargetSuccess: 'OPERATION_TARGET_SUCCESS',
      operationTargetFailed: 'OPERATION_TARGET_FAILED',
      endTarget: 'END_TARGET',
      subOperationFailed: 'SUB_OPERATION_FAILED',
      subOperationSuccess: 'SUB_OPERATION_SUCCESS',
      successOperation: 'SUCCESS_OPERATION',
      errorOperation: 'ERROR_OPERATION',
      endRequest: 'END_REQUEST',
      code: 'code',
      success: 'success',
      error: 'error',
      warning: 'warning',
      other:'other',
      successCss: 'text-success',
      errorCss: 'text-danger',
      warningCss: 'text-warning',
      successIcon: 'fa fa-check-circle-o fa-2x text-success',
      errorIcon: 'fa fa-times-circle-o fa-2x text-danger',
      warningIcon: 'fa fa-exclamation-circle fa-2x text-warning',
      loading: 'ov-result-loading',
      appId: {
        analytic: {
          profiles: 'analytic-profile-app'
        },
        vlanManager: {
          vlan: {
            create: 'vlan-manager-vlan-create-vlan',
            delete: 'vlan-manager-vlan-delete-vlan',
            poll: 'vlan-manager-vlan-poll',
            view: {
              spanningTree: {
                bridgeEdit: 'vlan-manager-vlan-spanning-tree-bridge-edit',
                portsEdit: 'vlan-manager-vlan-spanning-tree-ports-edit'
              }
            }
          },
          mvrp: {
            globalConfig: 'vlan-manager--mvrp--global-config--result-table',
            portConfig: 'vlan-manager--mvrp--port-config--result-table'
          }
        }
      }
    });
})();
