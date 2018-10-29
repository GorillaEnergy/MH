;(function () {
        'use strict';

        angular.module('service.userService', [])
            .service('userService', userService);

        userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage', '$state', '$location', '$timeout', 'fcm', 'toastr', 'firebaseDataSvc', '$rootScope', 'constSvc'];


        function userService(http, url, $localStorage, $sessionStorage, $state, $location, $timeout, fcm, toastr, firebaseDataSvc, $rootScope, constSvc) {
            let model = {
                checkPhone: checkPhone,
                login: login,
                logout: logout,
                setToken: setToken,
                getToken: getToken,
                setPhone: setPhone,
                getPhone: getPhone,
                userUpdate: userUpdate,
                setUser: setUser,
                getUser: getUser,
                createKid: createKid,
                updateKid: updateKid,
                changeAccess: changeAccess,
                uploadKids: uploadKids,
                deleteKid: deleteKid,
                setKids: setKids,
                getKids: getKids,
                rightsToKid: rightsToKid,
                addFollower: addFollower,
                removeFollower: removeFollower,
                getFollowers: getFollowers,
                setKidIndex: setKidIndex,
                getKidIndex: getKidIndex,
                reasonList: reasonList,
                report: report,
                autologin: autologin
            };

            $rootScope.$on('logout', function (event, data) {
                logout();
            });

            return model;

            function checkPhone(data) {
                return http.post(url.auth.checkPhone, data)
            }

            function autologin() {
                if ( getToken() && getUser() ) {
                    return checkRole();
                }
            }

            function processKids(user, res) {
                $localStorage.kids = [];
                if (String(res.status) === 'success') {
                    let kids = angular.copy(res.data);
                    $localStorage.kids = kids;
                    if (!user.name) {
                        // if ($state.current.url !== '/profile') {
                        $state.go('profile');
                        // }
                    } else {
                        return checkPayment(kids);
                    }
                }
            }

            function checkPayment(kids) {
                let route_to_main_page = false;
                for (let i = 0; i < kids.length; i++) {
                    if (String(kids[i].payment) === '1') {
                        $state.go('parent-main-page');
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

            function checkRole(res) {
                let user = angular.copy(getUser());
                console.log(user);
                if (user.role_id === constSvc.ROLE.PARENT) {
                    return http.get(url.kid.uploadKids).then(function (res) {
                        return processKids(user, res);
                    });
                } else if (+user.role_id === constSvc.ROLE.KID) {
                    firebaseDataSvc.setOnlineStatus(user.id, true);
                    $state.go('kid-main-page');
                }
            }

            function processLogin(res, data, phone) {
                console.log(history);
                setUser(res.data.user);
                setToken(res.data.token);
                setPhone(phone);
                fcm.subscribe();
                checkRole(res);
            }

            function login(data, phone) {
                return http.post(url.auth.login, data).then(function (res) {
                    if (res.status === 'success') {
                        return processLogin(res, data, phone);
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
                    if (String(res.status) === 'success') {
                        setKids(res.data);
                        return res.data;
                    }
                    return [];
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
                    return (String(res.status) === 'success');
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
                        return (String(res.status) === 'success') ? res.data : [];
                    });
                }
                return []
            }

            function setKidIndex(index) {
                $localStorage.kid_index = index;
            }

            function getKidIndex() {
                return $localStorage.kid_index;
            }

            function reasonList() {
                return http.get(url.report.reason).then(function (res) {
                    return res || [];
                });
            }

            function report(data) {
                return http.post(url.report.send, data);
            }
        }
    }

)
();
