;(function () {
  'use strict';

  angular.module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$localStorage', '$timeout', '$window', '$ionicModal', '$scope', '$ionicSlideBoxDelegate', 'userService'];


  function SettingsController($state, $localStorage, $timeout, $window, $ionicModal, $scope, $ionicSlideBoxDelegate, userService) {
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
    vm.addParent = addParent;
    vm.toTC = toTC;

    vm.settings = 'settings';


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
    function addParent() {
      console.log('addParent');
      // $state.go('notifications');
    }
    function toTC() {
      console.log('to terms & conditions');
      $state.go('terms-conditions');
    }


    $ionicModal.fromTemplateUrl('tutorial-modal', {
      scope: $scope,
    }).then(function (modal) {
      $scope.tutorialModal = modal;
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
