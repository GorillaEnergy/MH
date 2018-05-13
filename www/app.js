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

    run.$inject = ['$ionicPlatform', '$timeout', '$state', 'toastr', 'fcm', 'userService', '$ionicSideMenuDelegate'];

    function run($ionicPlatform, $timeout, $state, toastr, fcm, userService, $ionicSideMenuDelegate) {

        // Array.prototype.sum = function () {
        //     return this.reduce(function (a, b) {
        //         return a + b;
        //     });
        // };
        // // Initialize Firebase
        // let config = {
        //     /*For .uk site*/
        //     apiKey: "AIzaSyAoQSziGTmVrS7M9t9B8y1gDH1uIaI7CDo",
        //     authDomain: "elft-4dc55.firebaseapp.com",
        //     databaseURL: "https://elft-4dc55.firebaseio.com",
        //     projectId: "elft-4dc55",
        //     storageBucket: "elft-4dc55.appspot.com",
        //     messagingSenderId: "33713645199"
        //     /*For .com site*/
        //     // apiKey: "AIzaSyBAh0Rt2ZkxOnLODLtkVkpJtfTxRPZWqhY",
        //     // authDomain: "improvewell-acfd0.firebaseapp.com",
        //     // databaseURL: "https://improvewell-acfd0.firebaseio.com",
        //     // projectId: "improvewell-acfd0",
        //     // storageBucket: "improvewell-acfd0.appspot.com",
        //     // messagingSenderId: "829567431337"
        // };
        // firebase.initializeApp(config);
        //
        // $ionicPlatform.ready(function () {
        //     setTimeout(function() {
        //         navigator.splashscreen.hide();
        //     }, 2000);
        //     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        //     // for form inputs)
        //     if (window.cordova && window.cordova.plugins.Keyboard) {
        //         // cordova.plugins.Keyboard.disableScroll(true);
        //         cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        //     }
        //     if (window.StatusBar) {
        //         // Set the statusbar to use the default style, tweak this to
        //         // remove the status bar on iOS or change it to use white instead of dark colors.
        //         StatusBar.styleDefault();
        //     }
        //
        //     autoLogin();
        //
        //     document.addEventListener("resume", function () {
        //         fcm.subscribe();
        //     }, false);
        //
        //     function autoLogin () {
        //         let user = userService.getUser();
        //         if (angular.isDefined(user)) {
        //             $state.go('tab.dashboard');
        //         } else {
        //             $state.go('authorization');
        //         }
        //     }
        // })
    }
})();
