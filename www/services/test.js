
;(function () {
  'use strict';

  angular.module('service.purchaseSvc', []).factory('purchaseSvc', purchaseSvc);

  purchaseSvc.$inject = ['http', 'url', '$ionicLoading', '$ionicPopup', '$rootScope', 'messagesSvc', '$state'];

  function purchaseSvc(http, url, $ionicLoading, $ionicPopup, $rootScope, messagesSvc, $state) {
    var tempProductIds = []; //user for search product ids id for sent to backend
    var _subscriptions = [];
    var _receipt = {};
    var tempSelectedProductData;
    var popupInstance = undefined;
    var callbackBuySuccess;
    var callbackBuyError;
    var model = {
      loadProducts: loadProducts,
      buyProduct: buyProduct,
      getListProductId: getListProductId,
      selectSubcriptionPlan: selectSubcriptionPlan
    };


    $rootScope.$on('update_plan', function (event, data) {
      selectSubcriptionPlan(data);
    });

    return model;


    function processClose() {
      popupInstance.close();
      popupInstance = undefined;
      $state.go('add-phone');
    }

    function selectPlan(item) {
      if (angular.isObject(item) && item.productId) {
        buyProduct(item);
      }
    }

    function selectSubcriptionPlan(params) {
      if (typeof popupInstance != 'undefined') {
        return;
      }
      tempSelectedProductData = null;
      callbackBuySuccess = null;
      var scope = $rootScope.$new(true);
      if (angular.isDefined(params) && angular.isFunction(params.successCallback)) {
        callbackBuySuccess = params.successCallback;
      }
      scope.selectPlan = selectPlan;
      scope.isShowFreeMonth = params && angular.isDefined(params.passedFreeTrial) ? !params.passedFreeTrial : true;
      scope.close = processClose;
      processConfigShowPopup(scope);
    }

    function processConfigShowPopup(scope) {
      getListProductId().then(function (productIds) {
        if (angular.isArray(productIds)) {
          loadProducts(productIds).then(function (result) {
            if (angular.isArray(result)) {
              scope.productItems = result;

              getActiveSubscription().then(function (activeSubs) {
                if (!activeSubs) {
                  purchasePopup(scope);
                } else { //if user have active subscription - update subsciption
                  dataPopup(activeSubs);
                  return buyProduct(activeSubs);
                }
              });

            } else {
              errorPopup();
            }
          }, function () {
            errorPopup();
          });
        } else {
          errorPopup();
        }
      }, function () {
        errorPopup();
      });
    }

    function purchasePopup(scope) {
      popupInstance = $ionicPopup.show({
        templateUrl: 'components/select-subscription/select-subscription.html',
        cssClass: 'select-subscription',
        title: '',
        scope: scope,
      });
    }

    function getListProductId() {
      return http.get(url.purchase.get).then(function (res) {
        if (angular.isArray(res)) {
          tempProductIds = res;
          var productIds = [];
          res.forEach(function (val) {
            if (val.productId) {
              productIds.push(val.productId);
            }
          });
          return productIds;
        } else {
          return [];
        }
      });
    }

    function loadProducts(productIds) {
      if (window.ionic.Platform.isWebView() && angular.isDefined(window.inAppPurchase) && angular.isArray(productIds)) {
        return window.inAppPurchase.getProducts(productIds);
      }
    }

    function processSuccessBuy() {
      if (!tempSelectedProductData) return;
      var purchaseObj = tempSelectedProductData;
      tempProductIds.forEach(function (val) {
        if (tempSelectedProductData.productId === val.productId) {
          purchaseObj.purchase_plans_id = val.id;
        }
      });
      return http.post(url.purchase.send, purchaseObj).then(function (res) {
        $ionicPopup.alert({
          title: messagesSvc.success.buy,
          // template: 'Check your console log for the transaction data'
        });
        popupInstance.close();
        popupInstance = undefined;
        $ionicLoading.hide();
        if (angular.isFunction(callbackBuySuccess)) {
          callbackBuySuccess();
        }
      });
    }

    function buyProduct(product) {
      tempSelectedProductData = product;
      if (window.ionic.Platform.isWebView() && angular.isDefined(window.inAppPurchase) && product) {
        window.inAppPurchase.subscribe(product.productId).then(function (data) {
          dataPopup(data);
          processSuccessBuy(product);
        }).catch(function (err) {
          dataPopup(err);
          // processSuccessBuy(product);
          $ionicLoading.hide();
          console.log(err);
          popupInstance.close();
          errorPopup();
        });
      }
    }

    function errorPopup() {
      $ionicPopup.alert({
        title: messagesSvc.error.somthWrong,
        template: messagesSvc.error.buy
      }).then(function () {
        popupInstance = undefined;
      });
    }

    function dataPopup(data) {
      $ionicPopup.alert({
        template: '<ion-content style="margin-bottom: 20px;"><pre>' + JSON.stringify(data) + '</pre></ion-content>'
      }).then(function () {
        popupInstance.close();
        popupInstance = undefined;
      });
    }

    function getActiveSubscription() {
      return restoreSubscription().then(function (subscriptions) {
        switch (window.device.platform) {
          case "iOS":
            return subscriptions.purchaseState === 0 && {
              productId: subscriptions.productId,
              receipt: subscriptions
            };
            break;
          case "Android":
            var _activeSubscriptions = _subscriptions.filter(function (subscription) {
              return subscription.receipt.purchaseState == 0;
            });
            return _activeSubscriptions.length && _activeSubscriptions[0];
            break;
          default:
            return false;
            break;
        }
      });
    }

    function restoreSubscription() {
      return window.inAppPurchase
        .restorePurchases()
        .then(function (data) {
          dataPopup(data);
          // iOS provides the receipt isolated from the restore data
          if (window.device && window.device.platform === "iOS") {
            return window.inAppPurchase.getReceipt().then(function (receipt) {
              angular.copy(receipt, _receipt);
              return _receipt;
            }, function (err) {
              //returns _receipt anyway
              return _receipt;
            });
          } else {
            // Android provides the receipts with the restore data
            angular.copy(data, _subscriptions);
            return _subscriptions;
          }
        }, function (err) {
          //returns _subscriptions anyway
          return _subscriptions;
        });
    }
  }
})();
