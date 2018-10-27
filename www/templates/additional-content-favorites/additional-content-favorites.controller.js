;(function () {
    'use strict';

    angular.module('app')
        .controller('AdditionalContentFavoritesController', AdditionalContentFavoritesController);

    AdditionalContentFavoritesController.$inject = ['$state', '$localStorage', 'favorites', 'additionalContentService'];


    function AdditionalContentFavoritesController($state, $localStorage, favorites, additionalContentService) {
        const vm = this;
        vm.toAdditionalContent = toAdditionalContent;
        vm.watchButton = watchButton;
        vm.followingStatus = followingStatus;
        vm.changeFollowingStatus = changeFollowingStatus;
        vm.favorites = favorites;

        function toAdditionalContent() {
            console.log('menu');
            $state.go('additional-content')
        }

        function watchButton(status) {
            return status === 'live';
        }


        function followingStatus(data) {
            return data.favorite_status === 'follower';
        }

        function changeFollowingStatus(content, index) {
            console.log('changeFollowingStatus');
            let data = {
                content_id: content.id,
                "status": "follower"
            };
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
        }

        function changeLocal(changedType, index) {
            vm.favorites[index].favorite_status = changedType;
        }

    }
})();
