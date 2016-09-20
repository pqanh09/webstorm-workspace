/**
 $Id:
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';

  angular.module('sample.app')
    .config(configFunction);

  configFunction.$inject = ['$routeProvider', 'SampleAppConstant'];

  function configFunction($routeProvider, SampleAppConstant) {
    var route = '/' + SampleAppConstant.sample.id,
      config = {
        template: '<sample-app></sample-app>'
      };
    $routeProvider
      .when(route, config)
      .when(route + '/:route*', config);
  }
})();