(function () {
  'use strict';

  angular.module('ngnms.ui.fwk.ovResultTable')
    .controller('DependencyResultController', ['$rootScope', '$scope', '$window', 'ovLocation', 'ovConstant',

      function ($rootScope, $scope, $window, ovLocation, ovConstant) {

        var vm = this;

        vm.item = $scope.item;
        vm.dependencyData = [];
        var NAME = 'name';

        var selectedFieldList = [
          {key: 'friendlyName'},
          {key: 'resultTimestampTranslated'}
        ];
        var defaultConfig = {
          id: 'dependency-result-control',
          fieldList: [
            {key: NAME}
          ],

          expandedAll: true,
          itemTemplateUrl: 'ov_components/ovResultTable/resultDependency/dependency-result-item.tpl.html',
          childrenKey: 'child'
        };
        vm.config = defaultConfig;
        vm.handler = {
          offset: 2,
          goToAppDependency: goToAppDependency
        };

        _.forEach(vm.item.data, function (element) {
          var object = {};
          var arrayChild;

          var objectDependency = _.get(ovConstant.urlApp, element.id);

          if (objectDependency) {
            object.name = objectDependency.name;
            arrayChild = _.map(element.objects, function (obj) {
              return {
                id: element.id,
                objectId: objectDependency,
                name: obj[objectDependency.key]
              };
            });
            object.child = arrayChild;
            vm.dependencyData.push(object);
          }
        });

        function goToAppDependency(item) {
          if (item.objectId) {
            var objectDependency = {
              listName: [
                {name: item.name}
              ]
            };
            var w = $window.open(ovLocation.baseHref(item.objectId.url), '_blank');
            w.objectDependency = objectDependency;
          }
        }

        //ng-list
        vm.listBoxConfig = {};
        vm.listBoxConfig.config = {
          id: 'id-result-dependency-app',
          sortBy: 'resultTimestampTranslated',
          selectFieldList: selectedFieldList,
          showHeader: true,
          headerTemplate: 'ov_components/ovResultTable/ovResultTableHeaderDefault.html',
          itemTemplate: 'ov_components/ovResultTable/ovResultTableDetailDefault.html',
          preventSelect: true,
          searchString: '',
          currentPage: 1,
          limitRow: 25,
          maxHeight: 900,
          showFooter: false,
          useVirtualRepeat: true,
          heightOptions: {
            ovResize: 150
          }
        };
        vm.listBoxData = vm.item.messageArr;

      }]);

})();
