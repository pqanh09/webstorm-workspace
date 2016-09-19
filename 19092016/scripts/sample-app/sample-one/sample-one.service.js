/**
 $Id:
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';
  angular
    .module('sample.app.one')
    .factory('sampleAppOneService', serviceFunction);
  serviceFunction.$inject = ['ovAppState', 'ovAlertBuilder', 'ovConstant', 'SampleAppConstant', '$q'];
  function serviceFunction(ovAppState, ovAlertBuilder, ovConstant, SampleAppConstant, $q) {
    var sampleData = [
      {name: 'test', description: 'test description'}
    ];
    var service = {
      getList: getList,
      createItem: createItem,
      updateItem: updateItem,
      deleteItems: deleteItems
    };

    /*state data*/
    var stateData = {
      view: {
        id: ovConstant.mode.view,
        showMenu: true,
        templateUrl: SampleAppConstant.shared.templateUrl.view
      },
      create: {
        id: ovConstant.mode.create,
        templateUrl: SampleAppConstant.sampleOne.templateUrl.create
      },
      edit: {
        id: ovConstant.mode.edit,
        templateUrl: SampleAppConstant.sampleOne.templateUrl.edit
      },
      result: {
        id: ovConstant.mode.result,
        templateUrl: SampleAppConstant.shared.templateUrl.result
      }
    };

    /*default cache data*/
    function getDefaultCachedData() {
      return {
        state: ovAppState.build(stateData, stateData.view),
        spinner: {
          status: false
        },
        alertObject: ovAlertBuilder.getBuilder().build()
      };
    }

    /*init cache*/
    var init = function () {
      service.cache = getDefaultCachedData();
    };
    init();

    //handle data
    function getList() {
      return $q.when(sampleData);
    }

    //create item
    function createItem(item) {
      sampleData.push(item);
    }

    //update item
    function updateItem(item) {
      var currentItem = _.find(sampleData, SampleAppConstant.sampleOne.attrs.name.key, item.name);
      currentItem.description = item.description;
    }

    //delete items
    function deleteItems(listName) {
      _.remove(sampleData, function(item){
        return listName.indexOf(item.name) >= 0;
      });
    }

    return service;
  }
})();