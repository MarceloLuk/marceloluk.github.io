'use strict';

angular.module('login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', [ '$scope', '$http', 'growl','store', '$location',
    function($scope, $http, growl, store, $location) {
  store.remove('user_auth');
  $scope.login = {};
  $scope.formdata = {};
  $scope.loginIn = function () {
    $http.post(window.global.url+'api/usuario/auth',
        {
          login: $scope.login.email,
          senha: $scope.login.pass
        }).success(function(data){
          if (data.status != 'error') {
              store.set('user_auth', data.result);
              store.set('reload', true);
              $location.path( "/home" );
          } else {
              growl.error(data.messages);
          }
    }).error(function (data){
        growl.error(data);
    });
  };

    $scope.saveUser = function () {
        store.set('formdata', $scope.formdata);
        $location.path( "/user" );
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
}]);
