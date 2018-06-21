;(function () {
  'use strict';

  angular.module('app')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal',
                               '$localStorage', 'user', 'toastr'];


  function ProfileController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal,
                             $localStorage, user, toastr) {
    const vm = this;

    vm.save = save;
    vm.closeTutorial = closeTutorial;

    vm.newUser = !$localStorage.kids;
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
          toastr.error('Please enter the email');
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
                let toKidsPage = true;
                if (angular.isDefined($localStorage.kids)) {
                  let kids = $localStorage.kids;
                  for (let i = 0; i < kids.length; i++) {
                    if ( kids[i].register == '1' ) { toKidsPage = false; break; }
                  }
                }

                if (toKidsPage) {
                  delete $localStorage.kid_index;
                  $state.go('kid')
                } else {
                  $state.go('settings')
                }
              }
            })
          }
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    $ionicModal.fromTemplateUrl('tutorial-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.tutorialModal = modal;
    });

    showTutorial();
    function showTutorial() {
      if (!angular.isDefined($localStorage.kids)) {
        $timeout(function () { $scope.tutorialModal.show(); }, 1000)
      }
    }
    function closeTutorial() {
      $scope.tutorialModal.hide();
    }



    $scope.sliderData = {};
    $scope.sliderData.bgColors = [];
    $scope.sliderData.currentPage = 0;

    for (let i = 0; i < 10; i++) {
      $scope.sliderData.bgColors.push("bgColor_" + i);
    }

    let setupSlider = function() {
      //some options to pass to our slider
      $scope.sliderData.sliderOptions = {
        initialSlide: 0,
        direction: 'horizontal', //horizontal or vertical
        speed: 300 //0.3s transition
      };

      //create delegate reference to link with slider
      $scope.sliderData.sliderDelegate = null;

      //watch our sliderDelegate reference, and use it when it becomes available
      $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
        if (newVal != null) {
          $scope.sliderData.sliderDelegate.on('slideChangeEnd', function() {
            $scope.sliderData.currentPage = $scope.sliderData.sliderDelegate.activeIndex;
            //use $scope.$apply() to refresh any content external to the slider
            $scope.$apply();
          });
        }
      });
    };

    setupSlider();


  }
})();
