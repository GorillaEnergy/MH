;(function () {
  'use strict';

  angular.module('app')
    .controller('KidController', KidController);

  KidController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', '$stateParams', 'countryCodes',
                              'userService', '$localStorage', '$timeout', 'kids'];


  function KidController($ionicPopup, $ionicModal, $state, $scope, $stateParams, countryCodes,
                            userService, $localStorage, $timeout, kids) {
    const vm = this;

    vm.kidPosition = kidPosition;
    vm.kidColorModal = kidColorModal;
    vm.continue = continueSave;
    vm.chosenCountry = chosenCountry;
    vm.openList = openList;
    vm.closeList = closeList;
    vm.editKid = editKid;

    // vm.create = $stateParams.data;
    vm.create = 'create';
    vm.kids = kids;
    // console.log('$stateParams', $stateParams);

    vm.countryCodes = countryCodes;
    vm.countryCode = countryCodes[0].code; //country be default
    vm.phone = '';

    vm.warning = {name: false, date: false, id_number: false, grade: false, phone: false};

    vm.animation = false;
    function openList() {
      if (!vm.animation) { vm.animation = true; }
    }
    function closeList() {
      vm.animation = false;
    }

    function kidPosition(index, status) {
      if (status) { return 'kid-before-position-' + index; }
      else { return 'kid-after-position-' + index; }
    }
    function kidColorModal(index) {
      return 'kid-modal-' + index;
    }

    function editKid(kid, index) {
      if (vm.animation) {
        console.log(index);
        console.log(kid);
      }
    }

    function continueSave() {
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

        if (!vm.date) {
          vm.warning.date = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.date = false
          }, 1500);
        }

        if (!vm.id_number) {
          vm.warning.id_number = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id_number = false
          }, 1500);
        } else if (String(vm.id_number).length < 9) {
          vm.warning.id_number = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id_number = false
          }, 1500);
        }

        if (!vm.grade) {
          vm.warning.grade = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.grade = false
          }, 1500);
        }

        if (String(vm.phone).length < 9) {
          vm.warning.phone = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.phone = false
          }, 1500);
        }
      }

      function send() {
        let data = {
          name: vm.name,
          birth_date: vm.date,
          id_number: vm.id_number,
          grade: vm.grade,
          phone: vm.phone,
          code: vm.countryCode
        };
        console.log('data', data);

        // if (permissionToSend) {
        //   userService.createKid(data).then(function (res) {
        //     console.log(res);
        //     if(res.status === 'success') {
              let kids = $localStorage.kids;
              if (!kids) { kids = []; }
              // kids.push(res.data);
              kids.push(data);
              $localStorage.kids = kids;
          //   }
          // })
        // }
      }
    }

    $ionicModal.fromTemplateUrl('kid-country-modal', {
      scope: $scope,
      // animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalKidCountry = modal;
    });

    $ionicModal.fromTemplateUrl('show-kids', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.kidsListModal = modal;
    });

    function chosenCountry() {
      $scope.modalKidCountry.hide();
    }
  }
})();
