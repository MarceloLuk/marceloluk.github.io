'use strict';

angular.module('home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl',
    resolve: {
      event: ['$http', function ($http) {
        return $http.get(window.global.url+"api/evento/estado/DF");
      }]
    }
  });
}])

.controller('homeCtrl', ['event', '$scope', 'store', '$http', 'growl', '$location', function(event, $scope, store, $http, growl, $location) {
  $scope.event = event.data.result;
  $scope.formdata = {
    uf:'DF'
  };

  if (store.get('reload')) {
    store.remove('reload');
    location.reload();
  }

  $scope.search = function() {
    if (!$scope.formdata.uf) {
      $scope.formdata.uf = 'DF';
    }
    let url = window.global.url+'api/evento/estado/'+$scope.formdata.uf;

    if ($scope.formdata.date){
      let date = $scope.formdata.date.replace(/\//g, '-');
      url = window.global.url+'api/evento/filtrar/'+$scope.formdata.uf+'/'+date;
    }

      $http.get(url).success(function(data){
        if (data.result.length != 0) {
          $scope.list = [];
          $scope.list = data.result;
        } else {
          growl.error("Nenhum evento encontrado");
        }
      }).error(function (data){
        growl.error(data);
      });
  };

  $scope.getEvent = function (id)
  {
    store.set('event', id);
    $location.path("/event/"+id);
  };

  $("#changeHeader").animate({ scrollTop: 0 }, 100);
}]);
