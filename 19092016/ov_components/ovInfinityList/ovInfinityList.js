/**
 * RTR-3556: UI Framework
 * Created by huynhhuutai on 2/25/14.
 */

(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovInfinityList.directive', [])
    .directive('ovInfinityList', ['$compile', '$http', '$templateCache', '$parse', '$window', '$i18next', '$timeout',
      function ($compile, $http, $templateCache, $parse, $window, $i18next, $timeout) {
        return {
          restrict: 'EA',
          replace: true,
          scope: true,
          link: function (scope, element, attrs) {
            var scopeArr = [], template, getterListData, getterRowHeight, getterListConfig, getterSelectedIndex, dataView, itemId,
              isIOS = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/g),
              onDestroy = function (obj) {
                if (obj.targetScope.content) {
                  obj.targetScope.content.unbind();
                  obj.targetScope.content.empty().remove();
                  obj.targetScope.content = undefined;
                }
              },
              renderTemplate = function (cellNode, row, dataContext) {
                if (template !== undefined && scopeArr) {
                  if (scopeArr[row]) {
                    scopeArr[row].$destroy();
                  }
                  scopeArr[row] = scope.$new();
                  scopeArr[row].item = dataContext;
                  cellNode.html(template);

                  scopeArr[row].content = $compile(cellNode)(scopeArr[row]);
                  scopeArr[row].$digest();
                  scopeArr[row].$on('$destroy', onDestroy);
                }
              },
              getItemMetadata = function (row) {
                return (dataView.getItem(row).disabled === true || dataView.getItem(row).sdlDisabled === true) ? {
                  focusable: false,
                  selectable: false,
                  columns: {
                    dragCell: {
                      formatter: function () {
                        return '<div class="handle">&nbsp;</div><div class="blocking-item"></div>';
                      }
                    }
                  }
                } : {
                  columns: {
                    dragCell: {
                      focusable: false,
                      selectable: false,
                      formatter: function () {
                        return '<div class="handle"></div>';
                      }
                    }
                  }
                };
              },
              onRemoveItem = function (row) {
                if (scopeArr[row]) {
                  scopeArr[row].$destroy();
                  scopeArr[row] = undefined;
                }
              },
              createGrid = function (link) {
                dataView = new Slick.Data.DataView({});
                getterListData = $parse(attrs.listData)(scope);
                template = link;
                if (scope.grid) {
                  scope.grid.destroy();
                  scope.grid = null;
                  delete scope.grid;
                }
                if (getterListData === undefined) {
                  scope.grid = new Slick.Grid(element, dataView, settings, listConfig);
                } else {
                  itemId = $parse(attrs.itemId)(scope);
                  for (var i = 0; i < getterListData.length; i++) {
                    getterListData[i][itemId] = 'id_' + i;
                    getterListData[i].sdlSelected = false;
                  }
                  scope.grid = new Slick.Grid(element, dataView, settings, listConfig);
                }
                if (attrs.grid) {
                  $parse(attrs.grid).assign(scope.$parent, scope.grid);
                }
                if (typeof listConfig.setDataView === 'function') {
                  listConfig.setDataView(dataView);
                }
                scope.grid.setSelectionModel(new Slick.RowSelectionModel());
                $timeout(function () {
                  $parse(attrs.selectedRows).assign(scope.$parent, []);
                  getterSelectedIndex = $parse(attrs.selectedRows)(scope);
                  resetSelected();
                  scope.grid.setSelectedRows(getterSelectedIndex);
                });

                scope.grid.onKeyDown.subscribe(function (e) {
                  // select all rows on ctrl-a
                  getterListData = $parse(attrs.listData)(scope);
                  if (e.which === 65 && e.ctrlKey) {
                    var rows = [], i, n = getterListData.length, m = dataView.getLength();
                    if (n === m) {
                      for (i = 0; i < n; i++) {
                        if (!(getterListData[i].disabled === true || getterListData[i].sdlDisabled === true)) {
                          rows.push(i);
                        }
                      }
                    } else {
                      for (i = 0; i < m; i++) {
                        if (!(dataView.getItem(i).disabled === true || dataView.getItem(i).sdlDisabled === true)) {
                          rows.push(i);
                        }
                      }
                    }
                    scope.grid.setSelectedRows(rows);
                    e.preventDefault();
                  }
                });
                if (typeof listConfig.onDoubleClick === 'function') {
                  scope.grid.onDblClick.subscribe(function (e, args) {
                    listConfig.onDoubleClick(dataView.getItem(args.row), e);
                    scope.$apply();
                  });
                }
                scope.grid.onSelectedRowsChanged.subscribe(function () {
                  scope.safeApply(function () {
                    scope.grid.resetActiveCell();
                    $parse(attrs.selectedRows).assign(scope.$parent, scope.grid.getSelectedRows());
                  });
                });

                scope.grid.onCellChange.subscribe(function (e, args) {
                  dataView.updateItem(args.item.id, args.item);
                });
                dataView.onRowCountChanged.subscribe(function (/*e, args*/) {
                  scope.grid.updateRowCount();
                  scope.grid.render();
                });

                dataView.onRowsChanged.subscribe(function (e, args) {
                  scope.grid.invalidateRows(args.rows);
                  scope.grid.render();
                });
                if (listConfig.dragDrop === true) {
                  dataView.getItemMetadata = getItemMetadata;
                  if (isIOS) {
                    if (typeof listConfig.onMouseDown === 'function') {
                      element.bind('touchstart', function (e) {
                        listConfig.onMouseDown(e, scope.grid);
                      });
                    }

                    if (typeof listConfig.onMouseMove === 'function') {
                      element.bind('touchmove', function (e) {
                        listConfig.onMouseMove(e, scope.grid);
                      });
                    }

                    if (typeof listConfig.onMouseUp === 'function') {
                      element.bind('touchend', function (e) {
                        listConfig.onMouseUp(e, scope.grid);
                      });
                    }

                    if (typeof listConfig.onMouseEnter === 'function') {
                      element.bind('touchenter', function (e) {
                        listConfig.onMouseEnter(e, scope.grid);
                      });
                    }

                    if (typeof listConfig.onMouseLeave === 'function') {
                      element.bind('touchleave', function (e) {
                        listConfig.onMouseLeave(e);
                      });
                    }
                  } else {
                    if (typeof listConfig.onMouseDown === 'function') {
                      element.bind('mousedown', function (e) {
                        listConfig.onMouseDown(e, scope.grid);
                      });
                    }

                    if (typeof listConfig.onMouseMove === 'function') {
                      element.bind('mousemove', function (e) {
                        listConfig.onMouseMove(e, scope.grid);
                        e.preventDefault();
                      });
                    }

                    if (typeof listConfig.onMouseUp === 'function') {
                      element.bind('mouseup', function (e) {
                        listConfig.onMouseUp(e, scope.grid);
                      });
                    }

                    if (typeof listConfig.onMouseEnter === 'function') {
                      element.bind('mouseenter', function (e) {
                        listConfig.onMouseEnter(e, scope.grid);
                      });
                    }

                    if (typeof listConfig.onMouseLeave === 'function') {
                      element.bind('mouseleave', function (e) {
                        listConfig.onMouseLeave(e);
                      });
                    }
                  }

                }
                if (listConfig.search === true && typeof listConfig.setSearch === 'function') {
                  dataView.beginUpdate();
                  dataView.setFilterArgs({searchText: ''});
                  if (typeof listConfig.updateSearch === 'function') {
                    listConfig.updateSearch(true);
                  }
                  dataView.setFilter(listConfig.setSearch);
                  dataView.endUpdate();
                }
                dataView.setItems(getterListData, itemId);
                $timeout(function () {
                  scope.grid.invalidate();
                  scope.grid.resizeCanvas();
                });
              },
              resetData = function (newVal) {
                if (typeof newVal === 'number') {
                  getterListData = $parse(attrs.listData)(scope);
                } else {
                  getterListData = newVal;
                }
                if (template) {
                  itemId = $parse(attrs.itemId)(scope);
                  for (var i = 0; i < getterListData.length; i++) {
                    getterListData[i][itemId] = 'id_' + i;
                  }
                  dataView.setItems(getterListData, itemId);
                  scope.grid.resizeCanvas();
                  $timeout(function () {
                    scope.grid.invalidate();
                  });
                }
              },
              settings = [],
              initInfinityList = function () {
                settings = [];
                getterRowHeight = $parse(attrs.rowHeight)(scope);
                getterListConfig = $parse(attrs.listConfig)(scope);
                getterListData = $parse(attrs.listData)(scope);
                if (getterRowHeight !== undefined) {
                  listConfig.rowHeight = getterRowHeight;
                }
                if (getterListConfig !== undefined) {
                  getterListConfig.destroy = function () {
                    scope.grid.destroy();
                  };
                  getterListConfig.scrollTo = function (index) {
                    scope.grid.scrollRowIntoView(index);
                  };
                  listConfig = angular.extend(listConfig, getterListConfig);
                }
                if (listConfig.dragDrop === true) {
                  settings.push({
                    id: 'dragCell',
                    formatter: function () {
                      return '<div class="handle">&nbsp;</div>';
                    },
                    maxWidth: 20
                  });
                }
                settings.push({
                  id: 'content',
                  formatter: function () {
                    return '';
                  },
                  asyncPostRender: renderTemplate,
                  rerenderOnResize: true
                });
                if (getterListData !== undefined) {
                  scope.$watch(attrs.listData + '.length', resetData);
                  scope.$watch(attrs.listData, resetData);
                }
              },
              listConfig = {
                enableAsyncPostRender: true,
                forceFitColumns: true,
                asyncPostRenderDelay: 0,
                onRemoveItem: onRemoveItem,
                rowHeight: 40
              };

            scope.safeApply = function (fn) {
              if (this.$root && this.$root.$$phase) {
                var phase = this.$root.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                  if (fn && (typeof(fn) === 'function')) {
                    fn();
                  }
                } else {
                  this.$apply(fn);
                }
              } else {
                this.$apply(fn);
              }
            };

            scope.$watch(attrs.itemTemplate, function (newVal) {
              if (newVal !== undefined) {
                initInfinityList();
                //pattern to check url, path, html element
                var pathPattern = /([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.html/,
                  htmlPattern = /(<([^>]+)>)/;
                if (htmlPattern.test(newVal)) {
                  createGrid(newVal);
                }
                else if (pathPattern.test(newVal)) {
                  $http({method: 'GET', url: newVal, cache: $templateCache})
                    .success(function (result) {
                      createGrid(result);
                    });
                }
              }
            });
            var resetSelected = function () {
              getterSelectedIndex = $parse(attrs.selectedRows)(scope);
              if (dataView) {
                getterListData = $parse(attrs.listData)(scope);
                var i, n = getterListData.length, m = dataView.getLength();
                if (n === m) {
                  for (i = 0; i < n; i++) {
                    getterListData[i].sdlSelected = false;
                  }
                } else {
                  for (i = 0; i < m; i++) {
                    dataView.getItem(i).sdlSelected = false;
                  }
                }
              }
              if (scope.grid) {
                $timeout(function () {
                  scope.grid.setSelectedRows(getterSelectedIndex);
                  angular.forEach(getterSelectedIndex, function (g) {
                    if (typeof dataView.getItem(g) !== 'undefined' && !(dataView.getItem(g).disabled && dataView.getItem(g).sdlDisabled)) {
                      dataView.getItem(g).sdlSelected = true;
                    }
                  });
                });
              }
            };
            scope.$watchCollection(attrs.selectedRows, resetSelected);
            scope.$on('content.resize', function () {
              scope.grid.resizeCanvas();
            });
            var w = angular.element($window);
            var onResize = function (/*event*/) {
              scope.grid.resizeCanvas();
            };
            w.bind('resize', onResize);
            scope.$on('$destroy', function (/*event*/) {
              $timeout(function () {
                if (scopeArr) {
                  var n = scopeArr.length;
                  for (var i = 0; i < n; i++) {
                    if (scopeArr[i]) {
                      scopeArr[i].$destroy();
                    }
                  }
                  scopeArr.length = 0;
                  scopeArr = null;
                }
                if (scope && scope.grid) {
                  scope.grid.destroy();
                  scope.grid = null;
                }

                dataView = null;
              });
              element.unbind();
              w.unbind('resize', onResize);
            });
          }
        };
      }]);
})();
