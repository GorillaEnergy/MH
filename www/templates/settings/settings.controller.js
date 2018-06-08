;(function () {
  'use strict';

  angular.module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$localStorage', '$timeout', '$anchorScroll', '$location', 'userService'];


  function SettingsController($state, $localStorage, $timeout, $anchorScroll, $location, userService) {
    const vm = this;

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

    // //////////////////////////////////////////
    // let root = document.getElementById("root");
    // let uploadTestArr = [0,1,2,3,4,5,6,7,8,9];
    // vm.testArr = [10,11,12,13,14,15,16,17,18,19];
    //
    // /////// scroll position -> bottom ////////
    // // если используется ng-repeat нужно выполнять через $timeout
    //   $timeout(function () {
    //     root.scrollTo(0, root.scrollHeight);
    //   });
    // //////////////////////////////////////////
    //
    //
    // /////// событие при scrollTop === 0 //////
    // angular.element(root).bind('scroll', function(){
    //   if (root.scrollTop === 0) {
    //     let scrollPosition = 'anchor' + vm.testArr[0];
    //     console.log('scrollPosition = ', scrollPosition);
    //
    //     // $location.hash(scrollPosition);
    //     $anchorScroll($location.hash(scrollPosition));
    //
    //     // let tmpArr = uploadTestArr.concat(vm.testArr);
    //     // vm.testArr = tmpArr;
    //
    //     // uploadTestArr.reverse();
    //     // for (let i =0; i< uploadTestArr.length; i++) { vm.testArr.unshift(uploadTestArr[i]) }
    //   }
    // });
    // //////////////////////////////////////////
  }

})();
