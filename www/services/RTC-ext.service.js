;(function () {
    'use strict';

    angular.module('service.RTCExtService', [])
        .service('RTCExtService', RTCExtService);

    RTCExtService.$inject = ['http', 'url'];

    function RTCExtService(http, url) {
        let servers = [];
        let currentUserList = [];
        let currentPsy = {
            id: null,
            lastVideoTime: null
        };
        let checkerHandler;
        let model = {
            init: init,
            getServers: getServers,
            getXirsysServer: getXirsysServer,
            addUserToCheck: addUserToCheck,
            startAutoCheckerUserVideo: startAutoCheckerUserVideo,
            removeUserFromCheck: removeUserFromCheck,
            disableHackOpacity: disableHackOpacity,
            enableHackOpacity: enableHackOpacity
        };
        const TIME_CHECK_VIDEO = 8 * 1000;

        function init() {
            getXirsysServer();
        }

        function getServers() {
            return servers;
        }

        function getXirsysServer() {
            if (servers.length) {
                return $q.when(servers);
            }
            return http.get(url.rtc_servers.all).then(function (res) {
                servers = res.data ? res.data : [];
                return res;
            });
        }

        function startAutoCheckerUserVideo(psyId) {
            if (checkerHandler && currentPsy.id === psyId) return;
            currentUserList = [];
            currentPsy = {
                id: psyId,
                lastVideoTime: 0
            };
            checkerHandler = setInterval(checkPsyChildVideo, TIME_CHECK_VIDEO);
        }

        function checkPsyChildVideo() {
            checkPsyVideo();
            checkUserVideo();
        }

        function checkUserVideo(){
            let removeId = false;
            currentUserList.forEach(function (val) {
                let video = $('[data-number="' + val.id + 'mhuser"]').get(0);
                if (video && video.currentTime && val.id) {
                    if (video.currentTime > 0 && video.currentTime === val.lastVideoTime) {
                        firebaseDataSvc.setPsyChildNeedReload(currentPsy.id, val.id, true);
                        removeId = val.id;
                    } else {
                        val.lastVideoTime = video.currentTime;
                    }
                }
            });
            if (removeId) removeUserFromCheck(removeId);
        }

        function checkPsyVideo() {
            let video = $('[data-number="' + currentPsy.id + 'mhuser"]').get(0);
            if (video && video.currentTime) {
                if (video.currentTime > 0 && video.currentTime === currentPsy.lastVideoTime) {
                    firebaseDataSvc.setPsyNeedReload(currentPsy.id, true);
                } else {
                    currentPsy.lastVideoTime = video.currentTime;
                }
            }
        }

        function addUserToCheck(userId) {
            currentUserList.push({
                id: userId,
                lastVideoTime: 0
            });
        }

        function removeUserFromCheck(userId) {
            let index = currentUserList.findIndex(function (item) {
                return +item.id === +userId;
            });
            currentUserList.slice(index, 1);
        }

        function enableHackOpacity(){
            var navEl = document.getElementById('navCont');
            var navCont = document.querySelector('.popup-container.conversation');
            var body = document.querySelector('body');
            navEl.style.opacity = '0';
            navCont.style.backgroundColor = "transparent";
            body.style.backgroundColor = 'transparent';
        }

        function disableHackOpacity(){
            var navEl = document.getElementById('navCont');
            var navCont = document.querySelector('.popup-container.conversation');
            navCont.style.backgroundColor = '#000';
            navEl.style.opacity = '1';
        }

        return model;

    }
})();
