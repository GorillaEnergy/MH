;(function () {
  'use strict';

  angular.module('service.fcm', [])
    .service('fcm', fcm);

  fcm.$inject = ['$state', '$localStorage', 'notificationService', 'toastr'];

  function fcm($state, $localStorage, notificationService, toastr) {
    let model = {};

    model.subscribe = subscribe;


    return model;


    function subscribe() {
      if (typeof FCMPlugin !== 'undefined') {

        FCMPlugin.onNotification(function (data) {
            console.log(data);
            if (data.type == 'log' && data.status == 'emergency') {

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

            } else if (data.type == 'log' && data.status == 'normal') {
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
