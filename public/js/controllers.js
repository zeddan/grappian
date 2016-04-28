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
        //
        // use this for themes view
        //
        // $scope.selectTheme = function(index) {
        //     $scope.preferences.theme = $scope.theme.presets[index];
        // };
        $scope.submit = function() {
            //one spotifyService.getRecommendations after the if-statments should be enough
            var date = new Date();
            var baseName = date.getDate() + '/' + (date.getMonth() + 1) + ' grappian ';
            var req = {
            }
            if ($scope.selectedMode == $scope.modes[0]) {
                req.params = $scope.preferences.casual;
                baseName += $scope.preferences.casual['genre'];
                req.url = 'http://127.0.0.1:8080/api/casual'
                echonestService.createPlaylist(req, baseName);
            }
            else if ($scope.selectedMode == $scope.modes[1]) {
                //only for testing
                $scope.preferences.theme = $scope.theme.presets[0];
                req = $scope.preferences.theme;
                console.log(req);
                baseName += req.name;
                spotifyService.getRecommendations(req, function(res) {
                    console.log("result in controller: ");
                    $rootScope.getRecommendations = res;
                    console.log($rootScope.getRecommendations);
                    spotifyService.createPlaylist($rootScope.getRecommendations, baseName);
                });
            }
            else if ($scope.selectedMode == $scope.modes[2]) {
                req['target'] = $scope.preferences.expert;
                //genre should be selectable
                req.genre = 'ambient';
                spotifyService.getRecommendations(req, function(res) {
                    $rootScope.getRecommendations = res;
                    spotifyService.createPlaylist($rootScope.getRecommendations, baseName);
                });
            }

            $location.path('/result');
        };
        $scope.selectedMode = $scope.modes[2];
    }]);

    app.controller('LoginController', [function() {}]);

    app.controller('ResultController', [
    '$scope',
    'echonestService',
    function($scope, echonestService) {
    }]);


}());
