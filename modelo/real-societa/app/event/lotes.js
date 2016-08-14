'use strict';

angular.module('lotes', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin/lotes/evento/:id', {
            templateUrl: 'event/lotes.html',
            controller: 'lotesCtrl',
            resolve: {
                event: ['$http', '$route', function ($http, $route) {
                    return $http.get(window.global.url + "api/evento/" + $route.current.params.id);
                }]
            }
        });
    }])

    .controller('lotesCtrl', [
        '$scope', 'store', '$location', 'growl', '$http', 'event', '$route',
        function ($scope, store, $location, growl, $http, event, $route) {
            $scope.events = event.data.result;
            $scope.formData = {};
            $scope.formValor = {};
            $scope.formLote = false;
            $scope.cadValor = [];
            $scope.oneAtATime = true;
            console.log($scope.events);

            $scope.addLote = function () {
                $scope.formData = {};
                $scope.formLote = true;
            };

            $scope.cancelLote = function () {
                $scope.formData = {};
                $scope.formLote = false;
                $("#changeHeader").animate({ scrollTop: 0 }, 100);
            };

            $scope.addValor = function (lote) {
                $scope.formValor = {};
                $scope.cadValor[lote.id] = true;
            };

            $scope.cancelValor = function (lote) {
                $scope.formValor = {};
                $scope.cadValor[lote.id] = false;
            };


            $scope.saveValor = function (lote) {
                $scope.formValor.idLote = lote.id;
                $http.post(window.global.url + 'api/evento/lote/valor/salvar',
                    $scope.formValor
                ).success(function (data) {
                    console.log(data);
                    if (data.status != 'error') {
                        growl.success(data.messages);
                        $route.reload();
                    } else {
                        growl.error(data.messages);
                    }
                }).error(function (error) {
                    growl.error(data);
                })
            };

            $scope.back = function () {
                $location.path("/admin/event/list");
            }

            $("#changeHeader").animate({ scrollTop: 0 }, 100);

            $scope.saveLote = function() {
                $scope.formData.dataInicio = $scope.formData.dt_inicio.replace(/\//g, '-');
                $scope.formData.dataFim = $scope.formData.dt_fim.replace(/\//g, '-');
                $scope.formData.idEvento = $scope.events.id;

                $http.post(window.global.url + 'api/evento/lote/salvar',
                    $scope.formData
                ).success(function (data) {
                    console.log(data);
                    if (data.status != 'error') {
                        growl.success(data.messages);
                        $route.reload();
                    } else {
                        growl.error(data.messages);
                    }
                }).error(function (error) {
                    growl.error(data);
                })
            };

        }
    ]).directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if(!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if(!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean =negativeCheck[0] + '-' + negativeCheck[1];
                    if(negativeCheck[0].length > 0) {
                        clean =negativeCheck[0];
                    }

                }

                if(!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0,2);
                    clean =decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if(event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
