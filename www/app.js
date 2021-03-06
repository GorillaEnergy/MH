// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
;(function () {
    'use strict';

    angular.module('app', ['ionic', 'app.core', 'app.services', 'app.directives', 'app.request', 'app.filters'])
        .run(run);

    run.$inject = ['$ionicPlatform', '$timeout', '$state', 'toastr', 'fcm', 'userService', '$ionicSideMenuDelegate',
                   'purchaseService', 'notificationService', 'webrtc', 'rtcController', 'RTCService', 'volumeService'];

    function run($ionicPlatform, $timeout, $state, toastr, fcm, userService, $ionicSideMenuDelegate,
                 purchaseService, notificationService, webrtc, rtcController, RTCService, volumeService) {

        // Initialize Firebase
        let config = {
          apiKey: "AIzaSyCPyHbouuqslfJIbAynfdeCHlJb_2tJw9M",
          authDomain: "mind-hero-96b57.firebaseapp.com",
          databaseURL: "https://mind-hero-96b57.firebaseio.com",
          projectId: "mind-hero-96b57",
          storageBucket: "mind-hero-96b57.appspot.com",
          messagingSenderId: "19872374786"
        };
        firebase.initializeApp(config);

        $ionicPlatform.ready(function () {
            $timeout(function() {
                navigator.splashscreen.hide();
            }, 2000);

            if (window.StatusBar) {
            //     // Set the statusbar to use the default style, tweak this to
            //     // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();
            }

            // console.log(navigator);

            volumeService.init();

            document.addEventListener("pause", function () {
              console.log('pause');
            }, false);

            document.addEventListener("resume", function () {
              console.log('resume');
            }, false);

            // setInterval(function () {
            //   console.log('Online = ', navigator.onLine);
            // }, 5000)

            notificationService.token()
        })
    }
})();
