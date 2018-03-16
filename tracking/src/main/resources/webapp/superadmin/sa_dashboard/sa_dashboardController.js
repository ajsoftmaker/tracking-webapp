'use strict';

angular.module('trackingWebApp')
	.controller('dashboardController', saDashboardController);

function saDashboardController($scope, $rootScope, $state, dialogs, restAPIService){
	$scope.numTenants = 0;
	$scope.numCourses = 0;
	$scope.numBatches = 0;
	$scope.numStudents = 0;
	$scope.notification = true;
	$rootScope.fromNotification = false;
	getAllTenants();
	getAllCourses();
	getAllBatches();
	getAllStudents();
	getAllBatchRequests();
	
	function blinker() {
	    $('.blink_me').fadeOut(500);
	    $('.blink_me').fadeIn(500);
	}
	setInterval(blinker, 1000);
	
	function getAllTenants() {
		var promise1 = restAPIService.tenantsService().query();
		promise1.$promise.then(
			function (response) {
				$scope.numTenants = response.length;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getAllCourses() {
		var promise1 = restAPIService.coursesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.numCourses = response.length;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getAllBatches() {
		var promise1 = restAPIService.batchesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.numBatches = response.length;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getAllStudents() {
		var promise1 = restAPIService.studentsService().query();
		promise1.$promise.then(
			function (response) {
				$scope.numStudents = response.length;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getAllBatchRequests() {
		var promise1 = restAPIService.batchRequestsService().query();
		promise1.$promise.then(
			function (response) {
				for(var i=0;i<response.length;i++) {
					if(response[i].notification==0 && response[i].requestStatus=="Pending") {
						$scope.notification = false;
						$rootScope.fromNotification = true;
					}
				}
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	$scope.requestBatch = function() {
		$state.go('home.samanagebatches');
	}
}
