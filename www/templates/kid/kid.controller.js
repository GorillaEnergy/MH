;(function () {
  'use strict';

  angular.module('app')
    .controller('KidController', KidController);

  KidController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', 'countryCodes', 'userService',
    '$localStorage', '$timeout', 'kids', 'followers', 'countries', 'toastr'];


  function KidController($ionicPopup, $ionicModal, $state, $scope, countryCodes, userService,
                         $localStorage, $timeout, kids, followers, countries, toastr) {
    const vm = this;

    vm.kidPosition = kidPosition;
    vm.kidColorAnimation = kidColorAnimation;
    vm.continue = toPayment;
    vm.saveCurrentKid = saveCurrentKid;
    vm.addAnotherKid = addAnotherKid;
    vm.removeKid = removeKid;
    vm.removeKidModal = removeKidModal;

    vm.addFollower = addFollower;
    vm.followerPhone = followerPhone;
    vm.removeFollower = removeFollower;

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

    vm.dateConverter = dateConverter;

    vm.toMainPage = toMainPage;
    vm.backToSettingsAccess = backToSettingsAccess;
    vm.backToSettings = backToSettings;


    vm.viewType = {new_kid: false, edit_registered_kid: false, edit_unregistered_kid: false};
    vm.warning = {name: false, date: false, id_number: false, grade: false, phone: false};

    vm.kids = kidFilter();
    vm.followers = followers;
    vm.countryCodes = countries;
    vm.countryCode = userService.getPhone().code; //country be default
    vm.phone = '';

    vm.countryCodeFollower = userService.getPhone().code; //country be default
    vm.phoneFollower = '';
    vm.useCodeForKid = true;
    vm.birth_date = new Date();

    vm.animation = false;

    let outgoing_from_settings = angular.isDefined($localStorage.outgoing_from_settings);

    console.log('vm.kids = ', vm.kids);
    console.log('vm.followers = ', vm.followers);

    function kidFilter() {
      let kids = userService.getKids();
      let kid_index = userService.getKidIndex();
      let data = [];

      if (angular.isDefined(userService.getKidIndex())) {
        if (kids[userService.getKidIndex()].payment) {
          getRegisteredKid()
        } else {
          getUnregisteredKid()
        }
      } else {
        getUnregisteredKid()
      }

      function getRegisteredKid() {
        console.log('getRegisteredKid');
        let kid = kids[kid_index];
        data.push(kid);
      }
      function getUnregisteredKid() {
        console.log('getUnregisteredKid');
        let maximum_kid = 6;
        angular.forEach(kids, function (kid, index) {
          if (!kid.payment && index <= maximum_kid ) { data.push(kid) }
        });
      }
      return data;
    }

    speciesDefinition();

    function speciesDefinition() {
      console.log('speciesDefinition');
      let kids = userService.getKids();
      //3 состояния (новый ребёнок, редактирование оплаченого ребёнка, редактирование неоплаченного ребёнка)
      if (!angular.isDefined(userService.getKidIndex())) {
        vm.viewType.new_kid = true;
        vm.viewType.edit_registered_kid = false;
        vm.viewType.edit_unregistered_kid = false;
        resetView();
        console.log('new_kid');
      } else {
        let kid_index = userService.getKidIndex();
        console.log('kid_index = ', kid_index);
        //проверка на коректность данных
        if (kids.length) {
          //проверка оплаты
          console.log(kids[kid_index].payment);
          if (kids[kid_index].payment == '1') {
            vm.viewType.new_kid = false;
            vm.viewType.edit_registered_kid = true;
            vm.viewType.edit_unregistered_kid = false;
            console.log('edit_registered_kid');
            kidDetail(kid_index);
          } else {
            vm.viewType.new_kid = false;
            vm.viewType.edit_registered_kid = false;
            vm.viewType.edit_unregistered_kid = true;
            console.log('edit_unregistered_kid');
            kidDetail(kid_index);
          }

        } else {
          console.log('error, have index but not have a kids');
        }
      }
    }

    function showCountryModal(type) {
      type ? vm.useCodeForKid = true : vm.useCodeForKid = false;
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


    function openList() {
      if (!vm.animation) {
        vm.animation = true;
      }
    }

    // $timeout(function () {
      // showKidMatchModal();
    // }, 5000);

    function closeList() {
      console.log('closeList');
      vm.animation = false;
    }

    function kidPosition(index, status) {
      if (status) {
        return 'kid-before-position-' + index;
      }
      else {
        return 'kid-after-position-' + index;
      }
    }

    function kidColorAnimation(index) {
      if (index <= 5) {
        return 'kid-color-' + index;
      } else {
        return 'kid-color-overflow';
      }
    }

    function editKid(kid) {
      let kids = userService.getKids();
      console.log('editKid');
      console.log(kid);
      console.log('kids = ', kids);
      console.log('vm.kids = ', vm.kids);
      if (vm.animation) {
        for (let i = 0; i < kids.length; i++) {
          if (kids[i].id === kid.id) {
            $localStorage.kid_index = i;
          }
        }

        speciesDefinition();
        closeList();
      }
    }

    function toPayment() {
      saveKid('toPayment');
    }

    function saveCurrentKid() {
      console.log('saveCurrentKid registered');
      saveKid('toLogs');
    }

    function addAnotherKid() {
      saveKid('addAnother');
    }

    function removeKid() {
      console.log('removeKid');
      let kids = userService.getKids();
      console.log(vm.kids);
      console.log(kids);
      let data = {kid_id: kids[$localStorage.kid_index].id};
      console.log(data);
      userService.deleteKid(data).then(function (res) {
        console.log(res);
        if (res.status == "success") {
          // vm.kids.length > 1 ? vm.kids.splice($localStorage.kid_index, 1) : vm.kids = [];
          // $localStorage.kids = angular.copy(vm.kids);
          // kids = angular.copy(vm.kids);
          // kids = angular.copy($localStorage.kids);


          kids.splice($localStorage.kid_index, 1);
          $localStorage.kids = angular.copy(kids);
          delete $localStorage.kid_index;

          vm.kids = kidFilter();
          speciesDefinition();
        } else {
          console.log('remove err');
        }
      })
    }

    function removeKidModal() {
      console.log('removeKidModal');
      let data = { kid_id: vm.kids[0].id };
      userService.deleteKid(data).then(function (res) {
        console.log(res);
        if (res.status == "success") {
          vm.kids.length > 1 ? vm.kids.splice($localStorage.kid_index, 1) : vm.kids = [];

          let kids = userService.getKids();
          kids.splice($localStorage.kid_index, 1);
          $localStorage.kids = angular.copy(kids);
          delete $localStorage.kid_index;
          hideKidRemoveModal();

          $state.go('parent-main-page')
        } else {
          toastr.error(res.message);
        }
      })
    }

    function saveKid(type) {
      console.log('saveKid type = ', type);
      let permissionToSend = true;
      checkFieldsToFill();
      checkForCoincidence();

      if (permissionToSend) {
        send();
      }


      function checkFieldsToFill() {
        if (String(vm.phone).length < 9) {
          toastr.error('Please enter the phone (minimum 9 char)');
          vm.warning.phone = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.phone = false
          }, 1500);
        }

        if (!vm.grade) {
          toastr.error('Please enter the grade');
          vm.warning.grade = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.grade = false
          }, 1500);
        }

        if (!vm.id_number) {
          toastr.error('Please enter the id number');
          vm.warning.id_number = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id_number = false
          }, 1500);
        } else if (String(vm.id_number).length < 9) {
          toastr.error('Minimum length of the id number field 9');
          vm.warning.id_number = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id_number = false
          }, 1500);
        }

        if (vm.birth_date > new Date()) {
          toastr.error('Incorrect date');
          vm.warning.date = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.date = false
          }, 1500);
        }


        if (!vm.name) {
          toastr.error('Please enter the name');
          vm.warning.name = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.name = false
          }, 1500);
        } else if (vm.name.length < 4 || vm.name.indexOf(' ') === -1) {
          toastr.error('Please enter the first name and last name');
          vm.warning.name = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.name = false
          }, 1500);
        }
      }

      function checkForCoincidence() {
        let coincidence = false;
        let kids = userService.getKids();
        console.log(vm.kids);
        console.log(kids);

        if (vm.kids.length && permissionToSend) {
          for (let i = 0; i < kids.length; i++) {
            let kid = kids[i];

            if (i !== $localStorage.kid_index) {
              if (kid.id_number == vm.id_number || kid.phone.phone == vm.phone) {
                permissionToSend = false;
                coincidence = true;
                console.log('id_number or phone is match');
                break;
              }
            }
          }
        }

        if (coincidence) {
          showKidMatchModal();
        }
      }

      function send() {
        let kids = userService.getKids();
        let kid = kids[userService.getKidIndex()];
        let data = {
          name: vm.name,
          birth_date: vm.birth_date * 1,
          id_number: vm.id_number,
          grade: vm.grade
        };

        if (angular.isDefined($localStorage.kid_index)) {
          data.kid_id = kid.id;
          data.phone = {phone: vm.phone, code: vm.countryCode};

          userService.updateKid(data).then(function (res) {
            console.log(res);
            if (res.status === 'success') {
              toastr.success('Successfully updated');

              let kidsList = $localStorage.kids;
              kidsList[$localStorage.kid_index] = res.data;
              $localStorage.kids = angular.copy(kidsList);
              vm.kids[$localStorage.kid_index] = res.data;

              if (type === 'toPayment') {
                console.log('$state.go(\'payment\');');
                $state.go('payment');
              } else if (type === 'toLogs') {
                console.log('$state.go(\'logs\');');
                $localStorage.log_index = angular.copy($localStorage.kid_index);
                $state.go('logs');
              }
            } else if (res.message) {
              toastr.error(res.message);
            }
          })
        } else {
          data.phone = vm.phone;
          data.code = vm.countryCode;
          userService.createKid(data).then(function (res) {
            console.log(res);
            if (res.status === 'success') {
              toastr.success('Successfully added');

              let kidsList = $localStorage.kids;
              if (!kidsList) {
                kidsList = [];
              }
              kidsList.push(res.data);
              $localStorage.kids = angular.copy(kidsList);
              vm.kids.push(res.data);

              if (type === 'addAnother') {
                resetView();
              } else if (type === 'toPayment') {
                console.log('$state.go(\'payment\');');
                $state.go('payment');
              }
            } else if (res.message) {
              toastr.error(res.message);
              showKidMatchModal();
            }
          })
        }
      }
    }

    function resetView() {
      vm.name = null;
      vm.birth_date = new Date();
      vm.id_number = null;
      vm.grade = null;
      vm.phone = null;
      vm.code = userService.getPhone().code;
      vm.access = 0;
      vm.payment = 0;
    }

    function kidDetail(index) {
      let kids = userService.getKids();
      vm.name = kids[index].name;
      vm.birth_date = new Date(Number(kids[index].birth_date));
      vm.id_number = kids[index].id_number;
      vm.grade = kids[index].grade;
      vm.phone = kids[index].phone.phone;
      vm.code = kids[index].phone.code;
      vm.access = angular.copy(kids[index].access);
    }

    function addFollower() {
      console.log('addFollower');
      let data = {
        phone: vm.phoneFollower,
        code: vm.countryCodeFollower,
        kid_id: kids[userService.getKidIndex()].id,
        type: "follower"
      };
      userService.addFollower(data).then(function (res) {
        if (res.status === 'success') {
          vm.followers.push(res.data);
          vm.hideFollowerModal()
        } else {
          console.log('add follower error');
        }
      })
    }
    function followerPhone(follower) {
      return follower.phone.code + ' ' + follower.phone.phone;
    }
    function removeFollower(follower, index) {
      console.log('removeFollower');
      console.log(follower);
      let data = {
        // phone: follower.phone.phone,
        // code: follower.phone.code,
        // kid_id: vm.kids[0].id,
        follower_id: follower.id,
        kid_id: $localStorage.kids[$localStorage.kid_index].id,
        type: "follower"
      };
      userService.removeFollower(data).then(function (res) {
        if (res.status === 'success') {
          vm.followers.splice(index, 1);
        } else {
          console.log('add follower error');
        }
      })

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
      console.log('changeAccessRight');
      let data = {};
      data.kid_id = vm.kids[0].id;
      data.access = access ? 1 : 0;

      userService.changeAccess(data).then(function (res) {
        console.log(res.data.access);
        if (res.status === 'success') {
          vm.access = res.data.access;

          console.log('vm.access = ', vm.access);
        }
      })
    }

    function toMainPage() {
      console.log('toMainPage');
      $state.go('parent-main-page')
    }
    function backToSettingsAccess() {
      return outgoing_from_settings
    }
    function backToSettings() {
      delete $localStorage.outgoing_from_settings;
      $state.go('settings');
    }

    function dateConverter(date) {
      let timestamp = date * 1;

      let day = new Date(timestamp).getDate();
      let month = new Date(timestamp).getMonth() + 1;
      let year = new Date(timestamp).getFullYear();

      if (day < 10) { day = '0' + String(day); }
      if (month < 10) { month = '0' + String(month); }

      return day + '-' + month + '-' + year;
      // return year + '-' + month + '-' + day;
    }
  }
})();
