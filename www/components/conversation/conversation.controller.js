;(function () {
  'use strict';

  angular.module('app')
    .controller('ConversationController', ConversationController);

  ConversationController.$inject = ['$scope', 'RTCService'];

  function ConversationController($scope, RTCService) {
    console.log('ConversationController start');

    $scope.closeStream = closeStream;
    $scope.signalLost = signalLost;


    function signalLost() {
      RTCService.signalLost()
    }
    function closeStream() {
      RTCService.closeStream()
    }
  }

})();
