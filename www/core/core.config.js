;(function () {
    'use strict';
    angular
      .module('app')
      .config(mainConfig);


    mainConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function mainConfig($stateProvider, $urlRouterProvider) {

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/authorization');
        // $urlRouterProvider.otherwise('/kid');
        // $urlRouterProvider.otherwise('/kid-chat');

        $stateProvider

            .state('authorization', {
                cache: false,
                url: '/authorization',
                templateUrl: 'templates/authorization-telephone/authorization-telephone.html',
                controller: 'AuthorizationController',
                controllerAs: 'vm',
                resolve: {
                  security: function ($timeout, securityService) {
                    return $timeout(function() { securityService.authorization(); });
                  }
                }
            })
            .state('profile', {
                cache: false,
                url: '/profile',
                templateUrl: 'templates/profile/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm',
                resolve: {
                  security: function ($timeout, securityService) {
                    return $timeout(function() { securityService.profile(); });
                  },
                  user: function (userService) {
                    return userService.getUser();
                  }
                }
            })
            .state('kid', {
                cache: false,
                url: '/kid',
                templateUrl: 'templates/kid/kid.html',
                controller: 'KidController',
                controllerAs: 'vm',
                resolve: {
                  security: function ($timeout, securityService) {
                    return $timeout(function() { securityService.kid(); });
                  },
                  kids: function (userService) {
                    userService.uploadKids();
                    return userService.getKids();
                  },
                  followers: function (userService) {
                    return userService.getFollowers();
                  }
                }
            })
            .state('menu', {
                cache: false,
                url: '/menu',
                templateUrl: 'templates/menu/menu.html',
                controller: 'MenuController',
                controllerAs: 'vm',
                resolve: {
                  security: function ($timeout, securityService) {
                    return $timeout(function() { securityService.isLoggedIn(); });
                  }
                }
            })
            .state('payment', {
              cache: false,
              url: '/payment',
              templateUrl: 'templates/payment/payment.html',
              controller: 'PaymentController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.isLoggedIn(); });
                },
                kids: function (userService) {
                  userService.uploadKids();
                  return userService.getKids();
                }
              }
            })
            .state('kid-main-page', {
              cache: false,
              url: '/kid-main-page',
              templateUrl: 'templates/kid-main-page/kid_main_page.html',
              controller: 'KidMainPageController',
              controllerAs: 'vm',
              resolve: {
                // security: function ($timeout, securityService) {
                //   return $timeout(function() { securityService.isLoggedIn(); });
                // }
              }
            })
            .state('kid-message', {
              cache: false,
              url: '/kid-message',
              templateUrl: 'templates/kid-messages/kid_messages.html',
              controller: 'KidMessageController',
              controllerAs: 'vm',
              resolve: {
                // security: function ($timeout, securityService) {
                //   return $timeout(function() { securityService.isLoggedIn(); });
                // }
              }
            })
            .state('kid-chat', {
              cache: false,
              url: '/kid-chat',
              templateUrl: 'templates/kid-chat/kid_chat.html',
              controller: 'KidChatController',
              controllerAs: 'vm',
              resolve: {
                // security: function ($timeout, securityService) {
                //   return $timeout(function() { securityService.isLoggedIn(); });
                // }
              }
            })

            // .state('parent-main-page', {
            //   cache: false,
            //   url: '/parent-main-page',
            //   templateUrl: 'templates/parent_main_page/parent_main_page.html',
            //   controller: 'ParentMainPageController',
            //   controllerAs: 'vm',
            //   resolve: {
            //     // security: function ($timeout, securityService) {
            //     //   return $timeout(function() { securityService.isLoggedIn(); });
            //     // }
            //   }
            // })


    }


})();

