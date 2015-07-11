angular.module('activeCtrl', ["activeBookingService"])

.controller('ActiveBookingController', function($rootScope, $location, $http, Auth, ActiveBooking) {

	var vm = this;
	vm.oneCall = true;
	vm.activeBookingService = ActiveBooking;

	Auth.getUser().then(function(user){
		vm.user = user.data;
	});

	vm.hasBooking = function() {
		if (vm.user.bookingID) {
			vm.populateBooking();
			ActiveBooking.setActiveBooking(true);
			return true;
		} else {
			ActiveBooking.setActiveBooking(false);
			return false;
		}
	};

	vm.populateBooking = function(){
		if (vm.oneCall){
			vm.oneCall = false;
			$http.get("/api/bookings/" + vm.user.bookingID).success(function(data){
				console.log(data);
				var own = vm.booking = {};
				own.startTime = (new Date(data.startDate)).toLocaleTimeString();
				own.endTime = (new Date(data.endDate)).toLocaleTimeString();
				own.date = (new Date(data.startDate)).toDateString();
				own.roomNumber = data.room.roomNumber;
				own.equipment = data.equipment.length == 0 ? "None" : data.equipment;
			});
		}
	};
	
	vm.deleteBooking = function(){
		$http.delete("/api/bookings/" + vm.user.bookingID).success(function(data){
			vm.user.bookingID = "";
			vm.booking = {};
			ActiveBooking.setActiveBooking(false);
		});	
	};
});