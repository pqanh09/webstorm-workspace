/**
 \$Id:
 (c) Copyright ALE USA Inc., ${YEAR}
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

/**
 * @ngdoc directive
 * @name ov-component.directive:slickGrid
 * @restrict A
 * @description
 * The component help to show data as tabular mode
 * @param {string} gridViewId component id
 * @param {array} gridColumns array column
 * @example
 * <pre>
 *   //HTML
 *   <div slick-grid
 *            grid-view-id="vm.gridViewId"
 *            grid-columns="vm.gridColumns">
 *   </div>
 * </pre>
 *
 * <pre>
 *   //In JS
 *   vm.gridViewId='component-id';
 *
 *
 *   vm.data = [
 *      {
 *        key1: 'value1',
 *        key2: 'value2'
 *      }
 *   ];
 *
 *   var attrs = {
 *      column1: {
 *        key: 'key1',
 *        i18nKey: 'i18nKey1'
 *      },
 *      column2: {
 *        key: 'key2',
 *        i18nKey: 'i18nKey2'
 *      }
 *   };
 *   vm.gridColumns = ovDataViewService.getColumnList(attrs);
 *
 *   $scope.$on('onGridInit', function (event, gridElm, grid, dataView) {
 *      if (gridElm[0].id === vm.gridViewId) {
 *          vm.grid = grid;
 *          vm.dataView = dataView;
 *
 *          vm.dataView.setItems(vm.data, 'instanceid');
 *      }
 *   });
 * </pre>
 */


'use strict';
/**
 * Dependency
 *  modules:
 *    ngnms.ui.fwk.utility
 *    ngnms.ui.fwk.ovDataView.directive
 *    jm.i18next
 *  service: $ovUtility, AllOvDataViewIds, $i18next
 *  files: ovUtility.js, ovDataViewConstants.js, ng-i18next.js
 */

