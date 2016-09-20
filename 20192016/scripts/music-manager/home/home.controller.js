/**
 * Created by pqanh09 on 9/19/16.
 */
(function(){
    'use strict';
    angular.module('music.home').controller('musicHomeController', controllerFunction);

    controllerFunction.$inject = ['musicConstant','ovCardsConstant','$location'];

    function controllerFunction(musicConstant, ovCardsConstant, $location){
      var vm = this;
      /**
       * Config and data for ovCards
       * Ref: ngDocs
       */
      vm.cardsConfig = {cardType: ovCardsConstant.cardType.includedIcon, hintedWidthCard: 300};

      vm.cards = [
        {
          iconClass: 'fa fa-lg fa-bar-chart-o',
          title: musicConstant.song.id,
          description: musicConstant.song.description,
          onSelected: function() {
            $location.url( musicConstant.id + '/' + musicConstant.song.id);
          }
        },
        {
          iconClass: 'fa fa-lg fa-bar-chart-o',
          title: musicConstant.playlist.id,
          description: musicConstant.playlist.description,
          onSelected: function() {
            $location.url( musicConstant.id + '/' + musicConstant.playlist.id);
          }
        }
      ];
    }
})();


