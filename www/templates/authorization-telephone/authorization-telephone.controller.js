;(function () {
  'use strict';

  angular.module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', 'countryCodes', 'userService'];


  function LoginController($ionicPopup, $ionicModal, $state, $scope, countryCodes, userService) {
    const vm = this;

    vm.checkPhone = checkPhone;
    vm.checkCode = checkCode;
    vm.sendAgain = sendAgain;
    vm.changeNumber = changeNumber;
    vm.chosenCountry = chosenCountry;

    vm.countryCodes = countryCodes;
    vm.countryCode = countryCodes[0].code; //country be default
    vm.phone = '';
    vm.phoneNumberFull = '';
    vm.approvalCode = '';

    vm.show = {phoneMenu: true, codeApproval: false};

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
      // $state.go('confirmation', {data: vm.phoneNumber})
    }

    function sendPhone() {
      let data = {phone: vm.phoneNumberFull};
      userService.checkPhone(data).then(function (res) {
        console.log(res);
      })
    }


    $ionicModal.fromTemplateUrl('country-modal', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalCountry = modal;
    });

    function chosenCountry() {
      $scope.modalCountry.hide();
    }
  }
})();
