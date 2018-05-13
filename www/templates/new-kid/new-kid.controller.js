;(function () {
  'use strict';

  angular.module('app')
    .controller('NewKidController', NewKidController);

  NewKidController.$inject = ['$ionicPopup', '$ionicModal', '$state', '$scope', '$stateParams', 'countryCodes', 'userService'];


  function NewKidController($ionicPopup, $ionicModal, $state, $scope, $stateParams, countryCodes, userService) {
    const vm = this;

    vm.chosenCountry = chosenCountry;

    vm.countryCodes = countryCodes;
    vm.countryCode = countryCodes[0].code; //country be default
    vm.phone = '';


    $ionicModal.fromTemplateUrl('country-modal', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalCountry = modal;
    });

    function chosenCountry() {
      $scope.modalCountry.hide();
    }
  }
})();
