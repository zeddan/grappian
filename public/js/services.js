(function() {
    'use strict';

    var app = angular.module('services', []);

    app.factory('echonestService', ['$http', '$rootScope', function($http, $rootScope) {
        var service = {};
        service.getTracks = function(req, callback) {
            $http(req).then(
                function(res) {
                    var tracks = [];
                    res.data.forEach(function(e) {
                        tracks.push(e.song_id); 
                    });
                    $rootScope.tracks = tracks;
                    callback(tracks);
                }
            );
        };
        service.createPlaylist = function(req) {
            var o = {
                method: 'POST',
                url: 'http://localhost:8080/api/create-playlist',
                params: {
                    'user_id': 'grappian',
                    'name': '' + new Date(),
                    'tracks': []
                }
            };
            service.getTracks(req, function(tracks){
                o.params.tracks = tracks; 
            }); 
            $http(o).then(
                function(res) {
                    // playlist should have been created
                    // and res is the server's response
                    console.log(res);
                }
            );
        };
        return service;
    }]);

    app.factory('playlistId', function() {
        return {playlistId: ''};
    });

}());
