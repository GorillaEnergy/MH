;(function () {
  'use strict';

  angular.module('app')
    .controller('ParentMainPageController', ParentMainPageController);

  ParentMainPageController.$inject = ['$ionicPopup', '$state', '$scope', '$localStorage', '$stateParams', 'userService', '$timeout',
                                      '$ionicModal', 'kids'];


  function ParentMainPageController($ionicPopup, $state, $scope, $localStorage, $stateParams, userService, $timeout,
                                    $ionicModal, kids) {
    const vm = this;

    vm.kidColor = kidColor;
    vm.toMenu = toMenu;
    vm.kidLogs = kidLogs;
    vm.emptyKids = emptyKids;

    // vm.kids = kids;
    vm.kids = kidFilter();
    // console.log('All kids', kids);
    // console.log('Registered kids', vm.kids);


    // не несет смысловой нагрузки, нужно для создания вьюхи
    vm.callRightNow = true;
    vm.lastCall = '12:25';
    // vm.warning = true;
    vm.emptyData = false;
    vm.clouds = false;
    ////////////////////////////////////////////////////////


    function kidFilter() {
      let data = [];
      angular.forEach(kids, function (kid) {
        if (kid.register) { data.push(kid) }
      });
      return data;
    }
    function emptyKids() {
      let status = true;
      for (let i = 0; i<vm.kids.length; i++) {
        if (vm.kids[i].register) {
          status = false;
          break;
        }
      }
      return status;
    }

    function kidColor(index) {
      let name = 'kid-color' + index;
      return name;
    }
    function toMenu() {
      console.log('toMenu');
      $state.go('menu');
    }
    function kidLogs(id) {
      for(let i = 0; i < kids.length; i++) {
        if (id === kids[i].id) { $localStorage.log_index = i; break;}
      }
      console.log('to logs');
      $state.go('logs');
    }
  }
})();
