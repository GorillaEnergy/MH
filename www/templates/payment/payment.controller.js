;(function () {
  'use strict';

  angular.module('app')
    .controller('PaymentController', PaymentController);

  PaymentController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal',
                                'kids'];


  function PaymentController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal,
                             kids) {
    const vm = this;

    vm.ediKid = ediKid;
    vm.kidColor = kidColor;

    let  date = new Date();
    console.log("Time: ", date.getHours() + ' : ' + date.getMinutes());

    // firebase.database().ref().child('test').child ('first').set('first');
    // firebase.database().ref().child('test').child ('second').set('second');

    let data = {};
    data.title = 'title';
    data.value = 10;
    let fb = firebase.database();
    // fb.ref().child('test').child('test').set(data);

    // $timeout(function () {
    //   fb.ref('/test/test').remove();
    // }, 10000);

    fb.ref('/test').on('value', (snapshot) => {
      console.log(snapshot.val());
      // console.log(snapshot.val().limitToLast(1));
    });

    vm.kids = kids;
    vm.totalPrice = totalPriceCalc(vm.kids.length);

    function ediKid(kid, index) {

      console.log(kid);
      console.log(index);
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

    function chosenCountry() {
      $scope.paymentModal.hide();
    }

  }
})();
