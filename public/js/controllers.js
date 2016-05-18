(function() {
    'use strict';

    var app = angular.module('controllers', []);

    app.controller('ModesController', [
    '$scope',
    '$http',
    '$location',
    '$rootScope',
    'spotifyService',
    function($scope, $http, $location, $rootScope, spotifyService) {
        $http.get('json/modes.json').success(function(data) {
            $scope.casual = data.casual;
            $scope.theme = data.theme;
            $scope.expert = data.expert;
            $scope.expert.preferences.floats.forEach(function(name) {
                $('#'+name+'-slider').slider({
                    orientation: 'horizontal',
                    range: false,
                    value: 0,
                    change: function(event, ui) {
                        $scope.preferences.expert[name] = ui.value;
                    }
                });
            });
        });
        $scope.titles = {
            'modes': 'modes',
            'preferences': 'preferences',
            'casual': {
                'genre': 'genre',
                'mood': 'mood'
            },
            'expert': {
                'genre': 'genre'
            }
        };
        $scope.modes = ['casual', 'theme', 'expert'];
        $scope.selectedMode = '';
        $scope.preferences = {
            'casual': {},
            'theme': {},
            'expert': {}
        };
        $scope.selectMode = function(index) {
            $scope.selectedMode = $scope.modes[index];
        };
        $scope.selectGenre = function(index, mode) {
            if (mode == 'casual')
                $scope.preferences.casual.genre = $scope.casual.preferences.genres[index];
            else if (mode == 'expert')
                $scope.preferences.expert.genre = $scope.expert.preferences.genres[index];
        };

        $scope.selectMood = function(index) {
            $scope.preferences.casual.mood = $scope.casual.preferences.moods[index];
        };

         $scope.selectTheme = function(index) {
            $scope.preferences.theme = $scope.theme.presets[index];
            console.log($scope.preferences.theme);
         };

        $scope.submit = function() {
            var req = {};
            if ($scope.selectedMode == $scope.modes[0]) {
                $rootScope.preferences = $scope.preferences.casual;
                req.genre = $scope.preferences.casual['genre'];
                req.target = $scope.preferences.casual.mood.target;
            }
            else if ($scope.selectedMode == $scope.modes[1]) {
                $rootScope.preferences = $scope.preferences.theme;
                req = $scope.preferences.theme;
            }
            else if ($scope.selectedMode == $scope.modes[2]) {
                $rootScope.preferences = $scope.preferences.expert;
                req.genre = $scope.preferences.expert['genre'];
                req['target'] = $scope.preferences.expert;
                delete $scope.preferences.expert['genre'];
                $rootScope.preferences = req;
            }
            spotifyService.getRecommendations(req, function(tracks) {
                $rootScope.tracks = tracks
                $rootScope.createPreviews(tracks);
                $location.path('/review');
            });
            $rootScope.req = req;
        };
        $scope.range = function(range) {
            var input = [];
            for (var i = 1; i <= range; i++)
                input.push(i);
            return input;
        };
        $scope.selectedMode = $scope.modes[0];

        $rootScope.createPreviews = function(tracks) {
            var previewObject = [];
            $rootScope.previews = [];
            previewObject = tracks.slice(0, 3);
            previewObject.forEach(function(e) {
                $rootScope.previews.push(e.song_id);
            });
        }
    }]);

    app.controller('LoginController', [function() {}]);

    app.controller('ReviewController', [
        '$scope',
        '$rootScope',
        '$route',
        '$location',
        'spotifyService',
        function($scope, $rootScope, $route, $location, spotifyService) {
            $scope.submit = function() {
                var req = {};
                var date = new Date();
                var baseName = date.getDate() + '/' + (date.getMonth() + 1) + ' grappian ';
                req.url = 'http://127.0.0.1:8080/api/casual';
                if($rootScope.preferences['name']) {
                    baseName += $rootScope.preferences['name'];
                } else if ($rootScope.preferences['genre']) {
                    baseName += $rootScope.preferences['genre'];
                } else {
                    baseName += 'ambient';
                }
                spotifyService.createPlaylist(baseName, $rootScope.tracks);
                $location.path('/result');
            }

            $scope.retry = function() {
                var req = {};
                req = $rootScope.preferences;
                spotifyService.getRecommendations(req, function(tracks) {
                    $rootScope.tracks = tracks;
                    $rootScope.createPreviews(tracks);
                    $route.reload();
                });
            }
    }]);

    app.controller('ResultController', [
    '$scope',
    function($scope) {
    }]);

    app.filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri='+val);
        };
    }]);

}());
