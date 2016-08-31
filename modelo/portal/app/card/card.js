'use strict';

angular.module('requestCard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/request/card', {
            templateUrl: 'card/card.html',
            controller: 'requestCardCtrl'
        });
    }])

    .controller('requestCardCtrl', ['$scope', '$http', 'growl', 'store', '$location',
        function ($scope, $http, growl, store, $location) {
            $scope.user = store.get('user_auth');
            console.log($scope.user);
            $("#changeHeader").animate({scrollTop: 0}, 100);

            $scope.solicitar = function () {
                $http.post(window.global.url+'api/evento/solicitar/cartao',
                    {idUsuario: $scope.user.id}
                ).success(function(data){
                    console.log(data);
                    if (data.status != 'error') {
                        growl.success(data.messages);
                    } else {
                        growl.error(data.messages);
                    }
                }).error(function (data){
                    growl.error(data);
                });
            }

        }]);
