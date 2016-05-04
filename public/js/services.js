(function() {
    'use strict';

    var app = angular.module('services', []);

    app.factory('echonestService', [
    '$http',
    '$rootScope',
    '$cookies',
    function($http, $rootScope, $cookies) {
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
        service.createPlaylist = function(req, name) {
            var url = 'http://127.0.0.1:8080/api/create-playlist';
            var data = {
                'user_id': $cookies.get('username'),
                'name': name,
                'tracks': [],
                'access_token': $cookies.get('access_token'),
                'refresh_token': $cookies.get('refresh_token')
            };
            service.getTracks(req, function(tracks){
                data.tracks = tracks;
                $http.post(url, JSON.stringify(data)).then(
                    function(res) {
                        $rootScope.playlistLink = res.data;
                        $rootScope.playlistName = name;
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

    app.factory('spotifyService', [
    '$http',
    '$rootScope',
    '$cookies',
    function($http, $rootScope, $cookies) {
        var service = {};
        service.getRecommendations = function(req, callback) {
            var url ='http://127.0.0.1:8080/api/getrecommendations';
            req.access_token = $cookies.get('access_token');
            req.refresh_token = $cookies.get('refresh_token');
            $http.post(url, JSON.stringify(req)).then(
                function(res) {
                    callback(res.data);
                }
            );
        };
        service.getArtistImages = function(req, callback) {
            var url ='http://127.0.0.1:8080/api/getimages';
            $http.post(url, JSON.stringify(req)).then(
                function(res) {
                    callback(res.data);
                }
            );
        };
        service.getTracks = function(req, callback) {
            var tracks = [];
            req.forEach(function(e) {
                tracks.push(e.song_id);
            });
            callback(tracks);
        };
        service.createPlaylist = function(req, name) {
            var url = 'http://127.0.0.1:8080/api/create-playlist';
            var data = {
                'user_id': $cookies.get('username'),
                'name': name,
                'tracks': [],
                'access_token': $cookies.get('access_token'),
                'refresh_token': $cookies.get('refresh_token')
            };
            service.getTracks(req, function(tracks){
                data.tracks = tracks;
                $http.post(url, JSON.stringify(data)).then(
                    function(res) {
                        $rootScope.playlistLink = res.data;
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
