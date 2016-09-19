(function () {
  'use strict';

  // This option prohibits the use of a variable before it was defined.
  /* jshint  latedef:nofunc*/
  angular.module('ngnms.ui.fwk.ovNgListBox')
    .factory('ovNgListBoxBuilder', ovNgListBoxBuilder)
  ;
  ovNgListBoxBuilder.$inject = ['$ovUtility'];
  function ovNgListBoxBuilder($ovUtility) {
    function Builder() {
      var defaultConfig = {
        id:'ov-ng-list-box',
        searchString: '',
        itemTemplate: 'ov_components/ovDataView/templates/ovListBoxDefaultContent.html',
        headerTemplate: 'ov_components/ovDataView/templates/ovListBoxDefaultHeader.html',
        showHeader: true,
        showFilter: true,
        filter: false,
        showFooter: true,
        limitRow: 25,
        sortType: 'ASC',
        sortBy: '',
        sortList: [],
        currentPage: 1,
        selectFieldList: [
          {key: '', title: ''}
        ],
        hideFieldList: [],
        mapFunction: [
          {
            'from': 'getContent',
            'to': $ovUtility.ovListBoxGetContent
          },
          {
            'from': 'getTitle',
            'to': $ovUtility.ovListBoxGetTitle
          }
        ],
        setId: setId,
        setSearchString: setSearchString,
        setItemTemplate: setItemTemplate,
        setHeaderTemplate: setHeaderTemplate,
        setShowHeader: setShowHeader,
        setShowFilter: setShowFilter,
        setFilter: setFilter,
        setShowFooter: setShowFooter,
        setLimitRow: setLimitRow,
        setSortType: setSortType,
        setSortBy: setSortBy,
        setSortByList: setSortByList,
        setCurrentPage: setCurrentPage,
        setSelectFieldList: setSelectFieldList,
        setHideFieldList: setHideFieldList,
        setMapFunction: setMapFunction
      };

      function setId(string) {
        defaultConfig.id = string;
      }
      function setSearchString(string) {
        defaultConfig.searchString = string;
      }

      function setItemTemplate(string) {
        defaultConfig.itemTemplate = string;
      }

      function setHeaderTemplate(string) {
        defaultConfig.headerTemplate = string;
      }

      function setShowHeader(value) {
        defaultConfig.showHeader = value;
      }

      function setShowFilter(value) {
        defaultConfig.showFilter = value;
      }

      function setFilter(value) {
        defaultConfig.filter = value;
      }

      function setShowFooter(value) {
        defaultConfig.showFooter = value;
      }

      function setLimitRow(value) {
        if(angular.isNumber(value)){
          defaultConfig.limitRow = value;
        }
      }

      function setSortType(string) {
          defaultConfig.sortType = string;
      }

      function setSortBy(string) {
          defaultConfig.sortBy = string;
      }
      function setSortByList(string) {
          defaultConfig.sortByList = string;
      }

      function setCurrentPage(value) {
        if (angular.isNumber(value)) {
          defaultConfig.currentPage = value;
        }
      }

      function setSelectFieldList(array) {
        if (angular.isArray(array)) {
          defaultConfig.selectFieldList = array;
        }
      }

      function setHideFieldList(array) {
        if (angular.isArray(array)) {
          defaultConfig.hideFieldList = array;
        }
      }

      function setMapFunction(array) {
        if (angular.isArray(array)) {
          defaultConfig.mapFunction = array;
        }
      }

      return {
        extend: function (extendedData) {
          angular.extend(defaultConfig, extendedData);
          return this;
        },
        setId: function(value){
          setId(value);
          return this;
        },
        setSearchString: function(value){
          setSearchString(value);
          return this;
        },
        setItemTemplate: function(value){
          setItemTemplate(value);
          return this;
        },
        setHeaderTemplate: function(value){
          setHeaderTemplate(value);
          return this;
        },
        setShowHeader: function(value){
          setShowHeader(value);
          return this;
        },
        setShowFilter: function(value){
          setShowFilter(value);
          return this;
        },
        setFilter: function(value){
          setFilter(value);
          return this;
        },
        setShowFooter: function(value){
          setShowFooter(value);
          return this;
        },
        setLimitRow: function(value){
          setLimitRow(value);
          return this;
        },
        setSortType: function(value){
          setSortType(value);
          return this;
        },
        setSortBy: function(value){
          setSortBy(value);
          return this;
        },
        setSortByList: function(value){
          setSortByList(value);
          return this;
        },
        setCurrentPage: function(value){
          setCurrentPage(value);
          return this;
        },
        setSelectFieldList: function(value){
          setSelectFieldList(value);
          return this;
        },
        setHideFieldList: function(value){
          setHideFieldList(value);
          return this;
        },
        setMapFunction: function(value){
          setMapFunction(value);
          return this;
        },
        build: function () {
          return defaultConfig;
        }
      };
    }

    return {
      getBuilder: function () {
        return new Builder();
      }
    };
  }
})();
