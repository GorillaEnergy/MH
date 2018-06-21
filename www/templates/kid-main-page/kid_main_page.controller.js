;(function () {
    'use strict';

    angular.module('app')
        .controller('KidMainPageController', KidMainPageController);

    KidMainPageController.$inject = ['$state', '$timeout', 'userService', 'live_content'];


    function KidMainPageController($state, $timeout, userService, live_content) {
        const vm = this;

        vm.toChat = toChat;
        vm.toCall = toCall;
        vm.toMenu = toMenu;

        vm.missedCalls = 0;
        vm.missedMessages = 0;
        vm.live_content = live_content;

        let fb = firebase.database();
        let kid_id = userService.getUser().id;

        function toChat() {
          console.log('to kid-messages');
          $state.go('kid-messages');
        }
        function toCall() {
          console.log('to call');
          // $state.go('kid-call');
        }
        function toMenu() {
          console.log('to menu');
          $state.go('menu');
        }

        fb.ref('/chats/' + kid_id + '/total_kid_unread').on('value', (snapshot) => {
          $timeout(function () { vm.missedMessages = snapshot.val(); });
          console.log(snapshot.val());
        });

      /////////////////////////////////////////////////////////////////////////
      // firebase.database().ref().child('test').child ('first').set('first');
      // firebase.database().ref().child('test').child ('second').set('second');

      // let data = {};
      // let fb = firebase.database();
      // fb.ref().child('test').child('test').set(data);
      // fb.ref('/test/1').set(data);
      // fb.ref('/test').push(data);

      // $timeout(function () {
      //   // fb.ref('/test/1').set(data);
      //   fb.ref('/test/-LEE5FPDpwP_gJZrHwAX').remove();
      // }, 10000);

      // fb.ref('/test').on('value', (snceapshot) => {
      // fb.ref('/test').on('value', (snapshot) => {
      // fb.ref('/test').limitToLast(3).on('value', (snapshot) => {
      //   let updatedData = snapshot.val();
      //   console.log(updatedData);
      //   // console.log(updatedData.limitToLast(0));
      // });

      // fb.ref('/empty').limitToLast(3).on('value', (snapshot) => {
      //   // fb.ref('/test').limitToLast(3).on('value', (snapshot) => {
      //   // fb.ref('/test/').orderByChild("sort").limitToLast(4).on('child_added', (snapshot) => {
      //   // fb.ref('/test').limitToLast(1).on('child_added', (snapshot) => {
      //   // fb.ref('/test').limitToLast(1).on('child_changed', (snapshot) => {
      //   // fb.ref('/test').limitToLast(1).on('child_removed', (snapshot) => {
      //   console.log(snapshot.key);
      //   console.log(snapshot.val());
      // });

      // fb.ref('/test/').orderByChild("sort").on("child_added", function(data) {
      //   console.log(data.val().sort);
      // });
    }
})();
