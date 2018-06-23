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
                      add_follower: baseUrl + 'api/add-another-parent',
                      remove_follower: baseUrl + 'api/delete-another-parent',
                      followers_list: baseUrl + 'api/list-followers',
                      rights_to_kid: baseUrl + 'api/check-status-parent'
                    },
                    countries: {
                      list: baseUrl + 'api/list-codes'
                    },
                    consultants : {
                      consultantsList: baseUrl + 'api/list-consultants'
                    },
                    additional_content : {
                      // content_list: baseUrl + 'api/list-contents',
                      content_list: baseUrl + 'api/get-contents',
                      favorites_list: baseUrl + 'api/favourites-list',
                      search_content: baseUrl + 'api/search-content',
                      add_to_favorite: baseUrl + 'api/add-to-favourites',
                      remove_from_favorite: baseUrl + 'api/remove-from-favourites'
                    }

                }
            }]);
})();
