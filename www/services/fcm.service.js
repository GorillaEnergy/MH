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


        function init() {
        }

        function processEmergency(data) {
            let kids = angular.copy($localStorage.kids);
            for (let i = 0; i < kids.length; i++) {
                if (String(kids[i].id) === String(data.kid_id)) {
                    $localStorage.log_index = i;
                    console.log('message for kid', kids[i]);
                    break;
                }
            }
            toastr.error(JSON.stringify(data.message));     //red
            console.log('to logs -->');
            $state.go('logs')
        }

        function processNormal(data) {
            toastr.success(JSON.stringify(data.message));
        }

        function processNotification(data) {
            console.log(data);
            if (data.type === 'log') {
                if (data.status === 'emergency') {
                    processEmergency(data);
                } else if (data.status === 'normal') {
                    processNormal(data);
                }
            }
        }

        function subscribe() {
            if (typeof window.FCMPlugin !== 'undefined') {

                window.FCMPlugin.onNotification(processNotification,
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
