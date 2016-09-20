/**
 * @license OmniVista v1.0
 * (c) 2014-2015 TMA Solutions
 * License:
 */
(function () {
  'use strict';
  // This option prohibits the use of a variable before it was defined.
  /* jshint  latedef:nofunc*/

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovAppSkeleton
   * @element div
   * @restrict AE
   *
   * @description
   * Provide skeleton for new app. It provides sidebar, breadcrumbs and cached the last visited page.
   *
   * @param {string} appId ID used for automation test
   * @param {string} appRootUrl Application root URL
   * @param {object} appHome Sidebar menu item to be selected first time loading
   * @param {string=} [redirectUrl=appRootUrl] URL used to redirect when `appHome` sidebar menu item object cannot be found in `sideBarMenu`
   * @param {object} navData Breadcrumb model, but only contains `appRouteUrl` at the end. Other breadcrumb items from sidebar menu are added automatically by the component.
   *                               It does NOT need to declare `current` sidebar menu item and `onSelected` callback function for navData here.
   *                               Refer to <a href="/api/ov-component.directive:ovBreadcrumb">ovBreadCrumb</a> component
   * @param {object} sideBarMenu SideBarMenu Model.
   *                               Only root sidebar menu object is needed to be used
   *                               Refer to <a href="/api/ov-component.directive:ovNestedList">ovNestedList</a>
   * @param {string=} contentWrapperCss name of wrapper css class name
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // In HTML
   *   <ov-app-skeleton app-id="$ctrl.ovAppSkeleton.appId"
   *     app-route-url="$ctrl.ovAppSkeleton.appRouteUrl"
   *     app-home="$ctrl.ovAppSkeleton.appHome"
   *     nav-data="$ctrl.ovAppSkeleton.navData"
   *     side-bar-menu="$ctrl.ovAppSkeleton.sideBarMenu">
   *   </ov-app-skeleton>
   * </pre>
   *
   * <pre>
   *  // In JS
   *  var SAMPLE_APP_ROUTE = '/sampleApp';
   *
   *  var sideBarMenu = {
   *    id: 'sample-app-root-sidebar-menu',
   *    title: $i18next('Sample App'),
   *    menuItems: [],
   *    disabled: true
   *  };
   *  var home = {
   *    id: 'sample-app-root-sidebar-menu-home',
   *    templateUrl: '/path/to/your/sample/app/home/page.html',
   *    title: $i18next('Home'),
   *    parent: sideBarMenu
   *  };
   *  var greeting = {
   *    id: 'sample-app-root-sidebar-menu-greeting',
   *    templateUrl: '/path/to/your/sample/app/greeting/page.html',
   *    title: $i18next('Greeting'),
   *    parent: sideBarMenu
   *  };
   *  var operation = {
   *    id: 'sample-app-root-sidebar-menu-operation',
   *    title: $i18next('Operation'),
   *    parent: sideBarMenu,
   *    disabled: true,
   *    menuItems: []
   *  };
   *  var copy = {
   *    id: 'sample-app-root-sidebar-menu-operation-copy',
   *    templateUrl: '/path/to/your/sample/app/operation/copy/page.html',
   *    title: $i18next('Copy'),
   *    parent: operation
   *  };
   *  var paste = {
   *    id: 'sample-app-root-sidebar-menu-operation-paste',
   *    templateUrl: '/path/to/your/sample/app/operation/paste/page.html',
   *    title: $i18next('Paste'),
   *    parent: operation
   *  };
   *
   *  // Add all operations
   *  operation.menuItems.push(copy);
   *  operation.menuItems.push(paste);
   *
   *  // Add all sidebar menu items
   *  sideBarMenu.menuItems.push(home);
   *  sideBarMenu.menuItems.push(greeting);
   *  sideBarMenu.menuItems.push(operation);
   *
   *  var navData = {};
   *  navData.list = [
   *    {title:  $i18next('index.menu.groups.home'), iconClasses: 'fa fa-fw fa-home', url: '/'},
   *    {title:  $i18next('Sample App'), iconClasses: '', url: SAMPLE_APP_ROUTE}
   *  ];
   *
   *   $ctrl.ovAppSkeleton = {};
   *   $ctrl.ovAppSkeleton.appId = 'sample-app-id';
   *   $ctrl.ovAppSkeleton.appRouteUrl = SAMPLE_APP_ROUTE;
   *   $ctrl.ovAppSkeleton.appHome = home;
   *   $ctrl.ovAppSkeleton.sideBarMenu = sideBarMenu;
   *   $ctrl.ovAppSkeleton.navData = navData;
   * </pre>
   *
   * */

  /**
   *
   * @name component.directive:ovAppSkeleton
   * @element div
   * @restrict AE
   * @requires $i18next
   * @requires $location
   * @requires ovTaskFlow
   * @requires $routeParams
   * @requires OvTreeModel
   * @requires $log
   * @requires $transition
   * @description
   * Provide skeleton for new app, It provides sidebar, breadcrumbs and cached the last visited page.
   *
   * @param {String} appId ID used to
   * @param {Object} cachedObject Used to cached last visited page
   * @param {String} appRootUrl Root URL
   * @param {String} [[redirectUrl]=appRootUrl] If child route isn't found in sideBarMenu redirect to this URL
   * @param {String} navData Breadcrumb model
   * @param {String} sideBarMenu SideBarMenu Model
   * @param {String} contentWrapperCss name of wrapper css class name
   *
   * @scope controllerAs vm
   * @example
   * ```tips
   * //tips
   You can refer to these files for real app:
   app/scripts/vxlans/wrapper.html
   app/scripts/vxlans/vxlansWrapperCtrl.js
   app/scripts/vxlans/services/vxlansWrapper.js
   * ```
   * ```html
   * //html
   <ov-app-skeleton app-id="vxlans" app-root-url="vm.appRootUrl" redirect-url="vm.redirectUrl"
   cached-object="vm.cachedObject" side-bar-menu="vm.sideBarMenu"
   nav-data="vm.navData" content-wrapper-css="vm.contentWrapperCss"></ov-app-skeleton>
   * ```
   * ```js
   * //js
   vm.sideBarMenu = vxlansWrapperService.getSideBarMenuData();
   vm.navData = vxlansWrapperService.getNavData();
   vm.cachedObject = vxlansWrapperService.cachedObject;
   vm.redirectUrl = 'vxlans/vxlan-service';
   vm.appRootUrl = '/vxlans';
   vm.contentWrapperCss = 'vxlans-right-pane';
   * ```
   */
  angular.module('ngnms.ui.fwk.ovAppSkeleton', ['ngnms.ui.fwk.ovTitle'])
    .directive('ovAppSkeleton', ovAppSkeletonDirective)
    .controller('ovAppSkeletonCtrl', ovAppSkeletonCtrl);
  ovAppSkeletonDirective.$inject = [];

  /**
   *
   * directive constructor
   */
  function ovAppSkeletonDirective() {
    return {
      scope: {
        appId: '=',
        cachedObject: '=?',
        redirectUrl: '=?',
        appHome: '=?',
        appRootUrl: '=?',
        //navData for breadcrumb
        navData: '=?',
        //sidebar data
        sideBarMenu: '=?',
        contentWrapperCss: '=?',
        skeletonConfig: '=?'
      },
      restrict: 'AE',
      templateUrl: 'ov_components/ovAppSkeleton/ovAppSkeleton.html',
      controller: 'ovAppSkeletonCtrl',
      controllerAs: 'vm'
    };
  }

  ovAppSkeletonCtrl.$inject = ['$scope', '$i18next', '$location', 'ovTaskFlow', '$routeParams', '$log', 'ovAppSkeletonCacheService', '$rootScope', 'ovTitle'];
  /**ovUiLogService
   *
   *  controller constructor
   */
  function ovAppSkeletonCtrl($scope, $i18next, $location, ovTaskFlow, $routeParams, $log, ovAppSkeletonCacheService, $rootScope, ovTitle) {
    //<editor-fold desc="decorate objects">

    //jshint validthis:true
    var transEndEvent,
      routeParam,
      sideBarRoot,
      routeArray,
      defaultInitTop,
      vm = this;
      //logger = ovUiLogService.getLogger('ovAppSkeleton');
    //
    if (!$scope.appId) {
      throw new Error('You MUST assigned appId for ovAppSkeletonDirective directive, REMEMBER: add \'\' to app-id attribute e.g app-id = "\'example-id\'"');
    } else if (!$scope.appHome && !$scope.redirectUrl) {
      throw new Error('You MUST assigned appHome(Object) or redirectUrl(string)  for ovAppSkeletonDirective directive');
    }
    ovAppSkeletonCacheService.cacheData[$scope.appId] = ovAppSkeletonCacheService.cacheData[$scope.appId] ?
      ovAppSkeletonCacheService.cacheData[$scope.appId] : new ovAppSkeletonCacheService.CacheObject();
    //
    vm.cachedObject = ovAppSkeletonCacheService.cacheData[$scope.appId];
    vm.sideBarMenu = $scope.sideBarMenu;
    vm.sbHidden = vm.cachedObject.sbHidden;
    vm.navData = $scope.navData;
    vm.navData.displayList = angular.copy(vm.navData.list);

    //vm.navData.onSelected = $scope.data.onBreadcrumbItemClick ;
    vm.currentPageId = '';
    vm.onBreadcrumbItemClick = onBreadcrumbItemClick;
    vm.onMenuItemSelected = onSidebarItemClick;
    vm.preventSelect = preventSelect;
    vm.appId = $scope.appId;
    vm.redirectUrl = $scope.redirectUrl;
    vm.appHome = $scope.appHome;
    vm.appRootUrl = $scope.appRootUrl;
    vm.contentWrapperCss = $scope.contentWrapperCss;
    vm.skeletonConfig = $scope.skeletonConfig ? $scope.skeletonConfig : {};

    //<editor-fold desc="detect configuration">
    vm.skeletonConfig.appId = $scope.appId ? $scope.appId : vm.skeletonConfig.appId;
    //vm.skeletonConfig.cachedObject = $scope.cachedObject ? $scope.cachedObject : vm.skeletonConfig.cachedObject;
    vm.skeletonConfig.redirectUrl = $scope.redirectUrl ? $scope.redirectUrl : vm.skeletonConfig.redirectUrl;
    vm.skeletonConfig.appHome = $scope.appHome ? $scope.appHome : vm.skeletonConfig.appHome;
    vm.skeletonConfig.appRootUrl = $scope.appRootUrl ? $scope.appRootUrl : vm.skeletonConfig.appRootUrl;
    vm.skeletonConfig.navData = $scope.navData ? $scope.navData : vm.skeletonConfig.navData;
    vm.skeletonConfig.sideBarMenu = $scope.sideBarMenu ? $scope.sideBarMenu : vm.skeletonConfig.sideBarMenu;
    vm.skeletonConfig.contentWrapperCss = $scope.contentWrapperCss ? $scope.contentWrapperCss : vm.skeletonConfig.contentWrapperCss;
    //</editor-fold>

    //init top
    defaultInitTop = 89;
    vm.skeletonConfig.initTop = vm.skeletonConfig.initTop ? vm.skeletonConfig.initTop : defaultInitTop;

    //if (!vm.skeletonConfig) {
    //  vm.skeletonConfig = {};
    //  if (angular.isUndefined(vm.skeletonConfig.initTop)) {
    //    vm.skeletonConfig.initTop = defaultInitTop;
    //  }
    //}


    //
    vm.contentTemplateUrl = '';
    vm.toggleMenu = toggleMenu;
    //</editor-fold>

    //<editor-fold desc="triggered when controller start">
    //route object contain all level
    routeArray = [];
    //parse sideBarMenu to tree model
    sideBarRoot = vm.sideBarMenu;

    /**
     * get routeArray from routeParam
     */
    if ($routeParams.route) {
      routeParam = formatRouteParam($routeParams.route);
      //routeArray = separateRouteParam(routeParam);
      routeArray = routeParam.split('/');
    }
    vm.appRootUrl = addEndSplash(vm.appRootUrl);
    redirectToSpecificPage();
    //</editor-fold>

    //broadcast event for browser not support transition
    if (!transEndEvent) {
      $scope.$watch('sbHidden', function () {
        $scope.$broadcast('content.resize');
      });
    }
    //broadcast content.resize event for components.
    vm.contentTransitionEnd = contentTransitionEnd;
    function contentTransitionEnd(/*$event*/) {
      $scope.$broadcast('content.resize');
    }

    /**
     * toggle sidebar menu
     */
    function toggleMenu() {
      vm.sbHidden = !vm.sbHidden;
    }

    /**
     * remove slash "/" characters from string
     * Example: /abc/1/2/3/4/ => abc/1/2/3/4
     * @param sourceString
     * @returns {*}
     */
    function formatRouteParam(sourceString) {
      //example: sourceString : /a/b/c/
      var string = angular.copy(sourceString).toString();
      //remove slash from the beginning of string
      // e.g. /a/b/c/=> a/b/c/
      if (string.indexOf('/') === 0) {
        string = string.slice(1);
      }
      //remove slash from the tail of string
      // e.g. a/b/c/ => a/b/c
      if (string.lastIndexOf('/') === string.length - 1) {
        string = string.slice(0, string.length - 1);
      }
      return string;
    }

    /**
     * redirect page base on route
     */
    function redirectToSpecificPage() {
      //if routeParams exist
      var isRedirectSuccess,
        isRedirectSuccessWithoutParam;
      if ($routeParams.route) {
        //if route right move to specific page, if route is wrong move to ov home page
        //if (redirectBaseOnRouteParam($routeParams.route) === false) {
        isRedirectSuccess = redirectBaseOnRouteParam(routeArray, sideBarRoot);
        if (!isRedirectSuccess) {
          //redirect to home page
          $location.url('/');
        }
        //if routeParams doesn't exist
      } else {
        //if user visited to this app, redirect user to the latest page they visited
        if (vm.cachedObject.lastedPage.routeArr) {
          //if route right move to specific page, if route is wrong move to app home page
          isRedirectSuccessWithoutParam = redirectBaseOnRouteParam(vm.cachedObject.lastedPage.routeArr, sideBarRoot);
          if (isRedirectSuccessWithoutParam === false) {
            //redirect to redirect url
            redirectToHomePage();
          }
        } else {
          //redirect to redirect url
          redirectToHomePage();
        }
      }
    }

    function redirectToHomePage() {
      if (vm.appHome) {
        // set title
        ovTitle.setSuffix(vm.appHome.title);
        changeCurrentPageToHomePage();
      } else {
        $location.url(vm.redirectUrl);
      }
    }


    /**
     * redirect page base on routeArr and rootNode
     * @param routeArr
     * @param sideBarRoot
     * @returns {boolean}
     */
    function redirectBaseOnRouteParam(routeArr, sideBarRoot) {
      var success = false,
        menuItemArray = findMenuItemArray(routeArr, sideBarRoot);
      if (menuItemArray.length !== 0) {
        changePage(menuItemArray, routeArr);
        success = true;
      }
      return success;
    }

    function findMenuItemArray(routeArr, sideBarRoot) {
      var menuItem,
        route,
        result = [],
        i,
        length,
        seekRoot = sideBarRoot;
      for (i = 0, length = routeArr.length; i < length; i++) {
        route = routeArr[i];
        //find menu item in config
        menuItem = findMenuItem(route, seekRoot);
        if (menuItem) {
          result.push(menuItem);
          //check menu item have child menu array
          if (menuItem.menuItems && menuItem.menuItems.length > 0) {
            seekRoot = menuItem;
          } else {
            //break if menuItem doesn't have childMenu and supportParam is true.
            if (!!menuItem.supportParam) {
              if (menuItem.cacheExtendedRouteParam) {
                //add route variable to menuItem
                menuItem.extendedRouteParam = i < routeArr.length - 1 ? routeArr.slice(i+1) : (menuItem.extendedRouteParam || []);
              }
              break;
            }
          }
        } else {
          //if menu item doesn't exist clear result array
          result.length = 0;
          break;
        }

      }
      return result;
    }

    function findMenuItem(route, sideBarItem) {
      var menu,
        i,
        length,
        result = null;
      if (sideBarItem.menuItems) {
        for (i = 0, length = sideBarItem.menuItems.length; i < length; i++) {
          menu = sideBarItem.menuItems[i];
          if (menu.id === route) {
            result = menu;
            break;
          }
        }
      }
      return result;
    }

    function clearCache() {
      vm.cachedObject.selectedMenuItem = {};
      vm.cachedObject.lastedPage = {};
    }

    function changeCurrentPageToHomePage() {
      clearCache();
      vm.navData.current = menuToBreadcrumb(vm.appHome);
      vm.cachedObject.selectedMenuItem = vm.appHome;
      vm.contentTemplateUrl = vm.appHome.templateUrl;
    }

    /**
     *
     */
    function onHomePageClick() {
      changeCurrentPageToHomePage();
      $location.url(vm.appRootUrl);
    }


    /**
     * on side bar menu click
     * @param menuItem
     * @param {Array} routeArr
     */
    function changePage(menuItem, routeArr) {
      changeMenuItem(menuItem, routeArr);
    }

    /**
     * on nested list click
     * @param menuItem
     */
    function onSidebarItemClick(menuItem) {
      var routeArr,
        path;
      if (menuItem.id === 'appHome') {
        onHomePageClick();
      } else {
        if (vm.cachedObject.selectedMenuItem.id !== menuItem.id) {
          if (!menuItem.menuItems) {
            routeArr = findMenuArray(menuItem);
            path = '';
            angular.forEach(routeArr, function (route) {
              path += route.id + '/';
            });
            if(menuItem.extendedRouteParam && menuItem.extendedRouteParam.length) {
              addEndSplash(path);
              path += menuItem.extendedRouteParam.join('/');
            }
            path = removeEndSplash(path);
            $location.url(path);
          }
        } else {
          //support click on menu to return the main page like Analytic
          if (menuItem.onMenuItemReclick && angular.isFunction(menuItem.onMenuItemReclick)) {
            menuItem.onMenuItemReclick();
          }
        }
      }
    }

    /**
     *
     *
     * @param menuItem
     * @returns {Array}
     */
    function findMenuArray(menuItem) {
      var isContinue,
        parentMenu,
        routeArr = [];
      routeArr.push(menuItem);
      parentMenu = menuItem;
      isContinue = true;
      while (isContinue) {
        parentMenu = parentMenu.parent;
        if (parentMenu) {
          routeArr.unshift(parentMenu);
        } else {
          isContinue = false;
        }
      }
      return routeArr;
    }


    /**
     * check taskFlow be fore send click event down to menuItem
     * @param nextMenuItem
     * @returns {boolean}
     */
    //function preventSelect(nextMenuItem) {
    //  var allow = true,
    //      event = {
    //        isPreventDefault: false,
    //        preventDefault: function (targetEvent/*, currentMenuItem, nextMenuItem*/) {
    //          targetEvent.isPreventDefault = false;
    //        }
    //      };
    //  if (ovTaskFlow.getFlowStatus()) {
    //    ovTaskFlow.showDlg('', function () {
    //      ovTaskFlow.setFlowStatus(false);
    //      ovTaskFlow.setNoCheck(true);
    //      onSidebarItemClick(nextMenuItem);
    //    }, function () {
    //    });
    //    allow = false;
    //  } else {
    //    (vm.skeletonConfig.onSideBarChangeStart || angular.noop)(event/*, currentMenuItem, nextMenuItem*/);
    //    //
    //    allow = !event.isPreventDefault;
    //  }
    //  return allow;
    //}
    function preventSelect(menuItem) {
      var result = true;
      if (ovTaskFlow.getFlowStatus()) {
        console.log('Click on menu item when taskFlow enabled');
        ovTaskFlow.showDlg('', function () {
          ovTaskFlow.setFlowStatus(false);
          ovTaskFlow.setNoCheck(true);
          onSidebarItemClick(menuItem);
        }, function () {
        });
        result = false;
      }
      return result;
    }


    /**
     * change page and template url base on menuItem and routeArr
     * @param menuItemArray
     * @param routeArr
     */
    function changeMenuItem(menuItemArray, routeArr) {
      var url,
        lastMenuItem = menuItemArray[menuItemArray.length - 1];
      //click on menu doesn't have child menu array
      if (!(lastMenuItem.menuItems && lastMenuItem.menuItems.length > 0)) {
        //cache routeArr
        vm.cachedObject.lastedPage.menuItem = lastMenuItem;
        vm.cachedObject.lastedPage.routeArr = routeArr;
        //change url base on selected menu id
        url = '';
        _.each(routeArr, function (route, index) {
          if (index === routeArr.length - 1) {
            url += route;
          } else {
            url += route + '/';
          }
        });
        if (!lastMenuItem.templateUrl || lastMenuItem.templateUrl === '') {
          $log.error('menuItem', lastMenuItem, 'doesn\'t have templateUrl attribute or menuItems');
        }
        vm.contentTemplateUrl = lastMenuItem.templateUrl;
        vm.cachedObject.selectedMenuItem = lastMenuItem;
        //build suffix string based on selected menu item array
        //ovTitle.setSuffixByMenuItemArray(menuItemArray);
        //only use last menu item to make suffix
        ovTitle.setSuffix(lastMenuItem.title);
        if (menuItemArray.length > 1) {
          //remove first item
          //menuArray.shift();
          menuItemArray.pop();
          angular.forEach(menuItemArray, function (menu) {
            vm.navData.displayList.push(menuToBreadcrumb(menu));
          });
        }
        //change navData current object base on selected menu information
        vm.navData.current = menuToBreadcrumb(lastMenuItem);
        //vm.navData.current.title = menuItem.i18nKey ? $i18next(menuItem.i18nKey) : menuItem.title;
        //vm.navData.current.iconClasses = menuItem.iconClasses;
        //vm.navData.current.i18nKey = menuItem.i18nKey;
        //vm.navData.current.disabled = menuItem.disabled;
        $location.url(vm.appRootUrl + url);
      }
    }

    function menuToBreadcrumb(menuItem) {
      var breadcrumb = {};
      breadcrumb.title = menuItem.i18nKey ? $i18next(menuItem.i18nKey) : menuItem.title;
      breadcrumb.id = menuItem.id || '';
      if (!breadcrumb.id) {
        $log.error('Menu Item doesn\'t have id attribute: ', menuItem);
      }
      breadcrumb.iconClasses = menuItem.iconClasses;
      breadcrumb.i18nKey = menuItem.i18nKey;
      breadcrumb.disabled = menuItem.disabled;
      if (menuItem.url) {
        breadcrumb.url = menuItem.url;
      }
      return breadcrumb;
    }

    /**
     * on breadcrumb click, change url base on item
     * @param item
     */
    function onBreadcrumbItemClick(item) {
      $location.url(item.url);
    }

    /**
     * add slash character at the end of url if it's not exist
     * @param url
     */
    function addEndSplash(url) {
      if (url && url.lastIndexOf('/') !== url.length - 1) {
        url = url + '/';
      }
      return url;
    }

    function removeEndSplash(url) {
      var formattedString = url;
      if (formattedString && formattedString.lastIndexOf('/') === formattedString.length - 1) {
        formattedString = formattedString.slice(0, url.lastIndexOf('/'));
      }
      return formattedString;
    }

    $scope.$on('$locationChangeStart', function (event, newUrl/*, oldUrl*/) {
      var appRoot = removeEndSplash(vm.appRootUrl),
        newUrlFormatted = newUrl.toString().slice(newUrl.toString().indexOf(appRoot));
      //if user change current page to an URL which same as appRoot => clearCache to
      if (newUrlFormatted === appRoot) {
        clearCache();
      }
    });

    //--end file
  }
})();
