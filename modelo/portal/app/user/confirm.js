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
        '$scope', 'user', 'store', '$location', 'compraIngresso', '$http', 'growl', 'cards', '$route', '$window',
        function ($scope, user, store, $location, compraIngresso, $http, growl, cards, $route, $window) {
            $scope.formCard = false;
            if (store.get('reload')) {
                store.remove('reload');
                location.reload();
            }

            if (!store.get('compraIngresso')) {
                $location.path("/home");
            }
            $scope.formData = {};
            $scope.user = user;
            $scope.cards = cards.data.result;
            $scope.compraIngresso = compraIngresso;
            $scope.event = {
                lotes: compraIngresso
            };

            var year = new Date().getFullYear();
            var range = [];
            range.push(year);
            for(var i=1;i<20;i++) {
                range.push(year + i);
            }
            $scope.years = range;

            $scope.addCard = function () {
                $scope.formCard = true;
                $scope.formData = {};
            };

            $scope.cancelCard = function () {
                $scope.formCard = false;
                $scope.formData = {};
            };
            var i = 0;
            var formatPagament = [];
            $scope.sendPagSeguro = function () {
                formatPagament = [];
                var pay = '';
                if ($scope.formData.tipo && $scope.formData.idCartao) {
                    console.log($scope.compraIngresso);
                    angular.forEach($scope.compraIngresso, function (ingress) {
                        angular.forEach(ingress.valores, function (value) {
                            if (value.qtd && value.qtd > 0) {
                                if (!pay) {
                                    pay += value.id;
                                } else {
                                    pay += ', '+ value.id;
                                }
                                formatPagament.push({
                                    idValor: value.id,
                                    idUsuario: $scope.user.id,
                                    quantidade: value.qtd,
                                    valor: value.total,
                                    descricao: value.descricao,
                                    tipoPagamento: $scope.formData.tipo,
                                    valorTaxa: value.valor + value.taxa
                                });
                            }
                        })
                    });
                    console.log(formatPagament);

                    angular.forEach(formatPagament, function (val) {

                        for (i = 0; val.quantidade > i; i++) {
                            console.log(i);
                            $http.post(window.global.url + 'api/pagamento/salvar',
                                {
                                    idValor: val.idValor,
                                    idUsuario: $scope.user.id,
                                    quantidade: val.quantidade,
                                    valor: val.valorTaxa,
                                    tipoPagamento: $scope.formData.tipo
                                }
                            ).success(function (data) {
                                if (data.status != 'error') {
                                    growl.success('Aguardando confirmação do pagamento');
                                } else {
                                    growl.error(data.messages);
                                    return false;
                                }
                            }).error(function (error) {
                                growl.error(error);
                                return false;
                            })
                        }

                    }).then(function () {
                        $http.post(window.global.url + 'api/pagamento/paypal',
                            {
                                idCartao: $scope.formData.idCartao,
                                idPagamento: pay

                            }
                        ).success(function (data) {
                            if (data.status != 'error' && data.status != 'fail') {

                                $scope.finish(formatPagament);
                            } else {
                                growl.error(data.messages);
                                return false;
                            }
                        }).error(function (error) {
                            growl.error(error);
                            return false;
                        })
                    });

                } else {
                    growl.error('selecione um cartão');
                }


            };

            $scope.finish = function (formatPagament) {
                angular.forEach(formatPagament, function (val) {
                    for (i = 0; val.quantidade > i; i++) {
                        console.log(i);
                        $http.post(window.global.url + 'api/pagamento/salvar',
                            {
                                idValor: val.idValor,
                                idUsuario: $scope.user.id,
                                quantidade: val.quantidade,
                                valor: val.valorTaxa,
                                tipoPagamento: $scope.formData.tipo
                            }
                        ).success(function (data) {
                            if (data.status != 'error') {
                                growl.success('Pagamento realizado com sucesso');

                            } else {
                                growl.error(data.messages);
                                return false;
                            }
                        }).error(function (error) {
                            growl.error(error);
                            return false;
                        })
                    }
                }).then(function () {
                    $location.path("/ticket");
                });


            };

            $scope.buy = function () {
                angular.forEach(formatPagament, function (val) {
                    for (i = 0; val.quantidade > i; i++) {
                        console.log(i);
                        $http.post(window.global.url + 'api/pagamento/salvar',
                            {
                                idValor: val.idValor,
                                idUsuario: $scope.user.id,
                                quantidade: val.quantidade,
                                valor: val.valorTaxa,
                                tipoPagamento: $scope.formData.tipo
                            }
                        ).success(function (data) {
                            if (data.status != 'error') {
                                growl.success(data.messages);
                            } else {
                                growl.error(data.messages);
                            }
                        }).error(function (error) {
                            growl.error(error);
                        })
                    }

                });
            };

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
                $scope.formData.idCartao = card.id;
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
