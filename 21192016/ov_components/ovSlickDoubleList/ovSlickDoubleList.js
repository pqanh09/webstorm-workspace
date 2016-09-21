/**
 * RTR-3556: UI Framework
 * Created by huynhhuutai on 2/26/14.
 */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name ov-component.directive:ovSlickDoubleList
   * @restrict EA
   * @description
   * The `ovSlickDoubleList` turns a standard multiple selection box into a side-by-side pick list
   * which supports for easily and quickly selecting or removing multiple items.
   *
   * @param {array} inputList Array of available items, item is a object.
   * @param {array} selectedList Array of selected items, item is a object.
   * @param {object=} sdlConfig he configuration object:
   *   * **itemTemplateUrl**: The item template url for the rows.
   *   * **tagTemplateUrl**: The tag template url for the tags.
   *   * **leftHandSide**: If true, the selected list will be on the left side and vice versa. Default is false.
   *   * **showItemTooltip**: If true, an info button will be added on each row which user can click on to show extra info. Default is false.
   *   * **sortByList**: A list of sort by objects.
   *   * **sortBy**: An object in sortByList.
   *   * **sortAsc**: If true, the array of items will be sort in a descending order and vice versa.
   *   * **searchBy**: The property of item to search by.
   *   * **tagList**: Array of tags object to config tags. Please check default tag list in ovUtility service.
   *   * **extendedTagList**: Array of extend tags object to config extend tags.
   *   * **showTag**: If true, tags will be shown.
   *   * **tagListOverrideCss**: Array of extend tags object to config extend tags.
   *
   *
   *   The APIs you can use outside via sdlConfig:
   *   * **resize**: Trigger slick grid rerender.
   *   * **synSelection**: Sync checked item with inputListIndex and selectedListIndex.
   *   * **searchString**: This attribute is current search string.
   *   * **doSort**: Trigger to sort items by current selected sort by.
   *
   *
   *   In addition, you are allowed to add more functions to handle item in item template by pass those functions into sldConfig as well.
   *   By default, this component has 3 functions bellow to handle item display, you can override or add your own:
   *   * **getPrimary**: This function was used in default item template, it returns the primary string of item, e.g. "item.name".
   *   * **getSecondary**: The same as getPrimary function.
   *   * **getItemTooltip**: This function is used along with showItemTooltip flag, it should return the tooltip for the item.
   *
   *
   *
   *
   *
   *
   * @param {array=} inputListIndex Array of available checked items indexes.
   * @param {array=} selectedListIndex Array of selected checked items indexes.
   * @param {string=} itemId Provide a property of an item which is used for identification.
   * @param {string=} sdlId Provide unique id of directive for automation test.
   * @param {boolean=} sdlDisabled If the expression is true, then this directive will be disabled and vice versa.
   *
   *
   *
   * @example
   *<pre>
   *  <!--HTML-->
    <ov-slick-double-list sdl-config="vm.portSelector.config"
                          sdl-id="vlan-manager-create-port-selector"
                          input-list="vm.portSelector.inputList"
                          selected-list="vm.portSelector.selectedList">    
    </ov-slick-double-list>
   *</pre>
   *<pre>
   * //JS
    function getPortDoubleListConfig() {
      var portFields = [
        {
          name: $i18next('common.port'),
          key: 'port',
          title: $i18next('common.port')
        },
        {
          name: $i18next('common.description'),
          key: 'description',
          title: $i18next('common.description')
        }
      ];
      return {
        searchString: '',
        showItemTooltip: true,
        showTag: true,
        sortAsc: true,
        searchBy: _.head(portFields).key,
        sortBy: _.head(portFields),
        itemHeight: 50,
        sortByList: portFields
      };
    }

    vm.portSelector = {
      config: getPortDoubleListConfig(),
      inputList: [
        {
          ifIndex: 1024,
          port: '1/24',
          description: 'Alcatel-Lucent 1/24'
        },
        {
          ifIndex: 1001,
          port: '1/1',
          description: 'Alcatel-Lucent 1/1'
        },
        {
          ifIndex: 1002,
          port: '1/2',
          description: 'Alcatel-Lucent 1/2'
        },
        {
          ifIndex: 1003,
          port: '1/3',
          description: 'Alcatel-Lucent 1/3'
        },
        {
          ifIndex: 1004,
          port: '1/4',
          description: 'Alcatel-Lucent 1/4'
        },
        {
          ifIndex: 1005,
          port: '1/5',
          description: 'Alcatel-Lucent 1/5'
        }
      ],
      selectedList: []
    };
   *</pre>
   *
   */

  angular.module('ngnms.ui.fwk.ovSlickDoubleList', [])
    .directive('ovSlickDoubleList', ['$timeout', '$i18next', '$http', '$templateCache', '$ovUtility', 'ovDottie', 'ovConstant', '$animate',
      function ($timeout, $i18next, $http, $templateCache, $ovUtility, ovDottie, ovConstant, $animate) {
        return {
          restrict: 'EA',
          replace: true,
          scope: {
            sdlConfig: '=?',
            inputList: '=',
            selectedList: '=',
            inputListIndex: '=?',
            selectedListIndex: '=?',
            itemId: '=?',
            sdlDisabled: '=?'
          },
          templateUrl: 'ov_components/ovSlickDoubleList/templates/main.html',
          link: function (scope, element, attrs) {
            $animate.enabled(false, element);
            scope.collectionID = {
              uxSelectId: 'sdl-usl',
              sdlSort: 'sdl-sort-type',
              sdlSearch: 'sdl-search-input',
              addSelectedItem: 'sdl-add-selected-item',
              addAllItem: 'sdl-add-all-item',
              moveSelectedItemUp: 'sdl-move-selected-item-up',
              moveSelectedItemDown: 'sdl-move-selected-item-down',
              removeSelectedItem: 'sdl-remove-selected-item',
              removeAllItem: 'sdl-remove-all-item',
              inputCheckboxEachItem: 'sdl-input-checkbox-each-item-',
              selectedCheckboxEachItem: 'sdl-selected-checkbox-each-item-',
              showMoreBtnEachItem: 'sdl-show-more-btn-each-item-',
              inputBtnEachItem: 'sdl-input-btn-each-item-',
              selectedBtnEachItem: 'sdl-selected-btn-each-item-'
            };
            angular.forEach(scope.collectionID, function (value, key) {
              if (attrs.sdlId) {
                scope.collectionID[key] = attrs.sdlId + '-' + value;
              } else {
                scope.collectionID[key] = null;
              }
            });
            scope.safeDigest = function (fn) {
              if (this.$root && this.$root.$$phase) {
                var phase = this.$root.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                  if (fn && (typeof(fn) === 'function')) {
                    fn();
                  }
                } else {
                  this.$digest(fn);
                }
              } else {
                this.$digest(fn);
              }
            };
            var backupConfig = {},
              sdlDefaultConfig = {
                itemTemplateUrl: 'ov_components/ovSlickDoubleList/templates/contentDefault.html',
                tagTemplateUrl: 'ov_components/ovSlickDoubleList/templates/defaultRepeatedTagList.html',
                leftHandSide: false,
                item: 'ovSlickDoubleList.defaultConfig.item',
                selected: $i18next('ovSlickDoubleList.defaultConfig.selected'),
                moveSelectedUpTooltip: $i18next('ovSlickDoubleList.defaultConfig.moveSelectedUpTooltip'),
                moveSelectedDownTooltip: $i18next('ovSlickDoubleList.defaultConfig.moveSelectedDownTooltip'),
                removeSelectedTooltip: $i18next('ovSlickDoubleList.defaultConfig.removeSelectedTooltip'),
                removeAllTooltip: $i18next('ovSlickDoubleList.defaultConfig.removeAllTooltip'),
                addAllTooltip: $i18next('ovSlickDoubleList.defaultConfig.addAllTooltip'),
                addSelectedTooltip: $i18next('ovSlickDoubleList.defaultConfig.addSelectedTooltip'),
                searchText: $i18next('ovSlickDoubleList.defaultConfig.searchText'),
                add: $i18next('ovSlickDoubleList.defaultConfig.add'),
                showItemTooltip: false,
                showMore: $i18next('ovSlickDoubleList.defaultConfig.showMore'),
                remove: $i18next('ovSlickDoubleList.defaultConfig.remove'),
                sortByText: $i18next('ovSlickDoubleList.defaultConfig.sortBy'),
                sortBy: null,
                sortAsc: true,
                sortByList: [],
                searchBy: 'name',
                showUpDownTag: true,
                tagList: $ovUtility.getDefaultTagList(),
                extendedTagList: []
              }, inputDataView, selectedDataView,
              NOT_DRAG = 0,
              DRAG_ON_INPUT = 1,
              DRAG_ON_SELECTED = 2,
              NOT_SELECT = 0,
              SELECT_ON_INPUT = 1,
              SELECT_ON_SELECTED = 2,
              firstInputTemplate = '<div class="item-wrapper {{item.overrideCss}}"><div class="checkbox-control" id="input-checkbox-{{collectionID.inputCheckboxEachItem}}{{item[itemId]}}" ng-click="selectedI($event,item)">' +
                '<div class="slick-double-list-checkbox-proxy"><i class="fa fa-check {{getCheckboxClass(item)}}">' +
                '</i></div></div><div class="item-content" ng-class="{\'blocking-content\': (item.disabled||item.sdlDisabled)}">',
              firstSelectedTemplate = '<div class="item-wrapper {{item.overrideCss}}"><div class="checkbox-control" id="select-checkbox-{{collectionID.selectedCheckboxEachItem}}{{item[itemId]}}" ng-click="selectedS($event,item)">' +
                '<div class="slick-double-list-checkbox-proxy"><i class="fa fa-check {{getCheckboxClass(item)}}">' +
                '</i></div></div><div class="item-content" ng-class="{\'blocking-content\': (item.disabled||item.sdlDisabled)}">',
              lastTemplate = '<button class="action-show-more btn btn-default" ng-if="sdlConfig.showItemTooltip" ov-tooltip i18n-key="{{getItemTooltip(item)}}" css-class="sdl-tooltip-wrapper" id="input-btn-{{collectionID.showMoreBtnEachItem}}{{item[itemId]}}" title="{{sdlConfig.showMore}}">' +
                '<i class="sdl-item-tooltip fa fa-info-circle"></i></button>' +
                '<div class="ov-sdbl-tag-list ov-tag-list {{sdlConfig.tagListOverrideCss}}" ng-if="sdlConfig.showTag"><div ng-include="sdlConfig.tagTemplateUrl"></div></div>' +
                '<div class="blocking-item" ng-show="(item.disabled||item.sdlDisabled)"></div></div>',
              inputTemplate = '</div><button class="action btn btn-default" id="input-btn-{{collectionID.inputBtnEachItem}}{{item[itemId]}}" ng-click="addItem(item, $event, preventDouble);preventDouble=true" title="{{sdlConfig.add}}">' +
                '<i class="action-content fa fa-plus"></i></button>',
              selectedTemplate = '</div><button class="action btn btn-default" id="select-btn-{{collectionID.selectedBtnEachItem}}{{item[itemId]}}" type="button" ng-click="removeItem(item, $event, preventDouble);preventDouble=true" title="{{sdlConfig.remove}}">' +
                '<i class="action-content fa fa-minus"></i></button>',
              dragObject = {
                dragging: NOT_DRAG //0: not, 1 input, 2 selected.
              },
              selectedObject = {
                selecting: NOT_SELECT
              },
              initSlickDoubleList = function () {

                scope.getCheckboxClass = function (item) {
                  return item.sdlSelected ? 'checkbox-check' : 'checkbox-un-check';
                };
                backupConfig = angular.copy(scope.sdlConfig);
                var newConfig;
                if (!angular.isObject(scope.sdlConfig)) {
                  newConfig = sdlDefaultConfig;
                } else {
                  newConfig = angular.extend({}, sdlDefaultConfig, scope.sdlConfig);
                }

                angular.forEach(newConfig, function (value, key) {
                  scope.sdlConfig[key] = value;
                });

                scope.sdlConfig.resize = function () {
                  ovDottie.getFunction(scope, 'inputGrid.resizeCanvas')();
                  ovDottie.getFunction(scope, 'selectedGrid.resizeCanvas')();
                };
                scope.tagList = angular.copy(scope.sdlConfig.tagList);
                if (angular.isDefined(scope.sdlConfig.extendedTagList) && scope.sdlConfig.extendedTagList.length !== 0) {
                  angular.forEach(scope.sdlConfig.extendedTagList, function (extendedTag) {
                    scope.tagList.push(extendedTag);
                  });
                }

                if (angular.isUndefined(scope.itemId)) {
                  scope.itemId = 'id';
                }

                //if (attrs.sdlConfig) {
                //  scope.$parent[attrs.sdlConfig] = scope.sdlConfig;
                //}

                scope.sdlConfig.synSelection = function () {
                  var i = 0;
                  if (inputDataView) {
                    for (i = 0; i < scope.inputListIndex.length; i++) {
                      scope.inputListIndex[i] = scope.inputList.indexOf(inputDataView.getItem(scope.inputListIndex[i]));
                    }
                    for (i = 0; i < scope.selectedListIndex.length; i++) {
                      scope.selectedListIndex[i] = scope.selectedList.indexOf(selectedDataView.getItem(scope.selectedListIndex[i]));
                    }
                  }
                };
                for (var property in scope.sdlConfig) {
                  if (typeof scope.sdlConfig[property] === 'function') {
                    scope[property] = scope.sdlConfig[property];
                  }
                }
                if (typeof scope.getPrimary !== 'function') {
                  scope.getPrimary = function (item) {
                    var primary = scope.sdlConfig && scope.sdlConfig.sortBy;
                    if (!primary) {
                      return;
                    }
                    var title = '', attrValue = findValItem(item, scope.sdlConfig.sortBy.key);
                    if (angular.isUndefined(attrValue) || (angular.isString(attrValue) && attrValue.trim() === '') || attrValue === '\u0000') {
                      title = $i18next('common.unset');
                    }else if (attrValue === null) {
                      title = $i18next('common.null');
                    }
                    //if (angular.isDefined(attrValue) && attrValue !== null) {
                    //  title += attrValue;
                    //}
                    else {
                      title = title += attrValue;
                    }
                    return title;
                  };
                }
                if (typeof scope.getSecondary !== 'function') {
                  scope.getSecondary = function (item) {
                    var primary = scope.sdlConfig && scope.sdlConfig.sortBy;
                    if (!primary) {
                      return;
                    }
                    var content = '';
                    var tmp = '', attrValue;
                    var i = 0;
                    for (i = 0; i < scope.sdlConfig.sortByList.length; i++) {
                      if (scope.sdlConfig.sortByList[i].key !== scope.sdlConfig.sortBy.key) {
                        attrValue = findValItem(item, scope.sdlConfig.sortByList[i].key);
                        if (angular.isUndefined(attrValue) || (angular.isString(attrValue) && attrValue.trim() === '')) {
                          attrValue = $i18next('common.unset');
                        }
                        if (attrValue === null) {
                          attrValue = $i18next('common.null');
                        }
                        if (angular.isDefined(attrValue) && attrValue !== null) {
                          //Check if attrValue is OBJECT or not////
                          if (typeof (attrValue) === 'object') {
                            var isArray = null;
                            isArray = attrValue;
                            ///if not Array/////
                            if (isArray.length === 0) {
                              if (isArray.name) {
                                tmp = $i18next(scope.sdlConfig.sortByList[i].name) + ': ' + isArray.name;
                              }
                            }
                            ///if is Array/////
                            else {
                              tmp = $i18next(scope.sdlConfig.sortByList[i].name) + ': ';
                              for (var k = 0; k < isArray.length; k++) {
                                if (isArray[k].name) {
                                  if (k !== isArray.length - 1) {
                                    tmp += isArray[k].name + ',';
                                  } else {
                                    tmp += isArray[k].name;
                                  }
                                }
                              }
                            }
                          } else { /// not Object
                            tmp = $i18next(scope.sdlConfig.sortByList[i].name) + ': ' + attrValue;
                          }
                        }
                        content += tmp;
                        if (i < scope.sdlConfig.sortByList.length - 1 && tmp !== '') {
                          content += '; ';
                        }
                        tmp = '';
                      }
                    }
                    content = content.trim();
                    content = content.replace(/;$/, '');
                    return content;
                  };
                }
                if (typeof scope.getItemTooltip !== 'function') {
                  scope.getItemTooltip = function (item) {
                    var primary = scope.sdlConfig && scope.sdlConfig.sortBy;
                    if (!primary || !scope.sdlConfig.showItemTooltip) {
                      return ' ';
                    }
                    var content = '<ul>';
                    var tmp = '', attrValue;
                    var i = 0;
                    for (i = 0; i < scope.sdlConfig.sortByList.length; i++) {
                      if (scope.sdlConfig.sortByList[i].key) {
                        attrValue = findValItem(item, scope.sdlConfig.sortByList[i].key);
                        if (angular.isUndefined(attrValue) || (angular.isString(attrValue) && attrValue.trim() === '')) {
                          attrValue = $i18next('common.unset');
                        }
                        if (attrValue === null) {
                          attrValue = $i18next('common.null');
                        }
                        if (angular.isDefined(attrValue) && attrValue !== null) {
                          //Check if attrValue is OBJECT or not////
                          if (typeof (attrValue) === 'object') {
                            var isArray = null;
                            isArray = attrValue;
                            ///if not Array/////
                            if (isArray.length === 0) {
                              if (isArray.name) {
                                tmp = $i18next(scope.sdlConfig.sortByList[i].name) + ': ' + isArray.name;
                              }
                            }
                            ///if is Array/////
                            else {
                              tmp = $i18next(scope.sdlConfig.sortByList[i].name) + ': ';
                              for (var k = 0; k < isArray.length; k++) {
                                if (isArray[k].name) {
                                  if (k !== isArray.length - 1) {
                                    tmp += isArray[k].name + ',';
                                  } else {
                                    tmp += isArray[k].name;
                                  }
                                }
                              }
                            }
                          } else { /// not Object
                            tmp = $i18next(scope.sdlConfig.sortByList[i].name) + ': ' + attrValue;
                          }
                        }
                        tmp = tmp.replace('<', '&lt;');
                        tmp = tmp.replace('>', '&gt;');
                        content += '<li class="ov-sdbl-break-word">' + tmp + '</li>';
                        tmp = '';
                      }
                    }
                    content += '</ul>';
                    content = content.trim();
                    content = content.replace(/;$/, '');
                    return content;
                  };
                }
              },
              setInputDataView = function (dv) {
                inputDataView = dv;
              },
              setSelectedDataView = function (dv) {
                selectedDataView = dv;
              },
              setDragObject = function (dragging, cell, grid, create, dataView) {
                dragObject.dragging = dragging;
                dragObject.insertBefore = -1;
                dragObject.canvas = grid.getCanvasNode();
                if (create === true && dataView) {
                  dragObject.selectedRows = grid.getSelectedRows();

                  if (!dragObject.selectedRows.length || $.inArray(cell.row, dragObject.selectedRows) === -1) {
                    dragObject.selectedRows = [cell.row];
                    grid.setSelectedRows(dragObject.selectedRows);
                  }
                }

                var h = grid.getOptions().rowHeight;
                if (dragObject.proxy) {
                  dragObject.proxy.remove();
                }
                if (dragObject.guide) {
                  dragObject.guide.remove();
                }
                dragObject.proxy = $('<div class="slick-double-list-proxy"></div>')
                  .text('[' + $i18next(scope.sdlConfig.item, {count: dragObject.selectedRows.length}) +
                  ' ' + $i18next(scope.sdlConfig.selected) + ']').css('height', h)
                  .css('width', $(grid.getCanvasNode()).innerWidth()).appendTo('body').hide();

                dragObject.proxy.css('padding-top', h / 2 - parseFloat(dragObject.proxy.css('font-size')) / 2);

                dragObject.guide = $('<div class="slick-double-list-guide"/>')
                  .css('width', $(dragObject.canvas).innerWidth())
                  .appendTo(dragObject.canvas).hide();
              },
              dragRows = function (e, grid, inside, length) {
                var button = (e.buttons === undefined) ? e.which : e.buttons;
                if ((button !== 1 && button !== 0) || dragObject.dragging === NOT_DRAG) {
                  return;
                }
                var top = e.pageY - $(dragObject.canvas).offset().top;
                var insertBefore = Math.max(0, Math.min(Math.round(top / grid.getOptions().rowHeight), length));
                if (insertBefore !== dragObject.insertBefore) {
                  var canMove = true;
                  if (inside) {
                    for (var i = 0; i < dragObject.selectedRows.length; i++) {
                      if (dragObject.selectedRows[i] === insertBefore ||
                        dragObject.selectedRows[i] === insertBefore - 1) {
                        canMove = false;
                        i = dragObject.selectedRows.length;
                      }
                    }
                  }
                  if (canMove) {
                    dragObject.guide.css('top', insertBefore * grid.getOptions().rowHeight).show();
                    dragObject.insertBefore = insertBefore;
                  } else {
                    dragObject.guide.hide();
                    dragObject.insertBefore = -1;
                  }
                }
                dragObject.proxy.css({top: e.pageY + 10, left: e.pageX + 10}).show();
              },
              setSelectedObject = function (e, grid, isInput) {
                selectedObject.selecting = (isInput === true) ? SELECT_ON_INPUT : SELECT_ON_SELECTED;
                selectedObject.canvas = grid.getCanvasNode();
                selectedObject.beforeSelect = [];
                if (e.ctrlKey || e.shiftKey) {
                  selectedObject.beforeSelect = grid.getSelectedRows();
                }
                var top = e.pageY - $(selectedObject.canvas).offset().top - grid.getOptions().rowHeight / 2;
                var dataView = (isInput === true) ? inputDataView : selectedDataView;
                selectedObject.start = Math.max(0, Math.min(Math.round(top / grid.getOptions().rowHeight), dataView.getLength() - 1));

                selectedObject.top = e.pageY;
                selectedObject.left = e.pageX;
              },
              downOnInput = function (e, grid) {
                var cell = grid.getCellFromEvent(e);
                if (!cell || (inputDataView.getItem(cell.row).disabled === true || inputDataView.getItem(cell.row).sdlDisabled === true)) {
                  return;
                }
                if (cell.cell === 0) {
                  setDragObject(DRAG_ON_INPUT, cell, grid, true, inputDataView);
                  e.preventDefault();
                } else if (cell.cell === 1) {
                  setSelectedObject(e, grid, true);
                }
              },
              downOnSelected = function (e, grid) {
                var cell = grid.getCellFromEvent(e);
                if (!cell || (scope.selectedList[cell.row].disabled === true || scope.selectedList[cell.row].sdlDisabled === true)) {
                  return;
                }
                if (cell.cell === 0) {
                  setDragObject(DRAG_ON_SELECTED, cell, grid, true, selectedDataView);
                  e.preventDefault();
                } else if (cell.cell === 1) {
                  setSelectedObject(e, grid, false);
                }
              },
              moveOnInput = function (e, grid) {
                switch (dragObject.dragging) {
                case DRAG_ON_INPUT:
                  dragRows(e, grid, true, inputDataView.getLength());
                  break;
                case DRAG_ON_SELECTED:
                  dragRows(e, grid, false, inputDataView.getLength());
                  break;
                }
              },
              moveOnSelected = function (e, grid) {
                switch (dragObject.dragging) {
                case DRAG_ON_INPUT:
                  dragRows(e, grid, false, selectedDataView.getLength());
                  break;
                case DRAG_ON_SELECTED:
                  dragRows(e, grid, true, selectedDataView.getLength());
                  break;
                }
              },
              upOnInput = function (e, grid) {
                if (selectedObject.selecting === SELECT_ON_INPUT) {
                  selectedObject.selecting = NOT_SELECT;
                }

                if (dragObject.insertBefore >= 0) {

                  var extractedRows = [], selectedRows, left, right, i, row;
                  var index = scope.inputList.indexOf(inputDataView.getItem(dragObject.insertBefore));
                  if (inputDataView.getLength() === 0) {
                    index = 0;
                  } else {
                    if (index === -1) {
                      index = scope.inputList.indexOf(inputDataView.getItem(inputDataView.getLength() - 1)) + 1;
                    }
                  }
                  switch (dragObject.dragging) {
                  case DRAG_ON_INPUT:
                    left = scope.inputList.slice(0, index);
                    right = scope.inputList.slice(index, scope.inputList.length);

                    dragObject.selectedRows.sort(function (a, b) {
                      return a - b;
                    });
                    var start = (typeof right[0] === 'undefined') ? inputDataView.getLength() : inputDataView.getRowById(right[0].id);
                    if (isNaN(start)) {
                      start = inputDataView.getLength();
                    }
                    if (scope.inputList.length === inputDataView.getLength()) {
                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        extractedRows.push(scope.inputList[dragObject.selectedRows[i]]);
                      }

                      dragObject.selectedRows.reverse();
                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        row = scope.inputList.indexOf(inputDataView.getItem(dragObject.selectedRows[i]));
                        if (row < index) {
                          left.splice(row, 1);
                          start--;
                        } else {
                          right.splice(row - index, 1);
                        }
                      }
                    } else {
                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        extractedRows.push(inputDataView.getItem(dragObject.selectedRows[i]));
                      }

                      dragObject.selectedRows.reverse();

                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        row = scope.inputList.indexOf(inputDataView.getItem(scope.inputListIndex[i]));
                        if (row < index) {
                          left.splice(row, 1);
                          start--;
                        } else {
                          right.splice(row - index, 1);
                        }
                      }
                    }
                    scope.inputList = left.concat(extractedRows.concat(right));
                    selectedRows = [];
                    for (i = 0; i < dragObject.selectedRows.length; i++) {
                      selectedRows.push(start + i);
                    }
                    grid.setSelectedRows(selectedRows);
                    break;
                  case DRAG_ON_SELECTED:
                    left = scope.inputList.slice(0, index);
                    right = scope.inputList.slice(index, scope.inputList.length);

                    dragObject.selectedRows.sort(function (a, b) {
                      return a - b;
                    });
                    var numReduce = 0;
                    for (i = 0; i < dragObject.selectedRows.length; i++) {
                      extractedRows.push(scope.selectedList[dragObject.selectedRows[i] - numReduce]);
                      scope.selectedList.splice(dragObject.selectedRows[i] - numReduce++, 1);
                    }
                    scope.inputList = left.concat(extractedRows.concat(right));
                    var delta = (typeof right[0] === 'undefined') ? inputDataView.getLength() : inputDataView.getRowById(right[0].id);
                    if (isNaN(delta)) {
                      delta = inputDataView.getLength();
                    }
                    selectedRows = [];
                    if (inputDataView.getLength() === (scope.inputList.length - extractedRows.length)) {
                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        selectedRows.push(delta + i);
                      }
                    } else {
                      var numFilter = 0;
                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        if (inputSearch(extractedRows[i], scope)) {
                          selectedRows.push(delta + numFilter++);
                        }
                      }
                    }
                    scope.inputListIndex = selectedRows;
                    scope.inputListIndex.push(-1);
                    $timeout(function () {
                      scope.inputListIndex.pop();
                    });
                    scope.selectedListIndex = [];
                    break;
                  }
                }
                dragObject.dragging = NOT_DRAG;
                if (dragObject.proxy) {
                  dragObject.proxy.remove();
                }
                if (dragObject.guide) {
                  dragObject.guide.remove();
                }

                scope.safeDigest();
              },
              upOnSelected = function (e, grid) {
                if (selectedObject.selecting === SELECT_ON_SELECTED) {
                  selectedObject.selecting = NOT_SELECT;
                }

                if (dragObject.insertBefore >= 0) {
                  var extractedRows = [], selectedRows, left, right, i;
                  switch (dragObject.dragging) {
                  case DRAG_ON_INPUT:
                    left = scope.selectedList.slice(0, dragObject.insertBefore);
                    right = scope.selectedList.slice(dragObject.insertBefore, scope.selectedList.length);

                    dragObject.selectedRows.sort(function (a, b) {
                      return a - b;
                    });
                    var numReduce = 0;
                    if (scope.inputList.length === inputDataView.getLength()) {
                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        extractedRows.push(scope.inputList[dragObject.selectedRows[i] - numReduce]);
                        scope.inputList.splice(scope.inputListIndex[i] - numReduce++, 1);
                      }
                    } else {
                      for (i = 0; i < dragObject.selectedRows.length; i++) {
                        extractedRows.push(inputDataView.getItem(dragObject.selectedRows[i]));
                        scope.inputList.splice(scope.inputList.indexOf(inputDataView.getItem(scope.inputListIndex[i])), 1);
                      }
                    }
                    scope.selectedList = left.concat(extractedRows.concat(right));
                    var delta = dragObject.selectedRows[0] - dragObject.insertBefore;
                    selectedRows = [];
                    for (i = 0; i < dragObject.selectedRows.length; i++) {
                      selectedRows.push(dragObject.selectedRows[0] - delta + i);
                    }
                    scope.selectedListIndex = selectedRows;
                    scope.selectedListIndex.push(-1);
                    $timeout(function () {
                      scope.selectedListIndex.pop();
                    });
                    scope.inputListIndex = [];
                    break;
                  case DRAG_ON_SELECTED:
                    left = scope.selectedList.slice(0, dragObject.insertBefore);
                    right = scope.selectedList.slice(dragObject.insertBefore, scope.selectedList.length);

                    dragObject.selectedRows.sort(function (a, b) {
                      return a - b;
                    });

                    for (i = 0; i < dragObject.selectedRows.length; i++) {
                      extractedRows.push(scope.selectedList[dragObject.selectedRows[i]]);
                    }

                    dragObject.selectedRows.reverse();

                    for (i = 0; i < dragObject.selectedRows.length; i++) {
                      var row = dragObject.selectedRows[i];
                      if (row < dragObject.insertBefore) {
                        left.splice(row, 1);
                      } else {
                        right.splice(row - dragObject.insertBefore, 1);
                      }
                    }
                    selectedRows = [];
                    scope.selectedList = left.concat(extractedRows.concat(right));
                    for (i = 0; i < dragObject.selectedRows.length; i++) {
                      selectedRows.push(left.length + i);
                    }
                    grid.setSelectedRows(selectedRows);
                    break;
                  }
                }
                dragObject.dragging = NOT_DRAG;
                if (dragObject.proxy) {
                  dragObject.proxy.remove();
                }
                if (dragObject.guide) {
                  dragObject.guide.remove();
                }

                scope.safeDigest();
              },
              leaveOnInputSelected = function (e) {
                var button = (e.buttons === undefined) ? e.which : e.buttons;
                if (button === 1) {
                  if (dragObject.proxy) {
                    dragObject.proxy.hide();
                  }
                  if (dragObject.guide) {
                    dragObject.guide.hide();
                  }
//                  if (selectedObject.guide) {
//                    selectedObject.guide.hide();
//                  }
                }
              },
              enterOnInputSelected = function (e, grid) {
                var cell = grid.getCellFromEvent(e);
                var button = (e.buttons === undefined) ? e.which : e.buttons;
                if (button !== 1) {
                  dragObject.dragging = NOT_DRAG;
                  selectedObject.selecting = NOT_SELECT;
                  if (dragObject.proxy) {
                    dragObject.proxy.remove();
                  }
                  if (dragObject.guide) {
                    dragObject.guide.remove();
                  }
//                  if (selectedObject.guide) {
//                    selectedObject.guide.remove();
//                  }
                  return;
                }
                if (dragObject.dragging !== NOT_DRAG) {
                  setDragObject(dragObject.dragging, cell, grid, false);
                }
                if (selectedObject.selecting !== NOT_SELECT) {
//                  if (selectedObject.guide) {
//                    selectedObject.guide.show();
//                  }
                }
              },
              findValItem = function (item, key) {
                if (item[key]) {
                  return item[key];
                } else {
                  var arr = key.split('.');
                  var result = item[arr[0]];
                  for (var i = 1; i < arr.length; i++) {
                    if (!result) {
                      return '';
                    }
                    result = result [arr[i]];
                  }
                  return result;
                }
              },
              inputSearch = function (item, args) {
                var value = findValItem(item, scope.sdlConfig.searchBy);
                if (args.searchText !== '' && !value) {
                  return false;
                }
                if (args.searchText !== '' && value.toString().toLowerCase().indexOf(args.searchText.toString().toLowerCase()) === -1) {
                  return false;
                }
                return true;
              };
            scope.inputListIndex = [];
            scope.selectedListIndex = [];
            scope.updateSearch = function (preventSetSelect) {
              if (inputDataView !== undefined && scope.sdlConfig.searchString !== undefined) {
                inputDataView.setFilterArgs({
                  searchText: scope.sdlConfig.searchString
                });
                inputDataView.refresh();
                if (preventSetSelect !== true) {
                  scope.inputListIndex = [];
                  angular.forEach(scope.inputList, function (i) {
                    i.sdlSelected = false;
                  });
                }
              }
            };
            scope.disableAddItems = function () {
              if (scope.inputListIndex.length < 1) {
                return true;
              }
              if (inputDataView) {
                for (var i = 0; i < scope.inputListIndex.length; i++) {
                  if (inputDataView.getItem(scope.inputListIndex[i])) {
                    return false;
                  }
                }
              }
              return true;
            };
            scope.disableAddAllItems = function () {
              if (scope.inputList.length < 1) {
                return true;
              }
              if (inputDataView) {
                if (scope.inputList.length === inputDataView.getLength()) {
                  for (var i = 0; i < inputDataView.getLength(); i++) {
                    if (scope.inputList[i] && !(scope.inputList[i].disabled === true || scope.inputList[i].sdlDisabled === true)) {
                      return false;
                    }
                  }
                } else {
                  for (var j = 0; j < inputDataView.getLength(); j++) {
                    if (!(inputDataView.getItem(j).disabled === true || inputDataView.getItem(j).sdlDisabled === true)) {
                      return false;
                    }
                  }
                }
              }
              return true;
            };
            scope.disableRemoveAllItems = function () {
              if (scope.selectedList.length < 1) {
                return true;
              }
              for (var i = 0; i < scope.selectedList.length; i++) {
                if (scope.selectedList[i] && !(scope.selectedList[i].disabled === true || scope.selectedList[i].sdlDisabled === true)) {
                  return false;
                }
              }
              return true;
            };
            scope.isDragging = function () {
              return dragObject.dragging > NOT_DRAG;
            };
            scope.addItems = function () {
              scope.inputListIndex.sort(function (a, b) {
                return a - b;
              });
              var newInput = [], i;
              if (scope.inputList.length === inputDataView.getLength()) {
                for (i = 0; i < scope.inputListIndex.length; i++) {
                  if (!(scope.inputList[scope.inputListIndex[i]].disabled === true ||
                    scope.inputList[scope.inputListIndex[i]].sdlDisabled === true)) {
                    scope.selectedList.push(scope.inputList[scope.inputListIndex[i]]);
                    scope.selectedListIndex.push(scope.selectedList.length - 1);
                    scope.inputList[scope.inputListIndex[i]] = null;
                  }
                }
              }
              else {
                for (i = 0; i < scope.inputListIndex.length; i++) {
                  if (inputDataView.getItem(scope.inputListIndex[i]) && !(inputDataView.getItem(scope.inputListIndex[i]).disabled === true ||
                    inputDataView.getItem(scope.inputListIndex[i]).sdlDisabled === true)) {
                    scope.selectedList.push(inputDataView.getItem(scope.inputListIndex[i]));
                    scope.selectedListIndex.push(scope.selectedList.length - 1);
                    scope.inputList[scope.inputList.indexOf(inputDataView.getItem(scope.inputListIndex[i]))] = null;
                  }
                }
              }
              for (i = 0; i < scope.inputList.length; i++) {
                if (scope.inputList[i] !== null) {
                  newInput.push(scope.inputList[i]);
                }
              }
              scope.inputList = newInput;
              scope.inputListIndex = [];
            }
            ;
            scope.selectedI = function (e, item) {
              e.preventDefault();
              e.stopPropagation();
              item.sdlSelected = !item.sdlSelected;
              if (item.sdlSelected) {
                if (inputDataView) {
                  scope.inputListIndex.push(inputDataView.getRowById(item[scope.itemId]));
                }
              } else {
                var x = inputDataView.getRowById(item[scope.itemId]);
                for (var i = 0; i < scope.inputListIndex.length; i++) {
                  if (scope.inputListIndex[i] === x) {
                    scope.inputListIndex.splice(i, 1);
                    i = scope.inputListIndex.length;
                  }
                }
              }
            };
            scope.selectedS = function (e, item) {
              e.preventDefault();
              e.stopPropagation();
              item.sdlSelected = !item.sdlSelected;
              if (item.sdlSelected) {
                scope.selectedListIndex.push(scope.selectedList.indexOf(item));
              } else {
                var x = scope.selectedList.indexOf(item);
                angular.forEach(scope.selectedListIndex, function (s, i) {
                  if (s === x) {
                    scope.selectedListIndex.splice(i, 1);
                  }
                });
              }
            };
            scope.addAllItems = function () {
              var newInput = [];
              if (scope.inputList.length === inputDataView.getLength()) {
                for (var i = 0; i < scope.inputList.length; i++) {
                  if (!(scope.inputList[i].disabled === true ||
                    scope.inputList[i].sdlDisabled === true)) {
                    scope.selectedList.push(scope.inputList[i]);
                  } else {
                    newInput.push(scope.inputList[i]);
                  }
                }
              } else {
                for (var j = 0; j < inputDataView.getLength(); j++) {
                  if (!(inputDataView.getItem(j).disabled === true ||
                    inputDataView.getItem(j).sdlDisabled === true)) {
                    scope.selectedList.push(inputDataView.getItem(j));
                    scope.inputList[scope.inputList.indexOf(inputDataView.getItem(j))] = null;
                  }
                }
                newInput = [];
                for (j = 0; j < scope.inputList.length; j++) {
                  if (scope.inputList[j] !== null) {
                    newInput.push(scope.inputList[j]);
                  }
                }
              }
              scope.inputList = newInput;
              scope.inputListIndex = [];
            };
            function moveItemsTo(index) {
              if (angular.isArray(scope.selectedListIndex) && scope.selectedListIndex.length > 0) {
                var left, right, extractedRows = [], selectedRows = [], i = 0;
                scope.selectedListIndex.sort(function (a, b) {
                  return a - b;
                });
                left = scope.selectedList.slice(0, index);
                right = scope.selectedList.slice(index, scope.selectedList.length);

                for (i = 0; i < scope.selectedListIndex.length; i++) {
                  extractedRows.push(scope.selectedList[scope.selectedListIndex[i]]);
                }

                scope.selectedListIndex.reverse();

                for (i = 0; i < scope.selectedListIndex.length; i++) {
                  var row = scope.selectedListIndex[i];
                  if (row < index) {
                    left.splice(row, 1);
                  } else {
                    right.splice(row - index, 1);
                  }
                }
                scope.selectedList = left.concat(extractedRows.concat(right));
                for (i = 0; i < scope.selectedListIndex.length; i++) {
                  selectedRows.push(left.length + i);
                }
                scope.selectedListIndex = selectedRows;
                if (scope.selectedGrid) {
                  scope.selectedGrid.scrollRowIntoView(index - 1);
                }
              }
            }

            scope.moveItemsUp = function () {
              if (angular.isArray(scope.selectedListIndex) && scope.selectedListIndex.length > 0) {
                scope.selectedListIndex.sort(function (a, b) {
                  return a - b;
                });
                var moveToIndex = scope.selectedListIndex[0] - 1;
                moveToIndex = (moveToIndex < 0 ? scope.selectedList.length : moveToIndex);
                moveItemsTo(moveToIndex);
              }
            };
            scope.moveItemsDown = function () {
              if (angular.isArray(scope.selectedListIndex) && scope.selectedListIndex.length > 0) {
                scope.selectedListIndex.sort(function (a, b) {
                  return a - b;
                });
                var moveToIndex = scope.selectedListIndex[scope.selectedListIndex.length - 1] + 2;
                moveToIndex = (moveToIndex > scope.selectedList.length ? 0 : moveToIndex);
                moveItemsTo(moveToIndex);
              }
            };
            scope.removeItems = function () {
              scope.selectedListIndex.sort(function (a, b) {
                return a - b;
              });
              for (var i = 0; i < scope.selectedListIndex.length; i++) {
                if (!(scope.selectedList[scope.selectedListIndex[i]].disabled === true ||
                  scope.selectedList[scope.selectedListIndex[i]].sdlDisabled === true)) {
                  scope.inputList.push(scope.selectedList[scope.selectedListIndex[i]]);
                  scope.inputListIndex.push(inputDataView.getLength() + i);
                  scope.selectedList[scope.selectedListIndex[i]] = null;
                }
              }
              var newSelected = [];
              for (i = 0; i < scope.selectedList.length; i++) {
                if (scope.selectedList[i] !== null) {
                  newSelected.push(scope.selectedList[i]);
                }
              }
              scope.selectedList = newSelected;
              scope.selectedListIndex = [];
            };
            scope.removeAllItems = function () {
              var newSelected = [];
              for (var i = 0; i < scope.selectedList.length; i++) {
                if (!(scope.selectedList[i].disabled === true || scope.selectedList[i].sdlDisabled === true)) {
                  scope.inputList.push(scope.selectedList[i]);
                } else {
                  newSelected.push(scope.selectedList[i]);
                }
              }
              scope.selectedList = newSelected;
              scope.selectedListIndex = [];
            };
            scope.addItem = function (item, e, preventDouble) {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.type === 'dblclick' && e.target.className) {
                  if (e.target.className.indexOf('checkbox-check') > -1 ||
                    e.target.className.indexOf('checkbox-un-check') > -1 ||
                    e.target.className.indexOf('checkbox-control') > -1) {
                    return;
                  }
                }
              }
              if (typeof preventDouble === 'undefined' || preventDouble !== true) {
                if (!(item.disabled === true || item.sdlDisabled === true)) {
                  scope.selectedList.push(item);
                  scope.selectedListIndex.push(scope.selectedList.length - 1);
                  scope.inputList.splice(scope.inputList.indexOf(item), 1);
                  scope.inputListIndex = [];
                }
              }
            };
            scope.removeItem = function (item, e, preventDouble) {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.type === 'dblclick' && e.target.className) {
                  if (e.target.className.indexOf('checkbox-check') > -1 ||
                    e.target.className.indexOf('checkbox-un-check') > -1 ||
                    e.target.className.indexOf('checkbox-control') > -1) {
                    return;
                  }
                }
              }
              if (typeof preventDouble === 'undefined' || preventDouble !== true) {
                if (!(item.disabled === true || item.sdlDisabled === true)) {
                  scope.inputList.push(item);
                  scope.inputListIndex.push(inputDataView.getLength());
                  scope.selectedList.splice(scope.selectedList.indexOf(item), 1);
                  scope.selectedListIndex = [];
                }
              }
            };
            scope.inputConfig = {
              onDoubleClick: scope.addItem,
              dragDrop: true,
              onMouseDown: downOnInput,
              onMouseMove: moveOnInput,
              onMouseUp: upOnInput,
              onMouseEnter: enterOnInputSelected,
              onMouseLeave: leaveOnInputSelected,
              search: true,
              setDataView: setInputDataView,
              setSearch: inputSearch,
              updateSearch: scope.updateSearch
            };
            scope.selectedConfig = {
              onDoubleClick: scope.removeItem,
              dragDrop: true,
              onMouseDown: downOnSelected,
              onMouseMove: moveOnSelected,
              onMouseUp: upOnSelected,
              onMouseEnter: enterOnInputSelected,
              onMouseLeave: leaveOnInputSelected,
              setDataView: setSelectedDataView
            };

            scope.$watch('sdlConfig.itemTemplateUrl', function (newVal) {
              initSlickDoubleList();
              var pathPattern = /([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.html/,
                htmlPattern = /(<([^>]+)>)/;
              if (htmlPattern.test(newVal)) {
                scope.inputItemTemplate = firstInputTemplate + newVal + inputTemplate + lastTemplate;
                scope.selectedItemTemplate = firstSelectedTemplate + newVal + selectedTemplate + lastTemplate;
              }
              else if (pathPattern.test(newVal)) {
                $http({method: 'GET', url: scope.sdlConfig.itemTemplateUrl, cache: $templateCache})
                  .success(function (result) {
                    scope.inputItemTemplate = firstInputTemplate + result + inputTemplate + lastTemplate;
                    scope.selectedItemTemplate = firstSelectedTemplate + result + selectedTemplate + lastTemplate;
                  });
              }
            });

            scope.sort = function () {
              if (typeof scope.sdlConfig.sortBy === 'undefined' || !scope.sdlConfig.sortBy ||
                (scope.sdlConfig.sortBy && scope.sdlConfig.sortBy.key.length === 0)) {
                return;
              }
              if (scope.sdlConfig.sortAsc === false) {
                scope.inputList.sort(function (a, b) {
                  return (typeof scope.sdlConfig.sortBy.func === 'function') ? scope.sdlConfig.sortBy.func(b, a) :
                    $ovUtility.naturalSort(findValItem(b, scope.sdlConfig.sortBy.key), findValItem(a, scope.sdlConfig.sortBy.key));
                });
                scope.selectedList.sort(function (a, b) {
                  return (typeof scope.sdlConfig.sortBy.func === 'function') ? scope.sdlConfig.sortBy.func(b, a) :
                    $ovUtility.naturalSort(findValItem(b, scope.sdlConfig.sortBy.key), findValItem(a, scope.sdlConfig.sortBy.key));
                });
              } else {
                scope.inputList.sort(function (a, b) {
                  return (typeof scope.sdlConfig.sortBy.func === 'function') ? scope.sdlConfig.sortBy.func(a, b) :
                    $ovUtility.naturalSort(findValItem(a, scope.sdlConfig.sortBy.key), findValItem(b, scope.sdlConfig.sortBy.key));
                });
                scope.selectedList.sort(function (a, b) {
                  return (typeof scope.sdlConfig.sortBy.func === 'function') ? scope.sdlConfig.sortBy.func(a, b) :
                    $ovUtility.naturalSort(findValItem(a, scope.sdlConfig.sortBy.key), findValItem(b, scope.sdlConfig.sortBy.key));
                });
              }
              scope.sdlConfig.synSelection();
              scope.inputList = angular.copy(scope.inputList);
              scope.selectedList = angular.copy(scope.selectedList);
            };

            scope.sortHandle = function () {
              if (scope.sdlConfig.sortBy) {
                scope.sdlConfig.searchBy = scope.sdlConfig.sortBy.key;
                scope.sort();
                if (typeof scope.sdlConfig.sortCallBack === 'function') {
                  scope.sdlConfig.sortCallBack();
                }
              }
            };
            scope.sdlConfig.doSort = scope.sortHandle;

            scope.$watch('sdlConfig.sortBy', scope.sortHandle);

            scope.$on('$destroy', function () {
              inputDataView = null;
              selectedDataView = null;

              //prevent memory leak
              scope.sdlConfig.doSort = null;
              scope.sdlConfig.resize = null;
              scope.sdlConfig.synSelection = null;
              if (!backupConfig.tagList) {
                delete scope.sdlConfig.tagList;
              }
              if (!backupConfig.getPrimary) {
                scope.sdlConfig.getPrimary = null;
              }
              if (!backupConfig.getSecondary) {
                scope.sdlConfig.getSecondary = null;
              }

              scope.sdlConfig = null;
              //scope.$parent[attrs.sdlConfig] = null;
            });
          }
        };
      }]);
})();
