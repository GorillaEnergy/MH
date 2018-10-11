;(function () {
    'use strict';

    angular.module('service.notification', [])
        .service('notificationService', notificationService);

    notificationService.$inject = ['url', 'http', '$localStorage', '$timeout'];

    function notificationService(url, http, $localStorage, $timeout) {
        let model = {};
        model.token = token;
        model.subscribe = subscribe;
        model.unsubscribe = unSubscribe;
        model.send = send;
        model.customSend = customSend;
        return model;

        function token() {
            if (typeof window.FCMPlugin !== 'undefined') {
                window.FCMPlugin.getToken(function (token) {
                        if (token !== "") {
                            $localStorage.token_device = token;
                        }
                    }
                );
                window.FCMPlugin.onTokenRefresh(function (token) {
                    console.log(token);
                    $localStorage.token_device = token;
                });
            }
        }

        function subscribe(credentials) {
            http.post(url.notification.subscribe, credentials).then(function (res) {
                $localStorage.token_device = credentials.token_device;
                if (typeof res.token_device !== 'undefined') {
                    $localStorage.token_device = res.token_device;
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
