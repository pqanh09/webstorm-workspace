/**
 * @ngdoc directive
 * @name ov-component.directive:ovNestedList
 * @restrict E
 * @description
 * Sidebar menu component
 * @param {object} root data object.
 * @param {object=} selected current selected object.
 * @param {function=} onSelectedCallback call back function to be executed when select an item
 * @param {function=} onPreSelectedCallback call back function to be executed before when pre-select an item
 * @param {string=} idApp An ID to be added to the element to support automation test  e.g. id-app="test"
 *
 * @example
 * **Basic Example:**
 *<pre>
 *<!-- HTML -->
 <ov-nested-list
   id-app="test-id"
   root="ctrl.sideBarMenu">
 </ov-nested-list>
 *</pre>
 *<pre>
 * //JS
 * ctrl.sideBarMenu  = getSideBarMenu();
 *
 * //get sidebar menu data
 * function getSideBarMenu(){
      var sideBarMenu = {
          id: 'demo',
          title: 'Demo',
          menuItems: []
        },
        ovUxSelect = {
          id: 'ov-ux-select',
          title: 'ovUxSelect',
          templateUrl: 'ov-component-demo/ov-ux-select-demo/ov-ux-select-demo.html',
          parent: sideBarMenu
        },
        ovDataView = {
          id: 'ov-data-view',
          title: 'ovDataViewDemo',
          templateUrl: 'ov-component-demo/ov-data-view/ov-data-view-demo.html',
          parent: sideBarMenu
        };

      sideBarMenu.menuItems= [ovUxSelect, ovDataView];

      return sideBarMenu;
    }

 *</pre>
 *
 * **More Example:**
 *<pre>
 *<!-- HTML -->
 <ov-nested-list
   id-app="test-id"
   root="ctrl.sideBarMenu"
   on-selected-callback="ctrl.onMenuItemSelected"
   selected="ctrl.selectedMenuItem"
   on-pre-selected-callback="ctrl.onMenuItemPreSelected">
 </ov-nested-list>
 *</pre>

 *<pre>
 * //JS
   ctrl.sideBarMenu  = getSideBarMenu();

   ctrl.onMenuItemSelected = function(item){
    console.log(item);
   }

  ctrl.onMenuItemPreSelected = function(item){
    console.log(item);
   }

 *</pre>
 *
 */


(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovNestedList', [])
    .directive('nlHookAnimation', ['$animate', function($animate) {
      return {
        link: function ($scope, elm, attrs) {
          var parent = elm.parent().parent();
          $scope.$watch(function () {
            return $scope.$parent.$eval(attrs.nlHookAnimation);
          }, function (val) {
            if (val === 'left') {
              parent.addClass('noScrollBar');
              $animate.addClass(elm, 'animate-enter-left', function() {
                setTimeout(function () {
                  elm.removeClass('animate-enter-left');
                  parent.removeClass('noScrollBar');
                }, 500);
              });
            } else if (val === 'right') {
              $animate.addClass(elm, 'animate-enter-right', function () {
                parent.addClass('noScrollBar');
                setTimeout(function () {
                  elm.removeClass('animate-enter-right');
                  parent.removeClass('noScrollBar');
                }, 500);
              });
            }
          });
        }
      };
    }])
    .directive('ovNestedList', ['$timeout', '$parse', function (/*$timeout, $parse*/) {
      return{
        restrict: 'E',
        templateUrl: function(elem,attrs) {
          return attrs.templateUrl || 'ov_components/ovNestedList/ovNestedList-layout.html';
        },
        replace: true,
        scope: {
          root: '=',
          onPreSelectedCallback: '=?',
          onSelectedCallback: '=',
          onPreClickBack: '=',
          onClickBack:'='
        },
        link: function ($scope, element, attrs) {
          $scope.onPreSelectedCallback = (typeof $scope.onPreSelectedCallback === 'function') ? $scope.onPreSelectedCallback : function () { return true; };
          var ITEM_CSS_CLASS_PREFIX = 'ov-nested-list-item-level-';

          if(typeof attrs.idApp === 'undefined') {
            $scope.idApp = 'nested-list';
          } else {
            $scope.idApp = attrs.idApp + '-nested-list';
          }

          $scope.getCssClassByItemLevel = function getCssClassByItemLevel(itemLevel) {
            var res = '';
            if (itemLevel && itemLevel > 1) {
              res = ITEM_CSS_CLASS_PREFIX + itemLevel;
            }

            return res;
          };

          function invokeSelectedCallback (menuItem) {
            $scope.clicked=menuItem;
            if (menuItem && $scope.onSelectedCallback) {
              $scope.onSelectedCallback(menuItem);
            }
          }

          $scope.left2right = '';

//        $scope.selected = $scope.$parent.$eval(attrs.selected);
//        invokeSelectedCallback($scope.selected);

          function backToParent(){
            $scope.root = $scope.root.parent;
            $scope.left2right = 'left';
          }

          $scope.clickBack = function () {
//          $scope.root = $scope.root.parent;
//          $scope.left2right = 'left';
//         // $scope.selected = null;
//          if ($scope.onClickBack) {
//            if($scope.selected && $scope.selected.hasOwnProperty('parent')){
//              $scope.onClickBack($scope.selected.parent);
//            }else{
//              $scope.onClickBack($scope.clicked);
//            }
//          }
//          $scope.clicked=null;
////          $scope.selected=null;
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
            //invokeSelectedCallback($scope.selected);
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
})();


