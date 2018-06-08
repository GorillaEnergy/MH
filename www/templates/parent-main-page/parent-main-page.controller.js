;(function () {
  'use strict';

  angular.module('app')
    .controller('ParentMainPageController', ParentMainPageController);

  ParentMainPageController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout',
                                      '$ionicModal', 'kids'];


  function ParentMainPageController($ionicPopup, $state, $scope, $stateParams, userService, $timeout,
                                    $ionicModal, kids) {
    const vm = this;

    vm.kidColor = kidColor;
    vm.toMenu = toMenu;
    vm.kidLogs = kidLogs;
    vm.emptyKids = emptyKids;

    vm.kids = kids;
    console.log(kids);

    // не несет смысловой нагрузки, нужно для создания вьюхи
    vm.callRightNow = true;
    vm.lastCall = '12:25';
    // vm.warning = true;
    vm.emptyData = false;
    vm.clouds = false;
    ////////////////////////////////////////////////////////

    function kidColor(index) {
      let name = 'kid-color' + index;
      return name;
    }
    function toMenu() {
      console.log('toMenu');
      $state.go('menu');
    }
    function kidLogs(index) {
      console.log('index', index);
      $localStorage.log_index = index;
      console.log('kidLogs');
      // $state.go('logs');
    }
    function emptyKids() {
      let status = true;
      for (let i = 0; i<vm.kids.length; i++) {
        if (vm.kids[i].payment) {
          status = false;
          break;
        }
      }
      return status;
    }
  }
})();
