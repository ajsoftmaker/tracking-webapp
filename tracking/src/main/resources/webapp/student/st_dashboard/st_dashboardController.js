'use strict';

angular.module('trackingWebApp')
	.controller('dashboardController', stDashboardController);

function stDashboardController($scope, $rootScope, $state, dialogs, restAPIService){
	$scope.registeredcourses = 0;
	$scope.availableCourses = 0;
	$scope.testsPassed = 0;
	$scope.testsFailed = 0;
	
	$scope.courses = [];
	$scope.batches = [];
	$scope.coursesDetail = [];
	$scope.ongoingcourses = [];
	$scope.nextWeekCourses = [];
	$scope.doneCourses = [];
	var promise1 = restAPIService.studentService($rootScope.user.email + "/email").get();
	promise1.$promise.then(function(response) {
		$rootScope.user.studentID = response.id;
		getTestRecords();
		getCoursesRecords();
		getAllCourses();
	}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
	});
	
	function getTestRecords() {
		var promise = restAPIService.studentTestService($rootScope.user.studentID).query();
		promise.$promise.then(
			function(response) {
				for(var i=0;i<response.length;i++) {
					if(response[i].results == "pass") {
						$scope.testsPassed++;
					} else {
						$scope.testsFailed++;
					}
				}
			}, function(error) {
				dialogs.error("Error",error.data.error, {'size' : 'sm'});
		});
	}
	
	function getAllCourses() {
		var promise1 = restAPIService.coursesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.availableCourses = response.length;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getCoursesRecords() {
		var id = $rootScope.user.studentID + "/student";
		var promise1 = restAPIService.studentBatchService(id).query();
		promise1.$promise.then(
			function(response) {
				$scope.studentBatches = response
				var count = 0;
				for (var i = 0; i < $scope.studentBatches.length; i++) {
					var promise1 = restAPIService.batchService($scope.studentBatches[i].batchID).get();
					promise1.$promise.then(function(response1) {
						var batch = {};
						batch.startDate = response1.startDate;
						batch.endDate = response1.endDate;
						batch.courseID = response1.courseID;
						batch.batchID = response1.id;
						batch.state = response1.batchState;
						$scope.batches.push(batch);
						var promise1 = restAPIService.courseService(response1.courseID + "/id").get();
						promise1.$promise.then(function(response2) {
							var course = {};
							course.id = response2.id
							course.courseID = response2.courseID
							course.courseName = response2.courseName
							course.description = response2.description
							$scope.courses.push(course);
							count++;
							if ($scope.studentBatches.length == count) {
								groupCoursesByTimeline();
							}
					}, function(error) {
						dialogs.error("Error", error.data.error, {'size' : 'sm'});
					});
				}, function(error) {
					dialogs.error("Error", error.data.error, {'size' : 'sm'});
				});
			}
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	function groupCoursesByTimeline() {
		for (var i = 0; i < $scope.batches.length; i++) {
			var course = {};
			course.batchID = $scope.batches[i].batchID
			course.startDate = $scope.batches[i].startDate
			course.endDate = $scope.batches[i].endDate
			course.id = $scope.batches[i].courseID
			course.courseID = getCourseID($scope.batches[i].courseID)
			course.courseName = getCourseName($scope.batches[i].courseID)
			course.courseDescription = getCourseDescription($scope.batches[i].courseID)
			course.status = getStatus($scope.batches[i].batchID);
			course.state = $scope.batches[i].state;
			$scope.coursesDetail.push(course);
		}
		
		for (var j = 0; j < $scope.coursesDetail.length; j++) {
			var  startDate = parseDate($scope.coursesDetail[j].startDate);
			var today = new Date();
			today.setHours(0);
    		today.setMinutes(0);
    		today.setSeconds(0);
    		
    		var endDate = parseDate($scope.coursesDetail[j].endDate);
			var days = Math.round((endDate-today)/(1000*60*60*24));
			if(days>=0){
				if($scope.coursesDetail[j].state!="Setup Pending") {
					days = Math.round((startDate-today)/(1000*60*60*24));
					if(days <= 0) {
						$scope.ongoingcourses.push($scope.coursesDetail[j]);
					} else {
						$scope.nextWeekCourses.push($scope.coursesDetail[j]);
					}
				}
				
			} else {
				$scope.doneCourses.push($scope.coursesDetail[j]);
			}
		}
		
		$scope.registeredcourses = $scope.ongoingcourses.length + $scope.nextWeekCourses.length + $scope.doneCourses.length;
	 }
  
	
	function parseDate(s) {
		  var months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
		                jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
		  var p = s.split('-');
		  return new Date(p[2], months[p[1].toLowerCase()], p[0]);
		}
	function getCourseName(courseID) {
		for (var i = 0; i < $scope.courses.length; i++) {
			if ($scope.courses[i].id == courseID) {
				return $scope.courses[i].courseName
			}
		}
	}

	function getCourseID(courseID) {
		for (var i = 0; i < $scope.courses.length; i++) {
			if ($scope.courses[i].id == courseID) {
				return $scope.courses[i].courseID
			}
		}
	}
	
	function getCourseDescription(courseID) {
		for (var i = 0; i < $scope.courses.length; i++) {
			if ($scope.courses[i].id == courseID) {
				return $scope.courses[i].description
			}
		}
	}
	
	function getStatus(batchID) {
		for (var i = 0; i < $scope.studentBatches.length; i++) {
			if ($scope.studentBatches[i].batchID == batchID) {
				return $scope.studentBatches[i].status
			}
		}
	}
	
}
