;(function () {
  'use strict';
  angular
    .module('factory.countryCodes', [])
    .factory('countryCodes', countryCodes);

  countryCodes.$inject = ['http', 'url',];


  function countryCodes(http, url) {
    let model = {};

    model.list = list;

    return model;

    function list() {
      return http.get(url.countries.list).then(function (res) {
        return res.data;
      })
    }
  }
})();
