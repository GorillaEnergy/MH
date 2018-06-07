;(function () {
    'use strict';

    angular.module('service.fcm', [])
        .service('fcm', fcm);

    fcm.$inject = ['$state', '$localStorage', 'notificationService', 'toastr', 'userService', '$rootScope'];

    function fcm($state, $localStorage, notificationService, toastr, userService, $rootScope) {
        let model = {};
        model.subscribe = subscribe;

        return model;

        function subscribe(){
            if (typeof FCMPlugin !== 'undefined') {
                FCMPlugin.getToken(function (token) {
                    if(token !== "") {
                        if (typeof $localStorage.gcm_token === 'undefined'
                            || token !== $localStorage.gcm_token) {
                            let credentials = {
                                gcm_token: token
                            };
                            console.log(token);
                            notificationService.subscribe(credentials)
                        }
                    } else {
                        return false;
                    }

                });
                FCMPlugin.onNotification(function (data) {
                        if (data.wasTapped) {
                            if(data.message === 'You have a new survey') {
                                $state.go('tab.survey');
                            } else if(data.message === 'You have been added to team'){
                                if($state.is('tab.edit-team')){
                                    $state.reload();
                                } else {
                                    $state.go('tab.edit-team');
                                }
                            } else if(data.message === 'You have been removed from team'){
                                if($state.is('tab.edit-team')){
                                    $state.reload();
                                } else {
                                    $state.go('tab.edit-team');
                                }
                            } else if (data.message === 'Improvement idea status change') {
                                $state.go('tab.idea-details', {id: +data.improvement_id})
                            } else if (data.message === 'You have a new message') {
                                $state.go('tab.message-dialog', {id: +data.dialog_id})
                            } else if (data.message === 'A new Notice has been uploaded') {
                                $state.go('tab.notices')
                            } else if(data.message === 'A new Improvement report has been uploaded'){
                                _viewLink(data.underway_link, data.underway_name)
                            }else {
                                $state.go('tab.dashboard')
                            }
                            //Notification was received on device tray and tapped by the user.
                            toastr.info(JSON.stringify(data.message));
                        } else {
                            //Notification when App is open
                            toastr.info(JSON.stringify(data.message));
                            if (data.message === 'You have been added to team' ||
                                data.message === 'You have been removed from team') {
                                if($state.is('tab.edit-team')) {
                                    $state.reload();
                                } else {
                                    $state.go('tab.edit-team')
                                }
                            } else if (data.message === 'You have a new survey') {
                                if ($state.is('tab.survey')) {
                                    $rootScope.$broadcast('surveyAdded', {});
                                }
                            } else if (data.message === 'A new Notice has been uploaded') {
                                if ($state.is('tab.notices')) {
                                    $rootScope.$broadcast('noticeAdded', {});
                                }
                            } else if (data.message === 'Improvement idea status change') {
                                if ($state.is('tab.idea-details')) {
                                    $rootScope.$broadcast('ideaChanged', {});
                                }
                            } else if (data.message === 'A new Improvement report has been uploaded') {
                                if ($state.is('tab.underway-items')) {
                                    $rootScope.$broadcast('improvementAdded', {});
                                }
                            }
                        }

                    },
                    function (msg) {
                        console.log('onNotification callback successfully registered: ' + msg);
                    },
                    function (err) {
                        console.log('Error registering onNotification callback: ' + err);
                    }
                );
            }
            let fcmCheck = setInterval(() => {
                if (typeof FCMPlugin != 'undefined') {
                    FCMPlugin.onTokenRefresh(function (token) {
                        alert(token);
                        clearInteval(fcmCheck);
                    });
                }
            }, 1000);

            function _viewLink(link, name) {
                if (ionic.Platform.isAndroid()) {
                    let options = {
                        headerColor: "#00ac5c",
                        showScroll: true,
                        showShareButton: false,
                        showCloseButton: true,
                        swipeHorizontal: false
                    };
                    AndroidNativePdfViewer.openPdfUrl(link, name, options,
                        function (success) {
                            console.log('ok', success);
                        }, function (error) {
                            console.log('error', error);
                        });
                } else {
                    let options = {
                        headerColor: "#00ac5c",
                        showScroll: true,
                        showShareButton: false,
                        showCloseButton: true,
                        swipeHorizontal: false
                    };
                    window.open(link, '_system', options);
                }
            }
        }
    }

})();
