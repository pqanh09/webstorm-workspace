/**
 *    $Id:
 *    (c) Copyright ALE USA Inc., 2015
 *    All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 *    or transmitted in any form or by any means, electronic, mechanical,
 *    photocopying, or otherwise without the prior permission of ALE USA Inc..
 *
 */
(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovTitle', [])
    .factory('ovTitle', ['$rootScope', 'ovDottie', function ($rootScope, ovDottie) {
      var service = {};
      var ovName = 'OmniVista 2500 NMS';
      service.ovName = ovName;
      /**
       * Current website title
       * @type {string}
       */
      service.body = ovName;
      service.prefix = '';
      service.suffix = '';


      /**
       *
       * @param type
       * @param {boolean} [ignoreHyphen=false]
       * @returns {*|string}
       */
      function getString(type, ignoreHyphen) {
        var result = service[type] || '';
        if (!ignoreHyphen && result) {
          result += ' - ';
        }
        return result;
      }

      /**
       *
       * @param {string} prefix
       */
      service.setPrefix = function (prefix) {
        service.prefix = prefix;
      };

      /**
       *
       */
      service.clearPrefix = function () {
        service.setPrefix('');
      };
      /**
       * get prefix
       * @param {boolean} [ignoreHyphen=false]
       * @returns {string} prefix
       *
       */
      service.getPrefix = function (ignoreHyphen) {
        return getString('prefix', ignoreHyphen);
      };

      /**
       *
       * @param suffix
       */
      service.setSuffix = function (suffix) {
        service.suffix = suffix;
      };

      /**
       *
       * @param menuItem
       */
      service.setSuffixByMenuItemArray = function (menuItem) {
        var suffix = service.menuItemArrayToSuffix(menuItem);
        service.setSuffix(suffix);
      };

      /**
       * ClearSuffix
       */
      service.clearSuffix = function () {
        service.setSuffix('');
      };

      /**
       *
       * @param {boolean} ignoreHyphen
       */
      service.getSuffix = function (ignoreHyphen) {
        return getString('suffix', ignoreHyphen);
      };


      /**
       *
       * @param {array} menuItemArray
       * @return {string} suffix
       */
      service.menuItemArrayToSuffix = function (menuItemArray) {
        var suffix = '';
        _.each(menuItemArray, function (item, index) {
          if (index !== 0) {
            suffix += ' - ';
          }
          suffix += item.title;
        });
        return suffix;
      };
      /**
       *
       * @param suffix
       * @returns {*}
       */
      //service.getBody = function (suffix) {
      //  var result;
      //  if (!!suffix) {
      //    result = getString('body');
      //  } else {
      //    result = getString('body', true);
      //  }
      //  return result;
      //};
      /**
       * get prefix name
       * @param {boolean} [ignoreHyphen=false] - do not add hyphen " - " in the end of prefix
       * @returns {string} Result string
       * @example:
       * - In Capex mode or OPEX master:
       * getPrefixName()
       * 'OV 2500 NMS - '
       * getPrefixName(true)
       * 'OV 2500 NMS'
       * - In Opex mode connect to OVC:
       * getPrefixName()
       * 'OV 2500 NMS - OVC1 - '
       * getPrefixName(true)
       * 'OV 2500 NMS - OVC1'
       */

      service.getBody = function (ignoreHyphen) {
        var prefix = ovName;
        //only
        if ($rootScope.isClientInMaster) {
          prefix += ' - ' + ovDottie.getString($rootScope.currentEndCustomerDetail, 'customerNetwork', '');
        }
        if (!ignoreHyphen) {
          prefix += ' - ';
        }
        return prefix;
      };
      /**
       * Replace website title with param
       * @param {string} title - New website title
       */
      service.setTitle = function (title) {
        service.currentTitle = title;
      };


      /**
       * return current website title
       * @returns {string|*}
       */
      service.getTitle = function () {
        var _suffix = service.getSuffix(true);
        return service.getPrefix() + service.getBody(!_suffix) + _suffix;
      };


      /**
       *
       * @param {object} $scope - controller scope
       */
      service.clearSuffixWhenScopeDestroyed = function ($scope) {
        if ($scope) {
          $scope.$on('$destroy', service.clearSuffix);
        }
      };

      return service;
    }])
  ;
})();
