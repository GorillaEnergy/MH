;(function () {
  'use strict';

  angular.module('app')
    .controller('NotificationsController', NotificationsController);

  NotificationsController.$inject = ['$state', 'userService'];


  function NotificationsController($state, userService) {
    const vm = this;

    vm.toSettings = toSettings;

    vm.commentsChange = commentsChange;
    vm.recommendationsChange = recommendationsChange;
    vm.messagesChange = messagesChange;

    let user = userService.getUser();
    vm.comments = user.logs;
    vm.recommendations = user.recommendations;
    vm.messages = user.messages;

    function toSettings() {
      console.log('to settings');
      $state.go('settings');
    }

    function commentsChange() {
      console.log(vm.comments);

      let data = {};
      vm.comments ? data.logs = 1 : data.logs = 0;
      userService.userUpdate(data).then(function (res) {
        console.log(res);
        if (res.status == "success") {
          userService.setUser(res.data);
        } else {
          vm.comments = !vm.comments;
        }
      });
    }
    function recommendationsChange() {
      console.log(vm.recommendations);

      let data = {};
      vm.recommendations ? data.recommendations = 1 : data.recommendations = 0;
      userService.userUpdate(data).then(function (res) {
        console.log(res);
        if (res.status == "success") {
          userService.setUser(res.data);
        } else {
          vm.recommendations = !vm.recommendations;
        }
      });
    }
    function messagesChange() {
      console.log(vm.messages);

      let data = {};
      vm.messages ? data.messages = 1 : data.messages = 0;
      userService.userUpdate(data).then(function (res) {
        console.log(res);
        if (res.status == "success") {
          userService.setUser(res.data);
        } else {
          vm.messages = !vm.messages;
        }
      });
    }

  }
})();
