;(function () {
  'use strict';

  angular.module('service.consultantService', [])
    .service('consultantService', consultantService);

  consultantService.$inject = ['http', 'url', '$localStorage'];


  function consultantService(http, url, $localStorage) {
    let model = {};

    model.consultantList = consultantList;
    model.cache = [];

    return model;


    function consultantList() {
      // if(model.cache.length) {
      //   return model.cache;
      // }
      return http.get(url.consultants.consultantsList).then(function (res) {
          return res.status === 'success' ? res.data : [];
      })
    }

  }
})
();
