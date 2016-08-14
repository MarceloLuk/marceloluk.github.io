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


    $("#changeHeader").animate({ scrollTop: 0 }, 100);
}]);
