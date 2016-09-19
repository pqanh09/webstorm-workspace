/* global canvg:false, jsPDF:false */

(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.services.exportService', [])
    .factory('exportChartService', ['$document', '$timeout', function ($document, $timeout) {
      var service = {};
      service.exportChart = function (_id, _config) {
        var selectElem = '#' + _id,
          svg = $(selectElem).find('svg'),
          bodyElement = $document.find('body'),
          countSvg = svg.length,
          widthChart = 0,
          heightChart = 0,
          widthLegend = 0,
          heightLegend = 0,
          defaultConfig,
          canvas1, canvas2, canvasSum, chartElem, legendElem, ctx,
          oldChartWidth, oldChartHeight, widthTextGroup = 0,
          pageFormats = { // Size in pt of various paper formats - pixels
            'a4': [793.70, 1122.52]
          },
          legendCopy, text,
          orientation = 'portrait';

        var svg1 = null, svg2 = null;

        var dpi = 96;//default value

        function getCustomSizePDF(orientation, canvasWidth, canvasHeight) {
          var size = {
            width: canvasWidth,
            height: canvasHeight
          };

          if (orientation === 'landscape') {
            if (canvasWidth > pageFormats.a4[1] || canvasHeight > pageFormats.a4[0]) {
              return size;
            }

          } else {
            if (canvasHeight > pageFormats.a4[1]) {
              return size;
            }
          }

          return false
        }

        //get initial size
        var getInitialSize = function () {
          oldChartWidth = $(selectElem).find('svg').eq(0)[0].getAttribute('width');
          oldChartHeight = $(selectElem).find('svg').eq(0)[0].getAttribute('height');
        };

        //get size fo chart and legend
        var getSize = function () {
          if (countSvg === 1) {
            $document.find(selectElem).append(angular.element('<svg id="tempSVG" height="0" width="0"></svg>'));
          }
          widthChart = $(selectElem).find('svg').eq(0).width();
          heightChart = $(selectElem).find('svg').eq(0).height();
          widthLegend = $(selectElem).find('svg').eq(1).width();
          heightLegend = $(selectElem).find('svg').eq(1).height();

          //set font-size
          var fontSize = {'font-size': '14px'};
          $(selectElem).find('svg').eq(0).css(fontSize);
          $(selectElem).find('svg').eq(1).css(fontSize);
        };

        //copy legend
        var copyLegend = function () {
          if (countSvg === 2) {
            widthTextGroup = $(selectElem).find('svg').eq(1).children().eq(1)[0].getBBox().width + 5;
          }
          //if width text is longer than width legend
          widthTextGroup = widthLegend >= widthTextGroup ? widthLegend : widthTextGroup;
          legendCopy = angular.element($(selectElem).find('svg').eq(1).clone().attr('id', 'legend'));
          $document.find(selectElem).append(angular.element('<div id="copy-legend" style="display: none;"></div>'));
          $(document.getElementById('copy-legend')).append(legendCopy);
          //set width for legend
          legendCopy.css({width: widthTextGroup});

          //reset position for text in legend
          if (widthTextGroup > widthLegend) {
            var i;
            text = $('#copy-legend').find('text');
            for (i = 0; i < text.length; i++) {
              text.eq(i).attr('x', widthTextGroup / 2);
              text.eq(i).attr('text-anchor', 'middle');
            }
          }
        };

        //set for case width, height 100%
        var setSizeChart = function () {
          chartElem = $(selectElem).find('svg').eq(0);
          chartElem.width(widthChart);
          chartElem.height(heightChart);
        };

        //get config
        var initDefaultConfig = function () {
          defaultConfig = {
            format: 'png',
            title: '',//string
            chart: {width: widthChart, height: heightChart},
            legend: {width: widthTextGroup, height: heightLegend}
          };
          defaultConfig = angular.extend(defaultConfig, _config);
        };

        //draw chart and legend into a canvas
        var drawChart = function () {

          function fittingString(c, str, maxWidth) {
            var width = c.measureText(str).width;
            var ellipsis = '…';
            var ellipsisWidth = c.measureText(ellipsis).width;
            if (width <= maxWidth || width <= ellipsisWidth) {
              return str;
            } else {
              var len = str.length;
              while (width >= maxWidth - ellipsisWidth && len-- > 0) {
                str = str.substring(0, len);
                width = c.measureText(str).width;
              }
              return str + ellipsis;
            }
          }

          //get svg chart and legend
          svg1 = $(selectElem).find('svg').eq(0).parent().html().trim();

          if (countSvg === 2) {
            svg2 = $(document.getElementById('legend')).eq(0).parent().html().trim();
          }

          //append canvas that to draw chart and legend on this canvas
          bodyElement.append(angular.element('<canvas id="myCanvas"></canvas>'));
          canvasSum = document.getElementById('myCanvas');
          canvasSum.width = defaultConfig.chart.width + defaultConfig.legend.width + 50;
          canvasSum.height = defaultConfig.chart.height >= defaultConfig.legend.height ? defaultConfig.chart.height + 160 : defaultConfig.legend.height + 160;// increase height for title
          ctx = canvasSum.getContext('2d');

          //set orientation
          if (canvasSum.width > pageFormats.a4[0]) {
            orientation = 'landscape';
          }

          //set title
          var xt = getCustomSizePDF(orientation, canvasSum.width, canvasSum.height) ? 20 : 0;
          ctx.font = '18px Arial';
          ctx.fillStyle = '#428bca';
          ctx.fillText(fittingString(ctx, defaultConfig.title, canvasSum.width), xt, 50);

          //declare canvas 1(draw chart) and canvas 2(draw legend)
          bodyElement.append(angular.element('<canvas id="myCanvas1"></canvas>'));
          canvas1 = document.getElementById('myCanvas1');
          bodyElement.append(angular.element('<canvas id="myCanvas2"></canvas>'));
          canvas2 = document.getElementById('myCanvas2');
        };

        //convert svg to canvas
        var exportChart = function (_saveCb) {
          //convert chart to canvas
          if (svg1 !== null) {
            canvg(canvas1, svg1, {
              ignoreMouse: true,
              ignoreAnimation: true,
              renderCallback: function () {
                var xt = 0,
                  yt = canvasSum.height / 2 - defaultConfig.chart.height / 2;
                ctx.drawImage(canvas1, xt, yt, defaultConfig.chart.width, defaultConfig.chart.height);
              }
            });
          }

          //convert legend to canvas
          if (svg2 !== null) {
            canvg(canvas2, svg2, {
              ignoreMouse: true,
              ignoreAnimation: true,
              renderCallback: function () {
                var xt = defaultConfig.chart.width,
                  yt = 60;

                ctx.drawImage(canvas2, xt, yt, defaultConfig.legend.width, defaultConfig.legend.height);
              }
            });
          }

          _saveCb();
        };


        var canvasToImage = function (canvas, backgroundColor) {
          //cache height and width
          var w = canvas.width;
          var h = canvas.height;
          var data;
          var context = canvas.getContext('2d');
          if (backgroundColor) {
            //get the current ImageData for the canvas.
            data = context.getImageData(0, 0, w, h);

            //set to draw behind current content
            context.globalCompositeOperation = 'destination-over';

            //set background color
            context.fillStyle = backgroundColor;

            //draw background / rect on entire canvas
            context.fillRect(0, 0, w, h);
          }

          //get the image data from the canvas
          var imageData = canvas.toDataURL('image/jpeg');
          if (backgroundColor) {
            //store the current globalCompositeOperation
            var compositeOperation = context.globalCompositeOperation;
            //clear the canvas
            context.clearRect(0, 0, w, h);

            //restore it with original / cached ImageData
            context.putImageData(data, 0, 0);

            //reset the globalCompositeOperation to what it was
            context.globalCompositeOperation = compositeOperation;
          }

          //return the Base64 encoded data url string
          return imageData;
        };

        //reset size of chart
        var resetSize = function () {
          //reset data
          chartElem.width(oldChartWidth);
          chartElem.height(oldChartHeight);

          //reset font-size
          $(selectElem).find('svg').eq(0).css({'font-size': ''});
          $(selectElem).find('svg').eq(1).css({'font-size': ''});
        };

        //fix: memory leak
        var destroyData = function () {
          //destroy data
          if (canvasSum) {
            $('#myCanvas').remove();
            canvasSum = null;
          }
          if (canvas1) {
            $('#myCanvas1').remove();
            canvas1 = null;
          }
          if (canvas2) {
            $('#myCanvas2').remove();
            canvas2 = null;
          }
          bodyElement = null;
          svg = null;
          svg1 = null;
          svg2 = null;
          chartElem = null;
          legendElem = null;
          widthChart = null;
          heightChart = null;
          widthLegend = null;
          heightLegend = null;
          legendCopy = null;
          oldChartWidth = null;
          oldChartHeight = null;
          countSvg = null;
          widthTextGroup = null;
          text = null;
          $('#tempSVG').remove();
          $('#copy-legend').remove();
        };

        function getDPI() {
          // create an empty element
          var div = document.createElement('div');
          // give it an absolute size of one inch
          div.style.width = '1in';
          // append it to the body
          var body = document.getElementsByTagName('body')[0];
          body.appendChild(div);
          // read the computed width
          var dpi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
          // remove it again
          body.removeChild(div);
          // and return the value
          return parseFloat(dpi);
        }

        if (countSvg) {
          //get dpi
          dpi = getDPI();
          //begin getting initial chart's size
          getInitialSize();
          //begin getting size of chart and legend
          getSize();
          //copy legend append to document
          copyLegend();
          //begin setting size of chart and legend
          setSizeChart();
          //init default config
          initDefaultConfig();
          //draw chart
          drawChart();
          //go to export
          exportChart(function () {
            //pdf
            if (defaultConfig.format === 'pdf') {
//              console.log(canvasSum.width, canvasSum.height);
              var doc,
                imgPDF = canvasToImage(canvasSum, '#fff'), x = 0, y = 0;

              var pdfWidth = 0, pdfHeight = 0;
              var in2mm = 25.4;

              //for oversize chart
              var customSize = getCustomSizePDF(orientation, canvasSum.width, canvasSum.height);
              if (typeof customSize === 'object') {
                //convert to mm
                pdfWidth = (customSize.width / dpi) * in2mm;
                pdfHeight = (customSize.height / dpi) * in2mm;// for setting position of chart
                doc = new jsPDF(orientation, 'mm', [pdfWidth, pdfHeight]);
              } else {
                x = orientation === 'portrait' ? pageFormats.a4[0] / 2 - canvasSum.width / 2 : pageFormats.a4[1] / 2 - canvasSum.width / 2; //this is px
                x = (x / dpi) * in2mm;//covert to mm
                doc = new jsPDF(orientation);
              }
              doc.addImage(imgPDF, 'JPEG', x, y);
              doc.save('chart.pdf');
              //print
            } else if (defaultConfig.format === 'print') {

              var win = window.open();
              win.document.write("<br><img src='" + canvasSum.toDataURL() + "'/>");
              win.print();
              win.location.reload();
              win.close();

              //image
            } else {
              canvasSum.toBlob(function (blob) {
                saveAs(blob, eval("'name.' + defaultConfig.format "));
              });
            }
            resetSize();
            destroyData();
          });
        } else {
          console.log('svg not found!');
          return;
        }
      };
      return service;

    }]);
})();
