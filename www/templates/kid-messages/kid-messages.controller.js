;(function () {
  'use strict';

  angular.module('app')
    .controller('KidMessagesController', KidMessagesController);

  KidMessagesController.$inject = ['$state', '$localStorage', '$timeout', 'userService', 'dateConverter', 'consultants'];


  function KidMessagesController($state, $localStorage, $timeout, userService, dateConverter, consultants) {
    const vm = this;

    vm.toKidMainPage = toKidMainPage;
    vm.toChat = toChat;

    let fb = firebase.database();
    let kid_id = userService.getUser().id;
    console.log(kid_id);
    vm.consultants = consultants;
    console.log(consultants);
    // vm.consultants = [
    //   {
    //     name: 'Mariya',
    //     online: false,
    //     img: 'link',
    //     access: true,
    //     message: 'lorem ipsus',
    //     time: '15:32',
    //     date: '17.01.18',
    //     missed_messages: null
    //   },
    //   {
    //     name: 'Jorge',
    //     online: true,
    //     img: 'link',
    //     access: false,
    //     message: 'lorem ipsus',
    //     time: null,
    //     date: '17.01.18',
    //     missed_messages: 15
    //   }
    // ];

    // vm.online = [];
    // vm.message = [];
    // vm.unread = [];
    // vm.access = [];

    initFB();


    ////////////////////////// firebase //////////////////////////

    function initFB() {
      angular.forEach(vm.consultants, function (consultant, index) {
        let psy_id = consultant.id;
        checkOnline(psy_id, index);
        lastMessage(psy_id, index);
        totalUnread(psy_id, index);
        checkAccess(psy_id, index);
      });
    }

    function checkOnline(psy_id, index) {
      fb.ref('/WebRTC/users/' + psy_id + '/online').on('value', (snapshot) => {
        $timeout(function () {
          // console.log(psy_id, snapshot.val());
          snapshot.val() ? vm.consultants[index].online = true : vm.consultants[index].online = false;
        })
      });
    }
    function lastMessage(psy_id, index) {
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/messages').limitToLast(1).on('value', (snapshot) => {
        $timeout(function () {
          if (snapshot.val()) {
            vm.consultants[index].message = snapshot.val()[Object.keys(snapshot.val())].text;
            vm.consultants[index].date = dateConverter.date(snapshot.val()[Object.keys(snapshot.val())].date);
            vm.consultants[index].time = dateConverter.time(snapshot.val()[Object.keys(snapshot.val())].date);
          } else {
            vm.consultants[index].message = '';
          }
        })
      });
    }
    function totalUnread(psy_id, index) {
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/total_unread_kid').on('value', (snapshot) => {
        $timeout(function () {
          snapshot.val() ? vm.consultants[index].missed_messages = snapshot.val() : vm.consultants[index].missed_messages = null;
        })
      });
    }
    function checkAccess(psy_id, index) {
      fb.ref('/chats/' + kid_id + '/' + psy_id + '/access').on('value', (snapshot) => {
        $timeout(function () {
          snapshot.val() === false ? vm.consultants[index].access = false : vm.consultants[index].access = true;
        })
      });

    }

    ////////////////////////// buttons //////////////////////////
    function toKidMainPage() {
      console.log('to kid main page');
      $state.go('kid-main-page')
    }

    function toChat(consultant) {
      $localStorage.consultant = consultant;
      console.log('to kid chat');
      $state.go('kid-chat')
    }
  }
})();
