;(function () {
  'use strict';

  angular.module('app')
    .controller('AdditionalContentController', AdditionalContentController);

  AdditionalContentController.$inject = ['$state', '$localStorage', '$timeout', '$ionicScrollDelegate',
                                         'additionalContentService', 'content'];


  function AdditionalContentController($state, $localStorage, $timeout, $ionicScrollDelegate,
                                       additionalContentService, content) {
    const vm = this;

    vm.toMenu = toMenu;
    vm.toFavorites = toFavorites;
    vm.searchView = searchView;
    vm.keypress = keypress;

    vm.followingStatus = followingStatus;
    vm.changeFollowingStatus = changeFollowingStatus;

    function toMenu() {
      console.log('menu');
      $state.go('menu')
    }
    function toFavorites() {
      console.log('to favorites');
      $state.go('additional-content-favorites')
    }
    function searchView(status) {
      vm.searchBar = status;
      if (!vm.searchBar) { vm.search_content = '' }
      if (vm.searchBar) {
        $ionicScrollDelegate.scrollTop();
        $timeout(function () {
          document.getElementById('search_input').focus();
        }, 100);
      }
    }

    function followingStatus(data) {
      if (data.favorite_status === 'follower') {
        return true;
      } else {
        return false;
      }
    }
    function changeFollowingStatus(content, index, arrType) {
      console.log('changeFollowingStatus');
      let data = { content_id: content.id };
      console.log(data);

      if (content.favorite_status === 'follower') {
        additionalContentService.removeFromFavorite(data).then(function (res) {
          if (res.status === 'success') {
            console.log('removed success');
            changeLocal(null, index, arrType);
          }
        });

      } else {
        data.status = 'follower';
        additionalContentService.addToFavorite(data).then(function (res) {
          if (res.status === 'success') {
            console.log('added success');
            changeLocal('follower', index, arrType);
          }
        });

      }

      function changeLocal(changedType, index, arrType) {
        console.log(changedType);
        if (arrType === 'live') {
          vm.liveNow[index].favorite_status = changedType;
        } else if (arrType === 'coming') {
          vm.coming[index].favorite_status = changedType;
        }

      }
    }

    vm.searchBar = false;

    vm.liveNow = content[0];
    vm.coming = content[1];

    function keypress(ev) {
      if (ev.charCode === 13) {  //enter event
        if (vm.search_content) {
          additionalContentService.setKeyword(vm.search_content);
          $state.go('additional-content-search')
        }
      }
    }

    // $('#search-input').on('keypress', function (e) {
    //   console.log(e.keyCode);
    // });

    let match = '2011-07-15 13:18:52'.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    let date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
    // console.log(date);
    // console.log(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
    // console.log(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());

  }
})();
