angular.module('appBookIt', ['appBookIt.routes','authService','mainCtrl','calendarService', 'quickBookService', 'editBookingService', 'calendarCtrl', 'bookingCtrl', 'activeCtrl', 'adminCtrl'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

  // attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');

});
