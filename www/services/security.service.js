;(function () {
  'use strict';

  angular.module('service.securityService', [])
    .service('securityService', securityService);

  securityService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$rootScope', '$state', 'userService'];


  function securityService(http, url, $localStorage, $sessionStorage, $rootScope, $state, userService) {
    let model = {};
    model.authorization = authorization;
    model.profile = profile;
    model.isLoggedIn = isLoggedIn;


    return model;

    function authorization() {
      if (userService.getToken()) {
        return $state.go('menu');
      }
    }
    function profile() {
      if (!userService.getToken() || userService.getUser().role_id === 1) {
        return $state.go('authorization');
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
