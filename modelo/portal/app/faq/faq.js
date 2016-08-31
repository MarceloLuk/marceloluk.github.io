'use strict';

angular.module('faq', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/faq', {
    templateUrl: 'faq/faq.html',
    controller: 'faqCtrl'
  });
}])

.controller('faqCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $("#changeHeader").animate({ scrollTop: 0 }, 100);
}]);
