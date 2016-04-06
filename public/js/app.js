(function() {
    'use strict';

    var app = angular.module('grappian', [
        'ngRoute',
        'controllers'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'components/login/loginView.html',
                controller: 'components/login/loginController.js'
            })
            .when('/modes', {
                templateUrl: 'partials/modesView.html',
                controller: 'ModesController'
            })
            .when('/review', {
                templateUrl: 'components/review/reviewView.html',
                controller: 'components/review/reviewController.js'
            })
            .when('/result', {
                templateUrl: 'components/result/resultView.html',
                controller: 'components/result/resultController.js'
            })
    }]);

}());
