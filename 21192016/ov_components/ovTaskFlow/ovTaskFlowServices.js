'use strict';
/**
 * @ngdoc service
 * @name ov-component.service:ovTaskFlow
 * @description
 * Provide a task flow from apps to apps and send data accordingly between apps for specific task of handling.
 * It also check flow breakage to alert user to give a proper decision of action.
 *
 * @requires $location
 *
 * @example
 * **Basic example:**
 *
 * <pre>
 *   // JS
 *
 *   function Controller1($scope, ovTaskFlow) {
 *
 *     var inFlow = false;
 *     var newTaskFlow, flowData, prevTask, prevTaskData;
 *
 *     // Check if there is a flow to this app
 *     if (ovTaskFlow.getFlowStatus()) {
 *       // Create new task flow object
 *       newTaskFlow = {
 *         name: 'Controller1',
 *         controller: 'Controller1',
 *         url: '/app1'
 *       };
 *
 *       // Push new task flow object to the flow
 *       ovTaskFlow.pushTask(newTaskFlow);
 *
 *       // Enable flow breakage check
 *       ovTaskFlow.setNoCheck(false);
 *
 *       flowLength = ovTaskFlow.getFlowLength();
 *       if (flowLength >= 2) {
 *         inFlow = true;
 *
 *         prevTask = ovTaskFlow.getPrevTask();
 *
 *         // As in a recommendation of using ovTaskFlow and the way of this app retrieves task data to process, the data is put as value of property `data` of the a task flow object
 *         prevTaskData = prevTask.data;
 *
 *         // Handle previous task flow object data
 *         // ,,,
 *       } else {
 *         ovTaskFlow.validateTask();
 *         ovTaskFlow.setNoCheck(true);
 *       }
 *     }
 *
 *     // ...
 *     // When finish handling task then go back to the previous one
 *     function finishTaskAndGoBack() {
 *       if (inFlow) {
 *         ovTaskFlow.goToPrevTaskApp();
 *       }
 *     }
 *
 *   }
 * </pre>
 * */
