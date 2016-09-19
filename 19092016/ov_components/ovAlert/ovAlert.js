/**
 * @ngdoc directive
 * @name ov-component.directive:ovAlert
 * @element ANY
 * @restrict A
 * @description
 * Show/Hide alert messages
 * @param {object} ovAlert show/hide alert.
 * @param {string} alertId An ID to be added to the element to support automation test  e.g. alter-id="test"
 *
 * @example
 * **Basic Example:**
 *<pre>
 *<!-- HTML -->
 <div alert-id="wma-sample-alert" ov-alert="ctrl.alert"></div>
 *</pre>
 *<pre>
 * //JS
 //build alert object
   ctrl.alert = ovAlertBuilder.getBuilder().build();
 //show success msg
   ctrl.alert._success('success msg');
 //show error msg
   ctrl.alert._error('error msg');
 //show warning msg
   ctrl.alert._warning('warning msg');
 //show info msg
   ctrl.alert._info('info msg');
 //hide alert
   ctrl.alert._hideAlert();
 *</pre>
 *
 * **Config Example:**
 *<pre>
 *<!-- HTML -->
 <div alert-id="wma-sample-alert" ov-alert="ctrl.alert"></div>
 *</pre>
 *<pre>
 * //JS
 //config for alert
 var config = {
    isDismissal: true, //show,hide remove alert button
    timeout: 1000 // set timeout to auto remove alert
  };
 //build alert object
 ctrl.alert = ovAlertBuilder.getBuilder().build();
 //show success msg
 ctrl.alert._success('success msg', config);

 *</pre>
 *
 */


