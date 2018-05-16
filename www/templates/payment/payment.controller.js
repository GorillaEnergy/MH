;(function () {
  'use strict';

  angular.module('app')
    .controller('PaymentController', PaymentController);

  PaymentController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal'];


  function PaymentController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal) {
    const vm = this;


    vm.kids = [{name: 'Joshua'},{name: 'David'},{name: 'Donald'}];

    vm.totalPrice = totalPriceCalc(vm.kids.length);

    vm.kidColor = function (index) {
      let name = 'kid-color' + index;
      return name;
    };

    function totalPriceCalc(quantity) {
      if (quantity) {
        if (quantity > 1) {
          return 50*quantity + 50;
        } else {
          return 100;
        }
      } else {
        return 0;
      }
    }

    $ionicModal.fromTemplateUrl('payment-modal', {
      scope: $scope
    }).then(function (modal) {
      $scope.paymentModal = modal;
    });

    function chosenCountry() {
      $scope.paymentModal.hide();
    }

  }
})();
