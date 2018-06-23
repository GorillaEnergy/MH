;(function () {
    'use strict';

    angular.module('app')
        .controller('PaymentsHistoryController', PaymentsHistoryController);

    PaymentsHistoryController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal'];


    function PaymentsHistoryController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal) {
        const vm = this;

        vm.toMenu = toMenu;

        function toMenu() {
          console.log('to menu');
          $state.go('menu')
        }


        vm.pay = [
            {
                price: 400,
                quantity: 7,
                date:'17/06/18',
            },
            {
                price: 400,
                quantity: 7,
                date:'17/05/18',
            },
            {
                price: 350,
                quantity: 6,
                date:'17/04/18',
            },
            {
                price: 300,
                quantity: 5,
                date:'17/03/18',
            },
            {
                price: 200,
                quantity: 3,
                date:'17/02/18',
            },
            {
                price: 200,
                quantity: 3,
                date:'17/01/18',
            }
        ];
    }

})();
