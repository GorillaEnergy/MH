;(function () {
  'use strict';

  angular.module('app')
    .controller('KidChatController', KidChatController);

  KidChatController.$inject = ['$state', '$timeout', 'userService'];


  function KidChatController($state, $timeout, userService) {
    const vm = this;

    vm.toMessages = toMessages;
    vm.blockButton = blockButton;
    vm.dateHeader = dateHeader;
    vm.timeHeader = timeHeader;
    vm.dateConverter = dateConverter;
    vm.timeConverter = timeConverter;
    vm.ownMessage = ownMessage;

    vm.report = report;
    vm.block = block;

    vm.sendMessage = sendMessage;

    vm.reportMenu = false;

    vm.consultantName = 'Mariya';
    vm.date = new Date();
    vm.messages = [];

    let fb = firebase.database();
    let kid_id = userService.getUser().id;
    let psy_id = 1; // psy module not ready, change when ready;

    fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').on('value', (snapshot) => {
      $timeout(function () {
        snapshot.val() ? vm.messages = snapshot.val() : vm.messages = [];
        // console.log(snapshot.val());
        // console.log(vm.messages);
        // console.log(Object.keys(vm.messages));
      });
    });


    function dateHeader(index) {
      let msgsObjNameArr = Object.keys(vm.messages);

      if (index) {
        let timestampPre = vm.messages[msgsObjNameArr[index - 1]].date;
        let timestampCurrent = vm.messages[msgsObjNameArr[index]].date;
        let datePre = new Date(timestampPre).getDate() + ' ' + new Date(timestampPre).getMonth() + ' ' + new Date(timestampPre).getFullYear();
        let dateCurrent = new Date(timestampCurrent).getDate() + ' ' + new Date(timestampCurrent).getMonth() + ' ' + new Date(timestampCurrent).getFullYear();

        if (datePre !== dateCurrent) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    function timeHeader(index) {
      let msgsObjNameArr = Object.keys(vm.messages);

      if (index) {
        let timestampPre = vm.messages[msgsObjNameArr[index - 1]].date;
        let timestampCurrent = vm.messages[msgsObjNameArr[index]].date;
        let timePre = new Date(timestampPre).getHours() + ':' + new Date(timestampPre).getMinutes();
        let timeCurrent = new Date(timestampCurrent).getHours() + ':' + new Date(timestampCurrent).getMinutes();

        if (timePre !== timeCurrent) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function dateConverter(timestamp) {
      let monthList = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

      let day = new Date(timestamp).getDate();
      let month = new Date(timestamp).getMonth();
      let year = new Date(timestamp).getFullYear();

      return day + ' ' + monthList[month] + ' ' + year;
    }
    function timeConverter(timestamp) {
      let hours = new Date(timestamp).getHours();
      let minutes = new Date(timestamp).getMinutes();

      return hours + ':' + minutes;
    }

    function ownMessage(index) {
      if (vm.messages[index].create_by_user_id === kid_id) {
        return true
      } else {
        return false
      }
    }

    function toMessages() {
      console.log('to messages');
      $state.go('kid-messages');
    }

    function blockButton() {
      vm.reportMenu = !vm.reportMenu;
    }
    function report() {
      console.log('report');
    }
    function block() {
      console.log('block');
    }

    function sendMessage() {
      let data = {};
      data.text = vm.message_input;
      data.date = new Date() * 1;
      data.create_by_user_id = kid_id;
      data.create_by_user_role = 1;
      data.read = false;

      if (vm.message_input) {
        fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').push(data);
        vm.message_input = '';
      }
    }

    // только для отладки //
    // $timeout(function () { sendMessagePsy() }, 10000);
    function sendMessagePsy() {
      let data = {};
      data.text = vm.message_input;
      data.date = new Date() * 1;
      data.create_by_user_id = 1;
      data.create_by_user_role = 3;
      data.read = false;

      if (vm.message_input) {
        fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').push(data);
        vm.message_input = '';
      }
    }
  }

})();
