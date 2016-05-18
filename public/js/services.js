(function() {
    'use strict';

    var app = angular.module('services', []);

    app.factory('spotifyService', [
    '$http',
    '$cookies',
    '$location',
    function($http, $cookies, $location) {
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

        var createPlaylistName = function(preferences) {
            var date = new Date();
            var baseName = date.getDate() + '/' + (date.getMonth() + 1) + ' grappian ';
            var preferences = preferences;
            if (preferences['name']) {
                baseName += preferences['name'];
            } else if (preferences['genre']) {
                baseName += preferences['genre'];
            } else {
                baseName += 'ambient';
            }
            return baseName;
        };

        service.createPlaylist = function(tracks, preferences, callback) {
            var req = {};
            var url = 'http://127.0.0.1:8080/api/create-playlist';
            var baseName = createPlaylistName(preferences);
            var data = {
                'user_id': $cookies.get('username'),
                'name': baseName,
                'tracks': tracks,
                'access_token': $cookies.get('access_token'),
                'refresh_token': $cookies.get('refresh_token')
            };

            service.getTracks(tracks, function(tracks){
                data.tracks = tracks;
                $http.post(url, JSON.stringify(data)).then(
                    function(res) {
                        callback(res.data, baseName);
                    },
                    function(err) {
                        console.log("error: ", err);
                    }
                );
            });

        };
        return service;
    }]);

    app.factory('variableService', [
        function() {
            var preferences = {};
            var tracks = [];
            var service = {};
            var link = "";
            var name = "";
            var previews = [];
            service.setPreferences = function(pref) {
                preferences = pref;
            };
            service.getPreferences = function() {
                return preferences;
            };
            service.setTracks = function(trackList) {
                tracks = trackList;
            };
            service.getTracks = function() {
                return tracks;
            };
            service.setLink = function(playlistLink) {
                link = playlistLink;
            };
            service.getLink = function() {
                return link;
            };
            service.setName = function(playlistName) {
                name = playlistName;
            };
            service.getName = function() {
                return name;
            }
            service.setPreviews = function(tracks) {
                var previewObject = [];
                previews = [];
                previewObject = tracks.slice(0, 3);
                previewObject.forEach(function(e) {
                    previews.push(e.song_id);
                });
            };
            service.getPreviews = function() {
                return previews;
            }
            return service;
        }]);

}());
