;(function () {
  'use strict';

  angular.module('app')
    .controller('MenuController', MenuController);

  MenuController.$inject = ['$state', 'userService'];


  function MenuController($state, userService) {
    const vm = this;

    vm.toMainPage = toMainPage;
    vm.paymentDetail = paymentDetail;
    vm.settings = settings;
    vm.additionalContent = additionalContent;
    vm.logout = logout;
    vm.aboutUs = aboutUs;
    vm.contactUs = contactUs;

    function toMainPage() {
      let user_role = userService.getUser().role_id;
      if (user_role == '1') {
        $state.go('kid-main-page');
      } else if (user_role == '2') {
        $state.go('parent-main-page');
      }
    }
    function paymentDetail() {
      console.log('payment-detail');
      // $state.go('payment-detail');
    }
    function settings() {
      console.log('to settings');
      $state.go('settings');
    }
    function additionalContent() {
      console.log('additional-content');
    }
    function logout() {
      console.log('logout');
      userService.logout();
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
