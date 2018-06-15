;(function () {
  'use strict';

  angular.module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$localStorage', '$timeout', '$interval', '$window', '$anchorScroll', '$location', 'userService'];


  function SettingsController($state, $localStorage, $timeout, $interval, $window, $anchorScroll, $location, userService) {
    const vm = this;

    $timeout(function () {$(".main-block").height($(".content").height());});
    angular.element($window).bind("resize",function(e){$(".main-block").height($(".content").height());});

    vm.toMenu = toMenu;

    vm.toNotifications = toNotifications;
    vm.toTutorial = toTutorial;
    vm.toProfile = toProfile;
    vm.toKid = toKid;
    vm.addParent = addParent;
    vm.toTC = toTC;

    vm.settings = 'settings';


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

  }

})();
