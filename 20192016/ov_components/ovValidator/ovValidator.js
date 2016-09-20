/**
 * RTR-3556: UI Framework
 * Created by huynhhuutai on 12/30/13.
 */
(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovValidator
   * @restrict A
   * @description
   * The `ovValidator` directive validates with input rules to check user input and show an error if any.
   * It also requires ngModel.
   *
   * @param {array} ovValidator Sets the rules that the model is validated by.
   * This is the format of a validate object:
   * <pre>
   {
     validator: function (model) {
       if (!vm.addEdit.showVlanIdInput()) {
         return true;
       }
       return (Number(model) >= 1 && Number(model) <= 4094);
     },
     error: 'vlanManager.ipInterface.validation.vlanId.range'
   }
   * </pre>
   *
   * @param {boolean} isValid The real valid value. True if it's valid and vice versa.
   * @param {boolean} isProxyValid This value syncs with the error. If the error was shown, it's false and vice versa.
   * Sometime it's invalid but you don't want to show the error, so you call reset service. Then "isProxyValid" will be true even it's invalid.
   * @param {object} validatorConfig The config object, here is the default object:
   * <pre>
   {
     invoke: 'watch',//blur, watch,
     fixed: false,
     overrideClass: '',
     autoHasError: true,
     disabled: false
   }
   * </pre>
   * @param {string} validatorGroupId The id of form group which the current input belongs to. All the inputs in the same group will have the same validatorGroupId.
   * @param {string} cssWrap The css class name which wraps the input. Default is "form-group".
   *
   *
   *
   * @example
   * **Validate with available types:**
   *<pre>
   *  <!--HTML-->

    <div class="panel-body form-horizontal">

      <div class="form-group">
        <label class="control-label col-md-3" for="{{appId.serviceNameInput}}">
          *{{'vxlans.vxlanService.object.serviceName'|i18next}}</label>

        <div class="col-xs-11 col-md-6">
          <input type="text" class="form-control" auto-focus maxlength="31" ng-disabled="!isAddVxlanService()"
                 id="{{appId.serviceNameInput}}" ng-model="initial.vxlanServiceObject.serviceName"
                 ov-validator="vxlanServiceNameRules" is-valid="isValidObject.vxlanServiceNameIsValid"
                 validator-group-id="validatorGroupId.createVxlanService">
        </div>
      </div>

      <div class="form-group">
        <label class="control-label col-md-3">
          <i id="{{appId.vnIdInputTooltip}}" class="fa fa-info-circle vxlans-tooltip" ov-tooltip
             i18n-key="{{initial.vnIdInputTooltip}}"></i>
          {{'vxlans.vxlanService.object.vnId'|i18next}}</label>

        <div class="col-xs-11 col-md-6">
          <ov-spinner sp-config="spVxlanServiceVnId" sp-disabled="!isAddVxlanService()"
                      sp-value="initial.vxlanServiceObject.vnId" sp-id="{{appId.vnIdInput}}"
                      placeholder="{{'(0-16777215)'|i18next}}"></ov-spinner>
            <span ng-model="initial.vxlanServiceObject.vnId" ov-validator="vxlanServiceVnIdRules"
                  is-valid="isValidObject.vxlanServiceVnIdIsValid"
                  validator-group-id="validatorGroupId.createVxlanService"></span>
        </div>
      </div>

    </div>
   *</pre>
   *<pre>
   * //JS

    scope.vxlanServiceNameRules = [
      {
        validator: function (model) {
          model = model || '';
          return (model) ? model.length <= 32 : false;
        },
        error: 'vxlans.validator.vxlanService.nameLength'
      },
      ovValidatorServices.nameRule,
      ovValidatorServices.ASCIIRule
    ];
    scope.vxlanServiceVnIdRules = [
      {
        validator: function (model) {
          model = model || '';
          if (model.length === 0 || (!isNaN(model) && +model >= 0 && +model <= 16777215)) {
            return true;
          }
          return false;
        },
        error: 'vxlans.validator.vxlanService.vnIdInvalid'
      }
    ];
   *</pre>
   *
   */



  angular.module('ngnms.ui.fwk.ovValidator.directive', [])
    .directive('ovValidator', ['$http', '$compile', 'ovValidatorServices', '$templateCache',
      function ($http, $compile, ovValidatorServices, $templateCache) {
        return {
          restrict: 'A',
          require: '?ngModel',
          scope: {
            ovValidator: '=',
            isValid: '=?',
            isProxyValid: '=?',
            validatorConfig: '=?',
            validatorGroupId: '=?',
            cssWrap: '=?'
          },
          link: function (scope, element, attrs, ngModel) {
            if(!scope.cssWrap){
              scope.cssWrap ='.form-group';
            }
            if (!ngModel) {
              scope.isProxyValid = true;
              scope.isValid = true;
            }
            else {
              var isFirst = true, id = '', ttContent,
                validatorDefaultConfig = {
                  invoke: 'watch',//blur, watch,
                  fixed: false,
                  overrideClass: '',
                  autoHasError: true,
                  disabled: false
                },
                initValidator = function () {
                  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                  for (var i = 0; i < 5; i++) {
                    id += possible.charAt(Math.floor(Math.random() * possible.length));
                  }

                  if (scope.validatorConfig !== undefined) {
                    scope.validatorConfig = angular.extend(validatorDefaultConfig, scope.validatorConfig);
                  } else {
                    scope.validatorConfig = validatorDefaultConfig;
                  }
                  if (attrs.validatorConfig) {
                    scope.$parent[attrs.validatorConfig] = scope.validatorConfig;
                  }
                  $http({method: 'GET', url: 'ov_components/ovValidator/template.html', cache: $templateCache})
                    .success(function (result) {
                      if (scope.validatorConfig.fixed) {
                        ttContent = $compile($(result).children().eq(1))(scope).insertAfter(element);
                      }
                      else {
                        ttContent = $compile($(result).children().eq(0))(scope).insertAfter(element);
                      }
                    });
                },
                getModel = function () {
                  return ngModel.$modelValue === undefined ? '' : ngModel.$modelValue;
                },
                checkRule = function (validator) {
                  if (typeof validator === 'function') {
                    return validator(getModel());
                  } else {
                    return true;
                  }
                },
                checkRules = function () {
                  var n = scope.ovValidator.length;
                  if (n === 0) {
                    scope.isProxyValid = true;
                    scope.isValid = true;
                  }
                  for (var i = 0; i < n; i++) {
                    scope.isProxyValid = checkRule(scope.ovValidator[i].validator);
                    scope.isValid = scope.isProxyValid;
                    if (!scope.isProxyValid) {
                      if (scope.validatorConfig.autoHasError) {
//                        $(element.parents(scope.cssWrap).first()).addClass('has-error');
                        $(element.parents(scope.cssWrap).first()).addClass('has-error');
                      }
                      scope.errorIndex = i;
                      i = n;
                    }
                  }
                  ovValidatorServices.sendValid(scope.isProxyValid, scope.validatorGroupId, id);
                },
                checkValid = function () {
                  var n = scope.ovValidator.length;
                  for (var i = 0; i < n; i++) {
                    if (!checkRule(scope.ovValidator[i].validator)) {
                      return false;
                    }
                  }
                  return true;
                };
              initValidator();
              scope.errorIndex = null;
              scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                  if (fn && (typeof(fn) === 'function')) {
                    fn();
                  }
                } else {
                  this.$apply(fn);
                }
              };
              scope.$on('$destroy', function () {
                scope.destroyFlag = true;
                if (scope.validatorGroupId !== undefined) {
                  ovValidatorServices.destroy(scope.validatorGroupId, id);
                }
                if (ttContent) {
                  ttContent.remove();
                }
                element.off();
              });
              scope.getErrorMessage = function () {
                return (scope.errorIndex !== null && scope.ovValidator[scope.errorIndex]) ?
                  scope.ovValidator[scope.errorIndex].error : '';
              };
              scope.$watch('isProxyValid', function (newVal) {
                if (newVal && scope.validatorConfig.autoHasError) {
                  $(element.parents(scope.cssWrap).first()).removeClass('has-error');
                }
              });
              if (scope.validatorGroupId !== undefined) {
//                scope.$watch('ovValidator', function () {
//                  ovValidatorServices.sendValid(checkValid(), scope.validatorGroupId, id);
//                }, true);
                scope.$watch(getModel, function () {
                  ovValidatorServices.sendValid(checkValid(), scope.validatorGroupId, id);
                }, true);
                scope.$on('VALIDATOR_SUBMIT_' + scope.validatorGroupId, function () {
                  checkRules();
                });
                scope.$on('VALIDATOR_RESET_' + scope.validatorGroupId, function () {
                  scope.isProxyValid = true;
                  //scope.isValid = true;
                  if (scope.validatorConfig.autoHasError) {
                    $(element.parents(scope.cssWrap).first()).removeClass('has-error');
                  }
                });
                scope.$on('VALIDATOR_CHECK_VALID_' + scope.validatorGroupId, function () {
                    if (scope.destroyFlag !== true) {
                      ovValidatorServices.sendValid(checkValid(), scope.validatorGroupId, id);
                    }
                  }
                )
                ;
              }
              switch (scope.validatorConfig.invoke) {
              case 'blur':
                element.focusin(function () {
                  scope.safeApply(function () {
                    scope.isProxyValid = true;
                    scope.isValid = true;
                    if (scope.validatorConfig.autoHasError) {
                      $(element.parents(scope.cssWrap).first()).removeClass('has-error');
                    }
                  });
                });
                element.blur(function () {
                  scope.safeApply(function () {
                    checkRules();
                  });
                });
                break;
              default:
                scope.$watch(getModel, function () {
                  if (isFirst && (getModel() === '' || JSON.stringify(getModel()) === '{}' ||
                    (getModel() && getModel().length === 0) || getModel() === null || getModel() === undefined)) {
                    scope.isProxyValid = true;
                    scope.isValid = checkValid();
                  } else {
                    checkRules();
                  }
                  isFirst = false;
                }, true);
              }
            }
          }
        };
      }
    ])
    .
    directive('ovValidatorFormat', [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var formatExpression, formatLength, maxNum,
            ctrlKeyOnFF = function (e) {
              if ((e.keyCode === 46 || (37 <= e.keyCode && e.keyCode <= 40)) && !(e.which === e.keyCode && e.charCode === e.keyCode)) {
                return true;
              }
              return false;
            },
            integerFormat = function (e) {
              var key = e.which || e.charCode || e.keyCode || 0;
              if (key > 31 && (key < 48 || key > 57)) {
                if (!!!e.ctrlKey && key !== 8 && !ctrlKeyOnFF(e)) {
                  return false;
                }
              }
              return true;
            },
            numberFormat = function (e) {
              var key = e.which || e.charCode || e.keyCode || 0,
                start = element[0].selectionStart, end = element[0].selectionEnd,
                value = angular.copy($(element).val());
              if (start < end) {
                value = value.substring(0, start) + value.substring(end);
              }
              value = value.substring(0, start) + String.fromCharCode(key) + value.substring(start);
              if (isNaN(value)) {
                if (!!!e.ctrlKey && key !== 8 && !ctrlKeyOnFF(e)) {
                  return false;
                }
              }
              return true;
            },
            binaryFormat = function (e) {
              var key = e.which || e.charCode || e.keyCode || 0;
              if (String.fromCharCode(key) !== '0' && String.fromCharCode(key) !== '1') {
                if (!!!e.ctrlKey && key !== 8 && !ctrlKeyOnFF(e)) {
                  return false;
                }
              }
              return true;
            },
            exceptFormat = function (e) {
              var key = e.which || e.charCode || e.keyCode || 0;
              if (formatExpression.indexOf(String.fromCharCode(key)) >= 0) {
                if (!!!e.ctrlKey && key !== 8 && !ctrlKeyOnFF(e)) {
                  return false;
                }
              }
              return true;
            },
            includeFormat = function (e) {
              var key = e.which || e.charCode || e.keyCode || 0;
              if (formatExpression.indexOf(String.fromCharCode(key)) < 0) {
                if (!!!e.ctrlKey && key !== 8 && !ctrlKeyOnFF(e)) {
                  return false;
                }
              }
              return true;
            },
            lengthFormat = function (e) {
              var key = e.which || e.charCode || e.keyCode || 0;
              var start = element[0].selectionStart, end = element[0].selectionEnd;
              if ($(element).val().length + 1 - (end - start) > formatLength) {
                if (!!!e.ctrlKey && key !== 8 && !ctrlKeyOnFF(e)) {
                  return false;
                }
              }
              return true;
            },
            maxNumber = function (e) {
              var key = e.which || e.charCode || e.keyCode || 0,
                start = element[0].selectionStart, end = element[0].selectionEnd,
                value = angular.copy($(element).val());
              if (start < end) {
                value = value.substring(0, start) + value.substring(end);
              }
              value = value.substring(0, start) + String.fromCharCode(key) + value.substring(start);
              if (isNaN(value) || (!!!isNaN(value) && parseFloat(value) > maxNum)) {
                if (!!!e.ctrlKey && key !== 8 && !ctrlKeyOnFF(e)) {
                  return false;
                }
              }
              return true;
            };
          if (attrs.formatLength !== undefined) {
            scope.$watch(attrs.formatLength, function (newVal, oldVal) {
              if (oldVal > 0) {
                formatLength = oldVal;
                element.off('keypress', lengthFormat);
              }
              if (newVal > 0) {
                formatLength = newVal;
                $(element).keypress(lengthFormat);
              }
            });
          }
          if (attrs.maxNumber !== undefined) {
            scope.$watch(attrs.maxNumber, function (newVal, oldVal) {
              if (oldVal > 0) {
                maxNum = oldVal;
                element.off('keypress', maxNumber);
              }
              if (newVal > 0) {
                maxNum = newVal;
                $(element).keypress(maxNumber);
              }
            });
          }
          scope.$watch(attrs.ovValidatorFormat, function (newVal, oldVal) {
            var removeFunction = null,
              addFunction = null,
              oldFormat = oldVal,
              newFormat = newVal;

            if (oldVal !== undefined && oldFormat[oldVal.length - 1] === ']') {
              formatExpression = oldFormat.substring(oldVal.indexOf('[') + 1, oldVal.length - 1);
              oldFormat = oldVal.substring(0, oldVal.indexOf('['));
            }
            switch (oldFormat) {
            case 'integer':
              removeFunction = integerFormat;
              break;
            case 'number':
              removeFunction = numberFormat;
              break;
            case 'binary':
              removeFunction = binaryFormat;
              break;
            case 'except':
              removeFunction = exceptFormat;
              break;
            case 'include':
              removeFunction = includeFormat;
              break;
            default:
            }
            element.off('keypress', removeFunction);

            if (newVal !== undefined && newFormat[newVal.length - 1] === ']') {
              formatExpression = newVal.substr(newVal.indexOf('[') + 1, newVal.length - 1);
              newFormat = newVal.substr(0, newVal.indexOf('['));
            }
            switch (newFormat) {
            case 'integer':
              addFunction = integerFormat;
              break;
            case 'number':
              addFunction = numberFormat;
              break;
            case 'binary':
              addFunction = binaryFormat;
              break;
            case 'except':
              addFunction = exceptFormat;
              break;
            case 'include':
              addFunction = includeFormat;
              break;
            default:
            }
            $(element).on('keypress', addFunction);
          });
          scope.$on('$destroy', function () {
            element.off();
          });
        }
      };
    }])
    .directive('ovValidatorWatch', ['ovValidatorServices',
      function (ovValidatorServices) {
        return {
          restrict: 'A',
          scope: {
            ovValidatorWatch: '=',
            isValid: '=?'
          },
          link: function (scope) {
            if (scope.isValid !== undefined) {
              scope.$watch(function () {
                return ovValidatorServices.checkValid(scope.ovValidatorWatch);
              }, function (newVal) {
                scope.isValid = newVal;
              });
            }
          }
        };
      }]);
})
();
