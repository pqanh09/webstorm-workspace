/**
 * $Id:
 © Copyright ALE USA Inc., 2015
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..

 */
(function () {
  'use strict';
  /**
   *
   * @name utility.service:ovOboe
   * @requires $log
   * @requires $q
   * @requires $i18next
   * @description
   * Oboe service provide get/post/put/delete method replace $http. You can cancel a request easily by call cancel() method.
   * @scope controllerAs vm
   * @example
   *```Preface
   * Referenced app: vmSnooping -> profile
   *```
   * ```js
   * service.apiList.getAllVmsProfile = ovOboe.get('api/vmsnooping/globalprofile',
   * {
   *   onPreExecute: function () {
   *     hideMainMessage();
   *   }
   * });
   * ```
   * Execute function have 2 params: `URL` and `config` object. With get method, you don’t have to send data,
   * so `execute()` function can be invoke like below example:
   * ```js
   * service.apiList.getAllVmsProfile.execute().then(function (successData) {
   *        service.profile.profileData = successData.response.data;
   *        formatProfileList(service.profile.profileData);
   *        //console.log('service.profile.profileData', service.profile.profileData);
   *      },function (errorData) {
   *        service.alertData.main._error(errorData.response.translated.messageTranslated);
   *      }).then(function () {
   *        //get column config
   *        getColumnConfig();
   *      }).finally(function () {
   *        //you MUST call this line manually for cancel function work properly
   *        //I'm trying to eliminate this inconvenient
   *        service.apiList.getAllVmsProfile.isLoading = false;
   *        //----
   *        service.slickMenu.slickMenuObj.refreshBtn.disabled = false;
   *        service.slickMenu.slickMenuObj.settingBtn.disabled = false;
   *        hideSpinner();
   *        vmSnoopingUtil.callBackExecute(callBackFunction);
   *      });
   ```
   *
   *
   */
  angular.module('ngnms.ui.fwk.ovOboe')
    .service('ovOboe', ['$log', '$q', '$i18next', 'ovHttp', function ($log, $q, $i18next, ovHttp) {
      var service = {}, oboe = window.oboe,
        FAIL = 'fail',
        ERROR = 'error',
        FAILURE = 'failure',
        CONTENT_TYPE = 'application/json'
        ;

      /**
       * guarantee that the response will always have a unique structure
       * this function keep the original response in originalData attribute
       * @param timeOutResponse
       * @returns {*|{}}
       */
      function errorOboeResponseFormatter(timeOutResponse) {
        timeOutResponse = timeOutResponse || {};
        var originalData = angular.copy(timeOutResponse);
        if (timeOutResponse.response) {
          if (timeOutResponse.response.translated) {
            if (!timeOutResponse.response.translated.messageTranslated) {
              timeOutResponse.response.translated.messageTranslated = timeOutResponse.response.errorDescription ?
                timeOutResponse.response.errorDescription : $i18next('common.failedToLoadDataFromServer');
            }
          } else {
            timeOutResponse.response.translated = {};
            timeOutResponse.response.translated.messageTranslated = timeOutResponse.response.errorDescription ?
              timeOutResponse.response.errorDescription : $i18next('common.failedToLoadDataFromServer');
          }
        } else {
          timeOutResponse.response = {};
          timeOutResponse.response.translated = {};
          timeOutResponse.response.translated.messageTranslated = $i18next('common.failedToLoadDataFromServer');
        }

        timeOutResponse.originalData = originalData;
        return timeOutResponse;
      }


      /**
       *
       * @name defaultErrorDetector
       * @methodOf utility.service:ovOboe
       * @description
       * Based on
       * @param {Object} rawResponse deferred object
       * @param {Object} config
       * - configuration object
       * - `successProperty` is 'enumResponse' if config.successProperty is undefined.
       * - `failCompareKey` is 'fail' if config.failCompareKey is undefined.
       * @returns {boolean}
       * - successProperty === failCompareKey
       * - `true`: response error.
       * - `false`: response success.
       * - *NOTE: successProperty === null || successProperty === undefined => will return false
       */
      function defaultErrorDetector(rawResponse, config) {
        var successProperty = config.successProperty || 'enumResponse';
        var failCompareKey = config.failCompareKey || FAIL;
        //note: Delete null check when server support
        if (rawResponse.response[successProperty] === null || rawResponse.response[successProperty] === undefined) {
          $log.error('enumResponse undefined or null!', rawResponse.response[successProperty]);
          return true;
        } else {
          // convert operator before compare for support boolean
          //  boolean => string => compare
          return rawResponse.response[successProperty].toString().toUpperCase() === failCompareKey.toString().toUpperCase();
        }
      }

      /**
       *
       * @name defaultSuccessControl
       * @methodOf utility.service:ovOboe
       * @description
       * * Base on _errorDetector() function result to decide reject, resolve or notify result.
       * @param {Object} deferred deferred object
       * @param {Object} rawResponse raw response from API
       * @param {Object} config
       * - configuration object
       * - _errorDetector function is defaultErrorDetector if config.errorDetector is undefined
       */
      function defaultSuccessControl(deferred, rawResponse, config) {
        var _errorDetector = config.errorDetector || defaultErrorDetector;
        if (_errorDetector(rawResponse, config)) {
          deferred.reject(rawResponse);
        } else {
          //place notify before resolve to guarantee notify all data
          deferred.notify(rawResponse);
          //resolve have only responsibility: display message and close the process flow
          if (rawResponse.response.finalResponse === true) {
            deferred.resolve(rawResponse);
          }
        }
      }

      /**
       * make oboe request base on config
       * @param config
       * @returns {*}
       */
      function makeRawRequest(config) {
        var deferred = $q.defer();
        var _successControl = config.successControl || defaultSuccessControl;
        deferred.promise.oboe = oboe(
          {
            url: ovHttp.proxy(config.url),
            method: config.method,
            body: config.body,
            headers: config.headers || {'Content-Type': CONTENT_TYPE}
          }
        ).done(function (rawResponse) {
          //
          if (!rawResponse || !rawResponse.response) {
            deferred.reject(errorOboeResponseFormatter(rawResponse));
          }
          if (rawResponse.status.toUpperCase() === ERROR.toUpperCase() || rawResponse.status.toUpperCase() === FAILURE.toUpperCase()) {
            deferred.reject(errorOboeResponseFormatter(rawResponse));
          } else {
            _successControl(deferred, rawResponse, config);
          }
        }).fail(function (errorData) {
          $log.error(errorData);
          deferred.reject(errorOboeResponseFormatter(errorData));
        });
        return deferred.promise;
      }

      /**
       * make oboe.rawGet
       */
      function createShortRawOboeMethods(/*names*/) {
        angular.forEach(arguments, function (agr) {
          service[agr.displayName] = function (url, config) {
            var _config = config || {};
            _config.url = url;
            _config.method = agr.method.toUpperCase();
            return makeRawRequest(_config);
          };
        });
      }

      /**
       * make ovOboe.rawPost, ovOboe.rawPut, ovOboe.rawDelete
       */
      function createShortRawOboeMethodsWithData(/*names*/) {
        angular.forEach(arguments, function (agr) {
          service[agr.displayName] = function (url, data, config) {
            var _config = config || {};
            _config.url = url;
            _config.body = data;
            _config.method = agr.method.toUpperCase();
            return makeRawRequest(_config);
          };
        });
      }

      /**
       * cancel oboe request
       * @param apiObject
       */
      function cancelOboeRequest(apiObject) {
        if (!apiObject.oboe) {
          $log.error('This is unexpected exception. Request object doesn\'t have oboe object. Check constructor function or or makeRawRequest function');
          apiObject.oboe = {};
        }
        if (apiObject.isLoading) {
          (apiObject.oboe.abort || angular.noop)();
        }
        apiObject.isLoading = false;
      }

      //make oboe.get
      createShortRawOboeMethods({displayName: 'rawGet', method: 'get'});
      //make oboe.post, ovOboe.put, ovOboe.delete
      createShortRawOboeMethodsWithData(
        {displayName: 'rawPost', method: 'post'},
        {displayName: 'rawPut', method: 'put'},
        {displayName: 'rawDelete', method: 'delete'}
      );

      //change onPreExecute and onPostExecute invoker to promise if needed
      /**
       *
       * @name oboeConstruct
       * @methodOf utility.service:ovOboe
       * @description
       * oboe request constructor
       * @param {Object} oboeConfig parameter to make request
       * @param {String} [oboeConfig.url] url to make request. By default this setting isn't  used, it was added for compatibility with oboe.js
       * @param {String} [oboeConfig.method]
       *  - get/post/put/delete.
       *  - If you use ovOboe.get, ovOboe.post, ovOboe.put or ovOboe.delete this option will be ignored.
       * @param {Object|String} [oboeConfig.body] Request data
       * @param {Object} [oboeConfig.headers={'Content-Type': application/json}] parameter to make request
       * @param {Object} [oboeConfig.successControl=ovOboe.defaultSuccessControl] success control function
       * @param {Object} [oboeConfig.errorDetector=ovOboe.defaultErrorDetector] Error detector function
       * @param {Object} [oboeConfig.onPreExecute=angular.noop] pre-executed callback
       * @param {Object} [oboeConfig.onPostExecute=angular.noop] post-executed callback
       * @param {String} [oboeConfig.successProperty='enumResponse'] post-executed callback
       * @param {String} [oboeConfig.failCompareKey='fail'] Used to check successProperty is success or error
       * @param {boolean} [oboeConfig.isLoading=false] Used to check successProperty is success or error
       * @returns {Object} Promise: a promise with .success(), .error(), and .notify() method.
       */
      function oboeConstruct(oboeConfig) {
        var concreteOboe = {};
        concreteOboe.isLoading = false;
        concreteOboe.oboe = {};
        concreteOboe.config = angular.extend({}, oboeConfig);
        concreteOboe.cancel = function () {
          cancelOboeRequest(concreteOboe);
        };
        concreteOboe.endLoading = function () {
          concreteOboe.isLoading = false;
        };
        concreteOboe.execute = function (data, cancelPreviousRequest) {
          var _cancelPreviousRequest;
          var requestPromise;
          (concreteOboe.config.onPreExecute || angular.noop)();
          _cancelPreviousRequest = cancelPreviousRequest !== false;
          //
          if (_cancelPreviousRequest) {
            concreteOboe.cancel();
          }
          //
          concreteOboe.isLoading = true;
          concreteOboe.config.body = data || concreteOboe.config.body || concreteOboe.config.data || '';

          requestPromise = makeRawRequest(concreteOboe.config);
          concreteOboe.oboe = requestPromise.oboe;
          //
          (concreteOboe.config.onPostExecute || angular.noop)();
          return requestPromise;
        };
        return concreteOboe;
      }

      /**
       * create ovOboe.get function
       */
      function createShortOboeMethods(/*names*/) {
        angular.forEach(arguments, function (name) {
          $log.error('ovOboe was deprecated, use ovOboeBuilder instead.');
          service[name] = function (url, config) {
            var _config = config || {};
            _config.url = url;
            _config.method = name.toUpperCase();
            return oboeConstruct(_config);
          };
        });
      }

      /**
       * create ovOboe.post, ovOboe.put, ovOboe.delete function
       */
      function createShortOboeMethodsWithData(/*names*/) {
        angular.forEach(arguments, function (name) {
          service[name] = function (url, config) {
            $log.error('ovOboe was deprecated, use ovOboeBuilder instead.');
            var _config = config || {};
            _config.url = url;
            _config.method = name.toUpperCase();
            return oboeConstruct(_config);
          };
        });
      }

      createShortOboeMethods('get');

      createShortOboeMethodsWithData('post', 'put', 'delete');

      //
      service.makeRawRequest = makeRawRequest;
      service.oboeConstruct = oboeConstruct;
      //
      return service;
    }])
  ;
})();
