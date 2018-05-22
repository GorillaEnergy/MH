;(function () {
  'use strict';

  angular.module('app')
    .controller('AuthorizationController', AuthorizationController);

  AuthorizationController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', 'countryCodes', 'userService'];


  function AuthorizationController($ionicPopup, $ionicModal, $state, $scope, countryCodes, userService) {
    const vm = this;

    vm.checkPhone = checkPhone;
    vm.checkCode = checkCode;
    vm.sendAgain = sendAgain;
    vm.changeNumber = changeNumber;
    vm.chosenCountry = chosenCountry;

    vm.countryCodes = countryCodes;
    // vm.countryCode = countryCodes[0].code; //country be default
    // vm.phone = '';

    vm.countryCode = countryCodes[1].code; //country be default
    vm.phone = '681662690';

    vm.phoneNumberFull = '';
    vm.approvalCode = '';

    vm.show = {phoneMenu: true, codeApproval: false};


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
