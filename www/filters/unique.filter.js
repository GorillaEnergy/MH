;(function () {

    'use strict';

    angular.module('filter.unique', [])
        .filter('unique', unique);


    unique.$inject = [];

    function unique() {

        return function(collection, keyname) {

            let output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                // we check to see whether our object exists
                let key = item[keyname];
                // if it's not already part of our keys array
                if(keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });

            return output;
        };

    }
})();