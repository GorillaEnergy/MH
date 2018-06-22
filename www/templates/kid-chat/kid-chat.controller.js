;(function () {
  'use strict';

  angular.module('app')
    .controller('KidChatController', KidChatController);

  KidChatController.$inject = ['$state', '$timeout', '$anchorScroll', '$location', '$ionicModal', '$scope', 'userService',
                               'toastr'];


  function KidChatController($state, $timeout, $anchorScroll, $location, $ionicModal, $scope, userService,
                             toastr) {
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
    vm.unblock = unblock;

    vm.sendMessage = sendMessage;
    vm.sendReport = sendReport;

    vm.selectedReason =  selectedReason;
    vm.checked = checked;
    vm.reportTextField = reportTextField;

    vm.reportMenu = false;

    vm.consultantName = 'Mariya';
    vm.date = new Date();
    vm.messages = [];
    vm.blocked = false;


    vm.reportReasonList = ['reason 1', 'reason 2', 'reason 3',];
    vm.reportReason = vm.reportReasonList[0];
    vm.checkedReason = 0;

    let chat_body = document.getElementById("chat");
    let chat_not_ready = true;

    let chatHeightOld = null;
    let chatHeightNew = null;

    let fb = firebase.database();
    let kid_id = userService.getUser().id;
    let psy_id = 1; // psy module not ready, change when ready;
    let number_of_posts = 50;
    let download_more = 25;
    let accessToLoadMoreMessages = true;

    fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').on('value', (snapshot) => {
      $timeout(function () {
        $timeout(function () {
          snapshot.val() ? vm.blocked = snapshot.val() : vm.blocked = false;
          console.log('access psy chat = ', snapshot.val());
        })
      });
    });

    fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(number_of_posts).on('value', (snapshot) => {
      $timeout(function () {
        snapshot.val() ? vm.messages = snapshot.val() : vm.messages = [];
        console.log(snapshot.val());
        console.log('loaded ' + Object.keys(vm.messages).length + ' messages');
        scrollToBottom();
      });
    });

    // let randomNameValue = false;
    let counter = 0;
    fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(1).on('child_added', (snapshot) => {
      console.log('added!');
      counter++;
      if (counter) {
        scrollToBottom(true);
      }
    });

    function bindScrollAndLoadMessages() {
      console.log('bindScrollAndLoadMessages()');
      // if (accessToLoadMoreMessages) {
      //   accessToLoadMoreMessages = false;
      //   $timeout(function () { accessToLoadMoreMessages = true; }, 300)
      // } else {
      //   return false;
      // }
      // console.log('bindScrollAndLoadMessages');

      if (chatHeightNew) {
        chatHeightOld = angular.copy(chatHeightNew);
      } else {
        chatHeightOld = angular.element("#chat")[0].scrollHeight;
      }

      number_of_posts = number_of_posts + download_more;
      vm.loadMoreMessages = true;
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').off();
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(number_of_posts).on('value', (snapshot) => {
        $timeout(function () {
          snapshot.val() ? vm.messages = snapshot.val() : vm.messages = [];

          $timeout(function () {
            vm.loadMoreMessages = false;
          }, 300);

          $timeout(function () {
            chatHeightNew = angular.element("#chat")[0].scrollHeight;
            chat_body.scrollTop = angular.copy(chatHeightNew - chatHeightOld);
          }, 0)
        });
      });
    }


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
        let userPre = vm.messages[msgsObjNameArr[index - 1]].create_by_user_id;
        let userCurrent = vm.messages[msgsObjNameArr[index]].create_by_user_id;

        let timestampPre = vm.messages[msgsObjNameArr[index - 1]].date;
        let timestampCurrent = vm.messages[msgsObjNameArr[index]].date;

        let timePre = new Date(timestampPre).getHours() + ':' + new Date(timestampPre).getMinutes();
        let timeCurrent = new Date(timestampCurrent).getHours() + ':' + new Date(timestampCurrent).getMinutes();

        if (timePre !== timeCurrent || userPre !== userCurrent) {
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
      if (hours < 10) {
        hours = '0' + String(hours);
      }
      if (minutes < 10) {
        minutes = '0' + String(minutes);
      }

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
      $timeout(function () {
        if (vm.reportMenu) {
          vm.reportMenu = !vm.reportMenu;
        }
      }, 3000)
    }
    function report() {
      vm.reportMenu = false;
      vm.checkedReason = 0;
      $scope.reportModal.show()
    }
    function block() {
      vm.reportMenu = false;
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').set(false);
    }
    function unblock() {
      vm.reportMenu = false;
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').set(true);
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
        scrollToBottom()
      }
    }
    function sendReport() {
      if (vm.checkedReason === 'other') {
        console.log('other reason');
        console.log(vm.reportTextValue);
      } else {
        console.log(vm.reportReasonList[vm.checkedReason]);
      }
      $timeout(function () {
        console.log('hide modal');
        toastr.success('Report sent');
        $scope.reportModal.hide();
      }, 200)
    }

    function scrollToBottom(to_bottom) {
      if (chat_not_ready || to_bottom) {
        console.log('опускаем скролл');
        chat_not_ready = false;
        $timeout(function () {
          console.log(chat_body.scrollHeight);
          chat_body.scrollTo(0, chat_body.scrollHeight);
          // chat_body.scrollTop = chat_body.scrollHeight;
          // console.log(chat_body.scrollTop);
        });
      }
    }

    /////// событие при scrollTop === 0 //////
    angular.element(chat_body).bind('scroll', function(){
      console.log(chat_body.scrollTop);
      console.log(chat_body.scrollHeight);
      if (chat_body.scrollTop === 0) {
        console.log('chat position top');
        // console.log(chat_body.scrollTop);
        // bindScrollAndLoadMessages();
      }
    });

    /////////////////// modal ///////////////////
    $ionicModal.fromTemplateUrl('report-modal', {
      scope: $scope
    }).then(function (modal) {
      $scope.reportModal = modal;
    });

    function selectedReason(index) {
      vm.checkedReason = index;
    }
    function checked(index) {
      if (index === vm.checkedReason) { return true; } else { return false; }
    }

    function reportTextField() {
      if (vm.checkedReason === 'other') { return true } else { return false }
    }
  }

})();
