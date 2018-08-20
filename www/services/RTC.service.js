;(function () {
  'use strict';

  angular.module('service.RTCService', [])
    .service('RTCService', RTCService);

  RTCService.$inject = ['$ionicPopup', '$localStorage', '$timeout', '$rootScope'];

  function RTCService($ionicPopup, $localStorage, $timeout, $rootScope) {
    console.log('RTCService start');

    let user = $localStorage.user;
    // let user = {};  //tmp!
    // user.id = 11;   //tmp!

    let callRightNow = false;
    let localStreamOn = false;
    let streamOffline = false;

    document.addEventListener("deviceready", function () {
      console.log('deviceready');
      initFB();
    }, false);

    function initFB() {
      watchInvites()
    }
    function watchInvites() {
      let fb = firebase.database();
      fb.ref('/WebRTC/users/' + user.id + '/invite').on('value', (snapshot) => {
        $timeout(function () {
          if (snapshot.val()) {

            fb.ref('/WebRTC/users/' + user.id + '/invite_from').once('value', (snapshot) => {
              incomingCallMsg(snapshot.val())
            })

          }
        })
      });
    }

    function checkPermissions(user_name) {
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

            let fb = firebase.database();
            fb.ref('/WebRTC/users/' + user.id + '/answer').set(true);
            dialing('initRTC', user.id + 'mhuser', null, user_name);

            $timeout(function () {
              fb.ref('/WebRTC/users/' + user.id + '/invite').remove();
              fb.ref('/WebRTC/users/' + user.id + '/invite_from').remove();
              fb.ref('/WebRTC/users/' + user.id + '/answer').remove();
            }, 1500);


          } else if (counter > 1) {
            console.log('access denied, insufficient rights');
            alert('access denied, insufficient rights')
          }
        }
      }
    }

    function dialing(type, your_name, opponent_nick, opponent_name) {
      //joinRTC  initRTC
      console.log(user);
      streamOffline = false;

      let scope = $rootScope.$new(true);

      let conversationPopup = $ionicPopup.show({
        title: opponent_name,
        templateUrl: './components/conversation/conversation.html',
        cssClass: 'conversation',
        scope: scope,
        buttons: [
          {
            text: 'Hang Up',
            type: 'button-positive',
            onTap: function (e) { hangUp(); }
          }]
      });

      var popTimer = setInterval(myTimer, 1000);
      function myTimer() {
        if (streamOffline) {
          myStopFunction()
        }
      }
      function myStopFunction() {
        clearInterval(popTimer);
      }
      $timeout(function () {
        console.log(your_name, opponent_nick, opponent_name);
        document.getElementById('username').value = your_name;
        // document.getElementById('call').value = opponent_nick;
        scope.opponent_nick = opponent_nick;

        // if (!localStreamOn) {
          callRightNow = true;
          localStreamOn = true;
          document.getElementById('login_submit').click();
        // }

        if (type === 'joinRTC') {
          document.getElementById('username').value = opponent_nick;
          $timeout(function () {
            console.log('timeout end');
            document.getElementById('call_submitt').click();
          }, 1500)
        }
      }, 1000)

    }
    function hangUp() {
      console.log('hangUp');
      localStreamOn = false;
      document.getElementById('end').click()
      // conversationPopup.close()
    }
    function test(data) {
      console.log('test ', data);
    }

    //////////////////////////////////////////////
    let model = {};

    model.incomingCallMsg = incomingCallMsg;
    model.callTo = callTo;
    model.signalLost = signalLost;
    model.closeStream = closeStream;

    return model;


    function incomingCallMsg(user_name) {
      let scope = $rootScope.$new(true);
      scope.user_name = user_name;

      let incomingCallPopup = $ionicPopup.show({
        title: 'Incoming call',
        templateUrl: './components/incoming-call/incoming-call.html',
        // templateUrl: '../components/conversation/conversation.html',
        // cssClass: 'conversation',
        scope: scope,
        buttons: [
          {
            text: 'Accept',
            type: 'button-positive',
            onTap: function (e) { accept(user_name); }
          }, {
            text: 'Reject',
            type: 'button-default',
            onTap: function (e) { reject(); }
          }]
      });

      function accept() {
        console.log("accept");
        checkPermissions(user_name);
      }

      function reject() {
        let fb = firebase.database();
        console.log("reject");
        fb.ref('/WebRTC/users/' + user.id + '/answer').set(false);
        $timeout(function () {
          fb.ref('/WebRTC/users/' + user.id + '/invite').remove();
          fb.ref('/WebRTC/users/' + user.id + '/invite_from').remove();
          fb.ref('/WebRTC/users/' + user.id + '/answer').remove();
        })
      }

    }

    function callTo(data) {
      console.log(data);
    }


    ////////////////////////////////////////////////////////
    function signalLost() {
      console.log('signalLost');
    }
    function closeStream() {
      console.log('closeStream');
      // $ionicPopup.hide();
      streamOffline = true;
    }

  }
})();
