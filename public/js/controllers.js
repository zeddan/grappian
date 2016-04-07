(function() {
    'use strict';

    var app = angular.module('controllers', []);

    app.controller('ModesController', ['$scope', function($scope) {
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
            'casual': {
                'genres': ['dub acid', 'jazz'],
                'moods': ['happy', 'angry']
            },
            'theme': {
            },
            'expert': {
            }
        };
        $scope.selected = {
            'mode': '',
            'params': {}
        };
        $scope.selectGenre = function(index) {
            $scope.selected.params.genre = $scope.preferences.casual.genres[index];
        };
        $scope.selectMood = function(index) {
            $scope.selected.params.mood = $scope.preferences.casual.moods[index];
        };
        $scope.submit = function() {
            console.log($scope.selected.params);
        };
    }]);

}());
