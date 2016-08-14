'use strict';

angular.module('event', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/event/:id', {
            templateUrl: 'event/event.html',
            controller: 'eventCtrl',
            resolve: {
                event: ['$http', '$route', function ($http, $route) {
                    return $http.get("http://prioritypass.esy.es/web/api/evento/" + $route.current.params.id);
                }]
            }
        });
    }])

    .controller('eventCtrl', ['$scope', 'event', function ($scope, event) {
        $scope.event = event.data.result;

        angular.forEach($scope.event.lotes, function (value) {
            angular.forEach(value.valores, function (val) {
                val.qtd = 0;
            })
        });

        $scope.add = function (valores) {
            valores.qtd++;
        };

        $scope.remove = function (valores) {
            console.log(valores);
            if (valores.qtd > 0) {
                valores.qtd--;
            }
        };

        $scope.total = [];
        var a = 0;
        $scope.totalIngressos = function (lotes) {
            angular.forEach(lotes, function (value) {
                angular.forEach(value.valores, function (val) {
                    $scope.total[val.id] = (((val.valor + val.taxa) * val.qtd));
                })
            });

            console.log($scope.total);

            return a;
        }

    }
    ]);
