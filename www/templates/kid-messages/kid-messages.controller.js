;(function () {
  'use strict';

  angular.module('app')
    .controller('KidMessagesController', KidMessagesController);

  KidMessagesController.$inject = ['$state'];


  function KidMessagesController($state) {
    const vm = this;

    vm.toKidMainPage = toKidMainPage;
    vm.toChat = toChat;

    vm.consultants = [
      {
        name: 'Mariya',
        status: false,
        img: 'link',
        access: true,
        description: 'lorem ipsus',
        time: '15:32',
        date: '17.01.18',
        missed_messages: null
      },
      {
        name: 'Jorge',
        status: true,
        img: 'link',
        access: false,
        description: 'lorem ipsus',
        time: null,
        date: '17.01.18',
        missed_messages: 15
      }
    ];


    function toKidMainPage() {
      console.log('to kid main page');
      $state.go('kid-main-page')
    }
    function toChat(index, consultant) {
      // console.log(index);
      // console.log(consultant);
      if (vm.consultants[index].access) {
        console.log('to kid chat');
        $state.go('kid-chat')
      } else {
        console.log('access danied');
      }
    }
  }
})();
