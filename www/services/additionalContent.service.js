;(function () {
  'use strict';

  angular.module('service.additionalContentService', [])
    .service('additionalContentService', additionalContentService);

  additionalContentService.$inject = ['http', 'url', '$localStorage'];


  function additionalContentService(http, url, $localStorage) {
    let model = {};

    model.getContent = getContent;

    model.mainPageContent = mainPageContent;
    model.additionalPageContent = additionalPageContent;
    model.favoritesList = favoritesList;
    model.searchContent = searchContent;
    model.addToFavorite = addToFavorite;
    model.removeFromFavorite = removeFromFavorite;

    model.setKeyword = setKeyword;

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
        },
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

    function mainPageContent() {
      return http.get(url.additional_content.main_page_content).then(function(res){
        if (res.status === 'success') {
          return res.data;
        } else {
          return[]
        }
      });
    }
    function additionalPageContent() {
      return http.get(url.additional_content.additional_page_content).then(function(res){
        if (res.status === 'success') {
          return res.data;
        } else {
          return[]
        }
      });
    }
    function favoritesList() {
      return http.get(url.additional_content.favorites_list).then(function(res){
        if (res.status === 'success') {
          return res.data;
        } else {
          return[]
        }
      });
    }
    function searchContent() {
      let data = {keyword: $localStorage.keyword};
      return http.post(url.additional_content.search_content, data).then(function (res) {
        if (res.status === 'success') {
          return res.data;
        } else {
          return[]
        }
      });
    }
    function addToFavorite(data) {
      return http.post(url.additional_content.add_to_favorite, data);
    }
    function removeFromFavorite(data) {
      return http.post(url.additional_content.remove_from_favorite, data);
    }

    function setKeyword(data) {
      $localStorage.keyword = data;
    }
  }
})
();
