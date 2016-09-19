(function () {
  'use strict';

  angular.module('ngnms.ovUiComponent', [
    'ngnms.ui.fwk.ovOboe',
    'ngnms.ui.fwk.ovCards',
    'ngnms.ui.fwk.ovAlert',
    'ngnms.ui.fwk.ovDialog',
    'ngnms.ui.fwk.ovTitle',
    'ngnms.ui.fwk.slickMenu',
    'ngnms.ui.fwk.ovNestedList',
    'ngnms.ui.fwk.ovContainer',
    'ngnms.ui.fwk.ovAppState',
    'ngnms.ui.fwk.ovAppSkeleton',
    'ngnms.ui.fwk.ovPagination',
    'ngnms.ui.fwk.ovNgListBox',
    'ngnms.ui.fwk.ovSlickGrid',
    'ngnms.ui.fwk.ovInfinityList.directive',
    'ngnms.ui.fwk.ovSlickDoubleList',
    'ngnms.ui.fwk.ovDataView.directive',
    'ngnms.ui.fwk.ovValidator.directive',
    'ngnms.ui.fwk.ovUxSelect.directive',
    'ngnms.ui.fwk.ovSelectShow.directive',
    'ngnms.ui.fwk.ovResultTable'
  ]);

  angular.module('ngnms.ui.fwk.services', [
    'ngnms.ui.fwk.utility',
    'ngnms.ui.fwk.services.ovDottie',
    'ngnms.ui.fwk.services.ovConstant',
    'ngnms.ui.fwk.services.ovTaskFlow',
    'ngnms.ui.fwk.ovValidator.services',
    'ngnms.ui.fwk.services.ovDataViewService'
  ]);

  angular.module('TrainingApp', [
      'ngRoute',
      'jm.i18next',
      'angularFileUpload',
      'ngnms.ui.fwk.services',
      'ngnms.ovUiComponent',
      'sample.app',
      'music.manager'
    ])
    .config(function ($routeProvider, $i18nextProvider) {
      $i18nextProvider.options = {
        lng: 'eng',
        useCookie: false,
        useLocalStorage: false,
        fallbackLng: 'eng',
        resGetPath: 'locales/__lng__/__ns__.json',
        defaultLoadingValue: ''
      };
    });
})();