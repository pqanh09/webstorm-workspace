/**
 * Created by pqanh on 9/20/16.
 */
(function () {
  'use strict';

  angular.module('music.manager').service('musicManagerService', serviceFunction);

  serviceFunction.$inject = ['musicConstant', 'ovConstant', 'ovAppState', 'ovAlertBuilder'];

  function serviceFunction(musicConstant, ovConstant, ovAppState, ovAlertBuilder ){
    // define functions
    var service = {
      addSong: addSong,
      editSong: editSong,
      deleteSongs: deleteSongs,
      findAllSongs: findAllSongs,
      findSongById: findSongById,
      findSongByName: findSongByName,
      getBreadCrumbData: getBreadCrumbData,
      getSideBarMenu: getSideBarMenu

    };
    // define song list
    service.songList = [
      {id: 1, name: 'Song 1', artist: 'A'},
      {id: 2, name: 'Song 2', artist: 'B'},
      {id: 3, name: 'Song 3', artist: 'C'}
    ];
    /*state data*/
    var stateData = {
      view: {
        id: ovConstant.mode.view,
        showMenu: true,
        templateUrl: musicConstant.song.templateUrl.detail
      },
      create: {
        id: ovConstant.mode.create,
        templateUrl: musicConstant.song.templateUrl.modify
      },
      edit: {
        id: ovConstant.mode.edit,
        templateUrl: musicConstant.song.templateUrl.modify
      }
//        ,result: {
//        id: ovConstant.mode.result,
//        templateUrl: SampleAppConstant.shared.templateUrl.result
//      }
    };
    init();

    return service;
    //////////////
    /*default cache data*/
    function getDefaultCachedData() {
      return {
        state: ovAppState.build(stateData, stateData.view),
        spinner: {
          status: false
        },
        alertObject: ovAlertBuilder.getBuilder().build()
      };
    }

    /*init cache*/
    function init() {
      service.cache = getDefaultCachedData();
    }

    /* get breadcrumb data*/
    function getBreadCrumbData(){
      var navData = {};
      navData.list = [
        {
          title: 'Training App',
          iconClasses: 'fa fa-fw fa-home',
          disabled: false
        },
        {
          title: 'Music Manager',
          iconClasses: '',
          disabled: true
        }
      ];
      return navData;
    }

    /*get sideBar Menu data*/
    function getSideBarMenu() {
      var sideBarMenu, sideBarObject;

      sideBarMenu = {
        id: musicConstant.id,
        title: musicConstant.title,
        menuItems: [],
        disabled: true
      };
      sideBarObject = service.sideBarObject = {};

      sideBarObject.home = {
        id: musicConstant.home.id,
        title: musicConstant.home.title,
        templateUrl: musicConstant.home.templateUrl.app,
        parent: sideBarMenu
      };
      sideBarObject.song = {
        id: musicConstant.song.id,
        title: musicConstant.song.title,
        templateUrl: musicConstant.song.templateUrl.app,
        parent: sideBarMenu
      };
      sideBarObject.playlist = {
        id: musicConstant.playlist.id,
        title: musicConstant.playlist.title,
        templateUrl: musicConstant.playlist.templateUrl.app,
        parent: sideBarMenu
      };

      sideBarMenu.menuItems = [sideBarObject.home, sideBarObject.song, sideBarObject.playlist];
      return sideBarMenu;
    }


    function addSong(song) {
      service.songList.push(song);
    }

    function editSong(songModify) {
      angular.forEach(service.songList, function (song) {
        if (song.id == songModify.id) {
          song.name = songModify.name;
          song.artist = songModify.artist;
        }
      });
    }

    function deleteSongs(listId) {
      listId.forEach(function (value) {
        var song = service.findSongById(value);
        if (song) {
          service.songList.splice(song, 1);
          listId.delete(value)

        }
      });
    }

    function findAllSongs() {
      return service.songList;
    }


    function findSongById(songId) {
      var result;
      angular.forEach(service.songList, function (song) {
        if (song.id == songId) {
          result = song;
        }
      });
      return result;
    }

    function findSongByName(name) {
      var result;
      angular.forEach(service.songList, function (song) {
        if (song.name == name) {
          result = song;
        }
      });
      return result;
    }

  };
})();