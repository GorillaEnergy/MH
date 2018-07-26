;(function () {
  'use strict';

  angular.module('service.purchaseService', [])
    .service('purchaseService', purchaseService);

  purchaseService.$inject = ['http', 'url', '$ionicLoading', '$ionicPopup', '$rootScope'];

  function purchaseService(http, url, $ionicLoading, $ionicPopup, $rootScope) {

    var popupInstance = undefined;

    var model = {};
    model.buyProduct = buyProduct;
    model.paymentsList = paymentsList;
    model.getReceipt = getReceipt;
    model.getPurchases = getPurchases;


    $rootScope.$on('overdue-subscription', function (event, data) {
      showWarning();
    });

    return model;

    function loadProduct(data) {
      return http.post(url.purchase.get_plan, data)
    }

    function buyProduct(kids) {
      let tariff;
      let tariff_id;
      let number_kids = kids.length;

      let data = { number_kids: number_kids };
      loadProduct(data).then(function (res) {
        console.log(res.status);
        if (res.status == 'success') {
          console.log(res.data);
          if (res.data.length) {
            tariff = res.data[0].productId;
            tariff_id = res.data[0].id;
            // getProductInfo([tariff], id);
            getProductInfo(['com.mind.hero.month_test']);
          } else {
            errorPopup()
          }
        } else {
          errorPopup()
        }
      });

      function getProductInfo(tariff) {
        console.log('products', tariff);
        window.inAppPurchase
          .getProducts(tariff)
          .then(function (tariff_info) {
            console.log(tariff_info);
            subscribe(tariff[0], tariff_info)
          })
          .catch(function (err) {
            console.log(err);
            errorPopup();
          });
      }

      function subscribe(product, product_info) {

        if (window.ionic.Platform.isWebView() && angular.isDefined(window.inAppPurchase) && product) {
          window.inAppPurchase.subscribe(product)
            .then(function (data) {
              console.log(JSON.stringify(data));
              let product_id = data.productId;
              let receipt = JSON.parse(data.receipt);
              let date = receipt.purchaseTime;
              let state = receipt.purchaseState;
              $ionicPopup.alert({
                title: 'Success 1',
                template: product_id + ' // ' + date + ' // ' + state
              });
              // return window.inAppPurchase.consume(data.type, data.receipt, data.signature);
            }).then(function (data) {
            console.log('processSuccessBuy');
            $ionicPopup.alert({
              title: 'Success 2',
              template: JSON.stringify(data)
            });
            savePaymentInHistory(product_info, kids);
          }).catch(function (err) {
            $ionicLoading.hide();
            console.log(err);
            errorPopup();
          });
        }
      }

      function savePaymentInHistory(product_info, kids) {
        console.log(product_info);
        console.log(kids);
        let data = {
          currency: product_info[0].currency,
          description: product_info[0].description,
          price: product_info[0].price,
          price_as_decimal: product_info[0].priceAsDecimal,
          tariff_id: tariff_id,
          title: product_info[0].title,
          // product_id: product_info[0].productId,
          // number_kids: kids.length,
          // kids_id: kids
        };
        console.log('data = ', data);

        return http.post(url.purchase.confirm, data).then(function (res) {
          console.log(res);
          if (res.status == 'success') {
            $state.go('parent-main-page')
          }
        })
      }

    }

    function paymentsList() {
      return http.get(url.purchase.payments_archive).then(function (res) {
        if (res.status == 'success') {
          return res.data;
        } else {
          return []
        }
      })
    }

    function getReceipt() {
      if (window.ionic.Platform.isWebView() && angular.isDefined(window.inAppPurchase)) {
        window.inAppPurchase.getReceipt()
          .then(function (receipt) {
            console.log(receipt);
            $ionicPopup.alert({
              title: 'Success',
              template: JSON.stringify(receipt)
            })
          })
          .catch(function (err) {
            $ionicPopup.alert({
              title: 'Error',
              template: JSON.stringify(err)
            })
          });
        } else {
          $ionicPopup.alert({
            title: 'Oops',
            template: 'condition not met'
          })
        }
    }

    function getPurchases() {
      if (window.ionic.Platform.isWebView() && angular.isDefined(window.inAppPurchase)) {
        window.inAppPurchase
          .restorePurchases()
          .then(function (data) {
            let receipt = JSON.parse(data[0].receipt);
            console.log(receipt);
            console.log(receipt.purchaseTime);
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    }


    function errorPopup() {
      $ionicPopup.alert({
        title: 'Something went wrong',
        template: 'Buy error'
      })
    }

    function showWarning() {
      var scope = $rootScope.$new(true);
      scope.close = closePopup;

      popupInstance = $ionicPopup.show({
        templateUrl: 'components/payment-warning/payment-warning.html',
        cssClass: 'payment-warning',
        scope: scope,
      });
    }
    function closePopup() {
      popupInstance.close();
    }
  }
})();
