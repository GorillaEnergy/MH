;(function () {
    'use strict';

    angular.module('service.popUpMessage', [])
        .service('popUpMessage', popUpMessage);

    popUpMessage.$inject = ['$ionicPopup','$timeout'];

    function popUpMessage($ionicPopup,$timeout) {
        let model = {};
        model.showMessage = showMessage;
        model.hideMessage = hideMessage;
        return model;


        function showMessage( message) {
            var myPopup =$ionicPopup.show({
                template: '<h3 class="popUp-message">'+ message + '</h3>'
            });
            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);

        }

        function hideMessage() {

        }
    }
})();
