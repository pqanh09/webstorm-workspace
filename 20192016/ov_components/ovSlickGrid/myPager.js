(function ($) {
  function SlickGridPager(dataView, grid, $container,i18nData) {
     var $status;

     this.changeLocale = function(localeData){
        i18nData = angular.copy(localeData);
        constructPagerUI();
        updatePager(dataView.getPagingInfo());
     }

    function init() {
      dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
        updatePager(pagingInfo);
      });

      constructPagerUI();
      updatePager(dataView.getPagingInfo());
    }

    //This fn get the paging Info : pageSize,pageNumber,totalRows,totalPages
    function getNavState() {
      //True if the current edit could not be committed successfully,false otherwise
      var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
      //{pageSize , pageNum, totalRows, totalPages}
      var pagingInfo = dataView.getPagingInfo();
      var lastPage = pagingInfo.totalPages - 1;

      return {
        canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
        canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
        pagingInfo: pagingInfo
      }
    }

    //This fn will be triggered when the user interact with the paging settings,used to calculate and set paging info for dataView.
    function setPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: true
      });
      dataView.setPagingOptions({pageSize: n});
    }

    function gotoFirst() {
      if (getNavState().canGotoFirst) {
        dataView.setPagingOptions({pageNum: 0});
      }
    }

    function gotoLast() {
      var state = getNavState();
      if (state.canGotoLast) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.totalPages - 1});
      }
    }

    function gotoPrev() {
      var state = getNavState();
      if (state.canGotoPrev) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum - 1});
      }
    }

    function gotoNext() {
      var state = getNavState();
      if (state.canGotoNext) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum + 1});
      }
    }

    //Create the paging elements : navigation,setings,status... and bind event handlers to them.
    function constructPagerUI() {
      $container.off('click','a.btn btn-default fa');
      $container.empty();

      var $settings = $('<span class="custom-slick-pager-settings pull-left" />').appendTo($container);
      $('<span class="pull-right"></span>').appendTo($container);
      $status = $('<span class="custom-slick-pager-status" />').appendTo($container.find('.pull-right'));
      var $nav = $('<span class="custom-slick-pager-nav btn-group" />').appendTo($container.find('.pull-right'));
      var icon_prefix = '<a class="btn btn-default fa ';
      var icon_suffix = '"></a>';

      $settings.append('<span class="custom-slick-pager-settings-expanded">' + i18nData.show + ': ' +
          '<select class="limit-row-per-page"><option value="0">' + i18nData.all + '</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>');

      $container.find(".limit-row-per-page").change(function () {
        var pagesize = parseInt(this.options[this.selectedIndex].value);
        if (pagesize != undefined) {
          if (pagesize == -1) {
            var vp = grid.getViewport();
            setPageSize(vp.bottom - vp.top);
          } else {
            setPageSize(parseInt(pagesize));
          }
        }
      });

      $(icon_prefix + 'fa-angle-double-left' + icon_suffix)
        .click(gotoFirst)
        .appendTo($nav);

      $(icon_prefix + 'fa-angle-left' + icon_suffix)
        .click(gotoPrev)
        .appendTo($nav);

      $(icon_prefix + 'fa-angle-right' + icon_suffix)
        .click(gotoNext)
        .appendTo($nav);

      $(icon_prefix + 'fa-angle-double-right' + icon_suffix)
        .click(gotoLast)
        .appendTo($nav);

      $container.children().wrapAll('<div class="custom-slick-pager clearfix" />');
    }

    //This function add/remove classes to enable/disabled the paging icons(prev,next,last,first) and handle the pagination text based on paging state.
    function updatePager(pagingInfo) {

      var state = getNavState();

      $container.find('.custom-slick-pager-nav a').removeClass('disabled');
      if (!state.canGotoFirst) {
        $container.find('.fa-angle-double-left').addClass('disabled');
      }
      if (!state.canGotoLast) {
        $container.find('.fa-angle-double-right').addClass('disabled');
      }
      if (!state.canGotoNext) {
        $container.find('.fa-angle-right').addClass('disabled');
      }
      if (!state.canGotoPrev) {
        $container.find('.fa-angle-left').addClass('disabled');
      }

      //Fix lost selected page size when loaded - dminhquan
      $container.find('.limit-row-per-page').val(pagingInfo.pageSize);

      if (pagingInfo.pageSize == 0) {
        $status.text(i18nData.showingAll + ' ' + pagingInfo.totalRows + ' ' + i18nData.rows);
      } else {
        $status.text(i18nData.showingPage + ' ' + (pagingInfo.pageNum + 1) + ' ' + i18nData.of + ' ' + pagingInfo.totalPages);
      }
    }
    init();
  }

  // Slick.Controls.Pager
  $.extend(true, window, { Slick:{ Controls:{ Pager:SlickGridPager }}});
})(jQuery);
