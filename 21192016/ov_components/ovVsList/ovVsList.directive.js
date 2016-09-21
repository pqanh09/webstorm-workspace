(function () {
  'use strict';

  angular
    .module('ngnms.ui.fwk.ovVsList', [])
    .directive('ovVsList', directiveFunction)
    .controller('VsListController', ControllerFunction)
    .factory('ovVsListService', serviceFunction);


  // ----- directiveFunction -----
  directiveFunction.$inject = [];
  function directiveFunction() {

    var directive = {
      restrict: 'E',
      templateUrl: 'ov_components/ovVsList/ov-vs-list.directive.html',
      scope: {},
      controller: 'VsListController',
      controllerAs: 'vm',
      bindToController: {
        listData: '=',
        listConfig: '=',
        handler: '=?',
        onItemClick: '=?'
      }
    };

    return directive;
  }

  // ----- ControllerFunction -----
  ControllerFunction.$inject = ['$scope', 'ovVsListService', '$ovUtility', '$i18next'];
  function ControllerFunction($scope, ovVsListService, $ovUtility, $i18next) {
    var vm = this;

    var defaultConfig = {
      id: 'vsList',
      itemTemplateUrl: 'ov_components/ovVsList/ov-vs-list-item.tpl.html',
      headerTemplateUrl: 'ov_components/ovVsList/ov-vs-list-header.tpl.html',
      rowHeight: 50,
      fieldList: [],
      emptyMessage: 'common.noItems'
    };

    vm.config = angular.extend({}, defaultConfig, vm.listConfig);

    //mapping i18key fieldList
    angular.forEach(vm.config.fieldList, function (f) {
      f.name = $i18next(f.i18nkey);
    });

    var defaultCache = {
      primaryKey: _.first(vm.config.fieldList).key
    };

    if (!ovVsListService.cache[vm.config.id]) {
      ovVsListService.cache[vm.config.id] = defaultCache;
    }
    vm.cache = ovVsListService.cache[vm.config.id];

    vm.resetSearch = function resetSearch() {
      vm.cache.searchText = '';
    };

    vm.sort = function sort() {
      vm.cache.sortDesc = !vm.cache.sortDesc;
      vm.listItems = vm.listData.sort(sortList);
    };

    vm.getSecondary = function getSecondary() {
      return _.reject(vm.config.fieldList, 'key', vm.cache.primaryKey);
    };


    vm.isChildren = function isChildren(item) {
      return vm.getParentName(item);
    };

    vm.isParent = function isParent(item) {
      return vm.getChildren(item);
    };

    vm.getParentName = function getParentName(item) {
      return _.get(item, 'parent');
    };

    vm.handler.getParent = function getParent(item){
      return _.get(vm.itemObject, vm.getParentName(item));
    };

    vm.getChildren = function getChildren(item) {
      return _.get(item, vm.config.childrenKey || 'children');
    };

    vm.getName = function getName(item) {
      return _.get(item, vm.cache.primaryKey, '');
    };

    vm.onClick = function onItemClick(item) {
      if (vm.onItemClick) {
        vm.onItemClick(item);
      }
      if (_.size(vm.getChildren(item)) > 0) {
        item.expanded = !item.expanded;
        var children = vm.getChildren(item);
        hideChildren(children, item);
      }
    };

    vm.filter = function filter(item) {
      var search = (item.search || vm.getName(item)).toLowerCase(),
        searchText = _.get(vm.cache, 'searchText', '').toLowerCase();
      return !item.hidden && _.includes(search, searchText);
    };

    function hideChildren(children, parent) {
      angular.forEach(children, function (child) {
        child.hidden = !parent.expanded;
      });
    }


    function sortList(a, b) {
      var primaryKey = vm.cache.primaryKey;
      return vm.cache.sortDesc ? $ovUtility.naturalSort(b[primaryKey], a[primaryKey]) : $ovUtility.naturalSort(a[primaryKey], b[primaryKey]);
    }

    /*    function parseGroupByData(list){
     var group = _.groupBy(list, vm.config.groupBy);
     var flatList = [];
     angular.forEach(group, function (value) {
     var item = {
     name: _.get(value, '0.' + vm.config.groupBy),
     children: value
     };
     flatList.push(item);
     flatList = flatList.concat(value);
     });
     return flatList;
     }*/

    function addParent(children, parent) {
      angular.forEach(children, function (child) {
        var value = _.get(child, 'value', '');
        if(vm.config.getSearchValue){
          value += vm.config.getSearchValue(value);
        }
        child.parent = vm.getName(parent);
        child.search = vm.getName(child) + value + vm.getName(parent);
        parent.search += vm.getName(child) + value;
        parent.expanded = vm.config.expandedAll;
        child.hidden = !parent.expanded;
      });
    }

    function parseChildrenData(list) {
      var flatList = [];
      vm.itemObject = {};
      angular.forEach(list, function (item) {
        var name = vm.getName(item);
        item.search = vm.getName(item);
        vm.itemObject[name] = item;
        flatList.push(item);
        var children = vm.getChildren(item);
        if (children) {
          addParent(children, item);
          flatList = flatList.concat(children);
        }
      });
      return flatList;
    }

    vm.handler.render = render;


    function render(){
      if (vm.config.childrenKey) {
        vm.listItems = parseChildrenData(vm.listData);
      }else{
        vm.listItems = vm.listData;
      }
    }

    $scope.$watch('vm.listData', function (newVal) {
      if (newVal) {
        render();
      }

    });
  }


  // ----- directiveFunction -----
  serviceFunction.$inject = [];
  function serviceFunction() {
    var service = {
      cache: {}
    };
    return service;
  }

})();
