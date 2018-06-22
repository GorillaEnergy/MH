;(function () {
  'use strict';

  angular.module('app')
    .controller('AuthorizationController', AuthorizationController);

  AuthorizationController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', '$localStorage', 'countries', 'userService', '$timeout'];


  function AuthorizationController($ionicPopup, $ionicModal, $state, $scope, $localStorage, countries, userService, $timeout) {
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
    vm.phone = '674939948';

    vm.phoneNumberFull = '';
    vm.approvalCode = '';

    vm.show = {phoneMenu: true, codeApproval: false};
    // let token_device = '';
    let token_device = 'c4_fDcbikt0:APA91bFy8KG6e-FVdP71DvCdMumtv_8GJyzHv5liRYZ7SELdy_C9zZqktI3vudxlc6-9ki47J7CbnGQZrrMdjW38K2J6p3RVJPp_RSWbR2XN_xz23878-LSGyd0z_F_TyfOP9XkDmSCN';


    // vm.test = function () {
    //   console.log('on-focus');
    // };
    // vm.test2 = function () {
    //   console.log('on-blur');
    // };

    getDeviceToken();
    function getDeviceToken() {
      // if (angular.isDefined(FCMPlugin)) {
      if ($localStorage.token_device) {
        token_device = $localStorage.token_device;
      } else {
        if (typeof FCMPlugin !== 'undefined') {
          FCMPlugin.getToken(
            function (token) {
              console.log('token = ', token);
              token_device = token;
              $localStorage.token_device = token;
            },function (res) {
              {
                console.log(res);
              }
            })
        }
      }

    }

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
          verification_code: vm.approvalCode,
          token_device: token_device
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
        if (res.status == 'success') {
          console.log(res);
          vm.approvalCode = res.data;
        } else {
          console.log('access denied');
          $scope.accessDeniedModal.show();
        }
      })
    }

    $ionicModal.fromTemplateUrl('country-modal', {
      scope: $scope,
      animation: 'animated slideInDown',
    }).then(function (modal) {
      $scope.modalCountry = modal;
    });

    function chosenCountry() {
      $scope.modalCountry.hide();
    }

    $ionicModal.fromTemplateUrl('access-denied', {
      scope: $scope,
    }).then(function (modal) {
      $scope.accessDeniedModal = modal;
    });
  }
})();
