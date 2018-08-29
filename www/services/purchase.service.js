;(function () {
  'use strict';

  angular.module('service.purchaseService', [])
    .service('purchaseService', purchaseService);

  purchaseService.$inject = ['http', 'url', '$ionicLoading', '$ionicPopup', '$rootScope', '$state'];

  function purchaseService(http, url, $ionicLoading, $ionicPopup, $rootScope, $state) {

    var popupInstance = undefined;

    var model = {};
    model.buy = buy;
    model.paymentsList = paymentsList;
    model.getReceipt = getReceipt;
    model.getPurchases = getPurchases;
    model.productInfo = productInfo;

    function productInfo(tariff) {
      console.log('products', tariff);
      window.inAppPurchase
        .getProducts(tariff)
        .then(function (tariff_info) {
          console.log(tariff_info);
        })
        .catch(function (err) {
          console.log(err);
          errorPopup(1);
        });
    }


    $rootScope.$on('overdue-subscription', function (event, data) {
      showWarning();
    });

    return model;

    function loadProduct(data) {
      return http.post(url.purchase.get_plan, data)
    }

    function buy(kids) {
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
            getProductInfo([tariff], tariff_id);
            // getProductInfo(['managed.product.test2'], tariff_id);
          } else {
            errorPopup(2)
          }
        } else {
          errorPopup(3)
        }
      });

      function getProductInfo(tariff, tariff_id) {
        console.log('products', tariff);
        window.inAppPurchase
          .getProducts(tariff)
          .then(function (tariff_info) {
            console.log(tariff[0], tariff_info, tariff_id);
            buyProduct(tariff[0], tariff_info, tariff_id)
          })
          .catch(function (err) {
            console.log(err);
            errorPopup(4, err);
          });
      }

      function buyProduct(product_name, product_info, tariff_id) {
        if (window.ionic.Platform.isWebView() && angular.isDefined(window.inAppPurchase) && product_name) {
          window.inAppPurchase.buy(product_name)
            .then(function (data) {
              savePaymentInHistory(data, product_info, tariff_id);
              return window.inAppPurchase.consume(data.productType, data.receipt, data.signature);
            })
            .then(function (data) {
              console.log('processSuccessBuy');
            }).catch(function (err) {
              // $ionicLoading.hide();
              errorPopup(5, err);
            });
        }
      }

      function savePaymentInHistory(data, product_info, tariff_id) {
        // let receipt = JSON.parse(data.receipt);

        let data_for_send = {
            currency: product_info[0].currency,
            description: product_info[0].description,
            price: product_info[0].price,
            priceAsDecimal: product_info[0].priceAsDecimal,
            tariff_id: tariff_id,
            title: product_info[0].title,
            kid_id: kids,
            // date: receipt.date,
            // product_id: product_info[0].productId,

        };

        return http.post(url.purchase.confirm, data_for_send).then(function (res) {
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


    function errorPopup(number, err) {
      $ionicPopup.alert({
        title: 'Something went wrong ' + number,
        template: 'Buy error' + err
      })
    }
    // function errorPopup() {
    //   $ionicPopup.alert({
    //     title: 'Something went wrong',
    //     template: 'Buy error'
    //   })
    // }

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
