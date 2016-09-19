/**
 *    $Id:
 *    (c) Copyright ALE USA Inc., 2015
 *    All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 *    or transmitted in any form or by any means, electronic, mechanical,
 *    photocopying, or otherwise without the prior permission of ALE USA Inc..
 *
 */
/**
 *    $Id:
 *    (c) Copyright ALE USA Inc., 2015
 *    All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 *    or transmitted in any form or by any means, electronic, mechanical,
 *    photocopying, or otherwise without the prior permission of ALE USA Inc..
 *
 */
(function () {
  // This option prohibits the use of a variable before it was defined.
  /* jshint  latedef:nofunc*/
  'use strict';
  ovAppState.$inject = [];
  function ovAppState() {
    var service = {};

    /**
     *
     * @param data state mapping object
     * @param initState initial state will be assigned to current state
     * @returns {{}}
     */
    service.build = function build(data, initState) {
      /**
       *
       * @class OvStateObject
       */

      var state = {};
      state.data = data;
      state.current = initState;
      state.default = initState;
      /**
       * change current state to stateObject
       * @param {OvStateObject} stateObject
       */
      state.change = function change(stateObject) {
        var targetState = _.isString(stateObject) ? state.data[stateObject] : state.data[stateObject.id];
        if(!targetState){
          throw new Error('State configuration do not contain ' + stateObject);
        }
        state.current = targetState;
      };


      /**
       * reset current state to default state
       */
      state.reset = function reset() {
        state.current = state.default;
      };
      //
      state.getStatus = function (attr) {
        return !!state.current[attr];
      };
      /**
       * get slick menu status
       * @returns {boolean}
       */
      state.getMenuStatus = function () {
        return state.getStatus('showMenu');
      };

      /**
       *
       * @param {Object|String} stateObject
       * @returns {boolean}
       * true: current state is stateObject
       * false: current state is NOT stateObject
       */
      state.check = function check(stateObject) {
        var stateId = _.isString(stateObject) ? stateObject :  stateObject.id;
        return state.current.id === stateId;
      };

      return state;
    };
    //
    return service;
  }

  angular.module('ngnms.ui.fwk.ovAppState', [])
    .factory('ovAppState', ovAppState);
})();


