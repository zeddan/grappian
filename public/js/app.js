(function() {
    'use strict';

    var app = angular.module('grappian', [
        'ngRoute',
        'ngCookies',
        'controllers',
        'services'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'partials/loginView.html',
                controller: 'LoginController'
            })
            .when('/modes', {
                templateUrl: 'partials/modesView.html',
                controller: 'ModesController'
            })
            .when('/review', {
                templateUrl: 'partials/reviewView.html',
                controller: 'ReviewController'
            })
            .when('/result', {
                templateUrl: 'partials/resultView.html',
                controller: 'ResultController'
            })
    }]);

}());
