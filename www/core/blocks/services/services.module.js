;(function () {
    'use strict';

    angular.module('app.services', [
        'service.userService',
        'service.consultantService',
        'service.securityService',
        'service.popUpMessage',
        'service.notification',
        'service.fcm'
    ]);
})();