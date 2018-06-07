;(function () {
  'use strict';

  angular.module('service.securityService', [])
    .service('securityService', securityService);

  securityService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$rootScope', '$state', 'userService'];


  function securityService(http, url, $localStorage, $sessionStorage, $rootScope, $state, userService) {
    let model = {};
    model.authorization = authorization;
    model.onlyKid = onlyKid;
    model.onlyParent = onlyParent;
    model.commonAccess = commonAccess;


    return model;

    function authorization() {
      if (userService.getToken()) {

        if (userService.getUser().role_id === 1) {
          return $state.go('kid-main-page');
        } else if (userService.getUser().role_id === 2) {
          return $state.go('parent-main-page');
        }

      }
    }
    function onlyKid() {
      if (!userService.getToken()) {
        return $state.go('authorization');
      } else if (userService.getUser().role_id === 2) {
        return $state.go('parent-main-page');
      }
    }
    function onlyParent() {
      if (!userService.getToken()) {
        return $state.go('authorization');
      } else if (userService.getUser().role_id === 1) {
        return $state.go('kid-main-page');
      }
    }
    function commonAccess() {
      if (!userService.getToken()) {
        return $state.go('authorization');
      }
    }

  }
})
();
