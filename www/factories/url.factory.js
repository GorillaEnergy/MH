;(function () {
    'use strict';

    angular
        .module('factory.url', [])
        .factory('url', [
            function () {
                let baseUrl = 'https://mind-hero.grassbusinesslabs.tk/';

                return {
                    user: {
                        checkPhone: baseUrl + 'api/check-phone',
                        logout: baseUrl + 'api/logout',
                        register: baseUrl + 'api/register',
                    }

                }
            }]);
})();
