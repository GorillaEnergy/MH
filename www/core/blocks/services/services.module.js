;(function () {
    'use strict';

    angular.module('app.services', [
        'service.additionalContentService',
        'service.userService',
        'service.consultantService',
        'service.securityService',
        'service.popUpMessage',
        'service.notification',
        'service.fcm',
        'service.purchaseService'
    ]);
})();
