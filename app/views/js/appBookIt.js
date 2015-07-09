angular.module('appBookIt', ['appBookIt.routes','authService','mainCtrl','calendarService','calendarCtrl', 'bookingCtrl'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

  // attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');

});
