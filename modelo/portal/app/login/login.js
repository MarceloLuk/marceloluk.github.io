'use strict';

angular.module('login', ['ngRoute', 'ngFacebook'])

    .config(['$routeProvider','$facebookProvider', function ($routeProvider, $facebookProvider) {
        $facebookProvider.setAppId(1101892506562384);
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        });
    }])
    .run(['$rootScope', '$window', function($rootScope, $window) {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        $rootScope.$on('fb.load', function() {
            $window.dispatchEvent(new Event('fb.load'));
        });
    }])
    .controller('loginCtrl', ['$scope', '$http', 'growl', 'store', '$location', '$facebook',
        function ($scope, $http, growl, store, $location, $facebook) {
            store.remove('user_auth');
            $scope.$on('fb.auth.authResponseChange', function() {
                $scope.status = $facebook.isConnected();
                if($scope.status) {
                    $facebook.api('/me').then(function(user) {
                        $scope.user = user;
                    });
                }
            });

            $scope.loginToggle = function() {
                if($scope.status) {
                    $facebook.logout();
                } else {
                    $facebook.login();
                }
            };

            $scope.login = {};
            $scope.formdata = {};
            $scope.formLogin = true;
            $scope.formPassword = false;
            $scope.restore = {};
            $scope.loginIn = function () {
                $http.post(window.global.url + 'api/usuario/auth',
                    {
                        login: $scope.login.email,
                        senha: $scope.login.pass
                    }).success(function (data) {
                    if (data.status != 'error') {
                        store.set('user_auth', data.result);
                        store.set('reload', true);
                        if (store.get('compraIngresso')) {
                            if (data.result.aceite == true) {
                                $location.path("/confirm");
                            } else {
                                store.remove('user_auth');
                                store.set('userSave', data.result);
                                $location.path("/user-check");
                            }
                        } else {
                            $location.path("/home");
                        }
                    } else {
                        growl.error(data.messages);
                    }
                }).error(function (data) {
                    growl.error(data);
                });
            };

            $scope.loginFace = function () {

            };

            $scope.saveUser = function () {
                store.set('formdata', $scope.formdata);
                $location.path("/user");
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

            $scope.changeFormPassword = function () {
                $scope.formLogin = false;
                $scope.formPassword = true;
            };

            $scope.changeFormLogin = function () {
                $scope.formLogin = true;
                $scope.formPassword = false;
            };

            $scope.sendPassword = function () {
                $http.post(window.global.url + 'api/usuario/senha/alterar',
                    {
                        email: $scope.restore.email
                    }).success(function (data) {
                    if (data.status != 'error') {
                        growl.success(data.messages);
                        $scope.changeFormLogin();
                    } else {
                        growl.error(data.messages);
                    }
                }).error(function (data) {
                    growl.error(data);
                });
            };

            $("#changeHeader").animate({scrollTop: 0}, 100);
        }]);
