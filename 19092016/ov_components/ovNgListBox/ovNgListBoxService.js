/**
 * Created by nquanghai on 12/29/14.
 */
(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.services.ovNgListBoxService', [])
    .factory('$ovNgListBoxService', ['AllOvDataViewIds', '$ovDataViewService', '$log', function (AllOvDataViewIds, $ovDataViewService, $log) {
      function saveOvListSettings(id, selectedFields){
        return $ovDataViewService.saveTableConfig({
          id: id,
          tableconfig: {
            lists: selectedFields
          }
        });
      }

      function getOvListSettings(id, selectedFields, hideFields){
        $ovDataViewService.getTableConfig(id).then(
          function success(response){
            if (response && response.data && response.data.response && angular.isArray(response.data.response.tableconfig.lists)) {
              $ovDataViewService.syncSrcToDst(response.data.response.tableconfig.lists, null,
                selectedFields, hideFields,
                AllOvDataViewIds.environmentVal.LIST_PRIMARY_KEY,
                AllOvDataViewIds.environmentVal.LIST_PRIMARY_KEY);
            }else{
              $log.debug('$ovNgListBoxService - getOvListSettings Can not parse data');
            }
          }
        );
      }

      return {
        saveOvListSettings: saveOvListSettings,
        getOvListSettings: getOvListSettings
      };
    }]);
})();
