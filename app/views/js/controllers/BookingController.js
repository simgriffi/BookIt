angular.module('bookingCtrl', ["activeBookingService", "quickBookService"])

.controller('BookingController', function($scope, $location, $window, Auth, ActiveBooking, quickBook){

            //All of this stuff currently relates to
            //the quickbook feature, so maybe it is worth
            //making vm the quickbook controller and
            //creating a new controller for the other
            //booking process

            var vm = this;


            vm.dayDropdownItems = [];
            vm.startTimeDropdownItems = [];
            vm.endTimeDropdownItems = []
            vm.equipmentTypes = ["Projector", "Laptop"];

            vm.selectedDayText = "";
            vm.selectedStartTimeText = "";
            vm.selectedEndTimeText = "";

            vm.bookingStartTime = null;
            vm.bookingEndTime = null;
            vm.selectedEquipment = [];
            for(var i = 0; i < vm.equipmentTypes.length; ++i) {
                vm.selectedEquipment.push(
                    {equipmentType: vm.equipmentTypes[i], selected: false }
                    );
            }

            vm.user = Auth.getUser().then(function(user) {
                vm.user = user.data;
            });



            //vm.activeBooking = ActiveBooking.getActiveBooking();
            vm.activeBooking = function(){
                return ActiveBooking.activeBooking;
            };

            vm.setDayDropdownItems = function() {

                vm.dayDropdownItems = [];
                var d = new Date();

                for(var i = 0; i < 14; ++i) {
                    vm.dayDropdownItems.push(d.toDateString())
                    d.setMilliseconds(d.getMilliseconds() + 86400000);
                }
                vm.selectedDayText = vm.dayDropdownItems[0];
            };

            vm.setBookingStartTime = function() {
                vm.bookingStartTime = new Date(vm.selectedDayText + " " + vm.selectedStartTimeText);
            }

            vm.setBookingEndTime = function() {
                vm.bookingEndTime = new Date(vm.selectedDayText + " " + vm.selectedEndTimeText);
            }


            vm.setStartTimeDropdownItems = function() {
                var day = new Date(vm.selectedDayText);
                if(day.getDay() == 0 || day.getDay() == 6) {
                    vm.startTimeDropdownItems = ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
                }
                else {
                    vm.startTimeDropdownItems = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
                }
                vm.selectedStartTimeText = vm.startTimeDropdownItems[0];
                vm.setBookingStartTime();

            };

            vm.setEndTimeDropdownItems = function() {

                vm.endTimeDropdownItems = [];

                var maxHours = 0;
                var closeHour = 0;
                var startHour = vm.bookingStartTime.getHours();


                //staff/faculty
                if(vm.user.userType == "staff_faculty") {
                    maxHours = 3;
                }
                //student
                else {
                    maxHours = 1;
                }

                //If the booking start time is within 2 hours of the current time,
                //then allow the user to book for 1 extra hour
                var timeDiff = Math.abs(new Date() - vm.bookingStartTime);
                if(timeDiff < 7200000) {
                    maxHours += 1;
                }

                if(vm.bookingStartTime.getDay() == 0 || vm.bookingStartTime.getDay() == 6) {
                    closeHour = 18; //closes at 6pm
                }
                else {
                    closeHour = 22; //closes at 10pm
                }

                for(var i = 1; i <= maxHours && startHour+i <= closeHour; ++i) {
                    var endHour = startHour + i;
                    if(endHour > 12) {
                        endHour -= 12;
                        vm.endTimeDropdownItems.push(endHour + ":00 PM");
                    }
                    else if(endHour == 12) {
                        vm.endTimeDropdownItems.push(endHour + ":00 PM");
                    }
                    else {
                        vm.endTimeDropdownItems.push(endHour + ":00 AM");
                    }
                }

                vm.selectedEndTimeText = vm.endTimeDropdownItems[0];
                vm.setBookingEndTime();
            };

            vm.createBooking = function() {
                var equipment = [];
                for(var i = 0; i < vm.selectedEquipment.length; ++i) {
                    if(vm.selectedEquipment[i].selected) {
                        equipment.push(vm.selectedEquipment[i].equipmentType.toLowerCase());
                    }
                }
                
                quickBook.book(vm.bookingStartTime, vm.bookingEndTime, vm.user.username, equipment, function(data, error) {
                    vm.waitingForBooking = false;
                    if(error) {
                        vm.bookingError = error;
                    }
                    else {
                        vm.user.bookingID = data;
                        $window.location.href = '/main';
                    }
                });
                vm.waitingForBooking = true;
            };


            });