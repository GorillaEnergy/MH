;(function () {
    'use strict';

    angular
        .module('service.modalSvc', [])
        .service('modalSvc', modalSvc);

    modalSvc.$inject = ['$ionicPopup', 'url', '$rootScope', '$state', 'toastr'];

    function modalSvc($ionicPopup, url, $rootScope, $state, toastr) {

        let model = {
            conversation:conversation
        };

        function conversation(cb) {
            return $ionicPopup.show({
                // title: opponent_name,
                templateUrl: './components/conversation/conversation.html',
                cssClass: 'conversation',
                scope: $rootScope.$new(true),
                buttons: [
                    {
                        text: 'Hang Up',
                        type: 'button-positive',
                        onTap: function (e) {
                            cb();
                        }
                    }]
            });
        };

        return model;


    }
})();