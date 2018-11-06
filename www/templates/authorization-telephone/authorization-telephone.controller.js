;(function () {
    'use strict';

    angular.module('app')
        .controller('AuthorizationController', AuthorizationController);

    AuthorizationController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', '$localStorage', 'countries', 'userService', '$timeout', 'fcm', 'toastr'];


    function AuthorizationController($ionicPopup, $ionicModal, $state, $scope, $localStorage, countries, userService, $timeout, fcm, toastr) {
        const vm = this;

        vm.checkPhone = checkPhone;
        vm.checkCode = checkCode;
        vm.sendAgain = sendAgain;
        vm.changeNumber = changeNumber;
        vm.chosenCountry = chosenCountry;
        vm.countryCodes = countries;
        // if (countries.length) { vm.countryCode = countries[108].code; }//country be default Israel
        if (countries.length) {
            // vm.countryCode = countries[235].code;
            vm.countryCode = null;
        } //country be default Ukraine
        // vm.phone = '';
        // vm.phone = '3311225544';
        // vm.phone = '8877665544';
        vm.phone = '';
        vm.phoneNumberFull = '';
        vm.approvalCode = '';
        vm.isAgreePrivacy = false;
        vm.show = {phoneMenu: true, codeApproval: false};
        let token_device = $localStorage.token_device;

        vm.setPhone = () => {
            userService.setPhone(vm.phone);
            $scope.termsConditions.show();
        };

        function checkPhone() {
            if (!vm.isAgreePrivacy) {
                toastr.error('Check privacy policy');
                return;
            }
            if (vm.phone.length >= 7) {
                vm.phoneNumberFull = vm.countryCode + vm.phone;
                vm.show.phoneMenu = false;
                vm.show.codeApproval = true;
                sendPhone();
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
            let data = {
                phone: vm.phone,
                code: vm.countryCode
            };
            userService.checkPhone(data).then(function (res) {
                if (res.status === 'success') {
                    console.log(res);
                    vm.approvalCode = res.data;
                } else if (res.status === 'error' && res.message === 'Access denied') {
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

        $ionicModal.fromTemplateUrl('terms-conditions', {
            scope: $scope,
        }).then(function (modal) {
            $scope.termsConditions = modal;
        });
    }
})();
