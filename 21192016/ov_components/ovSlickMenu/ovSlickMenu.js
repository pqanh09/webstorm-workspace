(function () {
  'use strict';
  //ignore jshint warning function was used before was defined
  /* jshint latedef:nofunc */
  angular.module('ngnms.ui.fwk.slickMenu', ['jm.i18next']);

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovSlickMenu
   * @restrict AE
   * @description
   * A menu like toolbar icons which contains horizontally list of buttons. It can be displayed in form of pop-up menu
   *
   * @param {array} menuData List of button objects. Each button object must contain following properties:
   * * `id`: ID for automation test
   * * `onClick`: callback function which will be called when the button is clicked
   * * `titleI18key`: i18n key used for tooltip if name of the button is not specified and full name when the menu is displayed in small mode
   * * `name`: name of the button displayed when the menu is displayed in large mode and for tooltip
   * * `iconClass`: kind of Font Awesome CSS class for icon
   * * `iconClassShowMode`: in which mode the icon class can be used. Acceptable value: 'largeScreen' and 'smallScreen'
   * * `checkDisabled`: callback function which is used to detect when the button is disabled. Return true if the button should be disabled
   * * `permission`: permission key which is used by OV to indicate whether or not user can have permission on this button. If use does not have permission, then disable the button
   * * `checkPermission`: callback function which is used to indicate whether or not user can have permission on this button. If use does not have permission, then disable the button
   * * `disabled`: boolean value to disable (if true)/enable (if false) the button
   * * `isHidden`: callback function which is used to show (if returns false)/hide (if returns true) the button
   * * `groupId`: string value which declares if the button is joined
   * * `checkGroupActive`: callback function which declares when the group button is active
   * * `btnClass`: Custom CSS class of the button
   * * `type`: Button type. Acceptable types: 'header', 'separator', 'button', 'item', 'ovDataView', and 'ovDataViewBtn'
   *
   * @param {object} menuConfig Configuration object which can be generated from <a href="/api/ov-component.service:ovSlickMenuBuilder">ovSlickMenuBuilder</a>
   *
   * */

  ovSlickMenuController.$inject = ['$scope', '$window', '$i18next', '$rootScope', 'ovSlickMenuConstant', '$timeout'];
  function ovSlickMenuController($scope, $window, $i18next, $rootScope, ovSlickMenuConstant, $timeout) {
    /*jshint validthis:true*/
    var vm = this, viewPort = $($window);
    vm.menuList = {
      state: false,
      show: function () {
        this.state = true;
      },
      getState: function () {
        return this.state;
      },
      hide: function () {
        this.state = false;
      },
      toggle: function () {
        this.state = !this.state;
      }
    };
    vm.openHelp = $rootScope.openHelp;

    vm.showModeBreakPoint = true;
    //if(vm.menuData){
    //  return false;
    //}
    if (!vm.menuConfig) {
      return false;
    } else {
      vm.menuConfig.toggleButtonTemplate = vm.menuConfig.toggleButtonTemplate || 'ov_components/ovSlickMenu/template/defaultToggleButton.tpl.html';
      if (angular.isUndefined(vm.menuConfig.showMenuButton)) {
        var defaultConfig = {
          titleI18key: 'common.showMenu',
          id: 'show-menu-button',
          btnClass: 'btn btn-default',
          iconClass: 'fa fa-ellipsis-v fa-2x'
        };
        vm.menuConfig.showMenuButton = angular.extend(defaultConfig, vm.menuConfig.showMenuButton);
      }
    }
    // if user don't declare minWidth, use 832px is default minWidth
    if (angular.isUndefined(vm.menuConfig.minWidth)) {
      vm.menuConfig.minWidth = '832px';
    }
    vm.menuConfig.templateUrl = vm.menuConfig.templateUrl ||
      'ov_components/ovSlickMenu/template/ovSlickMenuDefaultTemplate.html';
    var mq = window.matchMedia('(min-width:' + vm.menuConfig.minWidth + ')');


    //if user did not set btnClass set default css class for every item
    //if (angular.isDefined(vm.menuData)) {
    //  for (var i = 0; i < vm.menuData.length; i++) {
    //    var item = vm.menuData[i];
    //    if (angular.isDefined(item)) {
    //      if (angular.isUndefined(item.btnClass)) {
    //        item.btnClass = 'btn btn-default';
    //      }
    //      if (angular.isUndefined(item.disabled)) {
    //        item.disabled = false;
    //      }
    //    }
    //  }
    //}

    vm.isShowLargeMode = function () {
      var result;
      if (vm.menuConfig.isShowLargeMode) {
        result = vm.menuConfig.isShowLargeMode(vm.menuConfig, ovSlickMenuConstant, getBreakPoint);
      } else {
        result = vm.menuConfig.showMode === ovSlickMenuConstant.ONY_LARGE_MODE ||
          ((!vm.menuConfig.showMode || vm.menuConfig.showMode === ovSlickMenuConstant.BOTH) && getBreakPoint());
      }
      return result;
    };
    vm.isShowSmallMode = function () {
      var result;
      if (vm.menuConfig.isShowSmallMode) {
        result = vm.menuConfig.isShowSmallMode(vm.menuConfig, ovSlickMenuConstant, getBreakPoint);
      } else {
        result = vm.menuConfig.showMode === ovSlickMenuConstant.ONY_SMALL_MODE ||
          ((!vm.menuConfig.showMode || vm.menuConfig.showMode === ovSlickMenuConstant.BOTH) && !getBreakPoint());
      }
      return result;
    };

    //wrap buttons for button groups
    vm.wrapBtnGroup = function () {
      var tempGroupId = '';
      angular.forEach(vm.menuData, function (value) {
        if (angular.isDefined(value.groupId) && value.groupId !== tempGroupId) {
          tempGroupId = value.groupId;
          $('.' + tempGroupId).wrapAll('<div class="btn-group"></div>');
        }
      });
    };

    function addDefaultBtnClass() {
      _.forEach(vm.menuData, function (menuIem) {
        menuIem.btnClass = menuIem.btnClass || 'btn btn-default';
      });
    }

    function wrapOnClickFunction() {
      angular.forEach(vm.menuData, function (menuItem) {
        menuItem.wrappedOnClick = function () {
          if (menuItem.disableGroupActive) {
            menuItem.onClick();
          } else {
            //prevent reclick on activated button in group
            if (!menuItem.groupId || !menuItem.groupActive) {
              if (menuItem.groupId) {
                //disable active status of group's button
                angular.forEach(vm.menuData, function (menu) {
                  if (menu.groupId === menuItem.groupId) {
                    menu.groupActive = false;
                  }
                });
                //enable active status
                menuItem.groupActive = true;
              }
              menuItem.onClick();
            }
          }
          vm.menuList.hide();
        };
      });
    }

    $scope.$watchCollection('vm.menuData', function (/*newVal, oldVal*/) {
      addDefaultBtnClass();
      wrapOnClickFunction();
    });

    vm.isShowIconClass = function (item, mode) {
      if (item.iconClassShowMode) {
        if (safeStringCompare(item.iconClassShowMode, ovSlickMenuConstant.BOTH)) {
          return true;
        } else {
          return safeStringCompare(item.iconClassShowMode, mode);
        }
      } else {
        return true;
      }
    };
    vm.isShowInSmallScreen = function (item) {
      return item &&
        (!item.showMode ||
        safeStringCompare(item.showMode, ovSlickMenuConstant.BOTH) ||
        safeStringCompare(item.showMode, ovSlickMenuConstant.SMALL));
    };
    vm.isShowInLargeScreen = function (item) {
      return item && !safeStringCompare(item.type, ovSlickMenuConstant.SEPARATOR) && !safeStringCompare(item.type, ovSlickMenuConstant.HEADER) &&
        (!item.showMode ||
        safeStringCompare(item.type, ovSlickMenuConstant.BOTH) ||
        safeStringCompare(item.type, ovSlickMenuConstant.LARGE));
    };

    /**
     * compare two string ignore case
     * @param firstString
     * @param secondString
     * @returns {boolean}
     */
    function safeStringCompare(firstString, secondString) {
      if (angular.isString(firstString) && angular.isString(secondString)) {
        return firstString.toUpperCase() === secondString.toUpperCase();
      } else {
        return firstString === secondString;
      }
    }

    vm.getButtonTitle = function (item) {
      if (item) {
        return item.name ? item.name : $i18next(item.titleI18key);
      }
    };
    function checkCapexPermission(item) {
      return item.permission ? $rootScope.hasPermission(item.permission) : true;
    }

    vm.checkPermission = function (item) {
      return (item.checkPermission || checkCapexPermission)(item);
    };

    function updateBreakPoint() {
      //media-query in javascript: if min-width condition (window.matchMedia(YOUR_CONDITION)) is satisfied, mq.matches will be true
      $timeout(function () {
        vm.showModeBreakPoint = mq.matches;
      });
    }

    function getBreakPoint() {
      return vm.showModeBreakPoint;
    }

    viewPort.on('resize', updateBreakPoint);
    //functions run on controller start
    //wrap onClick
    wrapOnClickFunction();
    addDefaultBtnClass();
    updateBreakPoint();


    //click on html. This replace using of 'docClick' directive
    var buttonId = '#' + vm.menuConfig.idPrefix;
    if (typeof vm.menuConfig.showMenuButton.id !== 'undefined') {
      buttonId += vm.menuConfig.showMenuButton.id;
    }

    var onClickHtml = function (event) {
      if (!$(event.target).closest(buttonId).length) {
        $scope.$apply(function () {
          vm.menuList.hide();
        });
      }
    };
    $('html').on('click.ovSlickMenu', onClickHtml);
    $scope.$on('$destroy', function () {
      viewPort.off('resize', updateBreakPoint);
      $('html').off('click.ovSlickMenu', onClickHtml);
    });
  }

  ovSlickMenu.$inject = [];
  function ovSlickMenu() {
    return {
      scope: true,
      restrict: 'AE',
      templateUrl: 'ov_components/ovSlickMenu/template/ovSlickMenu.html',
      bindToController: {
        menuData: '=',
        menuConfig: '='
      },
      controller: ovSlickMenuController,
      controllerAs: 'vm',
      link: function (/*scope, elem, attrs*/) {

      }
    };
  }

  angular.module('ngnms.ui.fwk.slickMenu')
    .constant('ovSlickMenuConstant', {
      BOTH: 'BOTH',
      SEPARATOR: 'SEPARATOR',
      getSeparator: function () {
        return {
          type: 'SEPARATOR'
        };
      },
      SEPARATOR_ITEM: {
        type: 'SEPARATOR'
      },
      HEADER: 'HEADER',
      LARGE: 'LARGE',
      SMALL: 'SMALL',
      DEFAULT_MIN_WITH: '832px',
      ONY_LARGE_MODE: 'ONY_LARGE_MODE',
      ONY_SMALL_MODE: 'ONY_SMALL_MODE'
    })
    .controller('ovSlickMenuController', ovSlickMenuController)
    .directive('ovSlickMenu', ovSlickMenu)
    .directive('slickMenuFinishRender', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          if (scope.$last) {
            $timeout(function () {
              scope.$eval(attr.slickMenuFinishRender);
            });
          }
        }
      };
    }])
    //======get item template directive========
    .directive('getItemTemplate', ['$parse', '$compile', '$http', '$templateCache', function ($parse, $compile, $http, $templateCache) {
      return {
        scope: false,
        restrict: 'AE',
        link: function (scope, elm, attrs) {
          var HEADER = 'header';
          scope.item = $parse(attrs.item)(scope);
          scope.isButton = $parse(attrs.button)(scope);
          // Default templates
          var defaultTemplates = {
            header: 'ov_components/ovSlickMenu/template/header.html',
            separator: 'ov_components/ovSlickMenu/template/separator.html',
            item: 'ov_components/ovSlickMenu/template/item.html',
            button: 'ov_components/ovSlickMenu/template/button.html',
            ovDataView: 'ov_components/ovSlickMenu/template/selectField.html',
            ovDataViewBtn: 'ov_components/ovSlickMenu/template/selectFieldBtn.html'
          };

          //Detect item type
          scope.item.type = scope.item.type ? scope.item.type : 'item';

          if (scope.isButton === true) {
            if (scope.item.type === 'item') {
              scope.item.type = 'button';
            }
            if (scope.item.type === 'ovDataView') {
              scope.item.type = 'ovDataViewBtn';
            }
          } else {
            if (scope.item.type === 'button') {
              scope.item.type = 'item';
            }
            if (scope.item.type === 'ovDataViewBtn') {
              scope.item.type = 'ovDataView';
            }
          }
          //Detect custom template
          if (!scope.item.customTemplateUrl) {
            var itemType = scope.item.type.toLowerCase();
            scope.item.templateUrl = defaultTemplates[itemType];
          }
          var childScope = scope.$new();
          var compiledContent;
          //Compile item template
          $http({method: 'GET', url: scope.item.templateUrl, cache: $templateCache}).success(function (data) {
            if (scope && scope.item && scope.item.type === HEADER) {
              data = '<div>' + data + '</div>';
            }
            compiledContent = $compile(elm.html(data).contents())(childScope);
            childScope.$on('$destroy', function () {
              if (compiledContent) {
                compiledContent.remove();
                compiledContent = null;
              }
            });
          });
          scope.$on('$destroy', function () {
            defaultTemplates = null;
            scope.item = null;
            scope.isButton = null;
          });
        }
      };
    }])
    /*    .directive('ovCheckElementWidth', function () {
     return{
     scope: {
     maxWidth: "=",
     minWidth: "=",
     result: "="
     },
     restrict: "A",
     link: function (scope, elm) {
     console.log('elm.width()', elm.width());
     //scope.minWidth = scope.minWidth ? scope.minWidth : 0;
     scope.$watch(function () {
     return elm.width();
     }, function () {
     scope.result = (elm.width() > scope.minWidth) && (elm.width() < scope.maxWidth);
     console.log('elm - ', elm.width(), 'max- ', scope.maxWidth, 'min- ', scope.minWidth);
     console.log('result - ', scope.result);
     });
     }
     }
     })*/
    .directive('ovSlickMenuDisabled', [function () {
      return {
        restrict: 'A',
        priority: -99999,
        link: function (scope, elem, attrs/*, ngClick*/) {
          //backup original ngClick
          var oldNgClick = attrs.ngClick;
          if (oldNgClick) {
            scope.$watch(attrs.ovSlickMenuDisabled, function (val, oldval) {
              //true
              if (!!val) {
                //change color for simulate disable
                elem.css('color', '#aaa');
                //elem.css('cursor', 'pointer');
                elem.css('cursor', 'default');
                //unbind old click function
                elem.unbind('click');
                //bind new click function that do nothing end prevent menu list hide
                elem.bind('click', function (/*$event*/) {
                });
              } else if (oldval) {
                //return original state
                elem.css('color', '');
                elem.css('cursor', 'pointer');
                attrs.$set('ngClick', oldNgClick);
                elem.unbind('click');
                elem.bind('click', function () {
                  scope.$apply(attrs.ngClick);
                });

              }
            });
          }
        }
      };
    }])
    .filter('reverse', function () {
      return function (items) {
        return items.slice().reverse();
      };
    });
  //======this line always line at the end file========
})();
