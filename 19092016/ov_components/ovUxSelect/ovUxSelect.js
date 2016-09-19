/**
 * Created by hmhao on 7/14/2014.
 */
/**
 * @ngdoc directive
 * @name ov-component.directive:ovUxSelect
 * @restrict E
 * @description
 * Displays a select box with single and multiple selection, bound to an ng-model.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to
 * @param {string} ovNgOptions sets the options that the select is populated with and defines what is set on the model on selection.
 *     * `modelValue` **`for`** `item` **`in`** `collection`
 *     * `modelValue` **`as`** `label` **`for`** `item` **`in`** `collection`
 * @param {object=} ovSelectSetting setting for custom select box
 *   * **search**(optional) `boolean`: show/hide search box (default false)
 *   * **sort** (optional) `boolean`: show/hide sort button (default false)
 *   * **multiple** (optional) `boolean`: enable/disable multiple selection (default false)
 *   * **btnCheckAll** (optional) `boolean`: show/hide check all, un-check all buttons, only work with multiple selection (default false)
 *   * **selectUrl** (optional) `string`: custom select template url
 *   * **dropDownMenuUrl** (optional): `string`: custom dropdown template url
 *   * **itemTemplate** (optional) `string`: custom item template url
 * @param {string=} selectNone Add an item with undefined value in top of the dropdown list e.g. select-none="[None]".
 * @param {string=} uxSelectId An ID to be added to the element to support automation test  e.g. ux-select-id="test"
 * @param {expression=} ngChange Angular expression to be executed when selected option(s) changes due to user interaction with the select element.
 * @param {expression=} disabled Determines whether or not to disable the component
 * @param {expression=} ovAutoFocus Set the focus to the element in HTML form
 *
 *
 *
 * @example
 * **Basic Example:**
 *<pre>
 *  //HTML
 <ov-ux-select
 ng-model="ctrl.selected"
 ov-ng-options="item.value as item.name for item in ctrl.items">
 </ov-ux-select>
 *</pre>
 *<pre>
 * //JS
 ctrl.items = [
 {name: 'One', value: 1},
 {name: 'Two', value: 2}
 ];
 ctrl.selected = 1;
 *</pre>
 *
 * **Disable select box Example:**
 *<pre>
 *  //HTML
 <ov-ux-select
 ng-model="ctrl.selected"
 ov-ng-options="item.value as item.name for item in ctrl.items"
 disabled="ctrl.disableSelect">
 </ov-ux-select>
 *</pre>
 *<pre>
 * //JS
 ctrl.items = [
 {name: 'One', value: 1},
 {name: 'Two', value: 2}
 ];
 ctrl.selected = 1;
 ctrl.disableSelect = true;
 *</pre>
 *
 * **Disable a item Example:**
 *</pre>
 *<pre>
 * //JS
 ctrl.items = [
 {name: 'One', value: 1, disabled: true},
 {name: 'Two', value: 2}
 ];
 *</pre>
 *
 * **ov-ng-options Example:**
 *<pre>
 *  //HTML
 <ov-ux-select
 ng-model="ctrl.selected"
 ov-ng-options="item as item.name for item in ctrl.items">
 </ov-ux-select>
 //ctrl.selected will be a object
 *</pre>
 * *Array*
 *<pre>
 *  //HTML
 <ov-ux-select
 ng-model="ctrl.selected"
 ov-ng-options="value for value in ctrl.items">
 </ov-ux-select>
 *</pre>
 *<pre>
 * //JS
 ctrl.items = [1, 2];
 ctrl.selected = 1;
 *</pre>
 *
 * **select-none Example:**
 *<pre>
 *  //HTML
 <ov-ux-select
 ng-model="ctrl.selected"
 ov-ng-options="item as item.name for item in ctrl.items"
 select-none="[None]">
 </ov-ux-select>
 *</pre>
 *
 * **Search, Sort Example:**
 *<pre>
 *  //HTML
 <ov-ux-select
 ng-model="ctrl.selected"
 ov-ng-options="item.value as item.name for item in ctrl.items"
 ov-select-setting="ctrl.selectSetting">
 </ov-ux-select>
 *</pre>
 *<pre>
 * //JS
 ctrl.items = [
  {name: 'One', value: 1},
  {name: 'Two', value: 2}
 ];
 ctrl.selected = 1;
 ctrl.selectSetting = {
  search: true,
  sort: true
 }
 *</pre>
 *
 *  **Multiple selection Example:**
 *<pre>
 *  //HTML
 <ov-ux-select
 ng-model="ctrl.selected"
 ov-ng-options="item.value as item.name for item in ctrl.items"
 ov-select-setting="ctrl.selectSetting">
 </ov-ux-select>
 *</pre>
 *<pre>
 * //JS
 ctrl.items = [
 {name: 'One', value: 1},
 {name: 'Two', value: 2}
 ];
 ctrl.selected = [1];
 ctrl.selectSetting = {
   multiple:true,
   btnCheckAll:true
 }
 *</pre>
 *
 */
