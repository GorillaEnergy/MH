;(function () {
  'use strict';

  angular.module('app')
    .controller('MenuController', MenuController);

  MenuController.$inject = ['$ionicPopup', '$state', '$stateParams', 'userService'];


  function MenuController($ionicPopup, $state, $stateParams, userService) {
    const vm = this;

    vm.dots = dots;
    vm.paymentDetail = paymentDetail;
    vm.settings = settings;
    vm.additionalContent = additionalContent;
    vm.logout = logout;
    vm.aboutUs = aboutUs;
    vm.contactUs = contactUs;

    function dots() {
      console.log('dots');
    }
    function paymentDetail() {
      console.log('paymentDetail');
    }
    function settings() {
      console.log('settings');
    }
    function additionalContent() {
      console.log('additionalContent');
    }
    function logout() {
      console.log('logout');
    }
    function aboutUs() {
      console.log('aboutUs');
    }
    function contactUs() {
      console.log('contactUs');
    }
  }
})();
