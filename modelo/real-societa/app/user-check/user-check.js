'use strict';

angular.module('user-check', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/user-check', {
    templateUrl: 'user-check/user-check.html',
    controller: 'userCheckCtrl'
  });
}])

.controller('userCheckCtrl', [function() {

}]);
