;(function () {
    'use strict';

    angular
        .module('service.constSvc', [])
        .service('constSvc', constSvc);

    constSvc.$inject = [];

    function constSvc() {

        const ROLE = {
            KID: 1,
            PARENT: 2
        };

        let model = {
            ROLE: ROLE
        };

        return model;

    }
})();