;(function () {
    'use strict';

    angular.module('app')
        .controller('KidMessagesController', KidMessagesController);

    KidMessagesController.$inject = ['$state', '$localStorage', '$timeout', 'userService', 'dateConverter', 'consultants', 'firebaseDataSvc'];


    function KidMessagesController($state, $localStorage, $timeout, userService, dateConverter, consultants, firebaseDataSvc) {
        const vm = this;
        vm.toKidMainPage = toKidMainPage;
        vm.toChat = toChat;
        let kid_id = userService.getUser().id;
        console.log(kid_id);
        vm.consultants = consultants;
        console.log(consultants);
        // vm.consultants = [
        //   {
        //     name: 'Mariya',
        //     online: false,
        //     img: 'link',
        //     access: true,
        //     message: 'lorem ipsus',
        //     time: '15:32',
        //     date: '17.01.18',
        //     missed_messages: null
        //   },
        //   {
        //     name: 'Jorge',
        //     online: true,
        //     img: 'link',
        //     access: false,
        //     message: 'lorem ipsus',
        //     time: null,
        //     date: '17.01.18',
        //     missed_messages: 15
        //   }
        // ];
        // vm.online = [];
        // vm.message = [];
        // vm.unread = [];
        // vm.access = [];

        initFB();

        function initFB() {
            angular.forEach(vm.consultants, function (consultant, index) {
                let psy_id = consultant.id;
                checkOnline(psy_id, index);
                lastMessage(psy_id, index);
                totalUnread(psy_id, index);
                checkAccess(psy_id, index);
            });
        }

        function checkOnline(psy_id, index) {
            firebaseDataSvc.watchOnline(psy_id, (snapshot) => {
                $timeout(function () {
                    vm.consultants[index].online = !!snapshot;
                });
            });
        }

        function lastMessage(psy_id, index) {
            firebaseDataSvc.onLastMessages(kid_id, psy_id, 1, (snapshot) => {
                $timeout(function () {
                    if (snapshot) {
                        vm.consultants[index].message = snapshot[Object.keys(snapshot)].text;
                        vm.consultants[index].date = dateConverter.date(snapshot[Object.keys(snapshot)].date);
                        vm.consultants[index].time = dateConverter.time(snapshot[Object.keys(snapshot)].date);
                    } else {
                        vm.consultants[index].message = '';
                    }
                })
            });
        }

        function totalUnread(psy_id, index) {
            firebaseDataSvc.onTotalUnreadKid(kid_id, psy_id, (snapshot) => {
                $timeout(function () {
                    vm.consultants[index].missed_messages = snapshot ? snapshot : null;
                });
            });
        }

        function checkAccess(psy_id, index) {
            firebaseDataSvc.psychologAccess(kid_id, psy_id, (snapshot) => {
                $timeout(function () {
                    vm.consultants[index].access = !!snapshot;
                });
            });
        }

        function toKidMainPage() {
            console.log('to kid main page');
            $state.go('kid-main-page');
        }

        function toChat(consultant) {
            $localStorage.consultant = consultant;
            console.log('to kid chat');
            $state.go('kid-chat');
        }
    }
})();
