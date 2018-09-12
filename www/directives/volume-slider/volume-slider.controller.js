;(function () {
  'use strict';

  angular.module('app')
    .controller('VolumeSliderController', VolumeSliderController);

  VolumeSliderController.$inject = ['$timeout', '$interval'];


  function VolumeSliderController($timeout, $interval) {
    const vm = this;
    console.log('VolumeSliderController start');

    vm.range = 75;

    // $timeout(function () {
    //   vm.range = 5;
    // }, 3000);
    //
    // $timeout(function () {
    //   vm.range = 100;
    // }, 5000);

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // просто маяк
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    let counterStatus = true;

    // someFnc();
    function someFnc() {
      $interval(function () {
        changeVolume()
      }, 20);
    }

    function changeVolume() {
      if (vm.range === 100) {
        counterStatus = false;
        decrease()

      } else if (vm.range === 0) {
        counterStatus = true;
        increase();

      } else if (counterStatus) {
        increase()

      } else if (!counterStatus) {
        decrease()
      }
    }
    function increase() {
      vm.range++;
    }
    function decrease() {
      vm.range--;
    }
  }
})();
