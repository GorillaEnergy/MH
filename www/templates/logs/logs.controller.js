;(function () {
    'use strict';

    angular.module('app')
        .controller('LogsController', LogsController);

    LogsController.$inject = ['$ionicModal', '$state', '$scope', '$timeout', '$localStorage', 'userService', 'consultants',
        'rights_to_kid', '$ionicLoading', 'firebaseDateSvc', 'utilsSvc'];


    function LogsController($ionicModal, $state, $scope, $timeout, $localStorage, userService, consultants,
                            rights_to_kid, $ionicLoading, firebaseDateSvc, utilsSvc) {
        const vm = this;

        vm.toMainPage = toMainPage;
        vm.toKid = toKid;

        vm.logStatus = logStatus;
        vm.emergencyView = emergencyView;
        vm.kidPhone = kidPhone;
        vm.getConsultName = getConsultName;
        vm.dateConverter = dateConverter;
        vm.timeConverter = timeConverter;
        vm.showAllInfo = showAllInfo;
        vm.fullEmergencyLog = fullEmergencyLog;
        vm.showAllNormalStatus = showAllNormalStatus;
        vm.arrowAnimation = arrowAnimation;

        let kids = $localStorage.kids;
        let kid = kids[$localStorage.log_index];
        vm.kidName = getKidName();
        vm.pushView = [];
        vm.editRights = rights_to_kid;
        vm.logs = [];

        let kid_id = kid.id;
        let number_of_logs = 30;
        let download_more = 30;

        let logs_body = document.getElementById("logs");
        let visible_parts_of_logs_block = logs_body.scrollHeight;
        let log_is_last = false;


        initializeFB();

        function initializeFB() {
            downloadLogs();
            addLogsEvent();
            removeLogsEvent();
            changeLogsEvent();
        }

        // console.log('visible_parts_of_logs_block = ', visible_parts_of_logs_block);
        // console.log('consultants', consultants);
        // console.log('rights to edit kid', rights_to_kid);

        function getKidName() {
            return kid.name;
            // let first_name = full_name.split(' ')[0];
            // return first_name;
        }

        function toMainPage() {
            console.log('to main page');
            $state.go('parent-main-page')
        }

        function toKid() {
            // for(let i = 0; i < kids.length; i++) {
            //   if (kid.id === kids[i].id) { $localStorage.kid_index = i; break;}
            // }
            $localStorage.kid_index = angular.copy($localStorage.log_index);
            console.log('to kid page');
            delete $localStorage.outgoing_from_settings;
            $state.go('kid');
        }

        function logStatus(log) {
            if (log.status === 'emergency') {
                return 'emergency-log'
            } else if (log.status === 'normal') {
                return 'normal-log'
            }
        }

        function emergencyView(log) {
            if (log.status === 'emergency') {
                return true;
            } else if (log.status === 'normal') {
                return false;
            }
        }

        function kidPhone() {
            return 'tel:' + kid.phone.code + kid.phone.phone
        }

        function getConsultName(log) {
            console.log();
            let name = '';
            for (let i = 0; i < consultants.length; i++) {
                if (consultants[i].id === log.consultant_id) {
                    name = consultants[i].name
                }
            }
            return name;
        }

        function dateConverter(log) {
            return utilsSvc.timestampToDateBySymbol(log.created_at * 1000, '/');
        }

        function timeConverter(log) {
            return utilsSvc.timestamToHHMM(log.created_at);
        }

        function showAllInfo(index) {
            vm.pushView[index] = !vm.pushView[index];
        }

        function fullEmergencyLog(index) {
            return !!(vm.pushView[index] && vm.logs[index].status == 'emergency');
        }

        function showAllNormalStatus(index) {
            if (vm.pushView[index] && vm.logs[index].status != 'emergency') {
                return 'show-all-content-in-normal-status'
            }
        }

        function arrowAnimation(index) {
            if (vm.pushView[index]) {
                return 'arrow-clockwise'
            } else {
                return 'arrow-counterclockwise'
            }
        }

        function convertToArray(data, type) {
            // console.log(type);
            let res = [];
            let pushView = [];
            let arrOfKeys = Object.keys(data);
            angular.forEach(arrOfKeys, function (key) {
                res.push(data[key]);
                pushView.push(false);
            });
            res.reverse();
            pushView.reverse();
            // console.log(vm.pushView);
            if (res.length < number_of_logs) {
                log_is_last = true
            }
            console.log('log_is_last', log_is_last);
            if (!log_is_last) {
                addScrollEvent()
            } else {
                destroyScrollEvent()
            }
            if (type === 'primary_loading') {
                vm.pushView = pushView;
                return res;
            } else {
                vm.pushView = vm.pushView.concat(pushView);
                res.splice(0, 1);
                res = vm.logs.concat(res);
                return res;
            }
        }

        function downloadLogs() {
            firebaseDateSvc.getLogs(kid_id, number_of_logs, (snapshot) => {
                vm.logs = snapshot ? convertToArray(snapshot, 'primary_loading') : [];
                console.log(vm.logs);
            });
        }

        function downloadMoreLogs() {
            $ionicLoading.show({template: 'Loading...'});
            let last = vm.logs[vm.logs.length - 1].id;
            console.log(last);
            firebaseDateSvc.getLogs2(kid_id, last, download_more + 1, (snapshot) => {
                if (snapshot) {
                    vm.logs = convertToArray(snapshot, 'secondary_loading')
                }
                $ionicLoading.hide();
            })
        }

        function addLogsEvent() {
            let access = false;
            console.log('addLogsEvent');
            firebaseDateSvc.onLogsEvent(kid_id, (snapshot) => {
                $timeout(function () {
                    if (access) {
                        console.log(snapshot);
                        vm.logs.unshift(snapshot);
                        vm.pushView.unshift(false);
                    } else {
                        access = true;
                    }
                })
            })
        }

        function removeLogsEvent() {
            console.log('removeLogsEvent');
            firebaseDateSvc.onRemoveLogs(kid_id, (snapshot) => {
                $timeout(function () {
                    for (let i = 0; i < vm.logs.length; i++) {
                        if (vm.logs[i].id === snapshot.id) {
                            vm.logs.splice(i, 1);
                            vm.pushView.splice(i, 1);
                            break;
                        }
                    }
                })
            })
        }

        function changeLogsEvent() {
            console.log('changeLogsEvent');
           firebaseDateSvc.onLOgsAdded(kid_id, (snapshot) => {
                $timeout(function () {
                    for (let i = 0; i < vm.logs.length; i++) {
                        if (vm.logs[i].id === snapshot.id) {
                            vm.logs[i] = snapshot;
                            break;
                        }
                    }
                })
            })
        }

        function addScrollEvent() {
            console.log('addScrollEvent');
            angular.element(logs_body).bind('scroll', function () {
                if (logs_body.scrollTop === logs_body.scrollHeight - visible_parts_of_logs_block) {
                    console.log('logs position bottom');
                    downloadMoreLogs();
                }
            });
        }

        function destroyScrollEvent() {
            console.log('destroyScrollEvent');
            angular.element(logs_body).unbind('scroll');
        }
    }
})();
