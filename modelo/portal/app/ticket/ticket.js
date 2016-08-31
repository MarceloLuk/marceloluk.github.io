'use strict';

angular.module('ticket', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ticket', {
    templateUrl: 'ticket/ticket.html',
    controller: 'ticketCtrl'
  });
}])

.controller('ticketCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $scope.list = [];
    $scope.user = {};
    $scope.formData = {
      cpf: ''
    };
    $scope.ticket = {};
    store.remove('compraIngresso');
    $scope.openModal = false;
    $scope.userAuth = store.get('user_auth');
    if (!$scope.userAuth) {
       $location.path( "/login" );
    }

    $scope.getList = function () {
      console.log($scope.userAuth);
      $http.get(window.global.url+'api/evento/usuario/'+$scope.userAuth.id).success(function(data){
       $scope.list = data.result;
      }).error(function (data){
        growl.error(data);
      });
    };
    $scope.getList();

    $scope.getCode = function (id) {
      store.set('setCode', id);
      $location.path( "/qr-code" );
    };

    $scope.getTrans = function (item) {
      $scope.ticket = item;
      $scope.openModal = true;
    };

    $scope.close = function () {
      $scope.user = {};

      $scope.formData = {
        cpf: ''
      };
      $scope.openModal = false;
    };

    $scope.check = function () {
      if ($scope.formData.cpf) {
          $http.get(window.global.url + 'api/usuario/cpf/' + $scope.formData.cpf).success(function (data) {
            if (data.status != 'fail' && data.status != 'error'){
              $scope.user = data.result;
            } else {
              growl.error(data.message);
            }
          }).error(function (data) {
            growl.error(data);
          });
      } else {
        growl.error('Digite o CPF');
      }
    };
    $scope.trans = function () {
        $http.post(window.global.url + 'api/voucher/transferir', {
          idUsuario: $scope.user.id,
          idPagamento: $scope.ticket.id
        }).success(function (data) {
          if (data.status != 'fail' && data.status != 'error'){
            growl.success('Ingresso transferido com sucesso');
            $scope.getList();
            $scope.close();
          } else {
            growl.error(data.message);
          }
        });
    };

    $("#changeHeader").animate({ scrollTop: 0 }, 100);
}]);
