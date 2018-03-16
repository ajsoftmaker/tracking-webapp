'use strict';

angular.module('trackingWebApp')
	.controller('viewcoursedetailController', viewcoursedetailController);

function viewcoursedetailController($scope, $rootScope, $state, $filter, dialogs, restAPIService, $location, $stateParams){
	$scope.course = [];
	$scope.tests = [];
	$scope.files = [];
	var courseID = $stateParams.ID;
	
	getCourseDetail();
	
	function getCourseDetail() {
		var promise1 = restAPIService.courseService(courseID).get();
		promise1.$promise.then(
			function (response) {
				$scope.course=response;
				if($scope.course.customerID=="" || $scope.course.customerID==null) {
					$scope.course.customerID = "All";
				}
				getTestDetail($scope.course.id);
				getFileDetail($scope.course.id);
		    },
		    function(error){
		    	dialogs.error("Error", error.status + " " + error.statusText, {'size': 'sm' });
		    }
		);
	}
	
	function getTestDetail(id) {
		var promise2 = restAPIService.testService(id).query();
		promise2.$promise.then(
			function (response) {
				$scope.tests=response;
		    },
		    function(error){
		    	dialogs.error("Error", error.status + " " + error.statusText, {'size': 'sm' });
		    }
		);
	}
	
	function getFileDetail(id) {
		var promise2 = restAPIService.fileService(id).query();
		promise2.$promise.then(
			function (response) {
				$scope.files=response;
		    },
		    function(error){
		    	dialogs.error("Error", error.status + " " + error.statusText, {'size': 'sm' });
		    }
		);
	}
	
	$scope.onBack = function() {
		if($rootScope.user.userRole=="superadmin"){
			$state.go("home.samanagecourses");
		} else {
			if($rootScope.user.userRole=="student"){
				$state.go("home.stviewcourses");
			}else {
				$state.go("home.taviewcourses");
			}
		}
	}
}
