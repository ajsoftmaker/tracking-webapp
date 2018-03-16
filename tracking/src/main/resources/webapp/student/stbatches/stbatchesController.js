'use strict';

angular.module('trackingWebApp').controller('stbatchesController',
		stbatchesController);

function stbatchesController($scope, $rootScope, $state, $filter, dialogs,
		restAPIService, DTOptionsBuilder,$timeout) {//
	$scope.courses = [];
	$scope.ongoingcourses = [];
	$scope.nextWeekCourses = [];
	$scope.doneCourses = [];
	$scope.batches = [];
	$scope.coursesDetail = [];
	$scope.tests = [];
	 $timeout(function () {
		 if($scope.ongoingcourses.length < 10) {
			 $('#stOngoingcoursesDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.nextWeekCourses.length < 10) {
			 $('#stNextWeekCoursesDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.doneCourses.length < 10) {
			 $('#stDoneCoursesDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	
	$scope.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('paging', false).withOption('searching', false)
			.withOption('bInfo', false).withOption('orderable', false);

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

	$scope.onContinueCourse = function(course) {
		var promise1 = restAPIService.testService(course.id).query();
		promise1.$promise.then(
			function(response) {
				$scope.tests = response
					if(course.status == "") {
						assignTestForStudent(course);
					}
					$state.go('home.stcontinuebatch', {batchID : course.batchID, 
													   courseID : course.id, 
													   studentID : $rootScope.user.studentID});
			}, function(error) {
				dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
		
	}
	
	function assignTestForStudent(course){
		for (var i = 0; i < $scope.tests.length; i++) {
			var studentTest = {};
			studentTest.studentID = $rootScope.user.studentID;
			studentTest.testID = $scope.tests[i].id;
			studentTest.status = "Not Taken";
			studentTest.results = "";
						
			var promise = restAPIService.studentTestsService().save(studentTest);
			promise.$promise.then(
				function(response1) {
					for (var j = 0; j < $scope.studentBatches.length; j++) {
						if ($scope.studentBatches[j].batchID == course.batchID && 
							$scope.studentBatches[j].studentID == $rootScope.user.studentID) {
							$scope.studentBatches[j].status = "start";
							
							var promise = restAPIService.studentBatchesService().update($scope.studentBatches[j]);
							promise.$promise.then(
								function(response) {
								},function(error) {
									dialogs.error("Error",error.data.error,{'size' : 'sm'});
							});
						}
					}
				},function(error) {
					dialogs.error("Error",error.data.error,{'size' : 'sm'});
			});
		}
	}
}
