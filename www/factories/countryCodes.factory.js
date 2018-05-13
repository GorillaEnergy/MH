;(function () {
  'use strict';
  angular
    .module('factory.countryCodes', [])
    .factory('countryCodes', countryCodes);

  countryCodes.$inject = [];


  function countryCodes() {
    let countriesCodes = [
      {code: '+972', name: 'Israel'},
      {code: '+380', name: 'Ukraine'},
      {code: '+1', name: 'USA'},
    ];

    return countriesCodes;
  }
})();
