;(function () {
    'use strict';

    angular.module('service.RTCService', [])
        .service('RTCService', RTCService);

    RTCService.$inject = ['$ionicPopup', '$localStorage', '$timeout', '$rootScope', '$window', '$state', '$ionicLoading', 'firebaseDataSvc', 'modalSvc', 'utilsSvc'];

    function RTCService($ionicPopup, $localStorage, $timeout, $rootScope, $window, $state, $ionicLoading, firebaseDataSvc, modalSvc, utilsSvc) {
        console.log('RTCService start');

        let user;
        let localStream;
        let remoteStream;
        let channelName;
        let reconnectAccess = true;
        let reconnect;
        let popup;

        var video_out;
        var vid_thumb;
        let vidCount = 0;
        let userActivityArr = [];

        const RECONNECT_TIME = 30 * 1000;
        const RESET_RECONNECT_PERMISSION_TIME = 5 * 1000;
        const PUB_CONFIG = {
            number: username || "Anonymous", // listen on username line else Anonymous
            publish_key: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key //fixme
            subscribe_key: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
            // subscribe_key : 'sub-c-0d440624-9fdc-11e8-b377-126307b646dc', // Your Sub Key
            // publish_key   : 'pub-c-7ea57229-5447-4f4e-ba45-0baa9734f35e', // Your Pub Key
            ssl: true
        };

        init();

        function init() {
            UserChecker();
        }

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
                firebaseDataSvc.setOnlineStatus($localStorage.user.id, false);
            }, false);

            document.addEventListener("resume", function () {
                firebaseDataSvc.setOnlineStatus($localStorage.user.id, true);
            }, false);

            watchInvites();
        }

        function watchInvites() {
            firebaseDataSvc.watchInvites(user.id, (snapshot) => {
                $timeout(function () {
                    if (snapshot) {
                        firebaseDataSvc.getInviteFrom(user.id, (snapshot) => {
                            incomingCallMsg(snapshot);
                        });
                    }
                })
            });
        }

        function checkPermissions(opponent_name, opponent_id, connection_type) {
            let camera;
            let micro;
            cameraAndMicroPermissions();

            function cameraAndMicroPermissions() {
                let counter = 0;
                cameraPermission();

                function cameraPermission() {
                    if (ionic.Platform.platform() === 'android') {
                        cordova.plugins.diagnostic.requestRuntimePermission(function (status) {
                            audioPermission();
                            console.log(status);
                            if (status === 'GRANTED') {
                                camera = true;
                            }
                            accessToStartStream();
                        }, function (error) {
                            console.error(error);
                        }, cordova.plugins.diagnostic.permission.CAMERA);
                    } else {
                        cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                            console.log(status);
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
                        console.log(status);
                        if (ionic.Platform.platform() === 'android') {
                            if (status === "GRANTED") {
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
                    console.log(camera, micro);
                    counter++;
                    if (camera && micro) {
                        console.log('access granted');
                        if (connection_type === 'initRTC') {
                            firebaseDataSvc.setAnswer(user.id, true);
                        }
                        $timeout(function () {
                            firebaseDataSvc.remove(user.id);
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
                    }
                }
            }
        }

        function sendInvite(opponent_name, opponent_id) {
            let fb = firebase.database();
            let call_from_user = user.id + 'mhuser';
            let call_to_user = opponent_id + 'mhuser';

            // console.log('звонит: ' + call_from_user + ',пользователю: ' + call_to_user);

            firebaseDataSvc.setMetadataInvite(opponent_id, call_from_user);
            firebaseDataSvc.setMetadataInvite(opponent_id, user.name);
            firebaseDataSvc.setMetadataNumber(opponent_id, user.id);
            firebaseDataSvc.onAnswerChange(opponent_id, (snapshot) => {
                // console.log(snapshot.val());
                $timeout(function () {
                    if (snapshot === true) {
                        offAnswerWatcher(opponent_id);
                        dialing('joinRTC', call_from_user, call_to_user, opponent_name)
                    } else if (snapshot === false) {
                        offAnswerWatcher(opponent_id);
                    } else if (snapshot === 'add') {
                        offAnswerWatcher(opponent_id);
                        console.log(vidCount, remoteStream);
                        if (!vidCount || remoteStream) {
                            dialing('joinRTC', call_from_user, call_to_user, opponent_name)
                        } else {
                            softEnd();
                            dialing('joinRTC', call_from_user, call_to_user, opponent_name)
                        }
                    } else if (snapshot === 'chat') {
                        console.log('to kid chat');
                        offAnswerWatcher(opponent_id);
                        $localStorage.consultant = {id: opponent_id};
                        $state.go('kid-chat')
                    }
                })
            });
        }

        function offAnswerWatcher(id) {
            firebaseDataSvc.removeAnswerWatch(id);
        }

        function dialing(type, your_name, opponent_nick, opponent_name) {
            popup = true;
            //joinRTC  initRTC
            console.log(user);
            modalSvc.conversation(hangUp());

            $timeout(function () {
                video_out = document.getElementById("vid-box");
                vid_thumb = document.getElementById("vid-thumb");

                console.log(your_name, opponent_nick, opponent_name);

                errWrap(login, your_name);

                if (type === 'joinRTC') {
                    $timeout(function () {
                        // console.log('makeCall to ', opponent_nick);
                        errWrap(makeCall, opponent_nick);
                    }, 3000)
                }
            }, 1000);

            function hangUp() {
                console.log('hangUp');
                popup = false;
                end();
            }
        }


        function reconnectTimerStart() {
            reconnect = true;
            $timeout(function () {
                reconnect = false;
            }, RECONNECT_TIME);

            let timer = setInterval(timerFnc, 1000);

            function timerFnc() {
                console.log(reconnect);
                if (!reconnect) {
                    resetReconnectPermission();
                    clearInterval(timer)
                }
            }
        }

        function resetReconnectPermission() {
            console.log('resetReconnectPermission');
            reconnectAccess = false;
            $timeout(function () {
                reconnectAccess = true;
            }, RESET_RECONNECT_PERMISSION_TIME);

        }


        function login(username) {
            console.log('login function');
            var phone = window.phone = PHONE(PUB_CONFIG);
            var ctrl = window.ctrl = CONTROLLER(phone);
            ctrl.ready(function () {
                // ctrl.addLocalStream(vid_thumb);
                ctrl.addLocalStream(video_out);
                addLog("Logged in as " + username);
            });
            ctrl.receive(function (session) {
                session.connected(function (session) {
                    $ionicLoading.hide();
                    console.log('session.connected');
                    activityCalc(session.number, true);
                    // video_out.appendChild(session.video);
                    vidCount > 1 ? video_out.appendChild(session.video) : vid_thumb.appendChild(session.video);
                    $rootScope.$broadcast('video-conference-user-arr', userActivityArr);
                    addLog(session.number + " has joined.");
                });

                // session.connected(function (session) {
                //     $ionicLoading.hide();
                //     // session.video.addEventListener('canplay', function () {
                //         console.log('canplay');
                //         session.video.style.width = "100%";
                //         video_out.style.width = "100%";
                //         session.video.style.height = "70vh";
                //         video_out.style.height = "70vh";
                //         session.video.style.top = "10px";
                //         video_out.appendChild(session.video);
                //     // });
                // });

                session.ended(function (session) {
                    ctrl.getVideoElement(session.number).remove();
                    addLog(session.number + " has left.");
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
                if (join) {
                    $ionicLoading.hide()
                }
                console.log(name, join);
                let index;

                search(name);

                function search(name) {
                    index = userActivityArr.findIndex((v, k) => {
                        return v.name == name;
                    });
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
            // $("vid-box").empty();
            $window.location.reload();
            ctrl.hangup();
        }

        function softEnd() {
            // $("vid-box").empty();
            ctrl.hangup();
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

        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new
            Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-46933211-3', 'auto');
        ga('send', 'pageview');

        function callTo(opponent) {
            console.log(opponent);
            checkPermissions(opponent.name, opponent.id, 'joinRTC');
        }

        function signalLost() {
            console.log('signalLost');
        }

        function closeStream() {
            console.log('closeStream');
        }

        let model = {};
        model.callTo = callTo;
        model.signalLost = signalLost;
        model.closeStream = closeStream;

        return model;

    }
})();
