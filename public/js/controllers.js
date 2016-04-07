(function() {
    'use strict';

    var app = angular.module('controllers', []);

    app.controller('ModesController', ['$scope', function($scope) {
        $scope.modes = ['happy', 'sad', 'angry']
    }]);

}());
