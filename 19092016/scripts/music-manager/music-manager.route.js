/**
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';

  angular.module('music.manager')
    .config(  function configFunction($routeProvider) {
    var route = '/music-manager',
      config = {
        template: '<music></music>'
      };
    $routeProvider
      .when(route, config)
      .when(route + '/:route*', config)
      .otherwise({redirectTo: route});
  });
})();