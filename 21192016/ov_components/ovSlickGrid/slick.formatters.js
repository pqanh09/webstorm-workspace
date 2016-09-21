/***
 * Contains basic SlickGrid formatters.
 * 
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 * 
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "PercentComplete": PercentCompleteFormatter,
        "PercentCompleteBar": PercentCompleteBarFormatter,
        "YesNo": YesNoFormatter,
        "Checkmark": CheckmarkFormatter,
        'DateFormatter': DateFormatter,
        'enableDisableFormatter':enableDisableFormatter
      }
    }
  });

  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function DateFormatter(row, cell, value, columnDef, dataContext){
    if (value === -1) {
      return '';
    }
    var a = new Date(parseInt(value));
    // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // var year = a.getFullYear();
    // var month = months[a.getMonth()];
    // var date = a.getDate();
    // var hours = a.getHours();
    // hours = (hours+24-2)%24; 
    // var mid='AM';
    // if(hours==0){ //At 00 hours we need to show 12 am
    //   hours=12;
    // }else if(hours>12){
    //   hours=hours%12;
    //   mid='PM';
    // }
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    //return month + ' '+ date +','+year+' '+hours+':'+min+':'+sec + ' '+ mid;
    var currentFormat = moment.formatter;
    return moment(a).format(currentFormat);
  }

  function enableDisableFormatter(row, cell, value, columnDef, dataContext) {
    if (value === 'ENABLE') {
      return '<label class="ov-switch ov-switch-green" style="margin-right: 20px">'+
            '<span class="ov-switch-label" data-on="Enabled" data-off="Disabled"></span>'+
            '<span class="ov-switch-handle"></span>'+
            '</label>';
    } else {
      return '<label class="ov-switch ov-switch-green" style="margin-right: 20px">'+
            '<span class="ov-switch-label" data-on="Enabled" data-off="Disabled"></span>'+
            '<span class="ov-switch-handle"></span>'+
          '</label>';
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }

  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "<img src='ov_components/ovSlickGrid/images/tick.png'>" : "";
  }
})(jQuery);
