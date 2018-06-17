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
        // $urlRouterProvider.otherwise('/kid-messages');

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
                  },
                  countries: function (countryCodes) {
                    return countryCodes.list();
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
                    return $timeout(function() { securityService.onlyParent(); });
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
                    return $timeout(function() { securityService.onlyParent(); });
                  },
                  kids: function (userService) {
                    userService.uploadKids();
                    return userService.getKids();
                  },
                  followers: function (userService) {
                    return userService.getFollowers();
                  },
                  countries: function (countryCodes) {
                    return countryCodes.list();
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
                    return $timeout(function() { securityService.commonAccess(); });
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
                  return $timeout(function() { securityService.onlyParent(); });
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
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.onlyKid(); });
                }
              }
            })
            .state('kid-chat', {
              cache: false,
              url: '/kid-chat',
              templateUrl: 'templates/kid-chat/kid-chat.html',
              controller: 'KidChatController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.onlyKid(); });
                }
              }
            })
            .state('kid-messages', {
              cache: false,
              url: '/kid-messages',
              templateUrl: 'templates/kid-messages/kid-messages.html',
              controller: 'KidMessagesController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.onlyKid(); });
                }
              }
            })
            .state('logs', {
              cache: false,
              url: '/logs',
              templateUrl: 'templates/logs/logs.html',
              controller: 'LogsController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.onlyParent(); });
                },
                consultants: function ($timeout, consultantService) {
                  return  consultantService.consultantList();
                }
              }
            })
            .state('parent-main-page', {
              cache: false,
              url: '/parent-main-page',
              templateUrl: 'templates/parent-main-page/parent-main-page.html',
              controller: 'ParentMainPageController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.onlyParent(); });
                },
                kids: function (userService) {
                  return userService.uploadKids();
                }
              }
            })
            .state('settings', {
              cache: false,
              url: '/settings',
              templateUrl: 'templates/settings/settings.html',
              controller: 'SettingsController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.commonAccess(); });
                }
              }
            })
            .state('notifications', {
              cache: false,
              url: '/notifications',
              templateUrl: 'templates/notifications/notifications.html',
              controller: 'NotificationsController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.onlyParent(); });
                }
              }
            })
            .state('about-us', {
              cache: false,
              url: '/about-us',
              templateUrl: 'templates/about-us/about-us.html',
              controller: 'AboutUsController',
              controllerAs: 'vm',
              resolve: {
                // security: function ($timeout, securityService) {
                //   return $timeout(function() { securityService.commonAccess(); });
                // }
              }
            })
            .state('terms-conditions', {
              cache: false,
              url: '/terms-conditions',
              templateUrl: 'templates/terms-conditions/terms-conditions.html',
              controller: 'TermsConditionsController',
              controllerAs: 'vm',
              resolve: {
                security: function ($timeout, securityService) {
                  return $timeout(function() { securityService.commonAccess(); });
                }
              }
            })


            .state('test', {
              cache: false,
              url: '/test',
              templateUrl: 'templates/test/test.html',
              controller: 'TestController',
              controllerAs: 'vm'
            })
    }
})();

