;(function () {
    'use strict';

    angular.module('service.RTCExtService', [])
        .service('RTCExtService', RTCExtService);

    RTCExtService.$inject = [];

    function RTCExtService() {
        let model = {};

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

        model.enableHackOpacity = enableHackOpacity;
        model.disableHackOpacity = disableHackOpacity;
        return model;

    }
})();
