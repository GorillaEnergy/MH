;(function () {
  'use strict';

  angular.module('app')
    .controller('PaymentController', PaymentController);

  PaymentController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal'];


  function PaymentController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal) {
    const vm = this;


    vm.kids = [{name: 'Joshua'},{name: 'David'}];




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
