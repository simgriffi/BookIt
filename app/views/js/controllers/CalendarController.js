angular.module('calendarCtrl', ['calendarService'])

.controller('CalendarController', function($scope, Calendar){

	var vm = this;

	vm.date = Calendar.date;

	//loads all the bookings
	Calendar.all().then(function(result){
		vm.bookings = result.data;
	});

    vm.getBookingCount = function(day, time){

    	// Calls to this function are made from the student home page, where they're converned about hours each day
    	// There are also calls made to getBookingCount from the admin splash page where only totals are shown.
    	if (time){
	        day = new Date(day);
	        day.setHours(time, 0, 0 , 0);
	        var hour = day.getHours();

	        if((day.getDay() == 0 || day.getDay() == 6) && (hour < 11 || hour > 17) || hour < 8 || hour > 21) {
	            return "";
	        }

	        var count = 10;

            for(var index in vm.bookings){
                var bookingDate = new Date(vm.bookings[index].startDate);
                var diff = Math.floor((new Date(vm.bookings[index].endDate).getTime() - bookingDate.getTime())/(60*60*1000));
                for(var i = 0; i < diff; ++i) {
                    var compareDate = new Date(bookingDate.getTime() + i*60*60*1000).toISOString();
                    var desiredDate = day.toISOString();
                    if( compareDate == desiredDate){
                        --count;
                        break;
                    }
                }
                
            }
	        return count;
	    } else {
			day = new Date(day);
			var count;
			//Figure out how many booking slots are available hypothetically, then subtract bookings that are already made
			if(day.getDay() == 0 || day.getDay() == 6){
				count = 70; // On weekends rooms open 11-6 (7 hours), and there's 10 rooms, so 70 = 7*10
			}
			else{
				count = 140; //weekdays, rooms open 8-10 (14 hours), and there's 10 rooms, so 140 = 14*10
			}
			for(var index in vm.bookings){
				var bookingDate = new Date(vm.bookings[index].startDate).toDateString();
				var desiredDate = day.toDateString();
				if( bookingDate == desiredDate){
					var duration = Math.floor((new Date(vm.bookings[index].endDate).getTime() - new Date(vm.bookings[index].startDate).getTime())/(60*60*1000));
					count = count - duration;
				}
			}
			return count;
	    }
    };

	//Get date object for the Sunday of week specified by vm.date
	vm.weekStart = function(){
		var day = vm.date.getDay();
		var diff = vm.date.getDate() - day;
		return new Date(vm.date.setDate(diff));
	};

	//Get date object for the Saturday of week specified by vm.date
	vm.weekEnd = function(){
		var day = vm.date.getDay();
		var diff = vm.date.getDate() - day;
		return new Date(vm.date.setDate(diff + 6));
	};

	//Change current week to the next week
	vm.nextWeek = function(){
		vm.date.setTime(vm.date.getTime() + 7*86400000);
	};

	//change current week to the previous week
	vm.lastWeek = function(){
		vm.date.setTime(vm.date.getTime() - 7*86400000);
	};

	vm.nextDay = function(){
		vm.date.setTime(vm.date.getTime() + 86400000);
	};

	vm.prevDay = function(){
		vm.date.setTime(vm.date.getTime() - 86400000);
	};

	vm.currentDay = function(){
		return vm.date;
	};
});
