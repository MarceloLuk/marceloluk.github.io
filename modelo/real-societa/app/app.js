'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.utils.masks',
  'angular-growl',
  'angular-storage',
  'ui.bootstrap',
  'home',
  'login',
  'user',
  'event',
  'user-check'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/home'});

}])
.controller('appCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $scope.userAuth = store.get('user_auth');

    store.remove('user_auth');
    $scope.logout = function () {
      store.remove('user_auth');
    }
  }]);

