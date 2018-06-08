;(function () {
    'use strict';

    angular.module('app')
        .controller('LogsController', LogsController);

    LogsController.$inject = ['$ionicPopup', '$state', '$scope', '$stateParams', 'userService', '$timeout', '$ionicModal'];


    function LogsController($ionicPopup, $state, $scope, $stateParams, userService, $timeout, $ionicModal) {
        const vm = this;


        vm.kidName='Boris';
        vm.consulters = [
            {
                name: ' Mariya',
                status: 'end',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consectetur distinctio expedita facilis fuga id quasi rerum, saepe sint! Quas?',
                time:'15.32',
                date:'17.01.18'
            },
            {
                name: ' Ivan',
                status: 'miss',
                img: 'link',
                access: false,
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consectetur distinctio expedita facilis fuga id quasi rerum, saepe sint! Quas?',
                time: null,
                date:'17.01.18'
            },
            {
                name: ' Navi',
                status: 'call',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consectetur distinctio expedita facilis fuga id quasi rerum, saepe sint! Quas?',
                time: null,
                date:'17.01.18',
            },
            {
                name: ' judas',
                status: 'call',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consectetur distinctio expedita facilis fuga id quasi rerum, saepe sint! Quas?',
                time: null,
                date:'17.01.18',
            }
        ];
    }
})();
