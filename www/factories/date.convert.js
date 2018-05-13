;(function () {
    'use strict';

    angular
        .module('factory.dateFactory', [])
        .factory('dateFactory', [
            function () {
                return {
                    created_date: function (created_at) {
                        let tmpDateString = new Date(created_at).toString();
                        let arrOfDate = tmpDateString.split(' ');
                        return {
                            weekDay: arrOfDate[0],
                            dayTime: arrOfDate[4] + " " + arrOfDate[0],
                            dayMonth: arrOfDate[2] + " " + arrOfDate[1] + " " + arrOfDate[3],
                            moodTime: arrOfDate[4],
                            moodMonth: arrOfDate[1] + " " + arrOfDate[2],
                            moodYear: arrOfDate[3]

                        }
                    }
                }
            }
        ]);
})();