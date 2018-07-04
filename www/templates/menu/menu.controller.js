;(function () {
  'use strict';

  angular.module('app')
    .controller('MenuController', MenuController);

  MenuController.$inject = ['$state', '$localStorage', '$sessionStorage', 'userService'];


  function MenuController($state, $localStorage, $sessionStorage, userService) {
    const vm = this;

    vm.userType = userType;

    vm.toMainPage = toMainPage;
    vm.paymentDetail = paymentDetail;
    vm.settings = settings;
    vm.additionalContent = additionalContent;
    vm.logout = logout;
    vm.aboutUs = aboutUs;
    vm.contactUs = contactUs;

    let user_role = angular.copy(userService.getUser().role_id);
    function userType(type) {
        if (type === 'parent' && user_role == '2') {
          return true;
        } else if (type === 'kid' && user_role == '1') {
          return true;
        } else  {
          return false;
        }
    }

    function toMainPage() {
      let user_role = userService.getUser().role_id;
      if (user_role == '1') {
        $state.go('kid-main-page');
      } else if (user_role == '2') {
        $state.go('parent-main-page');
      }
    }
    function paymentDetail() {
      console.log('payments-history');
      $state.go('payments-history');
    }
    function settings() {
      console.log('to settings');
      $state.go('settings');
    }
    function additionalContent() {
      console.log('additional-content');
      $state.go('additional-content');
    }
    function logout() {
      console.log('logout');
      userService.logout();

      // ionic.Platform.exitApp();
    }
    function aboutUs() {
      console.log('about-us');
      $state.go('about-us')
    }
    function contactUs() {
      console.log('contact-us');
    }
  }
})();
