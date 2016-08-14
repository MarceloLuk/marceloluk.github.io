'use strict';

angular.module('userEdit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/edit', {
            templateUrl: 'user/edit.html',
            controller: 'userEditCtrl',
            resolve: {
                user: ['$http', 'store', function ($http, store) {
                    let user =  store.get('user_auth');
                    return $http.get(window.global.url + 'api/usuario/' + user.id);
                }],
                cards: ['$http', 'store', function ($http, store) {
                    var user = store.get('user_auth');
                    return $http.get(window.global.url + 'api/cartao/usuario/' + user.id);
                }]
            }
        });
    }])

    .controller('userEditCtrl', [
        '$scope', 'user', 'cards', 'store', '$location', '$http', '$route', 'growl',
        function ($scope, user, cards, store, $location, $http, $route, growl) {
            $scope.user = user.data.result;
            $scope.cards = cards.data.result;
            console.log(user);
            console.log(cards);
            $scope.formCard = false;
            $scope.formData = {};

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
            }
        }
    ]);
