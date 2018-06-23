;(function () {
  'use strict';

  angular.module('app')
    .controller('AdditionalContentSearchController', AdditionalContentSearchController);

  AdditionalContentSearchController.$inject = ['$state', '$localStorage', 'search_result', 'additionalContentService'];


  function AdditionalContentSearchController($state, $localStorage, search_result, additionalContentService) {
    const vm = this;

    vm.toAdditionalContent = toAdditionalContent;
    vm.toFavorites = toFavorites;

    vm.watchButton = watchButton;
    vm.followingStatus = followingStatus;
    vm.changeFollowingStatus = changeFollowingStatus;


    vm.serch_result = search_result;


    function toAdditionalContent() {
      console.log('menu');
      $state.go('additional-content')
    }

    function toFavorites() {
      console.log('to favorites');
      $state.go('additional-content-favorites')
    }

    function watchButton(status) {
      if (status === 'live') { return true; } else { return false; }
    }


    function followingStatus(data) {
      if (data.favorite_status === 'follower') {
        return true;
      } else {
        return false;
      }
    }
    function changeFollowingStatus(content, index) {
      console.log('changeFollowingStatus');
      let data = { content_id: content.id,
        "status": "follower" };

      if (content.favorite_status === 'follower') {
        additionalContentService.removeFromFavorite(data).then(function (res) {
          if (res.status === 'success') {
            console.log('removed success');
            changeLocal(null, index);
          }
        });

      } else {
        data.status = 'follower';
        additionalContentService.addToFavorite(data).then(function (res) {
          if (res.status === 'success') {
            console.log('added success');
            changeLocal('follower', index);
          }
        });

      }

      function changeLocal(changedType, index) {
        vm.serch_result[index].favorite_status = changedType;
      }
    }
  }
})();