(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovUxSelect.directive', [])
    .directive('ovUxSelect', ['$parse', '$document', '$window', '$compile', 'optionParser', '$i18next', '$timeout', '$http', '$templateCache', '$ovUtility', '$filter', 'ovDottie', function ($parse, $document, $window, $compile, optionParser, $i18next, $timeout, $http, $templateCache, $ovUtility, $filter, ovDottie) {
      return {
        restrict: 'E',
        require: 'ngModel',
        link: function (originalScope, element, attrs, modelCtrl) {
          var exp = attrs.ovNgOptions,
            parsedResult = optionParser.parse(exp),
            scope = originalScope.$new(),
            dropDownShow = false,
            isOnChange = false,
            defaultSetting = {
              search: false,
              sort: false,
              fullWidth: true,
              multiple: false,
              btnCheckAll: false,
              maxCountSelected: 3,
              selectUrl: 'ov_components/ovUxSelect/templates/select.html',
              itemTemplate: 'ov_components/ovUxSelect/templates/itemTemplate.html',
              dropDownMenuUrl: 'ov_components/ovUxSelect/templates/vsDropDownMenu.html',
              applyScaling: false,
              shadowInputOverflow: false
            },
            selectLabel = $i18next('button-label.select'),
            dropDownMenu, selectElement, background, newScope, localData, hoverIndex, selectedIndex,
            dataGridElem, scrollTopMin, scrollTopMax, positionIndex, currentPos = [], scrollCache;
          var GAP = 40, SEARCH_HEIGHT = 3.4, ADD_NEW_HEIGHT = 3.4,  DOWN_KEY = 40, UP_KEY = 38, ENTER_KEY = 13, ESCAPE_KEY = 27;
          scope.selectNone = attrs.selectNone;
          scope.header = scope.selectNone || selectLabel;
          scope.height = 0.1;
          scope.disabled = false;
          scope.selectedListIndex = [];//save selectedListIndex to scroll to first selected index
          scope.obj = {};
          scope.collectionID = {
            btnLeft: 'ov-ux-select-btn-left',
            btnRight: 'ov-ux-select-btn-right',
            btnScale: 'ov-ux-select-btn-scale',
            dropdownInputSearch: 'ov-ux-select-dropdown-input-search',
            dropdownSort: 'ov-ux-select-dropdown-sort',
            dropdownCheckAll: 'ov-ux-select-dropdown-check-all',
            dropdownUncheckAll: 'ov-ux-select-dropdown-uncheck-all',
            dataGrid: 'ov-ux-select-dropdown-data-grid',
            addNew: 'ov-ux-select-btn-add-new'
          };
          //get ID of component OV UX SELECT//
          var ovUxSelectID = attrs.uxSelectId;
          angular.forEach(scope.collectionID, function (value, key) {
            if (ovUxSelectID) {
              scope.collectionID[key] = ovUxSelectID + '-' + value;
            } else {
              scope.collectionID[key] = null;
            }
          });
          var FIRST = 0, TIMEOUT = 200, CHUNK_SIZE = 50, CREEP_START_DELAY = 10, MAX_HEIGHT = 20;//
          //option for ux-data-gird
          scope.obj.options = {
            creepStartDelay: CREEP_START_DELAY,
            chunks: {detachDom: true, size: CHUNK_SIZE},
            scrollModel: {manual: true}
          };

          //scope.obj.setting=angular.extend(defaultSetting, scope.$eval(attrs.ovSelectSetting));
          scope.obj.setting = scope.$eval(attrs.ovSelectSetting) || {};
          $ovUtility.extendConfig(scope.obj.setting, defaultSetting);

          //add new handler
          scope.obj.onAddNewAttr = attrs.onAddNew;
          scope.obj.onAddNew = function () {
            /**
             * DOQ: This line supports for pressing add new link without change route url (same app)
             */
            removeDropdown();
            scope.$eval(attrs.onAddNew);
          };
          scope.obj.checkAddNewDisabled = function () {
            return $parse(attrs.addNewDisabled)(originalScope);
          };


          scope.obj.onExpand = scope.$eval(attrs.onExpand) || angular.noop;
          scope.obj.onCollapse = scope.$eval(attrs.onCollapse) || angular.noop;
          scope.obj.functions = scope.$eval(attrs.ovSelectFunctions) || {};

          scope.obj.functions.setPosition = function () {
            $timeout(function () {
              setPosition();
            });
          };

          var selectUrl = scope.obj.setting.selectUrl,
            dropDownMenuUrl = scope.obj.setting.dropDownMenuUrl,
            isMultiple = scope.obj.setting.multiple;
          scope.obj.items = [];
          scope.obj.searchText = '';

          //filter data
          var filter = function (list, keyword) {
            return $filter('filter')(list, {label: keyword});
          };

          scope.obj.filterData = function () {
            scope.obj.items = filter(localData, scope.obj.searchText);
            //get selected index again
            if (scope.obj.searchText === '') {
              if (typeof scope.obj.sortDesc !== 'undefined') {
                scope.obj.items = scope.obj.items.sort(sortList);
              }
              scope.selectedListIndex = getSelectedIndex();
            }
            scope.unhoverAll();
            if (scope.obj.items.length > 0) {
              hoverIndex = 0;
              ovDottie.set(scope.obj.items, hoverIndex + '.hover', true);
            }
            dataGridElem.scrollTop(0);
          };

          //sort data
          scope.obj.sortDesc = undefined;
          var sortList = function (a, b) {
            //ignore sort select-none value
            if (angular.isUndefined(a.model)) {
              return -1;
            }
            if (angular.isUndefined(b.model)) {
              return 1;
            }
            if (!scope.obj.sortDesc) {
              return $ovUtility.naturalSort(a.label, b.label);
            } else {
              return $ovUtility.naturalSort(b.label, a.label);
            }
          };
          scope.obj.sort = function () {
            scope.obj.sortDesc = !scope.obj.sortDesc;
            scope.obj.items = scope.obj.items.sort(sortList);
            scope.selectedListIndex = getSelectedIndex();
          };//end sort data

          function setFocusSelectElement(){
            if(attrs.ovAutoFocus === ''){
              setFocus(selectElement);
            }else{
              scope.$watch(function () {
                return $parse(attrs.ovAutoFocus)(originalScope);
              }, function (val) {
                if(val){
                  setFocus(selectElement);
                }
              });
            }
          }
          //get select template
          $http({method: 'GET', url: selectUrl, cache: $templateCache})
            .success(function (data) {
              selectElement = $compile(data)(scope);
              element.append(selectElement);
              setFocusSelectElement();
            });

          //parse model from ngOptions
          function parseModel() {
            scope.obj.items.length = 0;
            var model = parsedResult.source(originalScope) || [];
            if (!angular.isDefined(model)) {
              return;
            }
            //push select none object
            if (typeof scope.selectNone !== 'undefined') {
              scope.obj.items.push({
                label: $i18next(scope.selectNone),
                model: undefined,
                id: 'selectNone',
                checked: false,
                hover: false
              });
            }
            for (var i = 0; i < model.length; i++) {
              var local = {};
              local[parsedResult.itemName] = model[i];
              scope.obj.items.push({
                label: parsedResult.viewMapper(local),
                model: model[i],
                checked: false,
                hover: false,
                id: i
              });
            }
            //calculate height for ux-data-grid
            if (scope.obj.items.length < 5) {
              scope.height = (scope.obj.items.length * 4) + 0.2;
            } else {
              scope.height = MAX_HEIGHT;
            }
            localData = scope.obj.items;
          }

          //dropdown position
          var dropDownPostion = function (element) {
            var elem = element.children('div'),
              widthSelect = elem.width(),
              btnOffset = elem[0].getBoundingClientRect(),
              AUTO = 'auto',
              ddTop = AUTO, ddBottom = AUTO,
              bodyHeight = window.innerHeight,
              dropdownHeight = scope.height;

            if(scope.obj.onAddNewAttr){
              dropdownHeight += ADD_NEW_HEIGHT;
            }
            if(scope.obj.setting.search){
              dropdownHeight += SEARCH_HEIGHT;
            }

            if (btnOffset.top + dropdownHeight * 10 + elem.height() + 20 >= bodyHeight) { //show drop-up
              ddBottom = window.innerHeight - btnOffset.top + 4;
              ddTop = AUTO;
            } else {//show drop-down
              ddTop = btnOffset.top + elem.height() + 2;
              ddBottom = AUTO;
            }
            return {
              'width': widthSelect,
              'top': ddTop,
              'bottom': ddBottom,
              'left': btnOffset.left - widthSelect + elem.width(),
              'position': 'fixed',
              'display': 'block'
            };
          };

          //scroll selected index function
          var scrollTo = function (index) {
            $timeout(function () {
              if(dataGridElem){
                dataGridElem.scrollTop((index - 1) * 40);
              }
            }, TIMEOUT);
          };

          //Scroll Gap when using keyboard
          var scrollGap = function (index) {
            scrollTopMin = dataGridElem.scrollTop();

            // 4+1 is the number of item each repeat
            scrollTopMax = scrollTopMin + (GAP * 4);
            positionIndex = (index) * GAP;

            //Scroll up 1 gap
            if (positionIndex < scrollTopMin) {
              dataGridElem.scrollTop(scrollTopMin - GAP);
            }

            // Scroll down 1 gap
            if (positionIndex > scrollTopMax) {
              dataGridElem.scrollTop(scrollTopMin + GAP);
            }
          };

          //remove dropdown menu
          var remove = function () {
            if (newScope) {
              //remove sort and search text
              scope.obj.sortDesc = undefined;
              scope.obj.searchText = '';
              newScope.$destroy();
              newScope = null;
              background.unbind('click');
              background.empty().remove();
              background = null;
              dropDownMenu.empty().remove();
              dropDownMenu = null;
              dropDownShow = false;
              dataGridElem.empty().remove();
              dataGridElem = null;
              //Off window scroll event when removing dropdown
              angular.element($window).off('scroll.ovUxSelect', removeDropdown);
            }

          };

          var setFocus = function (elem) {
            if (elem) {
              $timeout(function () {
                elem.focus();
              });
            }
          };

          var removeDropdown = function () {
            remove();
            setFocus(selectElement);
            // Off prevent scroll when removing dropdown
            angular.element($window).off('keydown.ovUxSelect', preventWindowScroll);

            if (angular.isFunction(scope.obj.onCollapse)) {
              scope.obj.onCollapse();
            }
          };
          //show dropdown
          var showDropdown = function () {
            newScope = scope.$new();
            $http({method: 'GET', url: dropDownMenuUrl, cache: $templateCache})
              .success(function (data) {
                dropDownMenu = $compile(data)(newScope);
                background = angular.element('<div class="ov-select-background"></div>');
                var body = angular.element('body');
                body.append(background);
                var selectItmCss = dropDownPostion(element);
                dropDownMenu.css(selectItmCss);
                body.append(dropDownMenu);
                selectItmCss = null;
                body = null;
                background.bind('click', function () {
                  removeDropdown();
                });

                dataGridElem = dropDownMenu.find('.ov-ux-data-grid');

                // Check if the list has been filter search before and reset scroll if yes
                if (localData.length > scope.obj.items.length) {
                  scrollCache = undefined;
                }

                scope.obj.filterData();

                $timeout(function () {
                  if (angular.isUndefined(scrollCache)) {
                    if (scope.selectedListIndex.length > 0) {
                      scrollTo(scope.selectedListIndex[FIRST]);
                    } else {
                      dataGridElem.scrollTop(0);
                    }
                  } else {
                    dataGridElem.scrollTop(scrollCache);
                  }
                });


                // Switch focus to dropdown menu and set hover item
                dropDownMenu.focus();
                setHoverItem();

                // Prevent Window Scroll when dropdown is open
                angular.element($window).on('keydown.ovUxSelect', preventWindowScroll);

                //remove dropdown on window scroll
                angular.element($window).on('scroll.ovUxSelect', removeDropdown);
              });
          };

          //toggle select
          scope.toggleSelect = function () {
            if (!scope.disabled) {
              dropDownShow = !dropDownShow;
              if (dropDownShow) {
                if (angular.isFunction(scope.obj.onExpand)) {
                  scope.obj.onExpand();
                }
                showDropdown();
              } else {
                removeDropdown();
              }
            }
          };

          scope.obj.setting.toggleSelect = function () {
            scope.toggleSelect();
          };

          function getLocalMappingValue(item) {
            var local = {};
            local[parsedResult.itemName] = item.model;
            var localMappingKey = parsedResult.modelMapper(local);
            return localMappingKey;
          }

          var getSelectedIndex = function () {
            var listIndex = [];
            for (var i = 0; i < scope.obj.items.length; i++) {
              if (scope.obj.items[i].checked === true) {
                listIndex.push(i);
                if (!isMultiple) {
                  break;
                }
              }
            }
            return listIndex;
          };
          //single selection functions//////////////////////////////////////////////
          function setSingleHeaderText(item) {
            //TODO remove $timeout, check this later
            scope.header = item.label.toString();
            scope.selectedItem = item;
          }

          function setSingleModelValue(item) {
            var value = getLocalMappingValue(item);
            modelCtrl.$setViewValue(value);
            scope.selectedListIndex = getSelectedIndex();
          }

          //select single
          function selectSingle(item) {
            if (item.checked === false) {
              isOnChange = true;
              //unchecked prev item
              uncheckAll();
              //set checked for new item
              item.checked = true;
              setSingleModelValue(item);
              setSingleHeaderText(item);
            }
          }

          //end single selection functions//////////////////////////////////////////////

          //multiple selection functions//////////////////////////////////////////////
          function setMultiHeaderText(selectedNames) {
            if (selectedNames.length <= scope.obj.setting.maxCountSelected && selectedNames.length !== 0) {
              scope.header = selectedNames.join(', ');
            } else if (selectedNames.length === 0) {
              scope.header = selectedNames.length + ' ' + $i18next('button-label.selected');
            } else {
              var header = '';
              for (var i = 0, len = scope.obj.setting.maxCountSelected - 1; i < len; i++) {
                if (selectedNames[i]) {
                  header += selectedNames[i].toString();
                  if (i !== (len - 1)) {
                    header += ', ';
                  }
                }
              }
              header += ' ' + $i18next('common.and') + ' ';
              header += (selectedNames.length - (scope.obj.setting.maxCountSelected - 1));
              header += ' ' + $i18next('button-label.moreSelected');
              scope.header = header;
            }
          }

          function setMultiModelValueAndHeaderData(data, isGetListIndex) {
            var selectedNames = [];
            var selectedItems = [];
            if (isGetListIndex) {
              scope.selectedListIndex = [];
            }
            angular.forEach(data, function (item, i) {
              if (item.checked) {
                var localMappingValue = getLocalMappingValue(item);
                selectedItems.push(localMappingValue);
                selectedNames.push(item.label.toString());
                if (isGetListIndex) {
                  scope.selectedListIndex.push(i);
                }
              }
            });
            modelCtrl.$setViewValue(selectedItems);
            setMultiHeaderText(selectedNames);
          }

          function setCheckAll() {
            var selectedNames = [];
            var selectedItems = [];
            scope.selectedListIndex = [];
            angular.forEach(scope.obj.items, function (item, i) {
              if (!item.model.disabled || item.checked) {
                item.checked = true;
                var localMappingValue = getLocalMappingValue(item);
                selectedItems.push(localMappingValue);
                selectedNames.push(item.label.toString());
                scope.selectedListIndex.push(i);
              }
            });
            modelCtrl.$setViewValue(selectedItems);
            setMultiHeaderText(selectedNames);
          }

          scope.checkAll = function () {
            if (!isMultiple) {
              return;
            }
            isOnChange = true;
            if (scope.obj.setting.search && scope.obj.searchText !== '') {
              scope.selectedListIndex = [];
              angular.forEach(scope.obj.items, function (item, i) {
                if (!item.model.disabled) {
                  item.checked = true;
                }
                scope.selectedListIndex.push(i);
              });
              setMultiModelValueAndHeaderData(localData);
            } else {
              setCheckAll();
            }
            dropDownMenu.focus();
          };

          scope.uncheckAll = function () {
            if (!isMultiple) {
              return;
            }
            isOnChange = true;
            for (var i = 0; i < scope.obj.items.length; i++) {
              if (!scope.obj.items[i].model.disabled) {
                scope.obj.items[i].checked = false;
              }
            }
            setMultiModelValueAndHeaderData(localData);
            scope.selectedListIndex = [];
            dropDownMenu.focus();
          };

          scope.unhoverAll = function () {
            for (var i = 0; i < scope.obj.items.length; i++) {
              ovDottie.set(scope.obj.items, i + '.hover', false);
            }
          };

          //uncheck all
          function unCheckData(data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].checked === true) {
                data[i].checked = false;
                if (!isMultiple) {
                  break;
                }
              }
            }
          }

          function uncheckAll() {
            if (scope.obj.setting.search && scope.obj.searchText !== '') {
              unCheckData(localData);
            } else {
              unCheckData(scope.obj.items);
            }
          }

          //select multiple
          function selectMultiple(item) {
            isOnChange = true;
            item.checked = !item.checked;
            if (scope.obj.setting.search && scope.obj.searchText !== '') {
              setMultiModelValueAndHeaderData(localData);
              scope.selectedListIndex = getSelectedIndex();
            } else {
              setMultiModelValueAndHeaderData(localData, true);
            }
          }

          //end multiple selection functions/////////////////////////////////////////////////////////////////////

          //set select none if ngModel=== undefined
          function resetHeader() {
            if (typeof scope.selectNone !== 'undefined') {
              if (scope.obj.items[FIRST]) {
                scope.obj.items[FIRST].checked = true;
              }
              scope.header = $i18next(scope.selectNone);
            } else {
              scope.header = selectLabel;
            }
            scope.selectedItem = undefined;
          }

          //set checked item in case binding data from modelCtrl.$modelValue to VIEW
          function setChecked(newVal) {
            if (angular.isArray(newVal)) {//multi select
              var selectedNames = [];
              scope.selectedListIndex = [];
              angular.forEach(newVal, function (newValItem) {
                angular.forEach(scope.obj.items, function (item, i) {
                  //Get current mapping key
                  var localMappingValue = getLocalMappingValue(item);
                  if (angular.isDefined(localMappingValue)) {
                    if (localMappingValue === newValItem || angular.equals(localMappingValue, newValItem)) {
                      item.checked = true;
                      selectedNames.push(item.label);
                      scope.selectedListIndex.push(i);
                    }
                  }
                });
              });
              setMultiHeaderText(selectedNames);
            } else {//single select
              if (typeof newVal !== 'undefined') {
                scope.selectedListIndex = [];
                for (var i = 0; i < scope.obj.items.length; i++) {
                  var item = scope.obj.items[i];
                  var localMappingValue = getLocalMappingValue(item);
                  if (angular.isDefined(localMappingValue)) {
                    if (localMappingValue === newVal || angular.equals(localMappingValue, newVal)) {
                      //set checked item
                      item.checked = true;
                      scope.selectedListIndex.push(i);
                      setSingleHeaderText(item);
                      break;
                    }
                  }
                }
                if (scope.selectedListIndex.length === 0) {
                  resetHeader();
                }
              } else {
                resetHeader();
              }
            }
          }

          //select items in case binding data from VIEW modelCtrl.$modelValue
          var changeItem = function (item, toggleSelect) {
            if (isMultiple) {
              selectMultiple(item);
            } else {
              selectSingle(item);
              if (toggleSelect) {
                scope.toggleSelect();
              }
            }

          };

          scope.obj.select = function (item) {
            // save scrollCache when select item
            scrollCache = dataGridElem.scrollTop();
            //pre change promise
            var preChange = $parse(attrs.preChange)(scope, {item: item ? item.model : undefined});
            if (preChange && angular.isFunction(preChange.then)) {
              removeDropdown();
              preChange.then(function success() {
                changeItem(item);
              });
            } else {
              changeItem(item, true);
            }
            for (var i = 0; i < scope.obj.items.length; i++) {
              if (scope.obj.items[i].id === item.id) {
                selectedIndex = i;
              }
            }
          };


          //watch disabled state
          scope.$watch(function () {
            return $parse(attrs.disabled)(originalScope);
          }, function (newVal) {
            scope.disabled = newVal;
          });

          //watch ngOptions changes for ngOptions that are populated dynamically
          scope.$watchCollection(function () {
            return parsedResult.source(originalScope);
          }, function (newVal) {
            if (angular.isDefined(newVal)) {
              parseModel();
              //set checked item at the first time
              setChecked(modelCtrl.$modelValue);
            }
          });
          //watch model change
          scope.$watch(function () {
            return modelCtrl.$modelValue;
          }, function (newVal, oldVal) {
            //set checked item in case binding from other select
            if (newVal !== oldVal && isOnChange === false) {
              uncheckAll();
              setChecked(newVal);
            }
            if (isOnChange) {
              isOnChange = false;
            }
          });
          // set Position
          var setPosition = function () {
            if (newScope) {
              var selectItmCss = dropDownPostion(element);
              if (dropDownMenu) {
                dropDownMenu.css(selectItmCss);
              }
              selectItmCss = null;
            }
          };

          //set drop-down position again when resize window
          angular.element(window).on('resize.ovUxSelect', setPosition);


          //set arrow key to move item up or down when focused

          var setHoverItem = function () {
            scope.unhoverAll();
            setHoverIndex();
            if (scope.obj.items.length > 0) {
              ovDottie.set(scope.obj.items, hoverIndex + '.hover', true);
            }
          };

          var setHoverIndex = function () {
            scope.selectedListIndex = getSelectedIndex();
            // Check if only one single item was selected
            if (scope.selectedListIndex.length > 0) {
              if (!angular.isUndefined(scrollCache) && (selectedIndex !== undefined)) {
                hoverIndex = selectedIndex;
              } else {
                hoverIndex = scope.selectedListIndex[0];
              }
            } else {
              hoverIndex = 0;
            }
          };


          scope.itemHover = function (id, e) {
            if ((e.pageX !== currentPos[0]) || (e.pageY !== currentPos[1])) {
              for (var i = 0; i < scope.obj.items.length; i++) {
                scope.obj.items[i].hover = false;
                if (scope.obj.items[i].id === id) {
                  scope.obj.items[i].hover = true;
                  hoverIndex = i;
                }
              }
            }
            currentPos[0] = e.pageX;
            currentPos[1] = e.pageY;
          };

          scope.keyPress = function (e) {
            // Key is up or down or enter
            if (e.keyCode === UP_KEY || e.keyCode === DOWN_KEY || e.keyCode === ENTER_KEY) {
              scope.toggleSelect();
            }
          };

          var keyHandler = {};

          //UP ARROW
          keyHandler[UP_KEY] = function () {
            if (dropDownShow) {
              if (hoverIndex >= 1) {
                hoverIndex = hoverIndex - 1;
                scrollGap(hoverIndex);
              }
            } else {
              scope.toggleSelect();
            }
          };

          //DOWN ARROW
          keyHandler[DOWN_KEY] = function () {
            if (dropDownShow) {
              if (hoverIndex <= scope.obj.items.length - 2) {
                hoverIndex = hoverIndex + 1;
                scrollGap(hoverIndex);
              }
            } else {
              scope.toggleSelect();
            }
          };

          //ENTER
          keyHandler[ENTER_KEY] = function () {
            if (dropDownShow) {
              if (!((ovDottie.getBoolean(scope.obj.items, hoverIndex + '.model.disabled')))) {
                scope.obj.select(scope.obj.items[hoverIndex]);
              }
            } else {
              scope.toggleSelect();
            }
          };

          //ESCAPE
          keyHandler[ESCAPE_KEY] = function () {
            if (dropDownShow) {
              removeDropdown();
            }
          };

          scope.keyPressDropdownMenu = function (e) {
            if ((scope.obj.items.length > 0) && ((e.keyCode === UP_KEY) || (e.keyCode === DOWN_KEY) || (e.keyCode === ENTER_KEY) || (e.keyCode === ESCAPE_KEY))) {
              if(angular.isFunction(keyHandler[e.keyCode])){
                keyHandler[e.keyCode]();
              }

              scope.unhoverAll();
              if (scope.obj.items[hoverIndex]) {
                ovDottie.set(scope.obj.items, hoverIndex + '.hover', true);
              }
            }

          };

          var preventWindowScroll = function (e) {
            if (dropDownMenu && ((e.keyCode === UP_KEY) || (e.keyCode === DOWN_KEY))) {
              e.preventDefault();
            }
          };


          //destroy scope
          originalScope.$on('$destroy', function () {
            scope.$destroy();
          });

          scope.$on('$destroy', function () {
            removeDropdown();
            angular.element(window).off('resize.ovUxSelect');
            if (selectElement) {
              selectElement.remove();
              selectElement = null;
            }
          });

          scope.$on('$routeChangeStart', function (event, next) {
            removeDropdown();
          });

        }
      };
    }])
    .factory('optionParser', ['$parse', function ($parse) {

      //00000111000000000000022200000000000000003333333333333330000000000044000
      var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

      return {
        parse: function (input) {

          var match = input.match(TYPEAHEAD_REGEXP);
          if (!match) {
            throw new Error(
              'Expected typeahead specification in form of \'_modelValue_ (as _label_)? for _item_ in _collection_\'' +
              ' but got \'' + input + '\'.');
          }
          return {
            itemName: match[3],
            source: $parse(match[4]),
            viewMapper: $parse(match[2] || match[1]),
            modelMapper: $parse(match[2] ? match[1] : match[3])
          };
        }
      };
    }]);
})();
