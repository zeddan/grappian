(function() {
    'use strict';

    var app = angular.module('controllers', []);

    app.controller('ModesController', [
    '$scope',
    '$http',
    '$location',
    'echonestService',
    'playlistId',
    function($scope, $http, $location, echonestService, playlistId) {
        $http.get('json/casual.json').success(function(data) {
            $scope.preferences.casual.genres = data.genres;
            $scope.preferences.casual.moods = data.moods;
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
        $scope.preferences = {
            'casual': {},
            'theme': {},
            'expert': {}
        };
        $scope.selected = {
            'mode': '',
            'params': {}
        };
        $scope.selectMode = function(index) {
            $scope.selected.mode = $scope.modes[index];
        }
        $scope.selectGenre = function(index) {
            $scope.selected.params.genre = $scope.preferences.casual.genres[index];
        };
        $scope.selectMood = function(index) {
            $scope.selected.params.mood = $scope.preferences.casual.moods[index];
        };
        $scope.submit = function() {
            var genre = $scope.selected.params.genre;
            var mood = $scope.selected.params.mood;
            var req = {
                method: 'GET',
                url: 'http://localhost:8080/api/casual',
                params: {genre: genre, mood: mood}
            };
            echonestService.getSongs(req);
            $location.path('/result');
        };
        $scope.selected.mode = $scope.modes[0];
    }]);

    app.controller('ResultController', [
    '$scope',
    'echonestService',
    function($scope, echonestService) {
    }]);

}());
