;(function () {
  'use strict';

  angular.module('app')
    .controller('TestController', TestController);

  TestController.$inject = ['$localStorage', '$state', '$timeout'];

  function TestController($localStorage, $state, $timeout) {
    console.log('test controller start');
    const vm = this;


    vm.playPause = playPause;
    vm.getVideoInfo = getVideoInfo;


    // let localVideo = document.getElementById('localVideo');
    let localVideo = $('#localVideo')[0];

    document.addEventListener("deviceready", function () {
      // checkPermissions()
    }, false);

    function checkPermissions() {
      let camera;
      let micro;
      cameraAndMicroPermissions();

      function cameraAndMicroPermissions() {
        let counter = 0;
        cameraPermission();

        function cameraPermission() {
          cordova.plugins.diagnostic.requestRuntimePermission(function (status) {
            audioPermission();

            if (status.CAMERA === 'GRANTED') {
              camera = true;
            }
            accessToStartStream();
          }, function (error) {
            console.error(error);
          }, cordova.plugins.diagnostic.permission.CAMERA);
        }

        function audioPermission() {
          cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
            if (status.RECORD_AUDIO === "GRANTED") {
              micro = true;
            }
            accessToStartStream()
          }, function (error) {
            console.error(error);
          });
        }

        function accessToStartStream() {
          counter++;
          if (camera && micro) {
            console.log('access granted');
            // initLocalStream();
          } else if (counter > 1) {
            console.log('access denied, insufficient rights');
          }
        }
      }
    }


    function initLocalStream() {
      // Normalize the various vendor prefixed versions of getUserMedia.
      navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

      if (navigator.getUserMedia) {
        // Request the camera.
        navigator.getUserMedia(
          {
            audio: true,
            video: {width: 320, height: 240}
          },

          // Success Callback
          function (stream) {
            console.log('local stream ready');
            console.log(stream);
            localVideo.srcObject = stream;
            localVideo.onloadedmetadata = function (e) {
              localVideo.play();
            };
            // localVideo.srcObject = stream;
            // vm.streamURL = stream.id;
          },

          // Error Callback
          function (err) {
            // Log the error to the console.
            console.log('The following error occurred when trying to use getUserMedia: ' + err);
          }
        );
      } else {
        alert('Sorry, your browser does not support getUserMedia');
      }
    }



    function playPause() {
      localVideo.paused ? localVideo.play() : localVideo.pause();
      console.log('pause ', localVideo.paused);
    }

    function getVideoInfo() {
      console.log(localVideo.srcObject);
    }
  }

})();
