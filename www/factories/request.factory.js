(function () {
    'use strict';
    angular
        .module('factory.request', [])
        .factory('http', http);

    http.$inject = ['$http', '$sessionStorage', '$q', '$timeout', '$localStorage', '$ionicLoading', 'popUpMessage',
      '$state', '$rootScope'];

    /**
     * Wrapper over the standard http function
     */

    function http($http, $sessionStorage, $q, $timeout, $localStorage, $ionicLoading, popUpMessage,
                  $state, $rootScope) {
        console.log('create request service');

        return {
            get: function (url, data) {
                return request('GET', url, data);
            },
            post: function (url, data) {
                return request('POST', url, data);
            },
            put: function (url, data) {
                return request('PUT', url, data);
            },
            delete: function (url, data) {
                return request('DELETE', url, data);
            },
            file: function (url, data) {
                return requestFile(url, data);
            },
            fileImg: function (url, data) {
                return requestImgFile(url, data);
            },

        };


        /**
         * Main request function
         * @param {string} method - Method name
         * @param {string} url - Request url
         * @param {object} data - Data to request
         * @returns {promise}
         */

        function request(method, url, data) {

            let user = $localStorage.user;
            let token = $localStorage.token;

            let config = {
                dataType: 'json',
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };

            if (method === 'GET') {
                config.params = data;
                config.timeout = 20000;
            }
            else {
                config.data = data;
            }

            if(typeof token != 'undefined') {
              config.headers.Authorization = 'Bearer ' + token;
            }

            config.url = url;

            $ionicLoading.show({
                template: 'Loading...',
            }).then(function () {
                console.log("The loading indicator is now displayed");
            });
            return $http(config)
                .then(requestComplete)
                .catch(requestFailed);
        }

        /**
         * Function for sending files
         * @param {string} url - Request url
         * @param {object} data - Data to request
         * @returns {promise}
         */

        function requestFile(url, data) {
            let user = $localStorage.user;

            // if ($sessionStorage.auth_key) {
            if (typeof user != 'undefined') {
                url = url + '?auth_key=' + user.auth_key;
            }

            var ft = new FileTransfer();

            var promise = $q.defer();
            ft.upload(data.file.fullPath, encodeURI(url), function (response) {
                console.info('response complete', JSON.parse(response.response));
                promise.resolve(JSON.parse(response.response));
            }, function (error) {
                console.log('error', error);
                promise.reject(error.body);
            }, {
                fileName: data.file.name,
                fileKey: 'file',
                mimeType: 'video/mp4',
                httpMethod: 'POST',
                chunkedMode: false,
                params: data
            });
            return promise.promise;
        }


        /**
         * Callback function for failed request
         * @param err
         * @returns {promise}
         */
        function requestFailed(err) {
            $ionicLoading.hide();
            console.info('error', err.config.url, err);
            // debugger;

            if (err.data == null || !err.data.error) {
                if (err.status === 200) {
                    popUpMessage.showMessage('Server error: ' + err.data);
                }
                else if (err.status === -1) {
                    if (!navigator.onLine) {
                      // $ionicLoading.hide();
                      $ionicLoading.show({ template: 'There is no Internet connection' });
                      $timeout(function () {  $ionicLoading.hide(); }, 2000)
                    } else {
                      // $ionicLoading.hide();
                      popUpMessage.showMessage('Server is not available');
                    }
                    return [];
                }
                else if (err.status === 0) {
                    popUpMessage.showMessage('There is no Internet connection');
                  return [];
                }
                else if (err.status === 400) {
                    popUpMessage.showMessage(err.data.message);
                  return [];
                }
                else if (err.status === 401) {
                    // $state.go('authorization');
                  return [];
                }
                else if (err.status === 429) {
                  // $ionicLoading.hide();
                  popUpMessage.showMessage(err.data.message);
                  return []
                }
                else if (err.status === 500) {
                    popUpMessage.showMessage('Server error: ' + err.status + ' ' + err.data.message);
                  return [];
                }
                else {
                    popUpMessage.showMessage('Server error: ' + err.status + ' ' + err.statusText);
                  return [];
                }
                return []
                // console.log('XHR Failed: ' + err.status);
            } else {
                popUpMessage.showMessage(err.data.error);
            }

            // $ionicLoading.hide();
            return $q.reject(err.data.error);
        }

        /**
         * Callback function for success request
         * @param response
         * @returns {promise}
         */

        function requestComplete(response) {
            let promise = $q.defer();
            $ionicLoading.hide().then(function () {
                console.log("The loading indicator is now hidden");
            });
            // console.info('response complete', response.config.url, response);
            console.info(response);

            if (response.status === 200 && response.data.status === 'error' && response.data.message === 'payment error') {
              $rootScope.$broadcast('overdue-subscription', true);
            }

            if (!response.data.error) {
                promise.resolve(response.data);
            }
            else {
                promise.reject(response);
            }


            return promise.promise;
        }

        function requestImgFile(url, data) {
            let user = $localStorage.user;

            let urlStr;
            let config = {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            };
            if (typeof user != 'undefined') {
                urlStr = url + '?auth_key=' + user.auth_key;
            }
            else {
                urlStr = url;
            }

            return $http.post(urlStr, data, config)
                .then(requestComplete)
                .catch(requestFailed);
        }
    }
})();
