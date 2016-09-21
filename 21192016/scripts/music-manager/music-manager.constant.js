/**
 * Created by pqanh on 9/20/16.
 */
(function () {
    'use strict';

    angular.module('music.manager').constant('musicConstant', {
        id: 'music-manager',
        title: 'Music Manager',
        home: {
            id: 'home',
            title: 'Home',
            templateUrl: {
                app: 'scripts/music-manager/home/home.html'
                //,appComponent: 'scripts/music-manager/home/home.component.html'
            }
        },
        song: {
            id: 'song',
            title: 'Song Manager',
            description: 'Manage songs........',
            templateUrl: {
                app: 'scripts/music-manager/song/song.html',
                appComponent: '',
                detail: 'scripts/music-manager/song/view/detail.html',
                modify: 'scripts/music-manager/song/action/song-modify.html'
            }
        },
        playlist: {
            id: 'playlist',
            title: 'Playlist Manager',
            description: 'Manage playlist........',
            templateUrl: {
                app: 'scripts/music-manager/playlist/playlist.html',
                appComponent: ''
            }
        }
//    ,album: {
//      id: 'album',
//      title: 'Album Manager',
//      templateUrl: {
//        app: '',
//        appComponent: ''
//      }
//    }


    });
})();