;(function () {
  'use strict';

  angular.module('service.fcm', [])
    .service('fcm', fcm);

  fcm.$inject = ['$state', '$localStorage', 'notificationService', 'toastr', 'userService', '$rootScope'];

  function fcm($state, $localStorage, notificationService, toastr, userService, $rootScope) {
    let model = {};

    model.subscribe = subscribe;


    return model;


    function subscribe() {
      console.log('subscribe');
      if (typeof FCMPlugin !== 'undefined') {

        FCMPlugin.onNotification(function (data) {
            console.log(data);
            if (data.type == 'log' && data.status == 'emergency') {
              let kids = angular.copy(userService.getKids());
              for (let i = 0; i < kids.length; i++) {
                if (kids[i].id == data.kid_id) {
                  $localStorage.log_index = i;
                  break;
                }
              }
              toastr.error(String(data.message));     //red
              $state.go('logs')
            } else if (data.type == 'log' && data.status == 'normal') {
              toastr.success(String(data.message));   //green
              // toastr.info(String(data.message));   //blue
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
