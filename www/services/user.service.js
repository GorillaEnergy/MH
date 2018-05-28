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

        model.setToken = setToken;
        model.getToken = getToken;

        model.setPhone = setPhone;
        model.getPhone = getPhone;

        model.userUpdate = userUpdate;
        model.setUser = setUser;
        model.getUser = getUser;

        model.createKid = createKid;
        model.uploadKids = uploadKids;
        model.setKids = setKids;
        model.getKids = getKids;

        model.getFollowers = getFollowers;

        model.setKidIndex = setKidIndex;
        model.getKidIndex = getKidIndex;



        return model;

        function checkPhone(data) {
            return http.post(url.auth.checkPhone, data)
        }
        function login(data, phone) {
            return http.post(url.auth.login, data).then(function (res) {
                setUser(res.data.user);
                setToken(res.data.token);
                setPhone(phone);

                if (!res.data.user.name) {
                  $state.go('profile');
                } else if (res.data.user.role_id === 2) {
                  console.log('Маршрутизация на parent-main-page, пока не подключена');
                  // $state.go('parent-main-page');
                } else if (res.data.user.role_id === 1) {
                  $state.go('kid-main-page');
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

        function setToken(token) {
        $localStorage.token = token;
      }
        function getToken() {
          return $localStorage.token;
        }

        function setPhone(phone) {
          $localStorage.phone = phone;
        }
        function getPhone() {
          return $localStorage.phone;
        }

        function userUpdate(data) {
          return http.post(url.user.userUpdate, data);
        }
        function setUser(user) {
        $localStorage.user = user;
      }
        function getUser() {
            return $localStorage.user;
        }

        function createKid(data) {
          return http.post(url.user.createKid, data);
        }
        function uploadKids() {
          return http.get(url.user.uploadKids).then(function (res) {
            setKids(res.data);
          });
        }
        function setKids(kids) {
          $localStorage.kids = kids;
        }
        function getKids() {
          return $localStorage.kids;
        }

        function getFollowers() {
          // return http.get(url.user.uploadFollowers).then(function (res) {
            // return res.data;
            return [
                {
                  "phone": "0957706890",
                  "code": "+380"
                },
                // {
                //   "phone": "0681662023",
                //   "code": "+380"
                // }
            ];

          // });
        }

        function setKidIndex(index) {
          $localStorage.kid_index = index;
        }
        function getKidIndex() {
          return $localStorage.kid_index;
        }
    }
})
();
