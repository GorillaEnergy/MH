;(function () {
  'use strict';

  angular.module('app')
    .controller('AuthorizationController', AuthorizationController);

  AuthorizationController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', 'countries', 'userService'];


  function AuthorizationController($ionicPopup, $ionicModal, $state, $scope, countries, userService) {
    const vm = this;

    vm.checkPhone = checkPhone;
    vm.checkCode = checkCode;
    vm.sendAgain = sendAgain;
    vm.changeNumber = changeNumber;
    vm.chosenCountry = chosenCountry;

    vm.countryCodes = countries;
    // vm.countryCode = countries[108].code; //country be default Israel
    // vm.phone = '';

    vm.countryCode = countries[235].code; //country be default Ukraine
    vm.phone = '681662690';

    vm.phoneNumberFull = '';
    vm.approvalCode = '';

    vm.show = {phoneMenu: true, codeApproval: false};


    vm.test = function () {
      console.log('on-focus');
    };
    vm.test2 = function () {
      console.log('on-blur');
    };
    // let fb = firebase.database();
    // fb.ref('/chats/1').push({id: 4, description: 'string'});

    function checkPhone() {
      if (vm.phone.length >= 7) {
        vm.phoneNumberFull = vm.countryCode + vm.phone;
        vm.show.phoneMenu = false;
        vm.show.codeApproval = true;
        sendPhone();
      } else {
        console.log('err!');
      }
    }

    function sendAgain() {
      sendPhone();
    }

    function changeNumber() {
      vm.show.phoneMenu = true;
      vm.show.codeApproval = false;
    }

    function checkCode() {
      console.log('checkCode()');

      if (String(vm.approvalCode).length === 4) {
        let verificationData = {
          phone: vm.phone,
          code: vm.countryCode,
          verification_code: vm.approvalCode
        };

        let phone = {phone: vm.phone, code: vm.countryCode};

        userService.login(verificationData, phone);
      } else {
        console.log('Маловато цыферок :/');
      }
    }

    function sendPhone() {
      let data = {phone: vm.phone, code: vm.countryCode};
      userService.checkPhone(data).then(function (res) {
        console.log(res);
        vm.approvalCode = res.data;
      })
    }


    $ionicModal.fromTemplateUrl('country-modal', {
      scope: $scope,
      animation: 'animated slideInDown',
      // animation: 'slide-in-up',
      // animation: 'fade-in',
      // animation: 'reverse',
      // hideDelay: 1020
    }).then(function (modal) {
      $scope.modalCountry = modal;
    });

    function chosenCountry() {
      $scope.modalCountry.hide();
    }
  }
})();
