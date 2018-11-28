;(function () {
    'use strict';

    angular.module('service.RTCService', [])
        .service('RTCService', RTCService);

    RTCService.$inject = ['$ionicPopup', '$localStorage', '$timeout', '$rootScope', '$window', '$state', '$ionicLoading', 'firebaseDataSvc', 'modalSvc', 'utilsSvc','faceRecognitionService', 'rtcExtSvc'];

    function RTCService($ionicPopup, $localStorage, $timeout, $rootScope, $window, $state, $ionicLoading, firebaseDataSvc, modalSvc, utilsSvc, faceRecognitionService, rtcExtSvc) {
        console.log('RTCService start');

        let user;
        let localStream;
        let remoteStream;
        let channelName;
        let reconnectAccess = true;
        let reconnect;
        let popup;
        let callModal;
        let currentPsy;
        var video_out;
        var vid_thumb;
        let vidCount = 0;
        let userActivityArr = [];

        const RECONNECT_TIME = 60 * 1000;
        const RESET_RECONNECT_PERMISSION_TIME = 5 * 1000;
        const PUB_CONFIG = {
            number: "Anonymous", // listen on username line else Anonymous
            publish_key: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key //fixme
            subscribe_key: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
            // subscribe_key : 'sub-c-0d440624-9fdc-11e8-b377-126307b646dc', // Your Sub Key
            // publish_key   : 'pub-c-7ea57229-5447-4f4e-ba45-0baa9734f35e', // Your Pub Key
            ssl: true,
            autocam: true
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
                    checkRecall();
                }
            }
        }

        function setChildDefaultProp(psyId, childId) {
            firebaseDataSvc.setPsyChildNeedReload(psyId, childId, false);
        }
        
        function checkRecall() {
            if($localStorage.psyForRecall){
                callTo($localStorage.psyForRecall);
                delete $localStorage.psyForRecall;
            }
        }

        function onNeedReload(){
            firebaseDataSvc.onPsyChildNeedReload(currentPsy.id, user.id, function (snapshot) {
                if(snapshot){
                    $localStorage.psyForRecall = currentPsy;
                    end();
                }
            });
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
        }

        function checkPermissions(opponent_name, opponent_id, connection_type) {
            utilsSvc.permissionVideo().then(function () {
                return utilsSvc.permissionAudio().then(function () {
                    sendInvite(opponent_name, opponent_id);
                });
            }).catch(errorPermission);
        }

        function errorPermission() {
            alert('Access denied, insufficient rights');
        }

        function sendInvite(opponent_name, opponent_id) {
            let call_from_user = user.id + 'mhuser';
            let call_to_user = opponent_id + 'mhuser';
            firebaseDataSvc.setMetadataInvite(opponent_id, call_from_user);
            firebaseDataSvc.setInviteFrom(opponent_id, user.name);
            firebaseDataSvc.setMetadataNumber(opponent_id, user.id);
            firebaseDataSvc.onAnswerChange(opponent_id, (snapshot) => {
                // console.log(snapshot.val());
                $timeout(function () {
                    if (snapshot === true) {
                        offAnswerWatcher(opponent_id);
                        dialing('joinRTC', call_from_user, call_to_user, opponent_name);
                    } else if (snapshot === false) {
                        offAnswerWatcher(opponent_id);
                    } else if (snapshot === 'add') {
                        offAnswerWatcher(opponent_id);
                        console.log(vidCount, remoteStream);
                        if (!vidCount || remoteStream) {
                            dialing('joinRTC', call_from_user, call_to_user, opponent_name);
                        } else {
                            softEnd();
                            dialing('joinRTC', call_from_user, call_to_user, opponent_name);
                        }
                    } else if (snapshot === 'chat') {
                        console.log('to kid chat');
                        offAnswerWatcher(opponent_id);
                        $localStorage.consultant = {id: opponent_id};
                        $state.go('kid-chat');
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
            modalSvc.conversation(hangUp);

            $timeout(function () {
                video_out = document.getElementById("vid-box");
                vid_thumb = document.getElementById("vid-thumb");
                console.log(your_name, opponent_nick, opponent_name);
                errWrap(login, your_name, opponent_nick);
                // if (type === 'joinRTC') {
                //     $timeout(function () {
                //         // console.log('makeCall to ', opponent_nick);
                //         errWrap(makeCall, opponent_nick);
                //     }, 3000);
                // }
            }, 1500);

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


        function login(username, opponent_nick) {
            console.log('login function');
            PUB_CONFIG.number = username;
            var phone = window.phone = PHONE(PUB_CONFIG);
            var ctrl = window.ctrl = CONTROLLER(phone);
            ctrl.ready(function () {
                ctrl.addLocalStream(video_out);
                addLog("Logged in as " + username);
                errWrap(makeCall, opponent_nick);
            });
            ctrl.receive(function (session) {
                session.connected(function (session) {
                    callModal.close();
                    $ionicLoading.hide();
                    onNeedReload();
                    rtcExtSvc.startAutoCheckerUserVideo(currentPsy.id);
                    console.log('session.connected');
                    activityCalc(session.number, true);
                    // video_out.appendChild(session.video);
                    if ( utilsSvc.getNumberFromString(session.number) !== currentPsy.id ) {
                        video_out.appendChild(session.video);
                    } else {
                        vid_thumb.appendChild(session.video);
                        faceRecognitionService.init(currentPsy.id);
                    }
                    $rootScope.$broadcast('video-conference-user-arr', userActivityArr);
                    addLog(session.number + " has joined.");
                    faceRecognitionService.calculatePsyValues();
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
                    rtcExtSvc.removeUserFromCheck(utilsSvc.getNumberFromString(session.number));
                    if(utilsSvc.getNumberFromString(session.number) === currentPsy.id){
                        end();
                    }
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
                        return v.user == name;
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
            if(callModal){
                callModal.close();
            }
            var reloadBind = window.location.reload.bind(window.location);
            softEnd();
            setTimeout(function(){
                reloadBind();
            }, 2000);
        }

        function softEnd() {
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

        function errWrap(fxn, form, opponent) {
            try {
                return fxn(form, opponent);
            } catch (err) {
                alert(err);
                return false;
            }
        }


        function callTo(opponent) {
            currentPsy = opponent;
            callProcess(opponent);
            setChildDefaultProp(currentPsy.id, user.id);
            checkPermissions(opponent.name, opponent.id, 'joinRTC');
        }

        function callProcess(opponent) {
            callModal = modalSvc.call(cancelCallback);
            console.log(opponent);
            watchCancelPsy(opponent);

            function cancelCallback() {
                callModal.close();
                firebaseDataSvc.setMetadataCancel(opponent.id);
                offAnswerWatcher(opponent.id);
            }

            function watchCancelPsy(opponent){
                firebaseDataSvc.onAnswerChange(opponent.id, function (snapshot) {
                    if(snapshot === false){
                        offAnswerWatcher(opponent.id);
                        callModal.close();
                    }
                });
            }
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
