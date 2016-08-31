'use strict';

angular.module('qr-code', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/qr-code', {
    templateUrl: 'qr-code/qr-code.html',
    controller: 'qrCodeCtrl'
  });
}])

.controller('qrCodeCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $scope.img = '';
    $scope.code = store.get('setCode');
    $scope.userAuth = store.get('user_auth');
    if (!$scope.userAuth) {
       $location.path( "/login" );
    }
    $scope.img = window.global.url+'api/voucher/'+$scope.code.id;

    $scope.back = function () {
      $location.path( "/ticket" );
    }
}]);
