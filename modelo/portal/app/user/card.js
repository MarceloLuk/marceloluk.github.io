'use strict';

angular.module('card', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/card', {
    templateUrl: 'user/card.html',
    controller: 'cardCtrl',
    resolve: {
      user: ['store', function (store) {
          return store.get('userSave');
      }],
      cards: ['$http', 'store', function ($http, store) {
          var user = store.get('userSave');
          return $http.get(window.global.url+'api/cartao/usuario/' + user.id);
      }]
    }
  });
}])

.controller('cardCtrl', [ '$scope', '$http', 'growl','store', '$location','user','cards', '$route',
  function($scope, $http, growl, store, $location, user, cards, $route) {
    $scope.formdata = {};

      var year = new Date().getFullYear();
      var range = [];
      range.push(year);
      for(var i=1;i<20;i++) {
          range.push(year + i);
      }
      $scope.years = range;

    $scope.user = user;
    $scope.cards = cards.data.result;

    $scope.addCard = function () {
      $scope.formCard = true;
      $scope.formData = {};
    };

    $scope.cancelCard = function () {
      $scope.formCard = false;
      $scope.formData = {};
    };

    $scope.url = $location.absUrl().split('#');
    $scope.url = $scope.url[0];

    console.log(user);

    $scope.addTypeCard = function (type) {
      $scope.formData.tipo = type;

      if (type == 'M') {
          $scope.formData.imagem = $scope.url + 'img/master-card.png';
      }

      if (type == 'V') {
          $scope.formData.imagem = $scope.url + 'img/visa.png';
      }

    };

    $scope.saveCard = function () {
      $scope.formData.idUsuario = $scope.user.id;
      console.log($scope.formData);
      $http.post(window.global.url + 'api/cartao/salvar',
          $scope.formData
      ).success(function (data) {
          console.log(data);
          if (data.status != 'error') {
              growl.success(data.messages);
              $route.reload();
          } else {
              growl.error(data.messages);
          }
      }).error(function (error) {
          growl.error(data);
      })
    };

    $scope.confirmBuy = function () {
     if ($scope.cards.length) {
         $location.path("/user-check");
     } else {
         growl.error('Cadastre ao menos um cartão.');
     }
    };

    $("#changeHeader").animate({ scrollTop: 0 }, 100);
}]).directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if(!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if(!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean =negativeCheck[0] + '-' + negativeCheck[1];
                    if(negativeCheck[0].length > 0) {
                        clean =negativeCheck[0];
                    }

                }

                if(!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0,2);
                    clean =decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if(event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
