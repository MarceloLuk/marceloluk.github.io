'use strict';

angular.module('userEdit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/edit', {
            templateUrl: 'user/edit.html',
            controller: 'userEditCtrl',
            resolve: {
                user: ['$http', 'store', function ($http, store) {
                    let user =  store.get('user_auth');
                    if (user) {
                        return $http.get(window.global.url + 'api/usuario/' + user.id);
                    } else {
                        return {};
                    }
                }],
                cards: ['$http', 'store', function ($http, store) {
                    var user = store.get('user_auth');
                    if (user) {
                        return $http.get(window.global.url + 'api/cartao/usuario/' + user.id);
                    } else {
                        return {};
                    }
                }]
            }
        });
    }])

    .controller('userEditCtrl', [
        '$scope', 'user', 'cards', 'store', '$location', '$http', '$route', 'growl',
        function ($scope, user, cards, store, $location, $http, $route, growl) {
            $scope.cards = [];
            $scope.user = {};
            if (user.data) {
                $scope.user = user.data.result;
            }
            if (cards.data) {
                $scope.cards = cards.data.result;
            }
            $scope.formCard = false;
            $scope.formData = {};

            var i;
            var year = new Date().getFullYear();

            $scope.arYear = [];

            for (i = 0; i <= 10; i++) {
                $scope.arYear.push(year++);
            }

            function EL(id) { return document.getElementById(id); } // Get el by ID helper function

            function readFile() {
                if (this.files && this.files[0]) {
                    var FR= new FileReader();
                    FR.onload = function(e) {
                        $scope.base64 = e.target.result;
                        $scope.$apply();
                    };
                    FR.readAsDataURL( this.files[0] );
                }
            }


            $scope.addCard = function () {
                $scope.formCard = true;
                $scope.formData = {};
            };

            $scope.cancelCard = function () {
                $scope.formCard = false;
                $scope.formData = {};
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

            $scope.loadcep = function () {
                $http.get('https://viacep.com.br/ws/' + $scope.user.cep + '/json/').success(function(data){
                    if (!data.erro) {
                        $scope.user.uf = data.uf;
                        $scope.user.bairro = data.bairro;
                        $scope.user.complemento = data.complemento;
                        $scope.user.endereco = data.logradouro;
                        $scope.user.municipio = data.localidade;
                    }
                    console.log(data);
                });
            };

            $scope.editCard = function (card) {
                $scope.formCard = true;
                $scope.formData = card;
                $scope.base64 = card.imagem;
                var vencimento = card.vencimento.split('/');
                $scope.formData.mes = vencimento[0];
                $scope.formData.ano = vencimento[1];
            };

            $scope.saveUser = function () {
                $http.post(window.global.url+'api/usuario/salvar',
                    $scope.user
                ).success(function(data){
                    console.log(data);
                    if (data.status != 'error') {
                        growl.success(data.messages);
                        $route.reload();
                    } else {
                        growl.error(data.messages);
                    }
                }).error(function (data){
                    growl.error(data);
                });
            };



            $scope.saveCard = function () {
                $scope.formData.idUsuario = $scope.user.id;
                $scope.formData.imagem = $scope.base64;

                if (!$scope.base64) {
                    growl.error('A imagem do cartão é obrigatório');
                    return false;
                }

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
            }
        }
    ]);
