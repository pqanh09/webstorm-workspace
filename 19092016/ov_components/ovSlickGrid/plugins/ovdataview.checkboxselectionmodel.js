(function ($) {
  // register namespace
  $.extend(true, window, {
    'Slick': {
      'OvDataViewCheckbox': OvDataViewCheckbox
    }
  });

  var CHECKED_STATE = 'checked';
  var UN_CHECK_STATE = 'unCheck';
  var DISABLED_STATE = 'disabled';

  function getTplRow(id, state){
    var appendTplCheck, appendTplId;
    appendTplId = 'id="'+id+'"';
    switch(state){
    case CHECKED_STATE:
      appendTplCheck = 'class="fa fa-check ov-data-view-checkbox-check"';
      break;
    case UN_CHECK_STATE:
      appendTplCheck = 'class="fa fa-check ov-data-view-check-box-un-check"';
      break;
    case DISABLED_STATE:
      return '<div class="ov-data-view-checkbox-wrapper"></div>';
    default:
      appendTplCheck = 'class="fa fa-check ov-data-view-check-box-un-check"';
    }

    return '<div class="ov-data-view-checkbox-wrapper"><i '+appendTplId+' '+appendTplCheck+'></i></div>';
  }

  function OvDataViewCheckbox(options) {
    var _grid;
    var _dataGridView;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _defaults = {
      columnId: '_checkbox_selector',
      cssClass: null,
      toolTip: 'Select/Deselect All',
      width: 40
    };

    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      _grid = grid;
      _dataGridView = _grid.getData();
      _handler
        .subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged)
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onHeaderClick, handleHeaderClick)
        .subscribe(_grid.onKeyDown, handleKeyDown);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleSelectedRowsChanged(/*e, args*/) {
      var selectedRows = _grid.getSelectedRows(),
        pageSize = _grid.getDataLength(), countDisabledItem = 0;
      var lookup = {}, row, i;
      for (i = 0; i < selectedRows.length; i++) {
        row = selectedRows[i];
        lookup[row] = true;
        if (lookup[row] !== _selectedRowsLookup[row]) {
          _grid.invalidateRow(row);
          delete _selectedRowsLookup[row];
        }
      }
      for (i in _selectedRowsLookup) {
        _grid.invalidateRow(i);
      }
      _selectedRowsLookup = lookup;
      _grid.render();

      for(i = 0; i < pageSize; i++){
        if(_grid.getDataItem(i).disabled){
          countDisabledItem++;
        }
      }

      if (selectedRows.length && selectedRows.length === pageSize) {
        _grid.updateColumnHeader(_options.columnId, getTplRow(_options.columnId + '-slick-grid-check-all', CHECKED_STATE), _options.toolTip);
      } else if(selectedRows.length && selectedRows.length + countDisabledItem === pageSize){
        _grid.updateColumnHeader(_options.columnId, getTplRow(_options.columnId + '-slick-grid-check-all', CHECKED_STATE), _options.toolTip);
      }  else {
        _grid.updateColumnHeader(_options.columnId, getTplRow(_options.columnId + '-slick-grid-check-all', UN_CHECK_STATE), _options.toolTip);
      }
    }

    function handleKeyDown(e, args) {
      if (e.which === 32) {
        if (_grid.getColumns()[args.cell].id === _options.columnId) {
          // if editing, try to commit
          if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
            toggleRowSelection(args.row);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }

    function handleClick(e, args) {
      // clicking on a row select checkbox
      if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).is('.fa-check')) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        toggleRowSelection(args.row);
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function toggleRowSelection(row) {
      var pageInfo = {}, currId, prevIds, currIndex;
      pageInfo.oldVal = _dataGridView.getPagingInfo();
      pageInfo.oldVal.pageNum = pageInfo.oldVal.pageSize === 0 ? undefined : pageInfo.oldVal.pageNum;
      pageInfo.newVal = {pageSize: 0};

      currId = _dataGridView.mapRowsToIds([row])[0];
      prevIds = _dataGridView.mapRowsToIds(Object.keys(_selectedRowsLookup));

      _dataGridView.setPagingOptions(pageInfo.newVal);

      currIndex = _dataGridView.mapIdsToRows([currId])[0];

      if (prevIds.indexOf(currId) !== -1) {
        _grid.setSelectedRows($.grep(_grid.getSelectedRows(), function (n) {
          return n !== currIndex;
        }));
      } else {
        _grid.setSelectedRows(_grid.getSelectedRows().concat(currIndex));
      }

      _dataGridView.setPagingOptions(pageInfo.oldVal);
    }

    function handleHeaderClick(e, args) {
      if (args.column.id === _options.columnId && $(e.target).is('.fa-check')) {
        var isChecked = !$(e.target).is('.ov-data-view-checkbox-check');

        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        var rows = [], i, j;
        for (i = 0; i < _grid.getDataLength(); i++) {
          if(!_grid.getDataItem(i).disabled){
            rows.push(i);
          }
        }

        var pageInfo = {}, currIds, currSelectedIds, allIndexesOnCurrPage = [], allIdsOnCurrPage = [];
        pageInfo.oldVal = _dataGridView.getPagingInfo();
        pageInfo.oldVal.pageNum = pageInfo.oldVal.pageSize === 0 ? undefined : pageInfo.oldVal.pageNum;
        pageInfo.newVal = {pageSize: 0};

        if(pageInfo.oldVal.pageSize !== 0 && pageInfo.oldVal.pageSize !== _dataGridView.getItems().length){
          currIds = _dataGridView.mapRowsToIds(rows);
          for(i = 0; i < pageInfo.oldVal.pageSize; i++){
            allIndexesOnCurrPage.push(i);
          }
          allIdsOnCurrPage = _dataGridView.mapRowsToIds(allIndexesOnCurrPage);

          _dataGridView.setPagingOptions(pageInfo.newVal);

          currSelectedIds = _dataGridView.mapRowsToIds(_grid.getSelectedRows());

          for(i = 0; i < currSelectedIds.length; i++){
            for(j = 0; j < allIdsOnCurrPage.length; j++){
              if(currSelectedIds[i] === allIdsOnCurrPage[j]){
                currSelectedIds.splice(i, 1);
                i--;
                break;
              }
            }
          }

          if (isChecked) {
            currSelectedIds = currSelectedIds.concat(currIds);
            _grid.setSelectedRows(_dataGridView.mapIdsToRows(currSelectedIds));
          } else {
            _grid.setSelectedRows(_dataGridView.mapIdsToRows(currSelectedIds));
          }
        }else{
          if (isChecked) {
            _grid.setSelectedRows(rows);
          } else {
            _grid.setSelectedRows([]);
          }
        }

        _dataGridView.setPagingOptions(pageInfo.oldVal);

        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: getTplRow(options.columnId + '-slick-grid-check-all', UN_CHECK_STATE),
        toolTip: _options.toolTip,
        field: 'sel',
        width: _options.width,
        type: 'ovDataViewCheckBox',
        resizable: false,
        focusable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: checkboxSelectionFormatter
      };
    }

    function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
      if (dataContext) {
        if(dataContext.disabled){
          return getTplRow(_options.columnId + '-slick-grid-' + dataContext[_options.primaryKey], DISABLED_STATE);
        }else  if(_selectedRowsLookup[row]){
          return getTplRow(_options.columnId + '-slick-grid-' + dataContext[_options.primaryKey], CHECKED_STATE);
        }else {
          return getTplRow(_options.columnId + '-slick-grid-' + dataContext[_options.primaryKey], UN_CHECK_STATE);
        }
      }
      return null;
    }

    $.extend(this, {
      'init': init,
      'destroy': destroy,

      'getColumnDefinition': getColumnDefinition
    });
  }
})(jQuery);