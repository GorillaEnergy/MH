;(function () {
  'use strict';

  angular.module('service.purchaseService', [])
    .service('purchaseService', purchaseService);

  purchaseService.$inject = ['http', 'url', '$ionicLoading', '$ionicPopup', '$rootScope', '$state'];

  function purchaseService(http, url, $ionicLoading, $ionicPopup, $rootScope, $state) {
    var tempProductIds = []; //user for search product ids id for sent to backend
    var tempSelectedProductData;
    var popupInstance = undefined;
    var callbackBuySuccess;
    var callbackBuyError;

    var model = {
      loadProducts: loadProducts,
      buyProduct: buyProduct,
      getListProductId: getListProductId,
      selectSubcriptionPlan: selectSubcriptionPlan,
      getProducts: getProducts
    };


    $rootScope.$on('update_plan', function (event, data) {
      selectSubcriptionPlan();
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

    function selectSubcriptionPlan(successCallback) {
      if(typeof popupInstance != 'undefined'){
        return;
      }
      tempSelectedProductData = null;
      callbackBuySuccess = null;
      var scope = $rootScope.$new(true);
      if (angular.isFunction(successCallback)) {
        callbackBuySuccess = successCallback;
      }
      scope.selectPlan = selectPlan;
      scope.close = processClose;
      getListProductId().then(function (productIds) {
        // loadProducts(['android.test.purchased']).then(function (result) {
        if (angular.isArray(productIds)) {
          loadProducts(productIds).then(function (result) {
            if (angular.isArray(result)) {
              scope.productItems = result;
              // popupInstance = $ionicPopup.show({
              //   templateUrl: 'components/select-subscription/select-subscription.html',
              //   cssClass: 'select-subscription',
              //   title: '',
              //   scope: scope,
              // });
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

    function getProducts(products) {
      console.log('products', products);
      window.inAppPurchase
        .getProducts(products)
        .then(function (products) {
          console.log(products);
        })
        .catch(function (err) {
          console.log(err);
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
          title: 'Purchase was successful!',
          // template: 'Check your console log for the transaction data'
        });
        popupInstance.close();
        popupInstance = undefined;
        $ionicLoading.hide();
        if (angular.isFunction(callbackBuySuccess)) {
          callbackBuySuccess();
        }
        popupInstance = null;
      });
    }

    function buyProduct(product) {
      console.log(product);
      tempSelectedProductData = product;
      if (window.ionic.Platform.isWebView() && angular.isDefined(window.inAppPurchase) && product) {
        window.inAppPurchase.subscribe(product)
          .then(function (data) {
            console.log(JSON.stringify(data));
            console.log(data);
            // return window.inAppPurchase.consume(data.type, data.receipt, data.signature);
          }).then(function () {
            console.log('processSuccessBuy');
            processSuccessBuy(product);
          }).catch(function (err) {
            // processSuccessBuy(product);
            $ionicLoading.hide();
            console.log(err);
            // popupInstance.close();
            errorPopup();
          });
      }
    }

    function errorPopup() {
      $ionicPopup.alert({
        title: 'Something went wrong',
        template: 'Buy error'
      }).then(function(){
        popupInstance = undefined;
      });
    }
  }
})();
