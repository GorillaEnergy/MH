;(function () {
    'use strict';

    angular
        .module('factory.url', [])
        .factory('url', [
            function () {
                let baseUrl = 'http://api.mind-hero.grassbusinesslabs.tk/';

                return {
                    auth: {
                        checkPhone: baseUrl + 'api/check-phone',
                        login: baseUrl + 'api/login',
                        logout: baseUrl + 'api/logout'
                    },
                    user: {
                      userUpdate: baseUrl + 'api/user-update',
                      createKid: baseUrl + 'api/create-kid',
                      uploadKids: baseUrl + 'api/list-kids',
                      uploadFollower: baseUrl + 'api/list-followers',
                    },
                    countries: {
                      list: baseUrl + 'api/list-codes'
                    }

                }
            }]);
})();
