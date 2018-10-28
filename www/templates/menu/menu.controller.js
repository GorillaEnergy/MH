;(function () {
    'use strict';

    angular.module('app')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$state', '$localStorage', '$sessionStorage', 'userService', 'constSvc'];


    function MenuController($state, $localStorage, $sessionStorage, userService, constSvc) {
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
            if (type === 'parent' && String(user_role) === String(constSvc.ROLE.PARENT)) {
                return true;
            } else if (type === 'kid' && String(user_role) === String(constSvc.ROLE.KID)) {
                return true;
            } else {
                return false;
            }
        }

        function toMainPage() {
            let user_role = userService.getUser().role_id;
            if (String(user_role) === String(constSvc.ROLE.KID)) {
                $state.go('kid-main-page');
            }
            if (String(user_role) === String(constSvc.ROLE.PARENT)) {
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
