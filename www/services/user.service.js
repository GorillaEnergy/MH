;(function () {
    'use strict';

    angular.module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$rootScope', '$state'];


    function userService(http, url, $localStorage, $sessionStorage, $rootScope, $state) {
        let model = {};
        model.checkPhone = checkPhone;
        model.logout = logout;

        model.setPhone = setPhone;
        model.getPhone = getPhone;

        model.register = register;

        model.getUser = getUser;
        model.setUser = setUser;


        return model;

        function checkPhone(data) {
            return http.post(url.user.checkPhone, data)
        }
        function logout() {
            return http.post(url.user.logout).then(function (res) {
                $localStorage.$reset();
                $sessionStorage.$reset();
                $state.go('login')
            });
        }
        function setPhone(phone) {
            $localStorage.phone = phone;
        }
        function getPhone() {
            return $localStorage.phone.phone;
        }
        function register(data) {
          return http.post(url.user.register, data)
        }
        function getUser() {
            return $localStorage.user;
        }
        function setUser(user) {
            $localStorage.user = user;
            // $rootScope.isLogged = user !== undefined;
        }

    }
})
();
