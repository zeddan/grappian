(function() {
    'use strict';

    var app = angular.module('controllers', []);

    app.controller('ModesController', [
    '$scope',
    '$http',
    '$location',
    '$rootScope',
    'echonestService',
    'spotifyService',
    function($scope, $http, $location, $rootScope, echonestService, spotifyService) {
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
            //one spotifyService.getRecommendations after the if-statments should be enough
            var req = {};
            var previewObject = [];
            if ($scope.selectedMode == $scope.modes[0]) {
                $rootScope.preferences = $scope.preferences.casual;
                req.genre = $scope.preferences.casual['genre'];
                console.log(req.genre);
                spotifyService.getRecommendations(req, function(tracks) {
                    $rootScope.tracks = tracks
                    console.log($rootScope.tracks);
                    previewObject = tracks.slice(0, 3);
                    $rootScope.previews = [];
                    previewObject.forEach(function(e) {
                        $rootScope.previews.push(e.song_id);

                    });
                    console.log($rootScope.previews);
                    $location.path('/review');
                });
            }
            else if ($scope.selectedMode == $scope.modes[1]) {
                $rootScope.preferences = $scope.preferences.theme;
                req = $scope.preferences.theme;
                console.log(req);
                spotifyService.getRecommendations(req, function(tracks) {
                    $rootScope.tracks = tracks
                    console.log($rootScope.tracks);
                    previewObject = tracks.slice(0, 3);
                    $rootScope.previews = [];
                    previewObject.forEach(function(e) {
                        $rootScope.previews.push(e.song_id);

                    });
                    console.log($rootScope.previews);
                    $location.path('/review');
                /*    spotifyService.createPlaylist(baseName, $rootScope.tracks); */
                });
            }
            else if ($scope.selectedMode == $scope.modes[2]) {
                req['target'] = $scope.preferences.expert;
                //genre should be selectable
                req.genre = 'ambient';
                $rootScope.preferences = req;
                spotifyService.getRecommendations(req, function(tracks) {
                    $rootScope.tracks = tracks;
                    previewObject = tracks.slice(0, 3);
                    $rootScope.previews = [];
                    previewObject.forEach(function(e) {
                        $rootScope.previews.push(e.song_id);

                    });
                    $location.path('/review');
                    /*    spotifyService.createPlaylist(baseName, $rootScope.tracks); */
                });
            }
            $rootScope.req = req;
        };
        $scope.range = function(range) {
            var input = [];
            for (var i = 1; i <= range; i++)
                input.push(i);
            return input;
        };
        $scope.selectedMode = $scope.modes[2];
    }]);

    app.controller('LoginController', [function() {}]);

    app.controller('ReviewController', [
        '$scope',
        '$rootScope',
        '$route',
        '$location',
        'spotifyService',
        function($scope, $rootScope, $route, $location, spotifyService) {
            $scope.previews = $rootScope.previews;
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
                console.log($rootScope.tracks);
                spotifyService.createPlaylist(baseName, $rootScope.tracks);
                $location.path('/result');
            }

            $scope.retry = function() {
                var req = {};
                req = $rootScope.preferences;
                spotifyService.getRecommendations(req, function(tracks) {
                    $rootScope.tracks = tracks
                    console.log($rootScope.tracks);
                    var previewObject = tracks.slice(0, 3);
                    $rootScope.previews = [];
                    previewObject.forEach(function(e) {
                        $rootScope.previews.push(e.song_id);

                    });
                    $route.reload();
                });
            }
    }]);

    app.controller('ResultController', [
    '$scope',
    'echonestService',
    function($scope, echonestService) {
    }]);

    app.filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri='+val);
        };
    }]);

}());
