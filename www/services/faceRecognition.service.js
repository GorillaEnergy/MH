;(function () {
    'use strict';

    angular.module('service.faceRecognition', [])
        .service('faceRecognitionService', faceRecognitionService);

    faceRecognitionService.$inject = ['$timeout', 'RTCExtService'];

    function faceRecognitionService($timeout, RTCExtService, consultantService) {

        let imageDataSizes;
        let videoResolutions;
        let outerScaleX;
        let outerScaleY;
        let x;
        let y;
        let scaleX;
        let scaleY;
        let currentPsyId;
        let initScale = null; // Block width * aspect ratio * custom scale / mask height
        let resolution = {}; // the video stream resolution (usually 640x480)
        let webcam = null;
        let mask = null;
        let currentMask;

        function onMaskEvent(psyId) {
            imageDataSizes = webcam.getBoundingClientRect();
            videoResolutions = resolution;
            outerScaleX = imageDataSizes.width / videoResolutions.width;
            outerScaleY = imageDataSizes.width * 0.75 / videoResolutions.height;
            onMask(psyId, function (maskObj) {
                setTimeout(function () {
                    window.requestAnimFrame(function () {
                        handleTrackingResults(maskObj);
                    });
                }, 40);
            });
        }

        function onMask(psyId, callback) {
            window.firebase.database().ref('/WebRTC/users/' + psyId + '/mask').on('value', (snapshot) => {
                callback(snapshot.val());
            });
        }

        function offMaskEvent(psyId) {
            window.firebase.database().ref('/WebRTC/users/' + (psyId || currentPsyId) + '/mask').off();
        }


        function handleTrackingResults(maskObj) {
            x = maskObj.x * outerScaleX;
            y = maskObj.y * outerScaleY + imageDataSizes.top;
            scaleX = maskObj.scaleX * outerScaleX;
            scaleY = maskObj.scaleY * outerScaleY;
            if (maskObj.x) {
                mask.style.transform = "matrix(" + scaleX + ",0.0,0.0," + scaleY + "," + x + "," + y + ") rotate(" + maskObj.rotationZ + "rad)";
                mask.style.opacity = "0.7";
            } else {
                mask.style.transform = "matrix(" + outerScaleX * 0.7 + ",0.0,0.0," + outerScaleY * 0.7 + "," + imageDataSizes.width / 2 + "," + (imageDataSizes.height / 2 + imageDataSizes.top) + ") rotate(0rad)";
                mask.style.opacity = "0.7";
            }
            return false;
        }


        // Check whether we know the stream dimension yet, if so, start BRFv4.
        function onStreamDimensionsAvailable() {
            //webcam.style.display = 'none';
            console.log("onStreamDimensionsAvailable: " + (webcam.videoWidth !== 0));
            if (webcam.videoWidth === 0) {
                $timeout(onStreamDimensionsAvailable, 200);
            } else {
                // Resize the canvas to match the webcam video size.
                resolution.width = webcam.videoWidth;   // 640
                resolution.height = webcam.videoHeight; // 480
                RTCExtService.enableHackOpacity();
                cordova.plugins.iosrtc.refreshVideos();
                onMaskEvent(currentPsyId);
            }
        }

        function init(psy_id) {
            currentPsyId = psy_id;
            currentMask = consultantService.getMask();
            webcam = document.querySelector('#video-doctor video');
            mask = document.querySelector('#mask');
            processMask();
            let webcamContWidth = document.querySelector('#vid-thumb').clientWidth;
            initScale = webcamContWidth * 0.75 * 0.9 / 480; // Block width * aspect ratio * custom scale / mask height
            // only fetch the context once
            resolution = {}; // the video stream resolution (usually 640x480)
            onStreamDimensionsAvailable();
        }

        function processMask() {
            let img = document.getElementById('maskImg');
            img.src = currentMask.file;
            img.style.top = (currentMask.y_offset || -240)+'.px';
        }

        let model = {};
        model.init = init;
        model.onMaskEvent = onMaskEvent;
        model.offMaskEvent = offMaskEvent;
        return model;

    }
})();
