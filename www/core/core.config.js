;(function () {
    'use strict';
    angular
      .module('app')
      .config(mainConfig);


    mainConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function mainConfig($stateProvider, $urlRouterProvider) {

        // if none of the above states are matched, use this as the fallback
        // $urlRouterProvider.otherwise('/authorization');
        $urlRouterProvider.otherwise('/payment');

        $stateProvider

            // .state('authorization', {
            //     cache: false,
            //     url: '/authorization',
            //     templateUrl: 'templates/authorization-telephone/authorization-telephone.html',
            //     controller: 'LoginController',
            //     controllerAs: 'vm'
            // })
            // .state('registration', {
            //     cache: false,
            //     url: '/registration',
            //     templateUrl: 'templates/registration/registration.html',
            //     controller: 'RegistrationController',
            //     controllerAs: 'vm'
            // })
            // .state('new-kid', {
            //     cache: false,
            //     url: '/new-kid',
            //     templateUrl: 'templates/new-kid/new-kid.html',
            //     controller: 'NewKidController',
            //     controllerAs: 'vm'
            // })
            // .state('menu', {
            //     cache: false,
            //     url: '/menu',
            //     templateUrl: 'templates/menu/menu.html',
            //     controller: 'MenuController',
            //     controllerAs: 'vm'
            // })
            .state('payment', {
              cache: false,
              url: '/payment',
              templateUrl: 'templates/payment/payment.html',
              controller: 'PaymentController',
              controllerAs: 'vm'
            })


    }


})();

