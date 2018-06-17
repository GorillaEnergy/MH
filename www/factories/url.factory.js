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
                    },
                    kid: {
                      createKid: baseUrl + 'api/create-kid',
                      updateKid: baseUrl + 'api/update-kid',
                      deleteKid: baseUrl + 'api/delete-kid',
                      uploadKids: baseUrl + 'api/list-kids',
                      uploadFollower: baseUrl + 'api/list-followers',
                    },
                    countries: {
                      list: baseUrl + 'api/list-codes'
                    },
                    consultants : {
                      consultantsList: baseUrl + 'api/list-consultants'
                    }

                }
            }]);
})();
