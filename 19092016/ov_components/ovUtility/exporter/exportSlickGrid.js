/* jshint unused: false, latedef: false */
/* global pdfMake: false*/

(function(){
  'use strict';
  angular.module('ngnms.ui.fwk.services.exportService', [])
    .factory('exportSlickGridService',exportSlickGrid );

  function exportSlickGrid(){
    return {
      table2PDF: exportTable2PDF
    };

    function exportTable2PDF(options){
      var columns = [],
        data = [],
        i, j,
        dataMaker = [],
        defConfig = {
          fontSize: 12,
          pageOrientation: 'portrait',
          pageSize : 'A4'
        };

      angular.extend(defConfig,options.config);

      if(angular.isDefined(options) && angular.isDefined(options.grid) && angular.isDefined(options.grid.getColumns)){
        columns = options.grid.getColumns();
      }

      if(angular.isDefined(options) && angular.isDefined(options.data)){
        data = options.data;
      }

      if(!columns.length){
        return; //do nothing
      }

      //make columns
      var cols = [],
        colIDs = [];
      for(i = 0; i < columns.length; i++){
        cols.push({text: columns[i].name, style: 'tableHeader'});
        colIDs.push(columns[i].field);
      }
      dataMaker.push(cols);

      //make data
      for(i = 0; i < data.length; i++){
        var item = [];
        for(j = 0; j < colIDs.length; j++){
          item.push(data[i][colIDs[j]].toString());
        }
        dataMaker.push(item);
      }

      var dd = {
        pageOrientation: defConfig.pageOrientation,
        pageSize: defConfig.pageSize,
        content: [
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                style: 'tableExample',
                table: {
                  body: dataMaker
                }
              },
              { width: '*', text: '' }
            ]
          }
        ],
        styles: {
          tableExample: {
            fontSize: defConfig.fontSize
          },
          tableHeader: {
            bold: true,
            color: 'black',
            fillColor: '#ececec'
          }
        }
      };

      pdfMake.createPdf(dd).download();

    }

  }
})();