(function () {
  'use strict';

  //region ovAlert Builder
  function ovAlertBuilder($timeout) {
    function Builder() {

      var SUCCESS_ALERT = 'success',
        WARNING_ALERT = 'warning',
        INFO_ALERT = 'info',
        DANGER_ALERT = 'danger',
        ALERT = 'alert-';

      var successConfigDefault = {
        isDismissal: true,
        timeout: 3000
      };

      var errorConfigDefault = {
        isDismissal: true
      };

      var warningConfigDefault = {
        isDismissal: true
      };

      var infoConfigDefault = {
        isDismissal: true
      };

      var timerProm;

      function removeTimeout() {
        if (timerProm) {
          $timeout.cancel(timerProm);
          timerProm = null;
        }
      }

      function showAlert() {
        removeTimeout();
        defaultAlert.showAlert = true;

        if (defaultAlert.alertConfig.timeout) {
          timerProm = $timeout(function () {
            defaultAlert.showAlert = false;
          }, defaultAlert.alertConfig.timeout);
        }
      }

      var defaultAlert = {
        directiveConfig: undefined,
        showAlert: false,
        alertType: 'alert-danger',
        message: undefined,
        /**
         * @ngdoc method
         * @name _hideAlert
         * @methodOf ov-component.directive:ovAlert
         * @description
         * Hide Alert
         *
         * */
        _hideAlert: function () {
          defaultAlert.showAlert = false;
          // remove previous timeout
          removeTimeout();
        },

        /**
         * @ngdoc method
         * @name _success
         * @methodOf ov-component.directive:ovAlert
         * @param {string} message that user want to show in alert box
         * @param {object=} config include: isDismissal, time out
         * @description:
         * if user call this function --> show success alert type with message that user inject
         * */
        _success: function (message, config) {
          defaultAlert.message = angular.isDefined(message) ? message : 'ovAlert.success';

          if (angular.isDefined(config)) {
            //if config is defined --> use it
            defaultAlert.alertConfig = config;
          } else if (angular.isUndefined(defaultAlert.directiveConfig)) {
            //if config is undefined and attrs.alert is unDefined --> use config default
            defaultAlert.alertConfig = angular.copy(successConfigDefault);
          } else {
            //if directive config is defined --> use directive config
            defaultAlert.alertConfig = angular.copy(defaultAlert.directiveConfig);
          }

          defaultAlert.alertType = ALERT + SUCCESS_ALERT;

          showAlert();
        },

        /**
         * @ngdoc method
         * @name _error
         * @methodOf ov-component.directive:ovAlert
         * @param {string} message that user want to show in alert box
         * @param {object=} config include: isDismissal, time out
         * @description:
         * if user call this function --> show danger alert type with message that user inject
         * */
        _error: function (message, config) {
          defaultAlert.message = angular.isDefined(message) ? message : 'ovAlert.danger';

          if (angular.isDefined(config)) {
            //if config is defined --> use it
            defaultAlert.alertConfig = config;
          } else if (angular.isUndefined(defaultAlert.directiveConfig)) {
            //if config is undefined and attrs.alert is unDefined --> use config default
            defaultAlert.alertConfig = angular.copy(errorConfigDefault);
          } else {
            //if directive config is defined --> use directive config
            defaultAlert.alertConfig = angular.copy(defaultAlert.directiveConfig);
          }

          defaultAlert.alertType = ALERT + DANGER_ALERT;

          showAlert();
        },

        /**
         * @ngdoc method
         * @name _info
         * @methodOf ov-component.directive:ovAlert
         * @param {string} message that user want to show in alert box
         * @param {object=} config include: isDismissal, time out
         * @description:
         * if user call this function --> show info alert type with message that user inject
         * */
        _info: function (message, config) {
          defaultAlert.message = angular.isDefined(message) ? message : 'ovAlert.info';

          if (angular.isDefined(config)) {
            //if config is defined --> use it
            defaultAlert.alertConfig = config;
          } else if (angular.isUndefined(defaultAlert.directiveConfig)) {
            //if config is undefined and attrs.alert is unDefined --> use config default
            defaultAlert.alertConfig = angular.copy(infoConfigDefault);
          } else {
            //if directive config is defined --> use directive config
            defaultAlert.alertConfig = angular.copy(defaultAlert.directiveConfig);
          }

          defaultAlert.alertType = ALERT + INFO_ALERT;

          showAlert();
        },

        /**
         * @ngdoc method
         * @name _warning
         * @methodOf ov-component.directive:ovAlert
         * @param {string} message that user want to show in alert box
         * @param {object=} config include: isDismissal, time out
         * @description:
         * if user call this function --> show warning alert type with message that user inject
         * */
        _warning: function (message, config) {
          defaultAlert.message = angular.isDefined(message) ? message : 'ovAlert.warning';

          if (angular.isDefined(config)) {
            //if config is defined --> use it
            defaultAlert.alertConfig = config;
          } else if (angular.isUndefined(defaultAlert.directiveConfig)) {
            //if config is undefined and attrs.alert is unDefined --> use config default
            defaultAlert.alertConfig = angular.copy(warningConfigDefault);
          } else {
            //if directive config is defined --> use directive config
            defaultAlert.alertConfig = angular.copy(defaultAlert.directiveConfig);
          }

          defaultAlert.alertType = ALERT + WARNING_ALERT;

          showAlert();
        }
      };

      return {
        setDefaultConfig: function (cf) {
          defaultAlert.directiveConfig = cf;
          return this;
        },
        build: function () {
          return defaultAlert;
        }
      };
    }

    return {
      getBuilder: function () {
        return new Builder();
      }
    };
  }

  ovAlertBuilder.$inject = ['$timeout'];
  //endregion

  //region ovAlert Directive
  function ovAlert(ovAlertBuilder, ovDottie) {
    return {
      restrict: 'A',
      scope: {
        ovAlert: '=',
        alertConfig: '=?'
      },
      templateUrl: 'ov_components/ovAlert/ovAlertTemplate.html',
      link: function (scope, element, attrs) {
        if (angular.isUndefined(ovDottie.get(scope.ovAlert, '_success'))) {
          scope.ovAlert = ovAlertBuilder.getBuilder()
            .setDefaultConfig(scope.alertConfig)
            .build();
        }

        if (attrs.alertId && typeof attrs.alertId === 'string') {
          scope.alertWrapperId = attrs.alertId + '-wrapper';
          scope.alertCloseBtnId = attrs.alertId + '-close-button';
        }
      }
    };
  }

  ovAlert.$inject = ['ovAlertBuilder', 'ovDottie'];
  //endregion

  angular
    .module('ngnms.ui.fwk.ovAlert', [])
    .factory('ovAlertBuilder', ovAlertBuilder)
    .directive('ovAlert', ovAlert);
})();
