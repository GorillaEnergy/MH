;(function () {
  'use strict';

  angular.module('app')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal'];


  function RegistrationController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal) {
    const vm = this;

    // userService.setPhone({phone: '+380503332211'});

    vm.save = save;

    vm.warning = {name: false, email: false, id: false};

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

        if (!vm.id) {
          vm.warning.id = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id = false
          }, 1500);
        } else if (String(vm.id).length < 6) {
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
            id: vm.id,
            name: vm.name,
            email: vm.email,
            phone: userService.getPhone()
          };

          if (status) {
            status = false;
            userService.register(data).then(function (res) {
              // status = true;
              console.log(res);

              if (res.success) {
                console.log('OK, go next step -->');
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
