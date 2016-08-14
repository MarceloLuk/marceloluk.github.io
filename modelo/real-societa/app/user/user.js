'use strict';

angular.module('user', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/user', {
    templateUrl: 'user/user.html',
    controller: 'userCtrl'
  });
}])

.controller('userCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $scope.formdata = {};
    if (store.get('formdata')) {
      $scope.formdata = store.get('formdata');
      store.remove('formdata');
    }

    $scope.saveUser = function () {
      $http.post(window.global.url+'api/usuario/salvar',
          $scope.formdata
      ).success(function(data){
        console.log(data);
        if (data.status != 'error') {
          growl.success(data.messages);
          store.set('userSave', data.result);
          $location.path( "/user-check" );
        } else {
          growl.error(data.messages);
        }
      }).error(function (data){
        growl.error(data);
      });
    };

    $scope.loadcep = function () {
        $http.get('https://viacep.com.br/ws/' + $scope.formdata.cep + '/json/').success(function(data){
            if (!data.erro) {
                $scope.formdata.uf = data.uf;
                $scope.formdata.bairro = data.bairro;
                $scope.formdata.complemento = data.complemento;
                $scope.formdata.endereco = data.logradouro;
                $scope.formdata.municipio = data.localidade;
            }
            console.log(data);
        });
    };

    $("#changeHeader").animate({ scrollTop: 0 }, 100);
}]);
