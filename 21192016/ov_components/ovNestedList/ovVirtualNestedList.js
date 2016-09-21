'use strict';

angular.module('ngnms.ui.fwk.ovNestedList')
  .directive('ovVirtualNestedList', ['$timeout', '$parse', function (/*$timeout, $parse*/) {
    return{
      restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || 'template/ovNestedList/ovVirtualNestedList-layout.html';
      },
      replace: true,
      scope: {
        root: '=',
        onPreSelectedCallback: '=?',
        onSelectedCallback: '=',
        onPreClickBack: '=',
        onClickBack:'=',
        onParentSelectCallback:'='
      },
      link: function ($scope, element, attrs) {
        $scope.onPreSelectedCallback = (typeof $scope.onPreSelectedCallback === 'function') ? $scope.onPreSelectedCallback : function () { return true; };

        if(typeof attrs.idApp === 'undefined') {
          $scope.idApp = 'nested-list';
        } else {
          $scope.idApp = attrs.idApp + '-nested-list';
        }

        function invokeSelectedCallback (menuItem) {
          $scope.clicked=menuItem;
          if (menuItem && $scope.onSelectedCallback) {
            $scope.onSelectedCallback(menuItem);
          }
        }

        $scope.left2right = '';


        function backToParent(){
          $scope.root = $scope.root.parent;
          $scope.left2right = 'left';
        }

        $scope.clickBack = function () {
          if($scope.onPreClickBack){
            if($scope.onPreClickBack()){
              backToParent();
            }
          }else{
            backToParent();
          }

          if ($scope.onClickBack) {
            if($scope.selected && $scope.selected.hasOwnProperty('parent')){
              $scope.onClickBack($scope.selected.parent);
            }else{
              $scope.onClickBack($scope.clicked);
            }
          }

          $scope.clicked=null;
        };

        $scope.clickMenuItem = function (menuItem) {
          var willInvokeCallback = false;
          if ($scope.onPreSelectedCallback(menuItem)) {
            willInvokeCallback = true;
            if (menuItem.menuItems && menuItem.menuItems.length > 0) {
              $scope.root = menuItem;
              $scope.left2right = 'right';
            } else {
              $scope.selected = menuItem;
            }
          }

          if (willInvokeCallback) {
            invokeSelectedCallback(menuItem);
          }
        };

        //scroll selected item function
        var scrollTo=function(item){
          if(item&&$scope.root.menuItems.length>0){
            var index,listElem = element.find('.ov-nested-item-container');
            for(var i=0;i<=$scope.root.menuItems.length;i++){
              var menuItem=$scope.root.menuItems[i];
              if(angular.equals(item,menuItem)){
                index=i;
                break;
              }
            }
            listElem.scrollTop((index)*30);
          }
        };

        $scope.onParentSelect = function(item){
          if($scope.onParentSelectCallback && $scope.root.clickable ===true){
            $scope.onParentSelectCallback(item);
          }
        };

        $scope.$watch(function () {
          return $scope.$parent.$eval(attrs.selected);
        }, function(val) {
          if (val !== undefined) {
            if (!val.menuItems) {
              if(val.hasOwnProperty('parent')){
                $scope.root = val.parent;
              }
            } else {
              $scope.root = val;
            }
          }
          $scope.selected = val;
          scrollTo($scope.selected);
        });

        //event move item from ctrl
        $scope.$on('UPDATE_ROOT',function(e,args){
          if(args.menuItem.hasOwnProperty('menuItems')){
            $scope.root = args.menuItem;
            $scope.left2right = 'left';
          }
        });
        $scope.$emit ('UPDATE_MENU');
      }
    };
  }]);
