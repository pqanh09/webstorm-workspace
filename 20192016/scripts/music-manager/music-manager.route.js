/**
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';

  angular.module('music.manager')
    .config(  configFunction);
  configFunction.$inject = ['$routeProvider', 'musicConstant'];
    function configFunction($routeProvider, musicConstant) {
    var route = '/' + musicConstant.id,
      config = {
        template: '<music></music>'
      };
    $routeProvider
      .when(route, config)
      .when(route + '/:route*', config)
      .otherwise({redirectTo: route});
  };
})();