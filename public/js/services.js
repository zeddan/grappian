(function() {
    'use strict';

    var app = angular.module('services', []);

    app.factory('echonestService', ['$http', function($http) {
        var service = {};
        service.songs = {};
        service.getSongs = function(req) {
            $http(req).then(
                function(data){
                    service.songs = data;
                });
        };
        return service;
    }]);

    app.factory('playlistId', function() {
        return {playlistId: ''};
    });

}());
