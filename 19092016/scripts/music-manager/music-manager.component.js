/**
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
    'use strict';

    angular.module('music.manager').component('music', {
        // isolated scope binding
        bindings: {
            message: '='
        },

        // Load the template
        templateUrl: '/scripts/music-manager/music-manager.component.html',


        // The controller that handles component logic
        controller: 'musicController'
    });
})
/*
(function () {
    'use strict';

    angular.module('music.manager').directive('music', directiveFunction);

    directiveFunction.$inject = [];

    function directiveFunction() {
        return {
            templateUrl: 'scripts/music-manager/music-manager.component.html',
            restrict: 'EA',
            controller: 'musicController',
            controllerAs: 'vm',
            scope: {},
            bindToController: {

            }
        }
    }
})();*/
