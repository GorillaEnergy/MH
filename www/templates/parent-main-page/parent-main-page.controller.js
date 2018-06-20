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


    vm.warning = warning;
    vm.callNow = callRightNow;
    vm.clouds = clouds;

    // vm.kids = kids;
    vm.kids = kidFilter();
    // console.log('All kids', kids);
    // console.log('Registered kids', vm.kids);


    // не несет смысловой нагрузки, нужно для создания вьюхи
    vm.kidsStatus = [
      {
        callRightNow: true,
        lastCall: '12:25',
        warning: false,
        clouds: true,
      },
      {
        callRightNow: false,
        lastCall: '12:25',
        warning: true,
        clouds: true,
      },
      {
        callRightNow: false,
        lastCall: '15:43',
        warning: false,
        clouds: false,
      }
    ];
    ////////////////////////////////////////////////////////


    function warning(index) {
      if (index < 2) {
        return vm.kidsStatus[index].warning;
      } else {
        return false;
      }
    }
    function callRightNow(index) {
      if (index < 2) {
        return vm.kidsStatus[index].callRightNow;
      } else {
        return false;
      }
    }
    function clouds(index) {
      if (index < 2) {
        return vm.kidsStatus[index].clouds;
      } else {
        return false;
      }
    }

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
      if (index < 2) {
        if (vm.kidsStatus[index].warning) {
          return 'kid-emergency-bg'
        } else if (vm.kidsStatus[index].callRightNow) {
          return 'kid-call-now-bg'
        }
      }
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
