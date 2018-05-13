;(function () {
    'use strict';

    angular.module('service.notification', [])
        .service('notificationService', notificationService);

    notificationService.$inject = ['url', 'http', '$localStorage'];

    function notificationService(url, http, $localStorage) {
        let model = {};
        model.subscribe = subscribe;
        model.unsubscribe = unSubscribe;
        model.send = send;
        model.customSend = customSend;
        return model;

        function subscribe(credentials) {
            http.post(url.notification.subscribe, credentials).then(function (res) {
                $localStorage.gcm_token = credentials.gcm_token;
                if (typeof res.gcm_token !== 'undefined') {
                    $localStorage.gcm_token = res.gcm_token;
                }
            })
        }

        function unSubscribe(credentials) {
            http.post(url.notification.unsubscribe, credentials).then(function (res) {
                $localStorage.gcm_token = undefined;
            })
        }

        function send(credentials) {
            return http.post(url.notification.send, credentials)
        }

        function customSend(credentials) {
            return http.post(url.notification.customSend, credentials)
        }


    }

})();