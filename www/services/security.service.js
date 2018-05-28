;(function () {
  'use strict';

  angular.module('service.securityService', [])
    .service('securityService', securityService);

  securityService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$rootScope', '$state', 'userService'];


  function securityService(http, url, $localStorage, $sessionStorage, $rootScope, $state, userService) {
    let model = {};
    model.authorization = authorization;
    model.profile = profile;
    model.kid = kid;
    model.payment = payment;
    model.isLoggedIn = isLoggedIn;


    return model;

    function authorization() {
      if (userService.getToken()) {
        return $state.go('menu');
      }
    }

    function profile() {
      if (!userService.getToken()) {
        return $state.go('authorization');
      } else if (userService.getUser().role_id === 1) {
        return $state.go('main-child');
      }
    }

    function kid() {
      if (!userService.getToken()) {
        return $state.go('authorization');
      } else if (userService.getUser().role_id === 1) {
        return $state.go('main-child');
      }
    }

    function payment() {
      if (!userService.getToken()) {
        return $state.go('authorization');
      } else if (userService.getUser().role_id === 1) {
        return $state.go('main-child');
      }
    }

    function isLoggedIn() {
      if (!userService.getToken()) {
        return $state.go('authorization');
      }
    }

  }
})
();
