;(function () {
  'use strict';

  angular.module('app')
    .controller('ConsultantListController', ConsultantListController);

  ConsultantListController.$inject = ['$state', '$window', '$timeout', '$localStorage', 'RTCService', 'consultants'];


  function ConsultantListController($state, $window, $timeout, $localStorage, RTCService, consultants) {
    const vm = this;

    vm.consultants = consultants;

    vm.call = call;
    vm.reload = reload;

    vm.userOnlineStatus = userOnlineStatus;
    vm.accesToCall = accesToCall;

    let fb = firebase.database();

    //////////////// Users list and online status////////////////
    vm.users = $localStorage.user;
    vm.userOnlineStatusArr = [];
    watchOnline(consultants);

    function userOnlineStatus(index) {
      if (vm.userOnlineStatusArr[index]) {
        return 'online-status'
      }
    }

    function accesToCall(index) {
      if (vm.userOnlineStatusArr[index]) {
        return true;
      } else {
        return false;
      }
    }

    function watchOnline(users) {
      angular.forEach(users, function (user, key) {
        fb.ref('/WebRTC/users/' + user.id + '/online').on('value', (snapshot) => {
          $timeout(function () {
            if (snapshot.val()) {
              vm.userOnlineStatusArr[key] = true;
            } else {
              vm.userOnlineStatusArr[key] = false;
            }
          })
        });
      });
    }

    ///////////////////////////////////////////////////////////////////
    function call(user) {
      RTCService.callTo(user);
    }
    function reload() {
      // $state.reload();
      $window.location.reload();
    }
  }

})();