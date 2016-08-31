'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.utils.masks',
  'angular-growl',
  'angular-storage',
  'ui.bootstrap',
  'angular-loading-bar',
  'home',
  'ticket',
  'qr-code',
  'login',
  'user',
  'event',
  'user-check',
  'confirm',
  'userEdit',
  'confirm',
  'eventForm',
  'eventList',
  'lotes',
  'ngFacebook',
  'faq',
  'info',
  'card',
  'contact',
  'requestCard',
  'ngOnload'
]).

config(['$locationProvider', '$routeProvider', 'cfpLoadingBarProvider', function($locationProvider, $routeProvider, cfpLoadingBarProvider) {

  $routeProvider.otherwise({redirectTo: '/home'});

  cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
  cfpLoadingBarProvider.spinnerTemplate = '<div id="loader-wrapper"><div id="loader"></div></div>';

}])
.controller('appCtrl', [ '$scope', '$http', 'growl','store', '$location',
  function($scope, $http, growl, store, $location) {
    $scope.userAuth = store.get('user_auth');

    $scope.logout = function () {
      store.remove('user_auth');
      store.set('reload', true);
      $location.path( "/home" );
    }
  }]);

