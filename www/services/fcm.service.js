;(function () {
  'use strict';

  angular.module('service.fcm', [])
    .service('fcm', fcm);

  fcm.$inject = ['$state', '$localStorage', 'notificationService', 'toastr'];

  function fcm($state, $localStorage, notificationService, toastr) {
    let model = {};

    model.subscribe = subscribe;
    model.init = init;

    return model;


      function init(){
          // Initialize Firebase
          let config = {
              apiKey: "AIzaSyCPyHbouuqslfJIbAynfdeCHlJb_2tJw9M",
              authDomain: "mind-hero-96b57.firebaseapp.com",
              databaseURL: "https://mind-hero-96b57.firebaseio.com",
              projectId: "mind-hero-96b57",
              storageBucket: "mind-hero-96b57.appspot.com",
              messagingSenderId: "19872374786"
          };
          window.firebase.initializeApp(config);
      }

    function subscribe() {
      if (typeof window.FCMPlugin !== 'undefined') {

        window.FCMPlugin.onNotification(function (data) {
            console.log(data);
            if (data.type === 'log' && data.status === 'emergency') {

              let kids = angular.copy($localStorage.kids);
              for (let i = 0; i < kids.length; i++) {
                if (kids[i].id == data.kid_id) {
                  $localStorage.log_index = i;
                  console.log('message for kid', kids[i]);
                  break;
                }
              }
              toastr.error(JSON.stringify(data.message));     //red
              console.log('to logs -->');
              $state.go('logs')

            } else if (data.type === 'log' && data.status === 'normal') {
              toastr.success(JSON.stringify(data.message));   //green
            }

          },
          function (msg) {
            console.log('Success callback ' + msg);
          },
          function (err) {
            console.log('Error callback ' + err);
          });

      }
    }
  }

})();
