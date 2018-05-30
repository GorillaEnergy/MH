;(function () {
  'use strict';

  angular.module('app')
    .controller('KidController', KidController);

  KidController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', 'countryCodes', 'userService',
                           '$localStorage', '$timeout', 'kids', 'followers', 'countries'];


  function KidController($ionicPopup, $ionicModal, $state, $scope, countryCodes, userService,
                                     $localStorage, $timeout, kids, followers, countries) {
    const vm = this;

    vm.kidPosition = kidPosition;
    vm.kidColorModal = kidColorModal;
    vm.continue = toPayment;
    vm.addAnotherKid = addAnotherKid;
    vm.removeKid = removeKid;
    vm.removeKidModal = removeKidModal;

    vm.addFollower = addFollower;

    vm.showCountryModal = showCountryModal;
    vm.hideCountryModal = hideCountryModal;
    vm.showKidMatchModal = showKidMatchModal;
    vm.hideKidMatchModal = hideKidMatchModal;
    vm.showKidRemoveModal = showKidRemoveModal;
    vm.hideKidRemoveModal = hideKidRemoveModal;
    vm.showFollowerModal = showFollowerModal;
    vm.hideFollowerModal = hideFollowerModal;

    vm.openList = openList;
    vm.closeList = closeList;
    vm.editKid = editKid;
    vm.accessing = accessing;
    vm.changeAccessRight = changeAccessRight;


    vm.viewType = {new_kid: false, edit_registered_kid: false, edit_unregistered_kid: false};
    vm.warning = {name: false, date: false, id_number: false, grade: false, phone: false};

     // delete $localStorage.kid_index;
     $localStorage.kid_index = 1;

    vm.kids = kids;
    vm.followers = followers;
    vm.countryCodes = countries;
    vm.countryCode = userService.getPhone().code; //country be default
    vm.phone = '';

    vm.followerCountryCode = userService.getPhone().code;
    vm.followerPhone = '';

    // console.log('vm.countryCodes = ', vm.countryCodes);
    console.log('vm.kids = ', vm.kids);
    console.log('vm.followers = ', vm.followers);

    speciesDefinition();

    function speciesDefinition() {
      //3 состояния (новый ребёнок, редактирование оплаченого ребёнка, редактирование неоплаченного ребёнка)
      if (!angular.isDefined(userService.getKidIndex())) {
        vm.viewType.new_kid = true;
        console.log('new_kid');
      } else {
        let kid_index = userService.getKidIndex();
        //проверка на коректность данных
        if (vm.kids.length) {
          //проверка оплаты
          console.log(vm.kids[kid_index].payment);
          if (vm.kids[kid_index].payment == '1') {
            vm.viewType.edit_registered_kid = true;
            console.log('edit_registered_kid');
            kidDetail(kid_index);
          } else {
            vm.viewType.edit_unregistered_kid = true;
            console.log('edit_unregistered_kid');
            kidDetail(kid_index);
          }

        } else {
          console.log('error, have index but not have a kids');
        }
      }
      function kidDetail(index) {
        vm.name = kids[index].name;
        vm.birth_date = kids[index].birth_date;
        vm.id_number = kids[index].id_number;
        vm.grade = kids[index].grade;
        vm.phone = kids[index].phone.phone;
        vm.code = kids[index].phone.code;
        vm.access = kids[index].access;
        vm.payment = kids[index].payment;
      }
    }

    function showCountryModal() {
      $scope.countryModal.show();
    }
    function hideCountryModal() {
      $scope.countryModal.hide();
    }
    function showKidMatchModal() {
      $scope.matchModal.show();
    }
    function hideKidMatchModal() {
      $scope.matchModal.hide();
    }
    function showKidRemoveModal() {
      $scope.removeModal.show();
    }
    function hideKidRemoveModal() {
      $scope.removeModal.hide();
    }
    function showFollowerModal() {
      $scope.followerModal.show();
    }
    function hideFollowerModal() {
      $scope.followerModal.hide();
    }


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

    function toPayment() {
      saveKid('toPayment');
    }

    function addAnotherKid() {
      saveKid('addAnother');
    }
    function removeKid() {
      console.log('removeKid');
    }
    function removeKidModal() {
      console.log('removeKidModal');
    }

    function saveKid(type) {
      let permissionToSend = true;
      checkFieldsToFill();
      checkForCoincidence();

      if (permissionToSend) {
        send();
      }


      function checkFieldsToFill() {
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
      function checkForCoincidence() {
        let coincidence = false;

        if (vm.kids.length && permissionToSend) {
          for(let i = 0; i<vm.kids.length; i++) {
            let kid = vm.kids[i];

            if (kid.id_number == vm.id_number || kid.phone.phone == vm.phone) {
              permissionToSend = false;
              coincidence = true;
              console.log('id_number or phone is match');
              break;
            }
          }
        }

        if (coincidence) {
          showKidMatchModal();
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

        userService.createKid(data).then(function (res) {
          console.log(res);
          if(res.status === 'success') {

            let kids = $localStorage.kids;
            if (!kids) { kids = []; }
            kids.push(res.data);
            $localStorage.kids = kids;
            vm.kids.push(res.data);

            if (type === 'addAnother') {
              resetView();
            } else if (type === 'toPayment') {
              console.log('$state.go(\'payment\');');
              $state.go('payment');
            }
          }
        })
      }
      function resetView() {
        vm.name = null;
        vm.date = null;
        vm.id_number = null;
        vm.grade = null;
        vm.phone = null;
      }

    }

    function addFollower() {
      console.log('addFollower');
    }

    $ionicModal.fromTemplateUrl('kid-country-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.countryModal = modal;
    });

    $ionicModal.fromTemplateUrl('kid-match-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.matchModal = modal;
    });

    $ionicModal.fromTemplateUrl('kid-remove-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.removeModal = modal;
    });

    $ionicModal.fromTemplateUrl('add-follower-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.followerModal = modal;
    });


    function accessing() {
      return vm.access == '1';
    }
    function changeAccessRight(access) {
      let data ={};
      // data.id = vm.kids[userService.getKidIndex()].id;
      // data.id_number = vm.kids[userService.getKidIndex()].id_number;
      data.access = access ? 1 : 0;
      userService.userUpdate(data).then(function (res) {
        console.log(res);
      })
    }
    ///////////////////////////
    getFirebaseToken();
    function getFirebaseToken() {
      // $timeout(function () {
        if (typeof FCMPlugin !== 'undefined') {

          FCMPlugin.getToken(function (token) {
            console.log(token);
          });
        } else {
          console.log('FCMPlugin is not defined');
        }
      // }, 5000);
    }
  }
})();
