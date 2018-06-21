;(function () {
  'use strict';

  angular.module('service.additionalContentService', [])
    .service('additionalContentService', additionalContentService);

  additionalContentService.$inject = ['http', 'url', '$localStorage'];


  function additionalContentService(http, url, $localStorage) {
    let model = {};

    model.getContent = getContent;

    return model;

    function getContent() {
      let data = [
          {
            title: 'Content title',
            status: 'live now',
            img_link: ''
          },
          {
            title: 'Content title',
            status: 'live now',
            img_link: ''
          }
        ];
      return data;
    }

  }
})
();
