(function () {
    'use strict';

    //module
    angular.module('myApp', ['ngRoute', 'music.manager']);

    //controller
    angular.module('myApp').controller('homeController', homeController);

    homeController.$inject = [];

    function homeController() {
        var vm = this;
        vm.title = 'Hello world';
    }

    //routing
    angular.module('myApp').config(HomeRoute);

    HomeRoute.$inject = ['$routeProvider'];

    function HomeRoute($routeProvider) {
        $routeProvider
            .otherwise({
                templateUrl: 'script/home.html',
                controller: "homeController"
            });

    }

})();