;(function () {
    'use strict';

    angular.module('app')
        .controller('HeroSelectionController', HeroSelectionController);

    HeroSelectionController.$inject = ['$state', '$timeout', 'userService', 'allMasks', 'consultantService'];


    function HeroSelectionController($state, $timeout, userService, allMasks, consultantService) {
        const vm = this;

        // vm.heroBG = heroBG;
        vm.toMain = toMain;
        vm.toCall = toCall;
        vm.allMasks = allMasks;

        // vm.heroes = [0,1,2,3,4,5,6,7];

        // function heroBG(index) {
        //   return index < 7? index: 7;
        // }

        function toMain() {
          console.log('to kid-main-page');
          $state.go('kid-main-page')
        }

        function toCall(item) {
          consultantService.setMask(item);
          console.log('to call');
          $state.go('consultant-list');
        }
    }

})();
