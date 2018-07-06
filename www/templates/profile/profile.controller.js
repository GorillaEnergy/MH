;(function () {
  'use strict';

  angular.module('app')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal',
                               '$localStorage', 'user', 'toastr', '$ionicSlideBoxDelegate'];


  function ProfileController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal,
                             $localStorage, user, toastr, $ionicSlideBoxDelegate) {
    const vm = this;

    vm.save = save;
    vm.closeTutorial = closeTutorial;

    vm.backToSettingsAccess = backToSettingsAccess;
    vm.backToSettings = backToSettings;

    vm.warning = {name: false, email: false, id: false};

    vm.name = user.name;
    vm.email = user.email;
    vm.id_number = user.id_number;

    console.log(user);

    let newUser = !user.name;
    let outgoing_from_settings = angular.isDefined($localStorage.outgoing_from_settings);

    showTutorial();

    function save() {
      let permissionToSend = true;
      checkFields();
      send();

      function checkFields() {
        if (!vm.id_number) {
          toastr.error('Please enter the id number');
          vm.warning.id = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id = false
          }, 1500);
        } else if (String(vm.id_number).length < 9) {
          toastr.error('Minimum length of the id number field 9');
          vm.warning.id = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.id = false
          }, 1500);
        }

        if (!vm.email) {
          // console.log(vm.email);
          toastr.error('Please enter correct email');
          vm.warning.email = true;
          permissionToSend = false;
          $timeout(function () {
            vm.warning.email = false
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

      function send() {
        let toastrType = '';
        if ($localStorage.user.name) { toastrType = 'update' } else { toastrType = 'new' }

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
              if (res.status === "success") {

                if (toastrType === 'new') {
                  toastr.success('Successfully added');
                } else {
                  toastr.success('Successfully updated');
                }

                let toKidsPage = true;
                if (angular.isDefined($localStorage.kids)) {
                  let kids = $localStorage.kids;
                  for (let i = 0; i < kids.length; i++) {
                    if ( kids[i].register == '1' ) { toKidsPage = false; break; }
                  }
                }

                if (toKidsPage) {
                  delete $localStorage.kid_index;
                  delete $localStorage.outgoing_from_settings;
                  $state.go('kid')
                } else {
                  if (newUser) {
                    $state.go('parent-main-page')
                  } else {
                    $state.go('settings')
                  }
                }
              } else {
                // toastr.error(res.data.message);
                toastr.error(res.message);
              }
            })
          }
        }
      }
    }

    function showTutorial() {
      // if (!angular.isDefined($localStorage.kids)) {
      if (!$localStorage.user.name) {
        $timeout(function () { $scope.tutorialModal.show(); }, 1000)
      }
    }

    function backToSettingsAccess() {
      return outgoing_from_settings
    }
    function backToSettings() {
      delete $localStorage.outgoing_from_settings;
      $state.go('settings');
    }


    $ionicModal.fromTemplateUrl('tutorial-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.tutorialModal = modal;
    });

    function closeTutorial() {
      $scope.tutorialModal.hide();
    }

  }
})();
