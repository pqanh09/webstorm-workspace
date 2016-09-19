(function () {
  'use strict';
  // This option prohibits the use of a variable before it was defined.
  /* jshint  latedef:nofunc*/
  /*global Dottie:false */
  angular.module('ngnms.ui.fwk.services.ovDottie', [])
    .factory('ovDottie', ovDottieSrv);
  function ovDottieSrv() {
    var srv = {};
    srv = Dottie;

    srv.getArray = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return angular.isArray(val) ? val : defaultVal || [];
    };

    srv.getObject = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return angular.isObject(val) ? val : defaultVal || {};
    };

    srv.getString = function (values, exp, defaultVal) {
      var val = srv.get(values, exp), _defaultVal = angular.isFunction(defaultVal) ? defaultVal() : defaultVal;
      return angular.isString(val) ? val : _defaultVal || '';
    };

    srv.getNumber = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return isNaN(Number(val)) ? Number(defaultVal || 0) : Number(val);
    };

    srv.getFunction = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return angular.isFunction(val) ? val : defaultVal || angular.noop;
    };

    srv.getBoolean = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return typeof val === 'boolean' ? val : defaultVal || false;
    };

    return srv;
  }

})();
