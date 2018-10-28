;(function () {
    'use strict';

    angular.module('app')
        .controller('KidChatController', KidChatController);

    KidChatController.$inject = ['$state', '$timeout', '$anchorScroll', '$location', '$ionicModal', '$scope', 'userService',
        'toastr', '$ionicLoading', '$localStorage', 'reasonList', 'firebaseDataSvc', 'utilsSvc'];


    function KidChatController($state, $timeout, $anchorScroll, $location, $ionicModal, $scope, userService,
                               toastr, $ionicLoading, $localStorage, reasonList, firebaseDataSvc, utilsSvc) {
        const vm = this;

        vm.toMessages = toMessages;
        vm.blockButton = blockButton;
        vm.dateHeader = dateHeader;
        vm.timeHeader = timeHeader;
        vm.dateConverter = utilsSvc.timestamToDate;
        vm.timeConverter = utilsSvc.timestamToHHMM;
        vm.ownMessage = ownMessage;
        vm.report = report;
        vm.block = block;
        vm.unblock = unblock;
        vm.sendMessage = sendMessage;
        vm.sendReport = sendReport;
        vm.selectedReason = selectedReason;
        vm.checked = checked;
        vm.reportTextField = reportTextField;
        vm.focusedInput = focusedInput;
        vm.unfocusedInput = unfocusedInput;

        vm.reportMenu = false;
        vm.date = new Date();
        vm.messages = [];
        vm.blocked = null;
        vm.reportReasonList = reasonList;
        // vm.reportReasonList = ['reason 1', 'reason 2', 'reason 3',];
        vm.reportReason = vm.reportReasonList[0];
        vm.checkedReason = 0;
        let consultant = $localStorage.consultant;
        console.log(consultant);
        vm.consultantName = consultant.name;
        let kid_id = userService.getUser().id;
        let psy_id = consultant.id;
        let number_of_posts = 30;
        let download_more = 30;
        let missed_messages = 0;
        let missed_messages_psy = 0;
        let msgKeys = [];
        let local_unread = 0;
        let unreadMsgsKeysArr = [];
        let chat_body = document.getElementById("chat");
        let visible_parts_of_logs_block = chat_body.clientHeight;
        let visible_parts_of_logs_block_with_KB = null;
        let scrollPosionBeforeChange = null;
        let post_is_last = false;
        let chatHeightOld = null;
        let chatHeightNew = null;

        initializeFB();

        function initializeFB() {
            checkMissedNumber();
            psychologistAccess();
            downloadMessages();
            addMessagesEvent();
            removeMessagesEvent();
            changeMessagesEvent();
        }

        function psychologistAccess() {
            firebaseDataSvc.psychologAccess(kid_id, psy_id,(snapshot) => {
                $timeout(function () {
                    $timeout(function () {
                        snapshot === null ? create_room() : vm.blocked = snapshot;
                        function create_room() {
                            firebaseDataSvc.setAccess(kid_id, psy_id, true);
                        }
                        console.log('access psy chat = ', snapshot.val());
                    })
                });
            });
        }

        function dateHeader(index) {
            if (index) {
                let timestampPre = vm.messages[index - 1].date;
                let timestampCurrent = vm.messages[index].date;
                let datePre = new Date(timestampPre).getDate() + ' ' + new Date(timestampPre).getMonth() + ' ' + new Date(timestampPre).getFullYear();
                let dateCurrent = new Date(timestampCurrent).getDate() + ' ' + new Date(timestampCurrent).getMonth() + ' ' + new Date(timestampCurrent).getFullYear();
                return datePre !== dateCurrent;
            } else {
                return true;
            }
        }

        function timeHeader(index) {
            if (index) {
                let userPre = vm.messages[index - 1].create_by_user_id;
                let userCurrent = vm.messages[index].create_by_user_id;
                let timestampPre = vm.messages[index - 1].date;
                let timestampCurrent = vm.messages[index].date;
                let timePre = new Date(timestampPre).getHours() + ':' + new Date(timestampPre).getMinutes();
                let timeCurrent = new Date(timestampCurrent).getHours() + ':' + new Date(timestampCurrent).getMinutes();
                return timePre !== timeCurrent || userPre !== userCurrent;
            } else {
                return true;
            }
        }

        function ownMessage(index) {
            return vm.messages[index].create_by_user_id === kid_id;
        }

        function toMessages() {
            console.log('to messages');
            $state.go('kid-messages');
        }

        function blockButton() {
            vm.reportMenu = !vm.reportMenu;
            $timeout(function () {
                if (vm.reportMenu) {
                    vm.reportMenu = !vm.reportMenu;
                }
            }, 3000)
        }

        function report() {
            vm.reportMenu = false;
            vm.checkedReason = 0;
            $scope.reportModal.show()
        }

        function sendReport() {
            let data = {};
            data.consultant_id = psy_id;
            if (vm.checkedReason === 'other') {
                data.own_reason = vm.reportTextValue;
            } else {
                data.reason_id = vm.reportReasonList[vm.checkedReason].id;
            }
            userService.report(data).then(function (res) {
                console.log(res);
                vm.reportTextValue = '';
                toastr.success(res.message);
                $scope.reportModal.hide();
            });
        }

        function block() {
            vm.reportMenu = false;
            firebaseDataSvc.setAccess(kid_id, psy_id, false);
        }

        function unblock() {
            vm.reportMenu = false;
            firebaseDataSvc.setAccess(kid_id, psy_id, true);
        }

        function sendMessage() {
            let data = {};
            data.text = vm.message_input;
            data.date = new Date() * 1;
            data.create_by_user_id = kid_id;
            data.create_by_user_role = 1;
            data.read = false;
            if (vm.message_input) {
                firebaseDataSvc.setTotalUnreadPsy(kid_id, psy_id, missed_messages_psy + 1);
                firebaseDataSvc.setMessages(kid_id, psy_id, data);
                vm.message_input = '';
            }
        }

        function scrollToBottom(newMsg) {
            $timeout(function () {
                if (newMsg) {
                    $timeout(function () {
                        chat_body.scrollTop = angular.copy(chat_body.scrollHeight);
                    }, 500);
                    // тут добавить какоето условие для более корректной работы функции(возможно скролл и ненужно опускать)
                    // chat_body.scrollTo(0, chat_body.scrollHeight);
                    // chat_body.scrollTop = angular.copy(chat_body.scrollHeight);
                } else {
                    // chat_body.scrollTo(0, chat_body.scrollHeight);
                    chat_body.scrollTop = angular.copy(chat_body.scrollHeight);
                }
            });
        }

        function convertToArray(data, type) {
            let res = [];
            let arrOfKeys = Object.keys(data);
            angular.forEach(arrOfKeys, function (key) {
                res.push(data[key]);
            });
            msgKeys = msgKeys.concat(arrOfKeys);
            if (res.length < number_of_posts) {
                post_is_last = true
            }
            console.log('post_is_last', post_is_last);
            if (!post_is_last) {
                addScrollEvent()
            } else {
                destroyScrollEvent()
            }
            unreadCalc(res, msgKeys);
            if (type === 'primary_loading') {
                return res;
            } else {
                res.splice(res.length - 1, 1);
                res = res.concat(vm.messages);
                return res;
            }
        }


        function unreadCalc(arr, keysArr, soloKey, obj) {
            if (!soloKey) {
                angular.forEach(arr, function (msg, index) {
                    if (msg.create_by_user_id === psy_id && !msg.read) {
                        local_unread++;
                        unreadMsgsKeysArr.push(keysArr[index])
                    }
                });
            } else {
                if (obj.create_by_user_id === psy_id && !obj.read) {
                    local_unread++;
                }
            }
            if (missed_messages) {
                !soloKey ? markAsRead(unreadMsgsKeysArr) : markAsRead([soloKey]);
                $timeout(function () {
                    console.log(missed_messages);
                    console.log(local_unread);
                    firebaseDataSvc.setTotalUnreadKid(kid_id, psy_id, missed_messages - local_unread);
                    local_unread = 0;
                    unreadMsgsKeysArr = [];
                }, 200);
            }
        }

        function markAsRead(keys) {
            angular.forEach(keys, function (key) {
                firebaseDataSvc.setMarkAsRead(kid_id, psy_id, key);
            })
        }


        function downloadMessages() {
            firebaseDataSvc.getMessages(kid_id, psy_id, number_of_posts, (snapshot) => {
                $timeout(function () {
                    vm.messages = snapshot ? convertToArray(snapshot, 'primary_loading') : [];
                    scrollToBottom()
                })
            });
        }

        function downloadMoreMessages() {
            $ionicLoading.show({template: 'Loading...'});
            let last = vm.messages[0].date;
            firebaseDataSvc.getMoreMessages(kid_id, psy_id, last, download_more + 1, (snapshot) => {
                anchorScroll(snapshot);
                $ionicLoading.hide();
            })
        }

        function addMessagesEvent() {
            console.log('addMessagesEvent');
            firebaseDataSvc.onMessagesEvent(kid_id, psy_id, (snapshot) => {
                $timeout(function () {
                    let push_status = true;
                    for (let i = 0; i < vm.messages.length; i++) {
                        if (vm.messages[i].date === snapshot.date) {
                            push_status = false;
                            break;
                        }
                    }
                    if (push_status) {
                        unreadCalc(null, null, snapshot.key, snapshot);
                        vm.messages.push(snapshot);
                        scrollToBottom(true)
                    }
                })
            })
        }

        function removeMessagesEvent() {
            console.log('removeMessagesEvent');
            firebaseDataSvc.onRemoveMessagesEvent(kid_id, psy_id, (snapshot) => {
                $timeout(function () {
                    for (let i = 0; i < vm.messages.length; i++) {
                        if (vm.messages[i].date === snapshot.date) {
                            vm.messages.splice(i, 1);
                            break;
                        }
                    }
                })
            })
        }

        function changeMessagesEvent() {
            console.log('changeMessagesEvent');
            firebaseDataSvc.onChangeMessagesEvent(kid_id, psy_id, (snapshot) => {
                $timeout(function () {
                    for (let i = 0; i < vm.messages.length; i++) {
                        if (vm.messages[i].date === snapshot.date) {
                            vm.messages[i] = snapshot;
                            break;
                        }
                    }
                })
            });
        }

        function checkMissedNumber() {
            console.log('checkMissedNumber');
            firebaseDataSvc.onTotalUnreadKid(kid_id, psy_id, (snapshot) => {
                $timeout(function () {
                    missed_messages = snapshot ? Number(snapshot) : 0;
                });
            });
            firebaseDataSvc.onTotalUnreadPsy(kid_id, psy_id, (snapshot) => {
                $timeout(function () {
                    missed_messages_psy = snapshot ? Number(snapshot) : 0;
                });
            })
        }

        function addScrollEvent() {
            console.log('addScrollEvent');
            angular.element(chat_body).bind('scroll', function () {
                if (chat_body.scrollTop === 0) {
                    console.log('scroll position top');
                    downloadMoreMessages();
                }
            });
        }

        function destroyScrollEvent() {
            console.log('destroyScrollEvent');
            angular.element(chat_body).unbind('scroll');
        }

        function anchorScroll(data) {
            console.log('anchorScroll');
            $timeout(function () {
                if (chatHeightNew) {
                    chatHeightOld = angular.copy(chatHeightNew);
                } else {
                    chatHeightOld = angular.copy(angular.element("#chat")[0].scrollHeight);
                }
                // console.log('chatHeightOld = ', chatHeightOld);
                if (data) {
                    vm.messages = convertToArray(data, 'secondary_loading')
                }
                $timeout(function () {
                    chatHeightNew = angular.copy(angular.element("#chat")[0].scrollHeight);
                    // console.log('chatHeightNew = ', chatHeightNew);
                    chat_body.scrollTop = angular.copy(chatHeightNew - chatHeightOld);
                    // console.log('chat_body.scrollTop = ', chat_body.scrollTop);
                })
            })
        }

        function focusedInput() {
            console.log('focusedInput');
            $timeout(function () {
                scrollPosionBeforeChange = angular.copy(chat_body.scrollTop);
                visible_parts_of_logs_block_with_KB = chat_body.clientHeight;
                chat_body.scrollTop = chat_body.scrollTop + (visible_parts_of_logs_block - chat_body.clientHeight);
            }, 300)
        }

        function unfocusedInput() {
            console.log('unfocusedInput');
            $timeout(function () {
                chat_body.scrollTop = angular.copy(scrollPosionBeforeChange);
            }, 300)
        }

        function selectedReason(index) {
            vm.checkedReason = index;
        }

        function checked(index) {
            return index === vm.checkedReason;
        }

        function reportTextField() {
            return vm.checkedReason === 'other';
        }

        $ionicModal.fromTemplateUrl('report-modal', {
            scope: $scope
        }).then(function (modal) {
            $scope.reportModal = modal;
        });

        firebaseDataSvc.pushMessages(kid_id, psy_id, []);

    }

})();
