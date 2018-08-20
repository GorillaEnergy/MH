// ;(function () {
//   'use strict';

  angular.module('app')
    .controller('testPopupController', testPopupController);

  testPopupController.$inject = ['$scope', 'RTCService'];

  function testPopupController($scope, RTCService) {
    console.log('test popup controller start');
    let vm = this;

    $scope.closeStream = closeStream;
    $scope.signalLost = signalLost;


    function signalLost() {
      RTCService.signalLost()
    }
    function closeStream() {
      RTCService.closeStream()
    }

    $scope.testFunc = function (data) {
      return 'Rarararrara'
    };
    $scope.testFunc2 = function (data) {
      console.log('test func 2 ', data);
    };
  }

// })();
