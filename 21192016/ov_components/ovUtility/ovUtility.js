/**
 \$Id:
 (c) Copyright ALE USA Inc., ${YEAR}
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

'use strict';

angular.module('ngnms.ui.fwk.utility', [])
  .filter('secondToTime', ['$i18next', function ($i18next) {
    function secondToTime(second) {
      var dateString = '';

      var years = Math.floor(second / 31536000); // calculate to years

      var divisorForWeeks = second % 31536000; // divisor for weeks

      var weeks = Math.floor(divisorForWeeks / 604800); // calculate to weeks

      var divisorForDays = divisorForWeeks % 604800; // divisor for days

      var days = Math.floor(divisorForDays / 86400); // days

      var divisorForHours = divisorForDays % 86400; // divisor for hours

      var hours = Math.floor(divisorForHours / 3600); // hours

      var divisorForMinutes = divisorForHours % 3600; // divisor for hours

      var minutes = Math.floor(divisorForMinutes / 60); // minutes

      var seconds = divisorForMinutes % 60; // seconds

      dateString += years > 0 ? ($i18next('singPlural.year', {count: years}) + ' ') : '';
      dateString += weeks > 0 ? ($i18next('singPlural.week', {count: weeks}) + ' ') : '';
      dateString += days > 0 ? ($i18next('singPlural.day', {count: days}) + ' ') : '';
      dateString += hours > 0 ? ($i18next('singPlural.hour', {count: hours}) + ' ') : '';
      dateString += minutes > 0 ? ($i18next('singPlural.minute', {count: minutes}) + ' ') : '';
      dateString += seconds >= 0 ? ($i18next('singPlural.second', {count: seconds}) + ' ') : '';
      return dateString;
    }

    return function (input) {
      if (input) {
        return secondToTime(input);
      }
    };
  }])
  .directive('ovTransitionEnd', ['$parse', function ($parse) {
    // Work out the name of the transitionEnd event
    var transElement = document.createElement('trans');
    var transitionEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'transition': 'transitionend'
    };
    var animationEndEventNames = {
      'WebkitTransition': 'webkitAnimationEnd',
      'MozTransition': 'animationend',
      'OTransition': 'oAnimationEnd',
      'transition': 'animationend'
    };

    function findEndEventName(endEventNames) {
      for (var name in endEventNames) {
        if (transElement.style[name] !== undefined) {
          return endEventNames[name];
        }
      }
    }

    var transition = {};
    transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
    transition.animationEndEventName = findEndEventName(animationEndEventNames);
    var transEndEvent = transition.transitionEndEventName;

    return {
      restrict: 'A',
      link: function ($scope, elm, attrs) {
        $scope.safeApply = function (fn) {
          var phase = this.$root.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };

        var fn = $parse(attrs.ovTransitionEnd);
        if (transEndEvent) {
          elm.bind(transEndEvent, function (event) {
            if (elm.is(event.target)) {
              //Fix $digest already in progress - dminhquan
              $scope.safeApply(function () {
                fn($scope, {'$event': event});
              });
            }
          });
        }

        $scope.$on('$destroy', function () {
          elm.unbind(transEndEvent);
        });
      }
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:autoExec
   * @restrict A
   * @description
   * Execute expected expression when width value of the view port is less than or equal to specified value
   *
   * @param {expression} autoExec The expression to be executed
   * @param {number} whenWidth Width value in pixel
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <div auto-exec="state.menuExpanded = false"
   *        when-width="768">
   *   </div>
   * </pre>
   * */
  .directive('autoExec', ['$window', function ($window) {
    var viewPort = $($window);

    return {
      link: function ($scope, elm, attrs) {
        var widthCond = attrs.whenWidth;
        var callback = attrs.autoExec;

        $scope.safeApply = function (fn) {
          var phase = this.$root.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };
        var resizeFn = function () {
          $scope.safeApply(function () {
            if (viewPort.width() <= widthCond) {
              $scope.$eval(callback);
              //if (!$scope.$$phase) {
              //  $scope.$digest();
              //}
            }
          });
        };
        resizeFn();
        viewPort.on('resize', resizeFn);
        $scope.$on('$destroy', function () {
          viewPort.off('resize', resizeFn);
        });
      }
    };
  }])
  .directive('fixedTop', ['$document', function ($document) {
    return {
      link: function ($scope, elm, attrs) {
        var initTop = attrs.initTop || 0;
        var fixedTop = attrs.fixedTop;
        var domScrollTop;

        function scrollHook() {
          domScrollTop = $document.scrollTop();
          if (0 <= domScrollTop && domScrollTop < initTop) {
            elm.css({
              'top': initTop - domScrollTop
            });
          } else {
            elm.css({
              'top': fixedTop
            });
          }
        }

        scrollHook();
        elm.css({
          'top': initTop
        });

        $document.on('scroll', scrollHook);

        $scope.$on('$destroy', function () {
          $document.off('scroll', scrollHook);
        });

      }
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:docClick
   * @restrict A
   * @description
   * Execute expected callback when clicking on html
   *
   * @param {function} docClick The callback to be executed
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <div doc-click="collapseMenu">
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   var state = {
   *     menu: {
   *       collapsed: false
   *     }
   *   };
   *   ctrl1.collapseMenu = function () {
   *     state.menu.collapsed = true;
   *   };
   * </pre>
   * */
  .directive('docClick', [function () {
    return function linkFn($scope, elm, attrs) {
      function executeExpression($event) {
        $scope.$apply(function () {
          var docClick = $scope.$eval(attrs.docClick);
          if (typeof docClick === 'function') {
            docClick($scope, $event);
          }
        });
      }

      $('html').on('click', executeExpression);

      $scope.$on('$destroy', function () {
        $('html').off('click', executeExpression);
      });
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:ovNavButton
   * @restrict A
   * @description
   * Render a navigation button under the form of an anchor link. The rendered element contains an arrow icon and followed by a label
   *
   * @param {expression|string} direction Angular expression or string to be evaluated as the direction of arrow icon. Accepted values:
   *      * `left`: left navigation arrow `<`
   *      * `right`: left navigation arrow `>`
   * @param {expression|string} label Angular expression or string to be evaluated as a label.
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <div ov-nav-button
   *        direction="left"
   *        label="Back">
   *   </div>
   * </pre>
   *
   * **Using expression:**
   *
   * <pre>
   *   // HTML
   *   <div ov-nav-button
   *        direction="{{ctr1.ovNavButton.direction}}"
   *        label="{{ctr1.ovNavButton.label}}">
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ovNavButton = {
   *     direction: 'left',
   *     label: 'Back'
   *   };
   * </pre>
   * */
  .directive('ovNavButton', [function () {
    return {
      templateUrl: 'ov_components/ovUtility/templates/ovNavButton.html',
      link: function ovNavLinkFn($scope, elm, attrs) {
        attrs.$observe('label', function (val) {
          elm.find('.ov-nav-label').text(val);
        });

        attrs.$observe('direction', function (val) {
          var aTag = elm.find('.ov-nav-btn-link');
          var iTag = elm.find('.ov-nav-icon').attr('class', 'ov-nav-icon');
          if (val === 'left') {
            iTag.addClass('fa fa-2x fa-angle-left');
            iTag.prependTo(aTag);
          } else if (val === 'right') {
            iTag.addClass('fa fa-2x fa-angle-right');
            iTag.appendTo(aTag);
          }
        });
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name ov-component.directive:bs3Collapse
   * @restrict A
   * @description
   * Automatically toggle to collapse/expand an element vertically with transition. The element using this directive should not be empty to get effect.
   *
   * @param {boolean} bs3Collapse Boolean value indicating collapse state
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <button ng-click="ctrl1.isMenuCollapsed = !ctrl1.isMenuCollapsed">Toggle Collapse</button>
   *   <div bs3-collapse="ctrl1.isMenuCollapsed">
   *     <label>Enter your name</label>
   *     <input>
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.isMenuCollapsed = true;
   * </pre>
   * */
  .directive('bs3Collapse', [function () {
    return {
      link: function ($scope, elm, attrs) {
        var height;
        var is1stTime = true;
        var animating = false;

        $scope.$watch(attrs.bs3Collapse, function (isCollapsed) {
          function resetCollapsed() {
            elm.stop();
            elm.addClass('collapse');
            elm.removeClass('in');
            elm.css({height: 'auto', overflow: 'visible'});
            animating = false;
          }

          function reset() {
            elm.stop();
            elm.addClass('in');
            elm.css({height: 'auto', overflow: 'visible'});
            animating = false;
          }

          if (isCollapsed) {
            if (is1stTime || animating) {
              resetCollapsed();
              is1stTime = false;
              return;
            }
            elm.css({height: 'auto', overflow: 'hidden'});
            elm.addClass('collapse');
            elm.addClass('in');
            height = elm.height();
            elm.height(height);

            animating = true;

            elm.animate({
              height: 0
            }, 200, function () {
              resetCollapsed();
            });
          } else {
            if (is1stTime || animating) {
              reset();
              is1stTime = false;
              return;
            }
            elm.css({height: 'auto', overflow: 'hidden'});
            elm.addClass('collapse');
            elm.addClass('in');
            height = elm.height();
            elm.height(0);

            animating = true;

            elm.animate({
              height: height
            }, 200, function () {
              reset();
            });
          }
        });
      }
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:ovLoadSpinner
   * @restrict E
   * @description
   * Render an circular loading spinner.
   *
   * @param {string=} overrideClass Custom CSS class to wrap the entire element
   * @param {string=} overrideStyle Custom style to wrap the entire element
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <div>
   *     <ov-load-spinner></ov-load-spinner>
   *   </div>
   * </pre>
   * */
  .directive('ovLoadSpinner', [function () {
    return {
      restrict: 'E',
      templateUrl: 'ov_components/ovUtility/templates/spinner.html',
      scope: {
        overrideClass: '=',
        overrideStyle: '='
      },
      replace: true,
      link: function (scope, elm) {
        var particle = 12;
        var spinner = elm.find('.ghost-spinner').html('');
        for (var i = 0; i < particle; ++i) {
          spinner.append('<i></i>');
        }
      }
    };
  }])

/**
 * Desc:  Wrap 'ovLoadSpinner' directive to show or hide spinner
 *        Add in DOM directly that need to be covered
 * Use:
 *    ovSpinnerLoading: boolean
 *    spinnerId: 'string' option, default value: 'ov-load-spinner'
 *    spinnerConfig: object option, default value:
 *      {
   *        spinnerLabel: $i18next('spinner'),
   *        hasBackground: true,
   *        spinnerLoadingClass: '',
   *        spinnerLoadingStyle: '',
   *        ovLoadSpinnerClass: '',
   *        ovLoadSpinnerStyle: ''
   *      }
 */
  /**
   * @ngdoc directive
   * @name ov-component.directive:ovSpinnerLoading
   * @restrict A
   * @description
   * Wrap <a href="api/ov-component.directive:ovLoadSpinner">ovLoadSpinner</a> directive to show or hide spinner. Add in DOM directly that need to be covered
   *
   * @param {boolean} ovSpinnerLoading Boolean value to toggle show/hide spinner
   * @param {string=} spinnerId Make spinner unique by giving an ID (default `ov-load-spinner`)
   * @param {object=} spinnerConfig Spinner configuration. Default values:
   *    * **spinnerLabel**(optional) `string`: Label of the spinner (default $i18next('spinner') or 'Loading...')
   *    * **hasBackground**(optional) `boolean`: Show/hide background of the spinner to shadow the content (default true)
   *    * **spinnerLoadingClass**(optional) `string`: Custom CSS class of spinner loading (default ``)
   *    * **spinnerLoadingStyle**(optional) `string`: Custom CSS styles of spinner loading (default ``)
   *    * **ovLoadSpinnerClass**(optional) `string`: Custom CSS class of load spinner (default ``)
   *    * **ovLoadSpinnerStyle**(optional) `string`: Custom CSS styles of load spinner (default ``)
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <div ov-spinner-loading="ctrl1.inProgress" spinner-id="ov-topology-spinner">
   *     <p>Element content here</p>
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.inProgress = true;
   *   $http.get('something').then().finally(function finishGettingSomething() {
   *    ctrl1.inProgress = false;
   *   })
   * </pre>
   *
   * **Use custom label example:**
   * <pre>
   *   // HTML
   *   <div ov-spinner-loading="ctrl1.inProgress" spinner-id="ov-topology-spinner" spinner-config="ctrl1.spinnerConfig">
   *     <p>Element content here</p>
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.inProgress = true;
   *   $http.get('something').then().finally(function finishGettingSomething() {
   *    ctrl1.inProgress = false;
   *   })
   *   ctrl1.spinnerConfig = {
   *     spinnerLabel: 'Trying to load'
   *   };
   * </pre>
   *
   * **Hide background example:**
   * <pre>
   *   // HTML
   *   <div ov-spinner-loading="ctrl1.inProgress" spinner-id="ov-topology-spinner" spinner-config="ctrl1.spinnerConfig">
   *     <p>Element content here</p>
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.inProgress = true;
   *   $http.get('something').then().finally(function finishGettingSomething() {
   *    ctrl1.inProgress = false;
   *   })
   *   ctrl1.spinnerConfig = {
   *     hasBackground: false
   *   };
   * </pre>
   * */
  .directive('ovSpinnerLoading', ['$http', '$templateCache', '$compile', '$i18next', function ($http, $templateCache, $compile, $i18next) {
    return {
      restrict: 'A',
      scope: {
        ovSpinnerLoading: '=',
        spinnerId: '=?',
        spinnerConfig: '=?'
      },
      link: function (scope, elm) {
        var configDefault = {
          spinnerLabel: $i18next('spinner'),  // Default value is 'Loading...'
          hasBackground: true,                // show background for ovSpinnerLoading
          spinnerLoadingClass: '',            // add class into ovSpinnerLoading
          spinnerLoadingStyle: '',            // add style into ovSpinnerLoading
          ovLoadSpinnerClass: '',             // add class into ovLoadSpinner
          ovLoadSpinnerStyle: ''              // add style into ovLoadSpinner
        };
        var compileTemplate;

        $http({
          method: 'GET',
          url: 'ov_components/ovUtility/templates/ovSpinnerLoading.html',
          cache: $templateCache
        }).success(function (tpl) {
          scope.newScope = scope.$new();
          compileTemplate = $compile(tpl)(scope.newScope);
          elm.append(compileTemplate);
        });

        elm.addClass('position-relative');
        elm.addClass('clearfix');

        scope.spinnerConfig = angular.extend(configDefault, scope.spinnerConfig);
        scope.spinnerBackground = scope.spinnerConfig.hasBackground ? 'ov-spinner-loading-background' : '';

        scope.$on('$destroy', function () {
          if (scope.newScope) {
            scope.newScope.$destroy();
            scope.newScope = null;
          }
          if (compileTemplate) {
            compileTemplate.remove();
            compileTemplate = null;
          }
        });
      }
    };
  }])
  //dminhquan-start
  .directive('ovLoading', [function () {
    return {
      restrict: 'E',
      scope: {
        config: '='
      },

      link: function (scope, element) {
        var opts = {};
        if (!scope.config) {
          opts = {
            lines: 12, // The number of lines to draw
            length: 7, // The length of each line
            width: 2, // The line thickness
            radius: 7, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9 // The z-index (defaults to 2000000000)
            //The returned element is a DIV with position:relative and no height.
            //The center of the spinner is positioned at the top left corner of this DIV.
          };
        } else {
          opts = scope.config;
        }

        var spinner = new window.Spinner(opts).spin();
        element.append(spinner.el);
      }
    };
  }])
  //dminhquan-end
  .directive('ovDroplineMenu', [function () {
    return {
      restrict: 'A',
      link: function ($scope, elm/*, attrs*/) {
        var activateClass = 'open-sub-menu';

        function closeAllSubMenus() {
          elm.find('> li.nav-menu-item').removeClass(activateClass).find('.sub-menu').css({
            height: 'auto',
            overflow: 'visible'
          });
        }

        function clickFn(event) {
          var
            subMenuHeight,
            theLi = $(event.target).closest('li.nav-menu-item'),
            subMenu = theLi.find('.sub-menu');

          if (theLi.hasClass(activateClass)) {
            theLi.removeClass(activateClass);
            subMenu.css({height: 'auto', overflow: 'hidden'});
            return;
          }

          closeAllSubMenus();

          theLi.addClass(activateClass);
          subMenu.css({height: 'auto'});
          subMenuHeight = subMenu.height();
          subMenu.css({height: 0, overflow: 'hidden'});
          // Firefox is crazy about this.. so add 50ms delay
          setTimeout((function (subMenu) {
            return function () {
              subMenu.css({height: subMenuHeight});
            };
          })(subMenu), 50);

          theLi = null;
          subMenu = null;
        }

        elm.bind('click.ovDroplineMenu', 'li', clickFn);

        //When clicking on html
        var clickOnHtml = function (event) {
          if (!$(event.target).closest('li.nav-menu-item').length && !$(event.target).closest('#main-menu-droplinemenu').length) {
            closeAllSubMenus();
          }
        };

        $('html').on('click.ovDroplineMenu', clickOnHtml);
//        $scope.$on('$routeChangeSuccess', function() {
//          closeAllSubMenus();
//        });

        $scope.$on('$destroy', function () {
          $('html').off('click.ovDroplineMenu', clickOnHtml);
        });
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovEllipsis
   * @restrict A
   * @description
   * Support to see ellipsis text in full form
   *
   * @param {string} ovEllipsis Text to be ellipsis
   * @param {string=} ovEllipsisTemplate Custom template for displaying ellipsis text
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <div ov-ellipsis="This is the content of the ellipsis element" style="width: 100px">
   *     This is the content of the ellipsis element
   *   </div>
   * </pre>
   *
   * **Use controller's property example:**
   * <pre>
   *   // HTML
   *   <div ov-ellipsis="{{ctrl1.ellipsis.text}}" style="width: 100px">
   *     {{ctrl1.ellipsis.text}}
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ellipsis = {
   *     text: 'This is the content of the ellipsis element'
   *   };
   * </pre>
   *
   * **Use custom template example:**
   * <pre>
   *   // HTML
   *   <div ov-ellipsis="{{ctrl1.ellipsis.text}}" ov-ellipsis-template="{{ctrl1.ellipsis.template}}"style="width: 100px">
   *     {{ctrl1.ellipsis.text}}
   *   </div>
   * </pre>
   *
   * <pre>
   *   // HTML - path/to/your/ov-ellipsis-template.html
   *   <div>
   *     <div>Ellipsis text is:</div>
   *     <div>{{ctrl1.ellipsis.text}}</div>
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ellipsis = {
   *     text: 'This is the content of the ellipsis element',
   *     template: 'path/to/your/ov-ellipsis-template.html'
   *   };
   * </pre>
   * */
  .directive('ovEllipsis', ['$timeout', '$window', '$http', '$compile', function ($timeout, $window, $http, $compile) {
    //  ovEllipsis
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var body = angular.element('body');
        var fullText, isShowing, htmlTpl, background;
        element.css({
          'overflow': 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap'
        });

        function defaultCss() {
          element.css({
            'cursor': 'default',
            'box-shadow': '0 0 0',
//            'background-color': 'initial',
            'border-radius': '0'
          });
        }

        if (typeof attrs.ovEllipsisTemplate !== 'undefined') {
          htmlTpl = angular.element('<div></div>');
          htmlTpl.html('');
          var childScope = scope.$new();

          $http({method: 'GET', url: attrs.ovEllipsisTemplate, cache: true}).success(function (result) {
            htmlTpl.html(result);
            $compile(htmlTpl.contents())(childScope);
          });

          childScope.$on('destroy', function () {
            htmlTpl.remove();
            htmlTpl = null;
          });
        }

        function closeText() {
          isShowing = false;
          if (fullText) {
            defaultCss();
            //Cannot set element.css('visibility', 'initial') in IE11
            element.css('visibility', 'visible');

            fullText.remove();
            fullText = undefined;
          }
        }

        // get style value of element
        function getStyle(el, styleProp) {
          var x = el;
          var y;
          if (x.currentStyle) {
            y = x.currentStyle[styleProp];
          }
          else if (window.getComputedStyle) {
            y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
          }
          return y;
        }

        function getScreenCordinates(obj) {
          var p = {};
          p.left = obj.offsetLeft;
          p.top = obj.offsetTop;
          while (obj.offsetParent) {
            p.left = p.left + obj.offsetParent.offsetLeft;
            p.top = p.top + obj.offsetParent.offsetTop;
            if (obj === document.getElementsByTagName('body')[0]) {
              break;
            }
            else {
              obj = obj.offsetParent;
            }
          }
          return p;
        }

        function destroyEllipsisTpl () {
          closeText();
          removeBackgroundFn();
        }

        function removeBackgroundFn() {
          if (background) {
            background.unbind('click touchend', destroyEllipsisTpl);
            background.empty().remove();
            background = undefined;
          }
        }

        function showBackgroundFn() {
          background = angular.element('<div class="ov-ellipsis-background"></div>');
          body.append(background);
          background.bind('click touchend', destroyEllipsisTpl);
        }

        // show full text
        function showText(event) {
          if (element[0].scrollWidth > element.width()) {
            event.stopPropagation();
            event.preventDefault();
            if (!isShowing) {
              isShowing = true;
              element.css('visibility', 'hidden');
              fullText = angular.element('<div class="ov-ellipsis popover"><div class="popver-content"></div></div>');

              if (typeof attrs.ovEllipsisTemplate === 'undefined') {
                fullText = angular.element('<div class="ov-ellipsis popover"><div class="popver-content">' + attrs.ovEllipsis + '</div></div>');
              } else {
                htmlTpl.appendTo(fullText);
              }
              if (typeof attrs.ovEllipsisDatepickerTemplate !== 'undefined') {
                fullText.css({
                  'top': element.offset().top,
                  'left': element.offset().left,
                  'padding': '0.6rem',
                  'overflow': 'auto',
                  'max-height': '24rem',
                  'max-width': 'none',
                  'word-break': 'break-all'
                });
              } else {
                fullText.css({
                  'top': element.offset().top + parseFloat(getStyle(element[0], 'padding-top')) - 1,
                  'left': element.offset().left + parseFloat(getStyle(element[0], 'padding-left')) - 1,
                  'padding': '0.6rem',
                  'overflow': 'auto',
                  'max-height': '24rem',
                  'max-width': 'none',
                  'word-break': 'break-all'
                });
              }
              fullText.appendTo(body);
              var width = fullText.width() + parseFloat(getStyle(element[0], 'padding-left')) - 1;
              var positionLeft = parseFloat(fullText[0].style.left);
              if (positionLeft + width > angular.element($window).width()) {
                fullText[0].style.left = (positionLeft - width / 2) + 'px';
              }

              fullText.show();
              fullText.bind('click touchend', function (event) {
                event.stopPropagation();
              });
              showBackgroundFn();
            }
          }
        }

        // when hover on this elm, check if text is ellipsis, bind click event to this elm
        function checkEllipsis() {
          setTimeout(function () {
            if (element[0].scrollWidth > element.width()) {
              element.css({
                'cursor': 'pointer',
                'box-shadow': '0 0.1rem 1rem',
//                'background-color': 'transparent',
                'border-radius': '0.5rem'
              });
            } else {
              element.css({
                'cursor': '',
                'box-shadow': '',
                'border-radius': ''
              });
            }
          });
        }

        // when hover out this elm, remove css, unbind click event
        function hoverOut() {
          setTimeout(function () {
            if (element[0].scrollWidth > element.width()) {
              defaultCss();
            }
          });
        }

        // for change css when mouse hover
        element.bind('mouseenter touchstart', checkEllipsis);
        element.bind('mouseleave', hoverOut);
        // for touch
        element.bind('click touchend', showText);

        // when scope is destroyed, unbind all event
        scope.$on('$destroy', function () {
          element.unbind('mouseenter touchstart', checkEllipsis);
          element.unbind('mouseleave', hoverOut);
          element.unbind('click touchend', showText);
          /**
           * DOQ: Fix hide ellipsis when change url
           * Reproduce steps:
           *  Step1: show ovEllipsis
           *  Step2: Change url then check status of ovEllipsis is show/hidden
           */
          destroyEllipsisTpl();

          if (typeof attrs.ovEllipsisTemplate !== 'undefined') {
            childScope.$destroy();
            childScope = null;
          }
        });
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovBreadcrumb
   * @restrict E
   * @description
   * Build up a breadcrumb
   *
   * @param {string=} idApp A prefix ID for the breadcrumb. ID of the breadcrumb will be idApp followed by `-breadcrumb`. If idApp not specified, then `breadcrumb` will be the ID
   * @param {array} navList All elements in the breadcrumb (but the last one). Each of it contains a unique ID, an font-awesome icon CSS class, a title, and a url. An element can be clickable if property `disable` is set to false
   * @param {object} current Current/last element of the breadcrumb. It has the same structure of an element in navList
   * @param {function} onSelected A callback function invoked whenever a clickable item in the breadcrumb is clicked. The item object itself will be passed to the callback as an parameter
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <ov-breadcrumb id-app="app1"
   *                  nav-list="ctrl1.breadcrumb.navList"
   *                  current="ctrl1.breadcrumb.current"
   *                  on-selected="ctrl1.breadcrumb.onSelected">
   *   </ov-breadcrumb>
   * </pre>
   *
   * <pre>
   *   // JS
   *   // Home > Group 1 > Sub Group 1 > App 1
   *   ctrl1.breadcrumb = {};
   *   ctrl1.breadcrumb.navList = [
   *     {id: 'home', icon: 'fa fa-home', title: 'Home', url: '/'},
   *     {id: 'group1', icon: '', title: 'Group 1', url: '/', disabled: true},
   *     {id: 'subGroup1', icon: '', title: 'Sub Group 1', url: '/group1/subGroup1'}
   *   ];
   *   ctrl1.breadcrumb.current = {id: 'app1', icon: '', title: 'App 1', url: '/group1/subGroup1/app1'};
   *   ctrl1.breadcrumb.onSelected = function (item) {
   *     console.log('On click on clickable breadcrumb item', item.title);
   *   };
   * </pre>
   * */
  .directive('ovBreadcrumb', [function () {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'ov_components/ovUtility/templates/ovBreadcrumb-layout.html',
      scope: {
        navList: '=',
        onSelected: '=',
        current: '='
      },
      link: function ($scope, elm, attrs) {
        if (typeof attrs.idApp === 'undefined') {
          $scope.idApp = 'breadcrum';
        } else {
          $scope.idApp = attrs.idApp + '-breadcrum';
        }
        $scope.onClick = function (item, $event) {
          if (!!!item.disabled) {
            $event.stopPropagation();
            $scope.onSelected(item);
          }
        };
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovResize
   * @restrict A
   * @description
   * Automatically resize the height of a element using this directive. Given value is the height value counted from the top of the window.
   * The remaining height of the element will be the height of the window after being minus by given value in REM unit.
   * Min height will be 30rem.
   * The calculation is only executed one time
   *
   * @param {string=} ovResize Height value to resize. Default to 30rem if not specified
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML - Height of following div will be the height of the window minus 100
   *   <div ov-resize="100">
   *   </div>
   * </pre>
   *
   * **Use controller's property example:**
   * <pre>
   *   // HTML - Height of following div will be the height of the window minus 100
   *   <div ov-resize="{{ctrl1.ovResizeValue}}">
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ovResizeValue = 100;
   * </pre>
   * */
  .directive('ovResize', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var top = $parse(attrs.ovResize)(scope) || 300,
          RESIZE_EVENT = 'resize.ovResize',
          elementResize = function () {
            var height = $(window).height() - top;
            height = height < 300 ? 300 : height;
            element.css({height: height / 10 + 'rem'});
          },
          startResize = function () {
            elementResize();
            $(window).on(RESIZE_EVENT, elementResize);
          },
          endResize = function () {
            $(window).off(RESIZE_EVENT);
          };
        scope.$on('$destroy', endResize);
        startResize();
      }
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:ngKeyenter
   * @restrict A
   * @description
   * Execute given callback function whenever user enters on an element (usually an input)
   *
   * @param {function} ngKeyenter Callback function to be eval
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML - Simple todo app
   *   <div>
   *      <input ng-model="ctrl1.ngKeyEnter.todoTask"
   *             ng-keyenter="ctrl1.ngKeyEnter.addNewTodoTask(ctrl1.ngKeyEnter.todoTask)">
   *      <div>
   *        <div ng-repeat="todoTask in ctrl1.ngKeyEnter.todoTaskList track by $index">
   *          {{todoTask}}
   *        </div>
   *      </div>
   *    </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ngKeyEnter = {
   *     todoTask: '',
   *     todoTaskList: [],
   *     addNewTodoTask: function (todoTask) {
   *       this.todoTaskList.push(todoTask);
   *       this.todoTask = '';
   *     }
   *   };
   * </pre>
   *
   * */
  .directive('ngKeyenter', [function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngKeyenter);
          });
          event.preventDefault();
        }
      });
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:aDisabled
   * @restrict A
   * @description
   * Enable/disable clicking on the element (usually a anchor link) and change the CSS styles accordingly.
   *
   * @param {boolean} aDisabled Enable/disable clicking on the element
   * @param {function} ngClick Callback function which is allowed/prevented to/from executing when aDisabled is set to true/false.
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <a a-disabled="ctrl1.aDisabled.disabled"
   *      ng-click="ctrl1.aDisabled.onClick()">
   *      Click me
   *   </a>
   * </pre>
   *
   * <pre>
   *   // JS
   *
   *   ctrl1.aDisabled = {
   *     disabled: true,
   *     onClick: function () {
   *       console.log('Click on an anchor link.');
   *     }
   *   };
   * </pre>
   *
   * */
  .directive('aDisabled', ['$parse', function (/*$parse*/) {
    return {
      restrict: 'A',
      priority: -99999,
      link: function (scope, elem, attrs/*, ngClick*/) {
        var oldNgClick = attrs.ngClick;
        if (oldNgClick) {
          scope.$watch(attrs.aDisabled, function (val, oldval) {
            elem.css('cursor', 'pointer');
            if (!!val) {
              elem.css('color', '#aaa');
              elem.css('cursor', 'default');
              elem.unbind('click');
            } else if (oldval) {
              elem.css('color', '');
              elem.css('cursor', 'pointer');
              attrs.$set('ngClick', oldNgClick);
              elem.bind('click', function () {
                scope.$apply(attrs.ngClick);
              });
            }
          });
        }
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovFocus
   * @restrict A
   * @description
   * Initially focus an element if specify to true.
   * If there are multiple elements which have ovAutoFocus set to true, then the last one will be focused
   *
   * @param {boolean} ovFocus Initially focused state
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <input ov-focus="true">
   * </pre>
   *
   * **Use controller's property example:**
   * <pre>
   *   // HTML
   *   <input ov-focus="ctrl1.ovFocus.focused">
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ovFocus = {
   *     focused: true
   *   };
   * </pre>
   *
   * */
  .directive('ovFocus', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(attrs.ovFocus, function (val) {
          if (val) {
            $timeout(function () {
              element.focus();
            }, 50);
          }
        });

        element.blur(function () {
          var setter = $parse(attrs.ovFocus).assign;
          if (setter) {
            setter(scope, false);
            scope.$apply();
          }
        });
        scope.$on('$destroy', function () {
          element.off('blur');
        });
      }
    };
  }])

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovEnter
   * @restrict A
   * @description
   * Execute given callback function whenever user enters on an element (usually an input)
   *
   * @param {function} ovEnter Callback function to be eval
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML - Simple todo app
   *   <div>
   *      <input ng-model="ctrl1.ovEnter.todoTask"
   *             ov-enter="ctrl1.ovEnter.onEnter(ctrl1.ovEnter.todoTask)">
   *      <div>
   *        <div ng-repeat="todoTask in ctrl1.ovEnter.todoTaskList track by $index">
   *          {{todoTask}}
   *        </div>
   *      </div>
   *    </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ovEnter = {
   *     todoTask: '',
   *     todoTaskList: [],
   *     onEnter: function (todoTask) {
   *       this.todoTaskList.push(todoTask);
   *       this.todoTask = '';
   *     }
   *   };
   * </pre>
   *
   * */
  .directive('ovEnter', [function () {
    return function ($scope, element, attrs) {
      $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
          if (fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };
      element.bind('keydown.ovEnter keypress.ovEnter', function (e) {
        var key = e.which || e.charCode || e.keyCode;
        if (key === 13) {
          $scope.safeApply(function () {
            $scope.$eval(attrs.ovEnter, {$event: e});
          });
        }
      });
      $scope.$on('$destroy', function () {
        element.unbind('keydown.ovEnter keypress.ovEnter');
      });
    };
  }])

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovAutoFocus
   * @restrict A
   * @description
   * Initially focus an element if not specified or specified to true.
   * If there are multiple elements which have ovAutoFocus set to true, then the last one will be focused
   *
   * @param {boolean=} ovAutoFocus Initially focused state
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <input ov-auto-focus>
   * </pre>
   *
   * **Use controller's property example:**
   * <pre>
   *   // HTML
   *   <input ov-auto-focus="ctrl1.ovAutoFocus.focused">
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ovAutoFocus = {
   *     focused: true
   *   };
   * </pre>
   *
   * */
/**
 * auto set focus on single element
 * usage <input type="text" ov-auto-focus> or <input type="text" ov-auto-focus="vm.isEdit">
 */
  .directive('ovAutoFocus', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element,attrs) {


        var focusElement;
        //set focus and select
        function setFocus() {
          $timeout(function () {
            focusElement = element.find('.ov-auto-focus-element')[0] || element;
            if (focusElement !== null) {
              if (angular.isFunction(focusElement.focus)) {
                focusElement.focus();
              }
              if (angular.isFunction(focusElement.select)) {
                focusElement.select();
              }
            }
          });
        }

        if(attrs.ovAutoFocus === ''){
          setFocus();
        }else{
          scope.$watch(attrs.ovAutoFocus, function(value){
            if(value){
              setFocus();
            }
          });
        }

        scope.$on('$destroy', function () {
          focusElement = null;
        });

      }
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:onResizeElement
   * @restrict A
   * @description
   * Execute given callback function whenever window element gets re-sized and pass new width value to the callback as a parameter.
   *
   * @param {function} onResizeElement Callback function to execute
   *
   * @example
   * **Basic example:**
   * <pre>
   *   // HTML
   *   <div ov-resize-element="ctrl1.ovResizeElem.onResize">
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.ovResizeElem = {
   *     onResize: function (newWidthSize) {
   *       if (newWidthSize < 768) {
   *         // Try to collapse something
   *       } else {
   *         // Expand them
   *       }
   *     }
   *   };
   * </pre>
   *
   * */
  .directive('onResizeElement', ['$window', '$parse', '$timeout', function ($window, $parse, $timeout) {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attr) {
        var onResize = $parse($attr.onResizeElement)($scope);
        if (typeof onResize === 'function') {
          var callResizeDeBounce = _.debounce(function () {
            onResize($element.width());
            $scope.$apply();
          }, 500);

          $timeout(callResizeDeBounce);

          angular.element($window).on('resize', callResizeDeBounce);

          $scope.$on('$destroy', function () {
            angular.element($window).off('resize', callResizeDeBounce);
          });
        }
      }
    };
  }])
  /**
   * @ngdoc directive
   * @name ov-component.directive:repeatDone
   * @restrict A
   * @description
   * Working together with ngRepeat, repeatDone directive executes given callback function right after finishing repeating.
   * It also adds `repeat-done` CSS class to the parent element in case user needs to apply custom CSS
   *
   * @param {function} repeatDone Callback function to execute
   *
   * @example
   * **Basic example:**
   *
   * <pre>
   *   // HTML
   *   <div>
   *     <div>{{ctrl1.repeatDone.status}}</div>
   *     <div ng-repeat="item in ctrl1.repeatDone.itemList track by $index" repeat-done="ctrl1.repeatDone.onDone()">
   *       {{item.name}}
   *     </div>
   *   </div>
   * </pre>
   *
   * <pre>
   *   // JS
   *   ctrl1.repeatDone = {
   *     status: 'Repeating...',
   *     itemList: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}, {name: 'Item 5'}],
   *     onDone: function () {
   *       this.status = 'Done repeating';
   *     }
   *   };
   * </pre>
   *
   * */
  .directive('repeatDone', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (scope.$last) {
          element.parent().addClass('repeat-done');
          scope.$eval(attrs.repeatDone);
        }
      }
    };
  }])
  .filter('formatNumber', ['$i18next', function ($i18next) {
    return function (input) {
      input += '';
      var thousandsSeparator = $i18next('common.thousandsSeparator');
      var decimalSeparator = $i18next('common.decimalSeparator');
      var x = input.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? decimalSeparator + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + thousandsSeparator + '$2');
      }
      return x1 + x2;
    };
  }])
  /**
   * @ngdoc overview
   * @name ov-component.css:ov-radio CSS
   * @description
   * Usage of ov-radio CSS set to build a group of radio buttons
   * * `.ov-radio-container`: radio button composite
   * * `.ov-radio-container .ov-radio`: input in radio button composite which holds value
   * * `.ov-radio-container .ov-state-radio`: label in radio button composite which is for selecting
   * * `.ov-label-radio`: label of radio button
   *
   * @example
   * <pre>
   // HTML
   <div>
     <div ng-repeat="colorItem in ctrl1.colorPalette.colorList track by $index">
       <div class="ov-radio-container">
         <input class="ov-radio" id="{{:: colorItem.id}}"
               type="radio"
               ng-model="ctrl1.colorPalette.color"
               ng-value="colorItem.value">
         <label class="ov-state-radio" for="{{:: colorItem.id}}"></label>
       </div>
       <label class="ov-label-radio" for="{{:: colorItem.id}}">
         {{:: colorItem.name}}
       </label>
     </div>
   </div>
   * </pre>
   *
   * <pre>
   // JS
   ctrl1 = {
     colorPalette: {
       color: '',
       colorList: []
     }
   };

   ctrl1.colorPalette.colorList.push({
     id: 'color-of-red',
     name: 'Red',
     value: 'red'
   });

   ctrl1.colorPalette.colorList.push({
     id: 'color-of-blue',
     name: 'Blue',
     value: 'blue'
   });

   // Initialize color
   ctrl1.colorPalette.color = ctrl1.colorPalette.colorList[0].value;
   * </pre>
   * */

/**
 * @ngdoc overview
 * @name ov-component.css:ov-checkbox CSS
 * @description
 * Usage of ov-radio CSS set to build a group of radio buttons
 * * `.ov-checkbox`: checkbox input
 * * `.ov-label-checkbox`: checkbox label
 *
 * @example
 * <pre>
 // HTML
 <div>
   <div ng-repeat="colorItem in ctrl1.colorPalette.colorList track by $index">
     <input type="checkbox" class="ov-checkbox" id="{{:: colorItem.id}}" ng-model="colorItem.selected">
     <label class="ov-label-checkbox" for="{{:: colorItem.id}}"></label>
     <label for="{{:: colorItem.id}}">{{:: colorItem.name}}</label>
   </div>
 </div>
 * </pre>
 *
 * <pre>
 // JS
 ctrl1 = {
   colorPalette: {
     colorList: []
   }
 };

 ctrl1.colorPalette.colorList.push({
   id: 'color-of-red',
   name: 'Red',
   selected: true
 });

 ctrl1.colorPalette.colorList.push({
   id: 'color-of-blue',
   name: 'Blue',
   selected: false
 });

 // Initialize color
 ctrl1.colorPalette.color = ctrl1.colorPalette.colorList[0].value;
 * </pre>
 * */

  /**
   * @ngdoc service
   * @name ov-component.service:$ovUtility
   *
   * @requires ov-component.service:ovHttp
   *
   * @description
   * Provide utility functions
   * */
  .factory('$ovUtility', ['$i18next', '$http', '$compile', '$timeout', '$rootScope', '$document',
    '$log', '$filter', 'ovDottie', '$q',
    function ($i18next, $http, $compile, $timeout, $rootScope, $document,
              $log, $filter, ovDottie, $q) {

      /**
       * @ngdoc method
       * @name findValItem
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Find value of a item based on given path (in dot format) of properties
       *
       * @param {object} item Item to find value
       * @param {string} key Path of properties in dot format
       *
       * @return {*} Found value
       * */
      var findValItem = function (item, key) {
        if (item [key]) {
          return item [key];
        } else {
          var arr = key.split('.');
          var result = item [arr[0]];
          for (var i = 1; i < arr.length; i++) {
            if (!result) {
              return '';
            }
            result = result [arr[i]];
          }
          return result;
        }
      };

      /**
       * @ngdoc method
       * @name naturalSort
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Naturally comparator used within <a>Array.prototype.sort</a> function
       *
       * @param {*} a First value to compare
       * @param {*} b Second value to compare
       *
       * @return {number}
       * * 1: if a comes first
       * * -1: if a comes later
       * * 0: unchanged
       * */
      function _naturalSort(a, b) {
        if (!isNaN(a) && !isNaN(b)) {
          return a - b;
        }
        if (typeof(a) === 'undefined' || a === null) {
          a = '';
        }

        if (typeof(b) === 'undefined' || b === null) {
          b = '';
        }
        if (typeof(a) === 'object') {
          a = JSON.stringify(a);
        }
        if (typeof(b) === 'object') {
          b = JSON.stringify(b);
        }
        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
          sre = /(^[ ]*|[ ]*$)/g,
          dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
          hre = /^0x[0-9a-f]+$/i,
          ore = /^0/,
        // convert all to strings and trim()
          x = a.toString().toLowerCase().replace(sre, '') || '',
          y = b.toString().toLowerCase().replace(sre, '') || '',
        // chunk/tokenize
          xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
          yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
        // numeric, hex or date detection
          xD = parseInt(x.match(hre), 10) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
          yD = parseInt(y.match(hre), 10) || xD && y.match(dre) && Date.parse(y) || null;
        // first try and sort Hex codes or Dates
        if (yD) {
          if (xD < yD) {
            return -1;
          } else if (xD > yD) {
            return 1;
          }
        }
        // natural sorting through split numeric strings and default strings
        var oFyNcL, oFxNcL;
        for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
          // find floats not starting with '0', string or 0 if not defined (Clint Priest)
          oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
          oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
          // handle numeric vs string comparison - number < string - (Kyle Adams)
          if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
            return (isNaN(oFxNcL)) ? 1 : -1;
          }
          // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
          else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
          }
          if (oFxNcL < oFyNcL) {
            return -1;
          }
          if (oFxNcL > oFyNcL) {
            return 1;
          }
        }
        return 0;
      }

      function sortByProperty(property) {
        return function (a, b) {
          var va = a[property];
          var vb = b[property];
          if (va && vb) {
            return _naturalSort(va, vb);
          }
        };
      }

      /**
       * @ngdoc method
       * @name getSwitchSelectionMode
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Return a list of device properties
       * This list is used in ngOvListBox/ovlistBox on sorting, generating detail information for a device
       * Sorting will use name, key of each item in the list
       * Generating will use title (if using ovListBoxGetContent function in ovUtilities service), key of each item in the list
       *
       * @return {array} An array containing elements used for ov-ux-select
       * */
      function getDevicePropertyList() {
        /*
         * Return a list of device properties
         * This list is used in ngOvListBox/ovlistBox on sorting, generating detail information for a device
         * Sorting will use name, key of each item in the list
         * Generating will use title (if using ovListBoxGetContent function in ovUtilities service), key of each item in the list
         * */
        var commonPath = 'common.sortFieldsList.';
        return [
          //{name: $i18next('common.default'), key: 'friendlyName', title: $i18next('common.default')},
          {
            name: $i18next(commonPath + 'friendlyName'),
            key: 'friendlyName',
            title: $i18next(commonPath + 'friendlyName')
          },
          {name: $i18next(commonPath + 'name'), key: 'name', title: $i18next(commonPath + 'name')},
          {name: $i18next(commonPath + 'ipAddress'), key: 'ipAddress', title: $i18next(commonPath + 'ipAddress')},
          {name: $i18next(commonPath + 'location'), key: 'location', title: $i18next(commonPath + 'location')},
          {name: $i18next(commonPath + 'macAddress'), key: 'macAddress', title: $i18next(commonPath + 'macAddress')},
          {name: $i18next(commonPath + 'description'), key: 'description', title: $i18next(commonPath + 'description')},
          {name: $i18next(commonPath + 'runningFrom'), key: 'runningFrom', title: $i18next(commonPath + 'runningFrom')},
          {name: $i18next(commonPath + 'version'), key: 'version', title: $i18next(commonPath + 'version')},
          {name: $i18next(commonPath + 'seenBy'), key: 'seenBy', title: $i18next(commonPath + 'seenBy')},
          {name: $i18next(commonPath + 'status'), key: 'status', title: $i18next(commonPath + 'status')},
          {name: $i18next(commonPath + 'traps'), key: 'traps', title: $i18next(commonPath + 'traps')},
          {name: $i18next(commonPath + 'deviceDNS'), key: 'deviceDNS', title: $i18next(commonPath + 'deviceDNS')},
          {name: $i18next(commonPath + 'type'), key: 'others.ChassisName', title: $i18next(commonPath + 'type')},
          {
            name: $i18next(commonPath + 'deviceLastUpgradeStatus'),
            key: 'deviceLastUpgradeStatus',
            title: $i18next(commonPath + 'deviceLastUpgradeStatus')
          },
          {name: $i18next(commonPath + 'backupDate'), key: 'backupDate', title: $i18next(commonPath + 'backupDate')},
          {
            name: $i18next(commonPath + 'backupVersion'),
            key: 'backupVersion',
            title: $i18next(commonPath + 'backupVersion')
          },
          {
            name: $i18next(commonPath + 'discoveredDateTime'),
            key: 'discoveredDateTime',
            title: $i18next(commonPath + 'discoveredDateTime')
          },
          {
            name: $i18next(commonPath + 'lastKnownUpAt'),
            key: 'lastKnownUpAt',
            title: $i18next(commonPath + 'lastKnownUpAt')
          }
        ];
      }

      /**
       * @ngdoc method
       * @name compareStringIgnoreCase
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Compare two input string ignore case
       *
       * @param {string} str1 Source string to compare
       * @param {string} str2 Destination string to compare
       *
       * @returns {boolean} True if two strings are equal. Otherwise false
       */
      function compareStringIgnoreCase(str1, str2) {
        var result = false;
        if (angular.isString(str1) && angular.isString(str2)) {
          return str1.toUpperCase() === str2.toUpperCase();
        }
        return result;
      }

      /**
       * @ngdoc method
       * @name getImageData
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Get image data from url
       *
       * @param {string} url image url
       *
       * @returns {object} promise
       */
      function getImageData(url) {
        var deferred = $q.defer();
        var img = new Image();
        img.src = url;

        img.onload = function () {
          deferred.resolve(img);
        };

        img.onerror = function () {
          deferred.reject();
        };

        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name getDefaultTagList
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Return a list of default tag elements used for decorating a device item object.
       *
       * @example
       * Add tag `Up` to the device template
       *
       * <pre>
       *   // HTML
       *   <div>
       *     <div>
       *       {{ctrl1.deviceItemObject.ipAddress}}
       *     </div>
       *     <div>
       *       <small ng-repeat="tag in ctrl1.deviceTagList track by $index">
       *         <span ng-if="tag.criteria(item, ctrl1.deviceTagConfig)" class="ov-tag-item {{tag.cssStyleName}} {{dynamicTagClass(item)}}" style="{{tag.cssStyle}}">
       *           {{ tag.statusKey | i18next }}
       *         </span>
       *       </small>
       *     </div>
       *   </div>
       * </pre>
       *
       * <pre>
       *   // JS
       *   ctrl1.deviceItemObject = {
       *     idAddress: '10.1.1.1',
       *     status: 'Up'
       *   };
       *
       *   ctrl1.deviceTagList = $ovUtility.getDefaultTagList();
       *   ctrl1.deviceTagConfig = {
       *     showUpDownTag: true
       *   };
       * </pre>
       *
       * @return {array} An array of default tag elements
       *
       * */
      function getDefaultTagList() {
        //var KEY_SWITCH_UP = ovConstant.deviceStatus.up,
        //  KEY_SWITCH_WARNING = ovConstant.deviceStatus.warning,
        //  KEY_SWITCH_DOWN = ovConstant.deviceStatus.down,
        //  KEY_SWITCH_REACHABLE = ovConstant.deviceStatus.reachable;
        //
        //return [
        //  {
        //    criteria: function (item, config) {
        //      return compareStringIgnoreCase(item.status, KEY_SWITCH_UP) && config.showUpDownTag;
        //    },
        //    statusKey: 'common.deviceStatus.up',
        //    cssStyleName: 'ov-tag-up'
        //  },
        //  {
        //    criteria: function (item, config) {
        //      return compareStringIgnoreCase(item.status, KEY_SWITCH_WARNING) && config.showUpDownTag;
        //    },
        //    statusKey: 'common.deviceStatus.warning',
        //    cssStyleName: 'ov-tag-warning'
        //  },
        //  {
        //    criteria: function (item, config) {
        //      return compareStringIgnoreCase(item.status, KEY_SWITCH_DOWN) && config.showUpDownTag;
        //    },
        //    statusKey: 'common.deviceStatus.down',
        //    cssStyleName: 'ov-tag-down'
        //  },
        //  {
        //    criteria: function (item, config) {
        //      return item.assigned && config.showAssignedTag;
        //    },
        //    statusKey: 'common.deviceStatus.assigned',
        //    cssStyleName: 'ov-tag-assigned'
        //  },
        //  {
        //    criteria: function (item) {
        //      return item.isClearPassServer && item.accessType === KEY_SWITCH_REACHABLE;
        //    },
        //    statusKey: 'common.deviceStatus.up',
        //    cssStyleName: 'ov-tag-up'
        //  },
        //  {
        //    criteria: function (item) {
        //      return item.isClearPassServer && item.accessType !== KEY_SWITCH_REACHABLE;
        //    },
        //    statusKey: 'common.deviceStatus.down',
        //    cssStyleName: 'ov-tag-down'
        //  },
        //  {
        //    criteria: function (item) {
        //      return item.isClearPassServer;
        //    },
        //    statusKey: 'common.clearpass',
        //    cssStyleName: 'ov-tag-primary'
        //  },
        //  {
        //    criteria: function (item) {
        //      return item.isClearPassServer && item.vendorEnabled;
        //    },
        //    statusKey: 'common.clearpassDevice.vendorEnabled',
        //    cssStyleName: 'ov-tag-up'
        //  },
        //  {
        //    criteria: function (item) {
        //      return item.isClearPassServer && !item.vendorEnabled;
        //    },
        //    statusKey: 'common.clearpassDevice.vendorDisabled',
        //    cssStyleName: 'ov-tag-unknown'
        //  },
        //  {
        //    criteria: function (item) {
        //      return item.outOfSync;
        //    },
        //    statusKey: 'common.deviceStatus.outOfDate',
        //    cssStyleName: 'ov-tag-danger'
        //  },
        //  {
        //    criteria: function (item) {
        //      return item.changed;
        //    },
        //    statusKey: 'common.deviceStatus.changed',
        //    cssStyleName: 'ov-tag-primary'
        //  }
        //];
      }

      /**
       * @ngdoc method
       * @name getSwitchSelectionMode
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Return a array containing elements used for <a href="api/ov-ov-component.directive:ovUxSelect">ovUxSelect</a> component.
       * The array implies device selection modes used within the application
       *
       * @returns {array} An array containing elements used for ov-ux-select
       */
      function getSwitchSelectionMode() {
        return [
          {
            key: false,
            name: $i18next('common.switchSelectionMode.normal'),
            value: ovConstant.mode.switchPicker
          },
          {
            key: true,
            name: $i18next('common.switchSelectionMode.topology'),
            value: ovConstant.mode.topology
          }
        ];
      }

      function TimeStampFormatter(row, cell, value) {
        return new Date(value);
      }

      /**
       * Set or clear the hashkey for an object.
       * @param obj object
       * @param h the hashkey (!truthy to delete the hashkey)
       */
      function setHashKey(obj, h) {
        if (h) {
          obj.$$hashKey = h;
        } else {
          delete obj.$$hashKey;
        }
      }

      function isFunction(value) {
        return typeof value === 'function';
      }

      function isObject(value) {
        // http://jsperf.com/isobject4
        return value !== null && typeof value === 'object';
      }

      /**
       * @ngdoc method
       * @name isEmpty
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Check value is empty or null or undefined
       * @param {*} value Value to check empty
       * @returns {boolean} Boolean value detects given value is empty or not
       */
      function isEmpty(value) {
        return value === '' || angular.isUndefined(value) || value === null;
      }

      var toString = Object.prototype.toString;

      /**
       * Determines if a value is a regular expression object.
       *
       * @private
       * @param {*} value Reference to check.
       * @returns {boolean} True if `value` is a `RegExp`.
       */
      function isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
      }

      function isDate(value) {
        return toString.call(value) === '[object Date]';
      }


      var isArray = Array.isArray;

      /**
       * copied from version: 1.4.3 8/7/2015
       * util function for merge
       * @param dst
       * @param objs
       * @param deep
       * @returns {*}
       */
      function baseExtend(dst, objs, deep) {
        var h = dst.$$hashKey;

        for (var i = 0, ii = objs.length; i < ii; ++i) {
          var obj = objs[i];
          if (!isObject(obj) && !isFunction(obj)) {
            continue;
          }
          var keys = Object.keys(obj);
          for (var j = 0, jj = keys.length; j < jj; j++) {
            var key = keys[j];
            var src = obj[key];

            if (deep && isObject(src)) {
              if (isDate(src)) {
                dst[key] = new Date(src.valueOf());
              } else if (isRegExp(src)) {
                dst[key] = new RegExp(src);
              } else {
                if (!isObject(dst[key])) {
                  dst[key] = isArray(src) ? [] : {};
                }
                baseExtend(dst[key], [src], true);
              }
            } else {
              dst[key] = src;
            }
          }
        }

        setHashKey(dst, h);
        return dst;
      }


      /**
       * @ngdoc method
       * @name merge
       * @methodOf ov-component.service:$ovUtility
       * @description
       * The result keep the same reference with dst
       *
       * @param {object} dst Destination object to merge
       * @param {object} target Target object to use when merging
       *
       * @returns {object} Reference to dst object
       */
      function merge(dst, target) {
        return baseExtend(dst, [].slice.call(arguments, 1), true);
      }

      /**
       * @ngdoc method
       * @name validateFunction
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Validate func is a function
       *
       * @param {*} func Function to validate
       *
       * @returns {function} [function=angular.noop]
       */
      function validateFunction(func) {
        var checkFunction = angular.noop;
        if (func && angular.isFunction(func)) {
          checkFunction = func;
        } else {
          $log.ovDebug(func + ' is not a function');
        }
        return checkFunction;
      }

      /**
       * @ngdoc method
       * @name removeSpacesFromString
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Remove spaces from string
       *
       * @param {string} sourceString Source space to remove spaces
       *
       * @returns {string} String after being removed spaces
       */
      function removeSpacesFromString(sourceString) {
        return sourceString.replace(/\s/g, '');
      }

      /**
       * @ngdoc method
       * @name validator
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Provide a helper object involved in validation including the following helper functions:
       * * `checkDataExist`: Check if given data is defined and not Null
       * * `checkStringExist`: Check if given data is a string and not empty
       * * `isNotEmpty`: Check if given data is defined and not empty
       * * `isNumber`: Check if given data is a number
       * * `checkArrayFirstElementExist`: Check if given data is a valid array containing at least one element
       *
       * @returns {object} Time helper object
       */
      function validator() {
        function checkDataExist(data) {
          var res = false;
          if (angular.isDefined(data) && data !== null) {
            res = true;
          }
          return res;
        }

        function checkStringExist(data) {
          var res = false;
          if (angular.isString(data) && data !== '') {
            res = true;
          }
          return res;
        }

        function isNumber(data) {
          var res = false;
          if (!isNaN(data) && angular.isNumber(+data)) {
            res = true;
          }
          return res;
        }

        function isNotEmpty(data) {
          var res = false;
          if (angular.isDefined(data) && data !== '') {
            res = true;
          }
          return res;
        }

        function checkArrayFirstElementExist(data) {
          var res = false;
          if (angular.isArray(data) && data.length > 0 && checkDataExist(_.first(data))) {
            res = true;
          }
          return res;
        }

        return {
          checkDataExist: checkDataExist,
          checkStringExist: checkStringExist,
          isNotEmpty: isNotEmpty,
          isNumber: isNumber,
          checkArrayFirstElementExist: checkArrayFirstElementExist
        };

      }

      /**
       * @ngdoc method
       * @name timeHelper
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Provide a helper object involved in time including the following helper functions:
       * * `convertTimeUnitsToSec`: accepts an object with required structure {day: 1, hour: 1, min: 1, sec: 1} and turns it into seconds
       * * `convertSecToTimeUnits`: accepts a number of seconds and turns it into object with following structure: {day: 1, hour: 1, min: 1, sec: 1}
       *
       * @returns {object} Time helper object
       */
      function timeHelper() {
        function convertTimeUnitsToSec(timeUnitsObj) {
          var res = timeUnitsObj.day * 24 * 60 * 60 + timeUnitsObj.hour * 60 * 60 + timeUnitsObj.min * 60 + timeUnitsObj.sec;
          return res;
        }

        function convertSecToTimeUnits(totalSec) {
          var seconds = totalSec;
          var minutes = Math.floor(seconds / 60);
          var hours = Math.floor(minutes / 60);
          var days = Math.floor(hours / 24);

          var dayUnit = days;
          var hourUnit = hours - (dayUnit * 24);
          var minuteUnit = minutes - (dayUnit * 24 * 60) - (hourUnit * 60);
          var secondUnit = seconds - (dayUnit * 24 * 60 * 60) - (hourUnit * 60 * 60) - (minuteUnit * 60);
          var res = {
            'day': dayUnit,
            'hour': hourUnit,
            'min': minuteUnit,
            'sec': secondUnit
          };
          return res;
        }

        return {
          convertTimeUnitsToSec: convertTimeUnitsToSec,
          convertSecToTimeUnits: convertSecToTimeUnits
        };
      }

      /**
       * @ngdoc method
       * @name syncSrcToDst
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Using to sync available switch and selected switch depend on existing selected data (selection mode)
       *
       * @param {array} srcSCol Array of src selected data
       * @param {array} srcACol Array of src available data
       * @param {array} dstSCol Array of dst selected data
       * @param {array} dstACol Array of dst available data
       * @param {string} srcField primaryKey of src data (omit when !object)
       * @param {string} dstField primaryKey of dst data (omit then !object)
       *
       *
       * @example
       *
       * <pre>
       *  Input:
       *    srcSCol [1, 5]
       *    srcACol null
       *    dstSCol: [{key: 1}, {key: 2}, {key: 3}]
       *    dstSCol: [{key: 4}, {key: 5}, {key: 6}]
       *    srcField: null -> because src data !object
       *    dstField: 'key'
       *
       *  Output:
       *    dstSCol: [{key: 1}, {key: 6}]
       *    dstACol: [{key: 2}, {key: 3}, {key: 4}, {key: 5}]
       * </pre>
       */
      function syncSrcToDst(srcSCol, srcACol, dstSCol, dstACol, srcField, dstField) {
        var i, j;

        //Move selected item to except item
        angular.forEach(dstSCol, function (item) {
          dstACol.push(angular.copy(item));
        });

        //set length = 0 to prevent lost reference
        dstSCol.length = 0;

        //Synchronize from srcSCol to dstSCol
        for (i = 0; i < srcSCol.length; i++) {
          for (j = 0; j < dstACol.length; j++) {
            var value1, value2;
            value1 = srcField ? srcSCol[i][srcField] : srcSCol[i];
            value2 = dstField ? dstACol[j][dstField] : dstACol[j];

            if (value1 === value2) {
              dstSCol.push(angular.copy(dstACol[j]));
              dstACol.splice(j, 1);
              break;
            }
          }
        }
      }

      /**
       * @ngdoc method
       * @name findValueByKey
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Find item in array of objects by value and field
       *
       * @param {*} value  Given value to compare
       * @param {array} list Array of item to find
       * @param {string} key Search property of an item in the list
       * @returns {object} Found item
       *
       * @example
       *
       * <pre>
       *   Input:
       *     value: 1
       *     list: [{id: 1}, {id: 2}]
       *     key: 'id'
       *   Output:
       *     {id: 1}
       * </pre>
       */
      function findValueByKey(value, list, key) {
        var result = null;
        for (var i = 0; i < list.length; i++) {
          if (list[i][key] === value) {
            return list[i];
          }
        }
        return result;
      }

      /**
       * @ngdoc method
       * @name findValueIndexByKey
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Find index of an item in array of objects by value and field
       *
       * @param {*} value  Given value to compare
       * @param {array} list Array of item to find
       * @param {string} key Search property of an item in the list
       * @returns {number} Found item index
       *
       * @example
       *
       * <pre>
       *   Input:
       *     value: 2
       *     list: [{id: 1}, {id: 2}]
       *     key: 'id'
       *   Output:
       *     1
       * </pre>
       */
      function findValueIndexByKey(value, list, key) {
        for (var i = 0; i < list.length; i++) {
          if (list[i][key] === value) {
            return i;
          }
        }
        return -1;
      }

      function findRootSidebarMenu(menu) {
        while (menu && menu.parent) {
          menu = menu.parent;
        }
        return menu;
      }

      function findChildSidebarMenuItem(menu, id) {
        if (menu.menuItems) {
          for (var i = 0; i < menu.menuItems.length; i++) {
            var item = menu.menuItems[i];

            if (item.id === id) {
              return item;
            }

            var result = findChildSidebarMenuItem(item, id);
            if (result) {
              return result;
            }
          }
        }

        return null;
      }

      /**
       * @ngdoc method
       * @name strStartsWith
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Detect if a string starts with given prefix
       *
       * @param {string} str String to detect
       * @param {string} prefix Prefix string to detect
       *
       * @return {boolean} True if given string starts with the prefix. Otherwise false
       * */
      function strStartsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
      }

      /**
       * @ngdoc method
       * @name strEndsWith
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Detect if a string ends with given suffix
       *
       * @param {string} str String to detect
       * @param {string} suffix Suffix string to detect
       *
       * @return {boolean} True if given string ends with the prefix. Otherwise false
       * */
      function strEndsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }

      /**
       * @ngdoc method
       * @name extendConfig
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Merge MISSING values of defaultConfig to config and keep reference of config
       *
       * @param {object} config Destination config object to merge missing values
       * @param {object} defaultConfig Default config object to use when merging missing values
       * @returns {object} Reference to config
       *
       * @example
       * <pre>
       * Ex:
       *  defaultConfig = {
       *    options1: {
       *      key1: true,
       *      key2: true
       *      key3: false
       *    },
       *    option1: [1, 2],
       *    option2: []
       *  }
       *
       *  config = {
       *    options: {
       *      key1: false
       *    },
       *    option1: [3, 4]
       *  }
       *
       *  extendConfig(config, defaultConfig)
       *  config = {
       *    options1: {
       *      key1: false,
       *      key2: true
       *      key3: false
       *    },
       *    option1: [3, 4],
       *    option2: []
       *  }
       *  </pre>
       */
      function extendConfig(config, defaultConfig) {
        //Only support config and defaultConfig are object type
        if ($.isPlainObject(config) && $.isPlainObject(defaultConfig)) {
          var keys = Object.keys(defaultConfig);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var src = defaultConfig[key];

            if ($.isPlainObject(src)) {
              if (!$.isPlainObject(config[key])) {
                config[key] = {};
              }
              extendConfig(config[key], src);
            } else if (angular.isUndefined(config[key])) {
              config[key] = src;
            }
          }
        }

        return config;
      }

      var service = {
        isEmpty: isEmpty,
        timeHelper: timeHelper,
        validator: validator,
        TimeStampFormatter: TimeStampFormatter,
        getSwitchSelectionMode: getSwitchSelectionMode,
        syncSrcToDst: syncSrcToDst,
        findValueByKey: findValueByKey,
        findValueIndexByKey: findValueIndexByKey,
        getDeviceSortedFieldList: getDevicePropertyList,
        getDeviceSelectedFieldList: getDevicePropertyList,
        getDefaultTagList: getDefaultTagList,
        findValItem: findValItem,
        getImageData: getImageData,
        compareStringIgnoreCase: compareStringIgnoreCase,
        /**
         * @ngdoc method
         * @name compareArrayByProperty
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Compare 2 arrays included: order of items and number of array items
         * This function is not used to compare deeply 2 arrays
         * Only compare when length of 2 items is greater than 0,
         * otherwise, the two array are considered as the same, this is to service for ovDataView in which the least at one "field" must be selected
         *
         * @param {array} selectedArray Source array to compare
         * @param {array} originalArray Destination array to compare
         * @param {string} property Property of an item to compare
         *
         * @returns {boolean} True if 2 array are the same and not empty. Otherwise false
         * */
        compareArrayByProperty: function (selectedArray, originalArray, property) {
          if (!property) {
            // Two arrays are considered as not equal when property used to be compare is invalid (undefined, NULL, empty)
            return false;
          }

          if (!angular.isArray(selectedArray)) {
            selectedArray = [];
          }
          if (!angular.isArray(originalArray)) {
            originalArray = [];
          }

          if (selectedArray.length !== originalArray.length) {
            return false;
          }

          if (selectedArray.length === 0) {
            // Two empty arrays are considered as equal
            return true;
          }

          var copyOfSelectedArray = angular.copy(selectedArray);
          var copyOfOriginalArray = angular.copy(originalArray);

          // Sort these two arrays before comparing
          copyOfSelectedArray.sort(sortByProperty(property));
          copyOfOriginalArray.sort(sortByProperty(property));

          for (var i = 0, len = copyOfSelectedArray.length; i < len; i++) {
            if (copyOfSelectedArray[i][property] !== copyOfOriginalArray[i][property]) {
              return false;
            }
          }
          return true;
        },
        /**
         * @ngdoc method
         * @name compareArray
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Compare 2 arrays included: order of items and number of array items
         * This function is not used to compare deeply 2 arrays
         * Only compare when length of 2 items is greater than 0,
         * otherwise, the two array are considered as the same, this is to service for ovDataView in which the least at one "field" must be selected
         *
         * @param {array} destinationArray Destination array to compare
         * @param {array} originArray Source array to compare
         * @param {string} primaryKey Key of an item to compare
         *
         * @returns {boolean} True if 2 array are the same and not empty. Otherwise false
         * */
        compareArray: function (destinationArray, originArray, primaryKey) {
          destinationArray = destinationArray || [];
          originArray = originArray || [];
          if (destinationArray.length && originArray.length) {
            if (destinationArray.length !== originArray.length) { // Compare 2 arrays are based on number of items
              return false;
            } else { // Compare 2 arrays are based on order of items
              if (!primaryKey) {
                primaryKey = (originArray[0] && originArray[0].field) ? 'field' : 'key';
              }
              for (var i = 0, len = originArray.length; i < len; i++) {
                if (originArray[i] && destinationArray[i] && originArray[i][primaryKey] !== destinationArray[i][primaryKey]) {
                  return false;
                }
              }
              return true;
            }
          } else { // one of the two array is empty, are considered the same
            return true;
          }
        },
        /**
         * @ngdoc method
         * @name compareVersion
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Compare version
         *
         * <pre>
         * Version format: [version].[buildNumber].[subVersion]
         *  ==> ex: 7.3.4.111.R01
         *        version: 7.3.4
         *        buildNumber: 111
         *        subVersion: R01
         * Compare in turn: version, subVersion, buildNumber
         * ==> 7.3.4.35.R02 > 7.3.4.111.R01
         * </pre>
         *
         * @param {string} firstVer            : first version
         * @param {string} comparisonOperator  : operators include: =, !=, >, >=, <, <=
         * @param {string} secondVer           : second version
         *
         * @returns {boolean} True if two versions are equal. Otherwise false
         */
        compareVersion: function (firstVer, comparisonOperator, secondVer) {

          if (!firstVer || !secondVer) {  //Check existing
            return false;
          }

          //Convert to array that only contain numbers
          var REGEX = /[a-zA-Z]/,
            ZERO = '0',
            DOT = '.',
            UNDEFINED = 'undefined',
            firstVersion,
            secondVersion,
            firstVerArr,
            secondVerArr;

          // Re-format of version from [version].[buildNumber].[subVersion] -> [version].[subVersion].[buildNumber] to compare easily
          // ex: 7.3.4.111.R02 -> 7.3.4.02.111
          function reformatVersionArray(versionArray){
            if (REGEX.test(versionArray[versionArray.length - 1])) {
              //Remove the last element in array split from version (ex: 'R01', 'R02', ...)
              //And then removing the first character in that element
              var subVersion = versionArray.splice(-1).toString().substr(1);

              //Add subVersion to array
              versionArray.splice(versionArray.length-1, 0, subVersion);
            }
            return versionArray;
          }
          firstVerArr = reformatVersionArray(firstVer.split(DOT));
          secondVerArr = reformatVersionArray(secondVer.split(DOT));

          //Make element of 2 array have length the same
          var length = (firstVerArr.length > secondVerArr.length) ? firstVerArr.length : secondVerArr.length; //length of array
          for (var i = 0; i < length; i++) {
            if (typeof firstVerArr[i] === UNDEFINED || firstVerArr[i] === null) {
              firstVerArr[i] = ZERO;
            }
            if (typeof secondVerArr[i] === UNDEFINED || secondVerArr[i] === null) {
              secondVerArr[i] = ZERO;
            }

            var len = firstVerArr[i].length > secondVerArr[i].length ? firstVerArr[i].length : secondVerArr[i].length;  //length of element in array
            for (var j = 0; j < len; j++) {
              if (typeof firstVerArr[i][j] === UNDEFINED || firstVerArr[i][j] === null) {
                firstVerArr[i] = ZERO + firstVerArr[i];
              }
              if (typeof secondVerArr[i][j] === UNDEFINED || secondVerArr[i][j] === null) {
                secondVerArr[i] = ZERO + secondVerArr[i];
              }
            }
          }

          //Get version that can use to compare
          firstVersion = firstVerArr.join('');
          secondVersion = secondVerArr.join('');

          //Version should not contain any letter
          if (REGEX.test(firstVersion) || REGEX.test(secondVersion)) {
            return false;
          }

          var comparison = {
            '=': function (src, pattern) {
              return src === pattern;
            },
            '>': function (src, pattern) {
              return src > pattern;
            },
            '<': function (src, pattern) {
              return src < pattern;
            },
            '!=': function (src, pattern) {
              return src !== pattern;
            },
            '>=': function (src, pattern) {
              return src >= pattern;
            },
            '<=': function (src, pattern) {
              return src <= pattern;
            }
          };

          return comparison[comparisonOperator] ? comparison[comparisonOperator](parseInt(firstVersion, 10), parseInt(secondVersion, 10)) : false;

        },
        validIpRange: function (ip, subnet) {
          if (ip && subnet) {
            var ipArray = ip.split('.');
            var subnetArray = subnet.split('.');
            for (var i = 0, len = ipArray.length; i < len; i++) {
              /*jslint bitwise: true */
              var andResult = Number(ipArray[i]) & Number(subnetArray[i]);
              if (andResult !== Number(ipArray[i])) {
                return false;
              }
            }
          }
          return true;
        },
        naturalSort: _naturalSort,
        /**
         * @ngdoc method
         * @name compareMACAddress
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Compare 2 MAC addresses
         *
         * @param {string} a Source MAC address to compare
         * @param {string} b Destination MAC address to compare
         *
         * @returns {boolean} True if 2 MAC addresses are equal. Otherwise false
         * */
        compareMACAddress: function (a, b) {
          if (!a || !b) {
            return;
          }
          a = a.split(':');
          b = b.split(':');
          for (var i = 0; i < a.length; i++) {
            if (parseInt(a[i], 16) > parseInt(b[i], 16)) {
              return 1;
            } else if (parseInt(b[i], 16) > parseInt(a[i], 16)) {
              return -1;
            }
          }
          return 0;
        },
        /**
         * @ngdoc method
         * @name ovListBoxGetContent
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Return a string including key-value pairs of an item object in form `key: value` separated by semicolons.
         * It iterates through the list from the second item to get value of the object
         *
         * @param {object} item Item object to get content
         * @param {array} list Array of items which each item property `key` will be used to get value of the item object
         *
         * @return {string} Content of the object in form of key-value pairs
         *
         * @example
         *
         * <pre>
         *   Input:
         *     list: [{key: 'name', title: 'Name'}, {key: 'address', title: 'Address'}, {key: 'detailInfo', title: 'Detail Info'}]
         *     item: {
         *       name: 'Item 1',
         *       address: 'Address 1'
         *     }
         *
         *   Output:
         *     Name: Item 1; Address: Address 1; Detail Info: N/A
         * </pre>
         *
         * */
        ovListBoxGetContent: function (item, list) {
          var content = '';
          var tmp = '', attrValue;
          var i = 0;
          for (i = 1; i < list.length; i++) {
            attrValue = findValItem(item, list[i].key);
            if (angular.isUndefined(attrValue) || (angular.isString(attrValue) && attrValue.trim() === '') || attrValue === '\u0000') {
              attrValue = $i18next('common.unset');
            }
            if (attrValue === null) {
              attrValue = $i18next('common.null');
            }
            if (angular.isDefined(attrValue) && attrValue !== null) {
              //Check if attrValue is OBJECT or not////
              if (typeof (attrValue) === 'object') {
                var isArray = null;
                isArray = attrValue;
                ///if not Array/////
                if (isArray.length === 0) {
                  if (isArray.name) {
                    tmp = $i18next(list[i].title) + ': ' + isArray.name;
                  }
                }
                ///if is Array/////
                else {
                  tmp = $i18next(list[i].title) + ': ';
                  for (var k = 0; k < isArray.length; k++) {
                    if (isArray[k].name) {
                      if (k !== isArray.length - 1) {
                        tmp += isArray[k].name + ', ';
                      } else {
                        tmp += isArray[k].name;
                      }
                    } else if (typeof isArray[k] === 'number' || typeof isArray[k] === 'string') {
                      if (k !== isArray.length - 1) {
                        tmp += isArray[k] + ', ';
                      } else {
                        tmp += isArray[k];
                      }
                    }
                  }
                }
              } else { /// not Object
                tmp = $i18next(list[i].title) + ': ' + attrValue;
              }
            }
            content += tmp;
            if (i < list.length - 1 && tmp !== '') {
              content += '; ';
            }
            tmp = '';
          }
          content = content.trim();
          content = content.replace(/;$/, '');
          return content;
        },
        /**
         * @ngdoc method
         * @name ovListBoxGetTitle
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Return the value of the object regarding to the first item key in the list
         *
         * @param {object} item Item object to get title
         * @param {array} list Array of items which each item property `key` will be used to get value of the item object
         *
         * @return {string} Value of the object based on the first item key in the list
         *
         * @example
         *
         * <pre>
         *   Input:
         *     list: [{key: 'name', title: 'Name'}, {key: 'address', title: 'Address'}, {key: 'detailInfo', title: 'Detail Info'}]
         *     item: {
         *       name: 'Item 1',
         *       address: 'Address 1'
         *     }
         *
         *   Output:
         *     Item 1
         * </pre>
         *
         * */
        ovListBoxGetTitle: function (item, list) {
          var title = '', attrValue = findValItem(item, list[0].key);
          if (angular.isDefined(attrValue) && attrValue !== null) {
            title += attrValue;
          }

          //when user changes the title( N/A, empty string), should set 'N/A' value for this title
          if (angular.isUndefined(attrValue) || (angular.isString(attrValue) && attrValue.trim() === '') || attrValue === '\u0000') {
            title = $i18next('common.unset');
          }

          //when user changes the title(null), should set 'NULL' value for this title
          if (attrValue === null) {
            title = $i18next('common.null');
          }

          title = title.trim();
          if (title.indexOf(',') > -1 && title.indexOf(', ') <= -1) {
//          return  title.replace(/,/g,', ');
            $log.debug('Waring: After chracter , mustbe a white space .=>Recommed: format in your data to filter and search correctly. Not use formatter ');
          }
          return title;
        },
        /**
         * @ngdoc method
         * @name getColumnList
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Convert regular javascript object whose value of each property is another object into an array of extracted object.
         * Extracted object contains:
         * * `id` and `field` property values extracted from the object property `key`
         * * `name` and `title` property values extracted from the object property `i18nKey` via $i18next
         * * `type` value extracted from the object property `type` or 0 by default
         * * `sortable` value extracted from the object property `sortable` if it's defined or true by default
         * * `resizable` value extracted from the object property `resizable` if it's defined or true by default
         * * `minWidth` value extracted from the object property `minWidth` if it's defined or by minDefaultAll parameter or 250 by default
         *
         * @param {object} attrs An object to convert
         * @param {number=} minDefaultAll A min width value applied for all item in the extracted list. Default is 250
         *
         * @returns {array} Array of all extracted items
         *
         * @example
         *
         * <pre>
         *   Input:
         *     attrs: {deviceIp: {key: 'deviceIpAddress', i18nKey: 'device.ipAddress'}}
         *     minDefaultAll: 300
         *
         *   Output:
         *     [
         *       {
         *         id: 'deviceIpAddress',
         *         field: 'deviceIpAddress',
         *         key: 'deviceIpAddress',
         *         name: 'Device IP Address',
         *         title: 'Device IP Address',
         *         i18nKey: 'device.ipAddress',
         *         sortable: true,
         *         resizable: true,
         *         minWidth: 300
         *       }
         *     ]
         * </pre>
         * */
        getColumnList: function (attrs, minDefaultAll) {
          var result = [];
          if (angular.isUndefined(minDefaultAll || minDefaultAll === null)) {
            minDefaultAll = 250;
          }
          angular.forEach(attrs, function (value) {
            value.id = value.field = value.key;
            value.name = value.title = $i18next(value.i18nKey);
            value.type = value.type || 0;
            value.sortable = angular.isDefined(value.sortable) ? value.sortable : true;
            value.resizable = angular.isDefined(value.resizable) ? value.resizable : true;
            value.minWidth = value.minWidth || minDefaultAll;
            result.push(value);
          });
          return result;
        },
        /**
         * @ngdoc method
         * @name ovPrint
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Open print dialog of a browser. The content of print papers is based upon custom templateUrl, headers, and rows
         *
         * @param {string} templateUrl Custom template URL which uses headers and rows to render print papers
         * @param {array} headers An array of all headers object
         * @param {array} rows An array of all items
         * */
        ovPrint: function (templateUrl, headers, rows) {
          console.log('ovPrint', headers, rows);
          var body = $document.find('body');
          body.addClass('print-mode');
          var print = angular.element('<div class="print-div"></div>');
          var templateCache = '';
          var scope = $rootScope.$new();
          scope.headers = angular.copy(headers);
          scope.rows = angular.copy(rows);
          $http.get(templateUrl, {cache: templateCache}).success(function (htmlTpl) {
            var html = $compile(htmlTpl)(scope);
            $timeout(function () {
              print.append(html[0]);
              body.append(print);
              window.print();
              print.remove();
              print = null;
              body.removeClass('print-mode');
              body = null;
            });
          });
        },
        /**
         * @ngdoc method
         * @name ovPrintHtml
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Open print dialog of a browser with the content of print papers is given by the parameter `html`
         *
         * @param {string} html Content of print papers
         * */
        ovPrintHtml: function (html) {
          var body = $document.find('body');
          body.addClass('print-mode');
          var printTemplate = angular.element('<div class="print-div">' + html + '</div>');
          $timeout(function () {
            body.append(printTemplate);
            window.print();
            printTemplate.remove();
            printTemplate = null;
            body.removeClass('print-mode');
            body = null;
          });
        },
        /**
         * @ngdoc method
         * @name doRequest
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Do a single request using Angular <a>$http</a> service and return a promise of the request
         *
         * @param {string} link URL API of the request
         * @param {*} sendData Data accompanying the request
         * @param {string} reqMethod Request method name. Valid ones are:
         * * GET
         * * PUT
         * * POST
         * * DELETE
         *
         * @returns {object} Promise object of the request
         * */
        doRequest: function (link, sendData, reqMethod) {
//        mainService.js
          if (link && link.indexOf('proxy?ip=') < 0) {
            link = link;
          }
          if (reqMethod.toUpperCase() !== 'DELETE') {
            return $http({
              method: reqMethod,
              url: link,
              data: sendData
            });
          } else {
            var requestData = {data: sendData, headers: {'Content-Type': 'application/json'}};
            return $http.delete(link, requestData);
          }
        },
        /**
         * @ngdoc method
         * @name doRequestMultiPart
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Do a multi-part request using <a>$ovChunked</a> service
         *
         * @param {string} link URL API of the request
         * @param {*} sendData Data accompanying the request
         * @param {string} reqMethod Request method name. Valid ones are:
         * * GET
         * * PUT
         * * POST
         * * DELETE
         * @param {function=} progressCallBack Callback function being executed whenever a piece of data return from server
         * @param {function=} finishCallBack Callback function being executed whenever the request is finished
         * @param {function=} errorCallback Callback function being executed whenever error happens
         * */
        //doRequestMultiPart: function (link, sendData, reqMethod, progressCallBack, finishCallBack, errorCallback) {
        //  var response = '';
        //  var tmp = '';
        //  if (link && link.indexOf('proxy?ip=') < 0) {
        //    link = ovHttp.proxy(link);
        //  }
        //  $ovChunked.sendRequest({method: reqMethod, url: link}, sendData)
        //    .onProgressing(function (result) {
        //      tmp = result.responseText;
        //      result = result.responseText.replace(response, '');
        //      result = result.replace(/\}\{/g, '},{');
        //      result = '[' + result + ']';
        //      var json = '';
        //      try {
        //        json = JSON.parse(result);
        //      } catch (err) {
        //      }
        //      if (json !== '') {
        //        response = tmp;
        //        if (progressCallBack) {
        //          for (var i = 0; i < json.length; i++) {
        //            progressCallBack(json[i]);
        //          }
        //        }
        //      }
        //    })
        //    .onFinish(function (result) {
        //      if (finishCallBack) {
        //        finishCallBack(result);
        //      }
        //    })
        //    .onError(function (response) {
        //      if (errorCallback) {
        //        console.log('error');
        //        errorCallback(response.status);
        //      }
        //    })
        //    .send();
        //},
        hasPermission: function (app) {
          return $rootScope.hasPermission(app);
        },
        extendConfig: extendConfig,
        setByPath: function (obj, path, value) {
          var parts = path.split('.');
          var o = obj;
          if (parts.length > 1) {
            for (var i = 0; i < parts.length - 1; i++) {
              if (!o[parts[i]]) {
                o[parts[i]] = {};
              }
              o = o[parts[i]];
            }
          }
          o[parts[parts.length - 1]] = value;
        },
        validateFunction: validateFunction,
        merge: merge,
        removeSpacesFromString: removeSpacesFromString,


        //Calculating Color Contrast.
        //It takes the hex value and compares it to the value halfway between pure black and pure white.
        // If the hex value is less than half, meaning it is on the darker side of the spectrum, it returns white as the text color.
        // If the result is greater than half, it’s on the lighter side of the spectrum and returns black as the text value.
        /**
         * @ngdoc method
         * @name getContrastColor
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Calculating Color Contrast.
         * It takes the hex value and compares it to the value halfway between pure black and pure white.
         * If the hex value is less than half, meaning it is on the darker side of the spectrum, it returns white as the text color.
         * If the result is greater than half, it’s on the lighter side of the spectrum and returns black as the text value.
         *
         * @param {string} bgColor Color from which to generate contrast color
         *
         * @returns {string} Contrast color
         * */
        getContrastColor: function (bgColor) {
          var nThreshold = 105;
          var getRGBComponents = function (color) {
            //Convert a 3-character hex code into a 6 character one
            if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
              if (/^#([0-9a-f]{3})$/.test(color)) {
                color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
              }
              var r = color.substring(1, 3);
              var g = color.substring(3, 5);
              var b = color.substring(5, 7);

              return {
                R: parseInt(r, 16),
                G: parseInt(g, 16),
                B: parseInt(b, 16)
              };
            }
            return {R: 255, G: 255, B: 255};
          };
          var components = getRGBComponents(bgColor);
          var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

          return ((255 - bgDelta) < nThreshold) ? '#000000' : '#ffffff';
        },
        /**
         * @ngdoc method
         * @name convertResponseText2Json
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Convert string to json object
         *
         * @param {string} responseText String that is needed to convert to json object
         *
         * @returns {*} Regular JS object
         */
        convertResponseText2Json: function (responseText/*, log*/) {
          if (!responseText) {
            return;
          }
          var responseObjArr = [];
          var responseStrArr = responseText.split('}{');
          if (responseStrArr.length > 1) { // if json is multi-part
            for (var i = 0; i < responseStrArr.length; i++) {
              //Split multi-part json string into single json string
              var responseStrItem = '';
              if (i === 0) {
                responseStrItem = responseStrArr[i] + '}';
              } else if (i === responseStrArr.length - 1) {
                responseStrItem = '{' + responseStrArr[i];
              } else {
                responseStrItem = '{' + responseStrArr[i] + '}';
              }
              //Perform converting single json string to object
              var responseObjItem;
              try {
                responseObjItem = angular.fromJson(responseStrItem);
              } catch (e) {
                responseObjItem = {};
                /*if(angular.isDefined(log) && angular.isObject(log) && angular.isFunction(log.error)){
                 log.error('Error occur when converting string to json object: ' + e.toString());
                 }*/
              }
              responseObjArr.push(responseObjItem);
            }

            return responseObjArr;

          } else { // if json is single-part
            try {
              return angular.fromJson(responseText);
            } catch (e) {
              /*if(angular.isDefined(log) && angular.isObject(log) && angular.isFunction(log.error)){
               log.error('Error occur when converting string to json object: ' + e.toString());
               }*/
              //return {};
              return responseText;
            }
          }
        },
        findRootSidebarMenu: findRootSidebarMenu,
        findChildSidebarMenuItem: findChildSidebarMenuItem,
        /**
         * @ngdoc method
         * @name findSidebarMenuItem
         * @methodOf ov-component.service:$ovUtility
         * @description
         * Returns side bar item object if found. Otherwise Null
         *
         * @param {object} sideBarData Side bar object
         * @param {string} menuId Expected side bar object ID
         *
         * @returns {object} Found side bar item
         *
         * @example
         * **Side bar object structure:**
         * <pre>
         *   var rootSideBar = {
         *     id: 'root',
         *     title: 'Root',
         *     templateUrl: '/path/to/your/root//sideBar/template',
         *     i18nKey: 'sideBar.root',
         *     menuItems: []
         *   }
         *
         *   var sideBarItem1 = {
         *     id: 'item1',
         *     title: 'Item 1',
         *     templateUrl: '/path/to/your/item1/sideBar/template',
         *     i18nKey: 'sideBar.item1',
         *     menuItems: [],
         *     parent: rootSideBar
         *   };
         *
         *   ctrl1.sideBar = {};
         *   ctr1.sideBar.menu = rootSideBar;
         *   ctr1.sideBar.menu.menuItems.push(sideBarItem1);
         *
         *   var item1 = $ovUtility.findSidebarMenuItem(ctrl1.sideBar.menu, 'item1');
         * </pre>
         * */
        findSidebarMenuItem: function (sideBarData, menuId) {
          var root = findRootSidebarMenu(sideBarData);
          return findChildSidebarMenuItem(root, menuId);
        },
        strStartsWith: strStartsWith,
        strEndsWith: strEndsWith
      };


      /**
       * @ngdoc method
       * @name isSwitchDown
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Check if status of device is down
       *
       * @param {object} switchObj Switch object to be checked
       *
       * @returns {boolean} True if given object implies a down switch. Otherwise false
       */
      service.isSwitchDown = function isSwitchDown(switchObj) {
        return compareStringIgnoreCase(switchObj.status, 'Down');
      };
      /**
       * @ngdoc method
       * @name isSwitchUp
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Check if status of device is up
       *
       * @param {object} switchObj Switch object to be checked
       *
       * @returns {boolean} True if given object implies a up switch. Otherwise false
       */
      service.isSwitchUp = function isSwitchDown(switchObj) {
        return compareStringIgnoreCase(switchObj.status, 'Up');
      };

      /**
       * @ngdoc method
       * @name formatSwitch
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Add disabled property to switch object if it implies a down switch
       *
       * @param {object} switchObj Switch object to be formatted
       *
       * @returns {object} The switch object itself
       */
      service.formatSwitch = function formatSwitch(switchObj) {
        switchObj.disabled = compareStringIgnoreCase(switchObj.status, 'Down');
        return switchObj;
      };

      /**
       * @ngdoc method
       * @name formatClearpass
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Add disabled to clearpass object base on accessType and vendorEnabled (optional) attribute.
       *
       * @param {object} clearpass Clearpass object to be formatted
       * @param {boolean=} useVendorEnable Use `vendorEnabled` property of given object
       *
       * @returns {object} The clearpass object itself
       */
      service.formatClearpass = function formatClearpass(clearpass, useVendorEnable) {
        clearpass.isClearPassServer = true;
        clearpass.disabled = !compareStringIgnoreCase(clearpass.accessType, 'Reachable') || (useVendorEnable && clearpass.vendorEnabled);
        return clearpass;
      };

      /**
       * callback used in compareAction
       * @callback compareFn
       * @param {*} item - loop item in sourceArray
       * @param {*} selectedItem - loop item in selectedArray
       */
      /**
       * callback used in compareAction
       * @callback actionFn
       * @param {*} item - loop item in sourceArray
       * @param {*} selectedItem - loop item in selectedArray
       */
      /**
       *
       * @param {array} sourceArray
       * @param {array} selectedArray
       * @param {compareFn} compareFn if compareFn return true will execute actionFn
       * @param {actionFn} actionFn if actionFn return true will break loop through the sourceArray
       */
      /**
       * @ngdoc method
       * @name compareAction
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Compare two arrays and execute given action callback function if two equal items found via compareFn
       *
       * @param {array} sourceArray Source array to compare
       * @param {array} selectedArray Selected array to compare
       * @param {function} compareFn Function used to detect 2 items in 2 list are equal
       * @param {function} actionFn Callback function to execute once two equal items are found. Two item objects are passed as parameters
       * */
      service.compareAction = function compareAction(sourceArray, selectedArray, compareFn, actionFn) {
        var item, j, length;
        //return if source array and selectedArray is undefined or length < 1
        if (!sourceArray || !selectedArray || sourceArray.length < 1 || selectedArray.length < 1) {
          return;
        }
        _.each(selectedArray, function (selectedItem) {
          for (j = 0, length = sourceArray.length; j < length; j++) {
            item = sourceArray[j];
            if (compareFn(item, selectedItem)) {
              if (actionFn(item, selectedItem)) {
                break;
              }
            }
          }
        });
      };


      /**
       * @ngdoc method
       * @name restoreOvListSelectedStatus
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Add checked attribute
       *
       * @param {array} dataArray Data array to restore
       * @param {array} selectedArray Selected array to compare
       */
      service.restoreOvListSelectedStatus = function restoreOvListSelectedStatus(dataArray, selectedArray) {
        service.compareAction(
          dataArray,
          selectedArray,
          function (item, selectedItem) {
            //add item.checked = false before compare to enhance performance
            return !item.checked && item.ipAddress === selectedItem.ipAddress;
          },
          function (item/*, selectedItem*/) {
            item.checked = true;
            //return true to break the loop through the sourceArray
            return true;
          });
      };


      /**
       *  Fuzzy searching allows for flexibly matching a string with partial input, useful for filtering data very
       *  quickly based on lightweight user input.
       *  Returns true if needle matches haystack using a fuzzy-searching algorithm. Note that this program doesn't
       *  implement levenshtein distance, but rather a simplified version where there's no approximation.
       *  The method will return true only if each character in the needle can be found in the haystack
       *  and occurs after the preceding matches.
       * https://github.com/bevacqua/fuzzysearch
       * @param needle
       * @param haystack
       * @returns {boolean}
       * @example
       * ```
       fuzzysearch('twl', 'cartwheel') // <- true
       fuzzysearch('cart', 'cartwheel') // <- true
       fuzzysearch('cw', 'cartwheel') // <- true
       fuzzysearch('ee', 'cartwheel') // <- true
       fuzzysearch('art', 'cartwheel') // <- true
       fuzzysearch('eeel', 'cartwheel') // <- false
       fuzzysearch('dog', 'cartwheel') // <- false
       */
      service.fuzzySearch = function fuzzySearch(needle, haystack) {
        var hlen = haystack.length, nlen = needle.length;
        if (nlen > hlen) {
          return false;
        }
        if (nlen === hlen) {
          return needle === haystack;
        }
        outer: for (var i = 0, j = 0; i < nlen; i++) {
          var nch = needle.charCodeAt(i);
          while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
              continue outer;
            }
          }
          return false;
        }
        return true;
      };

      /**
       * @ngdoc method
       * @name addTimestamp
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Add resultTimestamp to resultItem
       *
       * @param {object} resultItem Result item object to add timestamp
       * @param {object=} config Optional configs
       * * config.ignoreTranslated ignore adding resultTimestampTranslated to resultItem.translated object
       */
      service.addTimestamp = function addTimestamp(resultItem, config) {
        var timestamp = new Date();
        //if (config && config.ignoreTranslated) {
        resultItem.resultTimestampTranslated = timestamp;
        //} else {
        resultItem.resultTimestamp = timestamp;
        resultItem.translated = resultItem.translated || {};
        resultItem.translated.resultTimestampTranslated = timestamp;
        // }

      };

      /**
       * @ngdoc method
       * @name getDefaultTopologyOptions
       * @methodOf ov-component.service:$ovUtility
       * @description
       * Generate default options used when going to Topology application to select devices
       *
       * @returns {object} An object containing default configurations for using Topology as selection tool
       *   * `availableDeviceIps`: Available device IP list used in the app
       *   * `selectedDeviceIps`: Pre-selected device IP list used in the app
       *   * `selectedDeviceIds`: Pre-selected device ID list corresponding to `selectedDeviceIps`
       *   * `useDownDevice`: Allow/disallow to use down devices
       *   * `limitSelectedDevice`: A limit number of devices can be selected
       * */
      service.getDefaultTopologyOptions = function () {
        return {
          availableDeviceIps: [],
          selectedDeviceIps: [],
          selectedDeviceIds: [],
          disableMultipleSelectionMode: false,
          useDownDevice: false,
          limitSelectedDevice: null
        };
      };

      /**
       * @ngdoc method
       * @name openNewTab
       * @methodOf ov-component.service:$ovUtility
       * @description
       *
       * Open a new tab with given URL and put data into window object of the tab under given property name.
       * In case property name is not given then only open new tab without additional data
       *
       * @param {string} url URL to open new tab
       * @param {string=} propName Property name to put data
       * @param {*=} data Data to put to the window object of new tab
       * */
      service.openNewTab = function (url, propName, data) {
        var newWindow;
        if (url) {
          newWindow = window.open(url);

          if (propName) {
            newWindow[propName] = data;
          }
        }
      };

      return service;
    }]);
