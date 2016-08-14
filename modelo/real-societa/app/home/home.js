'use strict';

angular.module('home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl',
    resolve: {
      event: ['$http', function ($http) {
        return $http.get("http://prioritypass.esy.es/web/api/evento");
      }]
    }
  });
}])

.controller('homeCtrl', ['event', '$scope', 'store', function(event, $scope, store) {
  $scope.event = event.data.result;
  if (store.get('reload')) {
    store.remove('reload');
    location.reload();
  }

}]);
