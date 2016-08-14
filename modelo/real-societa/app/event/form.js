'use strict';

angular.module('eventForm', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin/event/new', {
            templateUrl: 'event/form.html',
            controller: 'eventFormCtrl'
        });
    }])

    .controller('eventFormCtrl', [
        '$scope', 'store', '$location', 'growl', '$http',
        function ($scope, store, $location, growl, $http) {
            $scope.formData = {};

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
                $scope.formData.dataEvento = $scope.formData.data.replace(/\//g, '-');
                $scope.formData.imagem = $scope.base64;

                console.log($scope.formData);

                $http.post(window.global.url + 'api/evento/salvar',
                    $scope.formData
                ).success(function (data) {
                    console.log(data);
                    if (data.status != 'error') {
                        growl.success(data.messages);
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

        }
    ]);
