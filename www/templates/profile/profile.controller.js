;(function () {
  'use strict';

  angular.module('app')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal',
                               '$localStorage', 'user'];


  function ProfileController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal,
                             $localStorage, user) {
    const vm = this;

    vm.save = save;

    vm.newUser = $localStorage.newUser;
    vm.warning = {name: false, email: false, id: false};

    vm.name = user.name;
    vm.email = user.email;
    vm.id_number = user.id_number;
    console.log(user);

    function save() {
      let permissionToSend = true;
      checkFields();
      send();

      function checkFields() {
        if (!vm.name) {
          vm.warning.name = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.name = false
          }, 1500);
        } else if (vm.name.length < 4 || vm.name.indexOf(' ') === -1) {
          vm.warning.name = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.name = false
          }, 1500);
        }

        if (!vm.email) {
          vm.warning.email = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.email = false
          }, 1500);
        }

        if (!vm.id_number) {
          vm.warning.id = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id = false
          }, 1500);
        } else if (String(vm.id_number).length < 9) {
          vm.warning.id = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id = false
          }, 1500);
        }
      }

      function send() {
        if (permissionToSend) {
          let status = true;

          let data = {
            id_number: vm.id_number,
            name: vm.name,
            email: vm.email
          };

          if (user.role_id === 2) {
            data.type = "parent";
          } else if (user.role_id === 1) {
            data.type = 'kid';
          }

          if (status) {
            console.log('data', data);
            status = false;
            userService.userUpdate(data).then(function (res) {
              status = true;
              userService.setUser(res.data);
              if (res.status ==="success") {
                $state.go('kid', {data: 'create'})
              }
            })
          }
        }
      }
    }


    $ionicModal.fromTemplateUrl('test-modal', {
      scope: $scope
    }).then(function (modal) {
      $scope.testModal = modal;
    });

    function chosenCountry() {
      $scope.testModal.hide();
    }

  }
})();