angular.module('ngnms.ui.fwk.services.ovTaskFlow', [])
  .factory('ovTaskFlow', ['$location', '$rootScope', '$i18next', 'dlgDataBuilder', '$ovDlgService', '$q', '$timeout', function ($location, $rootScope, $i18next, dlgDataBuilder, $ovDlgService, $q, $timeout) {

    var flow = [];
    var noCheck = false;
    var url = '';
    var _dlgTrueCallBack;
    var _dlgFalseCallBack;
    var dlgReturn = false;
    var isAdd = false;
    var state = 'list';
    var alert = dlgDataBuilder.getBuilder()
      .setTitle($i18next('ovTaskFlow.warning'))
      .setOverrideClass('ovTaskFlowDlg')
      .setShowCancel(true)
      .setFinishLabel($i18next('button-label.ok'))
      .setCancelLabel($i18next('button-label.cancel'))
      .setPerformFinish(function () {
        if (!_dlgTrueCallBack) {
          flow.length = 0;
          noCheck = true;
          if (url !== '') {
            $location.path(url);
          }
          dlgReturn = true;
          isAdd = false;
          $timeout(function () {
          });
        } else {
          _dlgTrueCallBack();
        }
      })
      .setPerformCancel(function () {
        if (!_dlgFalseCallBack) {
          dlgReturn = false;
          // If user cancels breaking task flow when changing EC, then rollback EC change
          // ovService.rollBackSelectedEC is undefined in OPEX OVC-Standalone, and CAPEX, therefore use angular noop
          //(ovService.rollBackSelectedEC || angular.noop)();
          $timeout(function () {
          });
        } else {
          _dlgFalseCallBack();
        }
      })
      .setTitleIconClasses('fa fa-warning fa-fw')
      .setTemplateUrl('template/ovTaskFlow/alertTemplate.html').build();
    var showAlert = function (event) {
      alert.buttonBarConfigs.finishLabel = $i18next('button-label.ok');
      alert.buttonBarConfigs.cancelLabel = $i18next('button-label.cancel');
      alert.title = $i18next('ovTaskFlow.warning');
      if (!event) {
        dlgReturn = true;
      } else {
        dlgReturn = false;
      }
      $ovDlgService.showDialog($rootScope, alert);
    };
    var compareUrl = function (url1, url2) {
      var url1Copy = url1, url2Copy = url2;
      if (url1Copy && url1Copy.length > 0) {
        while (url1Copy[0] === '/') {
          url1Copy = url1Copy.slice(1, url1Copy.length);
        }
        while (url1Copy[url1Copy.length - 1] === '/') {
          url1Copy = url1Copy.slice(0, url1Copy.length - 1);
        }
      }
      if (url2Copy && url2Copy.length > 0) {
        while (url2Copy[0] === '/') {
          url2Copy = url2Copy.slice(1, url2Copy.length);
        }
        while (url2Copy[url2Copy.length - 1] === '/') {
          url2Copy = url2Copy.slice(0, url2Copy.length - 1);
        }
      }
      return (url1Copy === url2Copy);
    };
    var checkUrl = function () {
      var path = $location.path();
      for (var i in flow) {
        if (compareUrl(path, flow[i].url)) {
          return true;
        }
      }
      return false;
    };
    var checkFlow = function (event, newUrl) {
      if (flow.length > 1 && !noCheck) {
        url = newUrl;
        try {
          event.preventDefault();
        } catch (err) {
        }
        showAlert(event);
      }
    };

    $rootScope.$on('$locationChangeStart', function (event/*, newUrl*/) {
      _dlgTrueCallBack = undefined;
      _dlgFalseCallBack = undefined;
      if (!checkUrl()) {
        checkFlow(event, $location.url());
      }
    });

    /**
     * @ngdoc method
     * @name setFlowStatus
     * @methodOf ov-component.service:ovTaskFlow
     * @description
     * Set the status of the flow. The status implies there is a flow between apps. If it's set to false, then empty the flow accordingly
     *
     * @param {boolean} val Status of the flow
     *
     * */
    function setFlowStatus(val) {
      //Clear flow if flow status set to false ( the old code does not clear flow even when flow status is false,
      // so that when user use flow again, there was the task from the old flow there and cause error).
      // is it right?
      if (!val) {
        flow = [];
      }
      isAdd = val;
    }


    var taskFlowService = {
      /**
       * @ngdoc method
       * @name getCurrentTask
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Return the current or the last task object in the flow
       *
       * @return {object} Task object
       * */
      getCurrentTask: function () {
        return flow[flow.length - 1];
      },

      /**
       * @ngdoc method
       * @name pushTask
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Push new task to the flow.
       * Task object structure is as follow:
       * <pre>
       *   {
       *     name: 'New Task Name',
       *     controller: 'NewTaskController',
       *     data: {}
       *   }
       * </pre>
       * A recommendation for putting data accompanying a task flow object is put it in `data` property of the task  flow object in form of a object.
       * To ensure only one task flow object with controller/name to be existed in the flow, task object controller/name will be checked and the flow will be cut off right at where a matched object is found.
       * If after pushing new task to the flow, the flow only contains one task flow object, then set the status of the flow to false meaning there is no flow at the time.
       *
       * @param {object} object Task flow object
       * */
      pushTask: function (object) {
        /*
         object {
         name:"name",//ex Edge Profile
         controller:"controller name" //ex edgeTemplateCtrl
         state:'create'
         }
         */
        var key = angular.isDefined(object.controller) ? 'controller' : 'name';

        for (var i = 0; i < flow.length; i++) {
          if (flow[i][key] === object[key]) {
            break;
          }
        }
        flow.length = i;
        flow.push(object);
        if (flow.length === 1) {
          isAdd = false;
        }
      },
      /**
       * @ngdoc method
       * @name pushNewTask
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Push new task to the flow.
       * Task object structure is as follow:
       * <pre>
       *   {
       *     name: 'New Task Name',
       *     controller: 'NewTaskController',
       *     data: {}
       *   }
       * </pre>
       * A recommendation for putting data accompanying a task flow object is put it in `data` property of the task  flow object in form of a object.
       * To ensure only one task flow object with controller/name to be existed in the flow, task object controller/name will be checked and the flow will be cut off right at where a matched object is found.
       * If after pushing new task to the flow, the flow only contains one task flow object and flow status is true, then empty the flow and set the status of the flow to false meaning there is no flow at the time.
       *
       * @param {object} object Task flow object
       * */
      pushNewTask: function (object) {
        var key = angular.isDefined(object.controller) ? 'controller' : 'name';

        for (var i = 0; i < flow.length; i++) {
          if (flow[i][key] === object[key]) {
            break;
          }
        }
        flow.length = i;
        flow.push(object);
        if (flow.length === 1) {
          if (isAdd) {
            flow.length = 0;
          }
          isAdd = false;
        }
      },
      /**
       * @ngdoc method
       * @name addTask
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Add new task to the flow. Task flow object controller/name will be checked to detect any existence of the task flow object. If not found, then use `pushNewTask` method to push new task
       *
       * @param {object} object Task flow object
       * */
      addTask: function (object) {
        var key = angular.isDefined(object.controller) ? 'controller' : 'name';
        var task = this.searchFlow(object[key]);
        if (task && task.childId) {

        } else {
          this.pushNewTask(object);
        }
      },
      // emptyFlow: function(){

      // },
      /**
       * @ngdoc method
       * @name getFlowLength
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Get lenght of the flow
       *
       * @return {number} Flow length
       * */
      getFlowLength: function () {
        return flow.length;
      },
      /**
       * @ngdoc method
       * @name getDlgReturnValue
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Return the value of the dialog after being closed which implies the way of closing the dialog: cancel or submit
       * The dialog is used to alert user is trying to break the flow to give a proper decision of action (cancel or submit).
       *
       * @return {boolean} Return value of the dialog after being closed
       * */
      getDlgReturnValue: function () {
        return dlgReturn;
      },
      setDlgReturnValue: function (val) {
        dlgReturn = val;
      },
      /**
       * @ngdoc method
       * @name getFlowStatus
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Get the status of the flow. The status implies there is a flow between apps.
       *
       * @returns {boolean} Status of the flow
       *
       * */
      getFlowStatus: function () {
        return isAdd;
      },
      setFlowStatus: setFlowStatus,
      /**
       * @ngdoc method
       * @name showDlg
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Manually check flow breakage and display the dialog if breakage checking is enabled with custom submit and cancel callbacks.
       * If submission for breakage is proceeded, then go to given expected URL
       *
       * @param {string} url Next URL to go if submitting flow breakage
       * @param {function=} _tCallBack Submit callback
       * @param {function=} _fCallBack Cancel callback
       * */
      showDlg: function (url, _tCallBack, _fCallBack) {
        _dlgTrueCallBack = _tCallBack;
        _dlgFalseCallBack = _fCallBack;
        checkFlow(true, url);
      },
      /**
       * @ngdoc method
       * @name searchItem
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Iterate through the flow, find and return a task flow object containing value of property `type` equal to `name`.
       * Otherwise return false
       *
       * @param {string} name Value to compare
       * @param {string} type Property name to get value
       *
       * @returns {*}
       * * Task flow object if found
       * * false otherwise
       * */
      searchItem: function (name, type) {
        for (var i = 0; i < flow.length; i++) {
          if (flow[i][type] === name) {
            return flow[i];
          }
        }
        return false;
      },
      /**
       * @ngdoc method
       * @name searchFlow
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Search flow object in stack by controller name
       *
       * @param {string} controllerName Controller name to compare
       *
       * @returns {object} Task flow object
       */
      searchFlow: function (controllerName) {
        //return _.chain(flow).filter(function (flowObj) {
        //  return flowObj.controller === controllerName;
        //}).first().value();

        return _.find(flow, function (flowObj) {
          return flowObj.controller === controllerName;
        });
      },
      /**
       * @ngdoc method
       * @name getTask
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Get task flow object by its key and value
       *
       * @param {string} key Property key of a task object
       * @param {string} value Value to compare
       *
       * @returns {object} Task object
       */
      getTask: function (key, value) {
        for (var i = 0; i < flow.length; i++) {
          if (flow[i][key] === value) {
            return flow[i];
          }
        }
        //return undefined;
      },
      /**
       * get task flow object by controllerName
       * @param controllerName
       * @return {object|undefined} task flow object, return undefined if not found.
       */
      getTaskFlow: function (controllerName) {
        return _.find(flow, function (flowObj) {
          return flowObj.controller === controllerName;
        });
      },
      /**
       * @ngdoc method
       * @name setNoCheck
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Enable/disable breakage checking
       *
       * @param {boolean} val Enable/disable breakage checking
       * */
      setNoCheck: function (val) {
        noCheck = val;
      },
      /**
       * @ngdoc method
       * @name getNoCheck
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Return breakage checking activation status
       *
       * @returns {boolean} Breakage checking activation status
       * */
      getNoCheck: function () {
        return noCheck;
      },
      /**
       * @ngdoc method
       * @name getFlow
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Returns the list of all task flow objects forming a flow between apps.
       *
       * @returns {array} The flow
       * */
      getFlow: function () {
        return flow;
      },
      /**
       * @ngdoc method
       * @name goToTask
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Go to a specific task using its URL without checking flow breakage
       *
       * @param {object} Task flow object
       * */
      goToTask: function (task, _changeTabCallBack) {
        if (task) {
          if (task.url) {
            noCheck = true;
            $location.url(task.url);
          } else if (task.tab) {
            _changeTabCallBack(task.tab, false);
          }
        }
      },
      /**
       * @ngdoc method
       * @name goToPrevTaskApp
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Go to the previous task using its URL without checking flow breakage
       * */
      goToPrevTaskApp: function () {
        var _this = this;
        if (_this.getFlowStatus()) {
          _this.goToTask(_this.getPrevTask());
        }
      },
      /**
       * @ngdoc method
       * @name getPrevTask
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Return the previous task flow object in the flow
       *
       * @returns {object} The previous task flow object
       * */
      getPrevTask: function () {
        if (flow && flow.length >= 2) {
          return flow[flow.length - 2];
        }
      },
      setState: function (_state) {
        state = _state;
      },
      getState: function () {
        return state;
      },
      /**
       * @ngdoc method
       * @name initialFlowObject
       * @methodOf ov-component.service:ovTaskFlow
       * @description
       * Initialize task flow object with given config to add to the flow.
       * The URL of the return task flow object will be the current one
       *
       * @param {object} config Custom task flow object data
       *
       * @returns {object} A new task flow object
       */
      initialFlowObject: function initialFlowObject(config) {
        var flow = {
          name: config.controller,
          controller: config.controller,
          url: $location.path()
        };
        flow = angular.merge({}, flow, config);
        return flow;
      },
      /*searchTaskByCtrl: function(ctrl, type){
       var i;
       for (i = 0; i < flow.length; i++) {
       {
       if (flow[i][type] === ctrl) {
       return true;
       }
       }
       }
       return false;
       }*/
      resetFlow: function () {
        flow = [];
      }
    };
    /**
     * @ngdoc method
     * @name validateTask
     * @methodOf ov-component.service:ovTaskFlow
     * @description
     * Check if the flow only contains one task flow object meaning there is no flow between apps.
     * Then empty the flow and set the status to false.
     */
    taskFlowService.validateTask = function validateTask() {
      if (flow.length === 1) {
        //Clear flow
        setFlowStatus(false);
      }
    };
    return taskFlowService;
  }]);
