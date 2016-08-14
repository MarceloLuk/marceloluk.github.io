'use strict';

angular.module('event', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/event/:id', {
            templateUrl: 'event/event.html',
            controller: 'eventCtrl',
            resolve: {
                event: ['$http', '$route', function ($http, $route) {
                    return $http.get(window.global.url+"api/evento/" + $route.current.params.id);
                }]
            }
        });
    }])

    .controller('eventCtrl', ['$scope', 'event', 'store', '$location', 'growl', function ($scope, event, store, $location, growl) {
        $scope.event = event.data.result;

        angular.forEach($scope.event.lotes, function (value) {
            angular.forEach(value.valores, function (val) {
                val.qtd = 0;
                val.total = 0;
            })
        });

        $scope.add = function (valores) {
            valores.qtd++;
            valores.total  = (valores.valor + valores.taxa) * valores.qtd;
        };

        $scope.remove = function (valores) {
            console.log(valores);
            if (valores.qtd > 0) {
                valores.qtd--;
                valores.total  = (valores.valor + valores.taxa) * valores.qtd;
            }
        };

        $scope.comprar = function (lotes) {
            let total = false;
            angular.forEach(lotes, function (value) {
                angular.forEach(value.valores, function (val) {
                    if (val.total) {
                        total = true;
                    }
                })
            });
            if (!total) {
                growl.error("Selecione a guantidade de ingressos");
            } else {
                store.set('compraIngresso', lotes);
                if (store.get('user_auth')) {
                    $location.path('/confirm');
                } else {
                    $location.path( "/login" );
                }
            }
        };

        $scope.totalIngressos = function () {
            var total = 0;
            angular.forEach($scope.event.lotes, function (value) {
                if (value) {
                    angular.forEach(value.valores, function (val) {
                        total = total + val.total;
                    })
                }
                value.total = total;
            });
            return total;
        };
        $("#changeHeader").animate({ scrollTop: 0 }, 100);
    }
    ]);
