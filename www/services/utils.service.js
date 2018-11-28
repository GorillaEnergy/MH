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
            permissionVideo: permissionVideo,
            timestamToHHMM: timestamToHHMM,
            timestamToDate: timestamToDate,
            timestampToDateBySymbol: timestampToDateBySymbol,
            isBrowser: isBrowser,
            getSupportCameraParam:getSupportCameraParam,
            getNumberFromString: getNumberFromString
        };

        return model;

        function getNumberFromString(str) {
            return +(str.replace(/[^0-9\.]+/g, ""));
        }

        function getSupportCameraParam() {
            var param = {};
            let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
            for (let constraint in supportedConstraints) {
                if (supportedConstraints.hasOwnProperty(constraint)) {
                    param[(''+constraint).toLowerCase()] = true;
                }
            }
            return param;
        }

        function isBrowser() {
            return {
                opera: function () {
                    return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                },

                firefox: function () {
                    return typeof InstallTrigger !== 'undefined';
                },
                safari: function () {
                    return /constructor/i.test(window.HTMLElement) || (function (p) {
                        return p.toString() === "[object SafariRemoteNotification]";
                    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
                },
                ie: function () {
                    return /*@cc_on!@*/false || !!document.documentMode;
                },
                edge: function () {
                    return !isIE && !!window.StyleMedia;
                },
                chrome: function () {
                    return !!window.chrome && !!window.chrome.webstore;
                },
                blink: function () {
                    return (isChrome || isOpera) && !!window.CSS;
                }
            }
        }


        function init() {
            findIndexPolyfill();
        }

        function permissionAudio() {
            let defered = $q.defer();
            if (window.cordova) {
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
            } else {
                return $q.when(true);
            }
            return defered.promise;
        }

        function permissionVideo() {
            let defered = $q.defer();
            if (window.cordova) {
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
            } else {
                return $q.when(true);
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

        function timestamToHHMM(timestamp) {
            let date = new Date(timestamp);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            if (hours < 10) {
                hours = '0' + String(hours);
            }
            if (minutes < 10) {
                minutes = '0' + String(minutes);
            }
            return hours + ':' + minutes;
        }

        function timestamToDate(timestamp) {
            let monthList = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            let date = new Date(timestamp);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            return day + ' ' + monthList[month] + ' ' + year;
        }

        function timestampToDateBySymbol(timestamp, symbol) {
            let data = new Date(timestamp);
            let day = data.getDate();
            let month = data.getMonth() + 1;
            let year = data.getFullYear();
            if (day < 10) {
                day = '0' + String(day);
            }
            if (month < 10) {
                month = '0' + String(month);
            }
            return day + symbol + month + symbol + year;
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