angular.module('ngnms.ui.fwk.ovSlickGrid', []).directive('slickGrid', ['$window', '$ovUtility', 'AllOvDataViewIds', '$i18next', '$compile', '$http', '$templateCache', '$log',
  function ($window, $ovUtility, AllOvDataViewIds, $i18next, $compile, $http, $templateCache, $log) {
    return {
      name: 'myCustomName',
      restrict: 'EA',
      scope: {
        gridOptions: '=',
        gridColumns: '=',
        selectionModel: '=',
        groupingFn: '=',
        config: '=',
        gridViewId: '=',
        sorter: '=',
        pagerData: '=?',
        pagerConstructor: '=',
        pagerPosition: '=',
        heightOptions: '=?',
        functionList: '=?'
      },
      link: function (scope, element, attrs) {
        var checkboxSelector, groupItemMetadataProvider, defaultColWidth = 100;
        var KEY_SELECTION_MODEL_CELL = 'cell',
          KEY_SELECTION_MODEL_ROW = 'row',
          KEY_SELECTION_MODEL_CHECK_BOX = 'checkbox',
          CHECK_BOX_CSS = 'slick-cell-checkboxsel';

        var $viewPort, $canvas, scrollbarDimensions, $headerScroller, $headerScrollerL, $headerScrollerR, $paneHeader,
          $viewportTopL, $viewportTopR, $viewportBottomL, $viewportBottomR, $headerScrollContainer, $viewportScrollContainerX, $viewportScrollContainerY;

        var scopeColArr = {}, customTpl = {},
          onDestroy = function (obj) {
            if (obj.targetScope.content) {
              obj.targetScope.content.unbind();
              obj.targetScope.content.empty().remove();
              obj.targetScope.content = undefined;
            }
          },
          renderTemplate = function (cellNode, row, dataContext, colDef) {
            if (customTpl[colDef.id] !== undefined && scopeColArr) {
              scopeColArr[colDef.id] = scopeColArr[colDef.id] || [];

              if (scopeColArr[colDef.id][row]) {
                scopeColArr[colDef.id][row].$destroy();
              }
              scopeColArr[colDef.id][row] = scope.$new();
              scopeColArr[colDef.id][row].item = dataContext;
              scopeColArr[colDef.id][row].colDef = colDef;
              cellNode.html(customTpl[colDef.id]);

              scopeColArr[colDef.id][row].content = $compile(cellNode)(scopeColArr[colDef.id][row]);
              scopeColArr[colDef.id][row].$digest();
              scopeColArr[colDef.id][row].$on('$destroy', onDestroy);
            }
          },
          onRemoveItem = function (row) {
            angular.forEach(scopeColArr, function (scopeCol) {
              if (scopeCol[row]) {
                scopeCol[row].$destroy();
                scopeCol[row] = undefined;
              }
            });
          },
          getTemplateContent = function () {
            angular.forEach(scope.gridColumns, function (item) {
              if (item.itemTemplate) {
                $log.debug('You are using custom template of slickGridDirective');
                scope.gridOptions.enableAsyncPostRender = true;
                scope.gridOptions.asyncPostRenderDelay = 0;
                scope.gridOptions.onRemoveItem = onRemoveItem;
                item.asyncPostRender = renderTemplate;
                item.formatter = item.formatter || function (/*row, cell, value, columnDef, dataContext*/) {
                  return '';
                };

                var pathPattern = /([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.html/,
                  htmlPattern = /(<([^>]+)>)/;
                if (htmlPattern.test(item.itemTemplate)) {
                  customTpl[item.id] = item.itemTemplate;
                }
                else if (pathPattern.test(item.itemTemplate)) {
                  $http({method: 'GET', url: item.itemTemplate, cache: $templateCache})
                    .success(function (result) {
                      customTpl[item.id] = result;
                    });
                }
              }
            });
          };

        var defaultGridOptions = {
            frozenColumn: -1,
            frozenRow: -1,
            editable: false,
            asyncEditorLoadDelay: 100,
            asyncEditorLoading: false,
            explicitInitialization: true,
            enableCellNavigation: true,
            enableColumnReorder: true,
            multiColumnSort: true,
            autoEdit: false,
            syncColumnCellResize: true,
            multiSelect: true,
            forceFitColumns: true,
            rowHeight: 38,
            defaultColumnWidth: 200
          },
          defaultPagerData = {
            show: $i18next('ovDataView.slickGrid.show'),
            showingAll: $i18next('ovDataView.slickGrid.showingAll'),
            row: 'ovDataView.slickGrid.row',
            showingPage: $i18next('ovDataView.slickGrid.showingPage'),
            of: $i18next('ovDataView.slickGrid.of'),
            all: $i18next('ovDataView.slickGrid.all'),
            auto: $i18next('ovDataView.slickGrid.auto')
          },
          isValidColumn = function (col) {
            return !col.hidden && col.type !== AllOvDataViewIds.environmentVal.CHECK_BOX_KEY;
          },
          assignColumns = function (lstColumns) { //prevent checkbox will be reorder
            var newColumns = [];
            angular.forEach(lstColumns, function (col) {
              if (isValidColumn(col)) {
                newColumns.push(col);
              }
            });
            //append new checkbox columns
            if (scope.selectionModel === KEY_SELECTION_MODEL_CHECK_BOX) {
              newColumns.unshift(checkboxSelector.getColumnDefinition());
            }
            setColumns(newColumns);
            setAutoFitColumns();
            //prevent lost selected cells when add new columns
            refreshSelectedItem();

            return newColumns;
          },
          refreshSelectedItem = function () { //Tip to make slickGrid call setSelectedRow again
            var pageInfo = {
              oldVal: scope.dataGridView.getPagingInfo().pageSize !== 0 ? scope.dataGridView.getPagingInfo() : {pageSize: 0},
              //require new pageSize !== oldPageSize in case of data.length === 0 still right because no selected rows
              newVal: {pageSize: -1}
            };
            scope.dataGridView.setPagingOptions(pageInfo.newVal);
            scope.dataGridView.setPagingOptions(pageInfo.oldVal);
          },
          setHeightGridLeastColumns = function (heightOptions, lengthData) {
            if (!heightOptions) {
              return;
            }

            var heightOptionsTmp = angular.copy(heightOptions),
              defaultHeightOptions = {
                heightRow: scope.gridOptions.rowHeight,
                maxRow: 10,
                minRow: 0,
                heightHeader: getHeaderHeight(),
                heightScrollBar: scrollbarDimensions.height,
                ovResize: 210 //Distance from bottom of window
              };

            $ovUtility.extendConfig(heightOptionsTmp, defaultHeightOptions);

            if (scope.gridOptions.autoFitRows) {
              var height = w.height() - element.offset().top - heightOptionsTmp.ovResize;
              height = height > scope.gridOptions.rowHeight * heightOptionsTmp.minRow ? height : scope.gridOptions.rowHeight * heightOptionsTmp.minRow;
              heightOptionsTmp.maxRow = Math.round(height / scope.gridOptions.rowHeight);
            }

            var gridViewHeight = 0,
              minDataHeight = scope.gridOptions.rowHeight * heightOptionsTmp.minRow,
              maxDataHeight = scope.gridOptions.rowHeight * heightOptionsTmp.maxRow,
              currentDataHeight = scope.gridOptions.rowHeight * lengthData;

            if (currentDataHeight < minDataHeight) {
              gridViewHeight = minDataHeight;
            } else if (currentDataHeight >= maxDataHeight) {
              gridViewHeight = maxDataHeight;
            } else {
              gridViewHeight = currentDataHeight;
            }

            gridViewHeight += heightOptionsTmp.heightScrollBar;
            gridViewHeight += heightOptionsTmp.heightHeader;
            //Fix lost horizontal bar when empty data
            gridViewHeight += 1;

            setHeight(gridViewHeight);
          },
          canFitColumns = function () {
            var currLengthCols = 0;

            angular.forEach(scope.grid.getColumns(), function (colItem) {
              currLengthCols += colItem.width;
            });

            return $viewPort.width() > currLengthCols + getVerticalScrollBarWidth();
          },
          setColumns = function(newColumns){
            if(scope.grid){
              scope.grid.setColumns(newColumns);
              //Fix header wrong align when columns reorder
              $headerScrollContainer[0].scrollLeft = getScrollLeftPosition();
            }
          },
          setAutoFitColumns = function () {
            if (!scope.gridOptions.autoFitColumns) {
              return;
            }

            resizeCanvas();

            var newValue = canFitColumns(),
              oldValue = scope.grid.getOptions().forceFitColumns;

            if(newValue !== oldValue){
              scope.grid.setOptions({'forceFitColumns': newValue});
              //PR-208117: [3989] Cannot view fully detail of trap information
              if (newValue) {
                scope.grid.setOptions({'forceFitColumns': false});
              }
            }
          },
          haveVerticalScrollBar = function () {
            var result = false;

            if ($viewPort[0].scrollHeight > $viewPort.height()) {
              result = true;
            }
            return result;
          },
          haveHorizontalScrollBar = function () {
            //Require slickGrid resize before checking haveHorizontalScrollBar
            resizeCanvas();

            var result = false;
            if ($viewPort[0].scrollWidth > $viewPort.width()) {
              result = true;
            }
            return result;
          },
          getHorizontalScrollBarHeight = function(){
            return haveHorizontalScrollBar() ? scrollbarDimensions.height : 0;
          },
          getVerticalScrollBarWidth = function(){
            return haveVerticalScrollBar() ? scrollbarDimensions.width : 0;
          },
          getHeight = function () {
            return element.height();
          },
          setHeight = function (height) {
            element.height(height);
          },
          getWidth = function () {
            return element.width();
          },
          setWidth = function (width) {
            element.width(width);
          },
          measureScrollBar = function () { //Slick.grid line 532
            var $c = $('<div style="position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;"></div>').appendTo('body');
            var dim = {
              width: $c.width() - $c[0].clientWidth,
              height: $c.height() - $c[0].clientHeight
            };
            $c.remove();
            return dim;
          },
          getVBoxDelta = function ($el) { //Slick.grid.js line 1240
            var p = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
            var delta = 0;
            $.each(p, function (n, val) {
              delta += parseFloat($el.css(val)) || 0;
            });
            return delta;
          },
          getHeaderHeight = function () {
            return $paneHeader.height() + getVBoxDelta($headerScroller); //Slick.grid.js line 2146
          },
          resizeCanvas = function () {
            if (scope.grid) {
              scope.grid.resizeCanvas();
            }
          },
          setScroller = function(){ //slick.grid.js #1328
            if (scope.gridOptions.frozenColumn > -1) {
              $headerScrollContainer = $headerScrollerR;

              if (scope.gridOptions.frozenRow > -1) {
                if (scope.gridOptions.frozenBottom) {
                  $viewportScrollContainerX = $viewportBottomR;
                  $viewportScrollContainerY = $viewportTopR;
                } else {
                  $viewportScrollContainerX = $viewportScrollContainerY = $viewportBottomR;
                }
              } else {
                $viewportScrollContainerX = $viewportScrollContainerY = $viewportTopR;
              }
            } else {
              $headerScrollContainer = $headerScrollerL;

              if (scope.gridOptions.frozenRow > -1) {
                if (scope.gridOptions.frozenBottom) {
                  $viewportScrollContainerX = $viewportBottomL;
                  $viewportScrollContainerY = $viewportTopL;
                } else {
                  $viewportScrollContainerX = $viewportScrollContainerY = $viewportBottomL;
                }
              } else {
                $viewportScrollContainerX = $viewportScrollContainerY = $viewportTopL;
              }
            }
          },
          getScrollLeftPosition = function(){ //slick.grid.js _handleScroll #2711
            var scrollLeft = $viewportScrollContainerX[0].scrollLeft;
            var maxScrollDistanceX = $viewportScrollContainerY[0].scrollWidth - $viewportScrollContainerY[0].clientWidth;

            if (scrollLeft > maxScrollDistanceX) {
              scrollLeft = maxScrollDistanceX;
            }

            return scrollLeft;
          },
          initGetElements = function () {
            scrollbarDimensions = measureScrollBar();
            $viewPort = element.find('.slick-viewport');
            $canvas = element.find('.grid-canvas');
            $headerScrollerL = element.find('.slick-header-left');
            $headerScrollerR = element.find('.slick-header-right');
            $headerScroller = $().add($headerScrollerL).add($headerScrollerR);
            $paneHeader = element.find('.slick-pane-header');
            $viewportBottomL = element.find('.slick-viewport.slick-viewport-bottom.slick-viewport-left');
            $viewportBottomR = element.find('.slick-viewport.slick-viewport-bottom.slick-viewport-right');
            $viewportTopL = element.find('.slick-viewport.slick-viewport-top.slick-viewport-left');
            $viewportTopR = element.find('.slick-viewport.slick-viewport-top.slick-viewport-right');
            setScroller();
          },
          initSlickGrid = function () {
            $ovUtility.extendConfig(scope.gridOptions, defaultGridOptions);

            angular.forEach(scope.gridColumns, function (colDef) {
              if (!colDef.width) {
                colDef.width = defaultColWidth;
              }
            });

            scope.pagerData = scope.pagerData || {};
            $ovUtility.extendConfig(scope.pagerData, defaultPagerData);

            groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            scope.dataGridView = new Slick.Data.DataView({
              groupItemMetadataProvider: groupItemMetadataProvider
            });

            //If you are using custom template, you will need functionList
            if (angular.isDefined(scope.functionList) && scope.functionList !== null) {
              angular.forEach(scope.functionList, function (fn, key) {
                scope[key] = fn;
              });
            }

            //getTemplateContent will change gridOptions then pass to slickGrid
            getTemplateContent();

            //Pass the dataView as data provider to the slick
            scope.grid = new Slick.Grid(element, scope.dataGridView, scope.gridColumns, scope.gridOptions);

            switch (scope.selectionModel) {
            case KEY_SELECTION_MODEL_ROW:
              //OvDataViewRowSelectionModel new plugin support keep selection when paging
              scope.grid.setSelectionModel(new Slick.OvDataViewRowSelectionModel());
              break;
            case KEY_SELECTION_MODEL_CELL:
              scope.grid.setSelectionModel(new Slick.CellSelectionModel());
              break;
            case KEY_SELECTION_MODEL_CHECK_BOX:
              //OvDataViewCheckbox new plugin support keep selection when paging and customize css of checkbox
              checkboxSelector = new Slick.OvDataViewCheckbox({
                cssClass: CHECK_BOX_CSS,
                primaryKey: scope.gridViewId,
                columnId: attrs.gridViewCheckBoxId
              });

              //OvDataViewRowSelectionModel new plugin support keep selection when paging
              scope.grid.setSelectionModel(new Slick.OvDataViewRowSelectionModel({selectActiveRow: true}));
              scope.grid.registerPlugin(checkboxSelector);
              break;
            }

            //Initialize the grid
            scope.grid.init();
            //initGetElements must be called after scope.grid.init()
            initGetElements();
          };

        initSlickGrid();

        scope.grid.onSelectedRowsChanged.subscribe(function (/*e, args*/) {
          //Fix show detail
          if (scope.grid) {
            scope.grid.resetActiveCell();
          }
        });

        /*Multi-column sorting */
        function slickGridSortFn(e, args){
          //The array of columns to be sorted
          var cols = [];
          if (scope.gridOptions.multiColumnSort) {
            cols = args.sortCols;
          } else {
            cols[0] = args.sortCol;
          }
          var comparer = function (a, b) {
            for (var i = 0, l = cols.length; i < l; i++) {
              var field;
              var colDef;
              if (scope.gridOptions.multiColumnSort) {
                field = cols[i].sortCol.field;
                colDef = cols[i].sortCol;
              } else {
                field = cols[i].field;
                colDef = cols[i];
              }
              var sign = cols[i].sortAsc ? 1 : -1;
              var value1 = a[field], value2 = b[field];

              colDef = colDef || {}; // Make sure colDef will always not be undefined or NULL or empty
              var result = scope.sorter(field, value1, value2, sign, colDef, a, b);
              if (result !== 0) {
                return result;
              }
            }
            return 0;
          };

          // Delegate the sorting to DataView.
          // This will fire the change events and update the grid.
          scope.dataGridView.sort(comparer, args.sortAsc);
        }

        scope.grid.onSort.subscribe(slickGridSortFn);

        function onColumnsChanged(e, args) {
          var columnsReordered = assignColumns(args.grid.getColumns());
          scope.gridColumns.length = 0;
          angular.forEach(columnsReordered, function (col) {
            if (isValidColumn(col)) {
              scope.gridColumns.push(col);
            }
          });
        }

        scope.grid.onColumnsReordered.subscribe(onColumnsChanged);

        scope.grid.onColumnsResized.subscribe(function (e, args) {
          //Emit resize columns
          scope.$emit('onColumnsResized', element, args.grid);
          onColumnsChanged(e, args);
        });

        //Ctrl-A to select all rows
        scope.grid.onKeyDown.subscribe(function (e) {
          // select all rows on ctrl-a
          if (e.which !== 65 || !e.ctrlKey || (scope.gridOptions.multiSelect !== null && !scope.gridOptions.multiSelect)) {
            return;
          }

          var rows = [];
          var selectedRowIds = [];

          for (var i = 0; i < scope.dataGridView.getLength(); i++) {
            rows.push(i);
            selectedRowIds.push(scope.dataGridView.getItem(i)[scope.gridViewId]);
          }

          scope.grid.setSelectedRows(rows);
          e.preventDefault();
        });

        /*Create paging element*/
        var pagerElm = angular.element('<div style="width: 100%;"></div>');

        var pager = new scope.pagerConstructor(scope.dataGridView, scope.grid, $(pagerElm), scope.pagerData);
        if (scope.pagerPosition === 'top') {
          element.before(pagerElm);
        } else {
          element.after(pagerElm);
        }

        // Make the grid respond to DataView change events.
        scope.dataGridView.onRowCountChanged.subscribe(function (e, args) {
          //calculator height of slickGrid again when paging
          scope.pagerData.rows = $i18next(scope.pagerData.row, {count: args.current});
          onResize();
        });

        scope.dataGridView.onRowsChanged.subscribe(function (e, args) {
          if (scope.grid) {
            scope.grid.invalidateRows(args.rows);
            scope.grid.render();
          }
        });

        //use $watch true because when use assign or sort gridColumns then call setColumns again
        scope.$watchCollection('gridColumns', function (newVal/*, oldVal*/) {
          if (newVal) {
            assignColumns(newVal);
          }
        });

        scope.$watchCollection('pagerData', function (newData) {
          if (newData) {
            pager.changeLocale(newData);
          }
        });

        //context menu
        if (scope.gridOptions.enableContextMenuEvent === true) {
          scope.grid.onContextMenu.subscribe(function (e) {
            e.preventDefault();
            var location = {};
            location.left = e.clientX;
            location.top = e.clientY;

            var cell = scope.grid.getCellFromEvent(e);
            var data = {};
            data.id = scope.gridOptions.id;
            data.location = location;
            data.e = e;
            data.selectedRow = scope.dataGridView.getItem(cell.row);
            data.cell = cell;
            scope.$emit('ovGrid.CtxMenu', data);
          });
        }
        //set size
        scope.$watch('config', function (newVal/*, oldVal*/) {
          if (newVal) {
            if (!newVal.fullContainer) {
              element.width(newVal.width);
            }
            element.height(newVal.height);
            onResize();
          }
        }, true);

        //groupItemMetadataProvider must be initialized before to register with dataView.
        if (scope.groupingFn) {
          scope.grid.registerPlugin(groupItemMetadataProvider);
          scope.groupingFn(scope.dataGridView);
        }

        var w = angular.element($window),
          RESIZE_EVENT = 'resize.ovSlickGrid',
          onResize = _.debounce(function (/*event*/) {
            if (scope.grid) {
              setAutoFitColumns();
              setHeightGridLeastColumns(scope.heightOptions, scope.dataGridView.getLength());
              //Require resize after wrapper div change width/height
              resizeCanvas();
              //Fix lost cell when zooming 90%
              scope.grid.invalidate();
            }
          }, 100);
        w.bind(RESIZE_EVENT, onResize);

        scope.$on('content.resize', function () {
          onResize();
        });

        scope.$on('$destroy', function () {
          w.unbind(RESIZE_EVENT, onResize);
          scope.grid.destroy();
          scope.grid = null;
          scope.dataGridView = null;
          scope.gridOptions.api = null;
          scope.gridOptions = null;
          pagerElm.remove();
          pagerElm = pager = null;
          checkboxSelector = null;
          $viewPort = $canvas = $paneHeader = null;
          $headerScrollerL = $headerScrollerR = $headerScroller = null;
          $viewportBottomL = $viewportBottomR = $viewportTopL = $viewportTopR = null;
          $headerScrollContainer = $viewportScrollContainerX = $viewportScrollContainerY = null;
          //Fix custom template memory leak
          scopeColArr = customTpl = null;
        });

        scope.gridOptions.api = {};
        scope.gridOptions.api.resizeGrid = onResize;
        scope.gridOptions.api.setHeight = setHeight;
        scope.gridOptions.api.getHeight = getHeight;
        scope.gridOptions.api.getWidth = getWidth;
        scope.gridOptions.api.setWidth = setWidth;
        scope.gridOptions.api.setColumns = setColumns;
        scope.gridOptions.api.getHorizontalScrollBarHeight = getHorizontalScrollBarHeight;
        scope.gridOptions.api.getVerticalScrollBarWidth = getVerticalScrollBarWidth;
        scope.gridOptions.api.setHeightGridLeastColumns = setHeightGridLeastColumns;
        scope.gridOptions.api.haveHorizontalScrollBar = haveHorizontalScrollBar;
        scope.gridOptions.api.haveVerticalScrollBar = haveVerticalScrollBar;
        scope.gridOptions.api.getScrollLeftPosition = getScrollLeftPosition;
        scope.gridOptions.api.refreshSelectedItem = refreshSelectedItem;
        scope.gridOptions.api.setAutoFitColumns = setAutoFitColumns;
        scope.gridOptions.api.measureScrollBar = measureScrollBar;
        scope.gridOptions.api.getHeaderHeight = getHeaderHeight;
        scope.gridOptions.api.canFitColumns = canFitColumns;
        //Support if don't want to use this default sort by slickGrid (Ex: ovDataView)
        scope.gridOptions.api.unsubscribeSort = function(){
          scope.grid.onSort.unsubscribe(slickGridSortFn);
        };

        //Need emit after gridOptions.api initialized to using these functions
        scope.$emit('onGridInit', element, scope.grid, scope.dataGridView);
      }
    };
  }]);