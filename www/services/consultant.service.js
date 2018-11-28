;(function () {
  'use strict';

  angular.module('service.consultantService', [])
    .service('consultantService', consultantService);

  consultantService.$inject = ['http', 'url', '$localStorage'];


  function consultantService(http, url, $localStorage) {
    let model = {};
    let currentMask;
    model.consultantList = consultantList;
    model.getAllMasks = getAllMasks;
    model.setMask = setMask;
    model.getMask = getMask;
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

      function getAllMasks(){
          return http.get(url.masks.getAll).then(function (res) {
              return res.status === 'success' ? res.data : [];
          });
      }

      function setMask(mask) {
          currentMask = mask;
          $localStorage.selectedMask = mask;
      }

      function getMask() {
          return currentMask || $localStorage.selectedMask;
      }

  }
})
();
