(function() {
    'use strict';

    var app = angular.module('services', []);

    app.factory('spotifyService', [
    '$http',
    '$rootScope',
    '$cookies',
    '$location',
    function($http, $rootScope, $cookies, $location) {
        var service = {};
        service.getRecommendations = function(req, callback) {
            var url ='http://127.0.0.1:8080/api/getrecommendations';
            req.access_token = $cookies.get('access_token');
            req.refresh_token = $cookies.get('refresh_token');
            $http.post(url, JSON.stringify(req)).then(
                function(res) {
                    callback(res.data);
                    $location.path('/review');
                }
            );
        };
        service.getTracks = function(req, callback) {
            var tracks = [];
            req.forEach(function(e) {
                tracks.push(e.song_id);

            });
            callback(tracks);
            $location.path('/review');
        };
        service.createPlaylist = function(playlistName, tracks) {
            var req = {};
            var url = 'http://127.0.0.1:8080/api/create-playlist';
            var data = {
                'user_id': $cookies.get('username'),
                'name': playlistName,
                'tracks': tracks,
                'access_token': $cookies.get('access_token'),
                'refresh_token': $cookies.get('refresh_token')
            };

            service.getTracks(tracks, function(tracks){
                data.tracks = tracks;
                console.log(data.tracks);
                $http.post(url, JSON.stringify(data)).then(
                    function(res) {
                        $rootScope.playlistLink = res.data;
                        $rootScope.playlistName = playlistName;
                        console.log($rootScope.playlistLink);
                    },
                    function(err) {
                        console.log("error: ", err);
                    }
                );
            });
        };
        return service;
    }]);
}());
