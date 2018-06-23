;(function () {
  'use strict';

  angular.module('app')
    .controller('TestController', TestController);

  TestController.$inject = [];


  function TestController() {
    const vm = this;

    $("#parent").height($("#content").height());
  }

})();
