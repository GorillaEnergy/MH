;(function () {

  'use strict';

  angular.module('directive.volumeSlider', [])
    .directive('volumeSlider', volumeSlider);


  volumeSlider.$inject = [];

  function volumeSlider() {
    return {
      restrict: "EA",
      templateUrl: 'directives/volume-slider/volume-slider.html',
      controller: 'VolumeSliderController',
      controllerAs: 'vm',
      // scope: {
      //   range: '@'
      // },
      scope: {},
      bindToController: true
    };

  }
})();
