/**
 \$Id:
 (c) Copyright ALE USA Inc., ${YEAR}
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

'use strict';
(function () {

  /**
   * @ngdoc service
   * @name ov-component.service:ovValidatorServices
   *
   * @description
   * The collection of validate rules, validate object and functions which are used for ovValidator directive.
   *
   * @example
   *
   */

  angular.module('ngnms.ui.fwk.ovValidator.services', [])
    .factory('ovValidatorServices', ['$timeout', function ($timeout) {
      var service;
      var REJECT_IP = '0.0.0.0', REJECT_MAC = '00:00:00:00:00:00';
      //Get from 'http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses'
      var IPV6_PATTERN = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
      var IPV6_OR_EMPTY_PATTERN = /^$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
      var validatorList = {},
        getAndValues = function (object) {
          for (var key in object) {
            if (!object[key]) {
              return false;
            }
          }
          return true;
        },
        getAndValuesGroup = function (object) {
          if (!angular.isObject(object)) {
            return;
          }
          for (var key in object) {
            if (!object[key]) {
              return false;
            }
          }
          return true;
        },
        checkRule = function (validator, model) {
          if (typeof validator === 'function') {
            return validator(model);
          } else {
            return true;
          }
        },
        checkRules = function (ruleObj) {
          if (ruleObj && angular.isArray(ruleObj.rule)) {
            for (var i = 0, len = ruleObj.rule.length; i < len; i++) {
              if (!checkRule(ruleObj.rule[i].validator, ruleObj.model)) {
                return false;
              }
            }
          }
          return true;
        };

      var isASCII = function (str) {
        var result = str.search(/[^\x20-\x7E]/gi);
        return (result < 0);
      };

      var ASCIIRuleObj = {
        validator: function (model) {
          model = model || '';
          return isASCII(model);
        },
        error: 'ovValidator.msg.asciiError'
      };

      var requiredRuleObj = {
        validator: function (model) {
          return model !== '' && model !== undefined && model !== null;
        },
        error: 'ovValidator.msg.required'
      };

      var nameRuleObj = {
        validator: function (model) {
          model = model || '';
          return (model.indexOf('/') === -1 && model.indexOf('\\') === -1 &&
          model.indexOf('=') === -1 && model.indexOf('#') === -1 &&
          model.indexOf(';') === -1 && model.indexOf('@') === -1 &&
          model.indexOf('+') === -1 && model.indexOf('*') === -1 &&
          model.indexOf('?') === -1 && model.indexOf(',') === -1 &&
          model.indexOf('<') === -1 && model.indexOf('>') === -1 &&
          model.indexOf('"') === -1 && model.indexOf('\'') === -1 &&
          model.indexOf('{') === -1 && model.indexOf('}') === -1);
        },
        error: 'ovValidator.msg.nameError'
      };

      var nameLength32RuleObj = {
        validator: function (model) {
          return (model) ? model.length <= 32 : false;
        },
        error: 'ovValidator.msg.nameLength32'
      };
      var isHexColor = function (value) {
        var filter = /^#?(([a-fA-F0-9]){3}){1,2}$/;
        if (!filter.test(value)) {
          return false;
        }
        return true;
      };
      var hexColorObj = {
        validator: function (model) {
          model = model || '';
          return isHexColor(model);
        },
        error: 'ovValidator.msg.hexColorError'
      };

      var ipv4RuleObj = {
        validator: function (model) {
          return service.isIpv4(model || '');
        },
        error: 'ovValidator.msg.ipv4'
      };

      var ipv4OrEmptyRuleObj = {
        validator: function (model) {
          return service.isIpv4OrEmpty(model || '');
        },
        error: 'ovValidator.msg.ipv4'
      };

      service = {

        sendValid: function (value, id1, id2) {
          if (validatorList[id1] === undefined) {
            validatorList[id1] = {};
            validatorList[id1][id2] = value;
          } else {
            validatorList[id1][id2] = value;
          }
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#submit
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check current valid value of an input group and show warning error if any.
         * If the id does not exist, it will return **true** value.
         * @param {object} scope The owner scope which calls validator service.
         * @param {string} id The id of validator group which is needed to submit.
         *
         * @returns {boolean} This function returns the valid value of input group.
         */
        submit: function (scope, id) {
          scope.$broadcast('VALIDATOR_SUBMIT_' + id);
          return getAndValues(validatorList[id]);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#reset
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Hide all warning errors of current input group.
         * @param {object} scope The owner scope which calls validator service.
         * @param {string} id The id of validator group which is needed to reset.
         *
         * @returns {null} This function does not return.
         */

        reset: function (scope, id) {
          $timeout(function () {
            scope.$broadcast('VALIDATOR_RESET_' + id);
          });
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#checkValid
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check current valid value of an input group.
         * If the id does not exist, it will return **true** value.
         * @param {string} id The id of validator group which is needed to check.
         *
         * @returns {boolean} This function returns the valid value of input group.
         */

        checkValid: function (id) {
          return getAndValues(validatorList[id]);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#checkValidGroup
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check current valid value of an input group. This is customization of "checkValid" function to use in "ovWizard".
         * If the id does not exist, it will return **false** value.
         * @param {string} id The id of validator group which is needed to check.
         *
         * @returns {boolean} This function returns the valid value of input group.
         */
        checkValidGroup: function (id) {
          return getAndValuesGroup(validatorList[id]);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#checkValidExtend
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check current valid value of providing rule and model.
         * @param {array} rules The array of rule and model object.
         * Rule object includes two attributes:
         * * 1.model: the current model need to apply the rules.
         * * 2.rule: the array of rule objects - a rule object contents validator function and error string. Check ovValidator directive for more detail.
         *
         * @returns {boolean} This function returns the valid value of input group.
         */
        checkValidExtend: function (rules) {
          if (angular.isArray(rules) && rules.length > 0) {
            for (var i = 0, len = rules.length; i < len; i++) {
              if (!checkRules(rules[i])) {
                return false;
              }
            }
            return true;
          }
          return false;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#callCheckValid
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Re-apply validate rules for all the input group and show error if any.
         * @param {object} scope The owner scope which calls validator service.
         * @param {string} id The id of validator group which is needed to check valid.
         *
         * @returns {null} This function does not return.
         */
        callCheckValid: function (scope, id) {
          $timeout(function () {
            scope.$broadcast('VALIDATOR_CHECK_VALID_' + id);
          });
        },
        destroy: function (groupId, id) {
          if (validatorList[groupId] !== undefined && validatorList[groupId][id] !== undefined) {
            delete validatorList[groupId][id];
            if (JSON.stringify(validatorList[groupId]) === '{}') {
              delete validatorList[groupId];
            }
          }

        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isEmailOrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **email or empty**. If yes, returns true, else returns false.
         * @param {string} email Email address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isEmailOrEmpty: function (email) {//empty or email
          var filter = /^$|^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (!filter.test(email)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isEmail
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **email**. If yes, returns true, else returns false.
         * @param {string} email Email address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isEmail: function (email) {
          var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (!filter.test(email)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isIpv4OrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **IPv4 or empty**. If yes, returns true, else returns false.
         * @param {string} ip IP address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isIpv4OrEmpty: function (ipv4) {//empty or ipv4
          if (ipv4 === REJECT_IP) {
            return false;
          }
          var ipv4Filter = /^$|^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if (!ipv4Filter.test(ipv4)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isIpv4
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **IPv4**. If yes, returns true, else returns false.
         * @param {string} ip IP address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isIpv4: function (ipv4) {
          if (ipv4 === REJECT_IP) {
            return false;
          }
          //var ipv4Filter = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          //1.01.1.1 is not allowed.
          var ipv4Filter = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
          if (!ipv4Filter.test(ipv4)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isIpv6OrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **IPv6 or empty**. If yes, returns true, else returns false.
         * @param {string} ip IP address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isIpv6OrEmpty: function (ipv6) {//empty or ipv6
          //var ipv6Filter = /^$|^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/;
          if (!IPV6_OR_EMPTY_PATTERN.test(ipv6)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isIpv6
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **IPv6**. If yes, returns true, else returns false.
         * @param {string} ip IP address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isIpv6: function (ipv6) {
          //var ipv6Filter = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/;
          if (!IPV6_PATTERN.test(ipv6)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isIP
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **IP (both IPv4 and IPv6)**. If yes, returns true, else returns false.
         * @param {string} ip IP address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isIP: function (ip) { //ip(both IPv4 and IPv6)
          if (ip === REJECT_IP) {
            return false;
          }
          var ipFilter = /^(?:(?:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9](?::|$)){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))$/;
          if (!ipFilter.test(ip)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isIPOrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **IP or empty (both IPv4 and IPv6)**. If yes, returns true, else returns false.
         * @param {string} ip IP address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isIPOrEmpty: function (ip) { //empty or ip(both IPv4 and IPv6)
          if (ip === REJECT_IP) {
            return false;
          }
          var ipFilter = /^$|^(?:(?:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9](?::|$)){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))$/;
          if (!ipFilter.test(ip)) {
            return false;
          }
          return true;
        },
        isIPAndZeroOrEmpty: function (ip) { //empty or ip(both IPv4 and IPv6)
          var ipFilter = /^$|^(?:(?:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9](?::|$)){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))$/;
          if (!ipFilter.test(ip)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isSubnetMask
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **subnet mask**. If yes, returns true, else returns false.
         * References: http://www.ietf.org/rfc/rfc1878.txt
         * @param {string} subnetMask Subnet mask needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isSubnetMask: function (mask) {
          //References: http://www.ietf.org/rfc/rfc1878.txt
          var subnetMasks = [
            '0.0.0.0',
            '128.0.0.0',
            '192.0.0.0',
            '224.0.0.0',
            '240.0.0.0',
            '248.0.0.0',
            '252.0.0.0',
            '254.0.0.0',
            '255.0.0.0',
            '255.128.0.0',
            '255.192.0.0',
            '255.224.0.0',
            '255.240.0.0',
            '255.248.0.0',
            '255.252.0.0',
            '255.254.0.0',
            '255.255.0.0',
            '255.255.128.0',
            '255.255.192.0',
            '255.255.224.0',
            '255.255.240.0',
            '255.255.248.0',
            '255.255.252.0',
            '255.255.254.0',
            '255.255.255.0',
            '255.255.255.128',
            '255.255.255.192',
            '255.255.255.224',
            '255.255.255.240',
            '255.255.255.248',
            '255.255.255.252',
            '255.255.255.254',
            '255.255.255.255'
          ];
          if (subnetMasks.indexOf(mask) < 0) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isMacOrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **MAC address or empty**. If yes, returns true, else returns false.
         * @param {string} mac MAC address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isMacOrEmpty: function (mac) {//empty or mac
          if (mac === REJECT_MAC) {
            return false;
          }
          var macFilter = /^$|^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isMac
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **MAC address**. If yes, returns true, else returns false.
         * @param {string} mac MAC address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isMac: function (mac) {
          if (mac === REJECT_MAC) {
            return false;
          }
          var macFilter = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isMacIncludeStar
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **MAC address, maybe stars(*) is included**. If yes, returns true, else returns false.
         * @param {string} mac MAC address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isMacIncludeStar: function (mac) {
          if (mac === REJECT_MAC) {
            return false;
          }
          var macFilter = /^([0-9a-fA-F(*)][0-9a-fA-F(*)]:){5}([0-9a-fA-F(*)][0-9a-fA-F(*)])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },
        isMacIncludeStarAndZero: function (mac) {
          var macFilter = /^([0-9a-fA-F(*)][0-9a-fA-F(*)]:){5}([0-9a-fA-F(*)][0-9a-fA-F(*)])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isMacIncludeStarOrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **MAC address, maybe stars(*) is included or empty**. If yes, returns true, else returns false.
         * @param {string} mac MAC address needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isMacIncludeStarOrEmpty: function (mac) {
          if (mac === REJECT_MAC) {
            return false;
          }
          var macFilter = /^$|^([0-9a-fA-F(*)][0-9a-fA-F(*)]:){5}([0-9a-fA-F(*)][0-9a-fA-F(*)])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },
        isMacIncludeStarAndZeroOrEmpty: function (mac) {
          var macFilter = /^$|^([0-9a-fA-F(*)][0-9a-fA-F(*)]:){5}([0-9a-fA-F(*)][0-9a-fA-F(*)])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },
        isMacOUI: function (mac) {
          if (mac === REJECT_MAC.substr(0, 8)) {
            return false;
          }
          var macFilter = /^([0-9a-fA-F][0-9a-fA-F]:){2}([0-9a-fA-F][0-9a-fA-F])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },
        isMacOUIOrEmpty: function (mac) {
          if (mac === REJECT_MAC.substr(0, 8)) {
            return false;
          }
          var macFilter = /^$|^([0-9a-fA-F][0-9a-fA-F]:){2}([0-9a-fA-F][0-9a-fA-F])$/;
          if (!macFilter.test(mac)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isBinaryNumber
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a number if it is **binary number**. If yes, returns true, else returns false.
         * @param {number} number Number needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isBinaryNumber: function (number) {
          var binaryFilter = /^[01]+$/;
          if (!binaryFilter.test(number)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isBinaryNumberOrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a number if it is **binary number or empty**. If yes, returns true, else returns false.
         * @param {number} number Number needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isBinaryNumberOrEmpty: function (number) {
          var binaryFilter = /^$|^[01]+$/;
          if (!binaryFilter.test(number)) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isNumber
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a number if it is **number**. If yes, returns true, else returns false.
         * @param {number} number Number needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isNumber: function (number) {
          if (isNaN(number)) {
            return false;
          }
          return true;
        },
        isNumberGreater: function (number, greater) {
          if (number > greater) {
            return true;
          }
          return false;
        },
        isStringLength: function (str, minLength, maxLength) {
          if (str.length < minLength) {
            return false;
          }
          else if (str.length > maxLength) {
            return false;
          }
          return true;
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isEmptyString
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **empty**. If yes, returns true, else returns false.
         * @param {string} string String needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isEmptyString: function (str) {
          if (!str || str.trim() === '') {
            return true;
          }
          return false;
        },
        isDefined: function (str) {
          if (typeof(str) === 'undefined') {
            return false;
          }
          return true;
        },
        isContainHttpOrHttps: function (str) {
          var regrex = /https?:\/\//;
          return regrex.test(str);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isHttpsUrl
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **https url**. If yes, returns true, else returns false.
         * @param {string} string String needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isHttpsUrl: function (str) {
          var regex = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
          return regex.test(str);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isValidCaptivePortalUrl
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **captive portal url**. If yes, returns true, else returns false.
         * @param {string} string String needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isValidCaptivePortalUrl: function (str) {
          var urlTemplate1 = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
          return urlTemplate1.test(str);

        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isValidCaptivePortalUrlWithOrWithourHttpHttps
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **captive portal url (with or without http/https)**. If yes, returns true, else returns false.
         * @param {string} string String needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isValidCaptivePortalUrlWithOrWithourHttpHttps: function (str) {
          var urlTemplate1 = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            urlTemplate2 = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
          return urlTemplate1.test(str) || urlTemplate2.test(str);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isFQDN
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **FQDN**. If yes, returns true, else returns false.
         * @param {string} string String needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isFQDN: function (str) {
          var regex = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/;
          return regex.test(str);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isFQDNOrEmpty
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a string if it is **FQDN or empty**. If yes, returns true, else returns false.
         * @param {string} string String needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isFQDNOrEmpty: function (str) {
          var regex = /^$|^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/;
          return regex.test(str);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isPhoneNumber
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a number if it is **phone number**. If yes, returns true, else returns false.
         * @param {number} number Number needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isPhoneNumber: function (str) {
          var regex = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
          //var regex = /^[+]?([0-9]*[\.\s\-\(\)]|[0-9]+){3,24}$/;
          return regex.test(str);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isInteger
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a number if it is **integer**. If yes, returns true, else returns false.
         * @param {number} number Number needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isInteger: function (str) {
          var regex = /^[0-9]*$/;
          return regex.test(str);
        },

        /**
         * @ngdoc method
         * @name ov-component.service:ovValidatorServices#isShortFormInteger
         * @methodOf ov-component.service:ovValidatorServices
         * @description
         * Check a number if it is **integer**, and must be in short form (1,22,33) not long form (01, 001, 011). If yes, returns true, else returns false.
         * @param {string} string String or Number needs to be checked.
         *
         * @returns {boolean} This function return true/false value.
         */
        isShortFormInteger: function (str) {
          var regex = new RegExp('^[0-9]$|^[1-9][0-9]*$');
          return regex.test(str);
        },

        /**
         * @ngdoc property
         * @name ov-component.service:ovValidatorServices#ASCIIRule
         * @propertyOf ov-component.service:ovValidatorServices
         *
         * @description
         * ASCII rule for name input. Non-ASCII code characters are not allowed.
         *
         * This common rule object is using for ovValidator directive.
         * View ovValidator directive for more detail.
         */
        ASCIIRule: ASCIIRuleObj,

        /**
         * @ngdoc property
         * @name ov-component.service:ovValidatorServices#nameRule
         * @propertyOf ov-component.service:ovValidatorServices
         *
         * @description
         * Common name rule for name input. Cannot contain any of the following characters: \\ / ? , < > \" ' { } + * = # ; @.
         *
         * This common rule object is using for ovValidator directive.
         * View ovValidator directive for more detail.
         */
        nameRule: nameRuleObj,

        /**
         * @ngdoc property
         * @name ov-component.service:ovValidatorServices#nameLength32Rule
         * @propertyOf ov-component.service:ovValidatorServices
         *
         * @description
         * Common name length rule for name input. Must be in 1-32 characters.
         *
         * This common rule object is using for ovValidator directive.
         * View ovValidator directive for more detail.
         */
        nameLength32Rule: nameLength32RuleObj,

        /**
         * @ngdoc property
         * @name ov-component.service:ovValidatorServices#hexColorRule
         * @propertyOf ov-component.service:ovValidatorServices
         *
         * @description
         * Common name length rule for name input. Must be in 1-32 characters.
         *
         * This common rule object is using for ovValidator directive.
         * View ovValidator directive for more detail.
         */
        hexColorRule: hexColorObj,

        /**
         * @ngdoc property
         * @name ov-component.service:ovValidatorServices#requiredRule
         * @propertyOf ov-component.service:ovValidatorServices
         *
         * @description
         * Common required rule for an input. Must not be empty.
         *
         * This common rule object is using for ovValidator directive.
         * View ovValidator directive for more detail.
         */
        requiredRule: requiredRuleObj,

        /**
         * @ngdoc property
         * @name ov-component.service:ovValidatorServices#ipv4Rule
         * @propertyOf ov-component.service:ovValidatorServices
         *
         * @description
         * Common IPv4 rule for an input. Must be an IPv4 address.
         *
         * This common rule object is using for ovValidator directive.
         * View ovValidator directive for more detail.
         */
        ipv4Rule: ipv4RuleObj,

        /**
         * @ngdoc property
         * @name ov-component.service:ovValidatorServices#ipv4OrEmptyRule
         * @propertyOf ov-component.service:ovValidatorServices
         *
         * @description
         * Common IPv4 or empty rule for an input. Must be IPv4 or empty.
         *
         * This common rule object is using for ovValidator directive.
         * View ovValidator directive for more detail.
         */
        ipv4OrEmptyRule: ipv4OrEmptyRuleObj
      };

      return service;
    }]);
})();
