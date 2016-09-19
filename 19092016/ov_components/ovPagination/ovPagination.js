/**
 * Created by bthieu on 12/13/13.
 */
(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovPagination',[]).
    directive('ovPagination',[function() {
      return {
        //templateUrl: 'template/ovPagination/ovPaginationTemplate.html',
        templateUrl: function(elem,attrs) {
          return attrs.templateUrl || 'ov_components/ovPagination/ovPaginationTemplate.html';
        },
        restrict: 'E',
        replace: true,
        scope: {
          totalPages: '=',
          currentPage: '=',
          maxPage: '=',
          pageTexts: '=?',
          tooltipTitles: '=?',
          type: '@',
          linkAction: '=?'
        },
        link: function postLink(scope, element) {
          scope.i18n = [];
          if(typeof scope.pageTexts === 'undefined') {
            scope.pageTexts = {
              first:'',
              previous:'',
              page:'',
              next:'',
              last:''
            };
          }

          if(typeof scope.tooltipTitles === 'undefined') {
            scope.tooltipTitles = {
              first:'ovPagination.tooltipTitle.first',
              previous:'ovPagination.tooltipTitle.previous',
              page:'ovPagination.tooltipTitle.page',
              next:'ovPagination.tooltipTitle.next',
              last:'ovPagination.tooltipTitle.last'
            };
          }

          scope.paginationType = scope.type||'dropDownType';

          var maxPage;
          if(typeof scope.maxPage !== 'undefined') {
            maxPage = scope.maxPage;
          } else {
            maxPage = 6;
          }

          scope.doAction = function(_pageNumber) {
            if(!isNaN(_pageNumber)) {
              if(_pageNumber > scope.totalPages) {
                _pageNumber = scope.totalPages;
              }
              if(_pageNumber <= 0) {
                _pageNumber = 1;
              }
            }
            scope.currentPage = _pageNumber;
            if(typeof scope.linkAction === 'function') {
              scope.linkAction(_pageNumber);
            }
          };
          scope.handleKeyPress = function(_event,_switchScope) {

            if (_event.which===13) {
              _event.preventDefault();
              //blur
              var textBoxElement = angular.element('input', element);
              if(textBoxElement.length > 0){
                setTimeout(function() {textBoxElement[0].blur();},1);
              }
            }

            if(_event.which < 48 || _event.which > 57) {
              _event.preventDefault();
            }

          };

          scope.handleOnBlur = function(_switchScope) {
            scope.handleChildScopeUpdate(_switchScope);
          };

          scope.handleChildScopeUpdate = function(_switchScope) {

            var updatePage = parseInt(_switchScope.currentPage,10);
            if(isNaN(updatePage)) {
              updatePage = 1;
            }
            if(updatePage !== scope.currentPage) {
              scope.doAction(updatePage);
            }
            delete _switchScope.currentPage;
          };


          scope.showNextPageList = function(e) {
            e.preventDefault();
            e.stopPropagation();
            var nextNumber = maxPage;
            scope.hidePreviousPageIcon = false;
            if(scope.pages[scope.pages.length-1].number + maxPage >= scope.totalPages){
              nextNumber = scope.totalPages - scope.pages[scope.pages.length-1].number;
              scope.hideNextPageIcon = true;
            }
            for(var i = 0; i < scope.pages.length ; i++) {
              scope.pages[i].number += nextNumber;
              if(scope.pages[i].number === scope.currentPage) {
                scope.pages[i].selected = true;
              } else {
                scope.pages[i].selected = false;
              }

            }
          };
          scope.showPreviousPageList = function(e) {
            e.preventDefault();
            e.stopPropagation();
            var previousNumber = maxPage;
            scope.hideNextPageIcon = false;
            if(scope.pages[0].number - maxPage <= 1){
              previousNumber = scope.pages[0].number - 1;
              scope.hidePreviousPageIcon = true;
            }
            for(var i = 0; i < scope.pages.length ; i++) {
              scope.pages[i].number -= previousNumber;
              if(scope.pages[i].number === scope.currentPage) {
                scope.pages[i].selected = true;
              } else {
                scope.pages[i].selected = false;
              }

            }
          };

          scope.$watchCollection('[totalPages,currentPage]', function() {

            if(!scope.totalPages || scope.totalPages <= 0) {
              scope.totalPages = 1;
              scope.currentPage = 1;
            }

            if(!scope.currentPage || scope.currentPage <= 0) {
              scope.currentPage = 1;
            }

            if(scope.paginationType === 'dropDownType' || scope.paginationType === 'bootstrapType'){
              var beginPage = scope.currentPage - Math.floor(maxPage/2);
              var endPage;
              var page;
              scope.pages = [];
              if(beginPage > scope.totalPages) {
                beginPage = scope.totalPages - maxPage;
              }
              if(beginPage <= 0 ) {
                beginPage = 1;
              }
              endPage = beginPage + maxPage - 1;
              if(endPage > scope.totalPages) {
                if(beginPage > 1) {
                  beginPage -= endPage - scope.totalPages;
                }
                endPage = scope.totalPages;
              }
              if(endPage <= 0) {
                endPage = (maxPage > scope.totalPages)?maxPage:scope.totalPages;
              }

              for(var i = beginPage; i<= endPage; i++) {
                page = {};
                page.number = i;
                if(i === scope.currentPage) {
                  page.selected = true;
                } else {
                  page.selected = false;
                }
                scope.pages.push(page);
              }

              if(scope.paginationType === 'dropDownType') {
                if(beginPage > 1){
                  scope.hidePreviousPageIcon = false;
                } else {
                  scope.hidePreviousPageIcon = true;
                }
                if(endPage < scope.totalPages){
                  scope.hideNextPageIcon = false;
                } else {
                  scope.hideNextPageIcon = true;
                }
              }
            }

            if(scope.currentPage > scope.totalPages) {
              scope.currentPage = scope.totalPages;
              scope.doAction(scope.currentPage);
            } else if(scope.currentPage <= 0){
              scope.currentPage = 1;
              scope.doAction(scope.currentPage);
            }
          } );
        }
      };
    }]).
    filter('ovLimitFromTo',[function() {
      return function(input, limitFrom, limitTo) {
        if (!angular.isArray(input) && !angular.isString(input)) {
          return input;
        }

        limitTo =  parseInt(limitTo, 10);
        limitFrom = parseInt(limitFrom, 10);

        // if abs(limitTo) exceeds maximum length, trim it
        if (limitTo > input.length) {
          limitTo = input.length;
        } else if (limitTo < 0) {
          limitTo = 0;
        }

        if (limitFrom > input.length) {
          limitFrom = input.length;
        } else if (limitFrom < 0) {
          limitFrom = 0;
        }

        if (angular.isString(input)) {
          //NaN check on limitTo
          if (limitTo && limitFrom) {
            return limitTo >= limitFrom ? input.slice(limitFrom, limitTo) : input.slice(limitTo, limitFrom);
          } else {
            return '';
          }
        }
        var out = [],
          i, n;

        if(limitTo >= limitFrom) {
          i = limitFrom;
          n = limitTo;
        } else {
          i = limitTo;
          n = limitFrom;
        }

        for (; i<n; i++) {
          out.push(input[i]);
        }

        return out;

      };
    }])
    .directive('ovInputAutoGrow', function(){
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
          var updateElementWidthByValue = function(_newValue) {
            _newValue = _newValue || 1;
            var fontRatio = parseInt(element.css('font-size')) / parseInt(angular.element(document.body).css('font-size'));
            var inputW = (_newValue.toString().length * 9) * fontRatio + 26;
            element.css('width', inputW/10 + 'rem');
            return _newValue;
          };
          //ngModelCtrl.$parsers.push(updateElementWidthByValue);
          ngModelCtrl.$formatters.push(updateElementWidthByValue);
        }
      };
    });
}());
