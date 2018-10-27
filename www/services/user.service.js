;(function () {
    'use strict';

    angular.module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$state', '$location', '$timeout', 'fcm', 'toastr', 'firebaseDataSvc', '$rootScope'];


    function userService(http, url, $localStorage, $sessionStorage, $state, $location, $timeout, fcm, toastr, firebaseDataSvc, $rootScope) {
        let model = {};
        model.checkPhone = checkPhone;
        model.login = login;
        model.logout = logout;

        model.setToken = setToken;
        model.getToken = getToken;

        model.setPhone = setPhone;
        model.getPhone = getPhone;

        model.userUpdate = userUpdate;
        model.setUser = setUser;
        model.getUser = getUser;

        model.createKid = createKid;
        model.updateKid = updateKid;
        model.changeAccess = changeAccess;
        model.uploadKids = uploadKids;
        model.deleteKid = deleteKid;
        model.setKids = setKids;
        model.getKids = getKids;
        model.rightsToKid = rightsToKid;

        model.addFollower = addFollower;
        model.removeFollower = removeFollower;
        model.getFollowers = getFollowers;

        model.setKidIndex = setKidIndex;
        model.getKidIndex = getKidIndex;

        model.reasonList = reasonList;
        model.report = report;

        $rootScope.$on('logout',function (event,data) {
            logout();
        });

        return model;

        function checkPhone(data) {
            return http.post(url.auth.checkPhone, data)
        }

        function login(data, phone) {
            return http.post(url.auth.login, data).then(function (res) {
                if (res.status === 'success') {
                    // $location.replace();
                    console.log(history);
                    setUser(res.data.user);
                    setToken(res.data.token);
                    setPhone(phone);
                    fcm.subscribe();

                    let user = angular.copy(res.data.user);
                    console.log(user);

                    if (user.role_id === 2) {
                        http.get(url.kid.uploadKids).then(function (res) {
                            $localStorage.kids = [];
                            if (res.status = 'success') {
                                let kids = angular.copy(res.data);
                                setKids(kids);

                                if (!user.name) {
                                    $state.go('profile');
                                } else {
                                    console.log('kids', kids);
                                    let route_to_main_page = false;

                                    for (let i = 0; i < kids.length; i++) {
                                        console.log(kids[i].payment);
                                        if (kids[i].payment == '1') {
                                            // $state.go('parent-main-page');
                                            route_to_main_page = true;
                                            break;
                                        }
                                    }

                                    if (route_to_main_page) {
                                        $state.go('parent-main-page');
                                    } else {
                                        $state.go('payment');
                                    }
                                }
                            }
                        });
                    } else if (res.data.user.role_id === 1) {
                        firebaseDataSvc.setOnlineStatus(res.data.user.id, true);
                        $state.go('kid-main-page');
                    }

                } else {
                    console.log('Authorization error');
                    toastr.error('Authorization error');
                }

            });
        }

        function logout() {
            http.get(url.auth.logout).then(function (res) {
                if (res.status === 'success') {
                    toastr.success(res.message);
                }
                firebaseDataSvc.setOnlineStatus(getUser().id, false);
                $localStorage.$reset();
                $sessionStorage.$reset();
                $state.go('authorization')
            });
        }

        function setToken(token) {
            $localStorage.token = token;
        }

        function getToken() {
            return $localStorage.token;
        }

        function setPhone(phone) {
            $localStorage.phone = phone;
        }

        function getPhone() {
            return $localStorage.phone;
        }

        function userUpdate(data) {
            return http.post(url.user.userUpdate, data);
        }

        function setUser(user) {
            $localStorage.user = user;
        }

        function getUser() {
            return $localStorage.user;
        }

        function createKid(data) {
            return http.post(url.kid.createKid, data);
        }

        function updateKid(data) {
            return http.post(url.kid.updateKid, data);
        }

        function changeAccess(data) {
            return http.post(url.kid.access, data);
        }

        function uploadKids() {
            return http.get(url.kid.uploadKids).then(function (res) {
                if (res.status == 'success') {
                    setKids(res.data);
                    return res.data;
                } else {
                    return []
                }
            });
        }

        function deleteKid(data) {
            return http.post(url.kid.deleteKid, data);
        }

        function setKids(kids) {
            $localStorage.kids = kids;
        }

        function getKids() {
            return $localStorage.kids;
        }

        function rightsToKid() {
            let data = {kid_id: getKids()[$localStorage.log_index].id};
            // console.log(data);
            return http.post(url.kid.rights_to_kid, data).then(function (res) {
                if (res.status === 'success') {
                    return true
                } else {
                    return false
                }
            });
        }

        function addFollower(data) {
            return http.post(url.kid.add_follower, data);
        }

        function removeFollower(data) {
            return http.post(url.kid.remove_follower, data);
        }

        function getFollowers() {
            if (angular.isDefined($localStorage.kid_index)) {
                let data = {kid_id: $localStorage.kids[$localStorage.kid_index].id};
                return http.post(url.kid.followers_list, data).then(function (res) {
                    console.log(res);
                    if (res.status == 'success') {
                        return res.data;
                    } else {
                        return []
                    }
                });
            } else {
                return []
            }
        }

        function setKidIndex(index) {
            $localStorage.kid_index = index;
        }

        function getKidIndex() {
            return $localStorage.kid_index;
        }

        function reasonList() {
            return http.get(url.report.reason).then(function (res) {
                if (res) {
                    return res
                } else {
                    return []
                }
            });
        }

        function report(data) {
            return http.post(url.report.send, data);
        }
    }
})
();
