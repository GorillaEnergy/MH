;(function () {
    'use strict';

    angular.module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$rootScope', '$state'];


    function userService(http, url, $localStorage, $sessionStorage, $rootScope, $state) {
        let model = {};
        model.checkPhone = checkPhone;
        model.login = login;
        model.logout = logout;

        model.userUpdate = userUpdate;
        model.createKid = createKid;
        model.getKids = getKids;

        model.setPhone = setPhone;
        model.getPhone = getPhone;
        model.getUser = getUser;
        model.getToken = getToken;
        model.setUser = setUser;
        model.setToken = setToken;


        return model;

        function checkPhone(data) {
            return http.post(url.auth.checkPhone, data)
        }
        function login(data, phone) {
            return http.post(url.auth.login, data).then(function (res) {
                setUser(res.data.user);
                setToken(res.data.token);
                setPhone(phone);

                if (res.data.user.email || res.data.user.name) {
                  // $rootScope.newUser = false;
                  $localStorage.newUser = false;
                  $state.go('menu');
                } else {
                  // $rootScope.newUser = true;
                  $localStorage.newUser = true;
                  $state.go('profile');
                }
            });
        }
        function logout() {
            // return http.post(url.auth.logout).then(function (res) {
                $localStorage.$reset();
                $sessionStorage.$reset();
                $state.go('authorization')
            // });
        }

        function userUpdate(data) {
          return http.post(url.user.userUpdate, data);
        }
        function createKid(data) {
          return http.post(url.user.createKid, data);
        }
        function getKids() {
          return $localStorage.kids;
        }

        function getPhone() {
            return $localStorage.phone;
        }
        function getUser() {
            return $localStorage.user;
        }
        function getToken() {
            return $localStorage.token;
        }

        function setPhone(phone) {
          $localStorage.phone = phone;
        }
        function setUser(user) {
            $localStorage.user = user;
        }
        function setToken(token) {
            $localStorage.token = token;
        }

    }
})
();
