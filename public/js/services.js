(function() {
    'use strict';
    var app = angular.module('services', []);

    app.factory('Data' , function() {
        var data =
        {
            playlistId: '',
            echonestList: ''
        };
        return {
            getPlaylistId: function() {
                return data.playlistId;
            },
            setPlaylistID: function(playlistId) {
                data.playlistId = playlistId;
            },
            getEchonestList: function() {
                return data.echonestList;
            },
            setEchonestList: function(echonestList) {
                data.echonestList = echonestList;
            }
        };
    });
});
