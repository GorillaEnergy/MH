;(function () {
    'use strict';

    angular
        .module('service.utilsSvc', [])
        .service('utilsSvc', utilsSvc);

    utilsSvc.$inject = ['$q', '$localStorage', '$state', 'toastr'];

    function utilsSvc($q, $localStorage, $state, toastr) {

        let model = {
            objToArr: objToArr,
            totalTime: totalTime,
            init: init,
            permissionAudio: permissionAudio,
            permissionVideo: permissionVideo
        };

        return model;

        function init() {
            findIndexPolyfill();
        }

        function permissionAudio() {
            let defered = $q.defer();
            cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
                console.log(status);
                if (ionic.Platform.platform() === 'android') {
                    if (status === "GRANTED") {
                        defered.resolve();
                    } else {
                        defered.reject();
                    }
                } else { // IOS
                    if (status === "authorized") {
                        defered.resolve();
                    } else {
                        defered.reject();
                    }
                }
            }, function (error) {
                defered.reject();
                console.error(error);
            });
            return defered.promise;
        }

        function permissionVideo() {
            let defered = $q.defer();
            if (ionic.Platform.platform() === 'android') {
                cordova.plugins.diagnostic.requestRuntimePermission(function (status) {
                    console.log(status);
                    if (status === 'GRANTED') {
                        defered.resolve();
                    } else {
                        defered.reject();
                    }
                }, function (error) {
                    console.error(error);
                    defered.reject();
                }, cordova.plugins.diagnostic.permission.CAMERA);
            } else {
                cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
                    console.log(status);
                    if (status === "authorized") {
                        defered.resolve();
                    } else {
                        defered.reject();
                    }
                    // audioPermission();
                }, function (error) {
                    defered.reject();
                    console.error(error);
                });
            }
            return defered.promise;
        }

        function totalTime(data) {
            let start, end, total_second, total_minutes, total_hours;
            start = data.start_time;
            end = new Date();
            total_second = Math.floor((end - start) / 1000);
            total_minutes = Math.floor(total_second / 60);
            total_hours = Math.floor(total_minutes / 60);
            total_minutes = total_minutes - total_hours * 60;
            total_minutes = total_minutes < 10 ? '0' + total_minutes : total_minutes;
            total_hours = total_hours < 10 ? '0' + total_hours : total_hours;
            return total_hours + ':' + total_minutes;
        }

        function objToArr(obj) {
            return Object.keys(obj).map((v, i) => {
                return obj[v];
            });

        }


        function findIndexPolyfill() {
            if (!Array.prototype.findIndex) {
                Array.prototype.findIndex = function (predicate) {
                    if (this == null) {
                        throw new TypeError('Array.prototype.findIndex called on null or undefined');
                    }
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }
                    var list = Object(this);
                    var length = list.length >>> 0;
                    var thisArg = arguments[1];
                    var value;

                    for (var i = 0; i < length; i++) {
                        value = list[i];
                        if (predicate.call(thisArg, value, i, list)) {
                            return i;
                        }
                    }
                    return -1;
                };
            }
        }


    }
})();