'use strict';

angular.module('confirm', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/confirm', {
            templateUrl: 'user/confirm.html',
            controller: 'confirmCtrl',
            resolve: {
                user: ['store', function (store) {
                    return store.get('user_auth');
                }],
                compraIngresso: ['store', function (store) {
                    return store.get('compraIngresso');
                }],
                cards: ['$http', 'store', function ($http, store) {
                    var user = store.get('user_auth');
                    return $http.get(window.global.url+'api/cartao/usuario/' + user.id);
                }]
            }
        });
    }])

    .controller('confirmCtrl', [
        '$scope', 'user', 'store', '$location', 'compraIngresso', '$http', 'growl', 'cards', '$route',
        function ($scope, user, store, $location, compraIngresso, $http, growl, cards, $route) {
            $scope.formCard = false;
            $scope.formData = {};
            $scope.user = user;
            $scope.cards = cards.data.result;
            $scope.compraIngresso = compraIngresso;
            console.log($scope.compraIngresso);
            $scope.event = {
                lotes: compraIngresso
            };

            $scope.addCard = function () {
                $scope.formCard = true;
                $scope.formData = {};
            };

            $scope.cancelCard = function () {
                $scope.formCard = false;
                $scope.formData = {};
            };

            var formatPagament = {};
            $scope.confirmBuy = function () {
                if ($scope.formData.tipo) {
                    angular.forEach($scope.compraIngresso, function (ingress) {
                        angular.forEach(ingress.valores, function (value) {
                            if (value.qtd && value.qtd > 0) {

                                formatPagament = {
                                    idValor: value.id,
                                    idUsuario: $scope.user.id,
                                    quantidade: value.qtd,
                                    valor: value.total,
                                    tipoPagamento: $scope.formData.tipo
                                };

                                $http.post(window.global.url + 'api/pagamento/salvar',
                                    formatPagament
                                ).success(function (data) {
                                    if (data.status != 'error') {
                                        growl.success(data.messages);
                                        $location.path("/ticket");
                                    } else {
                                        growl.error(data.messages);
                                    }
                                }).error(function (error) {
                                    growl.error(error);
                                })
                            }
                        })
                    });
                } else {
                    growl.error('Selecione ao menus um cartão');
                }
            };

            $scope.url = $location.absUrl().split('#');
            $scope.url = $scope.url[0];

            console.log(user);

            $scope.addTypeCard = function (type) {
                $scope.formData.tipo = type;

                if (type == 'M') {
                    $scope.formData.imagem = $scope.url + 'img/master-card.png';
                }

                if (type == 'V') {
                    $scope.formData.imagem = $scope.url + 'img/visa.png';
                }

            };

            $scope.saveCard = function () {
                $scope.formData.idUsuario = $scope.user.id;
                console.log($scope.formData);
                $http.post(window.global.url + 'api/cartao/salvar',
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

            $scope.selectCard = function (card) {
                angular.forEach($scope.cards , function (value) {
                    value.select = false;
                });
                card.select = true;
                $scope.formData.tipo = card.tipo;
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

            $scope.back = function () {
                let id = store.get('event');
                $location.path("/event/"+id);
            };

            $("#changeHeader").animate({ scrollTop: 0 }, 100);

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
