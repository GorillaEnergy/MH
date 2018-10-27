;(function () {
    'use strict';

    angular
        .module('service.dateConverter', [])
        .service('dateConverter', dateConverter);

    dateConverter.$inject = [];

    function dateConverter() {
        let model = {};

        model.date = date;
        model.time = time;

        return model;

        function date(timestamp, minimize) {
            if (!timestamp) {
                return '--.--.--'
            }
            timestamp = Number(timestamp);
            // if (minimize) {timestamp = timestamp * 1000}
            return dates() === dates(timestamp) ? 'Today' : dates(timestamp);

            function dates(timestamp) {
                let date = timestamp ? new Date(timestamp) : new Date();
                let day = date.getDate();
                let month = Number(date.getMonth()) + 1;
                let year = date.getFullYear();
                day = day < 10 ? '0' + day:day;
                month = month < 10 ? '0' + month:month;
                year = year.toString().substr(-2);
                return day + '.' + month + '.' + year;
            }
        }

        function time(timestamp) {
            if (!timestamp) {
                return '--:--'
            }
            let hours = new Date(timestamp).getHours();
            let minutes = new Date(timestamp).getMinutes();
            hours = hours < 10?'0' + hours:hours;
            minutes = minutes < 10?'0' + minutes: minutes;
            return hours + ':' + minutes;
        }
    }
})();
