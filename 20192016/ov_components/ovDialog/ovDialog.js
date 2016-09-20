/**
 * @ngdoc service
 * @name ov-component.service:dlgDataBuilder
 * @requires ov-component.service:$ovDlgService2
 * @description
 *     * **dlgDataBuilder**: build dialog object
 * @example
 * **Basic example:**
 * <pre>
 *
    function showDialog() {
        var dialog = dlgDataBuilder.getBuilder()
          .setTitle('title')
          .setIdDlg('dialogId')
          .setTemplateUrl('your-url/dialog.html')
          .build();
        $ovDlgService2.showDialog($scope, dialog);
    };

 * </pre>
 */

(function () {
  'use strict';
  var duration = 250;
  angular.module('ngnms.ui.fwk.ovDialog', [])
    .factory('dlgDataBuilder', [function () {
      function Builder() {
        var defConfig = {
          buttonBarConfigs: {
            finishLabel: 'OK',
            cancelLabel: 'Cancel',
            listButton: [],
            showCancel: true,
            showFinish: true,
            showHelp: false
          },
          canCancel: function () {
            return true;
          },
          canFinish: function () {
            return true;
          },
          performFinish: function () {
            return true;
          },
          performCommit: function () {
            return true;
          }
        };

        return {
          extend: function (dlgData) {
            angular.extend(defConfig, dlgData);
            return this;
          },

          setOverrideClass: function (cssClass) {
            defConfig.overrideClass = cssClass;
            return this;
          },

          setTemplateUrl: function (templateUrl) {
            defConfig.templateUrl = templateUrl;
            return this;
          },

          /**
           * @ngdoc method
           * @name setTitle
           * @description:
           * set title for dialog
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {string} title title of dialog
           *
           */
          setTitle: function (title) {
            defConfig.title = title;
            return this;
          },

          /**
           * @ngdoc method
           * @name setIdDlg
           * @description:
           * set Id for dialog
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {string} id id of dialog
           *
           */
          setIdDlg: function (id) {
            defConfig.idApp = id;
            return this;
          },

          /**
           * @ngdoc method
           * @name setTitleIconClasses
           * @description:
           * set css class for dialog
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {string} cssClass e.g. 'fa fa-warning fa-fw'
           *
           */
          setTitleIconClasses: function (cssClass) {
            defConfig.titleIconClasses = cssClass;
            return this;
          },

          /**
           * @ngdoc method
           * @name setCanCancel
           * @description:
           * set canCancel function to detect can cancel dialog
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {function} canCancel call back function return boolean
           *
           */
          setCanCancel: function (cb) {
            defConfig.canCancel = cb;
            return this;
          },

          /**
           * @ngdoc method
           * @name setCanFinish
           * @description:
           * set canFinish function to detect can finish dialog
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {function} canFinish call back function return boolean
           *
           */
          setCanFinish: function (cb) {
            defConfig.canFinish = cb;
            return this;
          },

          /**
           * @ngdoc method
           * @name setPerformFinish
           * @description:
           * set performFinish function
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {function} performFinish call back function to be executed when finish dialog
           *
           */
          setPerformFinish: function (cb) {
            defConfig.performFinish = cb;
            return this;
          },

          /**
           * @ngdoc method
           * @name setPerformCancel
           * @description:
           * set performCancel function
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {function} performCancel call back function to be executed when cancel dialog
           *
           */
          setPerformCancel: function (cb) {
            defConfig.performCancel = cb;
            return this;
          },

          setPerformHelp: function (cb) {
            defConfig.performHelp = cb;
            return this;
          },

          /**
           * @ngdoc method
           * @name setFinishLabel
           * @description:
           * set finish label for dialog
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {string} label finish label
           *
           */
          setFinishLabel: function (label) {
            defConfig.buttonBarConfigs.finishLabel = label;
            return this;
          },

          /**
           * @ngdoc method
           * @name setCancelLabel
           * @description:
           * set cancel label for dialog
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {string} label cancel label
           *
           */
          setCancelLabel: function (label) {
            defConfig.buttonBarConfigs.cancelLabel = label;
            return this;
          },

          /**
           * @ngdoc method
           * @name setShowCancel
           * @description:
           * show/hide cancel button
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {boolean} value true/false --> show/hide cancel button
           *
           */
          setShowCancel: function (val) {
            defConfig.buttonBarConfigs.showCancel = val;
            return this;
          },

          /**
           * @ngdoc method
           * @name setShowFinish
           * @description:
           * show/hide finish button
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {boolean} value true/false --> show/hide finish button
           *
           */
          setShowFinish: function (val) {
            defConfig.buttonBarConfigs.showFinish = val;
            return this;
          },

          setShowHelp: function (val) {
            defConfig.buttonBarConfigs.showHelp = val;
            return this;
          },

          /**
           * @ngdoc method
           * @name setListButton
           * @description:
           * append custom buttons
           * @methodOf ov-component.service:dlgDataBuilder
           * @param {array} listButton list button object
           * - *button object*
           *    - **label** {string}: button label
           *    - **btnCls** {string}: button class
           *    - **onClick** {function}: on click call back function
           *    - **disabled** {boolean}: disabled button
           *    - **checkDisabled** {function}: check disabled button
           *    - **isShow** {boolean}: show/hide button
           *    - **checkShow** {function}: check to show button
           *
           */
          setListButton: function (val) {
            defConfig.buttonBarConfigs.listButton = val;
            return this;
          },

          /**
           * @ngdoc method
           * @name build
           * @description:
           * build dialog
           * @methodOf ov-component.service:dlgDataBuilder
           *
           */
          build: function () {
            return defConfig;
          }
        };
      }

      return {
        getBuilder: function () {
          return new Builder();
        }
      };
    }])
    .controller('OvDlgController', ['$scope', function ($scope) {
      $scope.enableFinish = false;
      $scope.enableCancel = true;

      // watch for enableFinish
      $scope.$watch($scope.dlgModel.canFinish, function (val) {
        $scope.enableFinish = !!val;
      });

      // watch for enableCancel
      $scope.$watch($scope.dlgModel.canCancel, function (val) {
        $scope.enableCancel = !!val;
      });
    }])
    .directive('ovDialog', [function () {
      return {
        restrict: 'E',
        replace: true,
        controller: 'OvDlgController',
        scope: {
          dlgModel: '='
        },
        templateUrl: 'template/ovDialog/ovDialog-layout.html',
        link: function (scope) {
          /*
           var makeID = function () {
           var id = '';
           var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

           for (var i = 0; i <= 5; i++) {
           id += possible.charAt(Math.floor(Math.random() * possible.length));
           }
           return id;
           };
           if (typeof scope.dlgModel.idApp === 'undefined') {
           scope.dlgModel.idApp = makeID();
           }*/
          scope.dlgCollectionId = {
            helpBtn: 'dlg-help-btn',
            listBtn: 'dlg-list-btn',
            finishBtn: 'dlg-finish-btn',
            cancelBtn: 'dlg-cancel-btn'
          };
          if (scope.dlgModel.idApp && scope.dlgModel.idApp !== true && scope.dlgModel.idApp !== false) {
            angular.forEach(scope.dlgCollectionId, function (value, key) {
              scope.dlgCollectionId[key] = scope.dlgModel.idApp + '-' + value;
            });
          }
        }
      };
    }])
    .directive('renderContent', ['$templateCache', '$http', '$compile', function ($templateCache, $http, $compile) {
      return {
        restrict: 'A',
        require: '^ovDialog',
        link: function ($scope, element, attrs) {
          var compiledElm;

          $scope.$watch(attrs.renderContent, function (tplUrl) {
            if (compiledElm) {
              compiledElm.remove();
            }
            element.html('');
            if (tplUrl) {
              $http({method: 'GET', url: tplUrl, cache: true}).success(function (result) {
                var htmlTpl = result;
                element.html(htmlTpl);
                compiledElm = $compile(element.contents())($scope.$parent);
                $scope.$emit('$ovDialogContentLoaded');
              });
            }
          }); //end watch

          $scope.$on('$destroy', function () {
            if (compiledElm) {
              compiledElm.remove();
              compiledElm = null;
            }
          });
        }
      };
    }])
    .service('$ovDlgService', ['$compile', '$document', '$timeout', function ($compile, $document, $timeout) {
      function doubleDialogOpen(dlgModel) {
        var injectedFn = dlgModel.performCancel || dlgModel.performFinish;
        if (injectedFn) {
          return typeof injectedFn === 'function' && injectedFn.prototype.detectDoubleDialogOpen;
        }
        return false;
      }

      this.showDialog = function ($scope, dlgModel, event) {
        if (doubleDialogOpen(dlgModel)) {
          return;
        }

        var bodyElement = $document.find('body');
        var backDropElement = angular.element('<div class="modal-backdrop"></div>');

        var userCancelCallback = dlgModel.performCancel;
        var userFinishCallback = dlgModel.performFinish;

        var revertUserCallback = function () {
          dlgModel.performFinish = userFinishCallback;
          dlgModel.performCancel = userCancelCallback;
        };

        var performFinish = function () {
          revertUserCallback();
          modalClose();
          if (userFinishCallback) {
            userFinishCallback();
          }
        };

        var performCancel = function () {
          revertUserCallback();
          modalClose();
          if (userCancelCallback) {
            userCancelCallback();
          }
        };

        var handleEscPressed = function (event) {
          if (!dlgModel.escToCancel) {
            return;
          }

          if (event.keyCode === 27) {
            $scope.$apply(function () {
              performCancel();
            });
          }
        };

        $document.bind('keydown', handleEscPressed);

        backDropElement.css({
          // this is crazy, chrome doesn't understand 0!
          opacity: 0.1
        });

        bodyElement.append(backDropElement);

        backDropElement.velocity({opacity: 0.5}, {duration: duration});

        var dlgElmTpl =
          '<div class="ov-dlg-auto-flow">' +
          '<ov-dialog dlg-model="model"></ov-dialog>' +
          '</div>';

        var $newScope = $scope.$new();
        $newScope.model = dlgModel;
        var dlgElm = $compile(dlgElmTpl)($newScope);

        dlgElm.addClass('modal');
        dlgElm.css({
          'display': 'block',
          'opacity': 0
        });
        bodyElement.append(dlgElm);

        var backDropClick = (function (dlgModel, dlgElm) {
          return function (event) {
            if (!dlgModel.backDropToCancel) {
              return;
            }

            if (event.target === dlgElm[0]) {
              $scope.$apply(function () {
                performCancel();
              });
            }
          };
        })(dlgModel, dlgElm);

        var modalClose = (function (dlgElm, backDropElement, $newScope) {
          return function () {
            //remove parent destroy listener to prevent duplicate listener added
            destroyListener();

            $document.unbind('keydown', handleEscPressed);
            dlgElm.unbind('click', backDropClick);

            // prevent route change blocking
            $timeout(function () {
              //set focus again on clicked element
              if (event) {
                event.currentTarget.focus();
              }
              $newScope.$destroy();
              // prevent memory leak
              $newScope = undefined;

              // animation...
              dlgElm.velocity('fadeOut', {
                duration: duration,
                complete: function () {
                  dlgElm.remove();
                  dlgElm = undefined;
                }
              });

              backDropElement.velocity('fadeOut', {
                duration: duration,
                complete: function () {
                  backDropElement.remove();
                  backDropElement = undefined;
                }
              });
            });
          };
        })(dlgElm, backDropElement, $newScope);

        dlgElm.bind('click', backDropClick);

        var listener = $scope.$on('$ovDialogContentLoaded', (function (dlgElm) {
          return function () {
            var ovDialog = dlgElm.children().first();
            ovDialog.addClass('modal-dialog ov-dlg-modal');
            ovDialog.children().first().addClass('modal-content').attr('tabindex', 0).focus();
            // break circular refs
            ovDialog = null;

            dlgElm.velocity('fadeIn', {duration: duration});

            dlgModel.performCancel = function () {
              performCancel();
            };

            dlgModel.performFinish = function () {
              performFinish();
            };

            dlgModel.performCancel.prototype.detectDoubleDialogOpen = dlgModel.performFinish.prototype.detectDoubleDialogOpen = 'in-used';

            listener();
          };
        })(dlgElm));

        dlgElm = null;

        var destroyListener = $newScope.$on('$destroy', function () {
          revertUserCallback();
          modalClose();
        });

        bodyElement = null;
        backDropElement = null;

        return {
          performCancel: performCancel,
          performFinish: performFinish
        };
      };
    }])

  /**
   * @ngdoc service
   * @name ov-component.service:$ovDlgService2
   * @requires ov-component.service:dlgDataBuilder
   * @description
   *     * **$ovDlgService2**: show dialog
   * @example
   * **Basic example:**
   * <pre>
   *
   function showDialog() {
        var dialog = dlgDataBuilder.getBuilder()
          .setTitle('title')
          .setIdDlg('dialogId')
          .setTemplateUrl('your-url/dialog.html')
          .build();
        $ovDlgService2.showDialog($scope, dialog);
    };

   * </pre>
   */
    .directive('ovDialog2', [function () {
      return {
        restrict: 'E',
        replace: true,
        scope: false,
        templateUrl: 'ov_components/ovDialog/ovDialog2.html',
        link: function (scope, element, attrs) {
          scope.dlgModel = scope.$eval(attrs.dlgModel);

          scope.dlgCollectionId = {
            helpBtn: 'dlg-help-btn',
            listBtn: 'dlg-list-btn',
            finishBtn: 'dlg-finish-btn',
            cancelBtn: 'dlg-cancel-btn'
          };
          if (scope.dlgModel.idApp && scope.dlgModel.idApp !== true && scope.dlgModel.idApp !== false) {
            angular.forEach(scope.dlgCollectionId, function (value, key) {
              scope.dlgCollectionId[key] = scope.dlgModel.idApp + '-' + value;
            });
          }

          scope.enableFinish = false;
          scope.enableCancel = true;

          // watch for enableFinish
          scope.$watch(scope.dlgModel.canFinish, function (val) {
            scope.enableFinish = !!val;
          });

          // watch for enableCancel
          scope.$watch(scope.dlgModel.canCancel, function (val) {
            scope.enableCancel = !!val;
          });
        }
      };
    }])
    .service('$ovDlgService2', ['$compile', '$document', '$timeout', function ($compile, $document, $timeout) {
      function doubleDialogOpen(dlgModel) {
        var injectedFn = dlgModel.performCancel || dlgModel.performFinish;
        if (injectedFn) {
          return typeof injectedFn === 'function' && injectedFn.prototype.detectDoubleDialogOpen;
        }
        return false;
      }

      var isShowing;
      var ENTER_ATTRIBUTE = 'enter-to-perform-dialog';

      /**
       * @ngdoc method
       * @name showDialog
       * @description:
       * $ovDlgService2.showDialog: show dialog
       * @methodOf ov-component.service:$ovDlgService2
       * @param {object} $scope $scope object of controller
       * @param {object} dialog dialog object is built by dlgDataBuilder
       *
       */
      this.showDialog = function ($scope, dlgModel, event) {
        if (isShowing) {
          return;
        }
        isShowing = true;

        if (doubleDialogOpen(dlgModel)) {
          return;
        }

        var bodyElement = $document.find('body');
        var backDropElement = angular.element('<div class="modal-backdrop"></div>');

        var userCancelCallback = dlgModel.performCancel;
        var userFinishCallback = dlgModel.performFinish;

        var revertUserCallback = function () {
          dlgModel.performFinish = userFinishCallback;
          dlgModel.performCancel = userCancelCallback;
        };

        var performFinish = function () {
          revertUserCallback();
          modalClose();
          if (userFinishCallback) {
            userFinishCallback();
          }
        };

        var performCancel = function () {
          revertUserCallback();
          modalClose();
          if (userCancelCallback) {
            userCancelCallback();
          }
        };
        var canEnterToFinish = function (event) {
          event = event || {};
          if (angular.element(event.target).is('body') ||
            (event.target && event.target.hasAttribute(ENTER_ATTRIBUTE))) {
            return true;
          }
          return false;
        };

        var handleKeyDown = function (event) {

          switch (event.keyCode) {
          case 27:
            if (dlgModel.escToCancel && dlgModel.canCancel()) {
              $scope.$apply(function () {
                performCancel();
              });
            }
            break;
          case 13:
            if (dlgModel.canFinish()&&canEnterToFinish(event)) {
              $scope.$apply(function () {
                performFinish();
              });
            }
            break;
          }
        };

        $document.bind('keydown.ovDialog', handleKeyDown);

        backDropElement.css({
          // this is crazy, chrome doesn't understand 0!
          opacity: 0.1
        });

        bodyElement.append(backDropElement);

        backDropElement.velocity({opacity: 0.5}, {duration: duration});

        var dlgElmTpl =
          '<div class="ov-dlg-auto-flow">' +
          '<ov-dialog2 dlg-model="model"></ov-dialog2>' +
          '</div>';

        var $newScope = $scope.$new();
        $newScope.model = dlgModel;
        var dlgElm = $compile(dlgElmTpl)($newScope);

        dlgElm.addClass('modal');
        dlgElm.css({
          'display': 'block',
          'opacity': 0
        });
        bodyElement.append(dlgElm);

        var backDropClick = (function (dlgModel, dlgElm) {
          return function (event) {
            if (!dlgModel.backDropToCancel) {
              return;
            }

            if (event.target === dlgElm[0]) {
              $scope.$apply(function () {
                performCancel();
              });
            }
          };
        })(dlgModel, dlgElm);

        var modalClose = (function (dlgElm, backDropElement, $newScope) {
          return function () {
            //remove parent destroy listener to prevent duplicate listener added
            destroyListener();
            isShowing = false;
            $document.unbind('keydown.ovDialog', handleKeyDown);
            dlgElm.unbind('click', backDropClick);

            // prevent route change blocking
            $timeout(function () {
              //set focus again on clicked element
              if (event) {
                event.currentTarget.focus();
              }
              // animation...
              dlgElm.velocity('fadeOut', {
                duration: duration,
                complete: function () {
                  $newScope.$destroy();
                  // prevent memory leak
                  $newScope = undefined;
                  dlgElm.remove();
                  dlgElm = undefined;
                }
              });

              backDropElement.velocity('fadeOut', {
                duration: duration,
                complete: function () {
                  backDropElement.remove();
                  backDropElement = undefined;
                }
              });
            });
          };
        })(dlgElm, backDropElement, $newScope);

        dlgElm.bind('click', backDropClick);

        var listener = $scope.$on('$includeContentLoaded', (function (dlgElm) {
          return function () {
            var ovDialog = dlgElm.children().first();
            ovDialog.addClass('modal-dialog ov-dlg-modal');
            ovDialog.children().first().addClass('modal-content').attr('tabindex', 0).focus();
            // break circular refs
            ovDialog = null;

            dlgElm.velocity('fadeIn', {duration: duration});

            dlgModel.performCancel = function () {
              performCancel();
            };

            dlgModel.performFinish = function () {
              performFinish();
            };

            dlgModel.performCancel.prototype.detectDoubleDialogOpen = dlgModel.performFinish.prototype.detectDoubleDialogOpen = 'in-used';

            listener();
          };
        })(dlgElm));

        dlgElm = null;

        var destroyListener = $newScope.$on('$destroy', function () {
          revertUserCallback();
          modalClose();
        });

        bodyElement = null;
        backDropElement = null;

        return {
          performCancel: performCancel,
          performFinish: performFinish
        };
      };
    }]);
})();
