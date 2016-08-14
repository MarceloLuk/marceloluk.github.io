'use strict';

angular.module('user-check', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/user-check', {
    templateUrl: 'user-check/user-check.html',
    controller: 'userCheckCtrl'
  });
}])

.controller('userCheckCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $scope.user = {};
    $scope.code = {};
    if (store.get('userSave')) {
      $scope.user = store.get('userSave');

    }

    $scope.check = function () {
      $http.post(window.global.url+'/api/usuario/codigo/checar',
          {
            idUsuario: $scope.user.id,
            codigo: $scope.code
          }
      ).success(function(data){
        console.log(data);
        if (data.status != 'error') {
          growl.success(data.messages);
          store.set('userSave', data.result);
          $location.path( "/login" );
        } else {
          growl.error(data.messages);
        }
      }).error(function (data){
        growl.error(data);
      });
    };

    $scope.resend = function () {
      $http.post(window.global.url+'/api/usuario/codigo/reenviar',
          {
            idUsuario: $scope.user.id
          }
      ).success(function(data){
        console.log(data);
        if (data.status != 'error') {
          growl.success(data.messages);
          store.set('userSave', data.result);
          $location.path( "/login" );
        } else {
          growl.error(data.messages);
        }
      }).error(function (data){
        growl.error(data);
      });
    }
}]);
