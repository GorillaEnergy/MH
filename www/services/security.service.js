;(function () {
    'use strict';

    angular.module('service.securityService', [])
        .service('securityService', securityService);

    securityService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$rootScope', '$state', 'userService', 'constSvc', 'firebaseDataSvc'];

    function securityService(http, url, $localStorage, $sessionStorage, $rootScope, $state, userService, constSvc, firebaseDataSvc) {
        let model = {};
        model.onlyKid = onlyKid;
        model.onlyParent = onlyParent;
        model.commonAccess = commonAccess;
        return model;

        function onlyKid() {
            if (!userService.getToken()) {
                return $state.go('authorization');
            } else if (userService.getUser().role_id === constSvc.ROLE.PARENT) {
                return $state.go('parent-main-page');
            }
        }

        function onlyParent() {
            if (!userService.getToken()) {
                return $state.go('authorization');
            } else if (userService.getUser().role_id === constSvc.ROLE.KID) {
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
