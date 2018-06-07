;(function () {
  'use strict';

  angular.module('app')
    .controller('PaymentController', PaymentController);

  PaymentController.$inject = ['$localStorage', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal',
                                'kids'];


  function PaymentController($localStorage, $state, $scope, $stateParams, userService, $timeout, $ionicModal,
                             kids) {
    const vm = this;

    vm.ediKid = ediKid;
    vm.kidColor = kidColor;
    vm.addKid = addKid;

    let  date = new Date();
    console.log("Time: ", date.getHours() + ' : ' + date.getMinutes());
    // console.log(date.toISOString());
    // console.log(date.toISOString().split('.')[0].split('T').join(' '));

    vm.kids = kids;
    vm.totalPrice = totalPriceCalc(vm.kids.length);

    function ediKid(index) {
      $localStorage.kid_index = index;
      $state.go('kid');
    }

    function addKid() {
      delete $localStorage.kid_index;
      $state.go('kid');
    }

    function kidColor(index) {
      let name = 'kid-color' + index;
      return name;
    }

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
  }
})();
