;(function () {
    'use strict';

    angular.module('app')
        .controller('ConsultantListController', ConsultantListController);


    ConsultantListController.$inject = ['$state', '$window', '$timeout', '$localStorage', 'RTCService', 'consultants',
        '$ionicLoading', 'firebaseDataSvc', 'modalSvc'];


    function ConsultantListController($state, $window, $timeout, $localStorage, RTCService, consultants,
                                      $ionicLoading, firebaseDataSvc, modalSvc) {
        const vm = this;
        vm.toHeroSelection = toHeroSelection;
        vm.call = RTCService.callTo;
        vm.reload = reload;
        vm.userOnlineStatus = userOnlineStatus;
        vm.accesToCall = accesToCall;
        vm.consultants = consultants;
        vm.users = $localStorage.user;
        vm.userOnlineStatusArr = [];

        init();

        function init() {
            watchOnline(consultants);
        }

        function userOnlineStatus(index) {
            if (vm.userOnlineStatusArr[index]) {
                return 'online-status'
            }
        }

        function accesToCall(index) {
            return !!vm.userOnlineStatusArr[index];
        }

        function watchOnline(users) {
            angular.forEach(users, function (user, key) {
                firebaseDataSvc.watchOnline(user.id, (snapshot) => {
                    $timeout(function () {
                        vm.userOnlineStatusArr[key] = !!snapshot;
                    });
                });
            });
        }
        
        function toHeroSelection() {
            console.log('to hero-selection');
            $state.go('hero-selection')
        }


        function reload() {
            // $state.reload();
            // window.location.reload(true);
            $window.location.reload();
        }
    }

})();
