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
  angular.module('ngnms.ui.fwk.ovOboe', [])
    .service('ovOboeBuilder', ['$log', '$q', '$i18next', '$rootScope',
      function ($log, $q, $i18next, $rootScope) {
        var service = {};

        /**
         * @ngdoc service
         * @name ov-component.service:ovOboeBuilder
         *
         * @description
         * Generate ovOboe object providing GET, POST, PUT, and DELETE methods as a replacement of $http
         * ovOboe object allows to cancel any pending request
         * */
        function oboeBuilder(customConfiguration) {
          var builder = {}, oboe = window.oboe,
            FAIL = 'fail',
            ERROR = 'error',
            FAILURE = 'failure',
            CONTENT_TYPE = 'application/json',
            /**
             * contain all request (have id) was created by ovOboe
             * @type {{}}
             */
            allRequest = {},
            originalConfiguration = {
              successProperty: 'enumResponse',
              finalResponseProperty: 'finalResponse',
              finalResponseValue: true,
              failCompareKey: FAIL,
              singleRequest: false,
              deepCheck: true
            },
            defaultConfiguration = angular.extend({}, originalConfiguration, customConfiguration);

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
           * @methodOf ov-component.service:ovOboeBuilder
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
            var successProperty = config.successProperty || defaultConfiguration.successProperty,
              failCompareKey = config.failCompareKey || defaultConfiguration.failCompareKey;
            //deep check for success or response
            if (defaultConfiguration.deepCheck) {
              //note: Delete null check when server support
              if (rawResponse.response[successProperty] === null || rawResponse.response[successProperty] === undefined) {
                $log.error('successProperty undefined or null!', rawResponse.response);
                return true;
              } else {
                // convert operator before compare for support boolean
                //  boolean => string => compare
                return rawResponse.response[successProperty].toString().toUpperCase() === failCompareKey.toString().toUpperCase();
              }
            } else {
              return rawResponse.response ? false : true;
            }
          }


          /**
           *
           * @name defaultSuccessControl
           * @methodOf ov-component.service:ovOboeBuilder
           * @description
           * * Base on _errorDetector() function result to decide reject, resolve or notify result.
           * @param {Object} deferred deferred object
           * @param {Object} rawResponse raw response from API
           * @param {Object} concreteOboe
           * - configuration object
           * - _errorDetector function is defaultErrorDetector if config.errorDetector is undefined
           */
          function defaultSuccessControl(deferred, rawResponse, concreteOboe) {
            var _errorDetector = concreteOboe.config.errorDetector || defaultConfiguration.errorDetector || defaultErrorDetector;
            if (_errorDetector(rawResponse, concreteOboe.config)) {
              // concreteOboe.isLoading = false;
              //getFunction(concreteOboe.stopLoading)();
              deferred.reject(rawResponse);
              //ovInterceptors.notifyPhantomJsReceiveResponse();
              concreteOboe.remove();
            } else {
              //place notify before resolve to guarantee notify all data
              deferred.notify(rawResponse);
              //resolve have only responsibility: display message and close the process flow
              if (_.get(rawResponse.response, defaultConfiguration.finalResponseProperty) === defaultConfiguration.finalResponseValue ||
                concreteOboe.singleRequest ||
                defaultConfiguration.singleRequest) {
                // concreteOboe.isLoading = false;
                //getFunction(concreteOboe.stopLoading)();
                deferred.resolve(rawResponse);
                //ovInterceptors.notifyPhantomJsReceiveResponse();
                concreteOboe.remove();
              }
            }
          }



          /**
           * make oboe request base on config
           * @param {Object} concreteOboe
           * @param {Object} [requestData]
           * @returns {*}
           */
          function makeRawRequest(concreteOboe, requestData) {
            var deferred = $q.defer(),
              requestObject,
              _successControl = concreteOboe.config.successControl || defaultConfiguration.successControl || defaultSuccessControl;
            requestObject = {
              url: concreteOboe.config.url,
              method: concreteOboe.config.method,
              body: requestData,
              headers: concreteOboe.config.headers || {'Content-Type': CONTENT_TYPE}
            };
            //use raw url instead of ovHttp.proxy
            if (!concreteOboe.config.disableProxy) {
              requestObject.url = concreteOboe.config.url;
            }

            //ovInterceptors.notifyPhantomJsCallRequest();
            deferred.promise.oboe = oboe(
              requestObject
            ).done(function (rawResponse) {
              //reject if rawResponse or rawResponse.response is null/undefined
              if (!rawResponse || !rawResponse.response) {
                // concreteOboe.isLoading = false;
                getFunction(concreteOboe.stopLoading)();
                deferred.reject(errorOboeResponseFormatter(rawResponse));
                //ovInterceptors.notifyPhantomJsReceiveResponse();
                concreteOboe.remove();
              } else if (rawResponse.status.toUpperCase() === ERROR.toUpperCase() || rawResponse.status.toUpperCase() === FAILURE.toUpperCase()) {
                //check status error
                // concreteOboe.isLoading = false;
                getFunction(concreteOboe.stopLoading)();
                deferred.reject(errorOboeResponseFormatter(rawResponse));
                ovInterceptors.notifyPhantomJsReceiveResponse();
                concreteOboe.remove();
              } else {
                _successControl(deferred, rawResponse, concreteOboe);
              }
            }).fail(function (errorData) {
              $log.error(errorData);
              errorData.config = {
                url: concreteOboe.config.url
              };
              // concreteOboe.isLoading = false;
              getFunction(concreteOboe.stopLoading)();
              concreteOboe.remove();

              //handle responseError
              //ovInterceptors.handleResponseError(errorData);

              deferred.reject(errorOboeResponseFormatter(errorData));
              //ovInterceptors.notifyPhantomJsReceiveResponse();
            });
            return deferred.promise;
          }

          /**
           * make oboe.rawGet
           */
          function createShortRawOboeMethods(/*names*/) {
            angular.forEach(arguments, function (agr) {
              builder[agr.displayName] = function (url, config) {
                var _config = config || {};
                _config.url = url; //makeRawRequest
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
              builder[agr.displayName] = function (url, data, config) {
                var _config = config || {};
                _config.url = url;
                // _config.body = data;
                _config.method = agr.method.toUpperCase();
                return makeRawRequest(_config, data);
              };
            });
          }

          /**
           * cancel oboe request
           * @param concreteOboe
           */
          function cancelOboeRequest(concreteOboe) {
            if (!concreteOboe.oboe) {
              $log.error('This is unexpected exception. Request object doesn\'t have oboe object. Check constructor function or or makeRawRequest function');
              concreteOboe.oboe = {};
            }
            (concreteOboe.oboe.abort || angular.noop)();
            // concreteOboe.isLoading = false;
            getFunction(concreteOboe.stopLoading)();
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
           * @methodOf ov-component.service:ovOboeBuilder
           * @description
           * oboe request concreteOboe
           * @param {Object} oboeConfig parameter to make request
           * @param {String} [oboeConfig.url] url to make request. By default this setting isn't  used, it was added for compatibility with oboe.js
           * @param {String} [oboeConfig.method]
           *  - get/post/put/delete.
           *  - If you use ovOboe.get, ovOboe.post, ovOboe.put or ovOboe.delete this option will be ignored.
           * @param {Object|String} [oboeConfig.body] Request data
           * @param {Object} [oboeConfig.headers={"Content-Type": "application/json"}] parameter to make request
           * @param {Object} [oboeConfig.successControl=ovOboe.defaultSuccessControl] success control function
           * @param {Object} [oboeConfig.errorDetector=ovOboe.defaultErrorDetector] Error detector function
           * @param {Object} [oboeConfig.onPreExecute=angular.noop] pre-executed callback
           * @param {Object} [oboeConfig.onPostExecute=angular.noop] post-executed callback
           * @param {String} [oboeConfig.successProperty='enumResponse'] post-executed callback
           * @param {String} [oboeConfig.failCompareKey='fail'] Used to check successProperty is success or error
           * @param {String} [oboeConfig.requestId] Used to cancel old request
           * @param {boolean} [oboeConfig.disabledProxy=false] use raw url instead of ovHttp.proxy
           * @returns {Object} Promise: a promise with .success(), .error(), and .notify() method.
           */
          function oboeConstruct(oboeConfig) {
            var concreteOboe = {}, oldOboeRequest = allRequest[oboeConfig.requestId];
            concreteOboe.isLoading = false;
            concreteOboe.oboe = {};
            // concreteOboe.config = angular.extend({}, oboeConfig);
            concreteOboe.config = oboeConfig;
            concreteOboe.remove = function () {
              getFunction(concreteOboe.stopLoading)();
              allRequest[oboeConfig.requestId] = undefined;
            };
            /**
             * cancel oboe request id and clear attribute "requestId" in allRequest object
             */
            concreteOboe.cancel = function () {
              cancelOboeRequest(concreteOboe);
              allRequest[oboeConfig.requestId] = undefined;
            };

            concreteOboe.stopLoading = function () {
              concreteOboe.config.isLoading = false;
              concreteOboe.isLoading = false;
            };

            concreteOboe.startLoading = function () {
              concreteOboe.config.isLoading = true;
              concreteOboe.isLoading = true;
            };
            /**
             *
             * @param {object} data send to server
             * @param {boolean} cancelPreviousRequest - cancel previous request
             * @returns {*}
             */
            concreteOboe.execute = function (data, cancelPreviousRequest) {
              var _cancelPreviousRequest, requestPromise;
              (concreteOboe.config.onPreExecute || angular.noop)();
              //_cancelPreviousRequest default value is true
              _cancelPreviousRequest = cancelPreviousRequest !== false;
              //ignore cancel previous request in report mode
              if (_cancelPreviousRequest && !$rootScope.ovConfig.isReport) {
                concreteOboe.cancel();
                if (oldOboeRequest && oldOboeRequest.cancel && angular.isFunction(oldOboeRequest.cancel)) {
                  if (oboeConfig.requestId) {
                    //oboeLogger.info('ovOboe cancel request have id: ', oboeConfig.requestId);
                  }
                  oldOboeRequest.cancel();
                }
              }
              //
              // concreteOboe.isLoading = true;
              getFunction(concreteOboe.startLoading)();
              // concreteOboe.config.body = data || concreteOboe.config.body || concreteOboe.config.data || '';
              // concreteOboe.config.body = data || '';
              requestPromise = makeRawRequest(concreteOboe, data);
              concreteOboe.oboe = requestPromise.oboe;
              //update requestObject
              if (oboeConfig.requestId) {
                allRequest[oboeConfig.requestId] = concreteOboe;
              }
              //
              (concreteOboe.config.onPostExecute || angular.noop)();
              return requestPromise;
            };

            return concreteOboe;
          }

          function buildConfig(url, config) {
            var _config;
            if (url && angular.isObject(url) && !config) {
              _config = url || {};
            } else {
              _config = config || {};
              _config.url = url || _config.url;
            }
            if (!_config.requestId) {
              $log.warn('requestId used to manage request and cancel request, please add requestId to API URL: ' + url);
            }
            return _config;
          }

          /**
           * create ovOboe.get function
           */
          function createShortOboeMethods(/*names*/) {
            angular.forEach(arguments, function (name) {
              builder[name] = function (url, config) {
                var _config = buildConfig(url, config);
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
              builder[name] = function (url, config) {
                var _config = buildConfig(url, config);
                _config.method = name.toUpperCase();
                return oboeConstruct(_config);
              };
            });
          }

          //create methods without data
          createShortOboeMethods('get');
          //create methods with data
          createShortOboeMethodsWithData('post', 'put', 'delete');

          /**
           * cancel pending request (with cancelOnRouteChange: true) on route change change success
           */
          function cancelPendingRequest() {
            //remove
            _.forEach(allRequest, function (oboeObject) {
              if (oboeObject) {
                if (_.get(oboeObject, 'config.cancelOnRouteChange', false)) {
                  oboeObject.cancel();
                }
              }
            });
          }

          function cancelAllRequest() {
            _.forEach(allRequest, function (oboeObject) {
              if (oboeObject && angular.isFunction(oboeObject.cancel)) {
                oboeObject.cancel();
              }
            });
          }

          function getFunction(func) {
            return (func && _.isFunction(func)) ? func : angular.noop;
          }

          $rootScope.$on('$routeChangeSuccess', cancelPendingRequest);
          builder.cancelPendingRequest = cancelPendingRequest;
          //
          builder.makeRawRequest = makeRawRequest;
          builder.oboeConstruct = oboeConstruct;
          //
          return builder;
        }

        /**
         * @ngdoc method
         * @name build
         * @methodOf ov-component.service:ovOboeBuilder
         * @description
         * Generate ovOboe object
         *
         * @param {object} config Custom configuration to build a new ovOboe object.
         * @param {string} [config.successProperty='enumResponse'] Property name used to fetch success status of a response
         * @param {string} [config.finalResponseProperty='finalResponse'] Property name used to detect if a response is the final response object
         * @param {*} [config.finalResponseValue=true] Property value used to compare with the value fetched from `finalResponseProperty` property
         * @param {*} [config.failCompareKey='fail'] Property value used to compare with the value fetched from `successProperty` property
         * @param {boolean} [config.singleRequest=false] Imply type of request object, single or multipart
         * @param {boolean} [config.deepCheck=true] Apply deeper checking of response status
         *                                <pre>
         *                                // A sample response object like
         *                                var respObj = {
         *                                  response: {
         *                                    enumResponse: 'fail'
         *                                  }
         *                                }
         *
         *                                // with:
         *                                // - successProperty: 'enumResponse'
         *                                // - failCompareKey: 'fail'
         *
         *                                // then deeper check will try to retrieve respObj.response.enumResponse value to detect if this is an success of failed response of the request
         *                                // otherwise a success response is the one whose `response` property is NOT null, NOT undefined, and NOT empty
         *                                </pre>
         *
         * @example
         * **Multipart request:**
         * <pre>
         *  // In JS
         *  var multipartReqConfig = {
         *    successProperty: 'status',
         *    failCompareKey: 'FAIL'
         *  };
         *
         *  // Generate new ovOboe object from the builder
         *  var multipartReq = ovOboeBuilder.build(singleReqConfig);
         *
         *  // Build up and execute POST request with data of null
         *  var reqConfig = {
         *    requestId: 'your-api-operation'
         *  };
         *  var reqPromise = multipartReq.post('/your/api', reqConfig).execute(null);
         *
         *  // Register callbacks to promise
         *  reqPromise.then(
         *    function successReqHandler() {},
         *    function errorReqHandler() {},
         *    function notifyReqHandler(respData) {
         *      // Real data comes here
         *      console.log(respData.response);
         *    }
         *  );
         *
         * </pre>
         *
         * **Single request:**
         * <pre>
         *  // In JS
         *  var singleReqConfig = {
         *    successProperty: 'status',
         *    failCompareKey: 'FAIL',
         *    singleRequest: true
         *  };
         *
         *  // Generate new ovOboe object from the builder
         *  var singleReq = ovOboeBuilder.build(singleReqConfig);
         *
         *  // Build up and execute GET request
         *  var reqConfig = {
         *    requestId: 'your-api-operation'
         *  };
         *  var reqPromise = singleReq.get('/your/api', reqConfig).execute();
         *
         *  // Register callbacks to promise
         *  reqPromise.then(
         *    function successReqHandler() {},
         *    function errorReqHandler() {},
         *    function notifyReqHandler(respData) {
         *      // Real data comes here
         *      console.log(respData.response);
         *    }
         *  );
         *
         * </pre>
         *
         * **Cancel pending request when application is destroyed:**
         * <pre>
         *  var pendingRefreshReq;
         *
         *  var singleReq = ovOboeBuilder.build({
         *    singleRequest: true,
         *    successProperty: 'status',
         *    failCompareKey: 'FAIL'
         *  });
         *
         *  $ctr1.refresh = function () {
         *    pendingRefreshReq = singleReq.get('/your/api/to/refresh', {
         *      requestId: 'sample-app-refresh-request'
         *    });
         *
         *    pendingRefreshReq.execute().then(
         *      angular.noop,
         *      function onFailed() {
         *        console.log('Cannot refresh');
         *      },
         *      function onNotified(respData) {
         *        console.log('Refresh data', respData.response);
         *      }
         *    )
         *  };
         *
         *  function onScopeDestroyed() {
         *    if (pendingRefreshReq) {
         *      pendingRefreshReq.cancel();
         *    }
         *  }
         *
         *  $scope.$on('$destroy', onScopeDestroyed);
         *
         * </pre>
         *
         */
        service.build = oboeBuilder;

        /**
         * @ngdoc object
         * @name ov-component.object:ovOboe
         *
         * @description
         * Object providing GET, POST, PUT, and DELETE methods as a replacement of $http.
         * Must be generated from {@link ov-component.service:ovOboeBuilder}
         *
         * */

        /**
         * @ngdoc method
         * @name get
         * @methodOf ov-component.object:ovOboe
         *
         * @description
         * Build up a GET request before sending
         *
         * @param {string} url URL of GET request
         * @param {object} config Custom configuration
         * @param {string} config.requestId Used to cancel old request
         * @param {object=} [config.headers={"Content-Type": "application/json"}] Custom request header object
         * @param {function=} config.successControl Callback function used to control success status of a response
         * @param {function=} config.errorDetector Callback function used to detect error in a response
         * @param {function=} [config.onPreExecute=angular.noop] Pre-executed callback used to do before executing request
         * @param {function=} [config.onPostExecute=angular.noop] Post-executed callback used to do after executing request
         * @param {boolean=} [config.disabledProxy=false] Use raw URL instead of using ovHttp.proxy
         *
         * @returns {object} Concrete {@link ov-component.object:ovOboeReq} object
         * */

        /**
         * @ngdoc method
         * @name put
         * @methodOf ov-component.object:ovOboe
         *
         * @description
         * Build up a PUT request before sending
         *
         * @param {string} url URL of PUT request
         * @param {object} config Custom configuration. Refer to `config` parameter of `get` method
         *
         * @returns {object} Concrete {@link ov-component.object:ovOboeReq} object
         * */

        /**
         * @ngdoc method
         * @name post
         * @methodOf ov-component.object:ovOboe
         *
         * @description
         * Build up a POST request before sending
         *
         * @param {string} url URL of POST request
         * @param {object} config Custom configuration. Refer to `config` parameter of `get` method
         *
         * @returns {object} Concrete {@link ov-component.object:ovOboeReq} object
         * */

        /**
         * @ngdoc method
         * @name delete
         * @methodOf ov-component.object:ovOboe
         *
         * @description
         * Build up a DELETE request before sending
         *
         * @param {string} url URL of DELETE request
         * @param {object} config Custom configuration. Refer to `config` parameter of `get` method
         *
         * @returns {object} Concrete {@link ov-component.object:ovOboeReq} object
         * */

        /**
         * @ngdoc object
         * @name ov-component.object:ovOboeReq
         *
         * @description
         * Request object return from `get`, `put`, `post`, and `delete` methods of {@link ov-component.object:ovOboe} object
         * Provide functionality to work with concrete request
         *
         * */

        /**
         * @ngdoc method
         * @name remove
         * @methodOf ov-component.object:ovOboeReq
         *
         * @description
         * Stop loading request and remove the tracking of the request via request ID
         * */

        /**
         * @ngdoc method
         * @name startLoading
         * @methodOf ov-component.object:ovOboeReq
         *
         * @description
         * Mark the current request is being loaded
         * */

        /**
         * @ngdoc method
         * @name stopLoading
         * @methodOf ov-component.object:ovOboeReq
         *
         * @description
         * Mark the current request is NOT being loaded
         * */

        /**
         * @ngdoc method
         * @name cancel
         * @methodOf ov-component.object:ovOboeReq
         *
         * @description
         * Cancel current request and remove tracking of the request via request ID
         * */

        /**
         * @ngdoc method
         * @name execute
         * @methodOf ov-component.object:ovOboeReq
         *
         * @description
         * Execute the request
         *
         * @param {*} data Request data
         * @param {boolean=} cancelPreviousRequest Cancel previous request if different from false
         *
         * @returns {object} Promise object from $q
         * */

        return service;
      }])
  ;
})();
