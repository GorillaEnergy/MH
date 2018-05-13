;(function () {
    'use strict';
    angular
        .module('factory.util', [])
        .factory('util', util);

    util.$inject = ['userService', 'popUpMessage'];

    /**
     * Function for validation email, password and other
     */

    function util(userService, popUpMessage) {
        return {
            emptyItems: emptyItems,
            displayNotCompletedProfileMessage: displayNotCompletedProfileMessage,
            displayEmailNotVerifiedMessage: displayEmailNotVerifiedMessage,
            checkUser: checkUser,

        };

        /**
         * Function for display email not verified message
         */
        function displayEmailNotVerifiedMessage() {
            popUpMessage.showMessage('Please validate your email id before proceeding forward');
        }

        /**
         * Function for display not completed profile message
         */
        function displayNotCompletedProfileMessage() {
            let settings = userService.getSettings();
            popUpMessage.showMessage('Please set your ' + (typeof settings !== 'undefined' ? settings.directorate_title :
                'directorate') + ', ' + (typeof settings !== 'undefined' ? settings.speciality_title :
                'speciality') + ' and ' + (typeof settings !== 'undefined' ? settings.grade_title :
                    'grade'));
        }

        function checkUser(logout) {
            if (logout) {
                return true
            }
            var user = userService.getUser();
            if (!user.active) {
                displayEmailNotVerifiedMessage();
                return false;
            }
            if (user.role !== 10 && (user.grade === null || user.speciality === null || user.directorate === null)) {
                displayNotCompletedProfileMessage();
                return false;
            }
            return true;
        }


        function emptyItems(items) {
            var res = false;
            angular.forEach(items, function (item) {
                if (!item || typeof item == 'string' && item.trim().length == 0) {
                    res = true;
                }
            });
            return res;
        }

    }
})();
