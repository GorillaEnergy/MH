;(function () {
  'use strict';

  angular.module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$localStorage', '$timeout', '$window', '$ionicModal', '$scope',
                                '$ionicSlideBoxDelegate', 'userService', 'toastr', 'countries'];


  function SettingsController($state, $localStorage, $timeout, $window, $ionicModal, $scope,
                              $ionicSlideBoxDelegate, userService, toastr, countries) {
    const vm = this;

    $timeout(function () {$(".main-block").height($(".content").height());});
    angular.element($window).bind("resize",function(e){$(".main-block").height($(".content").height());});

    vm.access = access;
    vm.toMenu = toMenu;

    vm.toNotifications = toNotifications;
    vm.toTutorial = toTutorial;
    vm.closeTutorial = closeTutorial;
    vm.toProfile = toProfile;
    vm.toKid = toKid;
    vm.addParentModal = addParentModal;
    vm.addParent = addParent;
    vm.toTC = toTC;

    vm.settings = 'settings';
    vm.countryCodes = countries;
    vm.countryCode = userService.getUser().phone.code; //country be default Ukraine
    vm.phone = '';

    function access() {
      let user_role = userService.getUser().role_id;
      if (user_role == '2') { return true; } else { return false; }
    }
    function toMenu() {
      console.log('to menu');
      $state.go('menu');
    }

    function toNotifications() {
      console.log('to notifications');
      $state.go('notifications');
    }
    function toTutorial() {
      console.log('to tutorial');
      // $state.go('tutorial');
      $scope.tutorialModal.show();
    }
    function closeTutorial() {
      console.log('close tutorial');
      // $state.go('tutorial');
      $scope.tutorialModal.hide();
    }
    function toProfile() {
      console.log('to profile');
      $state.go('profile');
    }
    function toKid() {
      console.log('to kid');
      delete $localStorage.kid_index;
      $state.go('kid');
    }
    function addParentModal() {
      console.log('addParent');
      $scope.parentModal.show();
    }
    function toTC() {
      console.log('to terms & conditions');
      $state.go('terms-conditions');
    }


    function addParent() {
      console.log('addFollower');
      let data = {
        phone: vm.phone,
        code: vm.countryCode,
        type: "owner"
      };
      console.log(data);
      userService.addFollower(data).then(function (res) {
        if (res.status === 'success') {
          toastr.success('Parent added');
          $scope.parentModal.hide()
        } else {
          $scope.parentModal.hide()
        }
      })
    }


    $ionicModal.fromTemplateUrl('add-follower-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.parentModal = modal;
    });

    $ionicModal.fromTemplateUrl('country-codes-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.countryModal = modal;
    });

    $ionicModal.fromTemplateUrl('tutorial-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.tutorialModal = modal;
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.sliderData = {};
    $scope.sliderData.currentPage = 0;

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
      // $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
      //   if (newVal != null) {
      //     $scope.sliderData.sliderDelegate.on('slideChangeEnd', function() {
      //       $scope.sliderData.currentPage = $scope.sliderData.sliderDelegate.activeIndex;
      //       //use $scope.$apply() to refresh any content external to the slider
      //       $scope.$apply();
      //     });
      //   }
      // });
    };

    setupSlider();

  }

})();
