'use strict';

angular.module('info', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/info', {
    templateUrl: 'info/info.html',
    controller: 'infoCtrl'
  });
}])

.controller('infoCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $("#changeHeader").animate({ scrollTop: 0 }, 100);
}]);
