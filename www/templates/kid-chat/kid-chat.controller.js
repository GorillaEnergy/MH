;(function () {
  'use strict';

  angular.module('app')
    .controller('KidChatController', KidChatController);

  KidChatController.$inject = ['$state', '$timeout', '$anchorScroll', '$location', '$ionicModal', '$scope', 'userService',
    'toastr', '$ionicLoading'];


  function KidChatController($state, $timeout, $anchorScroll, $location, $ionicModal, $scope, userService,
                             toastr, $ionicLoading) {
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

    vm.selectedReason = selectedReason;
    vm.checked = checked;
    vm.reportTextField = reportTextField;
    vm.focusedInput = focusedInput;
    vm.unfocusedInput = unfocusedInput;

    vm.reportMenu = false;

    vm.consultantName = 'Mariya';
    vm.date = new Date();
    vm.messages = [];
    vm.blocked = null;


    vm.reportReasonList = ['reason 1', 'reason 2', 'reason 3',];
    vm.reportReason = vm.reportReasonList[0];
    vm.checkedReason = 0;


    let fb = firebase.database();
    let kid_id = userService.getUser().id;
    let psy_id = 1; // psy module not ready, change when ready;
    let number_of_posts = 30;
    let download_more = 30;

    let chat_body = document.getElementById("chat");
    let visible_parts_of_logs_block = chat_body.clientHeight;
    let visible_parts_of_logs_block_with_KB = null;
    let scrollPosionBeforeChange = null;
    let post_is_last = false;

    let chatHeightOld = null;
    let chatHeightNew = null;

    initializeFB();

    function initializeFB() {
      psychologistAccess();
      downloadMessages();
      addMessagesEvent();
      removeMessagesEvent();
      changeMessagesEvent();
    }

    function psychologistAccess() {
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').on('value', (snapshot) => {
        $timeout(function () {
          $timeout(function () {
            snapshot.val() === null ? create_room() : vm.blocked = snapshot.val();

            function create_room() {
              fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').set(true);
            }

            console.log('access psy chat = ', snapshot.val());
          })
        });
      });
    }

    function dateHeader(index) {
      if (index) {
        let timestampPre = vm.messages[index - 1].date;
        let timestampCurrent = vm.messages[index].date;
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
      if (index) {
        let userPre = vm.messages[index - 1].create_by_user_id;
        let userCurrent = vm.messages[index].create_by_user_id;

        let timestampPre = vm.messages[index - 1].date;
        let timestampCurrent = vm.messages[index].date;

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
      }
    }

    function scrollToBottom(newMsg) {
      $timeout(function () {
        if (newMsg) {
          // тут добавить какоето условие для более корректной работы функции(возможно скролл и ненужно опускать)
          // chat_body.scrollTo(0, chat_body.scrollHeight);
          chat_body.scrollTop = angular.copy(chat_body.scrollHeight);
        } else {
          // chat_body.scrollTo(0, chat_body.scrollHeight);
          chat_body.scrollTop = angular.copy(chat_body.scrollHeight);
        }
      });
    }

    function convertToArray(data, type) {
      let res = [];
      let arrOfKeys = Object.keys(data);
      angular.forEach(arrOfKeys, function (key) {
        res.push(data[key]);
      });

      if (res.length < number_of_posts) {
        post_is_last = true
      }
      console.log('post_is_last', post_is_last);

      if (!post_is_last) {
        addScrollEvent()
      } else {
        destroyScrollEvent()
      }

      if (type === 'primary_loading') {
        return res;
      } else {
        res.splice(res.length - 1, 1);
        res = res.concat(vm.messages);
        return res;
      }
    }

    function downloadMessages() {
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(number_of_posts).once('value', (snapshot) => {
        $timeout(function () {
          snapshot.val() ? vm.messages = convertToArray(snapshot.val(), 'primary_loading') : vm.messages = [];
          scrollToBottom()
        })
      });
    }

    function downloadMoreMessages() {
      $ionicLoading.show({template: 'Loading...'});
      let last = vm.messages[0].date;
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').orderByChild("date").endAt(last).limitToLast(download_more + 1).once('value', (snapshot) => {
        anchorScroll(snapshot.val());
        $ionicLoading.hide();
      })
    }

    function addMessagesEvent() {
      console.log('addMessagesEvent');
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(1).on('child_added', (snapshot) => {
        $timeout(function () {
          let push_status = true;
          let added_message = snapshot.val();
          for (let i = 0; i < vm.messages.length; i++) {
            if (vm.messages[i].date === added_message.date) {
              push_status = false;
              break;
            }
          }
          if (push_status) {
            vm.messages.push(snapshot.val());
            scrollToBottom(true)
          }
        })
      })
    }

    function removeMessagesEvent() {
      console.log('removeMessagesEvent');
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').on('child_removed', (snapshot) => {
        $timeout(function () {
          let changed_message = snapshot.val();
          for (let i = 0; i < vm.messages.length; i++) {
            if (vm.messages[i].date === changed_message.date) {
              vm.messages.splice(i, 1);
              break;
            }
          }
        })
      })
    }

    function changeMessagesEvent() {
      console.log('changeMessagesEvent');
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').on('child_changed', (snapshot) => {
        $timeout(function () {
          let changed_message = snapshot.val();
          for (let i = 0; i < vm.messages.length; i++) {
            if (vm.messages[i].date === changed_message.date) {
              vm.messages[i] = changed_message;
              break;
            }
          }
        })
      })
    }

    function addScrollEvent() {
      console.log('addScrollEvent');
      angular.element(chat_body).bind('scroll', function () {
        if (chat_body.scrollTop === 0) {
          console.log('scroll position top');
          downloadMoreMessages();
        }
      });
    }

    function destroyScrollEvent() {
      console.log('destroyScrollEvent');
      angular.element(chat_body).unbind('scroll');
    }

    function anchorScroll(data) {
      console.log('anchorScroll');
      $timeout(function () {

        if (chatHeightNew) {
          chatHeightOld = angular.copy(chatHeightNew);
        } else {
          chatHeightOld = angular.copy(angular.element("#chat")[0].scrollHeight);
        }
        // console.log('chatHeightOld = ', chatHeightOld);

        if (data) {
          vm.messages = convertToArray(data, 'secondary_loading')
        }

        $timeout(function () {

          chatHeightNew = angular.copy(angular.element("#chat")[0].scrollHeight);
          // console.log('chatHeightNew = ', chatHeightNew);

          chat_body.scrollTop = angular.copy(chatHeightNew - chatHeightOld);
          // console.log('chat_body.scrollTop = ', chat_body.scrollTop);
        })

      })
    }

    function focusedInput() {
      console.log('focusedInput');
      $timeout(function () {
        scrollPosionBeforeChange = angular.copy(chat_body.scrollTop);
        visible_parts_of_logs_block_with_KB = chat_body.clientHeight;
        chat_body.scrollTop = chat_body.scrollTop + (visible_parts_of_logs_block - chat_body.clientHeight);
      }, 300)
    }

    function unfocusedInput() {
      console.log('unfocusedInput');
      $timeout(function () {
        chat_body.scrollTop = angular.copy(scrollPosionBeforeChange);
      }, 300)
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    function selectedReason(index) {
      vm.checkedReason = index;
    }

    function checked(index) {
      if (index === vm.checkedReason) {
        return true;
      } else {
        return false;
      }
    }

    function reportTextField() {
      if (vm.checkedReason === 'other') {
        return true
      } else {
        return false
      }
    }

    $ionicModal.fromTemplateUrl('report-modal', {
      scope: $scope
    }).then(function (modal) {
      $scope.reportModal = modal;
    });

    let messages = [];
    fb.ref('/chats/' + kid_id + '/' + psy_id).push(messages);
  }

})();
