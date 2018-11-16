;(function () {
  'use strict';

  angular
    .module('factory.url', [])
    .factory('url', [
      function () {
        let baseUrl = 'https://api.mind-hero.grassbusinesslabs.tk/';

        return {
          masks: {
            getAll: baseUrl + 'api/masks'
          },
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
            rights_to_kid: baseUrl + 'api/check-status-parent',
            access: baseUrl + 'api/access-kid'
          },
          countries: {
            list: baseUrl + 'api/list-codes'
          },
          consultants : {
            consultantsList: baseUrl + 'api/list-consultants'
          },
          additional_content : {
            main_page_content: baseUrl + 'api/list-contents',
            additional_page_content: baseUrl + 'api/get-contents',
            favorites_list: baseUrl + 'api/favourites-list',
            search_content: baseUrl + 'api/search-content',
            add_to_favorite: baseUrl + 'api/add-to-favourites',
            remove_from_favorite: baseUrl + 'api/remove-from-favourites'
          },
          purchase : {
            get_plan: baseUrl + 'api/list-tariff',
            confirm: baseUrl + 'api/create-payment',
            payments_archive: baseUrl + 'api/list-payment'
          },
          report : {
            reason: baseUrl + 'api/reasons',
            send: baseUrl + 'api/report/send'
          }
        }
      }]);
})();
