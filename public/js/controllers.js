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
            if ($scope.selectedMode == $scope.modes[0]) {
                $rootScope.preferences = $scope.preferences.casual;
                req.params = $scope.preferences.casual;
                req.url = 'http://127.0.0.1:8080/api/casual'
                echonestService.getTracks(req, function(tracks) {
                    $rootScope.tracks = tracks;
                    $rootScope.previews = tracks.slice(0, 3);
                });
            }
            else if ($scope.selectedMode == $scope.modes[1]) {
                req = $scope.preferences.theme;
                console.log(req);
                spotifyService.getRecommendations(req, function(res) {
                    $rootScope.tracks = res;
                    $location.path('/review');
                /*    spotifyService.createPlaylist(baseName, $rootScope.tracks); */
                });
            }
            else if ($scope.selectedMode == $scope.modes[2]) {
                req['target'] = $scope.preferences.expert;
                //genre should be selectable
                req.genre = 'ambient';
                spotifyService.getRecommendations(req, function(res) {
                    $rootScope.tracks = res;
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
        'echonestService',
        function($scope, $rootScope, $route, $location, echonestService) {
            $scope.previews = $rootScope.previews;
            $scope.submit = function() {
                var req = {};
                var date = new Date();
                var baseName = date.getDate() + '/' + (date.getMonth() + 1) + ' grappian ';
                req.url = 'http://127.0.0.1:8080/api/casual';
                baseName += $rootScope.preferences['genre'];
                echonestService.createPlaylist(baseName, $rootScope.tracks);
                $location.path('/result');
            }

            $scope.retry = function() {
                var req = {};
                req.params = $rootScope.preferences;
                req.url = 'http://127.0.0.1:8080/api/casual';
                    echonestService.getTracks(req, function(tracks) {
                        $rootScope.tracks = tracks;
                        $rootScope.previews = tracks.slice(0, 3);
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
