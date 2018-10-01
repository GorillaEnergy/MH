;(function () {
  'use strict';

  angular.module('app')
    .controller('ConsultantListController', ConsultantListController);

<<<<<<< HEAD
  ConsultantListController.$inject = ['$state', '$window', '$timeout', '$localStorage', 'RTCService', 'consultants','$ionicLoading'];


  function ConsultantListController($state, $window, $timeout, $localStorage, RTCService, consultants,$ionicLoading) {
=======
  ConsultantListController.$inject = ['$state', '$window', '$timeout', '$localStorage', 'RTCService', 'consultants',
                                      '$ionicLoading'];


  function ConsultantListController($state, $window, $timeout, $localStorage, RTCService, consultants,
                                    $ionicLoading) {
>>>>>>> 5bb25e8389d17525b91788e7aae7e172c72c3b9f
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
<<<<<<< HEAD
        $ionicLoading.show({
            template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner> <br/> Calling',
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });
=======
      console.log('call <=============');
      $ionicLoading.show({
        template: 'Calling...',
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
>>>>>>> 5bb25e8389d17525b91788e7aae7e172c72c3b9f
      RTCService.callTo(user);
    }
    function reload() {
      // $state.reload();
      // window.location.reload(true);
      $window.location.reload();
    }
  }

})();
