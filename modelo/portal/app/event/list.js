'use strict';

angular.module('eventList', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/admin/event/list', {
            templateUrl: 'event/list.html',
            controller: 'eventListCtrl',
            resolve: {
                event: ['$http', function ($http) {
                    return $http.get(window.global.url + "api/evento");
                }]
            }
        });
    }])

    .controller('eventListCtrl', [
        '$scope', 'store', '$location', 'growl', '$http', 'event',
        function ($scope, store, $location, growl, $http, event) {
            $scope.events = event.data.result;

            console.log($scope.events);

            $scope.create = function () {
                $location.path("/admin/event/new");
            };

        }
    ]);
