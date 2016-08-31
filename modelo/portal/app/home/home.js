'use strict';

angular.module('home', ['ngRoute', 'ngOnload'])

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

.controller('homeCtrl', ['event', '$scope', 'store', '$http', 'growl', '$location','$timeout',
  function(event, $scope, store, $http, growl, $location, $timeout) {
  $scope.event = event.data.result;
  $scope.list = event.data.result;

  if (store.get('reload')) {
    store.remove('reload');
    location.reload();
  }
  store.remove('compraIngresso');

  $scope.search = function() {
    if (!$scope.formdata.uf) {
      $scope.formdata.uf = 'DF';
    }
    let url = window.global.url+'api/evento/estado/'+$scope.formdata.uf;

    if ($scope.formdata.date) {
      let date = $scope.formdata.date.split('/');
      date = date[2]+'-'+date[1]+'-'+date[0];
      url = window.global.url + 'api/evento/filtrar/' + $scope.formdata.uf + '/' + date;
    }
      $http.get(url).success(function(data) {

        if (data.status != 'error' && data.status != 'fail') {
          if (data.result.length != 0) {
            $scope.list = [];
            $scope.list = data.result;
          } else {
            $scope.list = [];
            growl.error("Nenhum evento encontrado");
          }
        } else {
          growl.error(data.messages);
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
    $timeout(function () {
      jQuery('.fullscreenbanner').revolution(
        {delay:5000,
          startwidth:1170,
          startheight:745,
          fullWidth:"on",
          fullScreen:"off",
          hideCaptionAtLimit:"",
          dottedOverlay:"twoxtwo",
          navigationStyle:"preview4",
          fullScreenOffsetContainer:"",
          hideTimerBar:"on"}
    )
    }, 1000);

  $("#changeHeader").animate({ scrollTop: 0 }, 100);

}]).directive('checkImage', function($http) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      attrs.$observe('ngSrc', function(ngSrc) {
        if(isBase64(ngSrc) == false) {
          if (ngSrc != undefined) {
            $http.get(ngSrc).success(function () {
            }).error(function () {
              element.attr('src', 'home/img/bg-card-3.png'); // set default image
            });
          }
        }
      });
    }
  };
});


function isBase64(str) {
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}
