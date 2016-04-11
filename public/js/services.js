(function() {
    'use strict';

    var app = angular.module('services', []);

    app.factory('echonestService', ['$http', '$rootScope', function($http, $rootScope) {
        var service = {};
        service.songs = {};
        service.getSongs = function(req) {
            $http(req).then(
                function(data){
                    $rootScope.songs = data;
                });
        };
        return service;
    }]);

    app.factory('playlistId', function() {
        return {playlistId: ''};
    });

}());
