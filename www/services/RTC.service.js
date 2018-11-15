;(function () {
    'use strict';

    angular.module('service.RTCService', [])
        .service('RTCService', RTCService);

    RTCService.$inject = ['$ionicPopup', '$localStorage', '$timeout', '$rootScope', '$window', '$state', '$ionicLoading','utilsSvc', 'faceRecognitionService', 'RTCExtService'];

    function RTCService($ionicPopup, $localStorage, $timeout, $rootScope, $window, $state, $ionicLoading,  utilsSvc,faceRecognitionService, RTCExtService) {
        console.log('RTCService start');

        let user;
        let localStream;
        let remoteStream;
        let channelName;
        let reconnectAccess = true;
        let reconnect;
        let popup;
        let currentPsy;

        UserChecker();

        function UserChecker() {
            let userTimer = setInterval(timer, 1000);

            function timer() {
                if ($localStorage.user) {
                    user = $localStorage.user;
                    onlineChanger();
                    clearInterval(userTimer);
                }
            }
        }

        document.addEventListener("deviceready", function () {
            console.log('deviceready');
            if (user) {
                onlineChanger()
            }
        }, false);

        function onlineChanger() {
            console.log('onlineChanger()');
            document.addEventListener("pause", function () {
                // autoHangup();
                firebase.database().ref('/WebRTC/users/' + $localStorage.user.id + '/online').set(false);
            }, false);

            document.addEventListener("resume", function () {
                console.log("resume");
                firebase.database().ref('/WebRTC/users/' + $localStorage.user.id + '/online').set(true);
            }, false);

            initFB();
        }

        function autoHangup() {
            $rootScope.$broadcast('pubnub-auto-hangup', true);
            end();
        }

        function initFB() {
            watchInvites()
        }

        function watchInvites() {
            let fb = firebase.database();
            fb.ref('/WebRTC/users/' + user.id + '/metadata/invite').on('value', (snapshot) => {
                $timeout(function () {
                    if (snapshot.val()) {

                        fb.ref('/WebRTC/users/' + user.id + '/metadata/invite_from').once('value', (snapshot) => {
                            incomingCallMsg(snapshot.val())
                    })

                    }
                })
        });
        }

        function checkPermissions(opponent_name, opponent_id, connection_type) {
            let camera;
            let micro;
            // dialing(); for debugg
            cameraAndMicroPermissions();

            function cameraAndMicroPermissions() {
                let counter = 0;
                cameraPermission();

                function cameraPermission() {

                    if (ionic.Platform.platform() === 'android') {

                        cordova.plugins.diagnostic.requestRuntimePermission(function (status) {
                            audioPermission();

                            if (status.CAMERA === 'GRANTED') {
                                camera = true;
                            }
                            accessToStartStream();
                        }, function (error) {
                            console.error(error);
                        }, cordova.plugins.diagnostic.permission.CAMERA);

                    } else {

                        cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                            if (status === "authorized") {
                                camera = true;
                            }
                            audioPermission();
                        }, function (error) {
                            console.error(error);
                        });
                    }
                }

                function audioPermission() {
                    cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {

                        if (ionic.Platform.platform() === 'android') {
                            if (status.RECORD_AUDIO === "GRANTED") {
                                micro = true;
                            }

                        } else {
                            if (status === "authorized") {
                                micro = true;
                            }
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
                        if (connection_type === 'initRTC') {
                            fb.ref('/WebRTC/users/' + user.id + '/metadata/answer').set(true);
                        }

                        $timeout(function () {
                            fb.ref('/WebRTC/users/' + user.id + '/metadata').remove();
                        }, 3000);

                        if (connection_type === 'initRTC') {
                            console.log('initRTC');
                            dialing(connection_type, user.id + 'mhuser', null, opponent_name);
                        } else {
                            console.log('sendInvite');
                            sendInvite(opponent_name, opponent_id)
                        }
                    } else if (counter > 1) {
                        console.log('access denied, insufficient rights');
                        alert('access denied, insufficient rights');
                        // console.log('if calling you, close room and dialog!!!');
                    }
                }
            }
        }

        function sendInvite(opponent_name, opponent_id) {
            currentPsy = opponent_id;
            let fb = firebase.database();
            let call_from_user = user.id + 'mhuser';
            let call_to_user = opponent_id + 'mhuser';

            // console.log('звонит: ' + call_from_user + ',пользователю: ' + call_to_user);

            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/invite').set(call_from_user);
            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/invite_from').set(user.name);
            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/number').set(user.id);
            fb.ref('/WebRTC/users/' + opponent_id + '/metadata/answer').on('value', (snapshot) => {
                // console.log(snapshot.val());
                $timeout(function () {
                    if (snapshot.val() === true) {
                        offAnswerWatcher(opponent_id);
                        dialing('joinRTC', call_from_user, call_to_user, opponent_name)
                    } else if (snapshot.val() === false) {
                        offAnswerWatcher(opponent_id);
                    } else if (snapshot.val() === 'add') {
                        offAnswerWatcher(opponent_id);
                        console.log(vidCount, remoteStream);
                        if (!vidCount || remoteStream) {
                            dialing('joinRTC', call_from_user, call_to_user, opponent_name)
                        } else {
                            softEnd();
                            dialing('joinRTC', call_from_user, call_to_user, opponent_name)
                        }
                    } else if (snapshot.val() === 'chat') {
                        console.log('to kid chat');
                        offAnswerWatcher(opponent_id);
                        $localStorage.consultant = {id: opponent_id};
                        $state.go('kid-chat')
                    }
                });
        });
        }

        function offAnswerWatcher(id) {
            firebase.database().ref('/WebRTC/users/' + id + '/metadata/answer').off();
        }

        function dialing(type, your_name, opponent_nick, opponent_name) {
            popup = true;
            //joinRTC  initRTC
            console.log(user);

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
                        onTap: function (e) {
                            hangUp();
                        }
                    }]
            });

            $timeout(function () {
                video_out = document.getElementById("vid-box");
                vid_thumb = document.getElementById("vid-thumb");

                console.log(your_name, opponent_nick, opponent_name);

                errWrap(login, your_name);

                if (type === 'joinRTC') {
                    // $timeout(function () {
                    // console.log('makeCall to ', opponent_nick);
                    errWrap(makeCall, opponent_nick);
                    // }, 3000)
                }
            }, 1000);

            function hangUp() {
                console.log('hangUp');
                popup = false;
                conversationPopup.close();
                end();
            }
        }


        function reconnectTimerStart() {
            reconnect = true;
            $timeout(function () {
                reconnect = false;
            }, 60000);

            let timer = setInterval(timerFnc, 1000);

            function timerFnc() {
                console.log(reconnect);
                if (!reconnect) {
                    stopTimer();
                }
            }

            function stopTimer() {
                resetReconnectPermission();
                clearInterval(timer)
            }
        }

        function resetReconnectPermission() {
            console.log('resetReconnectPermission');
            reconnectAccess = false;
            $timeout(function () {
                reconnectAccess = true;
            }, 5000);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////

        var video_out;
        var vid_thumb;
        let vidCount = 0;
        let userActivityArr = [];

        function login(username) {
            var isDoctorHere = false;
            var vid = document.getElementById('video-child');
            var phone = window.phone = PHONE({
                number: username || "Anonymous", // listen on username line else Anonymous
                publish_key: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
                subscribe_key: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
                ssl: true
            });

            var ctrl = window.ctrl = CONTROLLER(phone);

            ctrl.ready(function () {
                ctrl.addLocalStream(vid_thumb);
                addLog("Logged in as " + username);
            });

            ctrl.receive(function (session) {
                session.connected(function (session) {
                    if (isDoctorHere) {
                        session.video.style.float = "left";
                        session.video.style.width = "30vw";
                        session.video.style.height = "30vw";
                        session.video.style.background = "black";
                        vid.appendChild(session.video);
                    } else {
                        $ionicLoading.hide();
                        isDoctorHere = true;
                        var video_out = document.getElementById('video-doctor');
                        session.video.style.width = "100vw";
                        session.video.style.height = "40vh";
                        session.video.style.top = "0px";
                        session.video.style.zIndex = "-1";
                        session.video.style.backgroundColor = "transparent";
                        video_out.appendChild(session.video);
                        faceRecognitionService.init(currentPsy);
                        cordova.plugins.iosrtc.refreshVideos();
                    }
                });

                session.ended(function (session) {
                    console.log('session.ended');
                    addLog(session.number + " has left.");
                    ctrl.getVideoElement(session.number).remove();
                    activityCalc(session.number, false);
                });
            });

            ctrl.videoToggled(function (session, isEnabled) {
                ctrl.getVideoElement(session.number).toggle(isEnabled);
                addLog(session.number + ": video enabled - " + isEnabled);
            });

            ctrl.audioToggled(function (session, isEnabled) {
                ctrl.getVideoElement(session.number).css("opacity", isEnabled ? 1 : 0.75);
                addLog(session.number + ": audio enabled - " + isEnabled);
            });

            function activityCalc(name, join) {
                console.log(name, join);
                let index;
                search(name);

                function search(name) {
                    for (let i = 0; i < userActivityArr.length; i++) {
                        if (userActivityArr[i].user == name) {
                            index = i;
                            console.log('index = ' + i);
                            break;
                        }
                    }
                    change(name);
                }

                function change(name) {
                    if (join) {
                        userActivityArr.push({user: name})
                    } else {
                        userActivityArr.splice(index, 1)
                    }

                    vidCalc(name)
                }

                function vidCalc(name) {
                    vidCount = userActivityArr.length;
                    $rootScope.$broadcast('conversation-view', vidCount);
                    $rootScope.$broadcast('video-conference-user-arr', userActivityArr);

                    console.log('User arr', userActivityArr);
                    console.log('User count', vidCount);
                    if (!vidCount) {
                        remoteStream = false;
                        channelName = null;
                    } else {
                        remoteStream = name;
                    }
                }
            }

            return false;
        }

        function makeCall(opponent_nick) {
            console.log('makeCall function', 'call to ', opponent_nick);
            if (!window.phone) alert("Login First!");
            var num = opponent_nick;
            if (phone.number() == num) return false; // No calling yourself!
            ctrl.isOnline(num, function (isOn) {
                if (isOn) {
                    ctrl.dial(num);
                    reconnect = false;
                } else {
                    if (reconnectAccess) {
                        $timeout(function () {
                            makeCall(opponent_nick);
                        }, 2000);

                        if (!reconnect) {
                            reconnectTimerStart();
                        }
                    } else {
                        reconnect = false;
                        alert("User if Offline");
                    }
                }

            });
            return false;
        }

        function mute() {
            var audio = ctrl.toggleAudio();
            if (!audio) $("#mute").html("Unmute");
            else $("#mute").html("Mute");
        }

        function end() {
            // $window.location.reload();
            softEnd();
        }

        function softEnd() {
            ctrl.hangup();
            RTCExtService.disableHackOpacity();
            faceRecognitionService.offMaskEvent();
        }

        function pause() {
            var video = ctrl.toggleVideo();
            if (!video) $('#pause').html('Unpause');
            else $('#pause').html('Pause');
        }

        function getVideo(number) {
            return $('*[data-number="' + number + '"]');
        }

        function addLog(log) {
            // $('#logs').append("<p>"+log+"</p>");
            console.log(log);
        }

        function errWrap(fxn, form) {
            try {
                return fxn(form);
            } catch (err) {
                alert(err);
                return false;
            }
        }

        let model = {};
        model.incomingCallMsg = incomingCallMsg;
        model.callTo = callTo;
        model.signalLost = signalLost;
        model.closeStream = closeStream;
        return model;


        function incomingCallMsg(opponent_name) {
            let scope = $rootScope.$new(true);
            scope.user_name = opponent_name;

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
                        onTap: function (e) {
                            accept(opponent_name);
                        }
                    }, {
                        text: 'Reject',
                        type: 'button-default',
                        onTap: function (e) {
                            reject();
                        }
                    }]
            });

            function accept() {
                console.log("accept");
                checkPermissions(opponent_name, null, 'initRTC');
            }

            function reject() {
                let fb = firebase.database();
                console.log("reject");
                fb.ref('/WebRTC/users/' + user.id + '/metadata/answer').set(false);
                $timeout(function () {
                    fb.ref('/WebRTC/users/' + user.id + '/metadata').remove();
                })
            }

        }

        function callTo(opponent) {
            console.log(opponent);
            checkPermissions(opponent.name, opponent.id, 'joinRTC');
        }

        ////////////////////////////////////////////////////////
        function signalLost() {
            console.log('signalLost');
        }

        function closeStream() {
            console.log('closeStream');
        }

    }
})();
