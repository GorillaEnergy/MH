;(function () {
    'use strict';

    angular.module('app')
        .controller('PaymentsHistoryController', PaymentsHistoryController);

    PaymentsHistoryController.$inject = ['$ionicPopup', '$state', '$rootScope', 'payments', 'purchaseService'];


    function PaymentsHistoryController($ionicPopup, $state, $rootScope, payments, purchaseService) {
        const vm = this;

        vm.toMenu = toMenu;
        vm.receipt = receipt;
        vm.purchase = purchase;
        vm.dateConverter = dateConverter;

        vm.pay = payments;

        function toMenu() {
          console.log('to menu');
          $state.go('menu')
        }
        function receipt() {
          purchaseService.getReceipt();
          // $rootScope.$broadcast('overdue-subscription', true)
        }
        function purchase() {
          purchaseService.getPurchases();
        }

        function dateConverter(date) {
          let timestamp = date * 1;

          let day = new Date(timestamp).getDate();
          let month = new Date(timestamp).getMonth() + 1;
          let year = new Date(timestamp).getFullYear();

          if (day < 10) { day = '0' + String(day); }
          if (month < 10) { month = '0' + String(month); }

          return day + '/' + month + '/' + year;
        }

    }

})();
