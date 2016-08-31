'use strict';

angular.module('eventForm', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin/event/new', {
            templateUrl: 'event/form.html',
            controller: 'eventFormCtrl',
            resolve: {
                event: ['$http', '$route', function ($http, $route) {
                    return null;
                }]
            }
        }).when('/admin/event/edit/:id', {
            templateUrl: 'event/form.html',
            controller: 'eventFormCtrl',
            resolve: {
                event: ['$http', '$route', function ($http, $route) {
                    return $http.get(window.global.url+"api/evento/" + $route.current.params.id);
                }]
            }
        });
    }])

    .controller('eventFormCtrl', [
        '$scope', 'store', '$location', 'growl', '$http', 'event',
        function ($scope, store, $location, growl, $http, event) {
            $scope.formData = {};

            if (event) {
                console.log(event);
                $scope.formData = event.data.result;
                $scope.base64 = $scope.formData.imagem;
            }

            $scope.url = $location.absUrl().split('#');
            $scope.url = $scope.url[0];


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

            EL("inp").addEventListener("change", readFile, false);


            $scope.saveEvent = function () {
                let date = $('#dataEvento').val().split('/');
                $scope.formData.dataEvento = date[2]+'-'+date[1]+'-'+date[0];

                $scope.formData.imagem = $scope.base64;
                $scope.formData.ativo = true;

                console.log($scope.formData);

                $http.post(window.global.url + 'api/evento/salvar',
                    $scope.formData
                ).success(function (data) {
                    console.log(data);
                    if (data.status != 'error') {
                        growl.success(data.messages);
                    } else {
                        growl.error(data.messages);
                        $location.path("/admin/event/list");
                    }
                }).error(function (error) {
                    growl.error(data);
                })

            };

            $scope.back = function () {
                $location.path("/admin/event/list");
            }

        }
    ]);
