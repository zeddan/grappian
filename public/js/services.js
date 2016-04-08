(function() {
    'use strict';
    var app = angular.module('services', []);

    app.factory('echonestList' , function() {
        return {echonestList :''};
    });

    app.factory('playlistId', function() {
        return {playlistId: ''};
    });
}());
