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

        // if (userService.getUser().role_id === 1) {
        //   return $state.go('kid-main-page');
        // } else if (userService.getUser().role_id === 2) {
        //   return $state.go('parent-main-page');
        // }

        let user = angular.copy($localStorage.user);
        console.log(user);

        if (user.role_id === 2) {
          return http.get(url.kid.uploadKids).then(function (res) {
            $localStorage.kids = [];
            if (res.status = 'success') {
              let kids = angular.copy(res.data);
              $localStorage.kids = kids;

              if (!user.name) {
                // if ($state.current.url !== '/profile') {
                  $state.go('profile');
                // }
              } else {
                let route_to_main_page = false;

                for (let i = 0; i < kids.length; i++) {
                  if (kids[i].payment == '1') {
                      $state.go('parent-main-page');
                    route_to_main_page = true;
                    break;
                  }
                }

                if (route_to_main_page) {
                  $state.go('parent-main-page');
                } else {
                  $state.go('payment');
                }
              }
            }
          });
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
