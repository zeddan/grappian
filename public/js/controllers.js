(function() {
    'use strict';

    var app = angular.module('controllers', ['ngCookies']);

    app.controller('NavController', [
    '$scope',
    '$cookies',
    '$window',
    '$location',
    '$http',
    function($scope, $cookies, $window, $location, $http) {
        $scope.logout = function() {
            var url = '//accounts.spotify.com/';
            var title = 'logout';
            var w = '900';
            var h = '500';
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var popup = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            var timer = setInterval(function() {
                if (popup.closed) {
                    clearInterval(timer);
                    $cookies.remove('access_token');
                    $cookies.remove('refresh_token');
                    $cookies.remove('username');
                    $window.location.href = 'http://localhost:8080/authorize';
                }
            }, 300);
        };

    }]);

    app.controller('ModesController', [
    '$scope',
    '$http',
    '$location',
    'spotifyService',
    'variableService',
    function($scope, $http, $location, spotifyService, variableService) {
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
         };

        $scope.submit = function() {
            var req = {};
            if ($scope.selectedMode == $scope.modes[0]) {
                variableService.setPreferences($scope.preferences.casual);
                req.genre = $scope.preferences.casual['genre'];
                req.target = $scope.preferences.casual.mood.target;
            }
            else if ($scope.selectedMode == $scope.modes[1]) {
                variableService.setPreferences($scope.preferences.theme);
                req = $scope.preferences.theme;
            }
            else if ($scope.selectedMode == $scope.modes[2]) {
                variableService.setPreferences($scope.preferences.expert);
                req.genre = $scope.preferences.expert['genre'];
                req['target'] = $scope.preferences.expert;
                delete $scope.preferences.expert['genre'];
                variableService.setPreferences(req);
            }
            spotifyService.getRecommendations(req, function(tracks) {
                variableService.setTracks(tracks);
                variableService.setPreviews(tracks);
                $location.path('/review');
            });
        };
        $scope.range = function(range) {
            var input = [];
            for (var i = 1; i <= range; i++)
                input.push(i);
            return input;
        };
        $scope.selectedMode = $scope.modes[0];
    }]);

    app.controller('LoginController', [function() {}]);

    app.controller('ReviewController', [
        '$scope',
        '$route',
        '$location',
        '$timeout',
        'spotifyService',
        'variableService',
        function($scope, $route, $location, $timeout, spotifyService, variableService) {
            $scope.previews = variableService.getPreviews();
            $scope.submit = function() {
                var tracks = variableService.getTracks();
                var preferences = variableService.getPreferences();
                spotifyService.createPlaylist(tracks, preferences, function(link, name) {
                    variableService.setLink(link);
                    variableService.setName(name);
                    $location.path('/result');
                });
            }
            $scope.retry = function() {
                var req = {};
                req = variableService.getPreferences();
                spotifyService.getRecommendations(req, function(tracks) {
                    variableService.setTracks(tracks);
                    variableService.setPreviews(tracks);
                    $route.reload();
                });
            }

            $scope.previews
    }]);

    app.controller('ResultController', [
    '$scope',
    'variableService',
    function($scope, variableService) {
        $scope.playlistName = variableService.getName();
        $scope.playlistLink = variableService.getLink();
    }]);

    app.filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri='+val);
        };
    }]);

}());
