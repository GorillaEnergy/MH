;(function () {
  'use strict';

  angular.module('app')
    .controller('ConversationController', ConversationController);

  ConversationController.$inject = ['$scope', '$rootScope'];

  function ConversationController($scope) {
    console.log('ConversationController start');

    $rootScope.$on('conversation-view', function (e, number) {
      changeView(number);
    });


    function changeView(number) {
      let body = document.getElementById('body-div');

      if (number < 3) {
        removeClasses();
        body.classList.add('less-than-two');
      } else if (number < 4) {
        removeClasses();
        body.classList.add('less-than-three');
      } else {
        removeClasses();
        body.classList.add('more');
      }

      function removeClasses() {
        body.classList.remove('less-than-two');
        body.classList.remove('less-than-three');
        body.classList.remove('more');
      }
    }

  }

})();
