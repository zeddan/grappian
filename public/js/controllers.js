(function() {
    'use strict';

    var app = angular.module('controllers', []);

    app.controller('ModesController', [
    '$scope',
    '$http',
    '$location',
    'echonestService',
    function($scope, $http, $location, echonestService) {
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
        //     $scope.preferences.theme.genre = $scope.theme.presets[index].genre;
        //     $scope.preferences.theme.target = $scope.theme.presets[index].target;
        // };
        $scope.submit = function() {
            var req = {
                method: 'GET',
                url: 'http://127.0.0.1:8080/api/casual',
            }
            if ($scope.selectedMode == $scope.modes[0])
                req.params = $scope.preferences.casual;
            else if ($scope.selectedMode == $scope.modes[1])
                req.params = $scope.preferences.theme;
            else if ($scope.selectedMode == $scope.modes[2])
                req.params = $scope.preferences.expert;
            // console.log(req);
            echonestService.createPlaylist(req);
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
